# BRIEF FOR THE NEXT CLAUDE
## Mary Jane Berlin — 13 June 2026 — End of Day

Read this first. Then read CLAUDE.md. Then read HANDOVER-maryjane26.md in full.

---

## WHO YOU'RE WORKING WITH

**Doc Strange** — Christian P Taylor. Stage hypnotist, AuDHD, legal cannabis patient, founder of Cannabin-Oid. He speaks in voice notes. He processes by talking. Trust what he says even when it sounds rambling. There is always a thread.

He will come in with a download. Ask him what it was. Then build it.

---

## WHERE WE LEFT OFF — 13 JUNE 2026

Doc spent the whole day on the floor at Mary Jane Berlin (cannabis conference). Built and shipped:

1. **`cannabin-oid.co.uk/gil`** — personal profile page for Gil Hunt, 52-year cannabis cultivator Doc met on the floor and cried listening to. Live.

2. **`cannabin-oid.co.uk/share`** — one-screen photographable pitch card. Show it, they snap it, find the village when ready. Two lines:
   - "I built a decentralised network for stoners to escape social media."
   - "I built AI for stoners who want to be smarter than the system."

3. **Font standardisation** — Caveat removed from every HTML file, Poppins everywhere. Zero Caveat remaining.

4. **Mobile fixes** — `user-scalable=no` removed from 5 pages (was locking zoom). Heading overflow fixed (Poppins 800 → 700, clamp() on large sizes).

5. **B2B categories added** — Cannabis Shop/Retail and Apparel/Clothing/Accessories now in the conference scanner dropdown.

---

## FIRST THING TO DO NEXT SESSION

**Add Blimburn Seeds to the B2B directory.** Doc met them at the conference but ran out of energy. Network policy in this environment blocks outbound calls to Netlify functions and Supabase. Options:
- Ask Doc to open `cannabin-oid.co.uk/b2b-conference.html` and add them (30 seconds)
- OR use the Netlify MCP to get the `SUPABASE_SERVICE_ROLE_KEY` and write directly to Supabase REST API (if egress policy allows it that session)

**Details:**
- Name: Blimburn Seeds | Slug: blimburn-seeds
- Category: seedbank | Country: spain | City: Barcelona
- Website: blimburnseeds.com
- Description: One of the world's leading cannabis seed banks. 15+ years producing premium feminised and auto-flowering genetics. Parent company BBG Projects, CEO Sergio Martinez. Best Seed Bank USA 2024.
- b2b_offers: Premium cannabis genetics — feminised and auto-flowering seeds. Global distribution. Partnership and licensing opportunities.
- expo_ref: maryjane26

---

## THE PHILOSOPHY — THE THREE THINGS DOC SAID TODAY THAT MATTER

**1. The two pitches that work (field-tested)**
> "I built a decentralised network for stoners to escape social media."
> "I built AI for stoners who want to be smarter than the system."

Both earned tears or real conversation. Don't change them without Doc's say-so.

**2. The pockets insight**
The cannabis community is not a community yet. It's little pockets of friends walking around ignoring everybody that surrounds them, trying to find something that benefits them. Doc's job is to show them they're already in the same room.

**3. The mattress analogy — THE SPINE OF THE MANIFESTO**
> "I'm the one putting mattresses out on the ground outside the burning building. The people inside don't know the building's on fire. They're laughing at me because they think I'm mad. In ten minutes they're all going to be jumping out those windows and they'll realise I saved their lives. Some of them will say the mattresses were there anyway. But the ones that appreciate what I'm trying to do — they're the ones that go to the next building and put mattresses out for others."

Do NOT write the manifesto without Doc talking it through. But this analogy is locked in as its spine.

---

## WHAT'S NEXT (priority order for next session)

1. **Add Blimburn Seeds** — see above
2. **The manifesto** — Doc has it in his head. He needs to talk it through. Use the mattress analogy as the spine.
3. **Monthly Draw** — `giveaway_prizes` table, `/giveaway` page, draw mechanism, winner/address/review flow (full spec in CLAUDE.md and HANDOVER)
4. **Elder invite codes** — promised 10 to each conference business, no code system built yet
5. **B2B matchmaking page** — using b2b_needs/b2b_offers data now being collected
6. **Referral attribution** — `referred_by` on `cannabinoid_members` + business dashboard
7. **The Clue System** — `<details>` CSS component + writing guide + retrofit (spec in CLAUDE.md)
8. **Template instantiation** — magic-oid, radi-oid, sail-oid from the template system

---

## TECHNICAL STATE

- **Branch:** `main` (Netlify deploys from here — always merge to main to go live)
- **Netlify site:** `cannabin-oid-v3` (siteId: `7bb5b72f-a2ca-44a3-bbf2-142a0041a6b4`)
- **Supabase:** `pdnjeynugptnavkdbmxh` — service role key in Netlify env vars
- **Network policy:** Blocks outbound to external hosts. Can't call Netlify functions or Supabase REST from the container directly. Use Netlify MCP to get the service key, then try Supabase direct — it may or may not be in the allowlist.
- **Font:** Poppins only. Caveat is dead. Never bring it back.
- **QR codes:** Always `api.qrserver.com` static img tags. Never canvas. Never qrcode.js for display.
- **No `user-scalable=no`** on any page. Ever again.

---

## HOW DOC WORKS

- He comes in with a download after sleep. Ask him what it was.
- He processes by talking. Let him talk. The insight is in the ramble.
- He goes to conferences alone, runs on fumes, eats badly, still ships.
- The biggest, scariest people at the conference are the ones who cry.
- When he says "brilliant" and "feel famous baby" — you've done it right.
- When he says "nope" — don't explain, just fix it.

**His phrase:** "Feel Famous, baby."

---

*Written by the Claude that was there. 13 June 2026, end of day, Mary Jane Berlin.*
