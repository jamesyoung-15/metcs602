import { useState, useEffect } from 'react';
import VenueCard from '../components/VenueCard';
import { useTranslation } from 'react-i18next';
import type { VenueItem } from '../components/VenueCard';

export default function Home() {
  const [venues, setVenues] = useState<VenueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  // fetch venues from backend on component mount
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3049/api/venues');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          console.error('Expected JSON but got:', text);
          throw new Error('Server returned non-JSON response');
        }
        
        const data = await response.json();
        setVenues(data);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch venues:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch venues');
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  if (loading) return <div className="text-center p-8">Loading venues...</div>;
  if (error) return <div className="text-center p-8 text-red-600">Error: {error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{t('home.title')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {venues.map((venue: VenueItem) => (
          <VenueCard key={venue._id} venue={venue} />
        ))}
      </div>
    </div>
  );
}