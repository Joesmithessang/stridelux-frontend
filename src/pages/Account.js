import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  FiPackage, FiHeart, FiMapPin, FiSettings, FiLogOut,
  FiUser, FiChevronRight, FiTruck, FiCheck, FiClock, FiX,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const STATUS_CONFIG = {
  pending:    { label: 'Pending',    icon: <FiClock />,   color: 'status-pending' },
  processing: { label: 'Processing', icon: <FiClock />,   color: 'status-processing' },
  shipped:    { label: 'Shipped',    icon: <FiTruck />,   color: 'status-shipped' },
  delivered:  { label: 'Delivered',  icon: <FiCheck />,   color: 'status-delivered' },
  cancelled:  { label: 'Cancelled',  icon: <FiX />,       color: 'status-cancelled' },
};

const NAV_ITEMS = [
  { key: 'orders',   label: 'Orders',           icon: <FiPackage /> },
  { key: 'wishlist', label: 'Wishlist',          icon: <FiHeart /> },
  { key: 'addresses',label: 'Addresses',         icon: <FiMapPin /> },
  { key: 'settings', label: 'Account Settings',  icon: <FiSettings /> },
];

export default function Account() {
  const { userAttributes, isGuest, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [profileForm, setProfileForm] = useState({ name: '', phone: '' });

  useEffect(() => {
    if (isGuest) { navigate('/login'); return; }
    setProfileForm({ name: userAttributes?.name || '', phone: userAttributes?.phone_number || '' });
    orderService.getMyOrders().then((data) => {
      setOrders(data);
      setLoadingOrders(false);
    });
  }, [isGuest, userAttributes, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const initials = userAttributes?.name
    ? userAttributes.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  if (isGuest) return null;

  return (
    <main className="account-page">
      <div className="section-container">
        <div className="account-layout">
          {/* ── Sidebar ── */}
          <aside className="account-sidebar">
            <div className="account-profile-card">
              <div className="account-avatar">{initials}</div>
              <div>
                <h3>{userAttributes?.name}</h3>
                <p>{userAttributes?.email}</p>
                {isAdmin && (
                  <span className="admin-badge">Admin</span>
                )}
              </div>
            </div>

            <nav className="account-nav">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.key}
                  className={`account-nav-item ${activeTab === item.key ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.key)}
                >
                  {item.icon}
                  {item.label}
                  <FiChevronRight className="nav-chevron" />
                </button>
              ))}
              {isAdmin && (
                <Link to="/admin" className="account-nav-item admin-nav-item">
                  <FiSettings /> Admin Dashboard <FiChevronRight className="nav-chevron" />
                </Link>
              )}
              <button className="account-nav-item logout-nav-item" onClick={handleLogout}>
                <FiLogOut /> Sign Out <FiChevronRight className="nav-chevron" />
              </button>
            </nav>
          </aside>

          {/* ── Main content ── */}
          <div className="account-main">

            {/* Orders tab */}
            {activeTab === 'orders' && (
              <div className="account-section">
                <h2>Order History</h2>
                {loadingOrders ? (
                  <LoadingSpinner />
                ) : orders.length === 0 ? (
                  <div className="empty-state">
                    <p>No orders yet.</p>
                    <Link to="/shop" className="btn btn-primary btn-sm">Start Shopping</Link>
                  </div>
                ) : (
                  <div className="orders-list">
                    {orders.map((order) => {
                      const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                      return (
                        <div key={order.orderId} className="order-card">
                          <div className="order-card-header">
                            <div>
                              <p className="order-id">{order.orderId}</p>
                              <p className="order-date">{new Date(order.createdAt).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>
                            <div className={`order-status ${cfg.color}`}>
                              {cfg.icon} {cfg.label}
                            </div>
                          </div>
                          <div className="order-items-preview">
                            {order.items.map((item) => (
                              <div key={item.productId + item.size} className="order-item-row">
                                <img src={item.image} alt={item.name} onError={(e) => { e.target.style.opacity='0.3'; }} />
                                <div>
                                  <p>{item.name}</p>
                                  <p className="order-item-meta">Size {item.size} · Qty {item.quantity}</p>
                                </div>
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                          <div className="order-card-footer">
                            <span>Total: <strong>${order.total.toFixed(2)}</strong></span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Wishlist tab */}
            {activeTab === 'wishlist' && (
              <div className="account-section">
                <h2>My Wishlist</h2>
                <p className="account-hint">
                  View your saved items on the <Link to="/wishlist">Wishlist page</Link>.
                </p>
              </div>
            )}

            {/* Addresses tab */}
            {activeTab === 'addresses' && (
              <div className="account-section">
                <h2>Saved Addresses</h2>
                <div className="empty-state">
                  <FiMapPin />
                  <p>No saved addresses yet.</p>
                  <p className="empty-hint">Addresses are saved automatically during checkout.</p>
                </div>
              </div>
            )}

            {/* Settings tab */}
            {activeTab === 'settings' && (
              <div className="account-section">
                <h2>Account Settings</h2>
                <form
                  onSubmit={(e) => { e.preventDefault(); toast.success('Profile updated'); }}
                  className="settings-form"
                >
                  <div className="form-group">
                    <label>Full Name</label>
                    <input value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input value={userAttributes?.email || ''} disabled />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input type="tel" value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} />
                  </div>
                  <button type="submit" className="btn btn-primary">Save Changes</button>
                </form>

                <div className="danger-zone">
                  <h3>Danger Zone</h3>
                  <button className="btn btn-danger btn-outline" onClick={handleLogout}>Sign Out of All Devices</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
