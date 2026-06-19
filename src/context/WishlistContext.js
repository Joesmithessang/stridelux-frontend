import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { wishlistService } from '../services/wishlistService';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { user, isGuest, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState([]);

  const initializedRef = useRef(false);
  const prevUserRef    = useRef(null);
  const wishlistRef    = useRef([]);  // latest snapshot for synchronous reads in callbacks

  useEffect(() => { wishlistRef.current = wishlist; }, [wishlist]);

  // ── Bootstrap + auth transitions ────────────────────────────────────────
  useEffect(() => {
    if (authLoading) return;

    if (!initializedRef.current) {
      initializedRef.current = true;
      prevUserRef.current = user;

      if (user) {
        // Already logged in on mount: fetch server wishlist
        wishlistService.get(user.userId)
          .then((items) => setWishlist(items || []))
          .catch(() => setWishlist([]));
      }
      // Guest on mount: wishlist stays empty — no localStorage for wishlists
      return;
    }

    const prevUser = prevUserRef.current;
    prevUserRef.current = user;

    if (!prevUser && user) {
      // Login: fetch server wishlist (no merge needed — guest wishlist not persisted)
      wishlistService.get(user.userId)
        .then((items) => setWishlist(items || []))
        .catch(() => setWishlist([]));
    } else if (prevUser && !user) {
      // Logout: clear in-memory state only
      setWishlist([]);
    }
  }, [user, authLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Mutations ────────────────────────────────────────────────────────────

  const toggleWishlist = useCallback((product) => {
    if (isGuest) {
      toast('Log in to save items to your wishlist', { icon: '❤️' });
      navigate('/login');
      return;
    }

    const exists = wishlistRef.current.some((i) => i.id === product.id);
    if (exists) {
      setWishlist((prev) => prev.filter((i) => i.id !== product.id));
      wishlistService.removeItem(user?.userId, product.id).catch(() => {});
    } else {
      setWishlist((prev) => [...prev, product]);
      wishlistService.addItem(user?.userId, product).catch(() => {});
    }
  }, [isGuest, user, navigate]);

  const isWishlisted = useCallback(
    (productId) => wishlistRef.current.some((i) => i.id === productId),
    []  // wishlistRef never changes — safe to omit from deps
  );

  const clearWishlist = useCallback(() => {
    setWishlist([]);
    if (!isGuest) {
      wishlistService.clear(user?.userId).catch(() => {});
    }
  }, [isGuest, user]);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isWishlisted, clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
