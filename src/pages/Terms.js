import { Link } from 'react-router-dom';

export default function Terms() {
  return (
    <main className="legal-page">
      <div className="legal-container">
        <div className="legal-header">
          <p className="legal-breadcrumb"><Link to="/">Home</Link> / Terms of Service</p>
          <h1>Terms of Service</h1>
          <p className="legal-updated">Last updated: June 1, 2026</p>
        </div>

        <div className="legal-body">
          <section>
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using the STRIDELUX website and services, you agree to be bound
              by these Terms of Service. If you do not agree to these terms, please do not use
              our services.
            </p>
          </section>

          <section>
            <h2>2. Use of the Service</h2>
            <p>
              You may use STRIDELUX solely for lawful purposes and in accordance with these
              Terms. You agree not to use the service in any way that violates applicable
              federal, provincial, or local laws or regulations.
            </p>
          </section>

          <section>
            <h2>3. Accounts</h2>
            <p>
              When you create an account with us, you must provide accurate, complete, and
              current information. You are responsible for safeguarding your password and for
              any activities or actions under your account.
            </p>
          </section>

          <section>
            <h2>4. Orders and Payments</h2>
            <p>
              All orders are subject to acceptance and availability. We reserve the right to
              refuse or cancel any order at our discretion. Prices are listed in Canadian
              dollars and are subject to applicable taxes. Payment is processed securely
              through our payment partners.
            </p>
          </section>

          <section>
            <h2>5. Shipping and Returns</h2>
            <p>
              Shipping times are estimates and are not guaranteed. Returns are accepted within
              30 days of delivery for items in original, unworn condition with tags attached.
              Sale items are final sale unless otherwise noted.
            </p>
          </section>

          <section>
            <h2>6. Intellectual Property</h2>
            <p>
              The STRIDELUX name, logo, and all content on this website are the property of
              STRIDELUX and are protected by applicable intellectual property laws. You may
              not reproduce, distribute, or create derivative works without our express
              written permission.
            </p>
          </section>

          <section>
            <h2>7. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, STRIDELUX shall not be liable for any
              indirect, incidental, special, consequential, or punitive damages arising from
              your use of or inability to use our services.
            </p>
          </section>

          <section>
            <h2>8. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will notify users
              of significant changes by posting a notice on our website. Your continued use
              of the service after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2>9. Contact</h2>
            <p>
              If you have questions about these Terms, please{' '}
              <Link to="/contact">contact us</Link>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
