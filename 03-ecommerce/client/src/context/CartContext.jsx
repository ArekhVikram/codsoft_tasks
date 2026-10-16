import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext.jsx';

const CartContext = createContext(null);
const CART_STORAGE_KEY = 'nova_supply_cart_v1';

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const { addToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.warn('Could not save cart to localStorage', e);
    }
  }, [cartItems]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = (product, quantityToAdd = 1) => {
    const qty = Math.max(1, parseInt(quantityToAdd, 10) || 1);

    if (product.stock <= 0) {
      addToast(`'${product.name}' is currently out of stock.`, 'error');
      return false;
    }

    let itemExceeded = false;

    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.id === product.id);

      if (existingIndex > -1) {
        const currentQty = prev[existingIndex].quantity;
        const availableStock = product.stock ?? 99;

        if (currentQty + qty > availableStock) {
          itemExceeded = true;
          const allowedAdd = availableStock - currentQty;
          if (allowedAdd <= 0) {
            return prev;
          }
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: availableStock
          };
          return updated;
        }

        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: currentQty + qty
        };
        return updated;
      } else {
        const initialQty = Math.min(qty, product.stock ?? 99);
        return [
          ...prev,
          {
            id: product.id || product._id,
            productId: product.id || product._id,
            name: product.name,
            subtitle: product.subtitle,
            category: product.category,
            price: Number(product.price),
            stock: product.stock ?? 99,
            image: product.images && product.images.length > 0 ? product.images[0] : '',
            quantity: initialQty
          }
        ];
      }
    });

    if (itemExceeded) {
      addToast(`Reached maximum available inventory for '${product.name}'.`, 'error');
    } else {
      addToast(`Added '${product.name}' to cart.`, 'success');
    }

    setIsCartOpen(true);
    return true;
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prev =>
      prev.map(item => {
        if (item.id === productId || item.productId === productId) {
          if (newQuantity > item.stock) {
            addToast(`Only ${item.stock} available in stock.`, 'error');
            return { ...item, quantity: item.stock };
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => {
      const removed = prev.find(item => item.id === productId || item.productId === productId);
      if (removed) {
        addToast(`Removed '${removed.name}' from cart.`, 'info');
      }
      return prev.filter(item => item.id !== productId && item.productId !== productId);
    });
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedPromo(null);
    setPromoCode('');
  };

  const applyPromo = (code) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'NOVA10') {
      setAppliedPromo({ code: 'NOVA10', discountPercent: 0.10, label: '10% Off' });
      addToast('Promo code NOVA10 applied: 10% discount.', 'success');
      return true;
    } else if (clean === 'WELCOME15') {
      setAppliedPromo({ code: 'WELCOME15', discountPercent: 0.15, label: '15% Off' });
      addToast('Promo code WELCOME15 applied: 15% discount.', 'success');
      return true;
    } else {
      addToast(`Promo code '${code}' is invalid. Try 'NOVA10'`, 'error');
      return false;
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
    addToast('Promo code removed.', 'info');
  };

  // Computations
  const itemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = Number(cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2));
  const discount = appliedPromo ? Number((subtotal * appliedPromo.discountPercent).toFixed(2)) : 0;
  const taxableSubtotal = Math.max(0, subtotal - discount);
  const freeShippingThreshold = 100;
  const isFreeShipping = subtotal >= freeShippingThreshold || subtotal === 0;
  const standardShippingCost = isFreeShipping ? 0 : 10;
  const tax = Number((taxableSubtotal * 0.08).toFixed(2));
  const estimatedTotal = Number((taxableSubtotal + tax + standardShippingCost).toFixed(2));

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        openCart,
        closeCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        promoCode,
        setPromoCode,
        appliedPromo,
        applyPromo,
        removePromo,
        itemsCount,
        subtotal,
        discount,
        tax,
        freeShippingThreshold,
        isFreeShipping,
        standardShippingCost,
        estimatedTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
