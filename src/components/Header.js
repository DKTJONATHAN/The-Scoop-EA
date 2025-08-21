import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../logo.png';

const Header = () => {
  return (
    <header className="bg-orange-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/">
          <img src={logo} alt="The Scoop EA Logo" className="h-12" />
        </Link>
        <nav>
          <ul className="flex space-x-6">
            <li><Link to="/" className="hover:underline">Home</Link></li>
            <li><Link to="/about" className="hover:underline">About</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;