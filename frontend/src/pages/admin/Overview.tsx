import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Briefcase, 
  Award, 
  Code, 
  Activity,
  ExternalLink,
  Trophy
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
      change: '+2 this week',
      route: '/admin/skills'
    },
    {
      title: 'Projects',
      value: stats.projects,
      icon: Briefcase,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100 dark:bg-emerald-900/20',
      change: '+1 this month',
      route: '/admin/projects'
    },
    {
      title: 'Experience',
      value: stats.experiences,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      change: 'Updated recently',
      route: '/admin/experience'
    },
    {
      title: 'Certifications',
      value: stats.certifications,
      icon: Award,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
      change: '+1 this month',
      route: '/admin/certifications'
    },
    {
      title: 'Competitions',
      value: stats.achievements,
      icon: Trophy,
      color: 'text-rose-600',
      bgColor: 'bg-rose-100 dark:bg-rose-900/20',
      change: 'New section',
      route: '/admin/achievements'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back! Here's what's happening with your portfolio.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
          >
            <ExternalLink className="w-4 h-4" />
            <span>View Portfolio</span>
          </Button>
          <Badge variant="outline" className="flex items-center space-x-1">
            <Activity className="w-3 h-3" />
            <span>Last updated: {stats.lastUpdated}</span>
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 animate-slide-up">
        {statCards.map((stat, index) => (
          <Card 
            key={index} 
            className="relative overflow-hidden admin-card-hover cursor-pointer group"
            onClick={() => navigate(stat.route)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor} group-hover:scale-110 transition-transform`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {stat.change}
              </p>
            </CardContent>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-purple-50 dark:to-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Card>
        ))}
      </div>

    </div>
  );
};

export default Overview;
