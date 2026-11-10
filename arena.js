/* PawPixl Arena: The Training Grounds (beta).
   A guided, step-by-step look at a team rotation on a small pixel-art training ground.
   Everything shown comes from content/arena.json, which the Arena Manager in PawPixl Studio writes.
   No damage numbers: damage simulation isn't connected yet, so the Arena only explains and shows the rotation.
   Loaded only when someone opens /arena, so the rest of the site never pays for it. */
(function(){
'use strict';
const ELC={Pyro:'#ff8a3d',Hydro:'#43b4ff',Anemo:'#3fe0bf',Electro:'#b77cff',Dendro:'#8fd14f',Cryo:'#9fe6ff',Geo:'#f2c14e',Physical:'#efe6cf'};
const RXC={Vaporize:'#ffb86b',Melt:'#ffcf7a',Superconduct:'#b9a8ff',Swirl:'#7af0d6',Overloaded:'#ff7b9c',Freeze:'#bfefff',Burning:'#ff9a3d','Electro-Charged':'#c08bff',Crystallize:'#f6d77a'};
const INV=[['f2p','F2P'],['mid','Mid Investment'],['high','High Investment']];
let W=256;const H=144;
let A=null;/* the running arena */
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
const reduced=()=>{try{return matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){return false}};

/* ---------------- the training ground (original pixel art, drawn in code) ---------------- */
function px(g,x,y,w,h,c){g.fillStyle=c;g.fillRect(x|0,y|0,w|0,h|0)}
const ART={};function loadArt(map){Object.entries(map||{}).forEach(([k,src])=>{if(!src||ART[k])return;const im=new Image();ART[k]={ok:false};im.onload=()=>{ART[k]={ok:true,im};if(A&&A.redraw)A.redraw()};im.onerror=()=>{ART[k]={ok:false}};im.src='/'+String(src).replace(/^\/+/,'')})}
function drawGround(){const c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');
 if(ART.background&&ART.background.ok){const im=ART.background.im,k=Math.max(W/im.width,H/im.height);g.imageSmoothingEnabled=false;g.drawImage(im,(W-im.width*k)/2,(H-im.height*k)/2,im.width*k,im.height*k);return c}
 /* warm dusk sky in bands */
 const sky=['#2a1a2e','#3b2238','#552c3a','#7a3b3a','#a5503a','#c8703f','#e09447','#efb25a'];sky.forEach((s,i)=>px(g,0,i*9,W,9,s));
 /* sun */
 for(let r=14;r>0;r-=2){g.fillStyle=r>10?'#f6c76a':r>6?'#ffd98a':'#fff0bf';g.beginPath();g.arc(W-60,66,r,0,7);g.fill()}
 /* far mountains */
 g.fillStyle='#6b3a3f';for(let x=0;x<W;x++){const y=60+Math.round(8*Math.sin(x*.045)+5*Math.sin(x*.13+1));g.fillRect(x,y,1,H-y)}
 g.fillStyle='#4d2c39';for(let x=0;x<W;x++){const y=72+Math.round(6*Math.sin(x*.06+2)+3*Math.sin(x*.21));g.fillRect(x,y,1,H-y)}
 /* distant trees */
 g.fillStyle='#33223a';for(let x=4;x<W;x+=9){const h=6+((x*7)%5);g.fillRect(x,82-h,3,h);g.fillRect(x-1,82-h+2,5,h-3)}
 px(g,0,82,W,H-82,'#2d2034');
 /* stone-and-grass platform */
 const L0=14,PW=W-28;px(g,L0,100,PW,4,'#5d8a3a');px(g,L0,99,PW,1,'#86b34c');for(let x=L0+2;x<L0+PW-2;x+=6)px(g,x,98,2,1,'#9cc55a');
 px(g,L0,104,PW,22,'#6d5a4b');for(let r=0;r<3;r++)for(let x=L0+(r%2)*8;x<L0+PW;x+=16){px(g,x,104+r*7,Math.min(15,L0+PW-x),6,r%2?'#7c6756':'#857060');px(g,x,104+r*7,Math.min(15,L0+PW-x),1,'#9a8470')}
 px(g,L0,126,PW,2,'#3a2d27');
 /* soft shadow strip under platform */
 g.fillStyle='rgba(0,0,0,.25)';g.fillRect(18,128,W-36,3);
 /* banner posts */
 [[26,'#b0413e'],[W-26,'#2f6f8f']].forEach(([x,col])=>{px(g,x,58,3,42,'#5a4130');px(g,x-1,56,5,3,'#d9a441');px(g,x+3,60,13,18,col);px(g,x+3,78,4,4,col);px(g,x+12,78,4,4,col);px(g,x+6,64,7,7,'#f3d27a');px(g,x+8,66,3,3,col)});
 /* braziers with warm light */
 [[52,'#d9a441'],[W-52,'#d9a441']].forEach(([x])=>{px(g,x,90,8,3,'#4a3528');px(g,x+1,93,6,6,'#5a4130');px(g,x+2,86,4,4,'#ffb347');px(g,x+3,84,2,2,'#ffe08a');g.fillStyle='rgba(255,180,80,.10)';g.beginPath();g.arc(x+4,90,18,0,7);g.fill()});
 /* tiny paw mark (PawPixl), bottom right */
 const pw=(x,y)=>{px(g,x+2,y+3,5,4,'#f3d27a');px(g,x,y+1,2,2,'#f3d27a');px(g,x+3,y,2,2,'#f3d27a');px(g,x+6,y,2,2,'#f3d27a');px(g,x+8,y+2,2,2,'#f3d27a')};g.globalAlpha=.55;pw(W-18,133);g.globalAlpha=1;
 return c}
/* the masked training dummy (original), standing on the right of the platform */
function drawDummy(g,x,y,hit,shake){x+=shake|0;const di=ART[hit?'dummyHit':'dummy'];const dd=di&&di.ok?di:ART.dummy;if(dd&&dd.ok){g.drawImage(dd.im,Math.round(x+10-dd.im.width/2),Math.round(y-dd.im.height));return}
 px(g,x-1,y-2,22,3,'rgba(0,0,0,.35)');
 px(g,x+9,y-14,3,14,'#6a4a33');px(g,x+4,y-3,13,3,'#5a3f2c');/* post + base */
 px(g,x+3,y-30,15,17,hit?'#fff3d6':'#c9a66b');px(g,x+3,y-30,15,2,hit?'#ffffff':'#ddbd82');px(g,x+3,y-15,15,2,'#a9854f');/* straw body */
 px(g,x-3,y-26,6,3,'#c9a66b');px(g,x+18,y-26,6,3,'#c9a66b');/* arms */
 px(g,x+2,y-23,17,2,'#8a5a3a');/* belt */
 px(g,x+5,y-41,11,11,hit?'#ffffff':'#e9e2d0');px(g,x+5,y-41,11,2,'#ffffff');/* mask */
 px(g,x+7,y-37,2,2,'#2b2238');px(g,x+12,y-37,2,2,'#2b2238');px(g,x+9,y-33,3,1,'#b0413e');/* face */
 px(g,x+4,y-43,13,3,'#b0413e');px(g,x+15,y-44,3,3,'#d9a441')/* headband */}
function token(g,img,x,y,s,el,ring){const r=s/2;g.save();g.beginPath();g.arc(x,y,r,0,7);g.closePath();g.clip();g.fillStyle=ELC[el]||'#888';g.fillRect(x-r,y-r,s,s);if(img)g.drawImage(img,x-r,y-r,s,s);g.restore();
 g.strokeStyle=ring?'#ffe08a':(ELC[el]||'#999');g.lineWidth=ring?2:1;g.beginPath();g.arc(x,y,r+.5,0,7);g.stroke()}
/* portraits are drawn small then scaled up, so they read as pixel art and stay crisp */
function pixImg(src){const o={ok:false};if(!src)return o;const im=new Image();im.onload=()=>{try{const c=document.createElement('canvas');c.width=c.height=24;const g=c.getContext('2d');g.imageSmoothingEnabled=true;g.drawImage(im,0,0,24,24);o.c=c;o.ok=true;if(A)A.draw()}catch(e){}};im.onerror=()=>{};im.src=src;return o}

/* ---------------- effects (one per kind of action; small and readable) ---------------- */
function fxFor(step){const el=step.el||'Physical',col=ELC[el]||'#fff',fx=step.fx||'orb';return{fx,col,el}}
function runFx(a,step,t){/* t: 0..1 through the step's animation */const g=a.g,{fx,col}=fxFor(step),me=a.me,dx=a.dx+10,dy=a.dy-26;
 const lerp=(p,q,k)=>p+(q-p)*k;
 if(fx==='shield'){const k=Math.min(1,t*3);g.globalAlpha=.25+.35*k;g.strokeStyle=col;g.lineWidth=1;for(let i=0;i<6;i++){const a0=i*Math.PI/3,a1=a0+Math.PI/3;g.beginPath();g.moveTo(me.x+Math.cos(a0)*16*k,me.y+Math.sin(a0)*16*k);g.lineTo(me.x+Math.cos(a1)*16*k,me.y+Math.sin(a1)*16*k);g.stroke()}g.globalAlpha=.12*k;g.fillStyle=col;g.beginPath();g.arc(me.x,me.y,15*k,0,7);g.fill();g.globalAlpha=1;return t>.4}
 if(fx==='field'){const k=Math.min(1,t*2.5);g.globalAlpha=.35*k;g.fillStyle=col;g.fillRect(me.x-26*k,me.y+9,52*k,3);g.globalAlpha=.8;for(let i=0;i<8;i++){const yy=me.y+8-((t*40+i*9)%30);px(g,me.x-20+i*5,yy,1,2,col)}g.globalAlpha=1;return false}
 if(fx==='arrows'){let hit=false;for(let i=0;i<4;i++){const k=Math.max(0,Math.min(1,(t-i*.12)*2.2));if(k<=0)continue;const x=lerp(me.x+8,dx,k),y=lerp(me.y-2,dy,k)-Math.sin(k*Math.PI)*14;if(k<1){px(g,x-1,y-1,3,3,col);px(g,x,y,1,1,'#fff7c2');px(g,x-4,y,3,1,'rgba(255,200,120,.6)')}else{hit=true;const s=(t-i*.12)*10%3;for(let j=0;j<6;j++){const an=j*1.05+i;px(g,dx+Math.cos(an)*(3+s*2),dy+Math.sin(an)*(3+s*2),1,1,j%2?'#fff1a8':col)}}}return hit}
 if(fx==='rain'){for(let i=0;i<3;i++){const an=t*9+i*2.1;const x=me.x+Math.cos(an)*13,y=me.y+Math.sin(an)*7-4;px(g,x,y-3,1,6,col);px(g,x-1,y-3,3,1,'#dff4ff')}if(t>.55){const k=(t-.55)/.45;for(let i=0;i<3;i++){const x=lerp(me.x,dx,k)+i*3,y=lerp(me.y-6,dy,k)+i*2;px(g,x,y,5,1,col)}return k>.95}return false}
 if(fx==='wind'){const k=Math.min(1,t*1.6);g.globalAlpha=.65;for(let i=0;i<14;i++){const yy=dy+30-((t*90+i*7)%60);const w=2+((i*3)%4);px(g,dx-6+Math.sin(t*12+i)*6,yy,w,1,col)}g.globalAlpha=.25*k;g.fillStyle=col;g.fillRect(dx-5,dy-34,10,64);g.globalAlpha=1;return t>.35}
 if(fx==='plunge'){/* the leap itself is placed by plungePos; here the landing ring */if(t>=.75){const r=(t-.75)*80;g.strokeStyle=col;g.globalAlpha=Math.max(0,1-(t-.75)*4);g.beginPath();g.ellipse(dx,a.dy-2,r,r/3,0,0,7);g.stroke();g.globalAlpha=1;for(let i=0;i<8;i++)px(g,dx-12+i*3,a.dy-6-((t*60+i*5)%14),1,2,col);return true}return false}
 if(fx==='bolt'){const hit=t>.3;if(t<.9){const bx=dx-14,by=dy-34;px(g,bx-2,by,5,2,col);px(g,bx-1,by-1,3,1,'#f0d4ff');/* a small purple bird-like spark hovering */
   if(hit&&Math.floor(t*14)%2===0){g.strokeStyle=col;g.lineWidth=1;g.beginPath();let x=bx,y=by+2;g.moveTo(x,y);for(let i=0;i<5;i++){x+=(i%2?3:-1);y+=6;g.lineTo(x,y)}g.stroke()}}return hit}
 if(fx==='arc'){const k=Math.min(1,t*2);g.strokeStyle=col;g.lineWidth=2;g.globalAlpha=1-Math.max(0,(t-.6)*2.5);g.beginPath();g.arc(dx-6,dy+4,16,-1.9,-1.9+2.6*k);g.stroke();g.globalAlpha=1;for(let i=0;i<5;i++)px(g,dx-6+Math.cos(-1.9+2.6*k)*16+i,dy+4+Math.sin(-1.9+2.6*k)*16,1,1,'#ffffff');return k>=1}
 if(fx==='stack'){const n=Math.min(step.stacks||6,Math.floor(t*((step.stacks||6)+1)));const sx=dx-3,sy=dy-38;px(g,sx,sy-14,3,14,'#dfe9ff');px(g,sx-2,sy,7,2,'#a8c4ff');px(g,sx+1,sy+2,1,3,'#a8c4ff');for(let i=0;i<n;i++)px(g,sx-8+i*3,sy+6,2,2,col);return t>.2}
 if(fx==='detonate'){if(t<.45){const k=t/.45;const x=dx-3,y=lerp(-16,dy-8,k*k);px(g,x,y-14,4,14,'#f4f7ff');px(g,x-3,y,10,2,'#a8c4ff');return false}const k=(t-.45)/.55;a.shake=(1-k)*3*(Math.sin(t*90)>0?1:-1);g.globalAlpha=Math.max(0,1-k);g.fillStyle='#ffffff';g.beginPath();g.arc(dx,dy,6+k*26,0,7);g.fill();g.strokeStyle=col;g.beginPath();g.arc(dx,dy,10+k*32,0,7);g.stroke();g.globalAlpha=1;return true}
 /* default: a small element orb to the dummy */
 const k=Math.min(1,t*1.8),x=lerp(me.x+8,dx,k),y=lerp(me.y-2,dy,k);if(k<1){px(g,x-2,y-2,4,4,col);px(g,x-1,y-1,2,2,'#ffffff')}return k>=1}

/* ---------------- the page ---------------- */
function mount(root,host){if(A&&A.stop)A.stop();const cfg=host.cfg||{},chars=(cfg.chars||[]).filter(c=>c&&c.on&&c.ready&&!c.hold&&c.id),d=host.game||{};
 const roster=new Map((d.roster||[]).map(r=>[r.id,r])),norm=s=>String(s||'').toLowerCase().replace(/[^a-z0-9]/g,'');
 const iconOf=n=>{const r=roster.get(norm(n))||[...roster.values()].find(x=>norm(x.name)===norm(n));return r&&r.icon?'/'+r.icon:''};
 const guideOf=id=>{const b=((d.posts||{}).builds||{})[id];return b&&(b.versions||[]).length?'/'+(host.gid||'genshin')+'/builds/'+id:''};
 const q=new URLSearchParams(location.search);const st={c:null,i:'f2p',t:0,view:'pick',step:-1,playing:false,done:false,seen:new Set()};
 const C=()=>chars.find(c=>c.id===st.c);const T=()=>{const c=C();return c&&((c.teams||[])[st.t]||(c.teams||[])[0])};const I=()=>{const c=C();return c&&c.inv&&c.inv[st.i]};
 if(q.get('c')&&chars.some(c=>c.id===q.get('c'))){st.c=q.get('c');if(INV.some(x=>x[0]===q.get('i')))st.i=q.get('i');const t=+q.get('t');if(t>=0&&C().teams&&C().teams[t])st.t=t;/* a shared setup opens on the team; “Test This Build” (character only) opens on investment */st.view=q.get('i')?'team':'inv'}
 const ev0=st.c?'char:'+st.c:'';
 const ev=n=>{try{host.ev&&host.ev(n)}catch(e){}};ev('open');if(ev0)ev(ev0);
 const url=(abs)=>{const s=st.c?'?c='+encodeURIComponent(st.c)+'&i='+st.i+'&t='+st.t:'';return(abs?String(host.base||location.origin).replace(/\/+$/,''):'')+'/arena'+s};
 const syncUrl=()=>{try{history.replaceState(null,'',url(false)+(host.preview?(st.c?'&':'?')+'preview=arena':''))}catch(e){}};
 if(!chars.length){root.innerHTML='<div class="panel empty ar-empty"><b>The training grounds are being set up</b>Check back soon!</div>';return}
 const steps=['Character','Investment','Team','Arena','Results'],vi={pick:0,inv:1,team:2,arena:3,done:4};
 function head(){return'<ol class="ar-steps" aria-label="Progress">'+steps.map((s,i)=>'<li'+(i===vi[st.view]?' aria-current="step"':'')+(i<vi[st.view]?' class="ok"':'')+'><span>'+(i+1)+'</span>'+s+'</li>').join('')+'</ol>'}
 function elChip(el){return'<span class="ar-el" style="--c:'+(ELC[el]||'#999')+'">'+esc(el)+'</span>'}
 function invTabs(){return'<div class="ar-seg" role="radiogroup" aria-label="Investment">'+INV.map(([k,l])=>'<button type="button" role="radio" aria-checked="'+(st.i===k)+'" data-inv="'+k+'">'+l+'</button>').join('')+'</div>'}
 function loadout(v,c,full){if(!v)return'<p class="muted">No loadout saved for this level yet.</p>';const a=v.art||{};
  const rows=[['Weapon',esc(v.weapon)+(v.refine?' · R'+esc(v.refine):'')+(v.weaponNote?'<small>'+esc(v.weaponNote)+'</small>':'')],['Constellation',esc(v.cons||'C0')],['Talents',esc(v.talents||'')+'<small>Normal Attack / Skill / Burst</small>'],['Level',esc(v.level||'90')+(v.wlevel?' · weapon '+esc(v.wlevel):'')],['Artifacts',esc((a.pcs?a.pcs+' ':'')+(a.set||''))+(a.main?'<small>Main stats: '+esc(a.main)+'</small>':'')+(a.subs?'<small>'+esc(a.subs)+'</small>':'')]];
  if(full)rows.push(['Teammates',(v.mates||[]).map(m=>'<div><b>'+esc(m.name)+'</b> '+esc(m.note)+'</div>').join('')||'Same as the team list'],['Good to know',(v.pros||[]).map(x=>'<div>+ '+esc(x)+'</div>').join('')+(v.trade||[]).map(x=>'<div>– '+esc(x)+'</div>').join('')]);
  return'<dl class="ar-lo">'+rows.map(r=>'<dt>'+r[0]+'</dt><dd>'+r[1]+'</dd>').join('')+'</dl>'}
 const tip='<p class="ar-note">Damage simulation coming later. Guided rotation available now.</p>';
 /* ---- 1 character ---- */
 function vPick(){return head()+'<h2 class="ar-h">Choose a character</h2><div class="ar-picks">'+chars.map(c=>'<button type="button" class="ar-pick" data-c="'+esc(c.id)+'" style="--c:'+(ELC[c.el]||'#999')+'">'+'<span class="ar-pi"><i class="ar-ph" aria-hidden="true">'+esc(String(c.name)[0])+'</i>'+(iconOf(c.name)?'<img src="'+esc(iconOf(c.name))+'" alt="" width="72" height="72" loading="lazy" onerror="this.remove()">':'')+'</span>'+'<b>'+esc(c.name)+'</b><span class="ar-meta">'+elChip(c.el)+' '+esc(c.weapon)+'</span><span class="ar-play">'+esc(c.play)+'</span><span class="ar-desc">'+esc(c.desc)+'</span></button>').join('')+'</div>'}
 /* ---- 2 investment ---- */
 function vInv(){const c=C();return head()+'<h2 class="ar-h">'+esc(c.name)+': pick an investment level</h2><p class="muted ar-sub">Each level is a real loadout you can check, not a hidden bonus.</p><div class="ar-invs">'+INV.map(([k,l])=>'<label class="ar-inv'+(st.i===k?' on':'')+'"><input type="radio" name="arinv" value="'+k+'"'+(st.i===k?' checked':'')+'><b>'+l+'</b>'+loadout(c.inv&&c.inv[k],c,false)+'</label>').join('')+'</div>'
  +'<details class="ar-more"><summary>See the full '+esc(INV.find(x=>x[0]===st.i)[1])+' loadout</summary>'+loadout(I(),c,true)+'</details>'+compare(c)
  +'<div class="ar-nav"><button type="button" class="btn ghost" data-go="pick">Back</button><button type="button" class="btn" data-go="team">Review team</button></div>'}
 function compare(c){const L=INV.map(([k])=>c.inv&&c.inv[k]||{});const r=(lab,f)=>'<tr><th scope="row">'+lab+'</th>'+L.map(v=>'<td>'+f(v)+'</td>').join('')+'</tr>';
  return'<details class="ar-more"><summary>Compare F2P, Mid and High</summary><div class="ar-tw"><table class="ar-cmp"><thead><tr><th></th>'+INV.map(x=>'<th scope="col">'+x[1]+'</th>').join('')+'</tr></thead><tbody>'
   +r('Weapon',v=>esc(v.weapon||'')+(v.refine?' R'+esc(v.refine):''))+r('Constellation',v=>esc(v.cons||''))+r('Talents',v=>esc(v.talents||''))+r('Artifacts',v=>esc(((v.art||{}).pcs||'')+' '+((v.art||{}).set||''))+((v.art||{}).subs?'<small>'+esc(v.art.subs)+'</small>':''))
   +r('Teammates',v=>(v.mates||[]).map(m=>esc(m.name+': '+m.note)).join('<br>'))+r('Advantages',v=>(v.pros||[]).map(esc).join('<br>'))+r('Tradeoffs',v=>(v.trade||[]).map(esc).join('<br>'))+'</tbody></table></div><p class="ar-note">Damage comparisons appear only once a validated damage simulation supports these setups.</p></details>'}
 /* ---- 3 team ---- */
 function vTeam(){const c=C(),t=T(),v=I()||{};const mate=n=>(v.mates||[]).find(m=>norm(m.name)===norm(n));
  return head()+'<h2 class="ar-h">'+esc(t?t.name:'Team')+'</h2><p class="muted ar-sub">'+esc(c.name)+' · '+esc(INV.find(x=>x[0]===st.i)[1])+' <button type="button" class="ar-link" data-go="inv">change</button></p>'
   +((c.teams||[]).length>1?'<div class="ar-seg" role="radiogroup" aria-label="Team">'+c.teams.map((x,i)=>'<button type="button" role="radio" aria-checked="'+(i===st.t)+'" data-team="'+i+'">'+esc(x.name)+'</button>').join('')+'</div>':'')
   +'<div class="ar-team">'+(t?t.members:[]).map(m=>{const mm=mate(m.name);return'<div class="ar-mem" style="--c:'+(ELC[m.el]||'#999')+'">'+'<span class="ar-pi sm"><i class="ar-ph" aria-hidden="true">'+esc(String(m.name)[0])+'</i>'+(iconOf(m.name)?'<img src="'+esc(iconOf(m.name))+'" alt="" width="56" height="56" loading="lazy" onerror="this.remove()">':'')+'</span>'+'<div><b>'+esc(m.name)+'</b><span class="ar-meta">'+elChip(m.el)+' '+esc(m.role)+'</span><p>'+esc(m.does)+'</p>'+(mm?'<p class="ar-gear">'+esc(INV.find(x=>x[0]===st.i)[1])+': '+esc(mm.note)+'</p>':'')+'</div></div>'}).join('')+'</div>'
   +(t&&t.note?'<p class="ar-tnote"><b>Good to know:</b> '+esc(t.note)+'</p>':'')
   +'<div class="ar-nav"><button type="button" class="btn ghost" data-go="inv">Back</button><button type="button" class="btn" data-go="arena">Enter the Arena</button></div>'}
 /* ---- 4 arena ---- */
 function vArena(){const c=C(),t=T(),R=(t&&t.rotation)||[];return head()+'<div class="ar-top"><h2 class="ar-h">'+esc(t?t.name:'')+'</h2>'+invTabs()+'</div>'
  +'<div class="ar-stage"><div class="ar-scene"><canvas width="'+W+'" height="'+H+'" aria-hidden="true"></canvas><div class="ar-cap" aria-hidden="true"></div><div class="ar-rx" aria-hidden="true"></div><div class="ar-dl">Training Dummy · Lv. 90</div></div>'
  +'<div class="ar-panel"><div class="ar-prog"><i style="width:0"></i></div><div class="ar-now" aria-live="polite"></div>'
  +'<div class="ar-ctl"><button type="button" class="btn ghost" data-k="prev" aria-label="Previous step">◀</button><button type="button" class="btn" data-k="play">Play rotation</button><button type="button" class="btn ghost" data-k="next" aria-label="Next step">▶</button><button type="button" class="btn ghost" data-k="restart">Restart</button></div>'
  +'<ol class="ar-list">'+R.map((s,i)=>'<li><button type="button" data-s="'+i+'"><span class="ar-dot" style="--c:'+(ELC[s.el]||'#999')+'"></span><b>'+esc(s.who)+'</b> '+esc(s.act)+'</button></li>').join('')+'</ol>'
  +'<details class="ar-more"><summary>'+esc(INV.find(x=>x[0]===st.i)[1])+' loadout</summary>'+loadout(I(),c,true)+'</details>'+tip+'<p class="ar-note">A simplified teaching sequence, not a frame-perfect rotation. The same steps are shown at every investment level; the gear changes.</p></div></div>'}
 /* ---- 5 results ---- */
 function vDone(){const c=C(),t=T(),R=(t&&t.rotation)||[],rx=[...new Set(R.map(s=>s.react).filter(Boolean))],g=guideOf(c.id);
  return head()+'<div class="ar-done"><div class="ar-burst" aria-hidden="true"></div>'+((cfg.art||{}).complete?'<img class="ar-cimg" src="/'+esc(String(cfg.art.complete).replace(/^\/+/,''))+'" alt="" onerror="this.remove()">':'')+'<h2 class="disp">Training Complete!</h2><p class="muted">Nice work: you watched the whole '+esc(c.name)+' rotation.</p>'
   +'<dl class="ar-lo ar-sum"><dt>Character</dt><dd>'+esc(c.name)+'</dd><dt>Investment</dt><dd>'+esc(INV.find(x=>x[0]===st.i)[1])+' <small>'+esc((I()||{}).weapon||'')+'</small></dd><dt>Team</dt><dd>'+esc(t?t.members.map(m=>m.name).join(', '):'')+'</dd>'
   +'<dt>Actions</dt><dd>'+R.length+' steps, all shown<small>'+R.map(s=>esc(s.who+': '+s.act)).join(' · ')+'</small></dd><dt>Reactions shown</dt><dd>'+(rx.length?rx.map(x=>'<span class="ar-el" style="--c:'+(RXC[x]||'#fff')+'">'+esc(x)+'</span>').join(' '):'None in this rotation')+'</dd><dt>Damage</dt><dd>Damage simulation coming later. Guided rotation available now.</dd></dl>'
   +(t&&t.lesson?'<div class="ar-lesson"><b>The main idea</b><p>'+esc(t.lesson)+'</p></div>':'')
   +'<div class="ar-nav ar-wrap"><button type="button" class="btn" data-go="again">Try Again</button><button type="button" class="btn ghost" data-go="inv">Change Investment</button><button type="button" class="btn ghost" data-go="pick">Choose Another Character</button>'+(g?'<a class="btn ghost" href="'+esc(g)+'" data-link data-guide>View Full Build Guide</a>':'<span class="ar-soon">'+esc(c.name)+'’s full build guide is coming soon</span>')+'</div>'
   +'<div class="ar-share"><button type="button" class="btn ghost" data-k="share">Share My Training Setup</button><div class="ar-shout" hidden></div></div></div>'}
 function render(){A&&A.stop&&A.stop();root.innerHTML='<div class="ar-app">'+({pick:vPick,inv:vInv,team:vTeam,arena:vArena,done:vDone}[st.view]||vPick)()+'</div>';syncUrl();if(st.view==='arena')stage();const h=root.querySelector('.ar-h,.disp');if(h&&render.moved){h.setAttribute('tabindex','-1');h.focus({preventScroll:false})}render.moved=true}
 /* ---- the stage ---- */
 function stage(){const t=T(),R=(t&&t.rotation)||[],cv=root.querySelector('canvas');if(!cv||!cv.getContext){return}
  const g=cv.getContext('2d');let bg=null;const imgs={};(t?t.members:[]).forEach(m=>{const s=iconOf(m.name);imgs[m.name]=pixImg(s)});
  loadArt((host.cfg||{}).art);const a={g,me:{x:64,y:88},dx:178,dy:100,meX:null,meY:null,shake:0,raf:0,t0:0,cur:null,timer:0};A=a;a.redraw=()=>{bg=drawGround();a.draw(null)};
  /* bigger screens: whole-number pixel scaling, with the scene widened to fill the frame; phones: the 256-wide scene fills the width */
  const fit=()=>{const box=cv.parentNode.clientWidth||W;const k=Math.floor(box/256);const lw=k>=2?Math.min(400,Math.floor(box/k)):256;W=lw;cv.width=lw;cv.height=H;cv.style.width=(k>=2?lw*k:box)+'px';cv.style.aspectRatio=lw+'/'+H;g.imageSmoothingEnabled=false;bg=drawGround();a.me.x=Math.round(lw*.25);a.dx=Math.round(lw*.68);if(a.draw)a.draw(null)};fit();
  const cap=root.querySelector('.ar-cap'),rxEl=root.querySelector('.ar-rx'),now=root.querySelector('.ar-now'),prog=root.querySelector('.ar-prog i'),play=root.querySelector('[data-k="play"]');
  const who=i=>{const s=R[i];return s?((t.members||[]).find(m=>norm(m.name)===norm(s.who))||{name:s.who,el:s.el}):null};
  a.draw=(k)=>{g.clearRect(0,0,W,H);g.drawImage(bg,0,0);const s=R[st.step];a.meX=null;a.meY=null;const hit=s&&k!=null?runFxPre(s,k):false;
   /* bench: the four team members along the bottom; the active one steps forward */
   (t.members||[]).forEach((m,i)=>{const act=s&&norm(m.name)===norm(s.who);if(act)return;const im=imgs[m.name];token(g,im&&im.ok?im.c:null,24+i*14,136,10,m.el,false)});
   drawDummy(g,a.dx,a.dy,hit&&k!=null&&k<.95,a.shake);a.shake=0;{const ik=s&&k!=null&&hit&&k<.9&&ART[(s.el||'').toLowerCase()+'Impact'];if(ik&&ik.ok)g.drawImage(ik.im,Math.round(a.dx+10-ik.im.width/2),Math.round(a.dy-26-ik.im.height/2))}
   if(s&&s.aura&&k!=null&&k>.5&&!s.react){g.fillStyle=ELC[s.aura]||'#fff';g.fillRect(a.dx+9,a.dy-50,3,3)}
   if(s){const m=who(st.step),im=imgs[m.name];const ent=k==null?1:Math.min(1,k*4);const x=a.meX!=null?a.meX:a.me.x-18+18*ent,y=a.meY!=null?a.meY:a.me.y;g.fillStyle='rgba(0,0,0,.35)';g.fillRect(a.me.x-8,a.me.y+10,16,2);token(g,im&&im.ok?im.c:null,x,y,20,m.el,true);if(k!=null)runFx(a,s,k)}
   else{const m=(t.members||[])[0];if(m){const im=imgs[m.name];token(g,im&&im.ok?im.c:null,a.me.x,a.me.y,20,m.el,true)}}};
  function runFxPre(s,k){if(s.fx==='plunge'){/* the token leaps up out of view, then crashes down onto the dummy */if(k<.35){a.meX=a.me.x;a.meY=a.me.y-k/.35*100}else if(k<.45){a.meX=a.dx+10;a.meY=-20}else{const d=Math.min(1,(k-.45)/.3);a.meX=a.dx+10;a.meY=-12+(a.dy-14+12)*d}return k>.75}return k>.5}
  const show=(i,animate)=>{cancelAnimationFrame(a.raf);clearTimeout(a.timer);st.step=i;const s=R[i];if(s&&!st.started){st.started=true;ev('start')}
   root.querySelectorAll('.ar-list button').forEach((b,j)=>{b.classList.toggle('on',j===i);b.classList.toggle('ok',j<i);if(j===i)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current')});
   prog.style.width=(R.length?((i+1)/R.length*100):0)+'%';rxEl.className='ar-rx';rxEl.textContent='';
   if(!s){cap.textContent='';now.innerHTML='<p class="ar-hint">Press <b>Play rotation</b>, or step through it with ▶. Each step shows who acts and why it matters.</p>';a.draw(null);return}
   const m=who(i);cap.innerHTML='<b>'+esc(s.who)+'</b> · '+esc(s.act);
   now.innerHTML='<div class="ar-act" style="--c:'+(ELC[s.el]||'#999')+'"><span class="ar-n">Step '+(i+1)+' of '+R.length+'</span><h3>'+esc(s.who)+' <small>'+esc(s.act)+(s.name?' · '+esc(s.name):'')+'</small></h3><p class="ar-meta">'+elChip(s.el)+(s.react?' <span class="ar-el" style="--c:'+(RXC[s.react]||'#fff')+'">'+esc(s.react)+'</span>':'')+'</p>'+(s.what?'<p>'+esc(s.what)+'</p>':'')+'<p class="ar-why"><b>Why it matters:</b> '+esc(s.why)+'</p></div>';
   const pop=()=>{if(s.react){rxEl.textContent=s.react+'!';rxEl.style.setProperty('--c',RXC[s.react]||'#fff');rxEl.className='ar-rx on'}};
   if(!animate||reduced()){a.draw(.999);pop();return}
   const dur=Math.max(1400,+s.ms||1900);a.t0=performance.now();let popped=false;
   const tick=tt=>{const k=Math.min(1,(tt-a.t0)/dur);a.draw(k);if(!popped&&k>.6){pop();popped=true}if(k<1)a.raf=requestAnimationFrame(tick);else a.draw(.999)};a.raf=requestAnimationFrame(tick)};
  const finish=()=>{st.playing=false;if(!st.done){st.done=true;ev('done')}st.view='done';ev('results');render()};
  const auto=()=>{if(!st.playing)return;const n=st.step+1;if(n>=R.length){a.timer=setTimeout(finish,900);return}show(n,true);const s=R[n];a.timer=setTimeout(auto,(reduced()?3800:Math.max(1400,+s.ms||1900)+1700))};
  const setPlay=p=>{st.playing=p;play.textContent=p?'Pause':(st.step>=R.length-1&&st.step>=0?'See results':st.step>=0?'Resume':'Play rotation');play.setAttribute('aria-pressed',String(p))};
  a.stop=()=>{st.playing=false;cancelAnimationFrame(a.raf);clearTimeout(a.timer);removeEventListener('resize',fit)};addEventListener('resize',fit);
  root.querySelector('.ar-panel').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const k=b.dataset.k;
   if(k==='play'){if(st.playing){setPlay(false);clearTimeout(a.timer);return}if(st.step>=R.length-1&&st.step>=0){finish();return}setPlay(true);auto()}
   else if(k==='next'){setPlay(false);if(st.step>=R.length-1){finish();return}show(st.step+1,true);setPlay(false)}
   else if(k==='prev'){setPlay(false);show(Math.max(-1,st.step-1),true);setPlay(false)}
   else if(k==='restart'){setPlay(false);show(-1,false);setPlay(false)}
   else if(b.dataset.s!=null){setPlay(false);show(+b.dataset.s,true);setPlay(false)}});
  root.querySelector('.ar-scene').addEventListener('click',()=>play.click());
  show(st.step>=0&&st.step<R.length?st.step:-1,false);setPlay(false)}
 /* ---- clicks ---- */
 root.onclick=async e=>{const b=e.target.closest('[data-c],[data-go],[data-inv],[data-team],[data-k="share"],[data-guide]');if(!b)return;
  if(b.dataset.guide!=null){ev('guide');return}
  if(b.dataset.c){st.c=b.dataset.c;st.t=0;st.step=-1;st.done=false;ev('char:'+st.c);st.view='inv';render();return}
  if(b.dataset.inv){st.i=b.dataset.inv;ev('inv:'+st.i);if(st.view==='arena'){const keep=st.step;render();}else render();return}
  if(b.dataset.team!=null){st.t=+b.dataset.team;st.step=-1;render();return}
  if(b.dataset.go){const g=b.dataset.go;if(g==='again'){st.view='arena';st.step=-1;st.done=false;render();return}if(g==='arena'){st.step=-1}st.view=g;render();return}
  if(b.dataset.k==='share'){ev('share');const c=C(),u=url(true),txt='Testing '+c.name+'’s '+INV.find(x=>x[0]===st.i)[1]+' team in the PawPixl Arena! Try the training grounds at '+String(host.base||location.origin).replace(/^https?:\/\//,'').replace(/\/+$/,'')+'/arena';
   const out=root.querySelector('.ar-shout');try{if(navigator.share){await navigator.share({title:'PawPixl Arena',text:txt,url:u});return}}catch(x){if(x&&x.name==='AbortError')return}
   let ok=false;try{await navigator.clipboard.writeText(txt+'\n'+u);ok=true}catch(x){}out.hidden=false;out.innerHTML=(ok?'<p><b>Copied!</b> Paste it anywhere.</p>':'<p>Copy this:</p>')+'<textarea readonly rows="3" aria-label="Share text">'+esc(txt+'\n'+u)+'</textarea>';const ta=out.querySelector('textarea');if(!ok){ta.focus();ta.select()}}};
 root.onchange=e=>{if(e.target.name==='arinv'){st.i=e.target.value;ev('inv:'+st.i);render()}};
 render.moved=false;render()}
window.PPArena={mount,stop:()=>{if(A&&A.stop)A.stop()}};
})();
