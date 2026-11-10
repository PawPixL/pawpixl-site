/* PawPixl Arena artwork: every picture in the Arena is drawn here, pixel by pixel, in code.
   Original designs made for PawPixl (the training ground, the wooden training buddy, the adventurer tokens,
   the elemental effects and the completion banner). Nothing is traced or copied from any game.
   Everything is drawn small and scaled up with nearest-neighbor, so edges stay crisp.
   Exposes window.PPArenaArt. No dependencies. */
(function(){
'use strict';
/* ---------- palette ---------- */
const EL={Pyro:['#ff7a2f','#ffd27a','#c4361b'],Hydro:['#3aa8ff','#c4ecff','#1f5fbf'],Anemo:['#38dcb8','#d2fff2','#178f78'],Electro:['#b06bff','#f0d6ff','#6a2fc0'],
 Cryo:['#8fe3ff','#ffffff','#3c9ad0'],Geo:['#f2b845','#fff0b0','#a8741c'],Dendro:['#7fd14f','#e6ffc4','#3f8f2a'],Physical:['#f4ecd8','#ffffff','#c9a85a']};
const P={out:'#2a1a22',wood:'#b8763c',woodL:'#dc9f5f',woodD:'#8a522a',woodDD:'#64391e',mask:'#f3e2bb',maskD:'#d9bd8a',eye:'#ffffff',pup:'#2b2238',rope:'#ead08f',ropeD:'#b8924f',arm:'#7a4b28',armL:'#a36a36',gold:'#f5c451',goldD:'#b8862a',blush:'#ef8f7c',horn:'#f1e4c6',hornD:'#cdb98d'};
const col=el=>EL[el]||EL.Physical;
/* ---------- tiny raster helpers (whole pixels only) ---------- */
function px(g,x,y,w,h,c){g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)))}
function ell(g,cx,cy,rx,ry,c){g.fillStyle=c;for(let y=Math.floor(cy-ry);y<=Math.ceil(cy+ry);y++){const dy=(y+.5-cy)/ry;if(Math.abs(dy)>1)continue;const hw=rx*Math.sqrt(1-dy*dy);const x0=Math.round(cx-hw),x1=Math.round(cx+hw);if(x1>x0)g.fillRect(x0,y,x1-x0,1)}}
function line(g,x0,y0,x1,y1,c,w){w=w||1;const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0),1);g.fillStyle=c;for(let i=0;i<=n;i++){const x=Math.round(x0+(x1-x0)*i/n),y=Math.round(y0+(y1-y0)*i/n);g.fillRect(x-(w>>1),y-(w>>1),w,w)}}
const rnd=i=>{const s=Math.sin(i*127.1+311.7)*43758.5453;return s-Math.floor(s)};
function canvas(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');g.imageSmoothingEnabled=false;return[c,g]}
/* a dark one-pixel outline around everything drawn on a sprite canvas (classic pixel-art look) */
function outline(c,color){const g=c.getContext('2d'),w=c.width,h=c.height,d=g.getImageData(0,0,w,h),a=d.data,o=new Uint8ClampedArray(a);const [r,gg,b]=hex(color);
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=(y*w+x)*4;if(a[i+3])continue;const n=(xx,yy)=>xx>=0&&yy>=0&&xx<w&&yy<h&&a[(yy*w+xx)*4+3]>0;if(n(x-1,y)||n(x+1,y)||n(x,y-1)||n(x,y+1)){o[i]=r;o[i+1]=gg;o[i+2]=b;o[i+3]=255}}
 d.data.set(o);g.putImageData(d,0,0);return c}
function hex(h){h=h.replace('#','');if(h.length===3)h=h.split('').map(x=>x+x).join('');return[parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)]}
const cache=new Map();const memo=(k,f)=>{if(!cache.has(k))cache.set(k,f());return cache.get(k)};

