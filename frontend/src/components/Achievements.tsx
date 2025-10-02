import React, { useState, useEffect } from 'react';
import { Award, Trophy, Medal, Star, Crown, Target } from 'lucide-react';
import { fetchAchievements } from '@/lib/api';

const isLocalhost = typeof window !== 'undefined' && /^(localhost|127\.0\.0\.1|\[::1\])$/.test(window.location.hostname);
const API_URL = isLocalhost ? 'http://localhost:4000' : 'https://portfoliomahidhar-backend.onrender.com';

// Icon mapping for competitions
const iconMap = {
  trophy: Trophy,
  award: Award,
  medal: Medal,
  star: Star,
  crown: Crown,
  target: Target
};

interface Achievement {
  title: string;
  date?: string;
  description?: string;
  icon?: string;
  image?: string;
}

const Achievements: React.FC = () => {
  const [items, setItems] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAchievements().then(setItems).finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  const isEmpty = !items || items.length === 0;

  return (
    <section id="achievements" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            My <span className="bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">Competitions</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Highlights from contests, challenges, and competitive events
          </p>
        </div>

        {isEmpty ? (
          <p className="text-center text-gray-600 dark:text-gray-400">No competitions added yet.</p>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-purple-600 to-orange-500 rounded-full"></div>
              <div className="space-y-12">
                {items.map((a, idx) => (
                  <div key={idx} className="flex items-center justify-center">
                    <div className="group bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 max-w-2xl w-full relative">
                      <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-purple-600 to-orange-500 rounded-full flex items-center justify-center">
                        {(() => {
                          const IconComponent = iconMap[a.icon as keyof typeof iconMap] || Trophy;
                          return <IconComponent className="w-4 h-4 text-white" />;
                        })()}
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{a.title}</h3>
                              {a.date && <p className="text-gray-500 dark:text-gray-400 text-sm">{a.date}</p>}
                            </div>
                          </div>
                        </div>
                        {a.description && (
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{a.description}</p>
                        )}

                        {/* Hover Preview Panel (matches Certifications) */}
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center space-x-2 mb-2">
                              {(() => {
                                const IconComponent = iconMap[a.icon as keyof typeof iconMap] || Trophy;
                                return <IconComponent className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
                              })()}
                              <h5 className="font-semibold text-gray-900 dark:text-white">Competition</h5>
                            </div>
                            <div className="space-y-2">
                              {a.image && (
                                <img
                                  src={a.image.startsWith('/uploads') ? `${API_URL}${a.image}` : a.image}
                                  alt={a.title}
                                  className="w-72 h-auto rounded-lg border border-gray-200 dark:border-gray-700"
                                  onError={e => (e.currentTarget.src = '/placeholder.svg')}
                                />
                              )}
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {a.title}<br />
                                {a.date ? <>Date: {a.date}</> : null}
                              </p>
                              {a.image && (
                                <a
                                  href={a.image.startsWith('/uploads') ? `${API_URL}${a.image}` : a.image}
                                  download
                                  className="inline-block mt-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-orange-500 text-white rounded-lg shadow hover:from-orange-500 hover:to-purple-600 transition-colors text-sm font-semibold"
                                >
                                  Download Image
                                </a>
                              )}
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
        )}
      </div>
    </section>
  );
};

export default Achievements;