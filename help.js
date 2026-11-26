/* PawPixl Help Center (Nov 2026). Loaded only when a visitor opens help (a drawer, the Help Center, a tutorial or the
   getting-started tour), so the main site stays as light as before. Content: the defaults below, replaced field by field by
   /content/help.json when the owner publishes one from the Studio. Tutorials: /content/tutorials.json (only entries with status
   "published" show a video). Live facts (what the engine calculates, what is not calculated yet) are read from the same
   /effects.json the calculators use, so they cannot drift from the release. Nothing here sends anything anywhere;
   "Report a suspected issue" opens the site's existing report form. */
(function(){
const W=window,esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const KIND={how:['How it works','#5fd8ff'],guide:['Good to know','#5fd98f'],limit:['Current limitation','#f6c75c'],pending:['Not supported yet','#c59bff'],issue:['Confirmed bug','#ff8a7a'],planned:['Planned','#19d3b5']};
/* ---------- the approved copy (plain English; every claim matches what the site does today) ---------- */
const D={reviewed:'26 November 2026',
 intro:'Short answers, walkthrough videos and an honest list of what PawPixl’s tools can and cannot do yet.',
 tools:{
 roster:{name:'My Roster',path:'/genshin/roster',tut:'roster-good',rel:['lab','upgrades','create'],lead:'My Roster is your list of characters and what they wear. Build Lab, Team Lab, Your Next Upgrades and your cards all read from it.',groups:[
  {k:'how',t:'What your saved data is',i:[
   'Everything in My Roster is what you, a file or your public showcase told PawPixl. It is not read from the game itself, so it is only as current as your last edit or import.',
   'For each character you can save the level, constellation, talents, weapon and refinement, and artifacts: either a quick summary (sets, main stats and substat totals) or all five pieces one by one.',
   'Anything you leave empty stays empty. Tools that need it show a Guide Example instead and say so; they never pretend it is yours.']},
  {k:'how',t:'GOOD files, in one minute',i:[
   'GOOD is a shared file format (a .json file) that lists characters, weapons and artifacts. Genshin Optimizer and several scanners and exporters create it.',
   'One free option is a third-party Chrome extension called Genshin GOOD Exporter. It reads the character pages of HoYoLAB’s Battle Chronicle while you are signed in there, and saves a GOOD file. It is not made by PawPixl or HoYoverse, and PawPixl has not security-audited it. Read its store listing before installing.',
   'You never need an extension. You can add characters by hand, or fill them in from your in-game Character Showcase with your UID.',
   'PawPixl will never ask for your HoYoLAB password, verification codes, cookies or tokens.']},
  {k:'how',t:'Importing: preview first, nothing changes until you choose',i:[
   'When you pick a file, PawPixl reads it in your browser and shows a preview: how many characters, weapons and artifact pieces it found, which are new and which are already in your roster.',
   'You then choose “Add and update” (the file’s level, constellation, talents, weapon and artifacts replace yours, and your notes, favorites and wishlist are kept), “Only add new characters”, or “Cancel”.',
   'Characters PawPixl does not have yet are listed and skipped. You can download your own PawPixl file at any time with “Download my data”.']},
  {k:'limit',t:'Why some items are missing after an import',i:[
   'HoYoLAB’s Battle Chronicle only shows what your characters are wearing, so files made from it contain equipped weapons and artifacts only. Spare weapons and unequipped artifacts are not in the file.',
   'Some exporters can only estimate a few values (the Genshin GOOD Exporter lists those in its own report). If a number looks off, fix it on the character in My Roster.',
   'The Traveler is not imported from GOOD files yet. Add the Traveler by hand.']},
  {k:'guide',t:'Where your data lives',i:[
   'Files you import are read in your browser. The file itself is not uploaded anywhere.',
   'Signed out, your roster is saved in this browser only. Clearing site data, or using another device or browser, means it is not there.',
   'Signed in, your roster is also saved to your PawPixl account so it follows you to other devices. If this device and your account disagree, PawPixl asks which to keep.',
   'Filling in from your UID sends only that UID to PawPixl’s server, which asks Enka.Network for the public Character Showcase. The answer is kept briefly so repeat lookups are quick, and lookups are counted per visitor for an hour to prevent abuse.',
   'PawPixl takes reasonable care with your data, but no website can promise perfect security. See the Privacy page for details.']}]},
 lab:{name:'Build Lab',path:'/genshin/lab',tut:'build-lab',rel:['roster','upgrades','teamlab'],lead:'Build Lab builds one character and shows their stats and the damage of their attacks, for the build you choose.',groups:[
  {k:'how',t:'Three kinds of build',i:[
   'Guide Example: PawPixl’s example build from the guide. Equipment you might not own is assumed, and the card says so (for example “R5 assumed” for weapons that need no wishes).',
   'My Build: what you saved in My Roster.',
   'Custom Preview: anything you change here. It is a what-if and never changes your saved build.']},
  {k:'how',t:'What is calculated',i:[
   'Your total stats (HP, ATK, DEF, Elemental Mastery, CRIT, Energy Recharge, element and healing bonuses) from the character, weapon and artifacts.',
   'The damage of each listed attack against a level-90 enemy with 10% resistance, with and without CRIT, and the average.',
   'Weapon and artifact-set effects and character abilities that have been reviewed by hand from the game text. Effects with a condition are switches you turn on or off.',
   'Reactions you pick: Vaporize and Melt, Aggravate and Spread, and the damage of reactions such as Swirl or Overloaded.']},
  {k:'how',t:'Baseline, suggested assumptions and maximums',i:[
   'Baseline: always-on stats and effects only. Conditional effects are off, there is no reaction and no teammate buff.',
   '“Use suggested assumptions” switches on the conditions PawPixl’s guide usually expects for this kind of build. It is a starting guess, not a verified fight. “Reset to Baseline” turns them off again.',
   'Some switches have stacks. When an effect is at the top of its range, Build Lab says it is a maximum conditional example: the ceiling, not what every fight reaches.',
   'Accessible, Balanced and Premium suggest equipment and substat quality from practical to high-investment. What you set by hand is only replaced if you agree.']},
  {k:'limit',t:'Modelled hits, not a rotation',i:[
   'Every number is one hit (or one average hit) in the situation you set up. It is not damage per second and not a full rotation.',
   'Switched-on effects are treated as active for every hit. In a real fight some only last part of the time.',
   'A reaction choice applies to the hits you select. In the game, not every hit can react (elemental gauge and internal cooldowns), so real reaction damage is usually lower than “every hit reacts”.',
   'Enemy resistance, level, shields and resistance changes during a fight differ from the standard enemy, so real numbers can be higher or lower.']},
  {k:'pending',t:'Effects still awaiting review',i:[
   'A number of character abilities, mostly ones with unusual conditions, are not calculated yet. They are listed as not calculated rather than counted as zero.']},
  {k:'guide',t:'If a number looks off',i:[
   'Build Lab says on screen when a guide’s stat target is not reached and why, instead of forcing it.',
   'Spotted a number that looks wrong? Use “Report a suspected issue” below; your setup is attached so it can be checked.']}]},
 teamlab:{name:'Team Lab',path:'/genshin/teamlab',tut:'team-lab',rel:['roster','lab','create'],lead:'Team Lab puts four characters together and shows how they change each other’s numbers.',groups:[
  {k:'how',t:'What a teammate’s contribution means',i:[
   'Calculated: buffs and enemy debuffs Team Lab can turn into numbers, such as an ATK buff, an Elemental DMG Bonus or an enemy RES reduction. Each one shows who gives it, who receives it and its condition.',
   'Known, not counted: real effects that need something Team Lab does not assume, such as a stack count or which element is swirled. They are shown with an outline star and no number. Not counted does not mean they add nothing.',
   'Not every buff has a number yet. Abilities still awaiting review are listed, not ignored.']},
  {k:'how',t:'Conditions are switches',i:[
   'Most team buffs need something to happen first, such as using a Burst. Team Lab shows them as switches. “Turn all on” assumes they are all active at the same time, which is the best case.',
   'Setup A and Setup B let you pin one team, change something, and compare the same character’s hits.']},
  {k:'limit',t:'The three-hit comparison is not team DPS',i:[
   'Comparisons use the same three attacks of one character, alone and with the team’s calculated effects. They show how much the team boosts those hits.',
   'They do not add up everyone’s damage, and they are not damage per second or a rotation. Reactions are not counted in the card comparison.',
   'Real rotations differ: buffs have uptimes, characters swap in and out, and energy and enemy behaviour matter.']},
  {k:'guide',t:'Saved and example builds',i:[
   'For characters you own, Team Lab uses your saved build. Anything missing is filled in from the Guide Example and labelled.',
   'Save team keeps the line-up in My Teams. Share makes a card you can download.']}]},
 create:{name:'Create a Graphic',path:'/genshin/create',tut:'create-graphic',rel:['roster','teamlab'],lead:'Create a Graphic turns your builds and teams into images to share.',groups:[
  {k:'how',t:'What each card shows',i:[
   'My Build cards use what you saved in My Roster. Guide Example cards use PawPixl’s example build and say so on the card.',
   'Missing equipment is never invented. The card says once what is not saved yet, and a character with little saved gets a shorter card.',
   'Individual artifact pieces appear only when you saved all their details. Otherwise the card shows your summary and says so.',
   'Team Breakdown values are modelled estimates of the same three hits alone and with the team. They are not team DPS.']},
  {k:'guide',t:'Before you share',i:[
   'Cards are made in your browser. Nothing is uploaded until you choose to post the image yourself.',
   'Cards show character, build and team details only, plus pawpixl.com. PawPixl does not add your UID, name or email. Anything you type onto a card, such as a team name, becomes part of the image, so only add what you are happy to share.',
   'Download PNG works everywhere. Copy image depends on your browser; if it does not work, download instead.']},
  {k:'limit',t:'Browser and card limits',i:['Copy image is not available in some browsers (often on phones). Download PNG always works.','Custom Preview builds from Build Lab cannot be made into cards yet.']}]}
 ,
 upgrades:{name:'Your Next Upgrades',path:'/genshin/roster',tut:'next-upgrades',rel:['roster','lab'],lead:'Open a character in My Roster to see what to work on next, based on your saved build and the PawPixl guide build you pick.',groups:[
  {k:'how',t:'Where each suggestion comes from',i:[
   'Calculated: PawPixl tried one change in Build Lab (in Baseline) and measured it on the build’s three biggest modelled hits, against your build as saved.',
   'From the guide: the PawPixl guide asks for it, such as a talent level, a main stat or a CRIT target.',
   'General rule: common advice, such as ascending before talents that the ascension caps.',
   'The same saved build and game data always give the same suggestions, in the same order.']},
  {k:'guide',t:'Good to know',i:[
   'Until a character has a weapon and artifacts saved, PawPixl shows only what the guide says (“Not assessed yet”).',
   '“Looking strong” means nothing PawPixl can check stands out. Your team and real fights may still suggest other changes.',
   'Pick another guide build at the top if you are building one of the guide’s other versions of the character.']},
  {k:'limit',t:'What it leaves out',i:[
   'Calculated gains are one hit each of the three biggest modelled hits, in Baseline. They are not rotation or team damage.',
   'Artifacts are not tried as calculated upgrades, because a better piece depends on luck. Main stats and substat targets come from the guide instead.',
   'For supports, what they give the team matters more than their own damage, so no weapon is suggested from damage alone.']}]},
 },
 start:{title:'Getting started with PawPixl',tut:'getting-started',lead:'PawPixl is built around one idea: tell it who you have, and every tool gets more personal.',steps:[
  ['My Roster is the centre','Everything personal on PawPixl starts here: which characters you own and how they are built. It is saved in this browser, or in your account if you sign in.','/genshin/roster','Open My Roster'],
  ['Fill it in your way','Tap the characters you own. Add details by hand, fill them in from your in-game Character Showcase with your UID, or import a GOOD file. Skip anything you like; empty stays empty.','/genshin/roster','Add characters'],
  ['Build Lab and Your Next Upgrades','Build Lab opens your saved build so you can try changes without touching it. Open a character in My Roster to see Your Next Upgrades: what to work on next, and why.','/genshin/lab','Open Build Lab'],
  ['Team Lab','Put four characters together, mark who you own, and see what each teammate adds and what is only described.','/genshin/teamlab','Open Team Lab'],
  ['Create a Graphic','Turn a saved build or a team into an image to share. Guide Examples are labelled, and missing gear is never invented.','/genshin/create','Make a graphic']],
  note:'The more accurate your roster, the more useful the rest becomes. When something is missing, PawPixl says so or shows a labelled Guide Example instead.'},
 planned:['The list of abilities that are not calculated yet is reviewed over time, and this page updates as they are added.'],
 good:{title:'Help me get my file',steps:[
  ['Decide if you want a file','You can skip this: add characters by hand, or use “Fill in from your UID”. A file is quickest if you have many characters.'],
  ['Choose an exporter carefully','One free option is Genshin GOOD Exporter, a third-party Chrome extension (not made by PawPixl or HoYoverse, and not security-audited by PawPixl). Read its store listing, its permissions and its reviews, and decide for yourself whether to install it.','https://chromewebstore.google.com/detail/genshin-good-exporter/pfnmohecpdblhkbhioocgpldafafnpgc'],
  ['Open your Battle Chronicle','Sign in to HoYoLAB yourself and open the Genshin Battle Chronicle (Battle Record) page with your characters. PawPixl never sees your sign-in.','https://act.hoyolab.com/app/community-game-records-sea/index.html#/ys'],
  ['Export the file','Click the extension, check the UID and server it found, and choose Export GOOD JSON. Save the .json file somewhere easy, like Downloads.'],
  ['Import it here','In My Roster press Import, pick the file, read the preview, then choose Add and update, Only add new characters, or Cancel.'],
  ['Check and fill gaps','Only equipped weapons and artifacts come from HoYoLAB. Add anything else by hand. Import a new file any time to update.']]}
};
const ORDER=['roster','lab','upgrades','teamlab','create'];
let C=null,T=null,FX=null;
async function data(){if(C)return C;C=JSON.parse(JSON.stringify(D));try{const r=await fetch('/content/help.json',{cache:'no-cache'});if(r.ok){const j=await r.json();if(j&&j.tools)Object.keys(j.tools).forEach(k=>{C.tools[k]=Object.assign(C.tools[k]||{},j.tools[k])});['reviewed','intro','good','start','planned'].forEach(k=>{if(j&&j[k])C[k]=j[k]})}}catch(e){}return C}
async function tuts(){if(T)return T;T={};try{const r=await fetch('/content/tutorials.json',{cache:'no-cache'});if(r.ok){const j=await r.json();(j.items||[]).forEach(x=>{if(x&&x.id)T[x.id]=x})}}catch(e){}return T}
const live=t=>t&&t.status==='published'&&t.video;
/* what the calculators actually do, read from the release's own effects data */
async function facts(){if(FX)return FX;FX={};try{const E=await (await fetch('/effects.json')).json();const nm=k=>String(k).split('-').map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join(' ');
 FX.charEffects=Object.values(E.chars||{}).reduce((a,L)=>a+L.filter(e=>e.state==='implemented').length,0);FX.chars=Object.keys(E.chars||{}).length;
 FX.equip=Object.values(E.equip||{}).reduce((a,L)=>a+(Array.isArray(L)?L.length:1),0);FX.qual=Object.keys(E.qual||{}).length;
 FX.gaps=[];Object.entries(E.review||{}).forEach(([k,v])=>(v.gaps||[]).forEach(g=>FX.gaps.push({c:nm(k),s:g.s||'',n:g.n||'',why:g.why||''})));FX.gapChars=new Set(FX.gaps.map(g=>g.c)).size}catch(e){FX.err=1}return FX}
function factsHTML(F){if(!F||F.err)return'';return'<p class="hp-fact">Right now the calculators use <b>'+F.charEffects+'</b> reviewed character effects for <b>'+F.chars+'</b> characters and <b>'+F.equip+'</b> weapon and artifact-set effects. <b>'+F.qual+'</b> characters have effects described in words instead of numbers.</p>'}
function gapsHTML(F,open){if(!F||F.err)return'<p class="hp-fact">The list could not be loaded right now.</p>';if(!F.gaps.length)return'<p class="hp-fact">Nothing is on the reviewed list right now.</p>';
 return'<details class="hp-gaps"'+(open?' open':'')+'><summary><b>'+F.gaps.length+' abilities</b> of '+F.gapChars+' characters are reviewed and known not to be calculated yet</summary><p class="hp-fact">They are listed as not calculated, never counted as zero. This is the reviewed list; other abilities may also be missing, so report anything that looks off.</p><input type="search" class="hp-gq" placeholder="Filter by character or ability" aria-label="Filter the not-calculated list"><ul class="hp-gl">'+
  F.gaps.map(g=>'<li data-q="'+esc((g.c+' '+g.n+' '+g.s).toLowerCase())+'"><b>'+esc(g.c)+'</b> · '+esc(g.s)+(g.n?' '+esc(g.n):'')+(g.why?'<span>'+esc(g.why)+'</span>':'')+'</li>').join('')+'</ul></details>'}
function groupsHTML(g,tool){return g.map((x,i)=>{const k=KIND[x.k]||KIND.how;return'<section class="hp-g" id="'+(tool?tool+'-'+i:'')+'"><h3><span class="hp-kind" style="--k:'+k[1]+'">'+esc(k[0])+'</span>'+esc(x.t)+'</h3><ul>'+x.i.map(s=>'<li>'+esc(s)+'</li>').join('')+'</ul></section>'}).join('')}
function relHTML(H,S,newTab){return(S.rel||[]).length?'<div class="hp-rel"><span>Related</span>'+S.rel.map(k=>{const R=H.tools[k];return R?'<a href="/genshin/help#'+k+'"'+(newTab?' target="_blank" rel="noopener"':'')+'>'+esc(R.name)+'</a>':''}).join('')+'</div>':''}
function css(){if(document.getElementById('hp-css'))return;const s=document.createElement('style');s.id='hp-css';s.textContent=`
.hp-link{display:inline-flex;align-items:center;gap:6px;margin:6px 0 0;padding:5px 11px;border:1px solid var(--line);border-radius:999px;background:rgba(255,255,255,.04);color:var(--mut);font:600 13px var(--body);cursor:pointer}
.hp-link:hover,.hp-link:focus-visible{color:var(--tx);border-color:var(--line2)}.hp-link svg{width:15px;height:15px}
.hp-b{display:inline-flex;align-items:center;justify-content:center;gap:7px;min-height:44px;padding:0 16px;border-radius:12px;font:700 14.5px var(--body);cursor:pointer;text-decoration:none;border:1px solid var(--line);background:rgba(255,255,255,.04);color:var(--tx)}
.hp-b:hover,.hp-b:focus-visible{border-color:var(--line2);background:rgba(255,255,255,.08)}
.hp-b.pri{background:linear-gradient(90deg,#19d3b5,#5fd8ff);border-color:transparent;color:#05121a}.hp-b.pri:hover{filter:brightness(1.07)}
.hp-b.txt{border-color:transparent;background:transparent;color:#5fd8ff;padding:0 6px;min-height:36px;text-decoration:underline;text-underline-offset:3px}
dialog.hp-dr{margin:0 0 0 auto;height:100%;max-height:100%;max-width:100vw;width:min(480px,100vw);border:0;border-left:1px solid var(--line);background:#0d1120;color:var(--tx);padding:0}
dialog.hp-dr::backdrop{background:rgba(3,4,10,.6)}
.hp-in{padding:22px 22px 30px}.hp-top{display:flex;align-items:flex-start;gap:10px}.hp-top h2{flex:1;margin:0;font:800 21px/1.25 var(--body)}
.hp-x{flex:none;border:1px solid var(--line);background:transparent;color:var(--tx);border-radius:12px;width:44px;height:44px;font-size:18px;cursor:pointer}
.hp-lead{color:var(--mut);margin:8px 0 14px;line-height:1.6;font-size:15.5px}
.hp-g{border:1px solid var(--line);border-radius:14px;background:rgba(255,255,255,.03);padding:14px 16px;margin:12px 0;scroll-margin-top:90px}
.hp-g h3{margin:0 0 8px;font:700 16px/1.3 var(--body);display:flex;flex-direction:column;gap:5px}
.hp-kind{font:800 11.5px var(--body);letter-spacing:.08em;text-transform:uppercase;color:var(--k)}
.hp-g ul{margin:0;padding-left:20px}.hp-g li{margin:7px 0;line-height:1.6;color:#d9deec;font-size:15px}
.hp-acts{display:flex;flex-wrap:wrap;gap:10px;margin:16px 0}
.hp-meta{color:var(--dim);font-size:13px;margin-top:16px;line-height:1.5}
.hp-rel{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:12px 0}.hp-rel span{font:800 11.5px var(--body);letter-spacing:.08em;text-transform:uppercase;color:var(--dim)}.hp-rel a{color:#5fd8ff;border:1px solid var(--line);border-radius:999px;padding:6px 12px;font:600 13.5px var(--body);text-decoration:none}
.hp-fact{color:#cfd6e6;font-size:14.5px;line-height:1.6;margin:8px 0}
.hp-gaps{border:1px solid var(--line);border-radius:14px;padding:12px 16px;margin:12px 0;background:rgba(197,155,255,.05)}.hp-gaps summary{cursor:pointer;line-height:1.5}
.hp-gq,.hp-sq{width:100%;box-sizing:border-box;min-height:44px;border:1px solid var(--line);border-radius:12px;background:rgba(255,255,255,.05);color:var(--tx);font:500 15px var(--body);padding:0 14px;margin:8px 0}
.hp-gl{list-style:none;padding:0;margin:6px 0;max-height:360px;overflow:auto}.hp-gl li{padding:8px 2px;border-top:1px solid var(--line);font-size:14.5px;line-height:1.5}.hp-gl li span{display:block;color:var(--mut);font-size:13.5px}
.hp-steps{counter-reset:s;list-style:none;padding:0;margin:8px 0}.hp-steps li{counter-increment:s;position:relative;padding:12px 14px 12px 50px;border:1px solid var(--line);border-radius:12px;margin:8px 0;background:rgba(255,255,255,.03);line-height:1.6;font-size:15px}
.hp-steps li::before{content:counter(s);position:absolute;left:14px;top:12px;width:26px;height:26px;border-radius:50%;background:#5fd8ff;color:#06101a;font:800 13px/26px var(--body);text-align:center}
.hp-steps b{display:block}.hp-steps a{color:#5fd8ff}
.hp-note{font-size:14px;color:var(--mut);border-left:3px solid var(--gold);padding:6px 12px;margin:12px 0;line-height:1.55}
dialog.hp-pl{border:1px solid var(--line);border-radius:18px;background:#0a0d18;color:var(--tx);padding:0;width:min(1040px,96vw);max-height:94vh}
dialog.hp-pl::backdrop{background:rgba(3,4,10,.82)}
.hp-pl .vw{position:sticky;top:0;z-index:1;background:#000}.hp-pl video{display:block;width:100%;height:auto;background:#000;aspect-ratio:16/9}
.hp-pl .hp-in{padding:14px 18px 20px}.hp-pl details{border-top:1px solid var(--line);padding:10px 0}.hp-pl summary{cursor:pointer;font:700 15px var(--body);min-height:32px;display:flex;align-items:center}
.hp-ch{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0}.hp-ch button{min-height:38px;border:1px solid var(--line);background:rgba(255,255,255,.04);color:var(--tx);border-radius:999px;padding:0 12px;font:600 13.5px var(--body);cursor:pointer}.hp-ch button[aria-current]{border-color:#19d3b5;background:rgba(25,211,181,.12)}
.hp-tr{max-height:260px;overflow:auto;border:1px solid var(--line);border-radius:12px;padding:12px 14px;line-height:1.65;color:#d9deec;font-size:15px;white-space:pre-wrap}
.hp-page{max-width:1040px;padding-top:18px}.hp-page h1{font:400 clamp(36px,6vw,58px)/1.05 var(--display);margin:10px 0 6px;letter-spacing:.01em;text-transform:uppercase}.hp-page>.hp-lead{max-width:720px;font-size:17px}
.hp-search{position:relative;max-width:640px;margin:14px 0 8px}.hp-res{list-style:none;padding:0;margin:4px 0 0;border:1px solid var(--line);border-radius:14px;overflow:hidden;background:#0d1120}.hp-res:empty{display:none}
.hp-res li a,.hp-res li button{display:block;width:100%;text-align:left;padding:10px 14px;border:0;border-top:1px solid var(--line);background:transparent;color:var(--tx);font:500 14.5px/1.45 var(--body);text-decoration:none;cursor:pointer}.hp-res li:first-child a,.hp-res li:first-child button{border-top:0}.hp-res small{display:block;color:var(--mut);font-size:12.5px;font-weight:700;letter-spacing:.04em;text-transform:uppercase}.hp-res mark{background:rgba(246,199,92,.3);color:inherit;border-radius:3px}
.hp-start{display:grid;grid-template-columns:1fr auto;gap:12px 18px;align-items:center;border:1px solid rgba(25,211,181,.45);border-radius:18px;padding:18px 20px;margin:18px 0;background:linear-gradient(120deg,rgba(25,211,181,.12),rgba(246,199,92,.06))}.hp-start h2{margin:0;font:800 20px var(--body)}.hp-start p{margin:4px 0 0;color:var(--mut);line-height:1.55}.hp-start .hp-acts{margin:0}
.hp-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:16px;margin:16px 0 30px}
.hp-card{border:1px solid var(--line);border-radius:18px;overflow:hidden;background:rgba(255,255,255,.03);display:flex;flex-direction:column}
.hp-card .th{position:relative;aspect-ratio:16/9;background:#11152a center/cover}.hp-card .th.ph{display:flex;align-items:flex-end;padding:14px;background:radial-gradient(120% 90% at 20% 20%,rgba(25,211,181,.22),transparent 60%),radial-gradient(90% 80% at 90% 100%,rgba(246,199,92,.16),transparent 60%),#0b1020}.hp-card .th.ph{justify-content:space-between;align-items:flex-end}.hp-card .th.ph i{font:400 22px/1 var(--display);font-style:normal;letter-spacing:.08em;text-transform:uppercase;background:linear-gradient(90deg,#19d3b5,#f6c75c);-webkit-background-clip:text;background-clip:text;color:transparent}.hp-card .th.ph em{font:700 12.5px var(--body);font-style:normal;color:#cfd6e6;border:1px solid var(--line2);border-radius:99px;padding:4px 10px;background:rgba(0,0,0,.35)}.hp-card .th span{position:absolute;right:10px;bottom:10px;background:rgba(0,0,0,.75);border-radius:8px;padding:3px 9px;font:700 12.5px var(--body)}
.hp-card .bd{padding:14px 16px 16px;display:flex;flex-direction:column;gap:8px;flex:1}.hp-card h3{margin:0;font:700 17px var(--body)}.hp-card p{margin:0;color:var(--mut);font-size:14.5px;line-height:1.5;flex:1}
.hp-card .row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}.hp-soon{font:700 13px var(--body);color:var(--dim)}
.hp-sec{margin:34px 0;scroll-margin-top:90px}.hp-sec>h2{font:800 24px var(--body);margin:0 0 4px}.hp-sec>p{color:var(--mut);margin:0 0 8px;line-height:1.55;font-size:15.5px}
.hp-toc{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0 0}.hp-toc a{color:var(--tx);border:1px solid var(--line);border-radius:999px;padding:8px 14px;font:600 14px var(--body);text-decoration:none}
.hp-kn{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px}.hp-kn>section{border:1px solid var(--line);border-top:4px solid var(--k);border-radius:16px;padding:14px 16px;background:rgba(255,255,255,.03)}.hp-kn h3{margin:0 0 4px;font:800 17px var(--body)}.hp-kn>section>p{margin:0 0 6px;color:var(--mut);font-size:14px;line-height:1.5}.hp-kn ul{margin:0;padding-left:18px}.hp-kn li{margin:7px 0;line-height:1.55;font-size:14.5px;color:#d9deec}.hp-kn li i{font-style:normal;color:var(--dim);font-size:12.5px;font-weight:700;margin-right:6px}
dialog.hp-tour{border:1px solid var(--line);border-radius:20px;background:#0b0f1c;color:var(--tx);padding:0;width:min(640px,94vw)}dialog.hp-tour::backdrop{background:rgba(3,4,10,.8)}
.hp-tour .dots{display:flex;gap:6px;margin:10px 0 0}.hp-tour .dots i{width:28px;height:5px;border-radius:3px;background:var(--line)}.hp-tour .dots i.on{background:#19d3b5}
.hp-tour .step{font:800 12.5px var(--body);letter-spacing:.08em;color:#f6c75c;text-transform:uppercase;margin-top:16px}.hp-tour h3{font:800 24px/1.25 var(--body);margin:6px 0}.hp-tour .bodyt{color:#d9deec;font-size:16px;line-height:1.65;min-height:5.5em}
.hp-tour .flow{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin:12px 0;font:700 13px var(--body)}.hp-tour .flow span{border:1px solid var(--line);border-radius:999px;padding:5px 10px;color:var(--mut)}.hp-tour .flow span.on{border-color:#19d3b5;color:var(--tx);background:rgba(25,211,181,.12)}.hp-tour .flow b{color:var(--dim)}
@media (prefers-reduced-motion:reduce){dialog.hp-dr,dialog.hp-pl,dialog.hp-tour{transition:none!important;animation:none!important}html:focus-within{scroll-behavior:auto}}
@media (max-width:700px){dialog.hp-pl{width:100vw;max-width:100vw;height:100%;max-height:100%;border-radius:0;border:0;margin:0}.hp-in{padding:16px 14px 24px}.hp-start{grid-template-columns:1fr}.hp-page>.hp-lead{font-size:16px}}`;document.head.appendChild(s)}
function report(tool){try{if(typeof W.calcReport==='function')return W.calcReport({tool,what:'Help: suspected issue'})}catch(e){}location.href='/genshin/help#report'}
const fmt=s=>Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0');
function trap(dl){dl.addEventListener('keydown',e=>{if(e.key!=='Tab')return;const f=[...dl.querySelectorAll('a[href],button:not([disabled]),input,summary,video,[tabindex]:not([tabindex="-1"])')].filter(x=>x.offsetParent!==null);if(!f.length)return;const a=f[0],b=f[f.length-1];if(e.shiftKey&&document.activeElement===a){e.preventDefault();b.focus()}else if(!e.shiftKey&&document.activeElement===b){e.preventDefault();a.focus()}})}
/* ---------- the drawer beside each tool: opens over the page, so nothing you are working on is touched ---------- */
async function open(tool,opt){css();const H=await data(),S=H.tools[tool]||H.tools.roster,TT=await tuts(),tu=TT[S.tut];let dl=document.getElementById('hp-dr');if(dl)dl.remove();dl=document.createElement('dialog');dl.id='hp-dr';dl.className='hp-dr';dl.setAttribute('aria-labelledby','hp-dr-h');
 const good=opt&&opt.good,calc=tool==='lab'||tool==='teamlab';dl.innerHTML='<div class="hp-in"><div class="hp-top"><h2 id="hp-dr-h">'+esc(good?H.good.title:S.name+': how it works & limitations')+'</h2><button class="hp-x" type="button" aria-label="Close" data-hp="x">✕</button></div>'+
  (good?goodHTML(H):'<p class="hp-lead">'+esc(S.lead)+'</p>')+
  '<div class="hp-acts">'+(live(tu)&&!good?'<button class="hp-b pri" type="button" data-hp="watch">▶ Watch the '+esc(tu.durLabel||'')+' walkthrough</button>':'')+(good&&live(TT['roster-good'])?'<button class="hp-b pri" type="button" data-hp="watchgood">▶ Watch how (shows each step)</button>':'')+'<a class="hp-b" href="/genshin/help#'+esc(good?'roster':tool)+'" target="_blank" rel="noopener">Open the Help Center</a><button class="hp-b txt" type="button" data-hp="report">Report a suspected issue</button></div>'+
  (good?'':groupsHTML(S.groups)+(calc?'<div data-hp-facts></div>':'')+relHTML(H,S,true))+'<p class="hp-meta">Last reviewed '+esc(H.reviewed)+'. Opening this changes nothing on the page, and links open in a new tab, so your work stays where it is.</p></div>';
 document.body.appendChild(dl);trap(dl);dl.addEventListener('click',e=>{const b=e.target.closest('[data-hp]');if(e.target===dl)return dl.close();if(!b)return;const a=b.dataset.hp;if(a==='x')dl.close();if(a==='watch')play(S.tut);if(a==='watchgood')play('roster-good',{chapter:'Finding the exporter'});if(a==='report')report(S.name)});dl.addEventListener('close',()=>dl.remove());dl.showModal();(dl.querySelector('[data-hp="x"]')||dl).focus();
 if(calc){const F=await facts(),box=dl.querySelector('[data-hp-facts]');if(box){box.innerHTML=factsHTML(F)+gapsHTML(F,false);wireGaps(box)}}}
function wireGaps(root){root.querySelectorAll('.hp-gq').forEach(q=>q.addEventListener('input',()=>{const v=q.value.trim().toLowerCase();q.closest('.hp-gaps').querySelectorAll('.hp-gl li').forEach(li=>{li.hidden=!!v&&!li.dataset.q.includes(v)})}))}
function goodHTML(H){return'<p class="hp-lead">A GOOD file is a .json list of your characters, weapons and artifacts. Here is one way to get one. You can also skip it and add characters by hand.</p><ol class="hp-steps">'+H.good.steps.map(s=>'<li><b>'+esc(s[0])+'</b>'+esc(s[1])+(s[2]?' <a href="'+esc(s[2])+'" target="_blank" rel="noopener noreferrer">Open the page ↗</a>':'')+'</li>').join('')+'</ol><p class="hp-note">PawPixl will never ask for your HoYoLAB password, codes, cookies or tokens. Any exporter is third-party software: check it yourself before installing. You never need one; adding characters by hand always works.</p>'}
/* ---------- the tutorial player: muted, captions on, chapters and transcript fold away on phones ---------- */
async function play(id,opt){css();opt=opt||{};const TT=await tuts(),t=TT[id];if(!live(t))return;let dl=document.getElementById('hp-pl');if(dl)dl.remove();dl=document.createElement('dialog');dl.id='hp-pl';dl.className='hp-pl';dl.setAttribute('aria-labelledby','hp-pl-h');
 const wide=matchMedia('(min-width:900px)').matches,ch=t.chapters||[];
 dl.innerHTML='<div class="vw"><video controls muted playsinline preload="metadata" poster="'+esc(t.poster||'')+'" aria-describedby="hp-pl-d"><source src="'+esc(t.video)+'" type="video/mp4"><track kind="captions" srclang="en" label="English" src="'+esc(t.vtt||'')+'" default></video></div><div class="hp-in"><div class="hp-top"><h2 id="hp-pl-h">'+esc(t.title)+'</h2><button class="hp-x" type="button" aria-label="Close" data-hp="x">✕</button></div><p class="hp-lead" id="hp-pl-d">'+esc(t.desc||'')+' '+(t.audio?'Starts muted with captions on; use the speaker button for the narration.':'Captions are on. This version has no voice-over yet.')+'</p>'+
  '<div class="hp-acts"><button class="hp-b" type="button" data-hp="fs">⛶ Full screen</button></div>'+
  (ch.length?'<details'+(wide?' open':'')+'><summary>Chapters ('+ch.length+')</summary><div class="hp-ch" role="group" aria-label="Chapters">'+ch.map(c=>'<button type="button" data-t="'+(+c[0])+'">'+esc(fmt(c[0]))+' '+esc(c[1])+'</button>').join('')+'</div></details>':'')+
  '<details data-tr><summary>Read the transcript</summary><div class="hp-tr" id="hp-tr" tabindex="0">Loading…</div></details></div>';
 document.body.appendChild(dl);trap(dl);const v=dl.querySelector('video');
 const mark=()=>{let cur=-1;ch.forEach((c,i)=>{if(v.currentTime>=+c[0]-0.05)cur=i});dl.querySelectorAll('.hp-ch button').forEach((b,i)=>{if(i===cur)b.setAttribute('aria-current','true');else b.removeAttribute('aria-current')})};v.addEventListener('timeupdate',mark);
 dl.addEventListener('click',e=>{if(e.target===dl)return dl.close();const b=e.target.closest('[data-hp],[data-t]');if(!b)return;if(b.dataset.hp==='x')dl.close();if(b.dataset.hp==='fs'){try{(v.requestFullscreen||v.webkitRequestFullscreen||v.webkitEnterFullscreen).call(v)}catch(err){}}if(b.dataset.t!=null){v.currentTime=+b.dataset.t;v.focus();mark()}});
 dl.addEventListener('close',()=>{try{v.pause()}catch(e){}dl.remove()});dl.showModal();
 if(opt.chapter){const c=ch.find(x=>x[1]===opt.chapter);if(c)v.addEventListener('loadedmetadata',()=>{v.currentTime=+c[0];mark()},{once:true})}if(opt.t!=null)v.addEventListener('loadedmetadata',()=>{v.currentTime=+opt.t;mark()},{once:true});
 dl.querySelector('[data-tr]').addEventListener('toggle',async e=>{const box=dl.querySelector('#hp-tr');if(!e.target.open||box.dataset.ok)return;try{const r=await fetch(t.transcript);box.textContent=await r.text();box.dataset.ok=1}catch(err){box.textContent='The transcript could not be loaded.'}});dl.querySelector('[data-hp="x"]').focus()}
/* ---------- getting started: optional, remembered, and restartable from the Help Center ---------- */
const ONB='pp.onb';function onbSet(v){try{localStorage.setItem(ONB,v)}catch(e){}}
async function tour(){css();const H=await data(),TT=await tuts(),St=H.start,n=St.steps.length;let i=0;let dl=document.getElementById('hp-tour');if(dl)dl.remove();dl=document.createElement('dialog');dl.id='hp-tour';dl.className='hp-tour';dl.setAttribute('aria-labelledby','hp-tour-h');document.body.appendChild(dl);trap(dl);
 const names=['My Roster','Fill it in','Build Lab · Upgrades','Team Lab','Create a Graphic'];
 const draw=()=>{const s=St.steps[i];dl.innerHTML='<div class="hp-in"><div class="hp-top"><h2 id="hp-tour-h">'+esc(St.title)+'</h2><button class="hp-x" type="button" aria-label="Close" data-t="x">✕</button></div><div class="dots" aria-hidden="true">'+St.steps.map((_,k)=>'<i class="'+(k<=i?'on':'')+'"></i>').join('')+'</div>'+
  '<div class="step">Step '+(i+1)+' of '+n+'</div><h3>'+esc(s[0])+'</h3><p class="bodyt" aria-live="polite">'+esc(s[1])+'</p><div class="flow" aria-hidden="true">'+names.map((x,k)=>(k?'<b>→</b>':'')+'<span class="'+(k===i?'on':'')+'">'+esc(x)+'</span>').join('')+'</div>'+(i===n-1?'<p class="hp-note">'+esc(St.note)+'</p>':'')+
  '<div class="hp-acts">'+(i>0?'<button class="hp-b" type="button" data-t="back">Back</button>':'')+(i<n-1?'<button class="hp-b pri" type="button" data-t="next">Next</button>':'<button class="hp-b pri" type="button" data-t="done">Finish</button>')+'<a class="hp-b txt" href="'+esc(s[2])+'" data-t="go">'+esc(s[3])+'</a>'+(live(TT[St.tut])?'<button class="hp-b txt" type="button" data-t="watch">Watch the video instead</button>':'')+'</div><p class="hp-meta">You can start this tour again any time from the Help Center.</p></div>';
  const f=dl.querySelector('[data-t="next"],[data-t="done"]');if(f)f.focus()};
 dl.addEventListener('click',e=>{if(e.target===dl)return dl.close();const b=e.target.closest('[data-t]');if(!b)return;const a=b.dataset.t;if(a==='x')dl.close();if(a==='next'){i++;draw()}if(a==='back'){i--;draw()}if(a==='done'){onbSet('done');dl.close()}if(a==='watch'){onbSet('done');dl.close();play(St.tut)}
  if(a==='go'){e.preventDefault();onbSet('done');dl.close();const u=b.getAttribute('href');if(typeof W.go==='function')W.go(u);else{history.pushState(null,'',u);dispatchEvent(new PopStateEvent('popstate'))}}});
 dl.addEventListener('close',()=>{try{if(!localStorage.getItem(ONB))onbSet('seen')}catch(e){}document.querySelectorAll('.pp-onb').forEach(x=>x.remove());dl.remove()});draw();dl.showModal()}
/* ---------- the Help Center page ---------- */
let VER='';
function knownHTML(H,F){const L={issue:[],limit:[],pending:[]};ORDER.forEach(k=>{const S=H.tools[k];(S.groups||[]).forEach((g,gi)=>{if(L[g.k])g.i.forEach(x=>L[g.k].push('<li><i>'+esc(S.name)+'</i>'+esc(x)+' <a href="#'+k+'-'+gi+'" class="hp-more">More</a></li>'))})});
 const col=(k,t,p,body)=>'<section style="--k:'+KIND[k][1]+'"><h3>'+t+'</h3><p>'+p+'</p>'+body+'</section>';
 return'<div class="hp-kn">'+col('issue','Confirmed bugs','Things that are wrong today and being fixed.',L.issue.length?'<ul>'+L.issue.join('')+'</ul>':'<p class="hp-fact">No confirmed bugs right now. Spotted something? <a href="#report">Report it</a>.</p>')+
  col('limit','Intentional limitations','Choices made on purpose to keep numbers honest and simple.','<ul>'+L.limit.join('')+'</ul>')+
  col('pending','Unsupported mechanics','Things the calculators do not calculate yet. Never counted as zero.','<ul>'+L.pending.join('')+'</ul>'+gapsHTML(F,false))+
  col('planned','Planned improvements','What is on the way.','<ul>'+(H.planned||[]).map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>')+'</div>'}
function index(H,TT){const I=[];ORDER.forEach(k=>{const S=H.tools[k];I.push({h:'#'+k,t:S.name,s:S.lead,k:S.name});(S.groups||[]).forEach((g,gi)=>g.i.forEach(x=>I.push({h:'#'+k+'-'+gi,t:g.t,s:x,k:S.name})))});
 H.good.steps.forEach(s=>I.push({h:'#good',t:s[0],s:s[1],k:'GOOD file'}));H.start.steps.forEach(s=>I.push({h:'#start',t:s[0],s:s[1],k:'Getting started'}));
 Object.values(TT).filter(live).forEach(t=>(t.chapters||[]).forEach(c=>I.push({v:t.id,at:+c[0],t:c[1],s:t.title+' · '+fmt(c[0]),k:'Video'})));return I}
async function page(){css();const H=await data(),TT=await tuts();try{VER=(await (await fetch('/version.json',{cache:'no-cache'})).json()).v||''}catch(e){}
 const ids={roster:'roster-good',lab:'build-lab',teamlab:'team-lab',create:'create-graphic',upgrades:'next-upgrades',start:'getting-started'};
 const cardOf=(id,name,lead,path)=>{const t=TT[id]||{},ok=live(t);return'<article class="hp-card"><div class="th'+(ok&&t.poster?'':' ph')+'" role="img" aria-label="'+esc(t.title||name)+'" style="'+(ok&&t.poster?'background-image:url('+esc(t.poster)+')':'')+'">'+(ok&&t.durLabel?'<span>'+esc(t.durLabel)+'</span>':'<i>PawPixl</i><em>Video coming soon</em>')+'</div><div class="bd"><h3>'+esc(t.title||name)+'</h3><p>'+esc(t.desc||lead)+'</p><div class="row">'+(ok?'<button class="hp-b pri" type="button" data-hp-play="'+esc(id)+'">▶ Watch</button>':'')+(path?'<a class="hp-b txt" href="'+esc(path)+'" data-link>Open '+esc(name)+'</a>':'')+'</div></div></article>'};
 const cards=cardOf(ids.start,'Getting started',H.start.lead,'')+ORDER.map(k=>{const S=H.tools[k];return cardOf(S.tut,S.name,S.lead,S.path)}).join('');
 const F=await facts();
 return'<div class="hp-page"><div class="eyebrow">Help</div><h1>PawPixl Help Center</h1><p class="hp-lead">'+esc(H.intro)+'</p>'+
  '<div class="hp-search" role="search"><input type="search" class="hp-sq" id="hp-sq" placeholder="Search help, e.g. “GOOD file”, “reaction”, “Team DPS”" aria-label="Search help" aria-controls="hp-res" autocomplete="off"><ul class="hp-res" id="hp-res" aria-live="polite"></ul></div>'+
  '<nav class="hp-toc" aria-label="On this page"><a href="#start">Getting started</a><a href="#videos">Videos</a>'+ORDER.map(k=>'<a href="#'+k+'">'+esc(H.tools[k].name)+'</a>').join('')+'<a href="#known">Known issues & limitations</a><a href="#report">Report an issue</a></nav>'+
  '<section class="hp-start" id="start"><div><h2>'+esc(H.start.title)+'</h2><p>'+esc(H.start.lead)+' A one-minute tour shows how My Roster feeds every other tool.</p></div><div class="hp-acts"><button class="hp-b pri" type="button" data-hp-tour="1">Start the tour</button>'+(live(TT[ids.start])?'<button class="hp-b" type="button" data-hp-play="'+ids.start+'">▶ Watch</button>':'')+'</div></section>'+
  '<section class="hp-sec" id="videos"><h2>Walkthrough videos</h2><p>'+(Object.values(TT).some(live)?'Short, captioned walkthroughs filmed in the real site with a made-up demo account. Everything in them is also written out below.':'Short walkthrough videos are on the way. Until then, everything they cover is written out below.')+'</p><div class="hp-cards">'+cards+'</div></section>'+
  ORDER.map(k=>{const S=H.tools[k];return'<section class="hp-sec" id="'+k+'"><h2>'+esc(S.name)+'</h2><p>'+esc(S.lead)+'</p>'+(k==='roster'?'<details class="hp-g" id="good"><summary><b>'+esc(H.good.title)+'</b>: getting a GOOD file, step by step</summary>'+goodHTML(H)+'</details>':'')+groupsHTML(S.groups,k)+((k==='lab'||k==='teamlab')?factsHTML(F):'')+relHTML(H,S,false)+'</section>'}).join('')+
  '<section class="hp-sec" id="known"><h2>Known issues &amp; limitations</h2><p>Everything we know PawPixl does not do, or does not do yet, in one place.</p>'+knownHTML(H,F)+'</section>'+
  '<section class="hp-sec" id="report"><h2>Report a suspected issue</h2><p>Something look wrong? Tell us what you expected and what you saw. No account or name is needed.</p><div class="hp-acts"><button class="hp-b" type="button" data-hp-rep="1">Report a suspected issue</button></div></section>'+
  '<p class="hp-meta">Last reviewed '+esc(H.reviewed)+(VER?' · website version '+esc(VER):'')+'. PawPixl is an independent fan site.</p></div>'}
async function wirePage(root){const H=await data(),TT=await tuts(),I=index(H,TT);wireGaps(root);
 root.addEventListener('click',e=>{const p=e.target.closest('[data-hp-play]');if(p)return play(p.dataset.hpPlay,p.dataset.at?{t:+p.dataset.at}:null);if(e.target.closest('[data-hp-tour]'))return tour();if(e.target.closest('[data-hp-rep]'))report('the Help Center');
  const a=e.target.closest('a[href^="#"]');if(a){const el=document.getElementById(a.getAttribute('href').slice(1));if(el){e.preventDefault();if(el.tagName==='DETAILS')el.open=true;const d=el.closest('details');if(d)d.open=true;el.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});history.replaceState(null,'','#'+el.id)}}});
 const q=root.querySelector('#hp-sq'),R=root.querySelector('#hp-res');if(!q)return;
 const hi=(s,w)=>{let o=esc(s);w.forEach(x=>{if(x.length>1)o=o.replace(new RegExp('('+x.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','ig'),'<mark>$1</mark>')});return o};
 q.addEventListener('input',()=>{const w=q.value.trim().toLowerCase().split(/\s+/).filter(Boolean);if(!w.length||q.value.trim().length<2){R.innerHTML='';return}
  const hits=I.map(x=>{const hay=(x.t+' '+x.s+' '+x.k).toLowerCase();let sc=0;for(const v of w){if(!hay.includes(v))return null;sc+=(x.t.toLowerCase().includes(v)?3:1)}return{x,sc}}).filter(Boolean).sort((a,b)=>b.sc-a.sc);const vids=hits.filter(h=>h.x.v).slice(0,3);hits.splice(0,hits.length,...vids,...hits.filter(h=>!h.x.v).slice(0,12-vids.length));
  R.innerHTML=hits.length?hits.map(({x})=>'<li>'+(x.v?'<button type="button" data-hp-play="'+esc(x.v)+'" data-at="'+x.at+'"><small>▶ '+esc(x.k)+'</small>'+hi(x.t,w)+' · '+esc(x.s)+'</button>':'<a href="'+esc(x.h)+'"><small>'+esc(x.k)+'</small>'+hi(x.t+': '+x.s.slice(0,160)+(x.s.length>160?'…':''),w)+'</a>')+'</li>').join(''):'<li><a href="#report"><small>No results</small>Nothing found for “'+esc(q.value)+'”. Tell us what you were looking for.</a></li>'})}
W.PPHelp={open,play,page,wirePage,tour,data,tuts,facts,_D:D};
})();
