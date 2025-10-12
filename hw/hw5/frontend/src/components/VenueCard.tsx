import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface VenueCardProps {
  venue: VenueItem;
}

export interface VenueItem {
  _id: string;
  showcaseImage: string;
  title: { [key: string]: string };
  slogan: { [key: string]: string };
  location: { city: string; country: string };
  date: string;
  ticketPrice: number;
}

/**
 * VenueCard component to display venue information.
 * @param {VenueCardProps} props - Props containing venue data.
 * @returns {JSX.Element} Venue card component.
 */
export default function VenueCard({ venue }: VenueCardProps) {
  const { i18n, t } = useTranslation();
  const lang = i18n.language;

  return (
    <Link to={`/venue/${venue._id}`} className="block bg-white rounded-lg shadow overflow-hidden">
      <img 
        src={`http://localhost:3049${venue.showcaseImage}`} 
        alt={venue.title[lang]} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1">{venue.title[lang]}</h3>
        <p className="text-gray-600 text-sm mb-2">{venue.slogan[lang]}</p>
        <p className="text-sm text-gray-500">{venue.location.city}, {venue.location.country}</p>
        <p className="text-sm text-gray-500">{new Date(venue.date).toLocaleDateString()}</p>
        <div className="mt-3 flex justify-between items-center">
          <span className="font-bold text-blue-600">${venue.ticketPrice}</span>
          <button className="bg-green-600 text-white px-4 py-2 rounded text-sm">
            {t('home.buyTickets')}
          </button>
        </div>
      </div>
    </Link>
  );
}