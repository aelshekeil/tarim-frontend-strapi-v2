import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useAPI } from '../hooks/useAPI';
import { API_URL } from '../lib/types';

const EnhancedTravelPackages: FC = () => {
  const { t } = useTranslation();
  const { data, loading, error } = useAPI<any>('travel-packages?populate=*');

  if (loading) {
    return (
      <section className="py-20 bg-gray-50 min-h-screen flex items-center justify-center">
        <p className="text-center text-gray-500">{t("common.loading_travel_packages")}</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gray-50 min-h-screen flex items-center justify-center">
        <p className="text-center text-red-500">{t("common.error_fetching_packages")}: {error.message}</p>
      </section>
    );
  }

  const packages = data?.data || [];

  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="container-custom mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-blue-800 mb-12">{t("common.travel_packages")}</h2>
        <p className="text-lg text-center text-gray-700 mb-8">
          {t("common.welcome_packages_page")}
        </p>
        
        {packages.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">{t("common.packages_coming_soon_title")}</h3>
            <p className="text-gray-600">
              {t("common.packages_coming_soon_text")}
            </p>
            <img 
              src="https://via.placeholder.com/600x300?text=New+Travel+Packages+Coming+Soon"
              alt="New Travel Packages Coming Soon"
              className="mx-auto mt-6 rounded-md shadow-md"
            />
          </div>
        ) : (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg: any) => {
              const imageUrl =
                pkg?.cover_image?.formats?.medium?.url ||
                pkg?.cover_image?.formats?.small?.url ||
                pkg?.cover_image?.url ||
                "/images/placeholder.png";

              return (
                <div
                  key={pkg.id}
                  className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
                >
                  <img
                    src={`${API_URL}${imageUrl}`}
                    alt={pkg.title}
                    className="w-full h-56 object-cover"
                  />
                  <div className="p-5 flex-grow flex flex-col">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{pkg.title}</h3>
                    <p className="text-sm text-indigo-500 font-medium mb-2">{pkg.destination}</p>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow">{pkg.description}</p>
                    <div className="flex justify-between items-center text-sm text-gray-700 mt-auto">
                      <span>📅 {pkg.duration}</span>
                      <span>💵 ${pkg.price}</span>
                    </div>
                    {pkg.rating && (
                      <div className="mt-2 text-sm text-yellow-500">
                        ⭐ {pkg.rating}
                      </div>
                    )}
                    <button className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300">
                      {t("common.book_now")}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default EnhancedTravelPackages;
