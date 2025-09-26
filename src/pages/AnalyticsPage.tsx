import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Users, 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  Download,
  Activity,
  Brain,
  Heart,
  Clock,
  Star,
  FileText,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface AnalyticsData {
  totalUsers: number;
  totalRevenue: number;
  totalSessions: number;
  activeTherapists: number;
  moduleUsage: { [key: string]: number };
  patientEngagement: { [key: string]: number };
  therapistPerformance: Array<{
    name: string;
    sessions: number;
    rating: number;
    revenue: number;
  }>;
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: Date;
  }>;
}

const AnalyticsPage: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalUsers: 0,
    totalRevenue: 0,
    totalSessions: 0,
    activeTherapists: 0,
    moduleUsage: {},
    patientEngagement: {},
    therapistPerformance: [],
    recentActivity: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Generate mock data for demonstration
  const generateMockData = (): AnalyticsData => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const moodEntries = JSON.parse(localStorage.getItem('moodEntries') || '[]');
    
    const completedBookings = bookings.filter((b: any) => b.status === 'completed');
    const therapists = users.filter((u: any) => u.role === 'therapist');
    const patients = users.filter((u: any) => u.role === 'patient');

    return {
      totalUsers: users.length,
      totalRevenue: completedBookings.length * 150, // $150 per session
      totalSessions: completedBookings.length,
      activeTherapists: therapists.length,
      moduleUsage: {
        'CBT Therapy': Math.floor(Math.random() * 100) + 50,
        'Mindfulness': Math.floor(Math.random() * 80) + 40,
        'Mood Tracking': moodEntries.length,
        'Art Therapy': Math.floor(Math.random() * 60) + 30,
        'Sleep Therapy': Math.floor(Math.random() * 70) + 35,
        'Stress Management': Math.floor(Math.random() * 90) + 45
      },
      patientEngagement: {
        'Highly Active': Math.floor(patients.length * 0.3),
        'Moderately Active': Math.floor(patients.length * 0.5),
        'Low Activity': Math.floor(patients.length * 0.2)
      },
      therapistPerformance: therapists.slice(0, 5).map((t: any, index: number) => ({
        name: t.name || `Therapist ${index + 1}`,
        sessions: Math.floor(Math.random() * 20) + 5,
        rating: 4.2 + Math.random() * 0.8,
        revenue: (Math.floor(Math.random() * 20) + 5) * 150
      })),
      recentActivity: [
        {
          id: '1',
          type: 'session',
          description: 'New therapy session completed',
          timestamp: new Date(Date.now() - Math.random() * 3600000)
        },
        {
          id: '2',
          type: 'user',
          description: 'New patient registered',
          timestamp: new Date(Date.now() - Math.random() * 7200000)
        },
        {
          id: '3',
          type: 'module',
          description: 'CBT module accessed',
          timestamp: new Date(Date.now() - Math.random() * 1800000)
        }
      ]
    };
  };

  const loadAnalyticsData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setAnalyticsData(generateMockData());
      setLastUpdated(new Date());
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    loadAnalyticsData();
    const interval = setInterval(loadAnalyticsData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const exportData = (format: 'json' | 'csv' | 'report') => {
    const timestamp = new Date().toISOString().split('T')[0];
    let content = '';
    let filename = '';
    let mimeType = '';

    switch (format) {
      case 'json':
        content = JSON.stringify(analyticsData, null, 2);
        filename = `analytics-${timestamp}.json`;
        mimeType = 'application/json';
        break;
      case 'csv':
        content = `Metric,Value\n`;
        content += `Total Users,${analyticsData.totalUsers}\n`;
        content += `Total Revenue,$${analyticsData.totalRevenue}\n`;
        content += `Total Sessions,${analyticsData.totalSessions}\n`;
        content += `Active Therapists,${analyticsData.activeTherapists}\n`;
        filename = `analytics-${timestamp}.csv`;
        mimeType = 'text/csv';
        break;
      case 'report':
        content = `Analytics Report - ${new Date().toLocaleDateString()}\n\n`;
        content += `Overview:\n`;
        content += `- Total Users: ${analyticsData.totalUsers}\n`;
        content += `- Total Revenue: $${analyticsData.totalRevenue}\n`;
        content += `- Total Sessions: ${analyticsData.totalSessions}\n`;
        content += `- Active Therapists: ${analyticsData.activeTherapists}\n\n`;
        content += `Module Usage:\n`;
        Object.entries(analyticsData.moduleUsage).forEach(([module, usage]) => {
          content += `- ${module}: ${usage} uses\n`;
        });
        filename = `analytics-report-${timestamp}.txt`;
        mimeType = 'text/plain';
        break;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            You don't have permission to view this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Last updated: {lastUpdated.toLocaleString()}
            </p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={loadAnalyticsData}
              disabled={isLoading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <div className="relative group">
              <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <button
                  onClick={() => exportData('json')}
                  className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg"
                >
                  Export as JSON
                </button>
                <button
                  onClick={() => exportData('csv')}
                  className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Export as CSV
                </button>
                <button
                  onClick={() => exportData('report')}
                  className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-lg"
                >
                  Export Report
                </button>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Users
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {analyticsData.totalUsers}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Revenue
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${analyticsData.totalRevenue.toLocaleString()}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Sessions
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {analyticsData.totalSessions}
                    </p>
                  </div>
                  <Calendar className="w-8 h-8 text-purple-600" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Active Therapists
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {analyticsData.activeTherapists}
                    </p>
                  </div>
                  <Heart className="w-8 h-8 text-red-600" />
                </div>
              </motion.div>
            </div>

            {/* Charts and Data */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Module Usage */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Brain className="w-5 h-5 mr-2" />
                  Therapy Module Usage
                </h3>
                <div className="space-y-4">
                  {Object.entries(analyticsData.moduleUsage).map(([module, usage]) => (
                    <div key={module} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{module}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${Math.min((usage / 100) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white w-8">
                          {usage}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Patient Engagement */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Patient Engagement Levels
                </h3>
                <div className="space-y-4">
                  {Object.entries(analyticsData.patientEngagement).map(([level, count]) => (
                    <div key={level} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{level}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              level === 'Highly Active' ? 'bg-green-600' :
                              level === 'Moderately Active' ? 'bg-yellow-600' : 'bg-red-600'
                            }`}
                            style={{ width: `${Math.min((count / analyticsData.totalUsers) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white w-8">
                          {count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Therapist Performance Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden mb-8"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <Star className="w-5 h-5 mr-2" />
                  Top Therapist Performance
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Therapist
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Sessions
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Rating
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Revenue
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {analyticsData.therapistPerformance.map((therapist, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {therapist.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {therapist.sessions}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {therapist.rating.toFixed(1)} ⭐
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          ${therapist.revenue.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Recent Activity
              </h3>
              <div className="space-y-3">
                {analyticsData.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'session' ? 'bg-green-500' :
                      activity.type === 'user' ? 'bg-blue-500' : 'bg-purple-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-white">{activity.description}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {activity.timestamp.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;