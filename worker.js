// PawPixl website: serves the site files, plus two tiny endpoints for the home page's traveler stats.
// Counts only totals (new visitors, guide views, visitor countries). No cookies, no IP addresses stored.
let ready = null;
function init(db) {
  if (!ready) ready = db.batch([
    db.prepare('CREATE TABLE IF NOT EXISTS counters (k TEXT PRIMARY KEY, n INTEGER NOT NULL DEFAULT 0)'),
    db.prepare('CREATE TABLE IF NOT EXISTS countries (c TEXT PRIMARY KEY, n INTEGER NOT NULL DEFAULT 0)'),
  ]).catch(e => { ready = null; throw e; });
  return ready;
}
const json = (o, s = 200, extra = {}) => new Response(JSON.stringify(o), { status: s, headers: { 'content-type': 'application/json', ...extra } });
const bump = (db, k) => db.prepare('INSERT INTO counters (k, n) VALUES (?, 1) ON CONFLICT(k) DO UPDATE SET n = n + 1').bind(k);

export default {
  async fetch(req, env, ctx) {
    const url = new URL(req.url);
    if (url.pathname === '/api/hit') {
      if (req.method !== 'POST' || !env.DB) return json({ ok: false }, 405);
      const origin = req.headers.get('origin');
      if (origin && new URL(origin).host !== url.host) return json({ ok: false }, 403);
      let b = {};
      try { b = JSON.parse((await req.text()).slice(0, 200)); } catch (e) {}
      const ua = req.headers.get('user-agent') || '';
      if (/bot|crawl|spider|slurp|preview|headless/i.test(ua)) return json({ ok: true });
      try {
        await init(env.DB);
        const q = [];
        if (b.v) {
          q.push(bump(env.DB, 'travelers'));
          const c = (req.cf && req.cf.country) || '';
          if (/^[A-Z]{2}$/.test(c) && c !== 'XX' && c !== 'T1')
            q.push(env.DB.prepare('INSERT INTO countries (c, n) VALUES (?, 1) ON CONFLICT(c) DO UPDATE SET n = n + 1').bind(c));
        }
        if (b.g) q.push(bump(env.DB, 'views'));
        if (q.length) await env.DB.batch(q);
      } catch (e) { return json({ ok: false }, 500); }
      return json({ ok: true });
    }
    if (url.pathname === '/api/stats') {
      if (!env.DB) return json({ travelers: 0, views: 0, nations: 0 });
      const cache = caches.default, key = new Request(url.origin + '/api/stats');
      const hit = await cache.match(key);
      if (hit) return hit;
      let out = { travelers: 0, views: 0, nations: 0 };
      try {
        await init(env.DB);
        const [a, b] = await env.DB.batch([
          env.DB.prepare('SELECT k, n FROM counters'),
          env.DB.prepare('SELECT COUNT(*) AS n FROM countries'),
        ]);
        for (const r of a.results) out[r.k] = r.n;
        out.nations = (b.results[0] || {}).n || 0;
      } catch (e) {}
      const res = json(out, 200, { 'cache-control': 'public, max-age=300' });
      ctx.waitUntil(cache.put(key, res.clone()));
      return res;
    }
    return env.ASSETS.fetch(req);
  },
};
