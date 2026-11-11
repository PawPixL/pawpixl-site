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
/* ---------------- the party on the stage: a generic figure in the element's colour, with the character's face ----------------
   Two body shapes, drawn here as blocky pixel art (original; no game artwork). The small round face is the character's own
   portrait from the site; if it is missing, the first letter of the name is shown instead. */
const BODY={
 m:'<rect x="9" y="12" width="2" height="1"/><rect x="5" y="13" width="10" height="9"/><rect x="3" y="13" width="2" height="9" class="d"/><rect x="15" y="13" width="2" height="9" class="d"/><rect x="5" y="15" width="10" height="1" class="l"/><rect x="5" y="21" width="10" height="1" class="k"/><rect x="6" y="22" width="3" height="11"/><rect x="11" y="22" width="3" height="11"/><rect x="9" y="22" width="2" height="3" class="d"/><rect x="5" y="33" width="4" height="2" class="k"/><rect x="11" y="33" width="4" height="2" class="k"/>',
 f:'<rect x="9" y="12" width="2" height="1"/><rect x="6" y="13" width="8" height="6"/><rect x="4" y="13" width="2" height="8" class="d"/><rect x="14" y="13" width="2" height="8" class="d"/><rect x="6" y="15" width="8" height="1" class="l"/><rect x="7" y="19" width="6" height="2" class="k"/><rect x="6" y="21" width="8" height="2"/><rect x="5" y="23" width="10" height="2"/><rect x="4" y="25" width="12" height="3"/><rect x="4" y="27" width="12" height="1" class="l"/><rect x="7" y="28" width="2" height="5" class="d"/><rect x="11" y="28" width="2" height="5" class="d"/><rect x="6" y="33" width="3" height="2" class="k"/><rect x="11" y="33" width="3" height="2" class="k"/>'};
function figure(m,o){o=o||{};const src=o.icon||'',body=o.body==='f'?'f':'m';return'<span class="ar-fig ar-fig-'+body+(o.cls?' '+o.cls:'')+'" style="--c:'+(ELC[m.el]||'#999')+'"'+(o.attr||'')+'><span class="ar-fsh"></span><svg viewBox="0 0 20 36" shape-rendering="crispEdges" aria-hidden="true">'+BODY[body]+'</svg><span class="ar-face"><i>'+esc(String(m.name||'?')[0])+'</i>'+(src?'<img src="'+esc(src)+'" alt="" draggable="false" loading="lazy">':'')+'</span>'+(o.name?'<b class="ar-nt">'+esc(m.name)+'</b>':'')+'</span>'}
function wireFig(root){root.querySelectorAll('.ar-face img').forEach(x=>{x.addEventListener('error',()=>x.remove());crisp(x)})}
function party(scene,team,iconOf,bodyOf){if(!scene||!team||!team.length)return null;
 const box=document.createElement('div');box.className='ar-party';box.setAttribute('aria-hidden','true');
 box.innerHTML='<div class="ar-line">'+team.map((m,i)=>figure(m,{icon:iconOf(m.name),body:bodyOf?bodyOf(m.name):'m',name:true,attr:' data-i="'+i+'"'})).join('')+'</div>';
 scene.appendChild(box);wireFig(box);const figs=[...box.querySelectorAll('.ar-fig')];let cur=null,timers=[];
 const later=(f,ms)=>{const t=setTimeout(f,ms);timers.push(t);return t};
 const size=()=>{const w=scene.clientWidth||320;box.style.setProperty('--p',Math.round(Math.max(26,Math.min(46,w*.075)))+'px')};size();
 const clear=()=>{timers.forEach(clearTimeout);timers=[];figs.forEach(f=>f.classList.remove('in','ant','a-hit','a-skill','a-burst','a-plunge'))};
 return{el:box,size,shown:()=>true,
  /* who steps forward now; type is the step's action type (attack, skill, burst, plunge...) */
  set(m,type,animate){clear();const i=m?team.findIndex(x=>x.name===m.name):-1;figs.forEach((f,k)=>f.classList.toggle('on',k===i));const changed=!cur||!m||cur.name!==m.name;cur=m||null;if(i<0||!animate||calm())return;
   const f=figs[i];if(changed)f.classList.add('in');const act=type==='burst'?'burst':type==='skill'?'skill':type==='plunge'?'plunge':'hit';
   later(()=>{f.classList.remove('in');f.classList.add('ant')},changed?240:0);later(()=>{f.classList.remove('ant');f.classList.add('a-'+act)},(changed?240:0)+170);later(()=>{f.classList.remove('a-'+act)},(changed?240:0)+170+620)},
  cheer(){if(!calm())figs.forEach(f=>f.classList.add('cheer'))},
  destroy(){clear();box.remove()}}}
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
window.PPStage={figure,wireFig,ELC,party,ambient,settingsBtn,openSettings,closeSettings,calm,prefs:PF,crisp,sfx};
})();
