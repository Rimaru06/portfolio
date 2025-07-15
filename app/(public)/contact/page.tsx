'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  ArrowLeft,
  Github,
  Twitter,
  Linkedin,
  MessageCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  MessageSquare
} from 'lucide-react';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const [form, setForm] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic validation
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      const { error: dbError } = await supabase
        .from('contacts')
        .insert([{
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
          subject: form.subject.trim() || 'No subject',
          read: false,
          replied: false,
          created_at: new Date().toISOString()
        }]);

      if (dbError) throw dbError;

      setSuccess(true);
      setForm({ name: '', email: '', subject: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
            <Link href="/" className="flex items-center text-gray-300 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
            
            <div className="flex gap-6">
              <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                About
              </Link>
              <Link href="/projects" className="text-gray-300 hover:text-white transition-colors">
                Projects
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
              Get In Touch
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Have a project in mind? Let's discuss how we can work together to bring your ideas to life.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <motion.div
              className="lg:col-span-1 space-y-6"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Contact Cards */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-4">
                  <MessageCircle className="w-6 h-6 text-purple-400" />
                  <h3 className="text-xl font-bold text-white">Let's Talk</h3>
                </div>
                <p className="text-gray-300 mb-6">
                  I'm always excited to discuss new opportunities and interesting projects. 
                  Drop me a message and I'll get back to you as soon as possible.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-300">
                    <Mail className="w-5 h-5 text-purple-400" />
                    <span>shiva12ch88@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <MapPin className="w-5 h-5 text-purple-400" />
                    <span>Available Worldwide</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <Clock className="w-5 h-5 text-purple-400" />
                    <span>Usually responds within 24 hours</span>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4">Connect With Me</h3>
                <div className="space-y-3">
                  <motion.a
                    href="https://github.com/Rimaru06/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-white/5 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all group"
                    whileHover={{ x: 5 }}
                  >
                    <Github className="w-5 h-5 text-purple-400" />
                    <span>GitHub</span>
                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowLeft className="w-4 h-4 rotate-180" />
                    </div>
                  </motion.a>
                  
                  <motion.a
                    href="https://x.com/chahar_shiva?s=21"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-white/5 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all group"
                    whileHover={{ x: 5 }}
                  >
                    <Twitter className="w-5 h-5 text-purple-400" />
                    <span>Twitter</span>
                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowLeft className="w-4 h-4 rotate-180" />
                    </div>
                  </motion.a>
                  
                  <motion.a
                    href="linkedin.com/in/shiva-chahar-573287257"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-white/5 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all group"
                    whileHover={{ x: 5 }}
                  >
                    <Linkedin className="w-5 h-5 text-purple-400" />
                    <span>LinkedIn</span>
                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowLeft className="w-4 h-4 rotate-180" />
                    </div>
                  </motion.a>
                </div>
              </div>

              {/* Quick Info */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4">What I Can Help With</h3>
                <div className="space-y-2 text-sm">
                  <div className="text-gray-300">• Web Application Development</div>
                  <div className="text-gray-300">• Frontend & Backend Solutions</div>
                  <div className="text-gray-300">• API Development & Integration</div>
                  <div className="text-gray-300">• Code Review & Consulting</div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <div className="flex items-center gap-3 mb-6">
                  <MessageSquare className="w-6 h-6 text-purple-400" />
                  <h3 className="text-2xl font-bold text-white">Send Me a Message</h3>
                </div>

                {success && (
                  <motion.div
                    className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center gap-3"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="text-green-300 font-semibold">Message sent successfully!</p>
                      <p className="text-green-400 text-sm">I'll get back to you as soon as possible.</p>
                    </div>
                  </motion.div>
                )}

                {error && (
                  <motion.div
                    className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center gap-3"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <p className="text-red-300">{error}</p>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                        Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={form.name}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                          placeholder="Your full name"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                        Email *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={form.email}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={form.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                      placeholder="What's this about?"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={form.message}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all resize-none"
                      placeholder="Tell me about your project, ideas, or just say hello!"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                  >
                    {loading ? (
                      <>
                        <motion.div
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </motion.button>
                </form>

                <div className="mt-6 pt-6 border-t border-white/10">
                  <p className="text-gray-400 text-sm text-center">
                    Your information is secure and will only be used to respond to your inquiry.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* FAQ Section */}
          <motion.div
            className="mt-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h3 className="font-semibold text-white mb-2">How quickly do you respond?</h3>
                <p className="text-gray-300 text-sm">I typically respond to all inquiries within 24 hours during business days.</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h3 className="font-semibold text-white mb-2">What types of projects do you work on?</h3>
                <p className="text-gray-300 text-sm">I specialize in web applications, from simple websites to complex full-stack solutions.</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h3 className="font-semibold text-white mb-2">Do you work with startups?</h3>
                <p className="text-gray-300 text-sm">Yes! I love working with startups and understand the unique challenges they face.</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h3 className="font-semibold text-white mb-2">Can you help with existing projects?</h3>
                <p className="text-gray-300 text-sm">Absolutely! I can help with debugging, optimization, or adding new features to existing codebases.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}