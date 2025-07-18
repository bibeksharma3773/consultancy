"use client"
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isStudyOpen, setIsStudyOpen] = useState(false);
  const [isPartnerOpen, setIsPartnerOpen] = useState(false);
  const [isMobileStudyOpen, setIsMobileStudyOpen] = useState(false);
  const [isMobilePartnerOpen, setIsMobilePartnerOpen] = useState(false);
  
  const studyRef = useRef<HTMLDivElement>(null);
  const partnerRef = useRef<HTMLDivElement>(null);

  // Countries for the dropdown
  const studyCountries = [
    { name: "United Kingdom", flag: "🇬🇧" },
    { name: "Dubai", flag: "🇦🇪" },
    { name: "Canada", flag: "🇨🇦" },
    { name: "Australia", flag: "🇦🇺" },
    { name: "United States", flag: "🇺🇸" },
    { name: "Germany", flag: "🇩🇪" },
    { name: "France", flag: "🇫🇷" }
  ];

  // Partner options
  const partnerOptions = [
    { name: "University", icon: "🏫" },
    { name: "Recruitment Partner", icon: "🤝" }
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      
      if (isMenuOpen && target && !target.closest('#mobile-menu') && !target.closest('#menu-button')) {
        setIsMenuOpen(false);
      }
      
      if (isStudyOpen && target && !studyRef.current?.contains(target)) {
        setIsStudyOpen(false);
      }
      
      if (isPartnerOpen && target && !partnerRef.current?.contains(target)) {
        setIsPartnerOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen, isStudyOpen, isPartnerOpen]);

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              {/* Logo image with proper size control */}
              <div className="relative w-[70px] h-[40px]">
                <Image 
                  src="/img/logo.jpg" 
                  alt="ApplyBoard Logo" 
                  fill
                  className="rounded-xl bg-gray-200 object-contain"
                />
              </div>
              
              {/* "ApplyBoard" text - hidden on mobile */}
              <span className="text-blue-600 font-bold text-2xl ml-2 hidden md:block">
                ApplyBoard
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:space-x-1 lg:space-x-4">
            {/* Study Dropdown */}
            <div 
              className="relative" 
              id="study-desktop" 
              ref={studyRef}
              onMouseEnter={() => setIsStudyOpen(true)}
              onMouseLeave={() => setIsStudyOpen(false)}
            >
              {/* Connector area to prevent gap */}
              <div className="absolute top-full left-0 right-0 h-2 bg-transparent" />
              
              <button
                onClick={() => setIsStudyOpen(!isStudyOpen)}
                className="flex items-center text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium transition-colors"
                aria-expanded={isStudyOpen}
              >
                Study
                <svg
                  className={`ml-1 h-5 w-5 transition-transform ${isStudyOpen ? 'rotate-180' : ''}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {isStudyOpen && (
                <div
                  id="study-dropdown"
                  className="absolute z-10 top-full mt-1 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  <div className="py-1">
                    <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Popular Destinations
                    </div>
                    {studyCountries.map((country) => (
                      <Link
                        key={country.name}
                        href={`/study/${country.name.toLowerCase().replace(/\s+/g, '-')}`}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        onClick={() => setIsStudyOpen(false)}
                      >
                        <span className="mr-2 text-lg">{country.flag}</span>
                        {country.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Partner Dropdown */}
            <div 
              className="relative" 
              id="partner-desktop" 
              ref={partnerRef}
              onMouseEnter={() => setIsPartnerOpen(true)}
              onMouseLeave={() => setIsPartnerOpen(false)}
            >
              {/* Connector area to prevent gap */}
              <div className="absolute top-full left-0 right-0 h-2 bg-transparent" />
              
              <button
                onClick={() => setIsPartnerOpen(!isPartnerOpen)}
                className="flex items-center text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium transition-colors"
                aria-expanded={isPartnerOpen}
              >
                Partner
                <svg
                  className={`ml-1 h-5 w-5 transition-transform ${isPartnerOpen ? 'rotate-180' : ''}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {isPartnerOpen && (
                <div
                  id="partner-dropdown"
                  className="absolute z-10 top-full mt-1 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  <div className="py-1">
                    <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Partner Types
                    </div>
                    {partnerOptions.map((option) => (
                      <Link
                        key={option.name}
                        href={`/partner/${option.name.toLowerCase().replace(/\s+/g, '-')}`}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        onClick={() => setIsPartnerOpen(false)}
                      >
                        <span className="mr-2 text-lg">{option.icon}</span>
                        {option.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Program Link (replaces Resources) */}
            <Link href="/program" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium transition-colors">
              Program
            </Link>
            
            <NavItem href="/immigrate" text="Immigrate" />
            <Link href="/feedback" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium transition-colors">
              FeedBack
            </Link>
          </nav>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Log in
            </Link>
            <Link href="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium">
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              id="menu-button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 bg-white z-40 transform ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } transition-transform duration-300 ease-in-out md:hidden`}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center px-4 py-4 border-b">
            <Link href="/" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
              {/* Mobile menu logo with proper size */}
              <div className="relative w-[150px] h-[150px]">
                <Image 
                  src="/img/logo.jpg" 
                  alt="ApplyBoard Logo" 
                  fill
                  className="rounded-xl border-2 border-dashed bg-gray-200 object-contain"
                />
              </div>
            </Link>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
              aria-label="Close menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto py-6 px-4">
            <nav className="flex flex-col space-y-1">
              {/* Mobile Study Dropdown */}
              <div className="flex flex-col">
                <button
                  onClick={() => setIsMobileStudyOpen(!isMobileStudyOpen)}
                  className="flex items-center justify-between text-gray-700 hover:text-blue-600 py-3 px-4 rounded-lg hover:bg-gray-50 text-lg font-medium transition-colors"
                >
                  <span>Study</span>
                  <svg
                    className={`h-5 w-5 transition-transform ${isMobileStudyOpen ? 'rotate-180' : ''}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {isMobileStudyOpen && (
                  <div className="pl-6 mt-1 space-y-1">
                    {studyCountries.map((country) => (
                      <Link
                        key={country.name}
                        href={`/study/${country.name.toLowerCase().replace(/\s+/g, '-')}`}
                        className="flex items-center py-2 px-4 text-base text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg"
                        onClick={() => {
                          setIsMobileStudyOpen(false);
                          setIsMenuOpen(false);
                        }}
                      >
                        <span className="mr-2 text-lg">{country.flag}</span>
                        {country.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Mobile Partner Dropdown */}
              <div className="flex flex-col">
                <button
                  onClick={() => setIsMobilePartnerOpen(!isMobilePartnerOpen)}
                  className="flex items-center justify-between text-gray-700 hover:text-blue-600 py-3 px-4 rounded-lg hover:bg-gray-50 text-lg font-medium transition-colors"
                >
                  <span>Partner</span>
                  <svg
                    className={`h-5 w-5 transition-transform ${isMobilePartnerOpen ? 'rotate-180' : ''}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {isMobilePartnerOpen && (
                  <div className="pl-6 mt-1 space-y-1">
                    {partnerOptions.map((option) => (
                      <Link
                        key={option.name}
                        href={`/partner/${option.name.toLowerCase().replace(/\s+/g, '-')}`}
                        className="flex items-center py-2 px-4 text-base text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg"
                        onClick={() => {
                          setIsMobilePartnerOpen(false);
                          setIsMenuOpen(false);
                        }}
                      >
                        <span className="mr-2 text-lg">{option.icon}</span>
                        {option.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Program Link (replaces Resources) */}
              <MobileNavItem href="/program" text="Program" />
              
              <MobileNavItem href="/immigrate" text="Immigrate" />
              <MobileNavItem href="/about" text="About Us" />
              <MobileNavItem href="/feedback" text="FeedBack" />
            </nav>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-col space-y-4">
                <Link 
                  href="/login" 
                  className="w-full text-center py-3 px-4 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link 
                  href="/signup" 
                  className="w-full text-center py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

// Reusable components for navigation items
type NavItemProps = { href: string; text: string };
const NavItem = ({ href, text }: NavItemProps) => (
  <Link 
    href={href} 
    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium transition-colors"
  >
    {text}
  </Link>
);

const MobileNavItem = ({ href, text }: NavItemProps) => (
  <Link 
    href={href} 
    className="text-gray-700 hover:text-blue-600 py-3 px-4 rounded-lg hover:bg-gray-50 text-lg font-medium transition-colors"
  >
    {text}
  </Link>
);

export default Navbar;