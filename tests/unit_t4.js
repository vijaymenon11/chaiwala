const A=require('./lib.js')(process.argv[2]); const C=A.CONFIG; let fails=0;
const ok=(c,m)=>{ if(!c){fails++;console.log('FAIL',m);} else console.log('ok  ',m); };
const bigStock=()=>{const o={};for(const k of Object.keys(A.newGame(1).stock)) o[k]=1e6;return o;};
function day(st,opts={}){ const inp=A.dayInput(st); inp.stock=bigStock(); if(opts.weather) inp.weather=opts.weather; return A.simulateDay(inp,A.mulberry32(opts.seed||7)); }
function avg(fn,n=25){let s=0;for(let i=0;i<n;i++)s+=fn(i);return s/n;}

// ---------- events
let st=A.newGame(5000); st.unlockedLocs.push('stadium');
const seen={}; for(let i=0;i<4000;i++){ const s=A.newGame(5000); s.day=3+(i%30); s.lastEventDay=-99; s.unlockedLocs=['street','stadium']; A.rollDay(s,()=>Math.random()); if(s.event) seen[s.event.id]=(seen[s.event.id]||0)+1; }
console.log('   event mix over 4000 mornings:',JSON.stringify(seen));
ok(!seen.scandal,'scandal never rolled randomly'); ok(Object.keys(seen).length>=8,'many different events appear');
const none=A.newGame(500); ok(!none.event,'no event on day 1');
// season-limited
let bad=0; for(let i=0;i<3000;i++){ const s=A.newGame(5000); s.day=1+(i%10); s.lastEventDay=-99; A.rollDay(s); if(s.event&&['ganesh','heavyrain'].includes(s.event.id)) bad++; } ok(bad===0,'monsoon events never in winter');
// ipl needs stadium
bad=0; for(let i=0;i<3000;i++){ const s=A.newGame(5000); s.day=10; s.lastEventDay=-99; A.rollDay(s); if(s.event&&s.event.id==='ipl') bad++; } ok(bad===0,'IPL needs the stadium');
// inspector choice
let s1=A.newGame(1000); s1.event={id:'inspector',left:1,choice:null}; ok(A.eventPending(s1),'inspector pending'); ok(A.resolveEvent(s1,0)&&s1.cash===850&&!A.eventPending(s1)&&s1.honestFines===1,'pay fine: -150, no longer pending');
let s2=A.newGame(1000); s2.event={id:'inspector',left:1,choice:null}; A.resolveEvent(s2,1); ok(s2.cash===940&&s2.bribes===1,'bribe: -60 and bribes=1');
ok(!A.resolveEvent(s2,0),'cannot choose twice'); let s3=A.newGame(100); s3.event={id:'inspector',left:1,choice:null}; ok(!A.resolveEvent(s3,0)&&A.eventPending(s3),'cannot afford fine -> still pending');
// scandal after bribe
let sc=0; for(let i=0;i<2000;i++){ const s=A.newGame(5000); s.day=20; s.bribes=2; s.lastEventDay=-99; A.rollDay(s,()=>Math.random()); if(s.event&&s.event.id==='scandal'){sc++; if(!(s.cash<=4750+1e-9&&s.bribes===0)) {fails++;console.log('FAIL scandal effects');break;}} }
console.log('   scandal chance with 2 bribes ≈',(sc/2000*100).toFixed(1)+'% (random events also compete)'); ok(sc>40,'bribes eventually cause a scandal');
// multi-day event persists
let m=A.newGame(500); m.day=10; m.event={id:'milk_hike',left:3,choice:null}; A.rollDay(m); ok(m.event&&m.event.id==='milk_hike'&&m.event.left===2,'milk hike continues (2 left)'); m.day++; A.rollDay(m); ok(m.event.left===1,'1 left'); 
// milk price hike affects buy cost
let ph=A.newGame(500); ph.event={id:'milk_hike',left:1}; ok(A.priceMult(ph,'milk')===1.5&&A.priceMult(ph,'tea')===1,'price mult only on milk'); A.buy(ph,'milk',1); ok(ph.cash===455,'milk pack costs 45 during hike'); ok(Math.abs(ph.lots.milk[0].cost-0.09)<1e-9,'lot remembers the hiked unit price');
// event fx
let f=A.newGame(500); f.event={id:'strike',left:1}; f.loc='station'; ok(A.eventFx(f).footfall===0.3,'strike: station 0.3'); f.loc='street'; ok(A.eventFx(f).footfall===1.05,'strike: street 1.05 (all)');
let hr=A.newGame(500); hr.day=22; hr.event=null; // force heavy rain
hr.event={id:'heavyrain',left:1}; ok(A.eventFx(hr,'street').footfall===0.7&&A.eventFx(hr,'office').footfall===1.1,'heavy rain per place');
// event changes real sales
const base=avg(i=>{const s=A.newGame(500); s.event=null; return day(s,{seed:i}).cups;}); const fest=avg(i=>{const s=A.newGame(500); s.event={id:'diwali',left:1}; return day(s,{seed:i}).cups;});
console.log('   cups/day: normal',base.toFixed(0),'Diwali',fest.toFixed(0)); ok(fest>base*1.1,'Diwali increases sales');
const ipl=avg(i=>{const s=A.newGame(500); s.unlockedLocs.push('stadium'); s.loc='stadium'; s.event={id:'ipl',left:1}; s.upgrades.kettle=3; s.upgrades.stove=3; return day(s,{seed:i}).cups;}); const stad=avg(i=>{const s=A.newGame(500); s.unlockedLocs.push('stadium'); s.loc='stadium'; s.upgrades.kettle=3; s.upgrades.stove=3; return day(s,{seed:i}).cups;});
console.log('   stadium cups: normal day',stad.toFixed(0),' IPL day',ipl.toFixed(0)); ok(ipl>stad*5,'IPL day is huge at the stadium');
// blogger
let bl=A.newGame(500); bl.event={id:'blogger',left:1}; let r=day(bl); const rep0=bl.rep; r.avgSat=0.9; r.cups=30; A.applyDay(bl,r); ok(bl.rep>rep0+7,'blogger good review raises rep'); 

