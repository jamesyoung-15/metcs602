import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import Chat from "../components/Chat";

/**
 * Venue detail page.
 * @returns {JSX.Element} Venue detail page.
 */
export default function VenueDetail() {
  const { id } = useParams();
  // too lazy to type this
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [venue, setVenue] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();
  const lang = i18n.language;

  // fetch venue details from backend on component mount
  useEffect(() => {
    fetch(`http://localhost:3049/api/venues/${id}`)
      .then((res) => res.json())
      .then((data) => setVenue(data));
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    await addToCart(id!, quantity);
    alert("Added to cart!");
  };

  if (!venue) return <div className="p-4">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <img
        src={`http://localhost:3049${venue.showcaseImage}`}
        alt={venue.title[lang]}
        className="w-full h-64 md:h-96 object-cover rounded-lg mb-6"
      />

      <h1 className="text-3xl font-bold mb-2">{venue.title[lang]}</h1>
      <p className="text-xl text-gray-600 mb-4">{venue.slogan[lang]}</p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-500">{t("venue.date")}</p>
          <p className="font-semibold">
            {new Date(venue.date).toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">{t("venue.location")}</p>
          <p className="font-semibold">{venue.location.venue}</p>
          <p className="text-sm">
            {venue.location.city}, {venue.location.country}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">{t("venue.price")}</p>
          <p className="font-bold text-xl text-blue-600">
            ${venue.ticketPrice}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">{t("venue.available")}</p>
          <p className="font-semibold">
            {venue.availableTickets} {t("venue.tickets")}
          </p>
        </div>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <label className="block mb-2 font-semibold">
          {t("venue.quantity")}
        </label>
        <div className="flex gap-4 items-center">
          <input
            type="number"
            min="1"
            max={venue.availableTickets}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className="border rounded px-3 py-2 w-20"
          />
          <button
            onClick={handleAddToCart}
            className="bg-green-600 text-white px-6 py-2 rounded font-semibold"
          >
            {t("venue.addToCart")}
          </button>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">{t("venue.gallery")}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {venue.galleryImages.map((img: string, i: number) => (
          <img
            key={i}
            src={`http://localhost:3049${img}`}
            alt={`Gallery ${i + 1}`}
            className="w-full h-40 object-cover rounded"
          />
        ))}
      </div>
      <Chat username={user?.name} />
    </div>
  );
}
