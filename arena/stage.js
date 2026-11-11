/* PawPixl Arena: presentation layer shared by the Rotation Coach and Battle Mode.
   - party(): the big character portraits that stand on the training ground (the site's own character art, shown large)
   - ambient(): a few drifting motes so the ground feels alive
   - settings: sound on/off and volume, lighter effects, screen shake (remembered on the visitor's device)
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
window.PPStage={party,ambient,settingsBtn,openSettings,closeSettings,calm,prefs:PF,crisp,sfx};
})();