/* ================= THE TRAINING GROUND ================= */
/* 4-step ordered dither between two colours, for the soft 16-bit sky */
const BAYER=[[0,2],[3,1]];
function ground(W,H){return memo('ground:'+W+'x'+H,()=>{const [c,g]=canvas(W,H);
 const sky=['#241631','#2f1b3c','#432447','#5e2f4c','#7f3d4d','#a24e47','#c66741','#e08a43','#eeae55','#f6cb72'];
 const band=11;for(let y=0;y<92;y++){const f=y/band,i=Math.min(sky.length-1,Math.floor(f)),j=Math.min(sky.length-1,i+1),t=f-i;for(let x=0;x<W;x++){const th=(BAYER[y&1][x&1]+.5)/4;g.fillStyle=t>th?sky[j]:sky[i];g.fillRect(x,y,1,1)}}
 /* stars, top only */
 for(let i=0;i<26;i++){const x=Math.floor(rnd(i)*W),y=Math.floor(rnd(i+50)*20);px(g,x,y,1,1,i%5?'#7a5b8e':'#f6e3b0')}
 /* sun with soft dithered glow */
 const sx=W-62,sy=63;for(let r=30;r>13;r-=1){for(let a=0;a<360;a+=2){const x=Math.round(sx+Math.cos(a*Math.PI/180)*r),y=Math.round(sy+Math.sin(a*Math.PI/180)*r*.9);if(((x+y)&1)===0&&r>22)continue;if(y<92){g.fillStyle=r>22?'rgba(255,214,140,.10)':'rgba(255,224,160,.22)';g.fillRect(x,y,1,1)}}}
 ell(g,sx,sy,13,12,'#ffd78a');ell(g,sx,sy,11,10,'#ffe7a8');ell(g,sx-2,sy-2,6,5,'#fff6d6');
 /* golden clouds */
 const cloud=(x,y,s)=>{ell(g,x,y,10*s,3*s,'#c9634a');ell(g,x+6*s,y-2*s,7*s,3*s,'#c9634a');ell(g,x-6*s,y-1*s,6*s,2.5*s,'#c9634a');ell(g,x,y-1,9*s,2*s,'#e9925a');ell(g,x+6*s,y-3*s,6*s,2*s,'#f4b16c');px(g,x-8*s,y+2*s-1,18*s,1,'#a8484a')};
 cloud(40,30,1);cloud(W*.45,22,1.2);cloud(W-120,40,.8);cloud(W-30,18,.9);
 /* far mountains: two layers with snowy rims and warm rim light on the sunny side */
 const ridge=(base,amp,f1,f2,ph,cA,cB,snow)=>{for(let x=0;x<W;x++){const y=Math.round(base-amp*(.55*Math.sin(x*f1+ph)+.45*Math.sin(x*f2+ph*2))-Math.abs(Math.sin(x*f1*.5+ph))*amp*.6);g.fillStyle=x>sx-40&&x<sx+40?cB:cA;g.fillRect(x,y,1,H-y);if(snow&&y<base-amp*.9){px(g,x,y,1,2,snow)}g.fillStyle='rgba(255,200,130,.35)';g.fillRect(x,y,1,1)}};
 ridge(70,14,.035,.09,1.3,'#7a4256','#8a4c58','#e9c7b3');ridge(80,9,.05,.13,4.1,'#5a2f48','#663650',null);
 /* a little hilltop watchtower (original, simple) */
 {const tx=Math.round(W*.2),ty=70;px(g,tx-6,ty,13,12,'#46263f');px(g,tx-4,ty-10,9,10,'#4f2b45');px(g,tx-5,ty-12,11,2,'#3a1f35');px(g,tx-1,ty-6,2,3,'#f3c35a');px(g,tx-5,ty-14,2,2,'#3a1f35');px(g,tx+4,ty-14,2,2,'#3a1f35');px(g,tx-1,ty-14,2,2,'#3a1f35');px(g,tx,ty-20,1,6,'#3a1f35');px(g,tx+1,ty-20,4,3,'#d1574a')}
 /* tree line */
 for(let x=-4;x<W+4;x+=7){const h=7+Math.floor(rnd(x+9)*5);const cx=x+3;ell(g,cx,88-h/2,4,h/2+1,'#2f2a3f');ell(g,cx-1,88-h/2-1,3,h/2,'#3a3550');px(g,cx,88,1,2,'#2a1e2c')}
 /* meadow behind the platform */
 px(g,0,88,W,14,'#2f5b3b');for(let x=0;x<W;x++){if(rnd(x)>.55)px(g,x,88,1,1,'#3f7a4a');if(rnd(x+3)>.8)px(g,x,90+Math.floor(rnd(x+7)*6),1,1,'#4a8a50')}
 /* wooden fence along the meadow */
 for(let x=6;x<W;x+=14){px(g,x,82,2,12,'#6b4428');px(g,x,82,2,1,'#9a6a3c')}px(g,0,85,W,2,'#7d5130');px(g,0,85,W,1,'#a87443');px(g,0,90,W,2,'#7d5130');px(g,0,90,W,1,'#a87443');
 /* the platform: emerald grass on soft stone */
 const L=12,R=W-12,top=100;
 px(g,L-2,top+28,R-L+4,3,'rgba(0,0,0,.35)');
 for(let r=0;r<4;r++){for(let x=L+(r%2?-6:0);x<R;x+=12){const x0=Math.max(L,x),x1=Math.min(R,x+11),y=top+5+r*6;if(x1<=x0)continue;const v=rnd(x*7+r);px(g,x0,y,x1-x0,5,v>.66?'#8f7e6c':v>.33?'#857462':'#7c6b5a');px(g,x0,y,x1-x0,1,'#a8967f');px(g,x0,y+4,x1-x0,1,'#665646');if(v>.8)px(g,x0+2,y+1,2,1,'#5f7d45')}}
 px(g,L,top+29,R-L,1,'#4a3a2f');
 /* gold paw emblem on a plaque at the front of the platform */
 {const ex=Math.round(W/2),ey=top+14;px(g,ex-8,ey-6,17,13,'#5c4433');px(g,ex-7,ey-5,15,11,'#7a5a40');px(g,ex-8,ey-6,17,1,'#b88a4a');paw(g,ex,ey,'#f5c451','#b8862a')}
 /* grass top with tufts and small flowers */
 px(g,L-1,top,R-L+2,5,'#2f8f4a');px(g,L-1,top,R-L+2,1,'#5fd06a');px(g,L-1,top+5,R-L+2,1,'#226b39');
 for(let x=L;x<R;x+=2){const v=rnd(x+11);if(v>.45)px(g,x,top-1,1,1,'#4fbf5c');if(v>.8)px(g,x+1,top-2,1,2,'#6ddc72')}
 const fl=['#ff9db5','#fff2a8','#ffffff','#c7a6ff'];for(let i=0;i<Math.floor(W/14);i++){const x=L+3+Math.floor(rnd(i+90)*(R-L-6)),y=top+1+Math.floor(rnd(i+40)*3);px(g,x,y,1,1,fl[i%4]);px(g,x,y+1,1,1,'#2a7a3c')}
 /* banners on poles, with the paw motif */
 [[22,'#b8403d','#8a2d2b'],[W-24,'#2d7a8f','#1f5566']].forEach(([x,c1,c2])=>{px(g,x,52,2,48,'#5a3b26');px(g,x+1,52,1,48,'#7a5234');ell(g,x+1,51,2,2,'#f5c451');px(g,x+2,56,14,20,c1);px(g,x+2,56,14,1,'#f5c451');px(g,x+14,56,2,20,c2);px(g,x+2,76,4,4,c1);px(g,x+12,76,4,4,c1);px(g,x+6,76,6,2,c1);paw(g,x+9,65,'#f5c451',null,true)});
 /* stone braziers (flames are animated separately) */
 brazierSpots(W).forEach(x=>{px(g,x-4,top-9,9,3,'#6b5a4c');px(g,x-4,top-9,9,1,'#9a8574');px(g,x-3,top-6,7,6,'#5a4a3e');px(g,x-2,top-6,1,6,'#7a6656')});
 return c})}
