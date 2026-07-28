(function () {

  /* ── Book Announcement Strip ────────────────────────────────── */
  if (!sessionStorage.getItem('book-dismissed')) {
    var bookBar =
      '<div id="book-bar" style="width:100%;padding:8px 16px;display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;' +
      'background:linear-gradient(90deg,#2e1065 0%,#4c1d95 50%,#2e1065 100%);' +
      'border-bottom:1px solid rgba(167,139,250,0.3);position:relative;">' +
        '<span style="font-size:1rem;">&#128218;</span>' +
        '<span style="font-size:0.9rem;color:#e9d5ff;font-family:Outfit,sans-serif;">' +
          '<strong style="color:#fbbf24;">NEW:</strong> The Honest Hypnotist Guide — Unmasking the AuDHD Way' +
        '</span>' +
        '<a href="https://amzn.to/4vR91yh" target="_blank" rel="noopener" ' +
           'style="font-size:0.88rem;font-weight:700;color:#fbbf24;text-decoration:none;' +
           'border:1px solid rgba(251,191,36,0.4);padding:3px 10px;border-radius:4px;white-space:nowrap;">' +
          'Get the book &rarr;' +
        '</a>' +
        '<button onclick="document.getElementById(\'book-bar\').remove();sessionStorage.setItem(\'book-dismissed\',\'1\')" ' +
                'style="position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;' +
                'color:rgba(233,213,255,0.5);font-size:1.1rem;cursor:pointer;padding:4px 6px;line-height:1;" ' +
                'aria-label="Dismiss">&times;</button>' +
      '</div>';
    document.currentScript.insertAdjacentHTML('beforebegin', bookBar);
  }

  /* ── Banner ─────────────────────────────────────────────────── */
  var banner =
    '<div style="width:100%;padding:7px 16px;display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;' +
    'background:linear-gradient(90deg,rgba(249,115,22,0.07) 0%,rgba(251,191,36,0.06) 50%,rgba(249,115,22,0.07) 100%);' +
    'border-bottom:1px solid rgba(249,115,22,0.18);">' +
      '<a href="https://feelfamous.co.uk" target="_blank" rel="noopener" ' +
         'style="display:flex;align-items:center;gap:7px;text-decoration:none;">' +
        '<img src="https://feelfamous.co.uk/feelfamous-logo-web.png" alt="FeelFamous" ' +
             'style="height:22px;width:auto;border-radius:4px;vertical-align:middle;">' +
      '</a>' +
      '<span style="font-size:0.95rem;color:#94a3b8;">' +
        'Part of the <a href="https://feelfamous.co.uk" target="_blank" rel="noopener" ' +
        'style="color:white;font-weight:700;text-decoration:none;">FeelFamous</a> Outernet' +
      '</span>' +
      '<span style="color:rgba(249,115,22,0.35);">&middot;</span>' +
      '<a href="https://feelfamous.co.uk" target="_blank" rel="noopener" ' +
         'style="font-size:0.95rem;font-weight:700;color:#f97316;text-decoration:none;">' +
        'Explore the ecosystem &rarr;' +
      '</a>' +
    '</div>';

  /* ── Nav ────────────────────────────────────────────────────── */
  var path = window.location.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';

  function navActive(href) {
    var base = href.replace(/\.html$/, '').replace(/\/$/, '') || '/';
    if (base === '/') return path === '/';
    return path === base || path.startsWith(base + '/');
  }

  function navLink(href, icon, label) {
    var active = navActive(href);
    var col = active ? '#f97316' : '#94a3b8';
    var weight = active ? '800' : '600';
    var borderBottom = active ? 'border-bottom:2px solid #f97316;' : 'border-bottom:2px solid transparent;';
    return '<a href="' + href + '" style="display:flex;flex-direction:column;align-items:center;gap:2px;' +
      'padding:7px 12px;text-decoration:none;color:' + col + ';font-weight:' + weight + ';' +
      'font-size:0.68rem;letter-spacing:0.03em;' + borderBottom + 'transition:color 0.15s;">' +
      '<span style="font-size:1.1rem;line-height:1;">' + icon + '</span>' +
      label +
    '</a>';
  }

  var nav =
    '<div style="width:100%;background:#0f0f0f;border-bottom:1px solid rgba(255,255,255,0.06);' +
    'display:flex;justify-content:center;gap:0;font-family:Outfit,sans-serif;">' +
      navLink('/', '&#127968;', 'Home') +
      navLink('/browse', '&#128269;', 'Browse') +
      navLink('/sell', '&#127909;', 'Sell Car') +
      navLink('/sell-cb', '&#128251;', 'Sell Radio') +
      navLink('/operators/join', '&#128188;', 'Operators') +
    '</div>';

  /* ── Inject ─────────────────────────────────────────────────── */
  document.currentScript.insertAdjacentHTML('beforebegin', banner + nav);

  /* ── Footer ─────────────────────────────────────────────────── */
  // Pages that build their own full footer (FeelFamous branding, About/Contact
  // already included) set window.SKIP_BANNER_FOOTER = true before this script
  // loads, so this shared one doesn't print a second time underneath theirs.
  if (window.SKIP_BANNER_FOOTER) return;
  document.addEventListener('DOMContentLoaded', function () {
    var footer =
      '<footer style="width:100%;padding:28px 20px 36px;text-align:center;' +
      'border-top:1px solid rgba(255,255,255,0.06);background:#0a0a0a;' +
      'font-family:Outfit,sans-serif;">' +
        '<a href="https://feelfamous.co.uk" target="_blank" rel="noopener" ' +
        'style="display:inline-block;font-size:0.95rem;font-weight:700;color:#f1f5f9;' +
        'text-decoration:none;margin-bottom:4px;">' +
          'Part of the <span style="color:#f97316;">FeelFamous</span> Outernet' +
        '</a>' +
        '<div style="font-size:0.85rem;color:#475569;margin-top:2px;margin-bottom:8px;">' +
          'Just trying to be useful. One ember at a time.' +
        '</div>' +
        '<div style="font-size:0.8rem;color:#475569;margin-top:6px;">' +
          '&copy; ' + new Date().getFullYear() + ' Motor-Oid &mdash; ' +
          '<a href="/about" style="color:#475569;text-decoration:none;">About</a>' +
          ' &middot; ' +
          '<a href="mailto:doc@motor-oid.co.uk" style="color:#475569;text-decoration:none;">Contact</a>' +
        '</div>' +
      '</footer>';
    document.body.insertAdjacentHTML('beforeend', footer);
  });

}());
