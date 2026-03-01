import { useState, useRef, useEffect, useMemo } from "react";

// ═══════════════════════════════════════════════════════════
// THEME
// ═══════════════════════════════════════════════════════════
const C = {
  bg:"#04080e",s1:"#0a1220",s2:"#101c30",s3:"#182840",
  bd:"#1c2e50",bdL:"#2a4472",
  a:"#ffb200",aD:"#c88a00",aG:"#ffb20025",
  t:"#e6ecf5",d:"#5a7098",dL:"#8da4c4",
  ok:"#00e68a",okB:"#00e68a10",
  w:"#ffa94d",wB:"#ffa94d10",
  e:"#ff6b6b",eB:"#ff6b6b10",
  b:"#4cc9f0",bB:"#4cc9f010",
  p:"#c084fc",pB:"#c084fc10",
  cy:"#22d3ee",mg:"#f472b6",
};
const F=`'IBM Plex Sans Thai',system-ui,sans-serif`;
const M=`'JetBrains Mono',monospace`;

// ═══════════════════════════════════════════════════════════
// ENGINEERING DATA (compact)
// ═══════════════════════════════════════════════════════════
const BT=[
  {id:"warehouse",l:"โกดัง",ic:"🏭",fl:1,ds:"โครงเหล็ก โครงถัก"},
  {id:"showroom",l:"โชว์รูม",ic:"🏪",fl:1,ds:"โครงเหล็ก ช่วงกว้าง"},
  {id:"one_story",l:"อาคาร 1 ชั้น",ic:"🏠",fl:1,ds:"คสล./เหล็ก"},
  {id:"two_story",l:"อาคาร 2 ชั้น",ic:"🏢",fl:2,ds:"คอนกรีตเสริมเหล็ก"},
];
const SB=[
  {n:"H-200x100",d:200,A:27.16,Ix:1840,w:21.3},{n:"H-250x125",d:250,A:37.66,Ix:3960,w:29.6},
  {n:"H-300x150",d:300,A:46.78,Ix:7210,w:36.7},{n:"H-350x175",d:350,A:63.14,Ix:13600,w:49.6},
  {n:"H-400x200",d:400,A:84.12,Ix:23700,w:66},{n:"H-500x200",d:500,A:114.2,Ix:47800,w:89.7},
  {n:"H-600x200",d:600,A:134.4,Ix:76800,w:106},
];
const SC=[
  {n:"H-150x150",d:150,A:40.14,Ix:1640,w:31.5},{n:"H-200x200",d:200,A:63.53,Ix:4720,w:49.9},
  {n:"H-250x250",d:250,A:92.18,Ix:10800,w:72.4},{n:"H-300x300",d:300,A:119.8,Ix:20400,w:94},
  {n:"H-350x350",d:350,A:173.9,Ix:40300,w:136},{n:"H-400x400",d:400,A:218.7,Ix:66600,w:172},
];
const LL={warehouse:500,showroom:400,commercial:300,office:200,residential:200};
const CONC={"C21/240":240,"C25/280":280,"C28/320":320,"C32/350":350};
const RB={"SD40":4000,"SD50":5000};

// ═══════════════════════════════════════════════════════════
// CALC ENGINE
// ═══════════════════════════════════════════════════════════
function calc(p){
  const bt=BT.find(b=>b.id===p.type);
  const fl=bt.fl,ll=LL[p.liveType]||300;
  const rDL=p.struct==="steel"?25:60,rLL=30,rT=rDL+rLL;
  const fDL=p.slab*24+210,fT=fDL+ll;
  const ridge=(p.width/2)*Math.tan(p.slope*Math.PI/180);
  const rafter=(p.width/2)/Math.cos(p.slope*Math.PI/180);
  const nF=Math.floor(p.length/p.spacing)+1,nC=nF*2;
  const area=p.width*p.length,tArea=area*(fl===2?2:1);

  let beam=null,col=null,bM=0,bV=0,cP=0;
  if(p.struct==="steel"){
    const w=(rT*p.spacing)/100,L=p.width*100;
    bM=w*L*L/8;bV=w*L/2;
    const Sr=bM/(0.66*2500);
    for(const s of SB){const S=s.Ix*2/s.d;if(S>=Sr){beam={...s,Sr:Sr.toFixed(1),Sp:S.toFixed(1)};break;}}
    if(!beam)beam={...SB[SB.length-1],warn:true};
    cP=(rT*p.width*p.spacing/2)*1.1;
    if(fl===2)cP+=fT*(p.width/2)*p.spacing*1.1;
    const Ar=cP/(0.6*2500);
    for(const s of SC){if(s.A>=Ar){const r=Math.sqrt(s.Ix/s.A);col={...s,Ar:Ar.toFixed(1),sl:(p.eaveH*100/r).toFixed(1)};break;}}
    if(!col)col={...SC[SC.length-1],warn:true};
  }

  let rcB=null,rcC=null,rcS=null;
  const fc=CONC[p.conc]||240,fy=RB[p.rebar]||4000;
  if(p.struct==="concrete"||fl===2){
    const sW=1.4*(p.slab*24+110)+1.7*ll,sL=Math.min(p.spacing,p.width/2)*100;
    const sM=(sW/100)*sL*sL/10,sD=p.slab-3,sA=sM/(0.9*fy*0.9*sD);
    rcS={t:p.slab,wu:sW.toFixed(0),Mu:(sM/1e5).toFixed(2),As:sA.toFixed(2),bar:sA<3?"DB12@200":sA<5?"DB12@150":sA<7?"DB16@200":"DB16@150"};
    const bSp=p.width*100/2,bW=(1.4*(fDL+50)+1.7*ll)*p.spacing/100;
    const bMu=bW*bSp*bSp/8,bW2=Math.max(20,Math.round(bSp/20/5)*5),bD=Math.max(30,Math.round(bSp/12/5)*5);
    const bAs=bMu/(0.9*fy*0.9*(bD-5));
    rcB={w:bW2,d:bD,span:(bSp/100).toFixed(1),Mu:(bMu/1e5).toFixed(2),As:bAs.toFixed(2),bar:bAs<8?"3-DB20":bAs<12?"4-DB20":"4-DB25",stir:"DB10@150"};
    const cPu=fl===2?(1.4*(fDL+rDL)+1.7*(ll+rLL))*(p.width/2)*p.spacing*2:(1.4*(fDL+rDL)+1.7*(ll+rLL))*(p.width/2)*p.spacing;
    const cA=cPu/(0.65*(0.85*fc/10+0.02*fy)),cS=Math.max(20,Math.ceil(Math.sqrt(cA)/5)*5);
    rcC={size:`${cS}x${cS}`,Pu:(cPu/1000).toFixed(1),bar:cS<=25?"4-DB16":cS<=30?"4-DB20":"8-DB25",tie:cS<=30?"DB10@200":"DB10@150"};
  }

  const fL=p.struct==="steel"?(cP/1000):(rcC?parseFloat(rcC.Pu)/1.5:10);
  const fSz=Math.max(1,Math.ceil(Math.sqrt(fL/10)*10)/10);
  const fDp=Math.max(0.3,Math.round(fSz*0.3*10)/10);
  const found={load:fL.toFixed(1),size:`${fSz.toFixed(1)}x${fSz.toFixed(1)}`,depth:fDp.toFixed(1),type:fL>30?"เสาเข็ม":"ฐานรากแผ่"};
  const stW=p.struct==="steel"?((beam?beam.w*p.width*nF:0)+(col?col.w*p.eaveH*nC:0)):0;
  const rate=p.struct==="steel"?(p.type==="warehouse"?5500:p.type==="showroom"?7000:8000):(fl===2?12000:9000);

  return{info:{...bt,width:p.width,length:p.length,eaveH:p.eaveH,fl,ridge:ridge.toFixed(2),rafter:rafter.toFixed(2),area,tArea},
    loads:{rDL,rLL,rT,fDL:fl===2?fDL:null,ll,fT:fl===2?fT:null},
    beam,col,rcB,rcC,rcS:fl===2?rcS:null,found,
    bM:(bM/1e5).toFixed(2),bV:(bV/1e3).toFixed(2),cP:(cP/1e3).toFixed(2),
    qty:{nF,nC,stW:stW.toFixed(0),area,tArea},
    cost:{rate,total:tArea*rate,totalM:(tArea*rate/1e6).toFixed(2)},params:p};
}

