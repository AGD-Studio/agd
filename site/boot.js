/* AGD Studio — runs in <head> before first paint.
   Decides early: loader once per session (home only), skip it when motion is reduced, and pick the language. */
(function () {
  var d = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var seen = false;
  try { seen = sessionStorage.getItem('gd-intro') === '1'; sessionStorage.setItem('gd-intro', '1'); } catch (e) {}
  if (reduce || seen) d.classList.add('no-loader');
  // Language: saved choice, otherwise the browser's language
  var lang = null;
  try { lang = localStorage.getItem('gd-lang'); } catch (e) {}
  if (lang !== 'es' && lang !== 'en') lang = /^es\b/i.test(navigator.language || '') ? 'es' : 'en';
  d.setAttribute('data-lang', lang);
  if (lang === 'es') {
    d.lang = 'es';
    d.classList.add('i18n-pending');
    setTimeout(function () { d.classList.remove('i18n-pending'); }, 3000);
  }
})();
