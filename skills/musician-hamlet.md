---
name: musician-hamlet
description: Build a musician/fan community hamlet page with public+private bulletin board, 7-day free trial gating, fan gift card, and village announcement. Reference implementation: hamlet/skinner-brothers/. Use this whenever Chris asks for a band hamlet, artist page, or fan community on any -Oid.
---

# Skill: musician-hamlet

Build a complete fan community hamlet for a band, artist, or any other
community (political party supporters, a scene/subculture, etc — not just
musicians, despite the name). Includes public board, trial-gated private
board, 7-day fan gift, and wiring into the parent site's village section.

**Reference implementation:** `hamlet/skinner-brothers/` in motor-oid repo
(dedicated `skinner_posts`/`skinner_trials` tables, per this skill's
original per-hamlet-copy pattern below).

**2026-07-26 update — prefer the generalised backend for any *new* hamlet.**
Copy-pasting `[slug]-posts.js`/`[slug]-trials` per hamlet (steps 1-2 below)
means N hamlets = N Supabase table pairs + N near-identical function pairs.
`functions/hamlet-posts.js` + `functions/hamlet-claim-trial.js` (schema in
`hamlet_community.sql`) do the same job for *any* hamlet, keyed by a
`hamlet_slug` param — built for `hamlet/green-party/` and `hamlet/ravers/`,
which need no dedicated tables or functions of their own at all. **Use the
shared backend for new hamlets; only follow steps 1-2 below if you have a
specific reason to keep one hamlet's data fully isolated in its own
tables** (Skinner Brothers keeps its original dedicated tables — already
live, not worth migrating for no reason).

---

## Before you start — ask Chris

1. **Slug** — the URL slug e.g. `skinner-brothers` → `/hamlet/skinner-brothers/`
2. **Band name** — full display name
3. **Emoji** — fallback if no logo yet (🎭 🎸 🥁 🎤 etc.)
4. **Links** — Bandcamp, SoundCloud, Apple Music, Instagram, Website, Ticket links. **Never Spotify.**
5. **Tour dates** — venue, city, date, ticket URL (DICE preferred)
6. **Logo** — PNG ready now, or placeholder and Amber delivers later?
7. **Which -Oid repo** — motor-oid, vinyl-oid, magic-oid, etc.

---

## Step 1 — Supabase tables

Run these **one at a time** in the Supabase SQL editor. No string literal defaults — they cause curly-quote errors when pasted from chat.

Replace `[slug]` with the band slug (e.g. `skinner_brothers` — underscores in SQL).

```sql
CREATE TABLE [slug]_posts (id uuid DEFAULT gen_random_uuid() PRIMARY KEY, created_at timestamptz DEFAULT now(), content text NOT NULL, is_public boolean DEFAULT true, author text, pinned boolean DEFAULT false, post_type text);
```
```sql
ALTER TABLE [slug]_posts ENABLE ROW LEVEL SECURITY;
```
```sql
CREATE POLICY anon_read_public ON [slug]_posts FOR SELECT TO anon USING (is_public = true);
```
```sql
CREATE TABLE [slug]_trials (id uuid DEFAULT gen_random_uuid() PRIMARY KEY, created_at timestamptz DEFAULT now(), trial_token text UNIQUE NOT NULL, expires_at timestamptz NOT NULL);
```
```sql
ALTER TABLE [slug]_trials ENABLE ROW LEVEL SECURITY;
```

---

## Step 2 — Netlify functions

Create two files in `functions/`. Copy from the Skinner Brothers reference and do a find-replace on `skinner` → `[slug]`.

### `functions/[slug]-posts.js`

```js
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };

  const { type, token } = event.queryStringParameters || {};
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  if (type === 'private') {
    if (!token) return { statusCode: 401, headers, body: JSON.stringify({ error: 'no_token' }) };

    const { data: trial } = await supabase
      .from('[slug]_trials')
      .select('expires_at')
      .eq('trial_token', token)
      .single();

    if (!trial) return { statusCode: 403, headers, body: JSON.stringify({ error: 'invalid' }) };
    if (new Date(trial.expires_at) < new Date()) {
      return { statusCode: 403, headers, body: JSON.stringify({ error: 'expired' }) };
    }

    const { data: posts } = await supabase
      .from('[slug]_posts')
      .select('*')
      .eq('is_public', false)
      .order('pinned', { ascending: false })
      .order('created_at', { ascending: false });

    return { statusCode: 200, headers, body: JSON.stringify({ posts: posts || [] }) };
  }

  // public
  const { data: posts } = await supabase
    .from('[slug]_posts')
    .select('*')
    .eq('is_public', true)
    .order('pinned', { ascending: false })
    .order('created_at', { ascending: false });

  return { statusCode: 200, headers, body: JSON.stringify({ posts: posts || [] }) };
};
```

