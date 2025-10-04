import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Briefcase, 
  Award, 
  Code, 
  Activity,
  ExternalLink,
  Trophy,
  Sparkles,
  TrendingUp,
  Target,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const API_BASE = 'https://portfoliomahidhar-backend.onrender.com';

interface DashboardStats {
  skills: number;
  projects: number;
  experiences: number;
  certifications: number;
  achievements: number;
  totalContentItems: number;
  profileCompleteness: number;
  lastUpdated?: string;
}

const Overview: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    skills: 0,
    projects: 0,
    experiences: 0,
    certifications: 0,
    achievements: 0,
    totalContentItems: 0,
    profileCompleteness: 0,
    lastUpdated: new Date().toLocaleDateString()
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all data in parallel
        const [skillsRes, projectsRes, experiencesRes, certificationsRes, achievementsRes] = await Promise.all([
          fetch(`${API_BASE}/skills`),
          fetch(`${API_BASE}/projects`),
          fetch(`${API_BASE}/experiences`),
          fetch(`${API_BASE}/certifications`),
          fetch(`${API_BASE}/achievements`)
        ]);

        const [skills, projects, experiences, certifications, achievements] = await Promise.all([
          skillsRes.json(),
          projectsRes.json(),
          experiencesRes.json(),
          certificationsRes.json(),
          achievementsRes.json().catch(() => []) // Handle if achievements endpoint fails
        ]);

        // Calculate accurate metrics
        const totalContentItems = skills.length + projects.length + experiences.length + certifications.length + achievements.length;
        const profileCompleteness = Math.min(Math.round((totalContentItems / 25) * 100), 100);

        setStats({
          skills: skills.length,
          projects: projects.length,
          experiences: experiences.length,
          certifications: certifications.length,
          achievements: achievements.length,
          totalContentItems,
          profileCompleteness,
          lastUpdated: new Date().toLocaleDateString()
        });
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: 'Total Skills',
      value: stats.skills,
      icon: Code,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      gradient: 'from-blue-500 to-cyan-500',
      change: '+2 this week',
      route: '/admin/skills',
      description: 'Technical competencies'
    },
    {
      title: 'Projects',
      value: stats.projects,
      icon: Briefcase,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100 dark:bg-emerald-900/20',
      gradient: 'from-emerald-500 to-green-500',
      change: '+1 this month',
      route: '/admin/projects',
      description: 'Portfolio showcases'
    },
    {
      title: 'Experience',
      value: stats.experiences,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      gradient: 'from-purple-500 to-pink-500',
      change: 'Updated recently',
      route: '/admin/experience',
      description: 'Work history'
    },
    {
      title: 'Certifications',
      value: stats.certifications,
      icon: Award,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
      gradient: 'from-orange-500 to-red-500',
      change: '+1 this month',
      route: '/admin/certifications',
      description: 'Professional credentials'
    },
    {
      title: 'Competitions',
      value: stats.achievements,
      icon: Trophy,
      color: 'text-rose-600',
      bgColor: 'bg-rose-100 dark:bg-rose-900/20',
      gradient: 'from-rose-500 to-pink-500',
      change: 'New section',
      route: '/admin/achievements',
      description: 'Awards & achievements'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] relative">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-300/10 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="text-center relative z-10">
          <div className="relative mx-auto mb-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto shadow-lg"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-2 border-purple-400/30"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Loading dashboard analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300/5 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300/5 rounded-full blur-3xl animate-float-medium"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-emerald-300/5 rounded-full blur-3xl animate-float-fast"></div>
      </div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 animate-fade-in">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full flex items-center justify-center animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-blue-900 dark:from-white dark:via-purple-100 dark:to-blue-100 bg-clip-text text-transparent">
                Dashboard Overview
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                Welcome back! Here's what's happening with your portfolio.
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="relative overflow-hidden group border-2 border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300 hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <ExternalLink className="w-4 h-4 mr-2" />
            <span className="font-semibold">View Portfolio</span>
          </Button>
          
          <Badge 
            variant="outline" 
            className="flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 px-3 py-2 rounded-full shadow-sm"
          >
            <Activity className="w-3 h-3 text-green-500 animate-pulse" />
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              Updated: {stats.lastUpdated}
            </span>
          </Badge>
        </div>
      </div>

      {/* Profile Completeness Card */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-slide-up">
        <Card className="lg:col-span-4 relative overflow-hidden border-0 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-800 dark:to-purple-900/20 shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-full"></div>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -inset-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-2xl blur opacity-30 animate-pulse"></div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Profile Completeness
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {stats.totalContentItems} items across all sections
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="relative">
                    <div className="w-24 h-24">
                      <svg className="w-full h-full" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#E2E8F0"
                          strokeWidth="3"
                        />
                        <path
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="url(#progress-gradient)"
                          strokeWidth="3"
                          strokeDasharray={`${stats.profileCompleteness}, 100`}
                          className="transition-all duration-1000 ease-out"
                        />
                        <defs>
                          <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#8B5CF6" />
                            <stop offset="100%" stopColor="#3B82F6" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                          {stats.profileCompleteness}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="hidden md:block">
                  <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 font-medium">
                    <TrendingUp className="w-4 h-4" />
                    <span>Excellent progress!</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Keep adding content to reach 100%
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 animate-stagger">
        {statCards.map((stat, index) => (
          <Card 
            key={index} 
            className="relative overflow-hidden group cursor-pointer border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => navigate(stat.route)}
          >
            {/* Gradient border effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
            
            {/* Animated background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl`}></div>
            
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 relative z-10">
              <CardTitle className="text-sm font-semibold text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300">
                {stat.title}
              </CardTitle>
              <div className="relative">
                <div className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-500 group-hover:duration-200"></div>
              </div>
            </CardHeader>
            
            <CardContent className="relative z-10">
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {stat.value}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {stat.description}
                  </p>
                </div>
                <div className="text-right">
                  <Badge 
                    variant="secondary" 
                    className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium animate-pulse"
                  >
                    {stat.change}
                  </Badge>
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="mt-4">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full bg-gradient-to-r ${stat.gradient} transition-all duration-1000 ease-out`}
                    style={{ width: `${(stat.value / Math.max(...statCards.map(s => s.value))) * 100}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
            
            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-gray-800/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up" style={{ animationDelay: '600ms' }}>
        <Card className="border-0 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/10 dark:to-red-900/10 backdrop-blur-xl shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Need Help?</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Check out our documentation and guides
                </p>
              </div>
              <Button variant="outline" className="border-orange-200 dark:border-orange-800 text-orange-600 dark:text-orange-400">
                Get Help
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 backdrop-blur-xl shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Analytics</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  View portfolio performance and insights
                </p>
              </div>
              <Button variant="outline" className="border-green-200 dark:border-green-800 text-green-600 dark:text-green-400">
                View Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
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
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes stagger {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
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
        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }
        .animate-stagger {
          animation: stagger 0.5s ease-out;
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Overview;