/* PawPixl Arena: presentation layer shared by the Rotation Coach and Battle Mode.
   - party(): the big character portraits that stand on the training ground (the site's own character art, shown large)
   - ambient(): a few drifting motes so the ground feels alive
   - settings: sound on/off and volume, lighter effects, screen shake (remembered on the visitor's device)
   - battle(): the Battle Mode screen. Its rules live in battle.js and are made up for this mini-game.
   Nothing here changes a rotation, a kit or a guide. */
(function(){
'use strict';
const ELC={Pyro:'#ff8a3d',Hydro:'#43b4ff',Anemo:'#3fe0bf',Electro:'#b77cff',Dendro:'#8fd14f',Cryo:'#9fe6ff',Geo:'#f2c14e',Physical:'#efe6cf'};
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const KEY='pp.arena.fx';const PF=(()=>{let p={};try{p=JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch(e){}return{low:!!p.low,shake:p.shake!==false}})();
const savePF=()=>{try{localStorage.setItem(KEY,JSON.stringify(PF))}catch(e){}};
const sysReduced=()=>{try{return matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){return false}};
const calm=()=>PF.low||sysReduced();
const sfx=(n,o)=>{try{return window.PPSfx&&window.PPSfx.play(n,o)}catch(e){return false}};
/* pixel art stays crisp when it is drawn larger than its file; photos and big art are left smooth */
function crisp(img){const fix=()=>{try{const r=img.getBoundingClientRect();img.classList.toggle('px',img.naturalWidth>0&&img.naturalWidth<=r.width*(window.devicePixelRatio||1))}catch(e){}};if(img.complete)fix();else img.addEventListener('load',fix,{once:true});return img}
/* ---------------- big portraits on the Coach stage ---------------- */
function party(scene,team,iconOf){const have=team.filter(m=>iconOf(m.name));if(!scene||!have.length)return null;
 const box=document.createElement('div');box.className='ar-party';box.setAttribute('aria-hidden','true');
 box.innerHTML='<div class="ar-bench">'+team.map((m,i)=>'<span class="ar-bm" data-i="'+i+'" style="--c:'+(ELC[m.el]||'#999')+'">'+(iconOf(m.name)?'<img src="'+esc(iconOf(m.name))+'" alt="" draggable="false">':'<i>'+esc(String(m.name)[0])+'</i>')+'</span>').join('')+'</div><div class="ar-star"><span class="ar-shadow"></span><span class="ar-ring"></span><img alt="" draggable="false"><b class="ar-nt"></b></div>';
 scene.appendChild(box);const star=box.querySelector('.ar-star'),im=star.querySelector('img'),nt=star.querySelector('.ar-nt');let cur=null,timers=[],ok=false;
 const later=(f,ms)=>{const t=setTimeout(f,ms);timers.push(t);return t};
 im.addEventListener('error',()=>{ok=false;star.classList.remove('on')});im.addEventListener('load',()=>{ok=true;star.classList.add('on');crisp(im)});
 box.querySelectorAll('.ar-bm img').forEach(x=>{x.addEventListener('error',()=>x.remove());crisp(x)});
 const size=()=>{const w=scene.clientWidth||320;box.style.setProperty('--p',Math.round(Math.max(84,Math.min(168,w*.27)))+'px');box.style.setProperty('--b',Math.round(Math.max(34,Math.min(60,w*.1)))+'px')};size();
 return{el:box,size,shown:()=>ok,
  /* who stands in front now; type is the step's action type (attack, skill, burst, plunge...) */
  set(m,type,animate){if(!m){star.classList.remove('on');cur=null;return}const src=iconOf(m.name);box.querySelectorAll('.ar-bm').forEach((b,i)=>b.classList.toggle('on',team[i]&&team[i].name===m.name));
   if(!src){ok=false;star.classList.remove('on');cur=m;return}star.style.setProperty('--c',ELC[m.el]||'#999');nt.textContent=m.name;const changed=!cur||cur.name!==m.name;cur=m;
   if(im.getAttribute('src')!==src){ok=false;im.src=src}else{ok=im.naturalWidth>0;star.classList.toggle('on',ok)}
   timers.forEach(clearTimeout);timers=[];star.className='ar-star'+(ok?' on':'');if(!animate||calm())return;
   if(changed)star.classList.add('in');const act=type==='burst'?'burst':type==='skill'?'skill':type==='plunge'?'plunge':'hit';
   later(()=>{star.classList.remove('in');star.classList.add('ant')},changed?240:0);later(()=>{star.classList.remove('ant');star.classList.add('a-'+act)},(changed?240:0)+170);later(()=>{star.classList.remove('a-'+act)},(changed?240:0)+170+620)},
  cheer(){if(!calm())star.classList.add('cheer')},
  destroy(){timers.forEach(clearTimeout);timers=[];box.remove()}}}
/* a few slow motes over the ground (drawn on the stage canvas each frame; skipped when effects are lowered) */
function ambient(g,W,H,t,X){if(calm()||!X)return;for(let i=0;i<9;i++){const sp=.012+((i*37)%7)*.004,x=((i*53.7+t*sp*W)%(W+20))-10,y=28+((i*29)%62)+Math.sin(t*.7+i)*3,a=.25+.25*Math.sin(t*1.3+i*2);g.globalAlpha=Math.max(0,a);X.px(g,x,y,1,1,i%3?'#ffe9b0':'#ffffff')}g.globalAlpha=1}
/* ---------------- settings (sound, effects) ---------------- */
function settingsBtn(){const on=window.PPSfx&&PPSfx.on();return'<button type="button" class="btn ghost sm ar-set" data-set aria-haspopup="dialog" aria-label="Sound and effects settings">'+(on?'🔊':'🔇')+' <span>Sound &amp; effects</span></button>'}
function openSettings(anchor,onChange){closeSettings();const S=window.PPSfx,d=document.createElement('div');d.className='ar-setp';d.setAttribute('role','dialog');d.setAttribute('aria-label','Sound and effects');
 d.innerHTML='<div class="ar-seth"><b>Sound &amp; effects</b><button type="button" class="btn ghost sm" data-setx aria-label="Close">✕</button></div>'
  +(S&&S.supported()?'<label class="ar-sw"><input type="checkbox" data-s="on"'+(S.on()?' checked':'')+'> <span>Sound effects</span></label><label class="ar-vol">Volume <input type="range" min="0" max="100" step="5" value="'+Math.round(S.vol()*100)+'" data-s="vol" aria-label="Sound volume"></label>':'<p class="ar-note">This browser can’t play the sound effects.</p>')
  +'<label class="ar-sw"><input type="checkbox" data-s="low"'+(PF.low?' checked':'')+'> <span>Lighter effects (less motion)</span></label><label class="ar-sw"><input type="checkbox" data-s="shake"'+(PF.shake?' checked':'')+'> <span>Screen shake on big hits</span></label>'
  +'<p class="ar-note">Sound is off until you turn it on. Your choices are saved on this device only.'+(sysReduced()?' Your device asks for reduced motion, so motion is already lowered.':'')+'</p>';
 (anchor.closest('.ar-app')||document.body).appendChild(d);
 d.addEventListener('change',e=>{const k=e.target.dataset.s;if(k==='on'&&S){S.setOn(e.target.checked);if(e.target.checked)S.play('select')}if(k==='low'){PF.low=e.target.checked;savePF()}if(k==='shake'){PF.shake=e.target.checked;savePF()}onChange&&onChange()});
 d.addEventListener('input',e=>{if(e.target.dataset.s==='vol'&&S){S.setVol(e.target.value/100)}});d.addEventListener('change',e=>{if(e.target.dataset.s==='vol'&&S)S.play('click')});
 d.addEventListener('click',e=>{if(e.target.closest('[data-setx]'))closeSettings()});d.addEventListener('keydown',e=>{if(e.key==='Escape'){closeSettings();anchor.focus&&anchor.focus()}});
 const f=d.querySelector('input,button');if(f)f.focus()}
function closeSettings(){const d=document.querySelector('.ar-setp');if(d)d.remove()}
/* ---------------- Battle Mode screen ---------------- */
function battle(root,o){const B=window.PPBattle,X=window.PPArenaArt;if(!B){root.innerHTML='<div class="panel empty">Battle Mode couldn’t load. Please refresh the page.</div>';return{stop(){}}}
 let S=null,busy=false,timers=[],dead=false,floatN=0,wins=0;const later=(f,ms)=>{const t=setTimeout(()=>{if(!dead)f()},ms);timers.push(t)};
 const team=o.team.map(m=>Object.assign({},m,{names:o.namesOf?o.namesOf(m):null}));
 const step=()=>calm()?260:520;/* with motion lowered nothing slides or shakes, but each number still stays up long enough to read */
 function start(){timers.forEach(clearTimeout);timers=[];busy=false;S=B.create(team,{seed:o.seed||((Date.now()^(Math.random()*1e9))>>>0)});draw();say('Round 1. '+S.heroes[S.active].name+' is up. Pick an action.');sfx('start');try{if(innerWidth<700){const f=root.querySelector('.bt-field');if(f)f.scrollIntoView({block:'start',behavior:calm()?'auto':'smooth'})}}catch(e){}o.ev&&o.ev('battle')}
 const pips=(n,max)=>'<span class="bt-pips" aria-label="Energy '+n+' of '+max+'">'+Array.from({length:max},(_,i)=>'<i'+(i<n?' class="on"':'')+'></i>').join('')+'</span>';
 const bar=(hp,max,sh)=>'<span class="bt-hp" role="img" aria-label="HP '+hp+' of '+max+(sh?', shield '+sh:'')+'"><i style="width:'+(hp/max*100)+'%"></i>'+(sh?'<u style="width:'+Math.min(100,sh/max*100)+'%"></u>':'')+'<b>'+hp+' / '+max+'</b></span>';
 function unit(h){const src=o.iconOf(h.name),act=!S.over&&S.active===h.i;return'<div class="bt-u'+(act?' act':'')+(h.down?' down':'')+(h.acted&&!act?' done':'')+'" data-u="'+h.i+'" style="--c:'+(ELC[h.el]||'#999')+'"><span class="bt-pt">'+(src?'<img src="'+esc(src)+'" alt="" draggable="false" onerror="this.remove()">':'')+'<i>'+esc(String(h.name)[0])+'</i></span>'
   +'<div class="bt-ui"><b>'+esc(h.name)+'</b><small>'+esc(h.el)+' · '+esc(h.kindLabel)+'</small>'+bar(h.hp,h.max,h.shield)+'<span class="bt-row">'+pips(h.energy,B.T.burstCost)+(h.down?'<em class="bt-tag bad">Down</em>':'')+(h.shield?'<em class="bt-tag">Shield '+h.shield+'</em>':'')+((h.acted?h.cd-1:h.cd)>0?'<em class="bt-tag">Skill in '+(h.acted?h.cd-1:h.cd)+'</em>':'')+(h.echo?'<em class="bt-tag">Off-field '+h.echo+'</em>':'')+(act?'<em class="bt-tag go">Your move</em>':'')+'</span></div></div>'}
 function draw(){const b=S.boss,O=B.options(S),h=S.heroes[S.active];
  root.innerHTML='<div class="bt"><div class="bt-top"><h2 class="ar-h">Battle Mode <span class="bt-fun">just for fun</span></h2><div class="bt-topb">'+settingsBtn()+'<button type="button" class="btn ghost sm" data-bx>Back to the Coach</button></div></div>'
   +'<details class="ar-more bt-rules"><summary>How this works (made-up arena rules)</summary><p class="ar-note">'+esc(B.RULES)+'</p><ul class="ar-why"><li>Each round every character acts once, then the boss hits back.</li><li>Attack gives 1 energy, a Skill gives 2 and then rests for '+B.T.skillCd+' rounds, a Burst needs '+B.T.burstCost+' energy.</li><li>Skills leave an element on the boss. Hitting it with a different element triggers a reaction for extra damage.</li><li>Every '+B.T.slamEvery+' rounds the boss winds up a Heavy Slam on everyone. It warns you one round ahead.</li></ul></details>'
   +'<div class="bt-field"><div class="bt-boss'+(b.charging?' charge':'')+(b.hp<=0?' down':'')+'" data-u="boss"><canvas width="48" height="48" aria-hidden="true"></canvas><div class="bt-ui"><b>'+esc(b.name)+'</b><small>Round '+S.round+'</small>'+bar(b.hp,b.max,0)+'<span class="bt-row">'+(b.aura?'<em class="bt-tag" style="--c:'+(ELC[b.aura]||'#999')+'">'+esc(b.aura)+' on it</em>':'')+(b.vuln?'<em class="bt-tag">Takes more damage</em>':'')+(b.dotT?'<em class="bt-tag">Damage each round</em>':'')+(b.chill?'<em class="bt-tag">Chilled</em>':'')+(b.enraged?'<em class="bt-tag bad">Enraged</em>':'')+(b.charging?'<em class="bt-tag bad">Heavy Slam next!</em>':'')+'</span></div></div>'
   +'<div class="bt-party">'+S.heroes.map(unit).join('')+'</div></div>'
   +'<div class="bt-dock"><p class="bt-log" role="status" aria-live="polite"></p>'
   +(S.over?'<div class="bt-end '+S.over+'"><h3 class="disp">'+(S.over==='win'?'VICTORY!':'DEFEATED')+'</h3><p>'+(S.over==='win'?'The Training Golem is down in '+S.round+' round'+(S.round>1?'s':'')+'.':'The team is down. Shields and heals before the Heavy Slam make a big difference.')+'</p><div class="ar-nav ar-wrap"><button type="button" class="btn" data-brm>'+(S.over==='win'?'Battle Again':'Try Again')+'</button><button type="button" class="btn ghost" data-bx>Learn the Real Rotation</button></div></div></div>'
    :'<div class="bt-acts" role="group" aria-label="Actions for '+esc(h?h.name:'')+'">'+O.map((a,i)=>'<button type="button" class="bt-a" data-ba="'+a.id+'"'+(a.ok?'':' aria-disabled="true"')+' style="--c:'+(ELC[h.el]||'#999')+'"><span class="bt-k">'+(i+1)+'</span><b>'+a.label+'</b><small>'+esc(a.name)+'</small>'+(a.ok?'':'<em>'+esc(a.why)+'</em>')+'</button>').join('')+'</div></div><details class="ar-more bt-what"><summary>What do '+esc(h?h.name:'')+'’s actions do here?</summary><ul class="ar-why">'+O.map(a=>'<li><b>'+a.label+':</b> '+esc(a.desc)+'</li>').join('')+'</ul></details>')
   +'</div>';
  const cv=root.querySelector('.bt-boss canvas');if(cv&&X){const g=cv.getContext('2d');g.imageSmoothingEnabled=false;try{X.dummy(g,24,44,b.hp<=0?'stagger':'idle',0,{})}catch(e){}}
  root.querySelectorAll('.bt-pt img').forEach(crisp)}
 const say=t=>{const l=root.querySelector('.bt-log');if(l)l.textContent=t};
 function float(target,text,cls){const el=root.querySelector('[data-u="'+target+'"]');if(!el)return;const f=document.createElement('span');f.className='bt-f '+(cls||'');f.textContent=text;f.style.setProperty('--x',((floatN++%3)-1)*26+'px');el.appendChild(f);later(()=>f.remove(),calm()?900:1300)}
 const pulse=(target,cls,ms)=>{const el=root.querySelector('[data-u="'+target+'"]');if(!el)return;el.classList.add(cls);later(()=>el.classList.remove(cls),ms||360)};
 /* play what happened, one beat at a time, so each number can be read */
 function playEvents(E){busy=true;root.querySelectorAll('.bt-a').forEach(b=>b.disabled=true);let t=0;const hn=i=>S.heroes[i].name;const gap=step();
  E.forEach(e=>{const at=t;
   if(e.t==='act'){later(()=>{say(hn(e.who)+' uses '+e.name+'.');pulse(e.who,'cast',gap);sfx(e.action==='attack'?'attack':e.action,{el:e.el})},at);t+=gap*.6}
   else if(e.t==='dmg'&&e.target==='boss'){later(()=>{float('boss',(e.crit?'CRIT ':'')+e.n,(e.crit?'crit ':'')+'dmg');pulse('boss','hurt');setHp('boss',e.n);sfx(e.crit?'crit':'hit');if(e.crit&&PF.shake&&!calm())pulse('boss','shake',300)},at);t+=gap*.5}
   else if(e.t==='react'){later(()=>{float('boss',e.name+'!','rx');sfx('reaction')},at);t+=gap*.4}
   else if(e.t==='bossact'){later(()=>{say(S.boss.name+' uses '+e.name+(e.all?' on everyone!':'.'));pulse('boss','cast',gap);sfx('attack')},at);t+=gap*.7}
   else if(e.t==='dmg'){later(()=>{float(e.target,e.absorbed&&!e.n?'Blocked':'-'+e.n+(e.absorbed?' ('+e.absorbed+' blocked)':''),'hurtn');pulse(e.target,'hurt');sfx(e.absorbed&&!e.n?'shield':'hit')},at);t+=gap*.35}
   else if(e.t==='heal'){later(()=>{float(e.target,'+'+e.n,'heal');sfx('heal')},at);t+=gap*.35}
   else if(e.t==='shield'){later(()=>{float(e.target,'Shield '+e.n,'shield');sfx('shield')},at);t+=gap*.2}
   else if(e.t==='buff'){later(()=>{if(e.target==='team')say('Team: '+e.name+' for '+e.turns+' rounds.');else float(e.target,e.name,'buff');sfx('buff')},at);t+=gap*.4}
   else if(e.t==='debuff'){later(()=>{float('boss',e.name,'debuff');sfx('debuff')},at);t+=gap*.4}
   else if(e.t==='down'){later(()=>{float(e.target,'Down','hurtn');say(hn(e.target)+' is down.');sfx('debuff')},at);t+=gap*.6}
   else if(e.t==='tele'){later(()=>{say(e.text);sfx('error')},at);t+=gap*1.1}
   else if(e.t==='end'){later(()=>{sfx(e.result==='win'?'victory':'defeat');o.ev&&o.ev(e.result==='win'?'battle:win':'battle:lose')},at);t+=gap*.4}});
  later(()=>{busy=false;const keep=(root.querySelector('.bt-log')||{}).textContent||'';draw();if(S.over){say(S.over==='win'?'Victory!':'Defeated.');const b=root.querySelector('[data-brm]');if(b)b.focus()}else{say((E.some(e=>e.t==='tele')?keep+' ':'')+'Round '+S.round+'. '+S.heroes[S.active].name+' is up.');const f=root.querySelector('.bt-a:not([aria-disabled])');if(f)f.focus({preventScroll:true})}},t+gap*.3)}
 /* move the HP bar straight away so it animates while the numbers float */
 function setHp(target,n){const el=root.querySelector('[data-u="'+target+'"] .bt-hp i');if(!el||target!=='boss')return;const cur=parseFloat(el.style.width)||0;el.style.width=Math.max(0,cur-n/S.boss.max*100)+'%'}
 function choose(id){if(busy||!S||S.over)return;const opt=B.options(S).find(x=>x.id===id);if(!opt)return;if(!opt.ok){say(opt.label+' isn’t ready: '+opt.why+'.');sfx('error');return}sfx('click');playEvents(B.act(S,id))}
 const onClick=e=>{const a=e.target.closest('[data-ba]');if(a){choose(a.dataset.ba);return}if(e.target.closest('[data-brm]')){sfx('click');start();return}if(e.target.closest('[data-bx]')){sfx('click');o.onExit&&o.onExit();return}const st=e.target.closest('[data-set]');if(st){openSettings(st,()=>{const b=root.querySelector('[data-set]');if(b)b.firstChild.textContent=(window.PPSfx&&PPSfx.on()?'🔊':'🔇')+' '})}};
 const onKey=e=>{if(e.target.closest&&e.target.closest('input,select,textarea,.ar-setp'))return;const i=['1','2','3'].indexOf(e.key);if(i>=0&&S&&!S.over){const O=B.options(S);if(O[i]){e.preventDefault();choose(O[i].id)}}};
 root.addEventListener('click',onClick);document.addEventListener('keydown',onKey);start();
 return{stop(){dead=true;timers.forEach(clearTimeout);timers=[];root.removeEventListener('click',onClick);document.removeEventListener('keydown',onKey);closeSettings()},state:()=>S,busy:()=>busy}}
window.PPStage={party,ambient,battle,settingsBtn,openSettings,closeSettings,calm,prefs:PF,crisp,sfx};
})();
