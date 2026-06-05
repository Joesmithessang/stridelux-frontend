import { Link } from 'react-router-dom';
import { FiTrash2 } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

function Cart() {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    subtotal,
    shipping,
    total,
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <main className="cart-page">
        <h1>My Cart</h1>

        <div className="cart-empty">
          <h2>Your cart is empty</h2>
          <p>Add some sneakers, apparel, or accessories to continue.</p>

          <Link to="/shop" className="checkout-btn">
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <h1>My Cart</h1>

      <div className="cart-layout">
        <div className="cart-items">
          {cartItems.map((item) => (
            <div className="cart-item" key={item.cartItemId}>
              <div className="cart-item-image">
                <img src={item.image} alt={item.name} />
              </div>

              <div className="cart-item-details">
                <h3>{item.name}</h3>
                <p>Size: {item.selectedSize}</p>
                <p>${item.price.toFixed(2)}</p>
              </div>

              <div className="cart-actions">
                <div className="quantity-box">
                  <button onClick={() => decreaseQuantity(item.cartItemId)}>
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQuantity(item.cartItemId)}>
                    +
                  </button>
                </div>

                <button
                  className="delete-btn"
                  onClick={() => removeFromCart(item.cartItemId)}
                >
                  <FiTrash2 />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>

          <div>
            <p>Subtotal</p>
            <p>${subtotal.toFixed(2)}</p>
          </div>

          <div>
            <p>Shipping</p>
            <p>${shipping.toFixed(2)}</p>
          </div>

          <hr />

          <div>
            <strong>Total</strong>
            <strong>${total.toFixed(2)}</strong>
          </div>

          <Link to="/checkout" className="checkout-btn">
            Checkout
          </Link>
        </div>
      </div>
    </main>
  );
}

export default Cart;