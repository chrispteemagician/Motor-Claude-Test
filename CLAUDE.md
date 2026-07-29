# CLAUDE.md — Cannabin-Oid

**Contact:** wa.me/447976884254 | chris@chrisptee.co.uk
Chris communicates in voice notes/rambling threads — trust it, there's usually a thread even when it sounds unstructured.

---

## What this is

Not a directory, not a listings platform — a village. Cannabis businesses across the industry aren't competitors, they're an unconnected supply chain; Cannabin-Oid connects them and gives patients (Villagers) a verified-real community that businesses can refer into and draw referrals back out of.

**Backlog this implies:**
- Referral attribution: `referred_by` field on `cannabinoid_members` pointing to a `b2b_businesses` slug
- Business dashboard: Villagers-referred-per-business count
- A pitch page for businesses explaining the flywheel

---

## Voice & Tone — read before writing outward-facing copy

State the plain fact once, let it carry the weight. No cast villain ("the industry"), no combat/movement verbs (fight, arm yourself, disrupt), no word bigger than what's true (domination, extraction, manifesto, revolution). If a sentence needs a caricature or a swear to land, cut it back to the fact. Same rule applies ecosystem-wide — check other -oid CLAUDE.md files before assuming this is the only place it applies.

---

## Free-to-use philosophy — read before adding any gate

**Two buckets for any tier check:**
1. Core tool functionality (no ongoing per-use cost) → free, no gate, no sign-in wall, no "Villager+ only" banner.
2. Genuine ongoing infrastructure perk (a hosted public page with real recurring hosting cost) → fine to gate, but name the real cost honestly. Never a shame-lock ("🔒 ... Unlock →").

**Current state:** Oracle (`analyze-image.js`), Ask Terp (`ask-terp.js`), and the B2B conference scanner (`scan-b2b-card.js`/`create-b2b-listing.js`) are ungated — bucket 1. Hamlet/Hut member profiles (`patreon-hamlet-create.js`), the Founder-only kit grid, and the paid Hamlet B2B tier (£99.95/mo) are gated — bucket 2, framed honestly, no lock icons.

**The ask, when there is one:** one honest, low-key line after the Oracle result — free to use, tell a mate if it helped, buy-me-a-coffee if you want to say thanks (one-off, buymeacoffee.com/chrispteemagician), Patreon if you want to be a regular (patreon.com/chrisptee). Shown once, hidden for signed-in Patreon supporters. Not a gate, not gamified.

---

## Platform architecture

**Type:** Progressive Web App — static HTML/CSS/JS, no framework, no build step
**Hosting:** Netlify (publishes from `main` branch root)
**Backend:** Netlify Functions (Node.js, plain `fetch`, no npm install needed)
**Database:** Supabase PostgreSQL — `pdnjeynugptnavkdbmxh`
**AI:** Google Gemini 2.5 Flash (vision + text) — never the Anthropic API in deployed code
**Auth:** Patreon OAuth (tier-gated membership)

---

## Key files

```
index.html                        ← whole app. Tabs: Oracle, Ask Terp, Village, Get Legal, B2B, Clubs
b2b-conference.html               ← conference mode scanner (scan card → live listing in 10s)
b2b-qr-generator.html             ← printable QR cards for expos
b2b-register.html                 ← self-service registration via WhatsApp

netlify/functions/
  scan-b2b-card.js                ← Gemini vision OCR for business cards
  create-b2b-listing.js           ← instant Supabase B2B write (no delay, no WhatsApp)
  ask-terp.js                     ← chatbot — fetches live B2B context from Supabase
  analyze-image.js                ← strain identification + grow critique
  patreon-hamlet-create.js        ← creates Hamlet/Hut profiles (Patreon-gated)
  patreon-auth.js                 ← Patreon OAuth handler

hamlet/signup.html                ← Elder (£7/mo+) profile creation
hut/signup.html                   ← Villager (£3/mo+) profile creation
hamlet/template.html              ← member page template

supabase/setup-b2b-businesses.sql ← schema for b2b_businesses table
hamlet/SETUP-CANNABINOID-MEMBERS.sql ← schema for cannabinoid_members table
```

---

## Supabase tables

**URL:** `https://pdnjeynugptnavkdbmxh.supabase.co`
**Anon key (public reads):** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkbmpleW51Z3B0bmF2a2RibXhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMTEzMDAsImV4cCI6MjA4NDU4NzMwMH0.GawisR01EykMtdauBMxenmHF2NXDMzDOJl8WgzkwFQo`
**Service role key:** `SUPABASE_SERVICE_ROLE_KEY` env var on Netlify (for writes)

| Table | Purpose |
|-------|---------|
| `cannabinoid_members` | Hamlet/Hut profiles — villager / elder / founder tiers |
| `hamlet_signups` | Signup tracking |
| `b2b_businesses` | Live B2B directory — conference additions go here instantly |

`b2b_businesses` key columns: `slug`, `name`, `category`, `country`, `city`, `website`, `contact_email`, `description`, `freebies` (for Elder members), `b2b_needs`/`b2b_offers` (matchmaking), `expo_ref`, `active`, `claimed`, `verified`

---

## Membership tiers

| Tier | Price | Access |
|------|-------|--------|
| Villager | £4.95/mo | Hut profile at cannabin-oid.co.uk/hut/[slug] |
| Elder | Earned | Hamlet profile at cannabin-oid.co.uk/hamlet/[slug] |
| Founder | £14.95/mo | Hamlet + kit grid with affiliate links |

Validated via Patreon OAuth. Checked in `patreon-hamlet-create.js`: Founder ≥ 1500¢, Elder ≥ 700¢, Villager ≥ 300¢.

---

## Netlify env vars required

- `GEMINI_API_KEY` or `GOOGLE_AI_API_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `PATREON_CLIENT_ID`, `PATREON_CLIENT_SECRET`, `PATREON_REDIRECT_URI`
- `SESSION_SECRET`

