import api from './api';
import { USE_MOCK } from '../config/aws-config';

const MOCK_WISHLISTS = {};

// GET /wishlist returns [{productId, product:{...}}] — extract the product object
const toWishlistItem = (s) => s.product || { id: s.productId };

export const wishlistService = {
  async get(userId) {
    if (USE_MOCK) return MOCK_WISHLISTS[userId] || [];
    const items = await api.get('/wishlist');
    return (items || []).map(toWishlistItem);
  },

  // POST /wishlist — body: {productId} only; backend does BatchGetItem for product details
  async addItem(userId, product) {
    if (USE_MOCK) {
      const list = MOCK_WISHLISTS[userId] || [];
      if (!list.find((i) => i.id === product.id)) list.push(product);
      MOCK_WISHLISTS[userId] = list;
      return list;
    }
    return api.post('/wishlist', { productId: product.id });
  },

  // DELETE /wishlist/{productId}
  async removeItem(userId, productId) {
    if (USE_MOCK) {
      MOCK_WISHLISTS[userId] = (MOCK_WISHLISTS[userId] || []).filter((i) => i.id !== productId);
      return MOCK_WISHLISTS[userId];
    }
    return api.delete(`/wishlist/${productId}`);
  },

  async clear(userId) {
    if (USE_MOCK) { MOCK_WISHLISTS[userId] = []; return []; }
    return api.delete('/wishlist');
  },
};
