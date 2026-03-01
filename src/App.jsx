import { useState, useRef, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════
// THEME SYSTEM — Light & Dark
// ═══════════════════════════════════════════════════════════════
const themes = {
  light: {
    bg:"#f5f3ee",s1:"#ffffff",s2:"#faf8f4",s3:"#f0ede6",
    bd:"#e2ddd3",bdL:"#cfc9bc",
    a:"#c8960c",aL:"#f5c842",aBg:"#fdf6e3",
    t:"#2c2416",tS:"#5c503c",d:"#8c7e6a",dL:"#b0a48e",
    ok:"#1a8a5c",okBg:"#eefaf4",w:"#c47a1a",wBg:"#fef8ee",
    e:"#c23a3a",eBg:"#fdf0f0",b:"#1a6e8a",bBg:"#eef6fa",
    p:"#7c4dbd",pBg:"#f6f0ff",
    navBg:"#2c2416",navT:"#e8e0d0",navA:"#f5c842",navD:"#8c7e6a",
    shadow:"0 1px 3px rgba(44,36,22,0.06),0 1px 2px rgba(44,36,22,0.04)",
    shadowL:"0 4px 16px rgba(44,36,22,0.08),0 2px 6px rgba(44,36,22,0.04)",
    glow:"none",inputBg:"#faf8f4",
  },
  dark: {
    bg:"#0c0e14",s1:"#141820",s2:"#1a1f2c",s3:"#222836",
    bd:"#2a3040",bdL:"#3a4258",
    a:"#f5c842",aL:"#ffe07a",aBg:"#f5c84210",
    t:"#e8e4dc",tS:"#c0b8a8",d:"#6a7088",dL:"#8a90a8",
    ok:"#3dd68c",okBg:"#3dd68c0c",w:"#f5a842",wBg:"#f5a8420c",
    e:"#f06060",eBg:"#f060600c",b:"#42b8f5",bBg:"#42b8f50c",
    p:"#a47cef",pBg:"#a47cef0c",
    navBg:"#0a0c12",navT:"#c0b8a8",navA:"#f5c842",navD:"#505870",
    shadow:"0 1px 3px rgba(0,0,0,0.2),0 1px 2px rgba(0,0,0,0.15)",
    shadowL:"0 4px 16px rgba(0,0,0,0.3),0 2px 6px rgba(0,0,0,0.2)",
    glow:"0 0 20px rgba(245,200,66,0.04)",inputBg:"#141820",
  }
};

const F=`'Sarabun','IBM Plex Sans Thai',system-ui,sans-serif`;
const M=`'JetBrains Mono','Fira Code',monospace`;
const D=`'Outfit','IBM Plex Sans Thai',sans-serif`;

// ═══════════════════════════════════════════════════════════════
// ENGINEERING DATA
// ═══════════════════════════════════════════════════════════════
const BT=[{id:"warehouse",l:"โกดัง",ic:"🏭",fl:1,d:"โครงเหล็ก โครงถัก"},{id:"showroom",l:"โชว์รูม",ic:"🏪",fl:1,d:"โครงเหล็ก ช่วงกว้าง"},{id:"one_story",l:"อาคาร 1 ชั้น",ic:"🏠",fl:1,d:"คสล./เหล็ก"},{id:"two_story",l:"อาคาร 2 ชั้น",ic:"🏢",fl:2,d:"คอนกรีตเสริมเหล็ก"}];
const SB=[{n:"H-200x100",d:200,A:27.16,Ix:1840,w:21.3},{n:"H-250x125",d:250,A:37.66,Ix:3960,w:29.6},{n:"H-300x150",d:300,A:46.78,Ix:7210,w:36.7},{n:"H-350x175",d:350,A:63.14,Ix:13600,w:49.6},{n:"H-400x200",d:400,A:84.12,Ix:23700,w:66},{n:"H-500x200",d:500,A:114.2,Ix:47800,w:89.7},{n:"H-600x200",d:600,A:134.4,Ix:76800,w:106}];
const SC=[{n:"H-150x150",d:150,A:40.14,Ix:1640,w:31.5},{n:"H-200x200",d:200,A:63.53,Ix:4720,w:49.9},{n:"H-250x250",d:250,A:92.18,Ix:10800,w:72.4},{n:"H-300x300",d:300,A:119.8,Ix:20400,w:94},{n:"H-350x350",d:350,A:173.9,Ix:40300,w:136},{n:"H-400x400",d:400,A:218.7,Ix:66600,w:172}];
const LL={warehouse:500,showroom:400,commercial:300,office:200,residential:200};
const CONC={"C21/240":240,"C25/280":280,"C28/320":320,"C32/350":350};
const RB={"SD40":4000,"SD50":5000};

// ═══════════════════════════════════════════════════════════════
// CALC ENGINE
// ═══════════════════════════════════════════════════════════════
function calc(p){
  const bt=BT.find(b=>b.id===p.type),fl=bt.fl,ll=LL[p.liveType]||300;
  const sp=Math.max(1,p.spacing||6),w=Math.max(1,p.width||12),ln=Math.max(1,p.length||24),eh=Math.max(2,p.eaveH||6),sl=Math.max(8,p.slab||12);
  const rDL=p.struct==="steel"?25:60,rLL=30,rT=rDL+rLL,fDL=sl*24+210,fT=fDL+ll;
  const nF=Math.floor(ln/sp)+1,nC=nF*2,area=w*ln,tArea=area*(fl===2?2:1);
  let beam=null,col=null,bM=0,bV=0,cP=0;
  if(p.struct==="steel"){
    const wt=(rT*sp)/100,L=w*100;bM=wt*L*L/8;bV=wt*L/2;const Sr=bM/(0.66*2500);
    for(const s of SB){const S=s.Ix*2/s.d;if(S>=Sr){beam={...s,Sr:Sr.toFixed(1),Sp:S.toFixed(1)};break;}}
    if(!beam)beam={...SB[SB.length-1],warn:1};
    cP=(rT*w*sp/2)*1.1;if(fl===2)cP+=fT*(w/2)*sp*1.1;
    const Ar=cP/(0.6*2500);
    for(const s of SC){if(s.A>=Ar){col={...s,Ar:Ar.toFixed(1),sl:(eh*100/Math.sqrt(s.Ix/s.A)).toFixed(1)};break;}}
    if(!col)col={...SC[SC.length-1],warn:1};
  }
  let rcB=null,rcC=null,rcS=null;const fc=CONC[p.conc]||240,fy=RB[p.rebar]||4000;
  if(p.struct==="concrete"||fl===2){
    const sW=1.4*(sl*24+110)+1.7*ll,sL=Math.min(sp,w/2)*100,sM=(sW/100)*sL*sL/10,sD=Math.max(1,sl-3),sA=sM/(0.9*fy*0.9*sD);
    rcS={t:sl,Mu:(sM/1e5).toFixed(2),As:sA.toFixed(2),bar:sA<3?"DB12@200":sA<5?"DB12@150":sA<7?"DB16@200":"DB16@150"};
    const bSp=w*100/2,bW=(1.4*(fDL+50)+1.7*ll)*sp/100,bMu=bW*bSp*bSp/8;
    const bW2=Math.max(20,Math.round(bSp/20/5)*5),bD=Math.max(30,Math.round(bSp/12/5)*5),bAs=bMu/(0.9*fy*0.9*Math.max(1,bD-5));
    rcB={w:bW2,d:bD,Mu:(bMu/1e5).toFixed(2),As:bAs.toFixed(2),bar:bAs<8?"3-DB20":bAs<12?"4-DB20":"4-DB25",stir:"DB10@150"};
    const cPu=fl===2?(1.4*(fDL+rDL)+1.7*(ll+rLL))*(w/2)*sp*2:(1.4*(fDL+rDL)+1.7*(ll+rLL))*(w/2)*sp;
    const cA=cPu/(0.65*(0.85*fc/10+0.02*fy)),cSz=Math.max(20,Math.ceil(Math.sqrt(Math.max(0,cA))/5)*5);
    rcC={size:`${cSz}x${cSz}`,Pu:(cPu/1000).toFixed(1),bar:cSz<=25?"4-DB16":cSz<=30?"4-DB20":"8-DB25"};
  }
  const fL=p.struct==="steel"?(cP/1000):(rcC?parseFloat(rcC.Pu)/1.5:10);
  const fSz=Math.max(1,Math.ceil(Math.sqrt(Math.max(0.1,fL/10))*10)/10),fDp=Math.max(0.3,Math.round(fSz*0.3*10)/10);
  const found={load:fL.toFixed(1),size:`${fSz.toFixed(1)}x${fSz.toFixed(1)}`,depth:fDp.toFixed(1),type:fL>30?"เสาเข็ม":"ฐานรากแผ่"};
  const stW=p.struct==="steel"?((beam?beam.w*w*nF:0)+(col?col.w*eh*nC:0)):0;
  const rate=p.struct==="steel"?(p.type==="warehouse"?5500:p.type==="showroom"?7000:8000):(fl===2?12000:9000);
  return{info:{...bt},loads:{rDL,rLL,rT,fDL:fl===2?fDL:null,ll,fT:fl===2?fT:null},
    beam,col,rcB,rcC,rcS,found,bM:(bM/1e5).toFixed(2),bV:(bV/1e3).toFixed(2),cP:(cP/1e3).toFixed(2),
    qty:{nF,nC,stW:stW.toFixed(0),area,tArea},cost:{rate,total:tArea*rate,totalM:(tArea*rate/1e6).toFixed(2)},params:p};
}

// ═══════════════════════════════════════════════════════════════
// AI
// ═══════════════════════════════════════════════════════════════
async function ai(msgs,sys){
  try{const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:3500,system:sys||"คุณเป็นวิศวกรโครงสร้างระดับผู้เชี่ยวชาญพิเศษชาวไทย ตอบภาษาไทย อ้างอิง มยผ./วสท./ACI318/AISC360 กระชับแม่นยำ",messages:msgs})});
    if(!r.ok){const e=await r.text().catch(()=>"");return`Error ${r.status}: ${e||r.statusText}`;}
    const d=await r.json();return d.content?.map(b=>b.text||"").join("\n")||"ไม่สามารถประมวลผลได้";}catch(e){return"Error: "+e.message;}}
