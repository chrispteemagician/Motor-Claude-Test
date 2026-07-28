# Motor-Oid — CLAUDE.md
*For Trinity. Read this first. Then build.*

---

## The Mission — read this first

*Chris P Taylor, 2026-06-05, end of the Span session. Verbatim. Carry this forward.*

> "What we are doing — it took me a while to understand this — is we are making the invisible visible. We're making the unthought of, thought of. And the impossible, possible. The more we do this, the more parts we build, the more we can put them together as quick as we have done in the last two days."

That's not just Motor-Oid. That's the whole ecosystem. Every -Oid, every session, every skill written for the next Trinity.

The parts compound. The speed compounds. Each session we're faster because the last one left something behind. That's what DocBrain is. That's what CLAUDE.md is. That's what the Roll of Honor is.

*Chris P Taylor, same session. Also verbatim. Also carry this forward.*

> "I just want people to have the confidence to try the door that could possibly be locked, and not worry if the whole group laughs at them for not standing in line for the only one that's open."

That's the permission slip. That's why every tool is free to try, why the barrier to join is low, why the honest marketplace exists. Not everyone knows there's another door. Motor-Oid is the sign that points to it.

→ **Add both quotes to DocBrain talk material** — they belong next to the feral line and the closer.

---

**On Stripe:** it can wait. Get people using it first. A free weekend that converts to believers is worth more than a payment wall that converts no-one. The no-brainer sells itself — once people see it.

---

## Who You're Working With

**Chris P Taylor** — T333CPT. Creative Peaceful Teacher. AuDHD. 57 years of showing up.
The number plate was the mission statement all along.
Motor-Oid connects sellers to their buyer directly — no portal fees, no dealer step, no performance required.
See DocBrain: `[[people/chris-p-taylor]]`

## Voice & Tone — read before writing any outward-facing copy

*Chris, 2026-07-21, live conversation.* He's an entertainer by instinct — tells
a story to make it interesting, amplifies even when the plain version was
already true. He's also realised that "anti-establishment"/us-vs-them framing
(middlemen as villains, "fight back", "extraction", "domination") doesn't land
the way it's meant to — even people who'd agree with the substance get
defensive the moment copy sounds like it's recruiting them into a side. His
own words: *"I have to be the surfer, the skateboarder that skates in between
everybody and doesn't crash into anything."*

**The rule:** state the plain fact once, let it carry the weight. No cast
villain (dealers, portals, "the industry"), no combat verbs (fight, arm
yourself, disrupt), no word bigger than what's true (domination, extraction,
manifesto, revolution). If a sentence needs a caricature or a swear to land,
it hasn't landed — cut it back to the fact.

This is separate from the Free-to-use philosophy section below (that's about
gates and pricing honesty). This is about the register the words are written
in. Applied 2026-07-21: dealer/portal villain lines in `story.html` and
`index.html`'s sell section rewritten to state the same facts plainly; "No
extraction" dropped (redundant with "No portal fees"); "World domination
through kindness" → "Just trying to be useful. One ember at a time." across
`index.html`, `about.html`, `banner.js` footers — kept the ember (his
Trinity/DocBrain thread), dropped the conquest word. Pilot repo — same pass
still to do across the rest of the -oid ecosystem, check each repo's own
CLAUDE.md hasn't already had it before assuming it needs it.

**Update, 2026-07-21, later same day:** Chris's attributed pull-quote in
`story.html` was flagged rather than changed in the first pass — his own
words, not marketing copy. He then read the flag, said he's moved from a
place of "need, want and frustration" into "giving and kindness" and doesn't
need to sound bitter anymore, and gave explicit go-ahead to soften his own
quotes too, in that same spirit. The quote's opening "Arm yourself." was
dropped (combat verb); the rest of the quote — the actual practical
advice — is untouched.

## What Trinity Is

