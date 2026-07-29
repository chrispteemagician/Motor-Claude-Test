# SKILL: Add SOS Button to Glow Gadgets — Find Me Section

**Target repo:** `chrispteemagician/glowgadgets`  
**Target section:** "Find Me" section of glow gadgets site  
**Requires:** New session scoped to `chrispteemagician/glowgadgets`

---

## WHAT TO BUILD

A draggable, dismissible SOS tab — identical to the one on `cannabin-oid.co.uk` (index.html).

The tab lives on the left edge of the screen. Users can slide it up/down. Tapping opens a full-screen emergency overlay that:
1. Gets their GPS location
2. Lets them WhatsApp their emergency contacts with a Google Maps link
3. Plays an alarm
4. Flashes red/white
5. Has a clear "I'M OK — CANCEL" button

---

## STEP 1 — Read the target file

Find the "Find Me" section in glowgadgets. It's probably `index.html` or a dedicated page. Look for:
- A section with location / "find me" / map content
- Something that helps people locate Doc at events (Glow Gadgets is his Bristol rave brand)

---

## STEP 2 — Add this CSS

Paste into `<style>` (or the site's CSS file):

```css
/* SOS Tab — draggable, dismissible */
.sos-tab-wrap {
    position: fixed; left: 0; bottom: 20vh; z-index: 9990;
    touch-action: none; user-select: none;
}
.sos-tab-wrap.hidden { display: none; }
.sos-tab {
    display: flex; flex-direction: column; align-items: center;
    background: #dc2626; color: #fff; border-radius: 0 14px 14px 0;
    box-shadow: 3px 2px 18px rgba(220,38,38,0.55); overflow: hidden;
    font-family: inherit;
}
.sos-tab-main {
    padding: 14px 11px 8px; cursor: pointer;
    display: flex; flex-direction: column; align-items: center; gap: 5px;
    border: none; background: none; color: #fff; font-family: inherit; width: 100%;
}
.sos-tab-icon { font-size: 1.25rem; }
.sos-tab-label {
    font-size: 0.6rem; font-weight: 900; letter-spacing: 2.5px;
    writing-mode: vertical-lr; transform: rotate(180deg);
}
.sos-drag-bar {
    font-size: 1rem; color: rgba(255,255,255,0.35); padding: 2px 0 3px; cursor: grab; line-height: 1;
}
.sos-tab-dismiss {
    background: rgba(0,0,0,0.22); border: none; border-top: 1px solid rgba(255,255,255,0.12);
    color: rgba(255,255,255,0.55); width: 100%; padding: 7px 0;
    font-size: 0.62rem; cursor: pointer; font-family: inherit; letter-spacing: 0.5px;
}
.sos-overlay {
    display: none; position: fixed; inset: 0; z-index: 99990;
    flex-direction: column; align-items: center; justify-content: center;
    padding: 24px; text-align: center; background: #dc2626;
}
.sos-overlay.active { display: flex; }
.sos-inner {
    background: rgba(0,0,0,0.55); border-radius: 24px;
    padding: 32px 24px; max-width: 340px; width: 100%;
}
.sos-setup-modal {
    display: none; position: fixed; inset: 0; z-index: 99989;
    background: rgba(0,0,0,0.8); align-items: center; justify-content: center; padding: 16px;
}
.sos-setup-modal.active { display: flex; }
.sos-setup-inner {
    background: #fff; border-radius: 20px; padding: 24px;
    max-width: 360px; width: 100%; font-family: inherit;
}
.sos-input {
    width: 100%; padding: 10px 12px; border: 2px solid #e5e7eb;
    border-radius: 10px; margin-bottom: 8px; box-sizing: border-box;
    font-family: inherit; font-size: 0.9rem;
}
.sos-input:focus { outline: none; border-color: #dc2626; }
.sos-contact-btn {
    display: block; background: rgba(255,255,255,0.18); color: #fff;
    padding: 14px 16px; border-radius: 12px; text-decoration: none;
    font-weight: 700; font-size: 0.95rem; margin-bottom: 10px;
    border: 2px solid rgba(255,255,255,0.3); cursor: pointer;
    font-family: inherit; width: 100%; text-align: center;
}
```

---

## STEP 3 — Add this HTML

Paste just before `</body>`:

```html
<!-- SOS TAB — draggable, dismissible — by Yasmin, Mary Jane Berlin, June 2026 -->
<div id="sosTabWrap" class="sos-tab-wrap">
    <div class="sos-tab">
        <button class="sos-tab-main" id="sosTabMain" title="SOS — Emergency Help">
            <span class="sos-tab-icon" id="sosTabIcon">🆘</span>
            <span class="sos-tab-label">SOS</span>
        </button>
        <div class="sos-drag-bar" id="sosTabDragBar">⋮</div>
        <button class="sos-tab-dismiss" onclick="dismissSOSTab()">✕ hide</button>
    </div>
</div>

<!-- SOS Overlay -->
<div id="sosOverlay" class="sos-overlay" role="alert" aria-live="assertive">
    <div class="sos-inner">
        <div style="font-size:4rem;margin-bottom:8px;">🚨</div>
        <h1 style="color:#fff;font-size:2.8rem;font-weight:900;margin:0 0 4px;text-shadow:0 2px 12px rgba(0,0,0,0.4);">HELP</h1>
        <p id="sosStatus" style="color:rgba(255,255,255,0.85);font-size:0.9rem;margin:0 0 20px;">Getting your location...</p>
        <div id="sosContactBtns" style="margin-bottom:16px;"></div>
        <a id="sosMapsLink" href="#" target="_blank" style="display:none;" class="sos-contact-btn">📍 Open My Location in Maps</a>
        <button onclick="cancelSOS()" style="background:#fff;color:#dc2626;border:none;border-radius:12px;padding:16px 28px;font-size:1rem;font-weight:900;cursor:pointer;width:100%;font-family:inherit;margin-top:4px;">✕ I'M OK — CANCEL</button>
        <p style="color:rgba(255,255,255,0.4);font-size:0.65rem;margin:16px 0 0;">SOS by Yasmin · Mary Jane Berlin · June 2026</p>
    </div>
</div>

<!-- SOS Setup Modal (long-press) -->
<div id="sosSetupModal" class="sos-setup-modal">
    <div class="sos-setup-inner">
        <h3 style="color:#dc2626;font-weight:800;margin:0 0 4px;font-family:inherit;">🆘 SOS Setup</h3>
        <p style="font-size:0.8rem;color:#6b7280;margin:0 0 16px;font-family:inherit;">Add friends who should get your location in an emergency. Numbers are saved on YOUR device only — we never see them.</p>
        <input type="tel" id="sosContact1" class="sos-input" placeholder="Friend 1 WhatsApp number (+44...)">
        <input type="tel" id="sosContact2" class="sos-input" placeholder="Friend 2 (optional)">
        <input type="tel" id="sosContact3" class="sos-input" placeholder="Venue / security number (optional)">
        <p style="font-size:0.7rem;color:#9ca3af;margin:0 0 16px;font-family:inherit;">Include country code, no spaces — e.g. +447976884254</p>
        <div style="display:flex;gap:8px;">
            <button onclick="closeSOSSetup()" style="flex:1;padding:12px;border:2px solid #e5e7eb;border-radius:10px;background:#fff;cursor:pointer;font-family:inherit;font-size:0.9rem;">Cancel</button>
            <button onclick="saveSOSContacts()" style="flex:2;padding:12px;background:#dc2626;color:#fff;border:none;border-radius:10px;font-weight:700;cursor:pointer;font-family:inherit;font-size:0.9rem;">Save Contacts</button>
        </div>
        <p style="font-size:0.65rem;color:#d1d5db;margin:12px 0 0;text-align:center;font-family:inherit;">Tap the 🆘 tab anytime to trigger. Tap and hold to return to setup.</p>
    </div>
</div>
```

---

## STEP 4 — Add this JavaScript

Paste just before `</body>` (after the HTML above):

```html
<script>
    // SOS Tab — drag + long-press for setup
    (function() {
        const wrap = document.getElementById('sosTabWrap');
        const mainBtn = document.getElementById('sosTabMain');
        if (!wrap || !mainBtn) return;

        const savedTop = localStorage.getItem('sos_tab_top');
        if (savedTop !== null) { wrap.style.bottom = 'auto'; wrap.style.top = savedTop + 'px'; }

        let startY = 0, startTop = 0, dragMoved = false, pressTimer = null;

        function dragStart(clientY) {
            startY = clientY; startTop = wrap.getBoundingClientRect().top;
            dragMoved = false;
            pressTimer = setTimeout(() => openSOSSetup(), 700);
        }
        function dragMove(clientY) {
            if (Math.abs(clientY - startY) > 6 && !dragMoved) {
                dragMoved = true; clearTimeout(pressTimer); pressTimer = null;
            }
            if (dragMoved) {
                let newTop = startTop + (clientY - startY);
                newTop = Math.max(8, Math.min(newTop, window.innerHeight - wrap.offsetHeight - 8));
                wrap.style.bottom = 'auto'; wrap.style.top = newTop + 'px';
                localStorage.setItem('sos_tab_top', newTop);
            }
        }
        function dragEnd() { clearTimeout(pressTimer); pressTimer = null; }

        wrap.addEventListener('touchstart', e => {
            if (e.target.classList.contains('sos-tab-dismiss')) return;
            dragStart(e.touches[0].clientY);
        }, { passive: true });
        wrap.addEventListener('touchmove', e => dragMove(e.touches[0].clientY), { passive: true });
        wrap.addEventListener('touchend', dragEnd);
        mainBtn.addEventListener('click', () => { if (!dragMoved) triggerSOS(); });
    })();

    function dismissSOSTab() {
        document.getElementById('sosTabWrap')?.classList.add('hidden');
    }
    function loadSOSContacts() {
        try { return JSON.parse(localStorage.getItem('sos_contacts') || '[]'); } catch(e) { return []; }
    }
    function openSOSSetup() {
        const contacts = loadSOSContacts();
        ['sosContact1','sosContact2','sosContact3'].forEach((id, i) => {
            const el = document.getElementById(id);
            if (el) el.value = contacts[i] || '';
        });
        document.getElementById('sosSetupModal').classList.add('active');
    }
    function closeSOSSetup() {
        document.getElementById('sosSetupModal').classList.remove('active');
    }
    function saveSOSContacts() {
        const contacts = ['sosContact1','sosContact2','sosContact3']
            .map(id => (document.getElementById(id).value || '').trim())
            .filter(Boolean);
        localStorage.setItem('sos_contacts', JSON.stringify(contacts));
        closeSOSSetup();
        const icon = document.getElementById('sosTabIcon');
        if (icon) { icon.textContent = '✓'; setTimeout(() => icon.textContent = '🆘', 1500); }
    }

    let sosAudioCtx = null, sosBeepTimer = null, sosFlashTimer = null, sosFlashState = false;

    function triggerSOS() {
        const contacts = loadSOSContacts();
        if (contacts.length === 0) {
            if (confirm('No emergency contacts set up yet. Set them up now?')) openSOSSetup();
            return;
        }
        document.getElementById('sosOverlay').classList.add('active');
        document.getElementById('sosStatus').textContent = 'Getting your location...';
        document.getElementById('sosMapsLink').style.display = 'none';
        document.getElementById('sosContactBtns').innerHTML = contacts.map((_, i) =>
            `<div class="sos-contact-btn" style="opacity:0.5;">📱 ${i === 2 ? 'Venue / Security' : 'Friend ' + (i+1)} — finding location...</div>`
        ).join('');
        startSOSAlarm(); startSOSFlash(); getSOSLocation(contacts);
    }
    function cancelSOS() {
        document.getElementById('sosOverlay').classList.remove('active');
        stopSOSAlarm(); stopSOSFlash();
    }
    function startSOSAlarm() {
        try {
            sosAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
            function beep() {
                if (!sosAudioCtx) return;
                try {
                    const osc = sosAudioCtx.createOscillator();
                    const gain = sosAudioCtx.createGain();
                    osc.connect(gain); gain.connect(sosAudioCtx.destination);
                    osc.type = 'square';
                    osc.frequency.setValueAtTime(880, sosAudioCtx.currentTime);
                    gain.gain.setValueAtTime(1.0, sosAudioCtx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.001, sosAudioCtx.currentTime + 0.25);
                    osc.start(sosAudioCtx.currentTime); osc.stop(sosAudioCtx.currentTime + 0.3);
                } catch(e) {}
            }
            beep(); sosBeepTimer = setInterval(beep, 500);
        } catch(e) {}
    }
    function stopSOSAlarm() {
        if (sosBeepTimer) { clearInterval(sosBeepTimer); sosBeepTimer = null; }
        if (sosAudioCtx) { try { sosAudioCtx.close(); } catch(e) {} sosAudioCtx = null; }
    }
    function startSOSFlash() {
        sosFlashTimer = setInterval(() => {
            sosFlashState = !sosFlashState;
            const o = document.getElementById('sosOverlay');
            if (o) o.style.background = sosFlashState ? '#fff' : '#dc2626';
        }, 400);
    }
    function stopSOSFlash() {
        if (sosFlashTimer) { clearInterval(sosFlashTimer); sosFlashTimer = null; }
        const o = document.getElementById('sosOverlay');
        if (o) o.style.background = '#dc2626';
    }
    function getSOSLocation(contacts) {
        if (!navigator.geolocation) {
            buildSOSButtons(contacts, null);
            document.getElementById('sosStatus').textContent = 'Location unavailable — share contacts manually';
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude.toFixed(6);
                const lng = pos.coords.longitude.toFixed(6);
                const mapsUrl = `https://maps.google.com/?q=${lat},${lng}`;
                document.getElementById('sosStatus').textContent = '📍 Location found — alert your people below';
                const link = document.getElementById('sosMapsLink');
                link.href = mapsUrl; link.style.display = 'block';
                buildSOSButtons(contacts, mapsUrl);
            },
            () => {
                document.getElementById('sosStatus').textContent = 'Could not get location — tap contacts to alert anyway';
                buildSOSButtons(contacts, null);
            },
            { timeout: 8000, enableHighAccuracy: true }
        );
    }
    function buildSOSButtons(contacts, mapsUrl) {
        const siteName = 'glowgadgets.com'; // ← change per site
        const msg = mapsUrl
            ? `🚨 SOS — I need help right now!\n📍 Find me here: ${mapsUrl}\n\nSent from ${siteName}`
            : `🚨 SOS — I need help right now! I cannot share my location — please call me or find me.\n\nSent from ${siteName}`;
        const encoded = encodeURIComponent(msg);
        document.getElementById('sosContactBtns').innerHTML = contacts.map((num, i) => {
            const clean = num.replace(/[\s\-\(\)]/g, '').replace(/^\+/, '');
            const label = i === 2 ? '🏥 Alert Venue / Security' : `📱 Alert Friend ${i + 1}`;
            return `<a href="https://wa.me/${clean}?text=${encoded}" target="_blank" class="sos-contact-btn">${label}</a>`;
        }).join('');
    }
</script>
```

---

## NOTES

- The only thing to change per site is `siteName` in `buildSOSButtons()` — currently set to `glowgadgets.com`
- CSS colours can be adjusted to match the glow gadgets palette (currently red `#dc2626` — that's correct for SOS on any site)
- The "Find Me" section context is perfect for this — it's where people would look for safety info at an event
- Numbers stored in `localStorage` only — never sent anywhere

---

*"Feel Famous, baby."*
