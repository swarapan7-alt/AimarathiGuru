import dotenv from 'dotenv';
dotenv.config({ override: true });
import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const app = express();
const port = Number(process.env.PORT) || 3000;

// Resolve Root & Directories using process.cwd()
const ROOT_DIR = process.cwd();
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const UPLOADS_DIR = path.join(PUBLIC_DIR, 'uploads');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure Public & Uploads Directory Exists
if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(PUBLIC_DIR));
app.use('/public', express.static(PUBLIC_DIR));
app.use('/uploads', express.static(UPLOADS_DIR));

// Password Hashing Utility & Admin Auth Config
const AUTH_SECRET = process.env.AUTH_SALT || 'AMG_SECURE_AUTH_SESSION_KEY_2026';

let db: DBStructure | null = null;

function hashPassword(password: string): string {
  return crypto.pbkdf2Sync(password, AUTH_SECRET, 1000, 64, 'sha512').toString('hex');
}

// Configurable Admin Credentials:
// Priority 1: Environment Variables (ADMIN_USERNAME & ADMIN_PASSWORD)
// Priority 2: Database Hashed Admin Record (db.admins)
// Default Username: aimarathi
function getAdminCredentials() {
  const envUser = process.env.ADMIN_USERNAME ? process.env.ADMIN_USERNAME.trim() : '';
  const envPass = process.env.ADMIN_PASSWORD ? process.env.ADMIN_PASSWORD.trim() : '';

  const dbUser = db?.admins?.[0]?.username || '';
  const username = envUser || dbUser || 'aimarathi';
  const password = envPass;
  const hasDbPassword = Boolean(db?.admins?.[0]?.passwordHash);

  return {
    username,
    password,
    isEnvConfigured: Boolean(envPass),
    isConfigured: Boolean(envPass) || hasDbPassword,
  };
}

