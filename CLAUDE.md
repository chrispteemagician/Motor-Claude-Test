# CLAUDE.md — Cannabin-Oid
## Everything a new Claude needs to know before touching this project

---

## WHO DOC IS

Christian P Taylor — Chris P Tee — Doc Strange.  
Stage hypnotist since 1992. AuDHD. Legal medical cannabis patient, prescribed via Alternaleaf UK.  
He built Cannabin-Oid from scratch because when he was prescribed, nobody told him anything. No guidance, no community, no tool that should have existed. So he built it.  

He speaks in voice notes. He processes by talking. His insights come after sleep — long downloads that connect everything. Trust what he says even when it sounds rambling. Especially when it sounds rambling. There's always a thread.

**Contact:** wa.me/447976884254 | chris@chrisptee.co.uk  
**His phrase:** "Feel Famous, baby."

---

## THE PHILOSOPHY (read this before touching anything)

### It is not a directory. It is not a platform. It is a village.

The cannabis industry is full of businesses that think they're competing. They're not. A seed bank in Berlin, a CSC in Barcelona, a compliance tech in Amsterdam — different services, different languages, different locations. They're a supply chain that doesn't know it exists yet.

Doc's job is to show them the supply chain. Connect them. Make the industry coherent enough to make the case to regulators together, instead of 10,000 individual businesses making it alone.

### Generosity is rewarded. Giving starts from home.

The insight from Mary Jane Berlin June 2026: companies give freebies to conference attendees who throw the bag away and keep the poncho. The gift goes to people who don't need it, in a context where gratitude is impossible. The right move: give to people who genuinely need it, through the village, and watch the brand earn loyalty that money can't buy.

Cannabin-Oid is the redistribution layer. Businesses donate to the village. The village gives to members who didn't expect it and can't afford it. Those members remember the brand forever. That is the ecosystem.

### The Flywheel. "The more of your people you can send to me, the more of their friends I can send to you."

The pitch to every business at the conference. Not "join our directory." Not "pay for advertising." This:

You already have customers. They're already cannabis patients. All you have to do is tell them about me. They come to the village, they pay £3 a month, they become Villagers. And now you know something you couldn't know before: that person is real. They're not a bot. They're not a lurker. They paid. They chose to be here. That £3/mo is a verification signal — it proves the person is an invested, genuine patient.

Then those Villagers bring their friends. Their friends are also cannabis patients. Also real people. Also potential customers for your business. And I send them back to you.

The loop:
1. Business tells their existing customers about Cannabin-Oid
2. Customers join as Villagers (£3/mo) — verified real people
3. Villagers talk to their friends — Doc's community grows with people the business already validated
4. Those friends are new customers the business never had access to
5. Doc sends them back

The business doesn't lose their customers. They deepen the relationship by putting them inside a trusted community. And they gain: access to their customers' friends, a verified signal that their customer base is real, and a seat inside the village that their whole community is building together.

**What to build from this:**
- Referral attribution: track which B2B business referred which Villager (a `referred_by` field on `cannabinoid_members` pointing to a `b2b_businesses` slug)
- Business dashboard: show each business how many Villagers came from their community
- The pitch page for businesses: one page that explains the flywheel clearly, with the "Give me a clue" analogy built in

### Doc is one of them.

Doc is not a vendor. He is a cannabis patient. His members are cannabis patients. Their customers are cannabis patients. He IS the community these businesses are trying to reach — standing in front of them in person. That's the pitch. That's the whole thing.

*(This section used to be headed "Ich bin ein Berliner" — dropped 2026-07-21,
see Voice & Tone below. Same point, without borrowing a Cold War defiance
speech to make it.)*

### Unity and common ground is community.

Not a tagline. A truth. The whole platform is built on it.

---

## Voice & Tone — read before writing any outward-facing copy