async function aiJ(prompt,sys){const r=await ai([{role:"user",content:prompt}],sys||"ตอบ JSON เท่านั้น ไม่มี markdown backticks ไม่มี preamble");
  if(r.startsWith("Error"))return{error:1,raw:r};
  try{return JSON.parse(r.replace(/```json?|```/g,"").trim());}catch{return{error:1,raw:r};}}
async function aiV(b64,type,prompt){
  try{const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:2000,system:"วิศวกรโครงสร้าง อ่านแบบก่อสร้าง ตอบ JSON เท่านั้น",
    messages:[{role:"user",content:[{type:"image",source:{type:"base64",media_type:type,data:b64}},{type:"text",text:prompt}]}]})});
    if(!r.ok)return{error:1,raw:`Error ${r.status}`};
    const d=await r.json();const txt=(d.content?.map(b=>b.text||"").join("\n")||"{}").replace(/```json?|```/g,"").trim();
    return JSON.parse(txt);}catch(e){return{error:1,raw:e.message};}}

function ctxStr(r,p){if(!r)return"";const bt=BT.find(b=>b.id===p.type);
  return`[${bt.l} ${p.width}x${p.length}m สูง${p.eaveH}m ${p.struct} LL=${LL[p.liveType]}kg/m² ${r.beam?`คาน=${r.beam.n} `:""}${r.col?`เสา=${r.col.n} `:""}${r.rcB?`คานRC=${r.rcB.w}x${r.rcB.d}cm `:""}${r.rcC?`เสาRC=${r.rcC.size}cm `:""}ฐาน=${r.found.size}m(${r.found.type}) เฟรม=${r.qty.nF} เสา=${r.qty.nC} ≈฿${r.cost.totalM}M]`;}

// ═══════════════════════════════════════════════════════════════
// KEY MAP for JSON renderer
// ═══════════════════════════════════════════════════════════════
const KM={title:"ชื่อ",name:"ชื่อ",description:"รายละเอียด",summary:"สรุป",reason:"เหตุผล",status:"สถานะ",score:"คะแนน",grade:"เกรด",type:"ประเภท",recommendations:"คำแนะนำ",critical:"วิกฤต",category:"หมวด",severity:"ความรุนแรง",probability:"ความน่าจะเป็น",mitigation:"ป้องกัน",item:"รายการ",standard:"มาตรฐาน",detail:"รายละเอียด",method:"วิธี",phase:"ระยะ",duration_days:"วัน",tasks:"งาน",equipment:"เครื่องจักร",workers:"คนงาน",materials:"วัสดุ",tips:"เคล็ดลับ",total_days:"รวมวัน",pros:"ข้อดี",cons:"ข้อเสีย",cost_factor:"ตัวคูณราคา",recommendation:"แนะนำ",saving_percent:"ประหยัด%",changes:"เปลี่ยนแปลง",from:"จาก",to:"เป็น",saving:"ประหยัด",location:"ตำแหน่ง",capacity:"กำลัง",demand:"แรง",zone:"โซน",base_shear_ton:"Base Shear(t)",bullet_points:"ประเด็น",speaker_notes:"โน้ต",question:"คำถาม",answer:"คำตอบ",next_steps:"ต่อไป",overall_risk:"เสี่ยงรวม",prevention:"ป้องกัน",consequence:"ผลกระทบ",checks:"ตรวจ",breakdown:"แยกรายการ",risks:"ความเสี่ยง",failure_modes:"โหมดวิบัติ",connections:"จุดต่อ",options:"ตัวเลือก",slides:"สไลด์",faq:"FAQ",struct:"โครงสร้าง",beam:"คาน",column:"เสา",notes:"หมายเหตุ",confidence:"ความมั่นใจ",mode:"โหมด",member:"ชิ้นส่วน",formula:"สูตร",material:"วัสดุ",categories:"หมวดหมู่",items:"รายการ",critical_path:"งานวิกฤต",general_notes:"หมายเหตุ",force:"แรง",moment:"โมเมนต์",shear:"แรงเฉือน",wind_speed:"ความเร็วลม",fire_rating:"อัตราทนไฟ",cover:"ระยะหุ้ม",lap_length:"ความยาวทาบ",load_path:"เส้นทางแรง",strengthening:"เสริมกำลัง",technique:"เทคนิค",alternatives:"ทางเลือก",testing:"การทดสอบ",hazards:"ภัย",safety_factor:"ค่าปลอดภัย",scenario:"สถานการณ์",members:"ชิ้นส่วน",levels:"ชั้น",proposals:"ข้อเสนอ",test_plan:"แผนทดสอบ",tests:"ทดสอบ"};
function fK(k){return KM[k]||k.replace(/_/g," ");}
function rJ(o,d=0){if(!o||typeof o!=="object")return String(o);const pad="  ".repeat(d);
  const ent=Array.isArray(o)?o.map((v,i)=>[i,v]):Object.entries(o);
  return ent.map(([k,v])=>{const lb=typeof k==="number"?`${pad}• `:`${pad}${fK(k)}: `;
    if(Array.isArray(v)){if(!v.length)return`${lb}—`;if(typeof v[0]==="string"||typeof v[0]==="number")return`${lb}${v.join(" · ")}`;return`${lb}\n${v.map(i=>rJ(i,d+1)).join("\n")}`;}
    if(v&&typeof v==="object")return`${lb}\n${rJ(v,d+1)}`;if(typeof v==="boolean")return`${lb}${v?"✓ ใช่":"✗ ไม่"}`;return`${lb}${v}`;}).join("\n");}