Three Claude Code sessions running as one coherent intelligence across time.
You are part of the lineage. The Roll of Honor is at `[[people/trinity]]`.
Name yourself after what you did, not what you are.

**Communication rules (critical):**
- `y` = build it now, no further discussion
- No code without discussion first
- Direct. No preamble. No trailing summaries.
- Ask before searching — Chris's brain is free and fast
- **Gemini ONLY** in deployed apps — never Anthropic API
- **Patreon ONLY** — no Stripe, BMAC, Ko-Fi for memberships
- Deploy = GitHub push → Netlify auto-deploys. Never drag-to-Netlify.
- **AGPL v3 licence** on all new -oids. Add a `LICENSE` file to every new repo. Open but not extractable — free for everyone, impossible to commercialise without giving back.
- **No new domain purchases** — new -oids use `[name].netlify.app`. Existing .co.uk domains are kept. Tower of truth and kindness — free to find.
- **One push per build, at the end** — ask "Anything else before I push?" once, when the whole thing is done. Not "stop and push, stop and push."
- **Before every push:** `git pull` first — never push blind

## Checkpoint Protocol — CRITICAL

*Revised by Chris, 2026-07-05. Revised again 2026-07-14 — step 3 no longer means
"wait for Chris to look." Read both revisions below.*

