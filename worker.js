// PawPixl website worker.
// 1) Traveler stats: two tiny endpoints for the home page (totals only, no cookies, no IP addresses stored).
// 2) The Paw Post: email sign-ups (double opt-in), unsubscribe / change topics, and sending updates
//    from PawPixl Studio. Emails go out through Resend (free plan: 100 a day). Needs two secrets on
//    this Worker: RESEND_KEY (from resend.com) and NEWS_KEY (the password PawPixl Studio uses).
let ready = null;
function init(db) {
  if (!ready) ready = db.batch([
    db.prepare('CREATE TABLE IF NOT EXISTS counters (k TEXT PRIMARY KEY, n INTEGER NOT NULL DEFAULT 0)'),
    db.prepare('CREATE TABLE IF NOT EXISTS countries (c TEXT PRIMARY KEY, n INTEGER NOT NULL DEFAULT 0)'),
    db.prepare('CREATE TABLE IF NOT EXISTS subs (email TEXT PRIMARY KEY, topics TEXT NOT NULL DEFAULT \'\', token TEXT NOT NULL, ok INTEGER NOT NULL DEFAULT 0, created TEXT NOT NULL, asked TEXT)'),
    db.prepare('CREATE TABLE IF NOT EXISTS issues (id TEXT PRIMARY KEY, topic TEXT NOT NULL, subject TEXT NOT NULL, body TEXT NOT NULL, created TEXT NOT NULL)'),
    db.prepare('CREATE TABLE IF NOT EXISTS sent (issue TEXT NOT NULL, email TEXT NOT NULL, PRIMARY KEY (issue, email))'),
    db.prepare('CREATE TABLE IF NOT EXISTS sendlog (day TEXT PRIMARY KEY, n INTEGER NOT NULL DEFAULT 0)'),
    db.prepare('CREATE TABLE IF NOT EXISTS wanted (email TEXT PRIMARY KEY, topics TEXT NOT NULL)'),
  ]).catch(e => { ready = null; throw e; });
  return ready;
}
const json = (o, s = 200, extra = {}) => new Response(JSON.stringify(o), { status: s, headers: { 'content-type': 'application/json', ...extra } });
const bump = (db, k) => db.prepare('INSERT INTO counters (k, n) VALUES (?, 1) ON CONFLICT(k) DO UPDATE SET n = n + 1').bind(k);

