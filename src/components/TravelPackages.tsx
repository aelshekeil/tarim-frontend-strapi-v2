import React, { useEffect, useState } from "react";
import strapiAPI from '../lib/api';
import { TravelPackage, API_URL } from '../lib/types';

const TravelPackages: React.FC = () => {
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const fetchedPackages = await strapiAPI.getTravelPackages();
        setPackages(fetchedPackages);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    console.error("Error loading travel packages:", error);
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          <p>Error loading travel packages: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {packages.map((pkg) => {
        const imageUrl = pkg.cover_image?.url ? `${API_URL}${pkg.cover_image.url}` : "";

        return (
          <div
            key={pkg.id}
            className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            {imageUrl && (
              <img
                src={imageUrl}
                alt={pkg.title}
                className="w-full h-56 object-cover"
              />
            )}
            <div className="p-5">
              <h2 className="text-lg font-semibold text-gray-800 mb-1">{pkg.title}</h2>
              <p className="text-sm text-indigo-500 font-medium mb-2">{pkg.destination}</p>
              <p className="text-gray-600 text-sm line-clamp-3 mb-4">{pkg.description}</p>
              <div className="flex justify-between text-sm text-gray-700">
                <span>📅 {pkg.duration}</span>
                <span>💵 ${pkg.price}</span>
              </div>
              <div className="mt-2 text-sm text-yellow-500">
                ⭐ {pkg.rating ?? "No rating"}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TravelPackages;
