import { Link } from 'react-router-dom';
import { FiTrash2, FiArrowRight, FiShoppingBag, FiTag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cartItems, increaseQuantity, decreaseQuantity, removeFromCart, subtotal, shipping, total } = useCart();

  if (cartItems.length === 0) {
    return (
      <main className="cart-page">
        <div className="section-container">
          <div className="empty-cart">
            <div className="empty-cart-icon"><FiShoppingBag /></div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything yet. Let's fix that.</p>
            <Link to="/shop" className="btn btn-primary btn-lg">
              Browse Products <FiArrowRight />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <div className="section-container">
        <div className="page-title-row">
          <h1>My Cart</h1>
          <span className="cart-item-count">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</span>
        </div>

        <div className="cart-layout">
          {/* Cart items */}
          <div className="cart-items-col">
            {cartItems.map((item) => (
              <div className="cart-item" key={item.cartItemId}>
                <div className="cart-item-img">
                  <img src={item.image} alt={item.name} onError={(e) => { e.target.style.opacity = '0.3'; }} />
                </div>
                <div className="cart-item-body">
                  <div className="cart-item-top">
                    <div>
                      <h3 className="cart-item-name">{item.name}</h3>
                      <p className="cart-item-meta">{item.brand} · Size {item.selectedSize}</p>
                    </div>
                    <p className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <div className="cart-item-bottom">
                    <div className="qty-control">
                      <button className="qty-btn" onClick={() => decreaseQuantity(item.cartItemId)}>−</button>
                      <span className="qty-value">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => increaseQuantity(item.cartItemId)}>+</button>
                    </div>
                    <span className="cart-unit-price">${item.price} each</span>
                    <button className="cart-remove-btn" onClick={() => removeFromCart(item.cartItemId)}>
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="cart-summary">
            <h2>Order Summary</h2>

            {/* Promo code */}
            <div className="promo-field">
              <FiTag />
              <input type="text" placeholder="Promo or gift code" />
              <button className="btn btn-outline btn-sm">Apply</button>
            </div>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="summary-row">
              <span>Tax (est.)</span>
              <span>${(subtotal * 0.13).toFixed(2)}</span>
            </div>
            <div className="summary-divider" />
            <div className="summary-row summary-total">
              <span>Total</span>
              <span>${(total + subtotal * 0.13).toFixed(2)}</span>
            </div>
            <Link to="/checkout" className="btn btn-primary btn-full checkout-cta">
              Proceed to Checkout <FiArrowRight />
            </Link>
            <Link to="/shop" className="continue-shopping-link">← Continue Shopping</Link>

            <div className="cart-trust">
              <p>🔒 Secure SSL checkout</p>
              <p>✓ Free returns on all orders</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