/* ---------------- The Paw Post ---------------- */
const TOPICS = { schedule: 'Stream schedule', builds: 'New character builds', guides: 'Endgame guides (Abyss, Theater, Stygian)' };
const DAILY = 95;                     // stay under Resend's free 100 a day
const CORS = { 'access-control-allow-origin': '*', 'access-control-allow-headers': 'authorization, content-type', 'access-control-allow-methods': 'GET, POST, OPTIONS' };
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
const today = () => new Date().toISOString().slice(0, 10);
const token = () => { const a = new Uint8Array(18); crypto.getRandomValues(a); return btoa(String.fromCharCode(...a)).replace(/[+/=]/g, c => ({ '+': '-', '/': '_', '=': '' }[c])); };
const cleanTopics = t => [...new Set((Array.isArray(t) ? t : String(t || '').split(',')).map(x => String(x).trim()).filter(x => TOPICS[x]))];
const okEmail = e => /^[^\s@<>()",;:]+@[^\s@<>()",;:]+\.[a-z]{2,}$/i.test(e) && e.length <= 254;
async function siteInfo(env, origin) {
  let s = {};
  try { const r = await env.ASSETS.fetch(new Request(origin + '/content/site.json')); if (r.ok) s = await r.json(); } catch (e) {}
  const n = s.news || {};
  const url = String(s.url || origin).replace(/\/+$/, '');
  let host = 'localhost'; try { host = new URL(url).host.replace(/^www\./, ''); } catch (e) {}
  return { name: s.name || 'PawPixl', url, from: n.from || ((s.name || 'PawPixl') + ' <updates@' + host + '>'), title: n.title || 'The Paw Post', accent: '#18c9a0' };
}
async function used(db) { const r = await db.prepare('SELECT n FROM sendlog WHERE day = ?').bind(today()).first(); return r ? r.n : 0; }
async function note(db, n) { if (n > 0) await db.prepare('INSERT INTO sendlog (day, n) VALUES (?, ?) ON CONFLICT(day) DO UPDATE SET n = n + ?').bind(today(), n, n).run(); }
async function resend(env, path, body) {
  const r = await fetch((env.RESEND_URL || 'https://api.resend.com') + path, { method: 'POST', headers: { authorization: 'Bearer ' + env.RESEND_KEY, 'content-type': 'application/json' }, body: JSON.stringify(body) });
  if (!r.ok) { let m = ''; try { m = (await r.json()).message || ''; } catch (e) {} throw new Error('Resend ' + r.status + (m ? ': ' + m : '')); }
  return r.json();
}
function shell(info, inner, footer) {
  return '<!doctype html><html><body style="margin:0;background:#0b0e1a;font-family:Segoe UI,Arial,sans-serif;color:#eef0f7">'
    + '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0b0e1a"><tr><td align="center" style="padding:24px 12px">'
    + '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#121628;border-radius:16px;border:1px solid #262c45">'
    + '<tr><td style="padding:22px 24px 6px"><a href="' + esc(info.url) + '" style="display:inline-block;background:' + info.accent + ';color:#062019;font-weight:800;letter-spacing:2px;text-decoration:none;border-radius:999px;padding:7px 14px;font-size:13px">' + esc(info.name.toUpperCase()) + '</a>'
    + '<div style="font-size:12px;letter-spacing:2px;color:#8ff5d6;margin-top:14px;font-weight:700">' + esc(info.title.toUpperCase()) + '</div></td></tr>'
    + '<tr><td style="padding:6px 24px 22px;font-size:15px;line-height:1.55">' + inner + '</td></tr>'
    + '<tr><td style="padding:16px 24px 22px;border-top:1px solid #262c45;font-size:12px;line-height:1.5;color:#9aa3bd">' + footer + '</td></tr>'
    + '</table></td></tr></table></body></html>';
}
function issueHtml(info, b, sub) {
  const items = (b.items || []).slice(0, 12).map(it => {
    const u = /^https?:\/\//.test(it.url || '') ? it.url : info.url + (String(it.url || '/').startsWith('/') ? '' : '/') + (it.url || '');
    const img = it.img ? (/^https?:\/\//.test(it.img) ? it.img : info.url + '/' + String(it.img).replace(/^\/+/, '')) : '';
    return '<tr><td style="padding:10px 0"><a href="' + esc(u) + '" style="text-decoration:none;color:#eef0f7"><table role="presentation" cellpadding="0" cellspacing="0" width="100%"><tr>'
      + (img ? '<td width="96" valign="top" style="padding-right:14px"><img src="' + esc(img) + '" width="96" alt="" style="display:block;border-radius:10px;border:1px solid #262c45"></td>' : '')
      + '<td valign="middle"><div style="font-size:16px;font-weight:700">' + esc(it.title || 'See it on the site') + '</div>' + (it.note ? '<div style="font-size:13px;color:#9aa3bd;margin-top:3px">' + esc(it.note) + '</div>' : '')
      + '<div style="font-size:13px;color:#8ff5d6;margin-top:6px;font-weight:700">Open &rarr;</div></td></tr></table></a></td></tr>';
  }).join('');
  const inner = '<h1 style="font-size:22px;margin:4px 0 10px;line-height:1.25">' + esc(b.subject) + '</h1>'
    + (b.intro ? '<p style="margin:0 0 12px;white-space:pre-line">' + esc(b.intro) + '</p>' : '')
    + (items ? '<table role="presentation" width="100%" cellpadding="0" cellspacing="0">' + items + '</table>' : '')
    + '<p style="margin:18px 0 0"><a href="' + esc(info.url) + '" style="display:inline-block;background:' + info.accent + ';color:#062019;font-weight:800;text-decoration:none;border-radius:10px;padding:11px 18px">Visit ' + esc(info.name) + '</a></p>';
  const m = info.url + '/api/news/manage?t=' + encodeURIComponent(sub.token);
  const footer = 'You get this because you signed up for ' + esc(TOPICS[b.topic] || 'updates') + ' at ' + esc(info.url.replace(/^https?:\/\//, '')) + '.<br>'
    + '<a href="' + esc(m) + '" style="color:#8ff5d6">Change what you get</a> &middot; <a href="' + esc(m + '&u=1') + '" style="color:#8ff5d6">Unsubscribe</a>';
  return shell(info, inner, footer);
}
function page(info, title, body) {
  return new Response('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + esc(title) + ' · ' + esc(info.name) + '</title><meta name="robots" content="noindex">'
    + '<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#080a14;color:#eef0f7;font:16px/1.5 Poppins,Segoe UI,system-ui,sans-serif;padding:16px}.c{max-width:460px;width:100%;background:#121628;border:1px solid #262c45;border-radius:18px;padding:26px}h1{font-size:22px;margin:0 0 8px}a{color:#8ff5d6}label{display:flex;gap:10px;align-items:center;margin:10px 0}button{margin-top:14px;background:#18c9a0;color:#062019;border:0;border-radius:10px;padding:11px 18px;font-weight:800;font-size:15px;cursor:pointer}.m{color:#9aa3bd;font-size:13px}</style></head>'
    + '<body><div class="c">' + body + '</div></body></html>', { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } });
}
async function sendConfirm(env, info, email, tok, topics) {
  const link = info.url + '/api/news/confirm?t=' + encodeURIComponent(tok);
  const inner = '<h1 style="font-size:22px;margin:4px 0 10px">Confirm your sign-up</h1><p style="margin:0 0 14px">Tap the button to start getting: <b>' + esc(topics.map(t => TOPICS[t]).join(', ')) + '</b>.</p>'
    + '<p><a href="' + esc(link) + '" style="display:inline-block;background:' + info.accent + ';color:#062019;font-weight:800;text-decoration:none;border-radius:10px;padding:11px 18px">Yes, sign me up</a></p>';
  await resend(env, '/emails', { from: info.from, to: [email], subject: 'Confirm your ' + info.title + ' sign-up', html: shell(info, inner, 'If you didn’t ask for this, just ignore this email and nothing will happen.') });
}
async function pump(env, info, issueId) {
  const db = env.DB;
  const is = await db.prepare('SELECT * FROM issues WHERE id = ?').bind(issueId).first();
  if (!is) return { sent: 0, pending: 0, error: 'not found' };
  const b = JSON.parse(is.body);
  const room = Math.max(0, DAILY - await used(db));
  const like = '%,' + is.topic + ',%';
  // only people who signed up before this update was written get it
  const pendingQ = 'FROM subs WHERE ok = 1 AND created <= ? AND (\',\' || topics || \',\') LIKE ? AND email NOT IN (SELECT email FROM sent WHERE issue = ?)';
  const total = (await db.prepare('SELECT COUNT(*) AS n ' + pendingQ).bind(is.created, like, issueId).first()).n;
  if (!room || !total) return { sent: 0, pending: total, limited: !room && total > 0 };
  const rows = (await db.prepare('SELECT email, token ' + pendingQ + ' LIMIT ?').bind(is.created, like, issueId, Math.min(room, 100)).all()).results;
  const batch = rows.map(s => {
    const m = info.url + '/api/news/manage?t=' + encodeURIComponent(s.token);
    return { from: info.from, to: [s.email], subject: b.subject, html: issueHtml(info, Object.assign({ topic: is.topic }, b), s),
      headers: { 'List-Unsubscribe': '<' + m + '&u=1>', 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' } };
  });
  await resend(env, '/emails/batch', batch);
  await db.batch(rows.map(s => db.prepare('INSERT OR IGNORE INTO sent (issue, email) VALUES (?, ?)').bind(issueId, s.email)));
  await note(db, rows.length);
  return { sent: rows.length, pending: total - rows.length, limited: total - rows.length > 0 };
}
function authed(req, env) { const h = req.headers.get('authorization') || ''; return !!env.NEWS_KEY && h === 'Bearer ' + env.NEWS_KEY; }
async function news(req, env, url, ctx) {
  const p = url.pathname.slice('/api/news/'.length), db = env.DB;
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  if (!db) return json({ ok: false, error: 'no-database' }, 503, CORS);
  await init(db);
  const info = await siteInfo(env, url.origin);

  if (p === 'subscribe') {
    if (req.method !== 'POST') return json({ ok: false }, 405);
    const origin = req.headers.get('origin');
    if (origin && new URL(origin).host !== url.host) return json({ ok: false }, 403);
    let b = {}; try { b = JSON.parse((await req.text()).slice(0, 2000)); } catch (e) {}
    if (b.website) return json({ ok: true });                       // filled-in hidden field = bot
    const email = String(b.email || '').trim().toLowerCase(), topics = cleanTopics(b.topics);
    if (!okEmail(email)) return json({ ok: false, error: 'email' }, 400);
    if (!topics.length) return json({ ok: false, error: 'topics' }, 400);
    if (!env.RESEND_KEY) return json({ ok: false, error: 'not-ready' }, 503);
    const cur = await db.prepare('SELECT * FROM subs WHERE email = ?').bind(email).first();
    if (cur && cur.asked && Date.now() - Date.parse(cur.asked) < 10 * 60e3) return json({ ok: true });  // one confirmation email per 10 minutes
    if ((await used(db)) >= DAILY + 4) return json({ ok: false, error: 'busy' }, 503);
    const tok = cur ? cur.token : token(), now = new Date().toISOString();
    // a new person starts unconfirmed; someone already confirmed keeps their topics until they confirm the new choice
    await db.prepare('INSERT INTO subs (email, topics, token, ok, created, asked) VALUES (?, ?, ?, 0, ?, ?) ON CONFLICT(email) DO UPDATE SET asked = excluded.asked, topics = CASE WHEN subs.ok = 1 THEN subs.topics ELSE excluded.topics END')
      .bind(email, topics.join(','), tok, now, now).run();
    await db.prepare('INSERT INTO wanted (email, topics) VALUES (?, ?) ON CONFLICT(email) DO UPDATE SET topics = excluded.topics').bind(email, topics.join(',')).run();
    try { await sendConfirm(env, info, email, tok, topics); await note(db, 1); } catch (e) { return json({ ok: false, error: 'send' }, 502); }
    return json({ ok: true });
  }
  if (p === 'confirm') {
    const t = url.searchParams.get('t') || '';
    const s = t && await db.prepare('SELECT * FROM subs WHERE token = ?').bind(t).first();
    if (!s) return page(info, 'Link expired', '<h1>That link didn’t work</h1><p>It may be old. Sign up again on <a href="' + esc(info.url) + '">' + esc(info.name) + '</a>.</p>');
    let topics = s.topics;
    const w = await db.prepare('SELECT topics FROM wanted WHERE email = ?').bind(s.email).first(); if (w) topics = w.topics;
    await db.prepare('UPDATE subs SET ok = 1, topics = ? WHERE email = ?').bind(topics, s.email).run();
    await db.prepare('DELETE FROM wanted WHERE email = ?').bind(s.email).run();
    return page(info, 'You’re in', '<h1>You’re signed up!</h1><p>You’ll get: <b>' + esc(cleanTopics(topics).map(x => TOPICS[x]).join(', ')) + '</b>.</p><p class="m"><a href="' + esc(info.url + '/api/news/manage?t=' + encodeURIComponent(s.token)) + '">Change this any time</a> &middot; <a href="' + esc(info.url) + '">Back to ' + esc(info.name) + '</a></p>');
  }
  if (p === 'manage') {
    const t = url.searchParams.get('t') || '';
    const s = t && await db.prepare('SELECT * FROM subs WHERE token = ?').bind(t).first();
    if (!s) return page(info, 'Not found', '<h1>You’re not on the list</h1><p>Nothing to change. <a href="' + esc(info.url) + '">Back to ' + esc(info.name) + '</a></p>');
    if (url.searchParams.get('u') === '1' && (req.method === 'POST' || url.searchParams.get('go') === '1')) {
      await db.batch([db.prepare('DELETE FROM subs WHERE email = ?').bind(s.email), db.prepare('DELETE FROM sent WHERE email = ?').bind(s.email)]);
      if (req.method === 'POST' && !req.headers.get('content-type')?.includes('form')) return new Response('ok');   // one-click unsubscribe from the mail app
      return page(info, 'Unsubscribed', '<h1>You’re unsubscribed</h1><p>You won’t get any more emails. Changed your mind? Sign up again on <a href="' + esc(info.url) + '">' + esc(info.name) + '</a>.</p>');
    }
    if (url.searchParams.get('u') === '1') return page(info, 'Unsubscribe', '<h1>Unsubscribe?</h1><p>' + esc(s.email) + ' will stop getting ' + esc(info.title) + ' emails.</p><form method="post" action="?t=' + esc(encodeURIComponent(t)) + '&u=1&go=1"><button>Unsubscribe</button></form><p class="m"><a href="?t=' + esc(encodeURIComponent(t)) + '">Just change topics instead</a></p>');
    if (req.method === 'POST') {
      const f = await req.formData(), topics = cleanTopics(f.getAll('topic'));
      if (!topics.length) { await db.prepare('DELETE FROM subs WHERE email = ?').bind(s.email).run(); return page(info, 'Unsubscribed', '<h1>You’re unsubscribed</h1><p>No topics were ticked, so you won’t get any more emails.</p>'); }
      await db.prepare('UPDATE subs SET topics = ?, ok = 1 WHERE email = ?').bind(topics.join(','), s.email).run();
      return page(info, 'Saved', '<h1>Saved</h1><p>You’ll get: <b>' + esc(topics.map(x => TOPICS[x]).join(', ')) + '</b>.</p><p class="m"><a href="' + esc(info.url) + '">Back to ' + esc(info.name) + '</a></p>');
    }
    const have = cleanTopics(s.topics);
    return page(info, 'Your emails', '<h1>' + esc(info.title) + '</h1><p class="m">' + esc(s.email) + '</p><form method="post">'
      + Object.entries(TOPICS).map(([k, v]) => '<label><input type="checkbox" name="topic" value="' + k + '"' + (have.includes(k) ? ' checked' : '') + '> ' + esc(v) + '</label>').join('')
      + '<button>Save</button></form><p class="m"><a href="?t=' + esc(encodeURIComponent(t)) + '&u=1">Unsubscribe from everything</a></p>');
  }

  /* ---- PawPixl Studio only (password in the Authorization header) ---- */
  if (!authed(req, env)) return json({ ok: false, error: env.NEWS_KEY ? 'password' : 'no-password' }, 401, CORS);
  if (p === 'stats') {
    const all = (await db.prepare('SELECT topics FROM subs WHERE ok = 1').all()).results;
    const by = {}; Object.keys(TOPICS).forEach(k => by[k] = all.filter(r => (',' + r.topics + ',').includes(',' + k + ',')).length);
    const pend = (await db.prepare('SELECT COUNT(*) AS n FROM subs WHERE ok = 0').first()).n;
    const last = (await db.prepare('SELECT id, topic, subject, created FROM issues ORDER BY created DESC LIMIT 5').all()).results;
    return json({ ok: true, total: all.length, unconfirmed: pend, topics: by, today: await used(db), daily: DAILY, mail: !!env.RESEND_KEY, from: info.from, issues: last }, 200, CORS);
  }
  if (p === 'preview') {
    let b = {}; try { b = await req.json(); } catch (e) {}
    return new Response(issueHtml(info, b, { token: 'preview' }), { headers: { 'content-type': 'text/html; charset=utf-8', ...CORS } });
  }
  if (p === 'send') {
    if (req.method !== 'POST') return json({ ok: false }, 405, CORS);
    if (!env.RESEND_KEY) return json({ ok: false, error: 'no-resend' }, 503, CORS);
    let b = {}; try { b = await req.json(); } catch (e) {}
    let id = String(b.issue || '');
    if (!id) {
      if (!TOPICS[b.topic] || !String(b.subject || '').trim()) return json({ ok: false, error: 'missing' }, 400, CORS);
      id = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14) + '-' + b.topic + '-' + token().slice(0, 4);
      const body = { subject: String(b.subject).slice(0, 150), intro: String(b.intro || '').slice(0, 3000), items: (Array.isArray(b.items) ? b.items : []).slice(0, 12).map(x => ({ title: String(x.title || '').slice(0, 120), note: String(x.note || '').slice(0, 200), url: String(x.url || ''), img: String(x.img || '') })) };
      await db.prepare('INSERT INTO issues (id, topic, subject, body, created) VALUES (?, ?, ?, ?, ?)').bind(id, b.topic, body.subject, JSON.stringify(body), new Date().toISOString()).run();
    }
    try { const r = await pump(env, info, id); return json(Object.assign({ ok: true, issue: id }, r), 200, CORS); }
    catch (e) { return json({ ok: false, issue: id, error: String(e.message || e) }, 502, CORS); }
  }
  return json({ ok: false }, 404, CORS);
}

export default {
  async fetch(req, env, ctx) {
    const url = new URL(req.url);
    if (url.pathname.startsWith('/api/news/')) {
      try { return await news(req, env, url, ctx); } catch (e) { return json({ ok: false, error: 'server' }, 500, CORS); }
    }
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
  // once a day, keep sending any update that hit the daily limit
  async scheduled(event, env, ctx) {
    if (!env.DB || !env.RESEND_KEY) return;
    await init(env.DB);
    const since = new Date(Date.now() - 7 * 864e5).toISOString();   // keep catching up for a week at most
    const open = (await env.DB.prepare('SELECT id FROM issues WHERE created > ? ORDER BY created ASC').bind(since).all()).results;
    for (const r of open) {
      const info = await siteInfo(env, 'https://localhost');
      const out = await pump(env, info, r.id).catch(() => ({ limited: true }));
      if (out.limited) break;
    }
  },
};
