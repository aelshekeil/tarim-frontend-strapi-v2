import React from 'react';
import { useTranslation } from 'react-i18next'; // Add this line

const TravelAccessories: React.FC = () => {
  const { t } = useTranslation(); // Add this line

  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="container-custom mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-blue-800 mb-12">{t("common.travel_accessories")}</h2>
        <p className="text-lg text-center text-gray-700 mb-8">
          {t("common.welcome_accessories_shop")}
        </p>
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">{t("common.accessories_coming_soon_title")}</h3>
          <p className="text-gray-600">
            {t("common.accessories_coming_soon_text")}
          </p>
          <img 
            src="https://via.placeholder.com/600x300?text=Travel+Accessories+Coming+Soon"
            alt="Travel Accessories Coming Soon"
            className="mx-auto mt-6 rounded-md shadow-md"
          />
        </div>
      </div>
    </section>
   );
};

export default TravelAccessories;
