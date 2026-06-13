import { useEffect, useState, useRef } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { FiCheck, FiPackage, FiArrowRight, FiHome } from 'react-icons/fi';
import { orderService } from '../services/orderService';
import { addressService } from '../services/addressService';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function OrderConfirmation() {
  const { orderId: rawOrderId } = useParams();
  const [searchParams] = useSearchParams();
  const { isGuest } = useAuth();
  const { clearCart } = useCart();
  const [order, setOrder] = useState(null);
  const retriesRef = useRef(0);
  const cartClearedRef = useRef(false);

  // Strip malformed suffix from backend success_url (e.g. "uuid.sion_id=cs_test_...")
  const orderId = rawOrderId?.includes('.') ? rawOrderId.split('.')[0] : rawOrderId;

  // Clear cart exactly once when landing from a Stripe redirect
  useEffect(() => {
    if (cartClearedRef.current) return;
    const pendingId = sessionStorage.getItem('stripe_pending_order');
    const hasSessionParam = searchParams.get('session_id') || searchParams.get('sion_id')
      || rawOrderId?.includes('sion_id') || rawOrderId?.includes('session_id');
    if (pendingId || hasSessionParam) {
      clearCart();
      sessionStorage.removeItem('stripe_pending_order');
      cartClearedRef.current = true;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!orderId) return;

    const tryFetch = () => {
      orderService.getById(orderId)
        .then((o) => {
          setOrder(o);
          if (!isGuest && o.shippingInfo?.address) {
            addressService.save(o.shippingInfo).catch(() => {});
          }
        })
        .catch(() => {
          if (retriesRef.current < 4) {
            retriesRef.current += 1;
            setTimeout(tryFetch, 3000);
          }
        });
    };

    tryFetch();
  }, [orderId, isGuest]);

  return (
    <main className="confirmation-page">
      <div className="section-container">
        <div className="confirmation-card">
          <div className="confirmation-icon">
            <FiCheck />
          </div>
          <h1>Order Confirmed!</h1>
          <p className="confirmation-subtitle">
            Thank you for shopping with STRIDELUX. Your order has been placed and is being processed.
          </p>

          {orderId && (
            <div className="confirmation-order-id">
              <FiPackage />
              <div>
                <span className="conf-label">Order ID</span>
                <span className="conf-value">{orderId}</span>
              </div>
            </div>
          )}

          {order && (
            <>
              <div className="confirmation-details">
                <div className="conf-row">
                  <span>Shipping to</span>
                  <span>{order.shippingInfo?.fullName} — {order.shippingInfo?.city}</span>
                </div>
                <div className="conf-row">
                  <span>Delivery</span>
                  <span>{order.shippingMethod === 'express' ? 'Express (1–3 days)' : 'Standard (5–7 days)'}</span>
                </div>
                <div className="conf-row">
                  <span>Order Total</span>
                  <span className="conf-total">${order.total?.toFixed(2)}</span>
                </div>
              </div>

              <div className="confirmation-items">
                {order.items?.map((item) => (
                  <div key={item.productId + item.size} className="conf-item">
                    <img src={item.image} alt={item.name} onError={(e) => { e.target.style.opacity = '0.3'; }} />
                    <div>
                      <p>{item.name}</p>
                      <p className="conf-item-meta">Size {item.size} · Qty {item.quantity}</p>
                    </div>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          <p className="confirmation-email-note">
            A confirmation email has been sent to <strong>{order?.shippingInfo?.email || 'your email'}</strong>.
          </p>

          <div className="confirmation-actions">
            <Link to="/account" className="btn btn-primary btn-lg">
              <FiPackage /> Track Order
            </Link>
            <Link to="/shop" className="btn btn-ghost btn-lg">
              <FiArrowRight /> Continue Shopping
            </Link>
            <Link to="/" className="btn btn-outline btn-sm">
              <FiHome /> Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
