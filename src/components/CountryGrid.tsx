import React, { useState, useEffect } from 'react';
import { Country, fetchCountriesWithPlans } from '../lib/esimApi';

interface CountryGridProps {
  onCountrySelect: (country: Country) => void;
}

const CountryGrid: React.FC<CountryGridProps> = ({ onCountrySelect }) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadCountries = async () => {
      try {
        setLoading(true);
        const data = await fetchCountriesWithPlans();
        setCountries(data);
      } catch (err) {
        setError('Failed to load countries');
        console.error('Error loading countries:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCountries();
  }, []);

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFlagUrl = (country: Country) => {
    if (country.flag_icon?.url) {
      return country.flag_icon.url.startsWith('http') 
        ? country.flag_icon.url 
        : `${process.env.REACT_APP_API_URL || 'https://back.tarimtours.com'}${country.flag_icon.url}`;
    }
    // Fallback to a generic flag icon if the image fails to load or is not provided by the API
    // This uses the same base64 SVG as the onError fallback to avoid external CDN issues.
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCA0OCAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjMyIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAyMEwyMCAxNkgyOEwyNCAyMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search countries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Countries Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {filteredCountries.map((country) => (
          <div
            key={country.id}
            onClick={() => onCountrySelect(country)}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer p-4 text-center group hover:scale-105 transform transition-transform"
          >
            <div className="mb-3">
              <img
                src={getFlagUrl(country)}
                alt={`${country.name} flag`}
                className="w-12 h-8 mx-auto object-cover rounded border border-gray-200"
                onError={(e) => {
                  // Fallback to a generic flag icon if the image fails to load
                  const target = e.target as HTMLImageElement;
                  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCA0OCAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjMyIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAyMEwyMCAxNkgyOEwyNCAyMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                }}
              />
            </div>
            <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
              {country.name}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {country.Country?.length || 0} plans
            </p>
          </div>
        ))}
      </div>

      {filteredCountries.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <p className="text-gray-500">No countries found matching "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
};

export default CountryGrid;
