/* PawPixl service worker: makes the site installable and keeps it usable with no signal.

   The one rule that matters: an installed PawPixl must never get stuck on old guides. So whenever there is a
   connection, pages, scripts, styles and guide data ALWAYS come from the network first, exactly as they do without
   this file. The saved copies below are only used when the network does not answer.

   - pages, app.js, app.css, /content/*.json ... network first, saved copy only when offline
   - fonts, icons, vendor libraries ............ saved copy first (these files never change under the same name)
   - guide images under /content/ .............. saved copy shown at once, refreshed in the background
   - /api/*, /owner/*, other websites, uploads . never touched

   SWV is replaced with the website version when PawPixl Studio packages the site, so every website update also
   clears out the previous version's saved files. */
const SWV = '2026.11.21-73f76';
/* Only the site's own code is tied to the website version. Saved pages, guide data and pictures keep their place
   across website updates, so a new release never empties what someone saved for offline reading. (They are
   always refreshed from the network when there is one, so they cannot go stale.) */
const C_STATIC = 'pp-static-' + SWV, C_PAGES = 'pp-pages-v1', C_DATA = 'pp-data-v1', C_IMG = 'pp-img-v1';
const KEEP = new Set([C_STATIC, C_PAGES, C_DATA, C_IMG]);
const MAX_PAGES = 60, MAX_IMG = 220, MAX_DATA = 260;
/* '/offline' (no .html): Cloudflare serves the file at that address without a redirect */
const SHELL = ['/offline', '/offline.js', '/app.css', '/favicon.png', '/icons/icon-192.png',
  '/fonts/anton-latin-400-normal.woff2', '/fonts/poppins-latin-400-normal.woff2', '/fonts/poppins-latin-600-normal.woff2',
  '/fonts/poppins-latin-700-normal.woff2', '/fonts/poppins-latin-800-normal.woff2'];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(C_STATIC);
    /* one missing file must not stop the install */
    await Promise.all(SHELL.map(u => fetch(u, { cache: 'reload' }).then(r => { if (r.ok) return clean(r).then(x => c.put(u, x)); }).catch(() => {})));
    /* the app itself, so the very first visit already leaves a working offline copy (taken from the browser's own cache: no second download) */
    await Promise.all(['/app.js', '/evtext.js', '/endgame.js', '/create.js'].map(u => fetch(u).then(r => { if (r.ok) return clean(r).then(x => c.put(u, x)); }).catch(() => {})));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) {
      if (!k.startsWith('pp-') || KEEP.has(k)) continue;
      /* the first version kept pages and guide data in per-version boxes: move them over before clearing those out */
      const to = k.startsWith('pp-pages-') ? C_PAGES : k.startsWith('pp-data-') ? C_DATA : '';
      if (to) { try { const from = await caches.open(k), dest = await caches.open(to); for (const req of await from.keys()) { if (!(await dest.match(req))) { const r = await from.match(req); if (r) await dest.put(req, r); } } } catch (err) {} }
      await caches.delete(k);
    }
    if (self.registration.navigationPreload) { try { await self.registration.navigationPreload.enable(); } catch (err) {} }
    await self.clients.claim();
  })());
});

const okToSave = r => r && r.status === 200 && r.type === 'basic';
/* a response that arrived through a redirect cannot be replayed for a page load, so copy it into a plain one */
async function clean(r) {
  if (!r.redirected) return r;
  const h = new Headers(r.headers);
  return new Response(await r.blob(), { status: r.status, statusText: r.statusText, headers: h });
}
async function trim(name, max) {
  try { const c = await caches.open(name), keys = await c.keys(); for (let i = 0; i < keys.length - max; i++) await c.delete(keys[i]); } catch (e) {}
}
async function save(name, req, res, max) {
  try { const c = await caches.open(name); await c.delete(req); await c.put(req, res); if (max && Math.random() < 0.15) trim(name, max); } catch (e) {}
}
const isImg = p => /\.(webp|png|jpe?g|gif|avif|svg)$/i.test(p);
/* the same address with any ?v= removed, so a saved copy is found whichever version asked for it */
const bare = u => { const x = new URL(u); return x.origin + x.pathname; };

async function pageFirst(e) {
  const req = e.request, key = bare(req.url);
  try {
    const pre = e.preloadResponse ? await e.preloadResponse : null;
    const res = pre || await fetch(req);
    if (okToSave(res)) e.waitUntil(clean(res.clone()).then(x => save(C_PAGES, key, x, MAX_PAGES)));
    return res;
  } catch (err) {
    const pages = await caches.open(C_PAGES);
    /* this exact page if it was opened before, else the home page (the app then shows what it has saved), else a plain notice */
    return (await pages.match(key)) || (await pages.match(new URL('/', req.url).href)) || (await caches.match('/offline')) ||
      new Response('<!doctype html><meta charset="utf-8"><title>Offline</title><p>You are offline.</p>', { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }
}
async function netFirst(e, name, max) {
  const req = e.request, key = bare(req.url);
  try {
    const res = await fetch(req);
    if (okToSave(res)) e.waitUntil(save(name, key, res.clone(), max));
    return res;
  } catch (err) {
    const hit = await (await caches.open(name)).match(key);
    if (hit) return hit;
    throw err;
  }
}
async function cacheFirst(e, name) {
  const req = e.request, c = await caches.open(name), hit = await c.match(req.url);
  if (hit) return hit;
  const res = await fetch(req);
  if (okToSave(res)) e.waitUntil(save(name, req.url, res.clone(), 0));
  return res;
}
async function staleRefresh(e, name, max) {
  const req = e.request, c = await caches.open(name), hit = await c.match(req.url);
  const fresh = fetch(req).then(res => { if (okToSave(res)) return save(name, req.url, res.clone(), max).then(() => res); return res; });
  if (hit) { e.waitUntil(fresh.catch(() => {})); return hit; }
  return fresh;
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  let u; try { u = new URL(req.url); } catch (err) { return; }
  if (u.origin !== self.location.origin) return;                       /* accounts, analytics, anything not ours */
  const p = u.pathname;
  if (p.startsWith('/api/') || p.startsWith('/owner') || p.startsWith('/cdn-cgi/') || p === '/sw.js') return;
  if (req.headers.has('range')) return;                                 /* audio and video ask for pieces */
  if (/\.(mp3|ogg|wav|m4a|mp4|webm|zip)$/i.test(p)) return;
  if (req.mode === 'navigate') { e.respondWith(pageFirst(e)); return; }
  if (p.startsWith('/fonts/') || p.startsWith('/icons/') || p.startsWith('/vendor/')) { e.respondWith(cacheFirst(e, C_STATIC)); return; }
  if (p.startsWith('/content/') && isImg(p)) { e.respondWith(staleRefresh(e, C_IMG, MAX_IMG)); return; }
  if (p.startsWith('/content/')) { e.respondWith(netFirst(e, C_DATA, MAX_DATA)); return; }
  e.respondWith(netFirst(e, C_STATIC, 0));                              /* app.js, app.css and the other site files */
});

self.addEventListener('message', e => { if (e.data === 'pp-skip') self.skipWaiting(); });
