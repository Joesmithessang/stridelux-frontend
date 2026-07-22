import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft, FiPackage, FiMapPin, FiCreditCard,
  FiTruck, FiCheck, FiClock, FiX,
} from 'react-icons/fi';
import { orderService } from '../services/orderService';
import { productService } from '../services/productService';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const STATUS_CONFIG = {
  pending:          { label: 'Pending',          icon: <FiClock />,  color: 'status-pending' },
  processing:       { label: 'Processing',       icon: <FiClock />,  color: 'status-processing' },
  shipped:          { label: 'Shipped',          icon: <FiTruck />,  color: 'status-shipped' },
  out_for_delivery: { label: 'Out for Delivery', icon: <FiTruck />,  color: 'status-out-for-delivery' },
  delivered:        { label: 'Delivered',        icon: <FiCheck />,  color: 'status-delivered' },
  cancelled:        { label: 'Cancelled',        icon: <FiX />,      color: 'status-cancelled' },
};

const fmt = (n) =>
  new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(Number(n || 0));

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' });

export default function OrderDetail() {
  const { orderId } = useParams();
  const { isGuest } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    if (isGuest) { navigate('/login'); return; }
    if (!orderId) return;

    orderService.getById(orderId)
      .then(async (data) => {
        // Back-fill missing item images from the product catalog
        if (data?.items?.some((i) => !i.image)) {
          const products = await productService.getAll({}).catch(() => []);
          const imgMap = {};
          for (const p of products) {
            const img = p.thumbnail || p.image || '';
            if (p.id)        imgMap[p.id]        = img;
            if (p.productId) imgMap[p.productId] = img;
          }
          data = {
            ...data,
            items: data.items.map((item) => ({
              ...item,
              image: item.image || imgMap[item.productId || item.id] || '',
            })),
          };
        }
        setOrder(data);
      })
      .catch(() => setError('Order not found or could not be loaded.'))
      .finally(() => setLoading(false));
  }, [orderId, isGuest, navigate]);

  if (loading) {
    return (
      <main className="account-page">
        <div className="section-container"><LoadingSpinner /></div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="account-page">
        <div className="section-container">
          <div className="order-detail-wrap">
            <Link to="/account/orders" className="order-detail-back">
              <FiArrowLeft /> Back to Orders
            </Link>
            <div className="empty-state"><p>{error || 'Order not found.'}</p></div>
          </div>
        </div>
      </main>
    );
  }

  const cfg = STATUS_CONFIG[order.status] || {
    label: order.status?.replace(/_/g, ' ') || 'Unknown',
    icon:  null,
    color: 'status-unknown',
  };

  const subtotal  = Number(order.subtotal       || 0);
  const shipping  = Number(order.shippingCost   || 0);
  const tax       = Number(order.tax            || 0);
  const discount  = Number(order.discountAmount || 0);
  const total     = Number(order.total          || 0);
  const info      = order.shippingInfo || {};
  const shortId   = String(order.orderId || '').slice(0, 8).toUpperCase();
  const items     = Array.isArray(order.items) ? order.items : [];

  return (
    <main className="account-page">
      <div className="section-container">
        <div className="order-detail-wrap">

          <Link to="/account/orders" className="order-detail-back">
            <FiArrowLeft /> Back to Orders
          </Link>

          {/* ── Header ── */}
          <div className="order-detail-header">
            <div>
              <h2 className="order-detail-title">
                Order <span>#{shortId}</span>
              </h2>
              <p className="order-detail-meta">
                Placed on {fmtDate(order.createdAt)}
              </p>
            </div>
            <span className={`order-status ${cfg.color}`}>
              {cfg.icon} {cfg.label}
            </span>
          </div>

          {/* ── Two-column grid ── */}
          <div className="order-detail-grid">

            {/* Left — items + totals */}
            <div className="order-detail-main">
              <div className="order-detail-card">
                <h3 className="order-detail-card-title">
                  <FiPackage /> Items Ordered
                </h3>

                <div className="order-detail-items">
                  {items.map((item, i) => {
                    const size      = item.selectedSize || item.size;
                    const lineTotal = Number(item.price || 0) * Number(item.quantity || 1);
                    return (
                      <div key={i} className="order-detail-item">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name || 'Product'}
                            onError={(e) => { e.target.style.opacity = '0.3'; }}
                          />
                        ) : (
                          <div className="order-detail-item-placeholder" />
                        )}
                        <div className="order-detail-item-info">
                          <p className="order-detail-item-name">{item.name || 'Product'}</p>
                          <p className="order-detail-item-meta">
                            {[size && `Size ${size}`, item.quantity && `Qty ${item.quantity}`]
                              .filter(Boolean).join(' · ')}
                          </p>
                        </div>
                        <span className="order-detail-item-price">{fmt(lineTotal)}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Totals */}
                <div className="order-detail-totals">
                  <div className="order-detail-total-row">
                    <span>Subtotal</span><span>{fmt(subtotal)}</span>
                  </div>
                  <div className="order-detail-total-row">
                    <span>Shipping ({order.shippingMethod
                      ? order.shippingMethod.charAt(0).toUpperCase() + order.shippingMethod.slice(1)
                      : 'Standard'})</span>
                    <span>{shipping === 0 ? 'Free' : fmt(shipping)}</span>
                  </div>
                  <div className="order-detail-total-row">
                    <span>Tax</span><span>{fmt(tax)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="order-detail-total-row discount">
                      <span>
                        Discount{order.couponCode ? ` (${order.couponCode})` : ''}
                      </span>
                      <span>-{fmt(discount)}</span>
                    </div>
                  )}
                  <div className="order-detail-total-row grand-total">
                    <span>Total</span><span>{fmt(total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right — shipping + payment */}
            <div className="order-detail-side">

              <div className="order-detail-card">
                <h3 className="order-detail-card-title">
                  <FiMapPin /> Shipping Address
                </h3>
                <address className="order-detail-address">
                  {info.fullName  && <strong>{info.fullName}</strong>}
                  {info.address   && <span>{info.address}</span>}
                  <span>
                    {[info.city, info.state].filter(Boolean).join(', ')}
                    {info.postalCode ? ` ${info.postalCode}` : ''}
                  </span>
                  {info.country && <span>{info.country}</span>}
                  {info.phone   && <span className="order-detail-phone">{info.phone}</span>}
                </address>
              </div>

              <div className="order-detail-card">
                <h3 className="order-detail-card-title">
                  <FiCreditCard /> Payment
                </h3>
                <div className="order-detail-payment">
                  <span className={`order-detail-pay-status ${order.paymentStatus === 'paid' ? 'paid' : ''}`}>
                    {order.paymentStatus === 'paid' ? <><FiCheck /> Paid</> : (order.paymentStatus || 'Pending')}
                  </span>
                  {order.updatedAt && (
                    <p className="order-detail-updated">
                      Last updated {fmtDate(order.updatedAt)}
                    </p>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
