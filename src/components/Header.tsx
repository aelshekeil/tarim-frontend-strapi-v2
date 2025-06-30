import React, { useState, FC, useEffect } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { Menu, X, User, ShoppingCart, Globe } from 'lucide-react';
import AuthModal from './AuthModal';
import { useTranslation } from 'react-i18next';

type Page = 'home' | 'shop' | 'esim' | 'accessories' | 'visa' | 'tracking' | 'packages';

interface HeaderProps {
  currentPage: Page;
  setCurrentPage: Dispatch<SetStateAction<Page>>;
}

const Header: FC<HeaderProps> = ({ currentPage, setCurrentPage }) => {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShopMenuOpen, setIsShopMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [cartItemCount, setCartItemCount] = useState(0); // This will be connected to actual cart later

  // Check if user is logged in on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleNavigation = (page: Page) => {
    setCurrentPage(page);
    setIsMenuOpen(false);
    setIsShopMenuOpen(false);
    
    // Scroll to top when navigating
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId: string) => {
    if (currentPage !== 'home') {
      setCurrentPage('home');
      // Wait for page to render then scroll
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
    setIsMenuOpen(false);
    setIsShopMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('jwt');
    setUser(null);
  };

  return (
    <>
      <header className="bg-white shadow-md fixed w-full top-0 z-50">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div 
              className="text-2xl font-bold text-blue-600 cursor-pointer flex items-center"
              onClick={() => handleNavigation('home')}
            >
              <Globe className="mr-2" size={28} />
              {t("common.tarim_tours")}
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => handleNavigation('home')}
                className={`font-medium transition-colors ${
                  currentPage === 'home' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                {t("common.home")}
              </button>

              {/* Enhanced Shop Dropdown */}
              <div className="relative">
                <button
                  onMouseEnter={() => setIsShopMenuOpen(true)}
                  onMouseLeave={() => setIsShopMenuOpen(false)}
                  className={`font-medium transition-colors flex items-center ${
                    currentPage === 'shop' || currentPage === 'esim' || currentPage === 'accessories' 
                      ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  {t("common.shop")}
                  <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Shop Dropdown Menu */}
                {isShopMenuOpen && (
                  <div 
                    className="absolute top-full left-0 mt-1 w-64 bg-white rounded-md shadow-lg border border-gray-200 py-2"
                    onMouseEnter={() => setIsShopMenuOpen(true)}
                    onMouseLeave={() => setIsShopMenuOpen(false)}
                  >
                    <button
                      onClick={() => handleNavigation('esim')}
                      className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <div className="font-medium">{t("common.esim_data")}</div>
                      <div className="text-sm text-gray-500">Global connectivity solutions</div>
                    </button>
                    <button
                      onClick={() => handleNavigation('accessories')}
                      className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <div className="font-medium">{t("common.travel_accessories")}</div>
                      <div className="text-sm text-gray-500">Essential travel gear</div>
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleNavigation('packages')}
                className={`font-medium transition-colors ${
                  currentPage === 'packages' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                {t("common.travel_packages")}
              </button>

              <button
                onClick={() => scrollToSection('services')}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                {t("common.services")}
              </button>

              <button
                onClick={() => handleNavigation('tracking')}
                className={`font-medium transition-colors ${
                  currentPage === 'tracking' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                {t("common.track_application")}
              </button>

              <button
                onClick={() => scrollToSection('contact')}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                {t("common.contact")}
              </button>
            </nav>
            
            <div className="hidden md:flex items-center space-x-4">
                {/* Language Switcher */}
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

                {/* Cart Icon */}
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

                {/* Auth Section */}
                {user ? (
                    <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <User className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-700">{user.username}</span>
                    </div>
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


            {/* Mobile menu button */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-200">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <button
                  onClick={() => handleNavigation('home')}
                  className={`block px-3 py-2 text-base font-medium w-full text-left ${
                    currentPage === 'home' ? 'text-blue-600' : 'text-gray-700'
                  }`}
                >
                  {t("common.home")}
                </button>

                {/* Mobile Shop Section */}
                <div className="px-3 py-2">
                  <div className="text-base font-medium text-gray-700 mb-2">{t("common.shop")}</div>
                  <button
                    onClick={() => handleNavigation('esim')}
                    className={`block px-4 py-2 text-sm w-full text-left ${
                      currentPage === 'esim' ? 'text-blue-600' : 'text-gray-600'
                    }`}
                  >
                    {t("common.esim_data")}
                  </button>
                  <button
                    onClick={() => handleNavigation('accessories')}
                    className={`block px-4 py-2 text-sm w-full text-left ${
                      currentPage === 'accessories' ? 'text-blue-600' : 'text-gray-600'
                    }`}
                  >
                    {t("common.travel_accessories")}
                  </button>
                </div>

                <button
                  onClick={() => handleNavigation('packages')}
                  className={`block px-3 py-2 text-base font-medium w-full text-left ${
                    currentPage === 'packages' ? 'text-blue-600' : 'text-gray-700'
                  }`}
                >
                  {t("common.travel_packages")}
                </button>

                <button
                  onClick={() => scrollToSection('services')}
                  className="block px-3 py-2 text-base font-medium text-gray-700 w-full text-left"
                >
                  {t("common.services")}
                </button>

                <button
                  onClick={() => handleNavigation('tracking')}
                  className={`block px-3 py-2 text-base font-medium w-full text-left ${
                    currentPage === 'tracking' ? 'text-blue-600' : 'text-gray-700'
                  }`}
                >
                  {t("common.track_application")}
                </button>

                <button
                  onClick={() => scrollToSection('contact')}
                  className="block px-3 py-2 text-base font-medium text-gray-700 w-full text-left"
                >
                  {t("common.contact")}
                </button>
                
                {/* Mobile Language Switcher */}
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

                {/* Mobile Auth */}
                <div className="border-t border-gray-200 pt-4">
                  {user ? (
                    <div className="px-3 py-2">
                      <div className="flex items-center space-x-2 mb-2">
                        <User className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-700">{user.username}</span>
                      </div>
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

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(user: any) => {
          setUser(user);
          setIsAuthModalOpen(false);
        }}
      />
    </>
  );
};

export default Header;
