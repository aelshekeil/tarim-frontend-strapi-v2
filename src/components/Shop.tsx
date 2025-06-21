import React, { useState } from 'react';
import { Smartphone, Wifi, Globe, ShoppingCart, Star, Check } from 'lucide-react';
import { useAPI } from '../hooks/useAPI';
import strapiAPI from '../lib/api';
import { formatCurrency } from '../lib/utils';

interface ESIMProduct {
  id: number;
  country: string;
  data_amount: string;
  validity: string;
  price: number;
  provider: string;
  features?: string[];
  rating?: number;
}

const Shop: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'esim' | 'accessories' | 'insurance'>('esim');
  const [cart, setCart] = useState<{ [key: number]: number }>({});

  // Fetch eSIM products from Strapi
  const { data: esimProducts, loading, error } = useAPI<ESIMProduct[]>(
    async () => {
      const strapiProducts = await strapiAPI.getESIMProducts();
      // Transform Strapi products to match local interface
      return strapiProducts.map((product, index) => ({
        id: index + 1, // Use index as ID since Strapi product might not have id
        country: product.country,
        data_amount: product.data_amount,
        validity: product.validity,
        price: product.price,
        provider: product.provider,
        features: [],
        rating: 4.5
      }));
    },
    []
  );

  // Mock data for other categories (can be replaced with Strapi data later)
  const accessories = [
    {
      id: 1,
      name: 'Universal Travel Adapter',
      price: 25.99,
      image: '/api/placeholder/300/200',
      description: 'Works in 150+ countries with USB-C and USB-A ports',
      rating: 4.8,
      features: ['150+ Countries', 'USB-C & USB-A', 'Compact Design']
    },
    {
      id: 2,
      name: 'Portable Power Bank',
      price: 39.99,
      image: '/api/placeholder/300/200',
      description: '20,000mAh capacity with fast charging',
      rating: 4.6,
      features: ['20,000mAh', 'Fast Charging', 'Multiple Ports']
    },
    {
      id: 3,
      name: 'Travel Luggage Scale',
      price: 15.99,
      image: '/api/placeholder/300/200',
      description: 'Digital scale to avoid overweight fees',
      rating: 4.5,
      features: ['50kg Capacity', 'Digital Display', 'Compact']
    }
  ];

  const insurance = [
    {
      id: 1,
      name: 'Basic Travel Insurance',
      price: 29.99,
      coverage: 'Up to $50,000',
      description: 'Essential coverage for medical emergencies and trip cancellation',
      features: ['Medical Emergency', 'Trip Cancellation', 'Lost Luggage']
    },
    {
      id: 2,
      name: 'Premium Travel Insurance',
      price: 59.99,
      coverage: 'Up to $100,000',
      description: 'Comprehensive coverage including adventure sports',
      features: ['All Basic Features', 'Adventure Sports', 'Extended Coverage']
    }
  ];

  const addToCart = (productId: number) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[productId] > 1) {
        newCart[productId]--;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };

  const getCartTotal = () => {
    let total = 0;
    
    if (selectedCategory === 'esim' && esimProducts) {
      esimProducts.forEach(product => {
        if (cart[product.id]) {
          total += product.price * cart[product.id];
        }
      });
    } else if (selectedCategory === 'accessories') {
      accessories.forEach(product => {
        if (cart[product.id]) {
          total += product.price * cart[product.id];
        }
      });
    } else if (selectedCategory === 'insurance') {
      insurance.forEach(product => {
        if (cart[product.id]) {
          total += product.price * cart[product.id];
        }
      });
    }
    
    return total;
  };

  const getCartItemCount = () => {
    return Object.values(cart).reduce((sum, count) => sum + count, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="container-custom">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading shop...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Travel Shop</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need for your journey - from eSIMs to travel accessories and insurance
          </p>
        </div>

        {/* Category Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-2 shadow-md">
            <button
              onClick={() => setSelectedCategory('esim')}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                selectedCategory === 'esim'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <Smartphone className="inline-block w-5 h-5 mr-2" />
              eSIM Cards
            </button>
            <button
              onClick={() => setSelectedCategory('accessories')}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                selectedCategory === 'accessories'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <Wifi className="inline-block w-5 h-5 mr-2" />
              Accessories
            </button>
            <button
              onClick={() => setSelectedCategory('insurance')}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                selectedCategory === 'insurance'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <Globe className="inline-block w-5 h-5 mr-2" />
              Insurance
            </button>
          </div>
        </div>

        {/* Shopping Cart Summary */}
        {getCartItemCount() > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ShoppingCart className="w-5 h-5 text-blue-600 mr-2" />
                <span className="font-medium text-blue-900">
                  {getCartItemCount()} item(s) in cart
                </span>
              </div>
              <div className="text-xl font-bold text-blue-900">
                {formatCurrency(getCartTotal())}
              </div>
            </div>
          </div>
        )}

        {/* eSIM Products */}
        {selectedCategory === 'esim' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">eSIM Cards</h2>
            {error ? (
              <div className="text-center py-12">
                <p className="text-red-600">Error loading eSIM products: {error}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {esimProducts?.map((product) => (
                  <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-gray-900">{product.country}</h3>
                        {product.rating && (
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="ml-1 text-sm text-gray-600">{product.rating}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Data:</span>
                          <span className="font-medium">{product.data_amount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Validity:</span>
                          <span className="font-medium">{product.validity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Provider:</span>
                          <span className="font-medium">{product.provider}</span>
                        </div>
                      </div>

                      {product.features && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Features:</h4>
                          <ul className="space-y-1">
                            {product.features.map((feature, index) => (
                              <li key={index} className="flex items-center text-sm text-gray-600">
                                <Check className="w-4 h-4 text-green-500 mr-2" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-blue-600">
                          {formatCurrency(product.price)}
                        </div>
                        <div className="flex items-center space-x-2">
                          {cart[product.id] && (
                            <>
                              <button
                                onClick={() => removeFromCart(product.id)}
                                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300"
                              >
                                -
                              </button>
                              <span className="w-8 text-center font-medium">{cart[product.id]}</span>
                            </>
                          )}
                          <button
                            onClick={() => addToCart(product.id)}
                            className="btn-primary px-4 py-2"
                          >
                            {cart[product.id] ? '+' : 'Add to Cart'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Travel Accessories */}
        {selectedCategory === 'accessories' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Travel Accessories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {accessories.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                    <div className="flex items-center justify-center h-48 bg-gradient-to-br from-blue-400 to-purple-500">
                      <Wifi className="w-16 h-16 text-white" />
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm text-gray-600">{product.rating}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{product.description}</p>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Features:</h4>
                      <ul className="space-y-1">
                        {product.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-600">
                            <Check className="w-4 h-4 text-green-500 mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-blue-600">
                        {formatCurrency(product.price)}
                      </div>
                      <div className="flex items-center space-x-2">
                        {cart[product.id] && (
                          <>
                            <button
                              onClick={() => removeFromCart(product.id)}
                              className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-medium">{cart[product.id]}</span>
                          </>
                        )}
                        <button
                          onClick={() => addToCart(product.id)}
                          className="btn-primary px-4 py-2"
                        >
                          {cart[product.id] ? '+' : 'Add to Cart'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Travel Insurance */}
        {selectedCategory === 'insurance' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Travel Insurance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {insurance.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
                      <div className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                        {product.coverage}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{product.description}</p>

                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Coverage includes:</h4>
                      <ul className="space-y-1">
                        {product.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-600">
                            <Check className="w-4 h-4 text-green-500 mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-blue-600">
                        {formatCurrency(product.price)}
                        <span className="text-sm font-normal text-gray-600">/trip</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {cart[product.id] && (
                          <>
                            <button
                              onClick={() => removeFromCart(product.id)}
                              className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-medium">{cart[product.id]}</span>
                          </>
                        )}
                        <button
                          onClick={() => addToCart(product.id)}
                          className="btn-primary px-4 py-2"
                        >
                          {cart[product.id] ? '+' : 'Add to Cart'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Checkout Button */}
        {getCartItemCount() > 0 && (
          <div className="mt-12 text-center">
            <button className="btn-primary px-8 py-4 text-lg">
              Proceed to Checkout ({formatCurrency(getCartTotal())})
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;

