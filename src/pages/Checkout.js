import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiLock, FiTruck, FiCheck, FiChevronRight, FiTag, FiX } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import api from '../services/api';
import { USE_MOCK } from '../config/aws-config';
import toast from 'react-hot-toast';

const STEPS = ['Shipping', 'Review & Pay'];

const INITIAL_SHIPPING = {
  fullName: '', email: '', phone: '', address: '', city: '',
  state: '', postalCode: '', country: 'Canada',
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
  const [couponCode, setCouponCode] = useState('');
  const [couponData, setCouponData] = useState(null); // { code, discount, type }
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [loading, setLoading] = useState(false);

  const shippingCost = shippingMethod === 'express' ? 20 : 10;
  const tax = subtotal * 0.025;
  const discountAmount = couponData
    ? couponData.type === 'percentage'
      ? (subtotal * couponData.discount) / 100
      : Math.min(couponData.discount, subtotal)
    : 0;
  const total = subtotal + shippingCost + tax - discountAmount;

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

  const handleApplyCoupon = async () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) return;
    setApplyingCoupon(true);
    try {
      if (USE_MOCK) {
        // Mock coupon store — matches default coupons seeded in adminService
        const MOCK_COUPONS = { SAVE10: { code: 'SAVE10', discount: 10, type: 'percentage' }, STRIDE20: { code: 'STRIDE20', discount: 20, type: 'percentage' } };
        const found = MOCK_COUPONS[code];
        if (found) { setCouponData(found); toast.success(`Coupon applied: ${found.discount}% off`); }
        else { toast.error('Invalid coupon code'); }
      } else {
        const result = await api.post('/coupons/validate', { code });
        setCouponData(result);
        toast.success(`Coupon applied: ${result.discount}${result.type === 'percentage' ? '%' : '$'} off`);
      }
    } catch {
      toast.error('Invalid or expired coupon code');
    } finally {
      setApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setCouponData(null);
    setCouponCode('');
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const orderPayload = {
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
        discountAmount,
        couponCode: couponData?.code || null,
        total,
      };

      if (USE_MOCK) {
        // Mock: create order directly and navigate to confirmation
        const order = await orderService.create(orderPayload);
        clearCart();
        navigate(`/order-confirmation/${order.orderId}`);
      } else {
        // Real: create Stripe checkout session — backend returns { orderId, url }
        const { orderId, url } = await api.post('/payments/checkout-session', orderPayload);
        if (url) {
          // Mark cart to be cleared once Stripe redirects back to confirmation page
          sessionStorage.setItem('stripe_pending_order', orderId);
          window.location.href = url;
        } else {
          clearCart();
          navigate(`/order-confirmation/${orderId}`);
        }
      }
    } catch {
      toast.error('Failed to initiate payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
                    <span className="shipping-radio-dot" />
                    <div className="shipping-option-info">
                      <strong>Standard Shipping</strong>
                      <p>5–7 business days</p>
                    </div>
                    <span className="shipping-option-price">$10.00</span>
                  </label>
                  <label className={`shipping-option ${shippingMethod === 'express' ? 'active' : ''}`}>
                    <input type="radio" name="shipping" value="express" checked={shippingMethod === 'express'} onChange={() => setShippingMethod('express')} />
                    <span className="shipping-radio-dot" />
                    <div className="shipping-option-info">
                      <strong>Express Shipping</strong>
                      <p>1–3 business days</p>
                    </div>
                    <span className="shipping-option-price">$20.00</span>
                  </label>
                </div>

                <button type="submit" className="btn btn-primary btn-full checkout-next-btn">
                  Review Order <FiChevronRight />
                </button>
              </form>
            )}

            {/* ── Step 1: Review & Pay ── */}
            {step === 1 && (
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

                <div className="review-items">
                  <h3>Items ({cartItems.length})</h3>
                  {cartItems.map((item) => (
                    <div key={item.cartItemId} className="review-item">
                      <img src={item.image} alt={item.name} onError={(e) => { e.target.style.opacity = '0.3'; }} />
                      <div>
                        <p className="review-item-name">{item.name}</p>
                        <p className="review-item-meta">Size {item.selectedSize} · Qty {item.quantity}</p>
                      </div>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="payment-note" style={{ marginTop: '1.5rem' }}>
                  <FiLock />
                  <span>You will be redirected to Stripe's secure payment page to complete your purchase.</span>
                </div>

                <div className="checkout-step-nav">
                  <button className="btn btn-outline" onClick={() => setStep(0)}>← Back</button>
                  <button
                    className="btn btn-accent btn-lg"
                    onClick={handlePlaceOrder}
                    disabled={loading}
                  >
                    {loading ? 'Redirecting to Payment…' : `Pay $${total.toFixed(2)} via Stripe`}
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
                    <img src={item.image} alt={item.name} onError={(e) => { e.target.style.opacity = '0.3'; }} />
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

            {/* Coupon code input */}
            <div className="summary-divider" />
            {couponData ? (
              <div className="coupon-applied">
                <FiTag />
                <span><strong>{couponData.code}</strong> — {couponData.discount}{couponData.type === 'percentage' ? '%' : '$'} off</span>
                <button className="coupon-remove-btn" onClick={removeCoupon} title="Remove coupon"><FiX /></button>
              </div>
            ) : (
              <div className="coupon-row">
                <input
                  className="coupon-input"
                  placeholder="Coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                />
                <button
                  className="btn btn-outline btn-sm coupon-apply-btn"
                  onClick={handleApplyCoupon}
                  disabled={applyingCoupon || !couponCode.trim()}
                >
                  {applyingCoupon ? '…' : 'Apply'}
                </button>
              </div>
            )}

            <div className="summary-divider" />
            <div className="summary-row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="summary-row"><span>Shipping</span><span>${shippingCost.toFixed(2)}</span></div>
            <div className="summary-row"><span>VAT (2.5%)</span><span>${tax.toFixed(2)}</span></div>
            {discountAmount > 0 && (
              <div className="summary-row" style={{ color: '#22c55e' }}>
                <span>Discount ({couponData.code})</span>
                <span>−${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="summary-divider" />
            <div className="summary-row summary-total"><span>Total</span><span>${total.toFixed(2)}</span></div>
            <div className="checkout-trust">
              <p><FiLock /> SSL secured checkout via Stripe</p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
