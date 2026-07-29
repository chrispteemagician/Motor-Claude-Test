# CANNABIN-OID HANDOVER
## Mary Jane Berlin — June 2026 Session (Full Day)

**Date:** 13 June 2026  
**Branch:** `claude/card-scanner-cannabinoid-itzq92` — **MERGED TO MAIN ✅**  
**Live at:** cannabin-oid.co.uk  
**Owner:** Christian P Taylor (Chris P Tee / Doc Strange)

---

## ⚠️ CRITICAL: SUPABASE_SERVICE_ROLE_KEY

The env var was blank on Netlify (`cannabin-oid-v3` site). It has now been set to the correct value via Netlify MCP. The `create-b2b-listing.js` function should now write to Supabase correctly.

If you get "Service key not configured" errors again — go to:  
`app.netlify.com/projects/cannabin-oid-v3` → Environment variables → `SUPABASE_SERVICE_ROLE_KEY`  
The value is a Supabase `sb_secret_` format key (newer format, not a JWT).

---

## WHAT WAS BUILT TODAY

### Morning session (pre-conference)

#### 1. `b2b-conference.html` — Conference Mode Scanner (NEW)
Doc's primary tool on the floor. Full workflow:
1. Choice screen: **🏢 I'm a business** / **🌿 I'm a visitor**
2. Visitor → redirects to `cannabin-oid.co.uk`
3. Business → language picker (8 languages) + B2B Connect pitch in big text
4. Self QR code — they scan it to fill in on their own phone
5. Scan their card OR fill in manually (3 fields: name, category, email + country)
6. 🚀 List Them Now → live Supabase listing
7. Success: QR to their listing, Elder invite offer, "email Monday" promise
8. → Next Stall

#### 2. `netlify/functions/create-b2b-listing.js` (NEW)
Instant Supabase write via service role key. No WhatsApp, no delay.

#### 3. `netlify/functions/ask-terp.js` (UPDATED)
Ask Terp fetches live B2B businesses from Supabase on every query. Groups by category, surfaces collaboration matches from `b2b_needs`/`b2b_offers` fields.

#### 4. `index.html` (UPDATED)
- B2B section reframed as collaboration network
- Loads live Supabase businesses merged with hardcoded ones
- Cards show `b2b_needs` and `b2b_offers`
- `?tab=b2b` URL param auto-opens B2B section
- Symbiosis Engine footer added

#### 5. `templates/b2b-conference/` (NEW — 5 files)
Full template system to replicate for any -Oid:
- `B2B-CONFERENCE-GENERATOR.md` — 8 questions + config object + generation guide
- `b2b-conference-template.html` — full template with `{{PLACEHOLDERS}}`
- `scan-b2b-card-template.js`
- `create-b2b-listing-template.js`
- `setup-b2b-table-template.sql`
Symbiosis Engine footer is baked into the template — auto-included on every -Oid.

#### 6. `CLAUDE.md` (NEW)
Full project skill file. Read this before touching anything. Covers: philosophy, architecture, file map, Supabase tables, membership tiers, Ask Terp voice rules, B2B workflow, code patterns, git, The Clue System, The Monthly Draw, The Flywheel.

---

### Afternoon session (field feedback from the floor)

#### Multilingual B2B Connect
8 languages added to `b2b-conference.html`:
🇬🇧 EN 🇩🇪 DE 🇪🇸 ES 🇳🇱 NL 🇫🇷 FR 🇮🇹 IT 🇨🇿 CS 🇵🇱 PL

Language picker at top. Tap a flag → pitch updates in big readable text, form labels change, buttons change. `setLang(code)` function + `LANGS` object in the script.

Translations cover: pitch text, tagline, scan button, submit button, all form labels.

#### Form stripped to minimum (field feedback)
Old form: 10 fields. Too many — businesses at expos don't know their own email/website.

New form: **4 fields**
1. Company Name *
2. What do you supply? (dropdown) *
3. Email address *
4. Country (defaults Germany)

City, website, description, freebies, needs, offers are hidden fields — still submitted if filled by scan, otherwise empty. Follow-up email handles the rest.

#### Scan error UX improved
"Couldn't read it — just type the name below 👇" — cursor auto-jumps to name field. No dead end.

#### Choice screen (business or visitor)
First thing they see when scanning the QR:
- 🏢 I'm a business → shows language picker + form
- 🌿 I'm a visitor → redirects to cannabin-oid.co.uk