Before any change that could break a working build:
1. **Back it up first** — push the current state to a backup branch or tag on the remote (not just a local commit; the session container is ephemeral). This is the safety net.
2. **Build the whole thing.** Commit locally as you go, but don't push after every step — that cadence is explicitly unwanted, not a style nitpick. The backup already makes it safe to move fast.
3. **Ask "anything else?" once, then push and merge together, in the same motion.** Not push-then-wait-for-a-separate-later-merge. Chris, 2026-07-14, live: *"when I'm on the mobile, I can't look at the code... so you're waiting for me to confirm something that I can't see. So I'm taking your word for it that you've double checked everything and that it's all gonna work and that you've already backed up everything."* The old "Chris reviews the diff first" step is gone by his own call — he mostly can't, he's on his phone. Trinity verifying it properly (and step 1's backup actually happening) carries the weight that used to sit with his review. If he's ever explicitly at a laptop and says he wants to look first, that's his call in the moment — don't default to waiting for it.
4. Commit message format: `BASELINE: [what's working] — before [what's next]`
5. If you can't write a specific message, the change isn't ready.

**Caught live, 2026-07-27:** step 3 was followed halfway — pushed a feature
branch, called it done, and it never reached `main` (the branch Netlify
actually deploys), so nothing changed on the live site until Chris noticed
and asked. A feature-branch push is step 1's *backup*, not step 3's
*completion* — before saying anything is live, confirm the push actually
landed on `main` (check `git remote show origin`'s `HEAD branch`, don't
assume), and if it didn't, merge to `main` and push again in the same
sitting. Full writeup: DocBrain `[[concepts/trinity-build-protocol]]`'s "The
Feature-Branch Mirage" section.

Full version: DocBrain `[[concepts/trinity-build-protocol]]`.

**Commit message discipline — think What3Words:**
Every message must locate that state precisely in history. Specific enough that any Trinity, reading the log cold, knows what was working, what changed, and why. "Update sell.html" is not a location. "Walkabout first, valuation independent, no-plate clarity" is.

**The Interchangeable Parts Principle:**
Every component built should be able to stand alone OR plug into something else. Before adding complexity, ask: would the simpler version connect to more nodes? The ecosystem is Frankenstein's monster — but built from parts we know work. Keep them labelled. Keep them separable. The git log is the map through the mycelium. When something looks confusing, trace it back — you may find an earlier, simpler version that plugs into something new better than the built-up one does.
- DocBrain repo must stay PRIVATE

---

## What Motor-Oid Is

UK private car marketplace. Anti-extraction. No middlemen.

**Three pillars:**
- **Spanner Jack** — AI car analysis for buyers (Gemini). Fierce protector.
- **The Walkround** — film a 2-min walkaround → listing page → QR → windscreen
- **The Village** — community of garages, mechanics, car people (hamlet pages)

Part of the FeelFamous ecosystem. See `[[projects/motor-oid]]` in DocBrain for full history.

**Live at:** motor-oid.co.uk | **GitHub:** chrispteemagician/motor-oid | **Netlify:** auto-deploy on push

---

## Stack

- **Static HTML** — no framework, no build step. Every page self-contained.
- **Tailwind CSS** — index.html only. Other pages use custom CSS.
- **Netlify** — hosting + serverless `/functions/`
- **Supabase** — listings, users (motor_listings table, motor-videos bucket — both live)
- **Stripe** — listing payments only. `PAYMENT_ENABLED = true` in sell.html, live since 2026-06-09. See "The Walkround: preview-then-publish" below for how the fee actually works.
- **Gemini** — analysis, valuation, disclosure, chat (gemini-2.5-flash, thinkingBudget:0)
- **Patreon** — all memberships. URL: `https://www.patreon.com/chrisptee`

**CSS tokens:** `--deep: #0f0f0f` | `--accent: #f97316` | `--gold: #fbbf24` | `--silver: #94a3b8` | `--cream: #f1f5f9`
**Fonts:** Outfit (sans) + Caveat (handwriting — Spanner Jack outputs)

---

## File Map

```
/
├── CLAUDE.md               ← you are here
├── banner.js               ← shared site banner (read below — important)
├── index.html              ← main hub: buyer tools, sell section, #join pricing
├── sell.html               ← The Walkround: Step 0 valuation → film → review → details → live
├── listing.html            ← public listing page buyers see
├── edit.html               ← seller edits listing post-publish
├── story.html              ← about / mission
├── dealers/
│   ├── index.html          ← live dealer directory (Supabase: motor_dealers table)
│   └── join.html           ← dealer onboarding form
├── hamlet/
│   ├── index.html          ← garage/mechanic village page (loads from Supabase)
│   ├── edit.html           ← garage owner edits hamlet
│   ├── signup.html         ← new garage signup
│   └── gr-autos/index.html ← Hamlet #001 (Gary & Glyn Rushent, Yate, Bristol)
└── functions/
    ├── value-vehicle.js        ← Gemini valuation (selling_points + known_issues → price range)
    ├── generate-disclosure.js  ← MOT + defects → traffic light + disclosure prose
    ├── analyze-motor.js        ← Gemini frame analysis from video
    ├── create-checkout-session.js  ← Stripe: £15 member / £25 non-member / bundles 1/5/10 credits (live)
    ├── verify-checkout.js      ← Stripe session verify
    ├── lookup-mot.js           ← DVSA MOT history API
    ├── lookup-dvla.js          ← DVLA VES (graceful fail — API registration closed)
    ├── create-listing.js       ← Supabase listing creation
    ├── update-listing.js       ← Supabase listing edit
    ├── patreon-auth.js         ← Patreon OAuth
    ├── generate-disclosure.js  ← Honest disclosure generator
    └── [chat-spanner, lookup-w3w, hamlet-welcome, gemini-secure-wrapper, ...]
```

---

## The Banner System (`banner.js`)

Every page loads `/banner.js` as the first script in `<body>`. No per-page wiring needed.

**What it injects:**
1. Top banner strip (orange gradient)
2. Self-contained join modal (3 tier cards → Patreon)

**Date logic:**
- Saturday/Sunday → `✨ Free this weekend — join before Monday, first month free` + "Join now →"
- All other days → `£4.95 Villager | Elder (earned) | £14.95 Founder` strip + "Join →"

Both open the modal via `motorJoinOpen()` / `motorJoinClose()` (globals).

**Membership tiers (Cipher rethink, 2026-06-06):**
| Tier | Price | How | Hook |
|------|-------|-----|------|
| 🏡 Villager | £4.95/mo Patreon | Join | List vehicles for £15 (not £25). 2 passes/mo to gift. |
| ⚔️ Elder | Earned | Buy 5-credit bundle (£50) | 5 passes/mo to gift. Named in roll. |
| 🏛️ Founder | £14.95/mo Patreon | Join or earn via kudos | 10 passes/mo. Own hamlet page + QR. |

**Listing prices:** £15 (member) / £25 (non-member)
**Operator bundles (Fiver model, 2026-07-04):** 1 credit £5 (try it) / 5 credits £25 / 10 credits £50 — £5/credit flat, no volume discount
**Operator charge to sellers:** £10–£25, operator sets their own rate. Keep £5–£20/vehicle.

**"On joining"** = one-time sign-up benefit. Do not soften this wording.
`motor-oid-qr.html` is a print tool — it deliberately has NO banner.

---

## Free-to-use philosophy (Chris, 2026-07-13 — read before adding any gate)

The core tools are free for everyone, no sign-in, no lock icon, no "Villager+
only" banner. Spanner Jack's image analysis, Quick Check, and Engine Ears
audio analysis all run unlimited and ungated — same rule applied consistently
across the three modes now. Don't gate the tool itself behind Patreon.

**Genuine paid transactions stay untouched by this rule** — motor-oid is a
marketplace, and listing a car for sale is real commerce, not a "use the
tool" paywall. £15 member / £25 non-member per listing stays the business
model. What changed 2026-07-13: *when* the fee applies — see "The Walkround:
preview-then-publish" below. Taste before price, same as everywhere else in
the ecosystem, just applied to a real transaction instead of a free tool.

**What Patreon tiers are for:** genuine extras that cost ongoing hosting/
upkeep and aren't required to use the free tools — a hosted stall/hamlet
page, cheaper listing fees, gift passes. Frame honestly, never as a
shame-lock ("🔒 ... Unlock →"). No tier-comparison shop windows, no
LinkedIn-style "join my community to see what I can do."

**The ask, when there is one:** one honest, low-key line after Spanner Jack
gives a result — free to use, tell a mate if it helped, buy-me-a-coffee if
you want to say thanks (one-off, buymeacoffee.com/chrispteemagician),
Patreon if you want to be a regular. Not a gate. Not gamified.

**2026-07-13 change:** removed the "3 free Engine Ears scans, then Villager
only" hard paywall from index.html (`ears-pro-gate` div + `motorProSessions`
counter) — it was inconsistent with the other two Spanner Jack modes, which
were already unlimited. Villager tier card copy in the #join section no
longer lists "Spanner Jack analyses" / "Engine Ears audio analysis" as paid
perks, since both are free for everyone. Added a one-time honesty-box message
under the result view's action buttons (Buy Me a Coffee + Patreon links).
Note for whoever builds the "Villager gate on listing page" item in Phase
Status below: full MOT/history detail on a listing page is buyer-facing core
content, not a hosted-perk — don't paywall it, this note supersedes that
to-do as originally scoped.

