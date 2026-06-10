import { Link } from 'react-router-dom';
import { FiInstagram, FiTwitter, FiFacebook, FiYoutube, FiMail } from 'react-icons/fi';

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* Brand column */}
        <div className="footer-brand">
          <Link to="/" className="footer-logo">STRIDE<span>LUX</span></Link>
          <p className="footer-tagline">
            Premium sneakers and streetwear for those who move with purpose.
          </p>
          <div className="footer-socials">
            <a href="#instagram" aria-label="Instagram" className="social-link"><FiInstagram /></a>
            <a href="#twitter" aria-label="Twitter" className="social-link"><FiTwitter /></a>
            <a href="#facebook" aria-label="Facebook" className="social-link"><FiFacebook /></a>
            <a href="#youtube" aria-label="YouTube" className="social-link"><FiYoutube /></a>
          </div>
        </div>

        {/* Shop links */}
        <div className="footer-col">
          <h4>Shop</h4>
          <ul>
            <li><Link to="/shop?category=Sneakers">Sneakers</Link></li>
            <li><Link to="/shop?category=Apparel">Apparel</Link></li>
            <li><Link to="/shop?category=Accessories">Accessories</Link></li>
            <li><Link to="/shop?tags=new">New Arrivals</Link></li>
            <li><Link to="/shop?tags=sale">Sale</Link></li>
          </ul>
        </div>

        {/* Help links */}
        <div className="footer-col">
          <h4>Help</h4>
          <ul>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/contact#faq">FAQ</Link></li>
            <li><Link to="/contact#shipping">Shipping Info</Link></li>
            <li><Link to="/contact#returns">Returns & Exchanges</Link></li>
            <li><Link to="/contact#sizing">Size Guide</Link></li>
          </ul>
        </div>

        {/* Account links */}
        <div className="footer-col">
          <h4>Account</h4>
          <ul>
            <li><Link to="/account">My Account</Link></li>
            <li><Link to="/account/orders">Order History</Link></li>
            <li><Link to="/wishlist">Wishlist</Link></li>
            <li><Link to="/login">Sign In</Link></li>
            <li><Link to="/register">Create Account</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="footer-newsletter">
          <h4>Stay in the loop</h4>
          <p>Get early access to drops, exclusive offers, and style news.</p>
          <form
            className="newsletter-form"
            onSubmit={(e) => { e.preventDefault(); }}
          >
            <div className="newsletter-input-wrap">
              <FiMail />
              <input type="email" placeholder="your@email.com" required />
            </div>
            <button type="submit" className="btn btn-primary btn-sm">Subscribe</button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {year} STRIDELUX. All rights reserved.</p>
        <div className="footer-legal">
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
