# 🏋️ GYM WORKOUT TRACKER - AGENT BUILD PROMPT

**Ready to copy & paste for your new agent**  
**Template:** Diet Tracker proven architecture  
**Status:** Production-ready specification  
**Date:** April 27, 2026

---

## 🎯 BUILD TASK

Build a **Gym Workout Tracker** - a single-file mobile SPA for logging workouts, tracking PRs, and analyzing fitness progress.

---

## 📋 PROJECT BRIEF

### Overview

Create a Gym Workout Tracker using the **Diet Tracker as your architectural template**. Same single-file SPA pattern, same security approach, same error handling rigor. But focus on:

- 💪 Exercise logging (sets, reps, weight, RPE)
- 📊 Personal record tracking (1RM, progression curves)
- 📈 Analytics (volume by muscle group, intensity trends)
- 🎯 Smart workout suggestions (based on goals & history)
- 📱 Mobile-first design (optimized for gym use on phone)

### Key Constraints (Copy Diet Tracker Success)

- ✅ Single HTML file (gym-tracker.html) - no separate JS/CSS files
- ✅ Vanilla JavaScript only - zero dependencies
- ✅ Supabase REST API backend (PostgreSQL)
- ✅ Cloudflare Pages deployment (auto-deploy from GitHub)
- ✅ Zero hardcoded secrets (Cloudflare Function injection)
- ✅ Comprehensive error handling (try-catch everywhere)
- ✅ Input validation on all numeric fields
- ✅ Memory leak prevention (cleanup on navigation)
- ✅ Offline mode with operation queueing
- ✅ Bilingual support (EN/ES)
- ✅ 3-theme system (dark/light/pink)

---

## 🏗️ ARCHITECTURE

### Tech Stack

```
gym-tracker.html (single file SPA)
    ├─ CSS (500 lines): responsive, 3 themes, animations
    └─ JavaScript (3500+ lines): 9 modules + 8 views
        ├─ DB: Supabase REST wrapper
        ├─ CALC: Workout math (volume, 1RM, standards)
        ├─ EXERCISES: 200+ exercise database
        ├─ WORKOUTS: 20+ pre-built templates
        ├─ PLANS: Smart workout suggestions
        ├─ PROGRESS: PR tracking & analytics
        ├─ LANG: Translations (EN/ES)
        ├─ VALID: Input validation
        ├─ OFFLINE: Offline detection & queuing
        └─ 8 Views (bottom nav)
             ├─ Today (active workout)
             ├─ Workouts (history + templates)
             ├─ Progress (PRs, curves)
             ├─ Analytics (volume, intensity)
             ├─ Equipment (availability)
             ├─ Community (shared workouts)
             ├─ Notes (form tips, injuries)
             └─ Settings (profile, preferences)
```

### Deployment Architecture

```
GitHub Repo
    ↓ (push to main)
Cloudflare Pages
    ├─ functions/api/env.js (credential injection)
    └─ gym-tracker.html (deployed)
    ↓
    User Browser (single file loads, all JS in browser)
    ↓
Supabase REST API
    ↓
PostgreSQL (gym_data table)
```

---

## 🗄️ DATABASE

### Supabase Setup

```sql
CREATE TABLE gym_data (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE gym_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow all" ON gym_data
  FOR ALL USING (true) WITH CHECK (true);
```

### Data Keys Stored in gym_data Table

```
profile                    → User stats, goals, exp level
workout_YYYY-MM-DD        → Daily workout logs (exercises, sets)
exercise_history          → All-time exercise logs
prs                       → Personal records by exercise
workout_templates         → Saved custom workout plans
progress_notes            → Form tips, injury log
preferences               → Theme, language, units
```

### Data Models

**Profile:**

```javascript
{
  name, gender, age, height, weight, goal, experience, units, createdAt
  goal: 'build' | 'strength' | 'endurance' | 'weight-loss'
  experience: 'beginner' | 'intermediate' | 'advanced'
  units: 'lbs' | 'kg'
}
```

**Workout Log:**

```javascript
{
  date, startTime, endTime, focus, totalVolume, avgIntensity,
  exercises: [{
    exerciseId, name, sets: [{reps, weight, rpe}], notes
  }],
  notes
}
```

**Exercise Set:**

```javascript
{
  exerciseId, reps, weight, rpe (1-10), notes
}
```

**Personal Record:**

```javascript
{
  exerciseId, weight, reps, date, bodyweight
}
```

---

## 🔐 SECURITY (ZERO HARDCODED SECRETS)