---

## Ask Terp — voice and rules

Terp: terpene scientist raised on a council estate. Pharmacology PhD crossed with Friday night at the pub. UK slang (bruv, mate, init, safe, proper, mint). Dad jokes. Encyclopaedic on terpenes, strains, UK law, harm reduction, vaporizers.

**Hard rules:**
1. Harm reduction always — if it sounds laced, drop the jokes immediately
2. Always nudge toward legal prescription (never preachy)
3. Never help source illegal cannabis
4. Mental health crisis → Samaritans 116 123, CALM 0800 58 58 58
5. Short answers — chatting, not essays
6. No markdown formatting in responses — plain text only

**B2B integration:** Terp fetches live businesses from `b2b_businesses` on every query, mentions a relevant one naturally, and says so directly when it spots a collaboration match (someone needs what a listed business offers).

---

## B2B conference workflow

`cannabin-oid.co.uk/b2b-conference.html` — Doc's tool at cannabis expos.

1. Scan business card → Gemini AI fills the form
2. Review + fill: freebies for Elder members, what they need, what they can offer
3. Tap "List Them Now" → live in Supabase immediately
4. Success screen: QR → they see their listing → offer 10 Elder invites → two collaboration questions
5. Next stall

---

## The Clue system (next build — do not forget this)

Every piece of complex text on every -Oid gets two layers: the truth stated plainly, plus a hidden "Give me a clue" `<details>` with an analogy — no JS, no library.

```html
<p>The businesses in this room are not your competition — they're your collaborators.</p>
<details>
    <summary>Give me a clue 🎈</summary>
    <p>Think of balloons. One balloon floats for a day then deflates alone in a corner.
    Tied together they make a display that lasts a week and people photograph it.
    You're not competing for the same air — you're holding each other up.</p>
</details>
```

Rule: every concept page, every B2B section, the prescription pathway, Hamlet tiers, Ask Terp's intro — all get a clue. The clue is always an analogy, never more explanation.

---

## What's unbuilt

- **Monthly Draw** — Villager+ auto-entered monthly prize draw from conference-donated freebies (`b2b_businesses.freebies`/`b2b_offers`); 10 winners minimum, one extra winner per extra prize donated. Not built yet. **Rules that apply whenever this gets built, non-negotiable:**
  - Doc collects and holds ONE physical sample only, for the draw-page photo — the actual prize ships DIRECT from the donating business to the winner. Doc is the connector, never the warehouse.
  - Winner's shipping address is shared **ONE TIME** with the specific donating business only — never stored, never shared with anyone else, never CC'd elsewhere. Get explicit consent at the point of winning (no standing signup-time consent exists yet).
  - Winner agrees at the point of winning to leave an honest review for the product — stated as a condition, not implied.
  - First business to donate in a given month gets that month's Hamlet B2B tier (£99/mo value) free; later donors in the same month still pay but still add a winner slot.
  - See Doc for the rest of the spec before building — this is the load-bearing part, not the whole thing.
- **Elder membership invite codes** — promised 10 per conference business, no code system yet
- **B2B matchmaking page** — using the b2b_needs/b2b_offers data already being collected
- **Advocacy filter** in index.html B2B section — exists in DB/form, filter button missing
- **Business claim flow** — unclaimed hardcoded listings go to WhatsApp only
- **The manifesto** — talk it through with Doc first, don't write it solo

---

## Ecosystem

```
cannabin-oid.co.uk    ← THIS
magic-oid.co.uk
radi-oid.co.uk
sail-oid.co.uk
feelfamous.com        ← hub
chrisptee.co.uk
glowgadgets.com       ← Bristol rave
```

Amazon affiliate tag: `chrdocstrcromh-21`

---

## Code patterns

- No npm packages in Netlify functions — plain `fetch` only
- Supabase writes via REST API with service role key, reads with anon key
- All functions return `{ statusCode, headers, body: JSON.stringify(...) }`
- CORS headers on every function (Access-Control-Allow-Origin: *)
- Client-side image compression before AI calls: 800px max, 0.7 quality JPEG
- Gemini model: `gemini-2.5-flash` (scan-b2b-card, ask-terp), `gemini-2.0-flash` (analyze-image — check if updated)
- Never use `<canvas>` for QR codes — use `QRCode.toDataURL()` into an `<img>` tag (canvas is unreliable on mobile/hidden elements)
- Dark green theme: background `#0a1a0a`, accent `#16a34a`, text `#c8e6c8`, bright `#86efac`
- Font: Poppins

---

## Git

- Main branch: `main` (Netlify deploys from here)
- Feature branches named `claude/[feature]-[hash]`
- Always push to feature branch, merge to main for deployment
- Commit messages end with the Claude Code session URL

---

## How to start a session

1. Read this file
2. Read `HANDOVER-maryjane26.md` for the most recent session context
3. Check what branch you're on — if not `main`, ask Doc before pushing
4. Ask Doc what the download was — he will have had one
