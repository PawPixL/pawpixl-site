/* PawPixl endgame schedule: one small engine shared by the website (homepage tracker), the Studio
   (Endgame Schedule Manager) and the tests.
   - Spiral Abyss and Imaginarium Theater follow the game's own monthly reset (a day of the month at a
     server-time hour), so their windows are worked out from that rule and never go stale.
   - Stygian Onslaught has no fixed cycle. Its windows are dated entries the owner confirmed. When none
     is current or upcoming the tracker says so; it never guesses the next one.
   - All times are stored as server-local wall time ("2026-11-11T10:00") and turned into real moments
     per region, because the same reset lands at a different moment on each server.
   Public file format: pawpixl-endgame/1. It holds no source links. */
(function(root){'use strict';
const FORMAT='pawpixl-endgame/1';
const REG={america:{t:'America',off:-5},europe:{t:'Europe',off:1},asia:{t:'Asia',off:8}};
const KEYS=['abyss','theatre','stygian'];
const NAME={abyss:'Spiral Abyss',theatre:'Imaginarium Theater',stygian:'Stygian Onslaught'};
const MON=['January','February','March','April','May','June','July','August','September','October','November','December'];
const H=36e5;
const pad=n=>String(n).padStart(2,'0');
const isLocal=s=>/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(String(s||''));
/* server-local wall time -> the real moment on that region's server */
function toUTC(local,off){if(!isLocal(local))return NaN;const m=local.match(/\d+/g).map(Number);const t=Date.UTC(m[0],m[1]-1,m[2],m[3],m[4]);const d=new Date(t);if(d.getUTCMonth()!==m[1]-1||d.getUTCDate()!==m[2]||m[3]>23||m[4]>59)return NaN;return t-off*H}
function toLocal(utc,off){const d=new Date(utc+off*H);return d.getUTCFullYear()+'-'+pad(d.getUTCMonth()+1)+'-'+pad(d.getUTCDate())+'T'+pad(d.getUTCHours())+':'+pad(d.getUTCMinutes())}
function blank(){return{format:FORMAT,v:1,updated:'',items:{abyss:{mode:'rule',day:16,hour:4,windows:[]},theatre:{mode:'rule',day:1,hour:4,windows:[]},stygian:{mode:'dates',windows:[]}}}}
function okFile(f){return!!(f&&f.format===FORMAT&&f.items&&KEYS.every(k=>f.items[k]&&Array.isArray(f.items[k].windows||[])))}
/* the monthly window that contains "now" on one server */
function ruleWindow(day,hour,off,now){const L=new Date(now+off*H);let y=L.getUTCFullYear(),m=L.getUTCMonth();let s=Date.UTC(y,m,day,hour)-off*H;if(s>now){m--;s=Date.UTC(y,m,day,hour)-off*H}const e=Date.UTC(y,m+1,day,hour)-off*H;return{start:s,end:e,startLocal:toLocal(s,off),endLocal:toLocal(e,off)}}
/* a dated window on one server. An end written as HH:59 runs to the end of that minute. */
function span(w,off){const s=toUTC(w.start,off),e=toUTC(w.end,off);return{start:s,end:e+(/:59$/.test(w.end)?6e4:0)}}
function validWindow(w){const P=[];if(!w||!isLocal(w.start)||isNaN(toUTC(w.start,0)))P.push('The start is not a real date and time.');if(!w||!isLocal(w.end)||isNaN(toUTC(w.end,0)))P.push('The end is not a real date and time.');if(!P.length){const d=toUTC(w.end,0)-toUTC(w.start,0);if(d<=0)P.push('The end is not after the start.');else if(d>80*24*H)P.push('That is longer than 80 days, which no endgame cycle has been.')}return P}
/* where one mode stands right now on one server */
function status(file,key,region,now){const off=(REG[region]||REG.america).off,it=okFile(file)?file.items[key]:null,out={key,name:NAME[key],region:REG[region]?region:'america',state:'none',start:null,end:null,title:'',ver:'',conf:'',cycle:''};if(!it)return out;
 const W=(it.windows||[]).filter(w=>!validWindow(w).length).map(w=>Object.assign({},w,span(w,off))).sort((a,b)=>a.start-b.start);
 const live=W.find(w=>w.start<=now&&now<w.end),next=W.find(w=>w.start>now);
 const use=(w,state)=>{out.state=state;out.start=w.start;out.end=w.end;out.title=w.name||'';out.ver=w.ver||'';out.conf=w.conf==='estimate'?'estimate':'confirmed';out.cycle=w.name||(w.ver?'Version '+w.ver:'')};
 if(live){use(live,'live');return out}
 if(it.mode==='rule'){const r=ruleWindow(it.day,it.hour,off,now);
  /* an owner-entered window that starts before this monthly window ends wins over the rule for the time it covers */
  out.state='live';out.start=r.start;out.end=next&&next.start<r.end?next.start:r.end;out.conf='rule';const L=new Date(r.start+off*H);out.cycle=MON[L.getUTCMonth()]+' '+L.getUTCFullYear();return out}
 if(next){use(next,'soon');return out}
 return out}
function left(ms){if(!(ms>0))return'0m';const d=Math.floor(ms/864e5),h=Math.floor(ms%864e5/H),m=Math.floor(ms%H/6e4);return d>0?d+'d '+h+'h':h>0?h+'h '+m+'m':Math.max(1,m)+'m'}
/* which server a visitor is most likely on, from their own clock. They can always change it. */
function guessRegion(offsetMinutesEastOfUTC){const h=offsetMinutesEastOfUTC/60;return h<=-2.5?'america':h<=4?'europe':'asia'}
/* ---------- reading dates out of pasted announcement text (nothing is fetched) ---------- */
const MIX=MON.map(m=>m.slice(0,3).toLowerCase());
function parse(text){const out=[],seen=new Set(),T=String(text||'').replace(/[–—→〜~]/g,'-');
 const add=(s,e,timed)=>{const k=s+'|'+e;if(seen.has(k)||!isLocal(s)||!isLocal(e)||validWindow({start:s,end:e}).length)return;seen.add(k);out.push({start:s,end:e,timeAssumed:!timed})};
 let m;const A=/(\d{4})[\/.-](\d{1,2})[\/.-](\d{1,2})\s+(\d{1,2}):(\d{2})(?::\d{2})?\s*(?:-|to|until)\s*(\d{4})[\/.-](\d{1,2})[\/.-](\d{1,2})\s+(\d{1,2}):(\d{2})/g;
 while((m=A.exec(T)))add(m[1]+'-'+pad(m[2])+'-'+pad(m[3])+'T'+pad(m[4])+':'+m[5],m[6]+'-'+pad(m[7])+'-'+pad(m[8])+'T'+pad(m[9])+':'+m[10],true);
 const mon='(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\\.?',one=mon+'\\s+(\\d{1,2})(?:st|nd|rd|th)?,?(?:\\s+(\\d{4}))?(?:,?\\s+(?:at\\s+)?(\\d{1,2}):(\\d{2}))?';
 const B=new RegExp(one+'\\s*(?:-|to|until|through)\\s*'+one,'gi');
 while((m=B.exec(T))){const y2=m[8]||m[3],y1=m[3]||y2;if(!y1||!y2)continue;const mi=x=>MIX.indexOf(x.slice(0,3).toLowerCase())+1,timed=!!(m[4]&&m[9]);
  add(y1+'-'+pad(mi(m[1]))+'-'+pad(m[2])+'T'+(m[4]?pad(m[4])+':'+m[5]:'10:00'),y2+'-'+pad(mi(m[6]))+'-'+pad(m[7])+'T'+(m[9]?pad(m[9])+':'+m[10]:'03:59'),timed)}
 return out}
/* ---------- the Studio's side: proposals, the review queue, applying, checking ---------- */
function blankStore(){return{v:1,file:blank(),sources:[],queue:[],log:[],lastCheck:'',auto:{apply:false},owner:{}}}
const overlap=(a,b)=>toUTC(a.start,0)<toUTC(b.end,0)&&toUTC(b.start,0)<toUTC(a.end,0);
const same=(a,b)=>a.start===b.start&&a.end===b.end;
const note=(st,what,at)=>{st.log.unshift({at,what});st.log=st.log.slice(0,200)};
/* decide what a newly found window is: nothing new, new, changed dates, a clash with the owner's own entry, or unusable */
function classify(st,key,win){const P=KEYS.includes(key)?validWindow(win):['Unknown event.'];if(P.length)return{kind:'invalid',problems:P};const W=st.file.items[key].windows||[];
 const dup=W.find(w=>same(w,win));if(dup)return{kind:'same',hit:dup};const hit=W.filter(w=>overlap(w,win));if(!hit.length)return{kind:'new'};
 return hit.some(w=>st.owner[key+'|'+w.start])?{kind:'conflict',hit:hit[0]}:{kind:'changed',hit:hit[0]}}
function put(st,key,win,at,by){const it=st.file.items[key];const gone=(it.windows||[]).filter(w=>overlap(w,win)&&!same(w,win));gone.forEach(w=>delete st.owner[key+'|'+w.start]);
 it.windows=(it.windows||[]).filter(w=>!overlap(w,win)).concat([{start:win.start,end:win.end,name:String(win.name||'').slice(0,80),ver:String(win.ver||'').slice(0,12),conf:win.conf==='estimate'?'estimate':'confirmed',verified:at,srcs:(win.srcs||[]).slice(0,6)}]).sort((a,b)=>a.start.localeCompare(b.start));
 if(by==='owner')st.owner[key+'|'+win.start]=true;st.file.updated=at;note(st,(by==='owner'?'Owner set ':by==='auto'?'Applied automatically: ':'Approved: ')+NAME[key]+' '+win.start+' to '+win.end+(gone.length?' (replaced '+gone.map(w=>w.start+' to '+w.end).join(', ')+')':''),at)}
/* a window found in a source or pasted text. Applied on its own only when everything is certain and the owner allowed it. */
function propose(st,key,win,at){const c=classify(st,key,win),srcs=(win.srcs||[]).filter(u=>/^https:\/\//i.test(u));
 if(c.kind==='same'){c.hit.verified=at;c.hit.srcs=[...new Set((c.hit.srcs||[]).concat(srcs))].slice(0,6);note(st,'Checked again, no change: '+NAME[key]+' '+win.start+' to '+win.end,at);return{action:'none',kind:'same'}}
 const sure=c.kind==='new'&&win.conf!=='estimate'&&!win.timeAssumed&&new Set(srcs).size>=2;
 if(sure&&st.auto&&st.auto.apply){put(st,key,Object.assign({},win,{srcs}),at,'auto');return{action:'applied',kind:'new'}}
 const why=c.kind==='invalid'?c.problems.join(' '):c.kind==='conflict'?'These dates clash with dates you entered yourself ('+c.hit.start+' to '+c.hit.end+'). Your entry is kept unless you approve this.':c.kind==='changed'?'These dates differ from the current ones ('+c.hit.start+' to '+c.hit.end+').':win.conf==='estimate'?'Marked as an estimate, not confirmed.':win.timeAssumed?'The text gave days but no times, so the usual start and end times were filled in. Please check them.':new Set(srcs).size<2?'Fewer than two sources are recorded for these dates.':'Automatic updates are off.';
 if(st.queue.some(q=>q.key===key&&same(q.win,win)))return{action:'queued',kind:c.kind,why,already:true};
 st.queue.push({id:key+'|'+win.start+'|'+win.end,key,win:Object.assign({},win,{srcs}),kind:c.kind,why,at});note(st,'Sent to review: '+NAME[key]+' '+win.start+' to '+win.end+'. '+why,at);return{action:'queued',kind:c.kind,why}}
function approve(st,id,at){const q=st.queue.find(x=>x.id===id);if(!q)return false;if(q.kind==='invalid')return false;put(st,q.key,q.win,at,'review');st.queue=st.queue.filter(x=>x.id!==id);return true}
function reject(st,id,at){const q=st.queue.find(x=>x.id===id);if(!q)return false;st.queue=st.queue.filter(x=>x.id!==id);note(st,'Rejected: '+NAME[q.key]+' '+q.win.start+' to '+q.win.end,at);return true}
function setOwner(st,key,win,at){const P=KEYS.includes(key)?validWindow(win):['Unknown event.'];if(P.length)return P;put(st,key,win,at,'owner');st.queue=st.queue.filter(q=>!(q.key===key&&overlap(q.win,win)));return[]}
function removeWindow(st,key,start,at){const it=st.file.items[key];if(!it)return false;const n=(it.windows||[]).length;it.windows=(it.windows||[]).filter(w=>w.start!==start);delete st.owner[key+'|'+start];if(it.windows.length===n)return false;st.file.updated=at;note(st,'Removed: '+NAME[key]+' '+start,at);return true}
/* the routine check: nothing is fetched. It reports what needs the owner and tidies long-finished windows. */
function check(st,now,at){const need=[],rows=[];KEYS.forEach(k=>{const per=Object.keys(REG).map(r=>status(st.file,k,r,now));rows.push({key:k,per});
  if(per.every(s=>s.state==='none'))need.push({key:k,what:NAME[k]+' has no current or upcoming dates. The website shows "dates not announced yet" until you add them.'});
  else if(st.file.items[k].mode==='dates'&&per.some(s=>s.state==='live'&&s.end-now<7*864e5)&&!(st.file.items[k].windows||[]).some(w=>toUTC(w.start,0)>now))need.push({key:k,what:NAME[k]+' ends within a week and the next dates are not entered yet.'});
  if(per.some(s=>s.conf==='estimate'))need.push({key:k,what:NAME[k]+' is showing estimated dates. Confirm them when the official dates are out.'})});
 KEYS.forEach(k=>{const it=st.file.items[k];it.windows=(it.windows||[]).filter(w=>toUTC(w.end,-12)>now-60*864e5)});st.lastCheck=at;note(st,'Checked the schedule. '+(need.length?need.length+' thing'+(need.length>1?'s need':' needs')+' you.':'Everything is current.'),at);return{need,rows}}
/* what goes on the website: dates only, no source links, no review queue */
function publicFile(st,at){const f=blank();KEYS.forEach(k=>{const it=st.file.items[k];f.items[k]=it.mode==='rule'?{mode:'rule',day:it.day,hour:it.hour,windows:[]}:{mode:'dates',windows:[]};f.items[k].windows=(it.windows||[]).filter(w=>!validWindow(w).length).map(w=>({start:w.start,end:w.end,name:w.name||'',ver:w.ver||'',conf:w.conf==='estimate'?'estimate':'confirmed'}))});f.updated=at;return f}
const api={FORMAT,REG,KEYS,NAME,toUTC,toLocal,blank,okFile,ruleWindow,validWindow,status,left,guessRegion,parse,blankStore,classify,propose,approve,reject,setOwner,removeWindow,check,publicFile};
if(typeof module!=='undefined'&&module.exports)module.exports=api;root.PPEndgame=api;
})(typeof window!=='undefined'?window:globalThis);
