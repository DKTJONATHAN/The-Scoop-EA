import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../logo.png';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 text-white shadow-lg relative">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="The Scoop EA Logo" className="h-12 w-12 rounded-full object-cover shadow-md" />
          </Link>

          {/* Center Title */}
          <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:block">
            <h1 className="text-3xl font-bold tracking-wide">
              <span className="text-white">The Scoop </span>
              <span className="text-black">EA</span>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-8">
              <li>
                <Link 
                  to="/" 
                  className="text-white hover:text-orange-200 transition-colors duration-300 font-medium tracking-wide"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-white hover:text-orange-200 transition-colors duration-300 font-medium tracking-wide"
                >
                  About
                </Link>
              </li>
            </ul>
          </nav>

          {/* Hamburger Menu Button for Mobile */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1.5 focus:outline-none"
            aria-label="Toggle mobile menu"
          >
            <span 
              className={`block h-0.5 w-6 bg-white transform transition-all duration-300 ${
                isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            />
            <span 
              className={`block h-0.5 w-6 bg-white transition-opacity duration-300 ${
                isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span 
              className={`block h-0.5 w-6 bg-white transform transition-all duration-300 ${
                isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            />
          </button>
        </div>

        {/* Mobile Title (shown when menu is closed) */}
        <div className="md:hidden mt-3 text-center">
          <h1 className="text-2xl font-bold tracking-wide">
            <span className="text-white">The Scoop </span>
            <span className="text-black">EA</span>
          </h1>
        </div>

        {/* Mobile Navigation Menu */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
          }`}
        >
          <nav className="bg-gradient-to-b from-orange-600 to-orange-700 rounded-lg shadow-inner">
            <ul className="flex flex-col space-y-2 p-4">
              <li>
                <Link 
                  to="/" 
                  className="block text-white hover:text-orange-200 hover:bg-orange-500 px-4 py-3 rounded-md transition-all duration-200 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="block text-white hover:text-orange-200 hover:bg-orange-500 px-4 py-3 rounded-md transition-all duration-200 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;