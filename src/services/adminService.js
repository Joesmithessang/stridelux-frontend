import api from './api';
import { USE_MOCK } from '../config/aws-config';
import { allOrdersAdmin } from '../data/mockOrders';
import mockProducts from '../data/products';
import { mockCustomers, mockEmployees } from '../data/mockUsers';

const EMPLOYEE_STORAGE_KEY = 'stridelux_mock_employees';

function getEmployeeStore() {
  try {
    const stored = localStorage.getItem(EMPLOYEE_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return [...mockEmployees];
}

function saveEmployeeStore(employees) {
  try {
    localStorage.setItem(EMPLOYEE_STORAGE_KEY, JSON.stringify(employees));
  } catch {}
}

export const adminService = {
  async getDashboardStats() {
    if (USE_MOCK) {
      const totalRevenue = allOrdersAdmin
        .filter((o) => o.paymentStatus === 'paid')
        .reduce((sum, o) => sum + o.total, 0);
      return {
        totalRevenue: totalRevenue.toFixed(2),
        totalOrders: allOrdersAdmin.length,
        totalProducts: mockProducts.length,
        pendingOrders: allOrdersAdmin.filter((o) => o.status === 'pending').length,
        recentOrders: allOrdersAdmin.slice(0, 5),
        monthlySales: [
          { month: 'Jan', revenue: 0 },
          { month: 'Feb', revenue: 190.80 },
          { month: 'Mar', revenue: 308.15 },
          { month: 'Apr', revenue: 0 },
          { month: 'May', revenue: 0 },
          { month: 'Jun', revenue: 0 },
        ],
        topProducts: mockProducts.slice(0, 5).map((p) => ({
          ...p,
          sold: Math.floor(Math.random() * 50) + 10,
        })),
      };
    }
    return api.get('/admin/dashboard');
  },

  async getReports(range = '30d') {
    if (USE_MOCK) {
      const paid = allOrdersAdmin.filter((o) => o.paymentStatus === 'paid');
      const revenue = paid.reduce((sum, o) => sum + o.total, 0);
      return {
        range,
        revenue: revenue.toFixed(2),
        orders: allOrdersAdmin.length,
        averageOrderValue: paid.length ? (revenue / paid.length).toFixed(2) : '0.00',
        transactions: allOrdersAdmin,
      };
    }
    return api.get('/admin/reports', { params: { range } });
  },

  async getUsers() {
    if (USE_MOCK) {
      return { customers: mockCustomers, employees: getEmployeeStore() };
    }
    return api.get('/admin/users');
  },

  async createEmployee(data) {
    if (USE_MOCK) {
      const employees = getEmployeeStore();
      const employee = { ...data, id: `emp-${Date.now()}`, joinedAt: new Date().toISOString() };
      employees.push(employee);
      saveEmployeeStore(employees);
      return employee;
    }
    return api.post('/admin/employees', data);
  },

  async updateEmployee(id, data) {
    if (USE_MOCK) {
      const employees = getEmployeeStore();
      const idx = employees.findIndex((e) => e.id === id);
      if (idx === -1) throw new Error('Employee not found');
      employees[idx] = { ...employees[idx], ...data };
      saveEmployeeStore(employees);
      return employees[idx];
    }
    return api.put(`/admin/employees/${id}`, data);
  },

  async deleteEmployee(id) {
    if (USE_MOCK) {
      const employees = getEmployeeStore();
      const idx = employees.findIndex((e) => e.id === id);
      if (idx !== -1) employees.splice(idx, 1);
      saveEmployeeStore(employees);
      return { success: true };
    }
    return api.delete(`/admin/employees/${id}`);
  },
};
