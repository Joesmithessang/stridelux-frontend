import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import products from '../data/products';
import { useCart } from '../context/CartContext';

function ProductDetails() {
  const { id } = useParams();
  const product = products.find((item) => item.id === Number(id));

  const { addToCart } = useCart();

  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <main className="page">
        <h1>Product Not Found</h1>
        <Link to="/shop" className="view-btn">
          Back to Shop
        </Link>
      </main>
    );
  }

  const handleAddToCart = () => {
    const needsSize = product.sizes && product.sizes.length > 1;

    if (needsSize && !selectedSize) {
      alert('Please select a size before adding to cart.');
      return;
    }

    const sizeToAdd = selectedSize || product.sizes?.[0] || 'One Size';

    addToCart(product, sizeToAdd, quantity);
    alert(`${product.name} added to cart.`);
  };

  return (
    <main className="details-page">
      <div className="details-image">
        <img
          className="large-product-image"
          src={product.image}
          alt={product.name}
        />
      </div>

      <div className="details-info">
        <p className="tagline dark">{product.category}</p>
        <h1>{product.name}</h1>
        <p className="details-brand">{product.brand}</p>
        <h2>${product.price.toFixed(2)}</h2>

        <div className="rating">
          ★★★★★ <span>(128 reviews)</span>
        </div>

        <p className="details-description">{product.description}</p>

        <div className="size-section">
          <h3>Size</h3>

          <div className="size-options">
            {product.sizes.map((size) => (
              <button
                key={size}
                className={selectedSize === size ? 'size-btn active-size' : 'size-btn'}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="quantity-section">
          <h3>Quantity</h3>

          <div className="quantity-box">
            <button onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}>
              -
            </button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)}>+</button>
          </div>
        </div>

        <button className="details-cart-btn" onClick={handleAddToCart}>
          Add to Cart
        </button>

        <button className="buy-btn">Buy Now</button>

        <p className="wishlist-text">♡ Add to Wishlist</p>
      </div>
    </main>
  );
}

export default ProductDetails;