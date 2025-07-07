import * as React from 'react';
import FileText from 'lucide-react/dist/esm/icons/file-text';
import Car from 'lucide-react/dist/esm/icons/car';
import Building from 'lucide-react/dist/esm/icons/building';
import Plane from 'lucide-react/dist/esm/icons/plane';
import Smartphone from 'lucide-react/dist/esm/icons/smartphone';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Services: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!user);
  }, []);

  const services = [
    {
      icon: <FileText size={48} />,
      title: 'Visa Services',
      description: 'E-Visa and Transit Visa services for multiple countries with fast processing.',
      features: ['E-Visa Processing', 'Transit Visa', 'Document Assistance', 'Fast Approval'],
      action: 'Apply Now',
      onClick: () => navigate('/visa-services'),
      requiresAuth: true
    },
    {
      icon: <Car size={48} />,
      title: 'International Driving License',
      description: 'Get your International Driving Permit recognized worldwide.',
      features: ['Worldwide Recognition', 'Quick Processing', 'Document Support', 'Multiple Languages'],
      action: 'Apply Now',
      onClick: () => navigate('/international-driving-license'),
      requiresAuth: true
    },
    {
      icon: <Building size={48} />,
      title: 'Business Incorporation',
      description: 'Establish your business in Indonesia, Malaysia, Singapore, or UK.',
      features: ['Company Registration', 'Legal Documentation', 'Tax Setup', 'Banking Assistance'],
      action: 'Learn More',
      onClick: () => navigate('/business-incorporation'),
      requiresAuth: true
    },
    {
      icon: <Plane size={48} />,
      title: 'Travel Packages',
      description: 'Curated travel experiences to destinations worldwide.',
      features: ['Custom Itineraries', 'Group Discounts', 'Local Guides', 'All-Inclusive Options'],
      action: 'View Packages',
      onClick: () => navigate('/packages'),
      requiresAuth: false
    },
    {
      icon: <Smartphone size={48} />,
      title: 'eSIM Sales',
      description: 'Stay connected globally with our eSIM packages.',
      features: ['Global Coverage', 'Instant Activation', 'Data Plans', 'No Roaming Fees'],
      action: 'Shop Now',
      onClick: () => navigate('/esim'),
      requiresAuth: false
    }
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="container-custom">
        <h2 className="section-title">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="service-card bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <div className="text-blue-600 mb-6">
                {service.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">{service.title}</h3>
              <p className="text-gray-600 mb-6">{service.description}</p>
              <ul className="space-y-2 mb-6">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    {feature}
                  </li>
                ))}
              </ul>
              <button 
                className="w-full btn-primary flex items-center justify-center space-x-2"
                onClick={service.onClick}
              >
                <span>{service.action}</span>
                <ArrowRight size={16} />
                {service.requiresAuth && !isLoggedIn && (
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full ml-2">
                    Login Required
                  </span>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