const brazierSpots=W=>[Math.round(W*.17),Math.round(W*.83)];
/* the PawPixl paw: one pad and four toes */
function paw(g,x,y,c,shade,small){if(small){ell(g,x,y+1,2.5,2,c);px(g,x-3,y-2,1,2,c);px(g,x-1,y-3,1,2,c);px(g,x+1,y-3,1,2,c);px(g,x+3,y-2,1,2,c);return}ell(g,x,y+2,3.5,2.6,c);ell(g,x-4,y-2,1.3,1.6,c);ell(g,x-1.5,y-4,1.3,1.6,c);ell(g,x+1.5,y-4,1.3,1.6,c);ell(g,x+4,y-2,1.3,1.6,c);if(shade){px(g,x-2,y+4,4,1,shade)}}
/* animated foreground bits: brazier flames, drifting golden motes */
function fore(g,W,t,still){const top=100;brazierSpots(W).forEach((x,i)=>{const f=still?0:Math.floor(t*8+i*3)%3;const h=[5,6,4][f];ell(g,x,top-10-h/2,3,h/2+1,'#e2572e');ell(g,x,top-10-h/2+1,2,h/2,'#ffad3a');px(g,x,top-11-h+1+f%2,1,2,'#fff1a8');g.fillStyle='rgba(255,170,80,.08)';g.beginPath();g.arc(x,top-12,14,0,7);g.fill()});
 if(still)return;for(let i=0;i<7;i++){const x=(rnd(i)*W+t*(4+i%3))%W,y=40+((rnd(i+20)*50+Math.sin(t*.8+i)*4)%50);if(Math.floor(t*2+i)%4!==0)px(g,x,y,1,1,'rgba(255,226,150,.8)')}}

/* ================= THE TRAINING BUDDY (practice dummy) ================= */
/* a round wooden fellow with a friendly carved mask, little horns, rope-wrapped arms and wooden armour.
   states: idle, blink, hit, stagger, recover, cheer */
