import { createContext, useContext, useState, useCallback } from 'react';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('stridelux_wishlist') || '[]');
    } catch {
      return [];
    }
  });

  const save = (items) => {
    setWishlist(items);
    localStorage.setItem('stridelux_wishlist', JSON.stringify(items));
  };

  const toggleWishlist = useCallback((product) => {
    setWishlist((prev) => {
      const exists = prev.find((i) => i.id === product.id);
      const next = exists ? prev.filter((i) => i.id !== product.id) : [...prev, product];
      localStorage.setItem('stridelux_wishlist', JSON.stringify(next));
      return next;
    });
  }, []);

  const isWishlisted = useCallback(
    (productId) => wishlist.some((i) => i.id === productId),
    [wishlist]
  );

  const clearWishlist = useCallback(() => save([]), []);

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