### Cloudflare Function Injection

```javascript
// functions/api/env.js
export async function onRequest(context) {
  return new Response(
    `window.__ENV = {
      SUPABASE_URL: "${context.env.SUPABASE_URL}",
      SUPABASE_KEY: "${context.env.SUPABASE_KEY}"
    };`,
    { headers: { 'Content-Type': 'application/javascript' } }
  );
}
```

### In gym-tracker.html

```html
<script src="/api/env"></script>
<script>
  const SB_URL = window.__ENV?.SUPABASE_URL || '';
  const SB_KEY = window.__ENV?.SUPABASE_KEY || '';
</script>
```

### Environment Setup

```
Cloudflare Pages Dashboard → Environment Variables:
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### .gitignore

```
config.js
.env.local
.env
```

---

## 🎨 UI/UX DESIGN

### Color Scheme

```css
/* Accent: Blue (different from Diet Tracker's green) */
--ac: #3B82F6              /* Primary blue */
--ac2: #1D4ED8             /* Darker blue */

/* Metric-specific colors */
--reps: #8B5CF6            /* Purple */
--weight: #F59E0B          /* Amber */
--intensity: #EF4444       /* Red (RPE) */
--volume: #10B981          /* Green (total) */
--time: #3B82F6            /* Blue (duration) */
```

### Navigation (8 Screens, Fixed Bottom Bar)

```
🏠 Today     📋 Workouts   📈 Progress  📊 Analytics
🛒 Equipment 💬 Community  📝 Notes     ⚙️ Settings
```

### Key Screens

**Today (Active Workout):**

```
- Session timer (elapsed time)
- Current exercise with sets logged
- Completed exercises
- [Add Exercise] [End Workout] buttons
```

**Workouts (History & Templates):**

```
- Recent workouts (last 30 days)
- Pre-built templates (PPL, Upper/Lower, Full Body)
- Custom saved workouts
- [Search] [Create Custom] buttons
```

**Progress (PRs & Curves):**

```
- Strength curves (line graph: weight over time)
- Personal records (best lift per exercise)
- PR date & trend (↑ +X lbs over Y days)
- [All PRs] [Export] buttons
```

**Analytics (Volume, Intensity):**

```
- Total volume (weight moved per week)
- Average intensity (RPE)
- Volume by muscle group (bar chart)
- Intensity distribution (% easy/moderate/hard)
```

**Equipment (Availability & Alternatives):**

```
- Gym equipment status (✓ available, ✗ unavailable)
- Alternative exercises (when primary unavailable)
- Home gym checklist
- [+ Add Equipment] [Edit Setup] buttons
```

**Community (Optional MVP+1):**

```
- Popular shared workouts
- Form tips from community
- [Preview] [Clone] buttons
```

**Notes (Form & Injury Log):**

```
- Form cues per exercise
- Injury notes with severity
- Exercises to avoid (when injured)
- [+ New Note] button
```

**Settings (Profile & Preferences):**

```
- Profile: name, age, height, weight, goal, exp level
- Display: theme, language, units
- Notifications: toggles
- Data: [Export] [Delete All] [Reset]
```

---

## 🧩 JAVASCRIPT MODULES

### 1. DB Module (Supabase Wrapper)

```javascript
const DB = {
  async get(id) { /* GET request */ },
  async set(id, data) { /* POST/UPSERT */ },
  async delete(id) { /* DELETE */ },
  async deleteAll(prefix) { /* BULK DELETE */ },
  async getAll(prefix) { /* GET multiple */ }
};
```

### 2. CALC Module (Workout Math)

```javascript
const CALC = {
  estimatedOneRM(weight, reps) { /* Epley formula */ },
  calculateVolume(sets) { /* sets × reps × weight */ },
  sessionStats(exercises) { /* total volume, avg intensity */ },
  difficultyScore(volume, intensity, duration) { },
  getStrengthStandard(lift, bodyweight, gender) { }
};
```

### 3. EXERCISES Module (200+ Database)

```javascript
const EXERCISES = {
  data: [
    {
      id: 'bench_press',
      name: 'Barbell Bench Press',
      equipment: 'barbell',
      muscleGroups: ['chest', 'triceps', 'shoulders'],
      difficulty: 'intermediate',
      formCues: [...],
      variants: [...]
    },
    // ... 199 more
  ],
  getByMuscle(muscle) { },
  getByEquipment(equipment) { }
};
```

### 4. WORKOUTS Module (Templates)

```javascript
const WORKOUTS = {
  templates: [
    {
      id: 'ppl_push',
      name: 'PPL - Push Day',
      focus: ['chest', 'shoulders', 'triceps'],
      exercises: [{exerciseId, sets, reps, rest}, ...],
      difficulty: 'intermediate',
      duration: 50
    },
    // ... 19 more templates
  ]
};
```

### 5. PLANS Module (Smart Suggestions)

```javascript
const PLAN = {
  generateNextWorkout(profile, history) { },
  getPeriodization(goal, week) { },
  shouldDeload(history) { }
};
```

### 6. PROGRESS Module (Analytics & PRs)

```javascript
const PROGRESS = {
  updatePR(exerciseId, weight, reps, date) { },
  getPRHistory(exerciseId) { },
  getTrend(exerciseId, days) { },
  getStrengthCurve(exerciseId) { },
  getVolumeByMuscle(startDate, endDate) { }
};
```

### 7. LANG Module (EN/ES Translations)

```javascript
const LANG = {
  en: { /* 500+ keys */ },
  es: { /* Spanish */ }
};

