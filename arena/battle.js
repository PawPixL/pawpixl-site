/* PawPixl Arena: Battle Mode rules (a small just-for-fun mini-game next to the Rotation Coach).
   IMPORTANT: every number and effect in this file is MADE UP FOR THIS MINI-GAME. Nothing here is a real Genshin Impact
   stat, multiplier or mechanic, and the page says so. What is real: the characters' names, elements and the official
   names of their abilities (passed in from the published kit), and the names of the elemental reactions. The Rotation
   Coach never uses this file, and this file never changes a rotation, a kit or a guide.
   Pure logic, no drawing: the same code runs in the browser and in the tests. Randomness comes from a seed, so a
   battle can be replayed exactly. */
(function(){
'use strict';
/* tuning (documented in tests/battle.test.cjs, which simulates thousands of battles against these numbers) */
const T={crit:.15,critMul:1.5,burstCost:4,skillCd:2,bossHp:800,bossAtk:22,slamEvery:3,slam:30,enrageAt:.4,enrageMul:1.3,
 kinds:{striker:{hp:100,atk:22},support:{hp:90,atk:15},healer:{hp:95,atk:11},shielder:{hp:110,atk:11},buffer:{hp:90,atk:12}}};
const REACTIVE=new Set(['Pyro','Hydro','Cryo','Electro']);
/* reaction table: [name, damage multiplier, extra effect]. Names are the real reaction names; the effects are simplified arena rules. */
const RX={'Pyro+Hydro':['Vaporize',1.5],'Pyro+Cryo':['Melt',1.5],'Electro+Hydro':['Electro-Charged',1.2,'dot'],'Electro+Pyro':['Overloaded',1.35],
 'Cryo+Electro':['Superconduct',1.2,'vuln'],'Cryo+Hydro':['Freeze',1.1,'chill'],'Dendro+Pyro':['Burning',1.2,'dot'],'Dendro+Hydro':['Bloom',1.3],'Dendro+Electro':['Quicken',1.2,'vuln']};
function reactionOf(aura,el){if(!aura||!el||aura===el)return null;
 if(el==='Anemo'&&REACTIVE.has(aura))return{name:'Swirl',mul:1.25,fx:'vuln',keep:true};if(el==='Geo'&&REACTIVE.has(aura))return{name:'Crystallize',mul:1.1,fx:'shield',keep:true};
 const r=RX[aura+'+'+el]||RX[el+'+'+aura];return r?{name:r[0],mul:r[1],fx:r[2]||''}:null}
/* which kind of unit a team member is, from the role text the lesson already has (falls back to the featured flag) */
function kindOf(m,featured){const r=String(m.role||'').toLowerCase();if(/heal/.test(r))return'healer';if(/shield/.test(r))return'shielder';if(/buff/.test(r))return'buffer';if(featured||/main|on-field|dps(?!.*off)/.test(r)&&!/off-field|sub/.test(r))return'striker';return'support'}
function rng(seed){let s=(seed>>>0)||1;return()=>{s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;return s/4294967296}}
const KINDL={striker:'Striker',support:'Off-field support',healer:'Healer',shielder:'Shielder',buffer:'Buffer'};
const DESC={
 striker:{skill:'A strong hit that leaves this character’s element on the boss.',burst:'A very strong hit.'},
 support:{skill:'A hit that leaves this element on the boss and keeps adding a little damage after each ally’s attack for 2 rounds.',burst:'A strong hit that leaves this element on the boss.'},
 healer:{skill:'Heals the ally with the lowest HP.',burst:'Heals the whole team.'},
 shielder:{skill:'Gives the whole team a shield for 2 rounds.',burst:'Gives the whole team a big shield for 2 rounds.'},
 buffer:{skill:'Raises the team’s attack for 2 rounds.',burst:'Raises the team’s attack a lot for 2 rounds and heals a little.'}};
/* team: [{id,name,el,role,names:{na,e,q}}], the featured one first or flagged */
function create(team,opt){opt=opt||{};const L=(team||[]).slice(0,4);if(L.length<1)throw new Error('A battle needs at least one character');
 const fi=Math.max(0,L.findIndex(m=>m.featured));
 const heroes=L.map((m,i)=>{const kind=kindOf(m,i===fi),k=T.kinds[kind],n=m.names||{};return{i,id:m.id,name:m.name||m.id,el:m.el||'Physical',kind,kindLabel:KINDL[kind],hp:k.hp,max:k.hp,atk:k.atk,shield:0,shieldT:0,energy:0,cd:0,down:false,acted:false,echo:0,
  names:{attack:n.na||'Normal Attack',skill:n.e||'Elemental Skill',burst:n.q||'Elemental Burst'}}});
 const S={v:1,seed:(opt.seed>>>0)||1,round:1,heroes,active:0,over:null,turns:0,
  boss:{name:opt.bossName||'Training Golem',hp:T.bossHp,max:T.bossHp,atk:T.bossAtk,aura:'',vuln:0,chill:0,dot:0,dotT:0,enraged:false,charging:false},
  buff:{atk:0,t:0}};S._r=rng(S.seed);S.active=nextIdx(S,-1);return S}
const nextIdx=(S,from)=>{for(let k=from+1;k<S.heroes.length;k++){const h=S.heroes[k];if(!h.down&&!h.acted)return k}return-1};
const alive=S=>S.heroes.filter(h=>!h.down);
/* what the active character can do now, and why not when they can't */
function options(S){if(S.over||S.active<0)return[];const h=S.heroes[S.active],d=DESC[h.kind];
 return[{id:'attack',name:h.names.attack,label:'Attack',ok:true,why:'',desc:'A basic hit. Gives 1 energy.'},
  {id:'skill',name:h.names.skill,label:'Skill',ok:h.cd===0,why:h.cd?'Ready in '+h.cd+' round'+(h.cd>1?'s':''):'',desc:d.skill+' Gives 2 energy. Ready again after '+T.skillCd+' rounds.'},
  {id:'burst',name:h.names.burst,label:'Burst',ok:h.energy>=T.burstCost,why:h.energy>=T.burstCost?'':'Needs '+T.burstCost+' energy (has '+h.energy+')',desc:d.burst+' Uses '+T.burstCost+' energy.'}]}
function hitBoss(S,h,mul,E,opt){opt=opt||{};const b=S.boss;let n=h.atk*mul*(1+(S.buff.t>0?S.buff.atk:0));const crit=!opt.noCrit&&S._r()<T.crit;if(crit)n*=T.critMul;
 let rx=null;if(!opt.noReact){rx=reactionOf(b.aura,h.el);if(rx){n*=rx.mul}}if(b.vuln>0)n*=1.15;n=Math.max(1,Math.round(n));b.hp=Math.max(0,b.hp-n);
 E.push({t:'dmg',target:'boss',n,crit,el:h.el,by:h.i,reaction:rx?rx.name:''});
 if(rx){E.push({t:'react',name:rx.name});
  if(rx.fx==='vuln'){b.vuln=2;E.push({t:'debuff',target:'boss',name:'Takes more damage',turns:2})}
  if(rx.fx==='chill'){b.chill=1;E.push({t:'debuff',target:'boss',name:'Chilled: next hit is weaker',turns:1})}
  if(rx.fx==='dot'){b.dot=8;b.dotT=2;E.push({t:'debuff',target:'boss',name:rx.name+': damage each round',turns:2})}
  if(rx.fx==='shield'){h.shield=Math.max(h.shield,12);h.shieldT=2;E.push({t:'shield',target:h.i,n:12})}
  if(!rx.keep)b.aura=''}
 else if(opt.aura&&h.el!=='Physical'&&h.el!=='Anemo'&&h.el!=='Geo')b.aura=h.el;
 return n}
function heal(S,h,n,E){if(h.down)return;const v=Math.min(n,h.max-h.hp);h.hp+=v;E.push({t:'heal',target:h.i,n:v})}
/* the active character does one thing; when everyone has acted the boss takes its turn. Returns what happened, in order. */
function act(S,id){const E=[];if(S.over)return E;const h=S.heroes[S.active];if(!h)return E;const o=options(S).find(x=>x.id===id);
 if(!o||!o.ok){E.push({t:'error',text:o?o.why:'Unknown action'});return E}
 S.turns++;E.push({t:'act',who:h.i,action:id,name:o.name,el:h.el});const b=S.boss,A=alive(S);
 if(id==='attack'){hitBoss(S,h,1,E);h.energy=Math.min(T.burstCost,h.energy+1)}
 else{const big=id==='burst';if(big)h.energy=0;else{h.cd=T.skillCd+1;h.energy=Math.min(T.burstCost,h.energy+2)}
  if(h.kind==='striker')hitBoss(S,h,big?3.2:1.8,E,{aura:true});
  else if(h.kind==='support'){hitBoss(S,h,big?2.2:1.2,E,{aura:true});if(!big){h.echo=2;E.push({t:'buff',target:h.i,name:'Off-field hits for 2 rounds',turns:2})}}
  else if(h.kind==='healer'){if(big)A.forEach(x=>heal(S,x,24,E));else heal(S,A.slice().sort((x,y)=>x.hp/x.max-y.hp/y.max)[0],30,E)}
  else if(h.kind==='shielder'){const n=big?32:18;A.forEach(x=>{x.shield=Math.max(x.shield,n);x.shieldT=2;E.push({t:'shield',target:x.i,n})})}
  else if(h.kind==='buffer'){S.buff={atk:big?.5:.3,t:2};E.push({t:'buff',target:'team',name:'Attack up '+(big?50:30)+'%',turns:2});if(big)A.forEach(x=>heal(S,x,10,E))}}
 /* off-field supports chip in after an ally's damaging action */
 if(b.hp>0&&E.some(e=>e.t==='dmg'&&e.by===h.i))S.heroes.forEach(x=>{if(x!==h&&!x.down&&x.echo>0&&b.hp>0)hitBoss(S,x,.4,E,{noCrit:true})});
 h.acted=true;if(b.hp<=0){S.over='win';E.push({t:'end',result:'win'});return E}
 S.active=nextIdx(S,S.active);if(S.active<0)bossTurn(S,E);return E}
function hurt(S,h,n,E,what){let v=Math.round(n);const ab=Math.min(h.shield,v);if(ab){h.shield-=ab;v-=ab}v=Math.min(v,h.hp);/* the number shown is the HP actually lost */h.hp-=v;E.push({t:'dmg',target:h.i,n:v,absorbed:ab,what});if(h.hp<=0&&!h.down){h.down=true;h.shield=0;h.echo=0;E.push({t:'down',target:h.i})}}
function bossTurn(S,E){const b=S.boss;
 if(b.dotT>0&&b.hp>0){b.hp=Math.max(0,b.hp-b.dot);b.dotT--;E.push({t:'dmg',target:'boss',n:b.dot,crit:false,el:'',by:-1,reaction:'',dot:true});if(b.hp<=0){S.over='win';E.push({t:'end',result:'win'});return}}
 if(!b.enraged&&b.hp<=b.max*T.enrageAt){b.enraged=true;E.push({t:'tele',text:b.name+' is enraged: it hits harder now.'})}
 const chilled=b.chill>0;b.chill=0;const mul=(b.enraged?T.enrageMul:1)*(chilled?.5:1),A=alive(S);
 if(b.charging){b.charging=false;E.push({t:'bossact',name:'Heavy Slam',all:true});A.forEach(h=>hurt(S,h,T.slam*mul,E,'slam'))}
 else{const tgt=A[Math.floor(S._r()*A.length)];E.push({t:'bossact',name:'Strike',target:tgt.i});hurt(S,tgt,b.atk*mul,E,'strike')}
 if(!alive(S).length){S.over='lose';E.push({t:'end',result:'lose'});return}
 /* end of round: timers tick, then the next round starts */
 if(b.vuln>0)b.vuln--;if(S.buff.t>0){S.buff.t--;if(!S.buff.t)S.buff.atk=0}
 S.heroes.forEach(h=>{h.acted=false;if(h.cd>0)h.cd--;if(h.echo>0)h.echo--;if(h.shieldT>0){h.shieldT--;if(!h.shieldT)h.shield=0}});
 S.round++;E.push({t:'round',n:S.round});
 if(S.round%T.slamEvery===0){b.charging=true;E.push({t:'tele',text:b.name+' is winding up a Heavy Slam on everyone next. A shield or a heal will help.'})}
 S.active=nextIdx(S,-1)}
/* a simple sensible player, used by the tests to check the game is winnable but not automatic, and by "Suggest" in the UI */
function advise(S){const h=S.heroes[S.active],O=options(S),can=id=>O.find(o=>o.id===id).ok,A=alive(S),low=A.some(x=>x.hp/x.max<.55),b=S.boss;
 if(h.kind==='healer'){if(can('burst')&&A.filter(x=>x.hp/x.max<.7).length>=2)return'burst';if(can('skill')&&low)return'skill';return'attack'}
 if(h.kind==='shielder'){if(b.charging&&can('burst'))return'burst';if(b.charging&&can('skill'))return'skill';return'attack'}
 if(h.kind==='buffer'){if(can('burst'))return'burst';if(can('skill')&&S.buff.t===0)return'skill';return'attack'}
 if(can('burst'))return'burst';if(can('skill'))return'skill';return'attack'}
const api={T,create,options,act,advise,reactionOf,kindOf,KINDL,RULES:'Battle Mode is a just-for-fun mini-game. Its HP, damage, cooldowns, energy and reaction effects are made up for PawPixl Arena and are not real Genshin Impact numbers or mechanics. Character names, elements, ability names and reaction names are real.'};
if(typeof window!=='undefined')window.PPBattle=api;if(typeof module!=='undefined')module.exports=api;
})();
