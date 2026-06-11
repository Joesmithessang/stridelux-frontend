import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiAtSign, FiMail, FiLock, FiPhone, FiEye, FiEyeOff, FiCheck } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const PW_RULES = [
  { label: 'At least 8 characters',  test: (v) => v.length >= 8 },
  { label: 'One uppercase letter',    test: (v) => /[A-Z]/.test(v) },
  { label: 'One number',              test: (v) => /\d/.test(v) },
  { label: 'One special character',   test: (v) => /[!@#$%^&*]/.test(v) },
];

export default function Register() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '', name: '', email: '', phoneNumber: '', password: '', confirm: '',
  });
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const pwRulePassed = PW_RULES.map((r) => r.test(form.password));
  const pwValid      = pwRulePassed.every(Boolean);
  const pwMatch      = form.password === form.confirm && form.confirm.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pwValid) { toast.error('Password does not meet requirements'); return; }
    if (!pwMatch) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      await signUp(form);
      toast.success('Account created! Check your email to verify.');
      navigate('/verify', { state: { username: form.username } });
    } catch (err) {
      toast.error(err?.message || 'Registration failed. Please try again.');
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
            <h2>Join the<br />Movement.</h2>
            <p>Get early access to drops, exclusive discounts, and order tracking.</p>
            <img src="/images/nike-hoodie.png" alt="Join STRIDELUX" className="auth-img" />
          </div>
        </div>

        <div className="auth-form-side">
          <div className="auth-card">
            <div className="auth-card-header">
              <h1>Create Account</h1>
              <p>Join thousands of sneakerheads worldwide</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label>Username</label>
                <div className="input-icon-wrap">
                  <FiAtSign className="input-icon" />
                  <input
                    required
                    placeholder="janesmith"
                    autoComplete="username"
                    value={form.username}
                    onChange={update('username')}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Full Name</label>
                <div className="input-icon-wrap">
                  <FiUser className="input-icon" />
                  <input
                    required
                    placeholder="Jane Smith"
                    autoComplete="name"
                    value={form.name}
                    onChange={update('name')}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <div className="input-icon-wrap">
                  <FiMail className="input-icon" />
                  <input
                    required
                    type="email"
                    placeholder="jane@example.com"
                    autoComplete="email"
                    value={form.email}
                    onChange={update('email')}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>
                  Phone Number <span className="label-optional">E.164 format — +12895550123</span>
                </label>
                <div className="input-icon-wrap">
                  <FiPhone className="input-icon" />
                  <input
                    required
                    type="tel"
                    placeholder="+12895550123"
                    autoComplete="tel"
                    value={form.phoneNumber}
                    onChange={update('phoneNumber')}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Password</label>
                <div className="input-icon-wrap">
                  <FiLock className="input-icon" />
                  <input
                    required
                    type={showPw ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    autoComplete="new-password"
                    value={form.password}
                    onChange={update('password')}
                  />
                  <button type="button" className="pw-toggle" onClick={() => setShowPw(!showPw)}>
                    {showPw ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {form.password && (
                  <div className="pw-rules">
                    {PW_RULES.map((r, i) => (
                      <div key={r.label} className={`pw-rule ${pwRulePassed[i] ? 'pass' : ''}`}>
                        <FiCheck /> {r.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <div className="input-icon-wrap">
                  <FiLock className="input-icon" />
                  <input
                    required
                    type={showPw ? 'text' : 'password'}
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                    value={form.confirm}
                    onChange={update('confirm')}
                    className={form.confirm && !pwMatch ? 'input-error' : form.confirm && pwMatch ? 'input-ok' : ''}
                  />
                </div>
              </div>

              <label className="terms-label">
                <input type="checkbox" required />
                I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>
              </label>

              <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? 'Creating account…' : 'Create Account'}
              </button>
            </form>

            <p className="auth-switch">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