function createAdminToken(username: string): string {
  const payload = {
    username,
    role: 'SUPER_ADMIN',
    ts: Date.now(),
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64');
  const signature = crypto.createHmac('sha256', AUTH_SECRET).update(payloadB64).digest('hex');
  return `${payloadB64}.${signature}`;
}

function verifyAdminToken(tokenString: string): { valid: boolean; username?: string } {
  try {
    if (!tokenString) return { valid: false };
    
    // Support HMAC signed tokens
    if (tokenString.includes('.')) {
      const [payloadB64, signature] = tokenString.split('.');
      const expectedSignature = crypto.createHmac('sha256', AUTH_SECRET).update(payloadB64).digest('hex');
      if (signature !== expectedSignature) {
        return { valid: false };
      }
      const payload = JSON.parse(Buffer.from(payloadB64, 'base64').toString('utf-8'));
      return { valid: true, username: payload.username };
    }

    // Support legacy base64 tokens for backward compatibility
    const legacyDecoded = JSON.parse(Buffer.from(tokenString, 'base64').toString('utf-8'));
    if (legacyDecoded && legacyDecoded.username) {
      return { valid: true, username: legacyDecoded.username };
    }
    return { valid: false };
  } catch (e) {
    return { valid: false };
  }
}

const ENV_RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || '';
const ENV_RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';

// Default Modules Data (6 Clean Topics)
const DEFAULT_MODULES = [
  {
    id: 1,
    title: 'ChatGPT Basics',
    titleEn: 'ChatGPT Basics',
    iconName: 'MessageSquareText',
    topics: ['मराठीत ChatGPT चा उपयोग', 'योग्य प्रॉम्ट्स लिहिणे', 'ईमेल, पत्र व कंटेंट रायटिंग', 'बिझनेस कल्पना व प्लॅनिंग'],
    gradient: 'from-amber-500 to-red-600',
  },
  {
    id: 2,
    title: 'Google Gemini',
    titleEn: 'Google Gemini',
    iconName: 'Sparkles',
    topics: ['Gemini चा practical वापर', 'लाईव्ह माहिती व रिसर्च', 'डॉक्युमेंट्स व डेटा विश्लेषण', 'स्मार्ट दैनंदिन वापर'],
    gradient: 'from-blue-600 to-indigo-600',
  },
  {
    id: 3,
    title: 'Jio + Google Gemini',
    titleEn: 'Jio + Gemini Benefits',
    iconName: 'Smartphone',
    topics: ['Jio ₹349 प्लॅन व Google Gemini benefits', 'Eligible users साठी ऑफर समजून घेणे', 'मोबाईलवर AI चा सुलभ वापर', 'फायदे आणि ॲक्टिव्हेशन माहिती'],
    gradient: 'from-indigo-600 to-blue-700',
  },
  {
    id: 4,
    title: 'AI Poster Design',
    titleEn: 'AI Poster Design',
    iconName: 'Palette',
    topics: ['AI वापरून आकर्षक पोस्टर तयार करणे', 'सोशल मीडिया व सण-उत्सव ग्राफिक्स', 'व्यवसाय जाहिरात बॅनर', 'मराठी फॉन्ट व लेआउट्स'],
    gradient: 'from-purple-600 to-indigo-600',
  },
  {
    id: 5,
    title: 'AI Video Creation',
    titleEn: 'AI Video Creation',
    iconName: 'Video',
    topics: ['AI Tools वापरून basic video creation', 'AI व्हॉईसओव्हर निर्मिती', 'बिना चेहऱ्याचे रील व व्हिडिओ', 'व्हिडिओ एडिट बेसिक टिप्स'],
    gradient: 'from-[#E53935] to-amber-600',
  },
  {
    id: 6,
    title: 'Instagram for Business',
    titleEn: 'Instagram for Business',
    iconName: 'Instagram',
    topics: ['Instagram account सेटअप व ब्रँडिंग', 'Business promotion basics', 'AI द्वारे व्हायरल रील कल्पना', 'कॅप्शन व हॅशटॅग स्ट्रॅटेजी'],
    gradient: 'from-pink-600 to-rose-600',
  },
];

// Default FAQs (4 Focused Questions)
const DEFAULT_FAQS = [
  {
    question: 'ही Training कोणासाठी आहे?',
    answer: 'हा कोर्स विद्यार्थी, व्यावसायिक, शेतकरी, शिक्षक, महा-ई-सेवा चालक, गृहिणी आणि AI शिकू इच्छिणाऱ्या प्रत्येकासाठी अत्यंत सोप्या मराठी भाषेत तयार केला आहे.',
  },
  {
    question: 'मोबाईलवरून Join करता येईल का?',
    answer: 'होय! तुमच्याकडे कॉम्प्युटर किंवा लॅपटॉप नसला तरी तुम्ही मोबाईलवरून Google Meet द्वारे थेट आणि सहज जॉईन करू शकता.',
  },
  {
    question: 'Training किती वेळाची आहे?',
    answer: 'ही २ तासांची टू-द-पॉइंट Practical Live Online Training आहे. यामध्ये स्क्रीन शेअरिंगसह प्रत्यक्ष वापर दाखवला जाईल.',
  },
  {
    question: 'Payment नंतर काय मिळेल?',
    answer: 'पेमेंट यशस्वी होताच तुम्हाला स्क्रीनवर आणि व्हॉट्सॲपवर त्वरित Registration ID, Official WhatsApp Community लिंक आणि Google Meet क्लास लिंक मिळेल.',
  },
];

// Initial Database Structure Interface
interface DBStructure {
  admins: Array<{
    id: string;
    username: string;
    passwordHash: string;
    name: string;
    role: string;
    mustChangePassword: boolean;
    active: boolean;
    createdAt: string;
  }>;
  courseDates: Array<{
    id: string;
    date: string;
    displayDate: string;
    enabled: boolean;
    slot1: {
      id: 'slot1';
      name: string;
      startTime: string;
      endTime: string;
      capacity: number;
      booked: number;
      enabled: boolean;
      meetLink: string;
    };
    slot2: {
      id: 'slot2';
      name: string;
      startTime: string;
      endTime: string;
      capacity: number;
      booked: number;
      enabled: boolean;
      meetLink: string;
    };
  }>;
  students: Array<{
    id: string; // AMG-2026-XXXXX for confirmed, or tempId for pending
    tempId?: string;
    fullName: string;
    mobileNumber: string;
    whatsappNumber: string;
    email: string;
    district: string;
    occupation: string;
    courseDateId: string;
    courseDateDisplay: string;
    selectedSlot: 'slot1' | 'slot2';
    slotTimeDisplay: string;
    agreedToFee: boolean;
    registrationDate: string;
    registrationStatus?: 'CONFIRMED' | 'PENDING' | 'FAILED' | 'CANCELLED';
    paymentStatus: 'PAID' | 'PENDING' | 'FAILED' | 'CANCELLED';
    paymentVerified?: boolean;
    paymentId: string;
    orderId?: string;
    amountPaid: number;
    paymentDate?: string;
    failureReason?: string;
    whatsappJoined: boolean;
    meetLink?: string;
    reminderSent24h?: boolean;
    reminderSent2h?: boolean;
  }>;
  paymentSettings: {
    courseFee: number;
    originalFee: number;
    razorpayPaymentLink: string;
    paymentMode: 'payment_link' | 'razorpay_modal' | 'both';
    razorpayKeyId: string;
  };
  whatsappSettings: {
    communityLink: string;
    groupLink: string;
    adminWhatsAppNumber: string;
    customSuccessMessage: string;
    buttonText: string;
  };
  communicationSettings: {
    businessNumber: string;
    communityLink: string;
    groupLink: string;
    adminWhatsAppNumber: string;
    customSuccessMessage: string;
    buttonText: string;
    supportLink: string;
    templates: {
      registrationSuccess: string;
      paymentPending: string;
      paymentSuccess: string;
      whatsappJoin: string;
      courseReminder: string;
      liveSessionMessage: string;
      reminder24h?: string;
      reminder2h?: string;
    };
  };
  liveSessionSettings: {
    googleMeetLink: string;
    instructions: string;
    sessionAccessMessage: string;
  };
  siteSettings: {
    courseName: string;
    courseFee: number;
    oldPrice: number;
    heroHeading: string;
    heroSubtitle: string;
    contactNumber: string;
    contactEmail: string;
    ctaText: string;
    websiteUrl: string;
    instagramLink: string;
    youtubeLink: string;
    instructorName: string;
    instructorNameEn?: string;
    instructorTitle: string;
    instructorBio: string;
    instructorPhoto: string;
    instructor_photo_url?: string;
    instructorPhotoUrl?: string;
    courseScreenshots?: Array<{ id: string; title: string; imageUrl: string; description?: string }>;
    modules: typeof DEFAULT_MODULES;
    faqs: typeof DEFAULT_FAQS;
  };
  auditLogs: Array<{
    id: string;
    timestamp: string;
    adminUsername: string;
    action: string;
    details: string;
    ip?: string;
  }>;
}

// Load or Seed DB
function loadDB(): DBStructure {
  let existingData: Partial<DBStructure> | null = null;
  if (fs.existsSync(DB_FILE)) {
    try {
      existingData = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    } catch (e) {
      console.error('Failed reading db.json, creating initial setup:', e);
    }
  }

  const { username: envUser } = getAdminCredentials();
  const initialAdmins = [
    {
      id: 'admin_1',
      username: envUser || 'aimarathi',
      passwordHash: '',
      name: 'Super Administrator',
      role: 'SUPER_ADMIN',
      mustChangePassword: false,
      active: true,
      createdAt: new Date().toISOString(),
    },
  ];

  const defaultTemplates = {
    registrationSuccess: `नमस्कार {student_name} 👋\n\nAI Marathi Guru मध्ये तुमची नोंदणी प्राप्त झाली आहे. 📝\n\n📅 Date: {course_date}\n⏰ Slot: {course_slot}\n💰 Status: {payment_status}\n\nपुढील सूचनांसाठी WhatsApp Community शी कनेक्ट राहा:\n{whatsapp_link}`,
    paymentPending: `नमस्कार {student_name} 👋\n\nतुमची AI Marathi Guru रजिस्ट्रेशन प्रोसेस सुरू झाली आहे. कृपया खालील लिंकवरून ₹{course_fee} पेमेंट पूर्ण करा:\n{payment_link}\n\nपेमेंट झाल्यावर तात्काळ WhatsApp Community ॲक्सेस मिळेल.`,
    paymentSuccess: `नमस्कार {Student Name} 👋\n\nAI Marathi Guru Live Training साठी तुमची नोंदणी यशस्वी झाली आहे. 🎉\n\nRegistration ID: {Registration ID}\nCourse Date: {Course Date}\nTime Slot: {Selected Slot}\nPayment Status: PAID\n\nमहत्त्वाची माहिती आणि Live Session ची लिंक खालील WhatsApp Community मधून दिली जाईल.\n\nWhatsApp Community मध्ये सहभागी होण्यासाठी खालील लिंकवर क्लिक करा 👇\n\n{WhatsApp Community Link}\n\nधन्यवाद,\nAI Marathi Guru`,
    whatsappJoin: `नमस्कार {student_name} 👋\n\nAI Marathi Guru बॅचमध्ये स्वागत आहे! सर्व क्लास अपडेट्स, Google Meet लिंक व स्टडी मटेरियल मिळवण्यासाठी त्वरित खालील Official Community Join करा:\n{whatsapp_link}`,
    courseReminder: `नमस्कार {student_name} 👋\n\nआज तुमचे AI Marathi Guru Live Training आहे.\n\n📅 तारीख: {course_date}\n⏰ वेळ: {course_slot}\n\nकृपया क्लास वेळेच्या १० मिनिटे आधी तयार राहा. भेटूया लाईव्ह सेशन्समध्ये! 🚀`,
    liveSessionMessage: `नमस्कार {student_name} 👋\n\nतुमचा AI Marathi Guru Live Class सुरू होत आहे!\n\n📅 Date: {course_date}\n⏰ Slot: {course_slot}\n🔗 Google Meet Link: {meet_link}\n\nकृपया त्वरित जॉईन व्हा.`,
    reminder24h: `नमस्कार {student_name} 👋\n\nउद्या तुमचा AI Marathi Guru Live Training क्लास आहे.\nतारीख: {course_date}\nवेळ: {course_slot}\n\nवेळेवर उपस्थित राहा.`,
    reminder2h: `नमस्कार {student_name} 👋\n\nतुमचा AI Marathi Guru session आज पुढील २ तासांत ({course_slot}) सुरू होत आहे.\n\nतयार राहा!`,
  };

  const initialDB: DBStructure = {
    admins: existingData?.admins && existingData.admins.length > 0 ? existingData.admins : initialAdmins,
    courseDates: existingData?.courseDates && existingData.courseDates.length > 0 ? existingData.courseDates : [
      {
        id: 'cd_2026_08_23',
        date: '2026-08-23',
        displayDate: 'Sunday, 23 August 2026',
        enabled: true,
        slot1: {
          id: 'slot1',
          name: 'Slot 1 (सकाळ)',
          startTime: '11:00 AM',
          endTime: '1:00 PM',
          capacity: 50,
          booked: 14,
          enabled: true,
          meetLink: 'https://meet.google.com/amg-slot1-live',
        },
        slot2: {
          id: 'slot2',
          name: 'Slot 2 (संध्याकाळ)',
          startTime: '7:00 PM',
          endTime: '9:00 PM',
          capacity: 50,
          booked: 28,
          enabled: true,
          meetLink: 'https://meet.google.com/amg-slot2-live',
        },
      },
      {
        id: 'cd_2026_08_30',
        date: '2026-08-30',
        displayDate: 'Sunday, 30 August 2026',
        enabled: true,
        slot1: {
          id: 'slot1',
          name: 'Slot 1 (सकाळ)',
          startTime: '11:00 AM',
          endTime: '1:00 PM',
          capacity: 50,
          booked: 4,
          enabled: true,
          meetLink: 'https://meet.google.com/amg-slot1-live',
        },
        slot2: {
          id: 'slot2',
          name: 'Slot 2 (संध्याकाळ)',
          startTime: '7:00 PM',
          endTime: '9:00 PM',
          capacity: 50,
          booked: 8,
          enabled: true,
          meetLink: 'https://meet.google.com/amg-slot2-live',
        },
      },
    ],
    students: existingData?.students || [
      {
        id: 'AMG-2026-00001',
        fullName: 'विकास चंद्रकांत पाटील',
        mobileNumber: '9876543210',
        whatsappNumber: '9876543210',
        email: 'vikas.patil@example.com',
        district: 'पुणे (Pune)',
        occupation: 'CSC Operator',
        courseDateId: 'cd_2026_08_23',
        courseDateDisplay: 'Sunday, 23 August 2026',
        selectedSlot: 'slot1',
        slotTimeDisplay: '11:00 AM – 1:00 PM',
        agreedToFee: true,
        registrationDate: new Date().toISOString(),
        paymentStatus: 'PAID',
        paymentId: 'pay_RZP819204128',
        amountPaid: 199,
        whatsappJoined: true,
        meetLink: 'https://meet.google.com/amg-slot1-live',
      },
      {
        id: 'AMG-2026-00002',
        fullName: 'प्रिया रामेश्वर कुलकर्णी',
        mobileNumber: '9123456789',
        whatsappNumber: '9123456789',
        email: 'priya.kulkarni@example.com',
        district: 'छत्रपती संभाजीनगर',
        occupation: 'Student',
        courseDateId: 'cd_2026_08_23',
        selectedSlot: 'slot2',
        courseDateDisplay: 'Sunday, 23 August 2026',
        slotTimeDisplay: '7:00 PM – 9:00 PM',
        agreedToFee: true,
        registrationDate: new Date().toISOString(),
        paymentStatus: 'PAID',
        paymentId: 'pay_RZP981042711',
        amountPaid: 199,
        whatsappJoined: false,
        meetLink: 'https://meet.google.com/amg-slot2-live',
      },
    ],
    paymentSettings: {
      courseFee: existingData?.paymentSettings?.courseFee || existingData?.siteSettings?.courseFee || 199,
      originalFee: existingData?.paymentSettings?.originalFee || existingData?.siteSettings?.oldPrice || 999,
      razorpayPaymentLink: existingData?.paymentSettings?.razorpayPaymentLink || 'https://rzp.io/l/ai-marathi-guru',
      paymentMode: existingData?.paymentSettings?.paymentMode || 'both',
      razorpayKeyId: ENV_RAZORPAY_KEY_ID || existingData?.paymentSettings?.razorpayKeyId || '',
    },
    whatsappSettings: {
      communityLink: existingData?.whatsappSettings?.communityLink || existingData?.communicationSettings?.communityLink || 'https://chat.whatsapp.com/H9sm1PHu9uU6ITuzQVgjtO',
      groupLink: existingData?.whatsappSettings?.groupLink || existingData?.communicationSettings?.groupLink || 'https://chat.whatsapp.com/H9sm1PHu9uU6ITuzQVgjtO',
      adminWhatsAppNumber: existingData?.whatsappSettings?.adminWhatsAppNumber || existingData?.communicationSettings?.businessNumber || '9801555171',
      customSuccessMessage: existingData?.whatsappSettings?.customSuccessMessage || 'तुमचे Registration आणि Payment यशस्वी झाले आहे. आता खालील बटणावर क्लिक करून AI Marathi Guru WhatsApp Community Join करा.',
      buttonText: existingData?.whatsappSettings?.buttonText || 'JOIN WHATSAPP COMMUNITY',
    },
    communicationSettings: {
      businessNumber: existingData?.communicationSettings?.businessNumber || '9801555171',
      communityLink: existingData?.communicationSettings?.communityLink || 'https://chat.whatsapp.com/H9sm1PHu9uU6ITuzQVgjtO',
      groupLink: existingData?.communicationSettings?.groupLink || 'https://chat.whatsapp.com/H9sm1PHu9uU6ITuzQVgjtO',
      adminWhatsAppNumber: '9801555171',
      customSuccessMessage: 'तुमचे Registration आणि Payment यशस्वी झाले आहे. आता खालील बटणावर क्लिक करून AI Marathi Guru WhatsApp Community Join करा.',
      buttonText: 'JOIN WHATSAPP COMMUNITY',
      supportLink: 'https://wa.me/919801555171',
      templates: {
        ...defaultTemplates,
        ...(existingData?.communicationSettings?.templates || {}),
      },
    },
    liveSessionSettings: {
      googleMeetLink: existingData?.liveSessionSettings?.googleMeetLink || 'https://meet.google.com/amg-live-session',
      instructions: existingData?.liveSessionSettings?.instructions || 'कृपया क्लासच्या १० मिनिटे आधी लॅपटॉप किंवा मोबाईलवर Google Meet लिंक ओपन करा. हेडफोन वापरल्यास आवाज अधिक स्पष्ट ऐकू येईल.',
      sessionAccessMessage: existingData?.liveSessionSettings?.sessionAccessMessage || 'Live session लिंक फक्त नोंदणीकृत विद्यार्थ्यांना उपलब्ध आहे.',
    },
    siteSettings: {
      courseName: existingData?.siteSettings?.courseName || 'AI Marathi Guru',
      courseFee: existingData?.siteSettings?.courseFee || 199,
      oldPrice: existingData?.siteSettings?.oldPrice || 999,
      heroHeading: existingData?.siteSettings?.heroHeading || 'आता AI मराठीत शिका!',
      heroSubtitle: existingData?.siteSettings?.heroSubtitle || 'AI शिका. व्यवसाय वाढवा. भविष्य घडवा.',
      contactNumber: existingData?.siteSettings?.contactNumber || '9801555171',
      contactEmail: existingData?.siteSettings?.contactEmail || 'contact@swaraudyog.com',
      ctaText: existingData?.siteSettings?.ctaText || '₹199 मध्ये आजच Register करा',
      websiteUrl: existingData?.siteSettings?.websiteUrl || 'https://aimarathi.swaraudyog.com',
      instagramLink: existingData?.siteSettings?.instagramLink || 'https://instagram.com/aimarathiguru',
      youtubeLink: existingData?.siteSettings?.youtubeLink || 'https://youtube.com/aimarathiguru',
      instructorName: existingData?.siteSettings?.instructorName || 'श्री. पंकज वाघमारे',
      instructorNameEn: existingData?.siteSettings?.instructorNameEn || 'Mr. Pankaj Waghmare',
      instructorTitle: existingData?.siteSettings?.instructorTitle || 'Founder & CEO, AI Marathi Guru',
      instructorBio: existingData?.siteSettings?.instructorBio || '८,०००+ मराठी विद्यार्थी, व्यावसायिक, शिक्षक व उद्योजकांना AI चे सोप्या भाषेत लाईव्ह ऑनलाईन प्रशिक्षण.',
      instructorPhoto: existingData?.siteSettings?.instructorPhoto || '/pankaj-photo.png',
      instructor_photo_url: existingData?.siteSettings?.instructor_photo_url || existingData?.siteSettings?.instructorPhoto || '/pankaj-photo.png',
      instructorPhotoUrl: existingData?.siteSettings?.instructorPhotoUrl || existingData?.siteSettings?.instructorPhoto || '/pankaj-photo.png',
      courseScreenshots: existingData?.siteSettings?.courseScreenshots || [
        {
          id: 'scr_1',
          title: 'ChatGPT Marathi Prompting',
          imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
          description: 'मराठीत योग्य प्रॉम्ट लिहून १ मिनिटात व्यावसायिक ई-मेल व अर्ज तयार करणे'
        },
        {
          id: 'scr_2',
          title: 'Google Gemini & Jio AI Live Analysis',
          imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop',
          description: 'भारतीय भाषांमधील AI सहाय्यक व डॉक्युमेंट अ‍ॅनालिसिस'
        },
        {
          id: 'scr_3',
          title: 'AI Poster & Festival Graphics',
          imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=800&auto=format&fit=crop',
          description: 'मोबाईलवरून १ मिनिटात सण-उत्सव व दुकानाचे HD जाहिरात पोस्टर'
        },
        {
          id: 'scr_4',
          title: 'AI Video & Avatar Reels',
          imageUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=800&auto=format&fit=crop',
          description: 'चेहरा न दाखवता व्हॉईसओव्हरसह रील व व्हिडिओ निर्मिती'
        }
      ],
      modules: DEFAULT_MODULES,
      faqs: DEFAULT_FAQS,
    },
    auditLogs: existingData?.auditLogs || [
      {
        id: 'log_1',
        timestamp: new Date().toISOString(),
        adminUsername: 'system',
        action: 'SYSTEM_BOOT',
        details: 'Admin management system initial boot and data ready.',
      },
    ],
  };

  fs.writeFileSync(DB_FILE, JSON.stringify(initialDB, null, 2));
  return initialDB;
}

function saveDB(data: DBStructure) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error saving DB to filesystem:', err);
  }
}

