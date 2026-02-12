'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Detect active section
      const sections = ['home', 'projects', 'tech', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth',
      });
    }
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'projects', label: 'Projects' },
    { id: 'tech', label: 'Tech Stack' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-background bg-opacity-90 backdrop-blur-lg border-b border-primary border-opacity-20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-4">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <motion.button
            onClick={() => scrollToSection('home')}
            whileHover={{ scale: 1.05 }}
            className="text-2xl font-bold"
          >
             <span className="text-foreground">Dev.</span>
            <span className="text-primary">Umair</span>
           
          </motion.button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                whileHover={{ y: -2 }}
                className={`text-sm font-medium transition-colors duration-300 ${
                  activeSection === item.id
                    ? 'text-primary'
                    : 'text-foreground opacity-80 hover:text-primary hover:opacity-100'
                }`}
              >
                {item.label}
              </motion.button>
            ))}
            
            {/* CTA Button */}
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-cta text-background font-semibold rounded-lg hover:bg-opacity-90 transition-all duration-300"
            >
              Hire Me
            </motion.a>
          </div>

          {/* Mobile Menu Button */}
          <MobileMenu navItems={navItems} scrollToSection={scrollToSection} activeSection={activeSection} />
        </div>
      </div>
    </motion.nav>
  );
}

// Mobile Menu Component
function MobileMenu({ 
  navItems, 
  scrollToSection, 
  activeSection 
}: { 
  navItems: { id: string; label: string }[]; 
  scrollToSection: (id: string) => void;
  activeSection: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (id: string) => {
    scrollToSection(id);
    setIsOpen(false);
  };

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 flex flex-col items-center justify-center gap-1.5"
      >
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 8 : 0 }}
          className="w-6 h-0.5 bg-primary transition-all"
        />
        <motion.span
          animate={{ opacity: isOpen ? 0 : 1 }}
          className="w-6 h-0.5 bg-primary transition-all"
        />
        <motion.span
          animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -8 : 0 }}
          className="w-6 h-0.5 bg-primary transition-all"
        />
      </motion.button>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-full left-0 right-0 bg-background bg-opacity-95 backdrop-blur-lg border-b border-primary border-opacity-20 py-6 px-6"
        >
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-left text-lg font-medium transition-colors ${
                  activeSection === item.id
                    ? 'text-primary'
                    : 'text-foreground opacity-80'
                }`}
              >
                {item.label}
              </button>
            ))}
            <a
              href="#contact"
              onClick={() => setIsOpen(false)}
              className="px-6 py-3 bg-cta text-background font-semibold rounded-lg text-center hover:bg-opacity-90 transition-all"
            >
              Hire Me
            </a>
          </div>
        </motion.div>
      )}
    </div>
  );
}