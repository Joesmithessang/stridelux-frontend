import api from './api';
import { USE_MOCK } from '../config/aws-config';

const MOCK_CARTS = {};

// Map backend item format → frontend CartItem format
const toCartItem = (s) => ({
  cartItemId: `${s.productId}-${s.size}`,
  id: s.productId,
  name: s.product?.name || '',
  category: s.product?.category || '',
  brand: s.product?.brand || '',
  price: s.product?.price || 0,
  image: s.product?.thumbnail || s.product?.image || '',
  selectedSize: s.size,
  quantity: s.quantity,
});

export const cartService = {
  async get(userId) {
    if (USE_MOCK) return MOCK_CARTS[userId] || [];
    const items = await api.get('/cart');
    return (items || []).map(toCartItem);
  },

  // POST /cart — {productId, size, quantity} where quantity is the NEW TOTAL, not a delta
  async addItem(userId, item) {
    if (USE_MOCK) {
      const cart = MOCK_CARTS[userId] || [];
      const existing = cart.find((i) => i.cartItemId === item.cartItemId);
      if (existing) {
        existing.quantity = item.quantity; // item.quantity is already the new total
      } else {
        cart.push(item);
      }
      MOCK_CARTS[userId] = cart;
      return cart;
    }
    return api.post('/cart', {
      productId: item.id,
      size: item.selectedSize,
      quantity: item.quantity,
    });
  },

  // PUT /cart/{productId} — {size, quantity}; size in body because it's part of the sort key
  async updateQuantity(userId, productId, size, quantity) {
    if (USE_MOCK) {
      const cart = MOCK_CARTS[userId] || [];
      const item = cart.find((i) => i.cartItemId === `${productId}-${size}`);
      if (item) item.quantity = quantity;
      MOCK_CARTS[userId] = cart;
      return cart;
    }
    return api.put(`/cart/${productId}`, { size, quantity });
  },

  // DELETE /cart/{productId}?size= — removes one line
  async removeItem(userId, productId, size) {
    if (USE_MOCK) {
      MOCK_CARTS[userId] = (MOCK_CARTS[userId] || []).filter(
        (i) => i.cartItemId !== `${productId}-${size}`
      );
      return MOCK_CARTS[userId];
    }
    return api.delete(`/cart/${productId}`, { params: { size } });
  },

  // DELETE /cart — BatchWriteItem delete, used after successful order
  async clear(userId) {
    if (USE_MOCK) { MOCK_CARTS[userId] = []; return []; }
    return api.delete('/cart');
  },
};
