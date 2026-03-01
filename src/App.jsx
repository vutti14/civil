import { useState, useRef, useEffect } from "react";

const themes={
  light:{bg:"#f5f3ee",s1:"#ffffff",s2:"#faf8f4",s3:"#f0ede6",bd:"#e2ddd3",bdL:"#cfc9bc",a:"#c8960c",aL:"#f5c842",aBg:"#fdf6e3",t:"#2c2416",tS:"#5c503c",d:"#8c7e6a",dL:"#b0a48e",ok:"#1a8a5c",okBg:"#eefaf4",w:"#c47a1a",wBg:"#fef8ee",e:"#c23a3a",eBg:"#fdf0f0",b:"#1a6e8a",bBg:"#eef6fa",p:"#7c4dbd",pBg:"#f6f0ff",navBg:"#2c2416",navT:"#e8e0d0",navA:"#f5c842",navD:"#8c7e6a",shadow:"0 1px 3px rgba(44,36,22,0.06)",shadowL:"0 4px 16px rgba(44,36,22,0.08)",inputBg:"#faf8f4"},
  dark:{bg:"#0c0e14",s1:"#141820",s2:"#1a1f2c",s3:"#222836",bd:"#2a3040",bdL:"#3a4258",a:"#f5c842",aL:"#ffe07a",aBg:"#f5c84210",t:"#e8e4dc",tS:"#c0b8a8",d:"#6a7088",dL:"#8a90a8",ok:"#3dd68c",okBg:"#3dd68c0c",w:"#f5a842",wBg:"#f5a8420c",e:"#f06060",eBg:"#f060600c",b:"#42b8f5",bBg:"#42b8f50c",p:"#a47cef",pBg:"#a47cef0c",navBg:"#0a0c12",navT:"#c0b8a8",navA:"#f5c842",navD:"#505870",shadow:"0 1px 3px rgba(0,0,0,0.2)",shadowL:"0 4px 16px rgba(0,0,0,0.3)",inputBg:"#141820"}
};
const F=`'Sarabun',system-ui,sans-serif`;
const MO=`'JetBrains Mono',monospace`;
const D=`'Outfit',sans-serif`;

// ═══ ENGINEERING DATA ═══
const BT=[
  {id:"warehouse",l:"โกดัง",ic:"🏭",fl:1,d:"โครงเหล็ก เก็บสินค้า",hasCrane:true,hasMezz:true},
  {id:"showroom",l:"โชว์รูม",ic:"🏪",fl:1,d:"โครงเหล็ก ช่วงกว้าง",hasCrane:false,hasMezz:true},
  {id:"factory",l:"โรงงาน",ic:"⚙️",fl:1,d:"โครงเหล็ก รับเครน",hasCrane:true,hasMezz:true},
  {id:"one_story",l:"อาคาร 1 ชั้น",ic:"🏠",fl:1,d:"คสล./เหล็ก",hasCrane:false,hasMezz:false},
  {id:"two_story",l:"อาคาร 2 ชั้น",ic:"🏢",fl:2,d:"คอนกรีตเสริมเหล็ก",hasCrane:false,hasMezz:false},
];
const ROOF_TYPES=[{id:"gable",l:"หลังคาจั่ว ⛺"},{id:"mono",l:"เพิงหมาแหงน 📐"},{id:"saw",l:"ฟันเลื่อย 📊"},{id:"flat",l:"แบน ▬"}];
const WALL_TYPES=[{id:"metal",l:"เมทัลชีท",w:8,cost:350},{id:"alc",l:"ALC 7.5cm",w:55,cost:650},{id:"brick",l:"อิฐมวลเบา",w:80,cost:550},{id:"precast",l:"Precast",w:120,cost:900},{id:"glass",l:"กระจก",w:30,cost:1800}];
const ROOF_SHEETS=[{id:"metal035",l:"เมทัลชีท 0.35mm",w:5,cost:180},{id:"metal047",l:"เมทัลชีท 0.47mm",w:7,cost:250},{id:"sandwich",l:"แซนวิชพาเนล",w:12,cost:550},{id:"insul",l:"เมทัลชีท+ฉนวน",w:9,cost:380}];
const SOIL_TYPES=[{id:"soft",l:"ดินอ่อน (กทม.)",qa:5,pile:true},{id:"medium",l:"ดินปานกลาง",qa:10,pile:false},{id:"stiff",l:"ดินแข็ง",qa:15,pile:false},{id:"rock",l:"หิน/แข็งมาก",qa:25,pile:false}];
const WIND_ZONES=[{id:"z1",l:"โซน1 กลาง",v:25,q:39},{id:"z2",l:"โซน2 ใต้/ตอ.",v:29,q:52},{id:"z3",l:"โซน3 ชายฝั่ง",v:33,q:67}];
const SB=[{n:"H-200x100",d:200,A:27.16,Ix:1840,w:21.3},{n:"H-250x125",d:250,A:37.66,Ix:3960,w:29.6},{n:"H-300x150",d:300,A:46.78,Ix:7210,w:36.7},{n:"H-350x175",d:350,A:63.14,Ix:13600,w:49.6},{n:"H-400x200",d:400,A:84.12,Ix:23700,w:66},{n:"H-500x200",d:500,A:114.2,Ix:47800,w:89.7},{n:"H-600x200",d:600,A:134.4,Ix:76800,w:106},{n:"H-700x300",d:700,A:185.6,Ix:147000,w:145.7}];
const SC=[{n:"H-150x150",d:150,A:40.14,Ix:1640,w:31.5},{n:"H-200x200",d:200,A:63.53,Ix:4720,w:49.9},{n:"H-250x250",d:250,A:92.18,Ix:10800,w:72.4},{n:"H-300x300",d:300,A:119.8,Ix:20400,w:94},{n:"H-350x350",d:350,A:173.9,Ix:40300,w:136},{n:"H-400x400",d:400,A:218.7,Ix:66600,w:172}];
const PURLIN=[{n:"C-100x50x20x2.3",d:100,Ix:81,w:3.36},{n:"C-125x50x20x2.3",d:125,Ix:127,w:3.69},{n:"C-150x50x20x2.3",d:150,Ix:182,w:4.02},{n:"C-150x65x20x2.3",d:150,Ix:199,w:4.38},{n:"C-200x65x20x2.3",d:200,Ix:355,w:4.98},{n:"C-200x75x20x3.2",d:200,Ix:481,w:7.07},{n:"C-250x75x20x3.2",d:250,Ix:752,w:7.94}];
const BRACE=[{n:"L-50x50x5",A:4.8,w:3.77},{n:"L-65x65x6",A:7.44,w:5.84},{n:"L-75x75x6",A:8.64,w:6.85},{n:"L-75x75x9",A:12.66,w:9.96},{n:"L-100x100x8",A:15.5,w:12.2}];
const LL={warehouse:500,showroom:400,factory:500,commercial:300,office:200,residential:200};
const CONC={"C21/240":240,"C25/280":280,"C28/320":320,"C32/350":350};
const RB_DATA={"SD40":4000,"SD50":5000};
const CRANE_CAP=[0,3,5,10,15,20,30,50];