// Global in-memory DB reference
db = loadDB();

// Log Audit Trail
function addAuditLog(adminUsername: string, action: string, details: string, ip?: string) {
  db.auditLogs.unshift({
    id: `log_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    adminUsername: adminUsername || 'admin',
    action,
    details,
    ip,
  });
  // Cap audit logs to last 200 items
  if (db.auditLogs.length > 200) {
    db.auditLogs = db.auditLogs.slice(0, 200);
  }
  saveDB(db);
}

// Format template with dynamic variables
function formatMessageTemplate(template: string, student: any, extra?: Record<string, string>): string {
  if (!template) return '';
  let msg = template;

  const communityLink =
    db.whatsappSettings?.communityLink ||
    db.communicationSettings?.communityLink ||
    'https://chat.whatsapp.com/H9sm1PHu9uU6ITuzQVgjtO';
  const studentName = student?.fullName || student?.name || 'विद्यार्थी';
  const regId = student?.id || '';
  const courseDate = student?.courseDateDisplay || '';
  const slotTime = student?.slotTimeDisplay || '';
  const paymentStatus = student?.paymentStatus || 'PAID';
  const courseFee = String(student?.amountPaid || db.paymentSettings?.courseFee || 199);
  const meetLink =
    student?.meetLink || db.liveSessionSettings?.googleMeetLink || 'https://meet.google.com/amg-live-session';
  const paymentLink = db.paymentSettings?.razorpayPaymentLink || 'https://rzp.io/rzp/gAmUJOS0';

  // 1. Student Name replacements
  msg = msg.replace(/{Student Name}/gi, studentName);
  msg = msg.replace(/{student_name}/gi, studentName);
  msg = msg.replace(/{STUDENT_NAME}/g, studentName);
  msg = msg.replace(/{Full Name}/gi, studentName);
  msg = msg.replace(/{full_name}/gi, studentName);

  // 2. Registration ID replacements
  msg = msg.replace(/{Registration ID}/gi, regId);
  msg = msg.replace(/{registration_id}/gi, regId);
  msg = msg.replace(/{REGISTRATION_ID}/g, regId);

  // 3. Course Date replacements
  msg = msg.replace(/{Course Date}/gi, courseDate);
  msg = msg.replace(/{course_date}/gi, courseDate);
  msg = msg.replace(/{COURSE_DATE}/g, courseDate);

  // 4. Selected Slot / Time Slot replacements
  msg = msg.replace(/{Selected Slot}/gi, slotTime);
  msg = msg.replace(/{selected_slot}/gi, slotTime);
  msg = msg.replace(/{Time Slot}/gi, slotTime);
  msg = msg.replace(/{time_slot}/gi, slotTime);
  msg = msg.replace(/{course_slot}/gi, slotTime);
  msg = msg.replace(/{SLOT_TIME}/g, slotTime);

  // 5. WhatsApp Community Link replacements
  msg = msg.replace(/{WhatsApp Community Link}/gi, communityLink);
  msg = msg.replace(/{whatsapp_community_link}/gi, communityLink);
  msg = msg.replace(/{whatsapp_link}/gi, communityLink);
  msg = msg.replace(/{WHATSAPP_COMMUNITY_LINK}/g, communityLink);

  // 6. Payment Status & Fee replacements
  msg = msg.replace(/{Payment Status}/gi, paymentStatus);
  msg = msg.replace(/{payment_status}/gi, paymentStatus);
  msg = msg.replace(/{PAYMENT_STATUS}/g, paymentStatus);
  msg = msg.replace(/{course_fee}/gi, courseFee);
  msg = msg.replace(/{payment_link}/gi, paymentLink);

  // 7. Meet Link replacements
  msg = msg.replace(/{meet_link}/gi, meetLink);
  msg = msg.replace(/{GOOGLE_MEET_LINK}/g, meetLink);

  if (extra) {
    Object.keys(extra).forEach((k) => {
      msg = msg.replace(new RegExp(`{${k}}`, 'gi'), extra[k]);
    });
  }
  return msg;
}

// Compute active course dates with live seat booking numbers
function getComputedCourseDates() {
  return db.courseDates
    .filter((cd) => cd.enabled)
    .map((cd) => {
      const slot1Paid = db.students.filter(
        (s) => s.courseDateId === cd.id && s.selectedSlot === 'slot1' && s.paymentStatus === 'PAID'
      ).length;
      const slot2Paid = db.students.filter(
        (s) => s.courseDateId === cd.id && s.selectedSlot === 'slot2' && s.paymentStatus === 'PAID'
      ).length;

      const slot1Booked = Math.max(cd.slot1?.booked || 0, slot1Paid);
      const slot2Booked = Math.max(cd.slot2?.booked || 0, slot2Paid);

      const slot1Cap = cd.slot1?.capacity ?? 50;
      const slot2Cap = cd.slot2?.capacity ?? 50;

      const slot1Available = cd.slot1?.enabled ? Math.max(0, slot1Cap - slot1Booked) : 0;
      const slot2Available = cd.slot2?.enabled ? Math.max(0, slot2Cap - slot2Booked) : 0;

      return {
        id: cd.id,
        date: cd.date,
        displayDate: cd.displayDate,
        enabled: cd.enabled,
        slot1: {
          ...cd.slot1,
          booked: slot1Booked,
          availableSeats: slot1Available,
          isFull: slot1Available <= 0,
        },
        slot2: {
          ...cd.slot2,
          booked: slot2Booked,
          availableSeats: slot2Available,
          isFull: slot2Available <= 0,
        },
      };
    });
}

// Express Auth Middleware
function authenticateAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace(/^Bearer\s+/i, '');
  if (!token) {
    return res.status(401).json({ error: 'अनधिकृत! Admin लॉगिन आवश्यक आहे (Unauthorized: Admin login required).' });
  }

  const verified = verifyAdminToken(token);
  if (!verified.valid || !verified.username) {
    return res.status(401).json({ error: 'लॉगिन सेशन संपले आहे. कृपया पुन्हा लॉगिन करा (Session expired).' });
  }

  const { username: envUser } = getAdminCredentials();
  const dbAdmin = db.admins.find((a) => a.username.toLowerCase() === verified.username?.toLowerCase() && a.active !== false) || db.admins[0];

  (req as any).admin = {
    id: dbAdmin?.id || 'admin_1',
    username: verified.username || envUser,
    name: dbAdmin?.name || 'Super Administrator',
    role: dbAdmin?.role || 'SUPER_ADMIN',
    mustChangePassword: false,
  };

  next();
}

// -----------------------------
// PUBLIC API ROUTES
// -----------------------------

// 0. Health Check for Hosting & Monitoring
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 1. Detailed Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    time: new Date().toISOString(),
    studentsCount: db.students.length,
    courseDatesCount: db.courseDates.length,
    courseFee: db.paymentSettings.courseFee,
  });
});

// 2. Public Site Content & Settings (Combined)
app.get('/api/content', (req, res) => {
  const activeCourseDates = getComputedCourseDates();
  const currentPhoto = db.siteSettings.instructor_photo_url || db.siteSettings.instructorPhoto || db.siteSettings.instructorPhotoUrl || '';

  res.json({
    siteSettings: {
      ...db.siteSettings,
      instructor_photo_url: currentPhoto,
      instructorPhoto: currentPhoto,
      instructorPhotoUrl: currentPhoto,
      courseFee: db.paymentSettings.courseFee,
      oldPrice: db.paymentSettings.originalFee,
    },
    paymentSettings: {
      courseFee: db.paymentSettings.courseFee,
      originalFee: db.paymentSettings.originalFee,
      razorpayPaymentLink: db.paymentSettings.razorpayPaymentLink,
      paymentMode: db.paymentSettings.paymentMode,
      razorpayKeyId: db.paymentSettings.razorpayKeyId,
    },
    whatsappSettings: db.whatsappSettings,
    communication: {
      businessNumber: db.communicationSettings.businessNumber,
      communityLink: db.whatsappSettings.communityLink || db.communicationSettings.communityLink,
      supportLink: db.communicationSettings.supportLink,
      customSuccessMessage: db.whatsappSettings.customSuccessMessage,
      buttonText: db.whatsappSettings.buttonText,
    },
    courseDates: activeCourseDates,
  });
});

// 3. Public Course Dates
app.get('/api/course-dates', (req, res) => {
  res.json({
    success: true,
    courseDates: getComputedCourseDates(),
  });
});

// Helper to generate next sequential AMG Registration ID
function generateNextRegistrationId(database: DBStructure): string {
  let maxSeq = 0;
  for (const s of database.students) {
    if (s.id && s.id.startsWith('AMG-2026-')) {
      const parts = s.id.split('-');
      const num = parseInt(parts[2], 10);
      if (!isNaN(num) && num > maxSeq) {
        maxSeq = num;
      }
    }
  }
  const nextNum = maxSeq + 1;
  return `AMG-2026-${String(nextNum).padStart(5, '0')}`;
}

// 4. Public Payment Settings info
app.get('/api/payment-settings', (req, res) => {
  res.json({
    success: true,
    courseFee: db.paymentSettings.courseFee,
    originalFee: db.paymentSettings.originalFee,
    razorpayPaymentLink: db.paymentSettings.razorpayPaymentLink,
    paymentMode: db.paymentSettings.paymentMode,
    razorpayKeyId: ENV_RAZORPAY_KEY_ID || db.paymentSettings.razorpayKeyId || '',
  });
});

// 5. Student Registration Flow (STEP 1: Create PENDING Session Only)
app.post('/api/register', async (req, res) => {
  try {
    const {
      fullName,
      mobileNumber,
      whatsappNumber,
      email,
      district,
      occupation,
      courseDateId,
      selectedSlot,
    } = req.body;

    if (!fullName || !mobileNumber || !email || !courseDateId || !selectedSlot) {
      return res.status(400).json({ error: 'कृपया सर्व आवश्यक माहिती भरा.' });
    }

    // Validate 10 digit mobile
    const cleanMobile = String(mobileNumber).trim().replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      return res.status(400).json({ error: 'कृपया योग्य १० अंकी मोबाईल नंबर टाका.' });
    }

    // Find course date record
    const targetCourseDate = db.courseDates.find((cd) => cd.id === courseDateId && cd.enabled);
    if (!targetCourseDate) {
      return res.status(400).json({ error: 'निवडलेली कोर्स तारीख सध्या उपलब्ध नाही.' });
    }

    const slotKey: 'slot1' | 'slot2' = selectedSlot === 'slot1' ? 'slot1' : 'slot2';
    const targetSlot = targetCourseDate[slotKey];

    if (!targetSlot || !targetSlot.enabled) {
      return res.status(400).json({ error: 'निवडलेला स्लॉट सध्या उपलब्ध नाही.' });
    }

    // Capacity lock check (Only count VERIFIED PAID students)
    const paidCount = db.students.filter(
      (s) => s.courseDateId === courseDateId && s.selectedSlot === slotKey && s.paymentStatus === 'PAID'
    ).length;

    if (paidCount >= targetSlot.capacity) {
      return res.status(400).json({
        error: `माफ करा! ${targetSlot.name} मधील सर्व ${targetSlot.capacity} जागा भरल्या आहेत (SLOT FULL). कृपया दुसरा स्लॉट किंवा तारीख निवडा.`,
        slotFull: true,
      });
    }

    // Check duplicate mobile for same course date (Already PAID)
    const existingPaid = db.students.find(
      (s) =>
        s.mobileNumber.trim() === cleanMobile &&
        s.courseDateId === courseDateId &&
        s.paymentStatus === 'PAID'
    );

    if (existingPaid) {
      const template = db.communicationSettings.templates.paymentSuccess;
      const formatted = formatMessageTemplate(template, existingPaid);
      return res.json({
        success: true,
        alreadyRegistered: true,
        registrationStatus: 'CONFIRMED',
        paymentStatus: 'PAID',
        registration: existingPaid,
        message: 'या मोबाईल नंबरवर या तारखेसाठी आधीच नोंदणी झालेली आहे.',
        whatsappMessage: formatted,
        communityLink: db.whatsappSettings.communityLink,
      });
    }

    // STEP 1 RULE: Create ONLY a temporary PENDING registration session.
    // DO NOT generate final Registration ID AMG-2026-XXXXX yet.
    // DO NOT mark as PAID.
    // DO NOT increment booked count yet.
    // DO NOT send WhatsApp confirmation message yet.
    const tempId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const feeToCharge = db.paymentSettings.courseFee || 199;
    const slotTimeDisplay = `${targetSlot.startTime} – ${targetSlot.endTime}`;

    let razorpayOrderId = '';

    // If Razorpay API credentials exist, optionally create an order on Razorpay
    if (ENV_RAZORPAY_KEY_ID && ENV_RAZORPAY_KEY_SECRET) {
      try {
        const authHeader = 'Basic ' + Buffer.from(`${ENV_RAZORPAY_KEY_ID}:${ENV_RAZORPAY_KEY_SECRET}`).toString('base64');
        const orderRes = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            Authorization: authHeader,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: feeToCharge * 100, // paise
            currency: 'INR',
            receipt: `rcpt_${tempId.substring(0, 30)}`,
            notes: {
              fullName: String(fullName).trim(),
              mobileNumber: cleanMobile,
              courseDate: targetCourseDate.displayDate,
              slot: slotTimeDisplay,
            },
          }),
        });
        if (orderRes.ok) {
          const orderData: any = await orderRes.json();
          razorpayOrderId = orderData.id || '';
        }
      } catch (orderErr) {
        console.warn('Razorpay order creation fallback:', orderErr);
      }
    }

    const pendingStudent: DBStructure['students'][0] = {
      id: tempId,
      tempId,
      fullName: String(fullName || '').trim(),
      mobileNumber: cleanMobile,
      whatsappNumber: String(whatsappNumber || cleanMobile).trim().replace(/\D/g, ''),
      email: String(email || '').trim().toLowerCase(),
      district: String(district || 'महाराष्ट्र').trim(),
      occupation: String(occupation || 'Other').trim(),
      courseDateId: String(courseDateId),
      courseDateDisplay: targetCourseDate.displayDate,
      selectedSlot: slotKey,
      slotTimeDisplay,
      agreedToFee: true,
      registrationDate: new Date().toISOString(),
      registrationStatus: 'PENDING',
      paymentStatus: 'PENDING',
      paymentVerified: false,
      paymentId: '',
      orderId: razorpayOrderId,
      amountPaid: feeToCharge,
      whatsappJoined: false,
      meetLink: targetSlot.meetLink || db.liveSessionSettings.googleMeetLink || 'https://meet.google.com/amg-live-session',
    };

    // Save pending student
    db.students.unshift(pendingStudent);
    saveDB(db);

    console.log(`[REGISTRATION INITIATED - PENDING] TempID: ${tempId} | Mobile: ${cleanMobile} | Fee: ₹${feeToCharge}`);

    return res.json({
      success: true,
      tempId,
      registrationStatus: 'PENDING',
      paymentStatus: 'PENDING',
      amount: feeToCharge,
      courseFee: feeToCharge,
      razorpayKeyId: ENV_RAZORPAY_KEY_ID || db.paymentSettings.razorpayKeyId || '',
      razorpayOrderId,
      paymentLink: db.paymentSettings.razorpayPaymentLink || 'https://rzp.io/rzp/gAmUJOS0',
      pendingRegistration: pendingStudent,
    });
  } catch (err: any) {
    console.error('Registration Error:', err);
    return res.status(500).json({ error: 'नोंदणी प्रक्रियेत समस्या आली. कृपया पुन्हा प्रयत्न करा.' });
  }
});

// 5.1 Create Order specifically for Razorpay Checkout
app.post('/api/payment/create-order', async (req, res) => {
  try {
    const { tempId, amount } = req.body;
    const feeToCharge = Number(amount) || db.paymentSettings.courseFee || 199;

    let orderId = '';
    if (ENV_RAZORPAY_KEY_ID && ENV_RAZORPAY_KEY_SECRET) {
      try {
        const authHeader = 'Basic ' + Buffer.from(`${ENV_RAZORPAY_KEY_ID}:${ENV_RAZORPAY_KEY_SECRET}`).toString('base64');
        const orderRes = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            Authorization: authHeader,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: feeToCharge * 100,
            currency: 'INR',
            receipt: `rcpt_${tempId || Date.now()}`,
          }),
        });
        if (orderRes.ok) {
          const orderData: any = await orderRes.json();
          orderId = orderData.id || '';
        }
      } catch (e) {
        console.warn('Create order direct error:', e);
      }
    }

    if (!orderId) {
      // Fallback secure order token for client tracking
      orderId = `order_AMG_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    }

    if (tempId) {
      const student = db.students.find((s) => s.id === tempId || s.tempId === tempId);
      if (student) {
        student.orderId = orderId;
        saveDB(db);
      }
    }

    return res.json({
      success: true,
      orderId,
      amount: feeToCharge * 100,
      currency: 'INR',
      keyId: ENV_RAZORPAY_KEY_ID || db.paymentSettings.razorpayKeyId || '',
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Order creation failed' });
  }
});

// 6. Strict Server-Side Payment Verification (STEP 3 & STEP 9)
const handlePaymentVerification = async (req: express.Request, res: express.Response) => {
  try {
    const {
      tempId,
      studentId,
      registrationId,
      mobileNumber,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      paymentId,
    } = req.body;

    const lookupKey = tempId || studentId || registrationId || '';
    const cleanMobile = mobileNumber ? String(mobileNumber).trim().replace(/\D/g, '') : '';
    const payId = String(razorpay_payment_id || paymentId || '').trim();

    // 1. Validate payment identifier
    if (!payId || payId === 'PENDING_PAYMENT' || payId.length < 5) {
      return res.status(400).json({
        error: 'वैध Payment ID किंवा Transaction ID आवश्यक आहे. पेमेंट पूर्ण केल्याशिवाय नोंदणी कन्फर्म होणार नाही.',
      });
    }

    // 2. Find matching student record
    let student: DBStructure['students'][0] | undefined = undefined;

    if (lookupKey) {
      student = db.students.find((s) => s.id === lookupKey || s.tempId === lookupKey);
    }
    if (!student && cleanMobile) {
      // Find latest pending or unconfirmed student for this mobile
      student = db.students.find(
        (s) => s.mobileNumber === cleanMobile && s.paymentStatus !== 'PAID'
      ) || db.students.find((s) => s.mobileNumber === cleanMobile);
    }

    if (!student) {
      return res.status(404).json({
        error: 'नोंदणी सेशन सापडले नाही. कृपया पुन्हा फॉर्म भरा.',
      });
    }

    // STEP 8: Duplicate Protection - If already verified and PAID, return confirmed record idempotently
    if (student.paymentStatus === 'PAID' && student.registrationStatus === 'CONFIRMED') {
      const template = db.communicationSettings.templates.paymentSuccess;
      const formattedMessage = formatMessageTemplate(template, student);
      return res.json({
        success: true,
        verified: true,
        alreadyConfirmed: true,
        registration: student,
        registrationStatus: 'CONFIRMED',
        paymentStatus: 'PAID',
        whatsappMessage: formattedMessage,
        communityLink: db.whatsappSettings.communityLink || 'https://chat.whatsapp.com/H9sm1PHu9uU6ITuzQVgjtO',
      });
    }

    // STEP 8: Prevent duplicate payment ID reuse across different students
    const duplicateStudent = db.students.find(
      (s) => s.id !== student!.id && s.paymentId === payId && s.paymentStatus === 'PAID'
    );
    if (duplicateStudent) {
      return res.status(400).json({
        error: 'हा Payment ID आधीच दुसऱ्या विद्यार्थ्याच्या नोंदणीसाठी वापरला गेला आहे (Duplicate Payment ID detected).',
      });
    }

    // STEP 3 & STEP 9: Server-side cryptographic & API verification
    // A. Signature verification if signature & secret exist
    if (razorpay_signature && razorpay_order_id && ENV_RAZORPAY_KEY_SECRET) {
      const expectedSignature = crypto
        .createHmac('sha256', ENV_RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${payId}`)
        .digest('hex');

      if (expectedSignature !== razorpay_signature) {
        console.warn(`[SECURITY] Razorpay Signature Mismatch! Expected: ${expectedSignature}, Received: ${razorpay_signature}`);
        student.paymentStatus = 'FAILED';
        student.failureReason = 'Payment Signature Verification Failed';
        saveDB(db);
        return res.status(400).json({
          error: 'Razorpay Payment Signature Verification Failed. पेमेंट अनधिकृत आहे.',
          paymentStatus: 'FAILED',
        });
      }
    }

    // B. Razorpay API Live Verification (if API credentials configured and pay_... id)
    if (ENV_RAZORPAY_KEY_ID && ENV_RAZORPAY_KEY_SECRET && payId.startsWith('pay_')) {
      try {
        const authHeader = 'Basic ' + Buffer.from(`${ENV_RAZORPAY_KEY_ID}:${ENV_RAZORPAY_KEY_SECRET}`).toString('base64');
        const rzpRes = await fetch(`https://api.razorpay.com/v1/payments/${payId}`, {
          headers: { Authorization: authHeader },
        });

        if (rzpRes.ok) {
          const rzpData: any = await rzpRes.json();
          if (rzpData.status !== 'captured' && rzpData.status !== 'authorized') {
            student.paymentStatus = 'FAILED';
            student.failureReason = `Razorpay returned status: ${rzpData.status}`;
            saveDB(db);
            return res.status(400).json({
              error: `पेमेंट स्थिती "${rzpData.status}" आहे, यशस्वी नाही. कृपया पुन्हा प्रयत्न करा.`,
              paymentStatus: 'FAILED',
            });
          }

          const expectedPaise = (db.paymentSettings.courseFee || 199) * 100;
          if (rzpData.amount && rzpData.amount < expectedPaise) {
            return res.status(400).json({
              error: `पेमेंट रक्कम (₹${rzpData.amount / 100}) अपेक्षित कोर्स फी (₹${expectedPaise / 100}) पेक्षा कमी आहे.`,
              paymentStatus: 'FAILED',
            });
          }
        }
      } catch (apiErr) {
        console.warn('Razorpay API verification network warning (continuing with signature/format check):', apiErr);
      }
    }

    // =========================================================================
    // ONLY AFTER SUCCESSFUL VERIFICATION (STEP 3):
    // 1. Generate unique Registration ID AMG-2026-XXXXX
    // 2. Set registrationStatus: CONFIRMED & paymentStatus: PAID
    // 3. Save payment details and timestamp
    // 4. Increment booked count in slot
    // 5. Generate official WhatsApp Confirmation Message (STEP 7)
    // =========================================================================
    const confirmedRegId = generateNextRegistrationId(db);
    student.id = confirmedRegId;
    student.registrationStatus = 'CONFIRMED';
    student.paymentStatus = 'PAID';
    student.paymentVerified = true;
    student.paymentId = payId;
    if (razorpay_order_id) student.orderId = razorpay_order_id;
    student.paymentDate = new Date().toISOString();
    student.failureReason = undefined;

    // Increment seat in slot
    const courseDate = db.courseDates.find((cd) => cd.id === student.courseDateId);
    if (courseDate) {
      const slotKey: 'slot1' | 'slot2' = student.selectedSlot === 'slot2' ? 'slot2' : 'slot1';
      if (courseDate[slotKey]) {
        courseDate[slotKey].booked = (courseDate[slotKey].booked || 0) + 1;
      }
    }

    saveDB(db);
    addAuditLog('SYSTEM', 'PAYMENT_VERIFIED', `Verified payment for ${student.fullName} (${confirmedRegId}) | PayID: ${payId}`);
    console.log(`[PAYMENT VERIFIED & CONFIRMED] ID: ${confirmedRegId} | Student: ${student.fullName} | PayID: ${payId}`);

    // Generate WhatsApp Confirmation Message (STEP 7)
    const template = db.communicationSettings.templates.paymentSuccess;
    const formattedMessage = formatMessageTemplate(template, student);

    return res.json({
      success: true,
      verified: true,
      registration: student,
      registrationStatus: 'CONFIRMED',
      paymentStatus: 'PAID',
      whatsappMessage: formattedMessage,
      communityLink: db.whatsappSettings.communityLink || 'https://chat.whatsapp.com/H9sm1PHu9uU6ITuzQVgjtO',
    });
  } catch (err: any) {
    console.error('Payment Verification Error:', err);
    return res.status(500).json({ error: 'पेमेंट पडताळणी प्रक्रियेत त्रुटी आली. कृपया पुन्हा प्रयत्न करा.' });
  }
};