#### Self QR code
QR code in the B2B Connect pitch panel pointing to `cannabin-oid.co.uk/b2b-conference.html`.
Doc shows the pitch → points at QR → leaves. They scan and fill in their own details later.

**Fix applied:** Canvas must be visible when QR renders. QR now renders inside `pickRole('business')` after the form div becomes visible. Rendering on a `display:none` canvas produces a black square.

#### Symbiosis Engine footer
Added to `b2b-conference.html` and `index.html`:
"You just saw what AI can do — Ready to own your AI future? No corporate contract. No monthly trap. Deployed in 14 days, owned by you forever."
→ `https://symbiosis-engine.netlify.app/`
Also baked into `b2b-conference-template.html` — every -Oid gets it automatically.

---

## KEY FIELD INSIGHTS (from Doc on the floor)

- **Businesses don't know their own email or website.** The 3-field form is the right call.
- **The QR is the killer feature.** Show them the pitch, point at QR, move on. They fill it in when they're back at their laptop.
- **WhatsApp fallback works perfectly** when Supabase fails — keep it.
- **The multilingual pitch removes the language barrier.** Doc shows the page, they tap their flag, they read it. He doesn't need to speak.
- **Screenshots as offline fallback** — Doc taking screenshots of each language version to show at stalls without needing internet.

---

## WHAT'S NOT WORKING / WATCH OUT FOR

- **Scan-b2b-card.js** — the card scan returned "couldn't read" on first attempt. Might be:
  - Netlify cold start timeout on first function invocation
  - Gemini safety block on certain card images
  - WhatsApp fallback handled it fine
  - The form fallback (type manually) is frictionless now
- **SUPABASE_SERVICE_ROLE_KEY** was blank — now set. If it breaks again, check Netlify env vars.

---

## THE FLYWHEEL (documented in CLAUDE.md)

"The more of your people you can send to me, the more of their friends I can send to you."

Business tells customers → they join at £3/mo (verified real people) → their friends join → Doc sends those friends back as new customers. The £3/mo Villager is a verification signal.

**What to build next:**
- `referred_by` field on `cannabinoid_members` (FK to `b2b_businesses` slug)
- Business dashboard showing how many Villagers came from their community
- Pitch page for businesses explaining the flywheel

---

## THE MONTHLY DRAW (documented in CLAUDE.md)

Full mechanic locked in:
- Every Villager+ Patreon member auto-entered (no action needed)
- 10 minimum winners per month — every extra prize donated adds a winner
- **First donor each month** gets full Hamlet B2B tier FREE (£99/mo value) + featured banner
- Other donors pay £99/mo, still on giveaway page, prize still in draw
- Address shared ONE TIME with donating business only, not stored
- Winner agrees to leave honest review — verified patient, genuine need, genuine gratitude
- Doc holds ONE sample (photograph for draw page) — businesses ship direct to winner

**To build:** `giveaway_prizes` Supabase table, `/giveaway` page, draw mechanism, winner notification, address relay, review agreement prompt.

---

## THE CLUE SYSTEM (documented in CLAUDE.md)

Native HTML `<details>` element — no JS. Every piece of complex text gets two layers:
1. Plain truth — trust the reader
2. "Give me a clue 🎈" → analogy that makes it land (balloon, bag, JFK)

**To build:** CSS component + writing guideline + retrofit across all -Oids.

---

## SUPABASE TABLES

**Project:** `pdnjeynugptnavkdbmxh`

| Table | Purpose |
|-------|---------|
| `cannabinoid_members` | Hamlet/Hut member profiles |
| `hamlet_signups` | Signup tracking |
| `b2b_businesses` | Live B2B directory — conference additions go here |

### `b2b_businesses` key columns
`slug` (unique), `name`, `category`, `country`, `city`, `website`, `contact_email`, `description`, `freebies`, `b2b_needs`, `b2b_offers`, `expo_ref` (maryjane26), `active`, `claimed`, `verified`

---

## CRITICAL CONSTANTS

```javascript
// Supabase
supabaseUrl: 'https://pdnjeynugptnavkdbmxh.supabase.co'
supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkbmpleW51Z3B0bmF2a2RibXhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMTEzMDAsImV4cCI6MjA4NDU4NzMwMH0.GawisR01EykMtdauBMxenmHF2NXDMzDOJl8WgzkwFQo'

// Netlify site
siteId: '7bb5b72f-a2ca-44a3-bbf2-142a0041a6b4' (cannabin-oid-v3)

// Contact
WhatsApp: wa.me/447976884254
Email: chris@chrisptee.co.uk
Amazon affiliate: chrdocstrcromh-21
```

