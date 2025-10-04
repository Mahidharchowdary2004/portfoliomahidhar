import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { fetchServices, saveServices } from '@/lib/api';
import { Save, Plus, Trash2, AlertCircle, CheckCircle, Sparkles, Code, FileText, Briefcase, Palette, Server, Smartphone, Eye } from 'lucide-react';

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
        updated[index].features = value.split(',').map((item: string) => item.trim()).filter(Boolean);
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
      
      // Auto-clear success message
      setTimeout(() => setSuccess(''), 5000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const addService = () => {
    setServices(prev => [...prev, { icon: '', title: '', description: '', features: [] }]);
    
    setSuccess("New service added! Fill in the details to showcase your service.");
    setTimeout(() => setSuccess(""), 3000);
    
    // Scroll to new service
    setTimeout(() => {
      const serviceCards = document.querySelectorAll('[data-service-card]');
      const lastCard = serviceCards[serviceCards.length - 1];
      if (lastCard) {
        lastCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const removeService = (index: number) => {
    setServices(prev => prev.filter((_, i) => i !== index));
  };

  const iconOptions = [
    { value: 'Code', label: 'Code', icon: Code },
    { value: 'FileText', label: 'Document', icon: FileText },
    { value: 'Briefcase', label: 'Briefcase', icon: Briefcase },
    { value: 'Palette', label: 'Design', icon: Palette },
    { value: 'Server', label: 'Server', icon: Server },
    { value: 'Smartphone', label: 'Mobile', icon: Smartphone },
  ];

  const getIconComponent = (iconName: string) => {
    const option = iconOptions.find(opt => opt.value === iconName);
    return option ? option.icon : Code;
  };

  return (
    <div className="space-y-8 relative">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-300/5 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-300/5 rounded-full blur-3xl animate-float-medium"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-300/5 rounded-full blur-3xl animate-float-fast"></div>
      </div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 animate-fade-in">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/25">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full flex items-center justify-center animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-cyan-900 to-emerald-900 dark:from-white dark:via-cyan-100 dark:to-emerald-100 bg-clip-text text-transparent">
                Services Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-500" />
                Manage your professional services and offerings
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={addService}
            className="group relative px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-semibold rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-500 transform hover:scale-105 flex items-center space-x-2"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <Plus className="w-5 h-5" />
            <span>Add Service</span>
          </button>
          
          <button
            onClick={saveData}
            disabled={isSaving}
            className="group relative px-8 py-3 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-700 hover:to-emerald-700 text-white font-semibold rounded-2xl shadow-2xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-500 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Save Services</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="animate-shake bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 flex items-center space-x-4 backdrop-blur-xl">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <p className="text-red-700 dark:text-red-300 font-medium">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="animate-slide-down bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-6 flex items-center space-x-4 backdrop-blur-xl">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-green-700 dark:text-green-300 font-medium">{success}</p>
          </div>
        </div>
      )}

      {/* Services List */}
      <div className="space-y-6 animate-stagger">
        {services.length === 0 ? (
          <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-cyan-50 dark:from-gray-800/50 dark:to-cyan-900/20 rounded-3xl border-2 border-dashed border-gray-300 dark:border-gray-600">
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Briefcase className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No Services Yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Start showcasing your professional services by adding your first service offering.
            </p>
            <button
              onClick={addService}
              className="group relative px-8 py-4 bg-gradient-to-r from-cyan-600 to-emerald-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-3 mx-auto"
            >
              <Plus className="w-5 h-5" />
              <span>Add Your First Service</span>
            </button>
          </div>
        ) : (
          services.map((service, index) => (
            <div
              key={index}
              data-service-card
              className="relative overflow-hidden group backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 border border-white/20 dark:border-gray-700/50 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Gradient border effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-3xl opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
              
              <div className="p-8 relative z-10">
                {/* Card Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-white text-lg font-bold">{index + 1}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Service #{index + 1}</h3>
                  </div>
                  
                  <button
                    onClick={() => removeService(index)}
                    className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200 hover:scale-110"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Service Form */}
                <div className="space-y-6">
                  {/* Icon and Title */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <Palette className="w-4 h-4" />
                        <span>Service Icon</span>
                      </label>
                      <select
                        value={service.icon}
                        onChange={e => updateService(index, 'icon', e.target.value)}
                        className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 focus:scale-[1.02]"
                      >
                        <option value="">Select an icon</option>
                        {iconOptions.map((option) => {
                          const IconComponent = option.icon;
                          return (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          );
                        })}
                      </select>
                      {service.icon && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                          <Sparkles className="w-3 h-3" />
                          Selected: {service.icon}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span>Service Title</span>
                        <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        value={service.title} 
                        onChange={e => updateService(index, 'title', e.target.value)} 
                        placeholder="e.g., Web Development, UI/UX Design" 
                        className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 focus:scale-[1.02]" 
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      <span>Service Description</span>
                    </label>
                    <textarea 
                      value={service.description} 
                      onChange={e => updateService(index, 'description', e.target.value)} 
                      placeholder="Describe what this service entails, what problems it solves, and what value it provides to clients..." 
                      rows={4} 
                      className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 focus:scale-[1.02] resize-none" 
                    />
                  </div>

                  {/* Features */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Code className="w-4 h-4" />
                      <span>Key Features</span>
                    </label>
                    <input 
                      type="text" 
                      value={service.features.join(', ')} 
                      onChange={e => updateService(index, 'features', e.target.value)} 
                      placeholder="Responsive Design, SEO Optimization, Performance Optimization, etc." 
                      className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 focus:scale-[1.02]" 
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <Sparkles className="w-3 h-3" />
                      Separate features with commas
                    </p>
                  </div>

                  {/* Preview Section */}
                  {(service.title || service.description || service.features.length > 0) && (
                    <div className="p-6 bg-gradient-to-br from-gray-50 to-cyan-50 dark:from-gray-700/50 dark:to-cyan-900/20 rounded-2xl border border-gray-200/50 dark:border-gray-600/50">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        Service Preview
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                          {service.icon && (
                            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                              {React.createElement(getIconComponent(service.icon), { className: "w-6 h-6 text-white" })}
                            </div>
                          )}
                          {service.title && (
                            <h5 className="text-lg font-bold text-gray-900 dark:text-white">{service.title}</h5>
                          )}
                        </div>
                        {service.description && (
                          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                            {service.description}
                          </p>
                        )}
                        {service.features.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {service.features.slice(0, 3).map((feature, featureIndex) => (
                              <span 
                                key={featureIndex} 
                                className="px-3 py-1 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 rounded-lg text-xs font-medium"
                              >
                                {feature}
                              </span>
                            ))}
                            {service.features.length > 3 && (
                              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg text-xs">
                                +{service.features.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Action Buttons */}
      {services.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200 dark:border-gray-700 animate-slide-up">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-semibold text-cyan-600 dark:text-cyan-400">{services.length}</span> service{services.length !== 1 ? 's' : ''} configured
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={addService}
              className="group px-6 py-3 border-2 border-cyan-200 dark:border-cyan-800 text-cyan-600 dark:text-cyan-400 rounded-xl hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Another</span>
            </button>
            
            <button
              onClick={saveData}
              disabled={isSaving}
              className="group relative px-8 py-3 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-700 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-500 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Save All Services</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-15px) scale(1.03); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-10px) scale(1.02); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        @keyframes stagger {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        .animate-float-medium {
          animation: float-medium 5s ease-in-out infinite;
        }
        .animate-float-fast {
          animation: float-fast 4s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-slide-down {
          animation: slide-down 0.5s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.5s ease-out;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        .animate-stagger {
          animation: stagger 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ServicesAdmin;