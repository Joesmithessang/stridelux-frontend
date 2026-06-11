import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FiTruck, FiCheckCircle, FiShield, FiRefreshCw, FiArrowRight } from 'react-icons/fi';
import { productService } from '../services/productService';
import ProductCard from '../components/ProductCard';

const HERO_SLIDES = [
  { image: '/images/jordan-4.jpg', label: 'Jordan Collection', heading: 'Bred For\nThe Bold', sub: 'Air Jordan 4 Black Cat — Now Available' },
  { image: '/images/air-max-270.png', label: 'Nike Air Max', heading: 'Bigger\nAir. Always.', sub: 'The iconic 270° Air unit. All-day comfort.' },
  { image: '/images/nike-hoodie.png', label: 'Apparel', heading: 'Move In\nStyle', sub: 'Nike Tech Fleece — Lightweight warmth, refined silhouette.' },
];

const BRANDS = [
  { name: 'Nike', slug: 'Nike' },
  { name: 'Jordan', slug: 'Jordan' },
  { name: 'Adidas', slug: 'Adidas' },
  { name: 'New Balance', slug: 'New Balance' },
  { name: 'Puma', slug: 'Puma' },
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    productService.getAll({})
      .then((products) => {
        setFeatured(products.filter((p) => p.tags?.includes('bestseller')).slice(0, 4));
        setNewArrivals(products.filter((p) => p.tags?.includes('new')).slice(0, 4));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((s) => (s + 1) % HERO_SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <main className="home-page">
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-bg" style={{ backgroundImage: `url(${slide.image})` }} />
        <div className="hero-overlay" />
        <div className="hero-content">
          <span className="hero-label">{slide.label}</span>
          <h1 className="hero-heading">
            {slide.heading.split('\n').map((line, i) => (
              <span key={i}>{line}<br /></span>
            ))}
          </h1>
          <p className="hero-sub">{slide.sub}</p>
          <div className="hero-ctas">
            <Link to="/shop" className="btn btn-primary btn-lg">
              Shop Now <FiArrowRight />
            </Link>
            <Link to="/shop?tags=new" className="btn btn-ghost btn-lg">
              New Arrivals
            </Link>
          </div>
          {/* Slide indicators */}
          <div className="hero-dots">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                className={`hero-dot ${i === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(i)}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
        {/* Scroll cue */}
        <div className="hero-scroll-cue">
          <span>SCROLL</span>
          <div className="scroll-line" />
        </div>
      </section>

      {/* ── Trust bar ── */}
      <section className="trust-bar">
        <div className="trust-bar-inner">
          {[
            { icon: <FiTruck />, title: 'Free Shipping', sub: 'On orders over $150' },
            { icon: <FiCheckCircle />, title: '100% Authentic', sub: 'Guaranteed genuine products' },
            { icon: <FiShield />, title: 'Secure Checkout', sub: 'SSL encrypted payments' },
            { icon: <FiRefreshCw />, title: 'Free Returns', sub: '30-day hassle-free policy' },
          ].map((item) => (
            <div key={item.title} className="trust-item">
              <div className="trust-icon">{item.icon}</div>
              <div>
                <h4>{item.title}</h4>
                <p>{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Brands ── */}
      <section className="brands-section">
        <div className="section-container">
          <p className="section-overline">Curated Selection</p>
          <h2 className="section-heading">Shop By Brand</h2>
          <div className="brands-row">
            {BRANDS.map((b) => (
              <Link key={b.slug} to={`/shop?brand=${b.slug}`} className="brand-pill">
                {b.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bestsellers ── */}
      {featured.length > 0 && (
        <section className="products-section">
          <div className="section-container">
            <div className="section-header">
              <div>
                <p className="section-overline">Top Picks</p>
                <h2 className="section-heading">Bestsellers</h2>
              </div>
              <Link to="/shop" className="section-link">
                View All <FiArrowRight />
              </Link>
            </div>
            <div className="product-grid">
              {featured.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── Promo banner ── */}
      <section className="promo-banner">
        <div className="promo-banner-inner">
          <div className="promo-text">
            <span className="promo-overline">Limited Time</span>
            <h2>Up to 30% off<br /><span>Sale Collection</span></h2>
            <p>Grab your favourites before they're gone. New markdowns added daily.</p>
            <Link to="/shop?tags=sale" className="btn btn-accent btn-lg">
              Shop Sale <FiArrowRight />
            </Link>
          </div>
          <div className="promo-image">
            <img src="/images/air-max-270.png" alt="Sale collection" />
          </div>
        </div>
      </section>

      {/* ── New Arrivals ── */}
      {newArrivals.length > 0 && (
        <section className="products-section">
          <div className="section-container">
            <div className="section-header">
              <div>
                <p className="section-overline">Fresh In</p>
                <h2 className="section-heading">New Arrivals</h2>
              </div>
              <Link to="/shop?tags=new" className="section-link">
                View All <FiArrowRight />
              </Link>
            </div>
            <div className="product-grid">
              {newArrivals.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA strip ── */}
      <section className="cta-strip">
        <div className="cta-strip-inner">
          <h2>Built for every move.<br />Worn by every story.</h2>
          <Link to="/shop" className="btn btn-primary btn-lg">
            Explore the Collection <FiArrowRight />
          </Link>
        </div>
      </section>
    </main>
  );
}
