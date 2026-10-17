/* ── GOOGLE ADS CONVERSIONS (AW-16799190588) ── */
// Contact: AW-16799190588/1bXfCJjJ9I0dELycvco- (fires on call-link clicks, not on pageview)
// Purchase: AW-16799190588/gPTnCL2G94wdELycvco- (call reportPurchaseConversion(id) only on a real purchase/thank-you)
function reportContactConversion() {
  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'conversion', { 'send_to': 'AW-16799190588/1bXfCJjJ9I0dELycvco-' });
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
document.addEventListener('click', function (e) {
  var a = e.target && e.target.closest ? e.target.closest('a[href^="tel:"]') : null;
  if (a) { reportContactConversion(); }
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
        ? '<div class="muted" style="color:#FFB066;">That window has passed. Call <a href="tel:+18888825124" style="color:var(--accent);">(888) 882-5124</a> and we will help escalate it.</div>'
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
