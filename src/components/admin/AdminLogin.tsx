import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { BrandLogo } from '../BrandLogo';

interface AdminLoginProps {
  onLoginSuccess: (token: string, adminUser: any) => void;
  onClose?: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem('amg_admin_token', data.token);
        onLoginSuccess(data.token, data.admin);
      } else {
        setErrorMessage(data.error || 'Invalid username or password (चुकीचे Username किंवा Password).');
      }
    } catch (err) {
      setErrorMessage('सर्व्हरशी संपर्क होऊ शकला नाही. कृपया इंटरनेट किंवा सर्व्हर कनेक्शन तपासा.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden relative">
        
        {/* Top Gradient Header */}
        <div className="bg-gradient-to-r from-[#1E3A8A] via-[#0F172A] to-[#0A192F] text-white p-8 text-center relative">
          <div className="flex justify-center mb-4">
            <BrandLogo variant="compact" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-[11px] font-black tracking-widest uppercase mb-2 border border-white/15">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> SECURE ADMIN PORTAL
          </div>
          <h2 className="text-2xl font-black text-white font-poppins">Admin Login</h2>
          <p className="text-xs text-slate-300 mt-1 font-marathi-sub">
            AI Marathi Guru मॅनेजमेंट सिस्टीममध्ये प्रवेश करा
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
          
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs font-bold text-red-700 flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Username */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5 font-poppins">
              <User className="w-3.5 h-3.5 text-slate-500" /> Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter admin username"
              className="w-full px-4 py-3 text-sm bg-stone-50 border border-stone-300 rounded-xl outline-none focus:border-[#1E3A8A] focus:bg-white transition font-medium"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5 font-poppins">
                <Lock className="w-3.5 h-3.5 text-slate-500" /> Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] font-bold text-slate-500 hover:text-slate-900 transition flex items-center gap-1 cursor-pointer"
              >
                {showPassword ? (
                  <>
                    <EyeOff className="w-3 h-3" /> Hide
                  </>
                ) : (
                  <>
                    <Eye className="w-3 h-3" /> Show
                  </>
                )}
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-3 text-sm bg-stone-50 border border-stone-300 rounded-xl outline-none focus:border-[#1E3A8A] focus:bg-white transition font-medium pr-10"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#1E3A8A] hover:bg-[#152865] text-white font-extrabold text-sm py-3.5 rounded-xl shadow-lg shadow-blue-900/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 uppercase tracking-wider font-poppins mt-2"
          >
            {isLoading ? (
              <span>प्रवेश होत आहे...</span>
            ) : (
              <>
                <span>Login to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Environmental credentials hint */}
          <div className="pt-2 text-center text-[11px] text-slate-400 font-medium">
            Protected by Session Token & Environment Variables
          </div>

          {onClose && (
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 transition underline cursor-pointer"
              >
                ← मुख्य वेबसाईटवर परत जा (Back to Website)
              </button>
            </div>
          )}

        </form>

      </div>
    </div>
  );
};
