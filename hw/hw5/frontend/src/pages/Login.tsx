import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * Login and Registration form.
 * @returns {JSX.Element} Login and Registration form.
 */
export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // login or register user
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(username, password);
      } else {
        await register(username, password, name);
      }
      navigate('/');
    } catch (error: any) {
      alert(error.message || 'Error');
    }
  };

  // provide form for login or registration
  return (
    <div className="max-w-md mx-auto p-4 mt-10">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">
          {isLogin ? t('auth.login') : t('auth.register')}
        </h1>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-4">
              <label className="block mb-2">{t('profile.name')}</label>
              <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border rounded px-3 py-2 w-full"
                required
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block mb-2">{t('profile.username')}</label>
            <input 
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border rounded px-3 py-2 w-full"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2">{t('auth.password')}</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border rounded px-3 py-2 w-full"
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded font-semibold mb-4"
          >
            {isLogin ? t('auth.login') : t('auth.register')}
          </button>

          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="w-full text-blue-600"
          >
            {isLogin ? t('auth.noAccount') : t('auth.hasAccount')}
          </button>
        </form>
      </div>
    </div>
  );
}