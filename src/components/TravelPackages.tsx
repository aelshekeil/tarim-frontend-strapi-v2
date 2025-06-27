import React, { useEffect, useState } from "react";

interface ImageFormat {
  url: string;
}

interface CoverImage {
  url: string;
  formats?: {
    thumbnail?: ImageFormat;
    small?: ImageFormat;
    medium?: ImageFormat;
  };
}

interface TravelPackage {
  id: number;
  title: string;
  description: string;
  destination: string;
  price: number;
  duration: string;
  rating: number | null;
  cover_image: CoverImage;
}

const TravelPackages: React.FC = () => {
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch("https://back.tarimtours.com/api/travel-packages?populate=*");
        const json = await res.json();
        setPackages(json.data);
      } catch (err) {
        console.error("Failed to fetch travel packages", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  if (loading) return <p className="text-center py-10 text-gray-500">Loading travel packages...</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {packages.map((pkg) => {
        const imageUrl =
          pkg.cover_image?.formats?.medium?.url ||
          pkg.cover_image?.formats?.small?.url ||
          pkg.cover_image?.url ||
          "";

        return (
          <div
            key={pkg.id}
            className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            {imageUrl && (
              <img
                src={`https://back.tarimtours.com${imageUrl}`}
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
