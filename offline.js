/* The offline page: lists the guide pages saved on this device, and reloads by itself when the connection returns. */
(function () {
  'use strict';
  var NAMES = { builds: 'build', abyss: 'Spiral Abyss', stygian: 'Stygian Onslaught', theatre: 'Imaginarium Theater', schedule: 'Stream schedule' };
  function label(path) {
    var p = path.split('/').filter(Boolean);
    if (!p.length) return 'Home';
    if (p[1] === 'builds' && p[2]) return decodeURIComponent(p[2]).replace(/-/g, ' ').replace(/\b[a-z]/g, function (c) { return c.toUpperCase(); }) + ' build';
    if (p[1] === 'builds') return 'All character builds';
    if (NAMES[p[1]]) return NAMES[p[1]] + (p[2] ? ' guide' : '');
    return decodeURIComponent(p[p.length - 1]).replace(/-/g, ' ').replace(/\b[a-z]/g, function (c) { return c.toUpperCase(); });
  }
  function list() {
    if (!window.caches) return;
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k.indexOf('pp-pages-') === 0; }).map(function (k) { return caches.open(k).then(function (c) { return c.keys(); }); }));
    }).then(function (sets) {
      var seen = {}, out = [];
      sets.forEach(function (reqs) { reqs.forEach(function (r) { var u = new URL(r.url); if (u.origin !== location.origin || seen[u.pathname] || /^\/(account|offline)/.test(u.pathname)) return; seen[u.pathname] = 1; out.push(u.pathname); }); });
      out.reverse();
      if (!out.length) return;
      var ul = document.getElementById('savedlist');
      out.slice(0, 24).forEach(function (p) { var li = document.createElement('li'), a = document.createElement('a'); a.href = p; a.textContent = label(p); li.appendChild(a); ul.appendChild(li); });
      document.getElementById('saved').hidden = false;
    }).catch(function () {});
  }
  list();
  var retry = document.getElementById('retry');
  if (retry) retry.addEventListener('click', function (e) { e.preventDefault(); location.reload(); });
  window.addEventListener('online', function () { location.reload(); });
  /* some devices never announce that the connection is back, so ask quietly now and then (an address the offline
     worker never answers itself: any reply at all means the network is there) */
  var tries = 0;
  (function ping() {
    if (++tries > 40) return;
    setTimeout(function () {
      fetch('/api/ping', { cache: 'no-store' }).then(function () { location.reload(); }, ping);
    }, Math.min(30000, 4000 + tries * 1500));
  })();
})();
