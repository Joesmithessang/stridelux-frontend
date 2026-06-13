import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FiPackage, FiHeart, FiMapPin, FiSettings, FiLogOut,
  FiUser, FiChevronRight, FiTruck, FiCheck, FiClock, FiX, FiEdit2, FiPlus,
} from 'react-icons/fi';
import { updateUserAttributes } from 'aws-amplify/auth';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { addressService } from '../services/addressService';
import { USE_MOCK_AUTH } from '../config/aws-config';
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

const EMPTY_ADDR = { fullName: '', phone: '', address: '', city: '', state: '', postalCode: '', country: 'Canada' };

const tabFromPath = (path) => {
  if (path.endsWith('/settings')) return 'settings';
  if (path.endsWith('/orders')) return 'orders';
  return 'orders';
};

export default function Account() {
  const { userAttributes, isGuest, isAdmin, signOut, refreshUser } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [activeTab, setActiveTab] = useState(() => tabFromPath(pathname));
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [profileForm, setProfileForm] = useState({ name: '', phone: '' });
  const [savingProfile, setSavingProfile] = useState(false);

  const [addrModalOpen, setAddrModalOpen] = useState(false);
  const [editingAddr, setEditingAddr] = useState(null);
  const [addrForm, setAddrForm] = useState(EMPTY_ADDR);
  const [savingAddr, setSavingAddr] = useState(false);

  // Sync active tab when the URL changes (navbar dropdown navigation)
  useEffect(() => {
    setActiveTab(tabFromPath(pathname));
  }, [pathname]);

  // Sync profile form fields whenever Cognito attributes update
  useEffect(() => {
    setProfileForm({ name: userAttributes?.name || '', phone: userAttributes?.phone_number || '' });
  }, [userAttributes]);

  // One-time data fetch — only re-runs if auth state flips (not on every userAttributes reference change)
  useEffect(() => {
    if (isGuest) { navigate('/login'); return; }
    orderService.getMyOrders()
      .then((data) => { setOrders(data); setLoadingOrders(false); })
      .catch(() => { setOrders([]); setLoadingOrders(false); });
    addressService.getAll()
      .then(setAddresses)
      .catch(() => setAddresses([]))
      .finally(() => setLoadingAddresses(false));
  }, [isGuest, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      await addressService.delete(addressId);
      setAddresses((prev) => prev.filter((a) => a.addressId !== addressId));
      toast.success('Address removed.');
    } catch {
      toast.error('Failed to remove address.');
    }
  };

  const openAddAddr = () => { setEditingAddr(null); setAddrForm(EMPTY_ADDR); setAddrModalOpen(true); };
  const openEditAddr = (addr) => {
    setEditingAddr(addr);
    setAddrForm({ fullName: addr.fullName || '', phone: addr.phone || '', address: addr.address || '', city: addr.city || '', state: addr.state || '', postalCode: addr.postalCode || '', country: addr.country || 'Canada' });
    setAddrModalOpen(true);
  };
  const closeAddrModal = () => { setAddrModalOpen(false); setEditingAddr(null); setAddrForm(EMPTY_ADDR); };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    setSavingAddr(true);
    try {
      if (editingAddr) {
        const updated = await addressService.update(editingAddr.addressId, addrForm);
        setAddresses((prev) => prev.map((a) => a.addressId === updated.addressId ? updated : a));
        toast.success('Address updated.');
      } else {
        const created = await addressService.save(addrForm);
        if (created) setAddresses((prev) => [created, ...prev]);
        toast.success('Address saved.');
      }
      closeAddrModal();
    } catch (err) {
      toast.error(err?.message || 'Failed to save address.');
    } finally {
      setSavingAddr(false);
    }
  };

  const addrField = (key) => ({
    value: addrForm[key],
    onChange: (e) => setAddrForm((prev) => ({ ...prev, [key]: e.target.value })),
  });

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
                <div className="account-section-header">
                  <h2>Saved Addresses</h2>
                  <button className="btn btn-primary btn-sm" onClick={openAddAddr}>
                    <FiPlus /> Add Address
                  </button>
                </div>
                {loadingAddresses ? (
                  <LoadingSpinner />
                ) : addresses.length === 0 ? (
                  <div className="empty-state">
                    <FiMapPin />
                    <p>No saved addresses yet.</p>
                    <p className="empty-hint">Add one below or complete a checkout to save automatically.</p>
                    <button className="btn btn-outline btn-sm" onClick={openAddAddr} style={{ marginTop: '0.75rem' }}>
                      <FiPlus /> Add Address
                    </button>
                  </div>
                ) : (
                  <div className="addresses-list">
                    {addresses.map((addr) => (
                      <div key={addr.addressId} className="address-card">
                        <div className="address-card-body">
                          <p className="address-name">{addr.fullName}</p>
                          <p className="address-line">{addr.address}</p>
                          <p className="address-line">{addr.city}{addr.state ? `, ${addr.state}` : ''} {addr.postalCode}</p>
                          <p className="address-line">{addr.country}</p>
                          {addr.phone && <p className="address-phone">{addr.phone}</p>}
                        </div>
                        <div className="action-btns">
                          <button className="action-btn edit-btn" onClick={() => openEditAddr(addr)} title="Edit address"><FiEdit2 /></button>
                          <button className="action-btn delete-btn" onClick={() => handleDeleteAddress(addr.addressId)} title="Remove address"><FiX /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Settings tab */}
            {activeTab === 'settings' && (
              <div className="account-section">
                <h2>Account Settings</h2>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setSavingProfile(true);
                    try {
                      if (!USE_MOCK_AUTH) {
                        await updateUserAttributes({
                          userAttributes: {
                            name: profileForm.name,
                            phone_number: profileForm.phone,
                          },
                        });
                        await refreshUser();
                      }
                      toast.success('Profile updated successfully');
                    } catch (err) {
                      toast.error(err.message || 'Failed to update profile');
                    } finally {
                      setSavingProfile(false);
                    }
                  }}
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
                    <input type="tel" placeholder="+1 (416) 555-0100" value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} />
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={savingProfile}>
                    {savingProfile ? 'Saving…' : 'Save Changes'}
                  </button>
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

      {/* Add / Edit Address Modal */}
      {addrModalOpen && (
        <div className="admin-modal-overlay" onClick={closeAddrModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{editingAddr ? 'Edit Address' : 'Add Address'}</h2>
              <button className="modal-close-btn" onClick={closeAddrModal}><FiX /></button>
            </div>
            <form onSubmit={handleSaveAddress} className="admin-modal-form">
              <div className="form-row-2">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input type="text" required placeholder="Jane Smith" {...addrField('fullName')} />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input type="tel" placeholder="+1 (416) 555-0100" {...addrField('phone')} />
                </div>
              </div>
              <div className="form-group">
                <label>Street Address *</label>
                <input type="text" required placeholder="123 Main St" {...addrField('address')} />
              </div>
              <div className="form-row-2">
                <div className="form-group">
                  <label>City *</label>
                  <input type="text" required placeholder="Toronto" {...addrField('city')} />
                </div>
                <div className="form-group">
                  <label>Province / State</label>
                  <input type="text" placeholder="ON" {...addrField('state')} />
                </div>
              </div>
              <div className="form-row-2">
                <div className="form-group">
                  <label>Postal Code *</label>
                  <input type="text" required placeholder="M5V 2T6" {...addrField('postalCode')} />
                </div>
                <div className="form-group">
                  <label>Country *</label>
                  <input type="text" required placeholder="Canada" {...addrField('country')} />
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="btn btn-outline btn-sm" onClick={closeAddrModal}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={savingAddr}>
                  {savingAddr ? 'Saving…' : editingAddr ? 'Save Changes' : 'Add Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
