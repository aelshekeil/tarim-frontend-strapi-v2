import { FC } from 'react';
import { Routes, Route } from 'react-router-dom';

// Import components
import Hero from './Hero';
import Services from './Services';
import TravelPackages from './TravelPackages';
import VisaApplicationForm from './VisaApplicationForm';
import ApplicationTracking from './ApplicationTracking';
import Shop from './Shop';
import AuthGuard from './AuthGuard';
import Profile from './Profile';

// New components we'll create
import ESIMShop from './ESIMShop';
import TravelAccessories from './Travelaccessories';
import EnhancedTravelPackages from './EnhancedTravelPackages';
import VisaServices from './VisaServices';
import InternationalDrivingLicense from './InternationalDrivingLicense';
import BusinessIncorporation from './BusinessIncorporation';
import Checkout from './Checkout';

const Home: FC = () => (
  <>
    <Hero />
    <Services />
    <TravelPackages />
    <section id="contact" className="py-20 bg-white">
      <div className="container-custom">
        <h2 className="section-title">Contact Us</h2>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg text-gray-600 mb-8">
            Have questions about our services? We're here to help you with all your travel and business needs.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Email</h3>
              <p className="text-gray-600">info@tarimtours.com</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Phone</h3>
              <p className="text-gray-600">+1 (555) 123-4567</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Office Hours</h3>
              <p className="text-gray-600">Mon - Fri: 9AM - 6PM</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </>
);

const RouterComponent: FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/services" element={<Services />} />
      <Route path="/travel-packages" element={<TravelPackages />} />
      <Route path="/visa-application" element={<VisaApplicationForm />} />
      <Route path="/application-tracking" element={<ApplicationTracking />} />
      <Route path="/tracking" element={<ApplicationTracking />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/profile" element={<AuthGuard><Profile /></AuthGuard>} />
      <Route path="/esim" element={<ESIMShop />} />
      <Route path="/travel-accessories" element={<TravelAccessories />} />
      <Route path="/accessories" element={<TravelAccessories />} />
      <Route path="/enhanced-travel-packages" element={<EnhancedTravelPackages />} />
      <Route path="/visa-services" element={<VisaServices />} />
      <Route path="/international-driving-license" element={<InternationalDrivingLicense />} />
      <Route path="/business-incorporation" element={<BusinessIncorporation />} />
      <Route path="/checkout" element={<Checkout />} />
    </Routes>
  );
};

export default RouterComponent;
