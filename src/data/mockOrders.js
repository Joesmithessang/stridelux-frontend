const mockOrders = [
  {
    orderId: 'ORD-2024-0042',
    status: 'delivered',
    items: [
      { productId: 'prod-001', name: 'Air Jordan 4 Retro Black Cat', price: 210, size: '10', quantity: 1, image: '/images/jordan-4.jpg' },
      { productId: 'prod-004', name: 'Jordan Jumpman Classic Cap', price: 45, size: 'One Size', quantity: 1, image: '/images/jordan-cap.png' },
    ],
    shippingInfo: { fullName: 'Demo Customer', email: 'customer@test.com', phone: '+1 (416) 555-0001', address: '123 Main St', city: 'Toronto', state: 'ON', postalCode: 'M5V 1A1', country: 'Canada' },
    shippingMethod: 'express',
    shippingCost: 20,
    subtotal: 255,
    tax: 33.15,
    total: 308.15,
    paymentStatus: 'paid',
    createdAt: '2024-03-10T14:22:00Z',
  },
];

export const allOrdersAdmin = [
  ...mockOrders,
  {
    orderId: 'ORD-2024-0030',
    userId: 'usr-001',
    customerName: 'Alex Turner',
    customerEmail: 'alex.turner@email.com',
    status: 'delivered',
    items: [{ productId: 'prod-002', name: 'Nike Air Max 270', price: 160, size: '9', quantity: 1, image: '/images/air-max-270.png' }],
    shippingInfo: { fullName: 'Alex Turner', email: 'alex.turner@email.com', phone: '+1 416-555-0123', address: '456 Queen St W', city: 'Toronto', state: 'ON', postalCode: 'M6J 1E5', country: 'Canada' },
    shippingMethod: 'standard',
    shippingCost: 10,
    subtotal: 160,
    tax: 20.80,
    total: 190.80,
    paymentStatus: 'paid',
    createdAt: '2024-02-28T11:30:00Z',
  },
];

export default mockOrders;
