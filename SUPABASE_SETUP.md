# 🔧 Supabase Setup Guide

## Prerequisites
- Supabase account (free tier works: https://supabase.com)
- Cloudflare account with Pages project
- Git repository connected to Cloudflare Pages

---

## Step 1: Create Supabase Project

1. Go to https://app.supabase.com
2. Click "New Project"
3. Choose organization (or create one)
4. Enter project name: `gym-tracker`
5. Set strong password
6. Choose region closest to you
7. Click "Create new project" and wait 2-3 minutes

---

## Step 2: Create Database Table

1. In Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Copy and paste this SQL:

```sql
-- Drop table if exists (for clean setup)
DROP TABLE IF EXISTS gym_data CASCADE;

-- Create table
CREATE TABLE gym_data (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE gym_data ENABLE ROW LEVEL SECURITY;

-- Create VERY PERMISSIVE policy (FOR ANON KEY - local testing)
CREATE POLICY "Allow anon public access" ON gym_data
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_gym_data_id ON gym_data(id);
CREATE INDEX IF NOT EXISTS idx_gym_data_created ON gym_data(created_at DESC);
```

4. Click **"Run"** (or Ctrl+Enter)
5. You should see: `Success. No rows returned`

---

## Step 3: Get API Credentials

1. In Supabase dashboard, go to **Settings** (bottom left)
2. Click **"API"**
3. Under "Project API keys", copy:
   - **Project URL** → Save as `SUPABASE_URL`
   - **Anon public key** → Save as `SUPABASE_KEY`

Example:
```
SUPABASE_URL: https://xyzabc.supabase.co
SUPABASE_KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Step 4: Configure Cloudflare Pages

1. Go to https://dash.cloudflare.com
2. Navigate to **Pages** → Your project (gym-tracker)
3. Go to **Settings** → **Environment variables**
4. Add **Production** environment variables:
   - Key: `SUPABASE_URL`
   - Value: (paste your SUPABASE_URL from Step 3)
   - Click "Encrypt"
   - Key: `SUPABASE_KEY`
   - Value: (paste your SUPABASE_KEY from Step 3)
   - Click "Encrypt"

5. Click **"Save"**

---

## Step 5: Local Testing

For local development, create `config.js` file (DO NOT COMMIT):

```javascript
// config.js - LOCAL DEVELOPMENT ONLY
// NEVER commit this file to git

window.__ENV = {
  SUPABASE_URL: 'https://YOUR_PROJECT.supabase.co',
  SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
};
```

Add to `.gitignore`:
```
config.js
.env.local
.env
```

In `gym-tracker.html`, after the credential loading script:
```html
<!-- Cloudflare will inject this on production -->
<script src="/api/env"></script>

<!-- Local fallback for development -->
<script>
  if (!window.__ENV) {
    console.warn('Loading local config...');
    document.write('<script src="config.js"><\/script>');
  }
</script>
```

---

## Step 6: Test Connection

Open browser console (F12) and run:

```javascript
// Test DB connection
(async () => {
  try {
    const url = `${window.__ENV.SUPABASE_URL}/rest/v1/gym_data?select=*`;
    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${window.__ENV.SUPABASE_KEY}` }
    });
    const data = await res.json();
    console.log('✅ Connection successful!', data);
  } catch (e) {
    console.error('❌ Connection failed:', e);
  }
})();
```

Expected output: `✅ Connection successful! []` (empty array on first try)

---

## Step 7: Test Save/Load

In browser console:

```javascript
// Save test data
(async () => {
  try {
    await DB.set('test_profile', { name: 'Test User', age: 25 });
    console.log('✅ Save successful!');
    
    const data = await DB.get('test_profile');
    console.log('✅ Load successful!', data);
  } catch (e) {
    console.error('❌ Error:', e);
  }
})();
```

Expected output:
```
✅ Save successful!
✅ Load successful! { name: 'Test User', age: 25 }
```

---

## Step 8: Deploy to Production

1. Commit all changes:
   ```bash
   git add .
   git commit -m "Add Gym Tracker MVP"
   git push origin main
   ```

2. Cloudflare Pages auto-deploys when main branch is pushed
3. Go to your Pages deployment URL
4. App should load and use Supabase credentials automatically

---

## Troubleshooting

### "Database credentials not loaded"
- Check Cloudflare environment variables are set correctly
- Verify `/api/env` endpoint is accessible
- Check browser console for errors (F12)

### "401 Unauthorized" errors
- SUPABASE_KEY is wrong or expired
- Verify API key in Supabase Settings → API

### Connection timeout
- Check internet connection
- Verify Supabase project is running (check Dashboard)
- Try from different network/VPN

### Data not saving
- Check RLS policy is set correctly (should be "allow all")
- Verify table name is `gym_data`
- Check browser console for errors

---

## Security Checklist

- [ ] Never commit `config.js` to git
- [ ] Never hardcode API keys in HTML/JS
- [ ] Use Cloudflare Functions for credential injection (done in `env.js`)
- [ ] SUPABASE_KEY only in Cloudflare dashboard (not in git)
- [ ] RLS policy allows public access for MVP
- [ ] Consider adding auth in Phase 2

---

## Data Backup

To backup data:

1. Go to Supabase dashboard → **Data** → **gym_data**
2. Export as CSV/JSON
3. Or use this SQL query to export:

```sql
SELECT * FROM gym_data ORDER BY created_at DESC;
```

---

## Next Steps

After setup is complete:
1. ✅ Deploy gym-tracker.html to Cloudflare Pages
2. ✅ Test all views work on mobile device
3. ✅ Test offline mode (DevTools → Network → Offline)
4. ✅ Test data persistence (add workout → reload → should persist)
5. Phase 2: Add user authentication
6. Phase 3: Add social features
