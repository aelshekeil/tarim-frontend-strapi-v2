import React, { useState } from 'react';
import { Menu, X, User } from 'lucide-react';
import AuthModal from './AuthModal';

type Page = 'home' | 'shop' | 'visa' | 'tracking';

interface HeaderProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, setCurrentPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Check if user is logged in on component mount
  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleNavigation = (page: Page) => {
    setCurrentPage(page);
    setIsMenuOpen(false);
    
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
              className="text-2xl font-bold text-blue-600 cursor-pointer"
              onClick={() => handleNavigation('home')}
            >
              Tarim Tours
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => handleNavigation('home')}
                className={`font-medium transition-colors ${
                  currentPage === 'home' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('services')}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection('packages')}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Travel Packages
              </button>
              <button
                onClick={() => handleNavigation('shop')}
                className={`font-medium transition-colors ${
                  currentPage === 'shop' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Shop
              </button>
              <button
                onClick={() => handleNavigation('tracking')}
                className={`font-medium transition-colors ${
                  currentPage === 'tracking' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Track Application
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Contact
              </button>
            </nav>

            {/* Auth Section */}
            <div className="hidden md:flex items-center space-x-4">
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
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Login
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
                  Home
                </button>
                <button
                  onClick={() => scrollToSection('services')}
                  className="block px-3 py-2 text-base font-medium text-gray-700 w-full text-left"
                >
                  Services
                </button>
                <button
                  onClick={() => scrollToSection('packages')}
                  className="block px-3 py-2 text-base font-medium text-gray-700 w-full text-left"
                >
                  Travel Packages
                </button>
                <button
                  onClick={() => handleNavigation('shop')}
                  className={`block px-3 py-2 text-base font-medium w-full text-left ${
                    currentPage === 'shop' ? 'text-blue-600' : 'text-gray-700'
                  }`}
                >
                  Shop
                </button>
                <button
                  onClick={() => handleNavigation('tracking')}
                  className={`block px-3 py-2 text-base font-medium w-full text-left ${
                    currentPage === 'tracking' ? 'text-blue-600' : 'text-gray-700'
                  }`}
                >
                  Track Application
                </button>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="block px-3 py-2 text-base font-medium text-gray-700 w-full text-left"
                >
                  Contact
                </button>
                
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
                        Logout
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
                      Login
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
        onAuthSuccess={(user) => {
          setUser(user);
          setIsAuthModalOpen(false);
        }}
      />
    </>
  );
};

export default Header;