import React, { useState } from 'react';
import ShoppingCart from 'lucide-react/dist/esm/icons/shopping-cart';
import { useCart } from '../hooks/useCart';
import CartSidebar from './CartSidebar';

const CartButton: React.FC = () => {
  const { getTotalItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleCheckout = () => {
    setIsCartOpen(false);
    // In a real app, you'd navigate to the checkout page, e.g., using react-router-dom
    window.location.href = '/checkout';
  };

  return (
    <>
      <button
        onClick={() => setIsCartOpen(true)}
        className="relative rounded-full p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <ShoppingCart size={24} />
        {getTotalItems() > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {getTotalItems()}
          </span>
        )}
      </button>
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
        onCheckout={handleCheckout}
      />
    </>
  );
};

export default CartButton;
