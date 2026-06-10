import { useState, useEffect } from 'react';
import { FiSearch, FiX, FiChevronDown, FiEye } from 'react-icons/fi';
import { orderService } from '../../services/orderService';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const STATUSES = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const STATUS_COLORS = {
  pending: 'status-pending', processing: 'status-processing',
  shipped: 'status-shipped', delivered: 'status-delivered', cancelled: 'status-cancelled',
};

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [detailOrder, setDetailOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const load = () => {
    orderService.getAll({}).then((data) => {
      setOrders(data);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await orderService.updateStatus(orderId, newStatus);
      setOrders((prev) => prev.map((o) => o.orderId === orderId ? { ...o, status: newStatus } : o));
      if (detailOrder?.orderId === orderId) setDetailOrder((o) => ({ ...o, status: newStatus }));
      toast.success('Order status updated');
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = orders.filter((o) => {
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const customer = o.customerName || o.shippingInfo?.fullName || '';
    const matchesSearch = o.orderId.toLowerCase().includes(search.toLowerCase()) ||
      customer.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Orders</h1>
          <p>{orders.length} total orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-filters-row">
        <div className="admin-search-bar">
          <FiSearch />
          <input placeholder="Search by order ID or customer…" value={search} onChange={(e) => setSearch(e.target.value)} />
          {search && <button onClick={() => setSearch('')}><FiX /></button>}
        </div>
        <div className="status-filter-tabs">
          {STATUSES.map((s) => (
            <button
              key={s}
              className={`status-tab ${statusFilter === s ? 'active' : ''}`}
              onClick={() => setStatusFilter(s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="admin-loading"><LoadingSpinner /></div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.orderId}>
                  <td className="order-id-cell">{order.orderId}</td>
                  <td>
                    <div>
                      <p>{order.customerName || order.shippingInfo?.fullName || 'Guest'}</p>
                      <p className="cell-sub">{order.customerEmail || order.shippingInfo?.email}</p>
                    </div>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</td>
                  <td>${order.total?.toFixed(2)}</td>
                  <td>
                    <div className="status-select-wrap">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                        className={`status-select ${STATUS_COLORS[order.status] || ''}`}
                        disabled={updatingId === order.orderId}
                      >
                        {STATUSES.filter((s) => s !== 'all').map((s) => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                      <FiChevronDown className="select-chevron" />
                    </div>
                  </td>
                  <td>
                    <button className="action-btn" onClick={() => setDetailOrder(order)} title="View details">
                      <FiEye />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="admin-empty">No orders match the current filters.</div>
          )}
        </div>
      )}

      {/* Order detail drawer */}
      {detailOrder && (
        <div className="admin-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setDetailOrder(null); }}>
          <div className="admin-modal admin-modal-lg">
            <div className="admin-modal-header">
              <h2>Order {detailOrder.orderId}</h2>
              <button className="modal-close-btn" onClick={() => setDetailOrder(null)}><FiX /></button>
            </div>
            <div className="order-detail-body">
              <div className="order-detail-row">
                <div className="order-detail-section">
                  <h4>Customer</h4>
                  <p>{detailOrder.customerName || detailOrder.shippingInfo?.fullName}</p>
                  <p>{detailOrder.customerEmail || detailOrder.shippingInfo?.email}</p>
                  <p>{detailOrder.shippingInfo?.phone}</p>
                </div>
                <div className="order-detail-section">
                  <h4>Shipping Address</h4>
                  <p>{detailOrder.shippingInfo?.address}</p>
                  <p>{detailOrder.shippingInfo?.city}, {detailOrder.shippingInfo?.state} {detailOrder.shippingInfo?.postalCode}</p>
                  <p>{detailOrder.shippingInfo?.country}</p>
                </div>
                <div className="order-detail-section">
                  <h4>Payment</h4>
                  <p>Status: <strong>{detailOrder.paymentStatus}</strong></p>
                  <p>Method: {detailOrder.shippingMethod}</p>
                  <p>Total: <strong>${detailOrder.total?.toFixed(2)}</strong></p>
                </div>
              </div>
              <h4 style={{ margin: '1rem 0 0.5rem' }}>Items</h4>
              {detailOrder.items?.map((item) => (
                <div key={item.productId + item.size} className="review-item">
                  <img src={item.image} alt={item.name} onError={(e) => { e.target.style.opacity = '0.3'; }} />
                  <div>
                    <p>{item.name}</p>
                    <p className="review-item-meta">Size {item.size} · Qty {item.quantity}</p>
                  </div>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="order-detail-totals">
                <div className="summary-row"><span>Subtotal</span><span>${detailOrder.subtotal?.toFixed(2)}</span></div>
                <div className="summary-row"><span>Shipping</span><span>${detailOrder.shippingCost?.toFixed(2)}</span></div>
                <div className="summary-row"><span>Tax</span><span>${detailOrder.tax?.toFixed(2)}</span></div>
                <div className="summary-row summary-total"><span>Total</span><span>${detailOrder.total?.toFixed(2)}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
