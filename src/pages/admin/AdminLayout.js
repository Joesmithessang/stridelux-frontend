import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  FiGrid, FiPackage, FiShoppingBag, FiBarChart2, FiUsers,
  FiLogOut, FiArrowLeft, FiMenu, FiX,
} from 'react-icons/fi';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const ADMIN_NAV = [
  { to: '/admin', label: 'Dashboard', icon: <FiGrid />, end: true },
  { to: '/admin/products', label: 'Products', icon: <FiShoppingBag /> },
  { to: '/admin/orders', label: 'Orders', icon: <FiPackage /> },
  { to: '/admin/users', label: 'Users', icon: <FiUsers /> },
  { to: '/admin/reports', label: 'Reports', icon: <FiBarChart2 /> },
];

export default function AdminLayout() {
  const { userAttributes, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className={`admin-shell ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <span className="admin-logo">STRIDE<span>LUX</span></span>
          <span className="admin-badge-tag">Admin</span>
        </div>

        <nav className="admin-nav">
          {ADMIN_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-chip">
            <div className="admin-user-avatar">
              {userAttributes?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="admin-user-info">
              <span>{userAttributes?.name || 'Admin'}</span>
              <span className="admin-user-role">Administrator</span>
            </div>
          </div>
          <NavLink to="/" className="admin-back-link">
            <FiArrowLeft /> View Store
          </NavLink>
          <button className="admin-logout-btn" onClick={handleLogout}>
            <FiLogOut /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="admin-main">
        <div className="admin-topbar">
          <button className="admin-sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <FiX /> : <FiMenu />}
          </button>
          <span className="admin-topbar-title">Admin Panel</span>
        </div>
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
