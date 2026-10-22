/* AGD Studio — consent for cookies and similar technologies (LSSI-CE art. 22.2, GDPR, AEPD guidance).

   Today the site only uses strictly necessary browser storage (see /cookie-policy), which needs no
   consent, so SERVICES is empty and no banner appears. The "Cookie settings" link still opens a panel
   that says so.

   To add an optional tool (analytics, advertising pixel, embedded video, map...):
     1. List it in SERVICES with its category.
     2. Load it inertly so it cannot run before consent:
          <script type="text/plain" data-consent="analytics" data-src="/vendor/tool.js"></script>
        It is turned into a real script only after the visitor accepts that category.
     3. Describe it in cookie-policy.html and privacy-policy.html, and allow its domains in the CSP (vercel.json).
   The banner then appears on its own, with Accept, Reject and Configure given equal weight.
   Bump POLICY_VERSION whenever the list changes so everyone is asked again. */
(function () {
  'use strict';

  var POLICY_VERSION = '2026-10-22';
  var KEY = 'agd-consent';
  var CATEGORIES = ['analytics', 'marketing'];
  var SERVICES = []; // e.g. { category: 'analytics', name: 'Example Analytics', provider: 'Example Ltd. (EU)' }

  var TEXT = {
    en: {
      title: 'Cookie settings',
      intro: 'Choose which optional technologies we may use. Necessary storage is always on because the site needs it to work. You can change your choice at any time from "Cookie settings" at the bottom of every page.',
      none: 'This website only stores what it needs to work: your language choice and whether you have already seen the opening animation. It does not use analytics, advertising or any other optional cookies, so there is nothing to accept or reject.',
      banner: 'We would like to use optional cookies for the purposes below. Nothing optional runs unless you accept it.',
      necessary: 'Necessary', necessaryDesc: 'Remember your language and interface state. Cannot be turned off.', always: 'Always on',
      analytics: 'Analytics', analyticsDesc: 'Measure visits so we can improve the site.',
      marketing: 'Advertising', marketingDesc: 'Measure and personalise ads on other platforms.',
      policy: 'Read the cookie policy',
      accept: 'Accept all', reject: 'Reject all', save: 'Save choices', configure: 'Configure', close: 'Close'
    },
    es: {
      title: 'Configuración de cookies',
      intro: 'Elige qué tecnologías opcionales podemos usar. El almacenamiento necesario está siempre activo porque el sitio lo necesita para funcionar. Puedes cambiar tu elección cuando quieras desde «Configuración de cookies», al pie de cada página.',
      none: 'Este sitio solo guarda lo que necesita para funcionar: el idioma que eliges y si ya has visto la animación de inicio. No utiliza analítica, publicidad ni ninguna otra cookie opcional, así que no hay nada que aceptar ni rechazar.',
      banner: 'Nos gustaría usar cookies opcionales para las finalidades siguientes. Nada opcional se activa si no lo aceptas.',
      necessary: 'Necesarias', necessaryDesc: 'Recuerdan tu idioma y el estado de la interfaz. No se pueden desactivar.', always: 'Siempre activas',
      analytics: 'Analítica', analyticsDesc: 'Medir las visitas para mejorar el sitio.',
      marketing: 'Publicidad', marketingDesc: 'Medir y personalizar anuncios en otras plataformas.',
      policy: 'Leer la política de cookies',
      accept: 'Aceptar todas', reject: 'Rechazar todas', save: 'Guardar selección', configure: 'Configurar', close: 'Cerrar'
    }
  };
  function tr(k) { return TEXT[/^es/i.test(document.documentElement.lang) ? 'es' : 'en'][k]; }

  var active = CATEGORIES.filter(function (c) { return SERVICES.some(function (s) { return s.category === c; }); });

  function read() {
    try {
      var r = JSON.parse(localStorage.getItem(KEY));
      // A choice is valid for this policy version and for at most 12 months, then we ask again
      if (r && r.version === POLICY_VERSION && r.choices && Date.now() - Date.parse(r.date) < 365 * 864e5) return r;
    } catch (e) {}
    return null;
  }
  var record = read();

  // Stored locally as proof of the choice: version of the policy, date and per-category answer. No personal data.
  function decide(choices) {
    var before = record;
    record = { version: POLICY_VERSION, date: new Date().toISOString(), choices: choices };
    try { localStorage.setItem(KEY, JSON.stringify(record)); } catch (e) {}
    hideBanner();
    // A script that already ran cannot be unloaded, so withdrawing consent reloads the page without it
    var withdrawn = before && active.some(function (c) { return before.choices[c] && !choices[c]; });
    if (withdrawn) { location.reload(); return; }
    run();
  }
  function all(value) {
    var c = {};
    active.forEach(function (k) { c[k] = value; });
    return c;
  }

  function run() {
    if (!record) return;
    Array.prototype.forEach.call(document.querySelectorAll('script[type="text/plain"][data-consent][data-src]'), function (old) {
      if (!record.choices[old.getAttribute('data-consent')]) return;
      var s = document.createElement('script');
      s.src = old.getAttribute('data-src');
      old.parentNode.replaceChild(s, old);
    });
    document.dispatchEvent(new CustomEvent('agd:consent', { detail: record }));
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }
  function button(label, onClick) {
    var b = el('button', 'btn', label);
    b.type = 'button';
    b.addEventListener('click', onClick);
    return b;
  }
  function policyLink() {
    var a = el('a', '', tr('policy'));
    a.href = '/cookie-policy';
    return a;
  }

  /* ---------- Banner: only when there is something optional to decide ---------- */
  var banner = null;
  function showBanner() {
    hideBanner();
    banner = el('div', 'cc-banner');
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', tr('title'));
    var p = el('p', '', tr('banner') + ' ');
    p.appendChild(policyLink());
    var actions = el('div', 'cc-actions');
    actions.appendChild(button(tr('reject'), function () { decide(all(false)); }));
    actions.appendChild(button(tr('configure'), openSettings));
    actions.appendChild(button(tr('accept'), function () { decide(all(true)); }));
    banner.appendChild(p);
    banner.appendChild(actions);
    document.body.appendChild(banner);
  }
  function hideBanner() {
    if (banner) { banner.remove(); banner = null; }
  }

  /* ---------- Settings panel ---------- */
  function openSettings() {
    var old = document.querySelector('.cc-dialog');
    if (old) old.remove();
    var d = el('dialog', 'cc-dialog');
    d.setAttribute('aria-labelledby', 'cc-title');
    d.setAttribute('data-lenis-prevent', '');
    var h = el('h2', '', tr('title'));
    h.id = 'cc-title';
    d.appendChild(h);
    d.appendChild(el('p', '', tr(active.length ? 'intro' : 'none')));

    var cats = el('div', 'cc-cats');
    var nec = el('div', 'cc-cat');
    nec.appendChild(el('h3', '', tr('necessary')));
    nec.appendChild(el('span', 'cc-state', tr('always')));
    nec.appendChild(el('p', '', tr('necessaryDesc')));
    cats.appendChild(nec);
    var boxes = {};
    active.forEach(function (c) {
      var row = el('div', 'cc-cat');
      var id = 'cc-' + c;
      var label = el('label', '', tr(c));
      label.htmlFor = id;
      var h3 = el('h3');
      h3.appendChild(label);
      var box = document.createElement('input');
      box.type = 'checkbox'; box.id = id; box.className = 'cc-switch';
      box.checked = !!(record && record.choices[c]); // never pre-ticked without a prior choice
      boxes[c] = box;
      var desc = el('p', '', tr(c + 'Desc') + ' · ' + SERVICES.filter(function (s) { return s.category === c; })
        .map(function (s) { return s.name + ' (' + s.provider + ')'; }).join(', '));
      row.appendChild(h3); row.appendChild(box); row.appendChild(desc);
      cats.appendChild(row);
    });
    d.appendChild(cats);
    var lp = el('p');
    lp.appendChild(policyLink());
    d.appendChild(lp);

    var actions = el('div', 'cc-actions');
    actions.style.marginTop = '22px';
    function done(choices) { d.close(); decide(choices); }
    if (active.length) {
      actions.appendChild(button(tr('reject'), function () { done(all(false)); }));
      actions.appendChild(button(tr('save'), function () {
        var c = {};
        active.forEach(function (k) { c[k] = boxes[k].checked; });
        done(c);
      }));
      actions.appendChild(button(tr('accept'), function () { done(all(true)); }));
    } else {
      actions.appendChild(button(tr('close'), function () { d.close(); }));
    }
    d.appendChild(actions);
    d.addEventListener('close', function () { d.remove(); });
    document.body.appendChild(d);
    if (d.showModal) d.showModal(); else d.setAttribute('open', '');
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-cookie-settings]');
    if (!t) return;
    e.preventDefault();
    openSettings();
  });

  function init() {
    if (active.length && !record) {
      showBanner();
      // Keep the banner in the visitor's language when they switch it
      new MutationObserver(function () { if (banner) showBanner(); })
        .observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    }
    run();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.AGDConsent = { open: openSettings, get: function () { return record; } };
})();
