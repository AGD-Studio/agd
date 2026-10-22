/* AGD Studio — site behaviour */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ------------------------------------------------------------------
     Language: English lives in the markup, Spanish comes from i18n.js
     ------------------------------------------------------------------ */
  var ES = window.GD_ES || {};
  var lang = root.getAttribute('data-lang') === 'es' ? 'es' : 'en';
  var I18N_ATTRS = ['aria-label', 'placeholder'];
  var EN_TITLE = document.title, metaDesc = $('meta[name="description"]'), EN_DESC = metaDesc ? metaDesc.content : '';
  function t(s) { return lang === 'es' && ES[s] ? ES[s] : s; }

  // Swap every translatable text node and attribute under `scope`, keeping the English original on the node
  function translate(scope) {
    scope = scope || document.body;
    var walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT, null), n;
    while ((n = walker.nextNode())) {
      if (n.__en === undefined) {
        var key = n.nodeValue.replace(/\s+/g, ' ').trim();
        if (!key || !ES[key]) continue;
        n.__en = n.nodeValue; n.__key = key;
      }
      n.nodeValue = lang === 'es' ? n.__en.replace(/\S[\s\S]*\S|\S/, function () { return ES[n.__key]; }) : n.__en;
    }
    $$('[' + I18N_ATTRS.join('],[') + ']', scope).forEach(function (el) {
      var store = el.__enAttrs || (el.__enAttrs = {});
      I18N_ATTRS.forEach(function (a) {
        if (!el.hasAttribute(a)) return;
        if (!(a in store)) { if (!ES[el.getAttribute(a)]) return; store[a] = el.getAttribute(a); }
        el.setAttribute(a, lang === 'es' ? ES[store[a]] : store[a]);
      });
    });
  }

  function applyLang() {
    root.lang = lang;
    root.setAttribute('data-lang', lang);
    translate();
    document.title = t(EN_TITLE);
    if (metaDesc) metaDesc.content = t(EN_DESC);
    $('.lang').setAttribute('aria-label', lang === 'es' ? 'EN ES, view in English' : 'EN ES, ver en español');
    $('.menu-label').textContent = t(document.body.classList.contains('menu-open') ? 'Close' : 'Menu');
  }

  function setLang(next) {
    if (next === lang) return;
    lang = next;
    root.setAttribute('data-lang', lang);
    try { localStorage.setItem('gd-lang', lang); } catch (e) {}
    function swap() { applyLang(); }
    if (reduceMotion) { swap(); return; }
    // Fade the copy out, swap it while invisible, fade it back in
    document.body.classList.add('is-switching');
    setTimeout(function () {
      swap();
      requestAnimationFrame(function () { document.body.classList.remove('is-switching'); });
    }, 320);
  }
  $('.lang').addEventListener('click', function () { setLang(lang === 'es' ? 'en' : 'es'); });

  /* ------------------------------------------------------------------
     Content: sample sites used across the page
     ------------------------------------------------------------------ */
  var DEMOS = {
    norte: {
      name: 'Atelier Norte', url: 'ateliernorte.com', kind: 'Architecture and interiors',
      headline: 'Quiet buildings for loud cities.',
      sub: 'Residential and cultural projects designed to age well and feel calm from the first step inside.',
      nav: ['Projects', 'Studio', 'Journal', 'Contact'], cta: 'View projects',
      items: ['Casa Lumen', 'Pavilion Nine', 'Harbour Offices'],
      quote: 'Architecture is the art of leaving out everything that does not matter.',
      foot: 'Studio visits by appointment',
      bg: '#E9E8E4', fg: '#1A1A1A', ac: '#B3A999', font: 'var(--font)', stretch: '72%', textCase: 'uppercase', weight: 600,
      radius: '0', imgRadius: '0', thumbShape: '0', art: 'arch'
    },
    mare: {
      name: 'Maré', url: 'mare-restaurante.com', kind: 'Seafood restaurant on the harbour',
      headline: 'Fresh from the bay, every evening.',
      sub: 'Seasonal fish, rice dishes and natural wine, served by the water since 2009.',
      nav: ['Menu', 'Wine', 'Story', 'Events'], cta: 'Book a table',
      items: ['Oysters and raw bar', 'Catch of the day', 'Black rice'],
      quote: 'The menu changes with the boats. Ask us what came in this morning.',
      foot: 'Open Tuesday to Sunday',
      bg: '#F1EEE6', fg: '#123A3A', ac: '#E0623A', font: 'var(--font)', stretch: '125%', weight: 500,
      radius: '999px', imgRadius: '18px', thumbShape: '50%', art: 'waves'
    },
    solenne: {
      name: 'Solenne', url: 'solenne.shop', kind: 'Skincare, made in small batches',
      headline: 'Skincare with nothing to hide.',
      sub: 'Three products, eleven ingredients, every one of them listed on the front of the bottle.',
      nav: ['Shop', 'The ritual', 'Ingredients', 'Journal'], cta: 'Shop the ritual',
      items: ['Gentle cleanser', 'Daily serum', 'Night balm'],
      quote: 'Less on the shelf, more on the skin.',
      foot: 'Free shipping over €40',
      bg: '#F4ECE8', fg: '#3B2A26', ac: '#C98B7A', font: 'var(--serif)', stretch: '100%', weight: 400,
      radius: '0', imgRadius: '400px 400px 0 0', thumbShape: '40% 40% 8px 8px', art: 'bottle'
    },
    costa: {
      name: 'Costa Habitat', url: 'costahabitat.es', kind: 'Homes on the Mediterranean coast',
      headline: 'Find a home with the sea in it.',
      sub: 'Villas, apartments and new developments, with a map, honest photos and an agent who answers.',
      nav: ['Buy', 'Rent', 'New builds', 'Sell with us'], cta: 'Search homes',
      items: ['Villa Pinar', 'Ático Mar', 'Casa Alba'],
      quote: 'Every listing includes floor plans, real photos and the price. No surprises.',
      foot: '42 homes available',
      bg: '#F5F7F7', fg: '#0E2D4A', ac: '#0AAFB8', font: 'var(--font)', stretch: '100%', weight: 500,
      radius: '6px', imgRadius: '8px', thumbShape: '0', art: 'villa'
    },
    ferrer: {
      name: 'Ferrer Carpentry', url: 'ferrercarpentry.com', kind: 'Carpentry and furniture since 1987',
      headline: 'Made to measure, made to last.',
      sub: 'Kitchens, doors and furniture built in our workshop and fitted by the same team.',
      nav: ['Work', 'Kitchens', 'Furniture', 'Contact'], cta: 'Request a quote',
      items: ['Kitchens', 'Doors', 'Tables'],
      quote: 'Same family, same workshop, better tools.',
      foot: 'Workshop open Monday to Saturday',
      bg: '#EFEEE9', fg: '#1E2B24', ac: '#B5733F', font: 'var(--serif)', stretch: '100%', weight: 500,
      radius: '4px', imgRadius: '4px', thumbShape: '4px', art: 'wood'
    }
  };

  var WORK = [
    { layout: 'wide', items: [
      { demo: 'norte', industry: 'Architecture', service: 'Website and visual identity',
        desc: 'A portfolio that lets the buildings speak: large imagery, quiet type and project pages built like printed monographs.' }
    ] },
    { layout: 'pair', items: [
      { demo: 'costa', industry: 'Real estate', service: 'Property platform',
        desc: 'Searchable listings with a map view, saved favourites and a page for every home that agents update in minutes.' },
      { demo: 'mare', industry: 'Hospitality', service: 'Website and reservations',
        desc: 'A restaurant site that reads like the menu: seasonal, short and one tap from booking a table.' }
    ] },
    { layout: 'wide', items: [
      { demo: 'solenne', industry: 'Beauty', service: 'Online shop and launch campaign',
        desc: 'Shop, product story and launch campaign for a skincare line built around three products.' }
    ] }
  ];

  var PROPS = [
    { id: 'pinar', name: 'Villa Pinar', type: 'Villa', op: 'sale', area: 'Pinar Alto', price: '€1,250,000', tag: '€1.25M', beds: 4, baths: 3, m2: 320, x: 455, y: 118, art: 'villa' },
    { id: 'atico', name: 'Ático Mar', type: 'Penthouse', op: 'sale', area: 'Old Harbour', price: '€640,000', tag: '€640k', beds: 3, baths: 2, m2: 145, x: 238, y: 318, art: 'tower' },
    { id: 'loft', name: 'Loft Puerto', type: 'Loft', op: 'rent', area: 'Old Harbour', price: '€2,100 a month', tag: '€2,100/mo', beds: 1, baths: 1, m2: 92, x: 118, y: 262, art: 'loft' },
    { id: 'mirador', name: 'Estudio Mirador', type: 'Apartment', op: 'rent', area: 'Parque del Sol', price: '€1,350 a month', tag: '€1,350/mo', beds: 1, baths: 1, m2: 64, x: 480, y: 250, art: 'block' },
    { id: 'alba', name: 'Casa Alba', type: 'Townhouse', op: 'sale', area: 'Cala Blanca', price: '€485,000', tag: '€485k', beds: 3, baths: 2, m2: 180, x: 392, y: 432, art: 'town' }
  ];

  /* ------------------------------------------------------------------
     Illustrations (SVG strings)
     ------------------------------------------------------------------ */
  function wavePath(y, amp, len) {
    var d = 'M0 ' + y;
    for (var x = 0; x < 420; x += len) d += ' q' + len / 4 + ' ' + -amp + ' ' + len / 2 + ' 0 t' + len / 2 + ' 0';
    return d + ' V340 H0Z';
  }

  function art(kind, d) {
    var open = '<svg viewBox="0 0 400 340" preserveAspectRatio="xMidYMid slice" aria-hidden="true">';
    switch (kind) {
      case 'arch':
        var fins = '';
        for (var i = 0; i < 7; i++) fins += '<rect x="' + (78 + i * 38) + '" y="132" width="5" height="208" fill="#1A1A1A" opacity=".18"/>';
        return open + '<rect width="400" height="340" fill="' + d.ac + '"/><circle cx="318" cy="64" r="28" fill="#EDE9E3"/>' +
          '<rect x="56" y="96" width="288" height="244" fill="#DAD5CD"/><rect x="56" y="96" width="288" height="22" fill="#1A1A1A" opacity=".88"/>' +
          fins + '<path d="M150 340V222a50 50 0 0 1 100 0v118z" fill="#1A1A1A"/><rect x="0" y="330" width="400" height="10" fill="#1A1A1A" opacity=".3"/></svg>';
      case 'waves':
        return open + '<rect width="400" height="340" fill="' + d.ac + '"/><circle cx="200" cy="196" r="92" fill="#F6D9B8"/>' +
          '<path d="' + wavePath(214, 10, 80) + '" fill="#1E5552"/><path d="' + wavePath(244, 9, 64) + '" fill="#174745"/>' +
          '<path d="' + wavePath(276, 8, 52) + '" fill="#123A3A"/><path d="' + wavePath(306, 6, 44) + '" fill="#0C2A2A"/></svg>';
      case 'bottle':
        return open + '<rect width="400" height="340" fill="#E8D3C9"/><rect y="290" width="400" height="50" fill="#D7B9AC"/>' +
          '<ellipse cx="200" cy="292" rx="160" ry="10" fill="#3B2A26" opacity=".12"/>' +
          '<rect x="98" y="122" width="74" height="170" rx="16" fill="#FAF4F1"/><rect x="119" y="88" width="32" height="38" rx="4" fill="#3B2A26"/>' +
          '<rect x="112" y="190" width="46" height="34" fill="none" stroke="#3B2A26" stroke-width="1.2" opacity=".5"/>' +
          '<rect x="196" y="168" width="86" height="124" rx="43" fill="' + d.ac + '"/><rect x="226" y="146" width="26" height="26" rx="3" fill="#3B2A26"/>' +
          '<rect x="292" y="232" width="62" height="60" rx="10" fill="#F2E3DC"/><rect x="290" y="222" width="66" height="16" rx="6" fill="#3B2A26"/></svg>';
      case 'wood':
        var planks = '';
        var tones = ['#B5733F', '#A6662F', '#C0814C', '#9C5E2C', '#B87A45', '#A86A35'];
        for (var p = 0; p < 8; p++) {
          planks += '<rect x="' + p * 52 + '" y="0" width="52" height="340" fill="' + tones[p % tones.length] + '"/>' +
            '<path d="M' + (p * 52 + 16) + ' 0 C' + (p * 52 + 26) + ' 90 ' + (p * 52 + 8) + ' 180 ' + (p * 52 + 22) + ' 340" stroke="#7A4A22" stroke-width="1" fill="none" opacity=".45"/>' +
            '<path d="M' + (p * 52 + 36) + ' 0 C' + (p * 52 + 30) + ' 120 ' + (p * 52 + 44) + ' 220 ' + (p * 52 + 34) + ' 340" stroke="#7A4A22" stroke-width="1" fill="none" opacity=".3"/>';
        }
        return open + planks + '<rect x="96" y="176" width="208" height="16" rx="3" fill="#1E2B24"/><rect x="118" y="192" width="10" height="110" fill="#1E2B24"/><rect x="272" y="192" width="10" height="110" fill="#1E2B24"/></svg>';
      case 'villa':
        return propArt('villa');
      default:
        return open + '<rect width="400" height="340" fill="' + d.ac + '"/></svg>';
    }
  }

  function propArt(kind) {
    var open = '<svg viewBox="0 0 400 310" preserveAspectRatio="xMidYMid slice" aria-hidden="true">';
    var sky = '<rect width="400" height="310" fill="#CFE6E9"/>';
    switch (kind) {
      case 'villa':
        return open + sky + '<circle cx="330" cy="62" r="22" fill="#F7F3EA"/>' +
          '<rect y="238" width="400" height="72" fill="#E8ECEA"/>' +
          '<rect x="64" y="150" width="240" height="88" fill="#FAFBFA"/><rect x="64" y="150" width="240" height="8" fill="#0E2D4A"/>' +
          '<rect x="150" y="92" width="190" height="58" fill="#F1F4F4"/><rect x="150" y="92" width="190" height="7" fill="#0E2D4A"/>' +
          '<rect x="176" y="108" width="140" height="34" fill="#0E2D4A" opacity=".82"/>' +
          '<rect x="84" y="172" width="120" height="58" fill="#0E2D4A" opacity=".85"/><rect x="220" y="172" width="64" height="66" fill="#DCE3E6"/>' +
          '<rect x="40" y="252" width="230" height="22" fill="#0AAFB8"/><rect x="40" y="252" width="230" height="4" fill="#078C94"/>' +
          '<path d="M348 238 C344 200 342 170 352 130" stroke="#C98A4B" stroke-width="6" fill="none" stroke-linecap="round"/>' +
          '<path d="M352 130 c-22 -10 -40 -2 -52 10 c16 -4 34 -6 52 -10z M352 130 c18 -16 38 -16 52 -6 c-18 -2 -36 2 -52 6z M352 130 c-6 -20 4 -36 18 -42 c-8 12 -12 26 -18 42z M352 130 c10 6 22 22 22 40 c-8 -14 -14 -26 -22 -40z" fill="#1F6F6B"/></svg>';
      case 'tower':
        var w = '';
        for (var r = 0; r < 6; r++) for (var c = 0; c < 4; c++)
          w += '<rect x="' + (128 + c * 38) + '" y="' + (78 + r * 34) + '" width="30" height="22" fill="#0E2D4A" opacity="' + (r === 0 ? .9 : .7) + '"/>';
        var b = '';
        for (var r2 = 1; r2 < 6; r2++) b += '<rect x="118" y="' + (100 + r2 * 34 - 2) + '" width="168" height="4" fill="#FAFBFA"/>';
        return open + sky + '<rect y="276" width="400" height="34" fill="#E8ECEA"/>' +
          '<rect x="118" y="60" width="168" height="216" fill="#E4E8EA"/><rect x="108" y="52" width="188" height="10" fill="#0E2D4A"/>' + w + b +
          '<rect x="296" y="196" width="80" height="80" fill="#F2F5F5"/><rect x="24" y="214" width="84" height="62" fill="#DCE3E6"/></svg>';
      case 'loft':
        return open + '<rect width="400" height="310" fill="#DCE8EA"/><rect y="262" width="400" height="48" fill="#D9DEDF"/>' +
          '<path d="M40 262V150l60-40v40l60-40v40l60-40v40l60-40v40l60-40v152z" fill="#A8553A"/>' +
          '<path d="M40 150l60-40v40l60-40v40l60-40v40l60-40v40l60-40" fill="none" stroke="#0E2D4A" stroke-width="5" stroke-linejoin="round"/>' +
          '<rect x="70" y="176" width="260" height="70" fill="#0E2D4A" opacity=".85"/>' +
          '<path d="M122 176v70M174 176v70M226 176v70M278 176v70M70 211h260" stroke="#A8553A" stroke-width="4"/></svg>';
      case 'block':
        var win = '';
        for (var rr = 0; rr < 4; rr++) for (var cc = 0; cc < 3; cc++)
          win += '<rect x="' + (92 + cc * 78) + '" y="' + (88 + rr * 44) + '" width="56" height="30" rx="15" fill="#0E2D4A" opacity=".78"/>';
        return open + '<rect width="400" height="310" fill="#E7E1D6"/><rect y="270" width="400" height="40" fill="#D2CCBF"/>' +
          '<rect x="72" y="66" width="256" height="204" fill="#F6F2EA"/>' + win +
          '<rect x="176" y="236" width="48" height="34" fill="#0AAFB8"/><circle cx="352" cy="232" r="30" fill="#7FA68E"/><rect x="349" y="240" width="6" height="30" fill="#5B6F5F"/></svg>';
      case 'town':
        return open + sky + '<rect y="268" width="400" height="42" fill="#E8ECEA"/>' +
          '<path d="M128 268V112l72-50 72 50v156z" fill="#F7F4EE"/><path d="M118 116l82-58 82 58" fill="none" stroke="#0E2D4A" stroke-width="7" stroke-linejoin="round"/>' +
          '<rect x="150" y="132" width="34" height="48" fill="#0E2D4A" opacity=".85"/><rect x="216" y="132" width="34" height="48" fill="#0E2D4A" opacity=".85"/>' +
          '<rect x="140" y="132" width="8" height="48" fill="#0AAFB8"/><rect x="186" y="132" width="8" height="48" fill="#0AAFB8"/>' +
          '<rect x="206" y="132" width="8" height="48" fill="#0AAFB8"/><rect x="252" y="132" width="8" height="48" fill="#0AAFB8"/>' +
          '<rect x="182" y="206" width="36" height="62" fill="#0E2D4A"/><rect x="150" y="206" width="22" height="30" fill="#0E2D4A" opacity=".6"/><rect x="228" y="206" width="22" height="30" fill="#0E2D4A" opacity=".6"/>' +
          '<rect x="40" y="170" width="88" height="98" fill="#E2D9CB"/><rect x="272" y="160" width="96" height="108" fill="#DCE3E6"/></svg>';
    }
    return open + sky + '</svg>';
  }

  /* ------------------------------------------------------------------
     Mini-site component
     ------------------------------------------------------------------ */
  function miniSite(key) {
    var d = DEMOS[key];
    var style = [
      '--ms-bg:' + d.bg, '--ms-fg:' + d.fg, '--ms-ac:' + d.ac, '--ms-font:' + d.font,
      '--ms-stretch:' + d.stretch, '--ms-weight:' + d.weight, '--ms-radius:' + d.radius,
      '--ms-img-radius:' + d.imgRadius, '--ms-thumb-shape:' + d.thumbShape,
      '--ms-case:' + (d.textCase || 'none')
    ].join(';');
    var links = d.nav.map(function (n) { return '<span>' + n + '</span>'; }).join('');
    var items = d.items.map(function (it, i) {
      return '<div class="ms-item"><div class="ms-thumb" style="--i:' + i + '"></div><span>' + it + '</span></div>';
    }).join('');
    return '<div class="ms" style="' + style + '">' +
      '<div class="ms-nav"><span class="ms-logo">' + d.name + '</span><span class="ms-links">' + links + '</span>' +
      '<span class="ms-cta-s">' + d.cta + '</span><span class="ms-burger"><i></i><i></i></span></div>' +
      '<div class="ms-hero"><div class="ms-copy"><p class="ms-kicker">' + d.kind + '</p><p class="ms-h">' + d.headline + '</p>' +
      '<p class="ms-p">' + d.sub + '</p><span class="ms-btn">' + d.cta + '</span></div>' +
      '<div class="ms-art">' + art(d.art, d) + '</div></div>' +
      '<div class="ms-grid">' + items + '</div>' +
      '<div class="ms-quote"><p>' + d.quote + '</p></div>' +
      '<div class="ms-foot"><span>' + d.name + '</span><span>' + d.foot + '</span></div>' +
      '</div>';
  }

  /* ------------------------------------------------------------------
     Web section: switchable, resizable live preview
     ------------------------------------------------------------------ */
  (function bench() {
    var stage = $('#stage'), device = $('#device'), view = $('#device-view'), handle = $('#device-handle');
    var urlEl = $('.device-url'), widthEl = $('.bench-width');
    if (!stage) return;
    var sizes = { desktop: 1280, tablet: 768, mobile: 375 };
    var current = 'desktop';
    var manual = null;

    function maxWidth() {
      var cs = getComputedStyle(stage);
      return stage.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    }
    function setWidth(px, animate) {
      var w = Math.round(Math.max(320, Math.min(px, maxWidth())));
      device.classList.toggle('is-animating', !!animate);
      device.style.width = w + 'px';
      widthEl.textContent = w + ' px';
    }
    function load(key) {
      view.innerHTML = miniSite(key);
      translate(view);
      urlEl.textContent = DEMOS[key].url;
      view.scrollTop = 0;
    }
    function press(group, btn) {
      $$(group).forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
    }

    $$('.pick').forEach(function (b) {
      b.addEventListener('click', function () { press('.pick', b); load(b.dataset.demo); });
    });
    $$('[data-size]').forEach(function (b) {
      b.addEventListener('click', function () {
        current = b.dataset.size; manual = null;
        press('[data-size]', b);
        setWidth(sizes[current], !reduceMotion);
      });
    });

    var startX = 0, startW = 0;
    handle.addEventListener('pointerdown', function (e) {
      startX = e.clientX; startW = device.getBoundingClientRect().width;
      handle.setPointerCapture(e.pointerId);
      device.classList.remove('is-animating');
      e.preventDefault();
    });
    handle.addEventListener('pointermove', function (e) {
      if (!handle.hasPointerCapture(e.pointerId)) return;
      manual = startW + (e.clientX - startX) * 2;
      setWidth(manual, false);
      $$('[data-size]').forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
    });
    handle.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault();
      manual = device.getBoundingClientRect().width + (e.key === 'ArrowRight' ? 40 : -40);
      setWidth(manual, false);
    });

    window.addEventListener('resize', function () { setWidth(manual || sizes[current], false); });
    load('norte');
    setWidth(sizes.desktop, false);
  })();

  /* ------------------------------------------------------------------
     Services: illustrative property sheet reuses the listing artwork
     ------------------------------------------------------------------ */
  (function sheet() {
    var el = $('#sheet-art');
    if (el) el.innerHTML = propArt('villa');
  })();

  /* ------------------------------------------------------------------
     Brand visibility: link list items to the diagram
     ------------------------------------------------------------------ */
  (function visibility() {
    var ways = $$('.way'), orbit = $('.orbit');
    if (!orbit || !ways.length) return;
    function setWay(way) {
      var keys = way.dataset.k.split(' ');
      ways.forEach(function (w) { w.classList.toggle('is-on', w === way); });
      $$('.node, .spoke', orbit).forEach(function (el) { el.classList.toggle('is-on', keys.indexOf(el.dataset.k) > -1); });
    }
    ways.forEach(function (w) {
      ['mouseenter', 'focus', 'click'].forEach(function (ev) { w.addEventListener(ev, function () { setWay(w); }); });
    });
    setWay(ways[0]);
    if ('IntersectionObserver' in window && !reduceMotion) {
      new IntersectionObserver(function (en) { orbit.classList.toggle('is-live', en[0].isIntersecting); }).observe(orbit);
    }
  })();

  /* ------------------------------------------------------------------
     Business: before / after
     ------------------------------------------------------------------ */
  (function compare() {
    var box = $('#compare');
    if (!box) return;
    $('#compare-after').innerHTML = miniSite('ferrer');
    var range = $('input', box);
    range.addEventListener('input', function () { box.style.setProperty('--pos', range.value + '%'); });
  })();

  /* ------------------------------------------------------------------
     Real estate: map + listing
     ------------------------------------------------------------------ */
  (function realEstate() {
    var pinsG = $('#pins'), list = $('#props');
    if (!pinsG) return;

    pinsG.innerHTML = PROPS.map(function (p) {
      var tw = 18 + p.tag.length * 7.6;
      return '<g class="pin" data-id="' + p.id + '" tabindex="0" role="button" aria-label="' + p.name + ', ' + p.price + '">' +
        '<circle class="pin-halo" cx="' + p.x + '" cy="' + p.y + '" r="10"/>' +
        '<circle class="pin-dot" cx="' + p.x + '" cy="' + p.y + '" r="7"/>' +
        '<g class="pin-tag"><rect x="' + (p.x - tw / 2) + '" y="' + (p.y - 48) + '" width="' + tw + '" height="28" rx="14"/>' +
        '<text x="' + p.x + '" y="' + (p.y - 29.5) + '" text-anchor="middle">' + p.tag + '</text></g></g>';
    }).join('');

    list.innerHTML = PROPS.map(function (p) {
      return '<button class="prop" data-id="' + p.id + '" data-op="' + p.op + '">' +
        '<div class="prop-img">' + propArt(p.art) + '</div>' +
        '<div class="prop-info"><div><p class="prop-type"><span>' + p.type + '</span><span> in </span>' + p.area + '</p><h3>' + p.name + '</h3></div>' +
        '<p class="prop-price">' + p.price + '</p>' +
        '<dl><div><dt>Beds</dt><dd>' + p.beds + '</dd></div><div><dt>Baths</dt><dd>' + p.baths + '</dd></div><div><dt>Area</dt><dd>' + p.m2 + ' m²</dd></div></dl>' +
        '</div></button>';
    }).join('');

    function setActive(id, fromPin) {
      $$('.pin', pinsG).forEach(function (el) {
        el.classList.toggle('is-on', el.dataset.id === id);
        if (el.dataset.id === id) pinsG.appendChild(el); // keep the active tag above its neighbours
      });
      $$('.prop', list).forEach(function (el) {
        var on = el.dataset.id === id;
        el.classList.toggle('is-on', on);
        if (on && fromPin && list.scrollHeight > list.clientHeight) {
          list.scrollTo({ top: el.offsetTop - list.offsetTop, behavior: reduceMotion ? 'auto' : 'smooth' });
        }
      });
    }
    $$('.prop', list).forEach(function (el) {
      el.addEventListener('mouseenter', function () { setActive(el.dataset.id); });
      el.addEventListener('focus', function () { setActive(el.dataset.id); });
      el.addEventListener('click', function () { setActive(el.dataset.id); });
    });
    pinsG.addEventListener('mouseover', function (e) {
      var pin = e.target.closest('.pin'); if (pin) setActive(pin.dataset.id, true);
    });
    pinsG.addEventListener('focusin', function (e) {
      var pin = e.target.closest('.pin'); if (pin) setActive(pin.dataset.id, true);
    });

    var filterBtns = $$('[data-op]', $('.re-filter'));
    filterBtns.forEach(function (b) {
      b.addEventListener('click', function () {
        var op = b.dataset.op, first = null;
        filterBtns.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        PROPS.forEach(function (p) {
          var show = op === 'all' || p.op === op;
          if (show && !first) first = p.id;
          $('.prop[data-id="' + p.id + '"]', list).hidden = !show;
          var pin = $('.pin[data-id="' + p.id + '"]', pinsG);
          pin.style.opacity = show ? '' : '.15';
          pin.style.pointerEvents = show ? '' : 'none';
          pin.setAttribute('tabindex', show ? '0' : '-1');
        });
        if (first) setActive(first, true);
      });
    });
    setActive(PROPS[0].id);
  })();

  /* ------------------------------------------------------------------
     Selected work
     ------------------------------------------------------------------ */
  (function work() {
    var el = $('#work-list');
    if (!el) return;
    el.innerHTML = WORK.map(function (row) {
      return '<div class="work-row work-row--' + row.layout + '">' + row.items.map(function (w) {
        var d = DEMOS[w.demo];
        return '<article class="work">' +
          '<div class="work-preview" tabindex="0" aria-label="Preview of the ' + d.name + ' concept. Focus to scroll through it.">' + miniSite(w.demo) + '</div>' +
          '<div class="work-meta"><div><h3>' + d.name + '</h3><p class="work-desc">' + w.desc + '</p></div>' +
          '<dl><dt>Industry</dt><dd>' + w.industry + '</dd><dt>Service</dt><dd>' + w.service + '</dd></dl></div>' +
          '</article>';
      }).join('') + '</div>';
    }).join('');
  })();

  /* ------------------------------------------------------------------
     Contact form
     ------------------------------------------------------------------ */
  var preselect = function () {};
  (function form() {
    var f = $('#form'), status = $('#form-status');
    if (!f) return;
    var EMAIL = 'agd.studiogc@gmail.com';
    function err(input, msg) {
      var e = $('.field-error', input.closest('.field'));
      if (e) e.textContent = msg || '';
      input.setAttribute('aria-invalid', msg ? 'true' : 'false');
      return !msg;
    }
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = f.name.value.trim(), email = f.email.value.trim(), msg = f.message.value.trim();
      var ok = [
        err(f.name, name ? '' : t('Add your name so we know who to reply to.')),
        err(f.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? '' : t('Enter an email address like you@company.com.')),
        err(f.message, msg ? '' : t('Tell us a little about the project.'))
      ].every(Boolean);
      if (!ok) { $('[aria-invalid="true"]', f).focus(); return; }
      var type = (f.querySelector('input[name="type"]:checked') || {}).value || 'Project';
      var body = 'Name: ' + name + '\nEmail: ' + email + '\nCompany: ' + (f.company.value.trim() || '-') + '\nProject type: ' + type + '\n\n' + msg;
      window.location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(t('New project: ') + type) + '&body=' + encodeURIComponent(body);
      status.classList.add('is-ok');
      status.textContent = t('Thanks, ') + name.split(' ')[0] + t('. Your email app should open with the brief ready to send. If it doesn\'t, write to ') + EMAIL + '.';
    });
    // Links to /?service=<key>#contact preselect a project type, on arrival or without leaving the page
    preselect = function (key) {
      var r = key && f.querySelector('input[name="type"][data-key="' + key.replace(/[^a-z]/g, '') + '"]');
      if (r) r.checked = true;
    };
    var params = new URLSearchParams(location.search);
    if (params.has('service')) {
      preselect(params.get('service'));
      history.replaceState(null, '', location.pathname + location.hash);
    }
  })();

  /* ------------------------------------------------------------------
     In-page links: native scrolling, softened only when motion is welcome
     ------------------------------------------------------------------ */
  function scrollToTarget(hash) {
    var target = hash === '#top' ? 0 : $(hash);
    if (target === null) return false;
    if (target === 0) window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    else target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    return true;
  }

  /* ------------------------------------------------------------------
     Navigation: menu, dropdowns, colour over dark sections
     ------------------------------------------------------------------ */
  var nav = $('#nav'), menuBtn = $('.menu-btn'), menu = $('#menu');
  function setMenu(open) {
    document.body.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    $('.menu-label', menuBtn).textContent = t(open ? 'Close' : 'Menu');
    menu.setAttribute('aria-hidden', String(!open));
    document.documentElement.style.overflow = open ? 'hidden' : '';
  }
  menuBtn.addEventListener('click', function () { setMenu(!document.body.classList.contains('menu-open')); });

  // Dropdowns: hover opens them with CSS; the chevron button opens them for keyboard and touch
  var navItems = $$('.nav-item');
  function setSub(item, open) {
    item.classList.toggle('is-open', open);
    $('.nav-sub-btn', item).setAttribute('aria-expanded', String(open));
  }
  navItems.forEach(function (item) {
    var btn = $('.nav-sub-btn', item);
    btn.addEventListener('click', function () {
      var open = !item.classList.contains('is-open');
      navItems.forEach(function (o) { setSub(o, false); });
      setSub(item, open);
      if (open) $('.nav-sub a', item).focus();
    });
    item.addEventListener('focusout', function (e) { if (!item.contains(e.relatedTarget)) setSub(item, false); });
  });
  document.addEventListener('click', function (e) {
    navItems.forEach(function (item) { if (!item.contains(e.target)) setSub(item, false); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (document.body.classList.contains('menu-open')) { setMenu(false); menuBtn.focus(); return; }
    navItems.forEach(function (item) {
      if (item.classList.contains('is-open')) { setSub(item, false); $('.nav-sub-btn', item).focus(); }
    });
  });

  // Mark the current page in the main navigation
  function cleanPath(path) { return path.replace(/\/index(\.html)?$/, '/').replace(/\.html$/, '') || '/'; }
  var here = cleanPath(location.pathname);
  $$('.nav-links > a, .nav-item > a, .menu a.big').forEach(function (a) {
    var url = new URL(a.href, location.href);
    if (!url.hash && cleanPath(url.pathname) === here) a.setAttribute('aria-current', 'page');
  });

  // Links to a section on this same page scroll there smoothly (works for "#x" and "/page#x")
  $$('a[href*="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var url = new URL(a.href, location.href);
      if (url.origin !== location.origin || cleanPath(url.pathname) !== here) return;
      var hash = url.hash;
      if (hash.length < 2) return;
      if (document.body.classList.contains('menu-open')) setMenu(false);
      preselect(url.searchParams.get('service'));
      if (scrollToTarget(hash)) {
        e.preventDefault();
        if (hash !== '#top' && hash !== '#main') history.replaceState(null, '', hash);
        if (hash === '#main') $('#main').focus({ preventScroll: true });
      }
    });
  });
  if ($('#main')) $('#main').setAttribute('tabindex', '-1');

  // The header stays put; it only changes colour over dark sections, checked once per frame at most
  var darkEls = $$('[data-dark]'), ticking = false;
  function onScroll() {
    ticking = false;
    var probe = 42, dark = false;
    darkEls.forEach(function (el) { var r = el.getBoundingClientRect(); if (r.top <= probe && r.bottom >= probe) dark = true; });
    nav.classList.toggle('on-dark', dark);
    nav.classList.toggle('is-scrolled', window.scrollY > 24);
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });

  /* ------------------------------------------------------------------
     Hero film: shown in place from the first paint (poster), plays only while visible.
     Small screens get the 360p file; reduced motion and data saver keep the still poster.
     ------------------------------------------------------------------ */
  var video = $('.hero-film video');
  var saveData = navigator.connection && navigator.connection.saveData;
  if (video && !reduceMotion && !saveData && 'IntersectionObserver' in window) {
    var base = video.getAttribute('data-film');
    var size = window.matchMedia('(max-width: 767px)').matches ? '-360' : '-720';
    [['webm', 'video/webm; codecs="vp9"'], ['mp4', 'video/mp4']].forEach(function (f) {
      var src = document.createElement('source');
      src.src = base + size + '.' + f[0];
      src.type = f[1];
      video.appendChild(src);
    });
    video.muted = true;
    new IntersectionObserver(function (en) {
      if (en[0].isIntersecting) {
        if (video.preload === 'none') { video.preload = 'auto'; video.load(); }
        var p = video.play(); if (p && p.catch) p.catch(function () {});
      } else video.pause();
    }).observe(video);
  }

  applyLang();
  onScroll();
  root.classList.remove('i18n-pending');
})();
