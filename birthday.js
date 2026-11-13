/* PawPixl birthdays: a character's sticker peeks out from behind the Browse all builds button on their birthday.
   One file, used by the website and by the Studio's preview, so the two can never look different.
   - Birthdays come from the published game data (content/<game>/birthdays.json, written by the Studio). Nothing is hard-coded here.
   - The visitor's own calendar date decides. A 29 February birthday is kept on 28 February in years without one.
   - A sticker is shown only when the owner approved one for that character. With none, nothing peeks: no stand-in picture.
   - The greeting is PawPixl's own short line. It is never presented as something the character said.
   - No sound, no flashing, nothing full-screen. Reduced-motion visitors get a still sticker. */
(function(){
 /* The sticker lives in its own layer above the anchor (the Browse all builds button). The layer holds a clipped window
    (.bd-clip) whose bottom edge sits just under the anchor's top edge, with the anchor drawn on top of it. At rest the row
    of stickers is moved down by more than the whole window and made invisible, so nothing can show whatever the picture's
    size; peeking moves it up into the window. Nothing is ever drawn below the anchor's top edge. */
 const CSS='.bd-host{position:relative}.bd-host>.qotd,.bd-front{position:relative;z-index:1}'
 +'.bd-peek{position:absolute;z-index:0;left:0;top:0;pointer-events:none}'
 +'.bd-clip{position:absolute;inset:0;overflow:hidden}'
 +'.bd-row{position:absolute;left:0;right:0;top:0;display:flex;justify-content:center;align-items:flex-start;gap:2px;transform:translateY(var(--bd-h,400px));visibility:hidden;transition:transform .9s cubic-bezier(.2,.9,.3,1.15),visibility 0s .9s}'
 +'.bd-peek.in .bd-row{transform:translateY(var(--bd-top,22px));visibility:visible;transition:transform .9s cubic-bezier(.2,.9,.3,1.15),visibility 0s 0s}'
 +'.bd-st{all:unset;display:block;flex:none;position:relative;cursor:pointer;filter:drop-shadow(0 4px 6px rgba(0,0,0,.4))}.bd-st img{width:100%;height:100%;display:block}'
 +'.bd-peek.in .bd-st{pointer-events:auto}'
 +'.bd-st:focus-visible{outline:2px solid #5fd8ff;outline-offset:-2px}'
 +'.bd-peek.hop .bd-st{animation:bdhop .9s ease-in-out 1}.bd-peek.hop .bd-st:nth-child(2){animation-delay:.12s}.bd-peek.hop .bd-st:nth-child(3){animation-delay:.24s}'
 +'@keyframes bdhop{0%,100%{transform:translateY(0) rotate(0)}25%{transform:translateY(-8px) rotate(-4deg)}50%{transform:translateY(0) rotate(0)}75%{transform:translateY(-5px) rotate(3deg)}}'
 +'.bd-say{position:absolute;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;background:#0d1120;color:#eef1fa;border:1px solid rgba(255,255,255,.18);border-radius:12px 12px 2px 12px;padding:6px 10px;font:600 12.5px/1.3 Poppins,system-ui,sans-serif;box-shadow:0 8px 20px rgba(0,0,0,.4);opacity:0;visibility:hidden;transform:translateY(6px);transition:opacity .35s,transform .35s,visibility 0s .35s;pointer-events:none}'
 +'.bd-peek.say .bd-say{opacity:1;visibility:visible;transform:none;transition:opacity .35s,transform .35s,visibility 0s 0s}'
 +'.bd-card{position:absolute;z-index:6;right:8px;top:8px;width:min(270px,calc(100% - 16px));background:#0d1120;color:#eef1fa;border:1px solid var(--bdc,rgba(255,255,255,.2));border-radius:16px;padding:14px;box-shadow:0 18px 40px rgba(0,0,0,.55);font:14px/1.45 Poppins,system-ui,sans-serif;text-align:center}'
 +'.bd-card img{width:96px;height:96px;object-fit:contain;display:block;margin:0 auto 6px}.bd-card b{display:block;font-size:16px}.bd-card p{margin:4px 0 10px;color:#c9d0e4}'
 +'.bd-card a{display:inline-block;border:1px solid rgba(255,255,255,.25);border-radius:10px;padding:7px 12px;color:#eef1fa;text-decoration:none;font-weight:600}.bd-card a:hover{background:rgba(255,255,255,.08)}'
 +'.bd-x{all:unset;position:absolute;right:8px;top:6px;width:28px;height:28px;line-height:28px;text-align:center;border-radius:8px;cursor:pointer;color:#9aa3bd;font-size:18px}.bd-x:hover{color:#fff;background:rgba(255,255,255,.08)}.bd-x:focus-visible{outline:2px solid #5fd8ff}'
 +'.bd-cake{font-size:.5em;vertical-align:middle;margin-left:.35em;cursor:default}'
 +'@media (max-width:520px){.bd-say{font-size:11.5px}}'
 +'@media (prefers-reduced-motion:reduce){.bd-row,.bd-say{transition:none!important}.bd-peek.hop .bd-st{animation:none}}';
 /* placement, set by the owner in the Studio and published with the birthday list. anchor: which part of the button the
    sticker lines up with; x: sideways nudge in pixels; peek: how much of the sticker shows above the button (percent of its
    height); scale: size (percent). A sticker may carry its own {x, peek, scale} in "adj". */
 const PLACE={anchor:'right',x:0,peek:62,scale:100},BASE=96,ROOM=22,OVER=0;
 const num=(v,d,lo,hi)=>{v=+v;return isFinite(v)?Math.min(hi,Math.max(lo,v)):d};
 const placeOf=(a,b)=>{const p=Object.assign({},PLACE,a||{},b||{});return{anchor:/^(left|center|right)$/.test(p.anchor)?p.anchor:'right',x:num(p.x,0,-200,200),peek:num(p.peek,62,20,100),scale:num(p.scale,100,40,200)}};
 /* cut the transparent margin away so every sticker is measured by its artwork, not by the outer size of its file.
    Returns {src,w,h} or null when the file is not a picture or is completely empty. */
 function trim(src){return new Promise(res=>{const im=new Image();im.onerror=()=>res(null);im.onload=()=>{try{const W=im.naturalWidth,H=im.naturalHeight;if(!W||!H)return res(null);const k=Math.min(1,256/Math.max(W,H)),w=Math.max(1,Math.round(W*k)),h=Math.max(1,Math.round(H*k)),cv=document.createElement('canvas');cv.width=w;cv.height=h;const x=cv.getContext('2d');x.drawImage(im,0,0,w,h);const d=x.getImageData(0,0,w,h).data;let x0=w,y0=h,x1=-1,y1=-1;for(let Y=0;Y<h;Y++)for(let X=0;X<w;X++)if(d[(Y*w+X)*4+3]>10){if(X<x0)x0=X;if(X>x1)x1=X;if(Y<y0)y0=Y;if(Y>y1)y1=Y}
    if(x1<0)return res(null);if(x0===0&&y0===0&&x1===w-1&&y1===h-1&&k===1)return res({src,w,h});const c2=document.createElement('canvas');c2.width=x1-x0+1;c2.height=y1-y0+1;c2.getContext('2d').drawImage(cv,x0,y0,c2.width,c2.height,0,0,c2.width,c2.height);res({src:c2.toDataURL('image/png'),w:c2.width,h:c2.height})}catch(e){res({src,w:im.naturalWidth||1,h:im.naturalHeight||1})}};im.src=src})}
 const EC={Pyro:'#ff7a4d',Hydro:'#4db8ff',Anemo:'#5fe0c0',Electro:'#b68cff',Dendro:'#8fd14f',Cryo:'#9fe8ff',Geo:'#f0c04a'};
 const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 function css(){if(document.getElementById('bd-css'))return;const s=document.createElement('style');s.id='bd-css';s.textContent=CSS;document.head.appendChild(s)}
 const leap=y=>(y%4===0&&y%100!==0)||y%400===0;
 /* is month/day "today" on the given local date? */
 function isDay(m,d,now){now=now||new Date();const M=now.getMonth()+1,D=now.getDate();if(m===2&&d===29&&!leap(now.getFullYear()))return M===2&&D===28;return M===m&&D===d}
 function today(list,now){return(list||[]).filter(c=>c&&c.m&&c.d&&!c.off&&isDay(+c.m,+c.d,now))}
 const names=L=>L.length===1?L[0]:L.length===2?L[0]+' and '+L[1]:L.slice(0,-1).join(', ')+' and '+L[L.length-1];
 const greeting=L=>'Happy Birthday, '+names(L.map(c=>c.n))+'! 🎂';
 const reduced=()=>{try{return matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){return false}};
 const SS={get:k=>{try{return sessionStorage.getItem(k)}catch(e){return null}},set:(k,v)=>{try{sessionStorage.setItem(k,v)}catch(e){}}};
 /* mount on the element that holds the anchor. opt: {anchor: element the sticker hides behind (default: the quote box),
    place, now, load(id)->Promise<{img}>, guide(id)->href|null, force, stay, every, max}. Returns the state, with
    hold('hidden'|'peek'|'play') for the Studio's preview. */
 async function mount(box,file,opt){opt=opt||{};if(!box||!file||file.on===false)return null;const who=today(file.list,opt.now).filter(c=>c.s);unmount(box);if(!who.length)return null;
  const got=[];for(const c of who.slice(0,3)){try{const a=await opt.load(c.id);if(a&&/^data:image\/(png|webp|gif);base64,/.test(a.img||'')){const t=await trim(a.img);if(t)got.push(Object.assign({},c,{img:t.src,iw:t.w,ih:t.h,adj:Object.assign({},c.adj||{},(opt.adj||{})[c.id]||{})}))}}catch(e){}}
  if(!got.length||!box.isConnected)return null;css();box.classList.add('bd-host');
  const anc=(opt.anchor&&box.contains(opt.anchor)?opt.anchor:null)||box.querySelector('.qotd')||box.firstElementChild||box;
  const peek=document.createElement('div');peek.className='bd-peek';peek.setAttribute('data-bd-count',got.length);
  peek.innerHTML='<div class="bd-clip"><div class="bd-row">'+got.map((c,i)=>'<button type="button" class="bd-st" data-i="'+i+'" aria-label="'+esc('It’s '+c.n+'’s birthday today. Open the birthday card.')+'"><img alt="" src="'+c.img+'"></button>').join('')+'</div></div><span class="bd-say" aria-hidden="true">'+esc(greeting(got))+'</span>';
  box.insertBefore(peek,box.firstChild);const row=peek.querySelector('.bd-row'),say=peek.querySelector('.bd-say'),btns=[...peek.querySelectorAll('.bd-st')];
  const st={box,peek,anc,timers:[],shown:0,last:0,card:null,busy:0,place:placeOf(file.place,opt.place),key:'pp-bd-'+got.map(c=>c.id).join('+')+'-'+(opt.now||new Date()).toDateString()};box._bd=st;
  /* sizes and position, from the anchor's real place on screen. Run again whenever the window changes. */
  let front=null;
  function place(){if(!anc.isConnected)return;const P=st.place,a=anc.getBoundingClientRect(),h=box.getBoundingClientRect(),small=innerWidth<=520?.8:1;
   /* stacked layout (phone): something else sits right on top of the anchor, so rise from the top of the row instead */
   const stacked=anc!==box&&a.top-h.top>8,topY=stacked?0:a.top-h.top,fr=stacked?[].find.call(box.children,x=>x!==peek&&!x.classList.contains('bd-card')):anc;/* the window ends exactly at that element's top edge, so the sticker never overlaps it and the page's own stacking is left exactly as it is */
   let vis=0,rowW=0;const geo=got.map((c,i)=>{const A=placeOf(P,c.adj),sc=A.scale/100*small;let hh=BASE*sc,ww=hh*c.iw/c.ih;const cap=BASE*1.6*sc;if(ww>cap){ww=cap;hh=ww*c.ih/c.iw}const v=hh*A.peek/100;vis=Math.max(vis,v);rowW+=ww+(i?2:0);return{ww,hh,v,dx:(c.adj&&isFinite(+c.adj.x))?num(c.adj.x,0,-200,200):0}});
   geo.forEach((g,i)=>{const b=btns[i];b.style.width=Math.round(g.ww)+'px';b.style.height=Math.round(g.hh)+'px';b.style.marginTop=Math.round(vis-g.v)+'px';b.style.left=g.dx+'px'});
   const W=Math.ceil(rowW)+28,H=Math.ceil(ROOM+vis+OVER);/* keep clear of the anchor's rounded corners, so the straight bottom edge of the window always meets a straight piece of the anchor */const rad=Math.min(a.width/4,parseFloat(getComputedStyle(fr||anc).borderTopRightRadius)||0);let L=P.anchor==='left'?a.left-h.left-14+rad+P.x:P.anchor==='center'?a.left-h.left+a.width/2-W/2+P.x:a.right-h.left-W+14-rad+P.x;L=Math.max(4-h.left,Math.min(L,innerWidth-4-h.left-W));
   peek.style.left=Math.round(L)+'px';peek.style.top=(topY+OVER-H)+'px';peek.style.width=W+'px';peek.style.height=H+'px';peek.style.setProperty('--bd-h',(H+40)+'px');peek.style.setProperty('--bd-top',ROOM+'px');
   /* greeting: beside the sticker when there is room on its left, otherwise above it */
   const free=h.left+L-8;if(free>=150){say.style.cssText='right:calc(100% + 4px);bottom:'+(OVER+10)+'px;max-width:'+Math.min(260,Math.floor(free))+'px'}else{say.style.cssText='right:0;bottom:calc(100% + 2px);max-width:'+Math.max(120,Math.floor(Math.min(innerWidth-12,h.left+L+W-8)))+'px'}
   st.geo={W,H,vis,top:topY}}
  st.place_=place;place();addEventListener('resize',place);
  const T=(fn,ms)=>{const t=setTimeout(fn,ms);st.timers.push(t);return t};const stay=opt.stay||7000,calm=reduced();
  const hide=()=>{peek.classList.remove('in','hop','say')};
  const show=()=>{if(st.card||document.hidden)return;place();st.shown++;st.last=Date.now();SS.set(st.key,String(st.shown));peek.classList.add('in');if(calm){peek.classList.add('say');return}T(()=>peek.classList.add('hop'),950);T(()=>peek.classList.add('say'),1500);T(()=>{if(!st.card&&!peek.matches(':hover')&&!peek.contains(document.activeElement))hide()},1500+stay)};
  st.show=show;st.hide=hide;
  /* for the Studio's preview: hold a state still, or play the whole thing again */
  st.hold=k=>{st.timers.forEach(clearTimeout);st.timers=[];if(st.iv){clearInterval(st.iv);st.iv=0}place();if(k==='hidden'){hide();return}if(k==='peek'){peek.classList.remove('hop');peek.classList.add('in','say');return}hide();T(show,350)};
  st.setPlace=(p,adj)=>{st.place=placeOf(p);if(adj)got.forEach(c=>{if(adj[c.id]!==undefined)c.adj=adj[c.id]||{}});place()};
  /* the visitor is busy while typing, scrolling or pressing: never start an appearance then */
  const busy=()=>{st.busy=Date.now()};['scroll','keydown','pointerdown','wheel','touchstart'].forEach(e=>addEventListener(e,busy,{passive:true}));
  const vis=()=>{if(document.hidden&&!calm&&!st.card)hide()};document.addEventListener('visibilitychange',vis);
  st.off=()=>{removeEventListener('resize',place);st.timers.forEach(clearTimeout);if(st.iv)clearInterval(st.iv);['scroll','keydown','pointerdown','wheel','touchstart'].forEach(e=>removeEventListener(e,busy));document.removeEventListener('visibilitychange',vis);document.removeEventListener('keydown',st.esc);document.removeEventListener('pointerdown',st.out)};
  /* once per session for this birthday, then at most a few quiet reappearances on a long visit */
  const seen=+(SS.get(st.key)||0),max=opt.max||3,every=opt.every||240000;st.shown=opt.force?0:seen;
  if(opt.force||!seen)T(show,opt.force?150:1400);else if(calm)show();
  st.iv=setInterval(()=>{if(calm||st.card||document.hidden||peek.classList.contains('in'))return;if(st.shown>=max)return;if(Date.now()-st.last<every||Date.now()-st.busy<4000)return;show()},5000);
  const close=()=>{if(!st.card)return;st.card.remove();st.card=null;const f=st.from;if(f&&f.isConnected)f.focus();if(!calm)T(hide,1200)};st.close=close;
  st.esc=e=>{if(e.key==='Escape'&&st.card){e.stopPropagation();close()}};st.out=e=>{if(st.card&&!st.card.contains(e.target)&&!peek.contains(e.target))close()};document.addEventListener('keydown',st.esc);document.addEventListener('pointerdown',st.out);
  peek.addEventListener('click',e=>{const b=e.target.closest('.bd-st');if(!b)return;const c=got[+b.dataset.i];if(st.card){close();return}st.from=b;const href=opt.guide?opt.guide(c.id):null;
   const card=document.createElement('div');card.className='bd-card';card.setAttribute('role','dialog');card.setAttribute('aria-label',c.n+'’s birthday');card.style.setProperty('--bdc',EC[c.el]||'rgba(255,255,255,.2)');
   card.innerHTML='<button type="button" class="bd-x" aria-label="Close the birthday card">×</button><img alt="'+esc(c.n+' sticker')+'" src="'+c.img+'"><b>'+esc(c.n)+'</b><p>'+esc(greeting([c]))+'</p>'+(href?'<a href="'+esc(href)+'">'+esc('See '+c.n+'’s guide')+'</a>':'');
   box.appendChild(card);if(anc!==box){const a=anc.getBoundingClientRect(),h=box.getBoundingClientRect();card.style.top=Math.round(a.bottom-h.top+8)+'px'}st.card=card;peek.classList.add('in','say');card.querySelector('.bd-x').onclick=close;card.querySelector('.bd-x').focus();const im=card.querySelector('img');im.onerror=()=>im.remove()});
  return st}
 function unmount(box){if(!box)return;const st=box._bd;if(st){st.off();if(st.card)st.card.remove();if(st.peek)st.peek.remove();box._bd=null}box.querySelectorAll&&box.querySelectorAll('.bd-peek,.bd-card').forEach(x=>x.remove())}
 /* the small cake beside a name on that character's own guide page, today only */
 function cake(el,file,id,now){if(!el||!file||file.on===false)return false;const c=(file.list||[]).find(x=>x.id===id);const on=!!(c&&!c.off&&c.m&&isDay(+c.m,+c.d,now));if(on){css();el.className='bd-cake';el.hidden=false;el.textContent='🎂';el.setAttribute('role','img');el.setAttribute('aria-label','It’s '+c.n+'’s birthday today');el.title='It’s '+c.n+'’s birthday today'}else{el.hidden=true;el.textContent=''}return on}
 /* ?bday=MM-DD on the address previews another day without changing anything (used by the Studio's Test Birthday) */
 function dateFromQuery(q){const m=/(?:^|[?&])bday=(\d{1,2})-(\d{1,2})(?:&|$)/.exec(String(q||''));if(!m)return null;const d=new Date();d.setDate(1);d.setMonth(+m[1]-1);d.setDate(+m[2]);return d}
 window.PPBday={isDay,today,greeting,mount,unmount,cake,dateFromQuery,trim,placeOf,PLACE};
})();
