# 🏋️ GYM WORKOUT TRACKER - Complete Specification & Architecture Guide

**Template Reference:** Diet Tracker (successful single-file SPA architecture)  
**Tech Stack:** HTML5 SPA, Vanilla JavaScript, Supabase REST API, Cloudflare Pages  
**Status:** Ready for Agent Implementation  
**Date:** April 27, 2026

---

## 📋 TABLE OF CONTENTS

1. [Executive Summary](#executive-summary)
2. [Architecture Overview](#architecture-overview)
3. [Database Schema](#database-schema)
4. [Security & Credentials](#security--credentials)
5. [UI/UX Layout](#uiux-layout)
6. [Core Modules](#core-modules)
7. [Data Models](#data-models)
8. [State Management](#state-management)
9. [Feature Breakdown](#feature-breakdown)
10. [Implementation Roadmap](#implementation-roadmap)

---

## 🎯 EXECUTIVE SUMMARY

### Purpose

A single-file mobile-first web app for tracking gym workouts, exercises, progress, and fitness goals with comprehensive analytics and workout history.

### Key Differentiators from Diet Tracker

- **Focus:** Physical activity & strength training instead of nutrition
- **Metrics:** Reps, sets, weight, RPE instead of calories & macros
- **Tracking:** Exercise progression, PR (personal records), form notes
- **Analytics:** Workout volume, intensity trends, muscle group breakdown
- **Community:** Optional workout templates from community/trainers

### Constraints (Replicate Diet Tracker Success)

- ✅ Single HTML file with embedded CSS/JavaScript (no build step)
- ✅ Responsive mobile-first design (tailored for gym use on phones)
- ✅ Zero hardcoded secrets (Cloudflare Pages Function for credential injection)
- ✅ Supabase REST API only (no real-time subscriptions initially)
- ✅ Offline-capable with operation queueing
- ✅ Bilingual support (EN/ES)
- ✅ 3-theme system (dark/light/pink)
- ✅ Comprehensive error handling & input validation
- ✅ Memory leak prevention & cleanup
- ✅ Accessible UI with keyboard support

---

## 🏗️ ARCHITECTURE OVERVIEW

### High-Level Stack

```
┌────────────────────────────────────────────┐
│  Single HTML File (gym-tracker.html)       │
├────────────────────────────────────────────┤
│ CSS (400-500 lines)                        │
│ ├─ 3-theme system (dark/light/pink)       │
│ ├─ CSS variables for colors/spacing       │
│ └─ Mobile-first responsive layout         │
├────────────────────────────────────────────┤
│ JavaScript Modules (3500+ lines)          │
│ ├─ DB: Supabase REST wrapper              │
│ ├─ CALC: Workout calculations             │
│ ├─ EXERCISES: Database of 200+ exercises │
│ ├─ WORKOUTS: Pre-built templates          │
│ ├─ PLANS: Smart workout planning engine   │
│ ├─ PROGRESS: Analytics & PR tracking      │
│ ├─ LANG: Bilingual translations (EN/ES)  │
│ ├─ VALID: Input validation & sanitization│
│ ├─ OFFLINE: Offline detection & queuing  │
│ └─ Views: 8 navigation screens            │
│    - Today (active workout)                │
│    - Workouts (history & templates)       │
│    - Progress (strength curve, PRs)       │
│    - Analytics (volume, intensity, etc.)  │
│    - Grocery (equipment checklist)        │
│    - Community (shared workouts/tips)     │
│    - Notes (form tips, injury notes)      │
│    - Settings (profile, preferences)      │
└────────────────────────────────────────────┘
           ↓
        (Cloudflare Pages Function)
           ↓
    Supabase REST API (PostgreSQL)
           ↓
    Firebase Auth (optional) or JWT
```

### File Structure

```
gym-tracker/ (GitHub repo)
├── gym-tracker.html (SINGLE SOURCE OF TRUTH)
├── functions/
│   └── api/
│       └── env.js (Runtime credential injection via Cloudflare)
├── .env.local (LOCAL ONLY - never in git)
├── .gitignore (excludes .env.local, config.js)
├── config.js (template - user fills in locally)
├── config.example.js (committed - shows structure)
└── README.md (setup instructions)

NOTE: All app code is in gym-tracker.html
No separate JS/CSS files for production
```

### Deployment

- **Hosting:** Cloudflare Pages (auto-deploy from main branch)
- **Function:** `functions/api/env.js` - injects Supabase keys at runtime
- **Database:** Supabase PostgreSQL (managed)
- **Auth:** Supabase (row-level security enabled)
- **Monitoring:** Cloudflare Analytics + custom error tracking

---

## 💾 DATABASE SCHEMA

### Supabase Tables

#### 1. **gym_data** (Main data storage)

```sql
CREATE TABLE gym_data (
  id TEXT PRIMARY KEY,              -- e.g., "profile", "workout_2024-04-27", "exercise_log_2024-04-27"
  data JSONB NOT NULL,              -- All user data stored as JSON
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE gym_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow all" ON gym_data
  FOR ALL USING (true) WITH CHECK (true);
```

#### 2. Data Keys Stored in gym_data

| Key | Type | Structure | Example |
|-----|------|-----------|---------|
| `profile` | JSONB | User profile, stats, goals | `{name, gender, age, height, weight, goal, experience, createdAt}` |
| `workout_YYYY-MM-DD` | JSONB | Daily workout log | `{date, exercises: [{exerciseId, sets: [{reps, weight, rpe}]}]}` |
| `exercise_history` | JSONB | All-time exercise logs | `[{date, exerciseId, totalVolume, pr}]` |
| `workouts_completed` | JSONB | Completed workout templates | `[{templateId, date, completed}]` |
| `workout_templates` | JSONB | Saved custom templates | `[{id, name, exercises, focus, difficulty}]` |
| `prs` | JSONB | Personal records by exercise | `{exerciseId: {weight, date, reps}}` |
| `progress_notes` | JSONB | Form tips, injury notes | `[{date, exerciseId, note, severity}]` |
| `preferences` | JSONB | User preferences | `{theme, language, units (kg/lbs), notifications}` |

---

## 🔐 SECURITY & CREDENTIALS

### ❌ NEVER IN CODE

- Supabase API keys (ANON_KEY, SERVICE_KEY)
- Database passwords
- JWT tokens
- API secrets

### ✅ SOLUTION: Cloudflare Pages Function

**File:** `functions/api/env.js`

```javascript
export async function onRequest(context) {
  return new Response(
    `window.__ENV = {
      SUPABASE_URL: "${context.env.SUPABASE_URL}",
      SUPABASE_KEY: "${context.env.SUPABASE_KEY}"
    };`,
    { 
      headers: { 'Content-Type': 'application/javascript' }
    }
  );
}
```

**In HTML:** `<script src="/api/env"></script>` (injected at runtime)

### Environment Variables Setup

```bash
# In Cloudflare Pages dashboard:
# Settings → Environment Variables

SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Local Development

```bash
# Create config.js (NOT committed to git)
window.__ENV = {
  SUPABASE_URL: "YOUR_LOCAL_URL",
  SUPABASE_KEY: "YOUR_LOCAL_KEY"
};

# .gitignore includes:
config.js
.env.local
.env
```

### Row Level Security (RLS)

- Supabase RLS policy: `allow all` (permissive during dev)
- **Future:** Implement auth-based row-level security when adding user accounts

---

## 🎨 UI/UX LAYOUT

### Design System (Replicate Diet Tracker)

#### Color Palette

```css
/* Dark theme (default) */
--bg: #0B0F1A           /* Background */
--sf: #111827           /* Surface */
--s2: #1A1F2E           /* Surface secondary */
--b1: #1E293B           /* Border primary */
--b2: #2E3650           /* Border secondary */
--t1: #E2E8F0           /* Text primary */
--t2: #94A3B8           /* Text secondary */
--t3: #64748B           /* Text tertiary */
--ac: #3B82F6           /* Accent (blue for workout) */
--ac2: #1D4ED8          /* Accent darker */

/* Metric colors */
--reps: #8B5CF6         /* Purple - reps */
--weight: #F59E0B       /* Amber - weight */
--intensity: #EF4444    /* Red - RPE/intensity */
--volume: #10B981       /* Green - total volume */
--time: #3B82F6         /* Blue - duration */
```

#### Typography

```css
--font: 'DM Sans', 'Helvetica Neue', sans-serif
--disp: 'Barlow Condensed', sans-serif (display headings)
```

### Screen Navigation (8 Views - Bottom Tab Bar)

```
┌─────────────────────────────┐
│ 🏋️ GYM TRACKER              │
│ [Theme] [Language]          │
├─────────────────────────────┤
│ 📱 Main Content Area        │
│ (max-width: 720px centered) │
│                             │
└─────────────────────────────┘
┌─────────────────────────────┐
│ 🏠 Today  📋 Workouts 📈 PR │
│ 📊 Stats 🛒 Equipment 💬 Community │
│ 📝 Notes  ⚙️ Settings      │
└─────────────────────────────┘
  (Fixed at bottom, sticky nav)
```

### View Breakdown

#### 1. **Today** (Active Workout)

```
┌─────────────────────────────┐
│ Today's Workout - Mon, Apr 27│
├─────────────────────────────┤
│ ⏱️ Session: 0h 12m          │
│ 🎯 Focus: Chest & Triceps   │
│ 💪 Volume: 24,500 lbs       │
├─────────────────────────────┤
│ [Start New Workout]         │
├─────────────────────────────┤
│ 🔄 Ongoing: Bench Press     │
│ ├─ Set 1: 185 lbs × 8       │
│ ├─ Set 2: 185 lbs × 7       │
│ ├─ Set 3: 180 lbs × 9       │
│ └─ [Log Set]                │
├─────────────────────────────┤
│ ✓ Completed: Warmup         │
│ ├─ Barbell Rows             │
│ ├─ Leg Press                │
│ └─ Dips                      │
├─────────────────────────────┤
│ [End Workout] [Add Exercise]│
└─────────────────────────────┘
```

#### 2. **Workouts** (History & Templates)

```
┌─────────────────────────────┐
│ My Workouts                 │
├─────────────────────────────┤
│ [Search Workouts]           │
├─────────────────────────────┤
│ History (Last 14 days)      │
│                             │
│ Mon, Apr 27 - Chest & Back  │
│ ├─ 12 exercises, 45 min     │
│ ├─ Volume: 24.5K lbs        │
│ └─ [View Details]           │
│                             │
│ Sun, Apr 26 - Legs          │
│ ├─ 8 exercises, 52 min      │
│ └─ [View Details]           │
├─────────────────────────────┤
│ My Templates (Saved Plans)  │
│                             │
│ 📌 PPL Split (6-day)        │
│ 📌 Upper/Lower (4-day)      │
│ 📌 Full Body (3-day)        │
│ [+ Create Custom]           │
└─────────────────────────────┘
```

#### 3. **Progress** (Strength Curve & PRs)

```
┌─────────────────────────────┐
│ Progress & PRs              │
├─────────────────────────────┤
│ Bench Press - Personal Best │
│ [Graph: Weight over time]   │
│ Current: 225 lbs × 5 reps   │
│ PR Date: Apr 15, 2026       │
│ Trend: ↑ +15 lbs (60 days)  │
│                             │
│ Squat - Personal Best       │
│ [Graph: Weight over time]   │
│ Current: 315 lbs × 3 reps   │
│ PR Date: Apr 10, 2026       │
│ Trend: ↑ +20 lbs (90 days)  │
├─────────────────────────────┤
│ [All PRs] [Export Data]     │
└─────────────────────────────┘
```

#### 4. **Analytics** (Volume, Intensity)

```
┌─────────────────────────────┐
│ Weekly Analytics            │
├─────────────────────────────┤
│ Total Volume: 142,500 lbs   │
│ Avg Intensity: 7.2 RPE      │
│ Workouts: 5/7 completed     │
│ Sessions: 38h 24m total     │
├─────────────────────────────┤
│ Volume by Muscle Group      │
│ [Bar chart]                 │
│ Chest: 28% | Back: 25%      │
│ Legs: 22% | Shoulders: 15%  │
│ Arms: 10%                   │
├─────────────────────────────┤
│ Intensity Distribution      │
│ Easy (4-5 RPE): 30%         │
│ Moderate (6-7): 50%         │
│ Hard (8-10): 20%            │
├─────────────────────────────┤
│ [This Month] [All Time]     │
└─────────────────────────────┘
```

#### 5. **Equipment** (Gym/Home Checklist)

```
┌─────────────────────────────┐
│ Equipment & Gym Setup       │
├─────────────────────────────┤
│ Gym Equipment Status        │
│ ✓ Barbell (available)       │
│ ✓ Dumbbells 5-100 lbs       │
│ ✗ Leg Press (in repair)     │
│ ? Hack Squat (unknown)      │
├─────────────────────────────┤
│ [+ Add Equipment]           │
│ [⚙️ Edit Setup]             │
├─────────────────────────────┤
│ Alternative Exercises       │
│ (When equipment unavailable)│
│ Need: Leg Press             │
│ Alternatives:               │
│ ├─ V-Squat                  │
│ ├─ Smith Machine Squat      │
│ └─ Hack Squat Machine       │
└─────────────────────────────┘
```

#### 6. **Community** (Shared Workouts/Tips)

```
┌─────────────────────────────┐
│ Community & Tips            │
├─────────────────────────────┤
│ [Search Workouts]           │
├─────────────────────────────┤
│ Popular Workouts            │
│                             │
│ 💪 PPL Split by Coach Jay   │
│ ⭐⭐⭐⭐⭐ (2.3K saves)      │
│ [Preview] [Clone]           │
│                             │
│ 🦵 Leg Day Destroyer        │
│ ⭐⭐⭐⭐⭐ (1.8K saves)      │
│ [Preview] [Clone]           │
├─────────────────────────────┤
│ Form Tips                   │
│ 📌 Squat: "Chest up, knees  │
│    track toes - Coach Mike" │
├─────────────────────────────┤
│ [View All] [Submit Tip]     │
└─────────────────────────────┘
```

#### 7. **Notes** (Form Tips, Injury Log)

```
┌─────────────────────────────┐
│ Form Tips & Notes           │
├─────────────────────────────┤
│ [+ New Note]                │
├─────────────────────────────┤
│ Form Cues                   │
│                             │
│ Bench Press (Apr 27)        │
│ "Focus on bar path -        │
│  vertical line, slightly    │
│  chest touch"               │
│ [Edit] [Delete]             │
│                             │
│ Squat (Apr 26)              │
│ "Knees caving - stretch     │
│  hip flexors before"        │
│ [Edit] [Delete]             │
├─────────────────────────────┤
│ Injury Log                  │
│ Shoulder Pain (Apr 20)      │
│ Severity: 4/10              │
│ Exercises to avoid:         │
│ - Overhead Press            │
│ [Add Exercise] [Resolve]    │
└─────────────────────────────┘
```

#### 8. **Settings** (Profile, Preferences)

```
┌─────────────────────────────┐
│ Settings                    │
├─────────────────────────────┤
│ ⚙️ Profile                  │
│ [Name: Alex]                │
│ [Age: 28] [Height: 180cm]   │
│ [Weight: 185 lbs]           │
│ [Goal: Build Muscle]        │
│ [Experience: Intermediate]  │
│ [Edit Profile]              │
├─────────────────────────────┤
│ 🎨 Display                  │
│ Theme: [Dark ▼]             │
│ Language: [English ▼]       │
│ Units: [Pounds (lbs) ▼]    │
├─────────────────────────────┤
│ 🔔 Notifications            │
│ ☑ Rest day reminders        │
│ ☑ PR achievements           │
│ ☐ Community updates         │
├─────────────────────────────┤
│ 📊 Data                     │
│ [Export Workout Data]       │
│ [Delete All Data]           │
│ [Reset to Defaults]         │
├─────────────────────────────┤
│ About v1.0 | Help | Privacy │
└─────────────────────────────┘
```

---

## 🧩 CORE MODULES

### 1. **DB Module** (Supabase REST Wrapper)

```javascript
const DB = {
  async get(id) { /* Fetch data by ID */ },
  async set(id, data) { /* Save/upsert data */ },
  async delete(id) { /* Delete data */ },
  async deleteAll(prefix) { /* Bulk delete */ },
  async getAll(prefix) { /* Fetch multiple */ }
};
```

**Data Keys:**

- `profile` - User stats, goals, exp level
- `workout_YYYY-MM-DD` - Daily logs
- `exercise_history` - All-time logs
- `prs` - Personal records
- `workout_templates` - Saved plans
- `progress_notes` - Form/injury notes

### 2. **CALC Module** (Workout Calculations)

```javascript
const CALC = {
  // Strength standards by weight class
  getStrengthStandard(lift, bodyweight, gender) { },
  
  // Calculate 1RM from reps
  estimatedOneRM(weight, reps) { },
  
  // Training volume = sets × reps × weight
  calculateVolume(sets) { },
  
  // Total session metrics
  sessionStats(exercises) { },
  
  // Muscle group categorization
  getMuscleGroups(exerciseList) { },
  
  // Workout difficulty score
  difficultyScore(volume, intensity, duration) { }
};
```

### 3. **EXERCISES Module** (Exercise Database)

```javascript
const EXERCISES = {
  // 200+ exercises with metadata
  data: [
    {
      id: 'bench_press',
      name: 'Barbell Bench Press',
      equipment: 'barbell',
      muscleGroups: ['chest', 'triceps', 'shoulders'],
      difficulty: 'intermediate',
      formCues: [...],
      commonVariations: [...]
    },
    // ... 199 more exercises
  ],
  
  getByMuscle(muscle) { },
  getByEquipment(equipment) { }
};
```

### 4. **WORKOUTS Module** (Workout Templates)

```javascript
const WORKOUTS = {
  // Pre-built templates
  templates: [
    {
      id: 'ppl_a',
      name: 'Push/Pull/Legs - Push Day',
      focus: ['chest', 'shoulders', 'triceps'],
      exercises: [
        { exerciseId: 'bench_press', sets: 4, reps: 6, rest: 180 },
        { exerciseId: 'incline_press', sets: 3, reps: 8, rest: 120 },
        // ...
      ],
      difficulty: 'intermediate',
      estimatedDuration: 50
    },
    // ... 20+ templates
  ]
};
```

### 5. **PLANS Module** (Smart Planning Engine)

```javascript
const PLAN = {
  // Generate next workout based on:
  // - User goals (strength, hypertrophy, endurance)
  // - Experience level
  // - Equipment availability
  // - Last workout done
  // - Recovery status
  generateNextWorkout(userProfile, history) { },
  
  // Periodization: rotating focus
  getPeriodization(goal, week) { },
  
  // Deload suggestions
  shouldDeload(history) { }
};
```

### 6. **PROGRESS Module** (Analytics & Tracking)

```javascript
const PROGRESS = {
  // Track personal records
  updatePR(exerciseId, weight, reps, date) { },
  getPRHistory(exerciseId) { },
  
  // Calculate trends
  getTrend(exerciseId, days) { }, // ↑ +15 lbs
  
  // Strength curve graph data
  getStrengthCurve(exerciseId) { },
  
  // Volume analytics
  getVolumeByMuscle(startDate, endDate) { },
  getVolumeByWeek(weeks) { }
};
```

### 7. **LANG Module** (Translations)

```javascript
const LANG = {
  en: {
    // UI text
    today: 'Today',
    startWorkout: 'Start Workout',
    logSet: 'Log Set',
    personalBest: 'Personal Best',
    // Exercise names
    benchPress: 'Barbell Bench Press',
    // ... 500+ keys
  },
  es: {
    today: 'Hoy',
    startWorkout: 'Comenzar Entrenamiento',
    // ... Spanish equivalents
  }
};

function T(key) { /* Translate text */ }
```

### 8. **VALID Module** (Validation)

```javascript
const VALID = {
  numeric(value, min, max, fieldName) { },
  
  profile(p) {
    // Validate: age, weight, exp level, goals
  },
  
  exerciseSet(set) {
    // Validate: reps [1-100], weight [0-1000], rpe [1-10]
  },
  
  workoutLog(log) {
    // Validate: all exercises, dates, metrics
  },
  
  sanitizeString(str) {
    // Prevent XSS attacks
  }
};
```

### 9. **OFFLINE Module** (Offline Detection)

```javascript
const OFFLINE = {
  isOnline() { },
  isOffline() { },
  
  showOfflineBanner() { },
  removeOfflineBanner() { },
  
  // Queue workout logs when offline
  queueOperation(operation) { },
  retryQueuedOperations() { }
};
```

---

## 📊 DATA MODELS

### Profile Object

```javascript
{
  id: 'profile',
  data: {
    name: 'Alex',
    gender: 'male',
    age: 28,
    height: 180,           // cm
    weight: 185,           // lbs
    goal: 'build',         // 'build', 'strength', 'endurance', 'weight-loss'
    experience: 'intermediate',  // 'beginner', 'intermediate', 'advanced'
    units: 'lbs',          // 'lbs' or 'kg'
    createdAt: '2024-01-15T10:00:00Z',
    language: 'en',
    theme: 'dark'
  }
}
```

### Workout Log

```javascript
{
  id: 'workout_2024-04-27',
  data: {
    date: '2024-04-27',
    startTime: '18:30',
    endTime: '19:32',
    focus: ['chest', 'triceps'],
    totalVolume: 24500,    // total weight moved
    avgIntensity: 7.2,     // average RPE
    exercises: [
      {
        exerciseId: 'bench_press',
        name: 'Barbell Bench Press',
        sets: [
          { reps: 8, weight: 185, rpe: 7 },
          { reps: 7, weight: 185, rpe: 8 },
          { reps: 9, weight: 180, rpe: 7 }
        ],
        notes: 'Left shoulder felt tight'
      },
      // ... more exercises
    ],
    notes: 'Good session, felt strong'
  }
}
```

### Personal Record (PR)

```javascript
{
  exerciseId: 'bench_press',
  weight: 225,
  reps: 5,
  date: '2024-04-15',
  age: 28,
  bodyweight: 185
}
```

### Exercise Set

```javascript
{
  exerciseId: 'bench_press',
  reps: 8,
  weight: 185,
  rpe: 7,              // Rate of Perceived Exertion (1-10)
  notes: 'Good form'
}
```

---

## 🧠 STATE MANAGEMENT

### Global State Object

```javascript
const S = {
  // Profile
  profile: { /* User data */ },
  
  // Session
  view: 'today',        // Current view
  viewDate: '2024-04-27',
  language: 'en',
  theme: 'dark',
  
  // Workout Data
  workouts: {},         // All workout logs
  exercises: {},        // Exercise database
  workoutTemplates: {},
  prs: {},
  progressNotes: [],
  
  // UI State
  currentWorkout: null, // Active workout in progress
  modals: {
    logSet: false,
    selectExercise: false,
    editProfile: false
  },
  
  // Offline
  isOnline: true,
  queuedOps: []
};
```

### State Persistence

- **Local:** `S` object kept in memory during session
- **Database:** Changes synced to Supabase `gym_data` table
- **Recovery:** Load from DB on app boot (same as Diet Tracker)

---

## ✨ FEATURE BREAKDOWN

### Phase 1: MVP (2-3 weeks)

**Must-have for launch:**

- ✅ User profile setup (name, weight, goal, experience)
- ✅ Log today's workout (add exercises, sets, reps, weight)
- ✅ View workout history (last 30 days)
- ✅ Track personal records (1RM, best sets)
- ✅ Basic analytics (weekly volume, avg intensity)
- ✅ Settings (theme, language, units)
- ✅ Error handling & input validation
- ✅ Offline mode with sync
- ✅ Supabase backend ready

### Phase 2: Analytics & Planning (1-2 weeks)

- 📊 Strength curve graphs (weight progression over time)
- 📈 Volume by muscle group breakdown
- 🎯 Suggested next workouts (based on PPL/Upper-Lower/Full Body)
- 📌 Workout templates (save custom plans)
- 🛒 Equipment tracker (what's available at your gym)
- 💬 Form tips (markdown notes per exercise)

### Phase 3: Community & Advanced (1-2 weeks)

- 👥 Share workouts with community
- ⭐ Popular workout templates
- 🏆 Strength standards comparison
- 📱 Mobile app notifications
- 🔐 User authentication & accounts
- 📤 Export workout data (CSV/JSON)

---

## 🛠️ IMPLEMENTATION ROADMAP

### Step 1: Project Setup

```bash
# Create repo
git init gym-tracker
cd gym-tracker

# Create main file
touch gym-tracker.html

# Setup Cloudflare deployment
# - Create Cloudflare Pages project
# - Link GitHub repo
# - Add environment variables (SUPABASE_URL, SUPABASE_KEY)

# Create local config
cp config.example.js config.js
# User fills in local Supabase credentials
```

### Step 2: Build HTML Structure

- Setup viewport meta tags (mobile-first)
- Create CSS token system (colors, spacing, animations)
- Build bottom nav (8 screens)
- Create modal overlay system (log set, select exercise, edit profile)
- Add toast notification system

### Step 3: Implement JavaScript Modules (in order)

1. **DB** - Supabase wrapper + offline queueing
2. **CALC** - Volume, 1RM, strength standards
3. **EXERCISES** - Exercise database (200+ exercises)
4. **WORKOUTS** - Workout templates (20+ plans)
5. **VALID** - Input validation & sanitization
6. **LANG** - Translations (EN/ES)
7. **OFFLINE** - Offline detection & recovery
8. **PROGRESS** - PR tracking, analytics
9. **PLANS** - Smart workout suggestions

### Step 4: Build Views (in order)

1. **Settings** - Profile setup (required first)
2. **Today** - Active workout logging
3. **Workouts** - History & templates
4. **Progress** - PR tracking & curves
5. **Analytics** - Volume, intensity, trends
6. **Equipment** - Availability & alternatives
7. **Notes** - Form tips & injury log
8. **Community** - Shared workouts (if time)

### Step 5: Testing & Polish

- Manual testing on mobile device
- Check all views render correctly
- Test offline mode
- Validate all inputs
- Test translations (EN/ES)
- Performance optimization
- Deploy to Cloudflare Pages

### Step 6: Documentation

- README with setup instructions
- Database schema documentation
- API endpoint reference
- Translation keys glossary
- Troubleshooting guide

---

## 📱 RESPONSIVE DESIGN

### Breakpoints

```css
/* Mobile First (default) */
#view { max-width: 720px; margin: 0 auto; }

/* Desktop (optional) */
@media (min-width: 1024px) {
  /* Sidebar nav instead of bottom nav */
}
```

### Safe Areas (iPhone notch support)

```css
#nav { padding-bottom: env(safe-area-inset-bottom); }
#header { padding-top: env(safe-area-inset-top); }
```

---

## ⚠️ ERROR HANDLING

### All Operations Protected

```javascript
// Every DB call wrapped
try {
  await DB.set('workout_2024-04-27', workoutLog);
  flash('Workout saved ✓', 'ok');
} catch(e) {
  console.error('Save error:', e);
  if (OFFLINE.isOffline()) {
    OFFLINE.queueOperation(async () => {
      await DB.set('workout_2024-04-27', workoutLog);
    });
    flash('Offline: saved locally, will sync', 'info');
  } else {
    flash('Failed to save - check connection', 'er');
  }
}
```

### Input Validation

```javascript
// All numeric inputs validated
const reps = VALID.numeric(input, 1, 100, 'Reps');
const weight = VALID.numeric(input, 0, 1000, 'Weight');
const rpe = VALID.numeric(input, 1, 10, 'RPE');
```

### Error UI

- User-friendly error messages (not technical errors)
- Reload button on critical failures
- Toast notifications for all operations
- Form validation before submission

---

## 🎯 SUCCESS METRICS

### MVP Launch Checklist

- [ ] Can create profile and set goals
- [ ] Can log workout with multiple exercises
- [ ] Can view personal records
- [ ] Can see weekly analytics
- [ ] Offline mode works (queue + sync)
- [ ] No syntax errors
- [ ] Responsive on mobile
- [ ] All inputs validated
- [ ] Supabase saving data
- [ ] Cloudflare deployment working

### Post-Launch Metrics

- Page load time < 2s
- No memory leaks (check DevTools)
- 0 uncaught errors
- 100% translation coverage (EN/ES)
- Works offline for 30+ min
- Auto-syncs when online

---

## 📚 TECHNICAL STACK SUMMARY

| Component | Technology | Reason |
|-----------|-----------|--------|
| Frontend | HTML5 SPA (single file) | No build step, simple deployment |
| Styling | CSS3 with variables | 3-theme support, responsive |
| Language | Vanilla JavaScript | No dependencies, fast |
| Database | Supabase PostgreSQL | Managed, REST API, RLS |
| API | REST (no real-time) | Simpler, faster, reliable |
| Auth | No auth (initial) | Permissive RLS, add later |
| Hosting | Cloudflare Pages | Auto-deploy, free tier, edge |
| Secrets | Cloudflare Function | Runtime injection, zero in git |
| Deployment | Git push (main branch) | Auto-deploy via CI/CD |

---

## 🚀 FINAL NOTES

### Constraints to Follow (from Diet Tracker success)

1. **Single file only** - All code in gym-tracker.html (no separate files)
2. **No dependencies** - Vanilla JS only, no libraries
3. **Mobile-first** - Optimized for gym use on phones
4. **Offline-first** - Queue & retry pattern
5. **Error-safe** - Try-catch everywhere, user-friendly messages
6. **Validated** - All inputs checked before save
7. **Secure** - Zero credentials in code/git
8. **Bilingual** - Full EN/ES support
9. **Accessible** - Keyboard nav, high contrast, clear labels
10. **Performant** - <2s load, 60fps animations, <5MB total

### Comparison: Diet Tracker → Gym Tracker

| Aspect | Diet Tracker | Gym Tracker |
|--------|-------------|-----------|
| Focus | Nutrition | Workouts |
| Metrics | Calories, macros | Reps, sets, weight |
| Main Calc | BMR, TDEE | 1RM, volume, intensity |
| Templates | 42 meals | 200+ exercises |
| History | Daily logs | Workout logs |
| Analytics | Macro breakdown | Volume by muscle |
| Goals | Weight loss, muscle | Strength, size |
| Tracking | Food consumed | Sets/reps/weight |

---

## 📋 READY TO BUILD

This specification is **production-ready**. Any agent can implement this by:

1. Reading this document (architecture + modules)
2. Creating gym-tracker.html (single file)
3. Following the module structure (DB → CALC → EXERCISES → WORKOUTS → etc.)
4. Building views in order (Settings → Today → Workouts → Progress → Analytics → Equipment → Notes → Community)
5. Implementing error handling + validation everywhere
6. Testing on mobile device
7. Deploying to Cloudflare Pages

**Estimated effort:** 40-60 hours for MVP  
**Estimated effort:** 60-80 hours for Phase 1+2  
**Estimated effort:** 100+ hours for full feature set
