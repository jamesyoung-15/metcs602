import { useCart } from '../context/CartContext';
import { useTranslation } from 'react-i18next';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const { i18n, t } = useTranslation();
  const lang = i18n.language;

  // if cart empty, show empty message
  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">{t('cart.title')}</h1>
        <p className="text-gray-500">{t('cart.empty')}</p>
      </div>
    );
  }

  // calculate total price
  const total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="max-w-[300px] sm:max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{t('cart.title')}</h1>
      
      {cart.items.map((item) => (
        <div key={item._id} className="bg-white rounded-lg shadow p-4 mb-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <img 
              src={`http://localhost:3049${item.venueId.showcaseImage}`} 
              alt={"Venue"}
              className="w-24 h-24 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="font-bold">{item.venueId.title[lang]}</h3>
              <p className="text-sm text-gray-500">
                {new Date(item.venueId.date).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500">${item.price} each</p>
              
              <div className="flex gap-2 items-center mt-2">
                <input 
                  type="number" 
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.venueId._id, parseInt(e.target.value))}
                  className="border rounded px-2 py-1 w-16"
                />
                <button 
                  onClick={() => removeFromCart(item.venueId._id)}
                  className="text-red-600 text-sm"
                >
                  {t('cart.remove')}
                </button>
              </div>
            </div>
            <div className="sm:text-right">
              <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          </div>
        </div>
      ))}

      <div className="bg-gray-100 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-bold">{t('cart.total')}</span>
          <span className="text-2xl font-bold text-blue-600">${total.toFixed(2)}</span>
        </div>
        <button 
          className="w-full bg-green-600 text-white py-3 rounded font-semibold"
          onClick={() => alert('Simulating checkout...')}
        >
          {t('cart.checkout')}
        </button>
      </div>
    </div>
  );
}