// ═══════════════════════════════════════════════════════════
// AI HELPER
// ═══════════════════════════════════════════════════════════
async function ai(msgs,sys){
  try{
    const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:3000,
        system:sys||"คุณเป็นวิศวกรโครงสร้างผู้เชี่ยวชาญชาวไทย ตอบภาษาไทย อ้างอิงมาตรฐาน มยผ./วสท./ACI/AISC ตอบกระชับแต่ละเอียด",
        messages:msgs})});
    const d=await r.json();
    return d.content?.map(b=>b.text||"").join("\n")||"ไม่สามารถประมวลผลได้";
  }catch(e){return "เกิดข้อผิดพลาด: "+e.message;}
}
async function aiJSON(prompt,sys){
  const r=await ai([{role:"user",content:prompt}],sys||"ตอบเป็น JSON เท่านั้น ไม่มี markdown backticks ไม่มีข้อความอื่น");
  try{return JSON.parse(r.replace(/```json?|```/g,"").trim());}catch{return{error:true,raw:r};}
}
async function aiVision(b64,type,prompt){
  try{
    const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:2000,
        system:"วิศวกรโครงสร้าง อ่านแบบก่อสร้าง ตอบ JSON เท่านั้น",
        messages:[{role:"user",content:[{type:"image",source:{type:"base64",media_type:type,data:b64}},{type:"text",text:prompt}]}]})});
    const d=await r.json();
    const t=d.content?.map(b=>b.text||"").join("\n")||"{}";
    return JSON.parse(t.replace(/```json?|```/g,"").trim());
  }catch{return{error:true};}
}

// ═══════════════════════════════════════════════════════════
// UI COMPONENTS
// ═══════════════════════════════════════════════════════════
const sI={width:"100%",padding:"8px 11px",background:C.bg,border:`1px solid ${C.bd}`,borderRadius:6,color:C.t,fontSize:13,fontFamily:M,outline:"none",boxSizing:"border-box"};

function Inp({l,u,v,set,mn,mx,st=0.5,ty="number"}){
  return<div style={{marginBottom:8}}><label style={{display:"block",fontSize:10,color:C.d,marginBottom:2,fontFamily:F,fontWeight:600}}>{l}</label>
    <div style={{display:"flex",gap:4,alignItems:"center"}}><input type={ty} value={v} onChange={e=>set(ty==="number"?parseFloat(e.target.value)||0:e.target.value)} min={mn} max={mx} step={st} style={{...sI,flex:1}}/>{u&&<span style={{fontSize:10,color:C.d}}>{u}</span>}</div></div>;
}
function Sel({l,v,set,opts}){
  return<div style={{marginBottom:8}}><label style={{display:"block",fontSize:10,color:C.d,marginBottom:2,fontFamily:F,fontWeight:600}}>{l}</label>
    <select value={v} onChange={e=>set(e.target.value)} style={{...sI,cursor:"pointer"}}>{opts.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}</select></div>;
}
function Crd({t,ic,c=C.a,ch}){
  return<div style={{background:C.s1,borderRadius:10,border:`1px solid ${C.bd}`,overflow:"hidden",marginBottom:10}}>
    <div style={{padding:"9px 12px",borderBottom:`1px solid ${C.bd}`,display:"flex",alignItems:"center",gap:6,background:`${c}06`}}>
      <span style={{fontSize:14}}>{ic}</span><span style={{fontSize:12,fontWeight:700,color:c,fontFamily:F}}>{t}</span>
    </div><div style={{padding:12}}>{ch}</div></div>;
}
function Rw({l,v,u,h}){
  return<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 0",borderBottom:`1px solid ${C.bd}12`}}>
    <span style={{fontSize:11,color:C.d,fontFamily:F}}>{l}</span>
    <span style={{fontSize:12,fontWeight:h?700:500,color:h?C.a:C.t,fontFamily:M}}>{v}{u&&<span style={{fontSize:9,color:C.d}}> {u}</span>}</span></div>;
}
function PF({ok,tx}){return<div style={{marginTop:6,padding:8,borderRadius:6,textAlign:"center",fontSize:12,fontWeight:700,background:ok?C.okB:C.eB,color:ok?C.ok:C.e}}>{ok?"✅":"❌"} {tx}</div>;}
function Btn({c=C.a,full,ch,onClick,dis}){
  return<button onClick={onClick} disabled={dis} style={{padding:full?"11px 18px":"7px 14px",borderRadius:7,border:"none",cursor:dis?"not-allowed":"pointer",
    background:`linear-gradient(135deg,${c},${c}bb)`,color:c===C.a?"#000":"#fff",fontSize:full?14:12,fontWeight:700,fontFamily:F,
    width:full?"100%":"auto",boxShadow:`0 2px 10px ${c}25`,opacity:dis?.6:1,transition:"all .15s"}}>{ch}</button>;
}
function AIBadge(){return<span style={{padding:"1px 6px",borderRadius:8,background:`${C.a}20`,color:C.a,fontSize:9,fontWeight:700,marginLeft:4}}>AI</span>;}
function LoadDots({t}){return<div style={{textAlign:"center",padding:24}}><div style={{fontSize:24,animation:"pulse 1.2s infinite"}}>🤖</div><div style={{fontSize:12,color:C.d,marginTop:6}}>{t||"AI กำลังวิเคราะห์..."}</div></div>;}

// context string builder
function ctx(r,p){
  if(!r)return"";
  const bt=BT.find(b=>b.id===p.type);
  return `[โครงการ: ${bt.l} ${p.width}x${p.length}m สูง${p.eaveH}m โครงสร้าง${p.struct} น้ำหนักจร${LL[p.liveType]}kg/m² `+
    `${r.beam?`คาน=${r.beam.n} `:""}${r.col?`เสา=${r.col.n} `:""}${r.rcB?`คานRC=${r.rcB.w}x${r.rcB.d}cm `:""}${r.rcC?`เสาRC=${r.rcC.size}cm `:""}` +
    `ฐานราก=${r.found.size}m ราคา≈${r.cost.totalM}ล้าน]`;
}

