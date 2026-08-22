export type OccupationType =
  | 'Student'
  | 'Business Owner'
  | 'CSC Operator'
  | 'Maha e-Seva'
  | 'Digital Service Center'
  | 'Teacher'
  | 'Freelancer'
  | 'Job'
  | 'Other';

export type AdminRole =
  | 'SUPER_ADMIN'
  | 'COURSE_MANAGER'
  | 'PAYMENT_MANAGER'
  | 'COMMUNICATION_MANAGER';

export type PaymentStatus = 'PAID' | 'PENDING' | 'FAILED' | 'CANCELLED';
export type RegistrationStatus = 'CONFIRMED' | 'PENDING' | 'FAILED' | 'CANCELLED';

export interface CourseSlot {
  id: 'slot1' | 'slot2';
  name: string; // e.g. "Slot 1 (सकाळ)"
  startTime: string; // e.g. "11:00 AM"
  endTime: string; // e.g. "1:00 PM"
  capacity: number; // e.g. 50
  booked: number; // e.g. 28
  enabled: boolean;
  meetLink?: string;
  isFull?: boolean;
  availableSeats?: number;
}

export interface CourseDateRecord {
  id: string; // e.g. "cd_2026_08_16"
  date: string; // "2026-08-16"
  displayDate: string; // "Sunday, 16 August 2026"
  enabled: boolean;
  slot1: CourseSlot;
  slot2: CourseSlot;
}

export interface RegistrationFormData {
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
}

export interface RegistrationRecord extends RegistrationFormData {
  id: string; // e.g. AMG-2026-00001 (or temp session ID if pending)
  tempId?: string;
  registrationDate: string;
  registrationStatus?: RegistrationStatus;
  paymentStatus: PaymentStatus;
  paymentVerified?: boolean;
  paymentId: string;
  orderId?: string;
  amountPaid: number; // 199
  paymentDate?: string;
  failureReason?: string;
  whatsappJoined: boolean;
  meetLink?: string;
  reminderSent24h?: boolean;
  reminderSent2h?: boolean;
}

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  role: AdminRole;
  mustChangePassword: boolean;
  active: boolean;
  createdAt: string;
}

export interface PaymentSettings {
  courseFee: number;
  originalFee: number;
  razorpayPaymentLink: string;
  paymentMode?: 'payment_link' | 'razorpay_modal' | 'both';
  razorpayKeyId?: string;
  isLinkActive?: boolean;
}

export interface WhatsAppSettings {
  communityLink: string;
  groupLink: string;
  adminWhatsAppNumber: string;
  customSuccessMessage: string;
  buttonText: string;
}

export interface MessageTemplates {
  registrationSuccess: string;
  paymentPending: string;
  paymentSuccess: string;
  whatsappJoin: string;
  courseReminder: string;
  liveSessionMessage: string;
  reminder24h?: string;
  reminder2h?: string;
}

export interface LiveSessionSettings {
  googleMeetLink: string;
  instructions: string;
  sessionAccessMessage: string;
}

export interface CommunicationSettings {
  businessNumber: string;
  communityLink: string;
  groupLink: string;
  adminWhatsAppNumber?: string;
  customSuccessMessage?: string;
  buttonText?: string;
  supportLink: string;
  templates: MessageTemplates;
}

export interface CourseScreenshot {
  id: string;
  title: string;
  imageUrl: string;
  description?: string;
}

export interface SiteSettings {
  courseName: string;
  courseFee: number;
  oldPrice: number;
  heroHeading: string;
  heroSubtitle: string;
  contactNumber: string;
  contactEmail?: string;
  ctaText: string;
  websiteUrl: string;
  instagramLink: string;
  youtubeLink: string;
  instructorName?: string;
  instructorNameEn?: string;
  instructorTitle?: string;
  instructorBio?: string;
  instructorPhoto?: string;
  instructor_photo_url?: string;
  instructorPhotoUrl?: string;
  courseScreenshots?: CourseScreenshot[];
  modules: ModuleItem[];
  faqs: FAQItem[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  adminUsername: string;
  action: string;
  details: string;
  ip?: string;
}

export interface ModuleItem {
  id: number;
  title: string;
  titleEn: string;
  iconName: string;
  topics: string[];
  gradient: string;
}

export interface BenefitItem {
  title: string;
  description: string;
  icon: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface AdminDashboardStats {
  totalRegistrations: number;
  paidStudents: number;
  pendingPayments: number;
  failedPayments?: number;
  cancelledPayments?: number;
  todayStudents: number;
  slot1Bookings: number;
  slot2Bookings: number;
  totalRevenue: number;
  upcomingCoursesCount: number;
  upcomingCourseDate?: string;
  upcomingSlot?: string;
  registrationsByDate: Array<{ date: string; count: number; revenue: number }>;
  slotDistribution: Array<{ slotName: string; count: number }>;
  paymentStatusDistribution: Array<{ status: string; count: number }>;
}
