const {chromium}=require('playwright');
const D=require('os').tmpdir()+'/';
const FILE=process.argv[2]||'file://'+require('path').join(__dirname,'..','..','www','index.html');
(async()=>{
  const b=await chromium.launch(); const ctx=await b.newContext({viewport:{width:480,height:900}}); const p=await ctx.newPage();
  const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
  await p.goto(FILE);
  // v0.3 save migrates
  await p.evaluate(()=>localStorage.setItem('chaiwala-tycoon-save',JSON.stringify({v:3,state:{day:12,cash:6000,rep:77,lots:{tea:[{qty:300,age:2,cost:0.4}],milk:[],sugar:[]},recipe:{strength:3,sweetness:2,milk:60},price:12,totalCups:900,restarts:0,lastReport:null,daySeed:9,weather:'rain',forecast:'rain',loc:'street',unlockedLocs:['street','station'],upgrades:{kettle:2},cupsOwned:['paper','glass'],cup:'glass',loyalty:{station:3}}})));
  await p.reload();
  console.log('v3 save migrated:',JSON.stringify(await p.evaluate(()=>({day:state.day,cash:state.cash,menu:state.menu,staff:state.staff,hasSnackLots:!!state.lots.pakoda}))));
  // force an inspector event
  await p.evaluate(()=>{ state.event={id:'inspector',left:1,choice:null}; renderPrepare(); });
  console.log('open disabled while pending:',await p.evaluate(()=>document.querySelector('[data-act=open]').disabled));
  await p.evaluate(()=>window.scrollTo(0,0)); await p.screenshot({path:D+'v4_event.png'});
  await p.click('[data-act=evchoice][data-i="1"]');
  console.log('after bribe:',JSON.stringify(await p.evaluate(()=>({cash:state.cash,bribes:state.bribes,pending:eventPending(state)}))));
  // menu tab: unlock masala, cutting, pakoda, lassi; buy pakoda stock
  await p.click('[data-act=tab][data-tab=menu]');
  for (const id of ['masala','cutting','pakoda','lassi']) await p.click(`[data-act=menuUnlock][data-id=${id}]`);
  await p.click('[data-act=buy][data-item=pakoda][data-packs="3"]'); await p.click('[data-act=snackprice][data-id=pakoda][data-dir="1"]');
  await p.evaluate(()=>window.scrollTo(0,0)); await p.screenshot({path:D+'v4_menu.png',fullPage:true});
  console.log('menu:',JSON.stringify(await p.evaluate(()=>({menu:state.menu,pakoda:state.stock.pakoda,price:state.snackPrice.pakoda,cash:Math.round(state.cash)}))));
  // staff
  await p.click('[data-act=tab][data-tab=shop]'); await p.click('[data-act=staff][data-id=helper]'); await p.click('[data-act=staff][data-id=manager]');
  await p.evaluate(()=>window.scrollTo(0,document.body.scrollHeight)); await p.screenshot({path:D+'v4_staff.png'});
  console.log('staff:',JSON.stringify(await p.evaluate(()=>state.staff)));
  // today tab: spice stepper present, auto-stock on, go to station and open
  await p.click('[data-act=tab][data-tab=today]'); await p.click('[data-act=recipe][data-key=spice][data-dir="1"]'); await p.click('[data-act=auto]'); await p.click('[data-act=loc][data-id=station]');
  await p.evaluate(()=>window.scrollTo(0,0)); await p.screenshot({path:D+'v4_today.png',fullPage:true});
  await p.click('[data-act=open]'); await p.waitForTimeout(700); await p.screenshot({path:D+'v4_run.png'});
  await p.click('[data-act=skip]'); await p.waitForSelector('[data-act=next]',{timeout:8000}); await p.screenshot({path:D+'v4_report.png',fullPage:true});
  console.log('report:',await p.evaluate(()=>[...document.querySelectorAll('.table tr')].map(r=>r.innerText.replace(/\s+/g,' ')).join(' | ')));
  console.log('tags:',await p.evaluate(()=>[...document.querySelectorAll('.card .tags .tag')].map(t=>t.innerText).join(' ; ')));
  await p.reload(); console.log('after reload:',JSON.stringify(await p.evaluate(()=>({day:state.day,staff:state.staff,menu:state.menu.length,auto:state.autoStock}))));
  console.log('page errors:',errs.length?errs:'none'); await b.close();
})();
