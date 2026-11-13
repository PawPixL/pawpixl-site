/* PawPixl birthdays: a character's sticker peeks out from behind the quote box on their birthday.
   One file, used by the website and by the Studio's preview, so the two can never look different.
   - Birthdays come from the published game data (content/<game>/birthdays.json, written by the Studio). Nothing is hard-coded here.
   - The visitor's own calendar date decides. A 29 February birthday is kept on 28 February in years without one.
   - A sticker is shown only when the owner approved one for that character. With none, nothing peeks: no stand-in picture.
   - The greeting is PawPixl's own short line. It is never presented as something the character said.
   - No sound, no flashing, nothing full-screen. Reduced-motion visitors get a still sticker. */
(function(){
 const CSS='.bd-host{position:relative}.bd-host>.qotd{position:relative;z-index:1}'
 +'.bd-peek{position:absolute;right:20px;top:0;z-index:0;display:flex;gap:2px;transform:translateY(4px);transition:transform .9s cubic-bezier(.2,.9,.3,1.15);pointer-events:none}'
 +'.bd-peek.in{transform:translateY(-58%);pointer-events:auto}'
 +'.bd-st{all:unset;display:block;width:64px;height:64px;cursor:pointer;border-radius:14px;filter:drop-shadow(0 6px 10px rgba(0,0,0,.45))}.bd-st img{width:100%;height:100%;object-fit:contain;display:block}'
 +'.bd-st:focus-visible{outline:2px solid #5fd8ff;outline-offset:2px}'
 +'.bd-peek.hop .bd-st{animation:bdhop .9s ease-in-out 1}.bd-peek.hop .bd-st:nth-child(2){animation-delay:.12s}.bd-peek.hop .bd-st:nth-child(3){animation-delay:.24s}'
 +'@keyframes bdhop{0%,100%{transform:translateY(0) rotate(0)}25%{transform:translateY(-9px) rotate(-5deg)}50%{transform:translateY(0) rotate(0)}75%{transform:translateY(-6px) rotate(4deg)}}'
 +'.bd-say{position:absolute;right:calc(100% + 6px);top:4px;white-space:nowrap;max-width:min(240px,60vw);overflow:hidden;text-overflow:ellipsis;background:#0d1120;color:#eef1fa;border:1px solid rgba(255,255,255,.18);border-radius:12px 12px 2px 12px;padding:6px 10px;font:600 12.5px/1.3 Poppins,system-ui,sans-serif;box-shadow:0 8px 20px rgba(0,0,0,.4);opacity:0;transform:translateY(6px);transition:opacity .35s,transform .35s;pointer-events:none}'
 +'.bd-peek.say .bd-say{opacity:1;transform:none}'
 +'.bd-card{position:absolute;z-index:6;right:8px;top:8px;width:min(270px,calc(100% - 16px));background:#0d1120;color:#eef1fa;border:1px solid var(--bdc,rgba(255,255,255,.2));border-radius:16px;padding:14px;box-shadow:0 18px 40px rgba(0,0,0,.55);font:14px/1.45 Poppins,system-ui,sans-serif;text-align:center}'
 +'.bd-card img{width:96px;height:96px;object-fit:contain;display:block;margin:0 auto 6px}.bd-card b{display:block;font-size:16px}.bd-card p{margin:4px 0 10px;color:#c9d0e4}'
 +'.bd-card a{display:inline-block;border:1px solid rgba(255,255,255,.25);border-radius:10px;padding:7px 12px;color:#eef1fa;text-decoration:none;font-weight:600}.bd-card a:hover{background:rgba(255,255,255,.08)}'
 +'.bd-x{all:unset;position:absolute;right:8px;top:6px;width:28px;height:28px;line-height:28px;text-align:center;border-radius:8px;cursor:pointer;color:#9aa3bd;font-size:18px}.bd-x:hover{color:#fff;background:rgba(255,255,255,.08)}.bd-x:focus-visible{outline:2px solid #5fd8ff}'
 +'.bd-cake{font-size:.5em;vertical-align:middle;margin-left:.35em;cursor:default}'
 +'@media (max-width:520px){.bd-peek{right:12px}.bd-st{width:52px;height:52px}.bd-say{font-size:11.5px}}'
 +'@media (prefers-reduced-motion:reduce){.bd-peek,.bd-say{transition:none}.bd-peek.hop .bd-st{animation:none}}';
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
 /* mount on the element that holds the quote box. opt: {now, load(id)->Promise<{img}>, guide(id)->href|null, force, stay, every, max} */
 async function mount(box,file,opt){opt=opt||{};if(!box||!file||file.on===false)return null;const who=today(file.list,opt.now).filter(c=>c.s);unmount(box);if(!who.length)return null;
  const got=[];for(const c of who.slice(0,3)){try{const a=await opt.load(c.id);if(a&&/^data:image\/(png|webp|gif);base64,/.test(a.img||''))got.push(Object.assign({},c,{img:a.img}))}catch(e){}}
  if(!got.length||!box.isConnected)return null;css();box.classList.add('bd-host');
  const peek=document.createElement('div');peek.className='bd-peek';peek.setAttribute('data-bd-count',got.length);
  peek.innerHTML='<span class="bd-say" aria-hidden="true">'+esc(greeting(got))+'</span>'+got.map((c,i)=>'<button type="button" class="bd-st" data-i="'+i+'" aria-label="'+esc('It’s '+c.n+'’s birthday today. Open the birthday card.')+'"><img alt="" src="'+c.img+'"></button>').join('');
  box.insertBefore(peek,box.firstChild);
  /* a picture that fails to draw is taken away; if none is left, so is the whole thing */
  peek.querySelectorAll('img').forEach(im=>{im.onerror=()=>{const b=im.closest('.bd-st');if(b)b.remove();if(!peek.querySelector('.bd-st'))unmount(box)}});
  const st={box,peek,timers:[],shown:0,last:0,card:null,busy:0,key:'pp-bd-'+got.map(c=>c.id).join('+')+'-'+(opt.now||new Date()).toDateString()};box._bd=st;
  const T=(fn,ms)=>{const t=setTimeout(fn,ms);st.timers.push(t);return t};const stay=opt.stay||7000,calm=reduced();
  const hide=()=>{peek.classList.remove('in','hop','say')};
  const show=()=>{if(st.card||document.hidden)return;st.shown++;st.last=Date.now();SS.set(st.key,String(st.shown));peek.classList.add('in');if(calm){peek.classList.add('say');return}T(()=>peek.classList.add('hop'),950);T(()=>peek.classList.add('say'),1500);T(()=>{if(!st.card&&!peek.matches(':hover')&&!peek.contains(document.activeElement))hide()},1500+stay)};
  st.show=show;st.hide=hide;
  /* the visitor is busy while typing, scrolling or pressing: never start an appearance then */
  const busy=()=>{st.busy=Date.now()};['scroll','keydown','pointerdown','wheel','touchstart'].forEach(e=>addEventListener(e,busy,{passive:true}));
  const vis=()=>{if(document.hidden&&!calm&&!st.card)hide()};document.addEventListener('visibilitychange',vis);
  st.off=()=>{st.timers.forEach(clearTimeout);if(st.iv)clearInterval(st.iv);['scroll','keydown','pointerdown','wheel','touchstart'].forEach(e=>removeEventListener(e,busy));document.removeEventListener('visibilitychange',vis);document.removeEventListener('keydown',st.esc);document.removeEventListener('pointerdown',st.out)};
  /* once per session for this birthday, then at most a few quiet reappearances on a long visit */
  const seen=+(SS.get(st.key)||0),max=opt.max||3,every=opt.every||240000;st.shown=opt.force?0:seen;
  if(opt.force||!seen)T(show,opt.force?150:1400);else if(calm)show();
  st.iv=setInterval(()=>{if(calm||st.card||document.hidden||peek.classList.contains('in'))return;if(st.shown>=max)return;if(Date.now()-st.last<every||Date.now()-st.busy<4000)return;show()},5000);
  const close=()=>{if(!st.card)return;st.card.remove();st.card=null;const f=st.from;if(f&&f.isConnected)f.focus();if(!calm)T(hide,1200)};st.close=close;
  st.esc=e=>{if(e.key==='Escape'&&st.card){e.stopPropagation();close()}};st.out=e=>{if(st.card&&!st.card.contains(e.target)&&!peek.contains(e.target))close()};document.addEventListener('keydown',st.esc);document.addEventListener('pointerdown',st.out);
  peek.addEventListener('click',e=>{const b=e.target.closest('.bd-st');if(!b)return;const c=got[+b.dataset.i];if(st.card){close();return}st.from=b;const href=opt.guide?opt.guide(c.id):null;
   const card=document.createElement('div');card.className='bd-card';card.setAttribute('role','dialog');card.setAttribute('aria-label',c.n+'’s birthday');card.style.setProperty('--bdc',EC[c.el]||'rgba(255,255,255,.2)');
   card.innerHTML='<button type="button" class="bd-x" aria-label="Close the birthday card">×</button><img alt="'+esc(c.n+' sticker')+'" src="'+c.img+'"><b>'+esc(c.n)+'</b><p>'+esc(greeting([c]))+'</p>'+(href?'<a href="'+esc(href)+'">'+esc('See '+c.n+'’s guide')+'</a>':'');
   box.appendChild(card);st.card=card;peek.classList.add('in','say');card.querySelector('.bd-x').onclick=close;card.querySelector('.bd-x').focus();const im=card.querySelector('img');im.onerror=()=>im.remove()});
  return st}
 function unmount(box){if(!box)return;const st=box._bd;if(st){st.off();if(st.card)st.card.remove();if(st.peek)st.peek.remove();box._bd=null}box.querySelectorAll&&box.querySelectorAll('.bd-peek,.bd-card').forEach(x=>x.remove())}
 /* the small cake beside a name on that character's own guide page, today only */
 function cake(el,file,id,now){if(!el||!file||file.on===false)return false;const c=(file.list||[]).find(x=>x.id===id);const on=!!(c&&!c.off&&c.m&&isDay(+c.m,+c.d,now));if(on){css();el.className='bd-cake';el.hidden=false;el.textContent='🎂';el.setAttribute('role','img');el.setAttribute('aria-label','It’s '+c.n+'’s birthday today');el.title='It’s '+c.n+'’s birthday today'}else{el.hidden=true;el.textContent=''}return on}
 /* ?bday=MM-DD on the address previews another day without changing anything (used by the Studio's Test Birthday) */
 function dateFromQuery(q){const m=/(?:^|[?&])bday=(\d{1,2})-(\d{1,2})(?:&|$)/.exec(String(q||''));if(!m)return null;const d=new Date();d.setDate(1);d.setMonth(+m[1]-1);d.setDate(+m[2]);return d}
 window.PPBday={isDay,today,greeting,mount,unmount,cake,dateFromQuery};
})();
