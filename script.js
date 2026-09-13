
const q=(s,r=document)=>r.querySelector(s); const qa=(s,r=document)=>[...r.querySelectorAll(s)];
const de=(n,d=2)=>Number.isFinite(n)?new Intl.NumberFormat('de-DE',{maximumFractionDigits:d,minimumFractionDigits:0}).format(n):'–';
const money=n=>Number.isFinite(n)?new Intl.NumberFormat('de-DE',{style:'currency',currency:'EUR'}).format(n):'–';
function val(n){const e=q(`[name="${n}"]`); if(!e)return NaN; if(e.tagName==='SELECT')return e.value; const s=String(e.value).trim().replace(/\s/g,'').replace(',','.'); return s===''?NaN:Number(s)}
function set(id,value,unit='',digits=2){const el=q(`[data-result="${id}"]`); if(!el)return; if(typeof value==='string'){el.textContent=value;return;} let t= unit==='€'?money(value):de(value,digits)+(unit?` ${unit}`:''); el.textContent=t}
function gcd(a,b){a=Math.abs(Math.round(a));b=Math.abs(Math.round(b));while(b){[a,b]=[b,a%b]}return a||1}
function compute(id){
 try{
 switch(id){
 case'prozentwert':set('r',val('g')*val('p')/100);break;
 case'prozentsatz':set('r',val('w')/val('g')*100,'%',2);break;
 case'prozent-aenderung':set('r',(val('b')-val('a'))/val('a')*100,'%',2);break;
 case'dreisatz':set('r',val('b')*val('c')/val('a'));break;
 case'mittelwert':{let xs=['a','b','c','d','e'].map(val).filter(Number.isFinite);set('r',xs.reduce((a,b)=>a+b,0)/xs.length);break}
 case'verhaeltnis':{let a=val('a'),b=val('b'),g=gcd(a,b);set('r',`${Math.round(a/g)} : ${Math.round(b/g)}`);break}
 case'rabatt':{let p=val('preis'),r=val('rabatt');set('end',p*(1-r/100),'€');set('ersparnis',p*r/100,'€');break}
 case'mwst':{let n=val('netto'),s=val('satz'),st=n*s/100;set('steuer',st,'€');set('brutto',n+st,'€');break}
 case'marge':{let ek=val('ek'),vk=val('vk'),d=vk-ek;set('marge',d/vk*100,'%');set('aufschlag',d/ek*100,'%');break}
 case'break-even':{let fix=val('fix'),p=val('preis'),v=val('variabel'),m=fix/(p-v);set('menge',Math.ceil(m),'Stück',0);set('umsatz',Math.ceil(m)*p,'€');break}
 case'zinseszins':{let k=val('kapital'),z=val('zins')/100,j=val('jahre'),e=k*Math.pow(1+z,j);set('end',e,'€');set('gewinn',e-k,'€');break}
 case'sparplan':{let s=val('start'),r=val('rate'),m=val('zins')/100/12,n=val('jahre')*12,e=m===0?s+r*n:s*Math.pow(1+m,n)+r*((Math.pow(1+m,n)-1)/m);set('end',e,'€');set('ein',s+r*n,'€');set('gewinn',e-s-r*n,'€');break}
 case'kreditrate':{let k=val('betrag'),m=val('zins')/100/12,n=val('jahre')*12,r=m===0?k/n:k*m*Math.pow(1+m,n)/(Math.pow(1+m,n)-1),g=r*n;set('rate',r,'€');set('gesamt',g,'€');set('zinsen',g-k,'€');break}
 case'sparziel':{let ziel=val('ziel'),s=val('start'),m=val('zins')/100/12,n=val('jahre')*12,r=m===0?(ziel-s)/n:(ziel-s*Math.pow(1+m,n))*m/(Math.pow(1+m,n)-1);set('rate',r,'€');break}
 case'stromkosten':{let k=val('watt')/1000*val('stunden'),p=val('preis'),t=val('tage');set('kwhd',k,'kWh');set('tag',k*p,'€');set('monat',k*p*t/12,'€');set('jahr',k*p*t,'€');break}
 case'standby':{let k=val('watt')/1000*24*365;set('kwh',k,'kWh');set('kosten',k*val('preis'),'€');break}
 case'energie-kosten':set('kosten',val('kwh')*val('preis'),'€');break;
 case'wirkungsgrad':{let n=val('nutz'),z=val('zu');set('eta',n/z*100,'%');set('verlust',z-n,'kWh');break}
 case'pv-ertrag':{let e=val('kwp')*val('spez');set('jahr',e,'kWh');set('monat',e/12,'kWh');break}
 case'pv-amortisation':set('jahre',val('invest')/val('ersparnis'),'Jahre');break;
 case'waerme-kosten':{let e=val('kwh')/(val('eta')/100);set('energie',e,'kWh');set('kosten',e*val('preis'),'€');break}
 case'akku-laufzeit':{let wh=val('ah')*val('v')*val('eta')/100;set('wh',wh,'Wh');set('h',wh/val('w'),'h');break}
 case'spritkosten':{let l=val('km')*val('verbrauch')/100;set('liter',l,'l');set('kosten',l*val('preis'),'€');break}
 case'verbrauch':set('v',val('liter')/val('km')*100,'l/100 km');break;
 case'fahrtkosten':set('pro',val('kosten')/val('personen'),'€');break;
 case'eauto-laden':{let k=val('km')*val('verbrauch')/100*(1+val('verlust')/100);set('kwh',k,'kWh');set('kosten',k*val('preis'),'€');break}
 case'auto-vergleich':{let a=val('l')*val('lp'),b=val('kwh')*val('kp');set('ice',a,'€');set('ev',b,'€');set('diff',a-b,'€');break}
 case'kosten-pro-km':{let g=val('fix')+val('variabel');set('pro',g/val('km'),'€/km',3);set('gesamt',g,'€');break}
 case'reisezeit':{let h=val('km')/val('v');set('h',h,'h');let min=Math.round(h*60),hh=Math.floor(min/60),mm=min%60;set('text',`${hh} h ${mm} min`);break}
 case'ohmsches-gesetz':{let u=val('u'),i=val('i');set('r',u/i,'Ω');set('p',u*i,'W');break}
 case'leistung-dc':set('p',val('u')*val('i'),'W');break;
 case'drehstrom':set('p',Math.sqrt(3)*val('u')*val('i')*val('cos')/1000,'kW');break;
 case'spannungsteiler':{let u=val('uin'),r1=val('r1'),r2=val('r2');set('uout',u*r2/(r1+r2),'V');set('i',u/(r1+r2)*1000,'mA');break}
 case'widerstand-serie':set('r',['r1','r2','r3','r4'].map(val).filter(Number.isFinite).reduce((a,b)=>a+b,0),'Ω');break;
 case'widerstand-parallel':{let rs=['r1','r2','r3','r4'].map(val).filter(x=>Number.isFinite(x)&&x>0);set('r',1/rs.reduce((a,r)=>a+1/r,0),'Ω');break}
 case'elektrische-energie':{let wh=val('p')*val('h');set('wh',wh,'Wh');set('kwh',wh/1000,'kWh');break}
 case'frequenz-periode':set('t',1000/val('f'),'ms');break;
 case'kondensator-energie':set('e',.5*val('c')*1e-6*Math.pow(val('u'),2),'J',4);break;
 case'geschwindigkeit':set('v',val('s')/val('t'),'km/h');break;
 case'beschleunigung':set('a',(val('v2')-val('v1'))/val('t'),'m/s²');break;
 case'kraft':set('f',val('m')*val('a'),'N');break;
 case'arbeit':set('w',val('f')*val('s'),'J');break;
 case'mechanische-leistung':set('p',val('w')/val('t'),'W');break;
 case'drehmoment-leistung':set('kw',val('m')*2*Math.PI*val('n')/60/1000,'kW');break;
 case'druck':{let p=val('f')/val('a');set('pa',p,'Pa');set('bar',p/100000,'bar');break}
 case'dichte':set('rho',val('m')/val('v'),'kg/m³');break;
 case'kinetische-energie':set('e',.5*val('m')*Math.pow(val('v'),2)/1000,'kJ');break;
 case'lageenergie':set('e',val('m')*val('g')*val('h')/1000,'kJ');break;
 case'rechteck':{let a=val('a'),b=val('b');set('f',a*b,'m²');set('u',2*(a+b),'m');set('d',Math.hypot(a,b),'m');break}
 case'kreis':{let r=val('r');set('f',Math.PI*r*r,'m²');set('u',2*Math.PI*r,'m');set('d',2*r,'m');break}
 case'dreieck':set('f',val('g')*val('h')/2,'m²');break;
 case'pythagoras':set('c',Math.hypot(val('a'),val('b')));break;
 case'zylinder':{let r=val('r'),h=val('h');set('v',Math.PI*r*r*h,'m³');set('o',2*Math.PI*r*(r+h),'m²');break}
 case'kugel':{let r=val('r');set('v',4/3*Math.PI*r**3,'m³');set('o',4*Math.PI*r*r,'m²');break}
 case'steigung':{let x=val('h')/val('s');set('p',x*100,'%');set('a',Math.atan(x)*180/Math.PI,'°');break}
 case'laenge-umrechnen':convert('r',val('wert'),val('von'),val('nach'),{mm:.001,cm:.01,m:1,km:1000,in:.0254,ft:.3048,mi:1609.344});break;
 case'flaeche-umrechnen':convert('r',val('wert'),val('von'),val('nach'),{mm2:1e-6,cm2:1e-4,m2:1,ha:1e4,km2:1e6,ft2:.09290304,acre:4046.8564224});break;
 case'volumen-umrechnen':convert('r',val('wert'),val('von'),val('nach'),{ml:.001,l:1,m3:1000,cm3:.001,gal:3.785411784});break;
 case'masse-umrechnen':convert('r',val('wert'),val('von'),val('nach'),{mg:1e-6,g:.001,kg:1,t:1000,lb:.45359237,oz:.028349523125});break;
 case'druck-umrechnen':convert('r',val('wert'),val('von'),val('nach'),{pa:1,kpa:1000,bar:100000,mpa:1e6,psi:6894.757293});break;
 case'energie-umrechnen':convert('r',val('wert'),val('von'),val('nach'),{j:1,kj:1000,wh:3600,kwh:3.6e6,mj:1e6});break;
 case'temperatur':{let x=val('wert'),f=val('von'),t=val('nach'),c=f==='c'?x:f==='f'?(x-32)*5/9:x-273.15,r=t==='c'?c:t==='f'?c*9/5+32:c+273.15;set('r',r);break}
 }
 }catch(e){console.error(e)}
}
function convert(id,x,from,to,map){set(id,x*map[from]/map[to])}
function initCalc(){const root=q('[data-calculator]');if(!root)return;const id=root.dataset.calculator;qa('input,select',root).forEach(el=>el.addEventListener('input',()=>compute(id)));compute(id)}
function initSearch(){const input=q('#search');if(!input)return;const cards=qa('[data-search-card]'),empty=q('#empty');input.addEventListener('input',()=>{let s=input.value.trim().toLowerCase(),shown=0;cards.forEach(c=>{let ok=c.dataset.search.includes(s);c.style.display=ok?'':'none';if(ok)shown++});qa('.category-block').forEach(b=>{b.style.display=qa('[data-search-card]',b).some(c=>c.style.display!=='none')?'':'none'});empty.style.display=shown?'none':'block'});}
document.addEventListener('DOMContentLoaded',()=>{initCalc();initSearch()});
