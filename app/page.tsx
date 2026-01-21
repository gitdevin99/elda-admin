'use client';

import React, { useState } from 'react';
import { 
  Upload, 
  Check, 
  Music, 
  Image as ImageIcon, 
  Settings2, 
  Layers, 
  ChevronRight,
  PlusCircle,
  LayoutDashboard,
  LogOut,
  Search,
  Zap,
  Activity,
  AudioWaveform
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { trpc } from '@/lib/trpc';
import type { CategoryType, SignalIntensity, BeatMode, FrequencyRange } from '@/types/categories';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

export default function AdminPanelScreen() {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    duration: '',
    audioUrl: '',
    artworkUrl: '',
    frequency: '',
    frequencyRange: 'Alpha' as FrequencyRange,
    signalIntensity: 'normal' as SignalIntensity,
    beatMode: 'binaural' as BeatMode,
    entrainmentPercentage: '',
    categoryType: 'focus' as CategoryType,
    subcategoryId: '',
  });

  const subcategoriesQuery = trpc.tracks.getSubcategories.useQuery();
  const addTrackMutation = trpc.tracks.addTrack.useMutation();

  const filteredSubcategories = subcategoriesQuery.data?.filter(
    (sub: any) => sub.categoryType === formData.categoryType
  ) || [];

  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.audioUrl || !formData.subcategoryId) {
      window.alert('Please fill in all required fields');
      return;
    }

    const frequency = parseFloat(formData.frequency);
    const entrainmentPercentage = parseFloat(formData.entrainmentPercentage);

    if (isNaN(frequency) || isNaN(entrainmentPercentage)) {
      window.alert('Frequency and Entrainment Percentage must be valid numbers');
      return;
    }

    const track = {
      id: `track-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: formData.title,
      subtitle: formData.subtitle || undefined,
      description: formData.description,
      duration: formData.duration || undefined,
      audioUrl: formData.audioUrl,
      artworkUrl: formData.artworkUrl || undefined,
      frequency,
      frequencyRange: formData.frequencyRange,
      signalIntensity: formData.signalIntensity,
      beatMode: formData.beatMode,
      entrainmentPercentage,
      createdAt: new Date().toISOString(),
    };

    try {
      await addTrackMutation.mutateAsync({
        subcategoryId: formData.subcategoryId,
        track,
      });

      window.alert('Track uploaded successfully!');

      setFormData({
        title: '',
        subtitle: '',
        description: '',
        duration: '',
        audioUrl: '',
        artworkUrl: '',
        frequency: '',
        frequencyRange: 'Alpha',
        signalIntensity: 'normal',
        beatMode: 'binaural',
        entrainmentPercentage: '',
        categoryType: 'focus',
        subcategoryId: '',
      });
    } catch (error) {
      window.alert('Failed to upload track. Please try again.');
      console.error('Upload error:', error);
    }
  };

  return (
    <div className="flex h-screen bg-[#020203] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[#0a0a0c] flex flex-col hidden md:flex">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan to-blue-600 flex items-center justify-center neon-glow">
              <AudioWaveform size={24} className="text-black" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tighter">ELDA</h1>
              <p className="text-[10px] text-cyan font-bold tracking-[2px] uppercase opacity-80">Admin Center</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active />
          <NavItem icon={<PlusCircle size={20} />} label="New Track" />
          <NavItem icon={<Music size={20} />} label="Library" />
          <NavItem icon={<Layers size={20} />} label="Categories" />
          <NavItem icon={<Settings2 size={20} />} label="Settings" />
        </nav>

        <div className="p-4 mt-auto">
          <div className="p-4 rounded-2xl glass mb-4">
            <p className="text-xs text-white/50 mb-1">Signed in as</p>
            <p className="text-sm font-bold text-white truncate">Administrator</p>
          </div>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-white/50 hover:text-white transition-colors">
            <LogOut size={18} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        {/* Top Header */}
        <header className="sticky top-0 z-10 glass px-8 py-4 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-xl border border-white/5 w-96">
            <Search size={18} className="text-white/30" />
            <input 
              type="text" 
              placeholder="Search tracks, users, categories..." 
              className="bg-transparent border-none p-0 text-sm focus:ring-0 w-full" 
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan/10 border border-cyan/20">
              <Activity size={14} className="text-cyan animate-pulse" />
              <span className="text-xs font-bold text-cyan">System Online</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
                alt="Avatar" 
                className="w-full h-full rounded-full"
              />
            </div>
          </div>
        </header>

        <motion.div 
          className="p-8 max-w-5xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Hero Section */}
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan/20 text-cyan uppercase tracking-wider">Management</span>
                <span className="text-white/20">/</span>
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Create New Track</span>
              </div>
              <h2 className="text-4xl font-black text-white tracking-tight">Track Upload</h2>
              <p className="text-white/40 mt-1">Configure and release new brainwave entertainment tracks.</p>
            </div>
            <button 
              onClick={handleSubmit}
              disabled={addTrackMutation.isPending}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan to-blue-500 rounded-xl font-bold text-black hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 neon-glow"
            >
              {addTrackMutation.isPending ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
              ) : (
                <>
                  <Upload size={18} />
                  <span>Publish Track</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* General Information */}
              <motion.section variants={itemVariants} className="p-6 rounded-3xl glass space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-white/5 text-cyan">
                    <Music size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-white">General Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-wider">Track Title *</label>
                    <input
                      type="text"
                      className="w-full p-4 rounded-xl"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Deep Focus Alpha"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-wider">Subtitle</label>
                    <input
                      type="text"
                      className="w-full p-4 rounded-xl"
                      value={formData.subtitle}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                      placeholder="e.g. Enhance cognitive performance"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-wider">Description *</label>
                    <textarea
                      rows={4}
                      className="w-full p-4 rounded-xl resize-none"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Provide deep context about the track and its intended effects..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-wider">Duration</label>
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full p-4 rounded-xl"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        placeholder="MM:SS"
                      />
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* Media Assets */}
              <motion.section variants={itemVariants} className="p-6 rounded-3xl glass space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-white/5 text-purple">
                    <Zap size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-white">Media Assets</h3>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-wider">Audio Source URL *</label>
                    <input
                      type="text"
                      className="w-full p-4 rounded-xl"
                      value={formData.audioUrl}
                      onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-wider">Artwork Image URL</label>
                    <input
                      type="text"
                      className="w-full p-4 rounded-xl"
                      value={formData.artworkUrl}
                      onChange={(e) => setFormData({ ...formData, artworkUrl: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </motion.section>

              {/* Technical Specifications */}
              <motion.section variants={itemVariants} className="p-6 rounded-3xl glass space-y-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-white/5 text-amber">
                    <Settings2 size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-white">Technical Specifications</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-wider">Carrier Frequency (Hz) *</label>
                    <input
                      type="number"
                      step="0.1"
                      className="w-full p-4 rounded-xl font-mono text-cyan"
                      value={formData.frequency}
                      onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                      placeholder="10.0"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-wider">Entrainment % *</label>
                    <input
                      type="number"
                      step="0.1"
                      className="w-full p-4 rounded-xl font-mono text-cyan"
                      value={formData.entrainmentPercentage}
                      onChange={(e) => setFormData({ ...formData, entrainmentPercentage: e.target.value })}
                      placeholder="0-100"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold text-white/40 uppercase tracking-wider">Brainwave State (Frequency Range)</label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {(['Delta', 'Theta', 'Alpha', 'Beta', 'Gamma'] as FrequencyRange[]).map((range) => (
                      <SelectButton 
                        key={range}
                        selected={formData.frequencyRange === range}
                        onClick={() => setFormData({ ...formData, frequencyRange: range })}
                        label={range}
                      />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-wider">Signal Intensity</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['off', 'low', 'normal', 'high'] as SignalIntensity[]).map((intensity) => (
                        <SelectButton 
                          key={intensity}
                          selected={formData.signalIntensity === intensity}
                          onClick={() => setFormData({ ...formData, signalIntensity: intensity })}
                          label={intensity.toUpperCase()}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-wider">Delivery Mode</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['binaural', 'isochronic'] as BeatMode[]).map((mode) => (
                        <SelectButton 
                          key={mode}
                          selected={formData.beatMode === mode}
                          onClick={() => setFormData({ ...formData, beatMode: mode })}
                          label={mode.charAt(0).toUpperCase() + mode.slice(1)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.section>
            </div>

            {/* Right Column - Classification & Preview */}
            <div className="space-y-8">
              {/* Category Selection */}
              <motion.section variants={itemVariants} className="p-6 rounded-3xl glass space-y-6 h-fit sticky top-28">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-white/5 text-cyan">
                    <Layers size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-white">Classification</h3>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold text-white/40 uppercase tracking-wider">Main Category *</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['focus', 'relax', 'sleep', 'meditate'] as CategoryType[]).map((cat) => (
                      <SelectButton 
                        key={cat}
                        selected={formData.categoryType === cat}
                        onClick={() => setFormData({ ...formData, categoryType: cat, subcategoryId: '' })}
                        label={cat.charAt(0).toUpperCase() + cat.slice(1)}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold text-white/40 uppercase tracking-wider">Subcategory *</label>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scroll">
                    {subcategoriesQuery.isLoading ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan"></div>
                      </div>
                    ) : (
                      filteredSubcategories.map((sub: any) => (
                        <motion.button
                          key={sub.id}
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setFormData({ ...formData, subcategoryId: sub.id })}
                          className={`w-full p-4 rounded-2xl border text-left transition-all ${
                            formData.subcategoryId === sub.id
                              ? 'border-cyan bg-cyan/10 ring-1 ring-cyan/50'
                              : 'border-white/5 bg-white/5 hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-sm font-bold ${formData.subcategoryId === sub.id ? 'text-cyan' : 'text-white'}`}>
                              {sub.name}
                            </span>
                            {formData.subcategoryId === sub.id && <Check size={14} className="text-cyan font-bold" />}
                          </div>
                          <p className="text-[11px] text-white/30 line-clamp-1">{sub.description}</p>
                        </motion.button>
                      ))
                    )}
                    {filteredSubcategories.length === 0 && !subcategoriesQuery.isLoading && (
                      <div className="text-center py-8 bg-white/5 rounded-2xl border border-dashed border-white/10">
                        <p className="text-sm text-white/30 italic">No subcategories found</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.section>

              {/* Quick Summary Card */}
              <motion.div variants={itemVariants} className="p-6 rounded-3xl bg-gradient-to-br from-cyan/20 to-purple/20 border border-white/10 overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                  <AudioWaveform size={80} />
                </div>
                <h4 className="text-sm font-bold text-white uppercase mb-4 tracking-widest">Live Preview</h4>
                <div className="space-y-3 relative z-10">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-white/40">Title:</span>
                    <span className="text-white font-medium">{formData.title || 'Untitled'}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-white/40">State:</span>
                    <span className="px-2 py-0.5 rounded bg-cyan/20 text-cyan text-[10px] font-black">{formData.frequencyRange}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-white/40">Mode:</span>
                    <span className="text-white font-medium capitalize">{formData.beatMode}</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex gap-2 text-[10px] font-bold">
                      <div className={`w-2 h-2 rounded-full ${formData.title && formData.audioUrl && formData.subcategoryId ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-white/40 uppercase tracking-tighter">
                        {formData.title && formData.audioUrl && formData.subcategoryId ? 'Ready to Deploy' : 'Configuration Pending'}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="h-24"></div>
        </motion.div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <button className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${
      active 
        ? 'glass bg-cyan/10 text-cyan border-cyan/20 neon-glow' 
        : 'text-white/40 hover:text-white hover:bg-white/5'
    }`}>
      <span className={active ? 'text-cyan' : ''}>{icon}</span>
      <span className="text-sm font-bold tracking-wide">{label}</span>
      {active && <ChevronRight size={14} className="ml-auto opacity-50" />}
    </button>
  );
}

function SelectButton({ selected, onClick, label }: { selected: boolean, onClick: () => void, label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-3 rounded-xl border text-[11px] font-black uppercase tracking-widest transition-all ${
        selected
          ? 'bg-cyan border-cyan text-black neon-glow scale-105'
          : 'bg-white/5 border-white/5 text-white/30 hover:bg-white/10 hover:border-white/10'
      }`}
    >
      {label}
    </button>
  );
}
