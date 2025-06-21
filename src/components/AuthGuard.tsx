import React, { useState, useEffect } from 'react';
import { User, Lock } from 'lucide-react';
import AuthModal from './AuthModal';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  fallbackMessage?: string;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requireAuth = true, 
  fallbackMessage = "Please log in to access this service." 
}) => {
  const [user, setUser] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('jwt');
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // If auth is not required, render children directly
  if (!requireAuth) {
    return <>{children}</>;
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If user is authenticated, render children
  if (user) {
    return <>{children}</>;
  }

  // If user is not authenticated, show login prompt
  return (
    <>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20">
        <div className="max-w-md w-full mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
            <p className="text-gray-600">{fallbackMessage}</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full btn-primary flex items-center justify-center"
            >
              <User className="w-5 h-5 mr-2" />
              Login / Register
            </button>
            
            <p className="text-sm text-gray-500">
              New to Tarim Tours? Registration is quick and easy!
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Why create an account?</h3>
            <ul className="text-left space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Track your visa applications in real-time
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Save your personal information for faster applications
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Access exclusive travel deals and packages
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Get personalized travel recommendations
              </li>
            </ul>
          </div>
        </div>
      </div>

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

export default AuthGuard;