const DW=40,DH=54;
function dummySprite(state){return memo('dummy:'+state,()=>{const [c,g]=canvas(DW,DH);const cx=20;
 /* post and base */
 ell(g,cx,DH-3,9,2.5,P.woodDD);px(g,cx-2,38,5,14,P.woodD);px(g,cx-2,38,1,14,P.wood);
 /* round wooden body */
 ell(g,cx,31,12,10,P.wood);ell(g,cx+3,33,9,8,P.woodD);ell(g,cx-1,30,11,9,P.wood);px(g,cx-9,26,2,3,P.woodL);px(g,cx-10,29,1,3,P.woodL);
 /* wooden training armour with gold studs */
 px(g,cx-8,28,17,9,P.arm);px(g,cx-8,28,17,1,P.armL);px(g,cx-8,36,17,1,'#5c3a1f');px(g,cx-1,29,3,7,P.armL);px(g,cx-7,29,1,1,P.gold);px(g,cx+7,29,1,1,P.gold);px(g,cx-7,35,1,1,P.gold);px(g,cx+7,35,1,1,P.gold);
 /* rope belt */
 for(let x=cx-10;x<=cx+10;x++)px(g,x,38,1,2,(x&1)?P.rope:P.ropeD);
 /* rope-wrapped arms */
 const up=state==='cheer';const arm=(sx,sy,ex,ey)=>{line(g,sx,sy,ex,ey,P.ropeD,3);const n=Math.max(Math.abs(ex-sx),Math.abs(ey-sy));for(let i=0;i<=n;i+=2){const x=Math.round(sx+(ex-sx)*i/n),y=Math.round(sy+(ey-sy)*i/n);px(g,x-1,y,3,1,P.rope)}ell(g,ex,ey,2.2,2.2,P.woodL)};
 if(up){arm(cx-10,28,cx-15,17);arm(cx+10,28,cx+15,17)}else if(state==='hit'||state==='stagger'){arm(cx-10,29,cx-16,26);arm(cx+10,29,cx+16,25)}else{arm(cx-10,29,cx-15,34);arm(cx+10,29,cx+15,34)}
 /* little horns / ears */
 const horn=(x,dir)=>{ell(g,x,7,2.6,3,P.horn);px(g,x+dir,4,1,2,P.horn);px(g,x-dir,8,1,2,P.hornD)};horn(cx-8,-1);horn(cx+8,1);
 /* carved mask */
 ell(g,cx,15,11,10,P.mask);ell(g,cx+2,18,9,7,P.maskD);ell(g,cx-1,14,10,9,P.mask);px(g,cx-8,10,2,1,'#fff6dc');px(g,cx-9,12,1,2,'#fff6dc');
 /* carved brow lines and cheeks */
 px(g,cx-7,9,4,1,P.maskD);px(g,cx+4,9,4,1,P.maskD);px(g,cx-8,18,2,1,P.blush);px(g,cx+7,18,2,1,P.blush);
 /* oversized eyes */
 const eye=(x)=>{if(state==='blink'){px(g,x-3,15,6,1,P.pup);px(g,x-2,16,4,1,P.maskD);return}if(state==='hit'||state==='stagger'){px(g,x-2,13,1,1,P.pup);px(g,x-1,14,1,1,P.pup);px(g,x,15,1,1,P.pup);px(g,x-1,16,1,1,P.pup);px(g,x-2,17,1,1,P.pup);if(x>cx){g.save();g.translate(2*x,0);g.scale(-1,1);g.restore()}return}
  if(state==='cheer'){px(g,x-3,15,1,1,P.pup);px(g,x-2,14,1,1,P.pup);px(g,x-1,13,2,1,P.pup);px(g,x+1,14,1,1,P.pup);px(g,x+2,15,1,1,P.pup);return}
  ell(g,x,15,3.4,4.2,P.eye);ell(g,x+.5,16,1.8,2.6,P.pup);px(g,x,14,1,1,'#ffffff');px(g,x-2,13,1,1,'#ffffff')};
 eye(cx-5);eye(cx+5);
 if(state==='hit'||state==='stagger'){/* mirror the right ">" into "<" */px(g,cx+3,13,1,1,P.pup);px(g,cx+4,14,1,1,P.pup);px(g,cx+5,15,1,1,P.pup);px(g,cx+4,16,1,1,P.pup);px(g,cx+3,17,1,1,P.pup);px(g,cx+7,13,1,5,P.mask);px(g,cx+6,13,1,1,P.mask);px(g,cx+6,17,1,1,P.mask);px(g,cx+6,14,1,1,P.mask);px(g,cx+6,16,1,1,P.mask)}
 /* mouth */
 if(state==='hit'||state==='stagger'){ell(g,cx,21,1.6,1.8,P.pup)}else if(state==='cheer'){px(g,cx-3,20,7,1,P.pup);px(g,cx-2,21,5,1,'#b8404a');px(g,cx-1,22,3,1,P.pup)}else{px(g,cx-2,21,1,1,P.pup);px(g,cx-1,22,3,1,P.pup);px(g,cx+2,21,1,1,P.pup)}
 return outline(c,P.out)})}
/* draw the buddy with its feet at (x,y); lean shears the rows for a pixel-art stagger */
function dummy(g,x,y,state,t,o){o=o||{};const s=dummySprite(state);const bob=state==='idle'||state==='blink'?(Math.floor((t||0)*2)%2):state==='cheer'?-Math.abs(Math.round(Math.sin((t||0)*9)*3)):0;
 const lean=state==='stagger'?3:state==='recover'?-1:state==='hit'?1:0;const x0=Math.round(x-DW/2+(o.shake||0)),y0=Math.round(y-DH+bob);
 if(!lean)g.drawImage(s,x0,y0);else for(let r=0;r<DH;r++){const off=Math.round(lean*(1-r/(DH-14)));g.drawImage(s,0,r,DW,1,x0+(r<DH-14?off:0),y0+r,DW,1)}
 if(state==='hit'&&o.flash){g.globalAlpha=.5;g.globalCompositeOperation='lighter';g.drawImage(s,x0+lean,y0);g.globalCompositeOperation='source-over';g.globalAlpha=1}}

/* ================= ADVENTURER TOKENS ================= */
/* small hooded adventurers in each element's colours, one look per weapon type. Generic on purpose:
   no character's outfit, face or hair. The site's own portrait floats above them for identification. */
