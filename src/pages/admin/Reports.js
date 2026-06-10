import { useState, useEffect } from 'react';
import { FiDollarSign, FiPackage, FiTrendingUp, FiDownload } from 'react-icons/fi';
import { adminService } from '../../services/adminService';
import LoadingSpinner from '../../components/LoadingSpinner';

const RANGES = [
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '90d', label: 'Last 90 Days' },
  { value: '1y', label: 'Last Year' },
];

const STATUS_COLORS = {
  pending: 'status-pending', processing: 'status-processing',
  shipped: 'status-shipped', delivered: 'status-delivered', cancelled: 'status-cancelled',
};

export default function Reports() {
  const [range, setRange] = useState('30d');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    adminService.getReports(range).then((d) => { setData(d); setLoading(false); });
  }, [range]);

  if (loading) return <div className="admin-loading"><LoadingSpinner /></div>;

  const SUMMARY = [
    { icon: <FiDollarSign />, label: 'Total Revenue', value: `$${Number(data.revenue).toLocaleString('en-CA', { minimumFractionDigits: 2 })}`, color: 'stat-green' },
    { icon: <FiPackage />, label: 'Total Orders', value: data.orders, color: 'stat-blue' },
    { icon: <FiTrendingUp />, label: 'Avg. Order Value', value: `$${Number(data.averageOrderValue).toFixed(2)}`, color: 'stat-orange' },
  ];

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Reports</h1>
          <p>Sales and transaction history</p>
        </div>
        <div className="report-controls">
          <div className="range-tabs">
            {RANGES.map((r) => (
              <button
                key={r.value}
                className={`range-tab ${range === r.value ? 'active' : ''}`}
                onClick={() => setRange(r.value)}
              >
                {r.label}
              </button>
            ))}
          </div>
          <button className="btn btn-outline btn-sm">
            <FiDownload /> Export CSV
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="admin-stat-grid">
        {SUMMARY.map((s) => (
          <div key={s.label} className={`admin-stat-card ${s.color}`}>
            <div className="stat-card-icon">{s.icon}</div>
            <div>
              <p className="stat-card-label">{s.label}</p>
              <p className="stat-card-value">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Transaction table */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3>Transaction History</h3>
          <span>{data.transactions?.length} transactions</span>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Items</th>
                <th>Shipping</th>
                <th>Tax</th>
                <th>Total</th>
                <th>Status</th>
                <th>Payment</th>
              </tr>
            </thead>
            <tbody>
              {data.transactions?.map((order) => (
                <tr key={order.orderId}>
                  <td className="order-id-cell">{order.orderId}</td>
                  <td>
                    <div>
                      <p>{order.customerName || order.shippingInfo?.fullName || 'Guest'}</p>
                      <p className="cell-sub">{order.customerEmail || order.shippingInfo?.email}</p>
                    </div>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>{order.items?.length}</td>
                  <td>${order.shippingCost?.toFixed(2)}</td>
                  <td>${order.tax?.toFixed(2)}</td>
                  <td><strong>${order.total?.toFixed(2)}</strong></td>
                  <td>
                    <span className={`admin-status ${STATUS_COLORS[order.status] || ''}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <span className={`admin-status ${order.paymentStatus === 'paid' ? 'status-delivered' : 'status-pending'}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
