"use client"

import { useAdminAuth } from "@/lib/useAdminAuth"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { motion, AnimatePresence } from "framer-motion"
import { User, MapPin, FileText, Code, Twitter, Github, Save, Sparkles, CheckCircle, AlertCircle } from "lucide-react"

export default function BeautifulProfileForm() {
  const { session, loading } = useAdminAuth()
  const [form, setForm] = useState({
    name: "",
    bio: "",
    location: "",
    skills: "",
    socials: {
      twitter: "",
      github: "",
    },
  })
  const [saving, setSaving] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!session) return
    const loadProfile = async () => {
      const { data, error } = await supabase.from("profile").select("*").limit(1)

      if (data && data.length > 0) {
        const profile = data[0]
        setForm({
          name: profile.name || "",
          bio: profile.bio || "",
          location: profile.location || "",
          skills: (profile.skills || []).join(", "),
          socials: profile.socials || { twitter: "", github: "" },
        })
      } else if (error) {
        setLoadError(error?.message as string)
      }
    }
    loadProfile()
  }, [session])

  const handleChange = (e: any) => {
    const { name, value } = e.target
    if (name.startsWith("socials.")) {
      const key = name.split(".")[1]
      setForm((prev) => ({
        ...prev,
        socials: { ...prev.socials, [key]: value },
      }))
    } else {
      setForm((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setLoadError(null)
    setSuccessMessage(null)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const { data: existingProfiles } = await supabase.from("profile").select("id").limit(1)

    let result
    if (existingProfiles && existingProfiles.length > 0) {
      const profileId = existingProfiles[0].id
      result = await supabase
        .from("profile")
        .update({
          name: form.name,
          bio: form.bio,
          location: form.location,
          skills: form.skills.split(",").map((s: string) => s.trim()),
          socials: form.socials,
        })
        .eq("id", profileId)
    } else {
      result = await supabase.from("profile").insert({
        name: form.name,
        bio: form.bio,
        location: form.location,
        skills: form.skills.split(",").map((s: string) => s.trim()),
        socials: form.socials,
      })
    }

    setSaving(false)
    if (result.error) {
      setLoadError(result.error?.message as string)
    } else {
      setSuccessMessage("Profile updated successfully! Your changes have been saved.")
      setTimeout(() => setSuccessMessage(null), 5000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 flex items-center justify-center">
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-20 h-20 border-4 border-purple-400/30 border-t-purple-400 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-0 w-20 h-20 border-4 border-pink-400/30 border-b-pink-400 rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-purple-400" />
          </div>
        </motion.div>
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 p-4 relative overflow-hidden flex items-center justify-center">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        className="w-full max-w-4xl relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          className="bg-white/5 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileHover={{ scale: 1.002, transition: { duration: 0.3 } }}
        >
    

          {/* Compact Form Content */}
          <div className="p-6">
            <motion.div
              className="grid gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {/* Two-column layout for name and location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name Field */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="group"
                >
                  <label className="flex items-center text-sm font-semibold text-gray-200 mb-2">
                    <User className="w-4 h-4 mr-2 text-purple-400" />
                    Full Name
                  </label>
                  <motion.div className="relative">
                    <motion.input
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 group-hover:bg-white/10"
                      name="name"
                      placeholder="Enter your full name"
                      value={form.name}
                      onChange={handleChange}
                      whileFocus={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    />
                    <motion.div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </motion.div>
                </motion.div>

                {/* Location Field */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="group"
                >
                  <label className="flex items-center text-sm font-semibold text-gray-200 mb-2">
                    <MapPin className="w-4 h-4 mr-2 text-pink-400" />
                    Location
                  </label>
                  <motion.div className="relative">
                    <motion.input
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all duration-300 group-hover:bg-white/10"
                      name="location"
                      placeholder="Where are you based?"
                      value={form.location}
                      onChange={handleChange}
                      whileFocus={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    />
                    <motion.div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </motion.div>
                </motion.div>
              </div>

              {/* Bio Field */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="group"
              >
                <label className="flex items-center text-sm font-semibold text-gray-200 mb-2">
                  <FileText className="w-4 h-4 mr-2 text-indigo-400" />
                  Bio
                </label>
                <motion.div className="relative">
                  <motion.textarea
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300 resize-none group-hover:bg-white/10"
                    name="bio"
                    placeholder="Tell us about yourself..."
                    rows={3}
                    value={form.bio}
                    onChange={handleChange}
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  />
                  <motion.div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </motion.div>
              </motion.div>

              {/* Skills Field */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                className="group"
              >
                <label className="flex items-center text-sm font-semibold text-gray-200 mb-2">
                  <Code className="w-4 h-4 mr-2 text-green-400" />
                  Skills
                </label>
                <motion.div className="relative">
                  <motion.input
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300 group-hover:bg-white/10"
                    name="skills"
                    placeholder="JavaScript, React, Node.js, etc."
                    value={form.skills}
                    onChange={handleChange}
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  />
                  <motion.div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </motion.div>
                <p className="text-xs text-gray-400/70 mt-1 ml-1">Separate skills with commas</p>
              </motion.div>

              {/* Compact Social Links Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.1 }}
                className="bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-sm"
              >
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <motion.span
                    className="mr-2 text-xl"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
                  >
                    🔗
                  </motion.span>
                  Social Links
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 1.2 }}
                    className="group"
                  >
                    <label className="flex items-center text-sm font-semibold text-gray-200 mb-2">
                      <Twitter className="w-4 h-4 mr-2 text-blue-400" />
                      Twitter
                    </label>
                    <motion.div className="relative">
                      <motion.input
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 group-hover:bg-white/10"
                        name="socials.twitter"
                        placeholder="https://twitter.com/username"
                        value={form.socials.twitter}
                        onChange={handleChange}
                        whileFocus={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      />
                      <motion.div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </motion.div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 1.3 }}
                    className="group"
                  >
                    <label className="flex items-center text-sm font-semibold text-gray-200 mb-2">
                      <Github className="w-4 h-4 mr-2 text-gray-300" />
                      GitHub
                    </label>
                    <motion.div className="relative">
                      <motion.input
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/50 focus:border-gray-500/50 transition-all duration-300 group-hover:bg-white/10"
                        name="socials.github"
                        placeholder="https://github.com/username"
                        value={form.socials.github}
                        onChange={handleChange}
                        whileFocus={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      />
                      <motion.div className="absolute inset-0 rounded-xl bg-gradient-to-r from-gray-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Compact Save Button */}
              <motion.button
                className="relative w-full bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl overflow-hidden group"
                onClick={handleSave}
                disabled={saving}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.4 }}
                whileHover={{ scale: saving ? 1 : 1.02, y: saving ? 0 : -1 }}
                whileTap={{ scale: saving ? 1 : 0.98 }}
              >
                <motion.div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <AnimatePresence mode="wait">
                  {saving ? (
                    <motion.div
                      className="flex items-center justify-center relative z-10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.div
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      />
                      Saving Changes...
                    </motion.div>
                  ) : (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center justify-center relative z-10"
                    >
                      <Save className="w-5 h-5 mr-3" />
                      Save Changes
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>

            {/* Compact Success Message */}
            <AnimatePresence>
              {successMessage && (
                <motion.div
                  className="mt-4 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-100 rounded-xl backdrop-blur-sm"
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex items-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    >
                      <CheckCircle className="w-5 h-5 mr-3 text-green-400" />
                    </motion.div>
                    <div>
                      <p className="font-semibold text-sm">Success!</p>
                      <p className="text-xs text-green-200/80">{successMessage}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Compact Error Message */}
            <AnimatePresence>
              {loadError && (
                <motion.div
                  className="mt-4 p-4 bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 text-red-100 rounded-xl backdrop-blur-sm"
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex items-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    >
                      <AlertCircle className="w-5 h-5 mr-3 text-red-400" />
                    </motion.div>
                    <div>
                      <p className="font-semibold text-sm">Error</p>
                      <p className="text-xs text-red-200/80">{loadError}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