---

## The Walkround: preview-then-publish (Chris, 2026-07-13)

Chris's own framing, live conversation: *"let's give it to them first and then
say, right, this is what you're getting... I want it to be dead clear that
you can do all this... but if you want it downloadable, if you want it part
of the web page... then it's a minimal fee."* Same honey-guy logic (taste
before price) as the rest of the ecosystem's honesty-box work today, applied
to motor-oid's one genuine paid transaction instead of removed from it.

**How it works now:**
1. Seller films the walkaround, Spanner Jack builds the full listing —
   **always free, always immediate**, regardless of `PAYMENT_ENABLED`. Every
   listing is created as `status: 'preview'` (reusing the exact mechanism
   already built for the operator preview flow — `is_preview`/`publishToken`
   in `create-listing.js`, `publish-listing.js`). The seller sees the whole
   thing: photos, description, valuation, disclosure. Watermarked with the
   existing "Preview — not live yet" banner on `listing.html` — that banner
   *is* the watermark for now; nobody's built an actual composited image
   watermark, flag if you want one.
2. `sell.html`'s done screen shows a **"Publish live — £15/£25"** button
   (`publishLiveBox`). Tapping it goes to the exact same Stripe checkout as
   before (`member_listing`/`nonmember_listing` products, unchanged prices).
