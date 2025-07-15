'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { 
  User, 
  MapPin, 
  Code, 
  Coffee, 
  Laptop,
  Github,
  Twitter,
  Mail,
  Download,
  ArrowLeft,
  Sparkles,
  Target,
  Heart,
  Zap
} from 'lucide-react';

interface Profile {
  id: string;
  name: string;
  bio: string;
  location: string;
  skills: string[];
  socials: {
    github?: string;
    twitter?: string;
    email?: string;
  };
}

export default function AboutPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data } = await supabase
        .from('profile')
        .select('*')
        .limit(1);
      
      if (data && data.length > 0) {
        setProfile(data[0]);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-20 h-20 border-4 border-purple-400/30 border-t-purple-400 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-0 w-20 h-20 border-4 border-pink-400/30 border-b-pink-400 rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <User className="w-8 h-8 text-purple-400" />
          </div>
        </motion.div>
      </div>
    );
  }

  const skillCategories = profile?.skills ? {
    frontend: profile.skills.filter(skill => 
      ['React', 'Next.js', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Tailwind', 'Vue', 'Angular', 'Svelte'].includes(skill)
    ),
    backend: profile.skills.filter(skill => 
      ['Node.js', 'Python', 'Java', 'PHP', 'Express', 'Django', 'Spring', 'Laravel', 'FastAPI', 'Go'].includes(skill)
    ),
    database: profile.skills.filter(skill => 
      ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Supabase', 'Firebase', 'SQLite'].includes(skill)
    ),
    tools: profile.skills.filter(skill => 
      ['Git', 'Docker', 'AWS', 'Linux', 'Figma', 'VS Code', 'Vercel', 'Netlify'].includes(skill)
    )
  } : { frontend: [], backend: [], database: [], tools: [] };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <motion.nav 
        className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-lg border-b border-white/10"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center text-gray-300 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
            
            <div className="flex gap-6">
              <Link href="/projects" className="text-gray-300 hover:text-white transition-colors">
                Projects
              </Link>
              <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      <div className="relative z-10 pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent mb-6">
              About Me
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Get to know the person behind the code
            </p>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Profile Card */}
            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 sticky top-32">
                {/* Profile Image */}
                <div className="text-center mb-6">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 p-1">
                    <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center">
                      <User className="w-16 h-16 text-gray-400" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {profile?.name || 'Your Name'}
                  </h2>
                  {profile?.location && (
                    <div className="flex items-center justify-center gap-2 text-gray-400 mb-4">
                      <MapPin className="w-4 h-4" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                </div>

                {/* Quick Info */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 text-gray-300">
                    <Code className="w-5 h-5 text-purple-400" />
                    <span>Full-Stack Developer</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <Coffee className="w-5 h-5 text-purple-400" />
                    <span>Coffee Enthusiast</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <Laptop className="w-5 h-5 text-purple-400" />
                    <span>Remote Worker</span>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex justify-center gap-4 mb-6">
                  {profile?.socials?.github && (
                    <motion.a
                      href={profile.socials.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-white/5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Github className="w-5 h-5" />
                    </motion.a>
                  )}
                  {profile?.socials?.twitter && (
                    <motion.a
                      href={profile.socials.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-white/5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Twitter className="w-5 h-5" />
                    </motion.a>
                  )}
                  <Link href="/contact">
                    <motion.div
                      className="p-3 bg-white/5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Mail className="w-5 h-5" />
                    </motion.div>
                  </Link>
                </div>

                {/* Resume Download */}
                <motion.button
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Download className="w-4 h-4" />
                  Download Resume
                </motion.button>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              className="lg:col-span-2 space-y-8"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {/* Bio Section */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <div className="flex items-center gap-3 mb-6">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                  <h3 className="text-2xl font-bold text-white">My Story</h3>
                </div>
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 text-lg leading-relaxed mb-4">
                    {profile?.bio || "I'm a passionate full-stack developer with a love for creating beautiful, functional web applications. My journey in tech started several years ago, and I've been constantly learning and evolving ever since."}
                  </p>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or enjoying a good cup of coffee while reading about the latest industry trends.
                  </p>
                </div>
              </div>

              {/* What I Do */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <div className="flex items-center gap-3 mb-6">
                  <Target className="w-6 h-6 text-purple-400" />
                  <h3 className="text-2xl font-bold text-white">What I Do</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Zap className="w-5 h-5 text-yellow-400 mt-1" />
                      <div>
                        <h4 className="font-semibold text-white mb-1">Frontend Development</h4>
                        <p className="text-gray-300 text-sm">Creating responsive, interactive user interfaces with modern frameworks like React and Next.js</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Zap className="w-5 h-5 text-blue-400 mt-1" />
                      <div>
                        <h4 className="font-semibold text-white mb-1">Backend Development</h4>
                        <p className="text-gray-300 text-sm">Building robust APIs and server-side applications with Node.js and modern frameworks</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Zap className="w-5 h-5 text-green-400 mt-1" />
                      <div>
                        <h4 className="font-semibold text-white mb-1">Database Design</h4>
                        <p className="text-gray-300 text-sm">Designing efficient database schemas and optimizing queries for performance</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Zap className="w-5 h-5 text-pink-400 mt-1" />
                      <div>
                        <h4 className="font-semibold text-white mb-1">Full-Stack Solutions</h4>
                        <p className="text-gray-300 text-sm">End-to-end web application development from concept to deployment</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Skills Section */}
          {profile?.skills && profile.skills.length > 0 && (
            <motion.div
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-16"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-8">
                <Code className="w-6 h-6 text-purple-400" />
                <h3 className="text-2xl font-bold text-white">Skills & Technologies</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {Object.entries(skillCategories).map(([category, skills]) => (
                  skills.length > 0 && (
                    <div key={category}>
                      <h4 className="font-semibold text-white mb-4 capitalize">{category}</h4>
                      <div className="space-y-2">
                        {skills.map((skill, index) => (
                          <motion.div
                            key={skill}
                            className="px-3 py-2 bg-white/5 rounded-lg text-gray-300 text-sm border border-white/10"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                            whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', x: 5 }}
                          >
                            {skill}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )
                ))}
                
                {/* All skills if no categories match */}
                {Object.values(skillCategories).every(cat => cat.length === 0) && (
                  <div className="col-span-full">
                    <div className="flex flex-wrap gap-3">
                      {profile.skills.map((skill, index) => (
                        <motion.span
                          key={skill}
                          className="px-4 py-2 bg-white/10 backdrop-blur-lg rounded-full text-sm text-gray-300 border border-white/20"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                          whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Personal Interests */}
          <motion.div
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Heart className="w-6 h-6 text-purple-400" />
              <h3 className="text-2xl font-bold text-white">When I'm Not Coding</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Coffee className="w-8 h-8 text-purple-400" />
                </div>
                <h4 className="font-semibold text-white mb-2">Coffee & Learning</h4>
                <p className="text-gray-300 text-sm">Exploring new brewing methods while reading about the latest tech trends</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Code className="w-8 h-8 text-purple-400" />
                </div>
                <h4 className="font-semibold text-white mb-2">Open Source</h4>
                <p className="text-gray-300 text-sm">Contributing to open-source projects and building tools for the community</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Laptop className="w-8 h-8 text-purple-400" />
                </div>
                <h4 className="font-semibold text-white mb-2">Side Projects</h4>
                <p className="text-gray-300 text-sm">Always working on personal projects to explore new technologies</p>
              </div>
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <h3 className="text-2xl font-bold text-white mb-4">
              Let's Work Together
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              I'm always excited to take on new challenges and collaborate on interesting projects. 
              Feel free to reach out if you have an idea you'd like to discuss!
            </p>
            <Link href="/contact">
              <motion.button
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail className="w-5 h-5 mr-2 inline" />
                Get In Touch
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}