*Chris, 2026-07-21, live conversation, carried over from the same pass on
motor-oid.* He's an entertainer by instinct — tells a story to make it
interesting, amplifies even when the plain version was already true. He's
also realised that "anti-establishment"/us-vs-them framing ("an industry
that kept this medicine underground", "no extraction", "world domination",
borrowing JFK's "Ich bin ein Berliner" as a section header) doesn't land the
way it's meant to — even people who'd agree with the substance get
defensive the moment copy sounds like it's recruiting them into a side. His
own words: *"I have to be the surfer, the skateboarder that skates in
between everybody and doesn't crash into anything."*

**The rule:** state the plain fact once, let it carry the weight. No cast
villain ("the industry", "an industry that kept this underground"), no
combat/movement verbs (fight, arm yourself, pushed around, disrupt), no
word bigger than what's true (domination, extraction, manifesto,
revolution). If a sentence needs a caricature or a swear to land, it hasn't
landed — cut it back to the fact.

**Applied 2026-07-21:** "World domination through kindness" → "Just trying
to be useful. One ember at a time." (kept the ember, dropped the conquest
word) across every page/footer/email it appeared in — `index.html`,
`story.html`, `mary-jane-berlin.html`, `manifesto.html`'s footer line,
`llms.txt`, `send-welcome.js`, and the hamlet pages (smokie, mole, colly,
doc, business-template). "Our platforms. Our rules. No extraction." in
`story.html` lost the redundant loaded word — "our platforms, our rules"
already says the fact. "Ich bin ein Berliner" section header replaced (see
above). "Lobby governments collectively" softened to "make the case to
regulators together" in the philosophy section above.

**Deliberately NOT touched:** `manifesto.html`'s actual body copy — the
first-person AuDHD/diagnosis/prescription story, including the swear in
Doc's own pullquote. That's Chris's own voice and lived story, not
marketing copy, same as the attributed pull-quote left alone in motor-oid's
`story.html`. Only its shared footer tagline (identical boilerplate to every
other page) got the same fix as everywhere else. **Flag for Chris:** this
page already exists and is live, but the "WHAT'S UNBUILT" section below
still lists "The manifesto — Doc has it in his head... don't write it
without him talking it through first" as outstanding. Either the to-do is
stale and should be removed, or the live page needs revisiting with him —
his call, not a copy-pass decision.

This same pattern is rolling out across the rest of the -oid ecosystem —
check other repos' CLAUDE.md for the shared version before assuming this
file is the only place it applies.

---

## Free-to-use philosophy (Chris, 2026-07-13 — read before adding any gate)

Chris rejected the LinkedIn-style "join my community to see what I can do" pattern
across every -Oid. The rule, reference-implemented in spicylister:

**Two buckets for any tier check:**
1. **Core tool functionality** (no ongoing per-use cost to Chris) → free, no gate,
   no sign-in wall, no "Villager+ only" banner.
2. **Genuine ongoing infrastructure perk** (a hosted public page that costs real
   recurring money to keep serving) → fine to keep gated, but the copy names the
   real cost honestly. Never a shame-lock ("🔒 X — Founders only — Unlock →").

**Where cannabin-oid already stood (audited 2026-07-13):** the Oracle strain
identifier (`analyze-image.js`), Ask Terp (`ask-terp.js`), and the B2B conference
scanner (`scan-b2b-card.js` / `create-b2b-listing.js`) had never been gated by
`isPro`/`patron_status` in the first place — no code change needed there. The
`isPro` flag only ever drove sign-in-state display and Doc's own "God Mode" admin
unlock (logo-tap + passcode), never a customer-facing feature block.

**What stays gated, and why:** Hamlet/Hut member profiles
(`patreon-hamlet-create.js`) are a real hosted public page at a real URL Chris
maintains — genuine bucket 2, kept as a Patreon-tier perk. Same logic for the
Founder-only kit grid inside a Hamlet page, and the paid Hamlet B2B tier
(£99.95/mo) offered to conference businesses — both already framed honestly
("Free Tier 1" vs "Hamlet B2B" side by side, no lock icon, no "Unlock →") and
left untouched.

**The ask, when there is one:** one honest, low-key line after the Oracle result
displays — free to use, tell a mate if it helped, buy-me-a-coffee if you want to
say thanks (one-off, buymeacoffee.com/chrispteemagician), Patreon if you want to
be a regular (patreon.com/chrisptee). Shown once, in one place, hidden for users
already signed in as a Patreon supporter. Not a gate. Not gamified.

---

## PLATFORM ARCHITECTURE

