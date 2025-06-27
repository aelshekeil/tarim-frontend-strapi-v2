import React, { useState, useEffect } from 'react';

// Define the types (should match your actual types)
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
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/travel-packages?populate=*`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch travel packages');
      }
      
      const data = await response.json();
      setPackages(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-300"></div>
              <div className="p-6">
                <div className="h-6 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded mb-4"></div>
                <div className="space-y-2 mb-4">
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded"></div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="h-6 bg-gray-300 rounded w-20"></div>
                  <div className="h-8 bg-gray-300 rounded w-24"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Packages</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchPackages}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (packages.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">No Travel Packages Available</h2>
          <p className="text-gray-600">Check back later for new travel packages!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Travel Packages</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover amazing destinations with our carefully curated travel packages. 
          From exotic beaches to mountain adventures, find your perfect getaway.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      </div>
    </div>
  );
};

export default TravelPackages;