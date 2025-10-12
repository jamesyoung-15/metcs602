import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

interface CartItem {
  _id: string;
  venueId: {
    _id: string;
    title: { [key: string]: string };
    showcaseImage: string;
    ticketPrice: number;
    date: string;
  };
  quantity: number;
  price: number;
}

interface Cart {
  items: CartItem[];
}

interface CartContextType {
  cart: Cart | null;
  addToCart: (venueId: string, quantity: number) => Promise<void>;
  updateQuantity: (venueId: string, quantity: number) => Promise<void>;
  removeFromCart: (venueId: string) => Promise<void>;
  fetchCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * CartProvider component to provide cart context.
 * @param {ReactNode} children - Child components.
 * @returns {JSX.Element} CartProvider component.
 */
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<Cart | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    if (token) fetchCart();
    // prevent navigating to cart if not logged in, not really a implemented correctly but wtv
    else {
      navigate('/');
    }
  }, [token]);

  // fetch cart from backend
  const fetchCart = async () => {
    try {
      const res = await fetch('http://localhost:3049/api/cart', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        alert('Error fetching cart');
        console.error('Failed to fetch cart');
        return;
      }
      const data = await res.json();
      setCart(data);
    } catch (error) {
      console.error(error);
    }
  };

  const addToCart = async (venueId: string, quantity: number) => {
    const res = await fetch('http://localhost:3049/api/cart/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ venueId, quantity })
    });
    if (!res.ok) {
      alert('Error adding to cart');
      console.error('Failed to add to cart');
      return;
    }
    const data = await res.json();
    setCart(data);
  };

  const updateQuantity = async (venueId: string, quantity: number) => {
    const res = await fetch(`http://localhost:3049/api/cart/update/${venueId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ quantity })
    });
    if (!res.ok) {
      alert('Error updating quantity');
      console.error('Failed to update quantity');
      return;
    }
    const data = await res.json();
    setCart(data);
  };

  const removeFromCart = async (venueId: string) => {
    const res = await fetch(`http://localhost:3049/api/cart/remove/${venueId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) {
      alert('Error removing from cart');
      console.error('Failed to remove from cart');
      return;
    }
    const data = await res.json();
    setCart(data);
  };

  // provide cart state and functions to manipulate it
  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

// below disable react-refresh warning as this is a hook, not really an issue
// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};