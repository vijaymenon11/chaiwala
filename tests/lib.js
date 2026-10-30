const fs=require('fs');
module.exports=function load(file){
  const js=fs.readFileSync(file||require('path').join(__dirname,'..','www','index.html'),'utf8').match(/<script>([\s\S]*)<\/script>/)[1];
  const logic=js.split('/* ==== LOGIC END')[0];
  const names=[...logic.matchAll(/^(?:function|const|let) ([A-Za-z0-9_]+)/gm)].map(m=>m[1]);
  return new Function(logic+';return {'+[...new Set(names)].join(',')+'};')();
};