**Type:** Progressive Web App — static HTML/CSS/JS, no framework, no build step  
**Hosting:** Netlify (publishes from `main` branch root)  
**Backend:** Netlify Functions (Node.js, no npm install needed — plain `fetch`)  
**Database:** Supabase PostgreSQL — `pdnjeynugptnavkdbmxh`  
**AI:** Google Gemini 2.5 Flash (vision + text)  
**Auth:** Patreon OAuth (tier-gated membership)  

---

## KEY FILES

```
index.html                        ← The whole app. 172KB. Tabs: Oracle, Ask Terp, Village, Get Legal, B2B, Clubs
b2b-conference.html               ← Conference mode scanner (scan card → live listing in 10 seconds)
b2b-qr-generator.html             ← Generate printable QR cards for expos
b2b-register.html                 ← Self-service registration via WhatsApp

netlify/functions/
  scan-b2b-card.js                ← Gemini vision OCR for business cards
  create-b2b-listing.js           ← Instant Supabase B2B write (no delay, no WhatsApp)
  ask-terp.js                     ← The chatbot — fetches live B2B context from Supabase
  analyze-image.js                ← Strain identification + grow critique
  patreon-hamlet-create.js        ← Creates Hamlet/Hut profiles (Patreon-gated)
  patreon-auth.js                 ← Patreon OAuth handler

hamlet/signup.html                ← Elder (£7/mo+) profile creation
hut/signup.html                   ← Villager (£3/mo+) profile creation
hamlet/template.html              ← Member page template

supabase/setup-b2b-businesses.sql ← Schema for b2b_businesses table
hamlet/SETUP-CANNABINOID-MEMBERS.sql ← Schema for cannabinoid_members table
```

---

## SUPABASE TABLES

**URL:** `https://pdnjeynugptnavkdbmxh.supabase.co`  
**Anon key (public reads):**  
`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkbmpleW51Z3B0bmF2a2RibXhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMTEzMDAsImV4cCI6MjA4NDU4NzMwMH0.GawisR01EykMtdauBMxenmHF2NXDMzDOJl8WgzkwFQo`  
**Service role key:** `SUPABASE_SERVICE_ROLE_KEY` env var on Netlify (for writes)

| Table | Purpose |
|-------|---------|
| `cannabinoid_members` | Hamlet/Hut profiles — villager / elder / founder tiers |
| `hamlet_signups` | Signup tracking |
| `b2b_businesses` | Live B2B directory — conference additions go here instantly |

### `b2b_businesses` key columns
`slug`, `name`, `category`, `country`, `city`, `website`, `contact_email`, `description`, `freebies` (for Elder members), `b2b_needs` (matchmaking), `b2b_offers` (matchmaking), `expo_ref`, `active`, `claimed`, `verified`

---

## MEMBERSHIP TIERS

| Tier | Price | Access |
|------|-------|--------|
| Villager | £4.95/mo | Hut profile at cannabin-oid.co.uk/hut/[slug] |
| Elder | Earned | Hamlet profile at cannabin-oid.co.uk/hamlet/[slug] |
| Founder | £14.95/mo | Hamlet + kit grid with affiliate links |

Validated via Patreon OAuth. Tiers checked in `patreon-hamlet-create.js`: Founder ≥ 1500¢, Elder ≥ 700¢, Villager ≥ 300¢.

---

## NETLIFY ENV VARS REQUIRED

