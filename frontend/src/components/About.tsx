import React, { useEffect, useState } from 'react';
import { Code, Briefcase, Book, GraduationCap, Target } from 'lucide-react';
import { fetchAbout } from '@/lib/api';

interface Role {
  title?: string;
  description?: string;
  icon?: string;
}

interface Education {
  degree?: string;
  university?: string;
  school?: string;
  year?: string;
  gpa?: string;
  details?: string;
  focusAreas?: string[];
}

interface AboutData {
  title?: string;
  subtitle?: string;
  intro?: string;
  description?: string;
  roles?: Role[];
  education?: Education;
}

const About = () => {
  const [about, setAbout] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchAbout();
        setAbout(data || null);
      } catch (e) {
        console.error('Failed to fetch about data', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Bind main heading to subtitle/intro as requested
  const headingTitle = about?.subtitle || about?.intro || about?.title || 'About';
  const subtitle = about?.subtitle || about?.intro || '';
  const description = about?.description || '';

  const roles: Role[] = Array.isArray(about?.roles) ? (about?.roles as Role[]) : [];

  // Backend may return education as an array; normalize to single object for display
  const educationRaw: any = (about as any)?.education;
  const educationFromArray: Education | undefined = Array.isArray(educationRaw) && educationRaw.length > 0
    ? (() => {
        const first = educationRaw[0] || {};
        const details: string = first.details || '';
        let parsedYear: string | undefined;
        let parsedGpa: string | undefined;
        if (details) {
          const match = details.match(/GPA:\s*([^•]+)(?:\s*•\s*(.*))?/i);
          if (match) {
            parsedGpa = (match[1] || '').trim();
            parsedYear = (match[2] || '').trim();
          } else {
            parsedYear = details.trim();
          }
        }
        return {
          degree: first.degree,
          university: first.school,
          details: details || undefined,
          year: parsedYear,
          gpa: parsedGpa,
        } as Education;
      })()
    : undefined;

  const education: Education | undefined = educationFromArray || about?.education;
  const focusAreas: string[] = Array.isArray((about as any)?.focusAreas) ? ((about as any)?.focusAreas as string[]) : [];

  const hasRoles = Array.isArray(roles) && roles.length > 0;
  const hasEducation = !!(educationRaw && Array.isArray(educationRaw) && educationRaw.length > 0) || !!education;
  const hasAnyContent = Boolean(subtitle || description || hasRoles || hasEducation);

  if (loading) {
    return (
      <section id="about" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading about...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            About <span className="bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">Me</span>
          </h2>
          
          {subtitle && (
            <div className="relative inline-block">
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed relative z-10">
                {subtitle}
              </p>
              <div className="absolute -bottom-2 left-1/4 w-1/2 h-1 bg-gradient-to-r from-purple-500/30 to-orange-500/30 rounded-full"></div>
            </div>
          )}
          
          {!hasAnyContent && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">No about content yet. Add it in Admin → About.</p>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 items-start max-w-6xl mx-auto">
          {/* Left Section */}
          <div className="space-y-6">
            {/* Description Card */}
            {description && (
              <div className="
                relative 
                bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 
                rounded-2xl p-6 
                shadow-lg 
                transition-all duration-500 ease-out 
                hover:scale-[1.03] 
                hover:shadow-[0_10px_40px_rgba(147,51,234,0.3),0_0_70px_rgba(249,115,22,0.2)] 
                hover:-translate-y-2
                border border-gray-200 dark:border-gray-700
              ">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-lg">My Story</h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{description}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Role Cards */}
            {hasRoles && (
              <div className="grid md:grid-cols-2 gap-4">
                {roles.slice(0, 2).map((role, idx) => (
                  <div 
                    key={idx}
                    className="
                      relative 
                      bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 
                      rounded-2xl p-5 
                      shadow-lg 
                      transition-all duration-500 ease-out 
                      hover:scale-[1.03] 
                      hover:shadow-[0_10px_40px_rgba(147,51,234,0.3),0_0_70px_rgba(249,115,22,0.2)] 
                      hover:-translate-y-2
                      border border-gray-200 dark:border-gray-700
                    "
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                        idx === 0 
                          ? 'bg-purple-100 dark:bg-purple-900/30 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50' 
                          : 'bg-orange-100 dark:bg-orange-900/30 group-hover:bg-orange-200 dark:group-hover:bg-orange-900/50'
                      }`}>
                        {idx === 0 ? (
                          <Code className={`w-5 h-5 ${
                            idx === 0 
                              ? 'text-purple-600 dark:text-purple-400' 
                              : 'text-orange-600 dark:text-orange-400'
                          }`} />
                        ) : (
                          <Briefcase className={`w-5 h-5 ${
                            idx === 0 
                              ? 'text-purple-600 dark:text-purple-400' 
                              : 'text-orange-600 dark:text-orange-400'
                          }`} />
                        )}
                      </div>
                      <div className="flex-1">
                        {role.title && (
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                            {role.title}
                          </h4>
                        )}
                        {role.description && (
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">{role.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Section - Education */}
          <div className="relative">
            <div className="
              relative 
              bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 
              rounded-2xl p-6 
              shadow-lg 
              transition-all duration-500 ease-out 
              hover:scale-[1.03] 
              hover:shadow-[0_10px_40px_rgba(147,51,234,0.3),0_0_70px_rgba(249,115,22,0.2)] 
              hover:-translate-y-2
              border border-gray-200 dark:border-gray-700
            ">
              {/* Background decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-500/10 to-transparent rounded-full blur-xl"></div>
              
              <div className="flex items-center space-x-3 relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center shadow-lg">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-xl">Education</h4>
                  {(education?.university || education?.school || education?.year) && (
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {[education?.university || education?.school, education?.year ? `(${education?.year})` : ''].filter(Boolean).join(' ')}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-4 relative z-10 mt-4">
                {/* Main Education Entry */}
                <div className="
                  bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 
                  rounded-xl p-4 
                  shadow-md 
                  transition-all duration-300 ease-out 
                  hover:shadow-lg
                  border border-gray-100 dark:border-gray-600
                ">
                  {education?.degree && (
                    <h5 className="font-semibold text-gray-900 dark:text-white mb-1">{education.degree}</h5>
                  )}
                  {(education?.university || education?.school) && (
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">{education.university || education?.school}</p>
                  )}
                  {(education?.gpa || education?.details) && (
                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                      {education.gpa && (
                        <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full text-xs">
                          CGPA: {education.gpa}
                        </span>
                      )}
                      {education.details && !education.gpa && (
                        <span>{education.details}</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Additional education entries */}
                {Array.isArray(educationRaw) && educationRaw[1] && (
                  <div className="
                    bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 
                    rounded-lg p-3 
                    shadow-md 
                    transition-all duration-300 ease-out 
                    hover:shadow-lg
                    border border-gray-100 dark:border-gray-600
                  ">
                    {educationRaw[1]?.degree && (
                      <h5 className="font-medium text-gray-900 dark:text-white text-sm">{educationRaw[1]?.degree}</h5>
                    )}
                    {educationRaw[1]?.school && (
                      <p className="text-gray-600 dark:text-gray-300 text-xs mt-1">{educationRaw[1]?.school}</p>
                    )}
                    {educationRaw[1]?.details && (
                      <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{educationRaw[1]?.details}</p>
                    )}
                  </div>
                )}

                {Array.isArray(educationRaw) && educationRaw[2] && (
                  <div className="
                    bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 
                    rounded-lg p-3 
                    shadow-md 
                    transition-all duration-300 ease-out 
                    hover:shadow-lg
                    border border-gray-100 dark:border-gray-600
                  ">
                    {educationRaw[2]?.degree && (
                      <h5 className="font-medium text-gray-900 dark:text-white text-sm">{educationRaw[2]?.degree}</h5>
                    )}
                    {educationRaw[2]?.school && (
                      <p className="text-gray-600 dark:text-gray-300 text-xs mt-1">{educationRaw[2]?.school}</p>
                    )}
                    {educationRaw[2]?.details && (
                      <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{educationRaw[2]?.details}</p>
                    )}
                  </div>
                )}

                {/* Focus Areas */}
                <div className="
                  bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 
                  rounded-xl p-4 
                  shadow-md 
                  transition-all duration-300 ease-out 
                  hover:shadow-lg
                  border border-gray-100 dark:border-gray-600
                ">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded flex items-center justify-center">
                      <Target className="w-4 h-4 text-white" />
                    </div>
                    <h6 className="font-semibold text-gray-900 dark:text-white">Key Focus Areas</h6>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(focusAreas && focusAreas.length > 0 ? focusAreas : []).map((area, i) => (
                      <div 
                        key={i}
                        className="
                          flex items-center space-x-2 
                          bg-white/80 dark:bg-gray-700/80 
                          rounded-lg px-3 py-2 
                          border border-gray-200 dark:border-gray-600 
                          transition-all duration-300 ease-out 
                          hover:bg-white dark:hover:bg-gray-600
                          hover:border-orange-300 dark:hover:border-orange-500/50
                          hover:scale-105
                        "
                      >
                        <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-purple-500 rounded-full"></div>
                        <span className="text-xs text-gray-700 dark:text-gray-300">{area}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;