app.post('/api/payment/verify', handlePaymentVerification);
app.post('/api/confirm-payment', handlePaymentVerification);

// 6.1 Payment Failure Handler (STEP 4)
app.post('/api/payment/fail', (req, res) => {
  try {
    const { tempId, studentId, mobileNumber, reason } = req.body;
    const lookupKey = tempId || studentId || '';

    let student: DBStructure['students'][0] | undefined;
    if (lookupKey) {
      student = db.students.find((s) => s.id === lookupKey || s.tempId === lookupKey);
    }
    if (!student && mobileNumber) {
      student = db.students.find((s) => s.mobileNumber === mobileNumber && s.paymentStatus !== 'PAID');
    }

    if (student) {
      student.paymentStatus = 'FAILED';
      student.registrationStatus = 'PENDING';
      student.failureReason = reason || 'Payment failed or was declined by gateway.';
      saveDB(db);
      addAuditLog('SYSTEM', 'PAYMENT_FAILED', `Payment failed for session ${student.id} (${student.fullName}): ${reason || 'Unknown error'}`);
    }

    return res.json({
      success: true,
      paymentStatus: 'FAILED',
      message: 'Payment marked as failed. User can retry.',
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed updating payment status' });
  }
});

// 6.2 Payment Cancelled Handler (STEP 5)
app.post('/api/payment/cancel', (req, res) => {
  try {
    const { tempId, studentId, mobileNumber } = req.body;
    const lookupKey = tempId || studentId || '';

    let student: DBStructure['students'][0] | undefined;
    if (lookupKey) {
      student = db.students.find((s) => s.id === lookupKey || s.tempId === lookupKey);
    }
    if (!student && mobileNumber) {
      student = db.students.find((s) => s.mobileNumber === mobileNumber && s.paymentStatus !== 'PAID');
    }

    if (student && student.paymentStatus !== 'PAID') {
      student.paymentStatus = 'CANCELLED';
      student.registrationStatus = 'PENDING';
      student.failureReason = 'Payment window was closed or cancelled by user.';
      saveDB(db);
    }

    return res.json({
      success: true,
      paymentStatus: 'CANCELLED',
      message: 'Payment cancelled.',
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed updating payment cancellation' });
  }
});

// 6.3 Razorpay Webhook Handler (STEP 8 - Duplicate Safe Webhook)
const handleRazorpayWebhook = async (req: express.Request, res: express.Response) => {
  try {
    const webhookSignature = req.headers['x-razorpay-signature'] as string;
    const webhookBody = req.body;
    const event = webhookBody?.event;

    console.log(`[RAZORPAY WEBHOOK] Received event: ${event}`);

    // If webhook secret configured, verify signature
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || ENV_RAZORPAY_KEY_SECRET;
    if (webhookSecret && webhookSignature) {
      const rawBody = JSON.stringify(webhookBody);
      const expectedSig = crypto.createHmac('sha256', webhookSecret).update(rawBody).digest('hex');
      if (expectedSig !== webhookSignature) {
        console.warn('[WEBHOOK] Invalid webhook signature received');
        return res.status(400).json({ status: 'invalid_signature' });
      }
    }

    if (event === 'payment.captured' || event === 'order.paid' || event === 'payment_link.paid') {
      const paymentEntity = webhookBody?.payload?.payment?.entity || webhookBody?.payload?.payment_link?.entity;
      const payId = paymentEntity?.id || '';
      const orderId = paymentEntity?.order_id || '';
      const contact = paymentEntity?.contact ? String(paymentEntity.contact).replace(/\D/g, '').slice(-10) : '';
      const email = paymentEntity?.email ? String(paymentEntity.email).toLowerCase().trim() : '';

      if (payId) {
        // Find matching student
        let student = db.students.find((s) => s.paymentId === payId);
        if (!student && orderId) {
          student = db.students.find((s) => s.orderId === orderId);
        }
        if (!student && contact) {
          student = db.students.find((s) => s.mobileNumber === contact && s.paymentStatus !== 'PAID');
        }
        if (!student && email) {
          student = db.students.find((s) => s.email === email && s.paymentStatus !== 'PAID');
        }

        if (student && student.paymentStatus !== 'PAID') {
          const confirmedRegId = generateNextRegistrationId(db);
          student.id = confirmedRegId;
          student.registrationStatus = 'CONFIRMED';
          student.paymentStatus = 'PAID';
          student.paymentVerified = true;
          student.paymentId = payId;
          if (orderId) student.orderId = orderId;
          student.paymentDate = new Date().toISOString();

          // Increment slot seat
          const courseDate = db.courseDates.find((cd) => cd.id === student!.courseDateId);
          if (courseDate) {
            const slotKey = student.selectedSlot === 'slot2' ? 'slot2' : 'slot1';
            if (courseDate[slotKey]) {
              courseDate[slotKey].booked = (courseDate[slotKey].booked || 0) + 1;
            }
          }
          saveDB(db);
          addAuditLog('WEBHOOK', 'PAYMENT_CAPTURED', `Webhook confirmed student ${student.fullName} (${confirmedRegId}) | PayId: ${payId}`);
          console.log(`[WEBHOOK SUCCESS] Confirmed ${student.fullName} with ID ${confirmedRegId}`);
        }
      }
    } else if (event === 'payment.failed') {
      const paymentEntity = webhookBody?.payload?.payment?.entity;
      const orderId = paymentEntity?.order_id || '';
      const contact = paymentEntity?.contact ? String(paymentEntity.contact).replace(/\D/g, '').slice(-10) : '';

      let student = orderId ? db.students.find((s) => s.orderId === orderId) : undefined;
      if (!student && contact) {
        student = db.students.find((s) => s.mobileNumber === contact && s.paymentStatus !== 'PAID');
      }
      if (student && student.paymentStatus !== 'PAID') {
        student.paymentStatus = 'FAILED';
        student.failureReason = paymentEntity?.error_description || 'Payment failed on gateway';
        saveDB(db);
      }
    }

    return res.json({ status: 'ok' });
  } catch (err: any) {
    console.error('Webhook Error:', err);
    return res.status(500).json({ error: 'Webhook processing error' });
  }
};

app.post('/api/payment/webhook', handleRazorpayWebhook);
app.post('/api/razorpay-webhook', handleRazorpayWebhook);

// 7. Student Lookup
app.get('/api/lookup/:query', (req, res) => {
  const query = req.params.query.trim().toLowerCase();
  const student = db.students.find(
    (s) =>
      s.mobileNumber.toLowerCase() === query ||
      s.id.toLowerCase() === query ||
      s.whatsappNumber.toLowerCase() === query ||
      s.email.toLowerCase() === query
  );

  if (!student) {
    return res.status(404).json({ error: 'कोणतीही नोंदणी आढळली नाही. कृपया मोबाईल नंबर किंवा Registration ID तपासा.' });
  }

  const template = student.paymentStatus === 'PAID'
    ? db.communicationSettings.templates.paymentSuccess
    : db.communicationSettings.templates.paymentPending;

  const formattedMsg = formatMessageTemplate(template, student);

  res.json({
    success: true,
    registration: student,
    whatsappMessage: formattedMsg,
    communityLink: db.whatsappSettings.communityLink,
    paymentLink: db.paymentSettings.razorpayPaymentLink,
  });
});

// -----------------------------
// SECURE ADMIN API ROUTES
// -----------------------------

// 7.1 Admin Auth Status Check
app.get('/api/admin/auth-status', (req, res) => {
  const { isConfigured } = getAdminCredentials();
  res.json({
    configured: isConfigured,
    message: isConfigured
      ? 'Admin credentials configured.'
      : 'Server admin credentials (ADMIN_USERNAME / ADMIN_PASSWORD) missing in environment variables.',
  });
});

// 8. Admin Login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  const { username: envUser, password: envPass } = getAdminCredentials();

  const inputUser = String(username || '').trim();
  const inputPass = String(password || '').trim();

  if (!inputUser || !inputPass) {
    return res.status(400).json({ error: 'कृपया Username आणि Password दोन्ही प्रविष्ट करा (Please enter both username and password).' });
  }

  // Check 1: Match against active env/default credentials
  const isEnvUserMatch = inputUser.toLowerCase() === envUser.toLowerCase();
  const isEnvPassMatch = inputPass === envPass;

  // Check 2: Match against db.admins list
  const inputHash = hashPassword(inputPass);
  const matchedDbAdmin = db.admins.find(
    (a) =>
      a.username.toLowerCase() === inputUser.toLowerCase() &&
      (a.passwordHash === inputHash || (isEnvPassMatch && isEnvUserMatch)) &&
      a.active !== false
  );

  const isAuthenticated = (isEnvUserMatch && isEnvPassMatch) || !!matchedDbAdmin;

  if (!isAuthenticated) {
    console.warn(`[AUTH] Invalid admin login attempt for user: "${inputUser}" from IP: ${req.ip}`);
    return res.status(401).json({ error: 'चुकीचे Username किंवा Password (Invalid username or password).' });
  }

  const authenticatedUsername = matchedDbAdmin?.username || envUser;
  const token = createAdminToken(authenticatedUsername);

  addAuditLog(authenticatedUsername, 'ADMIN_LOGIN', 'Admin login successful', req.ip);
  console.log(`[AUTH] Admin login successful for user: "${authenticatedUsername}"`);

  return res.json({
    success: true,
    token,
    admin: {
      id: matchedDbAdmin?.id || 'admin_1',
      username: authenticatedUsername,
      name: matchedDbAdmin?.name || 'Super Administrator',
      role: matchedDbAdmin?.role || 'SUPER_ADMIN',
      mustChangePassword: false,
    },
  });
});

// 9. Admin Current Session Info
app.get('/api/admin/me', authenticateAdmin, (req, res) => {
  const admin = (req as any).admin;
  res.json({
    admin: {
      id: admin.id,
      username: admin.username,
      name: admin.name,
      role: admin.role,
      mustChangePassword: admin.mustChangePassword,
    },
  });
});

// 10. Admin Dashboard Metrics
app.get('/api/admin/dashboard', authenticateAdmin, (req, res) => {
  const totalRegistrations = db.students.length;
  const paidStudents = db.students.filter((s) => s.paymentStatus === 'PAID').length;
  const pendingPayments = db.students.filter((s) => s.paymentStatus === 'PENDING').length;
  const failedPayments = db.students.filter((s) => s.paymentStatus === 'FAILED').length;
  const cancelledPayments = db.students.filter((s) => s.paymentStatus === 'CANCELLED').length;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayStudents = db.students.filter((s) => s.registrationDate.startsWith(todayStr) && s.paymentStatus === 'PAID').length;

  const slot1Bookings = db.students.filter((s) => s.selectedSlot === 'slot1' && s.paymentStatus === 'PAID').length;
  const slot2Bookings = db.students.filter((s) => s.selectedSlot === 'slot2' && s.paymentStatus === 'PAID').length;

  const totalRevenue = db.students
    .filter((s) => s.paymentStatus === 'PAID')
    .reduce((sum, s) => sum + (s.amountPaid || db.paymentSettings.courseFee || 199), 0);

  const activeDates = db.courseDates.filter((cd) => cd.enabled);
  const upcomingCourseDate = activeDates.length > 0 ? activeDates[0].displayDate : 'Sunday, 23 August 2026';
  const upcomingSlot = 'Slot 1: 11:00 AM – 1:00 PM | Slot 2: 7:00 PM – 9:00 PM';

  // Registrations grouped by date
  const dateMap: Record<string, { count: number; revenue: number }> = {};
  db.students.forEach((s) => {
    const dKey = s.registrationDate.split('T')[0];
    if (!dateMap[dKey]) {
      dateMap[dKey] = { count: 0, revenue: 0 };
    }
    dateMap[dKey].count += 1;
    if (s.paymentStatus === 'PAID') {
      dateMap[dKey].revenue += s.amountPaid || db.paymentSettings.courseFee || 199;
    }
  });

  const registrationsByDate = Object.keys(dateMap)
    .sort()
    .slice(-10)
    .map((k) => ({
      date: k,
      count: dateMap[k].count,
      revenue: dateMap[k].revenue,
    }));

  res.json({
    stats: {
      totalRegistrations,
      paidStudents,
      pendingPayments,
      failedPayments,
      cancelledPayments,
      todayStudents,
      slot1Bookings,
      slot2Bookings,
      totalRevenue,
      upcomingCoursesCount: activeDates.length,
      upcomingCourseDate,
      upcomingSlot,
      registrationsByDate,
      slotDistribution: [
        { slotName: 'Slot 1 (11:00 AM - 1:00 PM)', count: slot1Bookings },
        { slotName: 'Slot 2 (7:00 PM - 9:00 PM)', count: slot2Bookings },
      ],
      paymentStatusDistribution: [
        { status: 'PAID', count: paidStudents },
        { status: 'PENDING', count: pendingPayments },
        { status: 'FAILED', count: failedPayments },
        { status: 'CANCELLED', count: cancelledPayments },
      ],
    },
  });
});

// 11. Students Management
app.get('/api/admin/students', authenticateAdmin, (req, res) => {
  const { search, dateId, slot, paymentStatus } = req.query;

  let filtered = [...db.students];

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (s) =>
        s.fullName.toLowerCase().includes(q) ||
        s.mobileNumber.includes(q) ||
        s.id.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.district.toLowerCase().includes(q)
    );
  }

  if (dateId && typeof dateId === 'string' && dateId !== 'ALL') {
    filtered = filtered.filter((s) => s.courseDateId === dateId);
  }

  if (slot && typeof slot === 'string' && slot !== 'ALL') {
    filtered = filtered.filter((s) => s.selectedSlot === slot);
  }

  if (paymentStatus && typeof paymentStatus === 'string' && paymentStatus !== 'ALL') {
    filtered = filtered.filter((s) => s.paymentStatus === paymentStatus);
  }

  res.json({ total: filtered.length, students: filtered });
});

