"use client"

import { useState, useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { fetchProjects } from "@/lib/api"
import { Save, Plus, Trash2, AlertCircle, CheckCircle, Sparkles, Code, ExternalLink, Github, Image, Eye, FolderOpen } from 'lucide-react'

const isLocalhost = typeof window !== 'undefined' && /^(localhost|127\.0\.0\.1|\[::1\])$/.test(window.location.hostname);
const API_BASE = isLocalhost ? 'http://localhost:4000' : 'https://portfoliomahidhar-backend.onrender.com';
const AUTH_TOKEN = "mahi@123"

const ProjectsAdmin = () => {
  const queryClient = useQueryClient()
  const [projects, setProjects] = useState([])
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [uploadingIndex, setUploadingIndex] = useState(null)

  useEffect(() => {
    fetchProjects().then(setProjects)
  }, [])

  const updateItem = (index, field, value) => {
    setProjects((prev) => {
      const updated = [...prev]
      updated[index][field] = value
      return updated
    })
  }

  const saveData = async () => {
    setIsSaving(true)
    setError("")
    setSuccess("")
    try {
      const res = await fetch(`${API_BASE}/projects`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
        body: JSON.stringify(projects),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || `Failed to save Projects`)
      }
      setSuccess(`Projects saved successfully!`)
      queryClient.invalidateQueries({ queryKey: ["projects"] })
      
      // Auto-clear success message
      setTimeout(() => setSuccess(''), 5000)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  const addItem = () => {
    setProjects((prev) => [
      ...prev,
      {
        title: "",
        category: "",
        description: "",
        tech: "",
        githubLink: "",
        deploymentLink: "",
        stats: "",
        image: ""
      },
    ])
    
    setSuccess("New project added! Fill in the details to showcase your work.")
    setTimeout(() => setSuccess(""), 3000)
    
    // Scroll to new project
    setTimeout(() => {
      const projectCards = document.querySelectorAll('[data-project-card]')
      const lastCard = projectCards[projectCards.length - 1]
      if (lastCard) {
        lastCard.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 100)
  }

  const removeItem = (index) => {
    setProjects((prev) => prev.filter((_, i) => i !== index))
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
      if (!res.ok) {
        throw new Error("Image upload failed")
      }
      const data = await res.json()
      updateItem(index, "image", data.url)
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
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300/5 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-300/5 rounded-full blur-3xl animate-float-medium"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-300/5 rounded-full blur-3xl animate-float-fast"></div>
      </div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 animate-fade-in">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                <Code className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full flex items-center justify-center animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-blue-900 dark:from-white dark:via-purple-100 dark:to-blue-100 bg-clip-text text-transparent">
                Projects Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                Manage your portfolio projects and showcase your work
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={addItem}
            className="group relative px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-2xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-500 transform hover:scale-105 flex items-center space-x-2"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <Plus className="w-5 h-5" />
            <span>Add Project</span>
          </button>
          
          <button
            onClick={saveData}
            disabled={isSaving}
            className="group relative px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-2xl shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-500 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
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

      {/* Projects List */}
      <div className="space-y-6 animate-stagger">
        {projects.map((project, index) => (
          <div
            key={index}
            data-project-card
            className="relative overflow-hidden group backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 border border-white/20 dark:border-gray-700/50 animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Gradient border effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-500 rounded-3xl opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
            
            {/* Card Header */}
            <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 dark:from-purple-400/5 dark:to-blue-400/5 px-8 py-6 border-b border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <FolderOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Project #{index + 1}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Showcase your amazing work</p>
                  </div>
                </div>
                
                <button
                  onClick={() => removeItem(index)}
                  className="opacity-0 group-hover:opacity-100 p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200 hover:scale-110"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-8 space-y-8 relative z-10">
              {/* Basic Info */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Project Title</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={project.title}
                    onChange={(e) => updateItem(index, "title", e.target.value)}
                    placeholder="Enter project title"
                    className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 focus:scale-[1.02]"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Category</span>
                  </label>
                  <input
                    type="text"
                    value={project.category}
                    onChange={(e) => updateItem(index, "category", e.target.value)}
                    placeholder="e.g., Web App, Mobile App, AI/ML"
                    className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 focus:scale-[1.02]"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Project Description</span>
                </label>
                <textarea
                  value={project.description}
                  onChange={(e) => updateItem(index, "description", e.target.value)}
                  placeholder="Describe your project in detail... What problem does it solve? What technologies did you use? What makes it special?"
                  rows={5}
                  className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 focus:scale-[1.02] resize-none"
                />
              </div>

              {/* Tech & Stats */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    <span>Tech Stack</span>
                  </label>
                  <input
                    type="text"
                    value={project.tech}
                    onChange={(e) => updateItem(index, "tech", e.target.value)}
                    placeholder="React, Node.js, MongoDB, Python, etc."
                    className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 focus:scale-[1.02]"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <Sparkles className="w-3 h-3" />
                    Separate technologies with commas
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Key Stats & Achievements</span>
                  </label>
                  <input
                    type="text"
                    value={project.stats}
                    onChange={(e) => updateItem(index, "stats", e.target.value)}
                    placeholder="30% performance improvement, 10k+ users, etc."
                    className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 focus:scale-[1.02]"
                  />
                </div>
              </div>

              {/* Links */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Github className="w-4 h-4" />
                    <span>GitHub Repository</span>
                  </label>
                  <input
                    type="text"
                    value={project.githubLink}
                    onChange={(e) => updateItem(index, "githubLink", e.target.value)}
                    placeholder="https://github.com/username/repository"
                    className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 focus:scale-[1.02]"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    <span>Live Demo / Deployment</span>
                  </label>
                  <input
                    type="text"
                    value={project.deploymentLink}
                    onChange={(e) => updateItem(index, "deploymentLink", e.target.value)}
                    placeholder="https://your-project.vercel.app"
                    className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 focus:scale-[1.02]"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Image className="w-4 h-4" />
                  <span>Project Screenshot</span>
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
                      <div className="flex items-center justify-center px-8 py-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl hover:border-purple-500 dark:hover:border-purple-400 transition-all duration-300 group-hover/upload:scale-[1.02] bg-white/50 dark:bg-gray-800/50">
                        {uploadingIndex === index ? (
                          <div className="flex items-center space-x-3 text-purple-600 dark:text-purple-400">
                            <div className="animate-spin rounded-full h-6 w-6 border-2 border-purple-500 border-t-transparent"></div>
                            <span className="font-medium">Uploading image...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400 text-center">
                            <Image className="w-6 h-6" />
                            <div>
                              <p className="font-medium">{project.image ? "Change project image" : "Upload project screenshot"}</p>
                              <p className="text-sm">PNG, JPG, WEBP up to 5MB</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>
                  
                  {project.image && (
                    <div className="relative group/image">
                      <img
                        src={`${API_BASE}${project.image}`}
                        alt="Project screenshot"
                        className="w-32 h-24 object-cover rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-600"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 rounded-2xl flex items-center justify-center">
                        <Eye className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Preview Section */}
              {(project.title || project.tech) && (
                <div className="p-6 bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-700/50 dark:to-purple-900/20 rounded-2xl border border-gray-200/50 dark:border-gray-600/50">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Project Preview
                  </h4>
                  <div className="space-y-3">
                    {project.title && (
                      <div className="flex items-center gap-3">
                        <div className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-sm font-medium">
                          {project.title}
                        </div>
                        {project.category && (
                          <div className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs">
                            {project.category}
                          </div>
                        )}
                      </div>
                    )}
                    {project.tech && (
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Tech: </span>
                        {project.tech.split(',').slice(0, 3).map(tech => tech.trim()).filter(Boolean).join(', ')}
                        {project.tech.split(',').length > 3 && '...'}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {projects.length === 0 && (
        <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-800/50 dark:to-purple-900/20 rounded-3xl border-2 border-dashed border-gray-300 dark:border-gray-600 animate-fade-in">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <FolderOpen className="w-12 h-12 text-purple-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No projects yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Showcase your amazing work by adding your first project. Highlight your skills and achievements!
          </p>
          <button
            onClick={addItem}
            className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-3 mx-auto"
          >
            <Plus className="w-5 h-5" />
            <span>Add Your First Project</span>
          </button>
        </div>
      )}

      {/* Action Buttons */}
      {projects.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200 dark:border-gray-700 animate-slide-up">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-semibold text-purple-600 dark:text-purple-400">{projects.length}</span> project{projects.length !== 1 ? 's' : ''} configured
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={addItem}
              className="group px-6 py-3 border-2 border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Another</span>
            </button>
            
            <button
              onClick={saveData}
              disabled={isSaving}
              className="group relative px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-500 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
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
                  <span>Save All Projects</span>
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

export default ProjectsAdmin