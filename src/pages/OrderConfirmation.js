import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiCheck, FiPackage, FiArrowRight, FiHome } from 'react-icons/fi';
import { orderService } from '../services/orderService';

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (orderId) {
      orderService.getById(orderId).then(setOrder).catch(() => {});
    }
  }, [orderId]);

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