// ═══════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════
export default function App(){
  // Params
  const[type,setType]=useState("warehouse");
  const[width,setW]=useState(12);const[length,setL]=useState(24);
  const[eaveH,setH]=useState(6);const[floorH2,setH2]=useState(3.5);
  const[slope,setSl]=useState(15);const[spacing,setSp]=useState(6);
  const[struct,setSt]=useState("steel");const[liveType,setLT]=useState("warehouse");
  const[conc,setConc]=useState("C25/280");const[rebar,setRebar]=useState("SD40");
  const[slab,setSlab]=useState(12);

  const[results,setR]=useState(null);
  const[tab,setTab]=useState("loads");
  const[page,setPage]=useState("calc");

  // AI states (15 features)
  const[chatMsgs,setCM]=useState([]);const[chatIn,setCI]=useState("");const[chatLd,setCL]=useState(false);
  const chatE=useRef(null);
  const[nlpTx,setNlpTx]=useState("");const[nlpLd,setNlpLd]=useState(false);const[nlpR,setNlpR]=useState(null);
  const[rdImg,setRdImg]=useState(null);const[rdPrev,setRdPrev]=useState(null);const[rdLd,setRdLd]=useState(false);const[rdR,setRdR]=useState(null);
  const[compLd,setCompLd]=useState(false);const[compR,setCompR]=useState(null);
  const[pdfLd,setPdfLd]=useState(false);

  // NEW 10 AI features states
  const[cmpLd,setCmpLd]=useState(false);const[cmpR,setCmpR]=useState(null); // 6. Smart Comparison
  const[riskLd,setRiskLd]=useState(false);const[riskR,setRiskR]=useState(null); // 7. Risk Analysis
  const[optLd,setOptLd]=useState(false);const[optR,setOptR]=useState(null); // 8. Optimizer
  const[seqLd,setSeqLd]=useState(false);const[seqR,setSeqR]=useState(null); // 9. Construction Sequence
  const[seiLd,setSeiLd]=useState(false);const[seiR,setSeiR]=useState(null); // 10. Seismic Check
  const[conLd,setConLd]=useState(false);const[conR,setConR]=useState(null); // 11. Connection Design
  const[etbLd,setEtbLd]=useState(false);const[etbR,setEtbR]=useState(null); // 12. ETABS Generator
  const[qcLd,setQcLd]=useState(false);const[qcR,setQcR]=useState(null); // 13. QC Checklist
  const[dtlLd,setDtlLd]=useState(false);const[dtlR,setDtlR]=useState(null); // 14. Cost Breakdown
  const[prezLd,setPrezLd]=useState(false);const[prezR,setPrezR]=useState(null); // 15. Client Presentation

  const bt=BT.find(b=>b.id===type);const is2=bt?.fl===2;
  const p={type,width,length,eaveH,floorH2,slope,spacing,struct,liveType,conc,rebar,slab};

  const chgType=(id)=>{
    setType(id);setR(null);setCompR(null);setCmpR(null);setRiskR(null);setOptR(null);setSeqR(null);setSeiR(null);setConR(null);setEtbR(null);setQcR(null);setDtlR(null);setPrezR(null);
    if(id==="warehouse"){setW(12);setL(24);setH(6);setSt("steel");setLT("warehouse");setSp(6);}
    if(id==="showroom"){setW(15);setL(30);setH(5);setSt("steel");setLT("showroom");setSp(6);}
    if(id==="one_story"){setW(10);setL(20);setH(3.5);setSt("concrete");setLT("commercial");setSp(5);}
    if(id==="two_story"){setW(10);setL(20);setH(3.5);setSt("concrete");setLT("commercial");setSp(5);}
  };
  const doCalc=()=>{const r=calc(p);setR(r);setTab("loads");};
  const applyP=(np)=>{if(np.type)chgType(np.type);if(np.width)setW(np.width);if(np.length)setL(np.length);if(np.eaveH)setH(np.eaveH);if(np.slope)setSl(np.slope);if(np.spacing)setSp(np.spacing);if(np.struct)setSt(np.struct);if(np.liveType)setLT(np.liveType);if(np.slab)setSlab(np.slab);setTimeout(()=>setPage("calc"),300);};

  // ─── CHAT ───
  const sendChat=async()=>{if(!chatIn.trim())return;const u=chatIn.trim();setCI("");setCL(true);
    const nm=[...chatMsgs,{role:"user",content:u}];setCM(nm);
    const r=await ai(nm.map((m,i)=>({role:m.role,content:m.content+(m.role==="user"&&i===nm.length-1?ctx(results,p):"")})));
    setCM([...nm,{role:"assistant",content:r}]);setCL(false);};
  useEffect(()=>{chatE.current?.scrollIntoView({behavior:"smooth"});},[chatMsgs]);

  // ─── NLP ───
  const doNlp=async()=>{if(!nlpTx.trim())return;setNlpLd(true);setNlpR(null);
    const r=await aiJSON(`จากข้อความ: "${nlpTx}" แยกเป็น JSON: {type,width,length,eaveH,slope,spacing,struct,liveType,slab,summary,assumptions}`,"วิศวกรโครงสร้างไทย ตอบ JSON เท่านั้น ไม่มี markdown");
    setNlpR(r);setNlpLd(false);};

  // ─── READER ───
  const handleFile=(e)=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=(ev)=>{setRdPrev(ev.target.result);setRdImg({b64:ev.target.result.split(",")[1],type:f.type});};r.readAsDataURL(f);};
  const doRead=async()=>{if(!rdImg)return;setRdLd(true);setRdR(null);
    const r=await aiVision(rdImg.b64,rdImg.type,`อ่านแบบก่อสร้างนี้ แยกเป็น JSON: {type,width,length,eaveH,slope,spacing,struct,liveType,slab,summary,confidence,notes}`);
    setRdR(r);setRdLd(false);};

  // ─── COMPLIANCE ───
  const doComp=async()=>{if(!results)return;setCompLd(true);setCompR(null);const c=ctx(results,p);
    const r=await aiJSON(`ตรวจสอบโครงสร้างนี้ตาม มยผ.1301,1302,1311 และ วสท.: ${c}\nJSON: {score:0-100,grade:"A-F",checks:[{item,standard,status:"pass|warn|fail",detail}],recommendations:[],critical:[]}`,"ผู้ตรวจสอบแบบโครงสร้าง ตอบ JSON");
    setCompR(r);setCompLd(false);};

  // ─── 6. SMART COMPARISON ───
  const doCmp=async()=>{if(!results)return;setCmpLd(true);setCmpR(null);const c=ctx(results,p);
    const r=await aiJSON(`เปรียบเทียบ 3 ทางเลือกโครงสร้างสำหรับ: ${c}
ให้เปรียบ Steel vs RC vs Hybrid แล้วตอบ JSON:
{options:[{name,struct,beam,column,cost_factor,construction_days,pros:[],cons:[],score:0-100}],recommendation:"ตัวเลือกที่ดีที่สุด",reason:"เหตุผล"}`);
    setCmpR(r);setCmpLd(false);};

  // ─── 7. RISK ANALYSIS ───
  const doRisk=async()=>{if(!results)return;setRiskLd(true);setRiskR(null);const c=ctx(results,p);
    const r=await aiJSON(`วิเคราะห์ความเสี่ยงและ Failure Mode ของโครงสร้าง: ${c}
JSON: {overall_risk:"low|medium|high",score:0-100,
risks:[{category:"structural|foundation|connection|serviceability|construction|environmental",
title,severity:"low|medium|high|critical",probability:"low|medium|high",
description,mitigation}],
failure_modes:[{mode,member,likelihood,consequence,prevention}]}`);
    setRiskR(r);setRiskLd(false);};

  // ─── 8. OPTIMIZER ───
  const doOpt=async()=>{if(!results)return;setOptLd(true);setOptR(null);const c=ctx(results,p);
    const r=await aiJSON(`หาวิธีลดต้นทุนโครงสร้าง: ${c}
JSON: {current_cost:"ราคาปัจจุบัน",optimized_cost:"ราคาหลัง optimize",saving_percent:ตัวเลข,
changes:[{item:"สิ่งที่เปลี่ยน",from:"จาก",to:"เป็น",saving:"ประหยัด",reason:"เหตุผล"}],
alternative_spacings:[{spacing:ตัวเลข,cost_factor:ตัวเลข,note:"หมายเหตุ"}],
summary:"สรุป"}`);
    setOptR(r);setOptLd(false);};

  // ─── 9. CONSTRUCTION SEQUENCE ───
  const doSeq=async()=>{if(!results)return;setSeqLd(true);setSeqR(null);const c=ctx(results,p);
    const r=await aiJSON(`วางแผนลำดับการก่อสร้าง: ${c}
JSON: {total_days:ตัวเลข,phases:[{phase:ลำดับ,name:"ชื่อ",duration_days:ตัวเลข,tasks:["งาน"],equipment:["เครื่องจักร"],workers:ตัวเลข,materials:["วัสดุ"],tips:["คำแนะนำ"]}],
critical_path:["งานวิกฤต"],weather_notes:"ข้อควรระวังสภาพอากาศ"}`);
    setSeqR(r);setSeqLd(false);};

  // ─── 10. SEISMIC CHECK ───
  const doSei=async()=>{if(!results)return;setSeiLd(true);setSeiR(null);const c=ctx(results,p);
    const r=await aiJSON(`ประเมินแรงแผ่นดินไหวเบื้องต้นตาม มยผ.1302: ${c}
JSON: {zone:"โซนแผ่นดินไหว 0-4",zone_factor:ตัวเลข,importance_factor:ตัวเลข,
base_shear_percent:ตัวเลข,base_shear_ton:ตัวเลข,
story_drift:{allowable:"ค่าที่อนุญาต",estimated:"ค่าประมาณ",status:"pass|fail"},
seismic_weight_ton:ตัวเลข,
vulnerable_areas:["จุดอ่อน"],recommendations:["คำแนะนำ"],
needs_detailed_analysis:true/false,reason:"เหตุผล"}`);
    setSeiR(r);setSeiLd(false);};

  // ─── 11. CONNECTION DESIGN ───
  const doCon=async()=>{if(!results)return;setConLd(true);setConR(null);const c=ctx(results,p);
    const r=await aiJSON(`ออกแบบจุดต่อโครงสร้าง: ${c}
JSON: {connections:[{location:"ตำแหน่ง เช่น Beam-Column, Column-Base, Beam-Beam",
type:"bolt|weld|mixed",detail:{bolts:"ข้อมูลสลักเกลียว",bolt_grade:"เกรด",num_bolts:ตัวเลข,
plate_thickness:"ความหนา Plate",weld_size:"ขนาดเชื่อม",weld_length:"ความยาวเชื่อม"},
capacity:"กำลังรับน้ำหนัก",demand:"แรงที่กระทำ",status:"pass|fail",sketch_description:"คำอธิบายรูปแบบจุดต่อ"}],
general_notes:["หมายเหตุ"],standard:"มาตรฐานที่ใช้"}`);
    setConR(r);setConLd(false);};

  // ─── 12. ETABS/SAP INPUT ───
  const doEtb=async()=>{if(!results)return;setEtbLd(true);setEtbR(null);const c=ctx(results,p);
    const r=await aiJSON(`สร้างข้อมูล Input สำหรับโปรแกรมวิเคราะห์โครงสร้าง (ETABS/SAP2000): ${c}
JSON: {software:"ETABS",model_description:"คำอธิบายโมเดล",
grid_system:{x_grids:[ตัวเลข],y_grids:[ตัวเลข],z_levels:[ตัวเลข]},
materials:[{name,type:"steel|concrete",properties:{}}],
sections:[{name,type:"beam|column|slab",material,dimensions:{}}],
load_cases:[{name,type,values:{}}],
load_combinations:[{name,formula:"สูตร"}],
modeling_tips:["คำแนะนำในการสร้างโมเดล"],
analysis_settings:{method:"",notes:""}}`);
    setEtbR(r);setEtbLd(false);};

  // ─── 13. QC CHECKLIST ───
  const doQc=async()=>{if(!results)return;setQcLd(true);setQcR(null);const c=ctx(results,p);
    const r=await aiJSON(`สร้าง QC Checklist สำหรับตรวจสอบงานก่อสร้าง: ${c}
JSON: {project_info:"ข้อมูลโครงการ",
categories:[{category:"หมวด เช่น ฐานราก/เสา/คาน/พื้น/เหล็ก/หลังคา",
items:[{item:"รายการตรวจ",standard:"มาตรฐาน/ค่าที่อนุญาต",method:"วิธีตรวจ",frequency:"ความถี่",critical:true/false}]}],
hold_points:["จุดที่ต้องหยุดรอตรวจ"],
test_requirements:[{test:"ชื่อการทดสอบ",when:"เมื่อไหร่",acceptance:"เกณฑ์ผ่าน"}]}`);
    setQcR(r);setQcLd(false);};

  // ─── 14. COST BREAKDOWN ───
  const doDtl=async()=>{if(!results)return;setDtlLd(true);setDtlR(null);const c=ctx(results,p);
    const r=await aiJSON(`วิเคราะห์ต้นทุนละเอียด: ${c} ราคารวม≈${results.cost.totalM}ล้านบาท
JSON: {total_budget:ตัวเลข,currency:"THB",
breakdown:[{category:"หมวด",percent:ตัวเลข,amount:ตัวเลข,sub_items:[{item:"รายการ",qty:"ปริมาณ",unit_price:ตัวเลข,amount:ตัวเลข}]}],
cost_per_sqm:ตัวเลข,market_comparison:"เปรียบเทียบราคาตลาด",
saving_tips:["วิธีประหยัด"],price_risks:["ความเสี่ยงด้านราคา"]}`);
    setDtlR(r);setDtlLd(false);};

  // ─── 15. CLIENT PRESENTATION ───
  const doPrez=async()=>{if(!results)return;setPrezLd(true);setPrezR(null);const c=ctx(results,p);
    const r=await aiJSON(`สร้างเนื้อหาสำหรับ Presentation ให้ลูกค้า: ${c}
JSON: {title:"ชื่อโครงการ",
slides:[{slide_number:ตัวเลข,title:"หัวข้อ",bullet_points:["จุดสำคัญ"],speaker_notes:"โน้ตสำหรับผู้นำเสนอ"}],
executive_summary:"สรุปผู้บริหาร 3-4 ประโยค",
key_selling_points:["จุดเด่น"],
faq:[{question:"คำถาม",answer:"คำตอบ"}],
next_steps:["ขั้นตอนต่อไป"]}`);
    setPrezR(r);setPrezLd(false);};

  // ─── PDF ───
  const doPDF=async()=>{if(!results)return;setPdfLd(true);
    const sum=await ai([{role:"user",content:`เขียนสรุปการคำนวณโครงสร้าง 3 ย่อหน้า: ${ctx(results,p)}`}]);
    const html=`<!DOCTYPE html><html><head><meta charset="utf-8"><title>RABBiZ Structural Report</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'IBM Plex Sans Thai',sans-serif;font-size:11pt;color:#1a1a2e;line-height:1.7;padding:40px 50px;max-width:800px;margin:0 auto}
.hdr{text-align:center;border-bottom:3px solid #ffb200;padding-bottom:20px;margin-bottom:30px}.logo{font-size:24pt;font-weight:700;color:#ffb200;letter-spacing:3px}
h1{font-size:18pt}h2{font-size:14pt;color:#0c1322;border-left:4px solid #ffb200;padding-left:12px;margin:25px 0 12px}
table{width:100%;border-collapse:collapse;margin:10px 0 20px;font-size:10pt}th{background:#0c1322;color:#fff;padding:8px 12px;text-align:left}td{padding:7px 12px;border-bottom:1px solid #e0e0e0}
.hl{color:#ffb200;font-weight:700}.ok{color:#00b074;font-weight:700}.box{background:#f8f6f0;border:1px solid #e0d8c8;border-radius:8px;padding:16px;margin:15px 0}
.disc{margin-top:30px;padding:14px;background:#fff5f5;border:1px solid #fcc;border-radius:6px;font-size:9pt;color:#666}
.ftr{margin-top:30px;text-align:center;font-size:9pt;color:#999;border-top:1px solid #eee;padding-top:15px}</style></head><body>
<div class="hdr"><div class="logo">RABBiZ</div><h1>รายงานการคำนวณโครงสร้าง</h1><div style="font-size:10pt;color:#607090">วันที่: ${new Date().toLocaleDateString('th-TH')} | SC-${Date.now().toString(36).toUpperCase()}</div></div>
<h2>1. ข้อมูลโครงการ</h2><table><tr><td>อาคาร</td><td class="hl">${bt.l} ${width}x${length}m</td></tr><tr><td>สูง</td><td>${eaveH}m</td></tr><tr><td>โครงสร้าง</td><td>${struct}</td></tr><tr><td>พื้นที่</td><td class="hl">${results.qty.tArea} m²</td></tr></table>
<h2>2. น้ำหนักบรรทุก</h2><table><tr><th>รายการ</th><th>kg/m²</th></tr><tr><td>หลังคา DL+LL</td><td>${results.loads.rT}</td></tr>${results.loads.fDL?`<tr><td>พื้น DL+LL</td><td>${results.loads.fT}</td></tr>`:""}</table>
<h2>3. ออกแบบโครงสร้าง</h2>
${results.beam?`<table><tr><th colspan="2">คานเหล็ก</th></tr><tr><td>หน้าตัด</td><td class="hl">${results.beam.n}</td></tr><tr><td>M=${results.bM}t·m</td><td>S=${results.beam.Sp}≥${results.beam.Sr}cm³</td></tr></table>`:""}
${results.col?`<table><tr><th colspan="2">เสาเหล็ก</th></tr><tr><td>หน้าตัด</td><td class="hl">${results.col.n}</td></tr><tr><td>P=${results.cP}t</td><td>KL/r=${results.col.sl}</td></tr></table>`:""}
${results.rcB?`<table><tr><th colspan="2">คาน คสล.</th></tr><tr><td>${results.rcB.w}x${results.rcB.d}cm</td><td class="hl">${results.rcB.bar}</td></tr></table>`:""}
${results.rcC?`<table><tr><th colspan="2">เสา คสล.</th></tr><tr><td>${results.rcC.size}cm</td><td class="hl">${results.rcC.bar}</td></tr></table>`:""}
<h2>4. ฐานราก</h2><table><tr><td>${results.found.type}</td><td class="hl">${results.found.size}m</td><td>P=${results.found.load}t</td></tr></table>
<h2>5. ราคาประมาณ</h2><table><tr><td>พื้นที่ ${results.qty.tArea}m² × ${results.cost.rate.toLocaleString()}฿/m²</td><td class="hl">= ฿${results.cost.totalM}M</td></tr></table>
<h2>6. สรุป AI</h2><div class="box">${sum.replace(/\n/g,'<br>')}</div>
<div class="disc">⚠️ Preliminary Design — ต้องตรวจสอบโดยวิศวกร กว.</div>
<div class="ftr">RABBiZ Structural Calculator v3.0<br><br><div style="display:flex;justify-content:space-around"><div>ลงชื่อ _______________<br>ผู้คำนวณ</div><div>ลงชื่อ _______________<br>ผู้ตรวจสอบ กว.</div></div></div></body></html>`;
    const blob=new Blob([html],{type:"text/html"});const url=URL.createObjectURL(blob);
    const a=document.createElement("a");a.href=url;a.download=`RABBiZ_Report_${new Date().toISOString().slice(0,10)}.html`;a.click();URL.revokeObjectURL(url);setPdfLd(false);};

  // ═══════════════════════════════════════════════════════════
  // NAV
  // ═══════════════════════════════════════════════════════════
  const nav=[
    {id:"calc",ic:"📐",l:"คำนวณ"},
    {id:"nlp",ic:"💬",l:"พิมพ์ไทย",ai:1},
    {id:"reader",ic:"📷",l:"อ่านแบบ",ai:1},
    {id:"chat",ic:"🤖",l:"Advisor",ai:1},
    {id:"compliance",ic:"✅",l:"มาตรฐาน",ai:1},
    {id:"compare",ic:"⚖️",l:"เปรียบเทียบ",ai:1},
    {id:"risk",ic:"🛡️",l:"ความเสี่ยง",ai:1},
    {id:"optimize",ic:"💎",l:"Optimize",ai:1},
    {id:"sequence",ic:"📅",l:"แผนก่อสร้าง",ai:1},
    {id:"seismic",ic:"🌋",l:"แผ่นดินไหว",ai:1},
    {id:"connection",ic:"🔩",l:"จุดต่อ",ai:1},
    {id:"etabs",ic:"🖥️",l:"ETABS",ai:1},
    {id:"qc",ic:"📋",l:"QC",ai:1},
    {id:"costdetail",ic:"💰",l:"ต้นทุน",ai:1},
    {id:"presentation",ic:"🎤",l:"Presentation",ai:1},
  ];

  const needsResults = ["compliance","compare","risk","optimize","sequence","seismic","connection","etabs","qc","costdetail","presentation"];
  const noResults = needsResults.includes(page) && !results;

  // AI feature runner map
  const runners = {
    compare:{fn:doCmp,ld:cmpLd,r:cmpR,title:"⚖️ AI เปรียบเทียบโครงสร้าง",desc:"เปรียบเทียบ Steel vs RC vs Hybrid ให้คะแนน แนะนำตัวเลือกที่ดีที่สุด"},
    risk:{fn:doRisk,ld:riskLd,r:riskR,title:"🛡️ AI วิเคราะห์ความเสี่ยง & Failure Mode",desc:"ระบุจุดเสี่ยง ความน่าจะเป็น ผลกระทบ และวิธีป้องกัน"},
    optimize:{fn:doOpt,ld:optLd,r:optR,title:"💎 AI ลดต้นทุนโครงสร้าง",desc:"หาวิธีประหยัดวัสดุและต้นทุนโดยไม่ลดคุณภาพ"},
    sequence:{fn:doSeq,ld:seqLd,r:seqR,title:"📅 AI วางแผนลำดับก่อสร้าง",desc:"กำหนด Phase วัน เครื่องจักร คน วัสดุ แบบละเอียด"},
    seismic:{fn:doSei,ld:seiLd,r:seiR,title:"🌋 AI ประเมินแรงแผ่นดินไหว",desc:"ตรวจสอบตาม มยผ.1302 พร้อมแนะนำโซนเสี่ยง"},
    connection:{fn:doCon,ld:conLd,r:conR,title:"🔩 AI ออกแบบจุดต่อ",desc:"ออกแบบ Bolt/Weld Connection ทุกตำแหน่งตาม AISC"},
    etabs:{fn:doEtb,ld:etbLd,r:etbR,title:"🖥️ AI สร้าง ETABS/SAP Input",desc:"สร้างข้อมูล Grid, Section, Load Case สำหรับโปรแกรมวิเคราะห์"},
    qc:{fn:doQc,ld:qcLd,r:qcR,title:"📋 AI สร้าง QC Checklist",desc:"รายการตรวจสอบงานก่อสร้างทุกหมวด พร้อม Hold Points"},
    costdetail:{fn:doDtl,ld:dtlLd,r:dtlR,title:"💰 AI วิเคราะห์ต้นทุนละเอียด",desc:"แยกต้นทุนรายหมวด เปรียบเทียบราคาตลาด แนะนำวิธีประหยัด"},
    presentation:{fn:doPrez,ld:prezLd,r:prezR,title:"🎤 AI สร้าง Presentation",desc:"เนื้อหาสำหรับนำเสนอลูกค้า สรุปผู้บริหาร FAQ"},
  };

  // Generic AI result renderer
  function AIResult({data}){
    if(!data) return null;
    if(data.error) return<div style={{fontSize:12,color:C.d,whiteSpace:"pre-wrap",padding:12,background:C.s1,borderRadius:8}}>{data.raw||"เกิดข้อผิดพลาด"}</div>;
    return <div style={{fontSize:12,color:C.t,lineHeight:1.8}}>
      <pre style={{whiteSpace:"pre-wrap",fontFamily:F,fontSize:12,color:C.t,lineHeight:1.8}}>{renderJSON(data)}</pre>
    </div>;
  }

  function renderJSON(obj, depth=0){
    if(!obj||typeof obj!=="object") return String(obj);
    const pad = "  ".repeat(depth);
    const entries = Array.isArray(obj) ? obj.map((v,i)=>[i,v]) : Object.entries(obj);
    return entries.map(([k,v])=>{
      const label = typeof k==="number" ? `${pad}▸ ` : `${pad}${formatKey(k)}: `;
      if(Array.isArray(v)){
        if(v.length===0) return `${label}—`;
        if(typeof v[0]==="string"||typeof v[0]==="number") return `${label}${v.join(" • ")}`;
        return `${label}\n${v.map((item,i)=>renderJSON(item,depth+1)).join("\n")}`;
      }
      if(v&&typeof v==="object") return `${label}\n${renderJSON(v,depth+1)}`;
      if(typeof v==="boolean") return `${label}${v?"✅ ใช่":"❌ ไม่"}`;
      return `${label}${v}`;
    }).join("\n");
  }

  function formatKey(k){
    const map={title:"ชื่อ",name:"ชื่อ",description:"รายละเอียด",summary:"สรุป",reason:"เหตุผล",status:"สถานะ",
      score:"คะแนน",grade:"เกรด",type:"ประเภท",recommendations:"คำแนะนำ",critical:"วิกฤต",
      category:"หมวด",severity:"ความรุนแรง",probability:"ความน่าจะเป็น",mitigation:"การป้องกัน",
      item:"รายการ",standard:"มาตรฐาน",detail:"รายละเอียด",method:"วิธี",frequency:"ความถี่",
      phase:"ระยะ",duration_days:"วัน",tasks:"งาน",equipment:"เครื่องจักร",workers:"คนงาน",
      materials:"วัสดุ",tips:"คำแนะนำ",total_days:"รวมวัน",pros:"ข้อดี",cons:"ข้อเสีย",
      cost_factor:"ตัวคูณราคา",construction_days:"วันก่อสร้าง",recommendation:"แนะนำ",
      saving_percent:"ประหยัด%",changes:"การเปลี่ยนแปลง",from:"จาก",to:"เป็น",saving:"ประหยัด",
      location:"ตำแหน่ง",capacity:"กำลัง",demand:"แรง",bolt_grade:"เกรดสลัก",num_bolts:"จำนวนสลัก",
      zone:"โซน",base_shear_ton:"Base Shear (t)",needs_detailed_analysis:"ต้องวิเคราะห์เพิ่ม",
      bullet_points:"ประเด็น",speaker_notes:"โน้ต",key_selling_points:"จุดเด่น",
      question:"คำถาม",answer:"คำตอบ",next_steps:"ขั้นตอนต่อไป",
      overall_risk:"ระดับเสี่ยงรวม",prevention:"การป้องกัน",consequence:"ผลกระทบ",
      acceptance:"เกณฑ์ผ่าน",test:"ทดสอบ",when:"เมื่อไหร่",hold_points:"Hold Points",
      percent:"สัดส่วน%",amount:"จำนวนเงิน",unit_price:"ราคาต่อหน่วย",qty:"ปริมาณ",
      cost_per_sqm:"ราคา/ตร.ม.",market_comparison:"เปรียบเทียบตลาด",saving_tips:"ทิปประหยัด",
      price_risks:"ความเสี่ยงราคา",sub_items:"รายการย่อย",total_budget:"งบรวม",
      executive_summary:"สรุปผู้บริหาร",slides:"สไลด์",faq:"คำถามที่พบบ่อย",slide_number:"สไลด์ที่",
      struct:"โครงสร้าง",beam:"คาน",column:"เสา",notes:"หมายเหตุ",confidence:"ความมั่นใจ",
      mode:"โหมดวิบัติ",member:"ชิ้นส่วน",likelihood:"แนวโน้ม",
      vulnerable_areas:"จุดอ่อน",story_drift:"Story Drift",allowable:"อนุญาต",estimated:"ประมาณ",
      seismic_weight_ton:"น้ำหนักแผ่นดินไหว(t)",zone_factor:"Zone Factor",importance_factor:"Importance Factor",
      base_shear_percent:"Base Shear %",sketch_description:"รูปแบบจุดต่อ",plate_thickness:"หนาPlate",
      weld_size:"ขนาดเชื่อม",weld_length:"ยาวเชื่อม",general_notes:"หมายเหตุทั่วไป",
      software:"โปรแกรม",model_description:"คำอธิบาย",grid_system:"ระบบ Grid",
      x_grids:"X",y_grids:"Y",z_levels:"Z",sections:"หน้าตัด",load_cases:"Load Cases",
      load_combinations:"Load Combinations",modeling_tips:"คำแนะนำ Modeling",
      analysis_settings:"การตั้งค่า",formula:"สูตร",properties:"คุณสมบัติ",dimensions:"ขนาด",
      material:"วัสดุ",values:"ค่า",project_info:"ข้อมูลโครงการ",categories:"หมวดหมู่",
      items:"รายการ",test_requirements:"การทดสอบ",weather_notes:"สภาพอากาศ",critical_path:"งานวิกฤต",
      alternative_spacings:"ระยะเฟรมทางเลือก",note:"หมายเหตุ",options:"ตัวเลือก",
      checks:"รายการตรวจ",breakdown:"แยกรายการ",risks:"ความเสี่ยง",failure_modes:"โหมดวิบัติ",
      connections:"จุดต่อ",bolts:"สลักเกลียว",current_cost:"ราคาปัจจุบัน",optimized_cost:"ราคาหลังoptimize",
    };
    return map[k]||k.replace(/_/g," ");
  }

  return(
    <div style={{minHeight:"100vh",background:C.bg,color:C.t,fontFamily:F}}>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600;700&family=Orbitron:wght@700;900&display=swap" rel="stylesheet"/>
      <style>{`input:focus,select:focus{border-color:${C.a}!important}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:${C.bd};border-radius:3px}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}.fi{animation:fadeIn .3s ease-out}`}</style>

      {/* HEADER */}
      <div style={{background:`linear-gradient(135deg,${C.s1},${C.s2})`,borderBottom:`2px solid ${C.a}`,padding:"10px 14px"}}>
        <div style={{maxWidth:960,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontFamily:"'Orbitron'",fontSize:18,fontWeight:900,color:C.a,letterSpacing:2}}>RABBiZ</span>
            <span style={{fontSize:10,color:C.d,letterSpacing:2}}>STRUCTURAL ULTRA</span>
            <span style={{padding:"2px 8px",borderRadius:10,background:C.okB,color:C.ok,fontSize:9,fontWeight:700}}>15 AI Features</span>
          </div>
        </div>
      </div>

      {/* NAV SCROLL */}
      <div style={{background:C.s1,borderBottom:`1px solid ${C.bd}`,overflowX:"auto",whiteSpace:"nowrap",padding:"6px 14px"}}>
        <div style={{display:"inline-flex",gap:2}}>
          {nav.map(n=>(
            <button key={n.id} onClick={()=>setPage(n.id)} style={{
              padding:"6px 10px",borderRadius:6,border:"none",cursor:"pointer",fontSize:11,fontWeight:page===n.id?700:500,fontFamily:F,
              background:page===n.id?`${C.a}18`:"transparent",color:page===n.id?C.a:C.d,
              display:"inline-flex",alignItems:"center",gap:3,position:"relative",whiteSpace:"nowrap",
            }}>
              <span style={{fontSize:12}}>{n.ic}</span><span>{n.l}</span>
              {n.ai&&<span style={{width:4,height:4,borderRadius:"50%",background:C.a,position:"absolute",top:3,right:3}}/>}
            </button>
          ))}
        </div>
      </div>

      <div style={{maxWidth:960,margin:"0 auto",padding:"14px 12px"}}>

        {/* ═══ CALC PAGE ═══ */}
        {page==="calc"&&<>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:6,marginBottom:14}}>
            {BT.map(b=>(
              <button key={b.id} onClick={()=>chgType(b.id)} style={{padding:"10px",background:type===b.id?`${C.a}10`:C.s1,border:`2px solid ${type===b.id?C.a:C.bd}`,borderRadius:8,cursor:"pointer",textAlign:"left"}}>
                <div style={{fontSize:20}}>{b.ic}</div>
                <div style={{fontSize:12,fontWeight:700,color:type===b.id?C.a:C.t}}>{b.l}</div>
                <div style={{fontSize:9,color:C.d}}>{b.ds}</div>
              </button>))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:10,marginBottom:14}}>
            <Crd t="ขนาดอาคาร" ic="📏" c={C.b} ch={<>
              <Inp l="กว้าง" u="m" v={width} set={setW} mn={4} mx={50}/>
              <Inp l="ยาว" u="m" v={length} set={setL} mn={4} mx={100}/>
              <Inp l="สูง" u="m" v={eaveH} set={setH} mn={2.5} mx={20}/>
              {is2&&<Inp l="สูงชั้น2" u="m" v={floorH2} set={setH2} mn={2.5} mx={5}/>}
              <Inp l="ลาดหลังคา" u="°" v={slope} set={setSl} mn={5} mx={45} st={1}/>
              <Inp l="ระยะเฟรม" u="m" v={spacing} set={setSp} mn={3} mx={9}/>
            </>}/>
            <Crd t="ระบบโครงสร้าง" ic="⚙️" c={C.p} ch={<>
              <Sel l="โครงสร้าง" v={struct} set={setSt} opts={[{v:"steel",l:"เหล็ก"},{v:"concrete",l:"คสล."}]}/>
              <Sel l="น้ำหนักจร" v={liveType} set={setLT} opts={Object.entries(LL).map(([k,v])=>({v:k,l:`${k} (${v})` }))}/>
              {(struct==="concrete"||is2)&&<>
                <Sel l="คอนกรีต" v={conc} set={setConc} opts={Object.keys(CONC).map(k=>({v:k,l:k}))}/>
                <Sel l="เหล็กเสริม" v={rebar} set={setRebar} opts={Object.keys(RB).map(k=>({v:k,l:k}))}/>
                <Inp l="หนาพื้น" u="cm" v={slab} set={setSlab} mn={8} mx={25} st={1}/>
              </>}
            </>}/>
          </div>
          <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>
            <Btn c={C.a} ch="⚡ คำนวณ" onClick={doCalc}/>
            {results&&<><Btn c={C.b} ch={pdfLd?"⏳...":"📄 PDF"} onClick={doPDF} dis={pdfLd}/>
              <Btn c={C.ok} ch="✅ ตรวจมาตรฐาน" onClick={()=>{setPage("compliance");doComp();}}/></>}
          </div>
          {results&&<div className="fi">
            <div style={{background:C.s2,borderRadius:10,border:`1px solid ${C.a}30`,padding:12,marginBottom:12,display:"flex",flexWrap:"wrap",gap:12,justifyContent:"center"}}>
              {[{l:"ขนาด",v:`${width}×${length}`},{l:"พื้นที่",v:`${results.qty.tArea}m²`},{l:"เฟรม",v:results.qty.nF},{l:"เสา",v:results.qty.nC},{l:"ราคา",v:`฿${results.cost.totalM}M`}].map((x,i)=>(
                <div key={i} style={{textAlign:"center",minWidth:60}}>
                  <div style={{fontSize:9,color:C.d}}>{x.l}</div>
                  <div style={{fontSize:18,fontWeight:700,color:C.a,fontFamily:M}}>{x.v}</div>
                </div>))}
            </div>
            <div style={{display:"flex",gap:2,marginBottom:12,overflowX:"auto",borderBottom:`1px solid ${C.bd}`}}>
              {[{id:"loads",l:"น้ำหนัก"},{id:"members",l:"ออกแบบ"},{id:"found",l:"ฐานราก"},{id:"boq",l:"BOQ+ราคา"}].map(t=>(
                <button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"7px 12px",border:"none",borderRadius:"6px 6px 0 0",cursor:"pointer",fontSize:11,fontWeight:tab===t.id?700:500,
                  background:tab===t.id?`${C.a}12`:"transparent",color:tab===t.id?C.a:C.d,borderBottom:tab===t.id?`2px solid ${C.a}`:"2px solid transparent",fontFamily:F}}>{t.l}</button>))}
            </div>
            {tab==="loads"&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:10}}>
              <Crd t="หลังคา" ic="🏗️" c={C.b} ch={<><Rw l="DL" v={results.loads.rDL} u="kg/m²"/><Rw l="LL" v={results.loads.rLL} u="kg/m²"/><Rw l="รวม" v={results.loads.rT} u="kg/m²" h/></>}/>
              {results.loads.fDL&&<Crd t="พื้น" ic="▦" c={C.p} ch={<><Rw l="DL" v={results.loads.fDL} u="kg/m²"/><Rw l="LL" v={results.loads.ll} u="kg/m²"/><Rw l="รวม" v={results.loads.fT} u="kg/m²" h/></>}/>}
            </div>}
            {tab==="members"&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:10}}>
              {results.beam&&<Crd t="คานเหล็ก" ic="📐" c={C.a} ch={<><Rw l="หน้าตัด" v={results.beam.n} h/><Rw l="M" v={results.bM} u="t·m"/><Rw l="S" v={`${results.beam.Sp}/${results.beam.Sr}`} u="cm³"/><PF ok={parseFloat(results.beam.Sp)>=parseFloat(results.beam.Sr)} tx="Section Check"/></>}/>}
              {results.col&&<Crd t="เสาเหล็ก" ic="🏛️" c={C.a} ch={<><Rw l="หน้าตัด" v={results.col.n} h/><Rw l="P" v={results.cP} u="t"/><Rw l="KL/r" v={results.col.sl}/><PF ok={results.col.A>=parseFloat(results.col.Ar)} tx="Column Check"/></>}/>}
              {results.rcB&&<Crd t="คาน คสล." ic="📐" c={C.p} ch={<><Rw l="ขนาด" v={`${results.rcB.w}×${results.rcB.d}`} u="cm" h/><Rw l="Mu" v={results.rcB.Mu} u="t·m"/><Rw l="เหล็ก" v={results.rcB.bar} h/></>}/>}
              {results.rcC&&<Crd t="เสา คสล." ic="🏛️" c={C.p} ch={<><Rw l="ขนาด" v={results.rcC.size} u="cm" h/><Rw l="Pu" v={results.rcC.Pu} u="t"/><Rw l="เหล็ก" v={results.rcC.bar} h/></>}/>}
              {results.rcS&&<Crd t="พื้น" ic="▦" c={C.p} ch={<><Rw l="หนา" v={results.rcS.t} u="cm" h/><Rw l="เหล็ก" v={results.rcS.bar} h/></>}/>}
            </div>}
            {tab==="found"&&<Crd t="ฐานราก" ic="🧱" c={C.a} ch={<><Rw l="ประเภท" v={results.found.type} h/><Rw l="ขนาด" v={results.found.size} u="m" h/><Rw l="ลึก" v={results.found.depth} u="m"/><Rw l="น้ำหนัก" v={results.found.load} u="t"/></>}/>}
            {tab==="boq"&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:10}}>
              <Crd t="ปริมาณ" ic="📊" c={C.ok} ch={<><Rw l="เฟรม" v={results.qty.nF} u="ชุด"/><Rw l="เสา" v={results.qty.nC} u="ต้น"/>{struct==="steel"&&<Rw l="เหล็ก" v={`${(parseFloat(results.qty.stW)/1000).toFixed(1)}`} u="ตัน" h/>}</>}/>
              <Crd t="ราคา" ic="💰" c={C.a} ch={<><Rw l="พื้นที่" v={results.qty.tArea} u="m²"/><Rw l="อัตรา" v={results.cost.rate.toLocaleString()} u="฿/m²"/><div style={{textAlign:"center",padding:12,background:`${C.a}08`,borderRadius:8,marginTop:6}}><div style={{fontSize:9,color:C.d}}>ราคาประมาณ</div><div style={{fontSize:26,fontWeight:700,color:C.a,fontFamily:M}}>฿{results.cost.totalM}M</div></div></>}/>
            </div>}
          </div>}
        </>}

        {/* ═══ NLP ═══ */}
        {page==="nlp"&&<div className="fi">
          <Crd t="💬 พิมพ์ภาษาไทย → คำนวณ" ic="🤖" c={C.a} ch={<>
            <textarea value={nlpTx} onChange={e=>setNlpTx(e.target.value)} placeholder="เช่น: โกดังเหล็กกว้าง 20 ยาว 40 สูง 8 เมตร..."
              style={{...sI,height:80,resize:"vertical",fontFamily:F,lineHeight:1.6}}/>
            <div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap"}}>
              <Btn c={C.a} ch={nlpLd?"⏳ วิเคราะห์...":"🚀 วิเคราะห์"} onClick={doNlp} dis={nlpLd}/>
              {["โกดัง 15x30 สูง7m","โชว์รูมรถ 20x40m","อาคาร2ชั้น 12x24 สนง."].map((ex,i)=>(
                <button key={i} onClick={()=>setNlpTx(ex)} style={{padding:"5px 8px",borderRadius:6,border:`1px solid ${C.bd}`,background:"transparent",color:C.dL,fontSize:10,cursor:"pointer"}}>{ex}</button>))}
            </div>
          </>}/>
          {nlpR&&!nlpR.error&&<div className="fi"><Crd t="ผลวิเคราะห์" ic="✨" c={C.ok} ch={<>
            <div style={{fontSize:12,color:C.t,marginBottom:8,lineHeight:1.7}}>{nlpR.summary}</div>
            {nlpR.assumptions&&<div style={{fontSize:11,color:C.w,background:C.wB,padding:8,borderRadius:6,marginBottom:8}}>💡 {nlpR.assumptions}</div>}
            <Btn c={C.ok} full ch="✅ ใช้ค่านี้ → คำนวณ" onClick={()=>applyP(nlpR)}/>
          </>}/></div>}
        </div>}

        {/* ═══ READER ═══ */}
        {page==="reader"&&<div className="fi">
          <Crd t="📷 AI อ่านแบบก่อสร้าง" ic="🤖" c={C.b} ch={<>
            <div style={{border:`2px dashed ${C.bd}`,borderRadius:10,padding:20,textAlign:"center",background:C.bg,position:"relative",marginBottom:10}}>
              <input type="file" accept="image/*,.pdf" onChange={handleFile} style={{position:"absolute",inset:0,opacity:0,cursor:"pointer"}}/>
              {rdPrev?<img src={rdPrev} alt="" style={{maxWidth:"100%",maxHeight:250,borderRadius:8}}/>:
                <div><div style={{fontSize:30}}>📎</div><div style={{fontSize:12,color:C.dL}}>อัปโหลดภาพแบบ</div></div>}
            </div>
            {rdImg&&<Btn c={C.b} full ch={rdLd?"⏳ AI อ่านแบบ...":"🔍 AI อ่านแบบ"} onClick={doRead} dis={rdLd}/>}
          </>}/>
          {rdR&&!rdR.error&&<div className="fi"><Crd t="ผลอ่านแบบ" ic="✨" c={C.ok} ch={<>
            <div style={{fontSize:12,marginBottom:8,lineHeight:1.7}}>{rdR.summary}</div>
            <Btn c={C.ok} full ch="✅ ใช้ค่านี้ → คำนวณ" onClick={()=>applyP(rdR)}/>
          </>}/></div>}
        </div>}

        {/* ═══ CHAT ═══ */}
        {page==="chat"&&<div className="fi" style={{display:"flex",flexDirection:"column",height:"calc(100vh - 130px)"}}>
          <div style={{fontSize:11,color:C.d,padding:"5px 10px",background:C.s1,borderRadius:6,marginBottom:6,display:"flex",alignItems:"center",gap:4}}>
            🤖 AI ที่ปรึกษาโครงสร้าง {results&&<span style={{padding:"1px 6px",borderRadius:8,background:C.okB,color:C.ok,fontSize:9}}>มีข้อมูล</span>}
          </div>
          <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:8,padding:"4px 0"}}>
            {chatMsgs.length===0&&<div style={{textAlign:"center",padding:30,color:C.d}}>
              <div style={{fontSize:32,marginBottom:8}}>🤖</div>
              <div style={{fontSize:13,fontWeight:600}}>AI ที่ปรึกษาโครงสร้าง</div>
              <div style={{fontSize:11,marginTop:4}}>ถามได้ทุกเรื่อง — มาตรฐาน, หน้าตัด, Connection, ฐานราก...</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:4,justifyContent:"center",marginTop:12}}>
                {["โกดัง span 20m ใช้เหล็กอะไร?","อธิบาย Load Combo มยผ.","Steel vs RC โชว์รูม?","ดินอ่อนใช้ฐานรากอะไร?"].map((q,i)=>(
                  <button key={i} onClick={()=>setCI(q)} style={{padding:"5px 8px",borderRadius:6,border:`1px solid ${C.bd}`,background:C.s1,color:C.dL,fontSize:10,cursor:"pointer"}}>{q}</button>))}
              </div>
            </div>}
            {chatMsgs.map((m,i)=>(
              <div key={i} style={{alignSelf:m.role==="user"?"flex-end":"flex-start",maxWidth:"85%",padding:"8px 12px",borderRadius:10,
                background:m.role==="user"?`${C.a}12`:C.s2,border:`1px solid ${m.role==="user"?C.a+"25":C.bd}`,fontSize:12,lineHeight:1.7,whiteSpace:"pre-wrap"}}>
                {m.role==="assistant"&&<div style={{fontSize:9,color:C.a,fontWeight:700,marginBottom:3}}>🤖 AI</div>}{m.content}</div>))}
            {chatLd&&<div style={{padding:10,background:C.s2,borderRadius:10,border:`1px solid ${C.bd}`}}><span style={{color:C.a,animation:"pulse 1.2s infinite"}}>🤖 กำลังคิด...</span></div>}
            <div ref={chatE}/>
          </div>
          <div style={{display:"flex",gap:6,paddingTop:8,borderTop:`1px solid ${C.bd}`}}>
            <input value={chatIn} onChange={e=>setCI(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendChat()} placeholder="ถามคำถาม..." style={{...sI,flex:1,fontFamily:F}}/>
            <Btn c={C.a} ch="ส่ง" onClick={sendChat} dis={chatLd}/>
          </div>
        </div>}

        {/* ═══ COMPLIANCE ═══ */}
        {page==="compliance"&&<div className="fi">
          {noResults?<Crd t="✅ ตรวจมาตรฐาน" ic="📋" c={C.ok} ch={<div style={{textAlign:"center",padding:20,color:C.d}}><div style={{fontSize:30}}>📐</div><div style={{fontSize:12,marginTop:8}}>คำนวณก่อน แล้วกลับมาตรวจ</div><Btn c={C.a} ch="→ คำนวณ" onClick={()=>setPage("calc")}/></div>}/>:
          compLd?<LoadDots t="AI กำลังตรวจมาตรฐาน..."/>:
          !compR?<Crd t="✅ AI ตรวจมาตรฐาน มยผ./วสท." ic="📋" c={C.ok} ch={<Btn c={C.ok} full ch="🔍 เริ่มตรวจ" onClick={doComp}/>}/>:
          compR.error?<AIResult data={compR}/>:
          <div className="fi">
            <div style={{display:"flex",gap:10,marginBottom:12,flexWrap:"wrap"}}>
              <div style={{flex:"0 0 130px",textAlign:"center",padding:16,background:C.s1,borderRadius:10,border:`1px solid ${C.bd}`}}>
                <div style={{fontSize:9,color:C.d}}>คะแนน</div>
                <div style={{fontSize:42,fontWeight:900,fontFamily:"'Orbitron'",color:compR.score>=80?C.ok:compR.score>=60?C.w:C.e}}>{compR.score}</div>
                <div style={{fontSize:20,fontWeight:700,color:compR.grade<="B"?C.ok:compR.grade==="C"?C.w:C.e}}>เกรด {compR.grade}</div>
              </div>
              <div style={{flex:1,minWidth:200}}>
                {compR.critical?.length>0&&<Crd t="⚠️ วิกฤต" ic="🚨" c={C.e} ch={compR.critical.map((c,i)=><div key={i} style={{fontSize:11,color:C.e,padding:"3px 0"}}>• {c}</div>)}/>}
                {compR.recommendations?.length>0&&<Crd t="คำแนะนำ" ic="💡" c={C.a} ch={compR.recommendations.map((r,i)=><div key={i} style={{fontSize:11,color:C.dL,padding:"3px 0"}}>• {r}</div>)}/>}
              </div>
            </div>
            <Crd t="รายการตรวจ" ic="📋" c={C.b} ch={compR.checks?.map((ch,i)=>(
              <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start",padding:"6px 0",borderBottom:`1px solid ${C.bd}15`}}>
                <span style={{fontSize:14}}>{ch.status==="pass"?"✅":ch.status==="warn"?"⚠️":"❌"}</span>
                <div><div style={{fontSize:12,fontWeight:600}}>{ch.item}</div><div style={{fontSize:10,color:C.d}}>{ch.standard}</div>
                  <div style={{fontSize:11,color:ch.status==="pass"?C.ok:ch.status==="warn"?C.w:C.e}}>{ch.detail}</div></div>
              </div>))}/>
          </div>}
        </div>}

        {/* ═══ GENERIC AI FEATURE PAGES (10 new features) ═══ */}
        {Object.entries(runners).map(([key,{fn,ld,r,title,desc}])=>(
          page===key&&<div key={key} className="fi">
            {noResults?<Crd t={title} ic="🤖" c={C.a} ch={<div style={{textAlign:"center",padding:20,color:C.d}}>
              <div style={{fontSize:30}}>📐</div><div style={{fontSize:12,marginTop:8}}>คำนวณก่อน แล้วกลับมาใช้ฟีเจอร์นี้</div>
              <div style={{marginTop:8}}><Btn c={C.a} ch="→ ไปคำนวณ" onClick={()=>setPage("calc")}/></div></div>}/>:
            ld?<LoadDots t={`${title}...`}/>:
            !r?<Crd t={title} ic="🤖" c={C.a} ch={<>
              <div style={{fontSize:12,color:C.d,marginBottom:10,lineHeight:1.7}}>{desc}</div>
              <Btn c={C.a} full ch={`🚀 เริ่ม${title.split(" ").slice(1).join(" ")}`} onClick={fn}/></>}/>:
            <div className="fi">
              <Crd t={title} ic="✨" c={C.ok} ch={<AIResult data={r}/>}/>
              <div style={{marginTop:6}}><Btn c={C.a} ch="🔄 วิเคราะห์ใหม่" onClick={fn}/></div>
            </div>}
          </div>
        ))}

        {/* DISCLAIMER */}
        <div style={{marginTop:20,padding:10,borderRadius:6,background:C.eB,border:`1px solid ${C.e}15`,fontSize:10,color:C.d,lineHeight:1.5}}>
          <span style={{color:C.e,fontWeight:700}}>⚠️</span> Preliminary Design — ต้องตรวจสอบโดย กว. ตาม มยผ.1301/1302/1311 และ วสท.
        </div>
      </div>
    </div>
  );
}
