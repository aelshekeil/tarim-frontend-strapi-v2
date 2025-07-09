import React, { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { CartItem, API_URL } from '../lib/types';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose, onCheckout }) => {
  const { cart, removeFromCart, updateQuantity, getTotalAmount, clearCart } = useCart();
  const items = cart.items;
  const [animatingItems, setAnimatingItems] = useState<Set<string>>(new Set());
  const [isClosing, setIsClosing] = useState(false);

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const getItemImage = (item: CartItem) => {
    if (item.image_url) {
      return item.image_url.startsWith('http') 
        ? item.image_url 
        : `${API_URL}${item.image_url}`;
    }
    
    if (item.product_type === 'esim') {
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCA0OCAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjMyIiBmaWxsPSIjNGY0NmU1IiByeD0iNCIvPgo8dGV4dCB4PSIyNCIgeT0iMTgiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjgiIHRleHQtYW5jaG9yPSJtaWRkbGUiPmVTSU08L3RleHQ+Cjwvc3ZnPg==';
    }
    
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAzMkwyMCAyOEgyOEwyNCAzMloiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    setAnimatingItems(prev => new Set(prev).add(itemId));
    updateQuantity(itemId, newQuantity);
    
    setTimeout(() => {
      setAnimatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }, 300);
  };

  const handleRemoveItem = (itemId: string) => {
    setAnimatingItems(prev => new Set(prev).add(itemId));
    setTimeout(() => {
      removeFromCart(itemId);
      setAnimatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }, 300);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  const EmptyCartIcon = () => (
    <div className="relative">
      <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9m-9 0h9" />
      </svg>
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
        <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Enhanced Backdrop with blur effect */}
      <div 
        className={`fixed inset-0 bg-black transition-all duration-300 z-40 ${
          isClosing ? 'bg-opacity-0 backdrop-blur-0' : 'bg-opacity-50 backdrop-blur-sm'
        }`}
        onClick={handleClose}
      />
      
      {/* Enhanced Sidebar with slide animation */}
      <div className={`fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ${
        isClosing ? 'translate-x-full' : 'translate-x-0'
      }`}>
        {/* Enhanced Header with gradient */}
        <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Shopping Cart</h2>
              <p className="text-blue-100 text-sm mt-1">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:text-blue-200 transition-colors p-2 rounded-full hover:bg-white/10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {/* Decorative wave */}
          <div className="absolute bottom-0 left-0 w-full overflow-hidden">
            <svg className="relative block w-full h-4" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="white"></path>
              <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="white"></path>
              <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="white"></path>
            </svg>
          </div>
        </div>

        {/* Enhanced Cart Items with animations */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <EmptyCartIcon />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-500 text-sm">Add some items to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item: CartItem, index) => (
                <div 
                  key={item.id} 
                  className={`group relative bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-lg transition-all duration-300 transform ${
                    animatingItems.has(item.id) ? 'scale-95 opacity-50' : 'scale-100 opacity-100'
                  }`}
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    animation: `slideIn 0.3s ease-out ${index * 0.1}s both`
                  }}
                >
                  {/* Quantity badge */}
                  <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center z-10">
                    {item.quantity}
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={getItemImage(item)}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg border border-gray-200 group-hover:scale-105 transition-transform duration-200"
                      />
                      {item.product_type === 'esim' && (
                        <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1 py-0.5 rounded text-[10px] font-medium">
                          eSIM
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatPrice(item.price)} each
                      </p>
                      
                      {/* Enhanced quantity controls */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center bg-gray-100 rounded-lg p-1">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-md bg-white shadow-sm flex items-center justify-center text-gray-600 hover:text-blue-600 hover:shadow-md transition-all duration-200"
                            disabled={item.quantity <= 1}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="mx-3 font-semibold text-gray-900 min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-md bg-white shadow-sm flex items-center justify-center text-gray-600 hover:text-blue-600 hover:shadow-md transition-all duration-200"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </button>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-bold text-gray-900 text-lg">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-500 hover:text-red-700 text-sm font-medium hover:underline transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Enhanced Footer with gradient and animations */}
        {items.length > 0 && (
          <div className="bg-white border-t border-gray-200 p-6 space-y-4">
            {/* Order summary */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">{formatPrice(getTotalAmount())}</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-600">Shipping:</span>
                <span className="font-medium text-green-600">FREE</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total:</span>
                  <span className="text-xl font-bold text-blue-600">
                    {formatPrice(getTotalAmount())}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={onCheckout}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <span className="flex items-center justify-center">
                  Proceed to Checkout
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
              
              <button
                onClick={clearCart}
                className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors font-medium border border-gray-200 hover:border-gray-300"
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>

    </>
  );
};

export default CartSidebar;
