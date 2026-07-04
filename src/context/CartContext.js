import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { cartService } from '../services/cartService';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user, isGuest, loading: authLoading } = useAuth();

  const [cartItems, setCartItems] = useState([]);

  // Refs — survive re-renders without causing effect re-runs
  const initializedRef  = useRef(false);
  const prevUserRef     = useRef(null);
  const cartItemsRef    = useRef([]);   // latest cart snapshot for debounced reads
  const debounceTimers  = useRef({});   // cartItemId → setTimeout handle

  // Keep cartItemsRef current so debounced quantity syncs see fresh data
  useEffect(() => { cartItemsRef.current = cartItems; }, [cartItems]);

  // Guest: persist to localStorage. Skip while auth is still resolving.
  useEffect(() => {
    if (authLoading || !isGuest) return;
    localStorage.setItem('stridelux_cart', JSON.stringify(cartItems));
  }, [cartItems, isGuest, authLoading]);

  // ── Bootstrap + auth transitions ────────────────────────────────────────
  useEffect(() => {
    if (authLoading) return;

    if (!initializedRef.current) {
      // First time auth resolves
      initializedRef.current = true;
      prevUserRef.current = user;

      if (!user) {
        // Guest on mount: hydrate from localStorage
        try { setCartItems(JSON.parse(localStorage.getItem('stridelux_cart') || '[]')); }
        catch { setCartItems([]); }
      } else {
        // Logged in on mount: if landing from a Stripe redirect, the cart was
        // already charged — clear it without fetching the (now-stale) server cart
        const pendingOrderId = sessionStorage.getItem('stripe_pending_order');
        if (pendingOrderId) {
          setCartItems([]);
          sessionStorage.removeItem('stripe_pending_order');
          // Small delay to ensure Amplify's token cache is settled after hard reload
          // before making an authenticated server call
          setTimeout(() => {
            cartService.clear(user.userId).catch(() => {});
          }, 800);
        } else {
          cartService.get(user.userId)
            .then((items) => setCartItems(items || []))
            .catch(() => setCartItems([]));
        }
      }
      return;
    }

    // Subsequent auth state changes
    const prevUser = prevUserRef.current;
    prevUserRef.current = user;

    if (!prevUser && user) {
      // Guest → logged in: merge localStorage cart into server cart
      mergeGuestCart(user);
    } else if (prevUser && !user) {
      // Logged in → logged out: wipe in-memory state and localStorage
      setCartItems([]);
      localStorage.removeItem('stridelux_cart');
    }
  }, [user, authLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  async function mergeGuestCart(loggedInUser) {
    let guestItems = [];
    try { guestItems = JSON.parse(localStorage.getItem('stridelux_cart') || '[]'); } catch {}

    const serverItems = await cartService.get(loggedInUser.userId).catch(() => []) || [];

    if (guestItems.length === 0) {
      setCartItems(serverItems);
    } else {
      const merged = [...serverItems];
      for (const guestItem of guestItems) {
        const existing = merged.find((i) => i.cartItemId === guestItem.cartItemId);
        if (existing) {
          // Conflict: take the higher quantity
          if (guestItem.quantity > existing.quantity) {
            existing.quantity = guestItem.quantity;
            cartService.updateQuantity(loggedInUser.userId, existing.id, existing.selectedSize, guestItem.quantity).catch(() => {});
          }
        } else {
          merged.push(guestItem);
          cartService.addItem(loggedInUser.userId, guestItem).catch(() => {});
        }
      }
      setCartItems(merged);
    }

    localStorage.removeItem('stridelux_cart');
  }

  // ── Mutations ────────────────────────────────────────────────────────────

  const addToCart = useCallback((product, selectedSize = 'One Size', quantity = 1) => {
    const cartItemId = `${product.id}-${selectedSize}`;
    const newItem = {
      cartItemId,
      id: product.id,
      name: product.name,
      category: product.category,
      brand: product.brand,
      price: product.price,
      image: product.thumbnail || product.image,
      selectedSize,
      quantity,
    };

    // Read current quantity BEFORE the state update so we can send the correct
    // new total to the backend (POST /cart expects total, not delta)
    const existing = cartItemsRef.current.find((i) => i.cartItemId === cartItemId);
    const serverQuantity = (existing?.quantity || 0) + quantity;

    setCartItems((prev) => {
      const ex = prev.find((i) => i.cartItemId === cartItemId);
      if (ex) {
        return prev.map((i) =>
          i.cartItemId === cartItemId ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, newItem];
    });

    if (!isGuest) {
      cartService.addItem(user?.userId, { ...newItem, quantity: serverQuantity }).catch(() => {});
    }
  }, [isGuest, user]);

  const increaseQuantity = useCallback((cartItemId) => {
    setCartItems((prev) =>
      prev.map((i) => i.cartItemId === cartItemId ? { ...i, quantity: i.quantity + 1 } : i)
    );

    if (!isGuest) {
      clearTimeout(debounceTimers.current[cartItemId]);
      debounceTimers.current[cartItemId] = setTimeout(() => {
        const item = cartItemsRef.current.find((i) => i.cartItemId === cartItemId);
        if (item) cartService.updateQuantity(user?.userId, item.id, item.selectedSize, item.quantity).catch(() => {});
      }, 500);
    }
  }, [isGuest, user]);

  const decreaseQuantity = useCallback((cartItemId) => {
    setCartItems((prev) =>
      prev.map((i) =>
        i.cartItemId === cartItemId && i.quantity > 1 ? { ...i, quantity: i.quantity - 1 } : i
      )
    );

    if (!isGuest) {
      clearTimeout(debounceTimers.current[cartItemId]);
      debounceTimers.current[cartItemId] = setTimeout(() => {
        const item = cartItemsRef.current.find((i) => i.cartItemId === cartItemId);
        if (item) cartService.updateQuantity(user?.userId, item.id, item.selectedSize, item.quantity).catch(() => {});
      }, 500);
    }
  }, [isGuest, user]);

  const removeFromCart = useCallback((cartItemId) => {
    const item = cartItemsRef.current.find((i) => i.cartItemId === cartItemId);
    setCartItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
    if (!isGuest && item) {
      cartService.removeItem(user?.userId, item.id, item.selectedSize).catch(() => {});
    }
  }, [isGuest, user]);

  // clearCart also wipes the server cart for logged-in users — covers OrderConfirmation
  const clearCart = useCallback(() => {
    setCartItems([]);
    if (!isGuest) {
      cartService.clear(user?.userId).catch(() => {});
    }
  }, [isGuest, user]);

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal  = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping  = cartItems.length > 0 ? 10 : 0;
  const total     = subtotal + shipping;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        subtotal,
        shipping,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
