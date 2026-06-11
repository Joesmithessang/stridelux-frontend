import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { useAuth } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { WishlistProvider } from '../context/WishlistContext';
import LoadingSpinner from '../components/LoadingSpinner';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import Home from '../pages/Home';
import Shop from '../pages/Shop';
import ProductDetails from '../pages/ProductDetails';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Verify from '../pages/Verify';
import About from '../pages/About';
import Contact from '../pages/Contact';
import OrderConfirmation from '../pages/OrderConfirmation';
import Wishlist from '../pages/Wishlist';
import ForgotPassword from '../pages/ForgotPassword';
import Terms from '../pages/Terms';
import Privacy from '../pages/Privacy';
import Account from '../pages/Account';
import NotFound from '../pages/NotFound';

import AdminLayout from '../pages/admin/AdminLayout';
import AdminDashboard from '../pages/admin/AdminDashboard';
import ProductManagement from '../pages/admin/ProductManagement';
import OrderManagement from '../pages/admin/OrderManagement';
import UserManagement from '../pages/admin/UserManagement';
import Reports from '../pages/admin/Reports';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  return user ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { user, isAdmin, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (!user)    return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}

export default function AppRoutes() {
  return (
    <CartProvider>
      <WishlistProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1c1c1c',
              color: '#f0f0f0',
              border: '1px solid #2a2a2a',
              borderRadius: '8px',
              fontFamily: "'Inter', sans-serif",
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
            error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />

        <Routes>
          {/* Admin routes — no Navbar/Footer */}
          <Route
            path="/admin/*"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="orders" element={<OrderManagement />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="reports" element={<Reports />} />
          </Route>

          {/* All other routes — with Navbar & Footer */}
          <Route
            path="*"
            element={
              <>
                <Navbar />
                <Routes>
                  {/* Public */}
                  <Route path="/"                              element={<Home />} />
                  <Route path="/shop"                          element={<Shop />} />
                  <Route path="/product/:id"                   element={<ProductDetails />} />
                  <Route path="/cart"                          element={<Cart />} />
                  <Route path="/checkout"                      element={<Checkout />} />
                  <Route path="/login"                         element={<Login />} />
                  <Route path="/register"                      element={<Register />} />
                  <Route path="/verify"                        element={<Verify />} />
                  <Route path="/forgot-password"               element={<ForgotPassword />} />
                  <Route path="/about"                         element={<About />} />
                  <Route path="/contact"                       element={<Contact />} />
                  <Route path="/wishlist"                      element={<Wishlist />} />
                  <Route path="/order-confirmation/:orderId"   element={<OrderConfirmation />} />
                  <Route path="/terms"                         element={<Terms />} />
                  <Route path="/privacy"                       element={<Privacy />} />

                  {/* /orders → /account/orders (guests land on /login) */}
                  <Route path="/orders" element={<PrivateRoute><Navigate to="/account/orders" replace /></PrivateRoute>} />

                  {/* Authenticated customers */}
                  <Route path="/account"          element={<PrivateRoute><Account /></PrivateRoute>} />
                  <Route path="/account/orders"   element={<PrivateRoute><Account /></PrivateRoute>} />
                  <Route path="/account/settings" element={<PrivateRoute><Account /></PrivateRoute>} />

                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Footer />
              </>
            }
          />
        </Routes>
      </WishlistProvider>
    </CartProvider>
  );
}
