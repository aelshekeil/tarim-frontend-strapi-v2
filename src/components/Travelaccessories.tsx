import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ShoppingCart from 'lucide-react/dist/esm/icons/shopping-cart';
import Package from 'lucide-react/dist/esm/icons/package';
import Plus from 'lucide-react/dist/esm/icons/plus';
import Minus from 'lucide-react/dist/esm/icons/minus';
import strapiAPI from '../lib/api';
import { TravelAccessory, API_URL } from '../lib/types';
import { useCart } from '../hooks/useCart';

const TravelAccessories: React.FC = () => {
  const { t } = useTranslation();
  const [accessories, setAccessories] = useState<TravelAccessory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { addToCart, getItemQuantity, updateQuantity } = useCart();

  useEffect(() => {
    const fetchAccessories = async () => {
      try {
        setLoading(true);
        const products = await strapiAPI.getTravelAccessories();
        setAccessories(products.filter(p => p.is_active));
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccessories();
  }, []);

  const filteredAccessories = accessories.filter(accessory => 
    selectedCategory === 'all' || accessory.category === selectedCategory
  );

  const handleAddToCart = (accessory: TravelAccessory) => {
    addToCart({
      id: `accessory-${accessory.id}`,
      product_type: 'travel-accessory',
      product_id: accessory.id,
      name: accessory.name,
      price: accessory.price,
      product_details: {
        category: accessory.category,
        brand: accessory.brand,
        weight: accessory.weight,
        dimensions: accessory.dimensions,
        requires_shipping: accessory.requires_shipping
      },
      image_url: accessory.images?.[0]?.url ? `${API_URL}${accessory.images[0].url}` : undefined
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'luggage':
        return '🧳';
      case 'electronics':
        return '🔌';
      case 'comfort':
        return '😌';
      case 'security':
        return '🔒';
      case 'health':
        return '🏥';
      default:
        return '📦';
    }
  };

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
    console.error("Error loading accessories:", error);
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          <p>{t('accessories.error_loading')}: {error.message}</p>
        </div>
      </div>
    );
  }

  console.log('API_URL:', API_URL);
  console.log('Accessories data:', accessories);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center mb-8">
        <Package className="text-blue-600 mr-3" size={32} />
        <h2 className="text-3xl font-bold">{t('accessories.title')}</h2>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-md transition-colors ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {t('accessories.categories.all_products')}
          </button>
          {['luggage', 'electronics', 'comfort', 'security', 'health'].map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-md transition-colors flex items-center ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <span className="mr-2">{getCategoryIcon(category)}</span>
              {t(`accessories.categories.${category}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAccessories.map((accessory) => {
          const quantity = getItemQuantity(`accessory-${accessory.id}`);
          
          console.log(`Accessory ID: ${accessory.id}, Full Accessory Object:`, accessory);

          const mainImage = accessory.images?.[0];
          const imageUrl = mainImage?.url ? `${API_URL}${mainImage.url}` : '';
          
          console.log(`Accessory ID: ${accessory.id}, mainImage object:`, mainImage);
          console.log(`Accessory ID: ${accessory.id}, mainImage.url value:`, mainImage?.url);
          console.log(`Accessory ID: ${accessory.id}, Type of mainImage.url: ${typeof mainImage?.url}`);
          console.log(`Accessory ID: ${accessory.id}, Final Computed Image URL:`, imageUrl);
          
          return (
            <div key={accessory.id} className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              {/* Product Image */}
              <div className="h-48 bg-gray-100 flex items-center justify-center relative">
                {mainImage ? (
                  <img
                    src={imageUrl}
                    alt={accessory.name}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <div className="text-6xl">{getCategoryIcon(accessory.category)}</div>
                )}
                
                {/* Category Badge */}
                <div className="absolute top-2 left-2">
                  <span className="bg-white bg-opacity-90 text-xs px-2 py-1 rounded-full">
                    {accessory.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                {/* Product Header */}
                <div className="mb-4">
                  <h3 className="text-lg font-bold mb-1">{accessory.name}</h3>
                  {accessory.brand && (
                    <p className="text-sm text-gray-600">{accessory.brand}</p>
                  )}
                </div>
                
                {/* Product Details */}
                <div className="space-y-2 mb-4">
                  {accessory.weight && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t('accessories.weight')}:</span>
                      <span>{accessory.weight}</span>
                    </div>
                  )}
                  
                  {accessory.dimensions && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t('accessories.size')}:</span>
                      <span>{accessory.dimensions}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('accessories.price')}:</span>
                    <span className="font-bold text-lg text-blue-600">
                      ${accessory.price}
                    </span>
                  </div>
                </div>

                {/* Description */}
                {accessory.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {accessory.description}
                  </p>
                )}

                {/* Features */}
                {accessory.features && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {Object.values(accessory.features.features || {}).slice(0, 3).map((feature: any, index: number) => (
                        <span key={index} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Shipping Info */}
                {accessory.requires_shipping && (
                  <div className="mb-4">
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      📦 {t('accessories.requires_shipping')}
                    </span>
                  </div>
                )}
                
                {/* Add to Cart Button */}
                {quantity > 0 ? (
                  <div className="flex items-center justify-between bg-blue-50 rounded-md p-2">
                    <button
                      onClick={() => updateQuantity(`accessory-${accessory.id}`, quantity - 1)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Minus size={20} />
                    </button>
                    <span className="font-semibold text-blue-600">
                      {quantity} {t('accessories.in_cart')}
                    </span>
                    <button
                      onClick={() => updateQuantity(`accessory-${accessory.id}`, quantity + 1)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleAddToCart(accessory)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                    disabled={accessory.stock_quantity === 0}
                  >
                    <ShoppingCart className="mr-2" size={18} />
                    {accessory.stock_quantity === 0 ? t('accessories.out_of_stock') : t('accessories.add_to_cart')}
                  </button>
                )}

                {/* Stock Status */}
                {accessory.stock_quantity < 10 && accessory.stock_quantity > 0 && (
                  <p className="text-orange-600 text-xs mt-2">
                    {t('accessories.stock_status', { count: accessory.stock_quantity })}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* No Products Message */}
      {filteredAccessories.length === 0 && (
        <div className="text-center py-12">
          <Package className="mx-auto text-gray-400 mb-4" size={64} />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {t('accessories.no_products_found')}
          </h3>
          <p className="text-gray-500">
            {t('accessories.try_different_category')}
          </p>
        </div>
      )}
    </div>
  );
};

export default TravelAccessories;
