import { Link, useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FiHeart, FiStar, FiShoppingBag, FiZap, FiArrowLeft, FiCheck, FiX } from 'react-icons/fi';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    productService.getById(id)
      .then(async (p) => {
        setProduct(p);
        setSelectedSize('');
        setActiveImage(0);
        setLoading(false);
        const all = await productService.getAll({ category: p.category });
        setRelated(all.filter((x) => x.id !== p.id).slice(0, 4));
      })
      .catch(() => { setLoading(false); });
  }, [id]);

  const handleAddToCart = () => {
    const needsSize = product.sizes && product.sizes.length > 1;
    if (needsSize && !selectedSize) {
      toast.error('Please select a size');
      return false;
    }
    const size = selectedSize || product.sizes?.[0] || 'One Size';
    addToCart(product, size, quantity);
    setAddedToCart(true);
    toast.success(`Added to cart!`);
    setTimeout(() => setAddedToCart(false), 2000);
    return true;
  };

  const handleBuyNow = () => {
    if (handleAddToCart()) navigate('/checkout');
  };

  if (loading) return <div className="page-loading"><LoadingSpinner fullPage /></div>;

  if (!product) {
    return (
      <main className="product-not-found">
        <div className="section-container">
          <div className="product-not-found-inner">
            <div className="not-found-icon">
              <FiShoppingBag />
            </div>
            <h1>Product Not Found</h1>
            <p>The product you're looking for doesn't exist or may have been removed from our store.</p>
            <div className="not-found-actions">
              <Link to="/shop" className="btn btn-primary">Browse All Products</Link>
              <Link to="/" className="btn btn-outline">Back to Home</Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const images = product.images?.length ? product.images : [product.thumbnail || product.image];
  const wishlisted = isWishlisted(product.id);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FiStar key={i} className={`star ${i < Math.floor(rating) ? 'star-filled' : ''}`} />
    ));
  };

  return (
    <main className="details-page">
      <div className="section-container">
        {/* Breadcrumb + close */}
        <div className="details-nav-row">
          <nav className="breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/shop">Shop</Link>
            <span>/</span>
            <Link to={`/shop?category=${product.category}`}>{product.category}</Link>
            <span>/</span>
            <span>{product.name}</span>
          </nav>
          <button className="details-close-btn" onClick={() => navigate(-1)} title="Close">
            <FiX />
          </button>
        </div>

        <div className="details-layout">
          {/* Image gallery */}
          <div className="details-gallery">
            <div className="gallery-main">
              <img
                src={images[activeImage]}
                alt={product.name}
                onError={(e) => { e.target.style.opacity = '0.3'; }}
              />
              {product.compareAtPrice && (
                <span className="badge badge-sale gallery-badge">SALE</span>
              )}
            </div>
            {images.length > 1 && (
              <div className="gallery-thumbs">
                {images.map((img, i) => (
                  <button
                    key={i}
                    className={`gallery-thumb ${i === activeImage ? 'active' : ''}`}
                    onClick={() => setActiveImage(i)}
                  >
                    <img src={img} alt={`${product.name} view ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="details-info">
            <div className="details-meta">
              <span className="details-brand">{product.brand}</span>
              <span className="details-category">{product.category}</span>
            </div>
            <h1 className="details-title">{product.name}</h1>

            {/* Rating */}
            <div className="details-rating">
              <div className="stars">{renderStars(product.rating)}</div>
              <span className="rating-score">{product.rating?.toFixed(1)}</span>
              <span className="rating-count">({product.reviewCount} reviews)</span>
            </div>

            {/* Price */}
            <div className="details-price">
              <span className="price-main">${product.price}</span>
              {product.compareAtPrice && (
                <>
                  <span className="price-was">${product.compareAtPrice}</span>
                  <span className="price-save">
                    Save ${(product.compareAtPrice - product.price).toFixed(0)}
                  </span>
                </>
              )}
            </div>

            <p className="details-description">{product.description}</p>

            {/* Size picker */}
            {product.sizes?.length > 0 && (
              <div className="size-section">
                <div className="size-header">
                  <h3>Size</h3>
                  {product.sizes[0] !== 'One Size' && (
                    <button className="size-guide-link" onClick={() => setSizeGuideOpen(true)}>Size Guide</button>
                  )}
                </div>
                <div className="size-grid">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="quantity-section">
              <h3>Quantity</h3>
              <div className="qty-control">
                <button className="qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                <span className="qty-value">{quantity}</span>
                <button className="qty-btn" onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="details-ctas">
              <button
                className={`btn btn-primary btn-full ${addedToCart ? 'btn-success' : ''}`}
                onClick={handleAddToCart}
              >
                {addedToCart ? <><FiCheck /> Added!</> : <><FiShoppingBag /> Add to Cart</>}
              </button>
              <button className="btn btn-accent btn-full" onClick={handleBuyNow}>
                <FiZap /> Buy Now
              </button>
            </div>

            {/* Wishlist */}
            <button
              className={`wishlist-text-btn ${wishlisted ? 'active' : ''}`}
              onClick={() => { toggleWishlist(product); toast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist'); }}
            >
              <FiHeart /> {wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </button>

            {/* Features list */}
            {product.features?.length > 0 && (
              <div className="details-features">
                <h3>Key Features</h3>
                <ul>
                  {product.features.map((f) => (
                    <li key={f}><FiCheck className="feature-check" /> {f}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Stock warning */}
            {product.stockCount <= 5 && (
              <p className="low-stock-alert">⚡ Only {product.stockCount} left in stock</p>
            )}
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className="related-products">
            <div className="section-header">
              <h2 className="section-heading">You Might Also Like</h2>
            </div>
            <div className="product-grid">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>

      {/* Size Guide Modal */}
      {sizeGuideOpen && (
        <div className="admin-modal-overlay" onClick={() => setSizeGuideOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>Size Guide</h2>
              <button className="modal-close-btn" onClick={() => setSizeGuideOpen(false)}><FiX /></button>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-2)', marginBottom: '1.25rem' }}>
                Stridelux shoes are sized to North American standards. Use the chart below to find your best fit.
              </p>
              <table className="size-guide-table">
                <thead>
                  <tr>
                    <th>US / Canada</th>
                    <th>Europe (EU)</th>
                    <th>United Kingdom (UK)</th>
                  </tr>
                </thead>
                <tbody>
                  {SIZE_GUIDE.map((row) => (
                    <tr key={row.us}>
                      <td>{row.us}</td>
                      <td>{row.eu}</td>
                      <td>{row.uk}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="size-guide-note">
                Sizes are approximate. If you are between sizes, we recommend sizing up for the best comfort.
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

const SIZE_GUIDE = [
  { us: '6',    eu: '39', uk: '5.5' },
  { us: '6.5',  eu: '39', uk: '6'   },
  { us: '7',    eu: '40', uk: '6.5' },
  { us: '7.5',  eu: '41', uk: '7'   },
  { us: '8',    eu: '41', uk: '7.5' },
  { us: '8.5',  eu: '42', uk: '8'   },
  { us: '9',    eu: '42', uk: '8.5' },
  { us: '9.5',  eu: '43', uk: '9'   },
  { us: '10',   eu: '44', uk: '9.5' },
  { us: '10.5', eu: '44', uk: '10'  },
  { us: '11',   eu: '45', uk: '10.5'},
  { us: '11.5', eu: '45', uk: '11'  },
  { us: '12',   eu: '46', uk: '11.5'},
  { us: '13',   eu: '47', uk: '12'  },
];
