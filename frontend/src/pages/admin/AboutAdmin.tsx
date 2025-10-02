import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { fetchAbout, saveAbout } from '@/lib/api';

const API_BASE = 'https://portfoliomahidhar-backend.onrender.com';
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
    } catch (err) {
      setError(err.message || 'Failed to save about data. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };



  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">
            About Section Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your about section content and personal information
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={saveData}
            disabled={isSaving}
            className="group relative px-6 py-3 admin-button-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
          >
            {isSaving ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                  />
                </svg>
                <span>Save About</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center space-x-3">
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 flex items-center space-x-3">
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-green-700 dark:text-green-300">{success}</p>
        </div>
      )}

      {/* Main About Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Main Content */}
        <div className="space-y-6">
          <div className="glass-morphism rounded-2xl shadow-xl admin-card-hover p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Main Content</span>
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Main Title</label>
                <input
                  type="text"
                  value={aboutData.subtitle}
                  onChange={(e) => updateField('subtitle', e.target.value)}
                  placeholder="Passionate about transforming data into insights"
                  className={`w-full px-4 py-3 rounded-xl border ${
                    validationErrors.subtitle ? "border-red-500 bg-red-50 dark:bg-red-900/20" : "border-gray-200 dark:border-gray-700"
                  } bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200`}
                />
                {validationErrors.subtitle && <p className="text-red-500 text-sm">{validationErrors.subtitle}</p>}
              </div>



              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <textarea
                  value={aboutData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="Tell your story and what drives you..."
                  rows={4}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    validationErrors.description ? "border-red-500 bg-red-50 dark:bg-red-900/20" : "border-gray-200 dark:border-gray-700"
                  } bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none`}
                />
                {validationErrors.description && <p className="text-red-500 text-sm">{validationErrors.description}</p>}
              </div>
            </div>
          </div>

          {/* Professional Roles */}
          <div className="glass-morphism rounded-2xl shadow-xl admin-card-hover p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                </svg>
                <span>Professional Roles</span>
              </h3>
              <button
                type="button"
                onClick={() => setAboutData(prev => ({ ...prev, roles: [...(prev.roles || []), { title: '', description: '', icon: 'cpu' }] }))}
                className="px-3 py-2 text-sm rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
              >
                Add Role
              </button>
            </div>
            
            <div className="space-y-4">
              {aboutData.roles && aboutData.roles.length > 0 ? aboutData.roles.map((role, index) => (
                <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900 dark:text-white">Role {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => setAboutData(prev => ({ ...prev, roles: prev.roles.filter((_, i) => i !== index) }))}
                      className="text-xs px-2 py-1 rounded-md bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Role Title</label>
                      <input
                        type="text"
                        value={role.title}
                        onChange={(e) => updateRole(index, 'title', e.target.value)}
                        placeholder="Data Scientist"
                        className={`w-full px-3 py-2 rounded-lg border ${
                          validationErrors[`role_${index}_title`] ? "border-red-500 bg-red-50 dark:bg-red-900/20" : "border-gray-200 dark:border-gray-600"
                        } bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200`}
                      />
                      {validationErrors[`role_${index}_title`] && <p className="text-red-500 text-sm">{validationErrors[`role_${index}_title`]}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                      <textarea
                        value={role.description}
                        onChange={(e) => updateRole(index, 'description', e.target.value)}
                        placeholder="Describe your role and responsibilities..."
                        rows={3}
                        className={`w-full px-3 py-2 rounded-lg border ${
                          validationErrors[`role_${index}_description`] ? "border-red-500 bg-red-50 dark:bg-red-900/20" : "border-gray-200 dark:border-gray-600"
                        } bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none`}
                      />
                      {validationErrors[`role_${index}_description`] && <p className="text-red-500 text-sm">{validationErrors[`role_${index}_description`]}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Icon</label>
                      <select
                        value={role.icon}
                        onChange={(e) => updateRole(index, 'icon', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
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
                  <p className="text-gray-600 dark:text-gray-400">No roles configured yet. Default roles will be used.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Education */}
        <div className="space-y-6">
          <div className="glass-morphism rounded-2xl shadow-xl admin-card-hover p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
              <span>Education</span>
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Degree</label>
                <input
                  type="text"
                  value={aboutData.education.degree}
                  onChange={(e) => updateEducation('degree', e.target.value)}
                  placeholder="Bachelor of Technology"
                  className={`w-full px-4 py-3 rounded-xl border ${
                    validationErrors.degree ? "border-red-500 bg-red-50 dark:bg-red-900/20" : "border-gray-200 dark:border-gray-700"
                  } bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200`}
                />
                {validationErrors.degree && <p className="text-red-500 text-sm">{validationErrors.degree}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">University</label>
                <input
                  type="text"
                  value={aboutData.education.university}
                  onChange={(e) => updateEducation('university', e.target.value)}
                  placeholder="University Name"
                  className={`w-full px-4 py-3 rounded-xl border ${
                    validationErrors.university ? "border-red-500 bg-red-50 dark:bg-red-900/20" : "border-gray-200 dark:border-gray-700"
                  } bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200`}
                />
                {validationErrors.university && <p className="text-red-500 text-sm">{validationErrors.university}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Year</label>
                  <input
                    type="text"
                    value={aboutData.education.year}
                    onChange={(e) => updateEducation('year', e.target.value)}
                    placeholder="2020-2024"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">GPA</label>
                  <input
                    type="text"
                    value={aboutData.education.gpa}
                    onChange={(e) => updateEducation('gpa', e.target.value)}
                    placeholder="8.5/10"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Key Focus Areas (Specialization + more)</label>
                <textarea
                  value={Array.isArray(aboutData.education.focusAreas) ? aboutData.education.focusAreas.join('\n') : ''}
                  onChange={(e) => updateFocusAreas(e.target.value)}
                  placeholder="Enter each focus area on a new line:&#10;• Machine Learning & AI&#10;• Big Data Analytics&#10;• Software Engineering&#10;• Data Structures & Algorithms"
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">Enter each focus area on a separate line</p>
              </div>

              {/* Additional Education Entries */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">Additional Education</h4>
                  <button
                    type="button"
                    onClick={() => setEducationList([...educationList, { degree: '', school: '', details: '' }])}
                    className="px-3 py-2 text-sm rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
                  >
                    Add Education
                  </button>
                </div>

                {educationList.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">No additional education entries.</p>
                )}

                <div className="space-y-4">
                  {educationList.map((edu, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Education #{idx + 2}</span>
                        <button
                          type="button"
                          onClick={() => setEducationList(educationList.filter((_, i) => i !== idx))}
                          className="text-xs px-2 py-1 rounded-md bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input
                          type="text"
                          placeholder="Degree"
                          value={edu.degree}
                          onChange={(e) => setEducationList(educationList.map((item, i) => i === idx ? { ...item, degree: e.target.value } : item))}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white"
                        />
                        <input
                          type="text"
                          placeholder="School / University"
                          value={edu.school}
                          onChange={(e) => setEducationList(educationList.map((item, i) => i === idx ? { ...item, school: e.target.value } : item))}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white"
                        />
                        <input
                          type="text"
                          placeholder="Details (e.g., Percentage/GPA, Year)"
                          value={edu.details}
                          onChange={(e) => setEducationList(educationList.map((item, i) => i === idx ? { ...item, details: e.target.value } : item))}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white"
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
  );
};

export default AboutAdmin;
