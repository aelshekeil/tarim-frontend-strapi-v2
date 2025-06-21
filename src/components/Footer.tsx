import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-blue-400">Tarim Tours</h3>
            <p className="text-gray-300 mb-4">
              Your trusted partner for global travel services, visa processing, and business solutions.
            </p>
            <div className="flex space-x-4">
              <Facebook size={20} className="text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
              <Twitter size={20} className="text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
              <Instagram size={20} className="text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
              <Linkedin size={20} className="text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Visa Services</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">International Driving License</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Business Incorporation</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Travel Packages</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">eSIM Sales</a></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Track Application</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">FAQ</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Terms & Conditions</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail size={16} className="mr-3 text-blue-400" />
                <span className="text-gray-300">info@tarimtours.com</span>
              </div>
              <div className="flex items-center">
                <Phone size={16} className="mr-3 text-blue-400" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-start">
                <MapPin size={16} className="mr-3 text-blue-400 mt-1" />
                <span className="text-gray-300">
                  123 Travel Street<br />
                  Global City, GC 12345
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 Tarim Tours. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

