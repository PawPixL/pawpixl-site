// PawPixl website worker.
// 1) Traveler stats: two tiny endpoints for the home page (totals only, no cookies, no IP addresses stored).
// 4) Visitor insights: daily totals only (country, region, language, device, browser, where people came from,
//    which pages, what hour in Eastern time). No cookies, no IP addresses, nothing that identifies a person.
// 3) Guide feedback: visitors can send a comment, question or correction from any guide page; only
//    PawPixl Studio (with the NEWS_KEY password) can read them.
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
    db.prepare('CREATE TABLE IF NOT EXISTS notes (id TEXT PRIMARY KEY, created TEXT NOT NULL, page TEXT NOT NULL, title TEXT NOT NULL DEFAULT \'\', kind TEXT NOT NULL, msg TEXT NOT NULL, contact TEXT NOT NULL DEFAULT \'\', done INTEGER NOT NULL DEFAULT 0)'),
    db.prepare('CREATE TABLE IF NOT EXISTS noterate (k TEXT PRIMARY KEY, n INTEGER NOT NULL DEFAULT 0, t TEXT NOT NULL)'),
    db.prepare('CREATE TABLE IF NOT EXISTS ins (d TEXT NOT NULL, k TEXT NOT NULL, v TEXT NOT NULL, n INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (d, k, v))'),
  ]).catch(e => { ready = null; throw e; });
  return ready;
}
/* ---------------- Visitor insights (totals per day, nothing personal) ---------------- */
const nyDay = (t) => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' }).format(t == null ? new Date() : new Date(t));
const nyHour = () => +new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', hour: 'numeric', hourCycle: 'h23' }).format(new Date()) % 24;
function uaBits(ua) {
  const device = /iPad|Tablet|Android(?!.*Mobile)/i.test(ua) ? 'Tablet' : /Mobi|iPhone|iPod|Android/i.test(ua) ? 'Phone' : 'Computer';
  const os = /iPhone|iPad|iPod/i.test(ua) ? 'iOS / iPadOS' : /Android/i.test(ua) ? 'Android' : /Windows/i.test(ua) ? 'Windows' : /CrOS/i.test(ua) ? 'ChromeOS' : /Mac OS X|Macintosh/i.test(ua) ? 'macOS' : /Linux/i.test(ua) ? 'Linux' : 'Other';
  const app = /musical_ly|BytedanceWebview|TikTok/i.test(ua) ? 'TikTok app' : /Instagram/i.test(ua) ? 'Instagram app' : /FBAN|FBAV/i.test(ua) ? 'Facebook app' : /Discord/i.test(ua) ? 'Discord app' : '';
  const browser = app || (/Edg\//.test(ua) ? 'Edge' : /OPR\/|Opera/.test(ua) ? 'Opera' : /SamsungBrowser/.test(ua) ? 'Samsung Internet' : /Firefox|FxiOS/.test(ua) ? 'Firefox' : /Chrome|CriOS/.test(ua) ? 'Chrome' : /Safari/.test(ua) ? 'Safari' : 'Other');
  return { device, os, browser, app };
}
function sourceOf(ref, app, host) {
  const h = String(ref || '').toLowerCase().replace(/^www\./, '');
  if (h && host && h === host.replace(/^www\./, '')) return '';
  if (/tiktok/.test(h) || (!h && app === 'TikTok app')) return 'TikTok';
  if (/youtube|youtu\.be/.test(h)) return 'YouTube';
  if (/twitch/.test(h)) return 'Twitch';
  if (/instagram/.test(h) || (!h && app === 'Instagram app')) return 'Instagram';
  if (/discord/.test(h) || (!h && app === 'Discord app')) return 'Discord';
  if (/(^|\.)google\./.test(h)) return 'Google';
  if (/bing\.com/.test(h)) return 'Bing';
  if (/duckduckgo/.test(h)) return 'DuckDuckGo';
  if (/facebook|fb\.com/.test(h) || (!h && app === 'Facebook app')) return 'Facebook';
  if (/(^|\.)(x|twitter)\.com$|t\.co$/.test(h)) return 'X / Twitter';
  if (/reddit/.test(h)) return 'Reddit';
  if (!h) return 'Direct or unknown';
  return h.slice(0, 60);
}
async function insight(db, req, b, url) {
  const d = nyDay(), q = [], add = (k, v) => { v = String(v == null ? '' : v).slice(0, 120); if (v !== '') q.push(db.prepare('INSERT INTO ins (d, k, v, n) VALUES (?, ?, ?, 1) ON CONFLICT(d, k, v) DO UPDATE SET n = n + 1').bind(d, k, v)) };
  const cf = req.cf || {}, ua = req.headers.get('user-agent') || '', u = uaBits(ua);
  const page0 = String(b.p || '').split('?')[0].replace(/[^\w\-\/%.]/g, '').slice(0, 120), page = page0[0] === '/' ? page0 : '';
  if (page) { add('views', 'all'); add('page', page) }
  // PawPixl Arena: which steps people reach (fixed list of names, nothing personal)
  if (/^(open|start|done|results|share|share:(kit|cons|rot)|guide|kit|razor|cmp|easy|g2a|practice|practice:done|char:[a-z0-9]{1,30}|rot:[a-z0-9][a-z0-9-]{2,79}|inv:(f2p|mid|high))$/.test(String(b.a || ''))) add('arena', b.a);
  if (b.s) {
    const c = /^[A-Z]{2}$/.test(cf.country || '') && cf.country !== 'XX' && cf.country !== 'T1' ? cf.country : '';
    add('visits', 'all'); add('country', c || '??'); if (c && cf.region) add('region', c + '|' + String(cf.region).slice(0, 60));
    add('device', u.device); add('os', u.os); add('browser', u.browser);
    add('lang', /^[a-z]{2}$/.test(b.l || '') ? b.l : 'en');
    const bl = (req.headers.get('accept-language') || '').split(',')[0].trim().slice(0, 12); if (/^[A-Za-z]{2,3}(-[A-Za-z0-9]{2,4})?$/.test(bl)) add('blang', bl.toLowerCase());
    const src = sourceOf(b.r, u.app, url.host); if (src) add('source', src);
    add('who', b.v ? 'New' : 'Returning'); add('hour', String(nyHour()));
  }
  if (Math.random() < 0.01) { const old = new Date(Date.now() - 400 * 864e5).toISOString().slice(0, 10); q.push(db.prepare('DELETE FROM ins WHERE d < ?').bind(old)) }
  return q;
}
/* same-site check that never throws: a missing Origin is allowed (same-origin GET/POST from older browsers), anything else must match */
const sameSite = (req, url) => { const o = req.headers.get('origin'); if (!o) return true; try { return new URL(o).host === url.host; } catch (e) { return false; } };
/* compare secrets without leaking how many leading characters matched */
async function safeEq(a, b) { const enc = new TextEncoder(); const [x, y] = await Promise.all([crypto.subtle.digest('SHA-256', enc.encode(String(a))), crypto.subtle.digest('SHA-256', enc.encode(String(b)))]); const u = new Uint8Array(x), v = new Uint8Array(y); let d = 0; for (let i = 0; i < u.length; i++) d |= u[i] ^ v[i]; return d === 0; }
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
async function authed(req, env) { const h = req.headers.get('authorization') || ''; return !!env.NEWS_KEY && await safeEq(h, 'Bearer ' + env.NEWS_KEY); }
async function news(req, env, url, ctx) {
  const p = url.pathname.slice('/api/news/'.length), db = env.DB;
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  if (!db) return json({ ok: false, error: 'no-database' }, 503, CORS);
  await init(db);
  const info = await siteInfo(env, url.origin);

  if (p === 'subscribe') {
    if (req.method !== 'POST') return json({ ok: false }, 405);
    if (!sameSite(req, url)) return json({ ok: false }, 403);
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
  if (!(await authed(req, env))) return json({ ok: false, error: env.NEWS_KEY ? 'password' : 'no-password' }, 401, CORS);
  if (p.startsWith('seo/')) return seoApi(p.slice(4), req, env, url, db, ctx);
  if (p === 'stats') {
    const all = (await db.prepare('SELECT topics FROM subs WHERE ok = 1').all()).results;
    const by = {}; Object.keys(TOPICS).forEach(k => by[k] = all.filter(r => (',' + r.topics + ',').includes(',' + k + ',')).length);
    const pend = (await db.prepare('SELECT COUNT(*) AS n FROM subs WHERE ok = 0').first()).n;
    const last = (await db.prepare('SELECT id, topic, subject, created FROM issues ORDER BY created DESC LIMIT 5').all()).results;
    return json({ ok: true, total: all.length, unconfirmed: pend, topics: by, today: await used(db), daily: DAILY, mail: !!env.RESEND_KEY, from: info.from, issues: last }, 200, CORS);
  }
  if (p === 'insights') {
    const days = Math.max(1, Math.min(400, +url.searchParams.get('days') || 30));
    /* visits are saved under Eastern-time days, so the range starts on an Eastern-time day too (UTC is a day ahead every evening) */
    const since = nyDay(Date.now() - (days - 1) * 864e5);
    const [tot, daily, first, allc, cnt] = await db.batch([
      db.prepare('SELECT k, v, SUM(n) AS n FROM ins WHERE d >= ? GROUP BY k, v').bind(since),
      db.prepare("SELECT d, k, SUM(n) AS n FROM ins WHERE d >= ? AND k IN ('visits', 'views') GROUP BY d, k ORDER BY d").bind(since),
      db.prepare('SELECT MIN(d) AS d FROM ins'),
      db.prepare('SELECT c, n FROM countries'),
      db.prepare('SELECT k, n FROM counters'),
    ]);
    const allTime = { countries: {}, totals: {} }; for (const r of allc.results) allTime.countries[r.c] = r.n; for (const r of cnt.results) allTime.totals[r.k] = r.n;
    const by = {}; for (const r of tot.results) (by[r.k] = by[r.k] || {})[r.v] = r.n;
    return json({ ok: true, days, since, first: (first.results[0] || {}).d || null, today: nyDay(), data: by, daily: daily.results, allTime }, 200, CORS);
  }
  if (p === 'feedback') {
    if (req.method === 'POST') {
      let b = {}; try { b = await req.json(); } catch (e) {}
      const id = String(b.id || '');
      if (b.all === 'done') await db.prepare('UPDATE notes SET done = 1 WHERE done = 0').run();
      else if (id && b.del) await db.prepare('DELETE FROM notes WHERE id = ?').bind(id).run();
      else if (id) await db.prepare('UPDATE notes SET done = ? WHERE id = ?').bind(b.done ? 1 : 0, id).run();
      return json({ ok: true }, 200, CORS);
    }
    const rows = (await db.prepare('SELECT * FROM notes ORDER BY created DESC LIMIT 300').all()).results;
    return json({ ok: true, notes: rows, open: rows.filter(r => !r.done).length }, 200, CORS);
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

/* ---------------- SEO Manager (PawPixl Studio only) ----------------
   1) Reads your own pages exactly as visitors and Google get them (status, redirects, headers, HTML).
   2) Google Search Console, through a Google Cloud "service account". Its key is saved on this Worker as the
      secret GSC_KEY and never leaves it: the Studio only ever sees results. Uses the official Search Console API
      (search results, URL Inspection, sitemaps). The Indexing API is not used: it's only for job and livestream pages.
   Google limits: URL Inspection 2,000 checks a day per site (we stop at 1,500); results are kept for 3 days. */
const GSC_SCOPE = 'https://www.googleapis.com/auth/webmasters';
let gTok = null;
const b64u = u8 => { let s = ''; for (let i = 0; i < u8.length; i++) s += String.fromCharCode(u8[i]); return btoa(s).replace(/[+/=]/g, c => ({ '+': '-', '/': '_', '=': '' }[c])); };
function gscKey(env) { try { const k = JSON.parse(env.GSC_KEY || ''); return k && k.client_email && k.private_key ? k : null; } catch (e) { return null; } }
async function gToken(env) {
  const k = gscKey(env); if (!k) throw Object.assign(new Error('no-key'), { code: 'no-key' });
  if (gTok && gTok.who === k.client_email && gTok.exp > Date.now() + 60e3) return gTok.t;
  const now = Math.floor(Date.now() / 1000), enc = new TextEncoder();
  const unsigned = b64u(enc.encode(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))) + '.' + b64u(enc.encode(JSON.stringify({ iss: k.client_email, scope: GSC_SCOPE, aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 })));
  let key;
  try {
    const der = Uint8Array.from(atob(String(k.private_key).replace(/-----[^-]+-----/g, '').replace(/\s+/g, '')), c => c.charCodeAt(0));
    key = await crypto.subtle.importKey('pkcs8', der, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
  } catch (e) { throw Object.assign(new Error('bad-key'), { code: 'bad-key' }); }
  const sig = new Uint8Array(await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, enc.encode(unsigned)));
  const r = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: 'grant_type=' + encodeURIComponent('urn:ietf:params:oauth:grant-type:jwt-bearer') + '&assertion=' + unsigned + '.' + b64u(sig) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || !j.access_token) throw Object.assign(new Error(j.error_description || j.error || ('Google sign-in answered ' + r.status)), { code: 'google-auth' });
  gTok = { t: j.access_token, exp: Date.now() + (j.expires_in || 3600) * 1000, who: k.client_email };
  return gTok.t;
}
async function gApi(env, method, u, body) {
  const t = await gToken(env);
  const r = await fetch(u, { method, headers: Object.assign({ authorization: 'Bearer ' + t }, body ? { 'content-type': 'application/json' } : {}), body: body ? JSON.stringify(body) : undefined });
  const txt = await r.text(); let j = {}; try { j = txt ? JSON.parse(txt) : {}; } catch (e) {}
  if (!r.ok) throw Object.assign(new Error((j.error && j.error.message) || ('Google answered ' + r.status)), { code: r.status === 403 ? 'google-denied' : r.status === 429 ? 'google-quota' : 'google', status: r.status });
  return j;
}
const kvGet = async (db, k) => { const r = await db.prepare('SELECT v, t FROM seokv WHERE k = ?').bind(k).first(); if (!r) return null; try { return { v: JSON.parse(r.v), t: r.t }; } catch (e) { return null; } };
const kvSet = (db, k, v) => db.prepare('INSERT INTO seokv (k, v, t) VALUES (?, ?, ?) ON CONFLICT(k) DO UPDATE SET v = excluded.v, t = excluded.t').bind(k, JSON.stringify(v), new Date().toISOString()).run();
const isoDay = t => new Date(t).toISOString().slice(0, 10);
async function seoApi(p, req, env, url, db, ctx) {
  await db.prepare('CREATE TABLE IF NOT EXISTS seokv (k TEXT PRIMARY KEY, v TEXT NOT NULL, t TEXT NOT NULL)').run();
  const body = req.method === 'POST' ? await req.json().catch(() => ({})) : {};
  /* your pages, exactly as the website sends them (nothing is followed or changed) */
  if (p === 'fetch') {
    const paths = (Array.isArray(body.paths) ? body.paths : []).filter(x => /^\/[\w\-./%~]*$/.test(String(x)) && !/^\/api\//.test(x)).slice(0, 25);
    const out = [];
    for (const path of paths) {
      try {
        const r = await env.ASSETS.fetch(new Request(url.origin + path, { redirect: 'manual', headers: { 'user-agent': 'PawPixl-SEO-Check' } }));
        const ct = r.headers.get('content-type') || '';
        out.push({ path, status: r.status, location: r.headers.get('location') || '', xrobots: r.headers.get('x-robots-tag') || '', ctype: ct, html: /html|xml|text/.test(ct) ? (await r.text()).slice(0, 400000) : '' });
      } catch (e) { out.push({ path, status: 0, error: String(e.message || e) }); }
    }
    return json({ ok: true, origin: url.origin, pages: out }, 200, CORS);
  }
  if (!p.startsWith('gsc/')) return json({ ok: false }, 404, CORS);
  const g = p.slice(4), k = gscKey(env), off = await kvGet(db, 'gsc.off'), site = (await kvGet(db, 'gsc.site') || {}).v || '';
  if (g === 'status') return json({ ok: true, key: !!k, email: k ? k.client_email : '', connected: !!(k && !(off && off.v)), site }, 200, CORS);
  if (g === 'disconnect') {
    /* forget everything Google sent us; to remove the key itself, delete the GSC_KEY secret in Cloudflare */
    await db.batch([db.prepare("DELETE FROM seokv WHERE k LIKE 'insp:%' OR k LIKE 'perf:%' OR k IN ('gsc.site', 'insp.day')"), db.prepare('INSERT INTO seokv (k, v, t) VALUES (?, ?, ?) ON CONFLICT(k) DO UPDATE SET v = excluded.v, t = excluded.t').bind('gsc.off', 'true', new Date().toISOString())]);
    gTok = null;
    return json({ ok: true }, 200, CORS);
  }
  if (!k) return json({ ok: false, error: 'no-key' }, 400, CORS);
  try {
    if (g === 'sites') {
      const j = await gApi(env, 'GET', 'https://www.googleapis.com/webmasters/v3/sites');
      return json({ ok: true, email: k.client_email, sites: (j.siteEntry || []).map(s => ({ site: s.siteUrl, level: s.permissionLevel })) }, 200, CORS);
    }
    if (g === 'select') {
      const s = String(body.site || '');
      if (!/^(sc-domain:[a-z0-9.-]+|https?:\/\/[^\s]+\/)$/i.test(s)) return json({ ok: false, error: 'site' }, 400, CORS);
      await kvSet(db, 'gsc.site', s); await kvSet(db, 'gsc.off', false);
      return json({ ok: true, site: s }, 200, CORS);
    }
    if (off && off.v) return json({ ok: false, error: 'disconnected' }, 400, CORS);
    if (!site) return json({ ok: false, error: 'no-site' }, 400, CORS);
    const S = encodeURIComponent(site), W = 'https://www.googleapis.com/webmasters/v3/sites/' + S;
    if (g === 'perf') {
      /* search results for the last N days; saved for 6 hours so opening the tab doesn't use Google's quota */
      const days = Math.max(7, Math.min(90, +url.searchParams.get('days') || 28)), ck = 'perf:' + site + ':' + days;
      const c = await kvGet(db, ck);
      if (c && !url.searchParams.get('fresh') && Date.now() - Date.parse(c.t) < 6 * 3600e3) return json(Object.assign({ ok: true, cached: c.t }, c.v), 200, CORS);
      const end = isoDay(Date.now()), start = isoDay(Date.now() - (days - 1) * 864e5), q = dims => gApi(env, 'POST', W + '/searchAnalytics/query', Object.assign({ startDate: start, endDate: end, dataState: 'all', rowLimit: dims ? 50 : 1 }, dims ? { dimensions: dims } : {}));
      const [tot, pages, queries] = await Promise.all([q(null), q(['page']), q(['query'])]);
      const row = r => ({ keys: r.keys || [], clicks: r.clicks || 0, impressions: r.impressions || 0, ctr: r.ctr || 0, position: r.position || 0 });
      const v = { days, start, end, total: tot.rows && tot.rows[0] ? row(tot.rows[0]) : { clicks: 0, impressions: 0, ctr: 0, position: 0 }, pages: (pages.rows || []).map(row), queries: (queries.rows || []).map(row) };
      await kvSet(db, ck, v);
      return json(Object.assign({ ok: true, cached: '' }, v), 200, CORS);
    }
    if (g === 'inspect') {
      /* Google's own answer for each page (indexed or not, and why). Results are reused for 3 days unless you ask again. */
      const urls = (Array.isArray(body.urls) ? body.urls : []).map(String).filter(u => /^https?:\/\//.test(u)).slice(0, 10), out = [];
      const dk = 'insp.day', day = isoDay(Date.now()), used = await kvGet(db, dk); let n = used && used.v.day === day ? used.v.n : 0;
      for (const u of urls) {
        const c = await kvGet(db, 'insp:' + u);
        if (c && !body.force && Date.now() - Date.parse(c.t) < 3 * 864e5) { out.push(Object.assign({ url: u, at: c.t, cached: true }, c.v)); continue; }
        if (n >= 1500) { out.push({ url: u, error: 'daily-limit' }); continue; }
        try {
          const j = await gApi(env, 'POST', 'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', { inspectionUrl: u, siteUrl: site, languageCode: 'en-US' }); n++;
          const x = (j.inspectionResult || {}).indexStatusResult || {};
          const v = { verdict: x.verdict || '', coverage: x.coverageState || '', robots: x.robotsTxtState || '', indexing: x.indexingState || '', fetch: x.pageFetchState || '', crawled: x.lastCrawlTime || '', googleCanonical: x.googleCanonical || '', userCanonical: x.userCanonical || '', sitemaps: x.sitemap || [], link: (j.inspectionResult || {}).inspectionResultLink || '' };
          await kvSet(db, 'insp:' + u, v); out.push(Object.assign({ url: u, at: new Date().toISOString(), cached: false }, v));
        } catch (e) { out.push({ url: u, error: e.code || 'google', message: String(e.message || e) }); if (e.code === 'google-quota') break; }
      }
      await kvSet(db, dk, { day, n });
      return json({ ok: true, used: n, limit: 1500, results: out }, 200, CORS);
    }
    if (g === 'inspected') {
      /* what Google said last time, for every page we asked about (no new questions to Google) */
      const rows = (await db.prepare("SELECT k, v, t FROM seokv WHERE k LIKE 'insp:%'").all()).results;
      return json({ ok: true, results: rows.map(r => { let v = {}; try { v = JSON.parse(r.v); } catch (e) {} return Object.assign({ url: r.k.slice(5), at: r.t }, v); }) }, 200, CORS);
    }
    if (g === 'sitemaps') {
      if (req.method === 'POST') {
        const feed = String(body.feed || '');
        if (!/^https?:\/\/[^\s]+\.xml$/.test(feed)) return json({ ok: false, error: 'feed' }, 400, CORS);
        await gApi(env, 'PUT', W + '/sitemaps/' + encodeURIComponent(feed));
      }
      const j = await gApi(env, 'GET', W + '/sitemaps');
      return json({ ok: true, sitemaps: (j.sitemap || []).map(s => ({ path: s.path, submitted: s.lastSubmitted || '', downloaded: s.lastDownloaded || '', pending: !!s.isPending, errors: +s.errors || 0, warnings: +s.warnings || 0, urls: (s.contents || []).reduce((a, c) => a + (+c.submitted || 0), 0) })) }, 200, CORS);
    }
  } catch (e) { return json({ ok: false, error: e.code || 'google', message: String(e.message || e) }, 502, CORS); }
  return json({ ok: false }, 404, CORS);
}

export default {
  async fetch(req, env, ctx) {
    const url = new URL(req.url);
    if (url.pathname.startsWith('/api/')) {
      const res = await api(req, env, url, ctx);
      const out = new Response(res.body, res); out.headers.set('x-robots-tag', 'noindex, nofollow'); return out;
    }
    return env.ASSETS.fetch(req);
  },
  // once a day, keep sending any update that hit the daily limit
  async scheduled(event, env, ctx) { return daily(event, env, ctx); },
};
async function api(req, env, url, ctx) {
  {
    if (url.pathname.startsWith('/api/news/')) {
      try { return await news(req, env, url, ctx); } catch (e) { return json({ ok: false, error: 'server' }, 500, CORS); }
    }
    if (url.pathname === '/api/feedback') {
      if (req.method !== 'POST' || !env.DB) return json({ ok: false }, 405);
      if (!sameSite(req, url)) return json({ ok: false }, 403);
      let b = {}; try { b = JSON.parse((await req.text()).slice(0, 4000)); } catch (e) {}
      if (b.website) return json({ ok: true });                                   // hidden field filled in = bot
      const clean = (v, n) => String(v || '').replace(/[\u0000-\u0008\u000b-\u001f]/g, '').trim().slice(0, n);
      const msg = clean(b.msg, 1500), kind = ['comment', 'question', 'correction'].includes(b.kind) ? b.kind : 'comment';
      const page = /^\/[a-z0-9/_.-]{0,160}$/i.test(String(b.page || '')) ? String(b.page) : '/';
      if (msg.length < 3) return json({ ok: false, error: 'short' }, 400);
      try {
        await init(env.DB);
        const day = new Date().toISOString().slice(0, 10), ip = req.headers.get('cf-connecting-ip') || '';
        const hk = 'ip:' + day + ':' + [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(ip + day)))].slice(0, 8).map(x => x.toString(16).padStart(2, '0')).join('');
        const mine = await env.DB.prepare('SELECT n FROM noterate WHERE k = ?').bind(hk).first(), all = await env.DB.prepare('SELECT n FROM noterate WHERE k = ?').bind('day:' + day).first();
        if ((mine && mine.n >= 8) || (all && all.n >= 150)) return json({ ok: false, error: 'busy' }, 429);
        await env.DB.batch([
          env.DB.prepare('INSERT INTO notes (id, created, page, title, kind, msg, contact) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(token().slice(0, 16), new Date().toISOString(), page, clean(b.title, 140), kind, msg, clean(b.contact, 140)),
          env.DB.prepare('INSERT INTO noterate (k, n, t) VALUES (?, 1, ?) ON CONFLICT(k) DO UPDATE SET n = n + 1').bind(hk, day),
          env.DB.prepare('INSERT INTO noterate (k, n, t) VALUES (?, 1, ?) ON CONFLICT(k) DO UPDATE SET n = n + 1').bind('day:' + day, day),
          env.DB.prepare('DELETE FROM noterate WHERE t < ?').bind(day),
        ]);
      } catch (e) { return json({ ok: false, error: 'server' }, 500); }
      return json({ ok: true });
    }
    if (url.pathname === '/api/hit') {
      if (req.method !== 'POST' || !env.DB) return json({ ok: false }, 405);
      if (!sameSite(req, url)) return json({ ok: false }, 403);
      let b = {};
      try { b = JSON.parse((await req.text()).slice(0, 600)); } catch (e) {}
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
        if (b.s || b.p || b.a) q.push(...await insight(env.DB, req, b, url));
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
  }
}
async function daily(event, env, ctx) {
  {
    if (!env.DB || !env.RESEND_KEY) return;
    await init(env.DB);
    const since = new Date(Date.now() - 7 * 864e5).toISOString();   // keep catching up for a week at most
    const open = (await env.DB.prepare('SELECT id FROM issues WHERE created > ? ORDER BY created ASC').bind(since).all()).results;
    for (const r of open) {
      const info = await siteInfo(env, 'https://localhost');
      const out = await pump(env, info, r.id).catch(() => ({ limited: true }));
      if (out.limited) break;
    }
  }
}
