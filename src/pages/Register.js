import { Link } from 'react-router-dom';

function Register() {
  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1>Create Account</h1>
        <p>Join STRIDELUX and get access to exclusive drops.</p>

        <input type="text" placeholder="Full Name" />
        <input type="email" placeholder="Email Address" />
        <input type="password" placeholder="Password" />

        <button className="details-cart-btn">Create Account</button>

        <p>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </main>
  );
}

export default Register;