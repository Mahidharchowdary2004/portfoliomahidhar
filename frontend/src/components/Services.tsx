
import React from 'react';
import { Code, FileText, Briefcase } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: Code,
      title: "Web Design",
      description: "Creating modern, responsive, and user-friendly web interfaces with a focus on user experience and visual appeal.",
      features: ["Responsive Design", "Modern Frameworks", "Cross-browser Compatible"]
    },
    {
      icon: FileText,
      title: "Data Analysis",
      description: "Transforming raw data into actionable insights using advanced analytics techniques and visualization tools.",
      features: ["Statistical Analysis", "Data Visualization", "Machine Learning", "Predictive Modeling"]
    },
    {
      icon: Briefcase,
      title: "Software Development",
      description: "Building robust, scalable software solutions using modern technologies and best development practices.",
      features: ["Full-stack Development", "Database Design", "API Development", "Quality Assurance"]
    }
  ];

  return (
    <section id="services" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            My <span className="bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">Services</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Expertise services! Let's check it out
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div
                key={index}
                className="group bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl hover:bg-gradient-to-br hover:from-purple-50 hover:to-orange-50 dark:hover:from-purple-900/20 dark:hover:to-orange-900/20 transition-all duration-300 hover:shadow-xl"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-orange-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {service.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  {service.description}
                </p>
                
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gradient-to-r from-purple-600 to-orange-500 rounded-full"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
