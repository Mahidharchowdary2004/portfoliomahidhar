import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { fetchSkills } from '@/lib/api';
import { Save, Plus, Trash2, AlertCircle, CheckCircle, Sparkles, Cpu, Code2 } from 'lucide-react';

const isLocalhost = typeof window !== 'undefined' && /^(localhost|127\.0\.0\.1|\[::1\])$/.test(window.location.hostname);
const API_BASE = isLocalhost ? 'http://localhost:4000' : 'https://portfoliomahidhar-backend.onrender.com';
const AUTH_TOKEN = 'mahi@123';

const SkillsAdmin = () => {
  const queryClient = useQueryClient();
  const [skills, setSkills] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchSkills().then(setSkills);
  }, []);

  const updateSkill = (index, field, value) => {
    setSkills(prev => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const saveData = async () => {
    setIsSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${API_BASE}/skills`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
        body: JSON.stringify(skills),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || `Failed to save Skills`);
      }
      setSuccess(`Skills saved successfully!`);
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      
      // Auto-clear success message
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const addSkill = () => {
    setSkills(prev => [...prev, { title: '', icon: '', skills: '' }]);
  };

  const removeSkill = (index) => {
    setSkills(prev => prev.filter((_, i) => i !== index));
  };

  const iconOptions = [
    { value: 'cpu', label: 'CPU', icon: Cpu },
    { value: 'code2', label: 'Code', icon: Code2 },
    { value: 'database', label: 'Database' },
    { value: 'server', label: 'Server' },
    { value: 'globe', label: 'Globe' },
    { value: 'smartphone', label: 'Mobile' },
    { value: 'cloud', label: 'Cloud' },
    { value: 'shield', label: 'Security' },
    { value: 'layers', label: 'Layers' },
    { value: 'terminal', label: 'Terminal' }
  ];

  return (
    <div className="space-y-8 relative">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300/5 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-300/5 rounded-full blur-3xl animate-float-medium"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-300/5 rounded-full blur-3xl animate-float-fast"></div>
      </div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 animate-fade-in">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                <Cpu className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full flex items-center justify-center animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-orange-900 dark:from-white dark:via-purple-100 dark:to-orange-100 bg-clip-text text-transparent">
                Skills Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                Manage your technical skills and competencies
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={addSkill}
            className="group relative px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-500 transform hover:scale-105 flex items-center space-x-2"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <Plus className="w-5 h-5" />
            <span>Add Skill Category</span>
          </button>
          
          <button
            onClick={saveData}
            disabled={isSaving}
            className="group relative px-8 py-3 bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700 text-white font-semibold rounded-2xl shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-500 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
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
                <span>Save Skills</span>
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

      {/* Skills Grid */}
      <div className="space-y-6 animate-stagger">
        {skills.length === 0 ? (
          <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800/50 dark:to-blue-900/20 rounded-3xl border-2 border-dashed border-gray-300 dark:border-gray-600">
            <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Cpu className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Skills Added Yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Start by adding your first skill category</p>
            <button
              onClick={addSkill}
              className="group px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              <span>Add First Skill</span>
            </button>
          </div>
        ) : (
          skills.map((skill, index) => (
            <div 
              key={index} 
              className="relative overflow-hidden group backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 border border-white/20 dark:border-gray-700/50 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Gradient border effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-orange-500 rounded-3xl opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
              
              <div className="p-8 relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-white text-lg font-bold">{index + 1}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Skill Category {index + 1}</h3>
                  </div>
                  
                  {skills.length > 1 && (
                    <button
                      onClick={() => removeSkill(index)}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-all duration-200 hover:scale-110 group/remove"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Title Input */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <span>Category Title</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={skill.title}
                      onChange={e => updateSkill(index, 'title', e.target.value)}
                      placeholder="e.g., Frontend Development"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 focus:scale-[1.02]"
                    />
                  </div>

                  {/* Icon Select */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Icon</label>
                    <select
                      value={skill.icon}
                      onChange={e => updateSkill(index, 'icon', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 focus:scale-[1.02]"
                    >
                      <option value="">Select an icon</option>
                      {iconOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {skill.icon && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                        <Sparkles className="w-3 h-3" />
                        Selected: {skill.icon}
                      </p>
                    )}
                  </div>

                  {/* Skills Input */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <span>Skills List</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={skill.skills}
                      onChange={e => updateSkill(index, 'skills', e.target.value)}
                      placeholder="e.g., React, TypeScript, Next.js"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 focus:scale-[1.02]"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <Sparkles className="w-3 h-3" />
                      Separate skills with commas
                    </p>
                  </div>
                </div>

                {/* Preview */}
                {(skill.title || skill.skills) && (
                  <div className="mt-6 p-4 bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-700/50 dark:to-purple-900/20 rounded-2xl border border-gray-200/50 dark:border-gray-600/50">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Preview</h4>
                    <div className="flex items-center space-x-4">
                      {skill.title && (
                        <div className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-sm font-medium">
                          {skill.title}
                        </div>
                      )}
                      {skill.skills && (
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {skill.skills.split(',').slice(0, 3).map(skill => skill.trim()).filter(Boolean).join(', ')}
                          {skill.skills.split(',').length > 3 && '...'}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Action Buttons */}
      {skills.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200 dark:border-gray-700 animate-slide-up">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-semibold text-purple-600 dark:text-purple-400">{skills.length}</span> skill categories configured
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={addSkill}
              className="group px-6 py-3 border-2 border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Another</span>
            </button>
            
            <button
              onClick={saveData}
              disabled={isSaving}
              className="group relative px-8 py-3 bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-500 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
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
                  <span>Save All Skills</span>
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

export default SkillsAdmin;