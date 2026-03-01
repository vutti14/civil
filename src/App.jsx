import { useState, useRef, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════
// THEME
// ═══════════════════════════════════════════════════════════════
const C={bg:"#03060c",s1:"#08101e",s2:"#0e1829",s3:"#162040",bd:"#1a2d50",bdL:"#284470",
  a:"#ffc107",aD:"#d4a000",aG:"#ffc10720",t:"#e8ecf4",d:"#5878a0",dL:"#8ca8cc",
  ok:"#00e68a",okB:"#00e68a0e",w:"#ffa94d",wB:"#ffa94d0e",e:"#ff6b6b",eB:"#ff6b6b0e",
  b:"#4cc9f0",bB:"#4cc9f00e",p:"#c084fc",pB:"#c084fc0e",cy:"#22d3ee",mg:"#f472b6",
  fire:"#ff4500",lime:"#84cc16",teal:"#14b8a6",rose:"#fb7185",indigo:"#818cf8",sky:"#38bdf8"};
const F=`'IBM Plex Sans Thai',system-ui,sans-serif`;const M=`'JetBrains Mono',monospace`;

// ═══════════════════════════════════════════════════════════════
// ENGINEERING DATA
// ═══════════════════════════════════════════════════════════════
const BT=[{id:"warehouse",l:"โกดัง",ic:"🏭",fl:1},{id:"showroom",l:"โชว์รูม",ic:"🏪",fl:1},{id:"one_story",l:"1 ชั้น",ic:"🏠",fl:1},{id:"two_story",l:"2 ชั้น",ic:"🏢",fl:2}];
const SB=[{n:"H-200x100",d:200,A:27.16,Ix:1840,w:21.3},{n:"H-250x125",d:250,A:37.66,Ix:3960,w:29.6},{n:"H-300x150",d:300,A:46.78,Ix:7210,w:36.7},{n:"H-350x175",d:350,A:63.14,Ix:13600,w:49.6},{n:"H-400x200",d:400,A:84.12,Ix:23700,w:66},{n:"H-500x200",d:500,A:114.2,Ix:47800,w:89.7},{n:"H-600x200",d:600,A:134.4,Ix:76800,w:106}];
const SC=[{n:"H-150x150",d:150,A:40.14,Ix:1640,w:31.5},{n:"H-200x200",d:200,A:63.53,Ix:4720,w:49.9},{n:"H-250x250",d:250,A:92.18,Ix:10800,w:72.4},{n:"H-300x300",d:300,A:119.8,Ix:20400,w:94},{n:"H-350x350",d:350,A:173.9,Ix:40300,w:136},{n:"H-400x400",d:400,A:218.7,Ix:66600,w:172}];
const LL={warehouse:500,showroom:400,commercial:300,office:200,residential:200};
const CONC={"C21/240":240,"C25/280":280,"C28/320":320,"C32/350":350};const RB={"SD40":4000,"SD50":5000};

// ═══════════════════════════════════════════════════════════════
// CALC ENGINE
// ═══════════════════════════════════════════════════════════════
function calc(p){
  const bt=BT.find(b=>b.id===p.type),fl=bt.fl,ll=LL[p.liveType]||300;
  const rDL=p.struct==="steel"?25:60,rLL=30,rT=rDL+rLL,fDL=p.slab*24+210,fT=fDL+ll;
  const nF=Math.floor(p.length/p.spacing)+1,nC=nF*2,area=p.width*p.length,tArea=area*(fl===2?2:1);
  let beam=null,col=null,bM=0,bV=0,cP=0;
  if(p.struct==="steel"){
    const w=(rT*p.spacing)/100,L=p.width*100;bM=w*L*L/8;bV=w*L/2;const Sr=bM/(0.66*2500);
    for(const s of SB){const S=s.Ix*2/s.d;if(S>=Sr){beam={...s,Sr:Sr.toFixed(1),Sp:S.toFixed(1)};break;}}
    if(!beam)beam={...SB[SB.length-1],warn:1};
    cP=(rT*p.width*p.spacing/2)*1.1;if(fl===2)cP+=fT*(p.width/2)*p.spacing*1.1;
    const Ar=cP/(0.6*2500);
    for(const s of SC){if(s.A>=Ar){col={...s,Ar:Ar.toFixed(1),sl:(p.eaveH*100/Math.sqrt(s.Ix/s.A)).toFixed(1)};break;}}
    if(!col)col={...SC[SC.length-1],warn:1};
  }
  let rcB=null,rcC=null,rcS=null;const fc=CONC[p.conc]||240,fy=RB[p.rebar]||4000;
  if(p.struct==="concrete"||fl===2){
    const sW=1.4*(p.slab*24+110)+1.7*ll,sL=Math.min(p.spacing,p.width/2)*100,sM=(sW/100)*sL*sL/10,sD=p.slab-3,sA=sM/(0.9*fy*0.9*sD);
    rcS={t:p.slab,Mu:(sM/1e5).toFixed(2),As:sA.toFixed(2),bar:sA<3?"DB12@200":sA<5?"DB12@150":sA<7?"DB16@200":"DB16@150"};
    const bSp=p.width*100/2,bW=(1.4*(fDL+50)+1.7*ll)*p.spacing/100,bMu=bW*bSp*bSp/8;
    const bW2=Math.max(20,Math.round(bSp/20/5)*5),bD=Math.max(30,Math.round(bSp/12/5)*5),bAs=bMu/(0.9*fy*0.9*(bD-5));
    rcB={w:bW2,d:bD,Mu:(bMu/1e5).toFixed(2),As:bAs.toFixed(2),bar:bAs<8?"3-DB20":bAs<12?"4-DB20":"4-DB25",stir:"DB10@150"};
    const cPu=fl===2?(1.4*(fDL+rDL)+1.7*(ll+rLL))*(p.width/2)*p.spacing*2:(1.4*(fDL+rDL)+1.7*(ll+rLL))*(p.width/2)*p.spacing;
    const cA=cPu/(0.65*(0.85*fc/10+0.02*fy)),cSz=Math.max(20,Math.ceil(Math.sqrt(cA)/5)*5);
    rcC={size:`${cSz}x${cSz}`,Pu:(cPu/1000).toFixed(1),bar:cSz<=25?"4-DB16":cSz<=30?"4-DB20":"8-DB25",tie:cSz<=30?"DB10@200":"DB10@150"};
  }
  const fL=p.struct==="steel"?(cP/1000):(rcC?parseFloat(rcC.Pu)/1.5:10);
  const fSz=Math.max(1,Math.ceil(Math.sqrt(fL/10)*10)/10),fDp=Math.max(0.3,Math.round(fSz*0.3*10)/10);
  const found={load:fL.toFixed(1),size:`${fSz.toFixed(1)}x${fSz.toFixed(1)}`,depth:fDp.toFixed(1),type:fL>30?"เสาเข็ม":"ฐานรากแผ่"};
  const stW=p.struct==="steel"?((beam?beam.w*p.width*nF:0)+(col?col.w*p.eaveH*nC:0)):0;
  const rate=p.struct==="steel"?(p.type==="warehouse"?5500:p.type==="showroom"?7000:8000):(fl===2?12000:9000);
  return{info:{...bt,width:p.width,length:p.length,eaveH:p.eaveH,fl,area,tArea},loads:{rDL,rLL,rT,fDL:fl===2?fDL:null,ll,fT:fl===2?fT:null},
    beam,col,rcB,rcC,rcS:fl===2?rcS:null,found,bM:(bM/1e5).toFixed(2),bV:(bV/1e3).toFixed(2),cP:(cP/1e3).toFixed(2),
    qty:{nF,nC,stW:stW.toFixed(0),area,tArea},cost:{rate,total:tArea*rate,totalM:(tArea*rate/1e6).toFixed(2)},params:p};
}

// ═══════════════════════════════════════════════════════════════
// AI
// ═══════════════════════════════════════════════════════════════
async function ai(msgs,sys){
  try{const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:3500,system:sys||"คุณเป็นวิศวกรโครงสร้างระดับผู้เชี่ยวชาญพิเศษ ตอบภาษาไทย อ้างอิง มยผ./วสท./ACI318/AISC360/Eurocode กระชับแต่ลึก ใช้สูตรและตัวเลขประกอบเสมอ",messages:msgs})});
    const d=await r.json();return d.content?.map(b=>b.text||"").join("\n")||"ไม่สามารถประมวลผลได้";}catch(e){return"Error: "+e.message;}
}
async function aiJ(prompt,sys){const r=await ai([{role:"user",content:prompt}],sys||"ตอบ JSON เท่านั้น ไม่มี markdown backticks");
  try{return JSON.parse(r.replace(/```json?|```/g,"").trim());}catch{return{error:1,raw:r};}}
async function aiV(b64,type,prompt){
  try{const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:2000,system:"วิศวกรโครงสร้าง อ่านแบบก่อสร้าง ตอบ JSON เท่านั้น",
    messages:[{role:"user",content:[{type:"image",source:{type:"base64",media_type:type,data:b64}},{type:"text",text:prompt}]}]})});
    const d=await r.json();return JSON.parse((d.content?.map(b=>b.text||"").join("\n")||"{}").replace(/```json?|```/g,"").trim());}catch{return{error:1};}}