const HW=26,HH=30;
function heroSprite(el,weapon,pose,blink){return memo(['hero',el,weapon,pose,blink].join(':'),()=>{const [c,g]=canvas(HW,HH);const [m,l,d]=col(el);const cx=11;
 const atk=pose==='attack',burst=pose==='burst',skill=pose==='skill';
 /* weapon behind the body */
 if(weapon==='Claymore'&&!atk){line(g,cx-6,26,cx+5,6,'#c9d2e0',2);px(g,cx+3,6,3,2,'#ffffff');line(g,cx-6,24,cx-3,24,P.gold,1)}
 if(weapon==='Polearm'&&!atk){line(g,cx+7,28,cx+7,2,'#8a5a32',1);px(g,cx+6,0,3,4,'#d8e0ea');px(g,cx+7,0,1,1,'#ffffff')}
 /* boots */
 px(g,cx-4,27,3,2,'#3b2a24');px(g,cx+1,27,3,2,'#3b2a24');
 /* cloak */
 for(let y=13;y<=26;y++){const hw=4+Math.floor((y-13)/2.4);px(g,cx-hw,y,hw*2+1,1,m);px(g,cx+Math.max(1,hw-2),y,2,1,d)}
 px(g,cx-7,26,15,1,P.gold);px(g,cx,15,1,11,l);px(g,cx-1,18,3,1,P.gold);
 /* hood with a shadowed face and two bright eyes */
 ell(g,cx,9,6.4,6.4,m);ell(g,cx+2,10,4.5,5,d);ell(g,cx-.5,8.5,5.6,5.6,m);px(g,cx-5,4,2,1,l);px(g,cx-6,6,1,2,l);px(g,cx+4,1,2,3,m);px(g,cx+5,0,1,2,m);
 ell(g,cx+.5,10,3.6,3,'#2b2238');if(!blink){px(g,cx-1,10,1,1,'#fff3c4');px(g,cx+2,10,1,1,'#fff3c4')}else{px(g,cx-1,10,1,1,'#7a6a8a');px(g,cx+2,10,1,1,'#7a6a8a')}
 /* weapon in front */
 const hx=cx+6,hy=19;
 if(weapon==='Bow'){if(atk){line(g,hx+3,11,hx+5,19,'#8a5a32');line(g,hx+5,19,hx+3,27,'#8a5a32');line(g,hx+3,11,hx-1,19,'#fff6d6');line(g,hx-1,19,hx+3,27,'#fff6d6');line(g,hx-1,19,hx+8,19,l);px(g,hx+8,18,2,3,m)}else{line(g,hx+1,11,hx+4,19,'#8a5a32');line(g,hx+4,19,hx+1,27,'#8a5a32');line(g,hx+1,11,hx+1,27,'#fff6d6')}}
 if(weapon==='Polearm'&&atk){line(g,cx-2,19,cx+14,19,'#8a5a32');px(g,cx+14,18,4,3,'#d8e0ea');px(g,cx+18,19,2,1,'#ffffff')}
 if(weapon==='Claymore'&&atk){line(g,cx+2,19,cx+15,12,'#c9d2e0',2);px(g,cx+14,10,3,2,'#ffffff');line(g,cx+2,17,cx+3,21,P.gold)}
 if(weapon==='Sword'){if(atk){line(g,cx+3,19,cx+13,14,'#d8e0ea');px(g,cx+3,18,1,3,P.gold)}else{line(g,hx,21,hx+2,13,'#d8e0ea');px(g,hx-1,21,3,1,P.gold)}}
 if(weapon==='Catalyst'){const ox=atk?hx+5:hx+1,oy=atk?17:16;ell(g,ox,oy,2.6,2.6,m);px(g,ox-1,oy-1,1,1,l)}
 /* hand */
 px(g,hx-1,19,2,2,'#f0d2b0');
 outline(c,P.out);
 if(skill||burst){const [cc,gg]=canvas(HW,HH);gg.drawImage(c,0,0);return cc}
 return c})}
