import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTranslation } from 'react-i18next';

// simple navbar with links to home, cart, profile, login/logout
export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { t } = useTranslation();

  const cartCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* this will be home button to avoid having to make hamburger menu */}
        <Link to="/" className="text-sm font-bold sm:text-xl">TicketMeister</Link>
        <div className="flex gap-4 text-sm sm:text-base">
          {/* remove to avoid needing hamburger menu */}
          {/* <Link to="/">{t('nav.home')}</Link> */}
          {user ? (
            <>
              <Link to="/cart" className="relative">
                {t('nav.cart')}
                {/* cart item count circle */}
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link to="/profile">{t('nav.profile')}</Link>
              <button onClick={logout}>{t('nav.logout')}</button>
            </>
          ) : (
            <Link to="/login">{t('nav.login')}</Link>
          )}
        </div>
      </div>
    </nav>
  );
}