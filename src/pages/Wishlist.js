import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingBag, FiTrash2, FiArrowRight } from 'react-icons/fi';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function Wishlist() {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    const size = product.sizes?.[0] || 'One Size';
    addToCart(product, size, 1);
    toast.success('Added to cart!');
  };

  if (wishlist.length === 0) {
    return (
      <main className="wishlist-page">
        <div className="section-container">
          <div className="page-hero-mini">
            <p className="section-overline">Your List</p>
            <h1>Wishlist</h1>
          </div>
          <div className="empty-state">
            <div className="empty-icon"><FiHeart /></div>
            <h2>Your wishlist is empty</h2>
            <p>Save items you love and come back to them anytime.</p>
            <Link to="/shop" className="btn btn-primary btn-lg">
              Browse Products <FiArrowRight />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="wishlist-page">
      <div className="section-container">
        <div className="page-hero-mini">
          <p className="section-overline">Your List</p>
          <h1>Wishlist</h1>
          <p className="page-subtitle">{wishlist.length} saved item{wishlist.length !== 1 ? 's' : ''}</p>
        </div>

        <div className="wishlist-grid">
          {wishlist.map((product) => (
            <div key={product.id} className="wishlist-card">
              <Link to={`/product/${product.id}`} className="wishlist-card-img">
                <img
                  src={product.thumbnail || product.image}
                  alt={product.name}
                  onError={(e) => { e.target.style.opacity = '0.3'; }}
                />
              </Link>
              <div className="wishlist-card-body">
                <div>
                  <span className="product-card-brand">{product.brand}</span>
                  <Link to={`/product/${product.id}`}>
                    <h3 className="wishlist-card-name">{product.name}</h3>
                  </Link>
                  <p className="wishlist-card-price">${product.price}</p>
                </div>
                <div className="wishlist-card-actions">
                  <button className="btn btn-primary btn-sm" onClick={() => handleAddToCart(product)}>
                    <FiShoppingBag /> Add to Cart
                  </button>
                  <button className="wishlist-remove-btn" onClick={() => toggleWishlist(product)} aria-label="Remove">
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