### `functions/[slug]-claim-trial.js`

```js
const { createClient } = require('@supabase/supabase-js');
const { randomUUID } = require('crypto');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'POST only' }) };

  const token = randomUUID();
  const expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  const { error } = await supabase.from('[slug]_trials').insert({ trial_token: token, expires_at });

  if (error) return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };

  return { statusCode: 200, headers, body: JSON.stringify({ token, expires_at, days: 7 }) };
};
```

---

## Step 3 — Hamlet HTML page

Create `hamlet/[slug]/index.html`. Copy `hamlet/skinner-brothers/index.html` as the starting point, then customise:

**Find and replace throughout:**
- `skinner-brothers` → `[slug]`
- `skinner` → `[slug]` (in JS variable names and function names)
- `The Skinner Brothers` → `[Band Name]`
- `skinner_posts` / `skinner_trials` → `[slug]_posts` / `[slug]_trials`

**Customise these sections:**

### Hero
```html
<!-- Logo slot: drop [slug]/logo.png when ready. Emoji shows until then. -->
<img src="/hamlet/[slug]/logo.png"
     alt="[Band Name]"
     class="band-logo"
     onerror="this.style.display='none';document.getElementById('heroEmoji').style.display='block';">
<span id="heroEmoji" class="band-icon" style="display:none;">[EMOJI]</span>
<h1 class="band-name">[Band Name]</h1>
<p class="band-tagline">[One-line description — independent, doing it their way, etc.]</p>
```

### Links card
```html
<!-- Bandcamp ALWAYS. SoundCloud / Apple Music optional. NEVER Spotify. -->
<a href="https://[band].bandcamp.com/" class="btn-secondary">Bandcamp</a>
<a href="https://www.instagram.com/[handle]" class="btn-secondary">Instagram</a>
<a href="https://[band-website].com/" class="btn-secondary">Website</a>
<a href="[ticket-url]" class="btn-secondary">All Tickets</a>
```

### Tour dates
One card per show. Mark any local -Oid connection (e.g. "Motor-Oid Home Ground" for Bristol):
```html
<div class="show-card [featured-class]">
  <div class="show-date">[DD Mon]</div>
  <div class="show-venue">[Venue]</div>
  <div class="show-city">[City]</div>
  [optional: <span class="home-ground-badge">Motor-Oid Home Ground</span>]
  <a href="[dice-or-ticket-url]" class="btn-ticket" target="_blank">Get Tickets</a>
</div>
```

### Fan gift copy
The "brave enough to try the door" ethos. Keep this:
```html
<p class="gift-body">
  This is new. It will work for those brave enough to try the door that could possibly be locked —
  rather than stand in line for the only one that's open.
</p>
```

Monthly perks: free car listing (£15 value) + 10 invites + members board + village access.

---

## Step 4 — Logo

**If logo exists:** save as `hamlet/[slug]/logo.png`. Crop tight to the artwork.

