import React from 'react';
import { useTranslation } from 'react-i18next';
import X from 'lucide-react/dist/esm/icons/x';
import Plus from 'lucide-react/dist/esm/icons/plus';
import Minus from 'lucide-react/dist/esm/icons/minus';
import ShoppingCart from 'lucide-react/dist/esm/icons/shopping-cart';
import Trash2 from 'lucide-react/dist/esm/icons/trash-2';
import Package from 'lucide-react/dist/esm/icons/package';
import Globe from 'lucide-react/dist/esm/icons/globe';
import Wifi from 'lucide-react/dist/esm/icons/wifi';

import { useCart } from '../hooks/useCart';
import { EsimProductDetails, TravelAccessoryProductDetails } from '../lib/types';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose, onCheckout }) => {
  const { t } = useTranslation();
  const { cart, updateQuantity, removeFromCart, getTotalAmount, getTotalItems } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Enhanced Overlay with backdrop blur */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Enhanced Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full md:w-96 bg-gradient-to-br from-gray-50 to-blue-100 shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-out">
        {/* Enhanced Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                <ShoppingCart size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{t('cart.shopping_cart')}</h2>
                <p className="text-blue-100 text-sm">{getTotalItems()} items</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors backdrop-blur-sm"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Enhanced Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.items.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="text-gray-400" size={32} />
              </div>
              <p className="text-gray-500 text-lg font-medium">{t('cart.empty_cart')}</p>
              <p className="text-gray-400 text-sm mt-2">Add some items to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.items.map((item, index) => (
                <div 
                  key={item.id} 
                  className="group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-4 border border-gray-200 hover:border-blue-200 transform hover:-translate-y-1"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start space-x-4">
                    {/* Enhanced Product Image */}
                    <div className="relative flex-shrink-0">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg shadow-md"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                          {item.product_type === 'esim' ? (
                            <Wifi className="text-blue-500" size={24} />
                          ) : (
                            <Package className="text-purple-500" size={24} />
                          )}
                        </div>
                      )}
                      {/* Product type indicator */}
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                        {item.product_type === 'esim' ? (
                          <Globe size={12} />
                        ) : (
                          <Package size={12} />
                        )}
                      </div>
                    </div>
                    
                    {/* Enhanced Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 text-sm leading-snug mb-2">{item.name}</h3>
                      
                      {/* Enhanced Product Details */}
                      <div className="space-y-1 mb-3">
                        {item.product_type === 'esim' && item.product_details && (
                          <div className="flex flex-wrap gap-2">
                            {(item.product_details as EsimProductDetails).country && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {(item.product_details as EsimProductDetails).country}
                              </span>
                            )}
                            {(item.product_details as EsimProductDetails).data_amount && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {(item.product_details as EsimProductDetails).data_amount}
                              </span>
                            )}
                            {(item.product_details as EsimProductDetails).validity && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                {(item.product_details as EsimProductDetails).validity}
                              </span>
                            )}
                          </div>
                        )}
                        {item.product_type === 'travel-accessory' && item.product_details && (
                          <div className="flex flex-wrap gap-2">
                            {(item.product_details as TravelAccessoryProductDetails).brand && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {(item.product_details as TravelAccessoryProductDetails).brand}
                              </span>
                            )}
                            {(item.product_details as TravelAccessoryProductDetails).category && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 capitalize">
                                {(item.product_details as TravelAccessoryProductDetails).category}
                              </span>
                            )}
                            {(item.product_details as TravelAccessoryProductDetails).requires_shipping && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                📦 {t('cart.requires_shipping')}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Enhanced Price */}
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          ${item.price.toFixed(2)}
                        </p>
                        
                        {/* Enhanced Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced Quantity Controls */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center bg-gray-50 rounded-full p-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-white shadow-sm hover:shadow-md transition-shadow flex items-center justify-center text-gray-600 hover:text-gray-800 disabled:opacity-50"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="font-semibold px-4 py-1 text-gray-800">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-white shadow-sm hover:shadow-md transition-shadow flex items-center justify-center text-gray-600 hover:text-gray-800"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Subtotal</p>
                      <p className="text-lg font-bold text-gray-800">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Enhanced Footer */}
        {cart.items.length > 0 && (
          <div className="bg-white border-t border-gray-200 p-6 shadow-lg">
            {/* Enhanced Total */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-700">{t('cart.total')}:</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ${getTotalAmount().toFixed(2)}
                </span>
              </div>
            </div>
            
            {/* Enhanced Checkout Button */}
            <button
              onClick={onCheckout}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95"
            >
              {t('cart.proceed_to_checkout')}
            </button>
            
            {/* Enhanced Continue Shopping */}
            <button
              onClick={onClose}
              className="w-full mt-3 text-blue-600 hover:text-blue-700 py-3 text-sm font-medium transition-colors hover:bg-blue-50 rounded-lg"
            >
              {t('cart.continue_shopping')}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