function ctxStr(r,p){if(!r)return"";const bt=BT.find(b=>b.id===p.type);
  return`[${bt.l} ${p.width}x${p.length}m สูง${p.eaveH}m ${p.struct} LL=${LL[p.liveType]}kg/m² `+
    `${r.beam?`คาน=${r.beam.n} `:""}${r.col?`เสา=${r.col.n} `:""}${r.rcB?`คานRC=${r.rcB.w}x${r.rcB.d}cm `:""}${r.rcC?`เสาRC=${r.rcC.size}cm `:""}` +
    `ฐาน=${r.found.size}m(${r.found.type}) เฟรม=${r.qty.nF} เสา=${r.qty.nC} ≈฿${r.cost.totalM}M]`;}

// ═══════════════════════════════════════════════════════════════
// UI COMPONENTS
// ═══════════════════════════════════════════════════════════════
const sI={width:"100%",padding:"8px 10px",background:C.bg,border:`1px solid ${C.bd}`,borderRadius:5,color:C.t,fontSize:13,fontFamily:M,outline:"none",boxSizing:"border-box"};
function Inp({l,u,v,set,mn,mx,st=0.5}){return<div style={{marginBottom:7}}><label style={{display:"block",fontSize:10,color:C.d,marginBottom:2,fontFamily:F,fontWeight:600}}>{l}</label><div style={{display:"flex",gap:4,alignItems:"center"}}><input type="number" value={v} onChange={e=>set(parseFloat(e.target.value)||0)} min={mn} max={mx} step={st} style={{...sI,flex:1}}/>{u&&<span style={{fontSize:9,color:C.d}}>{u}</span>}</div></div>;}
function Sel({l,v,set,opts}){return<div style={{marginBottom:7}}><label style={{display:"block",fontSize:10,color:C.d,marginBottom:2,fontFamily:F,fontWeight:600}}>{l}</label><select value={v} onChange={e=>set(e.target.value)} style={{...sI,cursor:"pointer"}}>{opts.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}</select></div>;}
function Crd({t,ic,c=C.a,ch}){return<div style={{background:C.s1,borderRadius:9,border:`1px solid ${C.bd}`,overflow:"hidden",marginBottom:8}}><div style={{padding:"8px 11px",borderBottom:`1px solid ${C.bd}`,display:"flex",alignItems:"center",gap:5,background:`${c}05`}}><span style={{fontSize:13}}>{ic}</span><span style={{fontSize:11,fontWeight:700,color:c,fontFamily:F}}>{t}</span></div><div style={{padding:10}}>{ch}</div></div>;}
function Rw({l,v,u,h}){return<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"3px 0",borderBottom:`1px solid ${C.bd}10`}}><span style={{fontSize:10,color:C.d}}>{l}</span><span style={{fontSize:11,fontWeight:h?700:500,color:h?C.a:C.t,fontFamily:M}}>{v}{u&&<span style={{fontSize:8,color:C.d}}> {u}</span>}</span></div>;}
function PF({ok,tx}){return<div style={{marginTop:5,padding:6,borderRadius:5,textAlign:"center",fontSize:11,fontWeight:700,background:ok?C.okB:C.eB,color:ok?C.ok:C.e}}>{ok?"✅":"❌"} {tx}</div>;}
function Btn({c=C.a,full,ch,onClick,dis}){return<button onClick={onClick} disabled={dis} style={{padding:full?"10px":"6px 12px",borderRadius:6,border:"none",cursor:dis?"not-allowed":"pointer",background:`linear-gradient(135deg,${c},${c}bb)`,color:c===C.a||c===C.w||c===C.lime?"#000":"#fff",fontSize:full?13:11,fontWeight:700,fontFamily:F,width:full?"100%":"auto",boxShadow:`0 2px 8px ${c}20`,opacity:dis?.5:1}}>{ch}</button>;}
function Ld({t}){return<div style={{textAlign:"center",padding:20}}><div style={{fontSize:22,animation:"pulse 1.2s infinite"}}>🤖</div><div style={{fontSize:11,color:C.d,marginTop:5}}>{t}</div></div>;}

// JSON renderer
const KM={title:"ชื่อ",name:"ชื่อ",description:"รายละเอียด",summary:"สรุป",reason:"เหตุผล",status:"สถานะ",score:"คะแนน",grade:"เกรด",type:"ประเภท",recommendations:"คำแนะนำ",critical:"วิกฤต",category:"หมวด",severity:"ความรุนแรง",probability:"ความน่าจะเป็น",mitigation:"ป้องกัน",item:"รายการ",standard:"มาตรฐาน",detail:"รายละเอียด",method:"วิธี",frequency:"ความถี่",phase:"ระยะ",duration_days:"วัน",tasks:"งาน",equipment:"เครื่องจักร",workers:"คนงาน",materials:"วัสดุ",tips:"เคล็ดลับ",total_days:"รวมวัน",pros:"ข้อดี",cons:"ข้อเสีย",cost_factor:"ตัวคูณราคา",construction_days:"วันก่อสร้าง",recommendation:"แนะนำ",saving_percent:"ประหยัด%",changes:"เปลี่ยนแปลง",from:"จาก",to:"เป็น",saving:"ประหยัด",location:"ตำแหน่ง",capacity:"กำลัง",demand:"แรง",zone:"โซน",base_shear_ton:"Base Shear(t)",needs_detailed_analysis:"ต้องวิเคราะห์เพิ่ม",bullet_points:"ประเด็น",speaker_notes:"โน้ต",key_selling_points:"จุดเด่น",question:"คำถาม",answer:"คำตอบ",next_steps:"ต่อไป",overall_risk:"เสี่ยงรวม",prevention:"ป้องกัน",consequence:"ผลกระทบ",acceptance:"เกณฑ์ผ่าน",test:"ทดสอบ",when:"เมื่อไหร่",hold_points:"Hold Points",percent:"สัดส่วน%",amount:"จำนวนเงิน",unit_price:"ราคา/หน่วย",qty:"ปริมาณ",cost_per_sqm:"฿/ตร.ม.",checks:"ตรวจ",breakdown:"แยกรายการ",risks:"ความเสี่ยง",failure_modes:"โหมดวิบัติ",connections:"จุดต่อ",options:"ตัวเลือก",slides:"สไลด์",faq:"FAQ",struct:"โครงสร้าง",beam:"คาน",column:"เสา",notes:"หมายเหตุ",confidence:"ความมั่นใจ",mode:"โหมด",member:"ชิ้นส่วน",likelihood:"แนวโน้ม",vulnerable_areas:"จุดอ่อน",allowable:"อนุญาต",estimated:"ประมาณ",formula:"สูตร",properties:"คุณสมบัติ",dimensions:"ขนาด",material:"วัสดุ",values:"ค่า",categories:"หมวดหมู่",items:"รายการ",critical_path:"งานวิกฤต",general_notes:"หมายเหตุ",node:"จุดต่อ",stress:"หน่วยแรง",deflection:"การแอ่นตัว",utilization:"การใช้งาน",force:"แรง",moment:"โมเมนต์",shear:"แรงเฉือน",axial:"แรงตามแนวแกน",reaction:"แรงปฏิกิริยา",removed_column:"เสาที่ถูกถอด",affected_members:"ชิ้นส่วนที่ได้รับผลกระทบ",redistribution:"การกระจายแรงใหม่",survival:"ผลการอยู่รอด",wind_speed:"ความเร็วลม",pressure:"แรงดัน",direction:"ทิศทาง",coefficient:"สัมประสิทธิ์",fire_rating:"อัตราทนไฟ",required_rating:"อัตราที่ต้องการ",actual_rating:"อัตราจริง",cover:"ระยะคอนกรีตหุ้ม",detailing:"รายละเอียดเหล็กเสริม",lap_length:"ความยาวทาบ",hook:"งอปลาย",spacing_check:"ตรวจระยะห่าง",load_path:"เส้นทางแรง",level:"ระดับ",strengthening:"เสริมกำลัง",technique:"เทคนิค",cost_impact:"ผลกระทบราคา",alternatives:"ทางเลือก",testing:"การทดสอบ",sample_size:"ขนาดตัวอย่าง",criteria:"เกณฑ์",hazards:"ภัย",combined_effect:"ผลรวม",governing_case:"กรณีวิกฤต",safety_factor:"ค่าความปลอดภัย",weight:"น้ำหนัก",area_check:"ตรวจพื้นที่",scenario:"สถานการณ์",collapse_risk:"เสี่ยงพังทลาย",progressive:"ลุกลาม",robustness:"ความแข็งแรง",zones:"โซน",cladding:"ผนัง",suction:"แรงดูด",internal:"ภายใน",external:"ภายนอก",duration:"ระยะเวลา",temperature:"อุณหภูมิ",protection:"การป้องกัน",passive:"Passive",active:"Active",main_bar:"เหล็กหลัก",stirrup:"เหล็กปลอก",skin_bar:"เหล็กข้าง",development_length:"ความยาวฝัง",clear_spacing:"ระยะห่างสุทธิ",min_cover:"คอนกรีตหุ้มต่ำสุด",from_level:"จากชั้น",to_level:"ถึง",accumulated:"สะสม",tributary_area:"พื้นที่รับน้ำหนัก",current_capacity:"กำลังปัจจุบัน",required_capacity:"กำลังที่ต้องการ",deficit:"ส่วนขาด",frp_layers:"ชั้น FRP",jacket_thickness:"ความหนาเสื้อหุ้ม",original_value:"ค่าเดิม",proposed_value:"ค่าที่เสนอ",saving_amount:"ประหยัด(฿)",risk_level:"ระดับเสี่ยง",test_name:"ชื่อทดสอบ",frequency_required:"ความถี่",min_samples:"ตัวอย่างขั้นต่ำ",acceptance_criteria:"เกณฑ์ยอมรับ",hazard_type:"ประเภทภัย",return_period:"คาบการเกิดซ้ำ",design_load:"แรงออกแบบ",combination:"การรวม",controlling:"ควบคุม",total_demand:"แรงรวม",total_capacity:"กำลังรวม"};
function fmtK(k){return KM[k]||k.replace(/_/g," ");}
function rJ(o,d=0){if(!o||typeof o!=="object")return String(o);const pad="  ".repeat(d);
  const ent=Array.isArray(o)?o.map((v,i)=>[i,v]):Object.entries(o);
  return ent.map(([k,v])=>{const lb=typeof k==="number"?`${pad}▸ `:`${pad}${fmtK(k)}: `;
    if(Array.isArray(v)){if(!v.length)return`${lb}—`;if(typeof v[0]==="string"||typeof v[0]==="number")return`${lb}${v.join(" • ")}`;return`${lb}\n${v.map(i=>rJ(i,d+1)).join("\n")}`;}
    if(v&&typeof v==="object")return`${lb}\n${rJ(v,d+1)}`;if(typeof v==="boolean")return`${lb}${v?"✅":"❌"}`;return`${lb}${v}`;}).join("\n");}