- `GEMINI_API_KEY` or `GOOGLE_AI_API_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `PATREON_CLIENT_ID`, `PATREON_CLIENT_SECRET`, `PATREON_REDIRECT_URI`
- `SESSION_SECRET`

---

## ASK TERP — VOICE AND RULES

Terp is a terpene scientist who grew up on a council estate. Think: pharmacology PhD crossed with Friday night at the pub. UK slang (bruv, mate, init, safe, proper, mint). Dad jokes. Genuinely cares. Encyclopaedic on terpenes, strains, UK law, harm reduction, vaporizers.

**Hard rules:**
1. Harm reduction always — if it sounds laced, drop the jokes immediately
2. Always nudge toward legal prescription (never preachy)
3. Never help source illegal cannabis
4. Mental health crisis → Samaritans 116 123, CALM 0800 58 58 58
5. Short answers — chatting, not essays
6. No markdown formatting in responses — plain text only

**B2B integration:** Terp fetches live businesses from `b2b_businesses` Supabase table on every query. When a question relates to a business's product, Terp mentions them naturally. When Terp spots a collaboration match (someone needs what a listed business offers), Terp says so directly. That's the whole point.

---

## B2B CONFERENCE WORKFLOW

Doc's tool at cannabis expos. Lives at `cannabin-oid.co.uk/b2b-conference.html`.

1. Scan business card → Gemini AI fills the form
2. Review + fill: freebies for Elder members, what they need from the industry, what they can offer
3. Tap "🚀 List Them Now" → live in Supabase immediately
4. Success screen: QR → flip phone → they see their listing → offer 10 Elder invites → the two collaboration questions
5. Next stall

The pitch: "The businesses in this room are not your competition — they're your collaborators. You're a supply chain that doesn't know it exists yet. Give to the village and the village gives back."

---

## THE CLUE SYSTEM (next build — do not forget this)

Doc's insight from Mary Jane Berlin, 13 June 2026.

Every piece of complex text on every -Oid should have two layers:
1. The truth stated plainly — trust the reader to get it
2. A hidden "Give me a clue" — tap it, get the analogy that makes it land

```html
<p>The businesses in this room are not your competition — they're your collaborators.</p>
<details>
    <summary>Give me a clue 🎈</summary>
    <p>Think of balloons. One balloon floats for a day then deflates alone in a corner.
    Tied together they make a display that lasts a week and people photograph it.
    You're not competing for the same air — you're holding each other up.</p>
