"use client"

import { useState, useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { fetchExperiences, saveExperiences } from "@/lib/api"
import { Save, Plus, Trash2, AlertCircle, CheckCircle, Sparkles, Briefcase, Building, MapPin, Calendar, Upload, Eye } from 'lucide-react'

const isLocalhost = typeof window !== 'undefined' && /^(localhost|127\.0\.0\.1|\[::1\])$/.test(window.location.hostname);
const API_BASE = isLocalhost ? 'http://localhost:4000' : 'https://portfoliomahidhar-backend.onrender.com';
const AUTH_TOKEN = "mahi@123"

const ExperienceAdmin = () => {
  const queryClient = useQueryClient()
  const [experiences, setExperiences] = useState([])
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [uploadingIndex, setUploadingIndex] = useState(null)
  const [validationErrors, setValidationErrors] = useState({})

  useEffect(() => {
    fetchExperiences().then(setExperiences)
  }, [])

  const updateExperience = (index, field, value) => {
    setExperiences((prev) => {
      const updated = [...prev]
      updated[index][field] = value
      return updated
    })
    
    // Clear validation errors for this field when it's updated
    if (validationErrors[index]) {
      const fieldErrorMap = {
        title: "Job title is required",
        company: "Company name is required",
        startDate: "Start date is required"
      }
      
      const errorToRemove = fieldErrorMap[field]
      if (errorToRemove && value?.trim()) {
        setValidationErrors(prev => {
          const updated = { ...prev }
          if (updated[index]) {
            updated[index] = updated[index].filter(error => error !== errorToRemove)
            if (updated[index].length === 0) {
              delete updated[index]
            }
          }
          return updated
        })
      }
    }
  }

  const validateExperience = (exp) => {
    const errors = []
    if (!exp.title?.trim()) errors.push("Job title is required")
    if (!exp.company?.trim()) errors.push("Company name is required")
    if (!exp.startDate?.trim()) errors.push("Start date is required")
    return errors
  }

  const validateAllExperiences = () => {
    const newValidationErrors = {}
    let hasErrors = false
    
    experiences.forEach((exp, index) => {
      const errors = validateExperience(exp)
      if (errors.length > 0) {
        newValidationErrors[index] = errors
        hasErrors = true
      }
    })
    
    setValidationErrors(newValidationErrors)
    return !hasErrors
  }

  const saveData = async () => {
    // Clear previous messages
    setError("")
    setSuccess("")
    
    // Validate all experiences
    if (!validateAllExperiences()) {
      setError("Please fix the validation errors before saving.")
      return
    }
    
    setIsSaving(true)
    try {
      await saveExperiences(experiences, AUTH_TOKEN)
      setSuccess("Experiences saved successfully!")
      setValidationErrors({})
      queryClient.invalidateQueries({ queryKey: ["experiences"] })
      
      // Auto-clear success message
      setTimeout(() => setSuccess(''), 5000)
    } catch (err) {
      setError(err.message || "Failed to save experiences. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const addExperience = () => {
    const newExperience = {
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
      image: "",
      keyLearnings: [],
    }
    
    setExperiences((prev) => [...prev, newExperience])
    setError("") // Clear any previous errors
    setSuccess("New experience added! Please fill in the required fields.")
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccess("")
    }, 3000)
    
    // Scroll to the new experience after a short delay
    setTimeout(() => {
      const experienceCards = document.querySelectorAll('[data-experience-card]')
      const lastCard = experienceCards[experienceCards.length - 1]
      if (lastCard) {
        lastCard.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 100)
  }

  const removeExperience = (index) => {
    setExperiences((prev) => prev.filter((_, i) => i !== index))
  }

  const handleImageUpload = async (e, index) => {
    const file = e.target.files[0]
    if (!file) return

    setUploadingIndex(index)
    const formData = new FormData()
    formData.append("image", file)

    try {
      const res = await fetch(`${API_BASE}/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
        body: formData,
      })
      if (!res.ok) throw new Error("Image upload failed")
      const data = await res.json()
      updateExperience(index, "image", data.url)
    } catch (err) {
      setError(err.message)
    } finally {
      setUploadingIndex(null)
    }
  }

  return (
    <div className="space-y-8 relative">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-300/5 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-300/5 rounded-full blur-3xl animate-float-medium"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-300/5 rounded-full blur-3xl animate-float-fast"></div>
      </div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 animate-fade-in">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full flex items-center justify-center animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 dark:from-white dark:via-indigo-100 dark:to-purple-100 bg-clip-text text-transparent">
                Experience Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                Manage your professional work experience and career journey
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={addExperience}
            className="group relative px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-2xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-500 transform hover:scale-105 flex items-center space-x-2"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <Plus className="w-5 h-5" />
            <span>Add Experience</span>
          </button>
          
          <button
            onClick={saveData}
            disabled={isSaving}
            className="group relative px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-2xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-500 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
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
                <span>Save All</span>
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

      {/* Experience List */}
      <div className="space-y-6 animate-stagger">
        {experiences.map((exp, index) => (
          <div
            key={index}
            data-experience-card
            className="relative overflow-hidden group backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 border border-white/20 dark:border-gray-700/50 animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Gradient border effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-3xl opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
            
            {/* Card Header */}
            <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-400/5 dark:to-purple-400/5 px-8 py-6 border-b border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Experience #{index + 1}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Fill in your professional details</p>
                  </div>
                </div>
                
                <button
                  onClick={() => removeExperience(index)}
                  className="opacity-0 group-hover:opacity-100 p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200 hover:scale-110"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-8 space-y-8 relative z-10">
              {/* Basic Info Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    <span>Job Title</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={exp.title}
                    onChange={(e) => updateExperience(index, "title", e.target.value)}
                    placeholder="Senior Software Engineer"
                    className={`w-full px-4 py-4 rounded-2xl border-2 transition-all duration-300 ${
                      validationErrors[index]?.includes("Job title is required")
                        ? "border-red-500 bg-red-50/50 dark:bg-red-900/20 focus:ring-2 focus:ring-red-500" 
                        : "border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:scale-[1.02]`}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    <span>Company</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => updateExperience(index, "company", e.target.value)}
                    placeholder="Google Inc."
                    className={`w-full px-4 py-4 rounded-2xl border-2 transition-all duration-300 ${
                      validationErrors[index]?.includes("Company name is required")
                        ? "border-red-500 bg-red-50/50 dark:bg-red-900/20 focus:ring-2 focus:ring-red-500" 
                        : "border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:scale-[1.02]`}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>Location</span>
                  </label>
                  <input
                    type="text"
                    value={exp.location}
                    onChange={(e) => updateExperience(index, "location", e.target.value)}
                    placeholder="San Francisco, CA"
                    className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 focus:scale-[1.02]"
                  />
                </div>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Start Date</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(index, "startDate", e.target.value)}
                    placeholder="January 2022"
                    className={`w-full px-4 py-4 rounded-2xl border-2 transition-all duration-300 ${
                      validationErrors[index]?.includes("Start date is required")
                        ? "border-red-500 bg-red-50/50 dark:bg-red-900/20 focus:ring-2 focus:ring-red-500" 
                        : "border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:scale-[1.02]`}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>End Date</span>
                  </label>
                  <input
                    type="text"
                    value={exp.endDate}
                    onChange={(e) => updateExperience(index, "endDate", e.target.value)}
                    placeholder="Present or December 2023"
                    className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 focus:scale-[1.02]"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Job Description</span>
                </label>
                <textarea
                  value={exp.description}
                  onChange={(e) => updateExperience(index, "description", e.target.value)}
                  placeholder="Describe your role, responsibilities, and key achievements..."
                  rows={5}
                  className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 focus:scale-[1.02] resize-none"
                />
              </div>

              {/* Key Learnings */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Key Learnings & Achievements</span>
                </label>
                <textarea
                  value={Array.isArray(exp.keyLearnings) ? exp.keyLearnings.join("\n") : exp.keyLearnings || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    const arrayValue = value ? value.split("\n").filter(item => item.trim()) : [];
                    updateExperience(index, "keyLearnings", arrayValue);
                  }}
                  placeholder="Enter each learning on a new line:&#10;• Mastered React hooks and context API&#10;• Led a team of 5 developers&#10;• Improved application performance by 40%"
                  rows={5}
                  className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 focus:scale-[1.02] resize-none"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <Sparkles className="w-3 h-3" />
                  Enter each key learning on a separate line
                </p>
              </div>

              {/* Company Logo Upload */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  <span>Company Logo</span>
                </label>
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                  <div className="flex-1">
                    <label className="relative cursor-pointer group/upload">
                      <input
                        type="file"
                        onChange={(e) => handleImageUpload(e, index)}
                        className="sr-only"
                        accept="image/*"
                      />
                      <div className="flex items-center justify-center px-8 py-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl hover:border-indigo-500 dark:hover:border-indigo-400 transition-all duration-300 group-hover/upload:scale-[1.02] bg-white/50 dark:bg-gray-800/50">
                        {uploadingIndex === index ? (
                          <div className="flex items-center space-x-3 text-indigo-600 dark:text-indigo-400">
                            <div className="animate-spin rounded-full h-6 w-6 border-2 border-indigo-500 border-t-transparent"></div>
                            <span className="font-medium">Uploading logo...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400 text-center">
                            <Upload className="w-6 h-6" />
                            <div>
                              <p className="font-medium">{exp.image ? "Change company logo" : "Upload company logo"}</p>
                              <p className="text-sm">PNG, JPG, SVG up to 5MB</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>
                  
                  {exp.image && (
                    <div className="relative group/image">
                      <img
                        src={`${API_BASE}${exp.image}`}
                        alt="Company logo"
                        className="w-24 h-24 object-contain rounded-2xl shadow-lg bg-white dark:bg-gray-700 p-3 border-2 border-gray-200 dark:border-gray-600"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 rounded-2xl flex items-center justify-center">
                        <Eye className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Validation Errors */}
              {validationErrors[index] && validationErrors[index].length > 0 && (
                <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-red-800 dark:text-red-200 mb-2">Required fields missing:</p>
                      <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                        {validationErrors[index].map((error, errorIndex) => (
                          <li key={errorIndex} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                            {error}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {experiences.length === 0 && (
        <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-gray-800/50 dark:to-indigo-900/20 rounded-3xl border-2 border-dashed border-gray-300 dark:border-gray-600 animate-fade-in">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Briefcase className="w-12 h-12 text-indigo-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No work experience yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Start building your professional timeline by adding your work experiences and career achievements.
          </p>
          <button
            onClick={addExperience}
            className="group relative px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-3 mx-auto"
          >
            <Plus className="w-5 h-5" />
            <span>Add Your First Experience</span>
          </button>
        </div>
      )}

      {/* Action Buttons */}
      {experiences.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200 dark:border-gray-700 animate-slide-up">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">{experiences.length}</span> experience{experiences.length !== 1 ? 's' : ''} configured
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={addExperience}
              className="group px-6 py-3 border-2 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Another</span>
            </button>
            
            <button
              onClick={saveData}
              disabled={isSaving}
              className="group relative px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-500 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
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
                  <span>Save All Experiences</span>
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
  )
}

export default ExperienceAdmin