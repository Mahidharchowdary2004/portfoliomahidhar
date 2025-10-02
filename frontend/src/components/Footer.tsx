import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchContactInfo } from '@/lib/api';

const Footer = () => {
  const { data: contactInfo } = useQuery({ queryKey: ['contactInfo'], queryFn: fetchContactInfo, initialData: { github: '', linkedin: '', email: '' } });

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent">
              Mahidhar  
            </div>
            <p className="text-gray-400 leading-relaxed">
              Computer Science student passionate about data science, AI, and building innovative solutions.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-white">Quick Links</h4>
            <div className="space-y-2">
              <a href="#home" className="block text-gray-400 hover:text-white transition-colors">Home</a>
              <a href="#about" className="block text-gray-400 hover:text-white transition-colors">About</a>
              <a href="#experience" className="block text-gray-400 hover:text-white transition-colors">Experience</a>
              <a href="#portfolio" className="block text-gray-400 hover:text-white transition-colors">Portfolio</a>
              <a href="#contact" className="block text-gray-400 hover:text-white transition-colors">Contact</a>
              <a href="/admin" className="block text-gray-400 hover:text-white transition-colors">Manage</a>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-white">Connect</h4>
            <div className="flex space-x-4">
              <a href={contactInfo.github} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href={`mailto:${contactInfo.email}`} className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Mahidhar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