/* draws a token standing at (x,y) (feet). pose: idle | attack | skill | burst */
function hero(g,x,y,o){const t=o.t||0,pose=o.pose||'idle',[m,l]=col(o.el),still=!!o.still;const blink=!still&&Math.floor(t*1.3+(o.seed||0))%9===0;
 const bob=pose==='idle'&&!still?Math.floor(t*2+(o.seed||0))%2:0,lunge=pose==='attack'?2:0;const x0=Math.round(x-11+lunge),y0=Math.round(y-HH+1+bob);
 if(pose==='skill'||pose==='burst'){const r=pose==='burst'?13:10;for(let a=0;a<24;a++){const an=a/24*Math.PI*2+(still?0:t*2);if((a&1)&&pose==='skill')continue;px(g,x+Math.cos(an)*r,y-2+Math.sin(an)*r*.35,1,1,a%3?m:l)}}
 if(pose==='burst'){g.globalAlpha=.35;for(let i=-1;i<=1;i+=2)for(let j=-1;j<=1;j+=2)g.drawImage(heroSprite(o.el,o.weapon,pose,false),x0+i,y0+j);g.globalAlpha=1;for(let i=0;i<6;i++){const k=(t*1.5+i/6)%1;if(!still)px(g,x-8+i*3,y-4-k*24,1,2,i%2?l:m)}}
 g.drawImage(heroSprite(o.el,o.weapon,pose==='skill'||pose==='burst'?'attack':pose,blink),x0,y0);
 if(o.badge){const b=o.badge,s=12,bx=Math.round(x-s/2+lunge),by=y0-s-1;ell(g,bx+s/2,by+s/2,s/2+1,s/2+1,P.out);g.save();g.beginPath();g.arc(bx+s/2,by+s/2,s/2,0,7);g.clip();g.fillStyle=m;g.fillRect(bx,by,s,s);try{g.drawImage(b,bx,by,s,s)}catch(e){}g.restore();g.strokeStyle=P.gold;g.lineWidth=1;g.beginPath();g.arc(bx+s/2,by+s/2,s/2+.5,0,7);g.stroke()}}

/* ================= ELEMENTAL EFFECTS ================= */
/* fx(g,kind,el,k,ctx): k runs 0..1 through one step. ctx: {from:{x,y}, to:{x,y}, still}.
   Returns {hit, strong} so the scene can make the buddy react and shake the frame. */
function particles(g,el,x,y,k,n,seed,spread){const [m,l,d]=col(el);for(let i=0;i<n;i++){const a=rnd(seed+i)*Math.PI*2,sp=(.4+rnd(seed+i*3))*(spread||14),xx=x+Math.cos(a)*sp*k,yy=y+Math.sin(a)*sp*k*.8+k*k*6;const c=i%3===0?l:i%3===1?m:d;if(k>=1)continue;
 if(el==='Cryo'&&i%4===0){snow(g,xx,yy,c);continue}if(el==='Anemo'&&i%4===0){leaf(g,xx,yy,i);continue}if(el==='Hydro'&&i%3===0){px(g,xx,yy,1,2,c);continue}px(g,xx,yy,1,1,c)}}
const snow=(g,x,y,c)=>{px(g,x,y-1,1,3,c);px(g,x-1,y,3,1,c)};
const leaf=(g,x,y,i)=>{px(g,x,y,2,1,'#6fe0a0');px(g,x+(i&1),y+1,1,1,'#2f9f6a')};
function ring(g,x,y,r,c,squash){const n=Math.max(12,Math.round(r*4));for(let i=0;i<n;i++){const a=i/n*Math.PI*2;px(g,x+Math.cos(a)*r,y+Math.sin(a)*r*(squash||.4),1,1,c)}}
function bolt(g,x0,y0,x1,y1,c,seed){let x=x0,y=y0;const n=6;for(let i=1;i<=n;i++){const nx=x0+(x1-x0)*i/n+(i<n?(rnd(seed+i)-.5)*6:0),ny=y0+(y1-y0)*i/n;line(g,x,y,nx,ny,c);x=nx;y=ny}}
function impact(g,el,x,y,k,seed,big){const [m,l]=col(el);if(k<0||k>1)return;const r=(big?16:9)*k;if(k<.35){ell(g,x,y,(big?6:3)*(1-k),(big?6:3)*(1-k),'#ffffff')}ring(g,x,y,r,k<.5?l:m,.6);particles(g,el,x,y,k,big?16:9,seed,big?22:13);
 if(el==='Electro'&&k<.6){for(let i=0;i<3;i++)bolt(g,x,y,x+(rnd(seed+i)-.5)*18,y+(rnd(seed+i+5)-.5)*14,l,seed+i*9)}
 if(el==='Physical'&&k<.5){line(g,x-6*(1-k),y-6*(1-k),x+6*(1-k),y+6*(1-k),'#ffffff');line(g,x-6*(1-k),y+6*(1-k),x+6*(1-k),y-6*(1-k),P.gold)}}