---

## ECOSYSTEM

```
cannabin-oid.co.uk   ← THIS
magic-oid.co.uk
radi-oid.co.uk
sail-oid.co.uk
feelfamous.com (hub)
chrisptee.co.uk
glowgadgets.com
symbiosis-engine.netlify.app  ← AI blueprint service, Doc's offer
```

---

### Late afternoon session (after the floor)

#### Gil Hunt — `gil.html` (NEW, live at cannabin-oid.co.uk/gil)

Doc met Gil Hunt at Mary Jane Berlin, 13 June 2026. Wanted to give him something real immediately.

**Who Gil is:**
- 52 years old. Cannabis cultivator for 35 years — started at 15.
- Came from a wealthy family (actors, movie stars). Walked away at 14. By choice. Because he saw the cage.
- Survived his entire adult life off growing and selling cannabis to what he calls his family, not his customers.
- Been to jail. Been deported. Lost everything he owned — more than once.
- Still standing. Still growing. Still in the community.
- ADHD (way off the scale, his words).
- Wants to move forward into the legitimate industry but will not join the system to do it.

**His central quote — goes on the page, goes in the record:**
> "The system is deeply corrupt — but perfect for those who profit from it."

**The page:** Text-only (no photo). Dark green Cannabin-Oid aesthetic. Caveat headings. Cards: origin story, the village he built before the village existed, what it cost, where he's going. Two "Give me a clue" elements — the cage/bird analogy on the origin, the local pub analogy on trust. Stats row: 35 years cultivating, 52 years alive, 0 times sold out. Village callout at the bottom: "Found at Mary Jane Berlin, June 2026."

Doc was crying listening to Gil tell his story. "It's like listening to myself."

---

#### The two pitches that work (field-tested on the floor)

Both tested in person. Both landed. Both earned:

1. **"I built a decentralised network for stoners to escape social media."**
2. **"I built AI for stoners who want to be smarter than the system."**

These are now on `cannabin-oid.co.uk/share` — a one-screen photographable card. Show it, they snap it, they find the village when they're ready. No sales pitch. No trust speech. Just those two lines and a QR code.

Field test data point: Doc showed someone three lines about trust and division. Response: "You sound too salesy." Doc: "You sound like a bitch." Lesson: one line, plain truth, no explanation.

---

#### The pockets insight

The cannabis community is not a community yet. It's little pockets of friends walking around ignoring everybody that surrounds them, trying to find something that benefits them. The network already exists — it just doesn't know it exists yet.

Doc's job is to show them they're already in the same room.

---

#### The mattress analogy — THIS IS THE MANIFESTO

Doc goes up to the biggest, baddest, scariest people at the conference and finds they're all frightened underneath. Two of them cried. The intimidation is a shell. The need is real.

The analogy he landed on today — the one that explains everything:

> "I'm the one putting all the mattresses out on the ground outside the burning building. The people inside don't know the building's on fire. They're laughing at me because they think I'm mad. In ten minutes, they're all going to be jumping out those windows, and they'll realise I saved their lives. Some of them will say the mattresses were there anyway. But the ones that appreciate what I'm trying to do — they're the ones that go to the next building and put the mattresses out for others."

**Why this is the manifesto:**
- You can't convince people the building is on fire before they smell smoke — so you don't try
- You put the mattresses out now, before they're needed
- The ungrateful ones will pretend it would have happened anyway — that's fine
- The grateful ones become the village — they go out and do it for others
- THAT is the flywheel. THAT is Gil. THAT is why it has to exist now.

**Do not write the manifesto without Doc talking it through first. But this analogy is locked in as the spine of it.**

---

#### Key insight from the Gil conversation — THE VERIFICATION SIGNAL

The £3/mo Villager fee is not a revenue model. It is a verification signal.

It proves the person is real. Has a bank account. Made a choice. Not a bot. Not a lurker. A human being who decided to show up.

The end goal: businesses fund the village so members eventually pay nothing — or make a one-time refundable deposit just to prove they exist. The money is not the point. The proof is the point.

