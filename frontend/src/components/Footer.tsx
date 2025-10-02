import React from 'react';
import { Github, Linkedin, Mail, Settings, ExternalLink } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchContactInfo } from '@/lib/api';

const Footer = () => {
  const { data: contactInfo } = useQuery({ 
    queryKey: ['contactInfo'], 
    queryFn: fetchContactInfo, 
    initialData: { 
      github: '', 
      linkedin: '', 
      email: '',
      resumeUrl: ''
    } 
  });

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
          {/* About Section */}
          <div className="space-y-6">
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent mb-4">
                Mahidhar
              </div>
              <p className="text-gray-400 leading-relaxed">
                Computer Science student passionate about data science, AI, and building innovative solutions that make a difference.
              </p>
            </div>
            
            <div className="flex space-x-4">
              <a 
                href={contactInfo.github} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-purple-600 transition-all duration-300 transform hover:scale-110"
                aria-label="GitHub Profile"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href={contactInfo.linkedin} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-600 transition-all duration-300 transform hover:scale-110"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href={`mailto:${contactInfo.email}`} 
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-600 transition-all duration-300 transform hover:scale-110"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white relative pb-2">
              <span className="relative z-10">Quick Links</span>
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-purple-500 to-orange-500 rounded-full"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="#home" 
                  className="text-gray-400 hover:text-white transition-colors flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-3 group-hover:animate-pulse"></span>
                  Home
                </a>
              </li>
              <li>
                <a 
                  href="#about" 
                  className="text-gray-400 hover:text-white transition-colors flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-3 group-hover:animate-pulse"></span>
                  About
                </a>
              </li>
              <li>
                <a 
                  href="#skills" 
                  className="text-gray-400 hover:text-white transition-colors flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-3 group-hover:animate-pulse"></span>
                  Skills
                </a>
              </li>
              <li>
                <a 
                  href="#experience" 
                  className="text-gray-400 hover:text-white transition-colors flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-3 group-hover:animate-pulse"></span>
                  Experience
                </a>
              </li>
              <li>
                <a 
                  href="#projects" 
                  className="text-gray-400 hover:text-white transition-colors flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-3 group-hover:animate-pulse"></span>
                  Projects
                </a>
              </li>
            </ul>
          </div>

          {/* Admin Panel */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white relative pb-2">
              <span className="relative z-10">Admin</span>
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-purple-500 to-orange-500 rounded-full"></span>
            </h3>
            <div className="space-y-3">
              <a 
                href="/admin" 
                className="flex items-center text-gray-400 hover:text-white transition-colors"
              >
                <Settings className="w-4 h-4 mr-2" />
                <span>Admin Panel</span>
              </a>
              <p className="text-gray-500 text-sm ml-6">
                Manage portfolio content
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              &copy; {currentYear} Mahidhar. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a 
                href="#" 
                className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
              >
                Privacy Policy
              </a>
              <a 
                href="#" 
                className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
              >
                Terms of Service
              </a>
              <a 
                href="#contact" 
                className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;