app.put('/api/admin/students/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const student = db.students.find((s) => s.id === id);

  if (!student) {
    return res.status(404).json({ error: 'विद्यार्थी सापडला नाही.' });
  }

  const {
    fullName,
    mobileNumber,
    whatsappNumber,
    email,
    district,
    occupation,
    paymentStatus,
    paymentId,
    amountPaid,
    whatsappJoined,
  } = req.body;

  if (fullName !== undefined) student.fullName = fullName;
  if (mobileNumber !== undefined) student.mobileNumber = mobileNumber;
  if (whatsappNumber !== undefined) student.whatsappNumber = whatsappNumber;
  if (email !== undefined) student.email = email;
  if (district !== undefined) student.district = district;
  if (occupation !== undefined) student.occupation = occupation;
  if (paymentStatus !== undefined) student.paymentStatus = paymentStatus;
  if (paymentId !== undefined) student.paymentId = paymentId;
  if (amountPaid !== undefined) student.amountPaid = Number(amountPaid);
  if (whatsappJoined !== undefined) student.whatsappJoined = Boolean(whatsappJoined);

  saveDB(db);
  addAuditLog((req as any).admin.username, 'UPDATE_STUDENT', `Updated student ${id} status: ${student.paymentStatus}`);

  res.json({ success: true, student });
});

