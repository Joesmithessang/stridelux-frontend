import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMail, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Verify() {
  const { confirmSignUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState(location.state?.username || '');
  const [code, setCode]         = useState('');
  const [loading, setLoading]   = useState(false);

  const hasUsername = Boolean(location.state?.username);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await confirmSignUp(username, code);
      toast.success('Email verified! You can now sign in.');
      navigate('/login', { state: { message: 'Account verified! You can now sign in.' } });
    } catch (err) {
      toast.error(err?.message || 'Verification failed. Check the code and try again.');
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
            <h2>Almost<br />There.</h2>
            <p>Check your inbox for the 6-digit code we just sent.</p>
            <img src="/images/jordan-4.jpg" alt="Verify your account" className="auth-img" />
          </div>
        </div>

        <div className="auth-form-side">
          <div className="auth-card">
            <div className="auth-card-header">
              <h1>Verify your email</h1>
              <p>
                {hasUsername
                  ? <>Enter the code sent to <strong>{username}</strong></>
                  : 'Enter your email and the 6-digit code we sent.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {/* Show email field only when username wasn't passed from Register */}
              {!hasUsername && (
                <div className="form-group">
                  <label htmlFor="username">Email Address</label>
                  <div className="input-icon-wrap">
                    <FiUser className="input-icon" />
                    <input
                      id="username"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="your@email.com"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="code">Verification Code</label>
                <div className="input-icon-wrap">
                  <FiMail className="input-icon" />
                  <input
                    id="code"
                    type="text"
                    required
                    inputMode="numeric"
                    placeholder="123456"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-full"
                disabled={loading || code.length < 6 || !username}
              >
                {loading ? 'Verifying…' : 'Verify Email'}
              </button>
            </form>

            <p className="auth-switch">
              Already verified? <Link to="/login">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
