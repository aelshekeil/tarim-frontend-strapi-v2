import React, { useState } from 'react';
import { MapPin, Calendar, Star } from 'lucide-react';
import { useAPI } from '../hooks/useAPI';
import strapiAPI from '../lib/api';
import { formatCurrency } from '../lib/utils';
import { TravelPackage } from '../lib/types'; // Import TravelPackage interface

const TravelPackages: React.FC = () => {
  const [showAll, setShowAll] = useState(false);
  
  // Fetch travel packages from Strapi
  const { data: packages, loading, error } = useAPI<TravelPackage[]>(
    () => strapiAPI.getTravelPackages(showAll ? undefined : true),
    [showAll]
  );

  if (loading) {
    return (
      <section id="packages" className="py-20 bg-gray-50">
        <div className="container-custom">
          <h2 className="section-title">Featured Travel Packages</h2>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading travel packages...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="packages" className="py-20 bg-gray-50">
        <div className="container-custom">
          <h2 className="section-title">Featured Travel Packages</h2>
          <div className="text-center">
            <p className="text-red-600">Error loading packages: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  const displayPackages = packages || [];

  return (
    <section id="packages" className="py-20 bg-gray-50">
      <div className="container-custom">
        <h2 className="section-title">
          {showAll ? 'All Travel Packages' : 'Featured Travel Packages'}
        </h2>
        
        {displayPackages.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-600">No travel packages available at the moment.</p>
            <p className="text-sm text-gray-500 mt-2">Check back soon for exciting travel opportunities!</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayPackages.map((pkg: TravelPackage) => {
                // THIS IS THE NEW LOGGING LINE
                console.log('Rendering package:', pkg);

                return (
                  <div key={pkg.id} className="bg-white rounded-xl shadow-lg overflow-hidden service-card">
                    <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center relative">
                      {pkg.cover_image && pkg.cover_image.url ? (
                        <img 
                          src={pkg.cover_image.url} 
                          alt={pkg.cover_image.alternativeText || pkg.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <MapPin size={48} className="text-white" />
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500 flex items-center">
                          <MapPin size={16} className="mr-1" />
                          {pkg.destination}
                        </span>
                        {pkg.rating && (
                          <div className="flex items-center">
                            <Star size={16} className="text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600 ml-1">{pkg.rating}</span>
                          </div>
                        )}
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-gray-800">{pkg.title}</h3>
                      <p className="text-gray-600 mb-4 text-sm line-clamp-3">{pkg.description}</p>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar size={16} className="mr-1" />
                          {pkg.duration}
                        </div>
                        <div className="text-2xl font-bold text-blue-600">
                          {formatCurrency(pkg.price)}
                        </div>
                      </div>
                      <button className="w-full btn-primary">
                        Book Now
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="text-center mt-12">
              <button 
                onClick={() => setShowAll(!showAll)}
                className="btn-secondary"
              >
                {showAll ? 'Show Featured Only' : 'View All Packages'}
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default TravelPackages;
