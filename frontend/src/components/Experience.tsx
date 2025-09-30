import React from 'react';
import { Cloud, Brain, Award } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchExperiences } from '@/lib/api';

const isLocalhost = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || 
   window.location.hostname === '127.0.0.1' || 
   window.location.hostname === '[::1]' ||
   window.location.hostname.includes('localhost'));
const API_URL = isLocalhost ? 'http://localhost:4000' : 'https://portfoliomahidhar-backend.onrender.com';

const Experience = () => {
  const { data: experiences = [] } = useQuery({ queryKey: ['experiences'], queryFn: fetchExperiences, initialData: [] });

  return (
    <section id="experience" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            My <span className="bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">Experience</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Building expertise through hands-on projects and professional internships
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-purple-600 to-orange-500 rounded-full"></div>
            <div className="space-y-12">
              {experiences.map((exp, idx) => (
                <div className="flex items-center justify-center" key={idx}>
                  <div className="group bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 max-w-2xl w-full relative">
                    <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-purple-600 to-orange-500 rounded-full flex items-center justify-center">
                      <Brain className="w-4 h-4 text-white" />
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{exp.title}</h3>
                        <p className="text-purple-600 dark:text-purple-400 font-medium">{exp.company}{exp.location ? ` | ${exp.location}` : ''}</p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">{exp.startDate}{exp.endDate ? ` - ${exp.endDate}` : ''}</p>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{exp.description}</p>
                      {exp.keyLearnings?.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-semibold text-gray-900 dark:text-white">Key Learnings:</h4>
                          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
                            {exp.keyLearnings.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Popover for certificate image, only if image exists */}
                      {exp.image && (
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 w-80 max-w-full">
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 w-full">
                            <div className="flex items-center space-x-2 mb-2">
                              <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                              <h5 className="font-semibold text-gray-900 dark:text-white">Certificate</h5>
                            </div>
                            <div className="space-y-2">
                              <img
                                src={exp.image.startsWith('/uploads') ? `${API_URL}${exp.image}` : exp.image}
                                alt={exp.title + ' Certificate'}
                                className="w-full max-w-xs h-auto rounded-lg border border-gray-200 dark:border-gray-700 mx-auto"
                                onError={e => (e.currentTarget.src = '/placeholder.svg')}
                              />
                              <a
                                href={exp.image.startsWith('/uploads') ? `${API_URL}${exp.image}` : exp.image}
                                download
                                className="inline-block mt-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-orange-500 text-white rounded-lg shadow hover:from-orange-500 hover:to-purple-600 transition-colors text-sm font-semibold"
                              >

Download Image
                              </a>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {exp.title}<br />
                                {exp.company && <>Issued by: {exp.company}<br /></>}
                                {exp.endDate && <>Date: {exp.endDate}</>}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {experiences.length === 0 && (
                <div className="text-center text-gray-500 dark:text-gray-400">No experiences added yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
