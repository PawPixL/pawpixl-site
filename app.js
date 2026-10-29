/* PawPixl website. Everything here reads published content from /content (written by PawPixl Studio). */
(()=>{
'use strict';
const EL={Pyro:['#ff4b2b','#ffb347','#ffe2a8'],Hydro:['#1e6fff','#5fd8ff','#c9f4ff'],Anemo:['#18c9a0','#8ff5d6','#e2fff6'],Electro:['#8a3dff','#ff63e8','#f0d4ff'],Dendro:['#4eb52a','#c6f060','#f1ffc9'],Cryo:['#4fb7ff','#d9f6ff','#ffffff'],Geo:['#e8a21c','#ffe27a','#fff7d1']};
const ELK=Object.keys(EL);
const SECT={builds:{t:'Character Builds',s:'Builds',d:'Weapons, artifacts, stats, talents and teams for every character I cover.'},
 abyss:{t:'Spiral Abyss',s:'Abyss',d:'Floor 12 bosses, mechanics and teams for each cycle.'},
 stygian:{t:'Stygian Onslaught',s:'Stygian',d:'Boss breakdowns and team picks for each Stygian run.'},
 theatre:{t:'Imaginarium Theater',s:'Theater',d:'Season cast, elements, bosses and suggested characters.'},
 schedule:{t:'Stream Schedule',s:'Schedule',d:'When I’m live this week.'}};
const SORDER=['builds','abyss','stygian','theatre','schedule'];
const LANGS={en:'English',fr:'Français',es:'Español',ja:'日本語',zh:'中文'};
const $=s=>document.querySelector(s);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const store={get(k,d){try{const v=localStorage.getItem('pp.'+k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem('pp.'+k,JSON.stringify(v))}catch(e){}}};
const fmtDate=iso=>{if(!iso)return'';const d=new Date(iso);return isNaN(d)?'':d.toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'})};
const ago=iso=>{const d=(Date.now()-new Date(iso))/864e5;return d<1?'Today':d<2?'Yesterday':d<14?Math.floor(d)+' days ago':fmtDate(iso)};

/* ---------- data ---------- */
const S={site:null,games:{},lang:store.get('lang','en'),user:null,favs:new Set(),seen:store.get('seen',null),sb:null};
async function getJSON(p){const r=await fetch(p,{cache:'no-store'});if(!r.ok)throw new Error(r.status);return r.json()}
async function loadSite(){if(S.site)return S.site;try{S.site=await getJSON('/content/site.json')}catch(e){S.site={name:'PawPixl',tagline:'',socials:[],games:[{id:'genshin',name:'Genshin Impact',status:'live',el:'Hydro'}]}}return S.site}
async function loadGame(id){if(S.games[id])return S.games[id];let g;try{g=await getJSON('/content/'+id+'/index.json')}catch(e){g={roster:[],posts:{}}}g.posts=g.posts||{};S.games[id]=g;return g}
const gameMeta=id=>(S.site.games||[]).find(g=>g.id===id);
const liveGames=()=>(S.site.games||[]).filter(g=>g.status!=='hidden');
function setTheme(el){const c=EL[el]||EL[(S.site&&S.site.accent)||'Hydro']||EL.Hydro;const r=document.documentElement.style;r.setProperty('--e0',c[0]);r.setProperty('--e1',c[1]);r.setProperty('--e2',c[2])}
/* every post across a game as a flat list, newest first */
function allPosts(gid){const g=S.games[gid];if(!g)return[];const out=[];
 Object.entries(g.posts.builds||{}).forEach(([k,c])=>{const v=(c.versions||[])[0];if(v)out.push({gid,sec:'builds',key:k,title:c.title,el:c.el,v,date:v.date,url:'/'+gid+'/builds/'+k})});
 SORDER.slice(1).forEach(sec=>(g.posts[sec]||[]).forEach((p,i)=>out.push({gid,sec,key:p.id,title:p.title,el:p.el,v:p,date:p.date,url:'/'+gid+'/'+sec+'/'+p.id,latest:i===0})));
 return out.sort((a,b)=>String(b.date).localeCompare(String(a.date)))}
const isNew=iso=>S.seen?new Date(iso)>new Date(S.seen):(Date.now()-new Date(iso))<7*864e5;
/* pick the slides for the viewer's language, falling back to English */
function slidesOf(v){const L=v.langs||{};const k=L[S.lang]?S.lang:(L.en?'en':Object.keys(L)[0]);return{k,list:(L[k]||{}).slides||[]}}
const thumbOf=v=>v.thumb||((slidesOf(v).list[0]||{}).t)||((slidesOf(v).list[0]||{}).img)||'';

/* ---------- icons ---------- */
const IC={
 tiktok:'<path d="M14.5 3c.3 2.2 1.8 3.9 4 4.2v3a7 7 0 0 1-4-1.3v6.1a5.5 5.5 0 1 1-5.5-5.5c.3 0 .6 0 .9.1v3.1a2.5 2.5 0 1 0 1.6 2.3V3h3z" fill="currentColor"/>',
 youtube:'<rect x="2.5" y="5.5" width="19" height="13" rx="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M10 9.2v5.6l4.8-2.8z" fill="currentColor"/>',
 twitch:'<path d="M5 3 3.5 7v12H8v2.5h2.5L13 19h3.5l4-4V3H5zm13.5 11-2.5 2.5h-3.5L10 19v-2.5H6.5V5h12v9z" fill="currentColor"/><path d="M11 8h2v5h-2zm4.5 0h2v5h-2z" fill="currentColor"/>',
 instagram:'<rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.3" cy="6.7" r="1.2" fill="currentColor"/>',
 x:'<path d="M4 4h4.2l4.1 5.6L17.2 4H20l-6.4 7.3L20.5 20h-4.2l-4.5-6.1L6.5 20H3.7l6.8-7.8z" fill="currentColor"/>',
 discord:'<path d="M19 6.2A15 15 0 0 0 15.3 5l-.5 1a13 13 0 0 0-5.6 0l-.5-1A15 15 0 0 0 5 6.2C2.7 9.7 2.1 13 2.4 16.3A15 15 0 0 0 7 18.6l1-1.5a9 9 0 0 1-1.5-.7l.4-.3a10.6 10.6 0 0 0 10.2 0l.4.3-1.5.7 1 1.5a15 15 0 0 0 4.6-2.3c.4-3.8-.6-7.1-2.6-10.1zM9.3 14.3c-.9 0-1.6-.8-1.6-1.8s.7-1.8 1.6-1.8 1.6.8 1.6 1.8-.7 1.8-1.6 1.8zm5.4 0c-.9 0-1.6-.8-1.6-1.8s.7-1.8 1.6-1.8 1.6.8 1.6 1.8-.7 1.8-1.6 1.8z" fill="currentColor"/>',
 kofi:'<path d="M4 7h12v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V7z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16 9h1.5a2.5 2.5 0 0 1 0 5H16" fill="none" stroke="currentColor" stroke-width="2"/><path d="M10 15s-3-1.8-3-3.6a1.5 1.5 0 0 1 3-.4 1.5 1.5 0 0 1 3 .4c0 1.8-3 3.6-3 3.6z" fill="currentColor"/>',
 link:'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3A4 4 0 0 0 11 18.7l1-1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
 bell:'<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20a2 2 0 0 0 4 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
 user:'<circle cx="12" cy="8.5" r="3.8" fill="none" stroke="currentColor" stroke-width="2"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
 heart:'<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" fill="currentColor"/>',
 heartO:'<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" fill="none" stroke="currentColor" stroke-width="2"/>',
 dl:'<path d="M12 4v11m0 0 4.5-4.5M12 15l-4.5-4.5M5 19.5h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
 share:'<path d="M8 12.5 16 8M8 11.5l8 4.5" stroke="currentColor" stroke-width="2"/><circle cx="6" cy="12" r="2.6" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="18" cy="6.5" r="2.6" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="18" cy="17.5" r="2.6" fill="none" stroke="currentColor" stroke-width="2"/>',
 l:'<path d="m14.5 6-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>',
 r:'<path d="m9.5 6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>'};
const svg=(k,lbl)=>'<svg viewBox="0 0 24 24" '+(lbl?'role="img" aria-label="'+esc(lbl)+'"':'aria-hidden="true"')+'>'+(IC[k]||IC.link)+'</svg>';
const SOCNAME={tiktok:'TikTok',youtube:'YouTube',twitch:'Twitch',instagram:'Instagram',x:'X',discord:'Discord',kofi:'Ko-fi',link:'Link'};
const socials=()=>(S.site.socials||[]).filter(s=>s&&s.url).map(s=>'<a class="soc" href="'+esc(s.url)+'" target="_blank" rel="noopener">'+svg(s.type)+esc(s.label||SOCNAME[s.type]||'Link')+'</a>').join('');

/* ---------- shell ---------- */
function shell(){document.body.innerHTML='<header class="top"><div class="wrap"><a class="logo" href="/" data-link>'+esc(S.site.name||'PawPixl')+'</a><nav class="nav" id="nav" aria-label="Sections"></nav><div class="tools"><select class="lang" id="lang" aria-label="Card language">'+Object.entries(LANGS).map(([k,v])=>'<option value="'+k+'"'+(k===S.lang?' selected':'')+'>'+v+'</option>').join('')+'</select><div style="position:relative"><button class="ibtn" id="bell" aria-label="What’s new">'+svg('bell')+'<span class="dot" id="bellN" hidden></span></button><div class="panel pop" id="bellPop" hidden></div></div><a class="ibtn lbl" id="acctBtn" href="/account" data-link hidden>'+svg('user')+'<span>Sign in</span></a></div></div></header><main id="main" class="wrap"></main><footer><div class="wrap"><div class="row"><div class="socials" style="margin:0">'+socials()+'</div><div class="row"><a href="/privacy" data-link>Privacy</a><span>© '+new Date().getFullYear()+' '+esc(S.site.name||'PawPixl')+'</span></div></div></div></footer>';
 $('#lang').onchange=e=>{S.lang=e.target.value;store.set('lang',S.lang);route()};
 $('#bell').onclick=e=>{e.stopPropagation();const p=$('#bellPop');p.hidden=!p.hidden;if(!p.hidden)renderBell()};
 document.addEventListener('click',e=>{const p=$('#bellPop');if(p&&!p.hidden&&!p.contains(e.target))p.hidden=true});
 if(S.site.auth&&S.site.auth.url&&S.site.auth.anon)$('#acctBtn').hidden=false}
function nav(gid,cur){const n=$('#nav');if(!n)return;const g=gid&&gameMeta(gid);const secs=g?(g.sections||SORDER):[];n.innerHTML=g?['<a href="/'+gid+'" data-link'+(cur==='hub'?' aria-current="page"':'')+'>'+esc(g.short||g.name)+'</a>'].concat(secs.map(s=>'<a href="/'+gid+'/'+s+'" data-link'+(cur===s?' aria-current="page"':'')+'>'+SECT[s].s+'</a>')).join(''):''}
function bellItems(){const L=[];liveGames().forEach(g=>{if(S.games[g.id])allPosts(g.id).forEach(p=>{if(isNew(p.date))L.push(p)})});const fav=p=>S.favs.has(p.gid+'|'+p.sec+'|'+(p.sec==='builds'?p.key:'*'));return L.sort((a,b)=>(fav(b)-fav(a))||String(b.date).localeCompare(String(a.date)))}
function updateBell(){const n=bellItems().length,d=$('#bellN');if(!d)return;d.hidden=!n;d.textContent=n>9?'9+':n}
function renderBell(){const L=bellItems().slice(0,8),p=$('#bellPop');p.innerHTML='<h4>'+(L.length?'New since your last visit':'You’re all caught up')+'</h4>'+L.map(x=>'<a class="it" href="'+x.url+'" data-link><img src="/'+esc(thumbOf(x.v))+'" alt=""><span><b>'+esc(x.title)+'</b><small>'+SECT[x.sec].t+' · '+ago(x.date)+(S.favs.has(x.gid+'|'+x.sec+'|'+(x.sec==='builds'?x.key:'*'))?' · ♥ Favorite':'')+'</small></span></a>').join('')+(L.length?'<div class="row" style="padding:6px"><button class="btn" id="seenAll" style="height:36px">Mark all as seen</button></div>':'');
 const b=$('#seenAll');if(b)b.onclick=()=>{markSeen();p.hidden=true}}
function markSeen(){S.seen=new Date().toISOString();store.set('seen',S.seen);if(S.user&&S.sb)S.sb.from('profiles').upsert({id:S.user.id,last_seen:S.seen}).then(()=>{});updateBell();route()}
function toast(t){let e=$('.toast');if(!e){e=document.createElement('div');e.className='toast';e.setAttribute('role','status');document.body.appendChild(e)}e.textContent=t;e.hidden=false;clearTimeout(e._t);e._t=setTimeout(()=>e.hidden=true,2600)}
function meta(title,desc){document.title=title?title+' · '+(S.site.name||'PawPixl'):(S.site.name||'PawPixl');const m=document.querySelector('meta[name=description]');if(m&&desc)m.setAttribute('content',desc)}

/* ---------- pages ---------- */
function tileHTML(p,showSec){const t=thumbOf(p.v);return'<a class="tile" href="'+p.url+'" data-link><div class="im" style="background-image:url(\'/'+esc(t)+'\')">'+(showSec?'<span class="chip">'+SECT[p.sec].s+'</span>':'')+(isNew(p.date)?'<span class="chip new">New</span>':'')+'</div><div class="tx"><b>'+esc(p.title)+'</b><small>'+esc(p.v.dateText||ago(p.date))+'</small></div></a>'}
async function pHome(){const s=S.site;setTheme(s.accent);nav(null);meta('',s.tagline);
 await Promise.all(liveGames().filter(g=>g.status==='live').map(g=>loadGame(g.id)));
 const latest=[].concat(...liveGames().filter(g=>g.status==='live').map(g=>allPosts(g.id))).sort((a,b)=>String(b.date).localeCompare(String(a.date))).slice(0,8);
 const nm=esc(s.name||'PawPixl'),half=Math.ceil(nm.length/2);
 return'<div class="hero"><div class="avatar"><div style="'+(s.avatar?'background-image:url(\'/'+esc(s.avatar)+'\')':'')+'">'+(s.avatar?'':nm[0])+'</div></div><div><h1 class="disp">'+nm.slice(0,half)+'<span>'+nm.slice(half)+'</span></h1>'+(s.tagline?'<p class="tag">'+esc(s.tagline)+'</p>':'')+(s.bio?'<p class="bio">'+esc(s.bio)+'</p>':'')+'<div class="socials">'+socials()+'</div></div></div>'
 +(s.announcement?'<div class="panel banner"><span class="chip">News</span><span>'+esc(s.announcement)+'</span></div>':'')
 +'<section><div class="shead"><div><div class="eyebrow">Choose your game</div></div></div><div class="games">'+liveGames().map(g=>{const c=EL[g.el]||EL.Hydro,soon=g.status!=='live',n=soon?0:allPosts(g.id).length;return(soon?'<div':'<a href="/'+g.id+'" data-link')+' class="game'+(soon?' soon':'')+'" style="--g0:'+c[0]+';--g1:'+c[1]+'"><span class="chip'+(soon?' ghost':'')+'">'+(soon?'Coming soon':'Live')+'</span><div class="disp">'+esc(g.name)+'</div><div class="meta">'+(soon?'Guides on the way':n+' guide'+(n===1?'':'s')+' and counting')+'</div>'+(soon?'</div>':'</a>')}).join('')+'</div></section>'
 +'<section><div class="shead"><div><div class="eyebrow">Latest</div><h2 class="disp">Fresh off the stream</h2></div><span class="sp"></span>'+(S.seen?'':'')+'</div>'+(latest.length?'<div class="feed">'+latest.map(p=>tileHTML(p,true)).join('')+'</div>':'<div class="panel empty"><b>Nothing published yet</b>New builds and guides show up here the moment they’re published.</div>')+'</section>'}
async function pHub(gid){const g=gameMeta(gid);if(!g||g.status!=='live')return pMissing();setTheme(g.el);nav(gid,'hub');meta(g.name,'');const d=await loadGame(gid);const P=allPosts(gid);
 const secs=(g.sections||SORDER).filter(s=>SECT[s]);
 return'<section><div class="shead"><div><div class="eyebrow">'+esc(g.name)+'</div><h2 class="disp" style="font-size:clamp(44px,7vw,80px)">Guides &amp; builds</h2></div></div><div class="tiles">'+secs.map(sec=>{const L=P.filter(p=>p.sec===sec),top=L[0],cnt=sec==='builds'?Object.keys(d.posts.builds||{}).length+' of '+(d.roster||[]).length+' characters':L.length+' published';return'<a class="tile sect" href="/'+gid+'/'+sec+'" data-link><div><div class="eyebrow">'+SECT[sec].s+'</div><div class="disp" style="margin-top:10px">'+SECT[sec].t+'</div><p class="muted" style="margin:8px 0 0;font-size:14px">'+SECT[sec].d+'</p></div><div class="row" style="margin-top:14px"><small class="muted" style="font-weight:600">'+cnt+'</small><span class="sp"></span>'+(top&&isNew(top.date)?'<span class="chip new">New</span>':'')+'</div></a>'}).join('')+'</div></section>'
 +'<section><div class="shead"><div><div class="eyebrow">Recently updated</div></div></div>'+(P.length?'<div class="feed">'+P.slice(0,10).map(p=>tileHTML(p,true)).join('')+'</div>':'<div class="panel empty"><b>No guides yet</b>Check back soon.</div>')+'</section>'}
let ELF=store.get('elf','');let ONLY=store.get('only',false);let QRY='';
async function pBuilds(gid){const g=gameMeta(gid);if(!g)return pMissing();setTheme(ELF||g.el);nav(gid,'builds');meta(SECT.builds.t,SECT.builds.d);const d=await loadGame(gid);const B=d.posts.builds||{};
 const roster=(d.roster||[]).slice().sort((a,b)=>a.name.localeCompare(b.name));
 const has=r=>!!B[r.id],q=QRY.trim().toLowerCase();
 const vis=roster.filter(r=>(!ELF||r.el===ELF)&&(!ONLY||has(r))&&(!q||r.name.toLowerCase().includes(q)));
 const card=r=>{const c=EL[r.el]||['#556','#778','#99a'],on=has(r),v=on&&B[r.id].versions[0],fav=S.favs.has(gid+'|builds|'+r.id);return(on?'<a href="/'+gid+'/builds/'+esc(r.id)+'" data-link':'<div title="Card coming soon"')+' class="char'+(on?'':' off')+'" style="--c0:'+c[0]+';--c1:'+c[1]+'"><div class="pic"'+(r.icon?' style="background-image:url(\'/'+esc(r.icon)+'\')"':'')+'>'+(r.icon?'':'<span class="ini">'+esc((r.name||'?').trim()[0])+'</span>')+'</div><b>'+esc(r.name)+'</b>'+(on&&isNew(v.date)?'<span class="chip new">New</span>':'')+(fav?'<span class="fav">'+svg('heart')+'</span>':'')+(on?'</a>':'</div>')};
 const groups=(ELF?[ELF]:ELK).map(el=>{const L=vis.filter(r=>r.el===el);if(!L.length)return'';const c=EL[el];return'<div class="elgroup" style="--c2:'+c[1]+'"><h3>'+el+' <small>'+L.filter(has).length+' of '+L.length+' with cards</small></h3><div class="chars">'+L.map(card).join('')+'</div></div>'}).join('');
 const other=vis.filter(r=>!EL[r.el]);
 return'<section><div class="shead"><div><div class="eyebrow">'+esc(g.name)+'</div><h2 class="disp" style="font-size:clamp(40px,6vw,64px)">Character builds</h2><p class="muted" style="margin:6px 0 0">'+Object.keys(B).length+' of '+roster.length+' characters have a card. Greyed-out characters are on the way.</p></div></div>'
 +'<div class="etabs" role="group" aria-label="Filter by element"><button class="etab" data-el="" aria-pressed="'+(!ELF)+'" style="--c0:#3a4366;--c1:#6d7aa8">All</button>'+ELK.map(k=>'<button class="etab" data-el="'+k+'" aria-pressed="'+(ELF===k)+'" style="--c0:'+EL[k][0]+';--c1:'+EL[k][1]+'"><i></i>'+k+'</button>').join('')+'</div>'
 +'<div class="row" style="margin-bottom:18px"><input class="search" id="q" type="search" placeholder="Search characters" value="'+esc(QRY)+'" aria-label="Search characters"><label class="row" style="gap:8px;font-weight:600;font-size:14px"><input type="checkbox" id="only"'+(ONLY?' checked':'')+'> Only show characters with a card</label></div>'
 +(roster.length?(groups+(other.length?'<div class="elgroup"><h3>Other</h3><div class="chars">'+other.map(card).join('')+'</div></div>':'')||'<div class="panel empty"><b>No matches</b>Try another element or name.</div>'):'<div class="panel empty"><b>Character list not set up yet</b>It appears here once it’s synced from PawPixl Studio.</div>')+'</section>'}
function afterBuilds(gid){document.querySelectorAll('.etab').forEach(b=>b.onclick=()=>{ELF=b.dataset.el;store.set('elf',ELF);route()});const q=$('#q');if(q)q.oninput=e=>{QRY=e.target.value;const pos=e.target.selectionStart;route().then(()=>{const n=$('#q');if(n){n.focus();n.setSelectionRange(pos,pos)}})};const o=$('#only');if(o)o.onchange=e=>{ONLY=e.target.checked;store.set('only',ONLY);route()}}

function viewerHTML(v,title){const{k,list}=slidesOf(v);const L=Object.keys(v.langs||{});
 return'<div class="stage" id="stage">'+(list.length?'<img id="vimg" src="/'+esc(list[0].img)+'" width="'+(list[0].w||1080)+'" height="'+(list[0].h||1350)+'" alt="'+esc(title)+' slide 1">'+(list.length>1?'<button class="nb l" id="vp" aria-label="Previous slide">'+svg('l')+'</button><button class="nb r" id="vn" aria-label="Next slide">'+svg('r')+'</button><span class="count" id="vc">1 / '+list.length+'</span>':''):'<div class="empty">No slides in this language.</div>')+'</div>'
 +(list.length>1?'<div class="thumbs" id="vth">'+list.map((s,i)=>'<button aria-label="Slide '+(i+1)+'" aria-current="'+(i===0)+'" data-i="'+i+'"><img src="/'+esc(s.t||s.img)+'" alt="" loading="lazy"></button>').join('')+'</div>':'')
 +'<p class="muted" style="font-size:13px;margin:8px 2px 0">Showing '+LANGS[k]+(k!==S.lang?' (not available in '+LANGS[S.lang]+' yet)':'')+(L.length>1?' · Also in: '+L.filter(x=>x!==k).map(x=>LANGS[x]||x).join(', '):'')+'</p>'}
function wireViewer(v,title,fileBase){const{list}=slidesOf(v);let i=0;const img=$('#vimg');if(!img)return;
 const show=n=>{i=(n+list.length)%list.length;img.src='/'+list[i].img;img.alt=title+' slide '+(i+1);const c=$('#vc');if(c)c.textContent=(i+1)+' / '+list.length;document.querySelectorAll('#vth button').forEach((b,j)=>b.setAttribute('aria-current',String(j===i)))};
 const p=$('#vp'),n=$('#vn');if(p)p.onclick=()=>show(i-1);if(n)n.onclick=()=>show(i+1);document.querySelectorAll('#vth button').forEach(b=>b.onclick=()=>show(+b.dataset.i));
 document.onkeydown=e=>{if(/INPUT|SELECT|TEXTAREA/.test(e.target.tagName))return;if(e.key==='ArrowLeft')show(i-1);if(e.key==='ArrowRight')show(i+1)};
 let sx=null;img.addEventListener('touchstart',e=>{sx=e.touches[0].clientX},{passive:true});img.addEventListener('touchend',e=>{if(sx==null)return;const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>40)show(i+(dx<0?1:-1));sx=null});
 const d1=$('#dl1');if(d1)d1.onclick=()=>dlFile('/'+list[i].img,fileBase+'-'+(i+1)+'.jpg');
 const da=$('#dlall');if(da)da.onclick=()=>dlZip(list,fileBase);
 const sh=$('#share');if(sh)sh.onclick=async()=>{const u=location.href;try{if(navigator.share){await navigator.share({title,url:u});return}}catch(e){return}try{await navigator.clipboard.writeText(u);toast('Link copied')}catch(e){prompt('Copy this link',u)}}}
async function dlFile(url,name){try{const b=await(await fetch(url)).blob();const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1500)}catch(e){location.href=url}}
async function dlZip(list,base){if(!window.JSZip){await new Promise((res,rej)=>{const s=document.createElement('script');s.src='/vendor/jszip.min.js';s.onload=res;s.onerror=rej;document.head.appendChild(s)})}toast('Preparing download…');const z=new JSZip();for(let i=0;i<list.length;i++){const b=await(await fetch('/'+list[i].img)).blob();z.file(base+'-'+(i+1)+'.jpg',b)}const blob=await z.generateAsync({type:'blob'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=base+'.zip';document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1500)}
const actions=(fk)=>'<div class="row">'+'<button class="btn go" id="dl1">'+svg('dl')+'Download slide</button><button class="btn" id="dlall">'+svg('dl')+'Download all</button><button class="btn" id="share">'+svg('share')+'Share</button>'+(fk?'<button class="btn" id="fav" aria-pressed="'+S.favs.has(fk)+'">'+svg(S.favs.has(fk)?'heart':'heartO')+(S.favs.has(fk)?'Favorited':'Favorite')+'</button>':'')+'</div>';
function wireFav(fk){const b=$('#fav');if(b)b.onclick=()=>toggleFav(fk)}

async function pChar(gid,key,ver){const g=gameMeta(gid);const d=await loadGame(gid);const c=(d.posts.builds||{})[key];if(!c)return pMissing();const r=(d.roster||[]).find(x=>x.id===key)||{};setTheme(c.el||r.el||g.el);nav(gid,'builds');
 const vs=c.versions||[],v=vs.find(x=>x.id===ver)||vs[0];meta(c.title+' build','Build guide for '+c.title);const fk=gid+'|builds|'+key;
 PAGE={v,title:c.title,file:'pawpixl-'+key,fk};
 return'<section><a href="/'+gid+'/builds" data-link class="muted" style="font-weight:600;text-decoration:none">← All characters</a><div class="view" style="margin-top:14px"><div>'+viewerHTML(v,c.title)+'</div><div class="side"><div class="panel"><div class="row" style="gap:8px"><span class="chip">'+esc(c.el||r.el||'Build')+'</span>'+(v===vs[0]?'<span class="chip ghost">Latest</span>':'<span class="chip ghost">Older version</span>')+(isNew(v.date)?'<span class="chip new">New</span>':'')+'</div><h1 class="disp" style="margin-top:14px">'+esc(c.title)+'</h1><p class="muted" style="margin:6px 0 14px">Updated '+fmtDate(v.date)+'</p>'+actions(fk)+'</div>'
 +(vs.length>1?'<div class="panel"><div class="eyebrow" style="margin-bottom:12px">Version history</div><ul class="hist">'+vs.map((x,i)=>'<li><a href="/'+gid+'/builds/'+key+(i?'/'+x.id:'')+'" data-link aria-current="'+(x===v)+'"><span>'+(i?'Previous':'Latest')+'</span><span class="muted">'+fmtDate(x.date)+'</span></a></li>').join('')+'</ul></div>':'')+'</div></div></section>'}
async function pSection(gid,sec){const g=gameMeta(gid);if(!g||!SECT[sec]||sec==='builds')return pMissing();setTheme(g.el);nav(gid,sec);meta(SECT[sec].t,SECT[sec].d);const d=await loadGame(gid);const L=d.posts[sec]||[];
 if(!L.length)return'<section><div class="shead"><div><div class="eyebrow">'+esc(g.name)+'</div><h2 class="disp" style="font-size:clamp(40px,6vw,64px)">'+SECT[sec].t+'</h2></div></div><div class="panel empty"><b>Nothing here yet</b>The current one shows up here as soon as it’s published.</div></section>';
 return pPost(gid,sec,L[0].id,true)}
async function pPost(gid,sec,id,isLatestPage){const g=gameMeta(gid);const d=await loadGame(gid);const L=d.posts[sec]||[];const v=L.find(x=>x.id===id);if(!v)return pMissing();setTheme(v.el||g.el);nav(gid,sec);meta(v.title,SECT[sec].d);const fk=gid+'|'+sec+'|*';
 PAGE={v,title:v.title,file:'pawpixl-'+sec+'-'+id,fk};const latest=L[0]===v;
 const rest=L.filter(x=>x!==v);const byYear={};rest.forEach(x=>{const y=(x.date||'').slice(0,4)||'Earlier';(byYear[y]=byYear[y]||[]).push(x)});
 return'<section><div class="shead"><div><div class="eyebrow">'+esc(g.name)+' · '+SECT[sec].t+'</div></div></div><div class="view"><div>'+viewerHTML(v,v.title)+'</div><div class="side"><div class="panel"><div class="row" style="gap:8px"><span class="chip">'+(latest?'Current':'Archive')+'</span>'+(isNew(v.date)?'<span class="chip new">New</span>':'')+'</div><h1 class="disp" style="margin-top:14px;font-size:clamp(34px,5vw,54px)">'+esc(v.title)+'</h1><p class="muted" style="margin:6px 0 14px">'+esc(v.dateText||('Posted '+fmtDate(v.date)))+'</p>'+actions(fk)+(latest?'':'<p style="margin:14px 0 0"><a href="/'+gid+'/'+sec+'" data-link>See the current one →</a></p>')+'</div></div></div></section>'
 +(rest.length?'<section><div class="shead"><div><div class="eyebrow">Archive</div><h2 class="disp">Previous '+SECT[sec].s+'</h2></div></div>'+Object.keys(byYear).sort().reverse().map(y=>'<div class="yr">'+esc(y)+'</div><div class="archive">'+byYear[y].map(x=>tileHTML({v:x,sec,title:x.title,date:x.date,url:'/'+gid+'/'+sec+'/'+x.id},false)).join('')+'</div>').join('')+'</section>':'')}
function pMissing(){nav(null);meta('Not found');return'<div class="panel empty" style="margin-top:40px"><b>That page isn’t here</b><a href="/" data-link>Go to the home page</a></div>'}
function pPrivacy(){nav(null);meta('Privacy');return'<section class="prose"><div class="eyebrow">Privacy</div><h2 class="disp" style="font-size:44px;margin:10px 0 14px">Your privacy</h2><p>You can browse and download everything here without an account.</p><p>If you sign in, the site stores only your account email (or the Discord/Google account you chose), your favorites and the time you last checked for new posts, so it can show you what’s new. Nothing is sold or shared.</p><p>Your language choice and last visit are also kept in your browser. You can delete your saved favorites and account data any time from the Account page.</p><p>Visitor numbers are counted without cookies using Cloudflare Web Analytics.</p></section>'}

/* ---------- fan accounts (optional) ---------- */
async function initAuth(){const a=S.site.auth;if(!a||!a.url||!a.anon)return;try{if(!window.supabase)await new Promise((res,rej)=>{const s=document.createElement('script');s.src='/vendor/supabase.min.js';s.onload=res;s.onerror=rej;document.head.appendChild(s)});S.sb=window.supabase.createClient(a.url,a.anon);
 const{data}=await S.sb.auth.getSession();await setUser(data.session&&data.session.user);S.sb.auth.onAuthStateChange((_e,ses)=>{setUser(ses&&ses.user).then(()=>route())})}catch(e){console.warn('Accounts unavailable',e)}}
async function setUser(u){S.user=u||null;const b=$('#acctBtn');if(b)b.innerHTML=svg('user')+'<span>'+(u?'Account':'Sign in')+'</span>';S.favs=new Set(store.get('favs',[]));
 if(u&&S.sb){try{const{data}=await S.sb.from('favorites').select('game,kind,key');S.favs=new Set((data||[]).map(f=>f.game+'|'+f.kind+'|'+f.key));const p=await S.sb.from('profiles').select('last_seen').eq('id',u.id).maybeSingle();if(p.data&&p.data.last_seen){S.seen=p.data.last_seen;store.set('seen',S.seen)}else await S.sb.from('profiles').upsert({id:u.id,last_seen:S.seen||new Date().toISOString()})}catch(e){}}updateBell()}
async function toggleFav(fk){const on=S.favs.has(fk);if(on)S.favs.delete(fk);else S.favs.add(fk);store.set('favs',[...S.favs]);
 if(S.user&&S.sb){const[g,k,key]=fk.split('|');try{if(on)await S.sb.from('favorites').delete().match({user_id:S.user.id,game:g,kind:k,key});else await S.sb.from('favorites').insert({user_id:S.user.id,game:g,kind:k,key})}catch(e){}}
 toast(on?'Removed from favorites':S.user?'Added to favorites':'Added to favorites on this device. Sign in to keep them everywhere.');route()}
function pAccount(){nav(null);meta('Account');const a=S.site.auth||{};if(!a.url)return'<div class="panel acct"><b>Accounts aren’t switched on yet.</b><p class="muted">You can still browse and download everything.</p></div>';
 const P=a.providers||['discord','google','email'];
 if(S.user){const favs=[...S.favs];return'<div class="panel acct"><div class="eyebrow">Your account</div><h2 class="disp" style="font-size:40px;margin:10px 0 6px">Welcome back</h2><p class="muted">Signed in as '+esc(S.user.email||S.user.user_metadata&&S.user.user_metadata.full_name||'you')+'</p><div class="eyebrow" style="margin:22px 0 10px">Favorites</div>'+(favs.length?'<ul class="hist">'+favs.map(f=>{const[g,k,key]=f.split('|');const d=S.games[g];const t=k==='builds'?(((d&&d.posts.builds||{})[key]||{}).title||key):SECT[k]?SECT[k].t:k;return'<li><a href="/'+g+'/'+k+(k==='builds'?'/'+key:'')+'" data-link><span>'+esc(t)+'</span><span class="muted">'+(SECT[k]?SECT[k].s:'')+'</span></a></li>'}).join('')+'</ul>':'<p class="muted">Tap Favorite on any build or guide and it shows up here, with alerts when it’s updated.</p>')+'<div class="row" style="margin-top:22px"><button class="btn" id="out">Sign out</button><button class="btn" id="del">Delete my saved data</button></div></div>'}
 return'<div class="panel acct"><div class="eyebrow">Free account</div><h2 class="disp" style="font-size:40px;margin:10px 0 6px">Sign in</h2><p class="muted">Optional. Save favorites and get a heads-up when they’re updated, on any device.</p><div class="prov">'+(P.includes('discord')?'<button class="btn go" data-prov="discord">'+svg('discord')+'Continue with Discord</button>':'')+(P.includes('google')?'<button class="btn" data-prov="google">Continue with Google</button>':'')+'</div>'+(P.includes('email')?'<form id="mail" style="margin-top:18px"><label for="em" class="muted" style="font-size:14px">Or get a sign-in link by email</label><input id="em" type="email" required placeholder="you@example.com" autocomplete="email"><button class="btn" style="width:100%">Email me a link</button></form>':'')+'<p class="muted" style="font-size:13px;margin-top:16px">See <a href="/privacy" data-link>what’s stored</a>.</p></div>'}
function afterAccount(){document.querySelectorAll('[data-prov]').forEach(b=>b.onclick=()=>S.sb&&S.sb.auth.signInWithOAuth({provider:b.dataset.prov,options:{redirectTo:location.origin+'/account'}}));
 const m=$('#mail');if(m)m.onsubmit=async e=>{e.preventDefault();if(!S.sb)return;const{error}=await S.sb.auth.signInWithOtp({email:$('#em').value,options:{emailRedirectTo:location.origin+'/account'}});toast(error?'Couldn’t send the link. Try again in a few minutes.':'Check your email for a sign-in link')};
 const o=$('#out');if(o)o.onclick=()=>S.sb.auth.signOut();
 const d=$('#del');if(d)d.onclick=async()=>{if(d.dataset.ok!=='1'){d.dataset.ok='1';d.textContent='Click again to delete';return}await S.sb.from('favorites').delete().eq('user_id',S.user.id);await S.sb.from('profiles').delete().eq('id',S.user.id);store.set('favs',[]);toast('Your saved data was deleted');S.sb.auth.signOut()}}

/* ---------- router ---------- */
let PAGE=null;
async function route(){const parts=location.pathname.replace(/\/+$/,'').split('/').filter(Boolean).map(decodeURIComponent);const m=$('#main');PAGE=null;let html;
 try{if(!parts.length)html=await pHome();else if(parts[0]==='account')html=pAccount();else if(parts[0]==='privacy')html=pPrivacy();
 else{const gid=parts[0];await loadGame(gid);if(parts.length===1)html=await pHub(gid);else if(parts[1]==='builds')html=parts[2]?await pChar(gid,parts[2],parts[3]):await pBuilds(gid);else html=parts[2]?await pPost(gid,parts[1],parts[2]):await pSection(gid,parts[1])}}catch(e){console.error(e);html=pMissing()}
 m.innerHTML=html;if(PAGE){wireViewer(PAGE.v,PAGE.title,PAGE.file);wireFav(PAGE.fk)}if(parts[1]==='builds'&&!parts[2])afterBuilds(parts[0]);if(parts[0]==='account')afterAccount();updateBell()}
document.addEventListener('click',e=>{const a=e.target.closest('a[data-link]');if(!a||e.metaKey||e.ctrlKey||e.shiftKey||a.target)return;e.preventDefault();if(a.getAttribute('href')!==location.pathname){history.pushState(null,'',a.getAttribute('href'));window.scrollTo(0,0)}route();const p=$('#bellPop');if(p)p.hidden=true});
addEventListener('popstate',route);
(async()=>{await loadSite();shell();setTheme(S.site.accent);S.favs=new Set(store.get('favs',[]));await route();if(!S.seen){S.seen=new Date(Date.now()-7*864e5).toISOString()}initAuth();
 /* first visit: everything from the last week counts as new; after that, new means newer than your last visit */
 addEventListener('pagehide',()=>{if(!S.user)store.set('seen',S.seen)})})();
})();
