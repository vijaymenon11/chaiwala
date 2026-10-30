const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await(await b.newContext({viewport:{width:480,height:900}})).newPage();const e=[];p.on('pageerror',x=>e.push(x.message));
await p.goto('file://'+require('path').join(__dirname,'..','..','www','index.html'));await p.evaluate(()=>{localStorage.setItem('chaiwala-tycoon-settings',JSON.stringify({tutorialDone:true,sfx:false,music:false}))});await p.reload();
const cash=()=>p.evaluate(()=>[Math.round(state.cash),Math.round(state.stock.milk)]);
console.log('start',await cash(), 'undo disabled:',await p.evaluate(()=>document.querySelector('[data-act=unbuy][data-item=milk]').disabled));
await p.click('[data-act=buy][data-item=milk][data-packs="1"]');await p.click('[data-act=buy][data-item=milk][data-packs="1"]');console.log('bought twice',await cash());
await p.click('[data-act=unbuy][data-item=milk]');console.log('undo once',await cash());await p.click('[data-act=unbuy][data-item=milk]');console.log('undo twice',await cash());
console.log('undo disabled again:',await p.evaluate(()=>document.querySelector('[data-act=unbuy][data-item=milk]').disabled));
await p.screenshot({path:require('os').tmpdir()+'/v52_undo.png'});console.log('errors',e.length?e:'none');await b.close();})();
