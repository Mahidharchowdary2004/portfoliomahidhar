import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { fetchServices, saveServices } from '@/lib/api';

const isLocalhost = typeof window !== 'undefined' && /^(localhost|127\.0\.0\.1|\[::1\])$/.test(window.location.hostname);
const API_BASE = isLocalhost ? 'http://localhost:4000' : 'https://portfoliomahidhar-backend.onrender.com';
const AUTH_TOKEN = 'mahi@123';

interface Service {
  icon: string;
  title: string;
  description: string;
  features: string[];
}

const ServicesAdmin = () => {
  const queryClient = useQueryClient();
  const [services, setServices] = useState<Service[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchServices().then(setServices);
  }, []);

  const updateService = (index: number, field: string, value: any) => {
    setServices(prev => {
      const updated = [...prev];
      if (field === 'features') {
        updated[index].features = value.split(',').map((item: string) => item.trim());
      } else {
        updated[index][field] = value;
      }
      return updated;
    });
  };

  const saveData = async () => {
    setIsSaving(true);
    setError('');
    setSuccess('');
    try {
      await saveServices(services, AUTH_TOKEN);
      setSuccess(`Services saved successfully!`);
      queryClient.invalidateQueries({ queryKey: ['services'] });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const addService = () => {
    setServices(prev => [...prev, { icon: '', title: '', description: '', features: [] }]);
  };

  const removeService = (index: number) => {
    setServices(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="mb-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Admin Panel - Services</h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg">
          {success}
        </div>
      )}
      
      {services.map((service, index) => (
        <div key={index} className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Service {index + 1}</h2>
            <button 
              onClick={() => removeService(index)}
              className="text-red-500 hover:text-red-700 dark:hover:text-red-400 font-medium"
            >
              Remove
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Icon</label>
              <input 
                type="text" 
                value={service.icon} 
                onChange={e => updateService(index, 'icon', e.target.value)} 
                placeholder="Icon name (e.g., Code, FileText, Briefcase)" 
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
              <input 
                type="text" 
                value={service.title} 
                onChange={e => updateService(index, 'title', e.target.value)} 
                placeholder="Service title" 
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" 
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea 
              value={service.description} 
              onChange={e => updateService(index, 'description', e.target.value)} 
              placeholder="Service description" 
              rows={3} 
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Features (comma-separated)</label>
            <input 
              type="text" 
              value={service.features.join(', ')} 
              onChange={e => updateService(index, 'features', e.target.value)} 
              placeholder="Feature 1, Feature 2, Feature 3" 
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" 
            />
          </div>
        </div>
      ))}
      
      <div className="flex flex-wrap items-center gap-4">
        <button 
          onClick={addService} 
          className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
        >
          Add Service
        </button>
        
        <button 
          onClick={saveData} 
          disabled={isSaving}
          className={`px-6 py-3 rounded-lg font-semibold transition ${
            isSaving 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
        >
          {isSaving ? 'Saving...' : 'Save Services'}
        </button>
      </div>
    </div>
  );
};

export default ServicesAdmin;