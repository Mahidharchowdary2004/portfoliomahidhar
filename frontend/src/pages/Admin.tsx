
import type React from "react"
import { NavLink, Outlet } from "react-router-dom"

// Admin panel without login
const AdminPanel = ({ onLogout }: { onLogout?: () => void }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800 admin-scrollbar">
      {/* Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 dark:from-purple-400/5 dark:to-blue-400/5"></div>
        <div className="relative px-8 pt-12 pb-8 animate-fade-in">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 mb-2 animate-slide-up">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg animate-pulse-slow">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c-.94 1.543.826-3.31 2.37-2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-4xl font-bold gradient-text">
                    Admin Panel
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your portfolio content</p>
                </div>
              </div>

              {/* Optional Logout Button (hidden if no handler) */}
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 border border-red-200 dark:border-red-800"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span>Logout</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Section */}
      <div className="px-8 pb-8 animate-slide-up">
        <div className="max-w-7xl mx-auto">
          <div className="glass-morphism rounded-2xl p-2 shadow-xl admin-card-hover">
            <div className="flex flex-wrap gap-2">
              <NavLink
                to=""
                end
                className={({ isActive }) =>
                  `group relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                    isActive
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25 transform scale-105"
                      : "text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-700/80 hover:shadow-md hover:scale-105"
                  }`
                }
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"
                  />
                </svg>
                <span>Overview</span>
              </NavLink>
              <NavLink
                to="about"
                className={({ isActive }) =>
                  `group relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                    isActive
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25 transform scale-105"
                      : "text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-700/80 hover:shadow-md hover:scale-105"
                  }`
                }
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>About</span>
              </NavLink>
              <NavLink
                to="skills"
                className={({ isActive }) =>
                  `group relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                    isActive
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25 transform scale-105"
                      : "text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-700/80 hover:shadow-md hover:scale-105"
                  }`
                }
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                <span>Skills</span>
              </NavLink>
              <NavLink
                to="experience"
                className={({ isActive }) =>
                  `group relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                    isActive
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25 transform scale-105"
                      : "text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-700/80 hover:shadow-md hover:scale-105"
                  }`
                }
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 10c-4.418 0-8-1.79-8-4V7a2 2 0 012-2h2V3a1 1 0 011-1h2a1 1 0 011 1v2h2V3a1 1 0 011-1h2a1 1 0 011 1v2h2a2 2 0 012 2v7c0 2.21-3.582 4-8 4z" />
                </svg>
                <span>Experience</span>
              </NavLink>
              <NavLink
                to="projects"
                className={({ isActive }) =>
                  `group relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                    isActive
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25 transform scale-105"
                      : "text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-700/80 hover:shadow-md hover:scale-105"
                  }`
                }
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <span>Projects</span>
              </NavLink>
              <NavLink
                to="certifications"
                className={({ isActive }) =>
                  `group relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                    isActive
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25 transform scale-105"
                      : "text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-700/80 hover:shadow-md hover:scale-105"
                  }`
                }
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
                <span>Certifications</span>
              </NavLink>
              <NavLink
                to="achievements"
                className={({ isActive }) =>
                  `group relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                    isActive
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25 transform scale-105"
                      : "text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-700/80 hover:shadow-md hover:scale-105"
                  }`
                }
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h2l1 2h10l1-2h2m-6 8a4 4 0 110-8 4 4 0 010 8z"
                  />
                </svg>
                <span>Competitions</span>
              </NavLink>
              <NavLink
                to="contact-info"
                className={({ isActive }) =>
                  `group relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                    isActive
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25 transform scale-105"
                      : "text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-700/80 hover:shadow-md hover:scale-105"
                  }`
                }
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span>Contact Info</span>
              </NavLink>
              <NavLink
                to="services"
                className={({ isActive }) =>
                  `group relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                    isActive
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25 transform scale-105"
                      : "text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-700/80 hover:shadow-md hover:scale-105"
                  }`
                }
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
                <span>Services</span>
              </NavLink>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-8 pb-8 animate-fade-in">
        <div className="max-w-7xl mx-auto">
          <div className="glass-morphism rounded-2xl shadow-2xl overflow-hidden admin-card-hover">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent dark:from-gray-700/5"></div>
            <div className="relative p-8">
              <Outlet />
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-300/10 dark:bg-purple-400/5 rounded-full blur-3xl animate-spin-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-300/10 dark:bg-blue-400/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-emerald-300/8 dark:bg-emerald-400/4 rounded-full blur-2xl animate-bounce-subtle"></div>
        <div className="absolute bottom-1/3 left-1/2 w-48 h-48 bg-orange-300/8 dark:bg-orange-400/4 rounded-full blur-2xl animate-pulse-slow"></div>
      </div>
    </div>
  )
}

export default AdminPanel
