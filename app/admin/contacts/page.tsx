'use client';

import { useAdminAuth } from '@/lib/useAdminAuth';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { 
  Mail, 
  User, 
  Calendar, 
  Trash2, 
  Eye, 
  X, 
  Loader2, 
  Search,
  Filter,
  MailOpen,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  read: boolean;
  replied: boolean;
}

export default function ContactsPage() {
  const { session, loading } = useAdminAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'unread' | 'read'>('all');
  const [loadError, setLoadError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      loadContacts();
    }
  }, [session]);

  useEffect(() => {
    filterContacts();
  }, [contacts, searchTerm, filterStatus]);

  const loadContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setLoadError(error.message);
      } else {
        setContacts(data || []);
      }
    } catch (error) {
      setLoadError('Failed to load contacts');
    } finally {
      setLoadingContacts(false);
    }
  };

  const filterContacts = () => {
    let filtered = contacts;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus === 'read') {
      filtered = filtered.filter(contact => contact.read);
    } else if (filterStatus === 'unread') {
      filtered = filtered.filter(contact => !contact.read);
    }

    setFilteredContacts(filtered);
  };

  const markAsRead = async (contactId: string) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .update({ read: true })
        .eq('id', contactId);

      if (error) {
        setLoadError(error.message);
      } else {
        setContacts(prev =>
          prev.map(contact =>
            contact.id === contactId ? { ...contact, read: true } : contact
          )
        );
        if (selectedContact && selectedContact.id === contactId) {
          setSelectedContact(prev => prev ? { ...prev, read: true } : null);
        }
      }
    } catch (error) {
      setLoadError('Failed to mark as read');
    }
  };

  const markAsReplied = async (contactId: string) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .update({ replied: true, read: true })
        .eq('id', contactId);

      if (error) {
        setLoadError(error.message);
      } else {
        setContacts(prev =>
          prev.map(contact =>
            contact.id === contactId 
              ? { ...contact, replied: true, read: true } 
              : contact
          )
        );
        if (selectedContact && selectedContact.id === contactId) {
          setSelectedContact(prev => 
            prev ? { ...prev, replied: true, read: true } : null
          );
        }
        setSuccessMessage('Marked as replied!');
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (error) {
      setLoadError('Failed to mark as replied');
    }
  };

  const deleteContact = async (contactId: string) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;

    setDeleting(contactId);
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', contactId);

      if (error) {
        setLoadError(error.message);
      } else {
        setContacts(prev => prev.filter(contact => contact.id !== contactId));
        if (selectedContact && selectedContact.id === contactId) {
          setSelectedContact(null);
        }
        setSuccessMessage('Contact deleted successfully!');
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (error) {
      setLoadError('Failed to delete contact');
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (contact: Contact) => {
    if (contact.replied) return <CheckCircle className="w-4 h-4 text-green-400" />;
    if (contact.read) return <MailOpen className="w-4 h-4 text-blue-400" />;
    return <Mail className="w-4 h-4 text-yellow-400" />;
  };

  const getStatusText = (contact: Contact) => {
    if (contact.replied) return 'Replied';
    if (contact.read) return 'Read';
    return 'New';
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

  const unreadCount = contacts.filter(c => !c.read).length;
  const repliedCount = contacts.filter(c => c.replied).length;

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
            Contact Management
          </h1>
          <p className="text-gray-300 text-lg mb-6">
            Manage contact form submissions and inquiries
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl px-4 py-2 border border-white/20">
              <span className="text-gray-300 text-sm">Total: </span>
              <span className="text-white font-semibold">{contacts.length}</span>
            </div>
            <div className="bg-yellow-500/20 backdrop-blur-lg rounded-xl px-4 py-2 border border-yellow-500/30">
              <span className="text-yellow-200 text-sm">Unread: </span>
              <span className="text-white font-semibold">{unreadCount}</span>
            </div>
            <div className="bg-green-500/20 backdrop-blur-lg rounded-xl px-4 py-2 border border-green-500/30">
              <span className="text-green-200 text-sm">Replied: </span>
              <span className="text-white font-semibold">{repliedCount}</span>
            </div>
          </div>
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

        {/* Search and Filter */}
        <motion.div
          className="mb-6 flex flex-col md:flex-row gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'all' | 'unread' | 'read')}
            className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          >
            <option value="all">All Contacts</option>
            <option value="unread">Unread Only</option>
            <option value="read">Read Only</option>
          </select>
        </motion.div>

        {/* Contacts List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contacts List */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {loadingContacts ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 animate-pulse">
                    <div className="h-4 bg-gray-600 rounded mb-2"></div>
                    <div className="h-3 bg-gray-700 rounded mb-1"></div>
                    <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : filteredContacts.length === 0 ? (
              <div className="text-center py-16">
                <Mail className="w-24 h-24 text-gray-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-400 mb-2">No Contacts Found</h3>
                <p className="text-gray-500">
                  {searchTerm || filterStatus !== 'all' 
                    ? 'Try adjusting your search or filter'
                    : 'No contact submissions yet'
                  }
                </p>
              </div>
            ) : (
              <AnimatePresence>
                {filteredContacts.map((contact, index) => (
                  <motion.div
                    key={contact.id}
                    className={`bg-white/10 backdrop-blur-lg rounded-2xl p-4 border transition-all duration-300 cursor-pointer ${
                      selectedContact?.id === contact.id
                        ? 'border-purple-500/50 bg-white/20'
                        : 'border-white/20 hover:border-white/40'
                    } ${!contact.read ? 'bg-yellow-500/5 border-yellow-500/30' : ''}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    onClick={() => {
                      setSelectedContact(contact);
                      if (!contact.read) markAsRead(contact.id);
                    }}
                    whileHover={{ y: -2 }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(contact)}
                        <h3 className="font-semibold text-white">{contact.name}</h3>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        contact.replied 
                          ? 'bg-green-500/20 text-green-300'
                          : contact.read 
                          ? 'bg-blue-500/20 text-blue-300'
                          : 'bg-yellow-500/20 text-yellow-300'
                      }`}>
                        {getStatusText(contact)}
                      </span>
                    </div>
                    
                    <p className="text-gray-300 text-sm mb-1">{contact.email}</p>
                    <p className="text-white font-medium mb-2">{contact.subject}</p>
                    <p className="text-gray-400 text-sm line-clamp-2 mb-3">{contact.message}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(contact.created_at)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </motion.div>

          {/* Contact Detail */}
          <motion.div
            className="lg:sticky lg:top-6 h-fit"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {selectedContact ? (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-white">Contact Details</h2>
                  <button
                    onClick={() => setSelectedContact(null)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300">Name</label>
                    <p className="text-white font-semibold">{selectedContact.name}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-300">Email</label>
                    <p className="text-white">{selectedContact.email}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-300">Subject</label>
                    <p className="text-white font-semibold">{selectedContact.subject}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-300">Message</label>
                    <p className="text-white whitespace-pre-wrap bg-white/5 rounded-lg p-3 mt-1">
                      {selectedContact.message}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-300">Received</label>
                    <p className="text-white">{formatDate(selectedContact.created_at)}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-300">Status</label>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusIcon(selectedContact)}
                      <span className="text-white">{getStatusText(selectedContact)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-6">
                  <a
                    href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}`}
                    className="flex-1 flex items-center justify-center px-4 py-3 bg-blue-500/20 text-blue-300 rounded-xl hover:bg-blue-500/30 transition-colors"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Reply
                  </a>

                  {!selectedContact.replied && (
                    <button
                      onClick={() => markAsReplied(selectedContact.id)}
                      className="flex-1 flex items-center justify-center px-4 py-3 bg-green-500/20 text-green-300 rounded-xl hover:bg-green-500/30 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark Replied
                    </button>
                  )}

                  <button
                    onClick={() => deleteContact(selectedContact.id)}
                    disabled={deleting === selectedContact.id}
                    className="px-4 py-3 bg-red-500/20 text-red-300 rounded-xl hover:bg-red-500/30 transition-colors disabled:opacity-50"
                  >
                    {deleting === selectedContact.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center">
                <Mail className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">
                  Select a Contact
                </h3>
                <p className="text-gray-500">
                  Click on a contact from the list to view details
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}