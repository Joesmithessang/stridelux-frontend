import { Link } from 'react-router-dom';
import { FiArrowRight, FiShield, FiTruck, FiRefreshCw, FiStar } from 'react-icons/fi';

const STATS = [
  { value: '50K+', label: 'Happy Customers' },
  { value: '2,500+', label: 'Products Available' },
  { value: '98%', label: 'Positive Reviews' },
  { value: '30-day', label: 'Return Policy' },
];

const VALUES = [
  { icon: <FiShield />, title: 'Authenticity', desc: 'Every product is sourced directly from authorized brand distributors. Zero fakes, zero compromises.' },
  { icon: <FiTruck />, title: 'Speed', desc: 'Same-day dispatch on orders before 2PM. Express delivery available to major cities across North America.' },
  { icon: <FiRefreshCw />, title: 'Trust', desc: 'Hassle-free 30-day returns. If it isn\'t right, we make it right — no questions asked.' },
  { icon: <FiStar />, title: 'Curation', desc: 'Our buyers hand-pick every item. Only the heat makes the cut — limited drops, premium staples, and everything between.' },
];

export default function About() {
  return (
    <main className="about-page">
      {/* Hero */}
      <section className="about-hero">
        <div className="section-container">
          <p className="section-overline">Our Story</p>
          <h1>Built for those<br />who move different.</h1>
          <p className="about-hero-sub">
            STRIDELUX is a premium sneaker and performance apparel destination
            focused on exclusive footwear, curated activewear, and lifestyle essentials
            for people who move with intention.
          </p>
          <Link to="/shop" className="btn btn-primary btn-lg">
            Explore the Collection <FiArrowRight />
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="about-stats">
        <div className="section-container">
          <div className="stats-grid">
            {STATS.map((s) => (
              <div key={s.label} className="stat-item">
                <span className="stat-value">{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="about-mission">
        <div className="section-container about-mission-inner">
          <div className="mission-image">
            <img src="/images/jordan-4.jpg" alt="STRIDELUX collection" />
          </div>
          <div className="mission-text">
            <p className="section-overline">Our Mission</p>
            <h2>Connecting people with the shoes that define them.</h2>
            <p>
              We believe the right pair isn't just footwear — it's identity. That's why
              we've built a platform that brings together the most coveted sneakers on the
              planet with a shopping experience that matches their caliber: fast, secure,
              and designed for discovery.
            </p>
            <p>
              From limited Jordan retroes to everyday Nike performance staples, every drop
              on STRIDELUX is authenticated, curated, and delivered with care.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="about-values">
        <div className="section-container">
          <div className="section-header center">
            <p className="section-overline">What We Stand For</p>
            <h2 className="section-heading">Our Values</h2>
          </div>
          <div className="values-grid">
            {VALUES.map((v) => (
              <div key={v.title} className="value-card">
                <div className="value-icon">{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-strip">
        <div className="cta-strip-inner">
          <h2>Step into excellence<br />with STRIDELUX.</h2>
          <div className="cta-group">
            <Link to="/shop" className="btn btn-primary btn-lg">Shop Collection <FiArrowRight /></Link>
            <Link to="/contact" className="btn btn-ghost btn-lg">Contact Us</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
