import { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiSend, FiChevronDown } from 'react-icons/fi';
import toast from 'react-hot-toast';

const FAQS = [
  { q: 'How long does shipping take?', a: 'Standard shipping takes 5–7 business days. Express shipping delivers in 1–3 business days. Free standard shipping on all orders over $150.' },
  { q: 'What is your return policy?', a: 'We offer hassle-free 30-day returns on all unworn items in original packaging. Returns are free for orders shipped within Canada.' },
  { q: 'Are all products authentic?', a: '100% guaranteed. Every product on STRIDELUX is sourced directly from authorized brand distributors. We do not carry unauthorized replicas or fakes.' },
  { q: 'How do I track my order?', a: 'Once your order ships, you\'ll receive an email with a tracking number. You can also view your order status under My Account → Orders.' },
  { q: 'Can I change or cancel my order?', a: 'Orders can be changed or cancelled within 1 hour of placement. After that, the order enters fulfillment. Contact us immediately via the form below.' },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    toast.success('Message sent! We\'ll reply within 24 hours.');
    setForm({ name: '', email: '', subject: '', message: '' });
    setLoading(false);
  };

  return (
    <main className="contact-page">
      <div className="page-hero-mini">
        <div className="section-container">
          <p className="section-overline">Get in Touch</p>
          <h1>Contact Us</h1>
          <p className="page-subtitle">We're here to help. Reach out anytime.</p>
        </div>
      </div>

      <div className="section-container contact-layout">
        {/* Contact info */}
        <div className="contact-info">
          <h2>How to reach us</h2>
          <div className="contact-item">
            <div className="contact-icon"><FiMail /></div>
            <div>
              <h4>Email</h4>
              <p>support@stridelux.com</p>
              <p>Response within 24 hours</p>
            </div>
          </div>
          <div className="contact-item">
            <div className="contact-icon"><FiPhone /></div>
            <div>
              <h4>Phone</h4>
              <p>+1 (416) 555-0100</p>
              <p>Mon–Fri, 9AM–6PM EST</p>
            </div>
          </div>
          <div className="contact-item">
            <div className="contact-icon"><FiMapPin /></div>
            <div>
              <h4>Head Office</h4>
              <p>Toronto, Ontario</p>
              <p>Canada</p>
            </div>
          </div>
        </div>

        {/* Contact form */}
        <form className="contact-form" onSubmit={handleSubmit}>
          <h2>Send us a message</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Name</label>
              <input required placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input required type="email" placeholder="your@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label>Subject</label>
            <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required>
              <option value="">Select a topic…</option>
              <option>Order Issue</option>
              <option>Returns & Exchanges</option>
              <option>Product Question</option>
              <option>Shipping Inquiry</option>
              <option>Account Help</option>
              <option>Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Message</label>
            <textarea required rows={5} placeholder="Tell us how we can help…" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            <FiSend /> {loading ? 'Sending…' : 'Send Message'}
          </button>
        </form>
      </div>

      {/* FAQ */}
      <section className="faq-section" id="faq">
        <div className="section-container">
          <div className="section-header center">
            <p className="section-overline">Common Questions</p>
            <h2 className="section-heading">FAQ</h2>
          </div>
          <div className="faq-list">
            {FAQS.map((faq, i) => (
              <div key={i} className={`faq-item ${openFaq === i ? 'open' : ''}`}>
                <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  {faq.q}
                  <FiChevronDown className="faq-chevron" />
                </button>
                {openFaq === i && <p className="faq-answer">{faq.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
