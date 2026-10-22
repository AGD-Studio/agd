/* AGD Studio — runs in <head> before first paint so the right language shows from the start. */
(function () {
  var d = document.documentElement;
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
