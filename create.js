/* PawPixl graphic creator (update 4).
   Makes shareable pictures from what a player saved in My Roster and My Teams: a build card, a team card, a roster
   showcase and a before/after "glow-up". Everything is drawn in this browser on a canvas. Nothing is uploaded, no
   account is needed, and no account details (name, email, UID) are ever read here.
   The picture on screen IS the export: the same canvas is shown scaled down and downloaded at full size.
   Only facts the player saved or PawPixl's own guides state are drawn. No damage numbers are estimated. */
(function(){
'use strict';
const FMT={v:[1080,1920,'Vertical','1080 × 1920'],s:[1080,1080,'Square','1080 × 1080'],l:[1920,1080,'Landscape','1920 × 1080']};
const MAINN={er:'Energy Recharge',cr:'CRIT Rate',cd:'CRIT DMG',em:'Elemental Mastery',heal:'Healing Bonus',phys:'Physical DMG',el:'Elemental DMG',hp_:'HP %',atk_:'ATK %',def_:'DEF %'};
const SUBN=[['cr','CRIT Rate','%'],['cd','CRIT DMG','%'],['er','Energy Recharge','%'],['em','Elemental Mastery',''],['atk_','ATK','%'],['hp_','HP','%'],['def_','DEF','%'],['atk','Flat ATK',''],['hp','Flat HP',''],['def','Flat DEF','']];
const TEAL='#19d3b5',GOLD='#f2c45a',INK='#f3f5fb',MUT='rgba(232,236,248,.66)',BODY='Poppins, "Noto Sans", system-ui, -apple-system, "Segoe UI", sans-serif',DISP='Anton, Poppins, system-ui, sans-serif';
const IMG=new Map();let IM=new Map(); /* pictures already loaded for the card being drawn, by address */
function loadImg(src){if(!src)return Promise.resolve(null);if(IMG.has(src))return IMG.get(src);const p=new Promise(res=>{const i=new Image();i.decoding='async';i.onload=()=>res(i);i.onerror=()=>res(null);i.src=src});IMG.set(src,p);return p}
/* ---------- drawing helpers ---------- */
const F=(c,w,px,fam)=>{c.font=w+' '+Math.max(8,Math.round(px))+'px '+(fam||BODY)};
function rr(c,x,y,w,h,r){r=Math.min(r,w/2,h/2);c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()}
function ell(c,t,maxW){t=String(t==null?'':t);if(c.measureText(t).width<=maxW)return t;let lo=0,hi=t.length;while(lo<hi){const m=(lo+hi+1)>>1;if(c.measureText(t.slice(0,m).trimEnd()+'…').width<=maxW)lo=m;else hi=m-1}return lo?t.slice(0,lo).trimEnd()+'…':'…'}
/* largest size between max and min at which the text fits on one line; below min it is cut with an ellipsis */
function fit(c,t,maxW,max,min,w,fam){let px=max;for(;px>min;px-=2){F(c,w,px,fam);if(c.measureText(t).width<=maxW)return{px,t}}F(c,w,min,fam);return{px:min,t:ell(c,t,maxW)}}
function wrap(c,t,maxW,maxLines){const out=[];String(t||'').split(/\n/).forEach(par=>{const words=par.split(/\s+/).filter(Boolean);let line='';
  const push=l=>out.push(l);words.forEach(w=>{const tryL=line?line+' '+w:w;if(c.measureText(tryL).width<=maxW){line=tryL;return}if(line)push(line);if(c.measureText(w).width<=maxW){line=w;return}
   /* one word wider than the line (long names, languages without spaces): break it by characters */
   let cur='';for(const ch of w){if(c.measureText(cur+ch).width>maxW&&cur){push(cur);cur=ch}else cur+=ch}line=cur});if(line)push(line)});
 if(maxLines&&out.length>maxLines){const keep=out.slice(0,maxLines);keep[maxLines-1]=ell(c,keep[maxLines-1]+' …',maxW);return keep}return out}
function portrait(c,img,x,y,sz,cols,opt){opt=opt||{};const r=sz*.2;c.save();rr(c,x,y,sz,sz,r);const g=c.createLinearGradient(x,y,x+sz,y+sz);g.addColorStop(0,mix(cols[0],'#0b0e1a',.45));g.addColorStop(1,mix(cols[1],'#0b0e1a',.68));c.fillStyle=g;c.fill();c.clip();
 if(img){const k=Math.max(sz/img.width,sz/img.height),w=img.width*k,h=img.height*k;c.imageSmoothingQuality='high';c.drawImage(img,x+(sz-w)/2,y+(sz-h)/2,w,h)}
 else{F(c,400,sz*.5,DISP);c.fillStyle='rgba(255,255,255,.85)';c.textAlign='center';c.textBaseline='middle';c.fillText(String(opt.letter||'?').slice(0,1).toUpperCase(),x+sz/2,y+sz/2+sz*.03)}
 c.restore();c.save();rr(c,x+1.5,y+1.5,sz-3,sz-3,r);c.lineWidth=Math.max(2,sz*.016);const b=c.createLinearGradient(x,y,x+sz,y+sz);b.addColorStop(0,cols[1]);b.addColorStop(1,cols[0]);c.strokeStyle=b;c.globalAlpha=.9;c.stroke();c.restore();
 if(opt.badge){F(c,800,sz*.15,BODY);const tw=c.measureText(opt.badge).width,bw=tw+sz*.12,bh=sz*.22,bx=x+sz-bw-sz*.045,by=y+sz-bh-sz*.045;rr(c,bx,by,bw,bh,bh*.35);c.fillStyle='rgba(8,10,20,.86)';c.fill();c.fillStyle='#fff';c.textAlign='center';c.textBaseline='middle';c.fillText(opt.badge,bx+bw/2,by+bh/2+1)}
 if(opt.star){F(c,700,sz*.17,BODY);c.fillStyle=GOLD;c.textAlign='left';c.textBaseline='top';c.fillText('★',x+sz*.06,y+sz*.04)}}
function hex(h){h=h.replace('#','');if(h.length===3)h=h.split('').map(x=>x+x).join('');return[0,2,4].map(i=>parseInt(h.slice(i,i+2),16))}
function mix(a,b,t){const A=hex(a),B=hex(b);return'rgb('+A.map((v,i)=>Math.round(v+(B[i]-v)*t)).join(',')+')'}
const rgba=(h,a)=>{const A=hex(h);return'rgba('+A.join(',')+','+a+')'};
function backdrop(c,W,H,cols){c.fillStyle='#090c17';c.fillRect(0,0,W,H);const R=Math.max(W,H);
 let g=c.createRadialGradient(W*.12,H*.02,0,W*.12,H*.02,R*.75);g.addColorStop(0,rgba(cols[0],.36));g.addColorStop(1,rgba(cols[0],0));c.fillStyle=g;c.fillRect(0,0,W,H);
 g=c.createRadialGradient(W*.95,H*.98,0,W*.95,H*.98,R*.7);g.addColorStop(0,rgba(cols[1],.2));g.addColorStop(1,rgba(cols[1],0));c.fillStyle=g;c.fillRect(0,0,W,H);
 c.save();c.strokeStyle=rgba(cols[1],.09);c.lineWidth=2;[.32,.46,.6].forEach(k=>{c.beginPath();c.arc(W*.92,H*.06,R*k,0,Math.PI*2);c.stroke()});c.restore();
 g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,cols[0]);g.addColorStop(1,cols[1]);c.fillStyle=g;c.fillRect(0,0,W,8)}
function brand(c,W,H,M,tag){c.textBaseline='alphabetic';c.textAlign='left';F(c,400,34,DISP);const g=c.createLinearGradient(M,0,M+190,0);g.addColorStop(0,TEAL);g.addColorStop(1,GOLD);c.fillStyle=g;c.save();try{c.letterSpacing='3px'}catch(e){}c.fillText('PAWPIXL',M,M+30);c.restore();
 if(tag){F(c,600,22,BODY);c.fillStyle=MUT;c.textAlign='right';c.fillText(ell(c,tag,W-2*M-230),W-M,M+27)}
 F(c,600,23,BODY);c.fillStyle='rgba(232,236,248,.6)';c.textAlign='center';c.fillText('pawpixl.com',W/2,H-M+8)}
/* ---------- blocks: each returns {h, draw(x,y)} for a given width and scale ---------- */
function panel(c,title,inner,accent){return(w,s)=>{const p=30*s,th=title?34*s:0,body=inner(w-2*p,s);return{h:p+th+body.h+p,draw(x,y){rr(c,x,y,w,this.h,22*s);c.fillStyle='rgba(255,255,255,.05)';c.fill();c.lineWidth=1.5;c.strokeStyle='rgba(255,255,255,.1)';c.stroke();
   if(title){F(c,800,17*s,BODY);c.fillStyle=accent;c.textAlign='left';c.textBaseline='top';c.save();try{c.letterSpacing=(2.2*s)+'px'}catch(e){}c.fillText(title.toUpperCase(),x+p,y+p-2*s);c.restore()}body.draw(x+p,y+p+th)}}}}
function kv(c,rows){return(w,s)=>{const lh=44*s;return{h:rows.length*lh-8*s,draw(x,y){rows.forEach((r,i)=>{const yy=y+i*lh;F(c,600,21*s,BODY);c.fillStyle=MUT;c.textAlign='left';c.textBaseline='top';c.fillText(r[0],x,yy+4*s);const lw=c.measureText(r[0]).width+18*s;
    const f=fit(c,String(r[1]),w-lw,27*s,17*s,700,BODY);c.fillStyle=r[2]||INK;c.textAlign='right';c.fillText(f.t,x+w,yy+(27*s-f.px)/2)})}}}}
function tiles(c,list,per,accent){return(w,s)=>{const g=12*s,n=Math.min(per,list.length)||1,tw=(w-g*(n-1))/n,th=96*s,rows=Math.ceil(list.length/n);return{h:rows*th+(rows-1)*g,draw(x,y){list.forEach((t,i)=>{const tx=x+(i%n)*(tw+g),ty=y+Math.floor(i/n)*(th+g);rr(c,tx,ty,tw,th,16*s);c.fillStyle='rgba(8,10,20,.5)';c.fill();c.lineWidth=1.5;c.strokeStyle=t.hi?rgba(accent,.7):'rgba(255,255,255,.08)';c.stroke();
    const f=fit(c,String(t.v),tw-20*s,36*s,20*s,800,BODY);c.fillStyle=t.col||INK;c.textAlign='center';c.textBaseline='top';c.fillText(f.t,tx+tw/2,ty+14*s+(36*s-f.px)/2);F(c,600,16*s,BODY);c.fillStyle=MUT;c.fillText(ell(c,t.l,tw-14*s),tx+tw/2,ty+62*s);
    if(t.sub){F(c,700,14*s,BODY);c.fillStyle=t.subc||MUT;c.fillText(ell(c,t.sub,tw-14*s),tx+tw/2,ty+th-20*s+2)}})}}}}
function para(c,text,px,col,maxLines,weight){return(w,s)=>{F(c,weight||500,px*s,BODY);const L=wrap(c,text,w,maxLines),lh=px*s*1.42;return{h:L.length*lh,draw(x,y){F(c,weight||500,px*s,BODY);c.fillStyle=col||INK;c.textAlign='left';c.textBaseline='top';L.forEach((l,i)=>c.fillText(l,x,y+i*lh))}}}}
function stack(parts,gap){return(w,s)=>{const B=parts.map(p=>p(w,s)),g=(gap==null?14:gap)*s;return{h:B.reduce((a,b)=>a+b.h,0)+g*Math.max(0,B.length-1),draw(x,y){B.forEach(b=>{b.draw(x,y);y+=b.h+g})}}}}
function tipList(c,T,accent){return stack(T.map((t,i)=>(w,s)=>{const nx=44*s;F(c,700,24*s,BODY);const head=wrap(c,t.t,w-nx,2);F(c,500,19*s,BODY);const why=wrap(c,t.why,w-nx,3);const hh=head.length*24*s*1.3,wh=why.length*19*s*1.4,src=22*s;
  return{h:hh+wh+src+6*s,draw(x,y){c.beginPath();c.arc(x+15*s,y+16*s,15*s,0,Math.PI*2);c.fillStyle=rgba(accent,.22);c.fill();F(c,800,17*s,BODY);c.fillStyle=accent;c.textAlign='center';c.textBaseline='middle';c.fillText(String(i+1),x+15*s,y+17*s);
    c.textAlign='left';c.textBaseline='top';F(c,700,24*s,BODY);c.fillStyle=INK;head.forEach((l,j)=>c.fillText(l,x+nx,y+j*24*s*1.3));F(c,500,19*s,BODY);c.fillStyle=MUT;why.forEach((l,j)=>c.fillText(l,x+nx,y+hh+j*19*s*1.4));
    F(c,700,13.5*s,BODY);c.fillStyle=t.src==='guide'?TEAL:GOLD;c.fillText((t.src==='guide'?'FROM THE PAWPIXL GUIDE':'GENERAL BUILD RULE'),x+nx,y+hh+wh+5*s)}}}),20)}
/* who + headline. dir 'col' = picture above the name (vertical cards), 'row' = picture beside it */
function hero(c,o,dir){return(w,s)=>{const col=dir==='col',sz=(col?Math.min(360,w*.42):Math.min(230,w*.3))*s,tw=col?w:w-sz-30*s;const nm=fit(c,o.name,tw,(col?104:84)*s,34*s,400,DISP);F(c,600,24*s,BODY);const chips=o.chips||[];
  const sub=o.sub?wrap((F(c,600,25*s,BODY),c),o.sub,tw,2):[];const textH=nm.px*1.08+(chips.length?52*s:0)+sub.length*25*s*1.4+(sub.length?8*s:0);
  return{h:col?sz+26*s+textH:Math.max(sz,textH),draw(x,y){const px=col?x+(w-sz)/2:x,ty0=col?y+sz+26*s:y+Math.max(0,(sz-textH)/2),tx=col?x:x+sz+30*s,al=col?'center':'left',ax=col?x+w/2:tx;
    portrait(c,o.img,px,y,sz,o.cols,{badge:o.badge,letter:o.name,star:o.fav});let yy=ty0;F(c,400,nm.px,DISP);c.fillStyle=INK;c.textAlign=al;c.textBaseline='top';c.fillText(nm.t,ax,yy);yy+=nm.px*1.08;
    if(chips.length){F(c,700,20*s,BODY);const W2=chips.map(t=>c.measureText(t).width+28*s),tot=W2.reduce((a,b)=>a+b,0)+10*s*(chips.length-1);let cx=col?x+(w-Math.min(tot,w))/2:tx;chips.forEach((t,i)=>{if(cx+W2[i]>x+w+1)return;rr(c,cx,yy+6*s,W2[i],36*s,18*s);c.fillStyle=i===0?rgba(o.cols[0],.3):'rgba(255,255,255,.08)';c.fill();c.fillStyle=INK;c.textAlign='center';c.textBaseline='middle';c.fillText(t,cx+W2[i]/2,yy+25*s);cx+=W2[i]+10*s});yy+=52*s}
    F(c,600,25*s,BODY);c.fillStyle=MUT;c.textAlign=al;c.textBaseline='top';sub.forEach((l,i)=>c.fillText(l,ax,yy+8*s+i*25*s*1.4))}}}}
function titleBlock(c,title,sub,accent){return(w,s)=>{const f=fit(c,title,w,92*s,36*s,400,DISP);F(c,600,25*s,BODY);const L=sub?wrap(c,sub,w,2):[];return{h:f.px*1.1+L.length*25*s*1.4+(L.length?6*s:0),draw(x,y){F(c,400,f.px,DISP);c.fillStyle=INK;c.textAlign='left';c.textBaseline='top';c.fillText(f.t,x,y);F(c,600,25*s,BODY);c.fillStyle=accent||MUT;L.forEach((l,i)=>c.fillText(l,x,y+f.px*1.1+6*s+i*25*s*1.4))}}}}
function members(c,M,perRow){return(w,s)=>{const g=18*s,n=perRow,tw=(w-g*(n-1))/n,sz=Math.min(tw-28*s,210*s),th=sz+118*s+28*s,rows=Math.ceil(M.length/n);return{h:rows*th+(rows-1)*g,draw(x,y){M.forEach((m,i)=>{const tx=x+(i%n)*(tw+g),ty=y+Math.floor(i/n)*(th+g);rr(c,tx,ty,tw,th,20*s);c.fillStyle='rgba(255,255,255,.05)';c.fill();c.lineWidth=1.5;c.strokeStyle=rgba(m.cols[1],.35);c.stroke();
    portrait(c,m.img,tx+(tw-sz)/2,ty+16*s,sz,m.cols,{badge:m.badge,letter:m.name});const f=fit(c,m.name,tw-20*s,28*s,17*s,700,BODY);c.fillStyle=INK;c.textAlign='center';c.textBaseline='top';c.fillText(f.t,tx+tw/2,ty+sz+28*s);
    F(c,700,15*s,BODY);c.fillStyle=m.cols[1];c.fillText(ell(c,(m.el||'').toUpperCase(),tw-16*s),tx+tw/2,ty+sz+64*s);F(c,600,18*s,BODY);c.fillStyle=MUT;c.fillText(ell(c,m.role||'',tw-16*s),tx+tw/2,ty+sz+88*s);
    F(c,800,16*s,BODY);c.fillStyle='rgba(255,255,255,.55)';c.textAlign='left';c.fillText(String(i+1),tx+12*s,ty+10*s)})}}}}
/* ---------- compose: fit blocks into the format, shrinking or growing the scale until they fill it well ---------- */
function compose(c,W,H,spec){const M=Math.round(Math.min(W,H)*.052),top=M+62,bot=M+34,land=W>H,sq=W===H;backdrop(c,W,H,spec.cols);brand(c,W,H,M,spec.tag);
 const ax=M,ay=top,aw=W-2*M,ah=H-top-bot;let best=null;
 const plan=s=>{const g=22*s;let headB=null,bx=ax,bw=aw,by=ay,bh=ah,ncol=spec.cols_n?spec.cols_n(land,sq):(land||sq?2:1);
  if(spec.head){if(land&&spec.sideHead!==false){const hw=aw*.3;headB={b:spec.head('col')(hw,s),x:ax,w:hw,side:true};bx=ax+hw+g*1.6;bw=aw-hw-g*1.6}else{headB={b:spec.head(sq||land?'row':'col')(aw,s),x:ax,w:aw};by=ay+headB.b.h+g;bh=ah-headB.b.h-g}}
  const cw=(bw-g*(ncol-1))/ncol,B=spec.blocks.map(b=>b(cw,s)),cols=Array.from({length:ncol},()=>({h:0,L:[]}));B.forEach(b=>{const k=cols.reduce((m,cc,i)=>cc.h<cols[m].h?i:m,0);cols[k].L.push(b);cols[k].h+=b.h+(cols[k].L.length>1?g:0)});
  const used=Math.max(0,...cols.map(k=>k.h)),fits=used<=bh&&(!headB||!headB.side||headB.b.h<=ah)&&(!headB||headB.side||headB.b.h<ah*.62);return{s,g,headB,bx,bw,by,bh,cw,cols,used,fits}};
 for(let s=spec.maxScale||1.5;s>=.42;s-=.03){const p=plan(s);if(p.fits){best=p;break}}if(!best)best=plan(.42);
 const p=best;if(p.headB){const hy=p.headB.side?ay+Math.max(0,(ah-p.headB.b.h)/2):ay;p.headB.b.draw(p.headB.x,hy)}
 const multi=p.cols.length>1,minSpare=Math.max(0,p.bh-p.used);p.cols.forEach((k,i)=>{const n=k.L.length,spare=Math.max(0,p.bh-k.h),extra=!multi&&n>1?Math.min(spare/(n+1),46*p.s):0;let y=multi?p.by+minSpare/2:p.by+(spare-extra*(n-1))/2;k.L.forEach(b=>{b.draw(p.bx+i*(p.cw+p.g),y);y+=b.h+p.g+extra})});
 return{scale:p.s,fits:p.fits}}
/* ---------- the four graphics ---------- */
const fmtSub=(v,u)=>u==='%'?(Math.round(v*10)/10)+'%':String(Math.round(v));
function specBuild(c,X,k,o,fk){const ch=X.chars.find(x=>x.k===k);if(!ch)return null;const d=X.roster()[k]||{},g=X.guide(k),cols=X.EL[ch.el]||['#3c5a99','#7fa6ff'],a=d.a||{},w=d.w&&X.W.find(x=>x.id===d.w),setN=id=>{const s=X.A.find(x=>x.id===id);return s?X.N(s):''};
 const chips=[];if(o.cons&&d.c!=null)chips.push('C'+d.c);if(o.level&&d.lv)chips.push('Lv '+d.lv);chips.push(ch.el);if(ch.wt)chips.push(ch.wt);const role=o.role&&g&&(g.seo.roles||[])[0];
 const B=[];
 if(o.weapon&&w)B.push(panel(c,'Weapon',kv(c,[[X.N(w),(d.wr?'R'+d.wr:'')+(d.wl?(d.wr?' · ':'')+'Lv '+d.wl:'')||(w.r?w.r+'★':''),cols[1]]]),cols[1]));
 if(o.arts&&(a.s1||a.sands||a.goblet||a.circlet)){const R=[];if(a.s1)R.push([a.mode==='22'&&a.s2?'2 + 2 pieces':'4-piece set',a.mode==='22'&&a.s2?setN(a.s1)+' + '+setN(a.s2):setN(a.s1)]);if(a.sands)R.push(['Sands',MAINN[a.sands]||a.sands]);if(a.goblet)R.push(['Goblet',a.goblet==='el'?ch.el+' DMG':(MAINN[a.goblet]||a.goblet)]);if(a.circlet)R.push(['Circlet',MAINN[a.circlet]||a.circlet]);B.push(panel(c,'Artifacts',kv(c,R),cols[1]))}
 if(o.stats&&a.sub){const T=SUBN.filter(([key])=>a.sub[key]>0).map(([key,l,u])=>({l,v:fmtSub(a.sub[key],u),hi:key==='cr'||key==='cd'}));if(T.length){const cv=(a.sub.cr||0)*2+(a.sub.cd||0);B.push(panel(c,'Artifact substats',stack([tiles(c,T.slice(0,8),fk==='l'?Math.min(3,T.length):(T.length<=5?T.length:4),cols[1])].concat(cv>0?[para(c,'Crit value from substats: '+(Math.round(cv*10)/10)+' (CRIT Rate × 2 + CRIT DMG)',17,MUT,1)]:[])),cols[1]))}}
 if(o.talents&&d.t&&d.t.some(Boolean))B.push(panel(c,'Talents',tiles(c,[['Normal Attack',0],['Skill',1],['Burst',2]].map(([l,i])=>({l,v:d.t[i]||'–'})),3,cols[1]),cols[1]));
 const T=o.tips?X.advise(k):[];if(T.length)B.push(panel(c,'What to improve next',tipList(c,T.slice(0,3),cols[1]),cols[1]));
 if(o.note&&d.note)B.push(panel(c,'Notes',para(c,d.note,21,INK,4),cols[1]));
 if(!B.length)B.push(panel(c,'',para(c,'Add a weapon, talents or artifacts for '+ch.n+' in My Roster to fill this card.',22,MUT,3),cols[1]));
 return{cols,tag:o.tagline||'My build',images:[ch.ic],head:dir=>hero(c,{name:ch.n,img:IM.get(ch.ic)||null,cols,chips,sub:role||''},dir),blocks:B,file:'build-'+k,maxScale:fk==='v'?1.5:1.25}}
function teamInfo(X,t){const m=(t.t||t.m||[]).filter(Boolean).slice(0,4),sg=m.slice().sort().join('|'),gt=X.guideTeams().find(x=>x.m.slice().sort().join('|')===sg)||null;let text='',roles=null,from='';
 if(gt){const g=X.guide(X.key(gt.from)),wt=g&&g.why&&(g.why.t||[]).find(w=>(w.members||[]).map(X.key).sort().join('|')===sg);from=(X.chars.find(x=>x.k===X.key(gt.from))||{}).n||'';if(wt){text=String(wt.text||'').trim();if((wt.roles||[]).length===(wt.members||[]).length){roles={};wt.members.forEach((n,i)=>roles[X.key(n)]=wt.roles[i])}}}
 return{m,gt,text,roles,from}}
function specTeam(c,X,t,o,fk){const I=teamInfo(X,t);if(!I.m.length)return null;const R=X.roster(),first=X.chars.find(x=>x.k===I.m[0]),cols=X.EL[first&&first.el]||['#19b6a0','#f2c45a'];
 const M=I.m.map((k,i)=>{const ch=X.chars.find(x=>x.k===k)||{n:X.name(k),el:'',ic:''},d=R[k]||{},g=X.guide(k),cn=o.cons?(d.o===1&&d.c!=null?d.c:(t.c&&t.c[i]!=null&&t.c[i]!==''?+t.c[i]:null)):null;return{k,name:ch.n,el:ch.el,ic:ch.ic,img:IM.get(ch.ic)||null,cols:X.EL[ch.el]||['#556','#99a'],badge:cn!=null&&isFinite(cn)?'C'+cn:null,role:o.roles?((I.roles&&I.roles[k])||(g&&(g.seo.roles||[])[0])||''):''}});
 const els={};M.forEach(m=>{if(m.el)els[m.el]=(els[m.el]||0)+1});const mode=(X.modes.find(x=>x[0]===t.mode)||[])[1]||'';
 const B=[members(c,M,fk==='v'?2:4)];
 if(o.elements&&Object.keys(els).length)B.push(panel(c,'Elements',tiles(c,Object.keys(els).map(e=>({l:e,v:'×'+els[e],col:(X.EL[e]||[])[1]})),Math.min(4,Object.keys(els).length),cols[1]),cols[1]));
 if(o.guide&&I.text)B.push(panel(c,'How this team works',stack([para(c,I.text,22,INK,fk==='v'?9:6),para(c,'From the PawPixl '+I.from+' guide',16,TEAL,1,700)]),cols[1]));
 if(o.note&&t.note)B.push(panel(c,'Team notes',para(c,t.note,22,INK,5),cols[1]));
 const name=(o.title||t.name||(I.gt&&I.gt.name)||'My team').slice(0,60);
 return{cols,tag:'My team',images:M.map(m=>m.ic),members:M,head:()=>titleBlock(c,name,[mode,I.gt?'A PawPixl guide team':''].filter(Boolean).join(' · '),cols[1]),sideHead:false,blocks:B,cols_n:()=>1,file:'team-'+I.m.join('-').slice(0,40),maxScale:1.35}}
function rosterList(X,o){const R=X.roster();let L=X.chars.filter(ch=>R[ch.k]&&R[ch.k].o===1);if(o.only==='fav')L=L.filter(ch=>R[ch.k].fav);if(o.el)L=L.filter(ch=>ch.el===o.el);if(o.rar)L=L.filter(ch=>String(ch.r)===String(o.rar));
 if((o.pick||[]).length)L=L.filter(ch=>o.pick.includes(ch.k));return L.sort((a,b)=>(R[b.k].fav?1:0)-(R[a.k].fav?1:0)||b.r-a.r||a.n.localeCompare(b.n))}
const ROSCAP={v:[5,6],s:[6,3],l:[10,3]};
function specRoster(c,X,o,fk,page){const R=X.roster(),L=rosterList(X,o),cap=ROSCAP[fk],per=cap[0]*cap[1],pages=Math.max(1,Math.ceil(L.length/per));page=Math.max(0,Math.min(pages-1,page||0));const P=L.slice(page*per,page*per+per),cols=[TEAL,GOLD];
 const all=X.chars.filter(ch=>R[ch.k]&&R[ch.k].o===1),five=all.filter(ch=>ch.r===5).length,c6=all.filter(ch=>R[ch.k].c===6).length,fav=all.filter(ch=>R[ch.k].fav).length;
 const ratio={v:.7,s:1.25,l:2.6}[fk],minC={v:3,s:4,l:5}[fk],ncol=Math.max(Math.min(minC,P.length||1),Math.min(cap[0],Math.ceil(Math.sqrt((P.length||1)*ratio))));
 /* portraits are as large as the width allows, but never so tall that the rows run off the card */
 const grid=(w,s)=>{const n=ncol,g=14*s,rows=Math.ceil(P.length/n)||1,lab=Math.min(60,44*cap[0]/ncol)*s,budget={v:1400,s:600,l:590}[fk]-(o.statsRow?0:-110),sz=Math.max(40,Math.min((w-g*(n-1))/n,(budget-(rows-1)*g)/rows-lab)),tw=sz,th=sz+lab,x0=(w-(n*tw+(n-1)*g))/2;return{h:rows*th+(rows-1)*g,draw(x,y){P.forEach((ch,i)=>{const tx=x+x0+(i%n)*(tw+g),ty=y+Math.floor(i/n)*(th+g),d=R[ch.k];portrait(c,IM.get(ch.ic)||null,tx,ty,sz,X.EL[ch.el]||['#556','#99a'],{badge:o.cons&&d.c!=null?'C'+d.c:null,letter:ch.n,star:!!d.fav});const f=fit(c,ch.n,tw,Math.min(30,20*cap[0]/ncol)*s,12*s,700,BODY);c.fillStyle=INK;c.textAlign='center';c.textBaseline='top';c.fillText(f.t,tx+tw/2,ty+sz+10*s)})}}};
 const B=[];if(o.statsRow)B.push(tiles(c,[{l:'Characters',v:all.length},{l:'5-star',v:five},{l:'At C6',v:c6},{l:'Favorites',v:fav}],4,GOLD));
 if(P.length)B.push(grid);else B.push(panel(c,'',para(c,'No characters match. Mark the characters you own in My Roster, or change the filters.',22,MUT,3),TEAL));
 const sub=[L.length+' character'+(L.length===1?'':'s')+(o.only==='fav'?' · favorites':'')+(o.el?' · '+o.el:'')+(o.rar?' · '+o.rar+'★':''),pages>1?'Page '+(page+1)+' of '+pages:''].filter(Boolean).join(' · ');
 return{cols,tag:'My roster',images:P.map(ch=>ch.ic),grid:P,head:()=>titleBlock(c,(o.title||'My Genshin roster').slice(0,60),sub,GOLD),sideHead:false,blocks:B,cols_n:()=>1,file:'roster'+(pages>1?'-'+(page+1):''),pages,page,maxScale:1.6,count:L.length}}
function diffRows(X,ch,a,b){const out=[],setN=id=>{const s=X.A.find(x=>x.id===id);return s?X.N(s):''},wn=d=>{const w=d.w&&X.W.find(x=>x.id===d.w);return w?X.N(w)+(d.wr?' R'+d.wr:''):''},sets=d=>{const x=d.a||{};return x.s1?(x.mode==='22'&&x.s2?setN(x.s1)+' + '+setN(x.s2):setN(x.s1)):''};
 const add=(l,x,y,num)=>{if(x==null&&y==null||x===''&&y==='')return;if(x==null||x==='')x='–';if(y==null||y==='')y='–';out.push({l,a:String(x),b:String(y),ch:String(x)!==String(y),up:num&&isFinite(num[0])&&isFinite(num[1])?Math.sign(num[1]-num[0]):0})};
 add('Constellation',a.c!=null?'C'+a.c:'',b.c!=null?'C'+b.c:'',[a.c,b.c]);add('Level',a.lv,b.lv,[parseInt(a.lv,10),parseInt(b.lv,10)]);add('Weapon',wn(a),wn(b));
 ['Normal Attack','Skill','Burst'].forEach((l,i)=>{const x=(a.t||[])[i],y=(b.t||[])[i];if(x||y)add(l,x||'',y||'',[x,y])});add('Artifact set',sets(a),sets(b));
 [['sands','Sands'],['goblet','Goblet'],['circlet','Circlet']].forEach(([key,l])=>{const x=(a.a||{})[key],y=(b.a||{})[key],n=v=>v?(v==='el'?ch.el+' DMG':MAINN[v]||v):'';if(x||y)add(l,n(x),n(y))});
 SUBN.forEach(([key,l,u])=>{const x=((a.a||{}).sub||{})[key]||0,y=((b.a||{}).sub||{})[key]||0;if(x||y)add(l+' (substats)',x?fmtSub(x,u):'',y?fmtSub(y,u):'',[x,y])});return out}
function specGlow(c,X,k,o,fk){const ch=X.chars.find(x=>x.k===k),sn=X.snaps()[k];if(!ch||!sn)return null;const now=X.roster()[k]||{},cols=X.EL[ch.el]||['#3c5a99','#7fa6ff'];let R=diffRows(X,ch,sn.d||{},now);if(o.changedOnly)R=R.filter(r=>r.ch);
 const table=(w,s)=>{const lh=58*s,hh=40*s,c1=w*.3,cw=(w-c1)/2;return{h:hh+R.length*lh,draw(x,y){F(c,800,16*s,BODY);c.textBaseline='top';c.textAlign='center';c.fillStyle=MUT;c.fillText('BEFORE',x+c1+cw/2,y);c.fillStyle=cols[1];c.fillText('NOW',x+c1+cw*1.5,y);
    R.forEach((r,i)=>{const yy=y+hh+i*lh;if(i%2===0){rr(c,x-10*s,yy-6*s,w+20*s,lh-6*s,12*s);c.fillStyle='rgba(255,255,255,.035)';c.fill()}F(c,600,19*s,BODY);c.fillStyle=MUT;c.textAlign='left';c.textBaseline='top';c.fillText(ell(c,r.l,c1-10*s),x,yy+8*s);
     let f=fit(c,r.a,cw-16*s,24*s,14*s,600,BODY);c.fillStyle='rgba(232,236,248,.75)';c.textAlign='center';c.fillText(f.t,x+c1+cw/2,yy+6*s+(24*s-f.px)/2);f=fit(c,(r.ch&&r.up>0?'▲ ':r.ch&&r.up<0?'▼ ':'')+r.b,cw-16*s,24*s,14*s,r.ch?800:600,BODY);c.fillStyle=r.ch?(r.up<0?'#ff9c8a':cols[1]):INK;c.fillText(f.t,x+c1+cw*1.5,yy+6*s+(24*s-f.px)/2)})}}};
 const when=sn.at?new Date(sn.at).toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'}):'';const B=[R.length?panel(c,'Before and now',table,cols[1]):panel(c,'',para(c,'Nothing has changed since the “before” was saved'+(when?' on '+when:'')+'. Update '+ch.n+' in My Roster and come back.',22,MUT,4),cols[1])];
 const n=R.filter(r=>r.ch).length;return{cols,tag:'Build glow-up',images:[ch.ic],head:dir=>hero(c,{name:ch.n,cols,chips:[ch.el,n+' change'+(n===1?'':'s')],sub:when?'Since '+when:'',img:IM.get(ch.ic)||null},dir),blocks:B,file:'glowup-'+k,maxScale:fk==='v'?1.4:1.2,cols_n:()=>1}}
/* ---------- render: load pictures, wait for the fonts, draw ---------- */
let TOKEN=0;
async function render(canvas,X,st){const tk=++TOKEN,[W,H]=FMT[st.fmt]||FMT.v,c=canvas.getContext('2d');
 try{if(document.fonts&&document.fonts.load)await Promise.all([document.fonts.load('400 40px Anton'),document.fonts.load('600 20px Poppins'),document.fonts.load('700 20px Poppins'),document.fonts.load('800 20px Poppins'),document.fonts.load('500 20px Poppins')])}catch(e){}
 const o=st.opt,mk=()=>st.kind==='team'?specTeam(c,X,st.team||{},o,st.fmt):st.kind==='roster'?specRoster(c,X,o,st.fmt,st.page):st.kind==='glow'?specGlow(c,X,st.c,o,st.fmt):specBuild(c,X,st.c,o,st.fmt);
 let spec=mk();if(!spec){if(tk!==TOKEN)return null;canvas.width=W;canvas.height=H;backdrop(c,W,H,[TEAL,GOLD]);brand(c,W,H,56,'');F(c,600,30,BODY);c.fillStyle=MUT;c.textAlign='center';c.textBaseline='middle';wrap(c,st.kind==='glow'?'Save a “before” for a character first, then come back after improving the build.':'Choose who to show.',W-160,3).forEach((l,i)=>c.fillText(l,W/2,H/2+i*44));return{w:W,h:H,empty:true}}
 const srcs=(spec.images||[]).filter(Boolean),imgs=await Promise.all(srcs.map(loadImg));if(tk!==TOKEN)return null;
 IM=new Map();srcs.forEach((u,i)=>{if(imgs[i])IM.set(u,imgs[i])});spec=mk(); /* built again now that the pictures are here */
 canvas.width=W;canvas.height=H;c.setTransform(1,0,0,1,0,0);const r=compose(c,W,H,spec);
 return{w:W,h:H,file:spec.file,pages:spec.pages||1,page:spec.page||0,scale:r.scale,fits:r.fits,count:spec.count,missing:srcs.length-IM.size}}
/* ---------- the page ---------- */
const DEF={cons:true,level:true,role:true,weapon:true,arts:true,stats:true,talents:true,tips:true,note:false,roles:true,elements:true,guide:true,statsRow:true,changedOnly:false,only:'',el:'',rar:'',title:'',tagline:''};
const TOG={build:[['cons','Constellation'],['level','Level'],['role','Role'],['weapon','Weapon'],['arts','Artifacts'],['stats','Substats'],['talents','Talents'],['tips','What to improve next'],['note','My notes']],team:[['cons','Constellations'],['roles','Roles'],['elements','Elements'],['guide','How the team works (PawPixl guide teams)'],['note','Team notes']],roster:[['cons','Constellations'],['statsRow','Totals row']],glow:[['changedOnly','Only what changed']]};
function mount(root,X){const q=new URLSearchParams(location.search),saved=X.store.get('create',{})||{};const st={kind:['build','team','roster','glow'].includes(q.get('kind'))?q.get('kind'):(saved.kind||'build'),fmt:FMT[q.get('fmt')]?q.get('fmt'):(saved.fmt||'v'),c:q.get('c')?X.key(q.get('c')):'',team:null,teamId:q.get('team')||'',page:0,opt:Object.assign({},DEF,saved.opt||{},{title:'',pick:[]})};
 const R=()=>X.roster(),owned=()=>X.chars.filter(ch=>R()[ch.k]&&R()[ch.k].o===1).sort((a,b)=>a.n.localeCompare(b.n)),esc=X.esc;
 if(q.get('t')){st.team={t:q.get('t').split('_').map(X.key).filter(Boolean).slice(0,4),c:(q.get('tc')||'').split('_'),name:q.get('n')||''};st.kind='team';st.teamId='link'}
 const teamsAll=()=>{const own=new Set(owned().map(x=>x.k)),mine=X.teams().map(t=>({id:'s:'+t.id,label:(t.name||'Saved team')+' · '+t.t.filter(Boolean).map(X.name).join(', '),t})),sug=X.guideTeams().filter(t=>t.m.every(k=>own.has(k)||/^traveler/.test(k))).slice(0,40).map((t,i)=>({id:'g:'+i,label:(t.name||'Guide team')+' · '+t.m.map(X.name).join(', '),t:{t:t.m,c:[],name:t.name||''}}));return{mine,sug}};
 root.innerHTML='<div class="cg"><div class="cg-side"><div class="ros-seg cg-kinds" role="tablist" aria-label="What to make">'+[['build','Build card'],['team','Team card'],['roster','Roster showcase'],['glow','Glow-up']].map(([k,t])=>'<button type="button" role="tab" data-cg-kind="'+k+'">'+t+'</button>').join('')+'</div><div id="cg-pick"></div><div class="eyebrow cg-e">Size</div><div class="ros-seg cg-fmt">'+Object.keys(FMT).map(k=>'<button type="button" data-cg-fmt="'+k+'"><b>'+FMT[k][2]+'</b><small>'+FMT[k][3]+'</small></button>').join('')+'</div><div class="eyebrow cg-e">Show</div><div id="cg-tog" class="cg-tog"></div><div class="cg-act"><button type="button" class="btn primary" id="cg-dl">Download PNG</button><button type="button" class="btn" id="cg-copy" hidden>Copy image</button><button type="button" class="btn" id="cg-reset">Reset</button></div><p class="muted cg-note" id="cg-msg" role="status" aria-live="polite"></p><p class="muted cg-note">Made in your browser from My Roster. Nothing is uploaded, and your name, email and UID are never added.</p></div><div class="cg-stage"><div class="cg-frame" id="cg-frame"><canvas id="cg-canvas" width="1080" height="1920" role="img" aria-label="Preview of your graphic"></canvas></div><div class="cg-pager" id="cg-pager" hidden></div></div></div>';
 const $=s=>root.querySelector(s),cv=$('#cg-canvas'),say=t=>{$('#cg-msg').textContent=t||''};let last=null;
 if(navigator.clipboard&&window.ClipboardItem)$('#cg-copy').hidden=false;
 const save=()=>{const o=Object.assign({},st.opt);delete o.title;delete o.pick;X.store.set('create',{kind:st.kind,fmt:st.fmt,opt:o})};
 const sel=(id,label,opts,val)=>'<label class="cg-l">'+label+'<select id="'+id+'">'+opts.map(o=>o.group?'<optgroup label="'+esc(o.group)+'">'+o.items.map(i=>'<option value="'+esc(i[0])+'"'+(i[0]===val?' selected':'')+'>'+esc(i[1])+'</option>').join('')+'</optgroup>':'<option value="'+esc(o[0])+'"'+(o[0]===val?' selected':'')+'>'+esc(o[1])+'</option>').join('')+'</select></label>';
 function drawPick(){const O=owned(),box=$('#cg-pick');let h='';
  if(st.kind==='build'){if(!st.c||!O.some(x=>x.k===st.c))st.c=(O[0]||{}).k||'';h=O.length?sel('cg-c','Character',O.map(x=>[x.k,x.n]),st.c)+'<div class="cg-row"><a class="btn" id="cg-edit" href="/'+X.gid+'/roster?c='+encodeURIComponent(st.c)+'" data-link>Edit in My Roster</a><button type="button" class="btn" id="cg-snap">Save as my “before”</button></div>':'<p class="ros-note">Mark the characters you own in <a href="/'+X.gid+'/roster" data-link>My Roster</a> first. It takes a minute and is saved on this device.</p>'}
  else if(st.kind==='team'){const T=teamsAll(),all=T.mine.concat(T.sug);if(st.teamId!=='link'&&!all.some(x=>x.id===st.teamId))st.teamId=(all[0]||{}).id||'';if(st.teamId!=='link')st.team=(all.find(x=>x.id===st.teamId)||{}).t||null;
   const groups=[];if(st.teamId==='link'&&st.team)groups.push({group:'From your link',items:[['link',st.team.t.map(X.name).join(', ')]]});if(T.mine.length)groups.push({group:'My saved teams',items:T.mine.map(x=>[x.id,x.label])});if(T.sug.length)groups.push({group:'PawPixl guide teams you own',items:T.sug.map(x=>[x.id,x.label])});
   h=groups.length?sel('cg-t','Team',groups,st.teamId)+'<label class="cg-l">Team name on the card<input type="text" id="cg-title" maxlength="60" placeholder="'+esc((st.team&&st.team.name)||'My team')+'" value="'+esc(st.opt.title||'')+'"></label><div class="cg-row"><a class="btn" href="/'+X.gid+'/teamlab'+(st.team?'?t='+st.team.t.join('_'):'')+'" data-link>Open in Team Lab</a></div>':'<p class="ros-note">Save a team in <a href="/'+X.gid+'/teamlab" data-link>Team Lab</a>, or mark the characters you own in <a href="/'+X.gid+'/roster" data-link>My Roster</a> to see PawPixl guide teams you can make.</p>'}
  else if(st.kind==='roster'){const els=[...new Set(O.map(x=>x.el))].sort();h=sel('cg-only','Characters',[['','Everyone I own ('+O.length+')'],['fav','Favorites only']],st.opt.only)+sel('cg-el','Element',[['','All elements']].concat(els.map(e=>[e,e])),st.opt.el)+sel('cg-rar','Rarity',[['','All'],['5','5-star'],['4','4-star']],st.opt.rar)+'<label class="cg-l">Title<input type="text" id="cg-title" maxlength="60" placeholder="My Genshin roster" value="'+esc(st.opt.title||'')+'"></label>'}
  else{const S=X.snaps(),L=O.filter(x=>S[x.k]);if(!st.c||!L.some(x=>x.k===st.c))st.c=(L[0]||{}).k||'';h=L.length?sel('cg-c','Character',L.map(x=>[x.k,x.n]),st.c)+'<div class="cg-row"><a class="btn" href="/'+X.gid+'/roster?c='+encodeURIComponent(st.c)+'" data-link>Update in My Roster</a><button type="button" class="btn" id="cg-unsnap">Forget this “before”</button></div>':'<p class="ros-note">A glow-up compares a character now with an earlier saved moment. Open <b>Build card</b>, pick a character and press <b>Save as my “before”</b>. After you improve the build in My Roster, the changes show up here.</p>'}
  box.innerHTML=h;root.querySelectorAll('[data-cg-kind]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.cgKind===st.kind)));root.querySelectorAll('[data-cg-fmt]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.cgFmt===st.fmt)));
  $('#cg-tog').innerHTML=TOG[st.kind].map(([k,t])=>'<label class="cg-ck"><input type="checkbox" data-cg-opt="'+k+'"'+(st.opt[k]?' checked':'')+'> '+t+'</label>').join('')}
 async function paint(){$('#cg-frame').dataset.fmt=st.fmt;const r=await render(cv,X,st);if(!r)return;last=r;root.dataset.ready='1';root.dataset.w=r.w;root.dataset.h=r.h;root.dataset.empty=r.empty?'1':'';const pg=$('#cg-pager');
  if(st.kind==='roster'&&r.pages>1){pg.hidden=false;pg.innerHTML='<button type="button" class="btn" data-cg-pg="-1"'+(r.page?'':' disabled')+'>Previous</button><span>Page '+(r.page+1)+' of '+r.pages+'</span><button type="button" class="btn" data-cg-pg="1"'+(r.page<r.pages-1?'':' disabled')+'>Next</button><button type="button" class="btn" id="cg-dlall">Download all '+r.pages+' pages</button>'}else{pg.hidden=true;pg.innerHTML=''}
  $('#cg-dl').disabled=!!r.empty;$('#cg-copy').disabled=!!r.empty}
 const blob=()=>new Promise(res=>cv.toBlob(res,'image/png'));
 async function download(){if(!last||last.empty)return;const b=await blob();if(!b)return;const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='pawpixl-'+(last.file||'graphic')+'-'+last.w+'x'+last.h+'.png';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),4000);say('Saved '+a.download);if(X.ev)X.ev('create:dl:'+st.kind)}
 root.addEventListener('click',async e=>{const b=e.target.closest('button');if(!b)return;
  if(b.dataset.cgKind){st.kind=b.dataset.cgKind;st.page=0;if(st.kind==='team'&&st.teamId==='link'&&!st.team)st.teamId='';save();drawPick();paint();return}
  if(b.dataset.cgFmt){st.fmt=b.dataset.cgFmt;st.page=0;save();drawPick();paint();return}
  if(b.dataset.cgPg){st.page=Math.max(0,st.page+ +b.dataset.cgPg);paint();return}
  if(b.id==='cg-dl')return download();
  if(b.id==='cg-dlall'){const n=last.pages;for(let i=0;i<n;i++){st.page=i;await paint();await download();await new Promise(r=>setTimeout(r,350))}return}
  if(b.id==='cg-copy'){try{const bl=await blob();await navigator.clipboard.write([new ClipboardItem({'image/png':bl})]);say('Copied. Paste it into Discord or a message.')}catch(err){say('This browser would not copy the image. Use Download instead.')}return}
  if(b.id==='cg-reset'){st.opt=Object.assign({},DEF,{pick:[]});st.fmt='v';st.page=0;save();drawPick();paint();say('Back to the standard layout.');return}
  if(b.id==='cg-snap'){const d=R()[st.c];if(!d)return;const S=X.snaps();if(S[st.c]&&!b.dataset.sure){b.dataset.sure='1';b.textContent='Replace the saved “before”?';return}S[st.c]={d:JSON.parse(JSON.stringify(d)),at:Date.now()};X.store.set('snaps',S);b.dataset.sure='';b.textContent='Saved as “before” ✓';say('Saved. Improve the build in My Roster, then open Glow-up.');return}
  if(b.id==='cg-unsnap'){const S=X.snaps();delete S[st.c];X.store.set('snaps',S);drawPick();paint();return}});
 root.addEventListener('change',e=>{const t=e.target;if(t.dataset.cgOpt){st.opt[t.dataset.cgOpt]=t.checked;save();paint();return}
  if(t.id==='cg-c'){st.c=t.value;drawPick();paint();return}if(t.id==='cg-t'){st.teamId=t.value;st.opt.title='';drawPick();paint();return}
  if(t.id==='cg-only'){st.opt.only=t.value;st.page=0}else if(t.id==='cg-el'){st.opt.el=t.value;st.page=0}else if(t.id==='cg-rar'){st.opt.rar=t.value;st.page=0}else return;save();paint()});
 let tmr=0;root.addEventListener('input',e=>{if(e.target.id==='cg-title'){st.opt.title=e.target.value;clearTimeout(tmr);tmr=setTimeout(paint,180)}});
 drawPick();paint();return{state:st,paint,blob,get last(){return last}}}
window.PPCreate={mount,render,FMT,_wrap:wrap,_fit:fit,_diff:diffRows,_rosterList:rosterList};
})();
