import React, { useState } from 'react';
import {
  ShieldCheck,
  Key,
  User,
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Lock,
} from 'lucide-react';

interface AdminSecuritySettingsTabProps {
  adminUser?: any;
  onRefresh?: () => void;
}

export const AdminSecuritySettingsTab: React.FC<AdminSecuritySettingsTabProps> = ({
  adminUser,
  onRefresh,
}) => {
  const [currentUsername, setCurrentUsername] = useState(adminUser?.username || 'admin');
  const [newUsername, setNewUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSaveSuccess(false);

    if (newPassword && newPassword !== confirmPassword) {
      setErrorMessage('नवीन पासवर्ड आणि कन्फर्म पासवर्ड जुळत नाहीत.');
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setErrorMessage('नवीन पासवर्ड किमान ६ अक्षरांचा असावा.');
      return;
    }

    setIsSaving(true);
    const token = localStorage.getItem('amg_admin_token');

    try {
      const res = await fetch('/api/admin/change-credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newUsername: newUsername.trim() || undefined,
          newPassword: newPassword.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSaveSuccess(true);
        if (data.admin?.username) {
          setCurrentUsername(data.admin.username);
        }
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setNewUsername('');
        if (onRefresh) onRefresh();
        setTimeout(() => setSaveSuccess(false), 4000);
      } else {
        setErrorMessage(data.error || 'पासवर्ड बदलण्यात अडचण आली.');
      }
    } catch (e) {
      console.error(e);
      setErrorMessage('सर्व्हर एरर. कृपया पुन्हा प्रयत्न करा.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-black uppercase tracking-wider mb-2 font-poppins">
            <ShieldCheck className="w-3.5 h-3.5" /> Security & Credentials
          </div>
          <h1 className="text-xl font-black text-slate-900 font-poppins">
            Admin Settings & Password Management
          </h1>
          <p className="text-xs text-slate-500 font-marathi-sub">
            Admin लॉगिन युझरनेम आणि पासवर्ड सुरक्षितरीत्या बदला
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
        
        {saveSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold flex items-center gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Admin लॉगिन क्रेडेन्शियल यशस्वीरित्या अपडेट झाले आहेत!</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Current Info */}
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-slate-900 font-poppins">Current Admin Username</div>
              <div className="text-sm font-mono text-blue-600 font-bold">{currentUsername}</div>
            </div>
          </div>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full uppercase">
            Active Session
          </span>
        </div>

        {/* Change Username */}
        <div className="space-y-1.5">
          <label className="text-xs font-extrabold text-slate-700 block font-poppins">
            Change Username (नवीन युझरनेम - पर्यायी)
          </label>
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder="उदा. amg_director"
            className="w-full px-4 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl outline-none focus:border-blue-600"
          />
        </div>

        {/* Current Password Verification */}
        <div className="space-y-1.5 pt-2 border-t border-stone-200">
          <div className="flex items-center justify-between">
            <label className="text-xs font-extrabold text-slate-700 block font-poppins">
              Current Password (सध्याचा पासवर्ड)
            </label>
            <button
              type="button"
              onClick={() => setShowCurrentPass(!showCurrentPass)}
              className="text-[11px] font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
            >
              {showCurrentPass ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              <span>{showCurrentPass ? 'Hide' : 'Show'}</span>
            </button>
          </div>
          <input
            type={showCurrentPass ? 'text' : 'password'}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
            className="w-full px-4 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl outline-none focus:border-blue-600 font-mono"
          />
        </div>

        {/* New Password */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-slate-700 block font-poppins">
                New Password (नवीन पासवर्ड)
              </label>
              <button
                type="button"
                onClick={() => setShowNewPass(!showNewPass)}
                className="text-[11px] font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
              >
                {showNewPass ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                <span>{showNewPass ? 'Hide' : 'Show'}</span>
              </button>
            </div>
            <input
              type={showNewPass ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full px-4 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl outline-none focus:border-blue-600 font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-700 block font-poppins">
              Confirm New Password (पुन्हा नवीन पासवर्ड टाका)
            </label>
            <input
              type={showNewPass ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat new password"
              className="w-full px-4 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl outline-none focus:border-blue-600 font-mono"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-stone-200 flex items-center justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider transition shadow-lg shadow-blue-900/20 cursor-pointer disabled:opacity-50 font-poppins"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'सेव्ह होत आहे...' : 'Save Changes'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
