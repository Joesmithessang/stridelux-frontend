import { Link } from 'react-router-dom';

function About() {
  return (
    <main className="about-page">
      <section className="about-hero">
        <p className="tagline">ABOUT STRIDELUX</p>
        <h1>Built for those who move different.</h1>
        <p>
          STRIDELUX is a premium sneaker and performance apparel store focused on
          exclusive footwear, activewear, and curated lifestyle essentials.
        </p>
      </section>

      <section className="about-content">
        <div className="about-card">
          <h2>Who We Are</h2>
          <p>
            STRIDELUX was created for sneaker lovers, athletes, and style-focused
            customers who want authentic products, smooth shopping experiences,
            and access to premium collections.
          </p>
        </div>

        <div className="about-card">
          <h2>Our Mission</h2>
          <p>
            Our mission is to deliver a secure, fast, and modern e-commerce
            experience where customers can discover limited-edition sneakers,
            apparel, and accessories with confidence.
          </p>
        </div>

        <div className="about-card">
          <h2>Why Choose Us</h2>
          <ul>
            <li>100% authentic products</li>
            <li>Secure checkout experience</li>
            <li>Fast worldwide shipping</li>
            <li>Easy 30-day returns</li>
            <li>Premium sneaker and apparel collections</li>
          </ul>
        </div>
      </section>

      <section className="about-cta">
        <h2>Step into excellence with STRIDELUX.</h2>
        <Link to="/shop" className="primary-btn">
          Shop Collection
        </Link>
      </section>
    </main>
  );
}

export default About;