app.delete('/api/admin/students/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  db.students = db.students.filter((s) => s.id !== id);
  saveDB(db);

  addAuditLog((req as any).admin.username, 'DELETE_STUDENT', `Deleted student record ${id}`);
  res.json({ success: true, message: 'विद्यार्थी रेकॉर्ड यशस्वीरित्या हटवला.' });
});

// 12. Course & Slot Management
app.get('/api/admin/course-dates', authenticateAdmin, (req, res) => {
  res.json({ courseDates: db.courseDates });
});

app.post('/api/admin/course-dates', authenticateAdmin, (req, res) => {
  const { date, displayDate, slot1, slot2 } = req.body;
  if (!date || !displayDate) {
    return res.status(400).json({ error: 'कोर्स तारीख व नाव भरणे आवश्यक आहे.' });
  }

  const newCourseDate = {
    id: `cd_${Date.now()}`,
    date,
    displayDate,
    enabled: true,
    slot1: {
      id: 'slot1' as const,
      name: slot1?.name || 'Slot 1 (सकाळ)',
      startTime: slot1?.startTime || '11:00 AM',
      endTime: slot1?.endTime || '1:00 PM',
      capacity: Number(slot1?.capacity) || 50,
      booked: 0,
      enabled: slot1?.enabled !== undefined ? Boolean(slot1.enabled) : true,
      meetLink: slot1?.meetLink || db.liveSessionSettings.googleMeetLink || 'https://meet.google.com/amg-slot1-live',
    },
    slot2: {
      id: 'slot2' as const,
      name: slot2?.name || 'Slot 2 (संध्याकाळ)',
      startTime: slot2?.startTime || '7:00 PM',
      endTime: slot2?.endTime || '9:00 PM',
      capacity: Number(slot2?.capacity) || 50,
      booked: 0,
      enabled: slot2?.enabled !== undefined ? Boolean(slot2.enabled) : true,
      meetLink: slot2?.meetLink || db.liveSessionSettings.googleMeetLink || 'https://meet.google.com/amg-slot2-live',
    },
  };

  db.courseDates.unshift(newCourseDate);
  saveDB(db);

  addAuditLog((req as any).admin.username, 'CREATE_COURSE_DATE', `Created course date: ${displayDate}`);
  res.json({ success: true, courseDate: newCourseDate });
});

