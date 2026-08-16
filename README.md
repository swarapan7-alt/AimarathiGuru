# AI MARATHI GURU (aimarathi.swaraudyog.com)

Production-Ready Marathi EdTech Web Application for **AI Marathi Guru** - Live 2-Hour AI Workshop & Training Registration System.

## 🚀 Key Features

1. **Public Conversion Landing Page**
   - High-conversion Marathi layout styled with **Noto Sans Devanagari** and **Poppins**
   - Interactive Module Curriculum (ChatGPT, Google Gemini, Jio AI, Instagram, AI Poster, AI Video Creation, Business AI)
   - Live AI Assistant Chatbot powered by Google Gemini API
   - Student Registration Status Lookup modal

2. **Student Registration Form**
   - **District**: Freeform Text Input with placeholder `"आपला District लिहा"` (e.g. Sangli, Pune, Solapur)
   - **Occupation**: Freeform Text Input with placeholder `"आपला व्यवसाय / Occupation लिहा"` (e.g. Business Owner, Student, CSC Operator)
   - **Dynamic Date & Slot Selection**: Slot 1 (11 AM – 1 PM) and Slot 2 (7 PM – 9 PM) with live available seats count and `SLOT FULL` handling

3. **Razorpay Payment Integration**
   - Dynamic ₹199 Razorpay checkout modal
   - Server-side concurrency capacity locks to prevent overbooking
   - Automated registration record creation on payment success
   - Success Modal displaying Registration ID (`AMG-2026-XXXXX`), student details, course date, slot, and direct **JOIN AI MARATHI GURU WHATSAPP COMMUNITY** button

4. **Complete Admin Panel (`/admin/login` & `/admin/dashboard`)**
   - **Super Admin Credentials**: Username: `admin` | Password: `AMG@2026#Admin` (Forced password change on first login)
   - **Student Management**: Filter, search, edit, view complete timeline, export CSV/Excel reports, resend WhatsApp confirmation
   - **Course Date & Slot Management**: Add/edit course dates, adjust seat capacities, set Google Meet links per slot, enable/disable slots
   - **WhatsApp & Communication Settings**: Dynamically update WhatsApp Business Number, Support Link, and Official Community Invite Link (`https://chat.whatsapp.com/H9sm1PHu9uU6ITuzQVgjtO`) with instant copy & test buttons
   - **CMS Landing Page Settings**: Edit course fee, hero titles, benefits, FAQ, and contact links
   - **Admin User Management**: Multi-role support (Super Admin, Course Manager, Payment Manager, Communication Manager)
   - **Audit Logs**: Full logging of logins, course updates, student deletions, and settings changes

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite 6, Tailwind CSS 4, Lucide React, Motion, Canvas Confetti
- **Backend**: Express.js (TypeScript runtime via `tsx`, bundled with `esbuild`)
- **Database**: File-backed JSON Database (`/data/db.json`) with persistent disk read/write
- **Fonts**: Noto Sans Devanagari (Primary Devanagari), Poppins (English Display), Mukta (Secondary)

---

## 💻 Local Development Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Dev Server**:
   ```bash
   npm run dev
   ```
   The application will start at `http://localhost:3000`.

3. **Admin Login**:
   - URL: `http://localhost:3000` -> Click **Admin Login** in footer or top menu
   - Username: `admin`
   - Password: `AMG@2026#Admin`

---

## 📦 Production Build & Run

```bash
# Build the React frontend and bundle Express backend
npm run build

# Start the production server
npm run start
```

---

## 📁 Database Schema (`/data/db.json`)

The system stores state in a JSON database structured as follows:
- `siteSettings`: Fee (₹199), Hero headlines, price comparisons, course duration
- `courseDates`: List of workshop dates with `slot1` and `slot2` capacities, booked count, and Google Meet URLs
- `students`: Complete registration records (`id`, `fullName`, `mobileNumber`, `whatsappNumber`, `email`, `district`, `occupation`, `courseDateId`, `selectedSlot`, `paymentStatus`, `paymentId`, `amountPaid`, `registrationDate`, `meetLink`)
- `communicationSettings`: Community invite link (`https://chat.whatsapp.com/H9sm1PHu9uU6ITuzQVgjtO`), business phone, support link, templates
- `admins`: Hashed passwords, roles (`SUPER_ADMIN`, `COURSE_MANAGER`, `PAYMENT_MANAGER`, `COMMUNICATION_MANAGER`)
- `auditLogs`: System activity logs
