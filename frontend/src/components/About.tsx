import React, { useEffect, useState } from 'react';
import { Code, Briefcase, Book } from 'lucide-react';
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
    <section id="about" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            About <span className="bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">Me</span>
          </h2>
          {subtitle && (
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">{subtitle}</p>
          )}
          {!hasAnyContent && (
            <p className="text-sm text-gray-500 dark:text-gray-400">No about content yet. Add it in Admin → About.</p>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Section */}
          <div className="space-y-6">
            {description && (
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
            )}

            {/* Role Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              {hasRoles && roles.slice(0, 2).map((role, idx) => (
                <div key={idx} className="flex items-start space-x-3">
                  <div className={`w-8 h-8 ${idx === 0 ? 'bg-purple-100 dark:bg-purple-900' : 'bg-orange-100 dark:bg-orange-900'} rounded-lg flex items-center justify-center`}>
                    {idx === 0 ? (
                      <Code className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    ) : (
                      <Briefcase className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    )}
                  </div>
                  <div>
                    {role.title && (
                      <h4 className="font-semibold text-gray-900 dark:text-white">{role.title}</h4>
                    )}
                    {role.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">{role.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            
          </div>

          {/* Right Section - Education */}
            <div className="relative">
            <div className="bg-gradient-to-br from-purple-100 to-orange-100 dark:from-purple-900 dark:to-orange-900 rounded-2xl p-8 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <Book className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Education</h4>
                  {(education?.university || education?.school || education?.year) && (
                    <p className="text-gray-600 dark:text-gray-400">{[education?.university || education?.school, education?.year ? `(${education?.year})` : ''].filter(Boolean).join(' ')}</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  {education?.degree && (
                    <h5 className="font-medium text-gray-900 dark:text-white">{education.degree}</h5>
                  )}
                  {(education?.university || education?.school) && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">{education.university || education?.school}</p>
                  )}
                  {(education?.gpa || education?.details) && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">{education.gpa ? `CGPA: ${education.gpa}` : education.details}</p>
                  )}
                  {focusAreas.length > 0 && (
                    <p className="text-sm text-purple-600 dark:text-purple-400">{`Specialization: ${focusAreas[0]}`}</p>
                  )}
                </div>

                {/* Additional education entries from backend (indexes 1 and 2) */}
                {Array.isArray(educationRaw) && educationRaw[1] && (
                  <div>
                    {educationRaw[1]?.degree && (
                      <h5 className="font-medium text-gray-900 dark:text-white">{educationRaw[1]?.degree}</h5>
                    )}
                    {educationRaw[1]?.school && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">{educationRaw[1]?.school}</p>
                    )}
                    {educationRaw[1]?.details && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">{educationRaw[1]?.details}</p>
                    )}
                  </div>
                )}

                {Array.isArray(educationRaw) && educationRaw[2] && (
                  <div>
                    {educationRaw[2]?.degree && (
                      <h5 className="font-medium text-gray-900 dark:text-white">{educationRaw[2]?.degree}</h5>
                    )}
                    {educationRaw[2]?.school && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">{educationRaw[2]?.school}</p>
                    )}
                    {educationRaw[2]?.details && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">{educationRaw[2]?.details}</p>
                    )}
                  </div>
                )}

                {/* Focus Areas */}
                <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg">
                  <h6 className="font-medium text-gray-900 dark:text-white mb-2">Key Focus Areas</h6>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    {(focusAreas && focusAreas.length > 0 ? focusAreas : []).map((area, i) => (
                      <li key={i}>• {area}</li>
                    ))}
                  </ul>
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