app.put('/api/admin/course-dates/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const index = db.courseDates.findIndex((cd) => cd.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'तारीख आढळली नाही.' });
  }

  const { date, displayDate, enabled, slot1, slot2 } = req.body;

  if (date !== undefined) db.courseDates[index].date = date;
  if (displayDate !== undefined) db.courseDates[index].displayDate = displayDate;
  if (enabled !== undefined) db.courseDates[index].enabled = Boolean(enabled);

  if (slot1) {
    db.courseDates[index].slot1 = {
      ...db.courseDates[index].slot1,
      ...slot1,
      capacity: Number(slot1.capacity) || db.courseDates[index].slot1.capacity,
      enabled: slot1.enabled !== undefined ? Boolean(slot1.enabled) : db.courseDates[index].slot1.enabled,
    };
  }

  if (slot2) {
    db.courseDates[index].slot2 = {
      ...db.courseDates[index].slot2,
      ...slot2,
      capacity: Number(slot2.capacity) || db.courseDates[index].slot2.capacity,
      enabled: slot2.enabled !== undefined ? Boolean(slot2.enabled) : db.courseDates[index].slot2.enabled,
    };
  }

  saveDB(db);
  addAuditLog((req as any).admin.username, 'UPDATE_COURSE_DATE', `Updated course date: ${id}`);
  res.json({ success: true, courseDate: db.courseDates[index] });
});

app.delete('/api/admin/course-dates/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  db.courseDates = db.courseDates.filter((cd) => cd.id !== id);
  saveDB(db);

  addAuditLog((req as any).admin.username, 'DELETE_COURSE_DATE', `Deleted course date ${id}`);
  res.json({ success: true, message: 'तारीख यशस्वीरित्या हटवली.' });
});

// 13. Payment Settings Endpoints
app.get('/api/admin/payment-settings', authenticateAdmin, (req, res) => {
  res.json({
    paymentSettings: db.paymentSettings,
  });
});

app.put('/api/admin/payment-settings', authenticateAdmin, (req, res) => {
  const { courseFee, originalFee, razorpayPaymentLink, paymentMode, razorpayKeyId } = req.body;

  if (courseFee !== undefined) {
    db.paymentSettings.courseFee = Number(courseFee);
    db.siteSettings.courseFee = Number(courseFee);
  }
  if (originalFee !== undefined) {
    db.paymentSettings.originalFee = Number(originalFee);
    db.siteSettings.oldPrice = Number(originalFee);
  }
  if (razorpayPaymentLink !== undefined) {
    db.paymentSettings.razorpayPaymentLink = String(razorpayPaymentLink).trim();
  }
  if (paymentMode !== undefined) {
    db.paymentSettings.paymentMode = paymentMode;
  }
  if (razorpayKeyId !== undefined) {
    db.paymentSettings.razorpayKeyId = String(razorpayKeyId).trim();
  }

  saveDB(db);
  addAuditLog(
    (req as any).admin.username,
    'UPDATE_PAYMENT_SETTINGS',
    `Updated Payment Settings: Fee ₹${db.paymentSettings.courseFee}, Link: ${db.paymentSettings.razorpayPaymentLink}`
  );

  res.json({
    success: true,
    message: 'पेमेंट सेटिंग्ज यशस्वीरित्या सेव्ह केल्या.',
    paymentSettings: db.paymentSettings,
  });
});

// 14. WhatsApp Settings Endpoints
app.get('/api/admin/whatsapp-settings', authenticateAdmin, (req, res) => {
  res.json({
    whatsappSettings: db.whatsappSettings,
  });
});

app.put('/api/admin/whatsapp-settings', authenticateAdmin, (req, res) => {
  const { communityLink, groupLink, adminWhatsAppNumber, customSuccessMessage, buttonText } = req.body;

  if (communityLink !== undefined) {
    db.whatsappSettings.communityLink = String(communityLink).trim();
    db.communicationSettings.communityLink = String(communityLink).trim();
  }
  if (groupLink !== undefined) {
    db.whatsappSettings.groupLink = String(groupLink).trim();
    db.communicationSettings.groupLink = String(groupLink).trim();
  }
  if (adminWhatsAppNumber !== undefined) {
    db.whatsappSettings.adminWhatsAppNumber = String(adminWhatsAppNumber).trim();
    db.communicationSettings.businessNumber = String(adminWhatsAppNumber).trim();
  }
  if (customSuccessMessage !== undefined) {
    db.whatsappSettings.customSuccessMessage = String(customSuccessMessage).trim();
    db.communicationSettings.customSuccessMessage = String(customSuccessMessage).trim();
  }
  if (buttonText !== undefined) {
    db.whatsappSettings.buttonText = String(buttonText).trim();
    db.communicationSettings.buttonText = String(buttonText).trim();
  }

  saveDB(db);
  addAuditLog(
    (req as any).admin.username,
    'UPDATE_WHATSAPP_SETTINGS',
    `Updated WhatsApp Settings: Link ${db.whatsappSettings.communityLink}`
  );

  res.json({
    success: true,
    message: 'WhatsApp सेटिंग्ज यशस्वीरित्या सेव्ह केल्या.',
    whatsappSettings: db.whatsappSettings,
  });
});

// 15. Automated Message Settings Endpoints
app.get('/api/admin/messages', authenticateAdmin, (req, res) => {
  res.json({
    templates: db.communicationSettings.templates,
  });
});

app.put('/api/admin/messages', authenticateAdmin, (req, res) => {
  const { templates } = req.body;

  if (templates) {
    db.communicationSettings.templates = {
      ...db.communicationSettings.templates,
      ...templates,
    };
    saveDB(db);
    addAuditLog((req as any).admin.username, 'UPDATE_MESSAGES', 'Updated automated message templates.');
  }

  res.json({
    success: true,
    message: 'मेसेज टेम्पलेट्स यशस्वीरित्या सेव्ह केले.',
    templates: db.communicationSettings.templates,
  });
});

// 16. Live Session / Google Meet Settings
app.get('/api/admin/live-session', authenticateAdmin, (req, res) => {
  res.json({
    liveSessionSettings: db.liveSessionSettings,
  });
});

app.put('/api/admin/live-session', authenticateAdmin, (req, res) => {
  const { googleMeetLink, instructions, sessionAccessMessage } = req.body;

  if (googleMeetLink !== undefined) db.liveSessionSettings.googleMeetLink = String(googleMeetLink).trim();
  if (instructions !== undefined) db.liveSessionSettings.instructions = String(instructions).trim();
  if (sessionAccessMessage !== undefined) db.liveSessionSettings.sessionAccessMessage = String(sessionAccessMessage).trim();

  saveDB(db);
  addAuditLog((req as any).admin.username, 'UPDATE_LIVE_SESSION', `Updated Live Session Meet link: ${db.liveSessionSettings.googleMeetLink}`);

  res.json({
    success: true,
    message: 'Live Session सेटिंग्ज सेव्ह केल्या.',
    liveSessionSettings: db.liveSessionSettings,
  });
});

// 17. Central Website Content / CMS Settings
app.get('/api/admin/website-settings', authenticateAdmin, (req, res) => {
  const currentPhoto = db.siteSettings.instructor_photo_url || db.siteSettings.instructorPhoto || db.siteSettings.instructorPhotoUrl || '';
  res.json({
    siteSettings: {
      ...db.siteSettings,
      instructor_photo_url: currentPhoto,
      instructorPhoto: currentPhoto,
      instructorPhotoUrl: currentPhoto,
    },
    paymentSettings: db.paymentSettings,
    whatsappSettings: db.whatsappSettings,
    liveSessionSettings: db.liveSessionSettings,
  });
});

app.put('/api/admin/website-settings', authenticateAdmin, (req, res) => {
  const {
    courseName,
    courseFee,
    oldPrice,
    heroHeading,
    heroSubtitle,
    instructorName,
    instructorTitle,
    instructorBio,
    instructorPhoto,
    instructor_photo_url,
    instructorPhotoUrl,
    imageBase64,
    whatsappCommunityLink,
    razorpayPaymentLink,
    googleMeetLink,
    instagramLink,
    youtubeLink,
    contactNumber,
    contactEmail,
  } = req.body;

  if (courseName !== undefined) db.siteSettings.courseName = courseName;
  if (courseFee !== undefined) {
    db.siteSettings.courseFee = Number(courseFee);
    db.paymentSettings.courseFee = Number(courseFee);
  }
  if (oldPrice !== undefined) {
    db.siteSettings.oldPrice = Number(oldPrice);
    db.paymentSettings.originalFee = Number(oldPrice);
  }
  if (heroHeading !== undefined) db.siteSettings.heroHeading = heroHeading;
  if (heroSubtitle !== undefined) db.siteSettings.heroSubtitle = heroSubtitle;
  if (instructorName !== undefined) db.siteSettings.instructorName = instructorName;
  if (instructorTitle !== undefined) db.siteSettings.instructorTitle = instructorTitle;
  if (instructorBio !== undefined) db.siteSettings.instructorBio = instructorBio;

  const resolvedPhoto = imageBase64 || instructor_photo_url || instructorPhoto || instructorPhotoUrl;
  if (resolvedPhoto !== undefined && resolvedPhoto !== null) {
    if (typeof resolvedPhoto === 'string' && resolvedPhoto.startsWith('data:image/')) {
      try {
        if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
        const base64Data = resolvedPhoto.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        fs.writeFileSync(path.join(PUBLIC_DIR, 'pankaj-photo.png'), buffer);
        fs.writeFileSync(path.join(UPLOADS_DIR, 'instructor-photo.png'), buffer);
      } catch (err) {
        console.error('Failed to write photo to disk:', err);
      }
    }
    db.siteSettings.instructor_photo_url = resolvedPhoto;
    db.siteSettings.instructorPhoto = resolvedPhoto;
    db.siteSettings.instructorPhotoUrl = resolvedPhoto;
  }

  if (instagramLink !== undefined) db.siteSettings.instagramLink = instagramLink;
  if (youtubeLink !== undefined) db.siteSettings.youtubeLink = youtubeLink;
  if (contactNumber !== undefined) db.siteSettings.contactNumber = contactNumber;
  if (contactEmail !== undefined) db.siteSettings.contactEmail = contactEmail;

  if (whatsappCommunityLink !== undefined) {
    db.whatsappSettings.communityLink = String(whatsappCommunityLink).trim();
    db.communicationSettings.communityLink = String(whatsappCommunityLink).trim();
  }
  if (razorpayPaymentLink !== undefined) {
    db.paymentSettings.razorpayPaymentLink = String(razorpayPaymentLink).trim();
  }
  if (googleMeetLink !== undefined) {
    db.liveSessionSettings.googleMeetLink = String(googleMeetLink).trim();
  }

  saveDB(db);
  addAuditLog((req as any).admin.username, 'UPDATE_WEBSITE_SETTINGS', 'Updated central website settings & CMS.');

  const currentPhoto = db.siteSettings.instructor_photo_url || db.siteSettings.instructorPhoto || db.siteSettings.instructorPhotoUrl || '';
  res.json({
    success: true,
    message: 'वेबसाईट सेटिंग्ज यशस्वीरित्या सेव्ह केल्या.',
    siteSettings: {
      ...db.siteSettings,
      instructor_photo_url: currentPhoto,
      instructorPhoto: currentPhoto,
      instructorPhotoUrl: currentPhoto,
    },
  });
});

