import React, { useState, useEffect } from 'react';
import { X, RefreshCw, LogOut, ExternalLink, ShieldCheck } from 'lucide-react';
import { AdminLogin } from './admin/AdminLogin';
import { AdminSidebar, AdminTab } from './admin/AdminSidebar';
import { AdminDashboardTab } from './admin/AdminDashboardTab';
import { AdminStudentsTab } from './admin/AdminStudentsTab';
import { AdminCourseSlotsTab } from './admin/AdminCourseSlotsTab';
import { AdminPaymentSettingsTab } from './admin/AdminPaymentSettingsTab';
import { AdminWhatsAppSettingsTab } from './admin/AdminWhatsAppSettingsTab';
import { AdminLiveSessionSettingsTab } from './admin/AdminLiveSessionSettingsTab';
import { AdminMessagesTab } from './admin/AdminMessagesTab';
import { AdminWebsiteSettingsTab } from './admin/AdminWebsiteSettingsTab';
import { AdminSecuritySettingsTab } from './admin/AdminSecuritySettingsTab';
import { StudentDetailModal } from './admin/StudentDetailModal';
import { RegistrationRecord, CourseDateRecord, AdminDashboardStats } from '../types';

interface AdminPanelProps {
  onClose?: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('amg_admin_token'));
  const [adminUser, setAdminUser] = useState<any>(null);
  const [currentTab, setCurrentTab] = useState<AdminTab>('dashboard');

  // Core Data
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [students, setStudents] = useState<RegistrationRecord[]>([]);
  const [courseDates, setCourseDates] = useState<CourseDateRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Selected student for detail modal
  const [selectedStudent, setSelectedStudent] = useState<RegistrationRecord | null>(null);

  // Verify auth session on mount
  useEffect(() => {
    if (token) {
      verifySession();
      loadAllAdminData();
    }
  }, [token]);

  const verifySession = async (tokenToUse?: string) => {
    const activeToken = tokenToUse || token;
    if (!activeToken) return;
    try {
      const res = await fetch('/api/admin/me', {
        headers: { Authorization: `Bearer ${activeToken}` },
      });
      const data = await res.json();
      if (res.ok && data.admin) {
        setAdminUser(data.admin);
      } else {
        // Expired or invalid
        handleLogout();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadAllAdminData = async (tokenToUse?: string) => {
    const activeToken = tokenToUse || token;
    if (!activeToken) return;
    setIsLoading(true);
    try {
      const [dashRes, studentsRes, coursesRes] = await Promise.all([
        fetch('/api/admin/dashboard', { headers: { Authorization: `Bearer ${activeToken}` } }),
        fetch('/api/admin/students', { headers: { Authorization: `Bearer ${activeToken}` } }),
        fetch('/api/admin/course-dates', { headers: { Authorization: `Bearer ${activeToken}` } }),
      ]);

      const [dashData, studentsData, coursesData] = await Promise.all([
        dashRes.json(),
        studentsRes.json(),
        coursesRes.json(),
      ]);

      if (dashRes.ok && dashData.stats) setStats(dashData.stats);
      if (studentsRes.ok && studentsData.students) setStudents(studentsData.students);
      if (coursesRes.ok && coursesData.courseDates) setCourseDates(coursesData.courseDates);
    } catch (e) {
      console.error('Failed loading admin data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = (newToken: string, user: any) => {
    localStorage.setItem('amg_admin_token', newToken);
    setToken(newToken);
    setAdminUser(user);
    loadAllAdminData(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('amg_admin_token');
    setToken(null);
    setAdminUser(null);
  };

  const handleUpdateStudentStatus = async (id: string, newStatus: 'PAID' | 'PENDING' | 'FAILED' | 'CANCELLED', newRegStatus?: 'CONFIRMED' | 'PENDING' | 'FAILED' | 'CANCELLED') => {
    try {
      const regStatus = newRegStatus || (newStatus === 'PAID' ? 'CONFIRMED' : 'PENDING');
      const res = await fetch(`/api/admin/students/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          paymentStatus: newStatus,
          registrationStatus: regStatus,
          paymentVerified: newStatus === 'PAID',
        }),
      });

      if (res.ok) {
        setStudents((prev) =>
          prev.map((s) => (s.id === id ? { ...s, paymentStatus: newStatus, registrationStatus: regStatus, paymentVerified: newStatus === 'PAID' } : s))
        );
        loadAllAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteStudent = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/students/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setStudents((prev) => prev.filter((s) => s.id !== id));
        loadAllAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleExportCsv = () => {
    window.open('/api/export-csv', '_blank');
  };

  // If not logged in, show Admin Login view
  if (!token) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-md overflow-y-auto">
        <div className="min-h-screen flex items-center justify-center p-4">
          <AdminLogin onLoginSuccess={handleLoginSuccess} onClose={onClose} />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#F8FAFC] flex flex-col md:flex-row overflow-hidden">
      
      {/* 1. Left Sidebar */}
      <AdminSidebar
        currentTab={currentTab}
        onSelectTab={(t) => setCurrentTab(t)}
        onLogout={handleLogout}
        onViewWebsite={onClose}
        adminUser={adminUser}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Top Minimal Admin Bar */}
        <header className="h-12 bg-white border-b border-stone-200 px-4 sm:px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-[11px] sm:text-xs font-black text-slate-500 uppercase tracking-wider font-poppins">
              AI MARATHI GURU CONTROL PANEL
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-bold text-slate-700 capitalize">
              {currentTab}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5">
            <button
              onClick={loadAllAdminData}
              disabled={isLoading}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition cursor-pointer"
                title="Return to Website"
              >
                <span>Live Site</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* Dynamic Tab Body */}
        <main className="flex-1 p-3 sm:p-4 md:p-5 overflow-y-auto bg-[#FAF8F5]">
          {currentTab === 'dashboard' && (
            <AdminDashboardTab
              stats={stats}
              students={students}
              onNavigateTab={(t) => setCurrentTab(t)}
              onRefresh={loadAllAdminData}
              onExportCsv={handleExportCsv}
            />
          )}

          {currentTab === 'students' && (
            <AdminStudentsTab
              students={students}
              courseDates={courseDates}
              onUpdateStatus={handleUpdateStudentStatus}
              onDeleteStudent={handleDeleteStudent}
              onViewStudent={(s) => setSelectedStudent(s)}
              onExportCsv={handleExportCsv}
              onRefresh={loadAllAdminData}
            />
          )}

          {currentTab === 'courses' && (
            <AdminCourseSlotsTab
              courseDates={courseDates}
              onRefresh={loadAllAdminData}
            />
          )}

          {currentTab === 'payment' && (
            <AdminPaymentSettingsTab onRefresh={loadAllAdminData} />
          )}

          {currentTab === 'whatsapp' && (
            <AdminWhatsAppSettingsTab onRefresh={loadAllAdminData} />
          )}

          {currentTab === 'live-session' && (
            <AdminLiveSessionSettingsTab onRefresh={loadAllAdminData} />
          )}

          {currentTab === 'messages' && (
            <AdminMessagesTab onRefresh={loadAllAdminData} />
          )}

          {currentTab === 'website' && (
            <AdminWebsiteSettingsTab onRefresh={loadAllAdminData} />
          )}

          {currentTab === 'settings' && (
            <AdminSecuritySettingsTab adminUser={adminUser} onRefresh={verifySession} />
          )}
        </main>

      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onUpdate={(updated) => {
            setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
            setSelectedStudent(updated);
            loadAllAdminData();
          }}
        />
      )}

    </div>
  );
};
