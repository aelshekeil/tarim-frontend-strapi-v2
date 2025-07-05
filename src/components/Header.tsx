import { useState, FC } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, ShoppingCart, Globe } from 'lucide-react';
import AuthModal from './AuthModal';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth'; // Import useAuth hook

const Header: FC = () => {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShopMenuOpen, setIsShopMenuOpen] = useState(false);
  const [isServicesMenuOpen, setIsServicesMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { isLoggedIn, user } = useAuth(); // Use the useAuth hook
  const [cartItemCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  const handleCloseMenus = () => {
    setIsMenuOpen(false);
    setIsShopMenuOpen(false);
    setIsServicesMenuOpen(false);
  };

  const scrollToSection = (sectionId: string) => {
    handleCloseMenus();
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('jwt');
    window.dispatchEvent(new CustomEvent('authChange')); // Dispatch event to update auth state
  };

  const getLinkClass = (path: string) => {
    return `font-medium transition-colors ${
      location.pathname === path ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
    }`;
  };

  return (
    <>
      <header className="bg-white shadow-md fixed w-full top-0 z-50">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="text-2xl font-bold text-blue-600 cursor-pointer flex items-center" onClick={handleCloseMenus}>
              <Globe className="mr-2" size={28} />
              {t("common.tarim_tours")}
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className={getLinkClass('/')}>
                {t("common.home")}
              </Link>

              <div className="relative">
                <button
                  onMouseEnter={() => setIsShopMenuOpen(true)}
                  onMouseLeave={() => setIsShopMenuOpen(false)}
                  className={`font-medium transition-colors flex items-center ${
                    location.pathname.startsWith('/shop') || location.pathname.startsWith('/esim') || location.pathname.startsWith('/accessories')
                      ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  {t("common.shop")}
                  <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isShopMenuOpen && (
                  <div 
                    className="absolute top-full left-0 mt-1 w-64 bg-white rounded-md shadow-lg border border-gray-200 py-2"
                    onMouseEnter={() => setIsShopMenuOpen(true)}
                    onMouseLeave={() => setIsShopMenuOpen(false)}
                  >
                    <Link to="/esim" className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors" onClick={handleCloseMenus}>
                      <div className="font-medium">{t("common.esim_data")}</div>
                      <div className="text-sm text-gray-500">Global connectivity solutions</div>
                    </Link>
                    <Link to="/accessories" className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors" onClick={handleCloseMenus}>
                      <div className="font-medium">{t("common.travel_accessories")}</div>
                      <div className="text-sm text-gray-500">Essential travel gear</div>
                    </Link>
                  </div>
                )}
              </div>

              <Link to="/packages" className={getLinkClass('/packages')}>
                {t("common.travel_packages")}
              </Link>

              <div className="relative">
                <button
                  onMouseEnter={() => setIsServicesMenuOpen(true)}
                  onMouseLeave={() => setIsServicesMenuOpen(false)}
                  className={`font-medium transition-colors flex items-center ${
                    location.pathname.startsWith('/visa-services') || location.pathname.startsWith('/international-driving-license') || location.pathname.startsWith('/business-incorporation')
                      ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  {t("common.services")}
                  <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isServicesMenuOpen && (
                  <div 
                    className="absolute top-full left-0 mt-1 w-64 bg-white rounded-md shadow-lg border border-gray-200 py-2"
                    onMouseEnter={() => setIsServicesMenuOpen(true)}
                    onMouseLeave={() => setIsServicesMenuOpen(false)}
                  >
                    <Link to="/visa-services" className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors" onClick={handleCloseMenus}>
                      <div className="font-medium">{t("common.visa_services")}</div>
                      <div className="text-sm text-gray-500">Streamlined visa processing</div>
                    </Link>
                    <Link to="/international-driving-license" className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors" onClick={handleCloseMenus}>
                      <div className="font-medium">{t("common.international_driving_license")}</div>
                      <div className="text-sm text-gray-500">Drive legally worldwide</div>
                    </Link>
                    <Link to="/business-incorporation" className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors" onClick={handleCloseMenus}>
                      <div className="font-medium">{t("common.business_incorporation")}</div>
                      <div className="text-sm text-gray-500">Start your business globally</div>
                    </Link>
                  </div>
                )}
              </div>

              <Link to="/tracking" className={getLinkClass('/tracking')}>
                {t("common.track_application")}
              </Link>

              <button
                onClick={() => scrollToSection('contact')}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                {t("common.contact")}
              </button>
            </nav>
            
            <div className="hidden md:flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                <button
                    onClick={() => i18n.changeLanguage("en")}
                    className={`font-medium transition-colors ${
                    i18n.language === "en" ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
                    }`}
                >
                    EN
                </button>
                <span className="text-gray-400">|</span>
                <button
                    onClick={() => i18n.changeLanguage("ar")}
                    className={`font-medium transition-colors ${
                    i18n.language === "ar" ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
                    }`}
                >
                    AR
                </button>
                </div>

                <button
                    onClick={() => {/* Will implement cart functionality later */}}
                    className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                    <ShoppingCart size={24} />
                    {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItemCount}
                    </span>
                    )}
                </button>

                {isLoggedIn ? (
                    <div className="flex items-center space-x-4">
                        <Link to="/profile" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
                            <User className="w-5 h-5" />
                            <span>{user?.username}</span>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="text-gray-600 hover:text-red-600 font-medium transition-colors"
                        >
                            {t("common.logout")}
                        </button>
                    </div>
                ) : (
                    <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                    {t("common.login")}
                    </button>
                )}
            </div>

            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {isMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-200">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link to="/" className={`block px-3 py-2 text-base font-medium w-full text-left ${getLinkClass('/')}`} onClick={handleCloseMenus}>
                  {t("common.home")}
                </Link>

                <div className="px-3 py-2">
                  <div className="text-base font-medium text-gray-700 mb-2">{t("common.shop")}</div>
                  <Link to="/esim" className={`block px-4 py-2 text-sm w-full text-left ${getLinkClass('/esim')}`} onClick={handleCloseMenus}>
                    {t("common.esim_data")}
                  </Link>
                  <Link to="/accessories" className={`block px-4 py-2 text-sm w-full text-left ${getLinkClass('/accessories')}`} onClick={handleCloseMenus}>
                    {t("common.travel_accessories")}
                  </Link>
                </div>

                <Link to="/packages" className={`block px-3 py-2 text-base font-medium w-full text-left ${getLinkClass('/packages')}`} onClick={handleCloseMenus}>
                  {t("common.travel_packages")}
                </Link>

                <div className="px-3 py-2">
                  <div className="text-base font-medium text-gray-700 mb-2">{t("common.services")}</div>
                  <Link to="/visa-services" className={`block px-4 py-2 text-sm w-full text-left ${getLinkClass('/visa-services')}`} onClick={handleCloseMenus}>
                    {t("common.visa_services")}
                  </Link>
                  <Link to="/international-driving-license" className={`block px-4 py-2 text-sm w-full text-left ${getLinkClass('/international-driving-license')}`} onClick={handleCloseMenus}>
                    {t("common.international_driving_license")}
                  </Link>
                  <Link to="/business-incorporation" className={`block px-4 py-2 text-sm w-full text-left ${getLinkClass('/business-incorporation')}`} onClick={handleCloseMenus}>
                    {t("common.business_incorporation")}
                  </Link>
                </div>

                <Link to="/tracking" className={`block px-3 py-2 text-base font-medium w-full text-left ${getLinkClass('/tracking')}`} onClick={handleCloseMenus}>
                  {t("common.track_application")}
                </Link>

                <button
                  onClick={() => scrollToSection('contact')}
                  className="block px-3 py-2 text-base font-medium text-gray-700 w-full text-left"
                >
                  {t("common.contact")}
                </button>
                
                <div className="flex justify-center space-x-4 py-2">
                  <button
                    onClick={() => i18n.changeLanguage("en")}
                    className={`font-medium transition-colors ${
                      i18n.language === "en" ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
                    }`}
                  >
                    EN
                  </button>
                  <span className="text-gray-400">|</span>
                  <button
                    onClick={() => i18n.changeLanguage("ar")}
                    className={`font-medium transition-colors ${
                      i18n.language === "ar" ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
                    }`}
                  >
                    AR
                  </button>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  {isLoggedIn ? (
                    <div className="px-3 py-2">
                        <Link to="/profile" className="flex items-center space-x-2 mb-2 text-gray-700 hover:text-blue-600" onClick={handleCloseMenus}>
                            <User className="w-5 h-5" />
                            <span>{user?.username}</span>
                        </Link>
                      <button
                        onClick={handleLogout}
                        className="text-red-600 font-medium"
                      >
                        {t("common.logout")}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setIsAuthModalOpen(true);
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-base font-medium text-blue-600"
                    >
                      {t("common.login")}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

export default Header;
