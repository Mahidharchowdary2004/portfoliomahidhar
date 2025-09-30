import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Briefcase, 
  Award, 
  Code, 
  Clock, 
  Eye,
  BarChart3,
  Activity,
  ExternalLink
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
        const [skillsRes, projectsRes, experiencesRes, certificationsRes] = await Promise.all([
          fetch(`${API_BASE}/skills`),
          fetch(`${API_BASE}/projects`),
          fetch(`${API_BASE}/experiences`),
          fetch(`${API_BASE}/certifications`)
        ]);

        const [skills, projects, experiences, certifications] = await Promise.all([
          skillsRes.json(),
          projectsRes.json(),
          experiencesRes.json(),
          certificationsRes.json()
        ]);

        // Calculate accurate metrics
        const totalContentItems = skills.length + projects.length + experiences.length + certifications.length;
        const profileCompleteness = Math.min(Math.round((totalContentItems / 20) * 100), 100);

        setStats({
          skills: skills.length,
          projects: projects.length,
          experiences: experiences.length,
          certifications: certifications.length,
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
      change: '+2 this week'
    },
    {
      title: 'Projects',
      value: stats.projects,
      icon: Briefcase,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100 dark:bg-emerald-900/20',
      change: '+1 this month'
    },
    {
      title: 'Work Experience',
      value: stats.experiences,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      change: 'Updated recently'
    },
    {
      title: 'Certifications',
      value: stats.certifications,
      icon: Award,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
      change: '+1 this month'
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
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
          </Card>
        ))}
      </div>

      {/* Portfolio Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <span>Portfolio Analytics</span>
          </CardTitle>
          <CardDescription>
            Overview of your portfolio content and completeness
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <div className="flex items-center space-x-3">
                <Briefcase className="w-5 h-5 text-blue-600" />
                <span className="text-gray-900 dark:text-white">Total Content Items</span>
              </div>
              <span className="font-semibold text-blue-600">{stats.totalContentItems}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-purple-600" />
                <span className="text-gray-900 dark:text-white">Profile Completeness</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-purple-600">{stats.profileCompleteness}%</span>
                <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-500"
                    style={{ width: `${stats.profileCompleteness}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-emerald-600" />
                <span className="text-gray-900 dark:text-white">Last Updated</span>
              </div>
              <span className="font-semibold text-emerald-600">{stats.lastUpdated}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20">
              <div className="flex items-center space-x-3">
                <Award className="w-5 h-5 text-orange-600" />
                <span className="text-gray-900 dark:text-white">Content Distribution</span>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {stats.skills} Skills • {stats.projects} Projects
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {stats.experiences} Experience • {stats.certifications} Certifications
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Overview;
