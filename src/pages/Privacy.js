import { Link } from 'react-router-dom';

export default function Privacy() {
  return (
    <main className="legal-page">
      <div className="legal-container">
        <div className="legal-header">
          <p className="legal-breadcrumb"><Link to="/">Home</Link> / Privacy Policy</p>
          <h1>Privacy Policy</h1>
          <p className="legal-updated">Last updated: June 1, 2026</p>
        </div>

        <div className="legal-body">
          <section>
            <h2>1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us, such as when you create an
              account, place an order, or contact support. This includes your name, email
              address, phone number, shipping address, and payment information (processed
              securely by our payment provider — we do not store full card details).
            </p>
          </section>

          <section>
            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Process and fulfill your orders</li>
              <li>Send order confirmations and shipping updates</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Send marketing communications (only with your consent)</li>
              <li>Improve our website and services</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2>3. Sharing Your Information</h2>
            <p>
              We do not sell, trade, or rent your personal information to third parties. We
              may share your information with trusted service providers who assist us in
              operating our website, processing payments, and fulfilling orders, subject to
              confidentiality agreements.
            </p>
          </section>

          <section>
            <h2>4. Cookies</h2>
            <p>
              We use cookies and similar tracking technologies to enhance your experience on
              our site, including remembering items in your cart and analyzing site traffic.
              You can disable cookies in your browser settings, though some features may
              not function properly.
            </p>
          </section>

          <section>
            <h2>5. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your personal
              information, including encryption in transit (HTTPS) and secure storage.
              However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2>6. Your Rights</h2>
            <p>
              You have the right to access, correct, or delete your personal information.
              You may also withdraw consent for marketing communications at any time by
              unsubscribing or contacting us directly.
            </p>
          </section>

          <section>
            <h2>7. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to fulfill the
              purposes outlined in this policy, unless a longer retention period is required
              by law.
            </p>
          </section>

          <section>
            <h2>8. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will post the revised
              policy on this page with an updated date. Your continued use of our services
              after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2>9. Contact</h2>
            <p>
              If you have questions about this Privacy Policy or how we handle your data,
              please <Link to="/contact">contact us</Link>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
