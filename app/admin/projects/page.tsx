"use client"
import { useAdminAuth } from "@/lib/useAdminAuth"
import { supabase } from "@/lib/supabaseClient"
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Edit, Trash2, ExternalLink, Github, Code, X, Loader2, Image, Upload } from "lucide-react"

export default function ProjectsPage() {
    const {session,loading} = useAdminAuth();
    const [projects, setProjects] = useState<any[]>([]);
    const [saving, setSaving] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [editingProject, setEditingProject] = useState<any>(null);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    
    const [form, setForm] = useState({
        title: "",
        description: "",
        stack: "",
        github: "",
        live: "",
        image: ""
    });

useEffect(() => {
    if(!session) {
        return;
    }
    const loadProjects = async () => {
     
        const {data, error} = await supabase
            .from('projects')
            .select('*')
        if(data){
            setProjects(data)
        } else if (error){
            // Handle RLS errors specifically
            if (error.message.includes('RLS')) {
                setLoadError('Access denied. Please make sure you are logged in as an admin.');
            } else {
                setLoadError(error.message)
            }
        }
    }
    loadProjects();
}, [session])

    const handleAddProject = () => {
        setForm({
            title: "",
            description: "",
            stack: "",
            github: "",
            live: "",
            image: ""
        });
        setEditingProject(null);
        setShowModal(true);
    };

    const handleEditProject = (project: any) => {
        setForm({
            title: project.title || "",
            description: project.description || "",
            stack: Array.isArray(project.stack) ? project.stack.join(", ") : project.stack || "",
            github: project.github || "",
            live: project.live || "",
            image: project.image || ""
        });
        setEditingProject(project);
        setShowModal(true);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setLoadError('Please select an image file');
            return;
        }

        setUploading(true);
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `project-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('project-images')
            .upload(filePath, file);

        if (uploadError) {
            setLoadError(uploadError.message);
            setUploading(false);
            return;
        }

        const { data: { publicUrl } } = supabase.storage
            .from('project-images')
            .getPublicUrl(filePath);

        setForm(prev => ({ ...prev, image: publicUrl }));
        setUploading(false);
    };

    const handleSaveProject = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setLoadError(null);

        const projectData = {
            title: form.title,
            description: form.description,
            stack: form.stack.split(',').map((tech: string) => tech.trim()),
            github: form.github,
            live: form.live,
            image: form.image
        };

        let result;
        if (editingProject) {
            result = await supabase
                .from('projects')
                .update(projectData)
                .eq('id', editingProject.id);
        } else {
            result = await supabase
                .from('projects')
                .insert(projectData);
        }

        setSaving(false);
        if (result.error) {
            setLoadError(result.error.message);
        } else {
            setSuccessMessage(editingProject ? "Project updated successfully!" : "Project added successfully!");
            setShowModal(false);
            // Reload projects
            const {data} = await supabase.from('projects').select('*')
            if(data) setProjects(data);
            setTimeout(() => setSuccessMessage(null), 3000);
        }
    };

    const handleDeleteProject = async (projectId: string) => {
        if (!confirm("Are you sure you want to delete this project?")) return;
        
        setDeleting(projectId);
        const result = await supabase
            .from('projects')
            .delete()
            .eq('id', projectId);

        setDeleting(null);
        if (result.error) {
            setLoadError(result.error.message);
        } else {
            setSuccessMessage("Project deleted successfully!");
            setProjects(projects.filter(p => p.id !== projectId));
            setTimeout(() => setSuccessMessage(null), 3000);
        }
    };

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <motion.div
                    className="text-white text-xl"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                    <Loader2 className="w-8 h-8" />
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
            {/* Background decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    className="text-center mb-8"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                        Projects Dashboard
                    </h1>
                    <p className="text-gray-300 text-lg mb-8">
                        Manage your portfolio projects with ease
                    </p>
                    
                    <motion.button
                        onClick={handleAddProject}
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Add New Project
                    </motion.button>
                </motion.div>

                {/* Success/Error Messages */}
                <AnimatePresence>
                    {(successMessage || loadError) && (
                        <motion.div
                            className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
                                successMessage ? 'bg-green-500/90' : 'bg-red-500/90'
                            } backdrop-blur-sm text-white`}
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 100 }}
                        >
                            {successMessage || loadError}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Projects Grid */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <AnimatePresence>
                        {projects.map((project, index) => (
                            <motion.div
                                key={project.id}
                                className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20 hover:border-purple-500/50 transition-all duration-300 group"
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ y: -5, scale: 1.02 }}
                            >
                                {/* Project Image */}
                                <div className="relative h-48 bg-gray-800 overflow-hidden">
                                    {project.image ? (
                                        <img 
                                            src={project.image} 
                                            alt={project.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-600/20 to-pink-600/20">
                                            <Image className="w-16 h-16 text-gray-500" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                </div>

                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                                        {project.title}
                                    </h3>
                                    
                                    <p className="text-gray-300 mb-4 line-clamp-3">
                                        {project.description}
                                    </p>

                                    {/* Tech Stack */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {Array.isArray(project.stack) ? 
                                            project.stack.map((tech: string, i: number) => (
                                                <span
                                                    key={i}
                                                    className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs"
                                                >
                                                    {tech}
                                                </span>
                                            )) : 
                                            <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                                                {project.stack}
                                            </span>
                                        }
                                    </div>

                                    {/* Links */}
                                    <div className="flex gap-3 mb-4">
                                        {project.github && (
                                            <a
                                                href={project.github}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center text-gray-300 hover:text-white transition-colors"
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
                                                className="flex items-center text-gray-300 hover:text-white transition-colors"
                                            >
                                                <ExternalLink className="w-4 h-4 mr-1" />
                                                Live
                                            </a>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        <motion.button
                                            onClick={() => handleEditProject(project)}
                                            className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Edit className="w-4 h-4 mr-1" />
                                            Edit
                                        </motion.button>
                                        
                                        <motion.button
                                            onClick={() => handleDeleteProject(project.id)}
                                            disabled={deleting === project.id}
                                            className="flex-1 flex items-center justify-center px-3 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors disabled:opacity-50"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            {deleting === project.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <>
                                                    <Trash2 className="w-4 h-4 mr-1" />
                                                    Delete
                                                </>
                                            )}
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Empty State */}
                {projects.length === 0 && !loadError && (
                    <motion.div
                        className="text-center py-16"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <Code className="w-24 h-24 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-gray-400 mb-2">No Projects Yet</h3>
                        <p className="text-gray-500 mb-6">Start building your portfolio by adding your first project</p>
                        <motion.button
                            onClick={handleAddProject}
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Add Your First Project
                        </motion.button>
                    </motion.div>
                )}

                {/* Modal */}
                <AnimatePresence>
                    {showModal && (
                        <motion.div
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                className="bg-slate-800/90 backdrop-blur-lg rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/20"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-white">
                                        {editingProject ? 'Edit Project' : 'Add New Project'}
                                    </h2>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <form onSubmit={handleSaveProject} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-200 mb-2">
                                            Project Title *
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            required
                                            value={form.title}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                            placeholder="Enter project title"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-200 mb-2">
                                            Description *
                                        </label>
                                        <textarea
                                            name="description"
                                            required
                                            rows={4}
                                            value={form.description}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
                                            placeholder="Describe your project..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-200 mb-2">
                                            Tech Stack (comma-separated)
                                        </label>
                                        <input
                                            type="text"
                                            name="stack"
                                            value={form.stack}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                            placeholder="React, TypeScript, Next.js"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-200 mb-2">
                                            Project Image
                                        </label>
                                        <div className="space-y-3">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                                id="image-upload"
                                            />
                                            <label
                                                htmlFor="image-upload"
                                                className="flex items-center justify-center w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors cursor-pointer"
                                            >
                                                {uploading ? (
                                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                                ) : (
                                                    <Upload className="w-5 h-5 mr-2" />
                                                )}
                                                {uploading ? 'Uploading...' : 'Upload Image'}
                                            </label>
                                            
                                            <input
                                                type="url"
                                                name="image"
                                                value={form.image}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                                placeholder="Or paste image URL"
                                            />
                                            
                                            {form.image && (
                                                <div className="mt-2">
                                                    <img 
                                                        src={form.image} 
                                                        alt="Preview" 
                                                        className="w-full h-32 object-cover rounded-lg"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-200 mb-2">
                                                GitHub URL
                                            </label>
                                            <input
                                                type="url"
                                                name="github"
                                                value={form.github}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                                placeholder="https://github.com/..."
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-200 mb-2">
                                                Live URL
                                            </label>
                                            <input
                                                type="url"
                                                name="live"
                                                value={form.live}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                                placeholder="https://yourproject.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                            className="flex-1 px-4 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center"
                                        >
                                            {saving ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                editingProject ? 'Update Project' : 'Add Project'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}