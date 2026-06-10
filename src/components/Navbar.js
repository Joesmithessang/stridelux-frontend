import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  FiSearch, FiUser, FiHeart, FiShoppingBag, FiMenu, FiX,
  FiChevronDown, FiLogOut, FiPackage, FiSettings, FiGrid,
} from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { cartCount } = useCart();
  const { isAuthenticated, isAdmin, currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const userMenuRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    setUserMenuOpen(false);
    await logout();
    navigate('/');
  };

  const initials = currentUser?.name
    ? currentUser.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="navbar-inner">
          {/* Logo */}
          <Link to="/" className="navbar-logo" onClick={() => setMobileOpen(false)}>
            STRIDE<span>LUX</span>
          </Link>

          {/* Desktop nav links */}
          <div className="nav-links">
            <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Home</NavLink>
            <NavLink to="/shop" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Shop</NavLink>
            <NavLink to="/shop?category=Sneakers" className="nav-link">Sneakers</NavLink>
            <NavLink to="/shop?category=Apparel" className="nav-link">Apparel</NavLink>
            <NavLink to="/shop?category=Accessories" className="nav-link">Accessories</NavLink>
            <NavLink to="/about" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>About</NavLink>
          </div>

          {/* Right icons */}
          <div className="nav-icons">
            {/* Search */}
            <button className="icon-btn" onClick={() => setSearchOpen(!searchOpen)} aria-label="Search">
              <FiSearch />
            </button>

            {/* Wishlist */}
            <Link to="/wishlist" className="icon-btn" aria-label="Wishlist">
              <FiHeart />
            </Link>

            {/* Cart */}
            <Link to="/cart" className="icon-btn cart-icon-btn" aria-label="Cart">
              <FiShoppingBag />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>

            {/* User / Auth */}
            {isAuthenticated ? (
              <div className="user-menu-wrap" ref={userMenuRef}>
                <button
                  className="user-avatar-btn"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  aria-label="User menu"
                >
                  <span className="user-avatar">{initials}</span>
                  <FiChevronDown className={`chevron ${userMenuOpen ? 'open' : ''}`} />
                </button>

                {userMenuOpen && (
                  <div className="user-dropdown">
                    <div className="user-dropdown-header">
                      <span className="dropdown-name">{currentUser?.name || 'Account'}</span>
                      <span className="dropdown-email">{currentUser?.email}</span>
                    </div>
                    <div className="user-dropdown-divider" />
                    {isAdmin && (
                      <Link to="/admin" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                        <FiGrid /> Admin Dashboard
                      </Link>
                    )}
                    <Link to="/account" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                      <FiUser /> My Account
                    </Link>
                    <Link to="/account/orders" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                      <FiPackage /> Orders
                    </Link>
                    <Link to="/account/settings" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                      <FiSettings /> Settings
                    </Link>
                    <div className="user-dropdown-divider" />
                    <button className="dropdown-item logout-item" onClick={handleLogout}>
                      <FiLogOut /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="icon-btn" aria-label="Sign in">
                <FiUser />
              </Link>
            )}

            {/* Mobile toggle */}
            <button
              className="icon-btn mobile-menu-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="search-bar">
            <form onSubmit={handleSearch} className="search-form">
              <FiSearch className="search-icon-inner" />
              <input
                ref={searchRef}
                autoFocus
                type="text"
                placeholder="Search sneakers, apparel, accessories…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button type="button" className="search-close" onClick={() => setSearchOpen(false)}>
                <FiX />
              </button>
            </form>
          </div>
        )}
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="mobile-drawer">
          <div className="mobile-drawer-links">
            <NavLink to="/" end onClick={() => setMobileOpen(false)}>Home</NavLink>
            <NavLink to="/shop" onClick={() => setMobileOpen(false)}>Shop All</NavLink>
            <NavLink to="/shop?category=Sneakers" onClick={() => setMobileOpen(false)}>Sneakers</NavLink>
            <NavLink to="/shop?category=Apparel" onClick={() => setMobileOpen(false)}>Apparel</NavLink>
            <NavLink to="/shop?category=Accessories" onClick={() => setMobileOpen(false)}>Accessories</NavLink>
            <NavLink to="/about" onClick={() => setMobileOpen(false)}>About</NavLink>
            <NavLink to="/contact" onClick={() => setMobileOpen(false)}>Contact</NavLink>
            {isAuthenticated ? (
              <>
                <NavLink to="/account" onClick={() => setMobileOpen(false)}>My Account</NavLink>
                {isAdmin && <NavLink to="/admin" onClick={() => setMobileOpen(false)}>Admin Dashboard</NavLink>}
                <button className="mobile-logout-btn" onClick={() => { setMobileOpen(false); handleLogout(); }}>
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" onClick={() => setMobileOpen(false)}>Sign In</NavLink>
                <NavLink to="/register" onClick={() => setMobileOpen(false)}>Create Account</NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
