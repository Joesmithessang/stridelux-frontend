import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="auth-page" style={{ minHeight: '60vh' }}>
      <div style={{ textAlign: 'center', padding: '6rem 1rem' }}>
        <h1 style={{ fontSize: '6rem', fontWeight: 800, color: 'var(--accent)', lineHeight: 1 }}>404</h1>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Page Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary">Back to Home</Link>
      </div>
    </main>
  );
}
