/* The written version of an event guide (Spiral Abyss, Stygian Onslaught, Imaginarium Theater).
   One builder, used by the Studio when it writes the page for search engines and by the website for "Read this guide as text",
   so both always say the same thing. It only prints what the event editor holds: nothing is added, guessed or reworded.
   Data (made by each editor when it publishes), format 2:
     rules  [{label,text}]                         blessings, half buffs, required elements
     cast   {els[],open[],guest[]}                 Imaginarium Theater season cast
     enc    [{name,tag,el,mech,beat,teams[],chars[]}]   chambers, bosses or stages; a team is {name,members[]}
     groups [{label,teams[]}]                      teams that belong to a half, not to one enemy (Spiral Abyss)
   Older Stygian guides carry only bosses[{name,tag,el,mech,beat}] and still read correctly. */
(function(){const W=typeof window!=='undefined'?window:globalThis;
const lines=t=>String(t||'').split(/\n+/).map(x=>x.replace(/^[\s•\-*]+/,'').trim()).filter(Boolean);
const HEAD={abyss:'Chambers and enemies',stygian:'Bosses',theatre:'Stages and bosses'};
function html(sec,D,chars,nm,e){D=D||{};e=e||(s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])));nm=nm||e;const li=a=>'<ul>'+a.map(x=>'<li>'+x+'</li>').join('')+'</ul>';let h='',anyTeam=false;
 const team=t=>{const m=(t.members||[]).filter(Boolean);if(m.length<2)return'';anyTeam=true;return(t.name?'<b>'+e(t.name)+':</b> ':'')+m.map(nm).join(', ')+(t.note?'<br><span class="evwhy">'+e(t.note)+'</span>':'')};
 const teams=(T,label)=>{const L=(T||[]).map(team).filter(Boolean);return L.length?'<p>'+e(label)+'</p>'+li(L):''};
 const rules=(D.rules||[]).filter(r=>r&&r.text);if(rules.length)h+='<h2>Rules and bonuses</h2>'+li(rules.map(r=>(r.label?'<b>'+e(r.label)+':</b> ':'')+e(r.text)));
 const C=D.cast;if(C&&((C.open||[]).length||(C.guest||[]).length||(C.els||[]).length)){h+='<h2>Season cast</h2>'+((C.els||[]).length?'<p>Required elements: '+C.els.map(e).join(', ')+'.</p>':'')+((C.open||[]).length?'<h3>Opening characters</h3>'+li(C.open.map(nm)):'')+((C.guest||[]).length?'<h3>Special guest characters</h3>'+li(C.guest.map(nm)):'')}
 const E=(Array.isArray(D.enc)?D.enc:(Array.isArray(D.bosses)?D.bosses:[])).filter(b=>b&&b.name);
 if(E.length){h+='<h2>'+(HEAD[sec]||'Encounters')+'</h2>'+(E.length>1?'<p class="evnav">'+E.map((b,i)=>'<a href="#ev-'+(i+1)+'">'+e(b.name)+'</a>').join(' · ')+'</p>':'');
  E.forEach((b,i)=>{h+='<h3 id="ev-'+(i+1)+'">'+e(b.name)+(b.tag||b.el?' ('+e([b.tag,b.el].filter(Boolean).join(', '))+')':'')+'</h3>'+(lines(b.mech).length?'<p>What it does:</p>'+li(lines(b.mech).map(e)):'')+(lines(b.beat).length?'<p>How to beat it:</p>'+li(lines(b.beat).map(e)):'')+teams(b.teams,'Suggested teams for '+b.name+':')+((b.chars||[]).filter(Boolean).length?'<p>Suggested characters: '+b.chars.filter(Boolean).map(nm).join(', ')+'.</p>':'')})}
 const G=(D.groups||[]).map(g=>({g,t:teams(g.teams,'')})).filter(x=>x.t);if(G.length)h+='<h2>Recommended teams</h2>'+G.map(x=>'<h3>'+e(x.g.label||'Team')+'</h3>'+x.t.replace(/^<p><\/p>/,'')).join('');
 if(Array.isArray(D.rows)&&D.rows.some(r=>r&&r.on))h+='<h2>This week</h2>'+li(D.rows.filter(r=>r&&r.on&&(r.game||r.desc)).map(r=>{const d=new Date(r.d+'T00:00:00Z');return e((isNaN(d)?r.d:d.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',timeZone:'UTC'}))+(r.time?', '+r.time+(D.tz?' '+D.tz:''):'')+': '+[r.game,r.desc].filter(Boolean).join('. '))}));
 /* a bare list of names is only used when the guide records no teams at all */
 if(!anyTeam&&chars&&chars.length)h+='<h2>'+(sec==='theatre'?'Suggested characters':'Characters featured')+'</h2>'+li(chars.map(nm));return h}
/* what an event guide is missing for a complete written version. 'warn' never blocks publishing. */
function check(sec,D){const out=[],E=((D||{}).enc||(D||{}).bosses||[]).filter(b=>b&&b.name),all=[];if(!D||(!E.length&&!(D.groups||[]).length)){out.push(['warn','No enemies, bosses or teams are recorded, so the written guide will only list characters.']);return out}
 E.forEach(b=>{if(!lines(b.mech).length&&!lines(b.beat).length)out.push(['warn',b.name+': no mechanics or strategy notes typed in.']);(b.teams||[]).forEach(t=>all.push([b.name,t]))});(D.groups||[]).forEach(g=>(g.teams||[]).forEach(t=>all.push([g.label,t])));
 const seen=new Map();all.forEach(([w,t])=>{const m=(t.members||[]).filter(Boolean);if(!m.length)return;if(m.length<4)out.push(['warn',w+': team '+(t.name?'“'+t.name+'” ':'')+'has '+m.length+' of 4 characters.']);if(new Set(m).size<m.length)out.push(['warn',w+': a character appears twice in one team ('+m.join(', ')+').']);const k=w+'|'+m.slice().sort().join('|');if(m.length===4&&seen.has(k))out.push(['warn',w+': the same team is listed twice ('+m.join(', ')+').']);seen.set(k,1)});
 if(!all.some(x=>(x[1].members||[]).filter(Boolean).length>=2))out.push(['warn','No recommended teams are recorded.']);else{const full=all.filter(x=>(x[1].members||[]).filter(Boolean).length>=2),no=full.filter(x=>!String(x[1].note||'').trim()).length;if(no)out.push(['warn',no+' of '+full.length+' team'+(full.length===1?'':'s')+' ha'+(no===1?'s':'ve')+' no short reason typed in (“Why this team works here”).'])}return out}
W.PPEvText={html,check,lines};if(typeof module!=='undefined')module.exports=W.PPEvText;})();
