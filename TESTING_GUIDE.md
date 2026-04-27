# 🧪 Testing Guide - Gym Tracker

## Quick Start Testing

### 1. Local Testing Setup
```bash
# Ensure you have config.js with credentials
# Open gym-tracker.html in browser
# F12 to open DevTools Console
```

---

## Test Scenarios

### ✅ Basic Functionality Tests

#### Test 1: Profile Setup
- [ ] Open app → Settings tab
- [ ] Enter name, age, weight
- [ ] Change theme (Dark/Light/Pink)
- [ ] Change language (English/Español)
- [ ] Data persists after refresh

**Expected:** Profile info saves, theme changes immediately, language switches UI

---

#### Test 2: Add Workout
- [ ] Click "Today" tab
- [ ] Click "+ Add Exercise"
- [ ] Enter exercise name: "Bench Press"
- [ ] Enter reps: "8"
- [ ] Enter weight: "100"
- [ ] Enter sets: "3"
- [ ] Verify exercise appears in list
- [ ] Verify volume calculated correctly

**Expected:** 3 sets of 8×100kg = 2400kg volume displayed

---

#### Test 3: Delete Exercise
- [ ] Add an exercise
- [ ] Click the ✕ button
- [ ] Verify exercise is removed
- [ ] Click "Save Notes" to save

**Expected:** Exercise removed, no errors

---

#### Test 4: View Workouts History
- [ ] Add a workout on Today tab
- [ ] Go to Workouts tab
- [ ] Verify today's workout shows in history
- [ ] Click workout to view details
- [ ] Verify all exercises and sets display correctly

**Expected:** Workout history shows with accurate data

---

#### Test 5: Save as Template
- [ ] Add workout with 3-5 exercises
- [ ] Go to Workouts tab
- [ ] Click "+ Save Current as Template"
- [ ] Enter template name: "Chest Day"
- [ ] Verify template appears in "My Templates" section

**Expected:** Template saves and can be cloned

---

#### Test 6: Clone Template
- [ ] Go to Workouts → Templates
- [ ] Click "Use" button on template
- [ ] Go to Today tab
- [ ] Verify template exercises loaded for today

**Expected:** All exercises from template appear in today's workout

---

#### Test 7: Progress & PRs
- [ ] Add several workouts with different weights
- [ ] Go to Progress tab
- [ ] Verify PRs are calculated correctly
- [ ] Check trend indicators (↑ +X kg)
- [ ] Verify 1RM estimates

**Expected:** PRs updated, trends show progress

---

#### Test 8: Analytics
- [ ] Add 5+ workouts with various exercises
- [ ] Go to Analytics tab
- [ ] Verify volume calculations
- [ ] Check muscle group breakdown
- [ ] Verify intensity distribution

**Expected:** Accurate volume, breakdown by muscle group, RPE distribution

---

#### Test 9: Equipment Tracking
- [ ] Go to Equipment tab
- [ ] Toggle equipment availability
- [ ] Click "+ Add Equipment"
- [ ] Add "Smith Machine"
- [ ] Verify it appears in list
- [ ] Toggle status on/off

**Expected:** Equipment tracking works, alternatives suggest alternatives

---

#### Test 10: Form Tips & Injury Notes
- [ ] Go to Notes tab
- [ ] Click "+ Form Tip"
- [ ] Add: Exercise="Squat", Tip="Chest up, depth matters"
- [ ] Click "+ Injury Log"
- [ ] Add: Exercise="Shoulder", Severity="7", Note="Impingement on OHP"
- [ ] Verify both appear in respective sections

**Expected:** Tips and injuries logged correctly with different styling

---

#### Test 11: Community View
- [ ] Go to Community tab
- [ ] See popular workouts list
- [ ] Click "Clone" on a workout
- [ ] Go to Today tab
- [ ] Verify cloned workout loaded

**Expected:** Can clone community workouts successfully

---

#### Test 12: Export Data
- [ ] Go to Settings tab
- [ ] Click "📥 Export Data"
- [ ] JSON file downloads: `gym-tracker-data.json`
- [ ] Open file and verify all data is there

**Expected:** Complete backup file downloads

---

### 🔌 Offline Mode Tests

#### Test 13: Offline Operation
1. Open DevTools (F12)
2. Go to **Network** tab
3. Check **Offline** checkbox
4. In app, add a new exercise
5. Click "Save Notes"
6. Should see: "Offline: saved locally" toast

**Expected:** Changes queue locally without error

---

#### Test 14: Offline to Online Sync
1. While offline, add 3 exercises
2. Switch offline mode OFF in DevTools
3. Watch for "Back online! Syncing..." toast
4. Refresh page
5. Verify all offline changes persisted

**Expected:** Data auto-syncs when connection restored

---

#### Test 15: Offline Banner
1. Go offline
2. Any view should show offline banner
3. Go online
4. Banner disappears

**Expected:** User aware of offline status

