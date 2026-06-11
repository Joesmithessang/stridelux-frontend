import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

export default function ProtectedRoute({ children }) {
  const { isGuest, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner fullPage />;
  if (isGuest) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}
