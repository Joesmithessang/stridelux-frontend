import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    const defaultSize = product.sizes?.[0] || 'One Size';
    addToCart(product, defaultSize, 1);
  };

  return (
    <div className="product-card">
      <button className="wishlist">♡</button>

      <Link to={`/product/${product.id}`} className="product-link">
        <div className="product-image">
          <img src={product.image} alt={product.name} />
        </div>

        <p className="category">{product.category}</p>
        <h3>{product.name}</h3>
        <p className="price">${product.price.toFixed(2)}</p>
      </Link>

      <button className="add-btn" onClick={handleAddToCart}>
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;