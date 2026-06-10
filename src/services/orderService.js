import api from './api';
import { USE_MOCK } from '../config/aws-config';
import mockOrders, { allOrdersAdmin } from '../data/mockOrders';

const mockOrderStore = [...mockOrders];
const adminOrderStore = [...allOrdersAdmin];

export const orderService = {
  async create(orderData) {
    if (USE_MOCK) {
      const order = {
        ...orderData,
        orderId: `ORD-${Date.now()}`,
        status: 'pending',
        paymentStatus: 'paid',
        createdAt: new Date().toISOString(),
      };
      mockOrderStore.unshift(order);
      adminOrderStore.unshift(order);
      return order;
    }
    return api.post('/orders', orderData);
  },

  async getMyOrders() {
    if (USE_MOCK) return mockOrderStore;
    return api.get('/orders');
  },

  async getById(orderId) {
    if (USE_MOCK) {
      const order = adminOrderStore.find((o) => o.orderId === orderId);
      if (!order) throw new Error('Order not found');
      return order;
    }
    return api.get(`/orders/${orderId}`);
  },

  // Admin only
  async getAll(filters = {}) {
    if (USE_MOCK) {
      let result = [...adminOrderStore];
      if (filters.status) result = result.filter((o) => o.status === filters.status);
      return result;
    }
    return api.get('/admin/orders', { params: filters });
  },

  async updateStatus(orderId, status) {
    if (USE_MOCK) {
      const order = adminOrderStore.find((o) => o.orderId === orderId);
      if (order) order.status = status;
      return order;
    }
    return api.put(`/admin/orders/${orderId}/status`, { status });
  },
};
