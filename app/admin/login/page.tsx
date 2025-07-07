'use client';

import { useState } from "react";
import type React from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLogin()
{
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error , setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e : React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const {error} = await supabase.auth.signInWithPassword({email, password});

        if(error){
            setError(error.message);
            setLoading(false);
        }
        else router.push('/admin')
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <motion.div 
                className="max-w-md w-full space-y-8 p-8"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <motion.div 
                    className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                >
                    <motion.div 
                        className="text-center"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <h2 className="text-3xl font-bold text-white mb-2">Admin Login</h2>
                        <p className="text-gray-300 mb-8">Please sign in to your account</p>
                    </motion.div>
                    
                    <motion.form 
                        onSubmit={handleLogin} 
                        className="space-y-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                    >
                        <AnimatePresence>
                            {error && (
                                <motion.div 
                                    className="bg-red-500/20 border border-red-500/50 text-red-100 px-4 py-3 rounded-lg"
                                    initial={{ opacity: 0, scale: 0.9, y: -10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>
                        
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.7 }}
                        >
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                Email Address
                            </label>
                            <motion.input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                placeholder="Enter your email"
                                whileFocus={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                            />
                        </motion.div>
                        
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.8 }}
                        >
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                Password
                            </label>
                            <motion.input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                placeholder="Enter your password"
                                whileFocus={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                            />
                        </motion.div>
                        
                        <motion.button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.9 }}
                            whileHover={{ scale: loading ? 1 : 1.05 }}
                            whileTap={{ scale: loading ? 1 : 0.95 }}
                        >
                            <AnimatePresence mode="wait">
                                {loading ? (
                                    <motion.div 
                                        className="flex items-center justify-center"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <motion.svg 
                                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            fill="none" 
                                            viewBox="0 0 24 24"
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        >
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </motion.svg>
                                        Signing in...
                                    </motion.div>
                                ) : (
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        Sign In
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    </motion.form>
                    
                    <motion.div 
                        className="mt-6 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 1.0 }}
                    >
                        <p className="text-gray-400 text-sm">
                            Secure admin access only
                        </p>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    )
}