import api from './api';
import { USE_MOCK } from '../config/aws-config';

const MOCK_CARTS = {};

export const cartService = {
  async get(userId) {
    if (USE_MOCK) return MOCK_CARTS[userId] || [];
    return api.get('/cart');
  },

  async sync(userId, items) {
    if (USE_MOCK) { MOCK_CARTS[userId] = items; return items; }
    return api.put('/cart', { items });
  },

  async addItem(userId, item) {
    if (USE_MOCK) {
      const cart = MOCK_CARTS[userId] || [];
      const existing = cart.find((i) => i.cartItemId === item.cartItemId);
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        cart.push(item);
      }
      MOCK_CARTS[userId] = cart;
      return cart;
    }
    return api.post('/cart/items', item);
  },

  async removeItem(userId, cartItemId) {
    if (USE_MOCK) {
      MOCK_CARTS[userId] = (MOCK_CARTS[userId] || []).filter((i) => i.cartItemId !== cartItemId);
      return MOCK_CARTS[userId];
    }
    return api.delete(`/cart/items/${cartItemId}`);
  },

  async clear(userId) {
    if (USE_MOCK) { MOCK_CARTS[userId] = []; return []; }
    return api.delete('/cart');
  },
};
