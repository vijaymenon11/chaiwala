const A=require('./lib.js')(process.argv[2]); const C=A.CONFIG; let fails=0;
const ok=(c,m)=>{ if(!c){fails++;console.log('FAIL',m);} else console.log('ok  ',m); };
// config sanity
const ids=C.achievements.map(a=>a.id); ok(new Set(ids).size===ids.length,'achievement ids unique');
ok(C.achievements.every(a=>a.goal>0&&a.name&&a.desc&&a.emoji&&a.stat),'achievements well-formed');
ok(C.achievements.find(a=>a.stat==='places').goal===Object.keys(C.locations).length,'places goal = number of locations');
ok(C.achievements.find(a=>a.id==='team').goal===Object.keys(C.staff).length,'team goal = number of staff');
// fresh game
let st=A.newGame(500); ok(JSON.stringify(st.ach)==='{}' && st.stats.cups===0,'fresh game has empty records');
// play a day, records update
function play(st){ for(const k of ['tea','milk','sugar']) A.buy(st,k,4); const r=A.simulateDay(A.dayInput(st),A.mulberry32(st.daySeed)); A.applyDay(st,r); return r; }
const r=play(st); ok(st.stats.cups===r.cups && st.stats.days===1,'cups/days recorded'); ok(st.stats.bestProfit===Math.max(0,r.profit),'best profit recorded');
ok(Array.isArray(r.newAch),'report carries newAch');
// unlocking
st=A.newGame(500); st.stats.cups=99; ok(A.checkAchievements(st).length===0,'99 cups: nothing yet'); st.stats.cups=100;
ok(A.checkAchievements(st).join()==='cups100','100 cups unlocks "cups100"'); ok(A.checkAchievements(st).length===0,'no double unlock');
// state-derived stats
st=A.newGame(500); st.unlockedLocs=Object.keys(C.locations); ok(A.checkAchievements(st).includes('places'),'all places unlocks "places"');
st.staff={helper:true,cook:true,manager:true}; ok(A.checkAchievements(st).includes('team'),'full staff unlocks "team"');
st.honestFines=2; ok(A.checkAchievements(st).includes('honest'),'2 honest fines unlock "honest"');
// rain / cutting / snacks stats feed from the report
st=A.newGame(500); A.recordStats(st,{cups:200,weather:'rain',halfCups:120,snacksSold:{pakoda:150,lassi:60},profit:1600,blogger:'good'});
const got=Object.keys(st.ach); for(const id of ['rain','cutting','snacks','viral','bestday','cups100']) ok(got.includes(id),'unlocked '+id);
// save round trip + migration
const t=A.serializeState(st); const back=A.deserializeState(t); ok(back && JSON.stringify(back.ach)===JSON.stringify(st.ach) && back.stats.rainCups===200,'v5 round trip keeps records');
const old=JSON.parse(A.serializeState(A.newGame(500))); old.v=4; delete old.state.stats; delete old.state.ach; Object.assign(old.state,{day:40,cash:12000,totalCups:1500,rep:92});
const mig=A.deserializeState(JSON.stringify(old)); ok(mig && mig.stats.cups===1500 && mig.stats.days===39 && mig.stats.peakCash===12000,'v4 save gets estimated records');
ok(mig.ach.cups1000 && mig.ach.cash10k && mig.ach.famous && mig.ach.days30,'v4 save quietly earns badges it deserves');
ok(!mig.ach.cups5000 && !mig.ach.lakhpati,'... but not ones it has not');
ok(A.deserializeState(JSON.stringify({v:7,state:{}}))===null,'future save version rejected');
console.log(fails?fails+' FAILURES':'ALL PASS'); process.exit(fails?1:0);
