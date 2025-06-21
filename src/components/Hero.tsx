import React from 'react';
import { ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="hero-gradient text-white py-20">
      <div className="container-custom">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Your Gateway to Global Travel & Services
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Visa Services • International Driving License • Business Incorporation • Travel Packages • eSIM
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => scrollToSection('services')}
              className="btn-primary bg-white text-blue-600 hover:bg-gray-100 flex items-center justify-center space-x-2"
            >
              <span>Explore Services</span>
              <ArrowRight size={20} />
            </button>
            <button 
              onClick={() => scrollToSection('tracking')}
              className="btn-secondary bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600"
            >
              Track Application
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

