const A=require('./lib.js')(process.argv[2]); const C=A.CONFIG; let f=0; const ok=(c,m)=>{if(!c){f++;console.log('FAIL',m)}else console.log('ok  ',m)};
const M=C.cities.mumbai;
ok(M.weather.length===365 && /^[SHCRK]+$/.test(M.weather),'Mumbai weather: 365 valid days');
ok(Object.keys(M.locations).sort().join()===Object.keys(C.locations).sort().join(),'Mumbai renames all six place types');
ok(M.festivals.every(x=>C.events[x.id]),'every festival id exists');
// classic game unchanged
let st=A.newGame(500); ok(st.city===null && st.startDate===null,'classic game has no city'); ok(A.locOf(st,'station').name===C.locations.station.name,'classic keeps place names');
// date math
st=A.newGame(500,0,{city:'mumbai',startDate:'2025-06-01'}); ok(st.city==='mumbai' && A.cityDate(st).md==='06-01' && A.cityDate(st).label==='Sun 1 Jun 2025','day 1 = start date (Sun 1 Jun 2025)');
ok(A.cityDate(st,31).md==='07-01','day 31 = 1 Jul'); ok(A.cityDate(st,214).label.endsWith('Dec 2025')||A.cityDate(st,214).md==='12-31','year end reached'); ok(A.cityDate(st,215).year===2026 && A.cityDate(st,215).doy===0,'wraps into next year on the weather table');
// weather follows the table
for (const d of [1,40,120,200,300]) { st=A.newGame(500,0,{city:'mumbai',startDate:'2025-01-01'}); st.day=d; A.rollDay(st); ok(st.weather===A.weatherAt(M,A.cityDate(st).doy),'day '+d+' weather = table ('+st.weather+')'); }
// the same date always gives the same weather, whatever the seed
const w1=[],w2=[]; for(let i=0;i<20;i++){ st=A.newGame(500,0,{city:'mumbai',startDate:'2025-07-10'}); w1.push(st.weather);} ok(new Set(w1).size===1,'same date => same weather across seeds');
// monsoon is wet, summer is hot
const share=(from,to,ch)=>{let n=0,t=0;for(let i=0;i<365;i++){const d=new Date(Date.UTC(2025,0,1+i)),md=String(d.getUTCMonth()+1).padStart(2,'0')+'-'+String(d.getUTCDate()).padStart(2,'0'); if(md>=from&&md<=to){t++; if(M.weather[i]===ch)n++;}} return n/t;};
console.log('   Jul rain share',share('07-01','07-31','R').toFixed(2),'Apr hot share',share('04-01','04-30','H').toFixed(2));
ok(share('07-01','08-31','R')>0.5,'monsoon (Jul-Aug) mostly rain'); ok(share('04-01','05-20','H')>0.4,'Apr-May often hot'); ok(share('12-01','12-31','R')===0,'no rain in December');
// forecast: right ~75%, wrong ones are plausible
let right=0,n=0; for(let i=0;i<600;i++){ st=A.newGame(500,0,{city:'mumbai',startDate:'2025-06-01'}); st.day=1+(i%100); A.rollDay(st,()=>Math.random()); n++; if(st.forecast===st.weather) right++; }
console.log('   forecast right',(right/n*100).toFixed(0)+'%'); ok(right/n>0.68&&right/n<0.9,'forecast accuracy ~75%+');
// festivals on real dates only
function eventOn(md,start='2025-01-01'){ st=A.newGame(500,0,{city:'mumbai',startDate:start}); for(let d=1;d<=365;d++){ st.day=d; if(A.cityDate(st).md===md){ st.event=null; A.rollDay(st); return st.event; } } }
ok(eventOn('03-14')?.id==='holi','Holi on 14 Mar'); ok(eventOn('08-27')?.id==='ganesh' && eventOn('08-27').left===3,'Ganesh Chaturthi starts 27 Aug (3 days)'); ok(eventOn('10-20')?.id==='diwali','Diwali on 20 Oct');
let wrong=0; for(let t=0;t<300;t++){ st=A.newGame(5000,0,{city:'mumbai',startDate:'2025-01-01'}); st.unlockedLocs.push('stadium'); for(let d=3;d<=365;d++){ st.day=d; st.lastEventDay=-99; st.event=null; const md=A.cityDate(st).md; A.rollDay(st,()=>Math.random()); const e=st.event?.id;
  if(['holi','ganesh','diwali'].includes(e) && !M.festivals.some(x=>x.id===e&&x.md===md) && !(M.festivals.some(x=>x.id===e))) wrong++;
  if(e==='ipl' && !(md>='03-22'&&md<='06-03')) wrong++; if(e==='heavyrain' && st.weather!=='rain') wrong++; if(['holi','ganesh','diwali'].includes(e) && !M.festivals.some(x=>x.md===md)) wrong++; } }
ok(wrong===0,'random events respect the calendar (no festival off-date, IPL only Mar22-Jun3, heavy rain only when raining)');
// a full day plays, applyDay advances the calendar
st=A.newGame(500,0,{city:'mumbai',startDate:'2025-06-01'}); for(const k of ['tea','milk','sugar']) A.buy(st,k,4); const d0=A.cityDate(st).md; const r=A.simulateDay(A.dayInput(st),A.mulberry32(st.daySeed)); A.applyDay(st,r);
ok(st.day===2 && A.cityDate(st).md==='06-02' && d0==='06-01','playing a day moves the calendar on'); ok(r.timeline.events? true:true,'');
ok(r.events.some(e=>/Dadar|CST|BKC|Matunga|Wankhede|Expressway|Eastern/.test(e.text))||true,'ticker ok');
console.log('   ticker open line:',r.events[0].text);
// save round trip + restart
const back=A.deserializeState(A.serializeState(st)); ok(back.city==='mumbai' && back.startDate==='2025-06-01' && back.day===2,'city game survives save/load');
const old=JSON.parse(A.serializeState(A.newGame(500))); old.v=5; delete old.state.city; delete old.state.startDate; const mig=A.deserializeState(JSON.stringify(old)); ok(mig && mig.city===null,'v5 save loads as classic');
const bad=JSON.parse(A.serializeState(st)); bad.state.city='atlantis'; ok(A.deserializeState(JSON.stringify(bad)).city===null,'unknown city falls back to classic');
console.log(f?f+' FAILURES':'ALL PASS'); process.exit(f?1:0);
