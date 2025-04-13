# Lamphun Budget Vision

ระบบแสดงข้อมูลงบประมาณและการดำเนินงานขององค์การบริหารส่วนจังหวัดลำพูน

## วัตถุประสงค์

- แสดงข้อมูลงบประมาณและการดำเนินงานของโครงการต่างๆ ในจังหวัดลำพูน
- นำเสนอข้อมูลในรูปแบบที่เข้าใจง่ายและเข้าถึงได้
- สร้างความโปร่งใสในการบริหารจัดการงบประมาณ

## คุณสมบัติหลัก

- แสดงข้อมูลงบประมาณและการดำเนินงานในรูปแบบตาราง
- แสดงตำแหน่งที่ตั้งโครงการบนแผนที่
- แสดงสถานะการดำเนินงานของแต่ละโครงการ
- รองรับการแสดงผลบนอุปกรณ์มือถือ
- อัปเดตข้อมูลแบบ real-time จาก API

## การติดตั้งและใช้งาน

### ข้อกำหนดเบื้องต้น

- Node.js 20.0.0 หรือสูงกว่า
- npm 9.0.0 หรือสูงกว่า

### ขั้นตอนการติดตั้ง

1. โคลนโปรเจค:
```bash
git clone https://github.com/your-username/lamphun-budget-vision.git
cd lamphun-budget-vision
```

2. ติดตั้ง dependencies:
```bash
npm install
```

3. เริ่มต้นเซิร์ฟเวอร์สำหรับพัฒนา:
```bash
npm run dev
```

4. สร้าง build สำหรับ production:
```bash
npm run build
```

## โครงสร้างโปรเจค

```
lamphun-budget-vision/
├── public/                 # ไฟล์สาธารณะ
│   └── 20250121-lpao-budgeting.json  # ข้อมูลงบประมาณ
├── src/
│   ├── components/         # React components
│   │   ├── layout/        # องค์ประกอบเลย์เอาต์
│   │   ├── map/           # องค์ประกอบแผนที่
│   │   └── projects/      # องค์ประกอบเกี่ยวกับโครงการ
│   ├── pages/             # หน้าต่างๆ
│   ├── App.tsx            # องค์ประกอบหลัก
│   └── main.tsx           # จุดเริ่มต้นแอปพลิเคชัน
└── package.json           # ข้อมูลโปรเจคและ dependencies
```

## เทคโนโลยีที่ใช้

- **Frontend Framework**: React 18
- **Language**: TypeScript
- **Styling**: 
  - Tailwind CSS
  - shadcn/ui components
- **Map Library**: MapLibre GL JS
- **Build Tool**: Vite
- **State Management**: React Hooks
- **Routing**: React Router

## การพัฒนาต่อ

1. Fork โปรเจค
2. สร้าง branch สำหรับ feature ใหม่ (`git checkout -b feature/AmazingFeature`)
3. Commit การเปลี่ยนแปลง (`git commit -m 'Add some AmazingFeature'`)
4. Push ไปยัง branch (`git push origin feature/AmazingFeature`)
5. เปิด Pull Request

## การสนับสนุน

หากพบปัญหาในการใช้งานหรือต้องการเสนอแนะการปรับปรุง สามารถเปิด issue ได้ที่ GitHub repository

## สัญญาอนุญาต

Public Domain - อนุญาตให้ใช้ ดัดแปลง และเผยแพร่ได้โดยไม่ต้องขออนุญาต
