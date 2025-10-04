"use client"

import { useState, useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { fetchContactInfo } from "@/lib/api"
import { Save, Upload, Mail, Github, Linkedin, Phone, FileText, User, Eye, Sparkles, CheckCircle, AlertCircle } from 'lucide-react'

const isLocalhost = typeof window !== 'undefined' && /^(localhost|127\.0\.0\.1|\[::1\])$/.test(window.location.hostname);
const API_BASE = isLocalhost ? 'http://localhost:4000' : 'https://portfoliomahidhar-backend.onrender.com';

const ContactAdmin = () => {
  const queryClient = useQueryClient()
  const [contactInfo, setContactInfo] = useState({
    email: "",
    github: "",
    linkedin: "",
    phone: "",
    resumeUrl: "",
    profilePictureUrl: "",
  })
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    fetchContactInfo().then((data) => {
      if (data) {
        setContactInfo((prev) => ({ ...prev, ...data }))
      }
    })
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setContactInfo((prev) => ({ ...prev, [name]: value }))
  }

  const saveData = async () => {
    setIsSaving(true)
    setError("")
    setSuccess("")
    try {
      const res = await fetch(`${API_BASE}/contact-info`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer mahi@123`,
        },
        body: JSON.stringify(contactInfo),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || `Failed to save Contact Info`)
      }
      setSuccess(`Contact information saved successfully!`)
      queryClient.invalidateQueries({ queryKey: ["contactInfo"] })
      
      // Auto-clear success message
      setTimeout(() => setSuccess(''), 5000)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append("image", file)

    try {
      const res = await fetch(`${API_BASE}/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer mahi@123`,
        },
        body: formData,
      })
      if (!res.ok) {
        throw new Error("Image upload failed")
      }
      const data = await res.json()
      setContactInfo((prev) => ({ ...prev, profilePictureUrl: data.url }))
    } catch (err) {
      setError(err.message)
    } finally {
      setIsUploading(false)
    }
  }

  const getFieldIcon = (fieldName) => {
    const icons = {
      email: <Mail className="w-5 h-5" />,
      github: <Github className="w-5 h-5" />,
      linkedin: <Linkedin className="w-5 h-5" />,
      phone: <Phone className="w-5 h-5" />,
      resumeUrl: <FileText className="w-5 h-5" />,
    }
    return icons[fieldName] || <User className="w-5 h-5" />
  }

  const getFieldPlaceholder = (fieldName) => {
    const placeholders = {
      email: "your.email@example.com",
      github: "https://github.com/yourusername",
      linkedin: "https://linkedin.com/in/yourprofile",
      phone: "+1 (555) 123-4567",
      resumeUrl: "https://drive.google.com/file/d/your-resume-link",
    }
    return placeholders[fieldName] || fieldName.charAt(0).toUpperCase() + fieldName.slice(1).replace(/([A-Z])/g, " $1")
  }

  const getFieldLabel = (fieldName) => {
    const labels = {
      email: "Email Address",
      github: "GitHub Profile",
      linkedin: "LinkedIn Profile",
      phone: "Phone Number",
      resumeUrl: "Resume URL",
    }
    return labels[fieldName] || fieldName.charAt(0).toUpperCase() + fieldName.slice(1).replace(/([A-Z])/g, " $1")
  }

  const filledFieldsCount = Object.values(contactInfo).filter(value => value && value !== "profilePictureUrl").length

  return (
    <div className="space-y-8 relative">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300/5 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-300/5 rounded-full blur-3xl animate-float-medium"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-300/5 rounded-full blur-3xl animate-float-fast"></div>
      </div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 animate-fade-in">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full flex items-center justify-center animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent">
                Contact Information
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-500" />
                Manage your contact details and professional links
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="text-sm text-gray-600 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700">
            <span className="font-semibold text-blue-600 dark:text-blue-400">{filledFieldsCount}</span> of 5 fields filled
          </div>
          
          <button
            onClick={saveData}
            disabled={isSaving}
            className="group relative px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-500 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
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
                <span>Save Changes</span>
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

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-stagger">
        {/* Profile Picture Section */}
        <div className="lg:col-span-1">
          <div className="relative overflow-hidden group backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 border border-white/20 dark:border-gray-700/50">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
            
            <div className="p-8 relative z-10">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                  <User className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Picture</h3>
              </div>

              <div className="flex flex-col items-center space-y-6">
                {/* Profile Picture Display */}
                <div className="relative">
                  {contactInfo.profilePictureUrl ? (
                    <div className="relative group/image">
                      <img
                        src={`${API_BASE}${contactInfo.profilePictureUrl}`}
                        alt="Profile"
                        className="w-40 h-40 object-cover rounded-2xl shadow-2xl border-4 border-white dark:border-gray-700 group-hover/image:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 rounded-2xl flex items-center justify-center">
                        <Eye className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-40 h-40 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-2xl flex items-center justify-center border-4 border-white dark:border-gray-700 shadow-2xl">
                      <User className="w-16 h-16 text-gray-400 dark:text-gray-500" />
                    </div>
                  )}
                </div>

                {/* Upload Button */}
                <label className="relative cursor-pointer group/upload w-full">
                  <input type="file" onChange={handleImageUpload} className="sr-only" accept="image/*" />
                  <div className="flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group-hover/upload:scale-105">
                    {isUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 mr-2" />
                        <span>{contactInfo.profilePictureUrl ? "Change Picture" : "Upload Picture"}</span>
                      </>
                    )}
                  </div>
                </label>

                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Recommended: Square image, 400x400px or larger
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Details Section */}
        <div className="lg:col-span-2">
          <div className="relative overflow-hidden group backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 border border-white/20 dark:border-gray-700/50">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
            
            <div className="p-8 relative z-10">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Contact Details</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(contactInfo)
                  .filter(([key]) => key !== "profilePictureUrl")
                  .map(([key, value]) => (
                    <div key={key} className="space-y-3 group/field">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        {getFieldIcon(key)}
                        <span>{getFieldLabel(key)}</span>
                      </label>
                      <div className="relative">
                        <input
                          type={key === "email" ? "email" : key === "phone" ? "tel" : "text"}
                          name={key}
                          value={value}
                          onChange={handleChange}
                          placeholder={getFieldPlaceholder(key)}
                          className="w-full px-4 py-4 pl-12 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 focus:scale-[1.02] group-hover/field:border-blue-300 dark:group-hover/field:border-blue-600"
                        />
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
                          {getFieldIcon(key)}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="mt-8 relative overflow-hidden group backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 border border-white/20 dark:border-gray-700/50">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
            
            <div className="p-8 relative z-10">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Contact Preview</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(contactInfo)
                  .filter(([key, value]) => key !== "profilePictureUrl" && value)
                  .map(([key, value]) => (
                    <div 
                      key={key} 
                      className="flex items-center space-x-4 p-4 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-700/50 dark:to-blue-900/20 rounded-2xl border border-gray-200/50 dark:border-gray-600/50 group/preview hover:scale-105 transition-all duration-300"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                        <div className="text-white">
                          {getFieldIcon(key)}
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          {getFieldLabel(key)}
                        </p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {value}
                        </p>
                      </div>
                    </div>
                  ))}
                
                {filledFieldsCount === 0 && (
                  <div className="col-span-full text-center py-8">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Mail className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">No contact information added yet</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Fill in the fields above to see preview</p>
                  </div>
                )}
              </div>

              {/* Progress Indicator */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <span>Profile Completion</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">{filledFieldsCount}/5 fields</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000 ease-out"
                    style={{ width: `${(filledFieldsCount / 5) * 100}%` }}
                  ></div>
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
  )
}

export default ContactAdmin