const {chromium}=require('playwright');
const D=require('os').tmpdir()+'/';
const FILE=process.argv[2]||'file://'+require('path').join(__dirname,'..','..','www','index.html');
(async()=>{
  const b=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']}); const ctx=await b.newContext({viewport:{width:480,height:900}}); const p=await ctx.newPage();
  const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
  await p.goto(FILE);
  console.log('tutorial on first launch:',await p.evaluate(()=>ui.modal));
  await p.screenshot({path:D+'v5_tutorial.png'});
  for(let i=0;i<5;i++) await p.click('[data-act=tutnext]');
  await p.click('#overlay .btn[data-act=closeModal]');
  console.log('closed, tutorialDone:',await p.evaluate(()=>[ui.modal,settings.tutorialDone]));
  await p.reload(); console.log('no tutorial on reload:',await p.evaluate(()=>ui.modal));
  // art gallery: every weather x place, as a contact sheet
  await p.evaluate(()=>{ const W=Object.keys(CONFIG.weathers), L=Object.keys(CONFIG.locations);
    document.body.innerHTML='<div id="g" style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;width:1200px;padding:6px;background:#fff"></div>';
    const g=document.getElementById('g'); let i=0;
    for(const l of L){ const w=W[i++%W.length]; g.innerHTML+=`<div><small>${l} / ${w}</small>${sceneSVG(w,l,null)}</div>`; }
    for(const [w,e] of [['rain','heavyrain'],['sunny','diwali'],['sunny','holi'],['cloudy','mela'],['hot','ipl'],['cold','strike']]) g.innerHTML+=`<div><small>street / ${w} / ${e}</small>${sceneSVG(w,'street',e)}</div>`;
  });
  await p.setViewportSize({width:1230,height:1000}); await p.screenshot({path:D+'v5_gallery.png',fullPage:true});
  await p.setViewportSize({width:480,height:900});
  // real flow
  await p.goto(FILE); await p.evaluate(()=>{ state.cash=9000; state.stats.peakCash=9000; store.save(); renderPrepare(); });
  await p.click('[data-act=settings]'); await p.screenshot({path:D+'v5_settings.png'});
  await p.click('[data-act=toggle][data-key=music]'); console.log('music toggled:',await p.evaluate(()=>settings.music)); await p.click('[data-act=toggle][data-key=sfx]'); console.log('sfx toggled:',await p.evaluate(()=>settings.sfx));
  await p.click('[data-act=toggle][data-key=sfx]'); await p.click('[data-act=toggle][data-key=music]');
  await p.click('#overlay .btn[data-act=closeModal]');
  await p.evaluate(()=>window.scrollTo(0,0)); await p.screenshot({path:D+'v5_today.png'});
  await p.click('[data-act=buy][data-item=tea][data-packs="5"]'); await p.click('[data-act=buy][data-item=milk][data-packs="5"]'); await p.click('[data-act=buy][data-item=sugar][data-packs="5"]');
  await p.evaluate(()=>{ state.weather='rain'; state.forecast='rain'; });
  await p.click('[data-act=open]'); await p.waitForTimeout(1500); await p.screenshot({path:D+'v5_run.png'});
  console.log('rain audio on:',await p.evaluate(()=>!!document.querySelector('.drops')));
  await p.click('[data-act=speed][data-idx="2"]'); await p.waitForTimeout(800);
  await p.screenshot({path:D+'v5_run2.png'});
  await p.click('[data-act=skip]'); await p.waitForSelector('[data-act=next]',{timeout:8000});
  await p.screenshot({path:D+'v5_report.png',fullPage:true});
  console.log('report:',await p.evaluate(()=>({cups:state.lastReport.cups,newAch:state.lastReport.newAch,stats:state.stats})));
  await p.click('[data-act=next]'); await p.click('[data-act=tab][data-tab=records]'); await p.evaluate(()=>window.scrollTo(0,0)); await p.screenshot({path:D+'v5_records.png',fullPage:true});
  console.log('tabs:',await p.evaluate(()=>[...document.querySelectorAll('.nav button')].map(b=>b.textContent.trim())));
  await p.reload(); console.log('persisted:',await p.evaluate(()=>({day:state.day,ach:Object.keys(state.ach),cups:state.stats.cups,music:settings.music})));
  console.log('page errors:',errs.length?errs:'none'); await b.close();
})();
