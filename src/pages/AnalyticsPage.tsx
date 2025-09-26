import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, TrendingUp, Users, DollarSign, Calendar,
  Download, Filter, Eye, ArrowUp, ArrowDown, Activity,
  Clock, Star, Heart, Target, Brain, MessageCircle
} from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell,
  RadialBarChart, RadialBar
} from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  getAnalytics, updateAnalyticsFromCurrentData, generateTimeSeriesData
} from '../utils/analyticsManager';
import toast from 'react-hot-toast';

function AnalyticsPage() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('users');
  const [analytics, setAnalytics] = useState<any>(null);
  const [timeSeriesData, setTimeSeriesData] = useState<any[]>([]);
  const [therapyModuleUsage, setTherapyModuleUsage] = useState<any[]>([]);
  const [patientEngagement, setPatientEngagement] = useState<any[]>([]);
  const [therapistPerformance, setTherapistPerformance] = useState<any[]>([]);

  useEffect(() => {
    loadAnalyticsData();
    
    // Set up interval to refresh data
    const interval = setInterval(() => {
      loadAnalyticsData();
    }, 10000); // Update every 10 seconds
    
    // Listen for analytics updates
    const handleAnalyticsUpdate = () => {
      loadAnalyticsData();
    };
    
    window.addEventListener('mindcare-analytics-updated', handleAnalyticsUpdate);
    window.addEventListener('mindcare-data-updated', handleAnalyticsUpdate);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('mindcare-analytics-updated', handleAnalyticsUpdate);
      window.removeEventListener('mindcare-data-updated', handleAnalyticsUpdate);
    };
  }, []);

  const loadAnalyticsData = () => {
    // Load initial analytics data
    const initialAnalytics = updateAnalyticsFromCurrentData();
    setAnalytics(initialAnalytics);
    
    // Generate time series data
    const timeData = generateTimeSeriesData();
    setTimeSeriesData(timeData);

    // Load therapy module usage data
    loadTherapyModuleUsage();
    
    // Load patient engagement data
    loadPatientEngagement();
    
    // Load therapist performance data
    loadTherapistPerformance();
  };

  const loadTherapyModuleUsage = () => {
    // Get user progress data to analyze therapy module usage
    const userProgress = JSON.parse(localStorage.getItem('mindcare_user_progress') || '{}');
    const moodEntries = JSON.parse(localStorage.getItem('mindcare_mood_entries') || '[]');
    const gratitudeEntries = JSON.parse(localStorage.getItem('mindcare_gratitude_entries') || '[]');
    const cbtRecords = JSON.parse(localStorage.getItem('mindcare_cbt_records') || '[]');
    const sleepLogs = JSON.parse(localStorage.getItem('mindcare_sleep_logs') || '[]');
    const stressLogs = JSON.parse(localStorage.getItem('mindcare_stress_logs') || '[]');
    const exposureSessions = JSON.parse(localStorage.getItem('mindcare_exposure_sessions') || '[]');
    const cravingLogs = JSON.parse(localStorage.getItem('mindcare_craving_logs') || '[]');
    const videoProgress = JSON.parse(localStorage.getItem('mindcare_video_progress') || '[]');
    const actValues = JSON.parse(localStorage.getItem('mindcare_act_values') || '[]');

    const moduleUsage = [
      { name: 'Mood Tracker', usage: moodEntries.length, color: '#8B5CF6' },
      { name: 'Gratitude Journal', usage: gratitudeEntries.length, color: '#10B981' },
      { name: 'CBT Thought Records', usage: cbtRecords.length, color: '#3B82F6' },
      { name: 'Sleep Therapy', usage: sleepLogs.length, color: '#6366F1' },
      { name: 'Stress Management', usage: stressLogs.length, color: '#F59E0B' },
      { name: 'Exposure Therapy', usage: exposureSessions.length, color: '#EF4444' },
      { name: 'Addiction Support', usage: cravingLogs.length, color: '#EC4899' },
      { name: 'Video Therapy', usage: videoProgress.length, color: '#14B8A6' },
      { name: 'ACT Therapy', usage: actValues.length, color: '#F97316' },
      { name: 'Mindfulness', usage: Math.floor(Math.random() * 25) + 15, color: '#84CC16' },
      { name: 'Art Therapy', usage: Math.floor(Math.random() * 20) + 10, color: '#A855F7' },
      { name: 'Music Therapy', usage: Math.floor(Math.random() * 30) + 20, color: '#06B6D4' }
    ].sort((a, b) => b.usage - a.usage);

    setTherapyModuleUsage(moduleUsage);
  };

  const loadPatientEngagement = () => {
    // Analyze patient engagement based on various activities
    const moodEntries = JSON.parse(localStorage.getItem('mindcare_mood_entries') || '[]');
    const gratitudeEntries = JSON.parse(localStorage.getItem('mindcare_gratitude_entries') || '[]');
    const bookings = JSON.parse(localStorage.getItem('mindcare_bookings') || '[]');
    const registeredUsers = JSON.parse(localStorage.getItem('mindcare_registered_users') || '[]');

    // Calculate engagement levels
    const patients = registeredUsers.filter((u: any) => u.role === 'patient');
    const totalPatients = patients.length + 1; // +1 for demo patient

    const highEngagement = Math.floor(totalPatients * 0.35); // 35% highly engaged
    const mediumEngagement = Math.floor(totalPatients * 0.45); // 45% moderately engaged
    const lowEngagement = totalPatients - highEngagement - mediumEngagement; // Rest are low engagement

    const engagementData = [
      { name: 'Highly Engaged', value: highEngagement, percentage: Math.round((highEngagement / totalPatients) * 100), color: '#10B981' },
      { name: 'Moderately Engaged', value: mediumEngagement, percentage: Math.round((mediumEngagement / totalPatients) * 100), color: '#F59E0B' },
      { name: 'Low Engagement', value: lowEngagement, percentage: Math.round((lowEngagement / totalPatients) * 100), color: '#EF4444' }
    ];

    setPatientEngagement(engagementData);
  };

  const loadTherapistPerformance = () => {
    // Get therapist performance data from bookings
    const bookings = JSON.parse(localStorage.getItem('mindcare_bookings') || '[]');
    const therapistServices = JSON.parse(localStorage.getItem('mindcare_therapist_services') || '[]');
    const registeredUsers = JSON.parse(localStorage.getItem('mindcare_registered_users') || '[]');

    // Include demo therapist
    const therapistStats: any = {
      'Dr. Sarah Smith': {
        name: 'Dr. Sarah Smith',
        sessions: 0,
        rating: 4.8,
        revenue: 0,
        patients: new Set()
      }
    };

    // Process bookings to get real therapist stats
    bookings.forEach((booking: any) => {
      const therapistName = booking.therapistName;
      if (!therapistStats[therapistName]) {
        therapistStats[therapistName] = {
          name: therapistName,
          sessions: 0,
          rating: 4.5 + Math.random() * 0.5, // Random rating between 4.5-5.0
          revenue: 0,
          patients: new Set()
        };
      }
      
      if (booking.status === 'completed') {
        therapistStats[therapistName].sessions += 1;
        therapistStats[therapistName].revenue += parseFloat(booking.amount?.replace('$', '') || '0');
        therapistStats[therapistName].patients.add(booking.patientId);
      }
    });

    // Convert to array and add patient count
    const performanceData = Object.values(therapistStats).map((therapist: any) => ({
      ...therapist,
      patients: therapist.patients.size,
      avgRevenue: therapist.sessions > 0 ? Math.round(therapist.revenue / therapist.sessions) : 0
    })).sort((a: any, b: any) => b.sessions - a.sessions);

    setTherapistPerformance(performanceData);
  };

  const exportData = (format: 'csv' | 'json' | 'pdf') => {
    try {
      const exportData = {
        analytics,
        timeSeriesData,
        therapyModuleUsage,
        patientEngagement,
        therapistPerformance,
        exportDate: new Date().toISOString(),
        period: selectedPeriod
      };

      if (format === 'json') {
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `mindcare-analytics-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
      } else if (format === 'csv') {
        // Create CSV data
        let csvContent = 'Analytics Report\n\n';
        
        // Add summary stats
        csvContent += 'Summary Statistics\n';
        csvContent += `Total Users,${analytics.users.totalUsers}\n`;
        csvContent += `Active Therapists,${analytics.therapists.activeTherapists}\n`;
        csvContent += `Total Sessions,${analytics.sessions.totalSessions}\n`;
        csvContent += `Total Revenue,$${analytics.revenue.totalRevenue}\n\n`;
        
        // Add therapy module usage
        csvContent += 'Therapy Module Usage\n';
        csvContent += 'Module Name,Usage Count\n';
        therapyModuleUsage.forEach(module => {
          csvContent += `${module.name},${module.usage}\n`;
        });
        
        csvContent += '\nTherapist Performance\n';
        csvContent += 'Therapist Name,Sessions,Rating,Revenue,Patients\n';
        therapistPerformance.forEach(therapist => {
          csvContent += `${therapist.name},${therapist.sessions},${therapist.rating},$${therapist.revenue},${therapist.patients}\n`;
        });

        const dataBlob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `mindcare-analytics-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        URL.revokeObjectURL(url);
      } else if (format === 'pdf') {
        // For PDF, we'll create a formatted text version
        const reportContent = `
MINDCARE PLATFORM ANALYTICS REPORT
Generated: ${new Date().toLocaleDateString()}
Period: ${selectedPeriod}

SUMMARY STATISTICS
==================
Total Users: ${analytics.users.totalUsers}
Active Therapists: ${analytics.therapists.activeTherapists}
Total Sessions: ${analytics.sessions.totalSessions}
Completion Rate: ${analytics.sessions.sessionCompletionRate.toFixed(1)}%
Total Revenue: $${analytics.revenue.totalRevenue.toLocaleString()}
Monthly Revenue: $${analytics.revenue.monthlyRevenue.toLocaleString()}

THERAPY MODULE USAGE
===================
${therapyModuleUsage.map(module => `${module.name}: ${module.usage} uses`).join('\n')}

PATIENT ENGAGEMENT
==================
${patientEngagement.map(level => `${level.name}: ${level.value} patients (${level.percentage}%)`).join('\n')}

TOP THERAPIST PERFORMANCE
========================
${therapistPerformance.slice(0, 5).map(therapist => 
  `${therapist.name}: ${therapist.sessions} sessions, $${therapist.revenue} revenue, ${therapist.patients} patients`
).join('\n')}
        `;

        const dataBlob = new Blob([reportContent], { type: 'text/plain' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `mindcare-analytics-report-${new Date().toISOString().split('T')[0]}.txt`;
        link.click();
        URL.revokeObjectURL(url);
      }

      toast.success(`Analytics data exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  const userTypeDistribution = [
    { name: 'Patients', value: analytics?.users.totalUsers - analytics?.therapists.totalTherapists || 0, color: '#3B82F6' },
    { name: 'Therapists', value: analytics?.therapists.totalTherapists || 0, color: '#10B981' },
    { name: 'Admins', value: 5, color: '#8B5CF6' }
  ];

  const stats = analytics ? [
    {
      title: 'Total Users',
      value: analytics.users.totalUsers.toLocaleString(),
      change: `+${analytics.users.userGrowthRate}%`,
      trend: 'up',
      icon: Users,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Monthly Revenue',
      value: `$${analytics.revenue.monthlyRevenue.toLocaleString()}`,
      change: `+${analytics.revenue.revenueGrowthRate}%`,
      trend: 'up',
      icon: DollarSign,
      color: 'from-green-500 to-teal-500'
    },
    {
      title: 'Active Sessions',
      value: analytics.sessions.activeSessions.toString(),
      change: `${analytics.sessions.sessionCompletionRate.toFixed(1)}% completion`,
      trend: 'up',
      icon: Activity,
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Total Sessions',
      value: analytics.sessions.totalSessions.toString(),
      change: `${analytics.sessions.completedSessions} completed`,
      trend: 'up',
      icon: TrendingUp,
      color: 'from-orange-500 to-red-500'
    }
  ] : [];

  return (
    <div className={`h-screen flex flex-col ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50'
    }`}>
      <div className="flex-1 overflow-y-auto p-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-2xl font-bold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>
                Platform Analytics
              </h1>
              <p className={`text-base ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Comprehensive insights into platform performance and user behavior
              </p>
            </div>
            <div className="flex space-x-2">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className={`px-4 py-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-purple-500`}
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
              <div className="relative">
                <button 
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
                  onClick={() => document.getElementById('export-menu')?.classList.toggle('hidden')}
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
                <div 
                  id="export-menu"
                  className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg z-10 hidden ${
                    theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                  }`}
                >
                  <div className="py-1">
                    <button
                      onClick={() => {
                        exportData('json');
                        document.getElementById('export-menu')?.classList.add('hidden');
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      Export as JSON
                    </button>
                    <button
                      onClick={() => {
                        exportData('csv');
                        document.getElementById('export-menu')?.classList.add('hidden');
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      Export as CSV
                    </button>
                    <button
                      onClick={() => {
                        exportData('pdf');
                        document.getElementById('export-menu')?.classList.add('hidden');
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      Export as Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-xl shadow-lg ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {stat.title}
                  </h3>
                  <p className={`text-xl font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-800'
                  }`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="flex items-center space-x-1">
                {stat.trend === 'up' ? (
                  <ArrowUp className="w-3 h-3 text-green-500" />
                ) : (
                  <ArrowDown className="w-3 h-3 text-red-500" />
                )}
                <span className={`text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {stat.change}
                </span>
                <span className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  vs last month
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-4 mb-4">
          {/* User Growth Chart */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className={`p-4 rounded-xl shadow-lg ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <h3 className={`text-lg font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>
              User Growth & Session Trends
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={timeSeriesData.slice(-6).map((data, index) => ({
                month: new Date(data.date).toLocaleDateString('en-US', { month: 'short' }),
                users: data.users,
                sessions: data.sessions
              }))}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#E5E7EB'} />
                <XAxis 
                  dataKey="month" 
                  stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
                  fontSize={12}
                />
                <YAxis 
                  stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    color: theme === 'dark' ? '#FFFFFF' : '#000000'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="New Users"
                />
                <Line 
                  type="monotone" 
                  dataKey="sessions" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="Sessions"
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className={`p-4 rounded-xl shadow-lg ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <h3 className={`text-lg font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>
              Revenue Analytics
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={timeSeriesData.slice(-6).map((data, index) => ({
                month: new Date(data.date).toLocaleDateString('en-US', { month: 'short' }),
                revenue: data.revenue
              }))}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#E5E7EB'} />
                <XAxis 
                  dataKey="month" 
                  stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
                  fontSize={12}
                />
                <YAxis 
                  stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    color: theme === 'dark' ? '#FFFFFF' : '#000000'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#8B5CF6" 
                  fill="#8B5CF6"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* User Distribution and Therapy Module Usage */}
        <div className="grid lg:grid-cols-2 gap-4 mb-4">
          {/* User Type Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className={`p-4 rounded-xl shadow-lg ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <h3 className={`text-lg font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>
              User Distribution
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={userTypeDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {userTypeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    color: theme === 'dark' ? '#FFFFFF' : '#000000'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Therapy Module Usage */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className={`p-4 rounded-xl shadow-lg ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <h3 className={`text-lg font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>
              Most Popular Therapy Modules
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={therapyModuleUsage.slice(0, 6)} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#E5E7EB'} />
                <XAxis 
                  type="number"
                  stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
                  fontSize={12}
                />
                <YAxis 
                  type="category"
                  dataKey="name"
                  stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
                  fontSize={10}
                  width={80}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    color: theme === 'dark' ? '#FFFFFF' : '#000000'
                  }}
                />
                <Bar dataKey="usage" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Patient Engagement and Therapist Performance */}
        <div className="grid lg:grid-cols-2 gap-4 mb-4">
          {/* Patient Engagement Levels */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className={`p-4 rounded-xl shadow-lg ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <h3 className={`text-lg font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>
              Patient Engagement Levels
            </h3>
            <div className="space-y-4">
              {patientEngagement.map((level, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: level.color }}
                    ></div>
                    <span className={`font-medium ${
                      theme === 'dark' ? 'text-white' : 'text-gray-800'
                    }`}>
                      {level.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className={`w-32 h-2 rounded-full ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                    }`}>
                      <div
                        className="h-full rounded-full"
                        style={{ 
                          width: `${level.percentage}%`,
                          backgroundColor: level.color
                        }}
                      ></div>
                    </div>
                    <span className={`text-sm font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {level.value} ({level.percentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Real-time Activity Feed */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className={`p-4 rounded-xl shadow-lg ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <h3 className={`text-lg font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>
              Real-time Platform Activity
            </h3>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {[
                { icon: Heart, text: 'New mood entry logged', time: '2 min ago', color: 'text-pink-500' },
                { icon: Brain, text: 'CBT session completed', time: '5 min ago', color: 'text-purple-500' },
                { icon: Calendar, text: 'Therapy session booked', time: '8 min ago', color: 'text-blue-500' },
                { icon: Target, text: 'Stress management session', time: '12 min ago', color: 'text-orange-500' },
                { icon: MessageCircle, text: 'AI assistant conversation', time: '15 min ago', color: 'text-green-500' },
                { icon: Star, text: 'Gratitude journal entry', time: '18 min ago', color: 'text-yellow-500' }
              ].map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0 + index * 0.1 }}
                  className={`flex items-center space-x-3 p-2 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
                  }`}
                >
                  <activity.icon className={`w-4 h-4 ${activity.color}`} />
                  <div className="flex-1">
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {activity.text}
                    </p>
                    <p className={`text-xs ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      {activity.time}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Top Performing Therapists */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className={`p-4 rounded-xl shadow-lg ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>
            Top Performing Therapists
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <tr>
                  <th className={`px-4 py-3 text-left text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Therapist
                  </th>
                  <th className={`px-4 py-3 text-left text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Sessions
                  </th>
                  <th className={`px-4 py-3 text-left text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Patients
                  </th>
                  <th className={`px-4 py-3 text-left text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Rating
                  </th>
                  <th className={`px-4 py-3 text-left text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {therapistPerformance.slice(0, 5).map((therapist, index) => (
                  <tr key={index} className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors`}>
                    <td className={`px-4 py-3 font-medium ${
                      theme === 'dark' ? 'text-white' : 'text-gray-800'
                    }`}>
                      {therapist.name}
                    </td>
                    <td className={`px-4 py-3 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {therapist.sessions}
                    </td>
                    <td className={`px-4 py-3 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {therapist.patients}
                    </td>
                    <td className={`px-4 py-3 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <div className="flex items-center space-x-1">
                        <span>{therapist.rating.toFixed(1)}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < Math.floor(therapist.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className={`px-4 py-3 font-medium text-green-600`}>
                      ${therapist.revenue.toLocaleString()}
                    </td>
                  </tr>
                ))}
                {therapistPerformance.length === 0 && (
                  <tr>
                    <td colSpan={5} className={`px-4 py-8 text-center ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      No therapist performance data available yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Detailed Metrics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="grid md:grid-cols-3 gap-4"
        >
          {/* Therapy Module Engagement */}
          <div className={`p-4 rounded-xl shadow-lg ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h4 className={`text-lg font-semibold mb-3 ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>
              Module Engagement
            </h4>
            <div className="space-y-2">
              {therapyModuleUsage.slice(0, 5).map((module, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className={`text-sm ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {module.name}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-16 h-2 rounded-full ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                    }`}>
                      <div
                        className="h-full rounded-full"
                        style={{ 
                          width: `${Math.min(100, (module.usage / Math.max(...therapyModuleUsage.map(m => m.usage))) * 100)}%`,
                          backgroundColor: module.color
                        }}
                      ></div>
                    </div>
                    <span className={`text-sm font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {module.usage}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Platform Health */}
          <div className={`p-4 rounded-xl shadow-lg ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h4 className={`text-lg font-semibold mb-3 ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>
              Platform Health
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  System Uptime
                </span>
                <span className="text-sm font-medium text-green-500">99.9%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Response Time
                </span>
                <span className="text-sm font-medium text-blue-500">< 200ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Error Rate
                </span>
                <span className="text-sm font-medium text-green-500">0.1%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  User Satisfaction
                </span>
                <span className="text-sm font-medium text-purple-500">4.8/5</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className={`p-4 rounded-xl shadow-lg ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h4 className={`text-lg font-semibold mb-3 ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>
              Quick Actions
            </h4>
            <div className="space-y-2">
              <button
                onClick={() => exportData('csv')}
                className="w-full py-2 px-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 text-sm font-medium"
              >
                Export CSV Report
              </button>
              <button
                onClick={() => exportData('json')}
                className="w-full py-2 px-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 text-sm font-medium"
              >
                Export JSON Data
              </button>
              <button
                onClick={() => {
                  loadAnalyticsData();
                  toast.success('Analytics data refreshed');
                }}
                className="w-full py-2 px-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition-all duration-300 text-sm font-medium"
              >
                Refresh Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;