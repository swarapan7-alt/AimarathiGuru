import React from 'react';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  CreditCard,
  MessageCircle,
  Video,
  Mail,
  Globe,
  Settings,
  LogOut,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { BrandLogo } from '../BrandLogo';

export type AdminTab =
  | 'dashboard'
  | 'students'
  | 'courses'
  | 'payment'
  | 'whatsapp'
  | 'live-session'
  | 'messages'
  | 'website'
  | 'settings';

interface AdminSidebarProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onLogout: () => void;
  onViewWebsite?: () => void;
  adminUser?: any;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  onSelectTab,
  onLogout,
  onViewWebsite,
  adminUser,
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', labelMr: 'डॅशबोर्ड', icon: LayoutDashboard },
    { id: 'students', label: 'Students', labelMr: 'विद्यार्थी यादी', icon: Users },
    { id: 'courses', label: 'Course & Slots', labelMr: 'कोर्स व स्लॉट्स', icon: CalendarDays },
    { id: 'payment', label: 'Payment Settings', labelMr: 'पेमेंट व Razorpay', icon: CreditCard },
    { id: 'whatsapp', label: 'WhatsApp Settings', labelMr: 'WhatsApp कम्युनिटी', icon: MessageCircle },
    { id: 'live-session', label: 'Live Session', labelMr: 'लाईव्ह क्लास (Meet)', icon: Video },
    { id: 'messages', label: 'Messages', labelMr: 'ऑटो मेसेज टेम्पलेट्स', icon: Mail },
    { id: 'website', label: 'Website Content', labelMr: 'वेबसाईट मजकूर', icon: Globe },
    { id: 'settings', label: 'Admin Settings', labelMr: 'पासवर्ड व सुरक्षा', icon: Settings },
  ];

  return (
    <aside className="w-56 lg:w-60 bg-[#0F172A] text-slate-200 flex flex-col justify-between shrink-0 h-screen overflow-y-auto border-r border-slate-800 select-none z-20">
      
      {/* Top Header */}
      <div>
        <div className="px-4 py-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <BrandLogo variant="compact" />
            <div>
              <div className="text-xs font-black text-white font-poppins tracking-wider">
                AMG CONTROL
              </div>
              <div className="text-[9px] text-amber-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                LIVE MANAGEMENT
              </div>
            </div>
          </div>
        </div>

        {/* User Card */}
        <div className="px-3 py-2 bg-slate-900/60 border-b border-slate-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-blue-600/30 border border-blue-500/40 text-blue-400 font-black text-[11px] flex items-center justify-center font-poppins">
              {(adminUser?.username || 'A').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="text-[11px] font-bold text-white truncate max-w-[100px]">
                {adminUser?.username || 'admin'}
              </div>
              <div className="text-[9px] text-slate-400 font-medium uppercase tracking-wider">
                {adminUser?.role || 'Super Admin'}
              </div>
            </div>
          </div>
          <span className="p-0.5 rounded bg-slate-800 text-slate-400" title="Protected System">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="p-2 space-y-0.5">
          {menuItems.map((item) => {
            const isActive = currentTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id as AdminTab)}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-bold transition text-left cursor-pointer ${
                  isActive
                    ? 'bg-[#1E3A8A] text-white shadow-xs font-extrabold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 font-medium'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <div className="flex flex-col min-w-0">
                  <span className="leading-tight truncate">{item.label}</span>
                  <span className="text-[9px] opacity-65 font-normal truncate">{item.labelMr}</span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Actions */}
      <div className="p-2.5 border-t border-slate-800 space-y-1.5">
        {onViewWebsite && (
          <button
            onClick={onViewWebsite}
            className="w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white text-[11px] font-bold transition border border-slate-700/60 cursor-pointer"
          >
            <ExternalLink className="w-3 h-3 text-slate-400" />
            <span>View Live Website</span>
          </button>
        )}

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 hover:text-white text-[11px] font-bold transition border border-red-800/40 cursor-pointer"
        >
          <LogOut className="w-3 h-3 text-red-400" />
          <span>Logout</span>
        </button>

        <div className="text-center text-[9px] text-slate-500 font-poppins pt-0.5">
          v3.0.0 • AI Marathi Guru
        </div>
      </div>

    </aside>
  );
};
