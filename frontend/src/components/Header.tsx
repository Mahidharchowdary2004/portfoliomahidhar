import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Github, Linkedin, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-50 border-b border-gray-200 dark:border-gray-700">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
            Nallapaneni Mahidhar
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
              Home
            </a>
            <a href="#about" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
              About
            </a>
            <a href="#skills" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
              Skills
            </a>
            <a href="#experience" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
              Experience
            </a>
            <a href="#certifications" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
              Certifications
            </a>
            <a href="#achievements" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
              Competitions
            </a>
            <a href="#services" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
              Services
            </a>
            <a href="#projects" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
              Projects
            </a>
            <a href="#contact" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
              Contact
            </a>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            
            {/* Admin Sign In Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin/login')}
              className="border-accent/30 text-accent hover:bg-accent hover:text-accent-foreground"
            >
              <Settings className="h-4 w-4 mr-2" />
              Admin
            </Button>
            
            <a 
              href="#contact" 
              className="bg-gradient-to-r from-purple-600 to-orange-500 text-white px-6 py-2 rounded-full hover:shadow-lg transition-shadow"
            >
              Get In Touch
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
