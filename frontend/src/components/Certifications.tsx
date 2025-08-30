import React from 'react';
import { Award } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchCertifications } from '@/lib/api';

const API_URL = 'https://portfoliomahidhar-backend.onrender.com';

const Certifications = () => {
  const { data: certifications } = useQuery({ queryKey: ['certifications'], queryFn: fetchCertifications, initialData: [] });

  return (
    <section id="certifications" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            My <span className="bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">Certifications</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Recognitions and credentials earned through learning and hands-on experience
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-purple-600 to-orange-500 rounded-full"></div>
            <div className="space-y-12">
              {certifications.map((cert, idx) => (
                <div key={idx} className="flex items-center justify-center">
                  <div className="group bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 max-w-2xl w-full relative">
                    <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-purple-600 to-orange-500 rounded-full flex items-center justify-center">
                      <Award className="w-4 h-4 text-white" />
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{cert.title}</h3>
                        <p className="text-purple-600 dark:text-purple-400 font-medium">{cert.issuer}</p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">{cert.date}</p>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{cert.description}</p>
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900 dark:text-white">Key Topics:</h4>
                        <div className="grid md:grid-cols-2 gap-3">
                          {typeof cert.details === 'string' ? cert.details.split(',').map((detail, i) => (
                            <div key={i} className="flex items-start space-x-2">
                              <div className={`w-2 h-2 ${i%2===0 ? 'bg-purple-600' : 'bg-orange-500'} rounded-full mt-2`}></div>
                              <span className="text-sm text-gray-600 dark:text-gray-400">{detail.trim()}</span>
                            </div>
                          )) : null}
                        </div>
                      </div>
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
                          <div className="flex items-center space-x-2 mb-2">
                            <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            <h5 className="font-semibold text-gray-900 dark:text-white">Certificate</h5>
                          </div>
                          <div className="space-y-2">
                            <img
                              src={cert.image ? `${API_URL}${cert.image}` : '/placeholder.svg'}
                              alt={cert.title + ' Certificate'}
                              className="w-72 h-auto rounded-lg border border-gray-200 dark:border-gray-700"
                              onError={e => (e.currentTarget.src = '/placeholder.svg')}
                            />
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {cert.title}<br />
                              Issued by: {cert.issuer}<br />
                              Date: {cert.date}
                            </p>
                            <a
                              href={cert.image ? `${API_URL}${cert.image}` : '#'}
                              download
                              className="inline-block mt-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-orange-500 text-white rounded-lg shadow hover:from-orange-500 hover:to-purple-600 transition-colors text-sm font-semibold"
                            >
                              Download Image
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Certifications; 