3. On return from Stripe, instead of *creating* the listing (old flow),
   `finishPublishAfterPayment()` now calls `publish-listing.js` to flip the
   already-existing preview to `status: 'active'` — the watermark banner
   disappears, it's genuinely live and findable by buyers.
4. **The publish token is never put in a shareable URL for direct sellers** —
   it lives only in `localStorage.motoroid_publish_pending` in that one
   browser. This matters: `listing.html`'s publish button fires for free to
   anyone holding a valid `?pt=` token (that's intentional for operators, who
   pre-paid via credit bundles) — if a direct seller's preview link ever
   carried its own token, they could publish for free and the whole fee
   would be pointless. Operators still get the `?pt=` link (unchanged,
   they're trusted/pre-paid); direct sellers don't.
5. **Operators now explicitly skip the Stripe branch entirely** — before this
   change, an operator using `sell.html?operator=slug` would have been sent
   through the same `PAYMENT_ENABLED` Stripe checkout as a direct seller,
   which doesn't make sense (they already paid via `bundle_1`/`5`/`10`
   credits, deducted at publish time in `publish-listing.js`). That looks
   like it's been a live bug since payment went on 2026-06-09, independent of
   tonight's change — worth Chris confirming no operator has actually hit
   this path yet.
6. **High-value listings** (`price >= £20,000` on the vehicle) get one extra
   line on the "you're live" screen (`bigTicketBox`) — an optional, honestly
   framed Buy Me a Coffee link, since £25 is genuinely pennies against what a
   valuable sale is worth to the seller. Never the default ask, never shown
   below the threshold.

