import api from './api';
import { USE_MOCK } from '../config/aws-config';

let mockProfile = null;

export const userService = {
  async getProfile() {
    if (USE_MOCK) {
      try { return JSON.parse(localStorage.getItem('mock_user') || 'null'); } catch { return null; }
    }
    return api.get('/users/me');
  },

  async updateProfile(data) {
    if (USE_MOCK) {
      const current = JSON.parse(localStorage.getItem('mock_user') || '{}');
      const updated = { ...current, ...data };
      localStorage.setItem('mock_user', JSON.stringify(updated));
      mockProfile = updated;
      return updated;
    }
    return api.put('/users/me', data);
  },

  async getAddresses() {
    if (USE_MOCK) return JSON.parse(localStorage.getItem('mock_addresses') || '[]');
    return api.get('/users/me/addresses');
  },

  async saveAddress(address) {
    if (USE_MOCK) {
      const addresses = JSON.parse(localStorage.getItem('mock_addresses') || '[]');
      const updated = [...addresses, { ...address, id: `addr-${Date.now()}` }];
      localStorage.setItem('mock_addresses', JSON.stringify(updated));
      return updated;
    }
    return api.post('/users/me/addresses', address);
  },
};
