'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft,
  Github,
  ExternalLink,
  Search,
  Calendar,
  Code,
  Layers,
  Zap,
  Globe,
  Database,
  Server
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  stack: string[];
  github?: string;
  live?: string;
  image?: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTech, setSelectedTech] = useState<string>('all');

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [projects, searchTerm, selectedTech]);

  const loadProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProjects = () => {
    if (!projects || projects.length === 0) {
      setFilteredProjects([]);
      return;
    }

    let filtered = projects;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.stack && Array.isArray(project.stack) && 
         project.stack.some(tech => 
          tech && tech.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      );
    }

    // Technology filter
    if (selectedTech !== 'all') {
      filtered = filtered.filter(project =>
        project.stack && 
        Array.isArray(project.stack) &&
        project.stack.some(tech => 
          tech && tech.toLowerCase() === selectedTech.toLowerCase()
        )
      );
    }

    setFilteredProjects(filtered);
  };

  const getAllTechnologies = () => {
    if (!projects || projects.length === 0) return [];
    
    const allTechs = projects
      .filter(project => project.stack && Array.isArray(project.stack))
      .flatMap(project => project.stack)
      .filter(tech => tech && typeof tech === 'string' && tech.trim() !== '');
    
    return [...new Set(allTechs)].sort();
  };

  const getTechIcon = (tech: string) => {
    const techLower = tech.toLowerCase();
    if (['react', 'next.js', 'vue', 'angular'].includes(techLower)) return <Layers className="w-4 h-4" />;
    if (['node.js', 'express', 'fastapi'].includes(techLower)) return <Server className="w-4 h-4" />;
    if (['postgresql', 'mongodb', 'mysql'].includes(techLower)) return <Database className="w-4 h-4" />;
    if (['javascript', 'typescript', 'python'].includes(techLower)) return <Code className="w-4 h-4" />;
    return <Zap className="w-4 h-4" />;
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
            <Code className="w-8 h-8 text-purple-400" />
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
              <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      <div className="relative z-10 pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent mb-6">
              My Projects
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              A collection of projects I've built, from web applications to open-source contributions
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search projects..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                    />
                  </div>
                </div>

                {/* Technology Filter */}
                <div className="lg:w-64">
                  <select
                    value={selectedTech}
                    onChange={(e) => setSelectedTech(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                  >
                    <option value="all">All Technologies</option>
                    {getAllTechnologies().map((tech, index) => (
                      <option key={`${tech}-${index}`} value={tech} className="bg-gray-800">
                        {tech}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
                <span>
                  Showing {filteredProjects.length} of {projects.length} projects
                </span>
                {(searchTerm || selectedTech !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedTech('all');
                    }}
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Projects Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <Layers className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-bold text-white">All Projects</h2>
            </div>

            {filteredProjects.length === 0 ? (
              <div className="text-center py-16">
                <Code className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">No projects found</h3>
                <p className="text-gray-400">
                  {searchTerm || selectedTech !== 'all'
                    ? 'Try adjusting your filters to see more projects.'
                    : 'Projects will appear here once they are added.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    className="group bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20 hover:border-purple-500/50 transition-all duration-300"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                     {/* projects images */}
                    <div className="relative h-40 bg-gradient-to-r from-purple-500/20 to-pink-500/20 overflow-hidden">
                      {project.image ? (
                        <img
                          src={project.image}
                          alt={project.title}
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Code className="w-12 h-12 text-purple-400/50" />
                        </div>
                      )}
                    </div>

                    {/* Project Content */}
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                        {project.description}
                      </p>

                      {/* Technologies */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {project.stack && Array.isArray(project.stack) &&
                         project.stack.slice(0, 3).map((tech, index) =>
                          tech ? (
                            <span
                              key={`${tech}-${index}`}
                              className="px-2 py-1 bg-white/5 rounded-full text-xs text-gray-300 border border-white/10"
                            >
                              {tech}
                            </span>
                          ) : null
                        )}
                        {project.stack && project.stack.length > 3 && (
                          <span className="px-2 py-1 bg-white/5 rounded-full text-xs text-gray-400 border border-white/10">
                            +{project.stack.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {project.github && (
                            <motion.a
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 hover:text-white transition-all"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Github className="w-4 h-4" />
                            </motion.a>
                          )}
                          {project.live && (
                            <motion.a
                              href={project.live}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-all"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </motion.a>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Call to Action */}
          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <h3 className="text-2xl font-bold text-white mb-4">
              Interested in Working Together?
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              I'm always excited to take on new challenges and create amazing projects. 
              Let's discuss your ideas!
            </p>
            <Link href="/contact">
              <motion.button
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start a Project
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}