import { Link } from 'react-router-dom';

function Login() {
  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1>Welcome Back</h1>
        <p>Sign in to continue shopping.</p>

        <input type="email" placeholder="Email Address" />
        <input type="password" placeholder="Password" />

        <button className="details-cart-btn">Sign In</button>

        <p>
          Do not have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </main>
  );
}

export default Login;