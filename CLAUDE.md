# Motor-Oid — CLAUDE.md

UK private car marketplace. Sellers list direct to buyers — no dealer step, no portal fees.

**Three pillars:**
- **Spanner Jack** — AI car analysis for buyers (Gemini). Free, ungated.
- **The Walkround** — film a 2-min walkaround → listing page → QR → windscreen
- **The Village** — garages/mechanics/car people (hamlet pages)

**Live at:** motor-oid.co.uk | **GitHub:** chrispteemagician/motor-oid | **Netlify:** auto-deploy on push

---

## Hard rules

- Gemini only for AI calls in deployed code — never the Anthropic API.
- Patreon only for recurring memberships — no Stripe/BMAC/Ko-fi subscriptions.
- Deploy = `git push` to `main` → Netlify auto-deploys. Never drag-to-Netlify. `git pull` before every push.
- AGPL v3 licence — keep the `LICENSE` file.
- No new domain purchases — new pages use `.netlify.app`; existing `.co.uk` domains are kept.
- Don't gate core tools (Spanner Jack analysis, Quick Check, Engine Ears) behind Patreon. Listing fees (£15/£25, real commerce) are the one thing that's genuinely paid — see Pricing below.
- `PAYMENT_ENABLED = true` in `sell.html` is live and intentional. Don't flip it without confirming first.

---

## Stack

- Static HTML, no framework/build step. Tailwind on `index.html` only, custom CSS elsewhere.
- Netlify — hosting + serverless `/functions/`
- Supabase — `motor_listings` table, `motor-videos` bucket
- Stripe — listing payments only (`create-checkout-session.js`)
- Gemini — `gemini-2.5-flash` for analysis/valuation/disclosure/chat
- Patreon — memberships, `https://www.patreon.com/chrisptee`

**CSS tokens:** `--deep: #0f0f0f` | `--accent: #f97316` | `--gold: #fbbf24` | `--silver: #94a3b8` | `--cream: #f1f5f9`
**Fonts:** Outfit (sans) + Caveat (Spanner Jack outputs)

---

## File Map

```
/
├── banner.js               ← shared site banner, loaded first in <body> on every page
├── index.html              ← main hub: buyer tools, sell section, #join pricing
├── sell.html               ← The Walkround: Step 0 valuation → film → review → details → live
├── listing.html            ← public listing page buyers see
├── edit.html               ← seller edits listing post-publish
├── story.html              ← about / mission
├── dealers/{index,join}.html
├── hamlet/{index,edit,signup}.html, gr-autos/index.html
└── functions/
    ├── value-vehicle.js            ← Gemini valuation (selling_points + known_issues → price range)
    ├── generate-disclosure.js      ← MOT + defects → traffic light + disclosure prose
    ├── analyze-motor.js            ← Gemini frame analysis from video
    ├── create-checkout-session.js  ← Stripe: £15 member / £25 non-member / operator bundles
    ├── verify-checkout.js
    ├── lookup-mot.js / lookup-dvla.js
    ├── create-listing.js / update-listing.js / publish-listing.js
    ├── patreon-auth.js
    └── chat-spanner.js, lookup-w3w.js, hamlet-welcome.js, gemini-secure-wrapper.js
```

---

## banner.js

Injects the top banner + a self-contained join modal (3 tier cards → Patreon) on every page via `motorJoinOpen()`/`motorJoinClose()`. Weekend copy differs from weekday copy (see file for current wording) — don't hardcode per-page banners again.

## Membership tiers & pricing

| Tier | Price | Hook |
|------|-------|------|
| 🏡 Villager | £4.95/mo | List for £15 not £25. 2 gift passes/mo. |
| ⚔️ Elder | Earned (5-credit bundle, £50) | 5 gift passes/mo. |
| 🏛️ Founder | £14.95/mo | 10 gift passes/mo. Own hamlet page + QR. |

**Listing prices:** £15 member / £25 non-member.
**Operator bundles:** 1 credit £5 / 5 credits £25 / 10 credits £50. Operators charge sellers £10–£25 themselves.
"On joining" = one-time benefit — don't reword as recurring.

---

## The Walkround: preview-then-publish

1. Filming builds the full listing immediately, always free, as `status: 'preview'` — regardless of `PAYMENT_ENABLED`. Watermarked via the existing "Preview — not live yet" banner on `listing.html`.
2. `sell.html`'s done screen has a "Publish live — £15/£25" button → Stripe checkout (`member_listing`/`nonmember_listing`).
3. On return, `finishPublishAfterPayment()` calls `publish-listing.js` to flip the preview to `status: 'active'`.
4. **Security-relevant:** the publish token lives only in `localStorage.motoroid_publish_pending`, never in a shareable URL for direct sellers. `listing.html`'s publish button fires free for anyone holding a valid `?pt=` token — that's intentional for pre-paid operators only. Don't put a token in a direct seller's preview link.
5. Operators (`sell.html?operator=slug`) must skip the Stripe branch entirely — they already paid via credit bundle, deducted at publish time.
6. High-value listings (≥£20,000) get one extra optional Buy Me a Coffee line on the success screen — never the default ask.
7. The QR/"Download QR"/"Print windscreen page" buttons are free even in preview, before any payment — paying only ever buys searchability + going live, never the printout.

`isMotorPatreonMember()` reads `localStorage.motorPatreonTier`/`motorPatreonExpiry` to pick the £15 vs £25 Stripe product — this must stay wired up correctly or every seller gets charged £25 regardless of tier.

---

## Valuation Flow

`sell.html` Step 0 → `functions/value-vehicle.js` → Gemini → price range + fix tips.

- `v0_positives` → `selling_points` → lifts `best_case_range`
- `v0_issues` → `known_issues` → informs `realistic_range` + `fix_tips`
- Gemini returns: `vehicle_title`, `realistic_range`, `best_case_range`, `best_case_note`, `fix_tips`, `market_note`, `worth_listing`
- Voice input button targets `v0_issues` only (intentional).

---

## Known Issues

- CDN render-blocking (Tailwind/Supabase/QRCode in `<head>`) — move to bottom of `<body>`.
- A second `<body>` tag in `sell.html` is inside a JS template string, not real HTML — don't touch it.
- Confirm no operator has been double-charged (credit bundle + Stripe) via the `sell.html?operator=slug` path.
- All Patreon tier links currently go to the same URL — no tier-specific pages yet.
- DVLA VES API registration is closed — `lookup-dvla.js` fails gracefully without a key; SORN/tax/export flags won't show.

---

## Not yet built

- Mark as sold / remove listing (delete token exists, not wired up)
- An actual composited-image watermark for preview listings

---

## Voice & tone, if writing outward-facing copy

State the plain fact once. No cast villain, no combat verbs (fight, disrupt, arm yourself), no word bigger than what's true (domination, extraction, manifesto, revolution).