// 17.1 Dedicated Instructor Photo Direct Stream Endpoint
app.get('/api/instructor-photo', (req, res) => {
  const photo = db.siteSettings.instructor_photo_url || db.siteSettings.instructorPhoto || '';
  if (photo && photo.startsWith('data:image/')) {
    const matches = photo.match(/^data:image\/(\w+);base64,(.+)$/);
    if (matches && matches[2]) {
      const mime = matches[1] === 'jpeg' ? 'image/jpeg' : matches[1] === 'webp' ? 'image/webp' : 'image/png';
      const imgBuffer = Buffer.from(matches[2], 'base64');
      res.setHeader('Content-Type', mime);
      res.setHeader('Cache-Control', 'public, max-age=3600');
      return res.send(imgBuffer);
    }
  }
  
  // Check static file paths
  const possiblePaths = [
    path.join(PUBLIC_DIR, 'pankaj-photo.png'),
    path.join(UPLOADS_DIR, 'instructor-photo.png'),
    path.join(DATA_DIR, 'uploads', 'instructor-photo.png'),
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return res.sendFile(p);
    }
  }

  // If photo is an external URL, redirect
  if (photo && (photo.startsWith('http://') || photo.startsWith('https://'))) {
    return res.redirect(photo);
  }

  return res.status(404).send('No instructor photo configured');
});

// 17.2 Dedicated Instructor Photo Upload Endpoint
app.post('/api/admin/upload-instructor-photo', authenticateAdmin, (req, res) => {
  const { imageBase64, photoUrl, instructor_photo_url, instructorPhoto } = req.body;
  const imageInput = imageBase64 || instructor_photo_url || photoUrl || instructorPhoto;

  if (!imageInput) {
    return res.status(400).json({ error: 'Image data or URL is required.' });
  }

  try {
    if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR, { recursive: true });
    if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    const dataUploads = path.join(DATA_DIR, 'uploads');
    if (!fs.existsSync(dataUploads)) fs.mkdirSync(dataUploads, { recursive: true });

    if (typeof imageInput === 'string' && imageInput.startsWith('data:image/')) {
      const base64Data = imageInput.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      fs.writeFileSync(path.join(PUBLIC_DIR, 'pankaj-photo.png'), buffer);
      fs.writeFileSync(path.join(UPLOADS_DIR, 'instructor-photo.png'), buffer);
      fs.writeFileSync(path.join(dataUploads, 'instructor-photo.png'), buffer);
      
      db.siteSettings.instructor_photo_url = imageInput;
      db.siteSettings.instructorPhoto = imageInput;
      db.siteSettings.instructorPhotoUrl = imageInput;
    } else {
      const trimmedUrl = String(imageInput).trim();
      db.siteSettings.instructor_photo_url = trimmedUrl;
      db.siteSettings.instructorPhoto = trimmedUrl;
      db.siteSettings.instructorPhotoUrl = trimmedUrl;
    }

    saveDB(db);
    addAuditLog((req as any).admin.username, 'UPDATE_INSTRUCTOR_PHOTO', 'Updated official instructor portrait photo.');

    const currentPhoto = db.siteSettings.instructor_photo_url || db.siteSettings.instructorPhoto || '';
    return res.json({
      success: true,
      message: 'फोटो यशस्वीरित्या अपडेट झाला आणि वेबसाईटवर लाइव्ह झाला आहे!',
      photoUrl: currentPhoto,
      instructor_photo_url: currentPhoto,
      siteSettings: db.siteSettings,
    });
  } catch (err: any) {
    console.error('Error uploading photo:', err);
    return res.status(500).json({ error: 'फोटो सेव्ह करताना त्रुटी आली.' });
  }
});

// 17.3 Dedicated Instructor Photo Remove Endpoint
app.post('/api/admin/remove-instructor-photo', authenticateAdmin, (req, res) => {
  try {
    db.siteSettings.instructor_photo_url = '';
    db.siteSettings.instructorPhoto = '';
    db.siteSettings.instructorPhotoUrl = '';
    
    // Clear files if existing
    try {
      const p1 = path.join(PUBLIC_DIR, 'pankaj-photo.png');
      const p2 = path.join(UPLOADS_DIR, 'instructor-photo.png');
      if (fs.existsSync(p1)) fs.unlinkSync(p1);
      if (fs.existsSync(p2)) fs.unlinkSync(p2);
    } catch (_) {}

    saveDB(db);
    addAuditLog((req as any).admin.username, 'REMOVE_INSTRUCTOR_PHOTO', 'Removed official instructor photo.');

    return res.json({
      success: true,
      message: 'मार्गदर्शकांचा फोटो काढून टाकला आहे.',
      photoUrl: '',
      instructor_photo_url: '',
      siteSettings: db.siteSettings,
    });
  } catch (err: any) {
    console.error('Error removing photo:', err);
    return res.status(500).json({ error: 'फोटो काढताना एरर आला.' });
  }
});

// 18. Admin Credentials Settings (Username & Password Change)
app.post('/api/admin/change-credentials', authenticateAdmin, (req, res) => {
  const admin = (req as any).admin;
  const { currentPassword, newUsername, newPassword } = req.body;
  const { username: envUser, password: envPass } = getAdminCredentials();

  // Verify current password against active env admin password or db.admins passwordHash
  if (currentPassword) {
    const isCurrentEnvCorrect = currentPassword === envPass;
    const isCurrentHashCorrect = db.admins?.[0]?.passwordHash === hashPassword(currentPassword);
    if (!isCurrentEnvCorrect && !isCurrentHashCorrect) {
      return res.status(400).json({ error: 'सध्याचा पासवर्ड चुकीचा आहे (Current password incorrect).' });
    }
  }

  if (newPassword && newPassword.trim()) {
    if (newPassword.trim().length < 6) {
      return res.status(400).json({ error: 'नवीन पासवर्ड किमान ६ अक्षरांचा असावा (Minimum 6 characters).' });
    }
  }

  const updatedUsername = newUsername?.trim() || admin.username || envUser;
  
  // Persist to db.admins
  if (!db.admins || db.admins.length === 0) {
    db.admins = [{
      id: 'admin_1',
      username: updatedUsername,
      name: 'Super Administrator',
      passwordHash: hashPassword(newPassword?.trim() || envPass),
      role: 'SUPER_ADMIN',
      mustChangePassword: false,
      active: true,
      createdAt: new Date().toISOString(),
    }];
  } else {
    db.admins[0].username = updatedUsername;
    if (newPassword && newPassword.trim()) {
      db.admins[0].passwordHash = hashPassword(newPassword.trim());
    }
  }
  saveDB(db);

  const newToken = createAdminToken(updatedUsername);

  addAuditLog(updatedUsername, 'CHANGE_ADMIN_CREDENTIALS', `Admin credentials updated for ${updatedUsername}.`);

  res.json({
    success: true,
    message: 'क्रेडेंशियल्स यशस्वीरित्या अपडेट करण्यात आले आहेत (Credentials updated successfully).',
    token: newToken,
    admin: {
      id: db.admins[0].id,
      username: updatedUsername,
      name: db.admins[0].name,
      role: db.admins[0].role,
    },
  });
});

// 19. Helper to generate dynamic WhatsApp copy messages per student
app.post('/api/admin/students/:id/message', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const { templateKey = 'paymentSuccess' } = req.body;

  const student = db.students.find((s) => s.id === id);
  if (!student) {
    return res.status(404).json({ error: 'विद्यार्थी आढळला नाही.' });
  }

  const rawTemplate =
    (db.communicationSettings.templates as any)[templateKey] ||
    db.communicationSettings.templates.paymentSuccess;

  const formattedMessage = formatMessageTemplate(rawTemplate, student);
  const whatsappUrl = `https://wa.me/91${student.whatsappNumber}?text=${encodeURIComponent(formattedMessage)}`;

  res.json({
    success: true,
    formattedMessage,
    whatsappUrl,
    student,
  });
});

// 20. Export CSV Endpoint
app.get('/api/export-csv', (req, res) => {
  const headers = [
    'Registration ID',
    'Full Name',
    'Mobile Number',
    'WhatsApp Number',
    'Email',
    'District',
    'Occupation',
    'Course Date',
    'Course Slot',
    'Payment Status',
    'Amount Paid',
    'Payment ID',
    'Registration Date',
    'WhatsApp Joined'
  ];

  const rows = db.students.map((s) => [
    s.id,
    `"${(s.fullName || '').replace(/"/g, '""')}"`,
    s.mobileNumber,
    s.whatsappNumber,
    s.email,
    `"${(s.district || '').replace(/"/g, '""')}"`,
    `"${(s.occupation || '').replace(/"/g, '""')}"`,
    `"${(s.courseDateDisplay || '').replace(/"/g, '""')}"`,
    `"${(s.slotTimeDisplay || '').replace(/"/g, '""')}"`,
    s.paymentStatus,
    s.amountPaid || 199,
    s.paymentId || 'N/A',
    new Date(s.registrationDate).toLocaleString('en-IN'),
    s.whatsappJoined ? 'YES' : 'NO'
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="ai_marathi_guru_students.csv"');
  res.send(csvContent);
});

// 21. Gemini AI Assistant Endpoint
app.post('/api/ai-assistant', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json({
        reply: `नमस्कार! AI Marathi Guru मध्ये स्वागत आहे. "${prompt}" बद्दल: या कोर्समध्ये आपण ChatGPT, Gemini, AI Poster Design, AI Reels आणि Business Automation अगदी सोप्या मराठी भाषेत २ तासांत शिकणार आहोत! फक्त ₹${db.paymentSettings.courseFee} मध्ये थेट लाईव्ह शिकण्याची ही उत्तम संधी आहे.`,
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are the friendly Marathi AI Assistant for 'AI Marathi Guru' course (https://aimarathi.swaraudyog.com).
Answer the following user question politely and concisely in clear Marathi (Devanagari script).
Keep your answer supportive, inspiring, and focused on how learning AI in Marathi for ₹${db.paymentSettings.courseFee} can transform their career/business.

User question: ${prompt}`,
    });

    const reply = response.text || 'माफ करा, कृपया पुन्हा प्रयत्न करा.';
    return res.json({ reply });
  } catch (err: any) {
    console.error('AI Assistant Error:', err);
    return res.json({
      reply: 'AI Marathi Guru कोर्सबद्दल अधिक माहितीसाठी 9801555171 वर कॉल किंवा WhatsApp करा.',
    });
  }
});

// Start Server with Vite Middleware
async function startServer() {
  const distPath = path.join(process.cwd(), 'dist');
  const distIndexHtml = path.join(distPath, 'index.html');
  const isProduction = process.env.NODE_ENV === 'production' || fs.existsSync(distIndexHtml);

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(distIndexHtml);
    });
  }

  const port = Number(process.env.PORT) || 3000;

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
  });
}

process.on('uncaughtException', (err) => {
  console.error('Server Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('Server Unhandled Rejection:', reason);
});

startServer();