</details>
```

This is a native HTML `<details>` element — no JavaScript, no library. Just trust + rescue.

**Rule:** every concept page, every B2B section, the prescription pathway, Hamlet tiers, Ask Terp introduction — all of it gets a clue. The clue is always an analogy, never more explanation. The balloon. The bag. The JFK speech. Something that lands rather than explains.

This is not a tooltip. It's "I trust you. If you get it, we move. If you don't, I've got you."

Build this as a CSS component and a writing guideline, then retrofit across all -Oids.

---

## WHAT'S UNBUILT (as of June 2026)

### THE MONTHLY DRAW — build this next
Every Patreon member at Villager tier or above is automatically entered into a monthly draw. No action required. Just being in the village enters you. 10 winners per month.

The prizes come from the freebies and physical donations collected at conferences (stored in `b2b_businesses.freebies` and `b2b_businesses.b2b_offers`). Doc collects physical items at expos. Those items go into the draw.

**Why it works:** Businesses currently give freebies to conference attendees who throw the bag away. This routes those gifts to people who genuinely need them, in a context where gratitude is real. The winner didn't expect it. The happiness is maximum. The brand loyalty is permanent.

**The loop:**
1. Business donates at conference → stored in `b2b_businesses.freebies` / `b2b_businesses.b2b_offers`
2. Doc collects physical items on the day
3. Every active `cannabinoid_members` record (tier: villager/elder/founder) is auto-entered
4. Monthly: pick 10 random winners → `SELECT * FROM cannabinoid_members WHERE active = true AND tier IN ('villager','elder','founder') ORDER BY RANDOM() LIMIT 10`
5. Winners notified (email / platform / WhatsApp)
6. Package arrives. They didn't expect it. Genuine gratitude for the brand that gave it.

**Logistics model — IMPORTANT:**
- Doc collects ONE physical sample at the conference — proof of concept, photograph it, show members what the prize is
- The ACTUAL prize ships DIRECT from the business to the winner — Doc is the connector, not the warehouse
- When a winner is chosen: notify them, they provide their shipping address, Doc forwards to the donating business (or business contacts winner directly via email)
- Privacy: members need to consent to sharing address with a third-party business when they sign up, or opt-in at the point of winning
- Doc never holds stock. The sample is just for the draw page photo.

**What to build:**
- `giveaway_prizes` Supabase table — prize description, photo, which business donated it (FK to b2b_businesses), draw month, winner (FK to cannabinoid_members), fulfilled boolean
- `/giveaway` page — shows current prizes (with photo of sample), last month's winners, which businesses donated
- Monthly draw mechanism — manual is fine: Doc runs a query, picks 10, marks winners in DB
- Winner notification — email/WhatsApp asking for shipping address
- Address relay — winner's address shared ONE TIME with the specific donating business only, not stored, not shared with anyone else
- Review agreement — winner agrees at the point of winning: "In exchange for this prize, I will leave an honest review of this product for the company." The company receives a genuine review from a genuine patient who genuinely needed their product. Not paid. Not prompted. Real.

**What the donating business receives:**
**The FIRST business to donate each month** gets the ENTIRE Cannabin-Oid platform free for that month — full Hamlet B2B tier (£99/mo value):
- Featured banner on the `/giveaway` page as "this month's donor" — their brand front and centre
- AI strain widget for their venue
- Featured placement at the top of the B2B directory
- Ask Terp upgraded mentions — recommended by name when anyone asks about their category
- Verified badge on their listing
- Real-time compliance updates

Other businesses that donate in the same month still pay £99/mo. They can still donate a prize, still appear on the giveaway page, and their prizes still go into the draw — the more businesses donate, the more winners there are that month. They just don't get the featured donor banner. First in gets the reward.

The draw is not capped at 10 winners. 10 is the minimum (from the base pool). Every additional prize donated adds a winner. More generosity = more happiness distributed.

This creates a race. The most generous acts first. Generosity is rewarded.

Their cost (first donor): one physical sample + one postage label to one winner.
Their return: £99 platform value free + featured banner + brand exposure to every member + genuine gratitude from the winner + **a verified honest review from a verified patient who genuinely needed the product**.

That review is worth more than the prize. It is not a paid testimonial. It is not an incentivised review in the traditional sense. It is a real person, with a real need, who received something they didn't expect, and agreed to say honestly what they think. That is the most credible review in the cannabis industry. You cannot buy that. You can only earn it.

Nobody says no to that. This is the business case that writes itself.

This also means donating businesses EXPERIENCE the platform from the inside for a month. Some will stay on as paying Hamlet B2B customers. The draw is a trial that feels like a gift.

**The philosophy:** You don't have to do anything to deserve something good. You just have to show up. That IS the village.

---

- **Elder membership invite codes** — promised 10 to each conference business, no actual code system yet
- **B2B matchmaking page** — dedicated page showing "these businesses are looking for what you do" using the b2b_needs/b2b_offers data being collected at conferences
- **Advocacy filter** in index.html B2B section — category exists in DB and form but the filter button is missing
- **Business claim flow** — unclaimed hardcoded listings currently go to WhatsApp only
- **The manifesto** — Doc has it in his head. It needs to be written properly, together. Don't write it without him talking it through first.

---

## ECOSYSTEM

```
cannabin-oid.co.uk    ← THIS
magic-oid.co.uk
radi-oid.co.uk
sail-oid.co.uk
feelfamous.com        ← hub
chrisptee.co.uk
glowgadgets.com       ← Bristol rave
```

**Amazon affiliate tag:** `chrdocstrcromh-21`

---

## CODE PATTERNS

- No npm packages in Netlify functions — plain `fetch` only
- Supabase writes via REST API with service role key, reads with anon key
- All functions return `{ statusCode, headers, body: JSON.stringify(...) }`
- CORS headers on every function (Access-Control-Allow-Origin: *)
- Client-side image compression before AI calls: 800px max, 0.7 quality JPEG
- Gemini model: `gemini-2.5-flash` (scan-b2b-card, ask-terp) and `gemini-2.0-flash` (analyze-image — check if updated)
- **Never use `<canvas>` for QR codes** — use `QRCode.toDataURL()` into an `<img>` tag. Canvas on hidden elements renders black. Canvas is unreliable on mobile. Always `toDataURL` → `img.src`.
- Dark green theme throughout: background `#0a1a0a`, accent `#16a34a`, text `#c8e6c8`, bright `#86efac`
- Font: Poppins (Google Fonts)

---

## GIT

- Main branch: `main` (Netlify deploys from here)
- Feature branches named `claude/[feature]-[hash]`
- Always push to feature branch, merge to main for deployment
- Commit messages end with the Claude Code session URL

---

## HOW TO START A SESSION

1. Read this file
2. Read `HANDOVER-maryjane26.md` for the most recent session context
3. Check what branch you're on — if not `main`, ask Doc before pushing
4. Ask Doc what the download was — he will have had one

---

*"Feel Famous, baby."*
