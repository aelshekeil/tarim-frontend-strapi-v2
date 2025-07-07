import React from 'react';
import { X, Plus, Minus, ShoppingCart, Trash2 } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useTranslation } from 'react-i18next';

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
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full md:w-96 bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center">
            <ShoppingCart className="mr-2" size={20} />
            {t('cart.shopping_cart')} ({getTotalItems()})
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cart.items.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-500">{t('cart.empty_cart')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div key={item.id} className="border rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    {/* Product Image */}
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    
                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm">{item.name}</h3>
                      
                      {/* Product Details */}
                      <div className="text-xs text-gray-500 mt-1">
                        {item.product_type === 'esim' && item.product_details && (
                          <div>
                            <p>{item.product_details.country}</p>
                            <p>{item.product_details.data_amount} • {item.product_details.validity}</p>
                          </div>
                        )}
                        {item.product_type === 'travel-accessory' && item.product_details && (
                          <div>
                            {item.product_details.brand && <p>{item.product_details.brand}</p>}
                            {item.product_details.category && (
                              <p className="capitalize">{item.product_details.category}</p>
                            )}
                            {item.product_details.requires_shipping && (
                              <p className="text-orange-600">📦 {t('cart.requires_shipping')}</p>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Price */}
                      <p className="font-semibold text-blue-600 mt-1">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                    
                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="text-gray-500 hover:text-gray-700"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="font-medium px-2">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.items.length > 0 && (
          <div className="border-t p-4">
            {/* Total */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">{t('cart.total')}:</span>
              <span className="text-xl font-bold text-blue-600">
                ${getTotalAmount().toFixed(2)}
              </span>
            </div>
            
            {/* Checkout Button */}
            <button
              onClick={onCheckout}
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              {t('cart.proceed_to_checkout')}
            </button>
            
            {/* Continue Shopping */}
            <button
              onClick={onClose}
              className="w-full mt-2 text-blue-600 py-2 text-sm hover:text-blue-700"
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
