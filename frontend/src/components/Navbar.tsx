import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-black text-white px-4 py-3 shadow-md fixed w-full z-50 top-0 left-0 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold">FORENSIA</Link>
        
        {/* Hamburger Menu for mobile */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            aria-label="Toggle menu"
            className="text-white"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Links for larger screens */}
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-purple-400 transition duration-200">Home</Link>
          <Link to="/interrogation" className="hover:text-purple-400 transition duration-200">Interrogation</Link>
          <Link to="/results" className="hover:text-purple-400 transition duration-200">Results</Link>
          <Link to="/login" className="hover:text-purple-400 transition duration-200">Login</Link>
          <Link to="/signup" className="hover:text-purple-400 transition duration-200">Sign Up</Link>
        </div>
      </div>

      {/* Mobile menu with transition */}
      <div 
        className={`md:hidden mt-2 flex flex-col space-y-2 text-white bg-black px-4 py-2 transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
      >
        <Link to="/" onClick={() => setIsOpen(false)} className="py-2 transition duration-200">Home</Link>
        <Link to="/interrogation" onClick={() => setIsOpen(false)} className="py-2 transition duration-200">Interrogation</Link>
        <Link to="/results" onClick={() => setIsOpen(false)} className="py-2 transition duration-200">Results</Link>
        <Link to="/login" onClick={() => setIsOpen(false)} className="py-2 transition duration-200">Login</Link>
        <Link to="/signup" onClick={() => setIsOpen(false)} className="py-2 transition duration-200">Sign Up</Link>
      </div>
    </nav>
  );
};

export default Navbar;