function fx(g,kind,el,k,ctx){const [m,l,d]=col(el),a=ctx.from,b=ctx.to,lerp=(p,q,t)=>p+(q-p)*t,still=ctx.still;let hit=false,strong=false;
 switch(kind){
 case'shield':{const kk=Math.min(1,k*3);for(let i=0;i<6;i++){const a0=i*Math.PI/3+(still?0:k),a1=a0+Math.PI/3;line(g,a.x+Math.cos(a0)*15*kk,a.y-12+Math.sin(a0)*15*kk,a.x+Math.cos(a1)*15*kk,a.y-12+Math.sin(a1)*15*kk,l)}g.globalAlpha=.18*kk;ell(g,a.x,a.y-12,14*kk,14*kk,m);g.globalAlpha=1;if(!still)for(let i=0;i<4;i++){const an=k*6+i*1.6;px(g,a.x+Math.cos(an)*13,a.y-12+Math.sin(an)*13,1,1,'#ffffff')}break}
 case'field':{const kk=Math.min(1,k*2.5);g.globalAlpha=.4*kk;ell(g,a.x,a.y,24*kk,4*kk,m);g.globalAlpha=1;ring(g,a.x,a.y,24*kk,l,.18);for(let i=0;i<10;i++){const yy=a.y-((k*40+i*7)%28);px(g,a.x-20+i*4,yy,1,2,i%2?l:m)}if(k>.4&&k<.7)impact(g,el,b.x,b.y,(k-.4)/.3,77,false);hit=k>.4;break}
 case'arrows':{for(let i=0;i<4;i++){const kk=(k-i*.12)*2.3;if(kk<=0)continue;if(kk<1){const x=lerp(a.x+10,b.x,kk),y=lerp(a.y-14,b.y,kk)-Math.sin(kk*Math.PI)*16;px(g,x-1,y-1,3,3,m);px(g,x,y,1,1,'#ffffff');for(let j=1;j<4;j++)px(g,x-j*3,y+Math.sin((kk-j*.05)*Math.PI)*j*1.5,1,1,j%2?l:d)}else{hit=true;impact(g,el,b.x+(i-1.5)*3,b.y-(i%2)*4,Math.min(1,(kk-1)*1.4),i*31,false)}}break}
 case'rain':{for(let i=0;i<3;i++){const an=(still?i:k*10)+i*2.1;const x=a.x+Math.cos(an)*14,y=a.y-14+Math.sin(an)*6;line(g,x,y-4,x,y+2,l);px(g,x-1,y-4,3,1,'#ffffff')}if(k>.5){const kk=(k-.5)/.35;for(let i=0;i<3;i++){if(kk<1){const x=lerp(a.x,b.x,kk)+i*4,y=lerp(a.y-18,b.y,kk)-i*3;line(g,x,y,x+4,y+1,l)}}if(kk>=1){hit=true;impact(g,el,b.x,b.y,Math.min(1,(kk-1)*3),5,false);ring(g,b.x,b.y+26,6+(kk-1)*20,m,.25)}}break}
 case'wind':{const kk=Math.min(1,k*1.6);for(let i=0;i<4;i++){const r=4+i*4+(still?0:(k*14)%4);ring(g,b.x,b.y+20-i*12,r,i%2?l:m,.3)}for(let i=0;i<10;i++){const yy=b.y+24-((k*80+i*9)%56),xx=b.x+Math.sin(k*10+i)*8;if(i%3===0)leaf(g,xx,yy,i);else px(g,xx,yy,2,1,i%2?l:m)}g.globalAlpha=.16*kk;px(g,b.x-6,b.y-30,12,58,m);g.globalAlpha=1;hit=k>.3;break}
 case'plunge':{/* the token's leap is placed by the scene; this is the landing */if(k>=.72){const kk=(k-.72)/.28;ring(g,b.x,b.y+26,4+kk*30,l,.3);ring(g,b.x,b.y+26,2+kk*20,m,.3);for(let i=0;i<6;i++)leaf(g,b.x-14+i*6,b.y+20-kk*16-(i%2)*4,i);line(g,b.x,b.y-30,b.x,b.y+20,'rgba(255,255,255,'+(1-kk)+')');hit=true;strong=true}else if(k>.48){const kk=(k-.48)/.24;line(g,b.x,b.y-60,b.x,b.y-60+kk*70,l)}break}
 case'bolt':{const sx=b.x-16,sy=b.y-34;ell(g,sx,sy+(still?0:Math.round(Math.sin(k*20))),2.5,2.5,l);px(g,sx-1,sy-1,1,1,'#ffffff');if(!still){px(g,sx+Math.cos(k*30)*4,sy+Math.sin(k*30)*3,1,1,m)}if(k>.25){hit=true;if(Math.floor(k*18)%3!==2)bolt(g,sx,sy,b.x,b.y,l,Math.floor(k*18));impact(g,el,b.x,b.y,((k-.25)*3)%1,Math.floor(k*6),false)}break}
 case'arc':{const kk=Math.min(1,k*2.2);for(let s=0;s<3;s++){const an0=-2.1,an=an0+2.8*kk;for(let i=0;i<=24*kk;i++){const aa=an0+2.8*kk*i/(24*kk||1);px(g,b.x-4+Math.cos(aa)*(16+s),b.y+Math.sin(aa)*(16+s),1,1,s===1?'#ffffff':l)}}if(kk>=1){hit=true;impact(g,el,b.x,b.y,Math.min(1,(k-.45)*2.2),9,false);for(let i=0;i<5;i++)snow(g,b.x-10+i*5,b.y-12+((k*30+i*4)%20),i%2?'#ffffff':l)}break}
 case'stack':{const n=Math.min(ctx.stacks||6,Math.floor(k*((ctx.stacks||6)+1)));const sx=b.x,sy=b.y-44;line(g,sx,sy-16,sx,sy,'#e9f2ff',3);px(g,sx-3,sy,7,2,P.gold);px(g,sx,sy+2,1,4,'#e9f2ff');px(g,sx-1,sy-17,3,1,'#ffffff');g.globalAlpha=.25;ell(g,sx,sy-8,6,12,l);g.globalAlpha=1;for(let i=0;i<n;i++)px(g,sx-12+(i%10)*3,sy+8+Math.floor(i/10)*3,2,2,i%2?l:m);if(k>.2){hit=Math.floor(k*12)%2===0;if(hit)impact(g,el,b.x+(rnd(Math.floor(k*12))-.5)*8,b.y,(k*12)%1,Math.floor(k*12),false)}break}
 case'detonate':{if(k<.45){const kk=k/.45;const y=lerp(-20,b.y-6,kk*kk);line(g,b.x,y-18,b.x,y,'#ffffff',3);px(g,b.x-3,y,7,2,P.gold);for(let i=1;i<5;i++)px(g,b.x,y-18-i*5,1,3,'rgba(255,255,255,'+(1-i/5)+')')}else{const kk=(k-.45)/.55;hit=true;strong=kk<.5;impact(g,'Physical',b.x,b.y,kk,3,true);impact(g,el,b.x,b.y,Math.min(1,kk*1.3),17,true);if(kk<.25){g.globalAlpha=.35*(1-kk*4);g.fillStyle='#fff6d6';g.fillRect(0,0,g.canvas.width,g.canvas.height);g.globalAlpha=1}}break}
 default:{const kk=Math.min(1,k*1.8);if(kk<1){const x=lerp(a.x+10,b.x,kk),y=lerp(a.y-14,b.y,kk);ell(g,x,y,2.5,2.5,m);px(g,x-1,y-1,1,1,'#ffffff');particles(g,el,x,y,.3,4,Math.floor(k*20),4)}else{hit=true;impact(g,el,b.x,b.y,Math.min(1,(k-.55)*2.4),11,false)}}}
 return{hit,strong}}
