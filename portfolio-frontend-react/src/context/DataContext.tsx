import React, { createContext, useState, useEffect } from 'react';
import { fetchJSON, API_BASE } from '../api/client';
import {
  defaultProfile,
  defaultEducation,
  defaultSkills,
  defaultExperience,
  defaultProjects,
  defaultCertifications,
  defaultAchievements
} from '../data/defaults';

interface DataContextType {
  resources: Record<string, any>;
  loading: boolean;
}

export const DataContext = createContext<DataContextType>({
  resources: {},
  loading: true
});

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [resources, setResources] = useState<Record<string, any>>({
    '/profile': defaultProfile,
    '/education': defaultEducation,
    '/skills': defaultSkills,
    '/experience': defaultExperience,
    '/projects': defaultProjects,
    '/certifications': defaultCertifications,
    '/achievements': defaultAchievements
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!API_BASE) {
      setLoading(false);
      return;
    }

    const endpoints = [
      { path: '/profile', defaultVal: defaultProfile },
      { path: '/education', defaultVal: defaultEducation },
      { path: '/skills', defaultVal: defaultSkills },
      { path: '/experience', defaultVal: defaultExperience },
      { path: '/projects', defaultVal: defaultProjects },
      { path: '/certifications', defaultVal: defaultCertifications },
      { path: '/achievements', defaultVal: defaultAchievements }
    ];

    const fetchAll = async () => {
      try {
        const results = await Promise.allSettled(
          endpoints.map(ep => fetchJSON(ep.path))
        );

        const newResources: Record<string, any> = {};
        endpoints.forEach((ep, index) => {
          const res = results[index];
          if (res.status === 'fulfilled') {
            newResources[ep.path] = res.value;
          } else {
            newResources[ep.path] = ep.defaultVal;
          }
        });

        setResources(newResources);
      } catch (err) {
        console.error('Error fetching global context resources:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  return (
    <DataContext.Provider value={{ resources, loading }}>
      {children}
    </DataContext.Provider>
  );
};
