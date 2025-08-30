import React from 'react';
import { Github, Linkedin, Mail, Download, ArrowRight, Sparkles } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchContactInfo } from '@/lib/api';

const API_BASE = 'https://portfoliomahidhar-backend.onrender.com';

const Hero = () => {
  const { data: contactInfo } = useQuery({ queryKey: ['contactInfo'], queryFn: fetchContactInfo, initialData: { resumeUrl: '', github: '', linkedin: '', email: '', profilePictureUrl: '' } });

  return (
    <section id="home" className="min-h-screen flex items-center bg-gradient-to-br from-purple-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-20 relative overflow-hidden">
      {/* Star trail effect */}
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-200 dark:border-purple-800">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Available for opportunities</span>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-7xl font-black text-gray-900 dark:text-white leading-tight">
                  Hello, I'm{' '}
                  <span className="relative">
                    <span className="bg-gradient-to-r from-purple-600 via-purple-500 to-orange-500 bg-clip-text text-transparent">
                      Mahidhar
                    </span>
                    <div className="absolute -bottom-2 left-0 w-full h-3 bg-gradient-to-r from-purple-200 to-orange-200 -skew-x-12 opacity-30"></div>
                  </span>
                </h1>
                <h2 className="text-2xl lg:text-4xl text-gray-600 dark:text-gray-300 font-semibold">
                  Data Science & AI{' '}
                  <span className="relative inline-block">
                    Enthusiast
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-orange-500 rounded-full"></div>
                  </span>
                </h2>
                <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">
                  A dedicated Computer Science student specializing in{' '}
                  <span className="font-semibold text-purple-600 dark:text-purple-400">Data Science</span> and{' '}
                  <span className="font-semibold text-orange-500">Big Data Analytics</span> at KL University. 
                  Passionate about leveraging technology to solve real-world problems.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
            <button
                className="group bg-gradient-to-r from-purple-600 to-orange-500 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
                onClick={() => {
                  const el = document.getElementById('projects');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >                <span>View My Work</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <a 
                href={contactInfo.resumeUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group border-2 border-purple-600 text-purple-600 dark:text-purple-400 px-8 py-4 rounded-2xl font-semibold hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 dark:hover:text-white transition-all duration-300 flex items-center space-x-2"
              >
                <Download className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                <span>Download Resume</span>
              </a>
            </div>

            <div className="flex space-x-4">
              <a href={contactInfo.github} className="group p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
                <Github className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-purple-600" />
              </a>
              <a href={contactInfo.linkedin} className="group p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
                <Linkedin className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-blue-600" />
              </a>
              <a href={`mailto:${contactInfo.email}`} className="group p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
                <Mail className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-orange-500" />
              </a>
            </div>
          </div>

          <div className="relative animate-fade-in delay-300">
            <div className="relative z-10 mx-auto w-80 h-80 lg:w-96 lg:h-96">
              {/* Outer glow ring */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-purple-600 to-orange-500 rounded-full animate-spin-slow opacity-20 blur-lg"></div>
              
              {/* Main profile container */}
              <div className="absolute inset-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full overflow-hidden shadow-2xl border-4 border-white/50 dark:border-gray-700/50">
                <img 
                  src={contactInfo.profilePictureUrl ? `${API_BASE}${contactInfo.profilePictureUrl}` : "https://i.postimg.cc/c1X9NyD6/IMG-0172.jpg"} 
                  alt="Mahidhar's Profile Picture"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute top-16 -left-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-white/50 dark:border-gray-700/50 animate-bounce delay-1000">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Available for work</span>
              </div>
            </div>
            
            <div className="absolute bottom-16 -right-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-white/50 dark:border-gray-700/50 animate-bounce delay-2000">
              <div className="flex items-center space-x-2">
                <span className="text-xl">🎓</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">CSE Student at KL University</span>
              </div>
            </div>

            {/* Additional floating tech icons */}
            <div className="absolute top-32 -right-8 bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-xl shadow-lg animate-pulse delay-500">
              <span className="text-white text-sm font-bold">AI</span>
            </div>
            
            <div className="absolute bottom-32 -left-8 bg-gradient-to-r from-orange-500 to-orange-600 p-3 rounded-xl shadow-lg animate-pulse delay-700">
              <span className="text-white text-sm font-bold">ML</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
