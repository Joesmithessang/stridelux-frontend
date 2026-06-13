import { Link, useNavigate } from 'react-router-dom';
import { FiHeart, FiShoppingBag, FiStar } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const navigate = useNavigate();
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    const hasMultipleSizes = product.sizes && product.sizes.length > 1;
    if (hasMultipleSizes) {
      // Navigate to product detail so user can pick a size
      navigate(`/product/${product.id}`);
      return;
    }
    // Single size or no sizes — add directly
    const defaultSize = product.sizes?.[0] || 'One Size';
    addToCart(product, defaultSize, 1);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    toggleWishlist(product);
  };

  const imgSrc = product.thumbnail || product.image;

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-card-link">
        <div className="product-card-image">
          <img
            src={imgSrc}
            alt={product.name}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          {product.tags?.includes('sale') && product.compareAtPrice && (
            <span className="badge badge-sale">SALE</span>
          )}
          {product.tags?.includes('new') && (
            <span className="badge badge-new">NEW</span>
          )}
          <div className="product-card-actions">
            <button
              className={`card-action-btn wishlist-btn ${wishlisted ? 'active' : ''}`}
              onClick={handleWishlist}
              aria-label="Toggle wishlist"
            >
              <FiHeart />
            </button>
          </div>
        </div>

        <div className="product-card-info">
          <span className="product-card-brand">{product.brand}</span>
          <h3 className="product-card-name">{product.name}</h3>
          <div className="product-card-meta">
            <div className="product-card-rating">
              <FiStar className="star-icon" />
              <span>{product.rating?.toFixed(1) || '4.5'}</span>
              <span className="review-count">({product.reviewCount || 0})</span>
            </div>
            <div className="product-card-price">
              {product.compareAtPrice && (
                <span className="price-compare">${product.compareAtPrice}</span>
              )}
              <span className="price-current">${product.price}</span>
            </div>
          </div>
        </div>
      </Link>

      <button className="add-to-cart-btn" onClick={handleAddToCart}>
        <FiShoppingBag />
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;
