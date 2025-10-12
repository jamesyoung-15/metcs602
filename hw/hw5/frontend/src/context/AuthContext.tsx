import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface User {
  id: string;
  username: string;
  name: string;
  profilePicture: string;
  defaultLanguage: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

// react context for user authentication
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider component to provide authentication context.
 * @param {ReactNode} children - Child components.
 * @returns {JSX.Element} AuthProvider component.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const { i18n } = useTranslation();

  // if user logged in and has a default language, set it
  useEffect(() => {
    if (user?.defaultLanguage) {
      console.log('Setting language to', user.defaultLanguage);
      i18n.changeLanguage(user.defaultLanguage);
      localStorage.setItem('language', user.defaultLanguage);
    }
  }, [user?.defaultLanguage]);

  // fetch user profile if token exists
  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, [token]);

  // fetch user profile from backend
  const fetchProfile = async () => {
    try {
      const res = await fetch('http://localhost:3049/api/auth/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        console.error('Failed to fetch profile');
        return;
      }
      const data = await res.json();
      setUser(data);
    } catch (error) {
      console.error(error);
      logout();
    }
  };

  // login user and store token in local storage
  const login = async (username: string, password: string) => {
    const res = await fetch('http://localhost:3049/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) {
      alert('Login failed');
      console.error(await res.text());
      return;
    }
    const data = await res.json();
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('token', data.token);
  };

  // register user and store token in local storage
  const register = async (username: string, password: string, name: string) => {
    const res = await fetch('http://localhost:3049/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, name })
    });
    if (!res.ok) {
      alert('Registration failed');
      console.error(await res.text());
      return;
    }
    const data = await res.json();
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('token', data.token);
  };

  // logout user and clear token from local storage
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  // update user info in context
  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};