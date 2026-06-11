import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { signIn: authSignIn, confirmNewPassword, isGuest, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [form, setForm]       = useState({ email: '', password: '' });
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);

  // Step: 'credentials' → normal login form
  //       'new-password' → Cognito requires a permanent password to be set
  const [step, setStep]               = useState('credentials');
  const [newPw, setNewPw]             = useState('');
  const [confirmPw, setConfirmPw]     = useState('');
  const [showNewPw, setShowNewPw]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Redirect if the user is ALREADY logged in when they arrive at /login.
  // Runs only when the initial session check finishes (authLoading goes false).
  useEffect(() => {
    if (!authLoading && !isGuest) {
      navigate(isAdmin ? '/admin' : from, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading]);

  const handleCredentials = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await authSignIn(form.email, form.password);

      if (!result.isSignedIn && result.nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
        setStep('new-password');
        toast('Please set a permanent password to continue.', { icon: '🔐' });
        return;
      }

      toast.success('Welcome back!');
      navigate(result.group === 'Admins' ? '/admin' : from, { replace: true });
    } catch (err) {
      toast.error(err?.message || 'Sign in failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleNewPassword = async (e) => {
    e.preventDefault();
    if (newPw !== confirmPw) {
      toast.error('Passwords do not match.');
      return;
    }
    if (newPw.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      const { group } = await confirmNewPassword(newPw);
      toast.success('Password set! Welcome.');
      navigate(group === 'Admins' ? '/admin' : from, { replace: true });
    } catch (err) {
      toast.error(err?.message || 'Failed to set password. Please try again.');
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
            <h2>Step Into<br />Something New.</h2>
            <p>Premium sneakers and streetwear delivered to your door.</p>
            <img src="/images/jordan-4.jpg" alt="Premium sneakers" className="auth-img" />
          </div>
        </div>

        <div className="auth-form-side">
          <div className="auth-card">

            {step === 'credentials' && (
              <>
                <div className="auth-card-header">
                  <h1>Welcome back</h1>
                  <p>Sign in to your STRIDELUX account</p>
                </div>

                <form onSubmit={handleCredentials} className="auth-form">
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
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <div className="input-icon-wrap">
                      <FiLock className="input-icon" />
                      <input
                        id="password"
                        type={showPw ? 'text' : 'password'}
                        required
                        autoComplete="current-password"
                        placeholder="Your password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                      />
                      <button type="button" className="pw-toggle" onClick={() => setShowPw(!showPw)}>
                        {showPw ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                  </div>

                  <div className="auth-options">
                    <label className="remember-label">
                      <input type="checkbox" /> Remember me
                    </label>
                    <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
                  </div>

                  <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                    {loading ? 'Signing in…' : 'Sign In'}
                  </button>
                </form>

                <p className="auth-switch">
                  Don't have an account? <Link to="/register">Create one free</Link>
                </p>
              </>
            )}

            {step === 'new-password' && (
              <>
                <div className="auth-card-header">
                  <h1>Set New Password</h1>
                  <p>Your account requires a permanent password before you can continue.</p>
                </div>

                <form onSubmit={handleNewPassword} className="auth-form">
                  <div className="form-group">
                    <label htmlFor="new-password">New Password</label>
                    <div className="input-icon-wrap">
                      <FiLock className="input-icon" />
                      <input
                        id="new-password"
                        type={showNewPw ? 'text' : 'password'}
                        required
                        autoComplete="new-password"
                        placeholder="Min 8 characters"
                        value={newPw}
                        onChange={(e) => setNewPw(e.target.value)}
                      />
                      <button type="button" className="pw-toggle" onClick={() => setShowNewPw(!showNewPw)}>
                        {showNewPw ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirm-password">Confirm Password</label>
                    <div className="input-icon-wrap">
                      <FiLock className="input-icon" />
                      <input
                        id="confirm-password"
                        type={showConfirm ? 'text' : 'password'}
                        required
                        autoComplete="new-password"
                        placeholder="Repeat new password"
                        value={confirmPw}
                        onChange={(e) => setConfirmPw(e.target.value)}
                      />
                      <button type="button" className="pw-toggle" onClick={() => setShowConfirm(!showConfirm)}>
                        {showConfirm ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                    {loading ? 'Saving…' : 'Set Password & Continue'}
                  </button>
                </form>
              </>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}
