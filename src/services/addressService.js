import api from './api';
import { USE_MOCK } from '../config/aws-config';

const STORAGE_KEY = 'stridelux_mock_addresses';

function getStore() {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (s) return JSON.parse(s);
  } catch {}
  return [];
}

function saveStore(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
}

export const addressService = {
  async getAll() {
    if (USE_MOCK) return getStore();
    return api.get('/users/me/addresses');
  },

  async save(shippingInfo) {
    if (!shippingInfo?.address) return null;
    if (USE_MOCK) {
      const store = getStore();
      const dupe = store.some(
        (a) => a.address === shippingInfo.address && a.postalCode === shippingInfo.postalCode
      );
      if (dupe) return null;
      const entry = {
        addressId: `addr-${Date.now()}`,
        fullName: shippingInfo.fullName || '',
        address: shippingInfo.address,
        city: shippingInfo.city || '',
        state: shippingInfo.state || '',
        postalCode: shippingInfo.postalCode || '',
        country: shippingInfo.country || 'Canada',
        phone: shippingInfo.phone || '',
        createdAt: new Date().toISOString(),
      };
      store.unshift(entry);
      if (store.length > 5) store.splice(5);
      saveStore(store);
      return entry;
    }
    return api.post('/users/me/addresses', shippingInfo);
  },

  async update(addressId, data) {
    if (USE_MOCK) {
      const store = getStore();
      const idx = store.findIndex((a) => a.addressId === addressId);
      if (idx === -1) throw new Error('Address not found');
      store[idx] = { ...store[idx], ...data, updatedAt: new Date().toISOString() };
      saveStore(store);
      return store[idx];
    }
    return api.put(`/users/me/addresses/${addressId}`, data);
  },

  async delete(addressId) {
    if (USE_MOCK) {
      saveStore(getStore().filter((a) => a.addressId !== addressId));
      return { success: true };
    }
    return api.delete(`/users/me/addresses/${addressId}`);
  },
};
