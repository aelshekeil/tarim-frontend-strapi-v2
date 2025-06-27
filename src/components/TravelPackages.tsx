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

  if (loading) return <p>Loading packages...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {packages.map((pkg) => {
        const imageUrl =
          pkg.cover_image?.formats?.small?.url ||
          pkg.cover_image?.url ||
          "";

        return (
          <div
            key={pkg.id}
            className="rounded-2xl shadow-md overflow-hidden bg-white"
          >
            {imageUrl && (
              <img
                src={`https://back.tarimtours.com${imageUrl}`}
                alt={pkg.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="text-xl font-bold mb-2">{pkg.title}</h2>
              <p className="text-sm text-gray-600 mb-2">{pkg.destination}</p>
              <p className="text-gray-700 text-sm">{pkg.description}</p>
              <div className="mt-4 text-sm">
                <span className="block">Duration: {pkg.duration}</span>
                <span className="block">Price: ${pkg.price}</span>
                <span className="block">Rating: {pkg.rating ?? "N/A"}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TravelPackages;
