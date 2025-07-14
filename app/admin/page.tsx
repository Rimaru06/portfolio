'use client';

import { useAdminAuth } from '@/lib/useAdminAuth';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  User, 
  FolderOpen, 
  Settings, 
  LogOut, 
  BarChart3, 
  Activity,
  Eye,
  GitBranch,
  Plus,
  Mail,
  MessageSquare
} from 'lucide-react';

interface Stats {
  totalProjects: number;
  profileExists: boolean;
  totalContacts: number;
  unreadContacts: number;
}

export default function AdminHome() {
  const { session, loading } = useAdminAuth();
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    totalProjects: 0,
    profileExists: false,
    totalContacts: 0,
    unreadContacts: 0
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (session) {
      loadDashboardStats();
    }
  }, [session]);

  const loadDashboardStats = async () => {
    try {
      // Get projects count
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('id');

      // Get profile existence
      const { data: profile, error: profileError } = await supabase
        .from('profile')
        .select('id')
        .limit(1);

      // Get contacts count
      const { data: contacts, error: contactsError } = await supabase
        .from('contacts')
        .select('id, read');

      // Get unread contacts count
      const { data: unreadContacts, error: unreadError } = await supabase
        .from('contacts')
        .select('id')
        .eq('read', false);

      setStats({
        totalProjects: projects?.length || 0,
        profileExists: !!(profile && profile.length > 0),
        totalContacts: contacts?.length || 0,
        unreadContacts: unreadContacts?.length || 0
      });

      setLoadingStats(false);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      setLoadingStats(false);
    }
  };

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      await supabase.auth.signOut();
      router.push("admin/login")
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          className="text-white text-xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Activity className="w-8 h-8" />
        </motion.div>
      </div>
    );
  }

  if (!session) return null;

  const quickActions = [
    {
      title: 'Manage Profile',
      description: 'Update your personal information and bio',
      icon: User,
      href: '/admin/profile',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Manage Projects',
      description: 'Add, edit, or delete your projects',
      icon: FolderOpen,
      href: '/admin/projects',
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Manage Contacts',
      description: 'View and respond to contact submissions',
      icon: Mail,
      href: '/admin/contacts',
      color: 'from-yellow-500 to-orange-500',
      badge: stats.unreadContacts > 0 ? stats.unreadContacts : null
    },
    {
      title: 'View Portfolio',
      description: 'See your public portfolio website',
      icon: Eye,
      href: '/',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const statsCards = [
    {
      title: 'Total Projects',
      value: stats.totalProjects,
      icon: GitBranch,
      color: 'from-orange-400 to-red-500',
      description: 'Projects in portfolio'
    },
    {
      title: 'Profile Status',
      value: stats.profileExists ? 'Complete' : 'Incomplete',
      icon: User,
      color: stats.profileExists ? 'from-green-400 to-emerald-500' : 'from-yellow-400 to-orange-500',
      description: stats.profileExists ? 'Profile is set up' : 'Complete your profile'
    },
    {
      title: 'Total Contacts',
      value: stats.totalContacts,
      icon: MessageSquare,
      color: 'from-cyan-400 to-blue-500',
      description: 'Contact submissions received'
    },
    {
      title: 'Unread Messages',
      value: stats.unreadContacts,
      icon: Mail,
      color: stats.unreadContacts > 0 ? 'from-red-400 to-pink-500' : 'from-gray-400 to-gray-500',
      description: stats.unreadContacts > 0 ? 'Need your attention' : 'All messages read'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex justify-between items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-300 text-lg">
              Welcome back! Manage your portfolio with ease.
            </p>
            {stats.unreadContacts > 0 && (
              <motion.div
                className="inline-flex items-center mt-2 px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full text-red-300 text-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Mail className="w-3 h-3 mr-1" />
                {stats.unreadContacts} unread message{stats.unreadContacts !== 1 ? 's' : ''}
              </motion.div>
            )}
          </div>
          
          <motion.button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 bg-red-500/20 text-red-300 rounded-xl hover:bg-red-500/30 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </motion.button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                {loadingStats && (
                  <div className="animate-pulse w-4 h-4 bg-gray-400 rounded" />
                )}
              </div>
              <h3 className="text-gray-300 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-white text-2xl font-bold mb-2">
                {loadingStats ? '...' : stat.value}
              </p>
              <p className="text-gray-400 text-sm">{stat.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link key={action.title} href={action.href}>
                <motion.div
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 cursor-pointer group relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  {action.badge && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                      {action.badge > 99 ? '99+' : action.badge}
                    </div>
                  )}
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${action.color} mb-4`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white text-xl font-semibold mb-2 group-hover:text-purple-300 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-gray-300 group-hover:text-gray-200 transition-colors">
                    {action.description}
                  </p>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Portfolio Overview */}
        <motion.div
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="flex items-center mb-6">
            <BarChart3 className="w-6 h-6 text-purple-400 mr-3" />
            <h2 className="text-2xl font-bold text-white">Portfolio Overview</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-white font-semibold mb-3">Profile Completion</h3>
              <div className="bg-gray-700 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
                  initial={{ width: 0 }}
                  animate={{ width: stats.profileExists ? '100%' : '20%' }}
                  transition={{ duration: 1, delay: 0.8 }}
                />
              </div>
              <p className="text-gray-300 text-sm mt-2">
                {stats.profileExists ? 'Profile is complete' : 'Complete your profile to get started'}
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-3">Projects Progress</h3>
              <div className="bg-gray-700 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-400 to-pink-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((stats.totalProjects / 5) * 100, 100)}%` }}
                  transition={{ duration: 1, delay: 1 }}
                />
              </div>
              <p className="text-gray-300 text-sm mt-2">
                {stats.totalProjects} of 5 recommended projects added
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-3">Contact Activity</h3>
              <div className="bg-gray-700 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
                  initial={{ width: 0 }}
                  animate={{ width: stats.totalContacts > 0 ? `${Math.min(100 - (stats.unreadContacts / stats.totalContacts * 100), 100)}%` : '0%' }}
                  transition={{ duration: 1, delay: 1.2 }}
                />
              </div>
              <p className="text-gray-300 text-sm mt-2">
                {stats.totalContacts > 0 
                  ? `${stats.totalContacts - stats.unreadContacts} of ${stats.totalContacts} contacts processed`
                  : 'No contacts yet'
                }
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mt-6">
            {!stats.profileExists && (
              <Link href="/admin/profile">
                <motion.button
                  className="flex items-center px-4 py-2 bg-green-500/20 text-green-300 rounded-xl hover:bg-green-500/30 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <User className="w-4 h-4 mr-2" />
                  Complete Profile
                </motion.button>
              </Link>
            )}
            
            <Link href="/admin/projects">
              <motion.button
                className="flex items-center px-4 py-2 bg-purple-500/20 text-purple-300 rounded-xl hover:bg-purple-500/30 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </motion.button>
            </Link>

            {stats.unreadContacts > 0 && (
              <Link href="/admin/contacts">
                <motion.button
                  className="flex items-center px-4 py-2 bg-red-500/20 text-red-300 rounded-xl hover:bg-red-500/30 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{ 
                    boxShadow: ['0 0 0 0 rgba(239, 68, 68, 0.4)', '0 0 0 10px rgba(239, 68, 68, 0)', '0 0 0 0 rgba(239, 68, 68, 0)'],
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Check Messages ({stats.unreadContacts})
                </motion.button>
              </Link>
            )}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="text-center mt-8 text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p>Portfolio Admin Panel • Manage your digital presence</p>
        </motion.div>
      </div>
    </div>
  );
}
