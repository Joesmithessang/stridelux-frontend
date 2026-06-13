import api from './api';
import { USE_MOCK } from '../config/aws-config';
import mockProducts from '../data/products';

const STORAGE_KEY = 'stridelux_mock_products';

function getProductStore() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return [...mockProducts];
}

function saveProductStore(products) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch {}
}

export const productService = {
  async getAll(filters = {}) {
    if (USE_MOCK) {
      let result = getProductStore();
      if (filters.category && filters.category !== 'All') {
        result = result.filter((p) => p.category === filters.category);
      }
      if (filters.brand && filters.brand !== 'All') {
        result = result.filter((p) => p.brand === filters.brand);
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        result = result.filter(
          (p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
        );
      }
      if (filters.inStock) result = result.filter((p) => p.inStock !== false);
      if (filters.sort === 'price_asc') result.sort((a, b) => a.price - b.price);
      if (filters.sort === 'price_desc') result.sort((a, b) => b.price - a.price);
      if (filters.sort === 'newest') result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return result;
    }
    return api.get('/products', { params: filters });
  },

  async getById(id) {
    if (USE_MOCK) {
      const product = getProductStore().find((p) => p.id === id);
      if (!product) throw new Error('Product not found');
      return product;
    }
    return api.get(`/products/${id}`);
  },

  async create(data) {
    if (USE_MOCK) {
      const products = getProductStore();
      const product = { ...data, id: `prod-${Date.now()}`, createdAt: new Date().toISOString() };
      products.push(product);
      saveProductStore(products);
      return product;
    }
    return api.post('/products', data);
  },

  async update(id, data) {
    if (USE_MOCK) {
      const products = getProductStore();
      const idx = products.findIndex((p) => p.id === id);
      if (idx === -1) throw new Error('Product not found');
      products[idx] = { ...products[idx], ...data };
      saveProductStore(products);
      return products[idx];
    }
    return api.put(`/products/${id}`, data);
  },

  async delete(id) {
    if (USE_MOCK) {
      const products = getProductStore();
      const idx = products.findIndex((p) => p.id === id);
      if (idx !== -1) products.splice(idx, 1);
      saveProductStore(products);
      return { success: true };
    }
    return api.delete(`/products/${id}`);
  },
};