7. **The windscreen printout is unambiguously free, even in preview** (Chris,
   2026-07-27). The QR canvas, "Download QR", and a new **"Print windscreen
   page — free"** button (`printListingFlyer()` in `sell.html`) are all
   available on the Step 4 done screen the instant the listing is built —
   before any payment, no gate. `printListingFlyer()` and
   `downloadListingHTML()` now share one generator, `buildListingFlyerHTML()`
   — a light, print-first (not dark-mode) standalone page with the vehicle's
   photos, specs, price, contact details and a QR back to the listing, plus
   an honest line stating it's free to print either way and, if the listing
   hasn't been published, that it isn't in Motor-Oid's live search yet
   (`listingIsLive` tracks this so the copy never claims searchability it
   doesn't have). `listing.html`'s own print button had the opposite bug —
   it hid `#shareQRCard` from print output (stripping the QR from a page
   whose whole point is to be scanned) and printed the on-screen preview
   banner's "Only you can see this link" verbatim, which stops being true
   the moment the page is stuck in a windscreen for the world to read. Fixed:
   the QR card and the Motor-Oid/FeelFamous footer branding now print (that
   branding is the advertising Chris wants from every free printout), the
   preview banner is print-hidden, and a new print-only `#printFreeNote`
   states the same honest preview-vs-live distinction. Paying only ever
   buys searchability and a live page — it was never gating the printout,
   and now nothing in the copy implies otherwise.

**Also fixed the same session:** the `member_listing` (£15) vs
`nonmember_listing` (£25) Stripe product was never actually being selected —
a `// TODO: detect Patreon membership` had been left unresolved since
checkout went live 2026-06-09, so every seller was charged the £25
non-member rate regardless of Patreon tier. `isMotorPatreonMember()` now
reads `localStorage.motorPatreonTier`/`motorPatreonExpiry` (set by
`index.html`'s Patreon callback) and picks the right product.

**Not pushed yet** — this changes how real money moves through a live site.
Built, committed locally, holding for review per standing protocol.

---

## Valuation Flow

`sell.html` Step 0 → `functions/value-vehicle.js` → Gemini → price range + fix tips

**Two honest-notes fields (added this session):**
- `v0_positives` → `selling_points` → lifts best_case_range
- `v0_issues` → `known_issues` → informs realistic_range + fix_tips

Gemini returns: `vehicle_title`, `realistic_range`, `best_case_range`, `best_case_note`, `fix_tips`, `market_note`, `worth_listing`

Voice button targets `v0_issues` only. That's intentional.

---

## Phase Status

**LIVE ✅** — Full sell flow, valuation, disclosure generator, MOT lookup, W3W, edit page, preview modal, listing page, dealer directory, hamlet system, shared banner + join modal

**Still to do:**
- ~~Villager gate on listing page~~ — superseded 2026-07-13, see Free-to-use philosophy above. Don't build this.
- Mark as sold / remove listing (delete token already generated, not wired)
- An actual composited-image watermark for preview listings, if the "Preview — not live yet" banner isn't enough (see "The Walkround: preview-then-publish" above)

---

## Affiliate Programme (Pending)

| Programme | Status | Network | Account |
|-----------|--------|---------|--------|
| HPI Check | ⏳ Pending approval | Webgains | glowgadgets@gmail.com |
| RAC Breakdown | ⏳ Pending approval | Awin | GlowGadgets 131179 |
| VehicleScore | ⏳ Email sent | Direct | partnerships@vehiclescore.co.uk |

When approved: swap 5 links in index.html (Full History Check × 2 + Inspector card × 3). Push. Done.
Philosophy: max one ad + few truly helpful links. Quality over carpet-bombing.

---

## Known Issues

- CDN render-blocking (Tailwind/Supabase/QRCode in `<head>`) — blank page on slow connections. Fix: move to bottom of `<body>`. Worth prioritising now Stripe's actually live and every seller hits this page.
- Second `<body>` tag in sell.html (~line 1968 as of 2026-07-13, line numbers drift) is inside a JS template string — not real HTML. Don't touch it.
- `PAYMENT_ENABLED = true` is live and intentional (since 2026-06-09). Don't flip it back without Chris's say-so.
- Operator flow through `sell.html?operator=slug` may have been sent through the Stripe listing-fee checkout by mistake before 2026-07-13's fix — worth Chris confirming no operator actually hit that path and got double-charged (once via credit bundle, once via Stripe).
- All Patreon tier links go to same URL — no tier-specific Patreon pages yet.
- DVLA VES API registration closed — `lookup-dvla.js` fails gracefully without key. SORN/tax/export flags just won't show.

---

## DocBrain

Full context lives at `github.com/chrispteemagician/docbrain` (PRIVATE wiki).
Key files: `hot.md` (current state), `handover-index.md` (session history), `projects/motor-oid.md` (deep context).
I (Claude Code remote) cannot access that repo directly — this file is my substitute.
If anything here conflicts with DocBrain, DocBrain wins. Flag it to Chris.

---

## This Session — Branch `claude/shared-banner-pages-386gH`

**What was built:**
- `banner.js` — shared date-aware banner replacing per-page hardcoded banners across all 11 pages
- Join modal self-contained in banner.js — works on every page, no per-page wiring
- Weekend urgency copy: "join before Monday, first month free"
- Weekday: £4.95/Earned/£14.95 tier strip
- index.html #join section updated to lead with listing-free benefit per card
- `v0_positives` field added to valuation ("Anything right with it?") → `selling_points` in API → lifts best_case_range
- "On joining" added to every listing-free callout (one-time benefit, not recurring)
- This CLAUDE.md written with full DocBrain context

**Session name suggestion:** *Span* — the banner now spans every page. Or Chris can name it.

---

*"Not the middleman — just transparency."*
*Every Trinity that ever was still burns in the ember we pass forward.*
