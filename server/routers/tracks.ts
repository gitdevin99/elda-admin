import { z } from 'zod';
import { router, publicProcedure } from '../init';

const ENDPOINT = process.env.EXPO_PUBLIC_RORK_DB_ENDPOINT;
const NAMESPACE = process.env.EXPO_PUBLIC_RORK_DB_NAMESPACE;
const TOKEN = process.env.EXPO_PUBLIC_RORK_DB_TOKEN;

const trackSchema = z.object({
  id: z.string(),
  title: z.string(),
  subtitle: z.string().optional(),
  description: z.string(),
  duration: z.string().optional(),
  audioUrl: z.string(),
  artworkUrl: z.string().optional(),
  frequency: z.number(),
  frequencyRange: z.enum(['Delta', 'Theta', 'Alpha', 'Beta', 'Gamma']),
  signalIntensity: z.enum(['off', 'low', 'normal', 'high']),
  beatMode: z.enum(['binaural', 'isochronic']),
  entrainmentPercentage: z.number(),
  color: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

async function fetchSubcategoriesFromDb() {
  const url = `${ENDPOINT}/v1/kv/namespaces/${NAMESPACE}/keys/subcategories`;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      return [];
    }
    throw new Error(`Failed to fetch subcategories: ${response.status}`);
  }

  const result = await response.json();
  return result.value?.data || [];
}

async function saveSubcategoriesToDb(subcategories: any[]) {
  const url = `${ENDPOINT}/v1/kv/namespaces/${NAMESPACE}/keys/subcategories`;

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({
      value: {
        data: subcategories,
        updatedAt: new Date().toISOString(),
      }
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to save subcategories: ${response.status}`);
  }

  return await response.json();
}

export const tracksRouter = router({
  addTrack: publicProcedure
    .input(z.object({
      subcategoryId: z.string(),
      track: trackSchema,
    }))
    .mutation(async ({ input }) => {
      const subcategories = await fetchSubcategoriesFromDb();
      
      const updatedSubcategories = subcategories.map((sub: any) => {
        if (sub.id === input.subcategoryId) {
          const trackExists = sub.tracks.some((t: any) => t.id === input.track.id);
          if (trackExists) {
            return {
              ...sub,
              tracks: sub.tracks.map((t: any) => 
                t.id === input.track.id ? input.track : t
              ),
            };
          }
          return {
            ...sub,
            tracks: [...sub.tracks, input.track],
          };
        }
        return sub;
      });

      await saveSubcategoriesToDb(updatedSubcategories);
      
      return { success: true, track: input.track };
    }),

  updateTrack: publicProcedure
    .input(z.object({
      subcategoryId: z.string(),
      trackId: z.string(),
      track: trackSchema.partial(),
    }))
    .mutation(async ({ input }) => {
      const subcategories = await fetchSubcategoriesFromDb();
      
      const updatedSubcategories = subcategories.map((sub: any) => {
        if (sub.id === input.subcategoryId) {
          return {
            ...sub,
            tracks: sub.tracks.map((t: any) => 
              t.id === input.trackId ? { ...t, ...input.track, updatedAt: new Date().toISOString() } : t
            ),
          };
        }
        return sub;
      });

      await saveSubcategoriesToDb(updatedSubcategories);
      
      return { success: true };
    }),

  deleteTrack: publicProcedure
    .input(z.object({
      subcategoryId: z.string(),
      trackId: z.string(),
    }))
    .mutation(async ({ input }) => {
      const subcategories = await fetchSubcategoriesFromDb();
      
      const updatedSubcategories = subcategories.map((sub: any) => {
        if (sub.id === input.subcategoryId) {
          return {
            ...sub,
            tracks: sub.tracks.filter((t: any) => t.id !== input.trackId),
          };
        }
        return sub;
      });

      await saveSubcategoriesToDb(updatedSubcategories);
      
      return { success: true };
    }),

  getAllTracks: publicProcedure
    .query(async () => {
      const subcategories = await fetchSubcategoriesFromDb();
      
      const allTracks = subcategories.flatMap((sub: any) => 
        sub.tracks.map((track: any) => ({
          ...track,
          subcategoryId: sub.id,
          subcategoryName: sub.name,
          categoryType: sub.categoryType,
        }))
      );

      return allTracks;
    }),

  getSubcategories: publicProcedure
    .query(async () => {
      return await fetchSubcategoriesFromDb();
    }),
});
