'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { 
  ArrowRight, 
  User, 
  Briefcase, 
  Mail, 
  Github, 
  Twitter, 
  ExternalLink,
  MapPin,
  Code,
  Download,
  Sparkles,
  ChevronDown
} from 'lucide-react';

interface Profile {
  name: string;
  bio: string;
  location: string;
  skills: string[];
  socials: {
    twitter: string;
    github: string;
  };
}

interface Project {
  id: string;
  title: string;
  description: string;
  stack: string[];
  github: string;
  live: string;
  image: string;
}

export default function Home() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  useEffect(() => {
    loadData();
    
    // Handle scroll indicator
    const handleScroll = () => {
      setShowScrollIndicator(window.scrollY < 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loadData = async () => {
    try {
      // Load profile
      const { data: profileData } = await supabase
        .from('profile')
        .select('*')
        .limit(1);
      
      if (profileData && profileData.length > 0) {
        setProfile(profileData[0]);
      }

      // Load featured projects (limit to 3)
      const { data: projectsData } = await supabase
        .from('projects')
        .select('*')
        .limit(3);
      
      if (projectsData) {
        setProjects(projectsData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
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
            <Sparkles className="w-8 h-8 text-purple-400" />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
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
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {profile?.name || 'Portfolio'}
              </Link>
            </motion.div>
            
            <motion.div 
              className="flex gap-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                About
              </Link>
              <Link href="/projects" className="text-gray-300 hover:text-white transition-colors">
                Projects
              </Link>
              <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                Contact
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {/* Main heading */}
            <motion.h1 
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                {profile?.name || 'Full-Stack Developer'}
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
            >
              {profile?.bio || 'I create beautiful, functional web applications using modern technologies. Passionate about clean code and exceptional user experiences.'}
            </motion.p>

            {/* Location */}
            {profile?.location && (
              <motion.div 
                className="flex items-center justify-center gap-2 text-gray-400 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.2 }}
              >
                <MapPin className="w-4 h-4" />
                <span>{profile.location}</span>
              </motion.div>
            )}

            {/* Skills */}
            {profile?.skills && profile.skills.length > 0 && (
              <motion.div 
                className="flex flex-wrap justify-center gap-3 mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.4 }}
              >
                {profile.skills.slice(0, 6).map((skill, index) => (
                  <motion.span
                    key={skill}
                    className="px-4 py-2 bg-white/10 backdrop-blur-lg rounded-full text-sm text-gray-300 border border-white/20"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 1.6 + index * 0.1 }}
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </motion.div>
            )}

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.8 }}
            >
              <Link href="/projects">
                <motion.button
                  className="flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Briefcase className="w-5 h-5 mr-2" />
                  View My Work
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
              
              <Link href="/contact">
                <motion.button
                  className="flex items-center px-8 py-4 bg-white/10 backdrop-blur-lg text-white rounded-xl font-semibold hover:bg-white/20 transition-colors border border-white/20"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Get In Touch
                </motion.button>
              </Link>
            </motion.div>

            {/* Social Links */}
            <motion.div 
              className="flex justify-center gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 2 }}
            >
              {profile?.socials?.github && (
                <motion.a
                  href={profile.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Github className="w-6 h-6" />
                </motion.a>
              )}
              {profile?.socials?.twitter && (
                <motion.a
                  href={profile.socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Twitter className="w-6 h-6" />
                </motion.a>
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <AnimatePresence>
          {showScrollIndicator && (
            <motion.div
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 2.5 }}
            >
              <motion.div
                className="flex flex-col items-center text-gray-400"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-sm mb-2">Scroll down</span>
                <ChevronDown className="w-5 h-5" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Featured Projects Section */}
      {projects.length > 0 && (
        <section className="relative py-20 px-6">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                Featured Projects
              </h2>
              <p className="text-gray-300 text-lg">
                Here are some of my recent works
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20 hover:border-purple-500/50 transition-all duration-300 group"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10, scale: 1.02 }}
                >
                  {project.image && (
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-300 mb-4 text-sm line-clamp-3">
                      {project.description}
                    </p>
                    
                    {project.stack && project.stack.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.stack.slice(0, 3).map((tech, i) => (
                          <span key={i} className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                            {tech}
                          </span>
                        ))}
                        {project.stack.length > 3 && (
                          <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs">
                            +{project.stack.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                    
                    <div className="flex gap-3">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-gray-300 hover:text-white transition-colors text-sm"
                        >
                          <Github className="w-4 h-4 mr-1" />
                          Code
                        </a>
                      )}
                      {project.live && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-gray-300 hover:text-white transition-colors text-sm"
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Live
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* View All Projects */}
            <motion.div
              className="text-center mt-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <Link href="/projects">
                <motion.button
                  className="px-8 py-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-white rounded-xl font-semibold border border-purple-500/30 hover:bg-gradient-to-r hover:from-purple-600/30 hover:to-pink-600/30 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View All Projects
                  <ArrowRight className="w-5 h-5 ml-2 inline" />
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Call to Action Section */}
      <section className="relative py-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
              Let's Work Together
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              I'm always open to discussing new opportunities and interesting projects. 
              Let's create something amazing together!
            </p>
            
            <Link href="/contact">
              <motion.button
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail className="w-5 h-5 mr-2 inline" />
                Start a Conversation
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10 py-8 px-6">
        <div className="container mx-auto text-center">
          <motion.p 
            className="text-gray-400"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            © 2025 {profile?.name || 'Portfolio'}. Built with Next.js and Supabase.
          </motion.p>
        </div>
      </footer>
    </div>
  );
}
