const nf=(n,d=2)=>new Intl.NumberFormat('de-DE',{minimumFractionDigits:d,maximumFractionDigits:d}).format(Number.isFinite(n)?n:0);
const money=n=>new Intl.NumberFormat('de-DE',{style:'currency',currency:'EUR'}).format(Number.isFinite(n)?n:0);
const num=id=>{const el=document.getElementById(id);return el?parseFloat(String(el.value).replace(',','.'))||0:0};
const set=(id,val)=>{const el=document.getElementById(id);if(el)el.textContent=val};
function calc(){
 const type=document.body.dataset.calculator;
 if(type==='strom'){
  const w=num('power'),h=num('hours'),price=num('price'),days=num('days');const kwhDay=w/1000*h;const year=kwhDay*days;
  set('r1',nf(kwhDay)+' kWh');set('r2',money(kwhDay*price));set('r3',money(year*price/12));set('r4',money(year*price));
 }
 if(type==='sprit'){
  const km=num('distance'),cons=num('consumption'),price=num('fuelprice'),people=Math.max(1,num('people'));const liters=km/100*cons,cost=liters*price;
  set('r1',nf(liters)+' l');set('r2',money(cost));set('r3',money(km?cost/km:0)+' / km');set('r4',money(cost/people));
 }
 if(type==='ev'){
  const km=num('distance'),cons=num('consumption'),price=num('price'),loss=num('loss');const battery=km/100*cons,grid=battery*(1+loss/100),cost=grid*price;
  set('r1',nf(battery)+' kWh');set('r2',nf(grid)+' kWh');set('r3',money(cost));set('r4',money(km?cost/km*100:0)+' / 100 km');
 }
 if(type==='ohm'){
  const u=num('voltage'),i=num('current'),r=num('resistance');
  if(u>0&&i>0){set('r1',nf(u/i)+' Ω');set('r2',nf(u*i)+' W');set('r3',nf(u)+' V');set('r4',nf(i)+' A');}
  else if(u>0&&r>0){const c=u/r;set('r1',nf(r)+' Ω');set('r2',nf(u*c)+' W');set('r3',nf(u)+' V');set('r4',nf(c)+' A');}
  else if(i>0&&r>0){const v=i*r;set('r1',nf(r)+' Ω');set('r2',nf(v*i)+' W');set('r3',nf(v)+' V');set('r4',nf(i)+' A');}
  else {set('r1','–');set('r2','–');set('r3','–');set('r4','–');}
 }
}
document.querySelectorAll('input').forEach(i=>i.addEventListener('input',calc));
const y=document.getElementById('year');if(y)y.textContent=new Date().getFullYear();calc();
