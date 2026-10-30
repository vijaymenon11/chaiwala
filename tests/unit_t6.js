const A=require('./lib.js')(process.argv[2]); let f=0; const ok=(c,m)=>{if(!c){f++;console.log('FAIL',m)}else console.log('ok  ',m)};
let st=A.newGame(500); const c0=st.cash;
A.buy(st,'tea',2); ok(A.refundablePacks(st,'tea')===2,'2 packs refundable after buying 2');
ok(A.unbuy(st,'tea')&&A.refundablePacks(st,'tea')===1,'undo one'); ok(A.unbuy(st,'tea')&&st.cash===c0&&st.stock.tea===0,'undo both: full refund, no stock'); ok(!A.unbuy(st,'tea'),'nothing left to undo');
// old stock can't be returned
A.buy(st,'sugar',1); st.lots.sugar.forEach(l=>l.age=1); A.refreshStock(st); ok(A.refundablePacks(st,'sugar')===0 && !A.unbuy(st,'sugar'),'yesterday\'s stock is not refundable');
// price-hike purchase refunds what was actually paid
st=A.newGame(500); const base=st.cash; st.event={id:'milk_hike',left:3,choice:null}; A.buy(st,'milk',1); A.unbuy(st,'milk'); ok(Math.abs(st.cash-base)<1e-9,'refund equals price paid (even during a hike)');
// mixing: buy normal, then at hike, undo returns dearest first, no profit
st=A.newGame(500); const b2=st.cash; A.buy(st,'milk',1); st.event={id:'milk_hike',left:3,choice:null}; A.buy(st,'milk',1); A.unbuy(st,'milk'); A.unbuy(st,'milk'); ok(Math.abs(st.cash-b2)<1e-9,'two undos return exactly what was spent');
// leftovers + new: only new packs refundable
st=A.newGame(500); A.buy(st,'tea',1); st.lots.tea.forEach(l=>l.age=1); A.buy(st,'tea',1); ok(A.refundablePacks(st,'tea')===1,'only today\'s pack counts');
console.log(f?f+' FAILURES':'ALL PASS');
