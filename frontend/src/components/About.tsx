import React from 'react';
import { Code, Briefcase, Book } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            About <span className="bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">Me</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Passionate about transforming data into insights and building innovative solutions.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Section */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Designing Solutions, Not Just Visuals
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              I'm a Computer Science Engineering student at KL University (2022–2026), specializing in 
              Data Science & Big Data Analytics. My journey in tech is fueled by a passion for AI, 
              embedded systems, and the transformative power of data-driven solutions.
            </p>

            {/* Role Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Software Development Engineer */}
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <Code className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Software Development Engineer</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    I specialize in designing, building, and optimizing scalable web applications with a focus on user experience and performance. I enjoy turning complex problems into elegant, user-friendly solutions by bridging the gap between functionality and design.
                  </p>
                </div>
              </div>

              {/* Web Developer */}
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Web Developer</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Building responsive, accessible, and scalable web applications using modern tools and best practices.
                  </p>
                </div>
              </div>
            </div>

            {/* Technical Skills */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Technical Skills</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Languages</span>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Java, C</div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Frameworks</span>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Django, React, Spring Boot</div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Databases</span>
                  <div className="text-xs text-gray-600 dark:text-gray-400">MySQL, MongoDB</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Education */}
          <div className="relative">
            <div className="bg-gradient-to-br from-purple-100 to-orange-100 dark:from-purple-900 dark:to-orange-900 rounded-2xl p-8 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <Book className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Education</h4>
                  <p className="text-gray-600 dark:text-gray-400">KL University (2022–2026)</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-white">B.Tech – Computer Science & Engineering</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">KL University, Vijayawada</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">CGPA: 9.11 / 10</p>
                  <p className="text-sm text-purple-600 dark:text-purple-400">
                    Specialization: Data Science & Big Data Analytics
                  </p>
                </div>

                <div>
                  <h5 className="font-medium text-gray-900 dark:text-white">Intermediate (12th Grade)</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Narayana Junior College, Vijayawada</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Percentage: 74.1%</p>
                </div>

                <div>
                  <h5 className="font-medium text-gray-900 dark:text-white">SSC (10th Grade)</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Narayana High School, Vijayawada</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Marks: 597 / 600</p>
                </div>

                {/* Focus Areas */}
                <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg">
                  <h6 className="font-medium text-gray-900 dark:text-white mb-2">Key Focus Areas</h6>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Machine Learning & AI</li>
                    <li>• Big Data Analytics</li>
                    <li>• Software Engineering</li>
                    <li>• Data Structures & Algorithms</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
