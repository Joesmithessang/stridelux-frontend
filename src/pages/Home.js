import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FiTruck, FiCheckCircle, FiShield, FiRefreshCw } from 'react-icons/fi';
import products from '../data/products';
import ProductCard from '../components/ProductCard';

function Home() {
  const featuredProducts = products.slice(0, 4);

  const heroSlides = [
    {
      image: '/images/hero-shoe.jpg',
      title: 'Limited Edition Sneakers',
    },
    {
      image: '/images/jordan-4.jpg',
      title: 'Air Jordan Collection',
    },
    {
      image: '/images/air-max-270.png',
      title: 'Nike Air Max Series',
    },
    {
      image: '/images/nike-hoodie.png',
      title: 'Performance Apparel',
    },
    {
      image: '/images/jordan-cap.png',
      title: 'Premium Accessories',
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) =>
        prevSlide === heroSlides.length - 1 ? 0 : prevSlide + 1
      );
    }, 3500);

    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === heroSlides.length - 1 ? 0 : prevSlide + 1
    );
  };

  const previousSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === 0 ? heroSlides.length - 1 : prevSlide - 1
    );
  };

  return (
    <main>
      <section className="hero">
        <div className="hero-content">
          <p className="tagline">LIMITED EDITION</p>

          <h1>
            EXCLUSIVE <br />
            BY <span>DESIGN</span>
          </h1>

          <p className="hero-text">
            Premium footwear and performance apparel for those who move different.
          </p>

          <div className="hero-buttons">
            <Link to="/shop" className="primary-btn">
              SHOP SNEAKERS
            </Link>

            <Link to="/shop" className="secondary-btn">
              SHOP APPAREL
            </Link>
          </div>
        </div>

        <div className="hero-image slider-wrapper">
          <button className="slide-arrow left-arrow" onClick={previousSlide}>
            ‹
          </button>

          <div className="shoe-card">
            <img
              src={heroSlides[currentSlide].image}
              alt={heroSlides[currentSlide].title}
            />
          </div>

          <button className="slide-arrow right-arrow" onClick={nextSlide}>
            ›
          </button>

          <div className="slide-dots">
            {heroSlides.map((slide, index) => (
              <button
                key={slide.title}
                className={currentSlide === index ? 'dot active-dot' : 'dot'}
                onClick={() => setCurrentSlide(index)}
              ></button>
            ))}
          </div>
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <div className="feature-icon">
            <FiTruck />
          </div>
          <div>
            <h3>Worldwide Shipping</h3>
            <p>Fast delivery worldwide</p>
          </div>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <FiCheckCircle />
          </div>
          <div>
            <h3>Authentic Products</h3>
            <p>100% genuine brands</p>
          </div>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <FiShield />
          </div>
          <div>
            <h3>Secure Payments</h3>
            <p>Safe checkout process</p>
          </div>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <FiRefreshCw />
          </div>
          <div>
            <h3>Easy Returns</h3>
            <p>30-day return policy</p>
          </div>
        </div>
      </section>

      <section className="collection">
        <div className="section-header">
          <div>
            <p className="tagline dark">NEW ARRIVALS</p>
            <h2>Featured Products</h2>
          </div>

          <Link to="/shop" className="view-btn">
            View All
          </Link>
        </div>

        <div className="product-grid">
          {featuredProducts.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
      </section>
    </main>
  );
}

export default Home;