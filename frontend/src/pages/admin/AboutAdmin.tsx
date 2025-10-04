import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { fetchAbout, saveAbout } from '@/lib/api';
import { Save, AlertCircle, CheckCircle, BookOpen, Briefcase, Plus, Trash2, GraduationCap, Sparkles } from 'lucide-react';

const isLocalhost = typeof window !== 'undefined' && /^(localhost|127\.0\.0\.1|\[::1\])$/.test(window.location.hostname);
const API_BASE = isLocalhost ? 'http://localhost:4000' : 'https://portfoliomahidhar-backend.onrender.com';
const AUTH_TOKEN = 'mahi@123';

interface Role {
  title: string;
  description: string;
  icon: string;
}

interface Education {
  degree: string;
  university: string;
  year: string;
  gpa: string;
  focusAreas: string[];
}

interface AboutData {
  title: string;
  subtitle: string;
  description: string;
  roles: Role[];
  education: Education;
}

const AboutAdmin = () => {
  const queryClient = useQueryClient();
  const [aboutData, setAboutData] = useState<AboutData>({
    title: '',
    subtitle: '',
    description: '',
    roles: [
      {
        title: '',
        description: '',
        icon: 'cpu'
      },
      {
        title: '',
        description: '',
        icon: 'briefcase'
      }
    ],
    education: {
      degree: '',
      university: '',
      year: '',
      gpa: '',
      focusAreas: []
    }
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [educationList, setEducationList] = useState<Array<{ degree: string; school: string; details: string }>>([]);

  const mapBackendToAdmin = (data: any): AboutData => {
    const roles: Role[] = Array.isArray(data?.roles) && data.roles.length > 0 ? data.roles : [
      { title: '', description: '', icon: 'cpu' },
      { title: '', description: '', icon: 'briefcase' }
    ];

    // Normalize education from array
    let degree = '';
    let university = '';
    let year = '';
    let gpa = '';
    const edu0 = Array.isArray(data?.education) ? data.education[0] : undefined;
    if (edu0) {
      degree = edu0.degree || '';
      university = edu0.school || '';
      const details: string = edu0.details || '';
      if (details) {
        const match = details.match(/GPA:\s*([^•]+)(?:\s*•\s*(.*))?/i);
        if (match) {
          gpa = (match[1] || '').trim();
          year = (match[2] || '').trim();
        } else {
          year = details.trim();
        }
      }
    }

    const focusAreas: string[] = Array.isArray(data?.focusAreas) ? data.focusAreas : [];

    const mapped: AboutData = {
      title: data?.title || '',
      subtitle: data?.intro || '',
      description: data?.description || '',
      roles,
      education: {
        degree,
        university,
        year,
        gpa,
        focusAreas,
      },
    };

    // Populate additional education entries for UI (beyond the first)
    const extraEdu = Array.isArray(data?.education) && data.education.length > 1
      ? data.education.slice(1).map((e: any) => ({
          degree: e?.degree || '',
          school: e?.school || '',
          details: e?.details || '',
        }))
      : [];
    setEducationList(extraEdu);

    return mapped;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAbout();
        setAboutData(mapBackendToAdmin(data));
      } catch (error) {
        console.error('Error fetching about data:', error);
        setError('Failed to load about data. Using default values.');
        // Set default data even if fetch fails
        setAboutData({
          title: '',
          subtitle: '',
          description: '',
          roles: [
            { title: '', description: '', icon: 'cpu' },
            { title: '', description: '', icon: 'briefcase' }
          ],
          education: {
            degree: '',
            university: '',
            year: '',
            gpa: '',
            focusAreas: []
          }
        });
      }
    };
    fetchData();
  }, []);

  const updateField = (field, value) => {
    setAboutData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear validation errors when field is updated
    if (validationErrors[field] && value?.trim()) {
      setValidationErrors(prev => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const updateRole = (index, field, value) => {
    setAboutData(prev => ({
      ...prev,
      roles: prev.roles.map((role, i) => 
        i === index ? { ...role, [field]: value } : role
      )
    }));
  };

  const updateEducation = (field, value) => {
    setAboutData(prev => ({
      ...prev,
      education: {
        ...prev.education,
        [field]: value
      }
    }));
  };

  const updateFocusAreas = (value) => {
    const areas = value ? value.split('\n').filter(item => item.trim()) : [];
    updateEducation('focusAreas', areas);
  };

  const validateData = () => {
    const errors: Record<string, string> = {};
    // Require Main Title (subtitle) and description
    if (!aboutData.subtitle?.trim()) errors.subtitle = 'Main Title is required';
    if (!aboutData.description?.trim()) errors.description = 'Description is required';
    
    // Roles are optional; if provided, validate filled ones but don't block if left empty
    if (aboutData.roles && Array.isArray(aboutData.roles)) {
      aboutData.roles.forEach((role, index) => {
        if ((role.title && !role.title.trim()) || (role.description && !role.description.trim())) {
          if (role.title && !role.title.trim()) errors[`role_${index}_title`] = `Role ${index + 1} title cannot be empty`;
          if (role.description && !role.description.trim()) errors[`role_${index}_description`] = `Role ${index + 1} description cannot be empty`;
        }
      });
    }

    // Education fields are optional in admin; user may prefer to keep them blank
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const saveData = async () => {
    setError('');
    setSuccess('');
    
    if (!validateData()) {
      setError('Please fix the validation errors before saving.');
      return;
    }
    
    setIsSaving(true);
    try {
      // Map admin fields to backend schema
      const mainEdu = {
        degree: (aboutData.education?.degree || '').trim(),
        school: (aboutData.education?.university || '').trim(),
        details: (
          aboutData.education?.gpa
            ? `GPA: ${aboutData.education.gpa}${aboutData.education?.year ? ` • ${aboutData.education.year}` : ''}`
            : (aboutData.education?.year || '')
        ).trim(),
      };

      const extraEdu = educationList
        .map((e) => ({ degree: (e.degree || '').trim(), school: (e.school || '').trim(), details: (e.details || '').trim() }))
        .filter((e) => e.degree || e.school || e.details);

      const includeMainEdu = mainEdu.degree || mainEdu.school || mainEdu.details;
      const educationArr = [ ...(includeMainEdu ? [mainEdu] : []), ...extraEdu ];

      const payload: any = {
        intro: aboutData.subtitle || '',
        description: aboutData.description || '',
        roles: aboutData.roles || [],
        // Send empty array if nothing present
        education: educationArr,
      };
      if (aboutData.education?.focusAreas && Array.isArray(aboutData.education.focusAreas)) {
        payload.focusAreas = aboutData.education.focusAreas;
      }

      await saveAbout(payload, AUTH_TOKEN);
      setSuccess('About section saved successfully!');
      queryClient.invalidateQueries({ queryKey: ['about'] });
      
      // Auto-clear success message
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      setError(err.message || 'Failed to save about data. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 relative">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300/5 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-300/5 rounded-full blur-3xl animate-float-medium"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-emerald-300/5 rounded-full blur-3xl animate-float-fast"></div>
      </div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 animate-fade-in">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full flex items-center justify-center animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-blue-900 dark:from-white dark:via-purple-100 dark:to-blue-100 bg-clip-text text-transparent">
                About Section
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                Manage your about section content and personal information
              </p>
            </div>
          </div>
        </div>
        
        <button
          onClick={saveData}
          disabled={isSaving}
          className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-2xl shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-500 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-3"
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              <span className="font-semibold">Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span className="font-semibold">Save About</span>
            </>
          )}
        </button>
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

      {/* Main About Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-stagger">
        {/* Left Column - Main Content */}
        <div className="space-y-6">
          {/* Main Content Card */}
          <div className="relative overflow-hidden group backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 border border-white/20 dark:border-gray-700/50">
            {/* Gradient border effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-500 rounded-3xl opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
            
            <div className="p-8 relative z-10">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Main Content</h3>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <span>Main Title</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={aboutData.subtitle}
                    onChange={(e) => updateField('subtitle', e.target.value)}
                    placeholder="Passionate about transforming data into insights"
                    className={`w-full px-4 py-4 rounded-2xl border-2 transition-all duration-300 ${
                      validationErrors.subtitle 
                        ? "border-red-500 bg-red-50/50 dark:bg-red-900/20 focus:ring-2 focus:ring-red-500" 
                        : "border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:scale-[1.02]`}
                  />
                  {validationErrors.subtitle && (
                    <p className="text-red-500 text-sm flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {validationErrors.subtitle}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <span>Description</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={aboutData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    placeholder="Tell your story and what drives you..."
                    rows={6}
                    className={`w-full px-4 py-4 rounded-2xl border-2 transition-all duration-300 resize-none ${
                      validationErrors.description 
                        ? "border-red-500 bg-red-50/50 dark:bg-red-900/20 focus:ring-2 focus:ring-red-500" 
                        : "border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:scale-[1.02]`}
                  />
                  {validationErrors.description && (
                    <p className="text-red-500 text-sm flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {validationErrors.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Professional Roles Card */}
          <div className="relative overflow-hidden group backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 border border-white/20 dark:border-gray-700/50">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
            
            <div className="p-8 relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Professional Roles</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setAboutData(prev => ({ ...prev, roles: [...(prev.roles || []), { title: '', description: '', icon: 'cpu' }] }))}
                  className="group relative px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span className="font-semibold">Add Role</span>
                </button>
              </div>
              
              <div className="space-y-6">
                {aboutData.roles && aboutData.roles.length > 0 ? aboutData.roles.map((role, index) => (
                  <div key={index} className="relative p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-2xl border border-gray-200/50 dark:border-gray-600/50 group/role hover:scale-[1.02] transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                          <span className="text-white text-sm font-bold">{index + 1}</span>
                        </div>
                        Role {index + 1}
                      </h4>
                      <button
                        type="button"
                        onClick={() => setAboutData(prev => ({ ...prev, roles: prev.roles.filter((_, i) => i !== index) }))}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all duration-200 hover:scale-110"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Role Title</label>
                        <input
                          type="text"
                          value={role.title}
                          onChange={(e) => updateRole(index, 'title', e.target.value)}
                          placeholder="Data Scientist"
                          className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                            validationErrors[`role_${index}_title`] 
                              ? "border-red-500 bg-red-50/50 dark:bg-red-900/20" 
                              : "border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                          } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                        />
                        {validationErrors[`role_${index}_title`] && (
                          <p className="text-red-500 text-sm flex items-center gap-2">
                            <AlertCircle className="w-3 h-3" />
                            {validationErrors[`role_${index}_title`]}
                          </p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                        <textarea
                          value={role.description}
                          onChange={(e) => updateRole(index, 'description', e.target.value)}
                          placeholder="Describe your role and responsibilities..."
                          rows={3}
                          className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 resize-none ${
                            validationErrors[`role_${index}_description`] 
                              ? "border-red-500 bg-red-50/50 dark:bg-red-900/20" 
                              : "border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                          } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                        />
                        {validationErrors[`role_${index}_description`] && (
                          <p className="text-red-500 text-sm flex items-center gap-2">
                            <AlertCircle className="w-3 h-3" />
                            {validationErrors[`role_${index}_description`]}
                          </p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Icon</label>
                        <select
                          value={role.icon}
                          onChange={(e) => updateRole(index, 'icon', e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                        >
                          <option value="cpu">CPU (Data Science)</option>
                          <option value="briefcase">Briefcase (Web Developer)</option>
                          <option value="code2">Code (Software Engineer)</option>
                          <option value="database">Database (Data Engineer)</option>
                          <option value="globe">Globe (Full Stack)</option>
                          <option value="server">Server (Backend)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Briefcase className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">No roles configured yet. Default roles will be used.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Education */}
        <div className="space-y-6">
          {/* Education Card */}
          <div className="relative overflow-hidden group backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 border border-white/20 dark:border-gray-700/50">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-green-500 rounded-3xl opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
            
            <div className="p-8 relative z-10">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Education</h3>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Degree</label>
                    <input
                      type="text"
                      value={aboutData.education.degree}
                      onChange={(e) => updateEducation('degree', e.target.value)}
                      placeholder="Bachelor of Technology"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 focus:scale-[1.02]"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">University</label>
                    <input
                      type="text"
                      value={aboutData.education.university}
                      onChange={(e) => updateEducation('university', e.target.value)}
                      placeholder="University Name"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 focus:scale-[1.02]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Year</label>
                    <input
                      type="text"
                      value={aboutData.education.year}
                      onChange={(e) => updateEducation('year', e.target.value)}
                      placeholder="2020-2024"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 focus:scale-[1.02]"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">GPA</label>
                    <input
                      type="text"
                      value={aboutData.education.gpa}
                      onChange={(e) => updateEducation('gpa', e.target.value)}
                      placeholder="8.5/10"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 focus:scale-[1.02]"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Key Focus Areas</label>
                  <textarea
                    value={Array.isArray(aboutData.education.focusAreas) ? aboutData.education.focusAreas.join('\n') : ''}
                    onChange={(e) => updateFocusAreas(e.target.value)}
                    placeholder="Enter each focus area on a new line:&#10;• Machine Learning & AI&#10;• Big Data Analytics&#10;• Software Engineering&#10;• Data Structures & Algorithms"
                    rows={5}
                    className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 focus:scale-[1.02] resize-none"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <Sparkles className="w-3 h-3" />
                    Enter each focus area on a separate line
                  </p>
                </div>

                {/* Additional Education Entries */}
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <Plus className="w-5 h-5 text-purple-500" />
                      Additional Education
                    </h4>
                    <button
                      type="button"
                      onClick={() => setEducationList([...educationList, { degree: '', school: '', details: '' }])}
                      className="group relative px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 shadow-lg"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="font-semibold">Add Education</span>
                    </button>
                  </div>

                  {educationList.length === 0 && (
                    <div className="text-center py-6 bg-gray-50/50 dark:bg-gray-800/30 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                      <GraduationCap className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 dark:text-gray-400 text-sm">No additional education entries</p>
                    </div>
                  )}

                  <div className="space-y-4">
                    {educationList.map((edu, idx) => (
                      <div key={idx} className="relative p-5 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border-2 border-blue-200/50 dark:border-blue-700/50 group/edu hover:scale-[1.02] transition-all duration-300">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                              <span className="text-white text-xs font-bold">{idx + 2}</span>
                            </div>
                            Education #{idx + 2}
                          </span>
                          <button
                            type="button"
                            onClick={() => setEducationList(educationList.filter((_, i) => i !== idx))}
                            className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-all duration-200 hover:scale-110"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <input
                            type="text"
                            placeholder="Degree"
                            value={edu.degree}
                            onChange={(e) => setEducationList(educationList.map((item, i) => i === idx ? { ...item, degree: e.target.value } : item))}
                            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white/70 dark:bg-gray-800/70 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                          />
                          <input
                            type="text"
                            placeholder="School / University"
                            value={edu.school}
                            onChange={(e) => setEducationList(educationList.map((item, i) => i === idx ? { ...item, school: e.target.value } : item))}
                            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white/70 dark:bg-gray-800/70 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                          />
                          <input
                            type="text"
                            placeholder="Details (GPA, Year)"
                            value={edu.details}
                            onChange={(e) => setEducationList(educationList.map((item, i) => i === idx ? { ...item, details: e.target.value } : item))}
                            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white/70 dark:bg-gray-800/70 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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

export default AboutAdmin;