# 🏗️ RABBiZ Structural ULTRA

> ระบบคำนวณโครงสร้างอาคารอัจฉริยะ — 15 AI Features สำหรับวิศวกรโยธา

![Version](https://img.shields.io/badge/version-3.0.0-gold)
![AI Features](https://img.shields.io/badge/AI%20Features-15-green)
![Standard](https://img.shields.io/badge/มาตรฐาน-มยผ.%2F%20วสท.-blue)

## ✨ Features

### 📐 Core Calculator
- คำนวณโครงสร้างอาคาร 4 ประเภท: โกดัง, โชว์รูม, อาคาร 1 ชั้น, อาคาร 2 ชั้น
- รองรับทั้งโครงสร้างเหล็ก (Steel) และคอนกรีตเสริมเหล็ก (RC)
- คำนวณ น้ำหนักบรรทุก, คาน, เสา, พื้น, ฐานราก, BOQ, ราคา

### 🤖 15 AI-Powered Features

| # | Feature | Description |
|---|---------|-------------|
| 1 | 📐 **คำนวณโครงสร้าง** | เครื่องคำนวณหลักครบวงจร |
| 2 | 💬 **พิมพ์ไทย → คำนวณ** | AI แปลงภาษาไทยเป็น parameters อัตโนมัติ |
| 3 | 📷 **AI อ่านแบบ** | อัปโหลดรูปแบบก่อสร้าง → Vision AI อ่านขนาด |
| 4 | 🤖 **AI Advisor** | แชทถาม-ตอบกับ AI วิศวกรโครงสร้าง |
| 5 | ✅ **ตรวจมาตรฐาน** | AI ตรวจสอบตาม มยผ./วสท. ให้คะแนน A-F |
| 6 | ⚖️ **AI เปรียบเทียบ** | Steel vs RC vs Hybrid — แนะนำตัวเลือกที่ดีสุด |
| 7 | 🛡️ **AI วิเคราะห์ความเสี่ยง** | Failure Mode Analysis + วิธีป้องกัน |
| 8 | 💎 **AI Optimize** | ลดต้นทุนโครงสร้างโดยไม่ลดคุณภาพ |
| 9 | 📅 **AI แผนก่อสร้าง** | วาง Phase, คน, เครื่องจักร, Critical Path |
| 10 | 🌋 **AI แผ่นดินไหว** | ประเมินตาม มยผ.1302 + Base Shear |
| 11 | 🔩 **AI จุดต่อ** | ออกแบบ Bolt/Weld Connection ตาม AISC |
| 12 | 🖥️ **AI ETABS Input** | สร้างข้อมูลสำหรับโปรแกรมวิเคราะห์โครงสร้าง |
| 13 | 📋 **AI QC Checklist** | รายการตรวจสอบงานก่อสร้าง + Hold Points |
| 14 | 💰 **AI ต้นทุนละเอียด** | แยกต้นทุนรายหมวด + แนะนำประหยัด |
| 15 | 🎤 **AI Presentation** | เนื้อหานำเสนอลูกค้า + FAQ |

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/vutti14/civil.git
cd civil

# Install dependencies
npm install

# Run dev server
npm run dev
```

เปิด http://localhost:3000

## 🏗️ Tech Stack

- **Frontend**: React 18 + Vite
- **AI Engine**: Claude API (Anthropic)
- **Design Standard**: มยผ.1301, 1302, 1311 / วสท. / ACI / AISC
- **Styling**: CSS-in-JS (No external CSS framework)

## 📁 Project Structure

```
civil/
├── index.html          # Entry HTML
├── package.json        # Dependencies
├── vite.config.js      # Vite config
├── public/
│   └── favicon.svg     # App icon
├── src/
│   ├── main.jsx        # React entry
│   └── App.jsx         # Main application (15 AI features)
└── README.md
```

## 📐 Engineering Standards

- **มยผ.1301-54** — มาตรฐานการคำนวณแรงลมและการตอบสนองของอาคาร
- **มยผ.1302-52** — มาตรฐานการออกแบบอาคารต้านทานการสั่นสะเทือนของแผ่นดินไหว
- **มยผ.1311-50** — มาตรฐานการคำนวณแรงลม
- **วสท.** — มาตรฐานสำหรับอาคารคอนกรีตเสริมเหล็ก
- **ACI 318** — Building Code Requirements for Structural Concrete
- **AISC 360** — Specification for Structural Steel Buildings

## ⚠️ Disclaimer

ผลลัพธ์เป็นการคำนวณเบื้องต้น (Preliminary Design) เท่านั้น
ต้องได้รับการตรวจสอบและรับรองโดยวิศวกรโยธาที่ได้รับใบอนุญาต (กว.)

## 📜 License

© 2025 RABBiZ Group. All rights reserved.

---

**Built with ❤️ by RABBiZ Engineering Team**
