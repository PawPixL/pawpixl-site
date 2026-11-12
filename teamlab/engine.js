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
const TRUST={reviewed:['Reviewed team','This exact team is featured in a PawPixl guide.'],supported:['Supported substitution','Same element and a similar job in PawPixl\u2019s guides, and their kit does the same thing for the team.'],experimental:['Experimental suggestion','Looks good on paper. PawPixl hasn\u2019t covered this exact lineup in a guide yet.'],insufficient:['Not enough data','PawPixl doesn\u2019t know enough about this one to say yet.']};
const FN={heal:'team healing',shield:'a shield',buff:'a team buff',shred:'an enemy RES or DEF reduction',battery:'Energy for teammates',ir:'resistance to interruption'};
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
 const info=k=>{const t=tags[k]||null,r=byKey.get(k)||null,g=G.get(k)||null;if(!t&&!r)return null;return{key:k,id:(r&&r.id)||k,name:(r&&r.name)||(t&&t.n)||k,el:(r&&r.el)||(t&&t.el)||'',r:(r&&r.r)||(t&&t.r)||null,wt:t?t.wt:'',f:t?t.f:null,names:t?t.names:{},cost:t?t.cost:null,cf:t&&t.cf?t.cf:{},cn:t&&t.cn?t.cn:{},icon:r&&r.icon||'',guide:g?g.id:'',roles:g&&g.roles?g.roles.filter(Boolean):[],cons:g&&g.cons?g.cons:[],hasTags:!!t,traveler:/^traveler/.test(k)}};
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
 /* a character as they are at the chosen constellation: base kit plus whatever C1..Cn add for the team */
 const atCons=(c,lv)=>{lv=Math.max(0,Math.min(6,+lv||0));if(!c||!c.f||!lv)return c;const f=Object.assign({},c.f),names=Object.assign({},c.names),from=[];Object.keys(c.cf||{}).forEach(t=>{if(t==='lvl'||!FN[t])return;const got=c.cf[t].filter(sl=>+sl.slice(1)<=lv);if(!got.length)return;f[t]=(f[t]||[]).concat(got);got.forEach(sl=>{names[sl]=sl.toUpperCase();from.push({t,slot:sl})})});return Object.assign({},c,{f,names,consLv:lv,consAdds:from})};
 /* what one constellation step changes, in Team Lab's terms. Text of the constellation itself comes from the approved kit file. */
 function consStep(k,lv){const c=info(k);if(!c)return null;const sl='c'+lv,t=Object.keys(c.cf||{}).filter(x=>x!=='lvl'&&FN[x]&&c.cf[x].includes(sl));return{key:k,name:c.name,level:lv,cname:(c.cn||{})[sl]||'',team:t.map(x=>FN[x]),talent:((c.cf||{}).lvl||[]).includes(sl),known:!!(c.cn&&c.cn[sl])}}
 function doctor(keys,cons){cons=cons||{};keys=keys.filter(Boolean);const C=keys.map(k=>atCons(info(k),cons[k])).filter(Boolean);const full=keys.length===4&&C.length===4;const out={full,keys,trust:'experimental',reviewed:null,objective:null,roles:[],onfield:[],flex:[],reactions:[],resonance:[],defense:{heal:[],shield:[],ir:[]},working:[],consider:[],improve:[],missing:[]};
  out.roles=C.map(c=>{const r=roleIn(c.key,keys);return{key:c.key,name:c.name,el:c.el,role:r.role,src:r.src}});
  C.forEach(c=>{if(!c.hasTags)out.missing.push('PawPixl doesn\u2019t have '+c.name+'\u2019s kit on file yet, so their healing, shields and buffs aren\u2019t counted here.');});
  out.roles.forEach(r=>{if(!r.role)out.missing.push('There\u2019s no guide role for '+r.name+' yet, so who takes the lead is a best guess.')});
  if(!full)return out;
  const els=C.map(c=>c.el).filter(Boolean);out.reactions=reactions(els);out.resonance=resonance(els);
  const rv=reviewed(keys)[0]||null;if(rv){out.trust='reviewed';out.reviewed=rv;out.objective={text:(rv.name?rv.name+'. ':'')+(rv.text||''),src:'From PawPixl’s '+rv.owner+' guide.'};out.working.push('You\u2019ve built the team from PawPixl’s '+rv.owner+' guide'+(rv.name?', “'+rv.name+'”':'')+'.')}
  out.onfield=out.roles.filter(r=>isOn(r.role)).map(r=>r.name);out.flex=out.roles.filter(r=>isFlex(r.role)).map(r=>r.name);
  /* nobody is fixed on the field, but someone can take it: they are the likely on-field character here */
  if(!out.onfield.length&&out.flex.length){out.onfield=[out.flex[0]];out.working.push(list(out.flex)+' can play on or off the field. Here, '+out.flex[0]+' is the natural pick to take the lead.')}
  else if(out.flex.length)out.working.push(list(out.flex)+(out.flex.length>1?' are':' is')+' flexible and can happily support from off the field here.');
  if(!rv){const main=out.onfield[0],rx=out.reactions.filter(x=>!/Swirl|Crystallize/.test(x.name)).map(x=>x.name);out.objective={text:(main?main+' takes the lead'+(out.onfield.length>1?', with '+list(out.onfield.slice(1))+' as another option':'')+'. ':'')+(rx.length?'The team plays around '+list(rx)+'.':(out.reactions.length?'The team leans on raw damage and buffs, with '+list(out.reactions.map(x=>x.name))+' on the side.':'These elements don\u2019t react with each other, so the team leans on raw damage and buffs.')),src:main?'Team Lab\u2019s read, based on guide roles and elements. Not a guide team.':'Team Lab\u2019s read, based on elements only. None of these four has a lead role in a PawPixl guide yet.'}}
  /* defense */
  who(C,'heal').forEach(c=>out.defense.heal.push({name:c.name,from:ab(c,c.f.heal)}));who(C,'shield').forEach(c=>out.defense.shield.push({name:c.name,from:ab(c,c.f.shield)}));who(C,'ir').forEach(c=>out.defense.ir.push({name:c.name,from:ab(c,c.f.ir)}));
  /* what's working */
  if(out.onfield.length===1)out.working.push(out.onfield[0]+' can take the lead while their teammates provide support'+(out.reactions.some(x=>x.els.length>1)?' and set up reactions':'')+'.');
  {const rn=out.reactions.filter(x=>x.els.length>1).slice(0,4).map(x=>x.name);if(rn.length)out.working.push('This lineup can trigger '+list(rn)+'.')}
  if(out.resonance.length)out.working.push('Elemental Resonance is active: '+list(out.resonance)+'.');
  who(C,'heal').forEach(c=>out.working.push(c.name+' can heal the team ('+ab(c,c.f.heal)+').'));who(C,'shield').forEach(c=>out.working.push(c.name+' can shield the team ('+ab(c,c.f.shield)+').'));
  who(C,'buff').forEach(c=>out.working.push(c.name+' buffs teammates ('+ab(c,c.f.buff)+').'));who(C,'shred').forEach(c=>out.working.push(c.name+' weakens enemies by lowering their RES or DEF ('+ab(c,c.f.shred)+').'));who(C,'battery').forEach(c=>out.working.push(c.name+' helps teammates recharge Energy ('+ab(c,c.f.battery)+').'));
  /* things to consider */
  if(out.onfield.length>1){out.consider.push(list(out.onfield)+' all like to be on the field, so they\u2019ll be sharing time out there.');out.improve.push('Want a smoother fit? Try “Who can replace them?” on one of '+list(out.onfield)+' to find someone who helps from off the field.')}
  if(!out.onfield.length&&out.roles.every(r=>r.role))out.consider.push('Nobody here is a usual lead in PawPixl’s guides, so put whoever you enjoy most on the field.');
  const tagged=C.every(c=>c.hasTags);
  if(tagged&&!out.defense.heal.length&&!out.defense.shield.length){const self=who(C,'selfheal');out.consider.push('There\u2019s no team healing or shield here'+(self.length?' ('+list(self.map(c=>c.name))+' can only heal themselves)':'')+'. Plenty of teams play that way; it just means dodging matters more.');out.improve.push('Want a safety net? Try “Who can replace them?” with the More defensive filter.')}
  C.forEach(c=>{const need=(c.cons||[]).find(x=>/heal/i.test(x));if(need&&!out.defense.heal.filter(h=>h.name!==c.name).length)out.consider.push(c.name+'’s guide mentions “'+need+'”, and nobody else here heals the whole team.')});
  const big=C.filter(c=>c.cost>=80);if(big.length&&!who(C,'battery').length)out.consider.push('Big Burst costs: '+list(big.map(c=>c.name+' ('+c.cost+' Energy)'))+'. Nobody here restores Energy for teammates, so Energy Recharge matters a little more.');
  /* constellations chosen for this team: only the ones that change something for the team */
  out.cons=C.filter(c=>c.consLv).map(c=>({name:c.name,level:c.consLv,adds:(c.consAdds||[]).map(a=>({slot:a.slot.toUpperCase(),what:FN[a.t]}))}));
  
  out.how=howPlays(C);
  /* possible improvements: a reviewed team one swap away */
  const near=TEAMS.map(t=>({t,miss:t.m.filter(k=>!keys.includes(k)),extra:keys.filter(k=>!t.m.includes(k))})).filter(x=>x.miss.length===1).slice(0,3);
  if(!rv)near.forEach(x=>{const a=info(x.extra[0]),b=info(x.miss[0]);if(a&&b)out.improve.push('One swap away from a guide team: bring in '+b.name+' for '+a.name+' and you have “'+(x.t.name||x.t.owner+' team')+'” from the '+x.t.owner+' guide.')});
  out.improve=[...new Set(out.improve)];out.missing=[...new Set(out.missing)];return out}
 /* ---- How this team plays: which elements meet, and in what order a reaction is set up. No timings, no rotation. ---- */
 const SEQ={Hyperbloom:[['Hydro','Apply Hydro'],['Dendro','apply Dendro to make Dendro Cores'],['Electro','hit the cores with Electro to trigger Hyperbloom']],Burgeon:[['Hydro','Apply Hydro'],['Dendro','apply Dendro to make Dendro Cores'],['Pyro','hit the cores with Pyro to trigger Burgeon']],Bloom:[['Hydro','Apply Hydro'],['Dendro','apply Dendro to make Dendro Cores, which burst on their own']],Vaporize:[['Hydro','Apply Hydro'],['Pyro','hit with Pyro (or the other way round) to Vaporize']],Melt:[['Cryo','Apply Cryo'],['Pyro','hit with Pyro (or the other way round) to Melt']],Frozen:[['Hydro','Apply Hydro'],['Cryo','apply Cryo to freeze the enemy']],Quicken:[['Dendro','Apply Dendro'],['Electro','apply Electro to Quicken the enemy, then keep hitting with Electro (Aggravate) or Dendro (Spread)']],'Electro-Charged':[['Hydro','Apply Hydro'],['Electro','apply Electro for Electro-Charged']],Overloaded:[['Pyro','Apply Pyro'],['Electro','apply Electro for Overloaded']],Superconduct:[['Cryo','Apply Cryo'],['Electro','apply Electro for Superconduct']],Burning:[['Dendro','Apply Dendro'],['Pyro','apply Pyro for Burning']]};
 function howPlays(C){const by={};C.forEach(c=>{(by[c.el]=by[c.el]||[]).push(c.name)});const els=C.map(c=>c.el).filter(Boolean),R=reactions(els).map(x=>x.name),out=[];const skip=new Set();if(R.includes('Hyperbloom')||R.includes('Burgeon'))skip.add('Bloom');
  R.forEach(n=>{if(skip.has(n)||!SEQ[n])return;out.push({reaction:n,steps:SEQ[n].map(([el,txt])=>({el,who:by[el]||[],text:txt}))})});
  if(R.includes('Swirl'))out.push({reaction:'Swirl',steps:[{el:'Anemo',who:by.Anemo||[],text:'Anemo attacks spread the element already on the enemy'}]});if(R.includes('Crystallize'))out.push({reaction:'Crystallize',steps:[{el:'Geo',who:by.Geo||[],text:'Geo attacks on an enemy with an element drop a shield crystal'}]});return out}
 /* ---- Smart substitutions ---- */
 function job(keys,i){const C=keys.map(info),m=C[i],others=C.filter((c,j)=>j!==i&&c);if(!m)return null;const fn=m.f?Object.keys(m.f).filter(t=>FN[t]):[];const unique=fn.filter(t=>!others.some(c=>c.f&&c.f[t]));
  const elsNow=reactions(C.filter(Boolean).map(c=>c.el)).map(x=>x.name),elsWithout=reactions(others.map(c=>c.el)).map(x=>x.name);const r=roleIn(m.key,keys);
  return{m,others,fn,unique,rxNeed:elsNow.filter(n=>!elsWithout.includes(n)),role:r.role,roleSrc:r.src,onfield:isOn(r.role)}}
 function subs(keys,i,o){o=o||{};const J=job(keys,i);const notes=[];if(!J)return{job:null,list:[],notes:['Pick a teammate first.']};const m=J.m,oth=J.others.map(c=>c.key);
  if(!m.hasTags)notes.push('PawPixl doesn\u2019t have '+m.name+'\u2019s kit on file yet, so only swaps seen in guide teams are shown.');
  if(o.easy)notes.push('The Easier to play filter isn\u2019t ready yet, so nothing was hidden by it.');
  if(o.owned&&!(o.ownedSet&&o.ownedSet.size))notes.push('Mark the characters you own in the picker first, then this filter can do its job.');
  const inv=o.inv||'';if(inv)notes.push(inv==='low'?'Low investment: four-star characters and the Traveler are listed first. Nothing is hidden.':inv==='high'?'High investment: five-star characters are listed first. Nothing is hidden.':'Medium investment: four-star and five-star characters are mixed.');
  if(inv)notes.push('PawPixl has no weapon data per team yet, so investment only changes the order of characters.');
  const out=[];all().forEach(c=>{if(keys.includes(c.key)||c.key===m.key)return;const nk=oth.concat([c.key]);const rv=reviewed(nk)[0];
   const provides=c.f?Object.keys(c.f).filter(t=>FN[t]):[];const keeps=J.unique.filter(t=>provides.includes(t)),lost=J.unique.filter(t=>!provides.includes(t)),adds=provides.filter(t=>!J.fn.includes(t)&&!J.others.some(x=>x.f&&x.f[t]));
   const rxNew=reactions(J.others.map(x=>x.el).concat([c.el])).map(x=>x.name),rxOld=reactions(J.others.map(x=>x.el).concat([m.el])).map(x=>x.name),rxLost=rxOld.filter(n=>!rxNew.includes(n)),rxGain=rxNew.filter(n=>!rxOld.includes(n));
   const cr=roleIn(c.key,nk),cOn=isOn(cr.role),sameJob=jobWords(cr.role).some(w=>jobWords(J.role).includes(w));
   let trust='insufficient';if(rv)trust='reviewed';else if(c.hasTags&&m.hasTags&&J.unique.length&&keeps.length===J.unique.length&&!(cOn&&!J.onfield))trust=(c.el===m.el&&sameJob)?'supported':'experimental';else if(c.hasTags&&m.hasTags&&J.unique.length&&keeps.length)trust='experimental';
   if(trust==='insufficient')return;
   const S={key:c.key,id:c.id,name:c.name,el:c.el,r:c.r,icon:c.icon,guide:c.guide,role:rv?(rv.roles[rv.m.indexOf(c.key)]||cr.role):cr.role,trust,provides:[],loses:[],changes:[],limits:[]};
   if(rv)S.provides.push('Plays with these three teammates in PawPixl’s '+rv.owner+' guide'+(rv.name?' (“'+rv.name+'”)':'')+'.');
   if(keeps.length)S.provides.push('Keeps '+list(keeps.map(t=>FN[t]))+' ('+keeps.map(t=>ab(c,c.f[t])).join('; ')+').');if(adds.length)S.provides.push('Adds '+list(adds.map(t=>FN[t]))+'.');
   if(lost.length)S.loses.push('The team loses '+list(lost.map(t=>FN[t]))+', which only '+m.name+' brought.');if(rxLost.length)S.loses.push(list(rxLost)+' is no longer possible.');
   if(c.el!==m.el)S.changes.push(c.el+' instead of '+m.el+(rxGain.length?': '+list(rxGain)+' becomes possible.':'.'));if(cOn&&!J.onfield)S.changes.push(c.name+' likes to be on the field, which '+m.name+' didn\u2019t need.');if(!cOn&&J.onfield)S.changes.push(m.name+' was leading this team, and '+c.name+' usually plays support.');
   if(c.wt&&m.wt&&c.wt!==m.wt&&!S.changes.length)S.changes.push('Plays differently: '+c.wt+' user instead of '+m.wt+'.');
   if(trust!=='reviewed')S.limits.push('Not covered in a PawPixl guide for this exact team.');if(c.f&&c.f.shield&&keeps.includes('shield'))S.limits.push('Shields differ in strength and uptime, so check the ability.');
   S.def=adds.some(t=>/heal|shield|ir/.test(t))||(!J.fn.some(t=>/heal|shield/.test(t))&&provides.some(t=>/heal|shield/.test(t)));S.off=adds.some(t=>/buff|shred/.test(t))||cOn;out.push(S)});
  let L=out;if(o.four)L=L.filter(s=>s.r===4);if(o.f2p)L=L.filter(s=>s.r===4||/^traveler/.test(s.key));if(o.def)L=L.filter(s=>s.def);if(o.off)L=L.filter(s=>s.off);if(o.owned&&o.ownedSet&&o.ownedSet.size)L=L.filter(s=>o.ownedSet.has(s.key));
  if(o.f2p)notes.push('F2P-friendly here means four-star characters and the Traveler. Free five-stars aren\u2019t tracked yet.');
  const TR={reviewed:0,supported:1,experimental:2},pref=s=>inv==='low'?(s.r===4||/^traveler/.test(s.key)?0:1):inv==='high'?(s.r===5?0:1):0;
  L.sort((a,b)=>TR[a.trust]-TR[b.trust]||pref(a)-pref(b)||a.name.localeCompare(b.name));
  if(!J.unique.length&&m.hasTags)notes.unshift(m.name+(J.onfield?' is the lead here':' shares their job with a teammate here')+'. PawPixl doesn\u2019t compare damage, so only swaps seen in guide teams are shown.');
  if(!L.length)notes.unshift(out.length?'No alternative matches these filters.':'No swap for '+m.name+' here that PawPixl can stand behind yet.');
  return{job:{name:m.name,role:J.role,unique:J.unique.map(t=>FN[t]),rxNeed:J.rxNeed},list:L.slice(0,12),total:L.length,notes}}
 /* ---- Build around my favorite ---- */
 function favorite(k){const c=info(k);if(!c)return null;const T=teamsWith(k),seen=new Set(),teams=[];T.forEach(t=>{if(seen.has(t.sig))return;seen.add(t.sig);
   /* alternatives: reviewed teams that differ from this one by a single teammate */
   const alts=[];TEAMS.forEach(u=>{if(u.sig===t.sig||!u.m.includes(k))return;const miss=u.m.filter(x=>!t.m.includes(x)),ext=t.m.filter(x=>!u.m.includes(x));if(miss.length===1){const a=info(ext[0]),b=info(miss[0]);if(a&&b&&!alts.some(z=>z.out===a.name&&z.in===b.name))alts.push({out:a.name,in:b.name,inKey:b.key,owner:u.owner})}});
   teams.push({name:t.name,owner:t.owner,ownerId:t.ownerId,keys:t.m,members:t.m.map((x,i)=>{const ci=info(x)||{name:t.names[i],el:'',key:x};return{key:x,name:ci.name,el:ci.el,icon:ci.icon||'',guide:ci.guide||'',role:t.roles[i]||''}}),text:t.text,alts})});
  teams.sort((a,b)=>(a.owner===c.name?0:1)-(b.owner===c.name?0:1));const fn=c.f?Object.keys(c.f).filter(t=>FN[t]).map(t=>({what:FN[t],from:ab(c,c.f[t])})):[];
  return{c,roles:c.roles,cons:c.cons,fn,selfheal:!!(c.f&&c.f.selfheal),teams,missing:[].concat(c.hasTags?[]:['PawPixl doesn\u2019t have '+c.name+'\u2019s kit on file yet.'],c.roles.length?[]:['There\u2019s no PawPixl build guide for '+c.name+' yet, so no guide role to show.'],teams.length?[]:[c.name+' isn\u2019t in a PawPixl guide team yet.'])}}
 return{info,all,doctor,subs,favorite,reviewed,roleIn,reactions,key,consStep,atCons}}
/* PawPixl's reviewed guide data, as the website already has it in content/<game>/index.json */
function guidesFrom(idx){const out=[],B=((idx||{}).posts||{}).builds||{},R=(idx||{}).roster||[];Object.keys(B).forEach(id=>{const v=(B[id].versions||[])[0];if(!v||!v.seo)return;const r=R.find(x=>x.id===id),name=r?r.name:(B[id].title||id),why=(v.why&&v.why.t)||[];
  const teams=(v.seo.teams||[]).map(t=>{const sig=(t.members||[]).map(norm).sort().join('|'),y=why.find(x=>x&&(x.members||[]).map(norm).sort().join('|')===sig)||{};return{name:t.name||'',members:t.members||[],roles:(t.members||[]).map(n=>{const i=(y.members||[]).findIndex(m=>norm(m)===norm(n));return i>=0&&y.roles?(y.roles[i]||''):''}),text:y.text||''}});
  out.push({id,name,roles:v.seo.roles||[],cons:v.seo.cons||[],teams})});return out}
const api={make,key,norm,TRUST,FN,guidesFrom};W.PPTeamLab=api;if(typeof module!=='undefined')module.exports=api;
})();