Doc's framing: "We need to know that people are real, and not monitored. We still need some kind of payment just to establish the real."

---

#### Key insight — THE TRUST GAP

The cannabis community is deeply paranoid about anything digital. This is not irrational — they've had reason to be. Key things to keep in mind:

- Scanning a QR code feels like handing someone your house keys
- People don't know how to type a URL — they search everything, even direct URLs
- "We don't want their data" is not enough — everybody thinks you're after something
- Safety is number one. Paranoia is the ground state.

The village has to earn trust through behaviour, not promises.

---

#### Key insight — THE SEARCH CLIFF

When AI search becomes too expensive or collapses, people who can't type a URL and rely on search engines will be completely lost. No music. No books. No way to find anything.

The village is the answer. A community doesn't need an algorithm. You find things because someone you trust told you. That's older than the internet. That survives everything.

**Doc's phrase:** "That's why we're building it."

This belongs in the manifesto. Don't write the manifesto without him, but this phrase is locked in as the closing line.

---

## WHAT'S NEXT (priority order)

1. **Monday email to businesses** — follow-up with collaboration details (who needs what you do, who you need). Currently promised on success screen. Need email service (Resend/Mailgun) + template.
2. **Monthly Draw** — `giveaway_prizes` table, `/giveaway` page, draw mechanism, winner/address/review flow
3. **The Clue System** — CSS `<details>` component, writing guide, retrofit
4. **Elder invite codes** — promised 10 per conference business, no code system yet
5. **Referral attribution** — `referred_by` on `cannabinoid_members`, business dashboard
6. **B2B matchmaking page** — dedicated page using b2b_needs/b2b_offers
7. **Template instantiation** — generate magic-oid, radi-oid, sail-oid from template system
8. **The manifesto** — Doc talks it through, we write it together. Not without him.

---

## THE PITCH (verbatim — what Doc says at each stall)

"The businesses in this room are not your competition — they're your collaborators. You're a supply chain that doesn't know it exists yet. I'm building the network. Free listing, live before I leave this stall. Scan that QR when you get a minute. Tell your customers about the village — they join for £3/month. The more of your people you send me, the more of their friends I send you. Generosity is rewarded. Unity and common ground is community."

---

---

### Evening session — final fixes before food

#### B2B categories expanded
Added to `b2b-conference.html` dropdown:
- 🛍️ **Cannabis Shop / Retail** (`shop`) — businesses kept asking why they weren't in the directory
- 👕 **Apparel / Clothing / Accessories** (`apparel`)
- 🌍 **Other** — catch-all for anything that doesn't fit

#### Blimburn Seeds — NEEDS MANUAL ENTRY
Doc met them at the conference (BBG Products stand). He tried to add them but network blocked it.

**Add via `cannabin-oid.co.uk/b2b-conference.html`:**
- Name: Blimburn Seeds
- Category: Seed Bank
- Country: Spain / City: Barcelona
- Website: blimburnseeds.com
- Description: One of the world's leading cannabis seed banks. 15+ years, premium feminised and auto-flowering genetics. Parent company BBG Projects, CEO Sergio Martinez. Best Seed Bank USA 2024.
- B2B offers: Premium cannabis genetics, global distribution, partnership and licensing opportunities.

#### Mobile zoom fixed
5 pages had `user-scalable=no, maximum-scale=1.0` — the whole site was locked at fixed zoom, looking like a tiny desktop page that couldn't be pinched. All removed. Standard `width=device-width, initial-scale=1.0` now on all pages.

#### Heading overflow fixed (Poppins font standardisation side-effect)
When Caveat was replaced with Poppins across all pages, heading font-weight was set to 800 everywhere. Poppins 800 is wider than Caveat, causing mobile overflow and browser zoom-out. Fixed: all display headings reduced to 700, large fixed font-sizes wrapped in `clamp()`, `word-break: break-word` added to headings that receive user-generated content.

---

### End of day — session close (17:17 UTC)

Doc is out. Go eat. Bring protein tomorrow.

**What's live right now:**

| URL | What it is |
|-----|-----------|
| `cannabin-oid.co.uk/gil` | Gil Hunt's personal profile page — built on the floor from a voice note |
| `cannabin-oid.co.uk/share` | One-screen photographable pitch card — show it, they snap it |

**Design system update completed today:**
- Caveat font removed from every HTML file across the entire codebase (13 files)
- Poppins is now the one font across the whole OID network — matches mary-jane-berlin, manifesto, b2b-conference, all hamlet pages
- Zero Caveat references remaining anywhere

