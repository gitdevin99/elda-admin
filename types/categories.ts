export type CategoryType = 'focus' | 'relax' | 'sleep' | 'meditate';
export type FrequencyRange = 'Delta' | 'Theta' | 'Alpha' | 'Beta' | 'Gamma';
export type SignalIntensity = 'off' | 'low' | 'normal' | 'high';
export type BeatMode = 'binaural' | 'isochronic';

export interface Track {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  duration?: string;
  audioUrl: string;
  artworkUrl?: string;
  frequency: number;
  frequencyRange: FrequencyRange;
  signalIntensity: SignalIntensity;
  beatMode: BeatMode;
  entrainmentPercentage: number;
  color?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Subcategory {
  id: string;
  name: string;
  description: string;
  categoryType: CategoryType;
  tracks: Track[];
}