// ═══════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════
export default function App(){
  const[mode,setMode]=useState(()=>window.matchMedia?.("(prefers-color-scheme:dark)").matches?"dark":"light");
  const T=themes[mode];const toggle=()=>setMode(m=>m==="dark"?"light":"dark");

  const[type,setType]=useState("warehouse");const[width,setW]=useState(12);const[length,setL]=useState(24);
  const[eaveH,setH]=useState(6);const[floorH2,setH2]=useState(3.5);const[slope,setSl]=useState(15);
  const[spacing,setSp]=useState(6);const[struct,setSt]=useState("steel");const[liveType,setLT]=useState("warehouse");
  const[conc,setConc]=useState("C25/280");const[rebar,setRebar]=useState("SD40");const[slab,setSlab]=useState(12);
  const[results,setR]=useState(null);const[tab,setTab]=useState("loads");const[page,setPage]=useState("calc");
  const[sideOpen,setSideOpen]=useState(false);
  const[pdfLd,setPdfLd]=useState(false);

  // Chat
  const[chatMsgs,setCM]=useState([]);const[chatIn,setCI]=useState("");const[chatLd,setCL]=useState(false);const chatE=useRef(null);
  // NLP
  const[nlpTx,setNlpTx]=useState("");const[nlpLd,setNlpLd]=useState(false);const[nlpR,setNlpR]=useState(null);
  // Reader
  const[rdImg,setRdImg]=useState(null);const[rdPrev,setRdPrev]=useState(null);const[rdLd,setRdLd]=useState(false);const[rdR,setRdR]=useState(null);

  // All AI feature states — dynamic
  const[aiStates,setAI]=useState({});
  const setAIS=(k,ld,r)=>setAI(p=>({...p,[k]:{ld,r:r!==undefined?r:p[k]?.r}}));
  const getAIS=(k)=>aiStates[k]||{ld:false,r:null};

  const bt=BT.find(b=>b.id===type);const is2=bt?.fl===2;
  const p={type,width,length,eaveH,floorH2,slope,spacing,struct,liveType,conc,rebar,slab};
  const cx=()=>ctxStr(results,p);

  const chgType=(id)=>{setType(id);setR(null);setAI({});
    if(id==="warehouse"){setW(12);setL(24);setH(6);setSt("steel");setLT("warehouse");setSp(6);}
    if(id==="showroom"){setW(15);setL(30);setH(5);setSt("steel");setLT("showroom");setSp(6);}
    if(id==="one_story"){setW(10);setL(20);setH(3.5);setSt("concrete");setLT("commercial");setSp(5);}
    if(id==="two_story"){setW(10);setL(20);setH(3.5);setSt("concrete");setLT("commercial");setSp(5);}};
  const doCalc=()=>{setR(calc(p));setTab("loads");setAI({});};
  const applyP=(np)=>{if(np.type)chgType(np.type);if(np.width)setW(parseFloat(np.width)||width);if(np.length)setL(parseFloat(np.length)||length);if(np.eaveH)setH(parseFloat(np.eaveH)||eaveH);if(np.slope)setSl(parseFloat(np.slope)||slope);if(np.spacing)setSp(parseFloat(np.spacing)||spacing);if(np.struct)setSt(np.struct);if(np.liveType)setLT(np.liveType);if(np.slab)setSlab(parseFloat(np.slab)||slab);setTimeout(()=>{setPage("calc");},300);};

  // CHAT
  const sendChat=async()=>{if(!chatIn.trim()||chatLd)return;const u=chatIn.trim();setCI("");setCL(true);
    const nm=[...chatMsgs,{role:"user",content:u}];setCM(nm);
    try{const r=await ai(nm.map((m,i)=>({role:m.role,content:m.content+(m.role==="user"&&i===nm.length-1?cx():"")})));
      setCM([...nm,{role:"assistant",content:r}]);}catch(e){setCM([...nm,{role:"assistant",content:"เกิดข้อผิดพลาด: "+e.message}]);}finally{setCL(false);}};
  useEffect(()=>{chatE.current?.scrollIntoView({behavior:"smooth"});},[chatMsgs]);

  // NLP
  const doNlp=async()=>{if(!nlpTx.trim())return;setNlpLd(true);setNlpR(null);
    try{setNlpR(await aiJ(`จากข้อความ:"${nlpTx}" แยก JSON:{type,width,length,eaveH,slope,spacing,struct,liveType,slab,summary,assumptions}`));}catch(e){setNlpR({error:1,raw:e.message});}finally{setNlpLd(false);}};
  // Reader
  const handleFile=(e)=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=(ev)=>{setRdPrev(ev.target.result);setRdImg({b64:ev.target.result.split(",")[1],type:f.type});};r.readAsDataURL(f);};
  const doRead=async()=>{if(!rdImg)return;setRdLd(true);setRdR(null);
    try{setRdR(await aiV(rdImg.b64,rdImg.type,`อ่านแบบก่อสร้าง JSON:{type,width,length,eaveH,slope,spacing,struct,liveType,slab,summary,confidence,notes}`));}catch(e){setRdR({error:1,raw:e.message});}finally{setRdLd(false);}};
  // PDF
  const doPDF=async()=>{if(!results||!bt)return;setPdfLd(true);
    try{const sum=await ai([{role:"user",content:`สรุปการคำนวณโครงสร้าง 3 ย่อหน้า: ${cx()}`}]);
    const html=`<!DOCTYPE html><html><head><meta charset="utf-8"><title>RABBiZ Report</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Sarabun',sans-serif;font-size:11pt;color:#2c2416;line-height:1.8;padding:40px 50px;max-width:800px;margin:0 auto}.hdr{text-align:center;border-bottom:3px solid #c8960c;padding-bottom:20px;margin-bottom:30px}.logo{font-size:24pt;font-weight:700;color:#c8960c}h2{font-size:13pt;border-left:4px solid #c8960c;padding-left:12px;margin:24px 0 10px}table{width:100%;border-collapse:collapse;margin:8px 0 18px;font-size:10pt}th{background:#2c2416;color:#fff;padding:7px}td{padding:6px;border-bottom:1px solid #e2ddd3}.hl{color:#c8960c;font-weight:700}.box{background:#faf8f4;border:1px solid #e2ddd3;border-radius:8px;padding:14px;margin:14px 0}</style></head><body><div class="hdr"><div class="logo">RABBiZ</div><h1 style="font-size:16pt">รายงานการคำนวณโครงสร้าง</h1><div style="font-size:10pt;color:#8c7e6a">วันที่: ${new Date().toLocaleDateString('th-TH')} | SC-${Date.now().toString(36).toUpperCase()}</div></div><h2>ข้อมูลโครงการ</h2><table><tr><td>อาคาร</td><td class="hl">${bt.l} ${width}x${length}m สูง${eaveH}m</td></tr><tr><td>โครงสร้าง</td><td>${struct}</td></tr><tr><td>พื้นที่</td><td class="hl">${results.qty.tArea}m²</td></tr></table>${results.beam?`<h2>คานเหล็ก</h2><table><tr><td>${results.beam.n}</td><td>M=${results.bM}t·m</td></tr></table>`:""}${results.col?`<h2>เสาเหล็ก</h2><table><tr><td>${results.col.n}</td><td>P=${results.cP}t</td></tr></table>`:""}${results.rcB?`<h2>คาน คสล.</h2><table><tr><td>${results.rcB.w}x${results.rcB.d}cm</td><td>${results.rcB.bar}</td></tr></table>`:""}${results.rcC?`<h2>เสา คสล.</h2><table><tr><td>${results.rcC.size}cm</td><td>${results.rcC.bar}</td></tr></table>`:""}
    <h2>ฐานราก</h2><table><tr><td>${results.found.type} ${results.found.size}m</td><td>P=${results.found.load}t</td></tr></table><h2>ราคา</h2><table><tr><td>${results.qty.tArea}m² × ${results.cost.rate.toLocaleString()}฿/m²</td><td class="hl">= ฿${results.cost.totalM}M</td></tr></table><h2>สรุป AI</h2><div class="box">${sum.replace(/\n/g,'<br>')}</div><div style="margin-top:30px;padding:12px;background:#fdf0f0;border:1px solid #e2b0b0;border-radius:6px;font-size:9pt;color:#8c7e6a">⚠️ Preliminary Design — ต้องตรวจสอบโดย กว.</div><div style="margin-top:24px;text-align:center;font-size:9pt;color:#b0a48e;border-top:1px solid #e2ddd3;padding-top:14px">RABBiZ Structural MEGA v5.0<br><br><div style="display:flex;justify-content:space-around"><div>ลงชื่อ _______________<br>ผู้คำนวณ</div><div>ลงชื่อ _______________<br>ผู้ตรวจสอบ กว.</div></div></div></body></html>`;
    const blob=new Blob([html],{type:"text/html"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`RABBiZ_Report_${new Date().toISOString().slice(0,10)}.html`;a.click();URL.revokeObjectURL(url);
    }catch(e){console.error("PDF Error:",e);}finally{setPdfLd(false);}};

  // ═══════════════════════════════════════════════════════════════
  // 20 AI FEATURES
  // ═══════════════════════════════════════════════════════════════
  const features={
    compliance:{t:"ตรวจมาตรฐาน",d:"ตรวจ มยผ./วสท. ให้คะแนน A-F",ic:"✅",c:"ok",run:async(c)=>await aiJ(`ตรวจโครงสร้าง มยผ.1301/1302/1311 วสท.: ${c}\nJSON:{score:0-100,grade:"A-F",checks:[{item,standard,status:"pass|warn|fail",detail}],recommendations:[],critical:[]}`)},
    compare:{t:"เปรียบเทียบโครงสร้าง",d:"Steel vs RC vs Hybrid",ic:"⚖️",c:"b",run:async(c)=>await aiJ(`เปรียบเทียบ Steel vs RC vs Hybrid: ${c}\nJSON:{options:[{name,struct,beam,column,cost_factor,construction_days,pros:[],cons:[],score:0-100}],recommendation,reason}`)},
    fea:{t:"FEA วิเคราะห์",d:"Stress, Deflection, Utilization",ic:"🔬",c:"p",run:async(c)=>await aiJ(`Simplified FEA: ${c}\nJSON:{method,members:[{id,type,section,forces:{axial_ton,shear_ton,moment_ton_m,utilization_percent},deflection:{actual_mm,allowable_mm,status},status}],critical_member:{id,reason},global_stability:{sway_mm,allowable_mm,status},summary}`)},
    progressive:{t:"Progressive Collapse",d:"ถอดเสา วิเคราะห์พังลุกลาม (GSA)",ic:"🏚️",c:"e",run:async(c)=>await aiJ(`Progressive Collapse GSA: ${c}\nJSON:{analysis_method,scenarios:[{scenario,removed_column,affected_members:[{member,original_force,new_force,capacity,status}],collapse_risk,survival}],robustness_score:0-100,key_elements:[],recommendations:[]}`)},
    wind_pro:{t:"Wind Pro มยผ.1311",d:"Cp ทุกด้าน, Cladding",ic:"🌪️",c:"b",run:async(c)=>await aiJ(`แรงลม มยผ.1311: ${c}\nJSON:{design_wind_speed_mps,exposure_category,velocity_pressure_ksc,pressure_coefficients:{windward_wall:{Cp,net_pressure_ksc},leeward_wall:{Cp,net_pressure_ksc},roof_windward:{Cp,net_pressure_ksc}},base_shear:{along_wind_ton},overturning_moment:{along_wind_m,safety_factor},cladding_design:{max_pressure_ksc,recommended_thickness_mm},drift:{estimated_mm,allowable_mm,status},summary}`)},
    seismic:{t:"แผ่นดินไหว มยผ.1302",d:"Base Shear, Story Drift",ic:"🌋",c:"w",run:async(c)=>await aiJ(`แผ่นดินไหว มยผ.1302: ${c}\nJSON:{zone,zone_factor,importance_factor,base_shear_percent,base_shear_ton,story_drift:{allowable,estimated,status},vulnerable_areas:[],recommendations:[],needs_detailed_analysis,reason}`)},
    multi_hazard:{t:"Multi-Hazard",d:"แผ่นดินไหว+ลม+น้ำท่วม+ไฟ",ic:"🌊",c:"b",run:async(c)=>await aiJ(`Multi-Hazard กรุงเทพฯ: ${c}\nJSON:{hazards:[{hazard_type,return_period_yr,design_load_value,demand_capacity_ratio,status,governing_standard}],governing_hazard,resilience_score:0-100,mitigation_measures:[{hazard,measure,cost_estimate}],summary}`)},
    fire:{t:"Fire Resistance",d:"อัตราทนไฟ, Cover, Protection",ic:"🔥",c:"e",run:async(c)=>await aiJ(`Fire Resistance: ${c}\nJSON:{required_fire_rating_hr,members:[{member,type,current_rating_hr,required_hr,protection:{needed,type,thickness_mm},status}],overall_rating,recommendations:[]}`)},
    risk:{t:"วิเคราะห์ความเสี่ยง",d:"Failure Mode & Risk Analysis",ic:"🛡️",c:"w",run:async(c)=>await aiJ(`Risk & Failure Mode: ${c}\nJSON:{overall_risk,score:0-100,risks:[{category,title,severity,probability,mitigation}],failure_modes:[{mode,member,likelihood,consequence,prevention}]}`)},
    connection:{t:"ออกแบบจุดต่อ",d:"Bolt/Weld ตาม AISC",ic:"🔩",c:"p",run:async(c)=>await aiJ(`จุดต่อ AISC: ${c}\nJSON:{connections:[{location,type,detail:{bolts,bolt_grade,num_bolts,plate_thickness,weld_size},capacity,demand,status,sketch_description}],general_notes:[]}`)},
    rebar_detail:{t:"Rebar Detailing",d:"เหล็กเสริม ทาบ งอ ACI318",ic:"💪",c:"p",run:async(c)=>await aiJ(`Rebar Detailing ACI318: ${c}\nJSON:{members:[{member,section,main_bar:{size,quantity,ratio_percent},stirrup:{size,spacing_mm:{support_zone,mid_span}},development_length:{straight_mm,hook_90_mm},lap_splice:{length_mm,location}}],detailing_rules:[],common_mistakes:[]}`)},
    load_path:{t:"Load Path Tracing",d:"ติดตามแรง หลังคา→ฐานราก",ic:"📊",c:"b",run:async(c)=>await aiJ(`Load Path: ${c}\nJSON:{levels:[{level,elements:[{element,loads:{dead_ton,live_ton,total_ton},accumulated_ton,transfer_to}]}],critical_load_path:{path:[],total_load_ton,bottleneck},soil_pressure:{max_ksc,allowable_ksc,status},recommendations:[]}`)},
    optimize:{t:"Optimize ลดต้นทุน",d:"ประหยัดวัสดุไม่ลดคุณภาพ",ic:"💎",c:"ok",run:async(c)=>await aiJ(`ลดต้นทุน: ${c}\nJSON:{current_cost,optimized_cost,saving_percent,changes:[{item,from,to,saving,reason}],summary}`)},
    value_eng:{t:"Value Engineering",d:"SAVE International",ic:"🎯",c:"ok",run:async(c)=>await aiJ(`Value Engineering: ${c}\nJSON:{proposals:[{title,category,description,cost_saving_baht,cost_saving_percent,performance_impact,risk_level}],total_saving_baht,total_saving_percent,summary}`)},
    retrofit:{t:"เสริมกำลัง Retrofit",d:"FRP, Steel Jacket, Carbon Fiber",ic:"🏗️",c:"w",run:async(c)=>await aiJ(`เสริมกำลัง 30%: ${c}\nJSON:{members:[{member,current_capacity_ton,required_capacity_ton,techniques:[{technique,capacity_gain_ton,cost_estimate_baht,pros:[],cons:[]}],recommended_technique}],total_cost_estimate,construction_sequence:[],standards:[]}`)},
    sequence:{t:"แผนลำดับก่อสร้าง",d:"Phase, Critical Path",ic:"📅",c:"b",run:async(c)=>await aiJ(`แผนก่อสร้าง: ${c}\nJSON:{total_days,phases:[{phase,name,duration_days,tasks:[],equipment:[],workers,materials:[]}],critical_path:[],weather_notes}`)},
    etabs:{t:"ETABS/SAP Input",d:"Grid, Section, Load Case",ic:"🖥️",c:"p",run:async(c)=>await aiJ(`ETABS Input: ${c}\nJSON:{software,grid_system:{x_grids:[],y_grids:[],z_levels:[]},materials:[{name,type,properties:{}}],sections:[{name,type,dimensions:{}}],load_cases:[{name,type,values:{}}],load_combinations:[{name,formula}],modeling_tips:[]}`)},
    qc:{t:"QC Checklist",d:"ตรวจงานก่อสร้าง Hold Points",ic:"📋",c:"b",run:async(c)=>await aiJ(`QC Checklist: ${c}\nJSON:{categories:[{category,items:[{item,standard,method,critical}]}],hold_points:[],test_requirements:[{test,when,acceptance}]}`)},
    material_test:{t:"แผนทดสอบวัสดุ",d:"ASTM/TIS ตัวอย่าง เกณฑ์ผ่าน",ic:"🧪",c:"p",run:async(c)=>await aiJ(`แผนทดสอบวัสดุ: ${c}\nJSON:{test_plan:[{material,tests:[{test_name,standard,frequency_required,min_samples,acceptance_criteria,estimated_cost_per_test}]}],total_testing_budget_estimate,common_failures:[]}`)},
    costdetail:{t:"ต้นทุนละเอียด",d:"แยกหมวด เปรียบเทียบตลาด",ic:"💰",c:"w",run:async(c)=>await aiJ(`ต้นทุนละเอียด: ${c}\nJSON:{total_budget,breakdown:[{category,percent,amount,sub_items:[{item,qty,unit_price,amount}]}],cost_per_sqm,saving_tips:[],price_risks:[]}`)},
    presentation:{t:"Presentation ลูกค้า",d:"สไลด์ สรุปผู้บริหาร FAQ",ic:"🎤",c:"p",run:async(c)=>await aiJ(`Presentation: ${c}\nJSON:{title,slides:[{slide_number,title,bullet_points:[],speaker_notes}],executive_summary,key_selling_points:[],faq:[{question,answer}],next_steps:[]}`)},
  };

  const runF=async(k)=>{if(!results||getAIS(k).ld)return;setAIS(k,true);try{const r=await features[k].run(cx());setAI(p=>({...p,[k]:{ld:false,r}}));}catch(e){setAI(p=>({...p,[k]:{ld:false,r:{error:1,raw:e.message}}}));}};

  // NAV categories
  const navGroups=[
    {g:"หลัก",items:[{id:"calc",ic:"📐",l:"คำนวณ"},{id:"nlp",ic:"💬",l:"พิมพ์ไทย"},{id:"reader",ic:"📷",l:"อ่านแบบ"},{id:"chat",ic:"🤖",l:"AI Advisor"}]},
    {g:"ตรวจสอบ",items:[{id:"compliance",ic:"✅",l:"มาตรฐาน"},{id:"compare",ic:"⚖️",l:"เปรียบเทียบ"},{id:"risk",ic:"🛡️",l:"ความเสี่ยง"}]},
    {g:"วิเคราะห์ขั้นสูง",items:[{id:"fea",ic:"🔬",l:"FEA"},{id:"progressive",ic:"🏚️",l:"Collapse"},{id:"wind_pro",ic:"🌪️",l:"ลม Pro"},{id:"seismic",ic:"🌋",l:"แผ่นดินไหว"},{id:"multi_hazard",ic:"🌊",l:"Multi-Hazard"},{id:"fire",ic:"🔥",l:"ทนไฟ"}]},
    {g:"ออกแบบ",items:[{id:"connection",ic:"🔩",l:"จุดต่อ"},{id:"rebar_detail",ic:"💪",l:"เหล็กเสริม"},{id:"load_path",ic:"📊",l:"Load Path"}]},
    {g:"วางแผน",items:[{id:"optimize",ic:"💎",l:"Optimize"},{id:"value_eng",ic:"🎯",l:"VE"},{id:"retrofit",ic:"🏗️",l:"เสริมกำลัง"},{id:"sequence",ic:"📅",l:"แผนสร้าง"}]},
    {g:"Output",items:[{id:"etabs",ic:"🖥️",l:"ETABS"},{id:"qc",ic:"📋",l:"QC"},{id:"material_test",ic:"🧪",l:"ทดสอบ"},{id:"costdetail",ic:"💰",l:"ต้นทุน"},{id:"presentation",ic:"🎤",l:"Present"}]},
  ];

  // ═══════════════════════════════════════════════════════════════
  // UI COMPONENTS (themed)
  // ═══════════════════════════════════════════════════════════════
  const sI={width:"100%",padding:"9px 12px",background:T.inputBg,border:`1.5px solid ${T.bd}`,borderRadius:8,color:T.t,fontSize:13,fontFamily:M,outline:"none",boxSizing:"border-box",transition:"border-color .15s"};

  const Inp=({l,u,v,set,mn,mx,st=0.5})=><div style={{marginBottom:10}}><label style={{display:"block",fontSize:11,color:T.d,marginBottom:3,fontFamily:F,fontWeight:600}}>{l}</label><div style={{display:"flex",gap:6,alignItems:"center"}}><input type="number" value={v} onChange={e=>{const n=parseFloat(e.target.value);set(isNaN(n)?mn||0:n);}} min={mn} max={mx} step={st} style={{...sI,flex:1}}/>{u&&<span style={{fontSize:10,color:T.dL,fontWeight:600}}>{u}</span>}</div></div>;
  const Sel=({l,v,set,opts})=><div style={{marginBottom:10}}><label style={{display:"block",fontSize:11,color:T.d,marginBottom:3,fontFamily:F,fontWeight:600}}>{l}</label><select value={v} onChange={e=>set(e.target.value)} style={{...sI,cursor:"pointer"}}>{opts.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}</select></div>;

  const Card=({t,ic,c,ch,noPad})=>{const cl=T[c]||T.a;return<div style={{background:T.s1,borderRadius:12,border:`1.5px solid ${T.bd}`,overflow:"hidden",marginBottom:12,boxShadow:T.shadow,transition:"all .2s"}}>
    {t&&<div style={{padding:"10px 16px",borderBottom:`1.5px solid ${T.bd}`,display:"flex",alignItems:"center",gap:7}}><span style={{fontSize:14}}>{ic}</span><span style={{fontSize:13,fontWeight:700,color:cl,fontFamily:D}}>{t}</span></div>}
    <div style={{padding:noPad?0:16}}>{ch}</div></div>;};

  const Row=({l,v,u,h})=><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0",borderBottom:`1px solid ${T.bd}30`}}><span style={{fontSize:12,color:T.d}}>{l}</span><span style={{fontSize:13,fontWeight:h?700:500,color:h?T.a:T.t,fontFamily:M}}>{v}{u&&<span style={{fontSize:10,color:T.dL,marginLeft:3}}>{u}</span>}</span></div>;
  const PF=({ok,tx})=><div style={{marginTop:8,padding:8,borderRadius:8,textAlign:"center",fontSize:12,fontWeight:700,background:ok?T.okBg:T.eBg,color:ok?T.ok:T.e}}>{ok?"✓":"✗"} {tx}</div>;
  const Btn=({c,full,ch,onClick,dis,outline})=>{const cl=T[c]||c||T.a;const isDark=c==="a"||c==="w"||c==="aL";const txtC=outline?cl:isDark?"#1a1200":"#fff";return<button onClick={onClick} disabled={dis} style={{padding:full?"11px":"8px 16px",borderRadius:8,border:outline?`2px solid ${cl}`:"none",cursor:dis?"not-allowed":"pointer",background:outline?"transparent":cl,color:txtC,fontSize:13,fontWeight:700,fontFamily:F,width:full?"100%":"auto",opacity:dis?.5:1,transition:"all .15s"}}>{ch}</button>;};
  const Ld=({t})=><div style={{textAlign:"center",padding:30}}><div style={{width:36,height:36,border:`3px solid ${T.bd}`,borderTop:`3px solid ${T.a}`,borderRadius:"50%",margin:"0 auto",animation:"spin .8s linear infinite"}}/><div style={{fontSize:12,color:T.d,marginTop:10}}>{t}</div></div>;
  const AIR=({data})=>{if(!data)return null;if(data.error)return<div style={{fontSize:12,whiteSpace:"pre-wrap",padding:12,background:T.eBg,borderRadius:8}}><span style={{fontWeight:700,color:T.e}}>⚠️ Error: </span><span style={{color:T.d}}>{data.raw||"เกิดข้อผิดพลาด กรุณาลองใหม่"}</span></div>;
    if(typeof data==="string")return<div style={{fontSize:13,color:T.t,whiteSpace:"pre-wrap",lineHeight:1.8}}>{data}</div>;
    return<pre style={{whiteSpace:"pre-wrap",fontFamily:F,fontSize:12,color:T.t,lineHeight:1.9,margin:0}}>{rJ(data)}</pre>;};

  // Stat box
  const Stat=({l,v,u})=><div style={{textAlign:"center",padding:"8px 4px",minWidth:60}}><div style={{fontSize:10,color:T.d,fontWeight:600}}>{l}</div><div style={{fontSize:20,fontWeight:800,color:T.a,fontFamily:D,lineHeight:1.2}}>{v}</div>{u&&<div style={{fontSize:9,color:T.dL}}>{u}</div>}</div>;

  return(
    <div style={{minHeight:"100vh",background:T.bg,color:T.t,fontFamily:F,display:"flex",transition:"background .3s,color .3s"}}>
      <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet"/>
      <style>{`
        input:focus,select:focus,textarea:focus{border-color:${T.a}!important;box-shadow:0 0 0 3px ${T.a}18!important}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:${T.bd};border-radius:3px}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fi{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}.fi{animation:fi .3s ease-out}
        button:hover:not(:disabled){filter:brightness(1.08);transform:translateY(-1px)}
        button:active:not(:disabled){transform:translateY(0)}
        .sidebar-item:hover{background:${T.navA}15!important}
      `}</style>

      {/* ═══ SIDEBAR ═══ */}
      <div style={{width:sideOpen?220:56,height:"100vh",background:T.navBg,borderRight:`1px solid ${T.bd}30`,
        display:"flex",flexDirection:"column",transition:"width .25s ease",position:"sticky",top:0,zIndex:20,overflow:"hidden",flexShrink:0}}>

        {/* Logo & toggle */}
        <div style={{padding:sideOpen?"14px 16px":"14px 12px",borderBottom:`1px solid ${T.navD}30`,display:"flex",alignItems:"center",gap:8,cursor:"pointer"}} onClick={()=>setSideOpen(!sideOpen)}>
          <div style={{width:30,height:30,borderRadius:8,background:`linear-gradient(135deg,${T.navA},#d4a000)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:900,color:"#000",flexShrink:0}}>R</div>
          {sideOpen&&<div><div style={{fontSize:14,fontWeight:800,color:T.navA,fontFamily:D,letterSpacing:1}}>RABBiZ</div><div style={{fontSize:9,color:T.navD,letterSpacing:1}}>STRUCTURAL MEGA</div></div>}
        </div>

        {/* Nav groups */}
        <div style={{flex:1,overflowY:"auto",padding:"6px 0"}}>
          {navGroups.map((g,gi)=>(
            <div key={gi}>
              {sideOpen&&<div style={{padding:"10px 16px 4px",fontSize:9,fontWeight:700,color:T.navD,letterSpacing:1.5,textTransform:"uppercase"}}>{g.g}</div>}
              {!sideOpen&&gi>0&&<div style={{height:1,background:T.navD+"30",margin:"4px 8px"}}/>}
              {g.items.map(n=>(
                <div key={n.id} className="sidebar-item" onClick={()=>{setPage(n.id);if(window.innerWidth<768)setSideOpen(false);}} style={{
                  padding:sideOpen?"7px 16px":"7px 0",margin:sideOpen?"1px 6px":"1px 4px",borderRadius:7,cursor:"pointer",
                  display:"flex",alignItems:"center",gap:8,justifyContent:sideOpen?"flex-start":"center",
                  background:page===n.id?`${T.navA}20`:"transparent",transition:"background .15s"
                }}>
                  <span style={{fontSize:15,flexShrink:0,width:24,textAlign:"center"}}>{n.ic}</span>
                  {sideOpen&&<span style={{fontSize:12,fontWeight:page===n.id?700:500,color:page===n.id?T.navA:T.navT,whiteSpace:"nowrap"}}>{n.l}</span>}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Theme toggle */}
        <div style={{padding:sideOpen?"10px 16px":"10px 0",borderTop:`1px solid ${T.navD}30`,display:"flex",alignItems:"center",justifyContent:sideOpen?"flex-start":"center",gap:8,cursor:"pointer"}} onClick={toggle}>
          <div style={{width:24,textAlign:"center",fontSize:16}}>{mode==="dark"?"☀️":"🌙"}</div>
          {sideOpen&&<span style={{fontSize:11,color:T.navT}}>{mode==="dark"?"Light Mode":"Dark Mode"}</span>}
        </div>
      </div>

      {/* ═══ MAIN CONTENT ═══ */}
      <div style={{flex:1,minWidth:0}}>
        {/* Top bar */}
        <div style={{padding:"10px 20px",background:T.s1,borderBottom:`1.5px solid ${T.bd}`,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:10,boxShadow:T.shadow}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <button onClick={()=>setSideOpen(!sideOpen)} style={{border:"none",background:"none",cursor:"pointer",fontSize:18,color:T.d,padding:4}}>☰</button>
            <span style={{fontSize:14,fontWeight:700,color:T.t,fontFamily:D}}>{navGroups.flatMap(g=>g.items).find(n=>n.id===page)?.l||"คำนวณ"}</span>
            {features[page]&&<span style={{padding:"2px 8px",borderRadius:10,background:T.aBg,color:T.a,fontSize:10,fontWeight:700}}>AI</span>}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            {results&&<span style={{fontSize:11,color:T.ok,fontWeight:600}}>● {bt.l} {width}×{length}m ≈฿{results.cost.totalM}M</span>}
            <span style={{fontSize:10,color:T.dL,padding:"3px 8px",borderRadius:6,background:T.s2}}>v5.0</span>
          </div>
        </div>

        <div style={{padding:"16px 20px",maxWidth:900,margin:"0 auto"}}>

          {/* ═══ CALC ═══ */}
          {page==="calc"&&<div className="fi">
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:8,marginBottom:16}}>
              {BT.map(b=><button key={b.id} onClick={()=>chgType(b.id)} style={{padding:"14px",background:type===b.id?T.aBg:T.s1,border:`2px solid ${type===b.id?T.a:T.bd}`,borderRadius:12,cursor:"pointer",textAlign:"left",boxShadow:type===b.id?T.shadowL:"none",transition:"all .2s"}}>
                <div style={{fontSize:24}}>{b.ic}</div><div style={{fontSize:14,fontWeight:700,color:type===b.id?T.a:T.t,fontFamily:D,marginTop:4}}>{b.l}</div><div style={{fontSize:11,color:T.d}}>{b.d}</div></button>)}
            </div>

            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:12,marginBottom:16}}>
              <Card t="ขนาดอาคาร" ic="📏" c="b" ch={<><Inp l="กว้าง" u="m" v={width} set={setW} mn={4} mx={50}/><Inp l="ยาว" u="m" v={length} set={setL} mn={4} mx={100}/><Inp l="สูง" u="m" v={eaveH} set={setH} mn={2.5} mx={20}/>{is2&&<Inp l="สูงชั้น 2" u="m" v={floorH2} set={setH2} mn={2.5} mx={5}/>}<Inp l="ลาดหลังคา" u="°" v={slope} set={setSl} mn={5} mx={45} st={1}/><Inp l="ระยะเฟรม" u="m" v={spacing} set={setSp} mn={3} mx={9}/></>}/>
              <Card t="ระบบโครงสร้าง" ic="⚙️" c="p" ch={<><Sel l="โครงสร้าง" v={struct} set={setSt} opts={[{v:"steel",l:"🔩 เหล็ก"},{v:"concrete",l:"🧱 คสล."}]}/><Sel l="น้ำหนักจร" v={liveType} set={setLT} opts={Object.entries(LL).map(([k,v])=>({v:k,l:`${k} (${v} kg/m²)`}))}/>{(struct==="concrete"||is2)&&<><Sel l="คอนกรีต" v={conc} set={setConc} opts={Object.keys(CONC).map(k=>({v:k,l:k}))}/><Sel l="เหล็กเสริม" v={rebar} set={setRebar} opts={Object.keys(RB).map(k=>({v:k,l:k}))}/><Inp l="หนาพื้น" u="cm" v={slab} set={setSlab} mn={8} mx={25} st={1}/></>}</>}/>
            </div>

            <div style={{display:"flex",gap:8,marginBottom:18,flexWrap:"wrap"}}>
              <Btn c="a" ch="⚡  คำนวณโครงสร้าง" onClick={doCalc}/>
              {results&&<><Btn c="b" ch={pdfLd?"กำลังสร้าง...":"📄 สร้าง PDF"} onClick={doPDF} dis={pdfLd} outline/><Btn c="ok" ch="✅ ตรวจมาตรฐาน" onClick={()=>{setPage("compliance");runF("compliance");}} outline/></>}
            </div>

            {results&&<div className="fi">
              <div style={{background:T.s1,borderRadius:12,border:`1.5px solid ${T.a}30`,padding:"12px 16px",marginBottom:14,display:"flex",flexWrap:"wrap",gap:4,justifyContent:"center",boxShadow:T.shadowL}}>
                <Stat l="ขนาด" v={`${width}×${length}`} u="เมตร"/><Stat l="พื้นที่" v={results.qty.tArea} u="m²"/><Stat l="เฟรม" v={results.qty.nF} u="ชุด"/><Stat l="เสา" v={results.qty.nC} u="ต้น"/><Stat l="ราคา" v={`฿${results.cost.totalM}M`}/>
              </div>

              <div style={{display:"flex",gap:3,marginBottom:14,borderBottom:`2px solid ${T.bd}`}}>
                {[{id:"loads",l:"น้ำหนักบรรทุก"},{id:"members",l:"ออกแบบ"},{id:"found",l:"ฐานราก"},{id:"boq",l:"BOQ & ราคา"}].map(t=>
                  <button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"9px 16px",border:"none",borderRadius:"8px 8px 0 0",cursor:"pointer",fontSize:12,fontWeight:tab===t.id?700:500,
                    background:tab===t.id?T.s1:"transparent",color:tab===t.id?T.a:T.d,borderBottom:tab===t.id?`2px solid ${T.a}`:"2px solid transparent",fontFamily:F,transition:"all .15s"}}>{t.l}</button>)}
              </div>

              {tab==="loads"&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:12}}>
                <Card t="หลังคา" ic="🏗️" c="b" ch={<><Row l="Dead Load" v={results.loads.rDL} u="kg/m²"/><Row l="Live Load" v={results.loads.rLL} u="kg/m²"/><Row l="รวม" v={results.loads.rT} u="kg/m²" h/></>}/>
                {results.loads.fDL&&<Card t="พื้น" ic="▦" c="p" ch={<><Row l="Dead Load" v={results.loads.fDL} u="kg/m²"/><Row l="Live Load" v={results.loads.ll} u="kg/m²"/><Row l="รวม" v={results.loads.fT} u="kg/m²" h/></>}/>}
              </div>}
              {tab==="members"&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:12}}>
                {results.beam&&<Card t="คานเหล็ก" ic="📐" c="a" ch={<><Row l="หน้าตัด" v={results.beam.n} h/><Row l="M" v={results.bM} u="t·m"/><Row l="S req/prov" v={`${results.beam.Sr} / ${results.beam.Sp}`} u="cm³"/><PF ok={parseFloat(results.beam.Sp)>=parseFloat(results.beam.Sr)} tx="Section Modulus Check"/></>}/>}
                {results.col&&<Card t="เสาเหล็ก" ic="🏛️" c="a" ch={<><Row l="หน้าตัด" v={results.col.n} h/><Row l="P" v={results.cP} u="t"/><Row l="KL/r" v={results.col.sl}/><PF ok={results.col.A>=parseFloat(results.col.Ar)} tx="Column Area Check"/></>}/>}
                {results.rcB&&<Card t="คาน คสล." ic="📐" c="p" ch={<><Row l="ขนาด" v={`${results.rcB.w}×${results.rcB.d}`} u="cm" h/><Row l="Mu" v={results.rcB.Mu} u="t·m"/><Row l="เหล็ก" v={results.rcB.bar} h/></>}/>}
                {results.rcC&&<Card t="เสา คสล." ic="🏛️" c="p" ch={<><Row l="ขนาด" v={results.rcC.size} u="cm" h/><Row l="Pu" v={results.rcC.Pu} u="t"/><Row l="เหล็ก" v={results.rcC.bar} h/></>}/>}
                {results.rcS&&<Card t="พื้น คสล." ic="▦" c="b" ch={<><Row l="หนา" v={results.rcS.t} u="cm" h/><Row l="Mu" v={results.rcS.Mu} u="t·m"/><Row l="As" v={results.rcS.As} u="cm²"/><Row l="เหล็ก" v={results.rcS.bar} h/></>}/>}
              </div>}
              {tab==="found"&&<Card t="ฐานราก" ic="🧱" c="a" ch={<><Row l="ประเภท" v={results.found.type} h/><Row l="ขนาด" v={results.found.size} u="m" h/><Row l="ลึก" v={results.found.depth} u="m"/><Row l="น้ำหนัก" v={results.found.load} u="t"/></>}/>}
              {tab==="boq"&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:12}}>
                <Card t="ปริมาณ" ic="📊" c="ok" ch={<><Row l="เฟรม" v={results.qty.nF} u="ชุด"/><Row l="เสา" v={results.qty.nC} u="ต้น"/>{struct==="steel"&&<Row l="เหล็กรวม" v={`${(parseFloat(results.qty.stW)/1000).toFixed(1)}`} u="ตัน" h/>}</>}/>
                <Card t="ราคาประมาณ" ic="💰" c="a" ch={<><Row l="พื้นที่รวม" v={results.qty.tArea} u="m²"/><Row l="อัตรา" v={results.cost.rate.toLocaleString()} u="฿/m²"/><div style={{textAlign:"center",padding:16,background:T.aBg,borderRadius:10,marginTop:10}}><div style={{fontSize:10,color:T.d,fontWeight:600}}>ราคาประมาณ</div><div style={{fontSize:32,fontWeight:800,color:T.a,fontFamily:D}}>฿{results.cost.totalM}M</div></div></>}/>
              </div>}
            </div>}
          </div>}

          {/* ═══ NLP ═══ */}
          {page==="nlp"&&<div className="fi">
            <Card t="พิมพ์ภาษาไทย → AI คำนวณ" ic="💬" c="a" ch={<>
              <textarea value={nlpTx} onChange={e=>setNlpTx(e.target.value)} placeholder='เช่น: "โกดังเหล็กกว้าง 20 ยาว 40 สูง 8 เมตร เก็บสินค้า"' style={{...sI,height:80,resize:"vertical",fontFamily:F,lineHeight:1.6}}/>
              <div style={{display:"flex",gap:6,marginTop:10,flexWrap:"wrap"}}>
                <Btn c="a" ch={nlpLd?"กำลังวิเคราะห์...":"🚀 AI วิเคราะห์"} onClick={doNlp} dis={nlpLd}/>
                {["โกดัง 15x30 สูง7m","โชว์รูมรถ 20x40m","อาคาร2ชั้น 12x24 สนง."].map((ex,i)=>
                  <button key={i} onClick={()=>setNlpTx(ex)} style={{padding:"6px 10px",borderRadius:6,border:`1.5px solid ${T.bd}`,background:"transparent",color:T.d,fontSize:11,cursor:"pointer",fontFamily:F}}>{ex}</button>)}
              </div></>}/>
            {nlpR&&!nlpR.error&&<Card t="ผลวิเคราะห์" ic="✨" c="ok" ch={<><div style={{fontSize:13,marginBottom:10,lineHeight:1.8}}>{nlpR.summary}</div>{nlpR.assumptions&&<div style={{fontSize:12,color:T.w,background:T.wBg,padding:10,borderRadius:8,marginBottom:10}}>💡 {nlpR.assumptions}</div>}<Btn c="ok" full ch="✅ ใช้ค่านี้ → ไปคำนวณ" onClick={()=>applyP(nlpR)}/></>}/>}
            {nlpR&&nlpR.error&&<Card t="เกิดข้อผิดพลาด" ic="⚠️" c="e" ch={<div style={{fontSize:12,color:T.e,whiteSpace:"pre-wrap"}}>{nlpR.raw||"ไม่สามารถวิเคราะห์ได้ กรุณาลองใหม่"}</div>}/>}
          </div>}

          {/* ═══ READER ═══ */}
          {page==="reader"&&<div className="fi">
            <Card t="AI อ่านแบบก่อสร้าง" ic="📷" c="b" ch={<>
              <div style={{border:`2px dashed ${T.bd}`,borderRadius:12,padding:24,textAlign:"center",background:T.s2,position:"relative",marginBottom:12,transition:"border-color .2s"}}>
                <input type="file" accept="image/*,.pdf" onChange={handleFile} style={{position:"absolute",inset:0,opacity:0,cursor:"pointer"}}/>
                {rdPrev?<img src={rdPrev} alt="" style={{maxWidth:"100%",maxHeight:250,borderRadius:8}}/>:
                  <div><div style={{fontSize:36,marginBottom:6}}>📎</div><div style={{fontSize:13,color:T.d}}>คลิกหรือลากไฟล์มาวางที่นี่</div><div style={{fontSize:11,color:T.dL,marginTop:4}}>PNG, JPG, PDF</div></div>}
              </div>
              {rdImg&&<Btn c="b" full ch={rdLd?"กำลังอ่านแบบ...":"🔍 AI อ่านแบบ"} onClick={doRead} dis={rdLd}/>}</>}/>
            {rdR&&!rdR.error&&<Card t="ผลอ่านแบบ" ic="✨" c="ok" ch={<><div style={{fontSize:13,marginBottom:10,lineHeight:1.8}}>{rdR.summary}</div>{rdR.confidence&&<div style={{fontSize:11,color:T.b,marginBottom:6}}>ความมั่นใจ: {rdR.confidence}</div>}<Btn c="ok" full ch="✅ ใช้ค่านี้ → ไปคำนวณ" onClick={()=>applyP(rdR)}/></>}/>}
            {rdR&&rdR.error&&<Card t="เกิดข้อผิดพลาด" ic="⚠️" c="e" ch={<div style={{fontSize:12,color:T.e}}>ไม่สามารถอ่านแบบได้ กรุณาลองอัปโหลดใหม่</div>}/>}
          </div>}

          {/* ═══ CHAT ═══ */}
          {page==="chat"&&<div className="fi" style={{display:"flex",flexDirection:"column",height:"calc(100vh - 140px)"}}>
            <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:8,padding:"8px 0"}}>
              {chatMsgs.length===0&&<div style={{textAlign:"center",padding:40,color:T.d}}>
                <div style={{fontSize:40,marginBottom:10}}>🤖</div>
                <div style={{fontSize:16,fontWeight:700,color:T.t,fontFamily:D}}>AI ที่ปรึกษาโครงสร้าง</div>
                <div style={{fontSize:12,marginTop:4,maxWidth:400,margin:"6px auto 0"}}>ถามได้ทุกเรื่องเกี่ยวกับโครงสร้าง มาตรฐาน หน้าตัด Connection ฐานราก</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:4,justifyContent:"center",marginTop:16}}>
                  {["span 20m ใช้เหล็กอะไร?","Load Combo มยผ.","Steel vs RC?","ดินอ่อนฐานรากอะไร?","Progressive Collapse?","FRP เสริมกำลัง?"].map((q,i)=>
                    <button key={i} onClick={()=>setCI(q)} style={{padding:"6px 10px",borderRadius:8,border:`1.5px solid ${T.bd}`,background:T.s1,color:T.d,fontSize:11,cursor:"pointer",fontFamily:F}}>{q}</button>)}
                </div>
              </div>}
              {chatMsgs.map((m,i)=><div key={i} style={{alignSelf:m.role==="user"?"flex-end":"flex-start",maxWidth:"80%",padding:"10px 14px",borderRadius:12,
                background:m.role==="user"?T.aBg:T.s1,border:`1.5px solid ${m.role==="user"?T.a+"40":T.bd}`,fontSize:13,lineHeight:1.8,whiteSpace:"pre-wrap",boxShadow:T.shadow}}>
                {m.role==="assistant"&&<div style={{fontSize:10,color:T.a,fontWeight:700,marginBottom:3}}>🤖 AI Advisor</div>}{m.content}</div>)}
              {chatLd&&<div style={{padding:12,background:T.s1,borderRadius:12,border:`1.5px solid ${T.bd}`,boxShadow:T.shadow}}><div style={{width:20,height:20,border:`2px solid ${T.bd}`,borderTop:`2px solid ${T.a}`,borderRadius:"50%",animation:"spin .8s linear infinite",display:"inline-block",verticalAlign:"middle",marginRight:8}}/><span style={{fontSize:12,color:T.d}}>กำลังคิด...</span></div>}
              <div ref={chatE}/>
            </div>
            <div style={{display:"flex",gap:8,paddingTop:10,borderTop:`1.5px solid ${T.bd}`}}>
              <input value={chatIn} onChange={e=>setCI(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendChat()} placeholder="ถามคำถามเกี่ยวกับโครงสร้าง..." style={{...sI,flex:1,fontFamily:F}}/>
              <Btn c="a" ch="ส่ง →" onClick={sendChat} dis={chatLd}/>
            </div>
          </div>}

          {/* ═══ COMPLIANCE special ═══ */}
          {page==="compliance"&&<div className="fi">
            {!results?<Card t="ตรวจมาตรฐาน" ic="✅" c="ok" ch={<div style={{textAlign:"center",padding:24,color:T.d}}><div style={{fontSize:32}}>📐</div><div style={{fontSize:13,marginTop:8}}>คำนวณโครงสร้างก่อน แล้วกลับมาตรวจมาตรฐาน</div><div style={{marginTop:10}}><Btn c="a" ch="→ ไปหน้าคำนวณ" onClick={()=>setPage("calc")}/></div></div>}/>:
            getAIS("compliance").ld?<Ld t="AI กำลังตรวจมาตรฐาน มยผ./วสท. ..."/>:
            !getAIS("compliance").r?<Card t="ตรวจมาตรฐาน มยผ./วสท." ic="✅" c="ok" ch={<><div style={{fontSize:12,color:T.d,marginBottom:10,lineHeight:1.7}}>AI จะตรวจสอบโครงสร้างของคุณตาม มยผ.1301, 1302, 1311 และมาตรฐาน วสท. พร้อมให้คะแนน A-F</div><Btn c="ok" full ch="🔍 เริ่มตรวจมาตรฐาน" onClick={()=>runF("compliance")}/></>}/>:
            (()=>{const d=getAIS("compliance").r;if(d.error)return<AIR data={d}/>;return<div className="fi">
              <div style={{display:"flex",gap:14,marginBottom:14,flexWrap:"wrap"}}>
                <div style={{flex:"0 0 140px",textAlign:"center",padding:20,background:T.s1,borderRadius:14,border:`1.5px solid ${T.bd}`,boxShadow:T.shadowL}}>
                  <div style={{fontSize:48,fontWeight:900,fontFamily:D,color:d.score>=80?T.ok:d.score>=60?T.w:T.e}}>{d.score}</div>
                  <div style={{fontSize:22,fontWeight:700,color:d.grade<="B"?T.ok:d.grade==="C"?T.w:T.e,fontFamily:D}}>เกรด {d.grade}</div>
                </div>
                <div style={{flex:1,minWidth:200}}>
                  {d.critical?.length>0&&<Card t="⚠️ รายการวิกฤต" ic="🚨" c="e" ch={d.critical.map((c,i)=><div key={i} style={{fontSize:12,color:T.e,padding:"3px 0"}}>• {c}</div>)}/>}
                  {d.recommendations?.length>0&&<Card t="คำแนะนำ" ic="💡" c="a" ch={d.recommendations.map((r,i)=><div key={i} style={{fontSize:12,color:T.d,padding:"3px 0"}}>• {r}</div>)}/>}
                </div>
              </div>
              <Card t="รายการตรวจสอบ" ic="📋" c="b" ch={d.checks?.map((ch,i)=>
                <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",padding:"8px 0",borderBottom:`1px solid ${T.bd}30`}}>
                  <span style={{fontSize:16,flexShrink:0}}>{ch.status==="pass"?"✅":ch.status==="warn"?"⚠️":"❌"}</span>
                  <div><div style={{fontSize:13,fontWeight:600}}>{ch.item}</div><div style={{fontSize:11,color:T.d}}>{ch.standard}</div>
                    <div style={{fontSize:12,color:ch.status==="pass"?T.ok:ch.status==="warn"?T.w:T.e,marginTop:2}}>{ch.detail}</div></div>
                </div>)}/>
            </div>;})()}
          </div>}

          {/* ═══ ALL OTHER AI FEATURES ═══ */}
          {Object.entries(features).filter(([k])=>k!=="compliance").map(([key,f])=>(
            page===key&&<div key={key} className="fi">
              {!results?<Card t={f.t} ic={f.ic} c={f.c} ch={<div style={{textAlign:"center",padding:24,color:T.d}}>
                <div style={{fontSize:32}}>📐</div><div style={{fontSize:13,marginTop:8}}>คำนวณโครงสร้างก่อน แล้วกลับมาใช้ฟีเจอร์นี้</div>
                <div style={{marginTop:10}}><Btn c="a" ch="→ ไปหน้าคำนวณ" onClick={()=>setPage("calc")}/></div></div>}/>:
              getAIS(key).ld?<Ld t={`AI กำลังวิเคราะห์ ${f.t}...`}/>:
              !getAIS(key).r?<Card t={f.t} ic={f.ic} c={f.c} ch={<>
                <div style={{fontSize:13,color:T.d,marginBottom:12,lineHeight:1.8}}>{f.d}</div>
                <Btn c={f.c} full ch={`🚀 เริ่มวิเคราะห์`} onClick={()=>runF(key)}/></>}/>:
              <div className="fi">
                <Card t={f.t} ic="✨" c="ok" ch={<AIR data={getAIS(key).r}/>}/>
                <div style={{marginTop:6}}><Btn c={f.c} ch="🔄 วิเคราะห์ใหม่" onClick={()=>runF(key)} outline/></div>
              </div>}
            </div>
          ))}

          {/* DISCLAIMER */}
          <div style={{marginTop:24,padding:12,borderRadius:10,background:T.eBg,border:`1px solid ${T.e}20`,fontSize:11,color:T.d,lineHeight:1.6}}>
            <span style={{fontWeight:700,color:T.e}}>⚠️ Preliminary Design</span> — ผลคำนวณเบื้องต้นเท่านั้น ต้องตรวจสอบและรับรองโดยวิศวกร กว. ตาม มยผ.1301/1302/1311 และ วสท.
          </div>
        </div>
      </div>
    </div>
  );
}