---

### 🗄️ Database Integration Tests

#### Test 16: Data Persistence
1. Add workout with multiple exercises
2. Note the date and volume
3. Close browser completely
4. Reopen app
5. Go to Workouts tab
6. Find the workout from step 2
7. Verify data is identical

**Expected:** Data persists across sessions via Supabase

---

#### Test 17: Multiple Workouts
1. Add 5 workouts on different dates
2. Go to Workouts tab
3. Verify all 5 show in history
4. Click each one and verify details
5. Go to Progress tab
6. Verify PRs updated correctly

**Expected:** Multiple workouts tracked independently

---

#### Test 18: Large Dataset
1. Simulate adding 30 workouts (or manually add several)
2. Go to Analytics tab
3. Verify performance (should load < 1 second)
4. Scroll through data
5. No lag or freezing

**Expected:** App remains responsive with larger datasets

---

### 🎨 UI/UX Tests

#### Test 19: Responsive Design
1. Test on mobile device (or DevTools mobile view)
2. All buttons clickable and appropriately sized
3. Text readable without zooming
4. No horizontal scroll needed
5. Bottom nav always accessible

**Expected:** Perfect mobile experience

---

#### Test 20: Theme Switching
1. Change to Light theme
2. Verify all colors readable
3. Change to Pink theme
4. Change back to Dark
5. Refresh page
6. Verify theme persists

**Expected:** All themes work, persist across sessions

---

#### Test 21: Language Switching
1. Switch to Español
2. UI text changes to Spanish
3. Add a workout
4. Switch back to English
5. Text switches back

**Expected:** Bilingual support works for all UI elements

---

### ⚠️ Error Handling Tests

#### Test 22: Input Validation
1. Try to add exercise with:
   - Negative reps → Should error
   - Weight > 1000 → Should error
   - Non-numeric reps → Should error
2. Verify error messages are user-friendly

**Expected:** Clear error messages, no data loss

---

#### Test 23: Missing Data Handling
1. Try to save workout with no exercises
2. Try to save note with empty text
3. Verify graceful handling

**Expected:** Helpful error messages

---

#### Test 24: Connection Loss Handling
1. Start a save operation
2. Disconnect internet
3. Should queue operation
4. Reconnect
5. Should auto-retry

**Expected:** No data loss due to connection issues

---

## Performance Tests

#### Test 25: Load Time
- [ ] First load: < 2 seconds
- [ ] View switching: < 0.5 seconds
- [ ] Data calculations: instant

**Expected:** Fast, responsive app

---

#### Test 26: Memory Usage
1. Open DevTools → Memory
2. Take heap snapshot (baseline)
3. Add 10 workouts
4. Navigate between views 5 times
5. Take heap snapshot (compare)
6. No significant growth

**Expected:** < 10MB memory usage, no leaks

---

## Deployment Tests

#### Test 27: Production Deployment
1. Deploy to Cloudflare Pages
2. Access production URL
3. Test all features work
4. Verify credentials loaded correctly
5. Add data and verify saves to Supabase

**Expected:** Full functionality in production

---

#### Test 28: Environment Variables
1. Verify SUPABASE_URL in Cloudflare Pages
2. Verify SUPABASE_KEY set
3. Test save operation
4. Verify data appears in Supabase console

**Expected:** Credentials properly injected

---

## Browser Compatibility

Test in these browsers:
- [ ] Chrome/Chromium (latest)
- [ ] Safari (latest)
- [ ] Firefox (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## Regression Tests (Before Each Release)

Run these every release:
1. ✅ Profile creation
2. ✅ Workout logging
3. ✅ Data persistence
4. ✅ Offline mode
5. ✅ All 8 views render
6. ✅ Theme switching
7. ✅ Language switching
8. ✅ Export data

---

## Test Report Template

```
Date: YYYY-MM-DD
Tester: [Name]
Browser: [Name + Version]
Device: [Desktop/Mobile + Model]

PASSED: [Count]
FAILED: [Count]
ISSUES FOUND:
- [Issue 1]: [Description] [Severity]
- [Issue 2]: [Description] [Severity]

Notes:
[Any additional observations]
```

---

## Known Limitations (Current MVP)

- [ ] No user authentication (all data public)
- [ ] Community workouts are hardcoded (not real)
- [ ] No real-time sync across devices
- [ ] No notifications/reminders
- [ ] Limited analytics (no graphs yet)
- [ ] No mobile app (web only)

These will be added in Phase 2+

---

## Quick Test Checklist

Before marking MVP complete:
- [ ] All 8 views work
- [ ] Can add/edit/delete workouts
- [ ] Data persists across sessions
- [ ] Offline mode works
- [ ] PRs calculated correctly
- [ ] Analytics show data
- [ ] Responsive on mobile
- [ ] No console errors
- [ ] Export works
- [ ] No memory leaks

✅ = Ready for beta testing
