const {chromium}=require('playwright');
const D=require('os').tmpdir()+'/';
const FILE='file://'+require('path').join(__dirname,'..','..','www','index.html');
const HI=/\b(aaj|kharid\w*|doodh|cheeni|patti|dukaan|chahiye|zyada|bhaiya|nahi|mein|ka|ki|ke|hai|hain|din|log|naam|kholo|jagah|daam|saaman|kharab|wapas|becho|bike|kamayi|hisaab|tumhare|aage|chalu|band|gallu|thand|baarish|mausam|chulha|munafa|lagat|abhi|agla|rakho|karo|jao|yahan|swaad|meetha|kadak|feeki|halki|malai\w*|bheed|roz|subah|mangao|naya|khel|shuru|udhaar|shabaash|samajh|kaise|khelein|awaaz|sangeet|tankhwah|chhutti|prachar|saaz)\b/i;
(async()=>{
  const b=await chromium.launch(); let bad=0;
  for (const lang of ['en','hi']) {
    const ctx=await b.newContext({viewport:{width:480,height:900}}); const p=await ctx.newPage(); const errs=[];
    p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
    await p.goto(FILE); await p.evaluate(l=>{localStorage.setItem('chaiwala-tycoon-settings',JSON.stringify({lang:l,tutorialDone:true,sfx:false,music:false}))},lang); await p.reload();
    // a rich state so every tab has content
    await p.evaluate(()=>{ state.cash=20000; state.rep=70; state.menu=['masala','cutting','pakoda','lassi','biscuit']; state.unlockedLocs=Object.keys(CONFIG.locations); state.staff={helper:true,manager:true};
      state.event={id:'inspector',left:1,choice:null}; for(const k of Object.keys(state.stock)) buy(state,k,3); refreshStock(state); renderPrepare(); });
    const texts={};
    for (const tab of ['today','places','menu','shop','records']) { await p.click(`[data-act=tab][data-tab=${tab}]`); texts[tab]=await p.evaluate(()=>document.body.innerText); }
    await p.click('[data-act=settings]'); texts.settings=await p.evaluate(()=>document.body.innerText); await p.click('#overlay .btn[data-act=closeModal]');
    await p.evaluate(()=>{ ui.modal='tutorial'; ui.tutStep=0; renderOverlay(); }); texts.tut0=await p.evaluate(()=>document.getElementById('overlay').innerText); await p.evaluate(()=>{ui.modal=null;renderOverlay();});
    await p.click('[data-act=tab][data-tab=today]'); await p.click('[data-act=evchoice][data-i="0"]'); texts.afterEvent=await p.evaluate(()=>document.body.innerText);
    await p.evaluate(()=>{state.weather='rain'; state.forecast='cloudy';});
    await p.click('[data-act=open]'); await p.waitForTimeout(500); texts.run=await p.evaluate(()=>document.body.innerText);
    await p.click('[data-act=skip]'); await p.waitForSelector('[data-act=next]',{timeout:9000}); texts.report=await p.evaluate(()=>document.body.innerText);
    await p.evaluate(()=>{ state.cash=0; for(const k of Object.keys(state.lots)) state.lots[k]=[]; refreshStock(state); ui.screen='bankrupt'; renderBankrupt(); }); texts.bankrupt=await p.evaluate(()=>document.body.innerText);
    if (lang==='en') for (const [k,t] of Object.entries(texts)) { const hits=[...new Set((t.match(new RegExp(HI,'gi'))||[]).map(x=>x.toLowerCase()))]; if(hits.length){bad++;console.log('EN leftovers in',k,':',hits.join(', '));} }
    else console.log('hi mode sample:',texts.today.split('\n').slice(3,9).join(' | '));
    console.log(lang,'page errors:',errs.length?errs:'none'); await ctx.close();
  }
  // layouts at three sizes, English
  for (const [name,w,h] of [['phone',390,844],['tablet',820,1180],['desktop',1440,900]]) {
    const ctx=await b.newContext({viewport:{width:w,height:h}}); const p=await ctx.newPage(); await p.goto(FILE);
    await p.evaluate(()=>{localStorage.setItem('chaiwala-tycoon-settings',JSON.stringify({tutorialDone:true,sfx:false,music:false}))}); await p.reload();
    await p.evaluate(()=>{ state.cash=20000; state.menu=['masala','cutting','pakoda']; state.unlockedLocs=Object.keys(CONFIG.locations); for(const k of Object.keys(state.stock)) buy(state,k,3); refreshStock(state); renderPrepare(); });
    await p.screenshot({path:D+`v51_${name}_today.png`});
    await p.click('[data-act=tab][data-tab=places]'); await p.screenshot({path:D+`v51_${name}_places.png`});
    await p.click('[data-act=tab][data-tab=today]'); await p.click('[data-act=open]'); await p.waitForTimeout(1200); await p.screenshot({path:D+`v51_${name}_run.png`});
    await p.click('[data-act=skip]'); await p.waitForSelector('[data-act=next]',{timeout:9000}); await p.screenshot({path:D+`v51_${name}_report.png`});
    const ov=await p.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+1); console.log(name,'horizontal overflow:',ov);
    await ctx.close();
  }
  console.log('EN leftover screens:',bad); await b.close();
})();
