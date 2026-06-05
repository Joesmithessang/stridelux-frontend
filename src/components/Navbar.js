import { Link } from 'react-router-dom';
import { FiSearch, FiUser, FiHeart, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

function Navbar() {
  const { cartCount } = useCart();

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        STRIDELUX
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/shop">Shop</Link>
        <Link to="/shop">Men</Link>
        <Link to="/shop">Women</Link>
        <Link to="/shop">New Arrivals</Link>
        <Link to="/about">About Us</Link>
      </div>

      <div className="nav-icons">
        <button className="icon-btn" aria-label="Search">
          <FiSearch />
        </button>

        <Link to="/login" className="icon-btn" aria-label="Account">
          <FiUser />
        </Link>

        <button className="icon-btn" aria-label="Wishlist">
          <FiHeart />
        </button>

        <Link to="/cart" className="icon-btn cart-btn" aria-label="Cart">
          <FiShoppingBag />
          <span className="cart-badge">{cartCount}</span>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;