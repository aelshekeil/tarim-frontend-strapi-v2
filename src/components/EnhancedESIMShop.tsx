import React, { useState } from 'react';
import CountryGrid from './CountryGrid';
import PlanSelectionModal from './PlanSelectionModal';
import { Country, EsimPlan } from '../lib/esimApi';
import { useCart } from '../hooks/useCart';

const EnhancedESIMShop: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToCart } = useCart();

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCountry(null);
  };

  const getPlanDuration = (productName: string) => {
    // Extract duration from product name (e.g., "change-7days-1gb" -> "7 days")
    const match = productName.match(/(\d+)days?/i);
    if (match) {
      return `${match[1]} days`;
    }
    return 'N/A';
  };

  const handlePlanSelect = (plan: EsimPlan, country: Country) => {
    // Convert eSIM plan to cart item format
    const cartItem = {
      id: `esim-${plan.id}`,
      product_type: 'esim' as const,
      product_id: plan.id,
      name: `${country.name} - ${plan.data_gb}`,
      price: plan.net_price_usd,
      product_details: {
        country: country.name,
        data_amount: plan.data_gb,
        validity: getPlanDuration(plan.product_name), // You might want to extract this properly
      },
      image_url: country.flag_icon?.url || '',
    };

    addToCart(cartItem);
    
    // Show success message (you can customize this)
    alert(`Added ${country.name} eSIM plan (${plan.data_gb}) to cart!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              eSIM Plans Worldwide
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Stay connected anywhere in the world with our reliable eSIM plans. 
              Choose your destination and find the perfect data plan for your travels.
            </p>
          </div>
        </div>
      </div>

      {/* Country Grid */}
      <CountryGrid onCountrySelect={handleCountrySelect} />

      {/* Plan Selection Modal */}
      <PlanSelectionModal
        country={selectedCountry}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onPlanSelect={handlePlanSelect}
      />

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Why Choose Our eSIM Plans?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Activation</h3>
              <p className="text-gray-600">Get connected immediately after purchase. No waiting, no delays.</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Global Coverage</h3>
              <p className="text-gray-600">Stay connected in over 190+ countries and regions worldwide.</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure & Reliable</h3>
              <p className="text-gray-600">Enterprise-grade security with 99.9% network uptime guarantee.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedESIMShop;
