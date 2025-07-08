import React, { useState, useEffect } from 'react';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';

const Hero: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);

  const services = [
    'Visa Services',
    'International Driving License',
    'Business Incorporation',
    'Travel Packages',
    'eSIM Solutions'
  ];

  useEffect(() => {
    setIsVisible(true);
    
    const interval = setInterval(() => {
      setCurrentServiceIndex((prev) => (prev + 1) % services.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Enhanced Tarim Mosque Tower - More detailed and authentic
  const TarimTowerIcon = ({ size = 100, className = "" }) => (
    <svg 
      width={size} 
      height={size * 1.5} 
      viewBox="0 0 120 180" 
      className={className}
      fill="none"
    >
      {/* Base foundation */}
      <rect x="20" y="160" width="80" height="18" fill="currentColor" className="opacity-90" />
      <rect x="18" y="158" width="84" height="2" fill="rgba(255,255,255,0.2)" />
      
      {/* Main base structure */}
      <rect x="25" y="140" width="70" height="25" fill="currentColor" className="opacity-95" />
      <rect x="23" y="138" width="74" height="2" fill="rgba(255,255,255,0.2)" />
      
      {/* Multi-tiered tower structure with Islamic proportions */}
      <rect x="30" y="115" width="60" height="30" fill="currentColor" className="opacity-95" />
      <rect x="28" y="113" width="64" height="2" fill="rgba(255,255,255,0.2)" />
      
      <rect x="35" y="90" width="50" height="30" fill="currentColor" />
      <rect x="33" y="88" width="54" height="2" fill="rgba(255,255,255,0.2)" />
      
      <rect x="40" y="65" width="40" height="30" fill="currentColor" className="opacity-95" />
      <rect x="38" y="63" width="44" height="2" fill="rgba(255,255,255,0.2)" />
      
      <rect x="45" y="40" width="30" height="30" fill="currentColor" />
      <rect x="43" y="38" width="34" height="2" fill="rgba(255,255,255,0.2)" />
      
      <rect x="50" y="20" width="20" height="25" fill="currentColor" className="opacity-95" />
      <rect x="48" y="18" width="24" height="2" fill="rgba(255,255,255,0.2)" />
      
      {/* Dome with Islamic styling */}
      <ellipse cx="60" cy="16" rx="14" ry="10" fill="currentColor" className="opacity-85" />
      <ellipse cx="60" cy="14" rx="12" ry="8" fill="rgba(255,255,255,0.1)" />
      
      {/* Minaret finial */}
      <rect x="58" y="5" width="4" height="15" fill="currentColor" className="opacity-90" />
      <circle cx="60" cy="4" r="2" fill="currentColor" className="opacity-80" />
      <path d="M60 2 L58 6 L62 6 Z" fill="currentColor" className="opacity-70" />
      
      {/* Detailed Islamic windows and arches */}
      {/* Top level */}
      <path d="M52 25 Q54 22 56 25 L56 32 L52 32 Z" fill="rgba(255,255,255,0.4)" />
      <path d="M64 25 Q66 22 68 25 L68 32 L64 32 Z" fill="rgba(255,255,255,0.4)" />
      
      {/* Second level */}
      <path d="M47 45 Q49 42 51 45 L51 52 L47 52 Z" fill="rgba(255,255,255,0.4)" />
      <path d="M57 45 Q59 42 61 45 L61 52 L57 52 Z" fill="rgba(255,255,255,0.4)" />
      <path d="M67 45 Q69 42 71 45 L71 52 L67 52 Z" fill="rgba(255,255,255,0.4)" />
      
      {/* Third level */}
      <path d="M42 70 Q44 67 46 70 L46 77 L42 77 Z" fill="rgba(255,255,255,0.4)" />
      <path d="M52 70 Q54 67 56 70 L56 77 L52 77 Z" fill="rgba(255,255,255,0.4)" />
      <path d="M62 70 Q64 67 66 70 L66 77 L62 77 Z" fill="rgba(255,255,255,0.4)" />
      <path d="M72 70 Q74 67 76 70 L76 77 L72 77 Z" fill="rgba(255,255,255,0.4)" />
      
      {/* Fourth level */}
      <path d="M37 95 Q39 92 41 95 L41 102 L37 102 Z" fill="rgba(255,255,255,0.4)" />
      <path d="M47 95 Q49 92 51 95 L51 102 L47 102 Z" fill="rgba(255,255,255,0.4)" />
      <path d="M57 95 Q59 92 61 95 L61 102 L57 102 Z" fill="rgba(255,255,255,0.4)" />
      <path d="M67 95 Q69 92 71 95 L71 102 L67 102 Z" fill="rgba(255,255,255,0.4)" />
      <path d="M77 95 Q79 92 81 95 L81 102 L77 102 Z" fill="rgba(255,255,255,0.4)" />
      
      {/* Balcony railings with Islamic geometric patterns */}
      <rect x="43" y="37" width="34" height="1" fill="rgba(255,255,255,0.3)" />
      <rect x="38" y="62" width="44" height="1" fill="rgba(255,255,255,0.3)" />
      <rect x="33" y="87" width="54" height="1" fill="rgba(255,255,255,0.3)" />
      <rect x="28" y="112" width="64" height="1" fill="rgba(255,255,255,0.3)" />
      
      {/* Decorative Islamic geometric patterns */}
      <path d="M45 80 L47 82 L49 80 L51 82 L53 80 L55 82 L57 80 L59 82 L61 80 L63 82 L65 80 L67 82 L69 80 L71 82 L73 80 L75 82" 
            stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" fill="none" />
      <path d="M40 105 L42 107 L44 105 L46 107 L48 105 L50 107 L52 105 L54 107 L56 105 L58 107 L60 105 L62 107 L64 105 L66 107 L68 105 L70 107 L72 105 L74 107 L76 105 L78 107 L80 105" 
            stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" fill="none" />
      
      {/* Side minarets with domes */}
      <rect x="5" y="130" width="12" height="35" fill="currentColor" className="opacity-85" />
      <rect x="103" y="130" width="12" height="35" fill="currentColor" className="opacity-85" />
      <ellipse cx="11" cy="127" rx="7" ry="5" fill="currentColor" className="opacity-75" />
      <ellipse cx="109" cy="127" rx="7" ry="5" fill="currentColor" className="opacity-75" />
      
      {/* Minaret details */}
      <path d="M7 135 Q9 132 11 135 L11 142 L7 142 Z" fill="rgba(255,255,255,0.4)" />
      <path d="M105 135 Q107 132 109 135 L109 142 L105 142 Z" fill="rgba(255,255,255,0.4)" />
      
      {/* Connecting arcaded structure */}
      <rect x="17" y="150" width="86" height="15" fill="currentColor" className="opacity-90" />
      <path d="M20 152 Q22 150 24 152 L24 160 L20 160 Z" fill="rgba(255,255,255,0.2)" />
      <path d="M28 152 Q30 150 32 152 L32 160 L28 160 Z" fill="rgba(255,255,255,0.2)" />
      <path d="M36 152 Q38 150 40 152 L40 160 L36 160 Z" fill="rgba(255,255,255,0.2)" />
      <path d="M44 152 Q46 150 48 152 L48 160 L44 160 Z" fill="rgba(255,255,255,0.2)" />
      <path d="M52 152 Q54 150 56 152 L56 160 L52 160 Z" fill="rgba(255,255,255,0.2)" />
      <path d="M60 152 Q62 150 64 152 L64 160 L60 160 Z" fill="rgba(255,255,255,0.2)" />
      <path d="M68 152 Q70 150 72 152 L72 160 L68 160 Z" fill="rgba(255,255,255,0.2)" />
      <path d="M76 152 Q78 150 80 152 L80 160 L76 160 Z" fill="rgba(255,255,255,0.2)" />
      <path d="M84 152 Q86 150 88 152 L88 160 L84 160 Z" fill="rgba(255,255,255,0.2)" />
      <path d="M92 152 Q94 150 96 152 L96 160 L92 160 Z" fill="rgba(255,255,255,0.2)" />
      <path d="M100 152 Q102 150 104 152 L104 160 L100 160 Z" fill="rgba(255,255,255,0.2)" />
      
      {/* Shadow and depth effects */}
      <path d="M25 165 Q60 170 95 165" stroke="rgba(0,0,0,0.1)" strokeWidth="2" fill="none" />
    </svg>
  );

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background inspired by the sky and architecture of Tarim */}
      <div className="absolute inset-0">
        {/* Sky gradient similar to the image */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-400 via-blue-300 to-blue-200"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white to-blue-100 opacity-40"></div>
        
        {/* Cloud-like floating elements */}
        <div className="absolute top-10 left-20 w-40 h-20 bg-white rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-32 right-32 w-32 h-16 bg-white rounded-full opacity-15 animate-float animation-delay-2s"></div>
        <div className="absolute top-20 right-20 w-24 h-12 bg-white rounded-full opacity-25 animate-float animation-delay-4s"></div>
        
        {/* Architectural pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-amber-800 transform rotate-45"></div>
          <div className="absolute bottom-1/4 right-1/4 w-24 h-24 border-2 border-amber-800 transform rotate-45"></div>
        </div>
        
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900 via-blue-800 to-indigo-900 opacity-80"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            {/* Mosque Tower Logo */}
            <div className={`transform transition-all duration-1500 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <div className="flex justify-center mb-8">
                <div className="relative group">
                  <TarimTowerIcon 
                    size={140} 
                    className="text-amber-100 group-hover:text-white transition-colors duration-500 drop-shadow-2xl filter" 
                  />
                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 bg-amber-200 opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-full blur-2xl"></div>
                  {/* Reflection effect */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-20 h-8 bg-gradient-to-b from-amber-100 to-transparent opacity-10 blur-sm"></div>
                </div>
              </div>
            </div>

            {/* Brand Name with Arabic influence */}
            <div className={`transform transition-all duration-1500 delay-300 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <div className="mb-4">
                <h1 className="text-6xl md:text-8xl font-light tracking-wider mb-2 relative">
                  <span className="bg-gradient-to-r from-amber-200 via-yellow-100 to-white bg-clip-text text-transparent relative">
                    TA<span className="text-amber-300">R</span>IM
                  </span>
                </h1>
                <div className="text-2xl md:text-4xl font-light tracking-[0.5em] text-amber-200 mb-6">
                  TOURS
                </div>
                {/* Decorative line inspired by Islamic calligraphy */}
                <div className="flex justify-center items-center mb-8">
                  <div className="w-16 h-px bg-gradient-to-r from-transparent to-amber-300"></div>
                  <div className="mx-4 w-2 h-2 bg-amber-300 rounded-full"></div>
                  <div className="w-16 h-px bg-gradient-to-l from-transparent to-amber-300"></div>
                </div>
              </div>
            </div>

            {/* Tagline with cultural reference */}
            <div className={`transform transition-all duration-1500 delay-500 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <div className="mb-6">
                <p className="text-lg md:text-xl text-amber-200 mb-2 font-light">
                  من تريم إلى العالم • From Tarim to the World
                </p>
                <h2 className="text-3xl md:text-5xl font-light mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-white via-blue-100 to-amber-100 bg-clip-text text-transparent">
                    Your Gateway to Global
                  </span>
                  <br />
                  <span className="text-amber-200 font-normal">Travel & Services</span>
                </h2>
              </div>
            </div>

            {/* Animated Service Display */}
            <div className={`transform transition-all duration-1500 delay-700 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <div className="text-lg md:text-xl mb-2 text-blue-100">
                خدماتنا المتخصصة • Our Specialized Services
              </div>
              <div className="h-12 md:h-16 mb-8 flex items-center justify-center">
                <div className="relative">
                  <div className="text-2xl md:text-3xl font-light bg-gradient-to-r from-amber-300 to-yellow-100 bg-clip-text text-transparent transition-all duration-500">
                    {services[currentServiceIndex]}
                  </div>
                  <div className="absolute -bottom-2 left-0 right-0 h-px bg-gradient-to-r from-amber-400 to-amber-200 transform scale-x-0 animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Service Pills */}
            <div className={`transform transition-all duration-1500 delay-900 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <div className="flex flex-wrap justify-center gap-3 mb-12 max-w-4xl mx-auto">
                {services.map((service, index) => (
                  <div
                    key={service}
                    className={`px-5 py-3 rounded-full border backdrop-blur-sm transition-all duration-300 text-sm md:text-base font-light ${
                      index === currentServiceIndex
                        ? 'bg-amber-200 bg-opacity-20 text-amber-100 border-amber-300 border-opacity-60 shadow-lg'
                        : 'bg-white bg-opacity-10 text-white border-white border-opacity-30 hover:bg-amber-200 hover:bg-opacity-10 hover:border-amber-200 hover:shadow-md'
                    }`}
                  >
                    {service}
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className={`transform transition-all duration-1500 delay-1100 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button 
                  onClick={() => scrollToSection('services')}
                  className="group relative bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-10 py-4 rounded-full font-medium text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center space-x-3 border border-amber-500"
                >
                  <span>استكشف خدماتنا • Explore Services</span>
                  <ArrowRight 
                    size={20} 
                    className="group-hover:translate-x-1 transition-transform duration-300" 
                  />
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-full transition-opacity duration-300"></div>
                </button>
                
                <button 
                  onClick={() => scrollToSection('tracking')}
                  className="group relative bg-transparent border-2 border-amber-200 text-amber-200 hover:bg-amber-200 hover:text-blue-900 px-10 py-4 rounded-full font-medium text-lg transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
                >
                  <span className="relative z-10">تتبع الطلب • Track Application</span>
                  <div className="absolute inset-0 bg-amber-200 opacity-0 group-hover:opacity-100 rounded-full transition-opacity duration-300"></div>
                </button>
              </div>
            </div>

            {/* Scroll Indicator */}
            <div className={`transform transition-all duration-1500 delay-1300 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <div className="mt-16 flex flex-col items-center">
                <div className="text-amber-200 text-opacity-70 text-sm mb-2">اكتشف المزيد • Discover More</div>
                <div className="w-6 h-10 border-2 border-amber-200 border-opacity-40 rounded-full flex justify-center">
                  <div className="w-1 h-3 bg-amber-200 bg-opacity-70 rounded-full mt-2 animate-bounce"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animation-delay-2s {
          animation-delay: 2s;
        }
        
        .animation-delay-4s {
          animation-delay: 4s;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </section>
  );
};

export default Hero;