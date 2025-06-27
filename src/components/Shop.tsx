import React, { useState, useEffect } from 'react';
import { ShoppingCart, Wifi, Globe } from 'lucide-react';
import strapiAPI from '../lib/api';
import { ESIMProduct } from '../lib/types';

const Shop: React.FC = () => {
  const [esimProducts, setEsimProducts] = useState<ESIMProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Fixed method name: getESIMProducts (not getEsimProducts)
        const products = await strapiAPI.getESIMProducts();
        setEsimProducts(products);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p>Loading eSIM products...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <ShoppingCart className="text-blue-600 mr-3" size={32} />
        <h2 className="text-3xl font-bold">eSIM Shop</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {esimProducts.map((product) => (
          <div key={product.id} className="border rounded-lg overflow-hidden shadow-lg">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <Wifi className="text-green-500 mr-2" />
                {/* Access properties through .attributes since ESIMProduct is a Strapi entity */}
                <h3 className="text-xl font-bold">{product.attributes.country}</h3>
              </div>
              
              <div className="flex justify-between mb-2">
                <span>Data:</span>
                <span className="font-bold">{product.attributes.data_amount}</span>
              </div>
              
              <div className="flex justify-between mb-2">
                <span>Validity:</span>
                <span className="font-bold">{product.attributes.validity}</span>
              </div>
              
              <div className="flex justify-between mb-4">
                <span>Price:</span>
                <span className="font-bold">${product.attributes.price}</span>
              </div>
              
              <button className="w-full btn-primary flex items-center justify-center">
                <Globe className="mr-2" size={18} />
                Buy eSIM
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;