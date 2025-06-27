import React, { useState, useEffect } from 'react';

interface TravelPackageAttributes {
  title: string;
  description: string;
  destination: string;
  duration: string;
  price: number;
  rating?: number;
  featured?: boolean;
  cover_image?: {
    data?: {
      attributes?: {
        url: string;
        alternativeText?: string;
      };
    };
  };
}

interface TravelPackage {
  id: string;
  attributes: TravelPackageAttributes;
}

const API_URL = process.env.REACT_APP_API_URL || 'https://back.tarimtours.com';

const TravelPackages: React.FC = () => {
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch(`${API_URL}/api/travel-packages?populate=*`);
        if (!res.ok) throw new Error('Failed to fetch travel packages');
        const data = await res.json();
        setPackages(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg animate-pulse">
              <div className="h-48 bg-gray-300" />
              <div className="p-6 space-y-4">
                <div className="h-6 bg-gray-300 rounded" />
                <div className="h-4 bg-gray-300 rounded w-1/2" />
                <div className="h-4 bg-gray-300 rounded w-1/3" />
                <div className="h-6 bg-gray-300 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-red-100 border border-red-200 text-red-700 p-6 rounded-lg">
          <h2 className="text-xl font-semibold">Error Loading Packages</h2>
          <p className="mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (packages.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">No Travel Packages Available</h2>
        <p className="text-gray-600">Please check back soon.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Travel Packages</h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Discover amazing destinations with our curated packages. Whether you're dreaming of beaches or mountains,
          find your next adventure here.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages
          .filter(pkg => pkg && pkg.attributes)
          .map(pkg => {
            const { title, destination, price, duration, cover_image } = pkg.attributes;
            const imageUrl = cover_image?.data?.attributes?.url;
            const altText = cover_image?.data?.attributes?.alternativeText || title;

            return (
              <div key={pkg.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {imageUrl && (
                  <img
                    src={`https://back.tarimtours.com${imageUrl}`}
                    alt={altText}
                    className="h-48 w-full object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-xl font-semibold">{title}</h3>
                  <p className="text-gray-600">{destination}</p>
                  <p className="text-sm text-gray-500">{duration}</p>
                  <p className="text-lg font-bold mt-2">${price}</p>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default TravelPackages;