// ═══ CALC ENGINE ═══
function calc(p){
  const bt=BT.find(b=>b.id===p.type);if(!bt)return null;
  const fl=bt.fl, ll=LL[p.liveType]||300;
  const w=Math.max(4,p.width||12), ln=Math.max(4,p.length||24), eh=Math.max(2.5,p.eaveH||6);
  const sp=Math.max(3,p.spacing||6), slb=Math.max(8,p.slab||12);
  const roofSl=p.roofType==="flat"?3:(p.slope||15);
  const cosA=Math.cos(roofSl*Math.PI/180);
  const ridgeH=p.roofType==="mono"?(w*Math.tan(roofSl*Math.PI/180)):(w/2*Math.tan(roofSl*Math.PI/180));
  const roofLen=p.roofType==="mono"?(w/cosA):(w/2/cosA);
  const wallM=WALL_TYPES.find(x=>x.id===p.wallType)||WALL_TYPES[0];
  const roofM=ROOF_SHEETS.find(x=>x.id===p.roofSheet)||ROOF_SHEETS[0];
  const soil=SOIL_TYPES.find(x=>x.id===p.soilType)||SOIL_TYPES[0];
  const wind=WIND_ZONES.find(x=>x.id===p.windZone)||WIND_ZONES[0];

  // Loads
  const rDL=roofM.w+3, rLL=30, rWL=wind.q*0.8, rT=rDL+rLL;
  const wDL=wallM.w, windWall=wind.q*0.8;
  const fDL=slb*24+210, fT=fDL+ll;
  const nF=Math.floor(ln/sp)+1, nC=nF*2, area=w*ln, tArea=area*(fl===2?2:1);

  // Purlins
  const pSp=Math.max(0.8,p.purlinSp||1.2);
  const nPurlinPerSide=Math.ceil(roofLen/pSp)+1;
  const pW=(rT*pSp)/100, pL=sp*100, pMom=pW*pL*pL/8, pSr=pMom/(0.6*2500);
  let purlin=null;
  for(const pr of PURLIN){const Sx=pr.Ix*2/pr.d;if(Sx>=pSr){purlin={...pr,Sr:pSr.toFixed(1),Sp:Sx.toFixed(1)};break;}}
  if(!purlin)purlin={...PURLIN[PURLIN.length-1],warn:1};
  const totalPurlin=nPurlinPerSide*(p.roofType==="mono"?1:2)*nF;
  purlin.qty=totalPurlin;

  // Girts
  const gSp=1.5, nGirtPerBay=Math.ceil(eh/gSp);
  const gW=(wDL*gSp+windWall*gSp)/100, gMom=gW*(sp*100)*(sp*100)/8, gSr=gMom/(0.6*2500);
  let girt=null;
  for(const pr of PURLIN){const Sx=pr.Ix*2/pr.d;if(Sx>=gSr){girt={...pr,Sr:gSr.toFixed(1),Sp:Sx.toFixed(1)};break;}}
  if(!girt)girt={...PURLIN[PURLIN.length-1],warn:1};
  girt.qty=nGirtPerBay*2*nF;

  // Main Beam
  let beam=null, bM=0, bV=0;
  if(p.struct==="steel"){
    const wB=(rT*sp)/100, L=w*100;
    bM=wB*L*L/8; bV=wB*L/2;
    const Sr=bM/(0.66*2500);
    for(const s of SB){const S=s.Ix*2/s.d;if(S>=Sr){beam={...s,Sr:Sr.toFixed(1),Sp:S.toFixed(1)};break;}}
    if(!beam)beam={...SB[SB.length-1],warn:1};
  }

  // Columns
  let col=null, cP=0;
  if(p.struct==="steel"){
    cP=(rT*w*sp/2)*1.1;
    if(fl===2)cP+=fT*(w/2)*sp*1.1;
    if(p.crane>0)cP+=p.crane*1000*1.2;
    const Ar=cP/(0.6*2500);
    for(const s of SC){if(s.A>=Ar){col={...s,Ar:Ar.toFixed(1),sl:(eh*100/Math.sqrt(s.Ix/s.A)).toFixed(1)};break;}}
    if(!col)col={...SC[SC.length-1],warn:1};
  }

  // Bracing
  const windF=wind.q*eh*sp/100;
  const braceLen=Math.sqrt(eh*eh+sp*sp)*100;
  const braceF=windF*10*braceLen/(sp*100);
  const braceAr=braceF/(0.6*2500);
  let brace=null;
  for(const b of BRACE){if(b.A>=braceAr){brace={...b,force:braceF.toFixed(0),Ar:braceAr.toFixed(2)};break;}}
  if(!brace)brace={...BRACE[BRACE.length-1],warn:1,force:braceF.toFixed(0),Ar:braceAr.toFixed(2)};

  // Crane beam
  let crane=null;
  if(p.crane>0&&(p.type==="warehouse"||p.type==="factory")){
    const crL=p.crane*1000*1.25, crM=crL*sp*100/4, crSr=crM/(0.66*2500);
    for(const s of SB){const S=s.Ix*2/s.d;if(S>=crSr){crane={...s,load:p.crane,M:(crM/1e5).toFixed(2),Sr:crSr.toFixed(1),Sp:S.toFixed(1)};break;}}
    if(!crane)crane={...SB[SB.length-1],load:p.crane,warn:1,M:"—"};
  }

  // Mezzanine
  let mezz=null;
  if(p.mezz&&bt.hasMezz){
    const mW=Math.min(p.mezzW||w*0.4,w*0.8), mL=Math.min(p.mezzL||ln*0.5,ln*0.8);
    const mArea=mW*mL, mLL=300, mDL2=slb*24+150;
    const mBM=(1.4*mDL2+1.7*mLL)*mW*100*(mW*100)/(8*100);
    let mBeam=null;
    for(const s of SB){const S=s.Ix*2/s.d;if(S>=mBM/(0.66*2500)){mBeam=s;break;}}
    mezz={w:mW,l:mL,area:mArea,beam:mBeam||SB[SB.length-1],load:(mDL2+mLL)};
  }

  // RC members
  let rcB=null, rcC=null, rcS=null;
  const fc=CONC[p.conc]||240, fy=RB_DATA[p.rebar]||4000;
  if(p.struct==="concrete"||fl===2){
    const sW2=1.4*(slb*24+110)+1.7*ll, sL2=Math.min(sp,w/2)*100, sM2=(sW2/100)*sL2*sL2/10;
    const sD2=Math.max(1,slb-3), sA2=sM2/(0.9*fy*0.9*sD2);
    rcS={t:slb,Mu:(sM2/1e5).toFixed(2),As:sA2.toFixed(2),bar:sA2<3?"DB12@200":sA2<5?"DB12@150":sA2<7?"DB16@200":"DB16@150"};
    const bSp2=w*100/2, bW2=(1.4*(fDL+50)+1.7*ll)*sp/100, bMu2=bW2*bSp2*bSp2/8;
    const bWid=Math.max(20,Math.round(bSp2/20/5)*5), bDep=Math.max(30,Math.round(bSp2/12/5)*5);
    const bAs2=bMu2/(0.9*fy*0.9*Math.max(1,bDep-5));
    rcB={w:bWid,d:bDep,Mu:(bMu2/1e5).toFixed(2),As:bAs2.toFixed(2),bar:bAs2<8?"3-DB20":bAs2<12?"4-DB20":"4-DB25",stir:"DB10@150"};
    const cPu2=fl===2?(1.4*(fDL+rDL)+1.7*(ll+rLL))*(w/2)*sp*2:(1.4*(fDL+rDL)+1.7*(ll+rLL))*(w/2)*sp;
    const cA2=cPu2/(0.65*(0.85*fc/10+0.02*fy));
    const cSz2=Math.max(20,Math.ceil(Math.sqrt(Math.max(0,cA2))/5)*5);
    rcC={size:`${cSz2}x${cSz2}`,Pu:(cPu2/1000).toFixed(1),bar:cSz2<=25?"4-DB16":cSz2<=30?"4-DB20":"8-DB25"};
  }

  // Wind Analysis
  const windAnalysis={
    zone:wind.l,speed:wind.v,qz:wind.q,
    windward:{Cp:0.8,p:(wind.q*0.8).toFixed(1),f:(wind.q*0.8*eh*ln/1000).toFixed(1)},
    leeward:{Cp:-0.5,p:(wind.q*0.5).toFixed(1)},
    roofWW:{Cp:roofSl>20?0.3:-0.7,p:(wind.q*(roofSl>20?0.3:0.7)).toFixed(1)},
    roofLW:{Cp:-0.6,p:(wind.q*0.6).toFixed(1)},
    sideWall:{Cp:-0.7,p:(wind.q*0.7).toFixed(1)},
    baseShear:((wind.q*0.8+wind.q*0.5)*eh*ln/1000).toFixed(1),
    overturn:((wind.q*0.8+wind.q*0.5)*eh*eh*ln/2000).toFixed(1),
    uplift:(wind.q*0.7*w*ln/1000).toFixed(1),
  };

  // Foundation
  const fL=p.struct==="steel"?(cP/1000):(rcC?parseFloat(rcC.Pu)/1.5:10);
  const usePile=soil.pile||fL>30;
  let found;
  if(usePile){
    const pCap=p.soilType==="soft"?25:40;
    const nPiles=Math.max(1,Math.ceil(fL/pCap));
    found={type:"เสาเข็ม",pile:true,nPiles,dia:fL>20?0.35:0.25,len:p.soilType==="soft"?21:15,load:fL.toFixed(1),
      cap:`${(nPiles<=2?1.2:nPiles<=4?1.8:2.4).toFixed(1)}x${(nPiles<=2?1.2:nPiles<=4?1.8:2.4).toFixed(1)}`};
  }else{
    const fSz=Math.max(1,Math.ceil(Math.sqrt(Math.max(0.1,fL/soil.qa))*10)/10);
    found={type:"ฐานรากแผ่",pile:false,size:`${fSz.toFixed(1)}x${fSz.toFixed(1)}`,depth:Math.max(0.3,Math.round(fSz*0.3*10)/10).toFixed(1),load:fL.toFixed(1),qa:soil.qa};
  }

  // Drainage
  const roofA2=w*ln, flowR=roofA2*150/3600000;
  const gutterSz=flowR<0.01?150:flowR<0.03?200:flowR<0.05?250:300;
  const nDown=Math.max(2,Math.ceil(ln/12)*2);
  const drainage={roofArea:roofA2,flow:(flowR*1000).toFixed(1),gutter:gutterSz,downpipe:flowR<0.01?100:flowR<0.02?150:200,nDown,catchPit:Math.ceil(2*(w+ln)/15)};

  // MEP
  const elecW=tArea*(p.type==="showroom"?30:p.type==="factory"?50:15);
  const mep={elec:(elecW/1000).toFixed(1),trafo:Math.ceil(elecW/1000/0.8),light:(tArea*(p.type==="showroom"?15:10)/1000).toFixed(1),
    toilet:Math.max(1,Math.ceil(tArea/200)),water:Math.max(1,Math.ceil(Math.max(1,Math.ceil(tArea/200))*200/1000)),fireExt:Math.max(2,Math.ceil(tArea/200))};

  // BOQ
  const steelW=p.struct==="steel"?((beam?beam.w*w*nF:0)+(col?col.w*eh*nC:0)+(purlin.w*sp*totalPurlin/100)+(girt.w*sp*girt.qty/100)):0;
  const wallArea2=2*(w+ln)*eh;
  const items=[
    {cat:"โครงสร้างเหล็ก",qty:`${(steelW/1000).toFixed(1)}t`,cost:steelW*35},
    {cat:"หลังคา "+roofM.l,qty:`${roofA2}m²`,cost:roofA2*(p.roofType==="mono"?1:1.15)*roofM.cost},
    {cat:"ผนัง "+wallM.l,qty:`${wallArea2.toFixed(0)}m²`,cost:wallArea2*wallM.cost},
    {cat:"ฐานราก",qty:`${nC}จุด`,cost:usePile?(nC*(found.nPiles||1)*12000):(nC*5000)},
    {cat:"พื้น+งานดิน",qty:`${area}m²`,cost:area*(p.type==="showroom"?1000:600)},
  ];
  if(mezz)items.push({cat:"ชั้นลอย",qty:`${mezz.area.toFixed(0)}m²`,cost:mezz.area*8000});
  if(crane)items.push({cat:`เครน ${p.crane}t`,qty:"1ชุด",cost:p.crane*80000});
  items.push({cat:"MEP ไฟฟ้า/ประปา",qty:`${tArea}m²`,cost:tArea*800});
  const totalCost=items.reduce((s,i)=>s+i.cost,0);
  items.forEach(i=>{i.pct=((i.cost/totalCost)*100).toFixed(0);});

  return{info:{...bt},
    loads:{rDL,rLL,rT,rWL,wDL,windWall,fDL:fl===2?fDL:null,ll,fT:fl===2?fT:null},
    beam,col,rcB,rcC,rcS,purlin,girt,brace,crane,mezz,found,windAnalysis,drainage,mep,
    bM:(bM/1e5).toFixed(2),bV:(bV/1e3).toFixed(2),cP:(cP/1e3).toFixed(2),
    qty:{nF,nC,steelW:steelW.toFixed(0),area,tArea,ridgeH:ridgeH.toFixed(2),roofLen:roofLen.toFixed(2),wallArea:wallArea2.toFixed(0)},
    boq:{items,total:totalCost},
    cost:{rate:Math.round(totalCost/tArea),total:totalCost,totalM:(totalCost/1e6).toFixed(2)},
    params:p};
}