function T(key) { /* Get translation */ }
```

### 8. VALID Module (Input Validation)

```javascript
const VALID = {
  numeric(value, min, max, fieldName) { },
  exerciseSet(set) { /* Validate reps, weight, rpe */ },
  workoutLog(log) { },
  profile(p) { },
  sanitizeString(str) { }
};
```

### 9. OFFLINE Module (Offline Detection)

```javascript
const OFFLINE = {
  isOnline() { },
  showOfflineBanner() { },
  queueOperation(operation) { },
  retryQueuedOperations() { }
};
```

---

## 🏃 IMPLEMENTATION ROADMAP

### Phase 1: Foundation (Week 1)

- [x] Create gym-tracker.html structure
- [x] Setup CSS (colors, layout, animations)
- [x] Implement DB module (Supabase connection)
- [x] Implement CALC module (volume, 1RM)
- [x] Implement EXERCISES module (200+ exercises)
- [x] Setup LANG module (EN/ES)
- [x] Implement VALID module (validation)
- [x] Implement OFFLINE module

### Phase 2: Core Features (Week 1-2)

- [x] Settings view (profile setup)
- [x] Today view (workout logging)
- [x] Workouts view (history + templates)
- [x] Progress view (PRs, strength curves)
- [x] Analytics view (volume, intensity)
- [x] Equipment view (tracker)
- [x] Notes view (form tips, injuries)
- [x] Error boundaries & input validation
- [x] Offline queue & sync

### Phase 3: Polish (Week 2)

- [x] Test all features on mobile
- [x] Verify translations (EN/ES)
- [x] Test offline mode thoroughly
- [x] Performance optimization
- [x] Deploy to Cloudflare Pages
- [x] Documentation & README

### Phase 4+: Community & Advanced (Optional)

- [ ] Community view (shared workouts)
- [ ] User authentication
- [ ] Data export (CSV/JSON)
- [ ] Push notifications
- [ ] Mobile app version

---

## ✅ BUILD STEPS (IN ORDER)

1. **Create gym-tracker.html**
   - DOCTYPE, meta tags (viewport, mobile-web-app)
   - CSS: tokens, reset, animations, layouts, components
   - Script: Load env.js for credentials

2. **Implement DB Module First**
   - Test Supabase connection
   - Verify credentials injection
   - Test get/set/delete operations

3. **Implement CALC Module**
   - Epley formula (1RM estimation)
   - Volume calculation
   - Difficulty scoring

4. **Create EXERCISES Database**
   - 200+ exercises with metadata
   - Muscle groups, equipment, difficulty
   - Form cues for each

5. **Create WORKOUTS Templates**
   - 20+ pre-built plans (PPL, Upper/Lower, Full Body, etc.)
   - Include sets/reps/rest for each
   - Difficulty levels

6. **Implement Other Modules**
   - PLANS (smart suggestions)
   - PROGRESS (PR tracking)
   - LANG (translations)
   - VALID (validation)
   - OFFLINE (offline support)

7. **Build Views (in this order)**
   - Settings first (profile setup)
   - Today (core feature)
   - Workouts (history)
   - Progress (PRs)
   - Analytics (stats)
   - Equipment (tracker)
   - Notes (tips)
   - Community (optional)

8. **Error Handling Everywhere**
   - Try-catch on all render functions
   - Try-catch on all DB operations
   - User-friendly error messages
   - Offline handling

9. **Testing**
   - Manual mobile testing
   - Offline mode testing
   - Input validation testing
   - Translation testing
   - All 3 themes testing

10. **Deploy**
    - Push to GitHub main
    - Cloudflare auto-deploy
    - Verify live URL works

---

## 🔍 CRITICAL SUCCESS FACTORS

### MVP Must-Have

- ✅ Profile creation works
- ✅ Can log workout (add exercises, sets, reps, weight)
- ✅ PRs tracked and displayed correctly
- ✅ Weekly analytics calculate properly
- ✅ Offline mode queues operations
- ✅ Data syncs when online
- ✅ All inputs validated (no corrupted data)
- ✅ No JavaScript errors in console
- ✅ Mobile responsive
- ✅ EN/ES translations complete
- ✅ All 3 themes work

### Performance Targets

- Page load time < 2 seconds
- 60fps animations
- No memory leaks
- <5MB total file size
- Works offline for 30+ minutes

### Security Checklist

- ✅ Zero hardcoded secrets
- ✅ Credentials only in Cloudflare env vars
- ✅ config.js in .gitignore
- ✅ No secrets in git history
- ✅ Input sanitization (XSS prevention)

---

## 📝 ERROR HANDLING PATTERN

```javascript
// Every operation wrapped
try {
  await DB.set('workout_' + date, workoutLog);
  flash('Workout saved ✓', 'ok');
} catch(e) {
  console.error('Save error:', e);
  if (OFFLINE.isOffline()) {
    OFFLINE.queueOperation(async () => {
      await DB.set('workout_' + date, workoutLog);
    });
    flash('Offline: saved locally, will sync', 'info');
  } else {
    flash('Failed to save - check connection', 'er');
  }
}

