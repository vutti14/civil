# 🏗️ RABBiZ Structural MEGA

> ระบบคำนวณโครงสร้างอาคารอัจฉริยะ — 25 AI Features + Light/Dark Mode สำหรับวิศวกรโยธา

![Version](https://img.shields.io/badge/version-5.0.0-gold)
![AI Features](https://img.shields.io/badge/AI%20Features-25-green)
![Theme](https://img.shields.io/badge/Theme-Light%20%2F%20Dark-blueviolet)
![Standard](https://img.shields.io/badge/มาตรฐาน-มยผ.%2F%20วสท.-blue)

## ✨ What's New in v5.0

- 🌗 **Light / Dark Mode** — สลับธีมได้ตามต้องการ (Auto-detect ระบบ)
- 📱 **Sidebar Navigation** — เมนูจัดกลุ่ม 6 หมวด ย่อ/ขยายได้
- 🎨 **Complete UI Redesign** — Warm earth-tone (Light) / Deep navy (Dark)
- 🔤 **Sarabun + Outfit Fonts** — อ่านง่ายทั้งไทยและอังกฤษ
- 🐛 **17 Bug Fixes** — Error handling, null safety, UX improvements

## 📐 Core Calculator

- คำนวณโครงสร้างอาคาร 4 ประเภท: โกดัง, โชว์รูม, อาคาร 1 ชั้น, อาคาร 2 ชั้น
- รองรับทั้งโครงสร้างเหล็ก (Steel) และคอนกรีตเสริมเหล็ก (RC)
- คำนวณ น้ำหนักบรรทุก, คาน, เสา, พื้น, ฐานราก, BOQ, ราคา

## 🤖 25 AI-Powered Features

| # | Feature | Description |
|---|---------|-------------|
| 1 | 📐 **คำนวณโครงสร้าง** | เครื่องคำนวณหลักครบวงจร |
| 2 | 💬 **พิมพ์ไทย → คำนวณ** | AI แปลงภาษาไทยเป็น parameters อัตโนมัติ |
| 3 | 📷 **AI อ่านแบบ** | อัปโหลดรูปแบบก่อสร้าง → Vision AI อ่านขนาด |
| 4 | 🤖 **AI Advisor** | แชทถาม-ตอบกับ AI วิศวกรโครงสร้าง |
| 5 | ✅ **ตรวจมาตรฐาน** | AI ตรวจสอบตาม มยผ./วสท. ให้คะแนน A-F |
| 6 | ⚖️ **AI เปรียบเทียบ** | Steel vs RC vs Hybrid — แนะนำตัวเลือกที่ดีสุด |
| 7 | 🛡️ **วิเคราะห์ความเสี่ยง** | Failure Mode Analysis + วิธีป้องกัน |
| 8 | 🔬 **AI FEA** | Simplified Finite Element — Stress, Deflection, Utilization |
| 9 | 🏚️ **Progressive Collapse** | GSA Alternate Path — ถอดเสา วิเคราะห์พังลุกลาม |
| 10 | 🌪️ **AI Wind Pro** | มยผ.1311 — Cp ทุกด้าน, Cladding Design |
| 11 | 🌋 **AI แผ่นดินไหว** | ประเมินตาม มยผ.1302 + Base Shear |
| 12 | 🌊 **AI Multi-Hazard** | แผ่นดินไหว+ลม+น้ำท่วม+ไฟ รวมวิเคราะห์ |
| 13 | 🔥 **AI Fire Resistance** | อัตราทนไฟ, Cover, Protection ตาม Eurocode |
| 14 | 🔩 **AI จุดต่อ** | ออกแบบ Bolt/Weld Connection ตาม AISC |
| 15 | 💪 **AI Rebar Detailing** | เหล็กเสริมละเอียด — ทาบ, งอ, ระยะห่าง ACI318 |
| 16 | 📊 **AI Load Path** | ติดตามแรงจากหลังคาถึงฐานรากทุก Node |
| 17 | 💎 **AI Optimize** | ลดต้นทุนโครงสร้างโดยไม่ลดคุณภาพ |
| 18 | 🎯 **AI Value Engineering** | ทดแทนวัสดุ เปลี่ยนระบบ ลดต้นทุนฉลาด |
| 19 | 🏗️ **AI Retrofit** | เสริมกำลัง FRP, Steel Jacket, Carbon Fiber |
| 20 | 📅 **AI แผนก่อสร้าง** | วาง Phase, คน, เครื่องจักร, Critical Path |
| 21 | 🖥️ **AI ETABS Input** | สร้างข้อมูลสำหรับโปรแกรมวิเคราะห์โครงสร้าง |
| 22 | 📋 **AI QC Checklist** | รายการตรวจสอบงานก่อสร้าง + Hold Points |
| 23 | 🧪 **AI Material Testing** | แผนทดสอบวัสดุ ตัวอย่าง เกณฑ์ ASTM/TIS |
| 24 | 💰 **AI ต้นทุนละเอียด** | แยกต้นทุนรายหมวด + แนะนำประหยัด |
| 25 | 🎤 **AI Presentation** | เนื้อหานำเสนอลูกค้า + FAQ |

## 🚀 Quick Start

```bash
git clone https://github.com/vutti14/civil.git
cd civil
npm install
npm run dev
```

เปิด http://localhost:3000

## 🏗️ Tech Stack

- **Frontend**: React 18 + Vite
- **AI Engine**: Claude API (Anthropic)
- **Design Standard**: มยผ.1301, 1302, 1311 / วสท. / ACI / AISC
- **Styling**: CSS-in-JS (No external CSS framework)
- **Fonts**: Sarabun + Outfit + JetBrains Mono

## 🌗 Theme System

| Light Mode | Dark Mode |
|------------|-----------|
| Warm earth-tone palette | Deep navy palette |
| `#f5f3ee` background | `#0c0e14` background |
| `#c8960c` accent | `#f5c842` accent |
| Auto-detect OS preference | Toggle ☀️/🌙 in sidebar |

## 📐 Engineering Standards

- **มยผ.1301-54** — มาตรฐานการคำนวณแรงลมและการตอบสนองของอาคาร
- **มยผ.1302-52** — มาตรฐานการออกแบบอาคารต้านทานการสั่นสะเทือนของแผ่นดินไหว
- **มยผ.1311-50** — มาตรฐานการคำนวณแรงลม
- **วสท.** — มาตรฐานสำหรับอาคารคอนกรีตเสริมเหล็ก
- **ACI 318-19** — Building Code Requirements for Structural Concrete
- **AISC 360-16** — Specification for Structural Steel Buildings
- **Eurocode** — Fire Resistance Design
- **GSA** — Progressive Collapse Guidelines

## 📋 Changelog

### v5.0.0 — UI Redesign + Bug Fixes
- 🌗 Light / Dark Mode (auto-detect)
- 📱 Sidebar navigation with 6 grouped categories
- 🎨 Complete UI redesign with Sarabun + Outfit fonts
- 🐛 17 bug fixes (error handling, null safety, UX)

### v4.0.0 — 25 AI Features
- 🔬 FEA, Progressive Collapse, Wind Pro, Fire Resistance
- 💪 Rebar Detailing, Load Path, Retrofit, Value Engineering
- 🧪 Material Testing, Multi-Hazard Assessment

### v3.0.0 — 15 AI Features
- Initial release with core calculator + 15 AI features

## ⚠️ Disclaimer

ผลลัพธ์เป็นการคำนวณเบื้องต้น (Preliminary Design) เท่านั้น
ต้องได้รับการตรวจสอบและรับรองโดยวิศวกรโยธาที่ได้รับใบอนุญาต (กว.)

## 📜 License

© 2025 RABBiZ Group. All rights reserved.

---

**Built with ❤️ by RABBiZ Engineering Team**
