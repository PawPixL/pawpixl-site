/* PawPixl Arena: the training dummy.
   A place to learn elemental reactions by doing them: put an element on the dummy, hit it with another, and see which
   reaction that makes, in which order it is stronger, what follows from it, and which characters bring each element.
   It is a teaching model. It shows WHICH reaction two elements make. It does not model how long an element stays, how
   much is used up, or any damage number. Lunar and Stellar reactions, Nightsoul, Moonsign, Hexerei and the other systems
   come from the reaction book the Studio builds out of the game's own ability text: every character line is a quote. */
(function(){
'use strict';
const ELC={Pyro:'#ff8a3d',Hydro:'#43b4ff',Anemo:'#3fe0bf',Electro:'#b77cff',Dendro:'#8fd14f',Cryo:'#9fe6ff',Geo:'#f2c14e'};
const ELS=['Pyro','Hydro','Electro','Cryo','Dendro','Anemo','Geo'];
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
/* the game's basic reaction table: the two elements, the name */
const PAIR={'Hydro+Pyro':'Vaporize','Cryo+Pyro':'Melt','Electro+Pyro':'Overloaded','Dendro+Pyro':'Burning','Cryo+Hydro':'Frozen','Electro+Hydro':'Electro-Charged','Dendro+Hydro':'Bloom','Cryo+Electro':'Superconduct','Dendro+Electro':'Quicken'};
const STICK=['Pyro','Hydro','Electro','Cryo'];
/* what each basic reaction does, in plain words, with no numbers */
const DESC={
 Vaporize:'The hit that causes it deals more damage. It is stronger when Hydro hits an enemy that has Pyro on it than the other way round.',
 Melt:'The hit that causes it deals more damage. It is stronger when Pyro hits an enemy that has Cryo on it than the other way round.',
 Overloaded:'An explosion that deals Pyro damage in an area and knocks lighter enemies back.',
 Superconduct:'Deals Cryo damage in an area and lowers the enemy’s Physical resistance for a while.',
 'Electro-Charged':'Shocks the enemy with Electro damage several times while it stays wet, and can jump to other wet enemies nearby.',
 Frozen:'The enemy is frozen in place and cannot act for a while. Big enemies and bosses usually cannot be frozen.',
 Shatter:'Hitting a frozen enemy with a heavy attack (a claymore, a blunt attack or Geo) breaks the ice for Physical damage and ends the freeze.',
 Swirl:'Deals damage of the element that was on the enemy and spreads that element to other enemies nearby.',
 Crystallize:'Drops a crystal. Picking it up gives a shield that is extra strong against that element.',
 Burning:'The enemy catches fire and takes Pyro damage over time while Dendro is still on it.',
 Bloom:'Creates a Dendro Core on the ground. After a short time it bursts and deals Dendro damage in a small area.',
 Hyperbloom:'Electro hitting a Dendro Core turns it into a homing shot that deals Dendro damage to one enemy.',
 Burgeon:'Pyro hitting a Dendro Core makes it explode at once, dealing Dendro damage in a larger area.',
 Quicken:'Puts the enemy in the Quicken state. It deals no damage by itself: it sets up Aggravate and Spread.',
 Aggravate:'Electro hitting a Quickened enemy adds extra damage to that hit.',
 Spread:'Dendro hitting a Quickened enemy adds extra damage to that hit.'};
const HOW={Vaporize:'Pyro and Hydro',Melt:'Pyro and Cryo',Overloaded:'Pyro and Electro',Superconduct:'Cryo and Electro','Electro-Charged':'Hydro and Electro',Frozen:'Hydro and Cryo',Shatter:'A heavy hit on a Frozen enemy',
 Swirl:'Anemo on Pyro, Hydro, Electro or Cryo',Crystallize:'Geo on Pyro, Hydro, Electro or Cryo',Burning:'Pyro and Dendro',Bloom:'Hydro and Dendro',Hyperbloom:'Bloom first, then Electro on the Dendro Core',
 Burgeon:'Bloom first, then Pyro on the Dendro Core',Quicken:'Electro and Dendro',Aggravate:'Quicken first, then Electro',Spread:'Quicken first, then Dendro'};
/* the two elements a visitor can press to see each basic reaction on the dummy */
const DEMO={Vaporize:['Pyro','Hydro'],Melt:['Cryo','Pyro'],Overloaded:['Pyro','Electro'],Superconduct:['Cryo','Electro'],'Electro-Charged':['Hydro','Electro'],Frozen:['Hydro','Cryo'],Shatter:['Hydro','Cryo','Geo'],Swirl:['Pyro','Anemo'],
 Crystallize:['Hydro','Geo'],Burning:['Dendro','Pyro'],Bloom:['Dendro','Hydro'],Hyperbloom:['Dendro','Hydro','Electro'],Burgeon:['Dendro','Hydro','Pyro'],Quicken:['Dendro','Electro'],Aggravate:['Dendro','Electro','Electro'],Spread:['Dendro','Electro','Dendro']};
const fresh=()=>({aura:'',frozen:false,quicken:false,core:false});
/* one hit on the dummy. Returns the new state and what happened. Pure: used by the screen and by the tests. */
function hit(s0,el){const s=Object.assign(fresh(),s0||{});const R=(rx,o)=>Object.assign({rx,state:s,el},o||{});
 if(!ELC[el])return R('',{text:''});
 if(s.core&&(el==='Electro'||el==='Pyro')){s.core=false;return R(el==='Electro'?'Hyperbloom':'Burgeon',{from:'Dendro Core'})}
 if(s.frozen){if(el==='Geo'){s.frozen=false;s.aura='';return R('Shatter',{from:'Frozen'})}
  if(el==='Hydro'||el==='Cryo')return R('',{text:'The dummy is already Frozen. '+el+' adds nothing new.'});if(el==='Dendro')return R('',{text:'Dendro does not react with a Frozen enemy.'});
  s.frozen=false;s.aura='';return R(el==='Pyro'?'Melt':el==='Electro'?'Superconduct':'Swirl',{from:'Frozen',sub:'Cryo',strong:el==='Pyro'?true:undefined})}
 if(s.quicken){if(el==='Electro')return R('Aggravate',{from:'Quicken'});if(el==='Dendro')return R('Spread',{from:'Quicken'});
  if(el==='Pyro'){s.quicken=false;s.aura='Pyro';return R('Burning',{from:'Quicken'})}if(el==='Hydro'){s.quicken=false;s.core=true;return R('Bloom',{from:'Quicken'})}
  return R('',{text:el+' does not react with the Quicken state.'})}
 if(!s.aura){if(el==='Anemo'||el==='Geo')return R('',{text:el+' does not stay on an enemy. Put Pyro, Hydro, Electro or Cryo on the dummy first, then hit it with '+el+'.'});s.aura=el;return R('',{applied:true,text:'The dummy now has '+el+' on it. Hit it with a different element.'})}
 const a=s.aura;if(a===el)return R('',{text:'The dummy already has '+el+' on it. Use a different element to react.'});
 if(el==='Anemo'||el==='Geo'){if(!STICK.includes(a))return R('',{text:el+' does not react with '+a+'.'});s.aura='';return R(el==='Anemo'?'Swirl':'Crystallize',{sub:a})}
 const rx=PAIR[[a,el].sort().join('+')];if(!rx)return R('',{text:a+' and '+el+' do not react with each other.'});
 if(rx==='Vaporize'){s.aura='';return R(rx,{strong:el==='Hydro'})}if(rx==='Melt'){s.aura='';return R(rx,{strong:el==='Pyro'})}
 if(rx==='Frozen'){s.frozen=true;s.aura='Cryo';return R(rx)}if(rx==='Quicken'){s.quicken=true;s.aura='';return R(rx)}if(rx==='Bloom'){s.core=true;s.aura='';return R(rx)}
 if(rx==='Burning'){s.aura='Pyro';return R(rx)}s.aura='';return R(rx)}
/* the exact name the game text uses for this result, so a party member's "X turns into Y" sentence can be matched */
const fullName=r=>r.rx==='Swirl'||r.rx==='Crystallize'?r.sub+' '+r.rx:r.rx;
function upgrade(r,book,party){if(!r||!r.rx||!book)return null;const n=fullName(r),P=new Set(party||[]);const c=(book.conv||[]).find(c=>(c.from===n||c.from===r.rx)&&c.who.some(w=>P.has(w[0])));
 if(!c)return null;const w=c.who.filter(w=>P.has(w[0]));return{to:c.to,from:c.from,who:w}}
const options=(r,book)=>!r||!r.rx||!book?[]:(book.conv||[]).filter(c=>c.from===fullName(r)||c.from===r.rx);
const stateText=s=>s.frozen?'Frozen (counts as Cryo)':s.quicken?'Quicken':s.aura?s.aura:'nothing';

function mount(root,o){o=o||{};const book=o.book||null,chars=o.chars||[],by=new Map(chars.map(c=>[c.id,c]));const nm=id=>(by.get(id)||{}).name||id;
 const st={s:fresh(),last:null,party:[],log:[],tab:(book&&book.topics[0]&&book.topics[0].g)||''};let dead=false,tm=0;
 const byEl={};chars.forEach(c=>{if(ELC[c.el])(byEl[c.el]=byEl[c.el]||[]).push(c)});Object.values(byEl).forEach(L=>L.sort((a,b)=>a.name.localeCompare(b.name)));
 const chip=(c,extra)=>'<a class="rx-who" href="/arena/'+esc(c.id)+'" data-link style="--c:'+(ELC[c.el]||'#999')+'"'+(extra||'')+'>'+esc(c.name)+'</a>';
 const elBtn=(e,attr)=>'<button type="button" class="rx-el" style="--c:'+ELC[e]+'" '+attr+'>'+e+'</button>';
 const groups=book?[...new Set(book.topics.map(t=>t.g))]:[];
 const convOf=name=>(book&&book.conv||[]).filter(c=>c.to===name||c.from===name||(/ /.test(c.from)&&c.from.split(' ').pop()===name));
 function result(){const r=st.last;if(!r)return'<p class="rx-hint">Pick an element to put on the dummy. Then hit it with a second one to see the reaction.</p>';
  if(!r.rx)return'<p class="rx-hint">'+esc(r.text||'')+'</p>';const up=upgrade(r,book,st.party),opts=options(r,book),name=up?up.to:r.rx;
  let h='<h3 class="rx-name" style="--c:'+ELC[r.el]+'">'+esc(name)+(r.sub&&!up?' <small>('+esc(r.sub)+')</small>':'')+'</h3>';
  if(up){h+='<p>'+esc(r.sub?r.sub+' '+r.rx:r.rx)+' turns into <b>'+esc(up.to)+'</b> because '+esc(up.who.map(w=>nm(w[0])).join(' and '))+' '+(up.who.length>1?'are':'is')+' in the party. The game text says:</p>'+up.who.map(w=>'<blockquote class="rx-q"><b>'+esc(nm(w[0]))+'</b> <small>'+esc(w[1])+'</small> “'+esc(w[2])+'”</blockquote>').join('')}
  else{h+='<p>'+esc(DESC[r.rx]||'')+'</p>';if(r.strong===true)h+='<p class="rx-ok">This is the stronger order for '+esc(r.rx)+'.</p>';if(r.strong===false)h+='<p class="rx-warn">This is the weaker order for '+esc(r.rx)+'. Swap which element goes on first to get the stronger one.</p>'}
  if(r.rx==='Bloom')h+='<p class="rx-next">A Dendro Core is on the ground. Hit it with <b>Electro</b> for Hyperbloom or <b>Pyro</b> for Burgeon.</p>';
  if(r.rx==='Quicken')h+='<p class="rx-next">The dummy is Quickened. Hit it with <b>Electro</b> for Aggravate or <b>Dendro</b> for Spread.</p>';
  if(r.rx==='Frozen')h+='<p class="rx-next">The dummy is Frozen. Hit it with <b>Geo</b> (a heavy hit) for Shatter, <b>Pyro</b> for Melt or <b>Electro</b> for Superconduct.</p>';
  if(opts.length&&!up)h+='<div class="rx-opt"><b>Some characters change this reaction.</b> Add one to the party to see it:<div class="rx-chips">'+opts.map(c=>c.who.map(w=>'<button type="button" class="rx-pt" data-pt="'+esc(w[0])+'">'+esc(nm(w[0]))+' <small>'+esc(c.to)+'</small></button>').join('')).join('')+'</div></div>';
  return h}
 function who(){const r=st.last;const els=r&&r.rx?[...new Set([r.sub||'',r.el,r.from==='Dendro Core'?'Dendro':'',r.from==='Dendro Core'?'Hydro':'',r.from==='Quicken'?'Electro':'',r.from==='Quicken'?'Dendro':'',r.rx==='Shatter'||r.from==='Frozen'?'Hydro':'',r.rx==='Shatter'?'Cryo':''].concat(r.rx&&DEMO[r.rx]&&!r.sub&&!r.from?Object.keys(PAIR).filter(k=>PAIR[k]===r.rx).join('+').split('+'):[]).filter(e=>ELC[e]))]:(st.s.aura?[st.s.aura]:[]);
  if(!els.length)return'';return'<div class="rx-bring"><h3>Who brings each element</h3>'+els.map(e=>'<details class="rx-ell"'+(els.length<3?' open':'')+'><summary style="--c:'+ELC[e]+'">'+e+' <small>'+(byEl[e]||[]).length+' characters</small></summary><div class="rx-chips">'+(byEl[e]||[]).map(c=>chip(c)).join('')+'</div></details>').join('')
   +'<p class="rx-fine">Any character of that element can do it, as long as the attack they use deals that element. Open a character to read which of their attacks do.</p></div>'}
 function topic(t){const cv=convOf(t.name);return'<details class="rx-topic" data-tp="'+esc(t.name)+'"><summary><b>'+esc(t.name)+'</b> <small>'+t.who.length+' character'+(t.who.length>1?'s':'')+'</small></summary><div class="rx-tb" data-body></div></details>'}
 function topicBody(t){const cv=convOf(t.name),demo=DEMO[t.name];let h='';
  if(DESC[t.name])h+='<p><b>How:</b> '+esc(HOW[t.name])+'.</p><p>'+esc(DESC[t.name])+'</p>'+(demo?'<p><button type="button" class="btn sm" data-demo="'+esc(t.name)+'">Show it on the dummy</button></p>':'');
  cv.forEach(c=>{h+='<p class="rx-cv"><b>'+esc(c.from)+'</b> turns into <b>'+esc(c.to)+'</b> when one of these characters is in the party: '+c.who.map(w=>chip(by.get(w[0])||{id:w[0],name:nm(w[0])})).join(' ')+'</p>'});
  h+='<p class="rx-fine">'+(DESC[t.name]?'Characters whose own abilities name this reaction':'What the game’s ability text says, character by character')+':</p><ul class="rx-ql">'+t.who.map(w=>{const c=by.get(w[0])||{id:w[0],name:nm(w[0])};
   return'<li>'+chip(c)+' <small>'+esc(w[1])+'</small> “'+esc(w[2])+'”'+(w[3]?'<br><small>'+esc(w[3])+'</small> “'+esc(w[4])+'”':'')+'</li>'}).join('')+'</ul>';return h}
 function bookHTML(){if(!book||!book.topics.length)return'<div class="panel rx-book"><h2>Reaction book</h2><p class="rx-fine">The character lists for each reaction are added when the Arena is next published from PawPixl Studio.</p>'
   +'<div class="rx-basic">'+Object.keys(DESC).map(n=>'<details class="rx-topic"><summary><b>'+esc(n)+'</b></summary><div class="rx-tb"><p><b>How:</b> '+esc(HOW[n])+'.</p><p>'+esc(DESC[n])+'</p></div></details>').join('')+'</div></div>';
  const L=book.topics.filter(t=>t.g===st.tab);const basicMissing=st.tab==='Basic reactions'?Object.keys(DESC).filter(n=>!L.some(t=>t.name===n)).map(n=>({g:st.tab,name:n,who:[]})):[];
  return'<div class="panel rx-book"><h2>Reaction book</h2><p class="rx-fine">Every reaction and combat system named in the game’s ability text, and the characters whose abilities name it. Character lines are quotes from '+esc(book.src||'the game text')+'.</p>'
   +'<div class="rx-tabs" role="tablist">'+groups.map(g=>'<button type="button" role="tab" aria-selected="'+(g===st.tab)+'" data-tab="'+esc(g)+'">'+esc(g)+'</button>').join('')+'</div>'
   +(st.tab==='Hexerei'?'<p class="rx-warn">The game text PawPixl holds names Hexerei but does not list which characters are Hexerei, so that list is not shown here.</p>':'')
   +L.concat(basicMissing).sort((a,b)=>st.tab==='Basic reactions'?Object.keys(DESC).indexOf(a.name)-Object.keys(DESC).indexOf(b.name):0).map(topic).join('')+'</div>'}
 function render(){if(dead)return;const s=st.s;
  root.innerHTML='<div class="rx"><div class="ar-hd"><h1 class="ar-h">Training dummy</h1><p class="ar-sub">Learn the elemental reactions by doing them. Put an element on the dummy, hit it with another, and see what happens.</p></div>'
   +'<div class="rx-top"><div class="rx-scene" aria-hidden="true"><div class="rx-dummy'+(s.frozen?' fz':'')+(s.quicken?' qk':'')+'" style="--c:'+(ELC[s.aura]||(s.quicken?'#c8e85a':'transparent'))+'"><svg viewBox="0 0 40 56" shape-rendering="crispEdges"><rect x="18" y="20" width="4" height="34" fill="#6b4a2f"/><rect x="6" y="26" width="28" height="4" fill="#6b4a2f"/><rect x="10" y="50" width="20" height="4" fill="#4a3220"/><rect x="12" y="4" width="16" height="16" fill="#d9b779"/><rect x="12" y="4" width="16" height="3" fill="#c29a58"/><rect x="16" y="10" width="2" height="2" fill="#3a2a1a"/><rect x="22" y="10" width="2" height="2" fill="#3a2a1a"/><rect x="16" y="15" width="8" height="1" fill="#3a2a1a"/><rect x="13" y="22" width="14" height="16" fill="#b98b4a"/><rect x="17" y="27" width="6" height="6" fill="#e9e2d0"/><rect x="19" y="29" width="2" height="2" fill="#d2483c"/></svg><span class="rx-aura"></span></div>'
   +(s.core?'<span class="rx-core" title="Dendro Core"></span>':'')+'<span class="rx-pop" data-pop></span></div>'
   +'<div class="rx-ctl"><p class="rx-state">On the dummy: <b>'+esc(stateText(s))+'</b>'+(s.core?' · <b>Dendro Core</b> on the ground':'')+'</p><div class="rx-els" role="group" aria-label="Hit the dummy with an element">'+ELS.map(e=>elBtn(e,'data-hit="'+e+'"')).join('')+'</div>'
   +'<p><button type="button" class="btn ghost sm" data-reset>Clear the dummy</button>'+(st.party.length?' <span class="rx-party">In the party: '+st.party.map(id=>'<button type="button" class="rx-pt on" data-pt="'+esc(id)+'" title="Remove">'+esc(nm(id))+' ×</button>').join(' ')+'</span>':'')+'</p>'
   +'<div class="rx-res" aria-live="polite">'+result()+'</div></div></div>'
   +who()+(st.log.length?'<p class="rx-log"><b>What you have made so far:</b> '+st.log.map(esc).join(' · ')+'</p>':'')
   +'<p class="rx-fine rx-model">This is a teaching model. It shows which reaction two elements make. It does not show how long an element stays on an enemy, how much of it a hit uses up, or any damage number.</p>'
   +bookHTML()+'<div class="ar-nav"><button type="button" class="btn ghost" data-back>Back</button>'+(o.own?'<button type="button" class="btn" data-own>Build my own team</button>':'')+'</div></div>';
  const lt=root.querySelector('a[data-link]');if(o.go)root.querySelectorAll('a[data-link]').forEach(a=>a.addEventListener('click',e=>{if(e.metaKey||e.ctrlKey)return;e.preventDefault();o.go(a.getAttribute('href'))}))}
 function pop(txt,c){const p=root.querySelector('[data-pop]'),d=root.querySelector('.rx-dummy');if(!p)return;p.textContent=txt;p.style.setProperty('--c',c||'#fff');p.classList.remove('go');void p.offsetWidth;p.classList.add('go');if(d){d.classList.remove('hit');void d.offsetWidth;d.classList.add('hit')}}
 function doHit(el,quiet){const r=hit(st.s,el);st.s=r.state;st.last=r;if(r.rx){const up=upgrade(r,book,st.party),n=up?up.to:fullName(r);if(!st.log.includes(n))st.log.push(n);if(o.ev&&!quiet)o.ev('dummy:rx')}render();const up=upgrade(r,book,st.party);pop(r.rx?(up?up.to:r.rx):r.applied?el:'',ELC[el]);if(o.sfx&&!quiet)o.sfx(r.rx?'reaction':'select',{el})}
 root.onclick=e=>{const b=e.target.closest('[data-hit],[data-reset],[data-pt],[data-tab],[data-demo],[data-back],[data-own]');if(!b||!root.contains(b))return;const d=b.dataset;
  if(d.hit){doHit(d.hit);return}if(d.reset!=null){st.s=fresh();st.last=null;render();return}
  if(d.pt){const i=st.party.indexOf(d.pt);if(i>=0)st.party.splice(i,1);else if(by.has(d.pt)||true)st.party.push(d.pt);render();if(st.last&&st.last.rx){const up=upgrade(st.last,book,st.party);if(up&&!st.log.includes(up.to))st.log.push(up.to),render()}return}
  if(d.tab){st.tab=d.tab;render();const t=root.querySelector('.rx-tabs');return}
  if(d.demo){const seq=DEMO[d.demo];if(!seq)return;clearTimeout(tm);st.s=fresh();st.last=null;st.party=[];let i=0;const step=()=>{if(dead)return;doHit(seq[i++],true);if(i<seq.length)tm=setTimeout(step,o.fast?0:700)};step();const top=root.querySelector('.rx-top');if(top&&top.scrollIntoView)top.scrollIntoView({block:'start',behavior:'smooth'});return}
  if(d.back!=null){o.onExit&&o.onExit();return}if(d.own!=null){o.own&&o.own();return}};
 root.addEventListener('toggle',e=>{const t=e.target;if(!t.matches||!t.matches('.rx-topic[data-tp]')||!t.open)return;const body=t.querySelector('[data-body]');if(!body||body.dataset.done)return;const tp=(book.topics.find(x=>x.name===t.dataset.tp))||{name:t.dataset.tp,who:[]};body.innerHTML=topicBody(tp);body.dataset.done='1';
  if(o.go)body.querySelectorAll('a[data-link]').forEach(a=>a.addEventListener('click',ev=>{if(ev.metaKey||ev.ctrlKey)return;ev.preventDefault();o.go(a.getAttribute('href'))}))},true);
 render();return{stop(){dead=true;clearTimeout(tm);root.onclick=null}}}
const api={mount,hit,fresh,upgrade,options,fullName,DESC,HOW,DEMO,PAIR,ELS};
if(typeof window!=='undefined')window.PPDummy=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})();
