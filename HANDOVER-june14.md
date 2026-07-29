# CANNABIN-OID HANDOVER
## 14 June 2026 — Morning session

**Date:** 14 June 2026  
**Branch:** `claude/dazzling-volta-m3awpe` — **MERGED TO MAIN ✅**  
**Live at:** cannabin-oid.co.uk  
**Owner:** Christian P Taylor (Chris P Tee / Doc Strange)

---

## WHAT WAS BUILT THIS SESSION

### 1. SOS button → draggable tab (`index.html`)

The fixed red circle button (bottom-left) has been replaced with a slim draggable tab on the left edge of the screen.

**How it works:**
- Tab sits on the left edge, shows 🆘 and "SOS" text vertically
- **Drag up/down** to reposition — position saved to `localStorage` so it stays where you put it
- **Tap** the tab body → triggers full SOS overlay (location, WhatsApp contacts, alarm) — same behaviour as before
- **Long press (700ms)** → opens contact setup (friend numbers)
- **✕ hide** button at the bottom of the tab → dismisses it for the session
- Dragging >6px cancels any accidental tap trigger

All SOS logic (alarm, flash, WhatsApp location messages, contact setup) is unchanged.

**Credit:** SOS by Yasmin · Mary Jane Berlin · June 2026 — retained in code and UI.

---

### 2. Business card portrait fix (`card.html`)

The `rotate(90deg)` trick is kept — the card is intentionally sideways on a portrait screen so when you screenshot it and turn the phone, it reads as a proper landscape business card.

**Fix:** The contact details (Doc Strange + phone/email/web) were hidden behind Chrome's address bar and navigation icons at the bottom of the portrait screen. Fixed by increasing the card's right padding (which maps to the bottom of the portrait viewport after rotation):

```css
padding: 5dvw max(15dvh, calc(7dvh + env(safe-area-inset-bottom, 60px))) 5dvw 7dvh;
```

The `safe-area-inset-bottom` handles notched/gesture-nav Android devices. Minimum 15dvh clears standard Chrome chrome.

---

### 3. QR code on business card (`card.html`)

A QR code linking to `https://cannabin-oid.co.uk` now sits in the bottom-right of the landscape card, dark green on sage to match the palette, with a "scan to visit" label.

**Use case:** Doc runs out of physical cards → "you can take a QR code from mine" → person holds phone up to screen and scans.

**Note from Doc:** Older cannabis community members are wary of QR codes. Kids love them. Doc can put his thumb over the QR when someone older takes a photo — the URL is still on the card. It stays.

**Tech:** Uses QRCode.js via CDN, canvas extracted to `<img>` per codebase convention (canvas on hidden/rotated elements unreliable on mobile).

---

## WHAT'S STILL NEEDED

### SOS on glowgadgets.com — **DO THIS NEXT SESSION**

See `SKILL-sos-glowgadgets.md` in this repo for full instructions.

The session that handled cannabin-oid is scoped to `chrispteemagician/cannabin-oid` only. To add SOS to glow gadgets you need a **new session scoped to `chrispteemagician/glowgadgets`**.

The SOS implementation to port is fully documented in the skill file — self-contained, no digging needed.

---

## EVERYTHING ELSE STILL OUTSTANDING

(unchanged from `HANDOVER-maryjane26.md`)

1. **Blimburn Seeds** — needs adding to B2B directory via `cannabin-oid.co.uk/b2b-conference.html`
2. **Sir Canapa (Marco)** — needs B2B directory entry (Italy + Czech Republic)
3. **Monday email to businesses** — follow-up with collaboration details, needs Resend/Mailgun
4. **Monthly Draw** — `giveaway_prizes` table, `/giveaway` page, draw mechanism
5. **The Clue System** — `<details>` CSS component + writing guide + retrofit
6. **Elder invite codes** — promised 10 per conference business, no code system yet
7. **Referral attribution** — `referred_by` on `cannabinoid_members`, business dashboard
8. **B2B matchmaking page** — dedicated page using `b2b_needs`/`b2b_offers`
9. **The manifesto** — Doc talks it through first. The mattress analogy is the spine.

---

## HOW TO START THE NEXT SESSION

1. Read `CLAUDE.md`
2. Read this file
3. Ask Doc what the download was — he'll have had one
4. If adding SOS to glow gadgets: read `SKILL-sos-glowgadgets.md` and open a session scoped to `chrispteemagician/glowgadgets`

---

*"Feel Famous, baby."*