// All inputs validated before save
try {
  const reps = VALID.numeric(input, 1, 100, 'Reps');
  const weight = VALID.numeric(input, 0, 1000, 'Weight');
  const rpe = VALID.numeric(input, 1, 10, 'RPE');
} catch(e) {
  flash(e.message, 'er');
  return;
}
```

---

## 📊 COMPARISON: Diet Tracker vs Gym Tracker

| Aspect | Diet Tracker | Gym Tracker |
|--------|-------------|-----------|
| Focus | Nutrition | Workouts |
| Metrics | Calories, macros | Reps, sets, weight |
| Main Calc | BMR, TDEE | 1RM, volume, intensity |
| Templates | 42 meals | 200+ exercises |
| Primary Color | #10B981 (green) | #3B82F6 (blue) |
| History | Food logs | Workout logs |
| Analytics | Macro breakdown | Volume by muscle |
| Goals | Weight loss, muscle | Strength, size |

---

## 🚀 DEPLOYMENT

### Pre-Launch Checklist

- [ ] All features implemented
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Offline mode tested
- [ ] Translations complete
- [ ] Themes working
- [ ] Supabase connected
- [ ] Cloudflare env vars set
- [ ] README written
- [ ] Database schema created

### Deploy Steps

```bash
git push origin main
# Cloudflare auto-deploys
# Visit https://gym-tracker-XXXX.pages.dev/
```

---

## 📚 REFERENCE DOCUMENTATION

See **GYM_TRACKER_SPECIFICATION.md** for:

- Complete architecture details
- All 8 screen mockups
- Full data models
- Implementation sequencing
- Testing strategy
- Success metrics

---

## 💡 TIPS FROM DIET TRACKER SUCCESS

1. **Single file only** - Keep everything in gym-tracker.html
2. **Module organization** - Each module has one responsibility
3. **Try-catch everywhere** - No silent failures
4. **Validate all inputs** - Before any save
5. **Offline first** - Queue operations, retry when online
6. **User-friendly messages** - Not technical errors
7. **Memory cleanup** - Prevent leaks on navigation
8. **Incremental commits** - After each feature
9. **Test on real device** - Mobile optimization crucial
10. **Document as you go** - README, code comments

---

## ✨ YOU'RE READY TO BUILD!

This prompt + the GYM_TRACKER_SPECIFICATION.md provide everything needed to build a production-ready app.

**Start with:** Read the spec, then create gym-tracker.html structure  
**Next:** Implement DB module (test Supabase connection first)  
**Then:** Build modules in order (CALC → EXERCISES → WORKOUTS)  
**Finally:** Build views (Settings → Today → Workouts → Progress → Analytics → Equipment → Notes → Community)

**Estimated effort:** 40-60 hours for MVP with all features  
**Difficulty:** Same as Diet Tracker (proven pattern)  
**Success rate:** High (using battle-tested architecture)

---

**Good luck! You've got this. 🏋️**