**The two lines that work (share page copy, field-tested today):**
1. "I built a decentralised network for stoners to escape social media."
2. "I built AI for stoners who want to be smarter than the system."

**The mattress analogy is the manifesto. Don't write it without him.**

**Next session:** Pick up from the handover. Ask Doc what the download was — he'll have had one. Bring protein.

---

### Post-conference session — evening (20:00+ UTC)

#### Mobile rendering fixed (root cause found)
Removing `user-scalable=no` in the earlier session was correct, but without `overflow-x: clip` on html/body, the browser was zooming out to fit overflowing content. Fixed:
- `overflow-x: clip` added to html + body on `index.html`, `b2b-conference.html`, `mary-jane-berlin.html`
- `grid-cols-4` in Meet section → `grid-cols-2 sm:grid-cols-4`
- Double `px-4` removed from section-meet, section-clubs, section-b2b (they were inside main's px-4)
- what3words display text clamped with `clamp(1.3rem, 7vw, 2.25rem)` — was text-4xl font-mono, could reach 390px on mobile

#### b2b-conference splash screen rebuilt
The choice screen ("I'm a business / I'm a visitor") was tiny (0.95rem buttons). Rebuilt as full-screen vertical stack — two large cards with big emoji, 1.3rem headings, one-line subtext explaining each option. Designed to be readable when handing the phone to a stranger at a stall.

Added **Start Over** button in the header (hidden until business form is active). One tap resets the form and returns to the splash — so the page can be handed fresh to the next stall without clearing the browser.

#### Bug fixes
- Bug report modal: text was invisible (white on white) — Tailwind base styles overriding input colour. Fixed: explicit `color: #1c1917; background: #ffffff` on `.bug-modal input, textarea`.
- Strain identifier (analyze-image): was calling `gemini-2.0-flash` — upgraded to `gemini-2.5-flash` to match rest of codebase. Likely cause of the "not working" report.

---

### NEW CONTACTS — Mary Jane Berlin, 13 June 2026

#### Marco — Sir Canapa 🇮🇹
**Website:** sircanapa.com  
**Instagram:** @sircanapa  
**Location:** Milan (current) + Prague (opening soon — Marco is moving there)  
**What they are:** "Not just a cannabis store." Self-described survivor of one of the hardest cannabis markets in Europe. 15+ years. Fabulous energy. Doc took a selfie with him at their stand.  
**Personal notes:** Crazy Italian guy. Doc loves him. Into Noel Gallagher (confirmed — not Liam). Stone Roses. Big personality.  
**What to build:** B2B directory entry — Sir Canapa, category: Cannabis Shop / Retail, Italy + Czech Republic. Two listings or one with dual location.  
**Status:** ⚠️ NOT YET IN DIRECTORY — needs adding via b2b-conference.html or direct Supabase entry.

#### Tyson's people
Doc was standing next to friends of Mike Tyson at the conference. Tried to show them the site but the mobile rendering was broken at that moment. They left before the fix deployed. No contact details captured. Note for the record only.

---

## THE KREUZBERG DOWNLOAD — 15 June 2026

Doc in a park in Kreuzberg. Vaporizer. High as fuck. Loving Berlin. Voice note, unedited ideas. Do not write the manifesto without him — but lock every phrase in here.

---

### THE PHRASE: "Don't advertise your kindness. Communitize it."

This is the B2B pitch in one line.

Every business at Mary Jane Berlin was advertising their kindness — giving away promotional stuff to conference attendees who throw away everything except the one thing that was useful. The gift goes to people who don't need it, in a context where gratitude is impossible. You're giving "in kind" and hoping it gets paid back, unless someone else's freebie was better.

The village communitizes kindness. The gift goes into the community. It lands with someone real, someone who needed it, someone who didn't expect it. Gratitude is maximum. Brand loyalty is permanent.

**"Communitize your kindness"** — this is the opening line of the B2B pitch page. Probably the opening line of the manifesto. Lock it.

---

### THE VILLAGE OPERATING SYSTEM

- No bad actors: everybody is real (verified by £3/mo)
- Three strikes and you're out — community majority decides, not Doc
- If the majority say you're out of order, you suck it up and move on
- No box. No algorithm. No way to fake it.

Self-governance, not moderation. The village polices itself because everyone has skin in the game. They paid. They chose to be here. They're invested.

---

### THE BREXIT RULE (community conflict resolution)

Sometimes you're right about something and you have to shut up about it anyway — for the sake of the relationship and the thing you both actually care about.

When someone says something that lands wrong: "can you do me a favour, don't say it like that again because it really gets me." Person says "yeah, fair enough." That's it. No drama, no exile, no public takedown. Honest human conversation. That's how the village handles conflict.

---

### "I DON'T KNOW" IS THE MOST POWERFUL PHRASE

Stop nodding along like you understand when you don't. Half the time the information isn't even going in — floating in the ether while you stand there like a gormless gnome.

"Say I don't know what you're on about. Say I'm not interested if you have to."

The alternative Doc describes: wallowing in comfortable ignorance so governments can manipulate you — "just like I did for 57 years." That's the enemy. Not bad people. Comfortable ignorance.

The village is built on intellectual honesty. You don't have to pretend. You don't have to perform. If you don't know, say so. That's where everything starts.

---

### DELEGATE OR DROWN

"You're not supposed to do everything. You're supposed to delegate to people who can do it better than you. Do your thing. You're not under any unnecessary pressure to be something you're not."

Applies to Doc personally. Applies to every villager. Applies to every B2B business — be excellent in your lane, let the village connect you to the rest.

---

*Voice note recorded in a park in Kreuzberg, Berlin. 15 June 2026. Under a tree. On a vaporizer. High as fuck. Loving it.*

---

## THE SECOND KREUZBERG DOWNLOAD — 15 June 2026 (10 minutes later)

This is the manifesto. The spine of it. Every word verbatim.

---

> "The industry needs insurance. It needs people who know how to sell the product correctly. And that is through honesty — making people realise that cannabinoids are something that we have relied on all the time, as humans. It's only over the last hundred years it's been kept from us."

> "It's been kept from us so we could be sold pills that make us ill. But the worm is turning."

> "Everyone in the industry — whether it's legal or illegal, whether it's pharmaceutical or whether it's on the street — must have the same voice. And that is: cannabis saves lives."

> "It saves people mentally and physically. And it's been held back from us. And in one voice we must free the weed. We can only do that if we join together in unity. This is our common ground. This is our community."

> "Free cannabis from big pharma. They were selling us literal poisons. They are testing things out on us like we're guinea pigs. Cannabis is the reason why most people are ill — because they don't have it."

---

### WHY THIS IS THE MANIFESTO SPINE

- **The common ground:** legal, illegal, pharmaceutical, street — same voice, same truth
- **The enemy:** not governments, not each other — big pharma selling poisons while holding back the medicine
- **The unity pitch:** you can only free it together. That's why the village exists.
- **The tagline:** "Free cannabis from big pharma" — this is the political dimension of Cannabin-Oid that was always there but never this clearly stated
- **"Cannabis is the reason most people are ill — because they don't have it"** — this is the medical case, the harm reduction case, and the community case in one sentence

**Do not write the manifesto without Doc talking it through. But this is the spine. Nothing gets written that contradicts these words.**

---

## GIL'S BOOK — THE SERIAL CHAPTER IDEA

Gil has stories. 35 years. Underground. Jail. Deportation. Lost everything more than once. Still standing. Still growing.

Doc's pitch to Gil: release the book as a serial on Gumroad — one chapter every couple of weeks. People buy in, buzz builds, feedback comes in, Gil writes toward what's landing. The community shapes the book in real time.

**Why this works:**
- Each chapter is an event — people wait for it, talk about it
- Gil hears live feedback and writes the next chapter knowing what landed
- Gumroad handles payment and delivery — zero infrastructure needed
- The village is the built-in first audience — verified patients who already trust the source
- A 35-year underground cultivator's raw stories are unlike anything published in the legal cannabis space

**Format:** Short chapters, self-contained stories. Not an autobiography — more like *dispatches*. Each one could stand alone, each one pulls you into the next.

**Doc's role:** Not ghostwriter. Editor, publisher, connector. Doc has done six books. He knows the process. He introduces Gil to the village, the village introduces Gil to the world.

**Note from Doc:** "He was so proud of me. He said: tell them about when you arrived." Gil sees Doc as one of his own. That trust is the foundation of the whole project.

**Status:** Idea agreed in conversation at Mary Jane Berlin, 15 June 2026. Nothing built yet. Start with Gil's page (`cannabin-oid.co.uk/gil`) — already live. Next: talk to Gil about the first chapter.

---

## DAY 2 — 14 June 2026 (Mary Jane Berlin, Day 2)

### Contacts added today

Three warm contacts captured from the floor. SQL ready but **NOT YET RUN** in Supabase.

**To get them live:** Paste `supabase/add-maryjane26-contacts.sql` into the Supabase SQL editor and run it.
Direct link: https://supabase.com/dashboard/project/pdnjeynugptnavkdbmxh/sql

---

#### 1. Imkerei Tamás Megyes 🍯 — THE HONEY MAN (WARM PAYING LEAD)
**Email:** info@imkereimegyes.de | **Phone:** 05303 5083355 / 0151 54655212  
**Website:** www.imkereimegyes.de | **Location:** Wendeburg-Rüper, Germany  
**What they do:** Artisan honey with cannabis strain names — Purple Haze (blackcurrant), Blue Dream (vanilla & tonka bean), Strawberry Cough (strawberry & tonka bean), Tonka Cinnamon Boom (cinnamon & tonka bean). 50g jars. Regional, handcrafted, limited edition.

**THE DEAL AGREED IN PERSON:**
Doc pitched £99/mo Hamlet B2B. He said: "Can you sell these for us?" Doc said: "Yeah, absolutely — products listed on your Hamlet page with a direct PayPal link, payments go straight to you, you ship directly. Start making millions, look after me." He laughed and said "Will do."

**What needs building to deliver on this:**
- Extend the Kit Grid to support a `paypal` link type (alongside `amazon` and `ebay`)
- Open Kit Grid / product catalogue to B2B Hamlet tier (currently Founder-only)
- His products would be: each honey variety, price, description, [Buy via PayPal →] link
- He handles fulfilment entirely — Cannabin-Oid is the shop window

**Follow-up:** Email info@imkereimegyes.de when you're back. Reference Mary Jane Berlin, the conversation, tell him the page is being built. The strain names alone will get every Elder member clicking.

---

#### 2. Exclusive Seeds Bank 🌱 — José Luis Moya, CEO
**Email:** pepe@exclusiveseedsbank.com  
**Phone:** +34 688 442 465 / +34 937128 487  
**Website:** exclusiveseedsbank.com | **Social:** @exclusiveseedsbank  
**Location:** Avd. Font i Sagué 7-3 Bis, 08227 Terrassa, Barcelona, Spain  
**What they do:** Premium cannabis seed bank. Doc and José Luis photographed together at the stall holding the Exclusive card — very warm connection.

---

#### 3. CardPlicity 💳 — Cannabis Payment Processing
**Website:** www.cardplicity.com  
**What they do:** Transparent payment processing for high-risk cannabis businesses. 100% honest fees — no mystery math, no phantom charges. Most merchants think they pay ~4%; real number is often 6–9% after junk fees. CardPlicity audits line by line and strips the nonsense. Serves dispensaries, seed companies, clone sellers, cannabis-adjacent businesses. Free processing audit available.

**THE HUMAN BIT (don't lose this):**
Both the CardPlicity guy AND the guy on the same stall are drum and bass DJs. Both into drum and bass. Doc connected with them as OG drum and bass / OG raver. Told them to come to Bristol. They loved it. This is not a cold business contact — this is a rave connection first, a business connection second.

**Follow-up tone:** Lead with drum and bass and Bristol. The payment processing conversation follows naturally from the trust. Don't send a business email. Send a "when are you coming to Bristol" message.

**Note:** Could be useful infrastructure for when Cannabin-Oid handles payments at scale.

---

### What's NOT yet done (carry forward)

- **Run the SQL** — `supabase/add-maryjane26-contacts.sql` — gets all 3 live
- **Build PayPal product listing** — for the honey man's Hamlet (Kit Grid extension)
- **Email the honey man** — info@imkereimegyes.de — close the £99/mo deal
- **Sir Canapa** (from 13 June) — still not in the directory

---

### Session end — 14 June 2026

Doc hit a 90% THC oil at the stall. Coughed for ages. Ate a big cake from the morning. Now needs chicken. He's done. Rightfully so.

**Branch:** `claude/affectionate-shannon-taa8bj`  
**Status:** SQL committed and pushed, not yet run. No other code changes today.

*"Feel Famous, baby."*