function AIR({data}){if(!data)return null;if(data.error)return<div style={{fontSize:11,color:C.d,whiteSpace:"pre-wrap",padding:10,background:C.bg,borderRadius:6}}>{data.raw||"เกิดข้อผิดพลาด"}</div>;
  return<pre style={{whiteSpace:"pre-wrap",fontFamily:F,fontSize:11,color:C.t,lineHeight:1.8,margin:0}}>{rJ(data)}</pre>;}

// ═══════════════════════════════════════════════════════════════
// MAIN APP — 25 AI FEATURES
// ═══════════════════════════════════════════════════════════════
export default function App(){
  const[type,setType]=useState("warehouse");const[width,setW]=useState(12);const[length,setL]=useState(24);
  const[eaveH,setH]=useState(6);const[floorH2,setH2]=useState(3.5);const[slope,setSl]=useState(15);
  const[spacing,setSp]=useState(6);const[struct,setSt]=useState("steel");const[liveType,setLT]=useState("warehouse");
  const[conc,setConc]=useState("C25/280");const[rebar,setRebar]=useState("SD40");const[slab,setSlab]=useState(12);
  const[results,setR]=useState(null);const[tab,setTab]=useState("loads");const[page,setPage]=useState("calc");

  // All AI states: [loading, result] pairs
  const mkS=()=>{const[l,sl]=useState(false);const[r,sr]=useState(null);return{l,sl,r,sr};};
  const chat_s={msgs:useState([]),inp:useState(""),ld:useState(false),ref:useRef(null)};
  const nlp_s={tx:useState(""),ld:useState(false),r:useState(null)};
  const rd_s={img:useState(null),prev:useState(null),ld:useState(false),r:useState(null)};
  const pdf_s={ld:useState(false)};

  // 15 original AI features states
  const[compLd,setCompLd]=useState(false);const[compR,setCompR]=useState(null);
  const[cmpLd,setCmpLd]=useState(false);const[cmpR,setCmpR]=useState(null);
  const[riskLd,setRiskLd]=useState(false);const[riskR,setRiskR]=useState(null);
  const[optLd,setOptLd]=useState(false);const[optR,setOptR]=useState(null);
  const[seqLd,setSeqLd]=useState(false);const[seqR,setSeqR]=useState(null);
  const[seiLd,setSeiLd]=useState(false);const[seiR,setSeiR]=useState(null);
  const[conLd,setConLd]=useState(false);const[conR,setConR]=useState(null);
  const[etbLd,setEtbLd]=useState(false);const[etbR,setEtbR]=useState(null);
  const[qcLd,setQcLd]=useState(false);const[qcR,setQcR]=useState(null);
  const[dtlLd,setDtlLd]=useState(false);const[dtlR,setDtlR]=useState(null);
  const[prezLd,setPrezLd]=useState(false);const[prezR,setPrezR]=useState(null);

  // 10 NEW advanced AI features states
  const[feaLd,setFeaLd]=useState(false);const[feaR,setFeaR]=useState(null);
  const[pcLd,setPcLd]=useState(false);const[pcR,setPcR]=useState(null);
  const[windLd,setWindLd]=useState(false);const[windR,setWindR]=useState(null);
  const[fireLd,setFireLd]=useState(false);const[fireR,setFireR]=useState(null);
  const[rbdLd,setRbdLd]=useState(false);const[rbdR,setRbdR]=useState(null);
  const[lpLd,setLpLd]=useState(false);const[lpR,setLpR]=useState(null);
  const[retLd,setRetLd]=useState(false);const[retR,setRetR]=useState(null);
  const[veLd,setVeLd]=useState(false);const[veR,setVeR]=useState(null);
  const[mtLd,setMtLd]=useState(false);const[mtR,setMtR]=useState(null);
  const[mhLd,setMhLd]=useState(false);const[mhR,setMhR]=useState(null);

  const bt=BT.find(b=>b.id===type);const is2=bt?.fl===2;
  const p={type,width,length,eaveH,floorH2,slope,spacing,struct,liveType,conc,rebar,slab};

  const chgType=(id)=>{setType(id);setR(null);
    if(id==="warehouse"){setW(12);setL(24);setH(6);setSt("steel");setLT("warehouse");setSp(6);}
    if(id==="showroom"){setW(15);setL(30);setH(5);setSt("steel");setLT("showroom");setSp(6);}
    if(id==="one_story"){setW(10);setL(20);setH(3.5);setSt("concrete");setLT("commercial");setSp(5);}
    if(id==="two_story"){setW(10);setL(20);setH(3.5);setSt("concrete");setLT("commercial");setSp(5);}};
  const doCalc=()=>{setR(calc(p));setTab("loads");};
  const applyP=(np)=>{if(np.type)chgType(np.type);if(np.width)setW(np.width);if(np.length)setL(np.length);if(np.eaveH)setH(np.eaveH);if(np.slope)setSl(np.slope);if(np.spacing)setSp(np.spacing);if(np.struct)setSt(np.struct);if(np.liveType)setLT(np.liveType);if(np.slab)setSlab(np.slab);setTimeout(()=>setPage("calc"),300);};

  const cx=()=>ctxStr(results,p);

  // ─── CHAT ───
  const[chatMsgs,setCM]=useState([]);const[chatIn,setCI]=useState("");const[chatLd,setCL]=useState(false);const chatE=useRef(null);
  const sendChat=async()=>{if(!chatIn.trim())return;const u=chatIn.trim();setCI("");setCL(true);
    const nm=[...chatMsgs,{role:"user",content:u}];setCM(nm);
    const r=await ai(nm.map((m,i)=>({role:m.role,content:m.content+(m.role==="user"&&i===nm.length-1?cx():"")})));
    setCM([...nm,{role:"assistant",content:r}]);setCL(false);};
  useEffect(()=>{chatE.current?.scrollIntoView({behavior:"smooth"});},[chatMsgs]);

  // ─── NLP ───
  const[nlpTx,setNlpTx]=useState("");const[nlpLd,setNlpLd]=useState(false);const[nlpR,setNlpR]=useState(null);
  const doNlp=async()=>{if(!nlpTx.trim())return;setNlpLd(true);setNlpR(null);
    setNlpR(await aiJ(`จากข้อความ:"${nlpTx}" แยก JSON:{type,width,length,eaveH,slope,spacing,struct,liveType,slab,summary,assumptions}`));setNlpLd(false);};

  // ─── READER ───
  const[rdImg,setRdImg]=useState(null);const[rdPrev,setRdPrev]=useState(null);const[rdLd,setRdLd]=useState(false);const[rdR,setRdR]=useState(null);
  const handleFile=(e)=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=(ev)=>{setRdPrev(ev.target.result);setRdImg({b64:ev.target.result.split(",")[1],type:f.type});};r.readAsDataURL(f);};
  const doRead=async()=>{if(!rdImg)return;setRdLd(true);setRdR(null);setRdR(await aiV(rdImg.b64,rdImg.type,`อ่านแบบก่อสร้าง JSON:{type,width,length,eaveH,slope,spacing,struct,liveType,slab,summary,confidence,notes}`));setRdLd(false);};

  // ─── PDF ───
  const[pdfLd,setPdfLd]=useState(false);
  const doPDF=async()=>{if(!results)return;setPdfLd(true);
    const sum=await ai([{role:"user",content:`สรุปการคำนวณโครงสร้าง 3 ย่อหน้า: ${cx()}`}]);
    const r=results;const html=`<!DOCTYPE html><html><head><meta charset="utf-8"><title>RABBiZ Report</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'IBM Plex Sans Thai',sans-serif;font-size:11pt;color:#1a1a2e;line-height:1.7;padding:40px 50px;max-width:800px;margin:0 auto}.hdr{text-align:center;border-bottom:3px solid #ffc107;padding-bottom:20px;margin-bottom:30px}.logo{font-size:24pt;font-weight:700;color:#ffc107}h1{font-size:18pt}h2{font-size:14pt;border-left:4px solid #ffc107;padding-left:12px;margin:25px 0 12px}table{width:100%;border-collapse:collapse;margin:10px 0 20px;font-size:10pt}th{background:#0c1322;color:#fff;padding:8px}td{padding:7px;border-bottom:1px solid #e0e0e0}.hl{color:#ffc107;font-weight:700}.box{background:#f8f6f0;border:1px solid #e0d8c8;border-radius:8px;padding:16px;margin:15px 0}.disc{margin-top:30px;padding:14px;background:#fff5f5;border:1px solid #fcc;border-radius:6px;font-size:9pt;color:#666}.ftr{margin-top:30px;text-align:center;font-size:9pt;color:#999;border-top:1px solid #eee;padding-top:15px}</style></head><body><div class="hdr"><div class="logo">RABBiZ</div><h1>รายงานการคำนวณโครงสร้าง</h1><div style="font-size:10pt;color:#607090">วันที่: ${new Date().toLocaleDateString('th-TH')} | SC-${Date.now().toString(36).toUpperCase()}</div></div><h2>1. ข้อมูลโครงการ</h2><table><tr><td>อาคาร</td><td class="hl">${bt.l} ${width}x${length}m สูง${eaveH}m</td></tr><tr><td>โครงสร้าง</td><td>${struct}</td></tr><tr><td>พื้นที่</td><td class="hl">${r.qty.tArea}m²</td></tr></table><h2>2. น้ำหนัก</h2><table><tr><td>หลังคา</td><td>${r.loads.rT}kg/m²</td></tr>${r.loads.fDL?`<tr><td>พื้น</td><td>${r.loads.fT}kg/m²</td></tr>`:""}</table><h2>3. โครงสร้าง</h2>${r.beam?`<table><tr><td>คานเหล็ก ${r.beam.n}</td><td>M=${r.bM}t·m S=${r.beam.Sp}≥${r.beam.Sr}cm³</td></tr></table>`:""}${r.col?`<table><tr><td>เสาเหล็ก ${r.col.n}</td><td>P=${r.cP}t KL/r=${r.col.sl}</td></tr></table>`:""}${r.rcB?`<table><tr><td>คาน ${r.rcB.w}x${r.rcB.d}cm</td><td>${r.rcB.bar}</td></tr></table>`:""}${r.rcC?`<table><tr><td>เสา ${r.rcC.size}cm</td><td>${r.rcC.bar}</td></tr></table>`:""}
    <h2>4. ฐานราก</h2><table><tr><td>${r.found.type} ${r.found.size}m</td><td>P=${r.found.load}t</td></tr></table><h2>5. ราคา</h2><table><tr><td>${r.qty.tArea}m² × ${r.cost.rate.toLocaleString()}฿/m²</td><td class="hl">= ฿${r.cost.totalM}M</td></tr></table><h2>6. สรุป AI</h2><div class="box">${sum.replace(/\n/g,'<br>')}</div><div class="disc">⚠️ Preliminary Design — ต้องตรวจสอบโดย กว.</div><div class="ftr">RABBiZ Structural MEGA v4.0 — 25 AI Features<br><br><div style="display:flex;justify-content:space-around"><div>ลงชื่อ _______________<br>ผู้คำนวณ</div><div>ลงชื่อ _______________<br>ผู้ตรวจสอบ กว.</div></div></div></body></html>`;
    const blob=new Blob([html],{type:"text/html"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`RABBiZ_Report_${new Date().toISOString().slice(0,10)}.html`;a.click();URL.revokeObjectURL(url);setPdfLd(false);};

  // ═══════════════════════════════════════════════════════════════
  // ALL 20 AI FEATURE DEFINITIONS (excluding calc, nlp, reader, chat, pdf)
  // ═══════════════════════════════════════════════════════════════
  const features = {
    compliance:{ld:compLd,sLd:setCompLd,r:compR,sR:setCompR,t:"✅ ตรวจมาตรฐาน มยผ./วสท.",d:"AI ตรวจทุกรายการ ให้คะแนน A-F",ic:"✅",c:C.ok,
      run:async(c)=>await aiJ(`ตรวจโครงสร้าง มยผ.1301/1302/1311 วสท.: ${c}\nJSON:{score:0-100,grade:"A-F",checks:[{item,standard,status:"pass|warn|fail",detail}],recommendations:[],critical:[]}`)},
    compare:{ld:cmpLd,sLd:setCmpLd,r:cmpR,sR:setCmpR,t:"⚖️ เปรียบเทียบ Steel/RC/Hybrid",d:"แนะนำโครงสร้างที่เหมาะสมที่สุด",ic:"⚖️",c:C.b,
      run:async(c)=>await aiJ(`เปรียบเทียบ 3 ระบบ Steel vs RC vs Hybrid: ${c}\nJSON:{options:[{name,struct,beam,column,cost_factor,construction_days,pros:[],cons:[],score:0-100}],recommendation,reason}`)},
    risk:{ld:riskLd,sLd:setRiskLd,r:riskR,sR:setRiskR,t:"🛡️ วิเคราะห์ความเสี่ยง & Failure Mode",d:"ระบุจุดเสี่ยง โหมดวิบัติ วิธีป้องกัน",ic:"🛡️",c:C.e,
      run:async(c)=>await aiJ(`Failure Mode & Risk Analysis: ${c}\nJSON:{overall_risk:"low|medium|high",score:0-100,risks:[{category,title,severity,probability,description,mitigation}],failure_modes:[{mode,member,likelihood,consequence,prevention}]}`)},
    optimize:{ld:optLd,sLd:setOptLd,r:optR,sR:setOptR,t:"💎 AI ลดต้นทุน Optimize",d:"หาทางประหยัดวัสดุ ไม่ลดคุณภาพ",ic:"💎",c:C.lime,
      run:async(c)=>await aiJ(`ลดต้นทุนโครงสร้าง: ${c}\nJSON:{current_cost,optimized_cost,saving_percent,changes:[{item,from,to,saving,reason}],alternative_spacings:[{spacing,cost_factor,note}],summary}`)},
    sequence:{ld:seqLd,sLd:setSeqLd,r:seqR,sR:setSeqR,t:"📅 แผนลำดับก่อสร้าง",d:"Phase คน เครื่องจักร Critical Path",ic:"📅",c:C.teal,
      run:async(c)=>await aiJ(`วางแผนก่อสร้าง: ${c}\nJSON:{total_days,phases:[{phase,name,duration_days,tasks:[],equipment:[],workers,materials:[],tips:[]}],critical_path:[],weather_notes}`)},
    seismic:{ld:seiLd,sLd:setSeiLd,r:seiR,sR:setSeiR,t:"🌋 แผ่นดินไหว มยผ.1302",d:"Base Shear, Story Drift, จุดอ่อน",ic:"🌋",c:C.w,
      run:async(c)=>await aiJ(`แผ่นดินไหว มยผ.1302: ${c}\nJSON:{zone,zone_factor,importance_factor,base_shear_percent,base_shear_ton,story_drift:{allowable,estimated,status},seismic_weight_ton,vulnerable_areas:[],recommendations:[],needs_detailed_analysis,reason}`)},
    connection:{ld:conLd,sLd:setConLd,r:conR,sR:setConR,t:"🔩 ออกแบบจุดต่อ AISC",d:"Bolt/Weld ทุกตำแหน่ง Beam-Column, Base Plate",ic:"🔩",c:C.p,
      run:async(c)=>await aiJ(`ออกแบบจุดต่อ AISC: ${c}\nJSON:{connections:[{location,type,detail:{bolts,bolt_grade,num_bolts,plate_thickness,weld_size,weld_length},capacity,demand,status,sketch_description}],general_notes:[],standard}`)},
    etabs:{ld:etbLd,sLd:setEtbLd,r:etbR,sR:setEtbR,t:"🖥️ สร้าง ETABS/SAP Input",d:"Grid, Section, Load Case, Combination",ic:"🖥️",c:C.sky,
      run:async(c)=>await aiJ(`ETABS/SAP2000 Input: ${c}\nJSON:{software,model_description,grid_system:{x_grids:[],y_grids:[],z_levels:[]},materials:[{name,type,properties:{}}],sections:[{name,type,material,dimensions:{}}],load_cases:[{name,type,values:{}}],load_combinations:[{name,formula}],modeling_tips:[],analysis_settings:{method,notes}}`)},
    qc:{ld:qcLd,sLd:setQcLd,r:qcR,sR:setQcR,t:"📋 QC Checklist ก่อสร้าง",d:"รายการตรวจทุกหมวด Hold Points",ic:"📋",c:C.indigo,
      run:async(c)=>await aiJ(`QC Checklist: ${c}\nJSON:{project_info,categories:[{category,items:[{item,standard,method,frequency,critical}]}],hold_points:[],test_requirements:[{test,when,acceptance}]}`)},
    costdetail:{ld:dtlLd,sLd:setDtlLd,r:dtlR,sR:setDtlR,t:"💰 วิเคราะห์ต้นทุนละเอียด",d:"แยกหมวด เปรียบเทียบตลาด",ic:"💰",c:C.a,
      run:async(c)=>await aiJ(`ต้นทุนละเอียด: ${c}\nJSON:{total_budget,breakdown:[{category,percent,amount,sub_items:[{item,qty,unit_price,amount}]}],cost_per_sqm,market_comparison,saving_tips:[],price_risks:[]}`)},
    presentation:{ld:prezLd,sLd:setPrezLd,r:prezR,sR:setPrezR,t:"🎤 Presentation ลูกค้า",d:"สไลด์ สรุปผู้บริหาร FAQ",ic:"🎤",c:C.mg,
      run:async(c)=>await aiJ(`Presentation: ${c}\nJSON:{title,slides:[{slide_number,title,bullet_points:[],speaker_notes}],executive_summary,key_selling_points:[],faq:[{question,answer}],next_steps:[]}`)},

    // ═══ 10 NEW ADVANCED AI FEATURES ═══
    fea:{ld:feaLd,sLd:setFeaLd,r:feaR,sR:setFeaR,t:"🔬 AI Finite Element Analysis",d:"วิเคราะห์ Stress, Deflection, Utilization ทุกชิ้นส่วน",ic:"🔬",c:C.cy,
      run:async(c)=>await aiJ(`วิเคราะห์ Finite Element แบบง่าย (Simplified FEA): ${c}
ให้วิเคราะห์ทุก member แล้วตอบ JSON:
{method:"Simplified Frame Analysis ตาม Portal/Cantilever Method",
nodes:[{id,location:"ตำแหน่ง",x_m,y_m,support_type:"fixed|pin|roller|free",reaction:{Rx_ton,Ry_ton,M_ton_m}}],
members:[{id,type:"beam|column",section:"หน้าตัดที่ใช้",length_m,
  forces:{axial_ton,shear_ton,moment_ton_m,max_stress_ksc,allowable_stress_ksc,utilization_percent},
  deflection:{actual_mm,allowable_mm,ratio:"L/xxx",status:"pass|fail"},
  status:"pass|warn|fail"}],
critical_member:{id,reason:"เหตุผลที่วิกฤต"},
max_deflection:{member,value_mm,limit_mm,ratio},
global_stability:{sway_mm,allowable_mm,status},
summary:"สรุปผล FEA"}`)},

    progressive:{ld:pcLd,sLd:setPcLd,r:pcR,sR:setPcR,t:"🏚️ AI Progressive Collapse",d:"ถอดเสาออก 1 ต้น ตรวจการพังทลายลุกลาม",ic:"🏚️",c:C.e,
      run:async(c)=>await aiJ(`วิเคราะห์ Progressive Collapse (GSA/DoD Guidelines): ${c}
สมมติถอดเสามุมและเสากลางออกทีละต้น แล้ววิเคราะห์:
JSON:{analysis_method:"GSA Alternate Path Method",
scenarios:[{scenario:"ตำแหน่งเสาที่ถอด",removed_column:"ตำแหน่ง",
  affected_members:[{member,original_force,new_force,capacity,dcr:"Demand/Capacity Ratio",status:"pass|fail"}],
  redistribution:"อธิบายเส้นทางแรงใหม่",collapse_risk:"low|medium|high|critical",
  catenary_action:"มี/ไม่มี catenary action ช่วย",survival:"survive|partial_collapse|total_collapse"}],
robustness_score:0-100,
tie_force_requirements:{horizontal_ton,vertical_ton,peripheral_ton},
key_elements:["ชิ้นส่วนสำคัญที่ต้องออกแบบพิเศษ"],
recommendations:[],
needs_special_design:true/false}`)},

    wind_pro:{ld:windLd,sLd:setWindLd,r:windR,sR:setWindR,t:"🌪️ AI Wind Analysis Pro มยผ.1311",d:"Cp ทุกด้าน, GCpi, Wind Zone, ออกแบบ Cladding",ic:"🌪️",c:C.sky,
      run:async(c)=>await aiJ(`วิเคราะห์แรงลมละเอียดตาม มยผ.1311-50: ${c}
JSON:{design_wind_speed_mps,exposure_category:"A|B|C|D",importance_factor,topographic_factor,
velocity_pressure_ksc,gust_factor,
pressure_coefficients:{windward_wall:{Cp,net_pressure_ksc},leeward_wall:{Cp,net_pressure_ksc},
  side_walls:{Cp,net_pressure_ksc},roof_windward:{Cp,net_pressure_ksc},roof_leeward:{Cp,net_pressure_ksc}},
internal_pressure:{GCpi_positive,GCpi_negative},
zones:[{zone:"มุม/ขอบ/กลาง",area:"ตำแหน่ง",design_pressure_ksc,governing_combo:"สูตร"}],
base_shear:{along_wind_ton,across_wind_ton},
overturning_moment:{along_wind_m,safety_factor},
cladding_design:{max_pressure_ksc,recommended_thickness_mm,fastener_spacing_mm},
drift:{estimated_mm,allowable_mm,status},
critical_direction:"ทิศทางวิกฤต",
summary}`)},

    fire:{ld:fireLd,sLd:setFireLd,r:fireR,sR:setFireR,t:"🔥 AI Fire Resistance Rating",d:"อัตราทนไฟ ระยะ Cover อุณหภูมิวิกฤต",ic:"🔥",c:C.fire,
      run:async(c)=>await aiJ(`ประเมิน Fire Resistance ตาม มยผ./Eurocode/ACI216: ${c}
JSON:{building_classification:"ประเภทอาคาร ก-จ",required_fire_rating_hr,
members:[{member:"เสา/คาน/พื้น/ผนัง",type:"steel|rc",
  current_rating_hr,required_hr,
  critical_temperature_c:"อุณหภูมิวิกฤต",time_to_critical_min,
  cover_mm:{current,required,status},
  protection:{needed:true/false,type:"spray|board|intumescent|none",thickness_mm,cost_estimate_per_sqm},
  status:"pass|fail"}],
passive_protection:[{measure,location,specification}],
active_protection:[{system:"sprinkler|alarm|smoke_detector",required:true/false,benefit}],
egress:{required_exits,max_travel_distance_m,corridor_width_m},
overall_rating:"pass|fail",
upgrade_cost_estimate,
recommendations:[]}`)},

    rebar_detail:{ld:rbdLd,sLd:setRbdLd,r:rbdR,sR:setRbdR,t:"💪 AI Rebar Detailing",d:"เหล็กเสริมละเอียด ทาบ งอ ระยะห่าง",ic:"💪",c:C.p,
      run:async(c)=>await aiJ(`ออกแบบเหล็กเสริมละเอียด ACI318/วสท.: ${c}
JSON:{code:"ACI318-19 + วสท.",concrete_cover:{beam_mm,column_mm,slab_mm,foundation_mm},
members:[{member:"ชื่อชิ้นส่วน",section:"ขนาด",
  main_bar:{size,quantity,As_provided_cm2,As_required_cm2,ratio_percent,arrangement:"การจัดเรียง"},
  stirrup:{size,spacing_mm:{support_zone,mid_span,seismic_zone},first_stirrup_mm:"ระยะตัวแรกจากหน้าเสา"},
  skin_bar:{needed:true/false,size,spacing_mm},
  development_length:{straight_mm,hook_90_mm,hook_180_mm},
  lap_splice:{class:"A|B",length_mm,location:"ตำแหน่งทาบที่แนะนำ"},
  clear_spacing:{provided_mm,min_required_mm,status},
  max_bar_in_layer,layers_needed,
  special_notes:["ข้อควรระวัง"]}],
detailing_rules:["กฎการจัดเหล็ก"],
common_mistakes:["ข้อผิดพลาดที่พบบ่อย"],
bar_bending_schedule:[{mark,size,shape,length_mm,quantity}]}`)},

    load_path:{ld:lpLd,sLd:setLpLd,r:lpR,sR:setLpR,t:"📊 AI Load Path Tracing",d:"ติดตามแรงจากหลังคาถึงฐานราก ทุก Node",ic:"📊",c:C.teal,
      run:async(c)=>await aiJ(`ติดตาม Load Path จากหลังคาถึงดิน: ${c}
JSON:{load_path_description:"อธิบายเส้นทางแรง",
levels:[{level:"หลังคา|ชั้น2|ชั้น1|ฐานราก",
  elements:[{element:"ชื่อชิ้นส่วน",tributary_area_sqm,
    loads:{dead_ton,live_ton,total_ton},
    accumulated_ton:"แรงสะสมจากชั้นบน",
    transfer_to:"ถ่ายไปที่ไหน"}]}],
critical_load_path:{path:["ลำดับชิ้นส่วน"],total_load_ton,bottleneck:"จุดคอขวด"},
load_distribution:{interior_column_ton,exterior_column_ton,corner_column_ton},
soil_pressure:{max_ksc,allowable_ksc,safety_factor,status},
redundancy_check:{has_alternate_path:true/false,redundancy_ratio,note},
recommendations:[]}`)},

    retrofit:{ld:retLd,sLd:setRetLd,r:retR,sR:setRetR,t:"🏗️ AI Retrofit & Strengthening",d:"เสริมกำลัง FRP, Steel Jacket, Carbon Fiber",ic:"🏗️",c:C.rose,
      run:async(c)=>await aiJ(`สมมติต้องเสริมกำลังโครงสร้างนี้เพิ่ม 30%: ${c}
JSON:{scenario:"สาเหตุที่ต้องเสริมกำลัง",target_increase_percent:30,
members:[{member:"ชิ้นส่วน",current_capacity_ton,required_capacity_ton,deficit_percent,
  techniques:[{technique:"FRP Wrap|Steel Plate Bonding|Steel Jacketing|Section Enlargement|External Prestressing|Carbon Fiber",
    capacity_gain_ton,cost_estimate_baht,duration_days,
    pros:[],cons:[],
    specification:"รายละเอียดวัสดุและขั้นตอน"}],
  recommended_technique,reason}],
foundation_upgrade:{needed:true/false,method,cost_estimate},
total_cost_estimate,
construction_sequence:["ลำดับงาน"],
monitoring:{instruments:["เครื่องมือวัด"],frequency:"ความถี่",duration:"ระยะเวลา"},
standards:["มาตรฐานอ้างอิง"],
warnings:[]}`)},

    value_eng:{ld:veLd,sLd:setVeLd,r:veR,sR:setVeR,t:"🎯 AI Value Engineering",d:"ทดแทนวัสดุ เปลี่ยนระบบ ลดต้นทุนฉลาด",ic:"🎯",c:C.lime,
      run:async(c)=>await aiJ(`Value Engineering Analysis (SAVE International): ${c}
JSON:{current_design:{cost_baht,performance_score:0-100},
proposals:[{id,title:"ชื่อข้อเสนอ",category:"material|system|method|design",
  description:"รายละเอียด",
  original_value:"ค่าเดิม",proposed_value:"ค่าที่เสนอ",
  cost_saving_baht,cost_saving_percent,
  performance_impact:"better|same|slightly_lower",
  risk_level:"low|medium|high",
  implementation:"วิธีดำเนินการ",
  approval_needed:"ต้องขออนุมัติจากใคร"}],
total_saving_baht,total_saving_percent,
prioritized_actions:["เรียงลำดับสิ่งที่ควรทำก่อน"],
function_analysis:{primary_functions:["หน้าที่หลัก"],secondary_functions:["หน้าที่รอง"],unnecessary_costs:["ต้นทุนที่ไม่จำเป็น"]},
risk_assessment:"ความเสี่ยงโดยรวมของการเปลี่ยนแปลง",
summary}`)},

    material_test:{ld:mtLd,sLd:setMtLd,r:mtR,sR:setMtR,t:"🧪 AI Material Testing Plan",d:"แผนทดสอบวัสดุ ตัวอย่าง เกณฑ์ผ่าน",ic:"🧪",c:C.indigo,
      run:async(c)=>await aiJ(`วางแผนทดสอบวัสดุ: ${c}
JSON:{project_info:"ข้อมูลโครงการ",
test_plan:[{material:"คอนกรีต|เหล็ก|ดิน|เสาเข็ม|เชื่อม",
  tests:[{test_name:"ชื่อทดสอบ",standard:"มาตรฐาน ASTM/TIS",
    purpose:"วัตถุประสงค์",
    frequency_required:"ความถี่ เช่น ทุก 50m³",
    min_samples:"จำนวนตัวอย่างขั้นต่ำ",
    sample_preparation:"การเตรียมตัวอย่าง",
    acceptance_criteria:"เกณฑ์ยอมรับ",
    failure_action:"ทำอย่างไรถ้าไม่ผ่าน",
    estimated_cost_per_test:"ราคาต่อครั้ง",
    lab_turnaround_days:"ระยะเวลารอผล"}]}],
quality_milestones:[{milestone,tests_required:[],hold_point:true/false}],
total_testing_budget_estimate,
third_party_requirements:"ข้อกำหนดห้องปฏิบัติการ",
documentation:["เอกสารที่ต้องจัดเตรียม"],
common_failures:["ปัญหาที่พบบ่อยในการทดสอบ"]}`)},

    multi_hazard:{ld:mhLd,sLd:setMhLd,r:mhR,sR:setMhR,t:"🌊 AI Multi-Hazard Assessment",d:"แผ่นดินไหว+ลม+น้ำท่วม+ไฟ รวมกัน",ic:"🌊",c:C.cy,
      run:async(c)=>await aiJ(`Multi-Hazard Assessment (แผ่นดินไหว+ลม+น้ำท่วม+ไฟ): ${c}
สมมติอาคารอยู่กรุงเทพฯ วิเคราะห์ทุกภัยพิบัติ:
JSON:{location:"กรุงเทพมหานคร",
hazards:[{hazard_type:"earthquake|wind|flood|fire|settlement",
  return_period_yr:"คาบการเกิดซ้ำ",probability:"ความน่าจะเป็นตลอดอายุ 50 ปี",
  design_load_description:"แรงออกแบบ",design_load_value:"ค่า",
  current_capacity:"กำลังโครงสร้างปัจจุบัน",
  demand_capacity_ratio,status:"safe|marginal|unsafe",
  governing_standard:"มาตรฐานที่ใช้",
  critical_members:["ชิ้นส่วนวิกฤต"]}],
load_combinations:[{combination:"สูตรรวมแรง",total_demand,capacity,safety_factor,controlling:true/false}],
governing_hazard:"ภัยที่ควบคุมการออกแบบ",
resilience_score:0-100,
vulnerability_matrix:{structural:"low|medium|high",non_structural:"low|medium|high",contents:"low|medium|high"},
mitigation_measures:[{hazard,measure,cost_estimate,effectiveness}],
insurance_recommendation:"คำแนะนำประกันภัย",
climate_change_impact:"ผลกระทบการเปลี่ยนแปลงสภาพอากาศ",
summary}`)}
  };

  // Generic runner
  const runFeature=async(key)=>{const f=features[key];if(!results||f.ld)return;f.sLd(true);f.sR(null);f.sR(await f.run(cx()));f.sLd(false);};

  // ═══════════════════════════════════════════════════════════════
  // NAV
  // ═══════════════════════════════════════════════════════════════
  const nav=[
    {id:"calc",ic:"📐",l:"คำนวณ",g:"core"},
    {id:"nlp",ic:"💬",l:"พิมพ์ไทย",g:"input",ai:1},
    {id:"reader",ic:"📷",l:"อ่านแบบ",g:"input",ai:1},
    {id:"chat",ic:"🤖",l:"Advisor",g:"consult",ai:1},
    {id:"compliance",ic:"✅",l:"มาตรฐาน",g:"check",ai:1},
    {id:"compare",ic:"⚖️",l:"เปรียบเทียบ",g:"check",ai:1},
    {id:"fea",ic:"🔬",l:"FEA",g:"analysis",ai:1},
    {id:"progressive",ic:"🏚️",l:"Collapse",g:"analysis",ai:1},
    {id:"wind_pro",ic:"🌪️",l:"ลม Pro",g:"analysis",ai:1},
    {id:"seismic",ic:"🌋",l:"แผ่นดินไหว",g:"analysis",ai:1},
    {id:"multi_hazard",ic:"🌊",l:"Multi-Hazard",g:"analysis",ai:1},
    {id:"fire",ic:"🔥",l:"ทนไฟ",g:"analysis",ai:1},
    {id:"connection",ic:"🔩",l:"จุดต่อ",g:"design",ai:1},
    {id:"rebar_detail",ic:"💪",l:"เหล็กเสริม",g:"design",ai:1},
    {id:"load_path",ic:"📊",l:"Load Path",g:"design",ai:1},
    {id:"optimize",ic:"💎",l:"Optimize",g:"plan",ai:1},
    {id:"value_eng",ic:"🎯",l:"VE",g:"plan",ai:1},
    {id:"retrofit",ic:"🏗️",l:"เสริมกำลัง",g:"plan",ai:1},
    {id:"sequence",ic:"📅",l:"แผนสร้าง",g:"plan",ai:1},
    {id:"etabs",ic:"🖥️",l:"ETABS",g:"output",ai:1},
    {id:"qc",ic:"📋",l:"QC",g:"output",ai:1},
    {id:"material_test",ic:"🧪",l:"ทดสอบ",g:"output",ai:1},
    {id:"costdetail",ic:"💰",l:"ต้นทุน",g:"output",ai:1},
    {id:"risk",ic:"🛡️",l:"ความเสี่ยง",g:"output",ai:1},
    {id:"presentation",ic:"🎤",l:"Present",g:"output",ai:1},
  ];

  const groups={core:"หลัก",input:"Input AI",consult:"ปรึกษา",check:"ตรวจสอบ",analysis:"วิเคราะห์ขั้นสูง",design:"ออกแบบละเอียด",plan:"วางแผน",output:"Output"};
  const needR=Object.keys(features);

  return(
    <div style={{minHeight:"100vh",background:C.bg,color:C.t,fontFamily:F}}>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600;700&family=Orbitron:wght@700;900&display=swap" rel="stylesheet"/>
      <style>{`input:focus,select:focus{border-color:${C.a}!important}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:${C.bd};border-radius:2px}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}@keyframes fi{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}.fi{animation:fi .25s ease-out}`}</style>

      {/* HEADER */}
      <div style={{background:`linear-gradient(135deg,${C.s1},${C.s2})`,borderBottom:`2px solid ${C.a}`,padding:"8px 12px"}}>
        <div style={{maxWidth:980,margin:"0 auto",display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
          <span style={{fontFamily:"'Orbitron'",fontSize:17,fontWeight:900,color:C.a,letterSpacing:2}}>RABBiZ</span>
          <span style={{fontSize:9,color:C.d,letterSpacing:2}}>STRUCTURAL MEGA</span>
          <span style={{padding:"2px 7px",borderRadius:10,background:`${C.ok}15`,color:C.ok,fontSize:8,fontWeight:700}}>25 AI</span>
          <span style={{padding:"2px 7px",borderRadius:10,background:`${C.fire}15`,color:C.fire,fontSize:8,fontWeight:700}}>v4.0</span>
        </div>
      </div>

      {/* NAV — grouped */}
      <div style={{background:C.s1,borderBottom:`1px solid ${C.bd}`,overflowX:"auto",padding:"4px 12px"}}>
        <div style={{display:"flex",gap:1,maxWidth:980,margin:"0 auto",flexWrap:"nowrap"}}>
          {nav.map(n=>(
            <button key={n.id} onClick={()=>setPage(n.id)} style={{
              padding:"5px 7px",borderRadius:5,border:"none",cursor:"pointer",fontSize:10,fontWeight:page===n.id?700:500,fontFamily:F,
              background:page===n.id?`${C.a}15`:"transparent",color:page===n.id?C.a:C.d,
              display:"inline-flex",alignItems:"center",gap:2,whiteSpace:"nowrap",position:"relative",flexShrink:0,
            }}>
              <span style={{fontSize:11}}>{n.ic}</span><span>{n.l}</span>
              {n.ai&&<span style={{width:3,height:3,borderRadius:"50%",background:C.a,position:"absolute",top:2,right:2}}/>}
            </button>
          ))}
        </div>
      </div>

      <div style={{maxWidth:980,margin:"0 auto",padding:"12px 10px"}}>

        {/* ═══ CALC ═══ */}
        {page==="calc"&&<>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:5,marginBottom:12}}>
            {BT.map(b=><button key={b.id} onClick={()=>chgType(b.id)} style={{padding:"8px",background:type===b.id?`${C.a}0d`:C.s1,border:`2px solid ${type===b.id?C.a:C.bd}`,borderRadius:7,cursor:"pointer",textAlign:"left"}}>
              <div style={{fontSize:18}}>{b.ic}</div><div style={{fontSize:11,fontWeight:700,color:type===b.id?C.a:C.t}}>{b.l}</div></button>)}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:8,marginBottom:12}}>
            <Crd t="ขนาด" ic="📏" c={C.b} ch={<><Inp l="กว้าง" u="m" v={width} set={setW} mn={4} mx={50}/><Inp l="ยาว" u="m" v={length} set={setL} mn={4} mx={100}/><Inp l="สูง" u="m" v={eaveH} set={setH} mn={2.5} mx={20}/>{is2&&<Inp l="สูงชั้น2" u="m" v={floorH2} set={setH2} mn={2.5} mx={5}/>}<Inp l="ลาดหลังคา" u="°" v={slope} set={setSl} mn={5} mx={45} st={1}/><Inp l="ระยะเฟรม" u="m" v={spacing} set={setSp} mn={3} mx={9}/></>}/>
            <Crd t="ระบบ" ic="⚙️" c={C.p} ch={<><Sel l="โครงสร้าง" v={struct} set={setSt} opts={[{v:"steel",l:"เหล็ก"},{v:"concrete",l:"คสล."}]}/><Sel l="น้ำหนักจร" v={liveType} set={setLT} opts={Object.entries(LL).map(([k,v])=>({v:k,l:`${k}(${v})`}))}/>{(struct==="concrete"||is2)&&<><Sel l="คอนกรีต" v={conc} set={setConc} opts={Object.keys(CONC).map(k=>({v:k,l:k}))}/><Sel l="เหล็กเสริม" v={rebar} set={setRebar} opts={Object.keys(RB).map(k=>({v:k,l:k}))}/><Inp l="หนาพื้น" u="cm" v={slab} set={setSlab} mn={8} mx={25} st={1}/></>}</>}/>
          </div>
          <div style={{display:"flex",gap:5,marginBottom:14,flexWrap:"wrap"}}>
            <Btn c={C.a} ch="⚡ คำนวณ" onClick={doCalc}/>
            {results&&<><Btn c={C.b} ch={pdfLd?"⏳":"📄 PDF"} onClick={doPDF} dis={pdfLd}/><Btn c={C.ok} ch="✅ ตรวจมาตรฐาน" onClick={()=>{setPage("compliance");runFeature("compliance");}}/></>}
          </div>
          {results&&<div className="fi">
            <div style={{background:C.s2,borderRadius:8,border:`1px solid ${C.a}25`,padding:10,marginBottom:10,display:"flex",flexWrap:"wrap",gap:10,justifyContent:"center"}}>
              {[{l:"ขนาด",v:`${width}×${length}`},{l:"m²",v:results.qty.tArea},{l:"เฟรม",v:results.qty.nF},{l:"เสา",v:results.qty.nC},{l:"฿",v:`${results.cost.totalM}M`}].map((x,i)=>
                <div key={i} style={{textAlign:"center",minWidth:55}}><div style={{fontSize:8,color:C.d}}>{x.l}</div><div style={{fontSize:16,fontWeight:700,color:C.a,fontFamily:M}}>{x.v}</div></div>)}
            </div>
            <div style={{display:"flex",gap:1,marginBottom:10,overflowX:"auto",borderBottom:`1px solid ${C.bd}`}}>
              {[{id:"loads",l:"น้ำหนัก"},{id:"members",l:"ออกแบบ"},{id:"found",l:"ฐานราก"},{id:"boq",l:"BOQ"}].map(t=>
                <button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"6px 10px",border:"none",borderRadius:"5px 5px 0 0",cursor:"pointer",fontSize:10,fontWeight:tab===t.id?700:500,background:tab===t.id?`${C.a}10`:"transparent",color:tab===t.id?C.a:C.d,borderBottom:tab===t.id?`2px solid ${C.a}`:"2px solid transparent",fontFamily:F}}>{t.l}</button>)}
            </div>
            {tab==="loads"&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:8}}>
              <Crd t="หลังคา" ic="🏗️" c={C.b} ch={<><Rw l="DL" v={results.loads.rDL} u="kg/m²"/><Rw l="LL" v={results.loads.rLL} u="kg/m²"/><Rw l="รวม" v={results.loads.rT} u="kg/m²" h/></>}/>
              {results.loads.fDL&&<Crd t="พื้น" ic="▦" c={C.p} ch={<><Rw l="DL" v={results.loads.fDL} u="kg/m²"/><Rw l="LL" v={results.loads.ll} u="kg/m²"/><Rw l="รวม" v={results.loads.fT} u="kg/m²" h/></>}/>}
            </div>}
            {tab==="members"&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:8}}>
              {results.beam&&<Crd t="คานเหล็ก" ic="📐" c={C.a} ch={<><Rw l="หน้าตัด" v={results.beam.n} h/><Rw l="M" v={results.bM} u="t·m"/><Rw l="S" v={`${results.beam.Sp}/${results.beam.Sr}`} u="cm³"/><PF ok={parseFloat(results.beam.Sp)>=parseFloat(results.beam.Sr)} tx="Section Check"/></>}/>}
              {results.col&&<Crd t="เสาเหล็ก" ic="🏛️" c={C.a} ch={<><Rw l="หน้าตัด" v={results.col.n} h/><Rw l="P" v={results.cP} u="t"/><Rw l="KL/r" v={results.col.sl}/><PF ok={results.col.A>=parseFloat(results.col.Ar)} tx="Column Check"/></>}/>}
              {results.rcB&&<Crd t="คาน คสล." ic="📐" c={C.p} ch={<><Rw l="ขนาด" v={`${results.rcB.w}×${results.rcB.d}`} u="cm" h/><Rw l="เหล็ก" v={results.rcB.bar} h/></>}/>}
              {results.rcC&&<Crd t="เสา คสล." ic="🏛️" c={C.p} ch={<><Rw l="ขนาด" v={results.rcC.size} u="cm" h/><Rw l="เหล็ก" v={results.rcC.bar} h/></>}/>}
            </div>}
            {tab==="found"&&<Crd t="ฐานราก" ic="🧱" c={C.a} ch={<><Rw l="ประเภท" v={results.found.type} h/><Rw l="ขนาด" v={results.found.size} u="m" h/><Rw l="ลึก" v={results.found.depth} u="m"/><Rw l="น้ำหนัก" v={results.found.load} u="t"/></>}/>}
            {tab==="boq"&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:8}}>
              <Crd t="ปริมาณ" ic="📊" c={C.ok} ch={<><Rw l="เฟรม" v={results.qty.nF}/><Rw l="เสา" v={results.qty.nC}/>{struct==="steel"&&<Rw l="เหล็ก" v={`${(parseFloat(results.qty.stW)/1000).toFixed(1)}`} u="t" h/>}</>}/>
              <Crd t="ราคา" ic="💰" c={C.a} ch={<><Rw l="m²" v={results.qty.tArea}/><Rw l="อัตรา" v={results.cost.rate.toLocaleString()} u="฿"/><div style={{textAlign:"center",padding:10,background:`${C.a}08`,borderRadius:6,marginTop:5}}><div style={{fontSize:24,fontWeight:700,color:C.a,fontFamily:M}}>฿{results.cost.totalM}M</div></div></>}/>
            </div>}
          </div>}
        </>}

        {/* ═══ NLP ═══ */}
        {page==="nlp"&&<div className="fi">
          <Crd t="💬 พิมพ์ไทย → คำนวณ" ic="🤖" c={C.a} ch={<>
            <textarea value={nlpTx} onChange={e=>setNlpTx(e.target.value)} placeholder="เช่น: โกดังเหล็ก 20x40m สูง8m..." style={{...sI,height:70,resize:"vertical",fontFamily:F,lineHeight:1.5}}/>
            <div style={{display:"flex",gap:4,marginTop:6,flexWrap:"wrap"}}>
              <Btn c={C.a} ch={nlpLd?"⏳":"🚀 วิเคราะห์"} onClick={doNlp} dis={nlpLd}/>
              {["โกดัง 15x30 สูง7m","โชว์รูมรถ 20x40m","อาคาร2ชั้น 12x24"].map((ex,i)=>
                <button key={i} onClick={()=>setNlpTx(ex)} style={{padding:"4px 7px",borderRadius:5,border:`1px solid ${C.bd}`,background:"transparent",color:C.dL,fontSize:9,cursor:"pointer"}}>{ex}</button>)}
            </div></>}/>
          {nlpR&&!nlpR.error&&<Crd t="ผล" ic="✨" c={C.ok} ch={<><div style={{fontSize:11,marginBottom:6,lineHeight:1.6}}>{nlpR.summary}</div><Btn c={C.ok} full ch="✅ ใช้ค่านี้" onClick={()=>applyP(nlpR)}/></>}/>}
        </div>}

        {/* ═══ READER ═══ */}
        {page==="reader"&&<div className="fi">
          <Crd t="📷 AI อ่านแบบ" ic="🤖" c={C.b} ch={<>
            <div style={{border:`2px dashed ${C.bd}`,borderRadius:8,padding:16,textAlign:"center",background:C.bg,position:"relative",marginBottom:8}}>
              <input type="file" accept="image/*,.pdf" onChange={handleFile} style={{position:"absolute",inset:0,opacity:0,cursor:"pointer"}}/>
              {rdPrev?<img src={rdPrev} alt="" style={{maxWidth:"100%",maxHeight:200,borderRadius:6}}/>:<div><div style={{fontSize:26}}>📎</div><div style={{fontSize:11,color:C.dL}}>อัปโหลดรูปแบบ</div></div>}
            </div>
            {rdImg&&<Btn c={C.b} full ch={rdLd?"⏳":"🔍 AI อ่านแบบ"} onClick={doRead} dis={rdLd}/>}</>}/>
          {rdR&&!rdR.error&&<Crd t="ผล" ic="✨" c={C.ok} ch={<><div style={{fontSize:11,marginBottom:6}}>{rdR.summary}</div><Btn c={C.ok} full ch="✅ ใช้ค่านี้" onClick={()=>applyP(rdR)}/></>}/>}
        </div>}

        {/* ═══ CHAT ═══ */}
        {page==="chat"&&<div className="fi" style={{display:"flex",flexDirection:"column",height:"calc(100vh - 120px)"}}>
          <div style={{fontSize:10,color:C.d,padding:"4px 8px",background:C.s1,borderRadius:5,marginBottom:5}}>🤖 AI Advisor {results&&<span style={{color:C.ok,fontSize:8}}>● มีข้อมูล</span>}</div>
          <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:6,padding:"4px 0"}}>
            {chatMsgs.length===0&&<div style={{textAlign:"center",padding:24,color:C.d}}>
              <div style={{fontSize:28}}>🤖</div><div style={{fontSize:12,fontWeight:600,marginTop:6}}>AI ที่ปรึกษาโครงสร้าง</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:3,justifyContent:"center",marginTop:10}}>
                {["span 20m ใช้เหล็กอะไร?","Load Combo มยผ.","Steel vs RC?","ดินอ่อนฐานรากอะไร?","Progressive Collapse คืออะไร?","FRP เสริมกำลังได้แค่ไหน?"].map((q,i)=>
                  <button key={i} onClick={()=>setCI(q)} style={{padding:"4px 7px",borderRadius:5,border:`1px solid ${C.bd}`,background:C.s1,color:C.dL,fontSize:9,cursor:"pointer"}}>{q}</button>)}
              </div>
            </div>}
            {chatMsgs.map((m,i)=><div key={i} style={{alignSelf:m.role==="user"?"flex-end":"flex-start",maxWidth:"85%",padding:"7px 10px",borderRadius:8,background:m.role==="user"?`${C.a}10`:C.s2,border:`1px solid ${m.role==="user"?C.a+"20":C.bd}`,fontSize:11,lineHeight:1.7,whiteSpace:"pre-wrap"}}>{m.role==="assistant"&&<div style={{fontSize:8,color:C.a,fontWeight:700,marginBottom:2}}>🤖 AI</div>}{m.content}</div>)}
            {chatLd&&<div style={{padding:8,background:C.s2,borderRadius:8,border:`1px solid ${C.bd}`}}><span style={{color:C.a,animation:"pulse 1.2s infinite",fontSize:11}}>🤖 กำลังคิด...</span></div>}
            <div ref={chatE}/>
          </div>
          <div style={{display:"flex",gap:5,paddingTop:6,borderTop:`1px solid ${C.bd}`}}>
            <input value={chatIn} onChange={e=>setCI(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendChat()} placeholder="ถาม..." style={{...sI,flex:1,fontFamily:F}}/>
            <Btn c={C.a} ch="ส่ง" onClick={sendChat} dis={chatLd}/>
          </div>
        </div>}

        {/* ═══ COMPLIANCE with special render ═══ */}
        {page==="compliance"&&<div className="fi">
          {!results?<Crd t="✅ ตรวจมาตรฐาน" ic="📋" c={C.ok} ch={<div style={{textAlign:"center",padding:16,color:C.d}}><div style={{fontSize:26}}>📐</div><div style={{fontSize:11,marginTop:6}}>คำนวณก่อน</div><Btn c={C.a} ch="→ คำนวณ" onClick={()=>setPage("calc")}/></div>}/>:
          compLd?<Ld t="ตรวจมาตรฐาน..."/>:
          !compR?<Crd t="✅ ตรวจ มยผ./วสท." ic="📋" c={C.ok} ch={<Btn c={C.ok} full ch="🔍 เริ่มตรวจ" onClick={()=>runFeature("compliance")}/>}/>:
          compR.error?<AIR data={compR}/>:
          <div className="fi">
            <div style={{display:"flex",gap:8,marginBottom:10,flexWrap:"wrap"}}>
              <div style={{flex:"0 0 110px",textAlign:"center",padding:14,background:C.s1,borderRadius:8,border:`1px solid ${C.bd}`}}>
                <div style={{fontSize:36,fontWeight:900,fontFamily:"'Orbitron'",color:compR.score>=80?C.ok:compR.score>=60?C.w:C.e}}>{compR.score}</div>
                <div style={{fontSize:18,fontWeight:700,color:compR.grade<="B"?C.ok:compR.grade==="C"?C.w:C.e}}>เกรด {compR.grade}</div>
              </div>
              <div style={{flex:1,minWidth:180}}>
                {compR.critical?.length>0&&<Crd t="⚠️ วิกฤต" ic="🚨" c={C.e} ch={compR.critical.map((c,i)=><div key={i} style={{fontSize:10,color:C.e,padding:"2px 0"}}>• {c}</div>)}/>}
                {compR.recommendations?.length>0&&<Crd t="แนะนำ" ic="💡" c={C.a} ch={compR.recommendations.map((r,i)=><div key={i} style={{fontSize:10,color:C.dL,padding:"2px 0"}}>• {r}</div>)}/>}
              </div>
            </div>
            <Crd t="รายการ" ic="📋" c={C.b} ch={compR.checks?.map((ch,i)=>
              <div key={i} style={{display:"flex",gap:6,padding:"5px 0",borderBottom:`1px solid ${C.bd}10`}}>
                <span style={{fontSize:12}}>{ch.status==="pass"?"✅":ch.status==="warn"?"⚠️":"❌"}</span>
                <div><div style={{fontSize:11,fontWeight:600}}>{ch.item}</div><div style={{fontSize:9,color:C.d}}>{ch.standard}</div><div style={{fontSize:10,color:ch.status==="pass"?C.ok:ch.status==="warn"?C.w:C.e}}>{ch.detail}</div></div>
              </div>)}/>
          </div>}
        </div>}

        {/* ═══ ALL OTHER AI FEATURES (generic renderer) ═══ */}
        {Object.entries(features).filter(([k])=>k!=="compliance").map(([key,f])=>(
          page===key&&<div key={key} className="fi">
            {!results?<Crd t={f.t} ic={f.ic} c={f.c} ch={<div style={{textAlign:"center",padding:16,color:C.d}}>
              <div style={{fontSize:26}}>📐</div><div style={{fontSize:11,marginTop:6}}>คำนวณก่อน แล้วกลับมาใช้ฟีเจอร์นี้</div>
              <div style={{marginTop:6}}><Btn c={C.a} ch="→ ไปคำนวณ" onClick={()=>setPage("calc")}/></div></div>}/>:
            f.ld?<Ld t={`${f.t}...`}/>:
            !f.r?<Crd t={f.t} ic={f.ic} c={f.c} ch={<><div style={{fontSize:11,color:C.d,marginBottom:8,lineHeight:1.6}}>{f.d}</div><Btn c={f.c} full ch={`🚀 เริ่ม`} onClick={()=>runFeature(key)}/></>}/>:
            <div className="fi"><Crd t={f.t} ic="✨" c={C.ok} ch={<AIR data={f.r}/>}/><div style={{marginTop:4}}><Btn c={f.c} ch="🔄 ใหม่" onClick={()=>runFeature(key)}/></div></div>}
          </div>
        ))}

        <div style={{marginTop:16,padding:8,borderRadius:5,background:C.eB,fontSize:9,color:C.d,lineHeight:1.4}}>
          <span style={{color:C.e,fontWeight:700}}>⚠️</span> Preliminary Design — ต้องตรวจสอบโดย กว. ตาม มยผ.1301/1302/1311 วสท. ACI318 AISC360
        </div>
      </div>
    </div>
  );
}