/* reaction burst on the buddy: two colours mixing into a ring of sparkles */
function reaction(g,x,y,k,c1,c2){if(k<0||k>1)return;ring(g,x,y,6+k*22,c1,.7);ring(g,x,y,3+k*14,c2,.7);for(let i=0;i<10;i++){const a=i/10*Math.PI*2+k;px(g,x+Math.cos(a)*(8+k*18),y+Math.sin(a)*(8+k*18)*.7,1,1,i%2?c1:c2)}}

/* ================= COMPLETION BANNER ================= */
/* a gold ribbon with a paw medallion and twinkling sparkles. The website writes "Training Complete!" over it. */
function banner(c,t,still){const W=c.width,H=c.height,g=c.getContext('2d');g.imageSmoothingEnabled=false;g.clearRect(0,0,W,H);const cx=W/2,cy=H/2+9;
 for(let i=0;i<14;i++){const a=i/14*Math.PI*2+(still?0:t*.25);const r1=10,r2=Math.min(W,H*3);g.globalAlpha=.10;g.fillStyle=i%2?'#ffd98a':'#f5c451';g.beginPath();g.moveTo(cx,cy);g.lineTo(cx+Math.cos(a)*r2,cy+Math.sin(a)*r2*.45);g.lineTo(cx+Math.cos(a+.12)*r2,cy+Math.sin(a+.12)*r2*.45);g.fill();g.globalAlpha=1}
 const rw=W-40,rh=18,rx=cx-rw/2,ry=cy-rh/2;
 [[rx-14,1],[rx+rw+2,-1]].forEach(([x,dir])=>{px(g,x,ry+4,12,rh,'#a8742a');px(g,x,ry+4,12,1,'#d8a548');for(let i=0;i<5;i++)px(g,dir>0?x+i:x+11-i,ry+4+rh/2-5+i*2,1,2,'rgba(0,0,0,0)')});
 px(g,rx-14,ry+4+rh-1,12,1,'#6e4a1a');px(g,rx+rw+2,ry+4+rh-1,12,1,'#6e4a1a');
 px(g,rx,ry,rw,rh,'#d99b37');px(g,rx,ry,rw,2,'#ffe08a');px(g,rx,ry+rh-2,rw,2,'#9c6a22');px(g,rx,ry+3,rw,1,'#f3c35a');px(g,rx,ry+rh-4,rw,1,'#b8862a');
 const my=ry-9;ell(g,cx,my,9,9,'#7a4f2a');ell(g,cx,my,8,8,'#f5c451');ell(g,cx,my,6,6,'#ffe08a');paw(g,cx,my,'#a8742a',null);
 for(let i=0;i<12;i++){const x=Math.floor(rnd(i+3)*W),y=Math.floor(rnd(i+9)*H),on=still?i%3===0:Math.floor(t*3+i)%4===0;if(!on)continue;px(g,x,y,1,1,'#fff6d6');px(g,x-1,y,1,1,'#ffd98a');px(g,x+1,y,1,1,'#ffd98a');px(g,x,y-1,1,1,'#ffd98a');px(g,x,y+1,1,1,'#ffd98a')}}

window.PPArenaArt={EL,P,col,ground,fore,dummy,dummySprite,DW,DH,hero,heroSprite,HW,HH,fx,impact,reaction,banner,paw,px,ell,ring,line,clear:()=>cache.clear()};
})();
