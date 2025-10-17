import React from 'react';
import { Code2, Database, Cpu, Globe, Server } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchSkills } from '@/lib/api';

const API_URL = 'https://portfoliomahidhar-backend.onrender.com';

// Mapping icon keys from API → Lucide icons
const iconMap = {
  cpu: <Cpu className="w-6 h-6" />,
  code2: <Code2 className="w-6 h-6" />,
  server: <Server className="w-6 h-6" />,
  database: <Database className="w-6 h-6" />,
  globe: <Globe className="w-6 h-6" />,
};

const Skills = () => {
  const { data: skillCategories } = useQuery({
    queryKey: ['skills'],
    queryFn: fetchSkills,
    initialData: [],
  });

  return (
    <section id="skills" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
            Skills & Expertise
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A comprehensive overview of my technical skills and areas of expertise
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, index) => (
            <div
              key={index}
              className="
                relative 
                bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 
                rounded-2xl p-6 
                shadow-lg 
                transition-all duration-500 ease-out 
                hover:scale-[1.03] 
                hover:shadow-[0_10px_40px_rgba(147,51,234,0.3),0_0_70px_rgba(249,115,22,0.2)] 
                hover:-translate-y-2
                border border-gray-200 dark:border-gray-700
              "
            >
              {/* Icon + Title */}
              <div className="flex items-center mb-4">
                <div className="
                  relative
                  p-3 
                  bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900/40 dark:to-purple-800/20 
                  rounded-lg 
                  text-purple-600 dark:text-purple-400 
                  mr-4
                  transition-all duration-500 ease-out
                  group-hover:scale-110
                  group-hover:rotate-3
                ">
                  {iconMap[category.icon] || <Code2 className="w-6 h-6" />}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {category.title}
                </h3>
              </div>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-2">
                {typeof category.skills === 'string'
                  ? category.skills.split(',').map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="
                          px-3 py-1 
                          bg-gray-100 dark:bg-gray-700 
                          text-gray-700 dark:text-gray-300 
                          rounded-full 
                          text-sm 
                          transition-all duration-300 ease-out
                          hover:bg-gradient-to-r hover:from-purple-100 hover:to-orange-100 
                          dark:hover:from-purple-800/40 dark:hover:to-orange-800/40
                          hover:scale-105
                          hover:shadow-md
                          border border-transparent
                          hover:border-purple-200 dark:hover:border-purple-500/30
                        "
                      >
                        {skill.trim()}
                      </span>
                    ))
                  : null}
              </div>

              {/* Subtle hover effect overlay */}
              <div className="
                absolute 
                inset-0 
                rounded-2xl 
                bg-gradient-to-r from-purple-600/0 via-purple-600/5 to-orange-500/0 
                opacity-0 
                transition-opacity duration-500 ease-out
                hover:opacity-100
                pointer-events-none
              "></div>
            </div>
          ))}
        </div>

        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-200 dark:bg-purple-800 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-orange-200 dark:bg-orange-800 rounded-full blur-3xl opacity-20"></div>
        </div>
      </div>
    </section>
  );
};

export default Skills;