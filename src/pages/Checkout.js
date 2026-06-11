import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiLock, FiCreditCard, FiTruck, FiCheck, FiChevronRight } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import toast from 'react-hot-toast';

const STEPS = ['Shipping', 'Payment', 'Review'];

const INITIAL_SHIPPING = {
  fullName: '', email: '', phone: '', address: '', city: '',
  state: '', postalCode: '', country: 'Canada',
};

const INITIAL_PAYMENT = {
  cardNumber: '', cardName: '', expiry: '', cvv: '',
};

export default function Checkout() {
  const { cartItems, subtotal, clearCart } = useCart();
  const { isGuest, userAttributes } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [shipping, setShipping] = useState(
    !isGuest && userAttributes
      ? { fullName: userAttributes.name || '', email: userAttributes.email || '', phone: userAttributes.phone_number || '', address: '', city: '', state: '', postalCode: '', country: 'Canada' }
      : { ...INITIAL_SHIPPING }
  );
  const [payment, setPayment] = useState({ ...INITIAL_PAYMENT });
  const [loading, setLoading] = useState(false);

  const shippingCost = shippingMethod === 'express' ? 20 : 10;
  const tax = subtotal * 0.13;
  const total = subtotal + shippingCost + tax;

  if (cartItems.length === 0) {
    return (
      <main className="checkout-page">
        <div className="section-container checkout-empty">
          <h2>Your cart is empty</h2>
          <Link to="/shop" className="btn btn-primary">Back to Shop</Link>
        </div>
      </main>
    );
  }

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setStep(1);
    window.scrollTo(0, 0);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setStep(2);
    window.scrollTo(0, 0);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const order = await orderService.create({
        items: cartItems.map((i) => ({
          productId: i.id,
          name: i.name,
          price: i.price,
          size: i.selectedSize,
          quantity: i.quantity,
          image: i.image,
        })),
        shippingInfo: shipping,
        shippingMethod,
        shippingCost,
        subtotal,
        tax,
        total,
      });
      clearCart();
      navigate(`/order-confirmation/${order.orderId}`);
    } catch {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCard = (val) => val.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
  const formatExpiry = (val) => val.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').slice(0, 5);

  return (
    <main className="checkout-page">
      <div className="section-container">
        {/* Step indicator */}
        <div className="checkout-steps">
          {STEPS.map((label, i) => (
            <div key={label} className={`checkout-step ${i <= step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
              <div className="step-circle">
                {i < step ? <FiCheck /> : i + 1}
              </div>
              <span>{label}</span>
              {i < STEPS.length - 1 && <div className="step-connector" />}
            </div>
          ))}
        </div>

        <div className="checkout-layout">
          {/* Left: Forms */}
          <div className="checkout-forms">
            {/* ── Step 0: Shipping ── */}
            {step === 0 && (
              <form className="checkout-form-card" onSubmit={handleShippingSubmit}>
                <h2><FiTruck /> Shipping Information</h2>
                {isGuest && (
                  <div className="guest-notice">
                    <p>Checking out as guest. <Link to="/login">Sign in</Link> to save your details.</p>
                  </div>
                )}
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input required value={shipping.fullName} onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })} placeholder="Jane Smith" />
                  </div>
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input required type="email" value={shipping.email} onChange={(e) => setShipping({ ...shipping, email: e.target.value })} placeholder="jane@example.com" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input required type="tel" value={shipping.phone} onChange={(e) => setShipping({ ...shipping, phone: e.target.value })} placeholder="+1 (416) 555-0100" />
                </div>
                <div className="form-group">
                  <label>Street Address *</label>
                  <input required value={shipping.address} onChange={(e) => setShipping({ ...shipping, address: e.target.value })} placeholder="123 Main St" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>City *</label>
                    <input required value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })} placeholder="Toronto" />
                  </div>
                  <div className="form-group">
                    <label>Province / State</label>
                    <input value={shipping.state} onChange={(e) => setShipping({ ...shipping, state: e.target.value })} placeholder="ON" />
                  </div>
                  <div className="form-group">
                    <label>Postal Code *</label>
                    <input required value={shipping.postalCode} onChange={(e) => setShipping({ ...shipping, postalCode: e.target.value })} placeholder="M5V 2T6" />
                  </div>
                </div>

                <h3 style={{ marginTop: '1.5rem' }}>Shipping Method</h3>
                <div className="shipping-options">
                  <label className={`shipping-option ${shippingMethod === 'standard' ? 'active' : ''}`}>
                    <input type="radio" name="shipping" value="standard" checked={shippingMethod === 'standard'} onChange={() => setShippingMethod('standard')} />
                    <div>
                      <strong>Standard Shipping</strong>
                      <p>5–7 business days</p>
                    </div>
                    <span>$10.00</span>
                  </label>
                  <label className={`shipping-option ${shippingMethod === 'express' ? 'active' : ''}`}>
                    <input type="radio" name="shipping" value="express" checked={shippingMethod === 'express'} onChange={() => setShippingMethod('express')} />
                    <div>
                      <strong>Express Shipping</strong>
                      <p>1–3 business days</p>
                    </div>
                    <span>$20.00</span>
                  </label>
                </div>

                <button type="submit" className="btn btn-primary btn-full checkout-next-btn">
                  Continue to Payment <FiChevronRight />
                </button>
              </form>
            )}

            {/* ── Step 1: Payment ── */}
            {step === 1 && (
              <form className="checkout-form-card" onSubmit={handlePaymentSubmit}>
                <h2><FiCreditCard /> Payment Details</h2>
                <div className="payment-note">
                  <FiLock />
                  <span>Payments are processed securely via Stripe. Your card details are never stored.</span>
                </div>
                <div className="form-group">
                  <label>Card Number *</label>
                  <input
                    required
                    value={payment.cardNumber}
                    onChange={(e) => setPayment({ ...payment, cardNumber: formatCard(e.target.value) })}
                    placeholder="4242 4242 4242 4242"
                    maxLength={19}
                  />
                </div>
                <div className="form-group">
                  <label>Name on Card *</label>
                  <input required value={payment.cardName} onChange={(e) => setPayment({ ...payment, cardName: e.target.value })} placeholder="Jane Smith" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Expiry Date *</label>
                    <input
                      required
                      value={payment.expiry}
                      onChange={(e) => setPayment({ ...payment, expiry: formatExpiry(e.target.value) })}
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                  </div>
                  <div className="form-group">
                    <label>CVV *</label>
                    <input required value={payment.cvv} onChange={(e) => setPayment({ ...payment, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })} placeholder="123" maxLength={4} />
                  </div>
                </div>
                <div className="checkout-step-nav">
                  <button type="button" className="btn btn-outline" onClick={() => setStep(0)}>← Back</button>
                  <button type="submit" className="btn btn-primary">
                    Review Order <FiChevronRight />
                  </button>
                </div>
              </form>
            )}

            {/* ── Step 2: Review ── */}
            {step === 2 && (
              <div className="checkout-form-card">
                <h2>Review Your Order</h2>

                <div className="review-section">
                  <div className="review-header">
                    <h3>Shipping to</h3>
                    <button className="review-edit-btn" onClick={() => setStep(0)}>Edit</button>
                  </div>
                  <p>{shipping.fullName}</p>
                  <p>{shipping.address}, {shipping.city}, {shipping.state} {shipping.postalCode}</p>
                  <p>{shipping.email} · {shipping.phone}</p>
                  <p className="review-method">
                    {shippingMethod === 'express' ? '⚡ Express Shipping (1–3 days)' : '📦 Standard Shipping (5–7 days)'} — ${shippingCost}
                  </p>
                </div>

                <div className="review-section">
                  <div className="review-header">
                    <h3>Payment</h3>
                    <button className="review-edit-btn" onClick={() => setStep(1)}>Edit</button>
                  </div>
                  <p>Card ending in {payment.cardNumber.slice(-4)}</p>
                </div>

                <div className="review-items">
                  <h3>Items ({cartItems.length})</h3>
                  {cartItems.map((item) => (
                    <div key={item.cartItemId} className="review-item">
                      <img src={item.image} alt={item.name} onError={(e) => { e.target.style.opacity='0.3'; }} />
                      <div>
                        <p className="review-item-name">{item.name}</p>
                        <p className="review-item-meta">Size {item.selectedSize} · Qty {item.quantity}</p>
                      </div>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="checkout-step-nav">
                  <button className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
                  <button
                    className="btn btn-accent btn-lg"
                    onClick={handlePlaceOrder}
                    disabled={loading}
                  >
                    {loading ? 'Placing Order…' : `Place Order — $${total.toFixed(2)}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Order summary sidebar */}
          <aside className="checkout-summary">
            <h2>Order Summary</h2>
            <div className="checkout-summary-items">
              {cartItems.map((item) => (
                <div key={item.cartItemId} className="summary-item">
                  <div className="summary-item-img">
                    <img src={item.image} alt={item.name} onError={(e) => { e.target.style.opacity='0.3'; }} />
                    <span className="item-qty-badge">{item.quantity}</span>
                  </div>
                  <div className="summary-item-info">
                    <p>{item.name}</p>
                    <p className="summary-item-size">Size: {item.selectedSize}</p>
                  </div>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="summary-divider" />
            <div className="summary-row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="summary-row"><span>Shipping</span><span>${shippingCost.toFixed(2)}</span></div>
            <div className="summary-row"><span>Tax (13%)</span><span>${tax.toFixed(2)}</span></div>
            <div className="summary-divider" />
            <div className="summary-row summary-total"><span>Total</span><span>${total.toFixed(2)}</span></div>
            <div className="checkout-trust">
              <p><FiLock /> SSL secured checkout</p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
