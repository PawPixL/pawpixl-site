/* PawPixl Arena: Rotation Coach engine (shared by the website and PawPixl Studio).
   Rule-based, no damage maths: it only decides WHICH reviewed rotation fits a setup, and explains why.
   1. Look only at reviewed rotations for this character and team.
   2. Check the featured character's constellation, then each teammate's.
   3. Check gear conditions (weapon or artifact set) where a rotation states one.
   4. Pick the most specific rotation that fits, and say why.
   5. Nothing fits: say so, show the closest reviewed rotation and what would have to change.
   A rotation can only carry the Verified badge if its status is Verified AND it passes every check below
   (sources with links, a reviewed game version, a date, steps that only use team members...). */
(function(){
'use strict';
const STATUS=['Verified','Needs Review','Unsupported','Outdated'];
const KSTATUS=['Verified','Ready for approval','Needs Review','Outdated'];
const norm=s=>String(s||'').toLowerCase().replace(/[^a-z0-9]/g,'');
const GEAR=[['acc','Accessible Gear','f2p'],['rec','Recommended Gear','mid'],['prem','Premium Gear','high']];
const SLOTS=[['na','Normal Attack'],['e','Elemental Skill'],['q','Elemental Burst'],['a1','1st Ascension Passive'],['a4','4th Ascension Passive'],['util','Other passive'],['p3','Passive'],['p4','Passive'],['sp','Alternate Sprint'],['c1','C1'],['c2','C2'],['c3','C3'],['c4','C4'],['c5','C5'],['c6','C6']];
const MODES=['razor','simple','detailed'];
const CHANGE={unknown:'Not reviewed for rotation changes yet',none:'No change to the rotation',rotation:'Changes the rotation',combo:'Changes the combo',order:'Changes the teammate order',energy:'Changes Energy handling'};
const teamKey=r=>(r.team_member_ids||[]).slice().sort().join('_');
const num=(v,d)=>{const n=parseInt(v,10);return isNaN(n)?d:Math.max(0,Math.min(6,n))};
const pcsOf=p=>{const n=parseInt(String(p||'').replace(/[^0-9]/g,''),10);return isNaN(n)?0:n};
/* ---------- checks: what has to be true before something can be called Verified ---------- */
function rotProblems(r,coach,ctx){const out=[],add=(lv,t)=>out.push({id:r.rotation_id||'?',lv,t});ctx=ctx||{};
 const ids=new Set(r.team_member_ids||[]);
 if(!r.rotation_id)add('error','No rotation id');if(!r.character_id)add('error','No character');
 if(!ids.has(r.character_id))add('error','The team doesn’t include the featured character');
 if(ids.size!==4)add('error','A team needs 4 different members');
 if(!STATUS.includes(r.verification_status))add('error','Unknown status “'+r.verification_status+'”');
 if(!(r.ordered_actions||[]).length)add('error','No steps');
 const M=new Set((r.team||[]).map(m=>m.id));(r.team_member_ids||[]).forEach(id=>{if(!M.has(id))add('error','Team member '+id+' has no name, element or role')});
 if(ctx.chars){(r.team||[]).forEach(m=>{const g=ctx.chars.get(m.name);if(!g)add('error','“'+m.name+'” isn’t in the game data');else{if(g.el!==m.el)add('error',m.name+' is '+g.el+', not '+m.el);if(m.wt&&g.wt&&g.wt!==m.wt)add('error',m.name+' uses a '+g.wt+', not a '+m.wt);if(g.id&&g.id!==m.id)add('error',m.name+'’s id should be '+g.id)}})}
 (r.ordered_actions||[]).forEach((a,i)=>{const s='Step '+(i+1);if(!ids.has(a.actor_id))add('error',s+': '+a.actor_id+' isn’t on this team');if(!a.action_notation||!a.display_text)add('error',s+' needs a notation and a description');
  if(r.verification_status==='Verified')MODES.forEach(m=>{if(!String(a[m+'_explanation']||'').trim())add('error',s+' has no '+m[0].toUpperCase()+m.slice(1)+' explanation')})});
 const mn=r.minimum_constellation_requirements||{},mx=r.maximum_constellation_requirements||{};Object.keys(mn).forEach(k=>{if(mx[k]!=null&&num(mn[k],0)>num(mx[k],6))add('error','Minimum constellation is above the maximum for '+k)});
 Object.entries(r.teammate_constellation_requirements||{}).forEach(([k,v])=>{if(!ids.has(k))add('error','Constellation rule for '+k+', who isn’t on the team');if(v&&num(v.min,0)>num(v.max,6))add('error','Impossible constellation range for '+k)});
 if(r.verification_status==='Verified'){const S=r.sources||[];if(!S.length)add('error','Verified, but no source is listed');S.forEach(s=>{if(!s||!s.name||!/^https:\/\//.test(s.url||''))add('error','A source needs a name and a https link')});
  if(!r.source_game_version)add('error','Verified, but the reviewed game version is missing');if(!/^\d{4}-\d{2}-\d{2}$/.test(r.last_verified_at||''))add('error','Verified, but the review date is missing');
  if(!(r.common_mistakes||[]).length)add('warn','No common mistake listed')}
 return out}
const REQ=new Set(['na','e','q','a1','a4','c1','c2','c3','c4','c5','c6']);
function kitProblems(id,k){const out=[],add=(lv,t)=>out.push({id,lv,t});const have=new Set((k.abilities||[]).map(a=>a.slot));
 SLOTS.forEach(([s,l])=>{if(REQ.has(s)&&!have.has(s))add('error','Missing '+l)});(k.abilities||[]).forEach(a=>{['name','canon','simple','razor','detailed'].forEach(f=>{if(!String(a[f]||(f==='detailed'&&a.dg?a.canon:'')||'').trim())add('error',(a.name||a.slot)+': no '+(f==='canon'?'official description':f+' explanation'))})});
 if(k.status==='Verified'&&!(k.sources||[]).length)add('error','Verified kit with no sources');return out}
function validate(coach,ctx){const out=[];const ids=new Set();(coach.rotations||[]).forEach(r=>{if(ids.has(r.rotation_id))out.push({id:r.rotation_id,lv:'error',t:'Two rotations use the id '+r.rotation_id});ids.add(r.rotation_id);out.push(...rotProblems(r,coach,ctx))});
 Object.entries(coach.kits||{}).forEach(([id,k])=>out.push(...kitProblems(id,k)));return out}
/* the only way a badge is earned */
const canBadge=(r,coach)=>!!r&&r.verification_status==='Verified'&&!rotProblems(r,coach).some(x=>x.lv==='error');
const kitOk=(k,id)=>!!k&&k.status==='Verified'&&!kitProblems(id,k).some(x=>x.lv==='error');
const kitComplete=(k,id)=>!!k&&!kitProblems(id,k).some(x=>x.lv==='error');
/* what the website gets: reviewed kits, and rotations that are Verified, pass every check and are approved */
/* what the website gets: c.index (which kits are published; each kit is its own file, loaded only when needed),
   and rotations that are Verified, pass every check, are approved and belong to a published kit. kits = the kit files. */
function publicCoach(full){const c=JSON.parse(JSON.stringify(full||{}));const kits=Object.fromEntries(Object.entries(c.kits||{}).filter(([id,k])=>kitOk(k,id)&&k.publish!==false).map(([id,k])=>{delete k.edited;delete k.notes;delete k.unresolved;delete k.history;(k.sources||[]).forEach(s=>delete s.batch);(k.abilities||[]).forEach(a=>{delete a.edited;delete a.batch});return[id,k]}));
 c.index=Object.fromEntries(Object.entries(kits).map(([id,k])=>[id,{name:k.name||'',el:k.el||'',wt:k.wt||'',role:k.role||'',verified_at:k.verified_at||'',version:k.version||''}]));
 c.rotations=(c.rotations||[]).filter(r=>canBadge(r,full)&&r.approved!==false&&kits[r.character_id]).map(r=>{delete r.review_notes;delete r.approved;delete r.edited_at;delete r.import_batch;return r});
 ['kits','research','fp','flags','suggest','sources','seenTeams','teamIndex','progress','kitsVersion','log','history','importUndo'].forEach(k=>delete c[k]);c.kits={};return{coach:c,kits}}
/* ---------- choosing a rotation ---------- */
const lo=(r,id)=>id===r.character_id?num((r.minimum_constellation_requirements||{})[id],0):num(((r.teammate_constellation_requirements||{})[id]||{}).min,0);
const hi=(r,id)=>id===r.character_id?num((r.maximum_constellation_requirements||{})[id],6):num(((r.teammate_constellation_requirements||{})[id]||{}).max,6);
const live=(coach,char)=>(coach.rotations||[]).filter(r=>r.character_id===char&&canBadge(r,coach));
/* rotations a character appears in as a teammate (their page links to the main character's lesson) */
const asMate=(coach,char)=>(coach.rotations||[]).filter(r=>r.character_id!==char&&(r.team||[]).some(m=>norm(m.name)===char)&&canBadge(r,coach));
function teams(coach,char){const m=new Map();live(coach,char).forEach(r=>{const k=teamKey(r);if(!m.has(k))m.set(k,{key:k,team:r.team,members:r.team_member_ids,rotations:[],name:r.rotation_name});m.get(k).rotations.push(r)});
 return[...m.values()].map(t=>{const d={};t.members.forEach(id=>{if(id!==char)d[id]=Math.min(...t.rotations.map(r=>lo(r,id)))});t.defaults=d;t.featuredMax=Math.max(...t.rotations.map(r=>hi(r,char)));t.name=t.rotations.length>1?t.rotations[0].rotation_name.replace(/\s*\([^)]*C\d[^)]*\)\s*$/,''):t.name;return t})}
function gearOk(r,ctx){const g=ctx.gear||{},bad=[];(r.required_weapon_conditions||[]).forEach(w=>{if((w.actor_id||r.character_id)===r.character_id&&w.weapon&&g.weapon!==w.weapon)bad.push('needs '+w.weapon)});
 (r.required_artifact_conditions||[]).forEach(a=>{if((a.actor_id||r.character_id)===r.character_id&&a.set&&!(g.set===a.set&&pcsOf(g.pcs)>=(a.pcs||4)))bad.push('needs '+(a.pcs||4)+'-piece '+a.set)});return bad}
function fits(r,ctx){const need=[];const C=ctx.cons|0,tc=ctx.tc||{};
 if(C<lo(r,r.character_id)||C>hi(r,r.character_id))need.push({id:r.character_id,from:C,lo:lo(r,r.character_id),hi:hi(r,r.character_id)});
 (r.team_member_ids||[]).forEach(id=>{if(id===r.character_id)return;const v=num(tc[id],0);if(v<lo(r,id)||v>hi(r,id))need.push({id,from:v,lo:lo(r,id),hi:hi(r,id)})});
 return{need,gear:gearOk(r,ctx)}}
const spec=r=>Object.keys(r.minimum_constellation_requirements||{}).length+Object.keys(r.maximum_constellation_requirements||{}).length+Object.keys(r.teammate_constellation_requirements||{}).length*2+(r.required_weapon_conditions||[]).length+(r.required_artifact_conditions||[]).length;
const nameOf=(r,id)=>((r.team||[]).find(m=>m.id===id)||{}).name||id;
const rng=(a,b)=>a===b?'C'+a:'C'+a+'–C'+b;
function select(coach,ctx){const L=live(coach,ctx.char).filter(r=>!ctx.team||teamKey(r)===ctx.team);
 const ok=L.filter(r=>{const f=fits(r,ctx);return!f.need.length&&!f.gear.length}).sort((a,b)=>spec(b)-spec(a));
 const cons=consRules(coach,ctx.char);
 if(ok.length){let rot=ok[0];const top=ok.filter(r=>spec(r)===spec(rot));const easy=top.find(r=>r.rotation_type==='easy'),opt=top.find(r=>r.rotation_type==='optimized');const variants=easy&&opt?{easy,optimized:opt}:null;
  if(variants&&ctx.variant&&variants[ctx.variant])rot=variants[ctx.variant];else if(ctx.r){const want=top.find(r=>r.rotation_id===ctx.r);if(want)rot=want}
  return{ok:true,rot,variants,why:whyOf(rot,ctx,cons),assumptions:assume(rot,ctx),actions:resolve(rot,ctx),cons}}
 /* nothing fits: the nearest reviewed rotation, and what would need to change */
 const all=(L.length?L:live(coach,ctx.char)).map(r=>{const f=fits(r,ctx);return{r,f,d:f.need.reduce((s,n)=>s+(n.from<n.lo?n.lo-n.from:n.from-n.hi),0)+f.gear.length*3}}).sort((a,b)=>a.d-b.d);
 const best=all[0];if(!best)return{ok:false,none:true,msg:'No reviewed rotation for this character yet.'};
 const need=best.f.need.map(n=>nameOf(best.r,n.id)+' would need to be '+rng(n.lo,n.hi)+' (you picked C'+n.from+')').concat(best.f.gear.map(g=>nameOf(best.r,best.r.character_id)+' '+g));
 const fix=Object.assign({},ctx,{tc:Object.assign({},ctx.tc||{})});best.f.need.forEach(n=>{const v=n.from<n.lo?n.lo:n.hi;if(n.id===best.r.character_id)fix.cons=v;else fix.tc[n.id]=v});fix.team=teamKey(best.r);
 const reason=(cons.rules[ctx.cons|0]&&cons.rules[ctx.cons|0][0]!=='none'&&best.f.need.some(n=>n.id===ctx.char))?cons.rules[ctx.cons|0][1]:'';
 return{ok:false,closest:best.r,need,fix,reason,msg:'No verified rotation for this exact setup yet. Here’s the closest supported preset and what would need to change.'}}
function whyOf(r,ctx,cr){const w=[];const mn=lo(r,r.character_id),mx=hi(r,r.character_id),n=ctx.cons|0,who=nameOf(r,r.character_id),rules=(cr&&cr.rules)||{};const unk=[];for(let i=1;i<=n;i++){const x=rules[i];if(!x||x[0]==='unknown')unk.push('C'+i)}
 w.push(mx<6||mn>0?'Written for '+who+' at '+rng(mn,mx)+'; you picked C'+n+'.':unk.length?'The source gives no constellation requirement for this rotation. '+who+'’s '+unk.join(', ')+' '+(unk.length>1?'haven’t':'hasn’t')+' been reviewed for rotation changes yet, so treat it as the C0 rotation.':'Works at every '+who+' constellation; constellations here add power, not new steps.');
 Object.entries(r.teammate_constellation_requirements||{}).forEach(([id,v])=>w.push('This version is for '+nameOf(r,id)+' '+rng(num(v.min,0),num(v.max,6))+' (you picked C'+num((ctx.tc||{})[id],0)+').'));
 const sk=resolve(r,ctx).filter(a=>a.skip);sk.forEach(a=>w.push('Step “'+a.display_text+'” is skipped: '+a.skip));return w}
function assume(r,ctx){const A=[nameOf(r,r.character_id)+' C'+(ctx.cons|0)];(r.team_member_ids||[]).forEach(id=>{if(id!==r.character_id)A.push(nameOf(r,id)+' C'+num((ctx.tc||{})[id],0))});return A}
function resolve(r,ctx){const g=ctx.gear||{};return(r.ordered_actions||[]).map(a=>{const x=Object.assign({},a);(a.required_conditions||[]).forEach(c=>{if(c.type==='artifact_not'&&g.set===c.set&&pcsOf(g.pcs)>=(c.pcs||4))x.skip='this gear uses '+(c.pcs||4)+'-piece '+c.set+'.';if(c.type==='cons_min'&&num(c.id===r.character_id?ctx.cons:(ctx.tc||{})[c.id],0)<c.min)x.skip=nameOf(r,c.id)+' needs C'+c.min+'.'});return x})}
/* constellation coaching */
function consRules(coach,char){const c=(coach.cons||{})[char]||{};return{key:c.key||0,keyWhy:c.keyWhy||'',rules:c.rules||{}}}
function consUpTo(coach,char,n){const c=consRules(coach,char);const L=[];for(let i=1;i<=n;i++){const r=c.rules[i];if(r)L.push({n:i,type:r[0],label:CHANGE[r[0]]||r[0],note:r[1]})}return L}
/* "Why this step?": the ability card behind a step */
/* kitOf(id) returns a loaded kit or null; works for teammates too (their kit, when it has one) */
function abilityFor(coach,r,a,kitOf){if(!a)return null;const m=(r.team||[]).find(x=>x.id===a.actor_id)||{};const kid=norm(m.name||a.actor_id);const k=kitOf?kitOf(kid):(coach.kits||{})[kid]||(coach.kits||{})[a.actor_id];if(!k)return null;const s={skill:'e',burst:'q',attack:'na',plunge:'na',charged:'na'}[a.action_type];return(k.abilities||[]).find(x=>x.slot===s)||null}
/* share links: never anything personal, only the setup */
function shareQuery(st){const p=new URLSearchParams();if(st.team)p.set('team',st.team);if(st.r)p.set('r',st.r);p.set('c',String(st.cons|0));const tc=Object.entries(st.tc||{}).filter(([,v])=>v|0).map(([k,v])=>k+'.'+(v|0)).join(',');if(tc)p.set('tc',tc);if(st.gear)p.set('g',st.gear);if(st.mode&&st.mode!=='simple')p.set('m',st.mode);if(st.variant)p.set('v',st.variant);return p.toString()}
function readQuery(q){const p=new URLSearchParams(q),o={};if(p.get('team'))o.team=p.get('team').replace(/[^a-z0-9_\-]/g,'');if(p.get('r'))o.r=p.get('r').replace(/[^a-z0-9\-]/g,'');if(p.has('c'))o.cons=num(p.get('c'),0);o.tc={};String(p.get('tc')||'').split(',').forEach(x=>{const m=x.match(/^([a-z0-9\-]{1,40})\.([0-6])$/);if(m)o.tc[m[1]]=+m[2]});const g=p.get('g');if(GEAR.some(x=>x[0]===g))o.gear=g;const m=p.get('m');if(MODES.includes(m))o.mode=m;const v=p.get('v');if(v==='easy'||v==='optimized')o.variant=v;return o}
/* the readable part of a character's coach page (search engines, and anyone who wants the gist without the animation) */
function pageText(coach,c,e,o){o=o||{};const k=o.kit||(coach.kits||{})[c.id]||{abilities:[]},T=teams(coach,c.id),A=s=>(k.abilities||[]).find(a=>a.slot===s),cr=consRules(coach,c.id);let b='';
 b+='<div class="ar-blk ar-blk-kit"><h2>What '+e(c.name)+'’s kit does</h2><ul class="ar-abil">'+['na','e','q','a1','a4'].map(A).filter(Boolean).map(a=>'<li class="ar-ab ar-ab-'+e(a.slot)+'"><span class="ar-abt">'+e(a.type)+'</span><b>'+e(a.name)+'</b><span class="ar-abd">'+e(a.simple)+'</span></li>').join('')+'</ul></div>';
 const big=[1,2,3,4,5,6].filter(n=>cr.rules[n]&&cr.rules[n][0]!=='none');b+='<div class="ar-blk ar-blk-cons"><h2>Constellations</h2>'+(cr.key?'<p class="ar-ckey"><span class="ar-cb">Key upgrade · C'+cr.key+'</span> '+e(cr.keyWhy)+'</p>':'')+(big.length?'<ul class="ar-cons">'+big.map(n=>'<li><span class="ar-cb">C'+n+'</span><span>'+e(cr.rules[n][1])+'</span></li>').join('')+'</ul>':'<p>None of '+e(c.name)+'’s constellations change the button order in the rotations here; they add power.</p>')+'</div>';
 b+=(T.length?'<div class="ar-blk ar-blk-teams"><h2>Teams you can learn</h2>':'')+T.map(t=>'<div class="ar-team"><h3>'+e(t.name)+'</h3><ul>'+t.team.map(m=>'<li>'+e(m.name)+' ('+e(m.role)+')'+(m.does?': '+e(m.does):'')+'</li>').join('')+'</ul>'+t.rotations.map(r=>'<p><b>'+e(r.rotation_name)+'</b>'+(r.rotation_notation?': <code>'+e(r.rotation_notation)+'</code>':'')+'</p>').join('')+'</div>').join('')+(T.length?'</div>':'');
 const nk=L=>L.map(norm).sort().join('_'),done=new Set(T.map(t=>nk(t.team.map(m=>m.name))).concat(asMate(coach,c.id).map(r=>nk(r.team.map(m=>m.name))))),gt=(o.guideTeams||[]).filter(t=>!done.has(nk(t.members)));if(gt.length)b+='<div class="ar-blk ar-blk-guide"><h2>Teams from the build guide</h2><ul class="ar-gteams">'+gt.map(t=>'<li>'+(t.name?'<b>'+e(t.name)+'</b>':'')+'<span>'+t.members.map(e).join(' · ')+'</span></li>').join('')+'</ul><p class="ar-note">Rotation lessons for this team are still being verified.</p></div>';
 const am=asMate(coach,c.id);if(am.length)b+='<div class="ar-blk ar-blk-mates"><h2>Also in these lessons</h2><ul>'+am.map(r=>'<li><a href="/arena/'+e(r.character_id)+'"'+(o.link?' data-link':'')+'>'+e(nameOf(r,r.character_id))+': '+e(r.rotation_name)+'</a></li>').join('')+'</ul></div>';
 b+='<div class="ar-blk ar-blk-learn"><h2>What you’ll learn</h2><p>Pick your constellation and gear, choose a team, then watch the rotation one step at a time on a pixel-art training ground: who acts, what they press and why it matters, in Razor, Simple or Detailed language. If no reviewed rotation fits your exact setup, the coach says so and shows the closest one.</p>';
 const S=[];T.forEach(t=>t.rotations.forEach(r=>(r.sources||[]).forEach(s=>{if(!S.some(x=>x.name===s.name))S.push(s)})));if(S.length)b+='<p>Rotations reviewed against: '+S.map(s=>e(s.name)).join(', ')+'.</p>';
 if(o.guide)b+='<p>Want the weapons, artifacts and stats too? See the <a href="'+e(o.guide)+'"'+(o.link?' data-link':'')+'>'+e(c.name)+' build guide</a>.</p>';return b+'</div>'}
const pageDesc=c=>'Learn '+c.name+'’s kit and team rotations step by step: what each ability does, what to press, and why, for your constellation and gear. Free, no account needed.';
const api={norm,KSTATUS,kitComplete,asMate,pageText,pageDesc,STATUS,GEAR,SLOTS,MODES,CHANGE,teamKey,validate,rotProblems,kitProblems,canBadge,kitOk,publicCoach,teams,select,resolve,consRules,consUpTo,abilityFor,shareQuery,readQuery};
if(typeof window!=='undefined')window.PPCoach=api;if(typeof module!=='undefined')module.exports=api;
})();
