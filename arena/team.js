/* PawPixl Arena: build your own team.
   A visitor picks any four characters, sees each one's abilities (the game's own text) and which elemental reactions the
   team's elements can make, then lines up their own order of attacks, skills and bursts and watches it play.
   Nothing here is a PawPixl rotation: the order is the visitor's own and the screen says so. No damage, no timings, no
   guessed combos. If PawPixl has a checked rotation for the exact same four, the screen offers it. */
(function(){
'use strict';
const ELC={Pyro:'#ff8a3d',Hydro:'#43b4ff',Anemo:'#3fe0bf',Electro:'#b77cff',Dendro:'#8fd14f',Cryo:'#9fe6ff',Geo:'#f2c14e'};
const ELS=['Pyro','Hydro','Anemo','Electro','Dendro','Cryo','Geo'];
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
/* which two elements make which reaction (the game's basic reaction table) */
const PAIRS=[['Vaporize','Pyro','Hydro'],['Melt','Pyro','Cryo'],['Overloaded','Pyro','Electro'],['Burning','Pyro','Dendro'],['Frozen','Hydro','Cryo'],['Electro-Charged','Hydro','Electro'],['Bloom','Hydro','Dendro'],['Superconduct','Electro','Cryo'],['Quicken','Electro','Dendro']];
const SPREADS=['Pyro','Hydro','Electro','Cryo'];
const RESO={Pyro:'Fervent Flames',Hydro:'Soothing Water',Cryo:'Shattering Ice',Electro:'High Voltage',Anemo:'Impetuous Winds',Geo:'Enduring Rock',Dendro:'Sprawling Greenery'};
/* every basic reaction a set of elements can make, with the elements each one needs */
function reactions(els){const S=new Set(els),out=[];PAIRS.forEach(([n,a,b])=>{if(S.has(a)&&S.has(b))out.push({name:n,els:[a,b]})});
 const sp=SPREADS.filter(e=>S.has(e));if(S.has('Anemo')&&sp.length)out.push({name:'Swirl',els:['Anemo'].concat(sp)});if(S.has('Geo')&&sp.length)out.push({name:'Crystallize',els:['Geo'].concat(sp)});
 if(S.has('Hydro')&&S.has('Dendro')){if(S.has('Pyro'))out.push({name:'Burgeon',els:['Hydro','Dendro','Pyro'],via:'Bloom'});if(S.has('Electro'))out.push({name:'Hyperbloom',els:['Hydro','Dendro','Electro'],via:'Bloom'})}
 if(S.has('Electro')&&S.has('Dendro')){out.push({name:'Aggravate',els:['Electro','Dendro'],via:'Quicken'});out.push({name:'Spread',els:['Electro','Dendro'],via:'Quicken'})}return out}
/* reactions a party member's own ability text says they change ("Electro-Charged ... converted into the Lunar-Charged reaction"), when the team's elements can make the original */
function special(team,els,book){if(!book||!book.conv)return[];const base=new Set();reactions(els).forEach(r=>{base.add(r.name);if(r.name==='Swirl'||r.name==='Crystallize')r.els.slice(1).forEach(e=>base.add(e+' '+r.name))});
 return book.conv.filter(c=>base.has(c.from)).map(c=>({from:c.from,to:c.to,who:c.who.filter(w=>team.includes(w[0]))})).filter(c=>c.who.length)}
/* Elemental Resonance needs a full party of four: two or more of one element, or four different elements */
function resonance(els){if(els.length!==4)return[];const n={};els.forEach(e=>{n[e]=(n[e]||0)+1});const out=Object.keys(n).filter(e=>n[e]>=2&&RESO[e]).map(e=>({name:RESO[e],el:e}));if(Object.keys(n).length===4)out.push({name:'Protective Canopy',el:''});return out}
const ACTS=[['n','na','Normal Attack','attack'],['c','na','Charged Attack','attack'],['e','e','Elemental Skill','skill'],['q','q','Elemental Burst','burst'],['p','na','Plunging Attack','plunge']];
const ACT=Object.fromEntries(ACTS.map(a=>[a[0],a]));const MAXSTEPS=40;
/* the order as a short string for links: member number + action letter, e.g. "0e.1q.0n" */
const packSeq=L=>L.map(s=>s.m+s.a).join('.');
function readSeq(str,n){const out=[];String(str||'').split('.').forEach(x=>{const m=x.match(/^([0-3])([nceqp])$/);if(m&&+m[1]<n&&out.length<MAXSTEPS)out.push({m:+m[1],a:m[2]})});return out}
const readTeam=(str,ok)=>{const out=[];String(str||'').split('_').forEach(id=>{if(/^[a-z0-9]+$/.test(id)&&ok(id)&&!out.includes(id)&&out.length<4)out.push(id)});return out};

function mount(root,o){const chars=o.chars||[],by=new Map(chars.map(c=>[c.id,c]));const st={team:readTeam(o.team,id=>by.has(id)),seq:[],slot:-1,q:'',el:'',step:-1,playing:false};st.seq=readSeq(o.seq,st.team.length);
 const KITS={};let pty=null,timer=0,dead=false,raf=0;const PS=window.PPStage,X=window.PPArenaArt;
 const calm=()=>{try{return(PS&&PS.calm())||matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){return false}};
 const sfx=(n,p)=>{try{window.PPSfx&&PPSfx.play(n,p)}catch(e){}};
 const mem=i=>by.get(st.team[i]);const fig=(c,cls,name)=>PS?PS.figure(c,{icon:o.iconOf(c.name),body:o.bodyOf(c.name),cls,name}):'<b>'+esc(c.name)+'</b>';
 const face=c=>'<span class="ct-face" style="--c:'+(ELC[c.el]||'#999')+'"><i>'+esc(c.name[0])+'</i>'+(o.iconOf(c.name)?'<img src="'+esc(o.iconOf(c.name))+'" alt="" loading="lazy">':'')+'</span>';
 const chip=el=>'<span class="ar-el" style="--c:'+(ELC[el]||'#999')+'">'+esc(el)+'</span>';
 const abName=(i,a)=>{const k=KITS[st.team[i]],ab=k&&(k.abilities||[]).find(x=>x.slot===ACT[a][1]);return ab?ab.name:''};
 const sync=()=>{if(o.onChange)o.onChange({team:st.team.join('_'),seq:packSeq(st.seq)})};
 const loadKits=()=>Promise.all(st.team.map(id=>KITS[id]?null:o.loadKit(id).then(k=>{if(k)KITS[id]=k}).catch(()=>{})));
 function stop(){clearTimeout(timer);timer=0;st.playing=false}
 /* ---- screens ---- */
 function slots(){return'<div class="ct-slots">'+[0,1,2,3].map(i=>{const c=mem(i);return c?'<div class="ct-slot" style="--c:'+(ELC[c.el]||'#999')+'">'+fig(c,'ct-fig')+'<b>'+esc(c.name)+'</b>'+chip(c.el)+'<span class="ct-sb"><button type="button" class="ar-link" data-pick="'+i+'">Change</button><button type="button" class="ar-link" data-rm="'+i+'" aria-label="Remove '+esc(c.name)+'">Remove</button></span></div>':'<button type="button" class="ct-slot ct-add" data-pick="'+i+'"><span class="ct-plus" aria-hidden="true">+</span><b>Add a character</b></button>'}).join('')+'</div>'}
 function picker(){const q=st.q.toLowerCase();const L=chars.filter(c=>(!st.el||c.el===st.el)&&(!q||c.name.toLowerCase().includes(q))).sort((a,b)=>a.name.localeCompare(b.name));
  return'<div class="ct-pick" role="dialog" aria-label="Pick a character"><div class="ct-pickh"><b>Pick a character for slot '+(st.slot+1)+'</b><button type="button" class="btn ghost sm" data-px aria-label="Close">✕</button></div><input type="search" class="search" id="ct-q" placeholder="Search by name" aria-label="Search by name" value="'+esc(st.q)+'"><div class="ar-seg ct-els" role="radiogroup" aria-label="Element"><button type="button" role="radio" aria-checked="'+(!st.el)+'" data-el="">All</button>'+ELS.map(e=>'<button type="button" role="radio" aria-checked="'+(st.el===e)+'" data-el="'+e+'" style="--c:'+ELC[e]+'">'+e+'</button>').join('')+'</div><div class="ct-grid" id="ct-grid">'+grid(L)+'</div></div>'}
 const grid=L=>L.length?L.map(c=>{const used=st.team.includes(c.id)&&st.team[st.slot]!==c.id;return'<button type="button" data-ch="'+esc(c.id)+'"'+(used?' disabled title="Already in the team"':'')+(st.team[st.slot]===c.id?' aria-current="true"':'')+'>'+face(c)+'<span>'+esc(c.name)+'</span></button>'}).join(''):'<p class="muted">No character matches.</p>';
 function glance(){const T=st.team.map(id=>by.get(id)),els=T.map(c=>c.el),R=reactions(els),RS=resonance(els);const who=e=>T.filter(c=>c.el===e).map(c=>c.name).join(', ');const CV=special(st.team,els,o.book);
  return'<section class="ar-block ct-sec"><h3 class="ar-bh">What this team can do together</h3>'
   +(T.length<4?'<p class="ar-note">Add '+(4-T.length)+' more to see Elemental Resonance. Reactions are listed as soon as two different elements are in.</p>':RS.length?'<p class="ct-res"><b>Elemental Resonance:</b> '+RS.map(r=>'<span class="ar-el" style="--c:'+(ELC[r.el]||'#e8b765')+'">'+esc(r.name)+'</span>').join(' ')+'</p>':'<p class="ct-res"><b>Elemental Resonance:</b> none (it needs two characters of one element, or four different elements).</p>')
   +(R.length?'<ul class="ct-rx">'+R.map(r=>'<li><b>'+esc(r.name)+'</b><span>'+r.els.map(chip).join(' + ')+(r.via?' <small>after '+esc(r.via)+'</small>':'')+'</span><small>'+r.els.map(e=>esc(who(e))).join(' · ')+'</small></li>').join('')+'</ul>':T.length>1?'<p class="ar-note">These elements don’t react with each other.</p>':'')
   +(CV.length?'<ul class="ct-rx ct-cv">'+CV.map(c=>'<li><b>'+esc(c.to)+'</b><span>replaces '+esc(c.from)+'</span><small>'+esc(c.who.map(w=>(by.get(w[0])||{}).name||w[0]).join(', '))+' (from their ability text)</small></li>').join('')+'</ul>':'')
   +(o.openDummy?'<p><button type="button" class="btn ghost sm" data-dummy>Practice these reactions on the training dummy</button></p>':'')
   +'<p class="ar-note">This lists the basic elemental reactions the team’s elements can make. Whether a reaction happens in a fight depends on who hits first and how often. Reactions that belong to one character’s kit are described in that character’s abilities.</p></section>'}
 function kits(){return'<section class="ar-block ct-sec"><h3 class="ar-bh">Abilities</h3>'+st.team.map((id,i)=>{const c=by.get(id),k=KITS[id];const ab=s=>k&&(k.abilities||[]).find(a=>a.slot===s);
   return'<details class="ct-kit" style="--c:'+(ELC[c.el]||'#999')+'"'+(st.open===id?' open':'')+' data-kd="'+esc(id)+'"><summary>'+face(c)+'<b>'+esc(c.name)+'</b>'+chip(c.el)+'</summary>'+(k?['na','e','q'].map(s=>{const a=ab(s);return a?'<article class="ct-ab"><header><b>'+esc(a.name)+'</b><small>'+esc(a.type||'')+'</small></header>'+(a.simple?'<p>'+esc(a.simple)+'</p>':'<p class="ct-canon">'+esc(a.canon||'')+'</p><small class="ct-off">Official game text</small>')+'</article>':''}).join('')+'<button type="button" class="btn ghost sm" data-fk="'+esc(id)+'">Passives and constellations</button>':'<p class="muted">Loading '+esc(c.name)+'’s abilities…</p>')+'</details>'}).join('')+'</section>'}
 function order(){const T=st.team.map(id=>by.get(id));if(!T.length)return'';const am=st.am!=null&&st.am<T.length?st.am:0;
  return'<section class="ar-block ct-sec" id="ct-order"><h3 class="ar-bh">Your own order</h3><p class="ct-own"><b>Your own order.</b> PawPixl hasn’t checked it, and nothing here measures damage or timing. It is for trying ideas and remembering them.</p>'
   +'<div class="ct-stage"'+(st.seq.length?'':' hidden')+'><div class="ar-scene ct-scene"><canvas width="256" height="144" aria-hidden="true"></canvas><div class="ct-cap" role="status" aria-live="polite"></div></div><div class="ct-ctl"><button type="button" class="btn" data-play>Play</button><button type="button" class="btn ghost" data-prev aria-label="Previous step">◀</button><button type="button" class="btn ghost" data-next aria-label="Next step">▶</button><span class="ct-pos" aria-hidden="true"></span>'+(PS?PS.settingsBtn():'')+'</div></div>'
   +'<div class="ct-addr"><span class="ct-lab">1. Who acts</span><div class="ct-who" role="radiogroup" aria-label="Who acts">'+T.map((c,i)=>'<button type="button" role="radio" aria-checked="'+(i===am)+'" data-am="'+i+'" style="--c:'+(ELC[c.el]||'#999')+'">'+face(c)+'<span>'+esc(c.name)+'</span></button>').join('')+'</div><span class="ct-lab">2. What they do</span><div class="ct-acts">'+ACTS.map(a=>'<button type="button" class="btn ghost" data-add="'+a[0]+'"'+(st.seq.length>=MAXSTEPS?' disabled':'')+'><b>'+a[2]+'</b><small>'+esc(abName(am,a[0])||'')+'</small></button>').join('')+'</div></div>'
   +(st.seq.length?'<ol class="ct-seq">'+st.seq.map((s,i)=>{const c=T[s.m];return c?'<li data-si="'+i+'" style="--c:'+(ELC[c.el]||'#999')+'"><button type="button" class="ct-go" data-go="'+i+'">'+face(c)+'<span><b>'+esc(c.name)+'</b><small>'+ACT[s.a][2]+(abName(s.m,s.a)?': '+esc(abName(s.m,s.a)):'')+'</small></span></button><span class="ct-mv"><button type="button" data-up="'+i+'" aria-label="Move step '+(i+1)+' up"'+(i?'':' disabled')+'>↑</button><button type="button" data-dn="'+i+'" aria-label="Move step '+(i+1)+' down"'+(i<st.seq.length-1?'':' disabled')+'>↓</button><button type="button" data-del="'+i+'" aria-label="Remove step '+(i+1)+'">✕</button></span></li>':''}).join('')+'</ol><div class="ar-nav ar-wrap"><button type="button" class="btn ghost" data-share>Copy link to this team and order</button><button type="button" class="btn ghost" data-clear>Clear the order</button></div>':'<p class="ar-note">Pick who acts, then what they do. Each tap adds a step. You can reorder or remove steps afterwards.</p>')+'</section>'}
 function render(keep){if(dead)return;const y=keep?window.scrollY:null;stop();if(pty){pty.destroy();pty=null}cancelAnimationFrame(raf);const T=st.team;const m=T.length===4&&o.match?o.match(T):null;
  root.innerHTML='<div class="ct"><div class="ar-top"><div><h2 class="ar-h">Build your own team</h2><p class="muted ar-sub">Pick any four characters. See what they do and how their elements react, then try your own order.</p></div><span class="ct-tag">Your own team · not checked by PawPixl</span></div>'+(o.banner?o.banner({team:st.team.join('_'),seq:packSeq(st.seq)}):'')
   +slots()+(st.slot>=0?picker():'')
   +(m?'<p class="ar-pv ct-match"><b>PawPixl has a checked rotation for these four:</b> '+esc(m.name)+' <button type="button" class="btn sm" data-open>Open it</button></p>':'')
   +(T.length?glance()+kits()+order():'<p class="ar-note">Start by adding a character. Every released character is here.</p>')
   +'<div class="ar-nav"><button type="button" class="btn ghost" data-back>Back to the Rotation Coach</button></div></div>';
  if(PS)PS.wireFig(root);root.querySelectorAll('.ct-face img').forEach(x=>x.addEventListener('error',()=>x.remove()));
  stage();paint(false);sync();if(y!=null)window.scrollTo(0,y);const qi=root.querySelector('#ct-q');if(qi&&st.focusQ){qi.focus();qi.setSelectionRange(qi.value.length,qi.value.length);st.focusQ=false}}
 /* ---- the little stage: the same training ground as the Coach, with the four figures ---- */
 let hitAt=0;function stage(){const sc=root.querySelector('.ct-scene');if(!sc||!st.seq.length)return;const cv=sc.querySelector('canvas'),g=cv.getContext('2d');const T=st.team.map(id=>by.get(id));
  if(PS)pty=PS.party(sc,T,o.iconOf,o.bodyOf);const bg=X?X.ground(256,144):null;
  const draw=ms=>{if(dead||!document.body.contains(cv))return;g.imageSmoothingEnabled=false;g.clearRect(0,0,256,144);if(bg)g.drawImage(bg,0,0);else{g.fillStyle='#1b2238';g.fillRect(0,0,256,144)}const since=ms-hitAt;if(X)X.dummy(g,180,101,hitAt&&since<130?'hit':'idle',calm()?0:ms/1000,{flash:since<90});if(hitAt&&since<400||!calm())raf=requestAnimationFrame(draw)};raf=requestAnimationFrame(draw);
  stage.kick=()=>{hitAt=performance.now();cancelAnimationFrame(raf);raf=requestAnimationFrame(draw)}}
 function paint(animate){const cap=root.querySelector('.ct-cap'),pos=root.querySelector('.ct-pos'),pb=root.querySelector('[data-play]');const T=st.team.map(id=>by.get(id));const s=st.seq[st.step];
  root.querySelectorAll('.ct-seq li').forEach((li,i)=>li.classList.toggle('on',i===st.step));if(pb)pb.textContent=st.playing?'Pause':st.step>=st.seq.length-1&&st.step>=0?'Play again':'Play';if(pos)pos.textContent=st.seq.length?(st.step<0?'Ready':'Step '+(st.step+1)+' of '+st.seq.length):'';
  if(!s||!T[s.m]){if(cap)cap.textContent=st.seq.length?'Press Play to watch your order.':'';if(pty)pty.set(null);return}const c=T[s.m],a=ACT[s.a],nm=abName(s.m,s.a);
  if(cap)cap.innerHTML='<b style="color:'+(ELC[c.el]||'#fff')+'">'+esc(c.name)+'</b> · '+a[2]+(nm?': '+esc(nm):'');if(pty)pty.set(c,a[3],!!animate);
  if(animate){sfx(a[3]==='burst'?'burst':a[3]==='skill'?'skill':'attack',{el:c.el});setTimeout(()=>{if(!dead&&stage.kick){stage.kick();sfx('hit')}},calm()?0:430);const li=root.querySelector('.ct-seq li.on');if(li&&st.playing&&li.scrollIntoView)try{li.scrollIntoView({block:'nearest'})}catch(e){}}}
 function goStep(i,animate){st.step=Math.max(-1,Math.min(st.seq.length-1,i));paint(animate)}
 function play(){if(!st.seq.length)return;if(st.playing){stop();paint(false);return}if(st.step>=st.seq.length-1)st.step=-1;st.playing=true;if(o.ev)o.ev('own:play');sfx('start');const tick=()=>{if(dead||!st.playing)return;if(st.step>=st.seq.length-1){st.playing=false;if(pty)pty.cheer();sfx('victory');paint(false);return}goStep(st.step+1,true);timer=setTimeout(tick,calm()?900:1250)};tick()}
 /* ---- input ---- */
 const fix=()=>{st.seq=st.seq.filter(s=>s.m<st.team.length);st.step=-1};
 root.onclick=async e=>{const b=e.target.closest('[data-pick],[data-rm],[data-px],[data-ch],[data-el],[data-am],[data-add],[data-up],[data-dn],[data-del],[data-go],[data-play],[data-prev],[data-next],[data-clear],[data-share],[data-fk],[data-back],[data-open],[data-set],[data-dummy]');if(!b||!root.contains(b))return;const d=b.dataset;
  if(d.set!=null){if(PS)PS.openSettings(b,()=>{const x=root.querySelector('[data-set]');if(x)x.firstChild.textContent=(window.PPSfx&&PPSfx.on()?'🔊':'🔇')+' '});return}
  if(d.pick!=null){st.slot=+d.pick;st.q='';st.el='';st.focusQ=matchMedia('(pointer:fine)').matches;sfx('click');render(true);const p=root.querySelector('.ct-pick');if(p&&p.scrollIntoView)p.scrollIntoView({block:'nearest'});return}
  if(d.px!=null){st.slot=-1;render(true);return}
  if(d.rm!=null){const i=+d.rm;st.team.splice(i,1);st.seq=st.seq.filter(s=>s.m!==i).map(s=>({m:s.m>i?s.m-1:s.m,a:s.a}));st.step=-1;st.am=0;render(true);return}
  if(d.ch!=null){const id=d.ch;if(!by.has(id)||b.disabled)return;if(st.slot<st.team.length)st.team[st.slot]=id;else st.team.push(id);st.slot=-1;fix();sfx('select',{el:by.get(id).el});render(true);await loadKits();late();return}
  if(d.el!=null){st.el=d.el;root.querySelectorAll('.ct-els [data-el]').forEach(x=>x.setAttribute('aria-checked',String(x.dataset.el===st.el)));const q=st.q.toLowerCase();root.querySelector('#ct-grid').innerHTML=grid(chars.filter(c=>(!st.el||c.el===st.el)&&(!q||c.name.toLowerCase().includes(q))).sort((a,b)=>a.name.localeCompare(b.name)));root.querySelectorAll('#ct-grid .ct-face img').forEach(x=>x.addEventListener('error',()=>x.remove()));return}
  if(d.am!=null){st.am=+d.am;sfx('click');render(true);return}
  if(d.add!=null){if(st.seq.length>=MAXSTEPS||!ACT[d.add])return;const first=!st.seq.length;st.seq.push({m:st.am!=null&&st.am<st.team.length?st.am:0,a:d.add});st.step=-1;sfx('click');render(true);if(first&&o.ev)o.ev('own:order');return}
  if(d.up!=null||d.dn!=null){const i=+(d.up!=null?d.up:d.dn),j=d.up!=null?i-1:i+1;if(j<0||j>=st.seq.length)return;const t=st.seq[i];st.seq[i]=st.seq[j];st.seq[j]=t;st.step=-1;render(true);const nb=root.querySelector('[data-'+(d.up!=null?'up':'dn')+'="'+j+'"]');if(nb&&!nb.disabled)nb.focus();return}
  if(d.del!=null){st.seq.splice(+d.del,1);st.step=-1;render(true);return}
  if(d.go!=null){stop();goStep(+d.go,true);return}
  if(d.play!=null){play();return}if(d.prev!=null){stop();goStep(st.step-1,true);return}if(d.next!=null){stop();goStep(st.step+1,true);return}
  if(d.clear!=null){st.seq=[];st.step=-1;render(true);return}
  if(d.share!=null){const was=b.textContent;try{await navigator.clipboard.writeText(o.link?o.link({team:st.team.join('_'),seq:packSeq(st.seq)}):location.href);b.textContent='Copied!'}catch(x){b.textContent='Copy the address bar'}setTimeout(()=>{if(document.body.contains(b))b.textContent=was},1800);return}
  if(d.fk!=null){if(o.openKit)o.openKit(d.fk);return}
  if(d.back!=null){if(o.onExit)o.onExit();return}
  if(d.dummy!=null){o.openDummy&&o.openDummy();return}
  if(d.open!=null){const m=o.match&&o.match(st.team);if(m&&o.openMatch)o.openMatch(m);return}};
 root.oninput=e=>{if(e.target.id!=='ct-q')return;st.q=e.target.value;const q=st.q.toLowerCase();root.querySelector('#ct-grid').innerHTML=grid(chars.filter(c=>(!st.el||c.el===st.el)&&(!q||c.name.toLowerCase().includes(q))).sort((a,b)=>a.name.localeCompare(b.name)));root.querySelectorAll('#ct-grid .ct-face img').forEach(x=>x.addEventListener('error',()=>x.remove()))};
 root.addEventListener('toggle',e=>{const k=e.target&&e.target.dataset&&e.target.dataset.kd;if(k)st.open=e.target.open?k:(st.open===k?'':st.open)},true);
 /* ability names arrive a moment later; never redraw under someone who is busy in the picker (it redraws when it closes) */
 function late(){if(dead||!st.team.length||st.slot>=0)return;render(true)}
 render(false);loadKits().then(late);
 return{stop(){dead=true;stop();cancelAnimationFrame(raf);if(pty)pty.destroy();if(PS)PS.closeSettings();root.onclick=null;root.oninput=null},state:()=>({team:st.team.slice(),seq:packSeq(st.seq)})}}
window.PPTeam={mount,special,reactions,resonance,readSeq,packSeq,readTeam,ACTS,MAXSTEPS};if(typeof module!=='undefined')module.exports=window.PPTeam;
})();
