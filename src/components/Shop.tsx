import React from 'react';
import { Wifi, Package } from 'lucide-react';

const Shop: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Shop</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* eSIM Shop */}
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <Wifi className="mx-auto text-blue-600 mb-4" size={64} />
          <h2 className="text-2xl font-bold mb-4">eSIM & Prepaid Data</h2>
          <p className="text-gray-600 mb-6">
            Stay connected worldwide with our eSIM packages. Instant activation, 
            global coverage, and no roaming fees.
          </p>
          <a
            href="/shop/esim"
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors inline-block"
          >
            Browse eSIMs
          </a>
        </div>

        {/* Travel Accessories */}
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <Package className="mx-auto text-green-600 mb-4" size={64} />
          <h2 className="text-2xl font-bold mb-4">Travel Accessories</h2>
          <p className="text-gray-600 mb-6">
            Essential travel gear and accessories to make your journey comfortable 
            and secure. From luggage to electronics.
          </p>
          <a
            href="/shop/accessories"
            className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors inline-block"
          >
            Browse Accessories
          </a>
        </div>
      </div>
    </div>
  );
};

export default Shop;
