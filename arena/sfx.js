/* PawPixl Arena: sound effects. Every sound is made in the browser from simple tones and noise (Web Audio), so there
   are no audio files to download and nothing is copied from any game. Sound is OFF until the visitor turns it on,
   the choice and volume are remembered on their device, and the Arena works exactly the same when muted. */
(function(){
'use strict';
const KEY='pp.arena.sfx';
const store={get(){try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){return null}},set(v){try{localStorage.setItem(KEY,JSON.stringify(v))}catch(e){}}};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,+v||0));
const P=Object.assign({on:false,vol:.6},store.get()||{});P.on=!!P.on;P.vol=clamp(P.vol,0,1);
let ctx=null,master=null,noiseBuf=null,voices=0;const last={};
function ensure(){if(ctx)return ctx;const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return null;
 try{ctx=new AC();master=ctx.createGain();master.gain.value=P.vol*.5;const lim=ctx.createDynamicsCompressor();lim.threshold.value=-14;lim.ratio.value=8;master.connect(lim);lim.connect(ctx.destination);
  const n=ctx.sampleRate*.6|0;noiseBuf=ctx.createBuffer(1,n,ctx.sampleRate);const d=noiseBuf.getChannelData(0);let s=1234567;for(let i=0;i<n;i++){s=(s*1103515245+12345)&0x7fffffff;d[i]=s/0x3fffffff-1}}catch(e){ctx=null}
 return ctx}
/* one tone: type, start/end frequency, length, loudness, delay */
function tone(type,f0,f1,dur,g,at){const t=ctx.currentTime+(at||0),o=ctx.createOscillator(),v=ctx.createGain();o.type=type;o.frequency.setValueAtTime(Math.max(20,f0),t);if(f1&&f1!==f0)o.frequency.exponentialRampToValueAtTime(Math.max(20,f1),t+dur);
 v.gain.setValueAtTime(0.0001,t);v.gain.exponentialRampToValueAtTime(Math.max(.0002,g),t+.012);v.gain.exponentialRampToValueAtTime(0.0001,t+dur);o.connect(v);v.connect(master);o.start(t);o.stop(t+dur+.03);voices++;o.onended=()=>{voices--}}
/* a burst of filtered noise: filter type, frequency sweep, length, loudness, delay */
function noise(ft,f0,f1,dur,g,at){const t=ctx.currentTime+(at||0),s=ctx.createBufferSource(),f=ctx.createBiquadFilter(),v=ctx.createGain();s.buffer=noiseBuf;f.type=ft;f.frequency.setValueAtTime(f0,t);if(f1&&f1!==f0)f.frequency.exponentialRampToValueAtTime(Math.max(30,f1),t+dur);
 v.gain.setValueAtTime(0.0001,t);v.gain.exponentialRampToValueAtTime(Math.max(.0002,g),t+.01);v.gain.exponentialRampToValueAtTime(0.0001,t+dur);s.connect(f);f.connect(v);v.connect(master);s.start(t);s.stop(t+dur+.03);voices++;s.onended=()=>{voices--}}
/* each element gets its own short colour on top of a skill or burst */
const EL={
 Pyro(){noise('bandpass',900,2600,.22,.16);tone('sawtooth',180,90,.2,.05)},
 Hydro(){tone('sine',520,980,.14,.12);tone('sine',760,1320,.12,.08,.07);noise('lowpass',1400,500,.16,.05)},
 Cryo(){tone('triangle',1500,2100,.1,.07);tone('triangle',2000,2700,.12,.06,.06);noise('highpass',5200,7000,.1,.04)},
 Electro(){for(let i=0;i<3;i++)tone('square',1200+i*260,300,.045,.05,i*.045);noise('highpass',3500,6000,.12,.05)},
 Anemo(){noise('bandpass',500,2200,.34,.13);tone('sine',660,990,.2,.04)},
 Geo(){tone('sine',130,70,.2,.2);noise('lowpass',420,160,.2,.14)},
 Dendro(){tone('triangle',420,640,.12,.09);tone('triangle',560,840,.14,.07,.08);noise('bandpass',2400,3000,.08,.03)},
 Physical(){noise('bandpass',1800,900,.1,.1)}};
const S={
 click(){tone('square',660,880,.045,.05)},
 select(){tone('triangle',520,780,.07,.08);tone('triangle',780,1040,.08,.06,.05)},
 start(){[392,523,659].forEach((f,i)=>tone('triangle',f,f,.12,.09,i*.08))},
 attack(o){noise('bandpass',2400,700,.09,.14);tone('square',260,140,.07,.05)},
 skill(o){tone('triangle',440,660,.1,.07);(EL[o.el]||EL.Physical)()},
 burst(o){tone('sawtooth',110,220,.34,.06);tone('triangle',330,990,.3,.07);(EL[o.el]||EL.Physical)();tone('sine',880,1320,.2,.05,.18)},
 hit(){tone('sine',150,60,.12,.2);noise('lowpass',900,200,.1,.14)},
 crit(){tone('sine',170,55,.16,.24);noise('lowpass',1400,200,.14,.18);tone('square',1320,1760,.09,.06,.03)},
 heal(){[523,659,784,1047].forEach((f,i)=>tone('sine',f,f,.16,.07,i*.06))},
 shield(){tone('triangle',300,600,.16,.09);tone('sine',1200,1200,.2,.04,.05)},
 buff(){tone('triangle',440,880,.18,.08);tone('sine',1320,1320,.12,.04,.1)},
 debuff(){tone('sawtooth',400,150,.22,.06)},
 reaction(){tone('square',880,1760,.08,.06);tone('triangle',660,1320,.16,.08,.04);noise('highpass',3000,8000,.14,.06)},
 victory(){[523,659,784,1047,784,1047].forEach((f,i)=>tone('triangle',f,f,i===5?.4:.13,.1,i*.11));tone('sine',262,262,.7,.05)},
 defeat(){[392,330,262,196].forEach((f,i)=>tone('triangle',f,f*.97,.24,.08,i*.2))},
 error(){tone('square',180,150,.09,.06);tone('square',150,130,.1,.06,.1)}};
function play(name,opt){if(!P.on||!S[name])return false;if(!ensure())return false;try{if(ctx.state==='suspended')ctx.resume()}catch(e){}
 const now=Date.now();if(last[name]&&now-last[name]<70)return false;/* multi-hit moves don't stack the same sound */if(voices>14)return false;last[name]=now;
 try{S[name](opt||{})}catch(e){return false}return true}
const api={play,names:()=>Object.keys(S),on:()=>P.on,vol:()=>P.vol,supported:()=>!!(window.AudioContext||window.webkitAudioContext),
 setOn(v){P.on=!!v;store.set(P);if(P.on){ensure();try{ctx&&ctx.resume()}catch(e){}}return P.on},
 setVol(v){P.vol=clamp(v,0,1);store.set(P);if(master)master.gain.value=P.vol*.5;return P.vol}};
window.PPSfx=api;
})();
