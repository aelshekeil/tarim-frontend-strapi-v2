import { FC } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';

// Import components
import Header from './Header';
import Hero from './Hero';
import Services from './Services';
import TravelPackages from './TravelPackages';
import VisaApplicationForm from './VisaApplicationForm';
import ApplicationTracking from './ApplicationTracking';
import Shop from './Shop';
import Footer from './Footer';
import AuthGuard from './AuthGuard';

// New components we'll create
import ESIMShop from './ESIMShop';
import TravelAccessories from './Travelaccessories';
import EnhancedTravelPackages from './EnhancedTravelPackages';
import VisaServices from './VisaServices';
import InternationalDrivingLicense from './InternationalDrivingLicense';
import BusinessIncorporation from './BusinessIncorporation';

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

const Router: FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/esim" element={<ESIMShop />} />
          <Route path="/accessories" element={<TravelAccessories />} />
          <Route path="/packages" element={<EnhancedTravelPackages />} />
          <Route path="/visa-services" element={<VisaServices />} />
          <Route path="/international-driving-license" element={<InternationalDrivingLicense />} />
          <Route path="/business-incorporation" element={<BusinessIncorporation />} />
          <Route
            path="/visa"
            element={
              <AuthGuard
                requireAuth={true}
                fallbackMessage="Please log in to submit a visa application. This helps us track your application status and provide personalized service."
              >
                <section className="py-20 bg-white min-h-screen">
                  <div className="container-custom">
                    <h2 className="section-title">Apply for Visa</h2>
                    <VisaApplicationForm />
                  </div>
                </section>
              </AuthGuard>
            }
          />
          <Route
            path="/tracking"
            element={
              <AuthGuard
                requireAuth={true}
                fallbackMessage="Please log in to track your applications. This ensures the security of your personal information."
              >
                <ApplicationTracking />
              </AuthGuard>
            }
          />
        </Routes>
        <Footer />
      </div>
    </HashRouter>
  );
};

export default Router;
