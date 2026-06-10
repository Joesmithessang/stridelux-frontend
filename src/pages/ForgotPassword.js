import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { USE_MOCK } from '../config/aws-config';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 800));
      } else {
        const { resetPassword } = await import('aws-amplify/auth');
        await resetPassword({ username: email });
      }
      setSent(true);
    } catch (err) {
      toast.error(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-split">
        <div className="auth-visual">
          <div className="auth-visual-content">
            <Link to="/" className="auth-logo">STRIDE<span>LUX</span></Link>
            <h2>Reset Your<br />Password.</h2>
            <p>We'll send a reset link to your email address.</p>
            <img src="/images/jordan-4.jpg" alt="Premium sneakers" className="auth-img" />
          </div>
        </div>

        <div className="auth-form-side">
          <div className="auth-card">
            {sent ? (
              <div className="forgot-success">
                <FiCheckCircle className="forgot-success-icon" />
                <h2>Check your inbox</h2>
                <p>
                  We sent a password reset link to <strong>{email}</strong>.
                  Follow the instructions in the email to reset your password.
                </p>
                <Link to="/login" className="btn btn-primary btn-full">
                  Back to Sign In
                </Link>
              </div>
            ) : (
              <>
                <div className="auth-card-header">
                  <h1>Forgot password?</h1>
                  <p>Enter your email and we'll send you a reset link</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <div className="input-icon-wrap">
                      <FiMail className="input-icon" />
                      <input
                        id="email"
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                    {loading ? 'Sending…' : 'Send Reset Link'}
                  </button>
                </form>

                <p className="auth-switch">
                  <Link to="/login" className="forgot-back-link">
                    <FiArrowLeft /> Back to Sign In
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