**If logo needs creating (brief for Amber):**
- High contrast black and white, circular format
- Style: [describe the band's aesthetic — masks, instruments, energy]
- Works at 60px and 600px
- Save as `hamlet/[slug]/logo.png`

**If logo has background artifacts** (common from AI generation):
```python
from PIL import Image
import numpy as np
img = Image.open('source.png').convert('RGBA')
arr = np.array(img)
# Find dark pixel bounds (the artwork)
dark = arr[:,:,0] < 150
rows = np.any(dark, axis=1); cols = np.any(dark, axis=0)
rmin,rmax = np.where(rows)[0][[0,-1]]; cmin,cmax = np.where(cols)[0][[0,-1]]
size = max(rmax-rmin, cmax-cmin) + 8
cr,cc = (rmin+rmax)//2, (cmin+cmax)//2; h = size//2
cropped = img.crop((cc-h,cr-h,cc+h,cr+h))
# Remove white background
a = np.array(cropped)
a[(a[:,:,0]>200)&(a[:,:,1]>200)&(a[:,:,2]>200),3] = 0
Image.fromarray(a).save('hamlet/[slug]/logo.png')
```

---

## Step 5 — Wire into parent site village section

In the parent site's `index.html` (or equivalent village/community page), find the village/hamlets section and add:

```html
<!-- Community Hamlets -->
<div class="mb-6">
  <div class="flex items-center gap-3 mb-4">
    <div class="text-2xl">🎭</div>
    <div>
      <h3 class="text-xl font-black text-white">Community Hamlets</h3>
      <p class="text-sm" style="color:var(--silver);">Independent crews doing it on their own terms. Same as us.</p>
    </div>
  </div>
  <a href="/hamlet/[slug]/" class="village-card flex items-start gap-4 text-left" style="text-decoration:none;">
    <img src="/hamlet/[slug]/logo.png" alt="[Band Name]"
         style="width:52px;height:52px;border-radius:50%;flex-shrink:0;object-fit:cover;border:1px solid rgba(249,115,22,0.3);"
         onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
    <div style="display:none;width:52px;height:52px;border-radius:50%;flex-shrink:0;background:rgba(249,115,22,0.15);border:1px solid rgba(249,115,22,0.3);align-items:center;justify-content:center;font-size:1.5rem;">[EMOJI]</div>
    <div style="flex:1;min-width:0;">
      <div class="flex items-center gap-2 mb-1 flex-wrap">
        <span class="font-black text-lg text-white">[Band Name]</span>
        <span class="pulse-badge text-xs font-black px-2 py-0.5 rounded-full" style="background:var(--accent);color:#fff;">NEW</span>
      </div>
      <p class="text-sm mb-1" style="color:var(--silver);">[One-liner — ethos match with the -Oid]</p>
      <p class="text-sm" style="color:var(--silver);">[Key show] &nbsp;·&nbsp; Free week for fans → try the village</p>
      <p class="text-xs mt-2" style="color:var(--accent);">See the hamlet → &nbsp;·&nbsp; Claim your free week →</p>
    </div>
  </a>
</div>
```

Add the pulse-badge CSS if not already present in the page's `<style>` block:
```css
.pulse-badge { animation: pulse-glow 2s ease-in-out infinite; }
@keyframes pulse-glow { 0%,100% { box-shadow: 0 0 0 0 rgba(249,115,22,0.6); } 50% { box-shadow: 0 0 0 6px rgba(249,115,22,0); } }
```

---

## Step 6 — Commit and push

```bash
git pull origin main
git add hamlet/[slug]/ functions/[slug]-posts.js functions/[slug]-claim-trial.js index.html
git commit -m "[Band Name] hamlet: fan board, 7-day trial, logo, village announcement"
git push -u origin main
```

---

## Posting to the board

Done via Supabase dashboard — no admin UI yet.

- `is_public = true` → visible to everyone
- `is_public = false` → members-only (trial or monthly Patreon)
- `pinned = true` → floats to top of either board

---

## Checklist

- [ ] Supabase: 5 SQL statements run one at a time, no errors
- [ ] `functions/[slug]-posts.js` created with correct table names
- [ ] `functions/[slug]-claim-trial.js` created
- [ ] `hamlet/[slug]/index.html` created, all `skinner` references replaced
- [ ] Logo in place OR onerror emoji fallback confirmed working
- [ ] No Spotify links anywhere
- [ ] Village announcement added to parent site with onerror on logo img
- [ ] Pushed to main, Netlify deployed
- [ ] Tell Chris: hamlet URL, how to post (Supabase dashboard), next steps

---

## QR Code — always use toDataURL, never toCanvas

`toCanvas` has a known rendering bug across the -Oid ecosystem. Always use `toDataURL→img`:

```html
<img id="qrImg" style="border-radius:10px;margin:10px auto 14px;display:block;width:180px;height:180px;" alt="QR code">
```

```js
QRCode.toDataURL(HAMLET_URL, { width:180, color:{dark:'#f97316ff',light:'#0f0f0fff'} }, function(err, url) {
    const img = document.getElementById('qrImg');
    img.src = err || !url
        ? 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data='+encodeURIComponent(HAMLET_URL)+'&color=f97316&bgcolor=0f0f0f'
        : url;
});
function downloadQR() {
    const img = document.getElementById('qrImg');
    if (img && img.src) { const a=document.createElement('a'); a.download='[slug]-hamlet.png'; a.href=img.src; a.click(); }
}
```

---

## Notes

- **Never Spotify.** Bandcamp first, then SoundCloud, Apple Music. No exceptions.
- The 10 invites for monthly members: manual for MVP ("DM us for your invite links"). Automated invite codes are a future build.
- If the band belongs on a different -Oid (e.g. Vinyl-Oid for music), the entire hamlet is portable — copy the files, update the Supabase project reference, done.
- Motor-Oid CLAUDE.md calls this the Interchangeable Parts Principle. The hamlet is a labelled, separable part.