// ═══ AI ═══
async function ai(msgs,sys){
  try{const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:4000,system:sys||"คุณเป็นวิศวกรโยธาผู้เชี่ยวชาญด้านโกดัง/โชว์รูม/โรงงาน ตอบภาษาไทย อ้างอิง มยผ./วสท./ACI/AISC ครอบคลุมทุกด้าน: โครงสร้าง แป ค้ำยัน ฐานราก ลม ระบายน้ำ MEP ใบอนุญาต",messages:msgs})});
    if(!r.ok)return`Error ${r.status}`;const d=await r.json();return d.content?.map(b=>b.text||"").join("\n")||"—";}catch(e){return"Error: "+e.message;}}
async function aiJ(prompt,sys){const r=await ai([{role:"user",content:prompt}],sys||"ตอบ JSON เท่านั้น ไม่มี markdown backticks");
  if(r.startsWith("Error"))return{error:1,raw:r};try{return JSON.parse(r.replace(/```json?|```/g,"").trim());}catch{return{error:1,raw:r};}}
async function aiV(b64,tp,prompt){
  try{const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:2000,system:"วิศวกรโครงสร้าง อ่านแบบ ตอบ JSON เท่านั้น",
    messages:[{role:"user",content:[{type:"image",source:{type:"base64",media_type:tp,data:b64}},{type:"text",text:prompt}]}]})});
    if(!r.ok)return{error:1};const d=await r.json();return JSON.parse((d.content?.map(b=>b.text||"").join("\n")||"{}").replace(/```json?|```/g,"").trim());}catch{return{error:1};}}

function ctxStr(r,p){if(!r)return"";const bt=BT.find(b=>b.id===p.type);
  return`[${bt.l} ${p.width}x${p.length}m สูง${p.eaveH}m หลังคา${p.roofType} ลาด${p.slope}° ${p.struct} ผนัง${p.wallType} หลังคา${p.roofSheet} LL=${LL[p.liveType]}kg/m² ลม${p.windZone}(${WIND_ZONES.find(z=>z.id===p.windZone)?.v}m/s) ดิน${p.soilType} ${r.beam?`คาน=${r.beam.n}`:""}${r.col?` เสา=${r.col.n}`:""} แป=${r.purlin?.n} อกไก่=${r.girt?.n} ค้ำยัน=${r.brace?.n}${r.crane?` เครน=${r.crane.load}t`:""} ฐาน=${r.found.type}${r.found.pile?`(เข็ม${r.found.nPiles}ต้น)`:""} เฟรม=${r.qty.nF} เสา=${r.qty.nC} เหล็ก${(parseFloat(r.qty.steelW)/1000).toFixed(1)}t รางน้ำ${r.drainage.gutter}mm ≈฿${r.cost.totalM}M]`;}

const KM={title:"ชื่อ",name:"ชื่อ",description:"รายละเอียด",summary:"สรุป",reason:"เหตุผล",status:"สถานะ",score:"คะแนน",grade:"เกรด",type:"ประเภท",recommendations:"คำแนะนำ",critical:"วิกฤต",category:"หมวด",severity:"ความรุนแรง",probability:"ความน่าจะเป็น",mitigation:"ป้องกัน",item:"รายการ",standard:"มาตรฐาน",detail:"รายละเอียด",method:"วิธี",phase:"ระยะ",duration_days:"วัน",tasks:"งาน",equipment:"เครื่องจักร",workers:"คนงาน",materials:"วัสดุ",total_days:"รวมวัน",pros:"ข้อดี",cons:"ข้อเสีย",recommendation:"แนะนำ",saving_percent:"ประหยัด%",changes:"เปลี่ยนแปลง",from:"จาก",to:"เป็น",saving:"ประหยัด",location:"ตำแหน่ง",checks:"ตรวจ",risks:"ความเสี่ยง",options:"ตัวเลือก",notes:"หมายเหตุ",items:"รายการ",force:"แรง",permit:"ใบอนุญาต",cost:"ค่าใช้จ่าย",area:"พื้นที่",load:"น้ำหนัก",size:"ขนาด",material:"วัสดุ",quantity:"จำนวน",total_cost:"ราคารวม"};
function fK(k){return KM[k]||k.replace(/_/g," ");}
function rJ(o,dep=0){if(!o||typeof o!=="object")return String(o);const pad="  ".repeat(dep);
  const ent=Array.isArray(o)?o.map((v,i)=>[i,v]):Object.entries(o);
  return ent.map(([k,v])=>{const lb=typeof k==="number"?`${pad}• `:`${pad}${fK(k)}: `;
    if(Array.isArray(v)){if(!v.length)return`${lb}—`;if(typeof v[0]==="string"||typeof v[0]==="number")return`${lb}${v.join(" · ")}`;return`${lb}\n${v.map(i=>rJ(i,dep+1)).join("\n")}`;}
    if(v&&typeof v==="object")return`${lb}\n${rJ(v,dep+1)}`;if(typeof v==="boolean")return`${lb}${v?"✓":"✗"}`;return`${lb}${v}`;}).join("\n");}

