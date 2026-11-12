/* PawPixl Team Lab: the rules. No scores, no damage numbers, nothing generated.
   Three kinds of fact go in, and every finding says which kind it rests on:
     guides  PawPixl's own reviewed build guides (roles, teams, why each teammate is there, pros and cons)
     tags    what each character's own talents do (healing, shield, buff...), found by fixed rules in released talent text
     elems   which reactions two elements can make (the same table the Arena team builder uses)
   Trust levels: reviewed | supported | experimental | insufficient. */
(function(){
const W=typeof window!=='undefined'?window:globalThis;
const norm=s=>String(s||'').toLowerCase().replace(/[^a-z0-9]/g,'');
const ELS=['anemo','geo','electro','dendro','hydro','pyro','cryo'];
const key=(n,el)=>{const k=norm(n);if(!/traveler|traveller|aether|lumine/.test(k))return k;const e=ELS.find(x=>k.includes(x))||ELS.find(x=>x===norm(el));return e?'traveler'+e:k};
const TRUST={reviewed:['Reviewed team','This exact team is in a PawPixl guide.'],supported:['Supported substitution','Same element, same kind of role in PawPixl\u2019s guides, and the talent text shows the same function.'],experimental:['Experimental suggestion','Could work on paper. PawPixl has not reviewed this exact team.'],insufficient:['Not enough data','PawPixl does not have enough information to say.']};
const FN={heal:'team healing',shield:'a shield',buff:'a team buff',shred:'lowers enemy RES or DEF',battery:'restores Energy for teammates',ir:'resistance to interruption'};
/* does a guide's role wording mean "stays on the field to deal damage"? */
const ONW=/main dps|on-?field|driver|hypercarry|\bcarry\b/i,OFFW=/off-?field|sub[- ]?dps/i;
/* a role that names both ("On-field or Off-field DPS", "Main DPS & Sub DPS") is flexible: the character can do either */
const isFlex=r=>{r=String(r||'');return(ONW.test(r)&&OFFW.test(r))||/\bon\s*(&|and|or|\/|,)\s*off[- ]?field/i.test(r)||/\boff\s*(&|and|or|\/|,)\s*on[- ]?field/i.test(r)||/\bflex/i.test(r)};
const isOn=r=>{r=String(r||'');if(isFlex(r))return false;if(OFFW.test(r))return false;return ONW.test(r)||/\bdps\b/i.test(r)};
const JOBW=['shield','heal','buff','shred','support','sub dps','sub-dps','battery','enabler','off-field','driver','dps'];const jobWords=r=>JOBW.filter(w=>String(r||'').toLowerCase().includes(w));
const PAIRS=[['Vaporize','Pyro','Hydro'],['Melt','Pyro','Cryo'],['Overloaded','Pyro','Electro'],['Burning','Pyro','Dendro'],['Frozen','Hydro','Cryo'],['Electro-Charged','Hydro','Electro'],['Bloom','Hydro','Dendro'],['Superconduct','Electro','Cryo'],['Quicken','Electro','Dendro']];
const list=a=>a.length<2?a.join(''):a.slice(0,-1).join(', ')+' and '+a[a.length-1];
function make(D){const tags=(D.tags&&D.tags.chars)||{},roster=D.roster||[],RX=D.rx||null;
 const byKey=new Map();roster.forEach(r=>byKey.set(key(r.name,r.el),r));
 /* guides: one entry per build guide, teams with the roles and reasons the guide gives */
 const G=new Map(),TEAMS=[];(D.guides||[]).forEach(g=>{const k=key(g.name);G.set(k,g);(g.teams||[]).forEach(t=>{const m=(t.members||[]).map(n=>key(n));if(m.length===4&&new Set(m).size===4)TEAMS.push({owner:g.name,ownerId:g.id,name:t.name||'',m,names:t.members.slice(),roles:(t.roles||[]).slice(),text:t.text||'',sig:m.slice().sort().join('|')})})});
 const info=k=>{const t=tags[k]||null,r=byKey.get(k)||null,g=G.get(k)||null;if(!t&&!r)return null;return{key:k,id:(r&&r.id)||k,name:(r&&r.name)||(t&&t.n)||k,el:(r&&r.el)||(t&&t.el)||'',r:(r&&r.r)||(t&&t.r)||null,wt:t?t.wt:'',f:t?t.f:null,names:t?t.names:{},cost:t?t.cost:null,icon:r&&r.icon||'',guide:g?g.id:'',roles:g&&g.roles?g.roles.filter(Boolean):[],cons:g&&g.cons?g.cons:[],hasTags:!!t,traveler:/^traveler/.test(k)}};
 const all=()=>{const S=new Set([...byKey.keys()]);return[...S].map(info).filter(Boolean).sort((a,b)=>a.name.localeCompare(b.name))};
 const reviewed=keys=>{const s=keys.slice().sort().join('|');return TEAMS.filter(t=>t.sig===s)};
 const teamsWith=k=>TEAMS.filter(t=>t.m.includes(k));
 /* the role a character has in THIS team if a guide says so, else their general reviewed role, else nothing */
 const roleIn=(k,keys)=>{for(const t of reviewed(keys)){const i=t.m.indexOf(k);if(i>=0&&t.roles[i])return{role:t.roles[i],src:'reviewed team'}}const c=info(k);if(c&&c.roles.length)return{role:c.roles.join(' / '),src:'their guide'};
  /* a role another guide gives them most often, when they have no guide of their own */
  const n={};teamsWith(k).forEach(t=>{const r=t.roles[t.m.indexOf(k)];if(r)n[r]=(n[r]||0)+1});const best=Object.keys(n).sort((a,b)=>n[b]-n[a])[0];return best?{role:best,src:'other guides'}:{role:'',src:''}};
 const reactions=els=>{const S=new Set(els);const out=(RX?RX.reactions(els).map(x=>({name:x.name,els:x.els})):PAIRS.filter(p=>S.has(p[1])&&S.has(p[2])).map(p=>({name:p[0],els:[p[1],p[2]]})));
  if(S.has('Hydro')&&S.has('Dendro')&&S.has('Electro'))out.push({name:'Hyperbloom',els:['Hydro','Dendro','Electro']});if(S.has('Hydro')&&S.has('Dendro')&&S.has('Pyro'))out.push({name:'Burgeon',els:['Hydro','Dendro','Pyro']});
  if(S.has('Anemo')&&['Pyro','Hydro','Electro','Cryo'].some(e=>S.has(e)))out.push({name:'Swirl',els:['Anemo']});if(S.has('Geo')&&['Pyro','Hydro','Electro','Cryo'].some(e=>S.has(e)))out.push({name:'Crystallize',els:['Geo']});const seen=new Set();return out.filter(x=>!seen.has(x.name)&&seen.add(x.name))};
 const resonance=els=>{if(RX)return RX.resonance(els).map(x=>x.name);const n={};els.forEach(e=>n[e]=(n[e]||0)+1);return Object.keys(n).filter(e=>n[e]>=2).map(e=>e+' resonance')};
 const ab=(c,slots)=>slots.map(s=>c.names[s]||s).join(', ');
 const who=(C,t)=>C.filter(c=>c.f&&c.f[t]);
 /* ---- Team Doctor ---- */
 function doctor(keys){keys=keys.filter(Boolean);const C=keys.map(info).filter(Boolean);const full=keys.length===4&&C.length===4;const out={full,keys,trust:'experimental',reviewed:null,objective:null,roles:[],onfield:[],flex:[],reactions:[],resonance:[],defense:{heal:[],shield:[],ir:[]},working:[],consider:[],improve:[],missing:[]};
  out.roles=C.map(c=>{const r=roleIn(c.key,keys);return{key:c.key,name:c.name,el:c.el,role:r.role,src:r.src}});
  C.forEach(c=>{if(!c.hasTags)out.missing.push('PawPixl has no talent data for '+c.name+', so their healing, shields and buffs cannot be checked.');});
  out.roles.forEach(r=>{if(!r.role)out.missing.push('No reviewed role on file for '+r.name+', so the field-time check may be incomplete.')});
  if(!full)return out;
  const els=C.map(c=>c.el).filter(Boolean);out.reactions=reactions(els);out.resonance=resonance(els);
  const rv=reviewed(keys)[0]||null;if(rv){out.trust='reviewed';out.reviewed=rv;out.objective={text:(rv.name?rv.name+'. ':'')+(rv.text||''),src:'From PawPixl’s '+rv.owner+' guide.'};out.working.push('This exact team is in PawPixl’s '+rv.owner+' guide'+(rv.name?' as “'+rv.name+'”':'')+'.')}
  out.onfield=out.roles.filter(r=>isOn(r.role)).map(r=>r.name);out.flex=out.roles.filter(r=>isFlex(r.role)).map(r=>r.name);
  /* nobody is fixed on the field, but someone can take it: they are the likely on-field character here */
  if(!out.onfield.length&&out.flex.length){out.onfield=[out.flex[0]];out.working.push(list(out.flex)+' can play on or off the field according to PawPixl\u2019s guides. In this team '+out.flex[0]+' is the one most likely to take the field.')}
  else if(out.flex.length)out.working.push(list(out.flex)+' can play on or off the field, so '+(out.flex.length>1?'they':'they')+' can stay off it here.');
  if(!rv){const main=out.onfield[0],rx=out.reactions.filter(x=>!/Swirl|Crystallize/.test(x.name)).map(x=>x.name);out.objective={text:(main?'Built around '+main+(out.onfield.length>1?' (or '+list(out.onfield.slice(1))+')':'')+'. ':'')+(rx.length?'Its elements can make '+list(rx)+'.':'Its elements make no damage reaction with each other, so it relies on raw damage and buffs.'),src:main?'Worked out from guide roles and elements. Not a reviewed team.':'Worked out from elements only. PawPixl has no on-field role on file for these four.'}}
  /* defense */
  who(C,'heal').forEach(c=>out.defense.heal.push({name:c.name,from:ab(c,c.f.heal)}));who(C,'shield').forEach(c=>out.defense.shield.push({name:c.name,from:ab(c,c.f.shield)}));who(C,'ir').forEach(c=>out.defense.ir.push({name:c.name,from:ab(c,c.f.ir)}));
  /* what's working */
  if(out.onfield.length===1)out.working.push(out.onfield[0]+' has the field to themselves: nobody else here is listed as an on-field damage dealer.');
  out.reactions.filter(x=>x.els.length>1).slice(0,4).forEach(x=>out.working.push(list(x.els)+' are all here, so '+x.name+' is possible.'));
  if(out.resonance.length)out.working.push('Elemental Resonance: '+list(out.resonance)+'.');
  who(C,'heal').forEach(c=>out.working.push(c.name+' has healing for teammates ('+ab(c,c.f.heal)+').'));who(C,'shield').forEach(c=>out.working.push(c.name+' brings a shield ('+ab(c,c.f.shield)+').'));
  who(C,'buff').forEach(c=>out.working.push(c.name+' has a team buff ('+ab(c,c.f.buff)+').'));who(C,'shred').forEach(c=>out.working.push(c.name+' can lower enemy RES or DEF ('+ab(c,c.f.shred)+').'));who(C,'battery').forEach(c=>out.working.push(c.name+' can restore Energy for teammates ('+ab(c,c.f.battery)+').'));
  /* things to consider */
  if(out.onfield.length>1){out.consider.push(list(out.onfield)+' are each listed as an on-field damage dealer in PawPixl’s guides. They would share field time.');out.improve.push('Try “Who can replace them?” on one of '+list(out.onfield)+' to find a teammate who works from off the field.')}
  if(!out.onfield.length&&out.roles.every(r=>r.role))out.consider.push('Nobody here is listed as an on-field damage dealer in PawPixl’s guides.');
  const tagged=C.every(c=>c.hasTags);
  if(tagged&&!out.defense.heal.length&&!out.defense.shield.length){const self=who(C,'selfheal');out.consider.push('No team healing or shield was found in these four kits'+(self.length?' ('+list(self.map(c=>c.name))+' can heal only themselves)':'')+'. Some teams are played that way on purpose; it asks for more careful dodging.');out.improve.push('For more safety, use “Who can replace them?” with the More defensive filter.')}
  C.forEach(c=>{const need=(c.cons||[]).find(x=>/heal/i.test(x));if(need&&!out.defense.heal.filter(h=>h.name!==c.name).length)out.consider.push(c.name+'’s guide lists “'+need+'”, and no other teammate here heals the whole team.')});
  const big=C.filter(c=>c.cost>=80);if(big.length&&!who(C,'battery').length)out.consider.push('Costly Bursts: '+list(big.map(c=>c.name+' ('+c.cost+' Energy)'))+'. No ability that restores teammates’ Energy was found in this team.');
  if(!out.reactions.some(x=>x.els.length>1)&&new Set(els).size>1)out.consider.push('These elements do not react with each other for damage.');
  /* possible improvements: a reviewed team one swap away */
  const near=TEAMS.map(t=>({t,miss:t.m.filter(k=>!keys.includes(k)),extra:keys.filter(k=>!t.m.includes(k))})).filter(x=>x.miss.length===1).slice(0,3);
  if(!rv)near.forEach(x=>{const a=info(x.extra[0]),b=info(x.miss[0]);if(a&&b)out.improve.push('One swap from a reviewed team: '+b.name+' in place of '+a.name+' gives “'+(x.t.name||x.t.owner+' team')+'” from the '+x.t.owner+' guide.')});
  out.improve=[...new Set(out.improve)];out.missing=[...new Set(out.missing)];return out}
 /* ---- Smart substitutions ---- */
 function job(keys,i){const C=keys.map(info),m=C[i],others=C.filter((c,j)=>j!==i&&c);if(!m)return null;const fn=m.f?Object.keys(m.f).filter(t=>FN[t]):[];const unique=fn.filter(t=>!others.some(c=>c.f&&c.f[t]));
  const elsNow=reactions(C.filter(Boolean).map(c=>c.el)).map(x=>x.name),elsWithout=reactions(others.map(c=>c.el)).map(x=>x.name);const r=roleIn(m.key,keys);
  return{m,others,fn,unique,rxNeed:elsNow.filter(n=>!elsWithout.includes(n)),role:r.role,roleSrc:r.src,onfield:isOn(r.role)}}
 function subs(keys,i,o){o=o||{};const J=job(keys,i);const notes=[];if(!J)return{job:null,list:[],notes:['Pick a teammate first.']};const m=J.m,oth=J.others.map(c=>c.key);
  if(!m.hasTags)notes.push('PawPixl has no talent data for '+m.name+', so only swaps that appear in reviewed teams can be shown.');
  if(o.easy)notes.push('PawPixl has no ease-of-play information yet, so the Easier to play filter cannot be applied. Nothing was hidden by it.');
  if(o.owned&&!(o.ownedSet&&o.ownedSet.size))notes.push('You have not marked any characters as owned yet. Mark them in the character picker, then this filter can work.');
  const inv=o.inv||'medium';notes.push(inv==='low'?'Low investment: four-star characters and the Traveler are listed first. Nothing is hidden.':inv==='high'?'High investment: five-star characters are listed first. Nothing is hidden.':'Medium investment: four-star and five-star characters are mixed.');
  notes.push('PawPixl has no weapon or constellation data per team yet, so investment only changes the order of characters.');
  const out=[];all().forEach(c=>{if(keys.includes(c.key)||c.key===m.key)return;const nk=oth.concat([c.key]);const rv=reviewed(nk)[0];
   const provides=c.f?Object.keys(c.f).filter(t=>FN[t]):[];const keeps=J.unique.filter(t=>provides.includes(t)),lost=J.unique.filter(t=>!provides.includes(t)),adds=provides.filter(t=>!J.fn.includes(t)&&!J.others.some(x=>x.f&&x.f[t]));
   const rxNew=reactions(J.others.map(x=>x.el).concat([c.el])).map(x=>x.name),rxOld=reactions(J.others.map(x=>x.el).concat([m.el])).map(x=>x.name),rxLost=rxOld.filter(n=>!rxNew.includes(n)),rxGain=rxNew.filter(n=>!rxOld.includes(n));
   const cr=roleIn(c.key,nk),cOn=isOn(cr.role),sameJob=jobWords(cr.role).some(w=>jobWords(J.role).includes(w));
   let trust='insufficient';if(rv)trust='reviewed';else if(c.hasTags&&m.hasTags&&J.unique.length&&keeps.length===J.unique.length&&!(cOn&&!J.onfield))trust=(c.el===m.el&&sameJob)?'supported':'experimental';else if(c.hasTags&&m.hasTags&&J.unique.length&&keeps.length)trust='experimental';
   if(trust==='insufficient')return;
   const S={key:c.key,id:c.id,name:c.name,el:c.el,r:c.r,icon:c.icon,guide:c.guide,role:rv?(rv.roles[rv.m.indexOf(c.key)]||cr.role):cr.role,trust,provides:[],loses:[],changes:[],limits:[]};
   if(rv)S.provides.push('Listed with these three teammates in PawPixl’s '+rv.owner+' guide'+(rv.name?' (“'+rv.name+'”)':'')+'.');
   if(keeps.length)S.provides.push('Keeps '+list(keeps.map(t=>FN[t]))+' ('+keeps.map(t=>ab(c,c.f[t])).join('; ')+').');if(adds.length)S.provides.push('Adds '+list(adds.map(t=>FN[t]))+'.');
   if(lost.length)S.loses.push('The team loses '+list(lost.map(t=>FN[t]))+', which only '+m.name+' brought.');if(rxLost.length)S.loses.push(list(rxLost)+' is no longer possible.');
   if(c.el!==m.el)S.changes.push(c.el+' instead of '+m.el+(rxGain.length?': '+list(rxGain)+' becomes possible.':'.'));if(cOn&&!J.onfield)S.changes.push(c.name+' is listed as an on-field damage dealer, so they would want field time '+m.name+' did not.');if(!cOn&&J.onfield)S.changes.push(m.name+' was the on-field damage dealer here. '+c.name+' is not listed as one.');
   if(c.wt&&m.wt&&c.wt!==m.wt&&!S.changes.length)S.changes.push('Plays differently: '+c.wt+' user instead of '+m.wt+'.');
   if(trust!=='reviewed')S.limits.push('Not reviewed by PawPixl for this exact team.');if(c.f&&c.f.shield&&keeps.includes('shield'))S.limits.push('Shield strength and uptime differ between characters; check the ability.');
   S.def=adds.some(t=>/heal|shield|ir/.test(t))||(!J.fn.some(t=>/heal|shield/.test(t))&&provides.some(t=>/heal|shield/.test(t)));S.off=adds.some(t=>/buff|shred/.test(t))||cOn;out.push(S)});
  let L=out;if(o.four)L=L.filter(s=>s.r===4);if(o.f2p)L=L.filter(s=>s.r===4||/^traveler/.test(s.key));if(o.def)L=L.filter(s=>s.def);if(o.off)L=L.filter(s=>s.off);if(o.owned&&o.ownedSet&&o.ownedSet.size)L=L.filter(s=>o.ownedSet.has(s.key));
  if(o.f2p)notes.push('F2P-friendly here means four-star characters and the Traveler. PawPixl has no list of free five-star characters.');
  const TR={reviewed:0,supported:1,experimental:2},pref=s=>inv==='low'?(s.r===4||/^traveler/.test(s.key)?0:1):inv==='high'?(s.r===5?0:1):0;
  L.sort((a,b)=>TR[a.trust]-TR[b.trust]||pref(a)-pref(b)||a.name.localeCompare(b.name));
  if(!J.unique.length&&m.hasTags)notes.unshift(m.name+(J.onfield?' is the damage dealer here':' brings nothing here that a teammate does not also bring')+'. PawPixl does not compare damage, so only swaps found in reviewed teams are shown.');
  if(!L.length)notes.unshift(out.length?'No alternative matches these filters.':'PawPixl has no alternative it can stand behind for '+m.name+' in this team.');
  return{job:{name:m.name,role:J.role,unique:J.unique.map(t=>FN[t]),rxNeed:J.rxNeed},list:L.slice(0,12),total:L.length,notes}}
 /* ---- Build around my favorite ---- */
 function favorite(k){const c=info(k);if(!c)return null;const T=teamsWith(k),seen=new Set(),teams=[];T.forEach(t=>{if(seen.has(t.sig))return;seen.add(t.sig);
   /* alternatives: reviewed teams that differ from this one by a single teammate */
   const alts=[];TEAMS.forEach(u=>{if(u.sig===t.sig||!u.m.includes(k))return;const miss=u.m.filter(x=>!t.m.includes(x)),ext=t.m.filter(x=>!u.m.includes(x));if(miss.length===1){const a=info(ext[0]),b=info(miss[0]);if(a&&b&&!alts.some(z=>z.out===a.name&&z.in===b.name))alts.push({out:a.name,in:b.name,inKey:b.key,owner:u.owner})}});
   teams.push({name:t.name,owner:t.owner,ownerId:t.ownerId,keys:t.m,members:t.m.map((x,i)=>{const ci=info(x)||{name:t.names[i],el:'',key:x};return{key:x,name:ci.name,el:ci.el,icon:ci.icon||'',guide:ci.guide||'',role:t.roles[i]||''}}),text:t.text,alts})});
  teams.sort((a,b)=>(a.owner===c.name?0:1)-(b.owner===c.name?0:1));const fn=c.f?Object.keys(c.f).filter(t=>FN[t]).map(t=>({what:FN[t],from:ab(c,c.f[t])})):[];
  return{c,roles:c.roles,cons:c.cons,fn,selfheal:!!(c.f&&c.f.selfheal),teams,missing:[].concat(c.hasTags?[]:['No talent data for '+c.name+'.'],c.roles.length?[]:['PawPixl has no build guide for '+c.name+' yet, so there is no reviewed role.'],teams.length?[]:['No reviewed team in PawPixl’s guides includes '+c.name+' yet.'])}}
 return{info,all,doctor,subs,favorite,reviewed,roleIn,reactions,key}}
/* PawPixl's reviewed guide data, as the website already has it in content/<game>/index.json */
function guidesFrom(idx){const out=[],B=((idx||{}).posts||{}).builds||{},R=(idx||{}).roster||[];Object.keys(B).forEach(id=>{const v=(B[id].versions||[])[0];if(!v||!v.seo)return;const r=R.find(x=>x.id===id),name=r?r.name:(B[id].title||id),why=(v.why&&v.why.t)||[];
  const teams=(v.seo.teams||[]).map(t=>{const sig=(t.members||[]).map(norm).sort().join('|'),y=why.find(x=>x&&(x.members||[]).map(norm).sort().join('|')===sig)||{};return{name:t.name||'',members:t.members||[],roles:(t.members||[]).map(n=>{const i=(y.members||[]).findIndex(m=>norm(m)===norm(n));return i>=0&&y.roles?(y.roles[i]||''):''}),text:y.text||''}});
  out.push({id,name,roles:v.seo.roles||[],cons:v.seo.cons||[],teams})});return out}
const api={make,key,norm,TRUST,FN,guidesFrom};W.PPTeamLab=api;if(typeof module!=='undefined')module.exports=api;
})();
