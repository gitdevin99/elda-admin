'use client';

import React, { useState } from 'react';
import { Upload, Check } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import type { CategoryType, SignalIntensity, BeatMode, FrequencyRange } from '@/types/categories';

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
    <div className="min-h-screen bg-[#050505]">
      <div className="overflow-auto px-10 py-10">
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 rounded-full bg-cyan/10 flex items-center justify-center mb-5">
            <Upload size={32} className="text-cyan" />
          </div>
          <h1 className="text-[32px] font-extrabold text-white mb-2">Track Upload</h1>
          <p className="text-base text-white/50 font-semibold">Admin Panel</p>
        </div>

        <div className="max-w-[800px] w-full mx-auto">
          {/* TRACK INFORMATION */}
          <div className="mb-10">
            <h2 className="text-xs font-bold text-cyan tracking-[1.5px] mb-5">TRACK INFORMATION</h2>

            <div className="mb-5">
              <label className="block text-sm font-semibold text-white/70 mb-2">Title *</label>
              <input
                type="text"
                className="w-full bg-[#111] rounded-xl border border-white/10 p-4 text-white text-base placeholder:text-white/30"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter track title"
              />
            </div>

            <div className="mb-5">
              <label className="block text-sm font-semibold text-white/70 mb-2">Subtitle</label>
              <input
                type="text"
                className="w-full bg-[#111] rounded-xl border border-white/10 p-4 text-white text-base placeholder:text-white/30"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="Enter track subtitle (optional)"
              />
            </div>

            <div className="mb-5">
              <label className="block text-sm font-semibold text-white/70 mb-2">Description *</label>
              <textarea
                className="w-full bg-[#111] rounded-xl border border-white/10 p-4 text-white text-base placeholder:text-white/30 min-h-[120px]"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter track description and story"
                rows={4}
              />
            </div>

            <div className="mb-5">
              <label className="block text-sm font-semibold text-white/70 mb-2">Duration (e.g., 45:00)</label>
              <input
                type="text"
                className="w-full bg-[#111] rounded-xl border border-white/10 p-4 text-white text-base placeholder:text-white/30"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="MM:SS"
              />
            </div>
          </div>

          {/* AUDIO & ARTWORK */}
          <div className="mb-10">
            <h2 className="text-xs font-bold text-cyan tracking-[1.5px] mb-5">AUDIO & ARTWORK</h2>

            <div className="mb-5">
              <label className="block text-sm font-semibold text-white/70 mb-2">Audio URL *</label>
              <input
                type="text"
                className="w-full bg-[#111] rounded-xl border border-white/10 p-4 text-white text-base placeholder:text-white/30"
                value={formData.audioUrl}
                onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })}
                placeholder="https://example.com/audio.mp3"
              />
            </div>

            <div className="mb-5">
              <label className="block text-sm font-semibold text-white/70 mb-2">Artwork URL</label>
              <input
                type="text"
                className="w-full bg-[#111] rounded-xl border border-white/10 p-4 text-white text-base placeholder:text-white/30"
                value={formData.artworkUrl}
                onChange={(e) => setFormData({ ...formData, artworkUrl: e.target.value })}
                placeholder="https://example.com/artwork.jpg"
              />
            </div>
          </div>

          {/* AUDIO PROPERTIES */}
          <div className="mb-10">
            <h2 className="text-xs font-bold text-cyan tracking-[1.5px] mb-5">AUDIO PROPERTIES</h2>

            <div className="mb-5">
              <label className="block text-sm font-semibold text-white/70 mb-2">Frequency (Hz) *</label>
              <input
                type="number"
                step="0.1"
                className="w-full bg-[#111] rounded-xl border border-white/10 p-4 text-white text-base placeholder:text-white/30"
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                placeholder="10.0"
              />
            </div>

            <div className="mb-5">
              <label className="block text-sm font-semibold text-white/70 mb-2">Frequency Range *</label>
              <div className="flex gap-3 overflow-x-auto">
                {(['Delta', 'Theta', 'Alpha', 'Beta', 'Gamma'] as FrequencyRange[]).map((range) => (
                  <button
                    key={range}
                    type="button"
                    className={`px-5 py-3 rounded-xl border-2 text-sm font-bold whitespace-nowrap transition-all ${
                      formData.frequencyRange === range
                        ? 'bg-[#00F0FF] border-[#00F0FF] text-black'
                        : 'bg-[#1a1a1a] border-white/20 text-white hover:border-cyan/50'
                    }`}
                    onClick={() => setFormData({ ...formData, frequencyRange: range })}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-semibold text-white/70 mb-2">Signal Intensity *</label>
              <div className="flex gap-3 overflow-x-auto">
                {(['off', 'low', 'normal', 'high'] as SignalIntensity[]).map((intensity) => (
                  <button
                    key={intensity}
                    type="button"
                    className={`px-5 py-3 rounded-xl border-2 text-sm font-bold whitespace-nowrap transition-all ${
                      formData.signalIntensity === intensity
                        ? 'bg-[#00F0FF] border-[#00F0FF] text-black'
                        : 'bg-[#1a1a1a] border-white/20 text-white hover:border-cyan/50'
                    }`}
                    onClick={() => setFormData({ ...formData, signalIntensity: intensity })}
                  >
                    {intensity.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-semibold text-white/70 mb-2">Beat Mode *</label>
              <div className="flex gap-3 overflow-x-auto">
                {(['binaural', 'isochronic'] as BeatMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    className={`px-5 py-3 rounded-xl border-2 text-sm font-bold whitespace-nowrap transition-all ${
                      formData.beatMode === mode
                        ? 'bg-[#00F0FF] border-[#00F0FF] text-black'
                        : 'bg-[#1a1a1a] border-white/20 text-white hover:border-cyan/50'
                    }`}
                    onClick={() => setFormData({ ...formData, beatMode: mode })}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-semibold text-white/70 mb-2">Entrainment % *</label>
              <input
                type="number"
                step="0.1"
                className="w-full bg-[#111] rounded-xl border border-white/10 p-4 text-white text-base placeholder:text-white/30"
                value={formData.entrainmentPercentage}
                onChange={(e) => setFormData({ ...formData, entrainmentPercentage: e.target.value })}
                placeholder="0-100"
              />
            </div>
          </div>

          {/* CATEGORY & SUBCATEGORY */}
          <div className="mb-10">
            <h2 className="text-xs font-bold text-cyan tracking-[1.5px] mb-5">CATEGORY & SUBCATEGORY</h2>

            <div className="mb-5">
              <label className="block text-sm font-semibold text-white/70 mb-2">Category *</label>
              <div className="flex gap-3 overflow-x-auto">
                {(['focus', 'relax', 'sleep', 'meditate'] as CategoryType[]).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`px-5 py-3 rounded-xl border-2 text-sm font-bold whitespace-nowrap transition-all ${
                      formData.categoryType === cat
                        ? 'bg-[#00F0FF] border-[#00F0FF] text-black'
                        : 'bg-[#1a1a1a] border-white/20 text-white hover:border-cyan/50'
                    }`}
                    onClick={() => setFormData({ ...formData, categoryType: cat, subcategoryId: '' })}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-semibold text-white/70 mb-2">Subcategory *</label>
              {subcategoriesQuery.isLoading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan"></div>
                </div>
              ) : (
                <div className="max-h-[300px] overflow-y-auto">
                  {filteredSubcategories.map((sub: any) => (
                    <button
                      key={sub.id}
                      type="button"
                      className={`w-full flex items-center justify-between p-4 rounded-xl border mb-3 text-left ${
                        formData.subcategoryId === sub.id
                          ? 'border-cyan bg-cyan/5'
                          : 'border-white/10 bg-[#111]'
                      }`}
                      onClick={() => setFormData({ ...formData, subcategoryId: sub.id })}
                    >
                      <div className="flex-1 mr-3">
                        <p className={`text-base font-semibold mb-1 ${
                          formData.subcategoryId === sub.id ? 'text-cyan' : 'text-white'
                        }`}>
                          {sub.name}
                        </p>
                        <p className="text-[13px] text-white/40">{sub.description}</p>
                      </div>
                      {formData.subcategoryId === sub.id && (
                        <Check size={20} className="text-cyan flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="button"
            className={`w-full rounded-2xl overflow-hidden mt-5 ${
              addTrackMutation.isPending ? 'opacity-60' : ''
            }`}
            onClick={handleSubmit}
            disabled={addTrackMutation.isPending}
          >
            <div
              className="flex items-center justify-center py-[18px] gap-3"
              style={{
                background: 'linear-gradient(to right, #00F0FF, #0088CC)',
              }}
            >
              {addTrackMutation.isPending ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
              ) : (
                <>
                  <Upload size={20} className="text-black" />
                  <span className="text-[17px] font-bold text-black">Upload Track</span>
                </>
              )}
            </div>
          </button>
        </div>

        <div className="h-[60px]"></div>
      </div>
    </div>
  );
}
