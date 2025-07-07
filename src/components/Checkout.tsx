import React from 'react';
import { useCart } from '../hooks/useCart';
import { useTranslation } from 'react-i18next';

const Checkout: React.FC = () => {
  const { t } = useTranslation();
  const { cart, getTotalAmount } = useCart();

  return (
    <div className="container-custom py-20">
      <h1 className="text-3xl font-bold mb-8">{t('checkout.title')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">{t('checkout.order_summary')}</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            {cart.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-500">{t('checkout.quantity')}: {item.quantity}</p>
                </div>
                <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            <hr className="my-4" />
            <div className="flex justify-between items-center font-bold text-lg">
              <p>{t('checkout.total')}</p>
              <p>${getTotalAmount().toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">{t('checkout.payment_information')}</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p>{t('checkout.payment_form_placeholder')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
