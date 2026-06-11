import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiDollarSign, FiPackage, FiShoppingBag, FiClock, FiArrowRight, FiTrendingUp } from 'react-icons/fi';
import { adminService } from '../../services/adminService';
import LoadingSpinner from '../../components/LoadingSpinner';

const STATUS_COLORS = {
  pending: 'status-pending', processing: 'status-processing',
  shipped: 'status-shipped', delivered: 'status-delivered', cancelled: 'status-cancelled',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getDashboardStats()
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="admin-loading"><LoadingSpinner /></div>;
  if (!stats)  return (
    <div className="admin-loading">
      <p style={{ color: '#888', textAlign: 'center' }}>
        Dashboard data unavailable. The API may not be reachable.
      </p>
    </div>
  );

  const STAT_CARDS = [
    { icon: <FiDollarSign />, label: 'Total Revenue', value: `$${Number(stats.totalRevenue).toLocaleString()}`, color: 'stat-green' },
    { icon: <FiPackage />, label: 'Total Orders', value: stats.totalOrders, color: 'stat-blue' },
    { icon: <FiShoppingBag />, label: 'Products', value: stats.totalProducts, color: 'stat-orange' },
    { icon: <FiClock />, label: 'Pending Orders', value: stats.pendingOrders, color: 'stat-yellow' },
  ];

  return (
    <div className="admin-dashboard">
      <div className="admin-page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back. Here's what's happening today.</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="admin-stat-grid">
        {STAT_CARDS.map((card) => (
          <div key={card.label} className={`admin-stat-card ${card.color}`}>
            <div className="stat-card-icon">{card.icon}</div>
            <div>
              <p className="stat-card-label">{card.label}</p>
              <p className="stat-card-value">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-dashboard-grid">
        {/* Revenue chart */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3><FiTrendingUp /> Monthly Revenue</h3>
          </div>
          <div className="revenue-chart">
            {stats.monthlySales.map((m) => {
              const maxRev = Math.max(...stats.monthlySales.map((x) => x.revenue));
              const height = maxRev > 0 ? (m.revenue / maxRev) * 100 : 0;
              return (
                <div key={m.month} className="bar-group">
                  <span className="bar-value">${(m.revenue / 1000).toFixed(1)}k</span>
                  <div className="bar" style={{ height: `${height}%` }} />
                  <span className="bar-label">{m.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent orders */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3><FiPackage /> Recent Orders</h3>
            <Link to="/admin/orders" className="admin-card-link">View all <FiArrowRight /></Link>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr key={order.orderId}>
                    <td className="order-id-cell">{order.orderId}</td>
                    <td>{order.customerName || order.shippingInfo?.fullName || 'Guest'}</td>
                    <td>${order.total?.toFixed(2)}</td>
                    <td>
                      <span className={`admin-status ${STATUS_COLORS[order.status] || ''}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top products */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3><FiShoppingBag /> Top Products</h3>
            <Link to="/admin/products" className="admin-card-link">Manage <FiArrowRight /></Link>
          </div>
          <div className="top-products-list">
            {stats.topProducts.map((p, i) => (
              <div key={p.id} className="top-product-row">
                <span className="rank">#{i + 1}</span>
                <img src={p.thumbnail || p.image} alt={p.name} onError={(e) => { e.target.style.opacity = '0.3'; }} />
                <div className="top-product-info">
                  <p>{p.name}</p>
                  <p className="top-product-brand">{p.brand}</p>
                </div>
                <div className="top-product-stats">
                  <span>${p.price}</span>
                  <span className="units-sold">{p.sold} sold</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
