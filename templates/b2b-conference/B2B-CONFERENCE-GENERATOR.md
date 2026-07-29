# B2B Conference Scanner — Village Generator
## Replicate the cannabin-oid conference system for any -Oid village

This template system generates a complete B2B conference scanner for any industry.  
Built from the cannabin-oid / Mary Jane Berlin 2026 pattern.  
Ask Doc these questions, fill the config, generate the files.

---

## THE 8 QUESTIONS

Ask Doc these before generating anything:

```
1. SITE NAME
   What is the -Oid site? (e.g. magic-oid.co.uk, radi-oid.co.uk, sail-oid.co.uk)

2. INDUSTRY
   What industry is this for? One word or phrase. (e.g. magic, radio, sailing, tattoo)

3. PRIMARY COLOUR
   What hex colour represents this village? (cannabin-oid uses #16a34a green)
   Dark background colour? (cannabin-oid uses #0a1a0a)

4. BUSINESS CATEGORIES
   What are the 3-6 types of businesses in this industry that would attend an expo?
   For each: give it a slug (lowercase, no spaces), a label, and an emoji.
   Example (cannabis): seedbank/🌱 Seed Bank, club/🌿 Social Club, cultivationtech/⚙️ Cultivation Tech

5. WHAT THE SCANNER SHOULD LOOK FOR
   What does a business card/badge/flyer in this industry typically show?
   What makes a "seed bank" equivalent in this industry? Help the AI categorise correctly.

6. CURRENT EVENT
   What is the first event this will be used at? Full name + a short reference code.
   Example: "Mary Jane Berlin June 2026" → "maryjane26"

7. SUPABASE TABLE NAME
   What should the database table be called? (e.g. b2b_businesses, magic_b2b, sail_b2b)
   Use the same Supabase project: pdnjeynugptnavkdbmxh

8. THE COLLABORATION PITCH
   Why are businesses in this industry NOT competitors, even if they do similar things?
   What do they need from each other? What's the supply chain they don't know exists yet?
   (This becomes the pitch guide and the site philosophy for this -Oid)
```

---

## THE CONFIG OBJECT

Once you have the answers, fill this in. Everything else generates from it.

```javascript
const VILLAGE_CONFIG = {
    // Identity
    siteName: '{{SITE_NAME}}',           // e.g. 'magic-oid.co.uk'
    industry: '{{INDUSTRY}}',            // e.g. 'magic'
    industryLabel: '{{INDUSTRY_LABEL}}', // e.g. 'Magic & Mentalism'

    // Colours
    primaryColor: '{{PRIMARY_COLOR}}',   // e.g. '#7c3aed' (purple for magic)
    primaryDark: '{{PRIMARY_DARK}}',     // e.g. '#5b21b6'
    bgColor: '{{BG_COLOR}}',             // e.g. '#0a0014'
    textColor: '{{TEXT_COLOR}}',         // e.g. '#e9d5ff'
    accentColor: '{{ACCENT_COLOR}}',     // e.g. '#a78bfa'

    // Event
    currentEvent: '{{CURRENT_EVENT}}',   // e.g. 'Magic Circle Convention 2026'
    currentEventRef: '{{EVENT_REF}}',    // e.g. 'magic-circle-26'

    // Database
    supabaseTable: '{{SUPABASE_TABLE}}', // e.g. 'magic_b2b'

    // WhatsApp (always Doc's number unless a different village owner)
    whatsappNumber: '447976884254',

    // Categories — array of { value, label, emoji, scannerHint }
    categories: [
        // { value: 'performer', label: 'Performer / Act', emoji: '🎩', scannerHint: 'stage magicians, mentalists, illusionists, close-up artists' },
        // { value: 'supplier', label: 'Props & Supplies', emoji: '🃏', scannerHint: 'magic shops, prop makers, card manufacturers, gimmick suppliers' },
        // ...
    ],

    // Pitch — the collaboration truth for this industry
    pitch: `{{PITCH_TEXT}}`,

    // Scanner context — tells Gemini how to categorise cards in this industry
    scannerContext: `{{SCANNER_CONTEXT}}`,
};
```

---

## FILES TO GENERATE

Once the config is filled, generate these 4 files using the templates:

| Template | Output | What changes |
|----------|--------|-------------|
| `b2b-conference-template.html` | `/[site-root]/b2b-conference.html` | All `{{PLACEHOLDERS}}` replaced |
| `create-b2b-listing-template.js` | `netlify/functions/create-b2b-listing.js` | Table name, CORS origin |
| `scan-b2b-card-template.js` | `netlify/functions/scan-b2b-card.js` | Category prompt, industry context |
| `setup-b2b-table-template.sql` | `supabase/setup-[table-name].sql` | Table name |

---

## ALWAYS INCLUDED (no placeholders, same on every -Oid)

The Symbiosis Engine footer is already baked into `b2b-conference-template.html`. Do not remove it. Do not replace it. It is always the same link, always the same copy. Every -Oid B2B page is a funnel for it.

```
"You just saw what AI can do — Ready to own your AI future?"
→ https://symbiosis-engine.netlify.app/
```

Same block goes in the main site footer (`index.html`) of every -Oid too.

---

## SHARED INFRASTRUCTURE (reuse, don't rebuild)

These are already on the Supabase project and Netlify:
- `SUPABASE_SERVICE_ROLE_KEY` env var ✅
- `GEMINI_API_KEY` env var ✅
- Supabase URL: `https://pdnjeynugptnavkdbmxh.supabase.co` ✅

The SQL just creates a new table in the same Supabase project. Each -Oid gets its own table.

---

## WHAT STAYS THE SAME ACROSS ALL -OIDS

- The scan → fill → submit → success flow
- The two collaboration questions ("What do you need? What can you offer?")
- The Elder membership invite offer (10 per business)
- The WhatsApp fallback on failure
- The QR code on success
- The "generosity is rewarded" principle
- The Supabase-as-live-directory pattern
- The Ask Terp equivalent loading from Supabase for AI mentions

## WHAT CHANGES PER -OID

- Site name, colours, logo
- Industry categories (seedbank → props shop; CSC → magic circle; cultivationtech → lighting rig supplier)
- Event name and reference code
- Scanner AI prompt (how to categorise cards in that industry)
- The pitch (why they're collaborators not competitors — unique to each industry)
- Supabase table name

---

## THE PHILOSOPHY THAT APPLIES TO ALL OF THEM

Doc's insight from Mary Jane Berlin 2026 applies universally:

Every industry has a conference day where businesses give things to the wrong people in the wrong context and get nothing back. Every industry has businesses that think they're competing when they're a supply chain that doesn't know it exists yet. Every industry has people in need who would feel genuine gratitude for the things that currently get thrown away.

The B2B conference scanner is not a cannabis tool. It is a village-building tool. It works anywhere Doc goes, for any community where connection is the missing ingredient.

**"Ich bin ein Berliner."** Whatever the industry, Doc IS the community. That's the pitch.

---

*Generated from the cannabin-oid Mary Jane Berlin 2026 pattern.*  
*Feel Famous, baby.*
