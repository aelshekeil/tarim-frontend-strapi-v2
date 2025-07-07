import React from 'react';
import { useTranslation } from 'react-i18next';
import Wifi from 'lucide-react/dist/esm/icons/wifi';
import Package from 'lucide-react/dist/esm/icons/package';
import Plane from 'lucide-react/dist/esm/icons/plane';

const Shop: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-20 px-4">
      <div className="max-w-5xl mx-auto text-center mb-16">
        <h1 className="text-5xl font-bold text-slate-900 mb-4 tracking-tight">{t('shop.title')}</h1>
        <p className="text-xl text-slate-600">
          {t('shop.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* eSIM Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden group transform hover:-translate-y-2 transition-all duration-300 ease-in-out hover:shadow-2xl border-b-4 border-transparent hover:border-blue-500">
          <div className="p-8 text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center shadow-inner">
              <Wifi className="text-blue-600 w-12 h-12 group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">{t('shop.esim.title')}</h2>
            <p className="text-slate-600 mb-8 px-4">
              {t('shop.esim.description')}
            </p>
            <a
              href="#/esim"
              className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {t('shop.esim.button')}
            </a>
          </div>
        </div>

        {/* Travel Accessories Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden group transform hover:-translate-y-2 transition-all duration-300 ease-in-out hover:shadow-2xl border-b-4 border-transparent hover:border-emerald-500">
          <div className="p-8 text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center shadow-inner">
              <Package className="text-emerald-600 w-12 h-12 group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">{t('shop.accessories.title')}</h2>
            <p className="text-slate-600 mb-8 px-4">
              {t('shop.accessories.description')}
            </p>
            <a
              href="#/accessories"
              className="inline-block bg-gradient-to-r from-emerald-600 to-teal-500 text-white px-8 py-3 rounded-full font-semibold hover:from-emerald-700 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {t('shop.accessories.button')}
            </a>
          </div>
        </div>

        {/* Travel Packages Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden group transform hover:-translate-y-2 transition-all duration-300 ease-in-out hover:shadow-2xl border-b-4 border-transparent hover:border-purple-500">
          <div className="p-8 text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-100 to-pink-200 flex items-center justify-center shadow-inner">
              <Plane className="text-purple-600 w-12 h-12 group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">{t('shop.packages.title')}</h2>
            <p className="text-slate-600 mb-8 px-4">
              {t('shop.packages.description')}
            </p>
            <a
              href="#/travel-packages"
              className="inline-block bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:from-purple-700 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {t('shop.packages.button')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