// ---------- cutting chai
const noCut=day((()=>{const s=A.newGame(500); s.price=14; return s;})()); const withCut=day((()=>{const s=A.newGame(500); s.price=14; s.menu=['cutting']; return s;})());
console.log('   ₹14 street: no cutting cups',noCut.cups,'exp',noCut.tooExpensive,'| with cutting cups',withCut.cups,'half',withCut.halfCups,'exp',withCut.tooExpensive,'cut price',withCut.cutPrice);
ok(withCut.cups>noCut.cups&&withCut.halfCups>0,'cutting recovers customers who found it too dear'); ok(withCut.used.tea<withCut.cups*3-0.1,'half cups use less tea');
ok(withCut.profit>noCut.profit-1,'cutting does not hurt profit');
// ---------- snacks
const sn=(w,ids)=>{const s=A.newGame(500); s.menu=ids; return day(s,{weather:w});};
const pr=sn('rain',['pakoda']), ph2=sn('hot',['pakoda']); console.log('   pakoda sold: rain',pr.snacksSold.pakoda||0,'hot',ph2.snacksSold.pakoda||0,' | lassi hot',(sn('hot',['lassi']).snacksSold.lassi||0),'rain',(sn('rain',['lassi']).snacksSold.lassi||0));
ok((pr.snacksSold.pakoda||0)>(ph2.snacksSold.pakoda||0)*2,'pakoda sells far better in rain'); ok((sn('hot',['lassi']).snacksSold.lassi||0)>(sn('rain',['lassi']).snacksSold.lassi||0),'lassi sells far better when hot');
ok(pr.snackRevenue>0&&pr.revenue>=pr.snackRevenue,'snack revenue counted in revenue');
let s0=A.newGame(500); s0.menu=['samosa']; const inp0=A.dayInput(s0); inp0.stock={...inp0.stock,tea:1e5,milk:1e6,sugar:1e5,samosa:0}; const r0=A.simulateDay(inp0,A.mulberry32(3)); ok(!(r0.snacksSold.samosa>0),'no snack sales without snack stock');
// snack stock spoils overnight; consumption through lots
let sp=A.newGame(2000); A.unlockMenu(sp,'samosa'); A.buy(sp,'samosa',2); ok(sp.stock.samosa===20,'bought 20 samosas'); const lost=A.ageStock(sp); A.refreshStock(sp); ok(lost.qty.samosa===20&&sp.stock.samosa===0&&Math.abs(lost.cost-120)<1e-6,'samosas spoil after 1 day, ₹120 lost');
// biscuit lasts
let bs=A.newGame(2000); A.unlockMenu(bs,'biscuit'); A.buy(bs,'biscuit',1); A.ageStock(bs); A.refreshStock(bs); ok(bs.stock.biscuit===10,'biscuits keep');
ok(!A.unlockMenu(A.newGame(100),'pakoda'),'cannot unlock without cash');
// ---------- masala
const sM=(sp)=>{const s=A.newGame(500); s.menu=['masala']; s.recipe.spice=sp; s.loc='street'; return day(s);};
const m0=sM(0),m2=sM(2); console.log('   masala: sat spice0',m0.avgSat.toFixed(3),'spice2',m2.avgSat.toFixed(3),'| masala used',m2.used.masala.toFixed(0),'g');
ok(m2.avgSat>m0.avgSat,'matching masala improves satisfaction'); ok(m2.used.masala>0&&m0.used.masala===0,'masala consumed only when used');
const noMenu=A.newGame(500); noMenu.recipe.spice=3; ok(A.dayInput(noMenu).recipe.spice===0,'spice ignored until Masala chai unlocked');
// tourists & uncles disagree on masala (feedback)
let sT=A.newGame(500); sT.menu=['masala']; sT.recipe.spice=0; sT.loc='street'; const rT=day(sT); console.log('   feedback @spice0:',rT.feedback.filter(x=>/masala/.test(x)));
// ---------- staff
let sf=A.newGame(5000); ok(A.perksOf(sf).batch===1&&A.perksOf(sf).serviceMin===5,'no staff'); ok(A.toggleStaff(sf,'helper')&&A.perksOf(sf).batch===2,'helper +1 batch'); A.toggleStaff(sf,'cook'); ok(Math.abs(A.perksOf(sf).serviceMin-4)<1e-9,'cook x0.8'); ok(A.wagesOf(sf)===180,'wages 70+110');
ok(!A.toggleStaff(sf,'manager'),'manager needs rep 60'); sf.rep=65; ok(A.toggleStaff(sf,'manager')&&A.wagesOf(sf)===380,'manager hired'); A.toggleStaff(sf,'manager'); ok(!sf.staff.manager&&!sf.autoStock,'manager can be let go');
const noSt=A.newGame(5000), withSt=A.newGame(5000); A.toggleStaff(withSt,'helper'); A.toggleStaff(withSt,'cook'); withSt.loc=noSt.loc='station'; noSt.rep=withSt.rep=70;
const rn=day(noSt), rw=day(withSt); console.log('   station cups: no staff',rn.cups,'helper+cook',rw.cups); ok(rw.cups>rn.cups,'staff serve more people');
let wg=A.newGame(5000); A.toggleStaff(wg,'helper'); const rr=day(wg); const cash0=wg.cash; A.applyDay(wg,rr); ok(rr.wages===70&&Math.abs(wg.cash-(cash0+rr.revenue-rr.rent-rr.cupCostTotal-70))<1e-6,'wages paid from cash in applyDay'); ok(Math.abs(rr.profit-(rr.revenue-rr.cogs-rr.rent-rr.spoiledCost-70))<1e-6,'profit includes wages');
// ---------- manager
let mg=A.newGame(2000); mg.rep=70; A.toggleStaff(mg,'manager'); mg.menu=['samosa']; const spent=A.managerStock(mg); console.log('   manager spent',Math.round(spent),'of',2000,'cash; stock',JSON.stringify(Object.fromEntries(Object.entries(mg.stock).filter(([k,v])=>v>0).map(([k,v])=>[k,Math.round(v)]))));
ok(spent>0&&spent<=2000*C.managerBudget+1,'manager buys within budget'); ok(A.stockCups(mg.stock,mg.recipe)>=20,'manager stocks enough for a normal day');
let poor=A.newGame(60); poor.rep=70; poor.staff.manager=true; A.managerStock(poor); ok(poor.cash>=0,'manager never overdraws');
// ---------- migration from v3 save
const v3={v:3,state:{day:12,cash:2222,rep:77,lots:{tea:[{qty:300,age:2,cost:0.4}],milk:[],sugar:[]},recipe:{strength:3,sweetness:2,milk:60},price:12,totalCups:900,restarts:0,lastReport:null,daySeed:9,weather:'cold',forecast:'cold',loc:'station',unlockedLocs:['street','station'],upgrades:{kettle:2},cupsOwned:['paper','glass'],cup:'glass',loyalty:{station:3}}};
const mig=A.deserializeState(JSON.stringify(v3)); ok(mig&&mig.day===12&&mig.loc==='station'&&mig.menu.length===0&&mig.staff&&mig.lots.pakoda&&mig.lots.masala&&mig.recipe.spice===0,'v3 save migrates to v4'); ok(mig.stock.tea===300,'stock totals rebuilt');
const rt=A.deserializeState(A.serializeState(withSt)); ok(rt&&rt.staff.helper&&rt.staff.cook,'v4 round trip');
console.log(fails?`\n${fails} FAILURES`:'\nALL v0.4 LOGIC TESTS PASSED');
