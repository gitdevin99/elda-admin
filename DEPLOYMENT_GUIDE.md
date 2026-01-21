# Elda Admin Panel - Vercel Deployment Guide

## Overview
This is a standalone Next.js admin panel for managing tracks in the Elda mobile app. It connects to the same Rork DB database.

## Files Created
- `app/page.tsx` - Admin UI (ported from React Native)
- `app/layout.tsx` - Root layout with Tailwind
- `app/api/trpc/[trpc]/route.ts` - tRPC API handler
- `server/routers/tracks.ts` - Track CRUD operations (copied from mobile backend)
- `server/trpc.ts` - tRPC setup
- `lib/trpc.ts` - Client-side tRPC

## Environment Variables for Vercel

Add these 3 variables in Vercel Dashboard → Settings → Environment Variables:

```
EXPO_PUBLIC_RORK_DB_ENDPOINT=https://api.rivet.dev
EXPO_PUBLIC_RORK_DB_NAMESPACE=rork-74b4-x87ufo795pjv1t7z-9268
EXPO_PUBLIC_RORK_DB_TOKEN=xA6kJQQZq7xrU3W4WLxobpOQY55XBLAYTUkmaSb3IlMJzPbNGy7MjeBG8FmEoaTn
```

## Deployment Steps

### 1. Initialize Git
```bash
cd /Users/sanjanabandara/CascadeProjects/elda/elda-admin-panel
git init
git add .
git commit -m "Initial commit: Elda admin panel"
```

### 2. Push to GitHub
```bash
# Create new repo on GitHub: elda-admin-panel
git remote add origin https://github.com/gitdevin99/elda-admin-panel.git
git branch -M main
git push -u origin main
```

### 3. Deploy to Vercel
1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import `elda-admin-panel` repository
4. Framework Preset: Next.js (auto-detected)
5. Add the 3 environment variables above
6. Click "Deploy"

### 4. Access Admin Panel
- URL: https://elda-admin-panel.vercel.app (or custom domain)
- Add tracks through the form
- Changes sync immediately to mobile app

## Local Development
```bash
npm run dev
# Open http://localhost:3000
```

## Features
- Add/edit/delete tracks
- Assign tracks to subcategories
- Set frequency, beat mode, signal intensity
- Upload audio and artwork URLs
- All data syncs to Rork DB instantly