// ═══ MAIN APP ═══
export default function App(){
  const[mode,setMode]=useState(()=>window.matchMedia?.("(prefers-color-scheme:dark)").matches?"dark":"light");
  const T=themes[mode];

  const[type,setType]=useState("warehouse");
  const[width,setW]=useState(12);const[length,setL]=useState(24);const[eaveH,setH]=useState(6);
  const[slope,setSl]=useState(15);const[spacing,setSp]=useState(6);
  const[struct,setSt]=useState("steel");const[liveType,setLT]=useState("warehouse");
  const[conc,setConc]=useState("C25/280");const[rebar,setRebar]=useState("SD40");const[slab,setSlab]=useState(12);
  const[roofType,setRT]=useState("gable");const[wallType,setWT]=useState("metal");
  const[roofSheet,setRS]=useState("metal047");const[soilType,setSoil]=useState("soft");
  const[windZone,setWZ]=useState("z1");const[purlinSp,setPS]=useState(1.2);
  const[craneT,setCrane]=useState(0);const[hasMezz,setMezz]=useState(false);
  const[mezzW,setMW]=useState(5);const[mezzL,setML]=useState(12);

  const[results,setR]=useState(null);const[tab,setTab]=useState("loads");const[page,setPage]=useState("calc");
  const[sideOpen,setSO]=useState(false);const[pdfLd,setPL]=useState(false);
  const[chatMsgs,setCM]=useState([]);const[chatIn,setCI]=useState("");const[chatLd,setCL]=useState(false);const chatE=useRef(null);
  const[nlpTx,setNT]=useState("");const[nlpLd,setNL]=useState(false);const[nlpR,setNR]=useState(null);
  const[rdImg,setRI]=useState(null);const[rdPrev,setRP]=useState(null);const[rdLd,setRL]=useState(false);const[rdR,setRR]=useState(null);
  const[aiS,setAIS]=useState({});
  const gS=(k)=>aiS[k]||{ld:false,r:null};

  const bt=BT.find(b=>b.id===type);
  const p={type,width,length,eaveH,slope,spacing,struct,liveType,conc,rebar,slab,roofType,wallType,roofSheet,soilType,windZone,purlinSp,crane:craneT,mezz:hasMezz,mezzW,mezzL};
  const cx=()=>ctxStr(results,p);

  const chgType=(id)=>{setType(id);setR(null);setAIS({});
    const d={warehouse:{w:12,l:24,h:6,st:"steel",lt:"warehouse",sp:6,rt:"gable"},showroom:{w:15,l:30,h:5,st:"steel",lt:"showroom",sp:6,rt:"gable"},factory:{w:18,l:36,h:8,st:"steel",lt:"factory",sp:6,rt:"gable"},one_story:{w:10,l:20,h:3.5,st:"concrete",lt:"commercial",sp:5,rt:"flat"},two_story:{w:10,l:20,h:3.5,st:"concrete",lt:"commercial",sp:5,rt:"flat"}}[id]||{};
    if(d.w){setW(d.w);setL(d.l);setH(d.h);setSt(d.st);setLT(d.lt);setSp(d.sp);setRT(d.rt);setCrane(0);setMezz(false);}};
  const doCalc=()=>{setR(calc(p));setTab("loads");setAIS({});};
  const applyP=(np)=>{if(np.type)chgType(np.type);if(np.width)setW(parseFloat(np.width)||width);if(np.length)setL(parseFloat(np.length)||length);if(np.eaveH)setH(parseFloat(np.eaveH)||eaveH);setTimeout(()=>setPage("calc"),300);};

  const sendChat=async()=>{if(!chatIn.trim()||chatLd)return;const u=chatIn.trim();setCI("");setCL(true);
    const nm=[...chatMsgs,{role:"user",content:u}];setCM(nm);
    try{const r2=await ai(nm.map((m,i)=>({role:m.role,content:m.content+(m.role==="user"&&i===nm.length-1?cx():"")})));setCM([...nm,{role:"assistant",content:r2}]);}catch(e){setCM([...nm,{role:"assistant",content:"Error: "+e.message}]);}finally{setCL(false);}};
  useEffect(()=>{chatE.current?.scrollIntoView({behavior:"smooth"});},[chatMsgs]);
  const doNlp=async()=>{if(!nlpTx.trim())return;setNL(true);setNR(null);try{setNR(await aiJ(`จากข้อความ:"${nlpTx}" แยก JSON:{type,width,length,eaveH,slope,spacing,struct,liveType,roofType,wallType,soilType,crane:0,summary,assumptions}`));}catch(e){setNR({error:1,raw:e.message});}finally{setNL(false);}};
  const handleFile=(e)=>{const f=e.target.files[0];if(!f)return;const r2=new FileReader();r2.onload=(ev)=>{setRP(ev.target.result);setRI({b64:ev.target.result.split(",")[1],type:f.type});};r2.readAsDataURL(f);};
  const doRead=async()=>{if(!rdImg)return;setRL(true);setRR(null);try{setRR(await aiV(rdImg.b64,rdImg.type,`อ่านแบบโกดัง/โชว์รูม JSON:{type,width,length,eaveH,slope,spacing,struct,roofType,wallType,crane,summary,confidence}`));}catch{setRR({error:1});}finally{setRL(false);}};

  const doPDF=async()=>{if(!results||!bt)return;setPL(true);
    try{const sum=await ai([{role:"user",content:`สรุปรายงานโครงสร้างครบวงจร 4 ย่อหน้า: ${cx()}`}]);
    const html=`<!DOCTYPE html><html><head><meta charset="utf-8"><title>RABBiZ Report v6</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Sarabun',sans-serif;font-size:11pt;color:#2c2416;line-height:1.8;padding:40px 50px;max-width:850px;margin:0 auto}h2{font-size:13pt;border-left:4px solid #c8960c;padding-left:12px;margin:20px 0 8px}table{width:100%;border-collapse:collapse;margin:6px 0 14px;font-size:10pt}th{background:#2c2416;color:#fff;padding:6px;text-align:left}td{padding:5px;border-bottom:1px solid #e2ddd3}.hl{color:#c8960c;font-weight:700}</style></head><body><div style="text-align:center;border-bottom:3px solid #c8960c;padding-bottom:16px;margin-bottom:24px"><div style="font-size:24pt;font-weight:700;color:#c8960c">RABBiZ</div><h1 style="font-size:16pt">รายงานคำนวณโครงสร้าง v6.0</h1><div style="font-size:10pt;color:#8c7e6a">${new Date().toLocaleDateString('th-TH')}</div></div><h2>ข้อมูลโครงการ</h2><table><tr><td>อาคาร</td><td class="hl">${bt.l} ${width}x${length}m สูง${eaveH}m</td></tr><tr><td>หลังคา/ผนัง</td><td>${roofType}/${wallType}</td></tr><tr><td>ดิน/ลม</td><td>${soilType}/${windZone}</td></tr></table>${results.beam?`<h2>คานหลัก</h2><table><tr><td>${results.beam.n}</td><td>M=${results.bM}t·m</td></tr></table>`:""}${results.col?`<h2>เสา</h2><table><tr><td>${results.col.n}</td><td>P=${results.cP}t</td></tr></table>`:""}${results.purlin?`<h2>แป</h2><table><tr><td>${results.purlin.n}</td><td>${results.purlin.qty}ตัว</td></tr></table>`:""}<h2>ค้ำยัน</h2><table><tr><td>${results.brace.n}</td><td>F=${results.brace.force}kg</td></tr></table><h2>ฐานราก</h2><table><tr><td>${results.found.type}</td><td>${results.found.pile?`เข็ม${results.found.nPiles}ต้น`:results.found.size}</td></tr></table><h2>BOQ</h2><table><tr><th>รายการ</th><th>ปริมาณ</th><th>ราคา</th></tr>${results.boq.items.map(i=>`<tr><td>${i.cat}</td><td>${i.qty}</td><td class="hl">฿${(i.cost/1e6).toFixed(2)}M</td></tr>`).join("")}<tr style="font-weight:700;border-top:2px solid #c8960c"><td>รวม</td><td>${results.qty.tArea}m² @฿${results.cost.rate}/m²</td><td class="hl">฿${results.cost.totalM}M</td></tr></table><h2>สรุป</h2><div style="background:#faf8f4;border:1px solid #e2ddd3;border-radius:8px;padding:14px;margin:14px 0">${sum.replace(/\n/g,'<br>')}</div><div style="margin-top:30px;padding:10px;background:#fdf0f0;border-radius:6px;font-size:9pt;color:#8c7e6a">⚠️ Preliminary Design — ตรวจสอบโดย กว.</div></body></html>`;
    const blob=new Blob([html],{type:"text/html"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`RABBiZ_v6_${new Date().toISOString().slice(0,10)}.html`;a.click();URL.revokeObjectURL(url);
    }catch(e){console.error(e);}finally{setPL(false);}};

  // 30 AI FEATURES
  const features={
    compliance:{t:"ตรวจมาตรฐาน",d:"มยผ./วสท./พ.ร.บ.ควบคุมอาคาร ครบทุกชิ้นส่วน",ic:"✅",c:"ok",run:async(c)=>await aiJ(`ตรวจโครงสร้างครบ: คาน+เสา+แป+ค้ำยัน+ฐานราก+ลม+ระบายน้ำ+ทางหนีไฟ ตาม มยผ. วสท. พ.ร.บ.ควบคุมอาคาร: ${c}\nJSON:{score:0-100,grade:"A-F",checks:[{item,standard,status:"pass|warn|fail",detail}],recommendations:[],critical:[]}`)},
    compare:{t:"เปรียบเทียบระบบ",d:"Steel vs RC vs PEB vs Truss",ic:"⚖️",c:"b",run:async(c)=>await aiJ(`เปรียบเทียบระบบก่อสร้าง: Steel Frame vs RC vs PEB vs Truss: ${c}\nJSON:{options:[{name,cost_factor,construction_days,pros:[],cons:[],score:0-100}],recommendation,reason}`)},
    fea:{t:"FEA วิเคราะห์",d:"Stress Deflection ทุกชิ้นส่วน",ic:"🔬",c:"p",run:async(c)=>await aiJ(`Simplified FEA ครบ: คาน เสา แป ค้ำยัน: ${c}\nJSON:{members:[{id,type,section,utilization_percent,deflection_status,status}],critical_member:{id,reason},global:{sway_mm,status},summary}`)},
    wind_pro:{t:"Wind มยผ.1311",d:"Cp ทุกด้าน GCpi Cladding",ic:"🌪️",c:"b",run:async(c)=>await aiJ(`แรงลม มยผ.1311 ละเอียด: ${c}\nJSON:{speed,qz,zones:[{surface,Cp,pressure}],base_shear_ton,overturn_tm,uplift_ton,cladding:{max_pressure,fastener_spacing_mm},drift:{mm,allowable,status},summary}`)},
    seismic:{t:"แผ่นดินไหว",d:"มยผ.1302 Base Shear",ic:"🌋",c:"w",run:async(c)=>await aiJ(`แผ่นดินไหว มยผ.1302: ${c}\nJSON:{zone,base_shear_ton,drift:{estimated,allowable,status},recommendations:[]}`)},
    progressive:{t:"Progressive Collapse",d:"GSA ถอดเสา",ic:"🏚️",c:"e",run:async(c)=>await aiJ(`Progressive Collapse GSA: ${c}\nJSON:{scenarios:[{removed,risk,survival}],robustness:0-100,recommendations:[]}`)},
    fire:{t:"Fire + ทางหนีไฟ",d:"อัตราทนไฟ ทางออก ดับเพลิง",ic:"🔥",c:"e",run:async(c)=>await aiJ(`Fire Resistance + ทางหนีไฟ: ${c}\nJSON:{fire_rating_hr,members:[{member,current_hr,required_hr,protection,status}],escape:{exits,width_m,travel_m,status},suppression:{type,coverage},recommendations:[]}`)},
    risk:{t:"วิเคราะห์ความเสี่ยง",d:"Failure Mode & Risk Matrix",ic:"🛡️",c:"w",run:async(c)=>await aiJ(`Risk Analysis: ${c}\nJSON:{score:0-100,risks:[{category,title,severity,probability,mitigation}],failure_modes:[{mode,member,prevention}]}`)},
    connection:{t:"ออกแบบจุดต่อ",d:"Base Plate Beam-Col Purlin Bracing",ic:"🔩",c:"p",run:async(c)=>await aiJ(`จุดต่อครบทุกจุด: Base Plate, Beam-Column, Purlin-Rafter, Bracing: ${c}\nJSON:{connections:[{location,type,bolts,plate_mm,weld_mm,capacity_ton,demand_ton,status}],anchor_bolt:{size,embedment_mm},notes:[]}`)},
    rebar_detail:{t:"Rebar Detailing",d:"เหล็กเสริม ACI318",ic:"💪",c:"p",run:async(c)=>await aiJ(`Rebar Detailing ACI318: ${c}\nJSON:{members:[{member,main_bar,stirrup,lap_mm}],rules:[],mistakes:[]}`)},
    load_path:{t:"Load Path",d:"หลังคา→แป→คาน→เสา→ฐานราก",ic:"📊",c:"b",run:async(c)=>await aiJ(`Load Path ครบ: หลังคา→แป→คาน→เสา→ฐานราก + ลม→ค้ำยัน: ${c}\nJSON:{gravity:[{level,element,load_ton,transfer_to}],lateral:[{element,force_ton,transfer_to}],bottleneck:{member,reason},soil:{max_ksc,allowable,status}}`)},
    optimize:{t:"Optimize ลดต้นทุน",d:"เปลี่ยนหน้าตัด วัสดุ ระยะ",ic:"💎",c:"ok",run:async(c)=>await aiJ(`ลดต้นทุน ไม่ลดคุณภาพ: ${c}\nJSON:{current_M,optimized_M,saving_percent,changes:[{item,from,to,saving,reason}],summary}`)},
    value_eng:{t:"Value Engineering",d:"SAVE International",ic:"🎯",c:"ok",run:async(c)=>await aiJ(`Value Engineering: ${c}\nJSON:{proposals:[{title,description,saving_baht,risk_level}],total_saving,summary}`)},
    sequence:{t:"แผนก่อสร้าง",d:"Phase Gantt Critical Path",ic:"📅",c:"b",run:async(c)=>await aiJ(`แผนก่อสร้างละเอียด: ${c}\nJSON:{total_days,phases:[{phase,name,days,tasks:[],equipment:[],workers}],critical_path:[],milestones:[{day,event}]}`)},
    retrofit:{t:"เสริมกำลัง/ต่อเติม",d:"FRP Steel Jacket Extension",ic:"🏗️",c:"w",run:async(c)=>await aiJ(`เสริมกำลัง/ต่อเติม: ${c}\nJSON:{options:[{option,technique,cost,days,feasibility:0-100}],recommended,notes:[]}`)},
    etabs:{t:"ETABS/SAP2000",d:"Grid Section Load",ic:"🖥️",c:"p",run:async(c)=>await aiJ(`ETABS Input ครบทุกชิ้นส่วน: ${c}\nJSON:{grid:{x:[],y:[],z:[]},materials:[],sections:[],load_cases:[],combinations:[],tips:[]}`)},
    qc:{t:"QC Checklist",d:"ตรวจงานก่อสร้าง",ic:"📋",c:"b",run:async(c)=>await aiJ(`QC Checklist ครบทุกหมวด: ดิน ฐานราก เหล็ก หลังคา ผนัง: ${c}\nJSON:{categories:[{category,items:[{item,method,critical}]}],hold_points:[],tests:[]}`)},
    material_test:{t:"ทดสอบวัสดุ",d:"เหล็ก คอนกรีต Bolt TIS/ASTM",ic:"🧪",c:"p",run:async(c)=>await aiJ(`แผนทดสอบวัสดุครบ: ${c}\nJSON:{tests:[{material,test_name,standard,samples,acceptance,cost}],total_budget,failures:[]}`)},
    costdetail:{t:"ต้นทุนละเอียด",d:"แยก 15+ หมวด",ic:"💰",c:"w",run:async(c)=>await aiJ(`ต้นทุนละเอียด 15+ หมวด: ${c}\nJSON:{total,breakdown:[{category,percent,amount,sub_items:[{item,qty,unit_price,amount}]}],cost_per_sqm,saving_tips:[]}`)},
    presentation:{t:"Presentation",d:"สไลด์ FAQ สรุปผู้บริหาร",ic:"🎤",c:"p",run:async(c)=>await aiJ(`Presentation ลูกค้า: ${c}\nJSON:{slides:[{title,points:[],notes}],executive_summary,faq:[{q,a}],next_steps:[]}`)},
    permit:{t:"ใบอนุญาตก่อสร้าง",d:"พ.ร.บ.ควบคุมอาคาร ผังเมือง",ic:"📜",c:"b",run:async(c)=>await aiJ(`ใบอนุญาตก่อสร้าง ตาม พ.ร.บ.ควบคุมอาคาร 2522 กฎกระทรวง ผังเมือง: ${c}\nJSON:{permits:[{permit,authority,documents:[],timeline_days,fee}],setback:{front_m,side_m,rear_m},height_limit_m,parking,accessibility:[],eia_required,summary}`)},
    mep_design:{t:"MEP ออกแบบ",d:"ไฟฟ้า ประปา สุขาภิบาล ดับเพลิง",ic:"⚡",c:"b",run:async(c)=>await aiJ(`MEP Design ครบ: ไฟฟ้า(หม้อแปลง MDB สายเมน) ประปา(ถังน้ำ ปั๊ม) สุขาภิบาล ดับเพลิง: ${c}\nJSON:{electrical:{transformer_kva,main_breaker_a,lighting_fixtures,grounding},plumbing:{water_tank_m3,pump_hp,pipe_mm},sanitary:{septic_m3,grease_trap},fire:{extinguishers,sprinkler,alarm},cost,summary}`)},
    drainage_design:{t:"ระบบระบายน้ำ",d:"รางน้ำ ท่อ บ่อพัก ทางลาด",ic:"🌧️",c:"b",run:async(c)=>await aiJ(`ออกแบบระบายน้ำฝน ปริมาณฝน 150mm/hr: ${c}\nJSON:{roof:{gutter_mm,slope,downpipe_mm,count},ground:{drain_mm,catch_basins},flood:{raise_cm,threshold_cm},cost,summary}`)},
    maintenance:{t:"แผนบำรุงรักษา",d:"ประจำปี 5/10/20 ปี",ic:"🔧",c:"ok",run:async(c)=>await aiJ(`แผนบำรุงรักษา 20 ปี: ${c}\nJSON:{annual:[{item,frequency,cost,priority}],inspection:[{interval,checks:[]}],replacement:[{item,life_years,cost}],annual_budget,lifecycle_20yr,tips:[]}`)},
    insurance:{t:"ประเมินประกันภัย",d:"ทรัพย์สิน อัคคีภัย ภัยธรรมชาติ",ic:"🔰",c:"ok",run:async(c)=>await aiJ(`ประเมินประกันภัย: ${c}\nJSON:{building_value,coverage:[{type,coverage,premium,deductible}],risk_factors:[{factor,impact,mitigation}],total_premium,tips:[]}`)},
    energy:{t:"ประหยัดพลังงาน",d:"ฉนวน Skylight Solar LED",ic:"☀️",c:"ok",run:async(c)=>await aiJ(`ประหยัดพลังงาน: ฉนวน Skylight Solar LED HVLS: ${c}\nJSON:{measures:[{measure,saving_percent,investment,payback_years}],solar:{kw,generation_kwh,investment,payback},total_saving_percent,green_score:0-100}`)},
    extension:{t:"ต่อเติม/ขยาย",d:"ขยายโกดัง เพิ่มชั้นลอย เครน",ic:"📐",c:"w",run:async(c)=>await aiJ(`ต่อเติม/ขยาย: ${c}\nJSON:{options:[{option,changes:[],cost,days,feasibility:0-100}],recommended,phasing}`)},
    shop_drawing:{t:"ตรวจ Shop Drawing",d:"Checklist สำหรับตรวจแบบ",ic:"📝",c:"p",run:async(c)=>await aiJ(`Shop Drawing Review: ${c}\nJSON:{categories:[{category,items:[{item,check_point,common_errors}]}],fabrication_notes:[],tolerances:[{item,allowable}]}`)},
    multi_hazard:{t:"Multi-Hazard",d:"แผ่นดินไหว+ลม+น้ำท่วม+ไฟ",ic:"🌊",c:"b",run:async(c)=>await aiJ(`Multi-Hazard: ${c}\nJSON:{hazards:[{type,demand_capacity_ratio,status,standard}],governing,resilience:0-100,mitigation:[{hazard,measure,cost}],summary}`)},
  };

  const runF=async(k)=>{if(!results||gS(k).ld)return;setAIS(p=>({...p,[k]:{ld:true,r:p[k]?.r}}));try{const r2=await features[k].run(cx());setAIS(p=>({...p,[k]:{ld:false,r:r2}}));}catch(e){setAIS(p=>({...p,[k]:{ld:false,r:{error:1,raw:e.message}}}));}};

  const navGroups=[
    {g:"หลัก",items:[{id:"calc",ic:"📐",l:"คำนวณ"},{id:"nlp",ic:"💬",l:"พิมพ์ไทย"},{id:"reader",ic:"📷",l:"อ่านแบบ"},{id:"chat",ic:"🤖",l:"AI Advisor"}]},
    {g:"ตรวจสอบ",items:[{id:"compliance",ic:"✅",l:"มาตรฐาน"},{id:"compare",ic:"⚖️",l:"เปรียบเทียบ"},{id:"risk",ic:"🛡️",l:"ความเสี่ยง"},{id:"permit",ic:"📜",l:"ใบอนุญาต"}]},
    {g:"วิเคราะห์",items:[{id:"fea",ic:"🔬",l:"FEA"},{id:"wind_pro",ic:"🌪️",l:"ลม Pro"},{id:"seismic",ic:"🌋",l:"แผ่นดินไหว"},{id:"progressive",ic:"🏚️",l:"Collapse"},{id:"multi_hazard",ic:"🌊",l:"Multi-Hazard"},{id:"fire",ic:"🔥",l:"ทนไฟ"}]},
    {g:"ออกแบบ",items:[{id:"connection",ic:"🔩",l:"จุดต่อ"},{id:"rebar_detail",ic:"💪",l:"เหล็กเสริม"},{id:"load_path",ic:"📊",l:"Load Path"},{id:"mep_design",ic:"⚡",l:"MEP"},{id:"drainage_design",ic:"🌧️",l:"ระบายน้ำ"}]},
    {g:"วางแผน",items:[{id:"optimize",ic:"💎",l:"Optimize"},{id:"value_eng",ic:"🎯",l:"VE"},{id:"sequence",ic:"📅",l:"แผนสร้าง"},{id:"extension",ic:"📐",l:"ต่อเติม"},{id:"retrofit",ic:"🏗️",l:"เสริมกำลัง"}]},
    {g:"Output",items:[{id:"etabs",ic:"🖥️",l:"ETABS"},{id:"qc",ic:"📋",l:"QC"},{id:"material_test",ic:"🧪",l:"ทดสอบ"},{id:"shop_drawing",ic:"📝",l:"Shop Drw"},{id:"costdetail",ic:"💰",l:"ต้นทุน"},{id:"presentation",ic:"🎤",l:"Present"}]},
    {g:"บริหาร",items:[{id:"maintenance",ic:"🔧",l:"บำรุงรักษา"},{id:"insurance",ic:"🔰",l:"ประกันภัย"},{id:"energy",ic:"☀️",l:"พลังงาน"}]},
  ];

  // UI Components
  const sI={width:"100%",padding:"8px 10px",background:T.inputBg,border:`1.5px solid ${T.bd}`,borderRadius:7,color:T.t,fontSize:12,fontFamily:MO,outline:"none",boxSizing:"border-box"};
  const Inp=({l,u,v,set,mn,mx,st=0.5})=><div style={{marginBottom:8}}><label style={{display:"block",fontSize:10,color:T.d,marginBottom:2,fontWeight:600}}>{l}</label><div style={{display:"flex",gap:4,alignItems:"center"}}><input type="number" value={v} onChange={e=>{const n=parseFloat(e.target.value);set(isNaN(n)?mn||0:n);}} min={mn} max={mx} step={st} style={{...sI,flex:1}}/>{u&&<span style={{fontSize:9,color:T.dL}}>{u}</span>}</div></div>;
  const Sel=({l,v,set,opts})=><div style={{marginBottom:8}}><label style={{display:"block",fontSize:10,color:T.d,marginBottom:2,fontWeight:600}}>{l}</label><select value={v} onChange={e=>set(e.target.value)} style={{...sI,cursor:"pointer"}}>{opts.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}</select></div>;
  const Card=({t,ic,c,ch})=>{const cl=T[c]||T.a;return<div style={{background:T.s1,borderRadius:10,border:`1.5px solid ${T.bd}`,overflow:"hidden",marginBottom:10,boxShadow:T.shadow}}>{t&&<div style={{padding:"8px 12px",borderBottom:`1.5px solid ${T.bd}`,display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:13}}>{ic}</span><span style={{fontSize:12,fontWeight:700,color:cl,fontFamily:D}}>{t}</span></div>}<div style={{padding:12}}>{ch}</div></div>;};
  const Row=({l,v,u,h})=><div style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:`1px solid ${T.bd}25`}}><span style={{fontSize:11,color:T.d}}>{l}</span><span style={{fontSize:12,fontWeight:h?700:500,color:h?T.a:T.t,fontFamily:MO}}>{v}{u&&<span style={{fontSize:9,color:T.dL,marginLeft:2}}>{u}</span>}</span></div>;
  const PF=({ok,tx})=><div style={{marginTop:6,padding:5,borderRadius:6,textAlign:"center",fontSize:11,fontWeight:700,background:ok?T.okBg:T.eBg,color:ok?T.ok:T.e}}>{ok?"✓":"✗"} {tx}</div>;
  const Btn=({c,full,ch,onClick,dis,outline})=>{const cl=T[c]||T.a;const dk=c==="a"||c==="w";return<button onClick={onClick} disabled={dis} style={{padding:full?"10px":"7px 14px",borderRadius:7,border:outline?`2px solid ${cl}`:"none",cursor:dis?"not-allowed":"pointer",background:outline?"transparent":cl,color:outline?cl:dk?"#1a1200":"#fff",fontSize:12,fontWeight:700,fontFamily:F,width:full?"100%":"auto",opacity:dis?.5:1,transition:"all .15s"}}>{ch}</button>;};
  const Ld=({t})=><div style={{textAlign:"center",padding:24}}><div style={{width:28,height:28,border:`3px solid ${T.bd}`,borderTop:`3px solid ${T.a}`,borderRadius:"50%",margin:"0 auto",animation:"spin .8s linear infinite"}}/><div style={{fontSize:11,color:T.d,marginTop:8}}>{t}</div></div>;
  const AIR=({data})=>{if(!data)return null;if(data.error)return<div style={{fontSize:11,padding:10,background:T.eBg,borderRadius:6,color:T.e}}>{data.raw||"Error"}</div>;
    if(typeof data==="string")return<div style={{fontSize:12,whiteSpace:"pre-wrap",lineHeight:1.8}}>{data}</div>;
    return<pre style={{whiteSpace:"pre-wrap",fontFamily:F,fontSize:11,lineHeight:1.8,margin:0}}>{rJ(data)}</pre>;};
  const Stat=({l,v,u})=><div style={{textAlign:"center",padding:"5px 3px",minWidth:50}}><div style={{fontSize:9,color:T.d,fontWeight:600}}>{l}</div><div style={{fontSize:16,fontWeight:800,color:T.a,fontFamily:D,lineHeight:1.2}}>{v}</div>{u&&<div style={{fontSize:8,color:T.dL}}>{u}</div>}</div>;

  return(
    <div style={{minHeight:"100vh",background:T.bg,color:T.t,fontFamily:F,display:"flex"}}>
      <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;600;700;800&family=Outfit:wght@400;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet"/>
      <style>{`input:focus,select:focus,textarea:focus{border-color:${T.a}!important;box-shadow:0 0 0 3px ${T.a}18!important}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:${T.bd};border-radius:3px}@keyframes spin{to{transform:rotate(360deg)}}@keyframes fi{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}.fi{animation:fi .25s ease-out}button:hover:not(:disabled){filter:brightness(1.08)}.si:hover{background:${T.navA}15!important}`}</style>

      {/* SIDEBAR */}
      <div style={{width:sideOpen?200:50,height:"100vh",background:T.navBg,borderRight:`1px solid ${T.bd}30`,display:"flex",flexDirection:"column",transition:"width .2s",position:"sticky",top:0,zIndex:20,overflow:"hidden",flexShrink:0}}>
        <div style={{padding:sideOpen?"10px 12px":"10px 6px",borderBottom:`1px solid ${T.navD}30`,display:"flex",alignItems:"center",gap:6,cursor:"pointer"}} onClick={()=>setSO(!sideOpen)}>
          <div style={{width:26,height:26,borderRadius:6,background:`linear-gradient(135deg,${T.navA},#d4a000)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:900,color:"#000",flexShrink:0}}>R</div>
          {sideOpen&&<div><div style={{fontSize:12,fontWeight:800,color:T.navA,fontFamily:D}}>RABBiZ</div><div style={{fontSize:7,color:T.navD}}>CIVIL ENGINEERING v6</div></div>}
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"3px 0"}}>
          {navGroups.map((g,gi)=><div key={gi}>
            {sideOpen&&<div style={{padding:"7px 12px 2px",fontSize:8,fontWeight:700,color:T.navD,letterSpacing:1.5,textTransform:"uppercase"}}>{g.g}</div>}
            {!sideOpen&&gi>0&&<div style={{height:1,background:T.navD+"30",margin:"2px 5px"}}/>}
            {g.items.map(n=><div key={n.id} className="si" onClick={()=>{setPage(n.id);if(window.innerWidth<768)setSO(false);}} style={{padding:sideOpen?"5px 12px":"5px 0",margin:sideOpen?"1px 4px":"1px 2px",borderRadius:5,cursor:"pointer",display:"flex",alignItems:"center",gap:6,justifyContent:sideOpen?"flex-start":"center",background:page===n.id?`${T.navA}20`:"transparent"}}>
              <span style={{fontSize:12,width:20,textAlign:"center"}}>{n.ic}</span>
              {sideOpen&&<span style={{fontSize:11,fontWeight:page===n.id?700:500,color:page===n.id?T.navA:T.navT,whiteSpace:"nowrap"}}>{n.l}</span>}
            </div>)}</div>)}
        </div>
        <div style={{padding:sideOpen?"7px 12px":"7px 0",borderTop:`1px solid ${T.navD}30`,display:"flex",alignItems:"center",justifyContent:sideOpen?"flex-start":"center",gap:6,cursor:"pointer"}} onClick={()=>setMode(m=>m==="dark"?"light":"dark")}>
          <span style={{fontSize:13,width:20,textAlign:"center"}}>{mode==="dark"?"☀️":"🌙"}</span>
          {sideOpen&&<span style={{fontSize:10,color:T.navT}}>{mode==="dark"?"Light":"Dark"}</span>}
        </div>
      </div>

      {/* MAIN */}
      <div style={{flex:1,minWidth:0}}>
        <div style={{padding:"7px 14px",background:T.s1,borderBottom:`1.5px solid ${T.bd}`,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:10}}>
          <div style={{display:"flex",alignItems:"center",gap:5}}>
            <button onClick={()=>setSO(!sideOpen)} style={{border:"none",background:"none",cursor:"pointer",fontSize:15,color:T.d}}>☰</button>
            <span style={{fontSize:13,fontWeight:700,fontFamily:D}}>{navGroups.flatMap(g=>g.items).find(n=>n.id===page)?.l||"คำนวณ"}</span>
            {features[page]&&<span style={{padding:"1px 6px",borderRadius:7,background:T.aBg,color:T.a,fontSize:9,fontWeight:700}}>AI</span>}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:5}}>
            {results&&<span style={{fontSize:10,color:T.ok,fontWeight:600}}>● {bt?.l} {width}×{length}m ≈฿{results.cost.totalM}M</span>}
            <span style={{fontSize:9,color:T.dL,padding:"2px 5px",borderRadius:4,background:T.s2}}>v6</span>
          </div>
        </div>

        <div style={{padding:"12px 14px",maxWidth:920,margin:"0 auto"}}>
          {/* CALC */}
          {page==="calc"&&<div className="fi">
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:5,marginBottom:10}}>
              {BT.map(b=><button key={b.id} onClick={()=>chgType(b.id)} style={{padding:8,background:type===b.id?T.aBg:T.s1,border:`2px solid ${type===b.id?T.a:T.bd}`,borderRadius:8,cursor:"pointer",textAlign:"left"}}>
                <div style={{fontSize:18}}>{b.ic}</div><div style={{fontSize:12,fontWeight:700,color:type===b.id?T.a:T.t,fontFamily:D}}>{b.l}</div><div style={{fontSize:9,color:T.d}}>{b.d}</div></button>)}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:8,marginBottom:10}}>
              <Card t="ขนาดอาคาร" ic="📏" c="b" ch={<><Inp l="กว้าง" u="m" v={width} set={setW} mn={4} mx={60}/><Inp l="ยาว" u="m" v={length} set={setL} mn={4} mx={150}/><Inp l="สูงชายคา" u="m" v={eaveH} set={setH} mn={2.5} mx={20}/><Inp l="ลาดหลังคา" u="°" v={slope} set={setSl} mn={3} mx={45} st={1}/><Inp l="ระยะเฟรม" u="m" v={spacing} set={setSp} mn={3} mx={12}/><Inp l="ระยะแป" u="m" v={purlinSp} set={setPS} mn={0.8} mx={2.5} st={0.1}/></>}/>
              <Card t="ระบบโครงสร้าง" ic="⚙️" c="p" ch={<><Sel l="โครงสร้าง" v={struct} set={setSt} opts={[{v:"steel",l:"🔩 เหล็ก"},{v:"concrete",l:"🧱 คสล."}]}/><Sel l="หลังคา" v={roofType} set={setRT} opts={ROOF_TYPES.map(r=>({v:r.id,l:r.l}))}/><Sel l="แผ่นหลังคา" v={roofSheet} set={setRS} opts={ROOF_SHEETS.map(r=>({v:r.id,l:r.l}))}/><Sel l="ผนัง" v={wallType} set={setWT} opts={WALL_TYPES.map(x=>({v:x.id,l:`${x.l} (${x.cost}฿)`}))}/><Sel l="น้ำหนักจร" v={liveType} set={setLT} opts={Object.entries(LL).map(([k,v])=>({v:k,l:`${k} (${v})`}))}/></>}/>
              <Card t="สภาพพื้นที่" ic="🌍" c="w" ch={<><Sel l="ชั้นดิน" v={soilType} set={setSoil} opts={SOIL_TYPES.map(s=>({v:s.id,l:s.l}))}/><Sel l="โซนลม" v={windZone} set={setWZ} opts={WIND_ZONES.map(z=>({v:z.id,l:`${z.l} (${z.v}m/s)`}))}/>{bt?.hasCrane&&<Sel l="เครน" v={craneT} set={v=>setCrane(parseInt(v))} opts={CRANE_CAP.map(c=>({v:c,l:c===0?"ไม่มี":`${c}t`}))}/>}{bt?.hasMezz&&<><div style={{display:"flex",alignItems:"center",gap:5,marginBottom:6}}><input type="checkbox" checked={hasMezz} onChange={e=>setMezz(e.target.checked)}/><span style={{fontSize:11}}>ชั้นลอย</span></div>{hasMezz&&<><Inp l="กว้าง" u="m" v={mezzW} set={setMW} mn={3} mx={width*0.8}/><Inp l="ยาว" u="m" v={mezzL} set={setML} mn={3} mx={length*0.8}/></>}</>}{(struct==="concrete"||bt?.fl===2)&&<><Sel l="คอนกรีต" v={conc} set={setConc} opts={Object.keys(CONC).map(k=>({v:k,l:k}))}/><Inp l="หนาพื้น" u="cm" v={slab} set={setSlab} mn={8} mx={25} st={1}/></>}</>}/>
            </div>
            <div style={{display:"flex",gap:5,marginBottom:12,flexWrap:"wrap"}}>
              <Btn c="a" ch="⚡ คำนวณครบวงจร" onClick={doCalc}/>
              {results&&<><Btn c="b" ch={pdfLd?"...":"📄 PDF"} onClick={doPDF} dis={pdfLd} outline/><Btn c="ok" ch="✅ ตรวจมาตรฐาน" onClick={()=>{setPage("compliance");runF("compliance");}} outline/></>}
            </div>
            {results&&<div className="fi">
              <div style={{background:T.s1,borderRadius:8,border:`1.5px solid ${T.a}30`,padding:"8px 10px",marginBottom:10,display:"flex",flexWrap:"wrap",gap:2,justifyContent:"center"}}>
                <Stat l="ขนาด" v={`${width}×${length}`} u="m"/><Stat l="พื้นที่" v={results.qty.tArea} u="m²"/><Stat l="เฟรม" v={results.qty.nF}/><Stat l="เสา" v={results.qty.nC}/><Stat l="เหล็ก" v={`${(parseFloat(results.qty.steelW)/1000).toFixed(1)}`} u="t"/><Stat l="ราคา" v={`฿${results.cost.totalM}M`}/>
              </div>
              <div style={{display:"flex",gap:2,marginBottom:8,borderBottom:`2px solid ${T.bd}`,flexWrap:"wrap"}}>
                {[{id:"loads",l:"น้ำหนัก"},{id:"members",l:"โครงสร้าง"},{id:"purlin",l:"แป/อกไก่"},{id:"wind",l:"แรงลม"},{id:"found",l:"ฐานราก"},{id:"drain",l:"ระบายน้ำ"},{id:"mep",l:"MEP"},{id:"boq",l:"BOQ"}].map(t=>
                  <button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"6px 10px",border:"none",borderRadius:"6px 6px 0 0",cursor:"pointer",fontSize:11,fontWeight:tab===t.id?700:500,background:tab===t.id?T.s1:"transparent",color:tab===t.id?T.a:T.d,borderBottom:tab===t.id?`2px solid ${T.a}`:"2px solid transparent",fontFamily:F}}>{t.l}</button>)}
              </div>
              {tab==="loads"&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:8}}>
                <Card t="หลังคา" ic="🏗️" c="b" ch={<><Row l="Dead Load" v={results.loads.rDL} u="kg/m²"/><Row l="Live Load" v={results.loads.rLL} u="kg/m²"/><Row l="Wind Uplift" v={results.loads.rWL.toFixed(1)} u="kg/m²"/><Row l="รวม DL+LL" v={results.loads.rT} u="kg/m²" h/></>}/>
                <Card t="ผนัง" ic="🧱" c="p" ch={<><Row l="DL ผนัง" v={results.loads.wDL} u="kg/m²"/><Row l="ลมผนัง" v={results.loads.windWall.toFixed(1)} u="kg/m²"/><Row l="พื้นที่ผนัง" v={results.qty.wallArea} u="m²" h/></>}/>
              </div>}
              {tab==="members"&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:8}}>
                {results.beam&&<Card t="คานหลัก/Rafter" ic="📐" c="a" ch={<><Row l="หน้าตัด" v={results.beam.n} h/><Row l="M" v={results.bM} u="t·m"/><Row l="V" v={results.bV} u="t"/><PF ok={parseFloat(results.beam.Sp)>=parseFloat(results.beam.Sr)} tx="Section Check"/>{results.beam.warn&&<PF ok={false} tx="⚠️ ใช้ Truss/Built-up"/>}</>}/>}
                {results.col&&<Card t="เสา" ic="🏛️" c="a" ch={<><Row l="หน้าตัด" v={results.col.n} h/><Row l="P" v={results.cP} u="t"/><Row l="KL/r" v={results.col.sl}/><PF ok={results.col.A>=parseFloat(results.col.Ar)} tx="Column Check"/></>}/>}
                <Card t="ค้ำยัน" ic="✕" c="b" ch={<><Row l="หน้าตัด" v={results.brace.n} h/><Row l="แรง" v={results.brace.force} u="kg"/></>}/>
                {results.crane&&<Card t={`เครน ${results.crane.load}t`} ic="🏗️" c="w" ch={<><Row l="คานเครน" v={results.crane.n} h/><Row l="M" v={results.crane.M} u="t·m"/></>}/>}
                {results.mezz&&<Card t="ชั้นลอย" ic="▦" c="p" ch={<><Row l="ขนาด" v={`${results.mezz.w}×${results.mezz.l}`} u="m" h/><Row l="คาน" v={results.mezz.beam.n}/></>}/>}
                {results.rcB&&<Card t="คาน คสล." ic="📐" c="p" ch={<><Row l="ขนาด" v={`${results.rcB.w}×${results.rcB.d}`} u="cm" h/><Row l="เหล็ก" v={results.rcB.bar} h/></>}/>}
                {results.rcC&&<Card t="เสา คสล." ic="🏛️" c="p" ch={<><Row l="ขนาด" v={results.rcC.size} u="cm" h/><Row l="เหล็ก" v={results.rcC.bar} h/></>}/>}
              </div>}
              {tab==="purlin"&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:8}}>
                <Card t="แป Purlin" ic="═" c="b" ch={<><Row l="หน้าตัด" v={results.purlin.n} h/><Row l="ระยะ" v={purlinSp} u="m"/><Row l="จำนวนรวม" v={results.purlin.qty} u="ตัว" h/><PF ok={parseFloat(results.purlin.Sp)>=parseFloat(results.purlin.Sr)} tx="Purlin Check"/></>}/>
                <Card t="อกไก่ Girt" ic="║" c="p" ch={<><Row l="หน้าตัด" v={results.girt.n} h/><Row l="จำนวน" v={results.girt.qty} u="ตัว" h/><PF ok={parseFloat(results.girt.Sp)>=parseFloat(results.girt.Sr)} tx="Girt Check"/></>}/>
              </div>}
              {tab==="wind"&&<Card t="แรงลม มยผ.1311" ic="🌪️" c="b" ch={<><Row l="โซน" v={results.windAnalysis.zone} h/><Row l="ความเร็ว" v={results.windAnalysis.speed} u="m/s"/><Row l="qz" v={results.windAnalysis.qz} u="kg/m²"/><Row l="ผนังต้นลม Cp+0.8" v={results.windAnalysis.windward.p} u="kg/m²"/><Row l="ผนังท้ายลม Cp-0.5" v={results.windAnalysis.leeward.p} u="kg/m²"/><Row l="หลังคาต้นลม" v={`Cp=${results.windAnalysis.roofWW.Cp}`}/><Row l="Base Shear" v={results.windAnalysis.baseShear} u="t" h/><Row l="Overturning" v={results.windAnalysis.overturn} u="t·m" h/><Row l="Uplift" v={results.windAnalysis.uplift} u="t" h/></>}/>}
              {tab==="found"&&<Card t="ฐานราก" ic="🧱" c="a" ch={<><Row l="ดิน" v={SOIL_TYPES.find(s=>s.id===soilType)?.l} h/><Row l="ประเภท" v={results.found.type} h/>{results.found.pile?<><Row l="เข็ม/จุด" v={results.found.nPiles} u="ต้น" h/><Row l="Ø" v={results.found.dia} u="m"/><Row l="ยาว" v={results.found.len} u="m"/><Row l="Pile Cap" v={results.found.cap} u="m"/></>:<><Row l="ขนาด" v={results.found.size} u="m" h/><Row l="ลึก" v={results.found.depth} u="m"/></>}<Row l="P/เสา" v={results.found.load} u="t"/></>}/>}
              {tab==="drain"&&<Card t="ระบายน้ำ" ic="🌧️" c="b" ch={<><Row l="หลังคา" v={results.drainage.roofArea} u="m²"/><Row l="อัตราไหล" v={results.drainage.flow} u="L/s"/><Row l="รางน้ำ" v={results.drainage.gutter} u="mm" h/><Row l="ท่อระบาย" v={results.drainage.downpipe} u="mm" h/><Row l="จำนวนท่อ" v={results.drainage.nDown}/><Row l="บ่อพัก" v={results.drainage.catchPit} u="จุด"/></>}/>}
              {tab==="mep"&&<Card t="MEP" ic="⚡" c="p" ch={<><Row l="ไฟฟ้ารวม" v={results.mep.elec} u="kW"/><Row l="หม้อแปลง" v={results.mep.trafo} u="kVA" h/><Row l="แสงสว่าง" v={results.mep.light} u="kW"/><Row l="ห้องน้ำ" v={results.mep.toilet} u="ชุด"/><Row l="ถังน้ำ" v={results.mep.water} u="m³"/><Row l="ถังดับเพลิง" v={results.mep.fireExt}/></>}/>}
              {tab==="boq"&&<div>
                {results.boq.items.map((item,i)=><div key={i} style={{display:"flex",padding:"6px 0",borderBottom:`1px solid ${T.bd}25`,gap:6}}>
                  <div style={{flex:1,fontSize:11}}>{item.cat}</div><div style={{fontSize:10,color:T.d,width:70,textAlign:"right"}}>{item.qty}</div>
                  <div style={{width:35,textAlign:"right",fontSize:9,color:T.d}}>{item.pct}%</div>
                  <div style={{fontSize:11,fontWeight:700,color:T.a,width:70,textAlign:"right",fontFamily:MO}}>฿{(item.cost/1e6).toFixed(2)}M</div></div>)}
                <div style={{display:"flex",padding:"8px 0",borderTop:`2px solid ${T.a}`,marginTop:3}}>
                  <div style={{flex:1,fontSize:12,fontWeight:800,fontFamily:D}}>รวม</div>
                  <div style={{fontSize:9,color:T.d,marginRight:6}}>{results.qty.tArea}m² @฿{results.cost.rate.toLocaleString()}/m²</div>
                  <div style={{fontSize:16,fontWeight:800,color:T.a,fontFamily:D}}>฿{results.cost.totalM}M</div>
                </div></div>}
            </div>}
          </div>}

          {page==="nlp"&&<div className="fi"><Card t="พิมพ์ไทย → AI คำนวณ" ic="💬" c="a" ch={<>
            <textarea value={nlpTx} onChange={e=>setNT(e.target.value)} placeholder='เช่น: "โกดังเหล็ก 20x40 สูง8m ผนังALC เครน5t ดินอ่อน"' style={{...sI,height:65,resize:"vertical",fontFamily:F,lineHeight:1.6}}/>
            <div style={{display:"flex",gap:3,marginTop:6,flexWrap:"wrap"}}>
              <Btn c="a" ch={nlpLd?"...":"🚀 วิเคราะห์"} onClick={doNlp} dis={nlpLd}/>
              {["โกดัง 15x30 สูง7m เครน10t","โชว์รูมรถ 20x40 ผนังกระจก","โรงงาน 24x60 เพิงหมาแหงน"].map((ex,i)=>
                <button key={i} onClick={()=>setNT(ex)} style={{padding:"4px 7px",borderRadius:5,border:`1px solid ${T.bd}`,background:"transparent",color:T.d,fontSize:10,cursor:"pointer"}}>{ex}</button>)}</div></>}/>
            {nlpR&&!nlpR.error&&<Card t="ผลวิเคราะห์" ic="✨" c="ok" ch={<><div style={{fontSize:12,lineHeight:1.8}}>{nlpR.summary}</div><Btn c="ok" full ch="✅ ใช้ค่า → คำนวณ" onClick={()=>applyP(nlpR)}/></>}/>}
            {nlpR?.error&&<Card t="Error" ic="⚠️" c="e" ch={<div style={{fontSize:11,color:T.e}}>{nlpR.raw||"ลองใหม่"}</div>}/>}
          </div>}

          {page==="reader"&&<div className="fi"><Card t="AI อ่านแบบ" ic="📷" c="b" ch={<>
            <div style={{border:`2px dashed ${T.bd}`,borderRadius:8,padding:16,textAlign:"center",background:T.s2,position:"relative",marginBottom:8}}>
              <input type="file" accept="image/*,.pdf" onChange={handleFile} style={{position:"absolute",inset:0,opacity:0,cursor:"pointer"}}/>
              {rdPrev?<img src={rdPrev} alt="" style={{maxWidth:"100%",maxHeight:180,borderRadius:6}}/>:<div><div style={{fontSize:28}}>📎</div><div style={{fontSize:11,color:T.d}}>อัปโหลดแบบ</div></div>}</div>
            {rdImg&&<Btn c="b" full ch={rdLd?"...":"🔍 AI อ่าน"} onClick={doRead} dis={rdLd}/>}</>}/>
            {rdR&&!rdR.error&&<Card t="ผลอ่านแบบ" ic="✨" c="ok" ch={<><div style={{fontSize:12,lineHeight:1.8}}>{rdR.summary}</div><Btn c="ok" full ch="✅ ใช้ค่า" onClick={()=>applyP(rdR)}/></>}/>}
          </div>}

          {page==="chat"&&<div className="fi" style={{display:"flex",flexDirection:"column",height:"calc(100vh - 120px)"}}>
            <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:5,padding:"4px 0"}}>
              {chatMsgs.length===0&&<div style={{textAlign:"center",padding:24,color:T.d}}>
                <div style={{fontSize:32}}>🤖</div><div style={{fontSize:13,fontWeight:700,fontFamily:D}}>AI วิศวกรโยธาครบวงจร</div>
                <div style={{fontSize:10,marginTop:3}}>โครงสร้าง แป ค้ำยัน ฐานราก เครน ชั้นลอย แรงลม ระบายน้ำ MEP ใบอนุญาต</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:3,justifyContent:"center",marginTop:10}}>
                  {["โกดัง span 20m ใช้เหล็กอะไร?","แป C-150 รับได้เท่าไร?","ดินอ่อน กทม. ใช้เข็มอะไร?","ผนัง ALC vs เมทัลชีท?","เครน 10t เสริมอะไร?","ใบอนุญาตโกดัง?","Solar Rooftop คุ้มไหม?"].map((q,i)=>
                    <button key={i} onClick={()=>setCI(q)} style={{padding:"4px 7px",borderRadius:5,border:`1px solid ${T.bd}`,background:T.s1,color:T.d,fontSize:9,cursor:"pointer"}}>{q}</button>)}</div>
              </div>}
              {chatMsgs.map((m,i)=><div key={i} style={{alignSelf:m.role==="user"?"flex-end":"flex-start",maxWidth:"82%",padding:"7px 10px",borderRadius:8,background:m.role==="user"?T.aBg:T.s1,border:`1px solid ${m.role==="user"?T.a+"40":T.bd}`,fontSize:12,lineHeight:1.8,whiteSpace:"pre-wrap"}}>
                {m.role==="assistant"&&<div style={{fontSize:9,color:T.a,fontWeight:700,marginBottom:2}}>🤖 AI</div>}{m.content}</div>)}
              {chatLd&&<div style={{padding:8,background:T.s1,borderRadius:8}}><div style={{width:16,height:16,border:`2px solid ${T.bd}`,borderTop:`2px solid ${T.a}`,borderRadius:"50%",animation:"spin .8s linear infinite",display:"inline-block",marginRight:6}}/><span style={{fontSize:11,color:T.d}}>คิด...</span></div>}
              <div ref={chatE}/></div>
            <div style={{display:"flex",gap:5,paddingTop:6,borderTop:`1px solid ${T.bd}`}}>
              <input value={chatIn} onChange={e=>setCI(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendChat()} placeholder="ถามเรื่องก่อสร้าง..." style={{...sI,flex:1,fontFamily:F}}/>
              <Btn c="a" ch="ส่ง" onClick={sendChat} dis={chatLd}/></div>
          </div>}

          {/* ALL AI FEATURES */}
          {Object.entries(features).map(([key,f])=>(
            page===key&&<div key={key} className="fi">
              {!results?<Card t={f.t} ic={f.ic} c={f.c} ch={<div style={{textAlign:"center",padding:16,color:T.d}}><div style={{fontSize:24}}>📐</div><div style={{fontSize:11,marginTop:4}}>คำนวณโครงสร้างก่อน</div><div style={{marginTop:6}}><Btn c="a" ch="→ คำนวณ" onClick={()=>setPage("calc")}/></div></div>}/>:
              gS(key).ld?<Ld t={`AI วิเคราะห์ ${f.t}...`}/>:
              !gS(key).r?<Card t={f.t} ic={f.ic} c={f.c} ch={<><div style={{fontSize:11,color:T.d,marginBottom:8,lineHeight:1.8}}>{f.d}</div><Btn c={f.c} full ch="🚀 วิเคราะห์" onClick={()=>runF(key)}/></>}/>:
              <div className="fi"><Card t={f.t} ic="✨" c="ok" ch={<AIR data={gS(key).r}/>}/><div style={{marginTop:4}}><Btn c={f.c} ch="🔄 ใหม่" onClick={()=>runF(key)} outline/></div></div>}
            </div>))}

          <div style={{marginTop:16,padding:8,borderRadius:6,background:T.eBg,border:`1px solid ${T.e}20`,fontSize:9,color:T.d}}>
            <span style={{fontWeight:700,color:T.e}}>⚠️ Preliminary Design</span> — ตรวจสอบโดย กว. ตาม มยผ./วสท./พ.ร.บ.ควบคุมอาคาร
          </div>
        </div>
      </div>
    </div>
  );
}
