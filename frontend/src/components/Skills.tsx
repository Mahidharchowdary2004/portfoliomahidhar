import React from 'react';
import { Code2, Database, Cpu, Globe, Server } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchSkills } from '@/lib/api';

const API_URL = 'https://portfoliomahidhar-backend.onrender.com';

const iconMap = {
  cpu: <Cpu className="w-6 h-6" />,
  code2: <Code2 className="w-6 h-6" />,
  server: <Server className="w-6 h-6" />,
  database: <Database className="w-6 h-6" />,
  globe: <Globe className="w-6 h-6" />,
};

const Skills = () => {
  const { data: skillCategories } = useQuery({ queryKey: ['skills'], queryFn: fetchSkills, initialData: [] });

  return (
    <section id="skills" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
            Skills & Expertise
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A comprehensive overview of my technical skills and areas of expertise
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400 mr-4">
                  {iconMap[category.icon] || <Code2 className="w-6 h-6" />}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {category.title}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {typeof category.skills === 'string' ? category.skills.split(',').map((skill, skillIndex) => (
                  <span
                    key={skillIndex}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                  >
                    {skill.trim()}
                  </span>
                )) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills; 