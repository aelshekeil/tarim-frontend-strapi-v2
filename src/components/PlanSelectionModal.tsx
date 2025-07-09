import React, { useState } from 'react';
import { Country, EsimPlan } from '../lib/esimApi';

interface PlanSelectionModalProps {
  country: Country | null;
  isOpen: boolean;
  onClose: () => void;
  onPlanSelect: (plan: EsimPlan, country: Country) => void;
}

const PlanSelectionModal: React.FC<PlanSelectionModalProps> = ({
  country,
  isOpen,
  onClose,
  onPlanSelect
}) => {
  const [selectedPlan, setSelectedPlan] = useState<EsimPlan | null>(null);

  if (!isOpen || !country) return null;

  const getFlagUrl = (country: Country) => {
    // First try to use the uploaded flag from Strapi
    if (country.flag_icon?.url) {
      const flagUrl = country.flag_icon.url.startsWith('http') 
        ? country.flag_icon.url 
        : `${process.env.REACT_APP_API_URL || 'https://back.tarimtours.com'}${country.flag_icon.url}`;
      return flagUrl;
    }
    
    // Fallback to country code based flags
    const countryCode = getCountryCode(country.name);
    if (countryCode) {
      return `https://flagcdn.com/w80/${countryCode.toLowerCase()}.png`;
    }
    
    // Final fallback to a generic flag icon
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCA0OCAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjMyIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAyMEwyMCAxNkgyOEwyNCAyMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
  };

  // Helper function to get country code from country name
  const getCountryCode = (countryName: string): string | null => {
    const countryCodeMap: { [key: string]: string } = {
      'united states': 'us',
      'united kingdom': 'gb',
      'germany': 'de',
      'france': 'fr',
      'italy': 'it',
      'spain': 'es',
      'japan': 'jp',
      'china': 'cn',
      'india': 'in',
      'australia': 'au',
      'canada': 'ca',
      'brazil': 'br',
      'mexico': 'mx',
      'russia': 'ru',
      'south korea': 'kr',
      'thailand': 'th',
      'singapore': 'sg',
      'malaysia': 'my',
      'indonesia': 'id',
      'philippines': 'ph',
      'vietnam': 'vn',
      'turkey': 'tr',
      'egypt': 'eg',
      'south africa': 'za',
      'nigeria': 'ng',
      'kenya': 'ke',
      'morocco': 'ma',
      'tunisia': 'tn',
      'algeria': 'dz',
      'ghana': 'gh',
      'ethiopia': 'et',
      'uganda': 'ug',
      'tanzania': 'tz',
    };
    
    return countryCodeMap[countryName.toLowerCase()] || null;
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const getDataDisplay = (dataGb: string) => {
    return dataGb;
  };

  const getPlanDuration = (productName: string) => {
    // Extract duration from product name (e.g., "change-7days-1gb" -> "7 days")
    const match = productName.match(/(\d+)days?/i);
    if (match) {
      return `${match[1]} days`;
    }
    return 'Duration varies';
  };

  const handlePlanSelect = (plan: EsimPlan) => {
    onPlanSelect(plan, country);
    onClose();
  };

  // Use the correct field name from the backend response
  const plans = country.EsimPlan || [];

  // Group plans by data amount for better organization
  const groupedPlans = plans.reduce((acc, plan) => {
    const dataKey = plan.data_gb;
    if (!acc[dataKey]) {
      acc[dataKey] = [];
    }
    acc[dataKey].push(plan);
    return acc;
  }, {} as Record<string, EsimPlan[]>);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <img
              src={getFlagUrl(country)}
              alt={`${country.name} flag`}
              className="w-8 h-6 object-cover rounded border border-gray-200"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCA0OCAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjMyIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAyMEwyMCAxNkgyOEwyNCAyMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
              }}
            />
            <div>
              <h2 className="text-xl font-bold text-gray-900">{country.name}</h2>
              <p className="text-sm text-gray-500">{plans.length} eSIM plans available</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Plans Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {Object.keys(groupedPlans).length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No eSIM plans available for this country.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedPlans).map(([dataAmount, planList]) => (
                <div key={dataAmount} className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    {dataAmount} Plans
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {planList.map((plan) => (
                      <div
                        key={plan.id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer"
                        onClick={() => handlePlanSelect(plan)}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium text-gray-900">{getDataDisplay(plan.data_gb)}</h4>
                            <p className="text-sm text-gray-500">{getPlanDuration(plan.product_name)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-blue-600">{formatPrice(plan.net_price_usd)}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-sm text-gray-600">
                          {plan.sms > 0 && (
                            <div className="flex items-center space-x-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                              <span>{plan.sms} SMS</span>
                            </div>
                          )}
                          {plan.voice > 0 && (
                            <div className="flex items-center space-x-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              <span>{plan.voice} minutes</span>
                            </div>
                          )}
                        </div>

                        <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
                          Select Plan
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanSelectionModal;