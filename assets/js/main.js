/* ── GOOGLE ADS CONVERSIONS (AW-16799190588, AW-17865495674) ── */
// Contact: AW-16799190588/1bXfCJjJ9I0dELycvco- (fires on call-link clicks, not on pageview)
// Purchase: AW-16799190588/gPTnCL2G94wdELycvco- (call reportPurchaseConversion(id) only on a real purchase/thank-you)
function reportContactConversion() {
  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'conversion', { 'send_to': 'AW-16799190588/1bXfCJjJ9I0dELycvco-' });
      window.gtag('event', 'conversion', { 'send_to': 'AW-17865495674/e3LhCJv5lJcdEPqo98ZC', 'transaction_id': '' });
    }
  } catch (e) { /* noop */ }
}
function reportPurchaseConversion(transactionId) {
  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'conversion', {
        'send_to': 'AW-16799190588/gPTnCL2G94wdELycvco-',
        'transaction_id': String(transactionId || '')
      });
    }
  } catch (e) { /* noop */ }
}
window.reportContactConversion = reportContactConversion;
window.reportPurchaseConversion = reportPurchaseConversion;

// Delegated so dynamically injected tel: links (e.g. refund-calculator result) also count.
// Pointerdown fires before the click, so a delayed gtag.js is already requested by the time
// the conversion is queued; queued events send as soon as it loads.
document.addEventListener('pointerdown', function (e) {
  if (e.target && e.target.closest && e.target.closest('a[href^="tel:"]') && window.loadGtag) { window.loadGtag(); }
}, { passive: true });
document.addEventListener('click', function (e) {
  var a = e.target && e.target.closest ? e.target.closest('a[href^="tel:"]') : null;
  if (a) {
    if (window.loadGtag) { window.loadGtag(); }
    reportContactConversion();
  }
});

// Mobile nav toggle
document.getElementById('hbgBtn')?.addEventListener('click', () => {
  document.getElementById('mobNav')?.classList.toggle('open');
});

// Close mobile nav when a link is clicked
document.querySelectorAll('#mobNav a').forEach((a) => {
  a.addEventListener('click', () => {
    document.getElementById('mobNav')?.classList.remove('open');
  });
});

// FAQ accordion (single-open)
document.querySelectorAll('.fq').forEach((btn) => {
  if (!btn.hasAttribute('aria-expanded')) { btn.setAttribute('aria-expanded', 'false'); }
  btn.addEventListener('click', () => {
    const wasOpen = btn.classList.contains('open');
    document.querySelectorAll('.fq').forEach((x) => {
      x.classList.remove('open');
      x.setAttribute('aria-expanded', 'false');
      x.nextElementSibling?.classList.remove('show');
    });
    if (!wasOpen) {
      btn.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      btn.nextElementSibling?.classList.add('show');
    }
  });
});

// Dynamic year
document.getElementById('year') && (document.getElementById('year').textContent = String(new Date().getFullYear()));

/* ── FREE TOOLS (100% client-side, no APIs, no cost) ── */
(function () {
  'use strict';

  // --- 1. Refund date calculator (business days) ---
  var METHODS = {
    card: { label: 'Credit or debit card', min: 5, max: 10 },
    bank: { label: 'Bank transfer (ACH)', min: 3, max: 5 },
    wallet: { label: 'PayPal or digital wallet', min: 3, max: 5 },
    gift: { label: 'Gift card or store credit', min: 1, max: 3 }
  };
  function addBusinessDays(date, n) {
    var d = new Date(date.getTime());
    while (n > 0) {
      d.setDate(d.getDate() + 1);
      var day = d.getDay();
      if (day !== 0 && day !== 6) { n--; }
    }
    return d;
  }
  function fmt(d) {
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }
  var refundDate = document.getElementById('refundDate');
  var refundMethod = document.getElementById('refundMethod');
  var refundBtn = document.getElementById('refundBtn');
  var refundResult = document.getElementById('refundResult');
  if (refundDate && !refundDate.value) { refundDate.valueAsDate = new Date(); }
  function runRefund() {
    var base = refundDate.valueAsDate || new Date();
    var m = METHODS[refundMethod.value] || METHODS.card;
    var from = addBusinessDays(base, m.min);
    var to = addBusinessDays(base, m.max);
    var late = to < new Date(new Date().toDateString());
    refundResult.hidden = false;
    refundResult.classList.add('blue');
    refundResult.innerHTML =
      '<div class="carrier"><i class="fa-solid fa-money-bill-transfer"></i> ' + m.label + '</div>' +
      'Refund issued <strong>' + fmt(base) + '</strong> should arrive between <strong>' + fmt(from) + '</strong> and <strong>' + fmt(to) + '</strong> (business days).' +
      (late
        ? '<div class="muted" style="color:#FFB066;">That window has passed. Call <a href="tel:+18888824649" style="color:var(--accent);">(888) 882-4649</a> and we will help escalate it.</div>'
        : '<div class="muted">Still inside the window? Give it until ' + fmt(to) + ', then call us if nothing lands.</div>');
  }
  if (refundBtn) { refundBtn.addEventListener('click', runRefund); }

  // --- 2. Claim message builder ---
  var CLAIM_OPENERS = {
    missing: 'My order shows as delivered, but I never received it.',
    late: 'My order is late and tracking has not moved for several days.',
    damaged: 'My order arrived damaged (or not as described). I have photos ready.',
    refund: 'My refund was approved, but the money never arrived in my account.',
    charge: 'I was charged incorrectly for this order.'
  };
  var claimBtn = document.getElementById('claimBtn');
  var claimCopy = document.getElementById('claimCopy');
  var claimResult = document.getElementById('claimResult');
  function val(id) { return (document.getElementById(id).value || '').trim(); }
  function runClaim() {
    var opener = CLAIM_OPENERS[document.getElementById('claimIssue').value] || CLAIM_OPENERS.missing;
    var name = val('claimName');
    var order = val('claimOrder');
    var store = val('claimStore');
    var amount = val('claimAmount').replace(/^\$/, '');
    var lines = ['Hello,', '', opener];
    var facts = [];
    if (order) { facts.push('order number ' + order); }
    if (store) { facts.push('placed with ' + store); }
    if (amount) { facts.push('for $' + amount); }
    if (facts.length) { lines.push('This is about ' + facts.join(', ') + '.'); }
    lines.push('Please confirm what went wrong and resolve this with a refund or replacement within 3 business days.');
    lines.push('If I do not hear back, I will dispute the charge with my payment provider.');
    lines.push('', 'Thank you,');
    lines.push(name || '[Your name]');
    if (!order) { lines.push('', 'Note: add your order number before sending.'); }
    claimResult.value = lines.join('\n');
    claimResult.hidden = false;
    claimCopy.disabled = false;
    claimResult.focus();
  }
  function runCopy() {
    var done = function () {
      claimCopy.classList.add('copy-ok');
      claimCopy.innerHTML = '<i class="fa-solid fa-check"></i> Copied';
      setTimeout(function () {
        claimCopy.classList.remove('copy-ok');
        claimCopy.innerHTML = '<i class="fa-solid fa-copy"></i> Copy';
      }, 2000);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(claimResult.value).then(done, function () {
        claimResult.select();
        try { document.execCommand('copy'); } catch (e) { /* noop */ }
        done();
      });
    } else {
      claimResult.select();
      try { document.execCommand('copy'); } catch (e) { /* noop */ }
      done();
    }
  }
  if (claimBtn) {
    claimBtn.addEventListener('click', runClaim);
    claimCopy.addEventListener('click', runCopy);
  }
})();

/* ── LAZY CALL POP-UP (pages with <body data-popup="call">) ── */
// Not in the page HTML and never on arrival: the modal is built only once the visitor
// has engaged (scrolled halfway or, on desktop, moved to leave), at most once per session,
// and never after they've already tapped a call link or while they're typing in a tool.
(function () {
  'use strict';
  if (!document.body || document.body.getAttribute('data-popup') !== 'call') { return; }

  var KEY = 'hmts_popup_seen';
  var MIN_DWELL_MS = 8000;
  var SCROLL_DEPTH = 0.5;
  var start = Date.now();
  var armed = true;

  function seen() { try { return sessionStorage.getItem(KEY) === '1'; } catch (e) { return false; } }
  function markSeen() { try { sessionStorage.setItem(KEY, '1'); } catch (e) { /* noop */ } }
  if (seen()) { return; }

  function disarm() {
    armed = false;
    window.removeEventListener('scroll', onScroll);
    document.removeEventListener('mouseout', onExit);
  }

  // Already called: don't interrupt them later.
  document.addEventListener('click', function (e) {
    if (e.target && e.target.closest && e.target.closest('a[href^="tel:"]')) { markSeen(); disarm(); }
  });

  function build() {
    var wrap = document.createElement('div');
    wrap.className = 'popup-overlay';
    wrap.innerHTML =
      '<div class="popup-modal" role="dialog" aria-modal="true" aria-labelledby="popupTitle">' +
        '<button class="popup-close" type="button" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>' +
        '<div class="popup-content">' +
          '<div class="popup-icon"><i class="fa-solid fa-headset"></i></div>' +
          '<h2 id="popupTitle">Still sorting out an order?</h2>' +
          '<p>Talk it through with a US-based shopping specialist. We will help you plan the next step with the store, carrier, or payment provider.</p>' +
          '<div class="popup-benefits">' +
            '<div class="popup-benefit"><i class="fa-solid fa-check"></i><span>Missing orders, stuck refunds, payment issues</span></div>' +
            '<div class="popup-benefit"><i class="fa-solid fa-check"></i><span>Available 24/7, weekends &amp; holidays</span></div>' +
            '<div class="popup-benefit"><i class="fa-solid fa-check"></i><span>Independent service, not affiliated with any store</span></div>' +
          '</div>' +
          '<a href="tel:+18888824649" class="popup-cta"><i class="fa-solid fa-phone"></i> Call Now (888) 882-4649</a>' +
          '<button class="popup-dismiss" type="button">Maybe later</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(wrap);
    return wrap;
  }

  function show() {
    if (!armed || seen()) { return; }
    var a = document.activeElement;
    if (a && /^(INPUT|SELECT|TEXTAREA)$/.test(a.tagName)) { return; } // mid-task in a tool; try again later
    disarm();
    markSeen();
    var prevFocus = a;
    var overlay = build();
    function close() {
      overlay.classList.remove('active');
      document.removeEventListener('keydown', onKey);
      setTimeout(function () { overlay.remove(); }, 300);
      if (prevFocus && prevFocus.focus) { prevFocus.focus(); }
    }
    function onKey(e) { if (e.key === 'Escape') { close(); } }
    overlay.querySelector('.popup-close').addEventListener('click', close);
    overlay.querySelector('.popup-dismiss').addEventListener('click', close);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) { close(); } });
    document.addEventListener('keydown', onKey);
    requestAnimationFrame(function () {
      overlay.classList.add('active');
      overlay.querySelector('.popup-cta').focus({ preventScroll: true });
    });
  }

  function engagedLongEnough() { return Date.now() - start >= MIN_DWELL_MS; }

  var scrollTick = false;
  function onScroll() {
    if (scrollTick) { return; }
    scrollTick = true;
    requestAnimationFrame(function () {
      scrollTick = false;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY / max >= SCROLL_DEPTH && engagedLongEnough()) { show(); }
    });
  }
  function onExit(e) {
    if (!e.relatedTarget && e.clientY <= 0 && engagedLongEnough()) { show(); }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  if (window.matchMedia && window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mouseout', onExit);
  }
})();

/* ── SMOOTHNESS: header state, scrollspy, scroll reveals ── */
(function () {
  'use strict';

  // Header deepens once scrolled (passive listener, no layout thrash)
  var nav = document.querySelector('nav');
  var ticking = false;
  function onScroll() {
    if (ticking) { return; }
    ticking = true;
    requestAnimationFrame(function () {
      if (nav) { nav.classList.toggle('scrolled', window.scrollY > 10); }
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.rv').forEach(function (el) { el.classList.add('on'); });
    return;
  }

  // Scrollspy: highlight the nav link for the section in view
  var links = {};
  document.querySelectorAll('.nav-links a[href^="#"]').forEach(function (a) {
    links[a.getAttribute('href').slice(1)] = a;
  });
  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) { return; }
      var a = links[en.target.id];
      if (!a) { return; }
      Object.keys(links).forEach(function (k) { links[k].classList.remove('cur'); });
      a.classList.add('cur');
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  ['issues', 'coverage', 'tools', 'how', 'faq', 'cta'].forEach(function (id) {
    var s = document.getElementById(id);
    if (s) { spy.observe(s); }
  });

  // Reveal on scroll with per-card stagger inside each group
  document.querySelectorAll('.sec-eye,.sec-h,.sec-sub').forEach(function (el) { el.classList.add('rv'); });
  document.querySelectorAll('.iss-grid,.cov-grid,.how-grid,.tool-grid,.us-r,.faq-list,.stats,.trust-strip').forEach(function (group) {
    Array.prototype.forEach.call(group.children, function (child, i) {
      child.classList.add('rv');
      child.style.setProperty('--rvd', ((i % 6) * 70) + 'ms');
    });
  });
  document.querySelectorAll('.cta-card,.cta-actions').forEach(function (el) { el.classList.add('rv'); });
  var revealer = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        en.target.classList.add('on');
        revealer.unobserve(en.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll('.rv').forEach(function (el) { revealer.observe(el); });
})();
