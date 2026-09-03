import React from 'react';
import { 
  Bell, 
  School, 
  FileText, 
  Smartphone, 
  Monitor, 
  Users, 
  CheckCircle2, 
  ShieldAlert,
  CalendarCheck
} from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  currentMode: 'SANDBOX' | 'BLUEPRINT';
  setMode: (mode: 'SANDBOX' | 'BLUEPRINT') => void;
  users: UserProfile[];
  selectedUserId: string;
  setSelectedUserId: (id: string) => void;
  deviceView: 'DESKTOP' | 'MOBILE_IOS' | 'MOBILE_ANDROID';
  setDeviceView: (view: 'DESKTOP' | 'MOBILE_IOS' | 'MOBILE_ANDROID') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMode,
  setMode,
  users,
  selectedUserId,
  setSelectedUserId,
  deviceView,
  setDeviceView
}) => {
  const currentUser = users.find(u => u.id === selectedUserId) || users[0];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
      {/* Top Banner: Emergency Demo Ribbon if critical */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Senior PM & Full-Stack Blueprint
          </span>
          <span className="hidden sm:inline text-slate-400">
            ระบบสื่อสารโรงเรียน ยุคใหม่: แก้ปัญหาข่าวสารล้น & เจาะจงกลุ่มเป้าหมาย 100%
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            PostgreSQL DDL Ready
          </span>
          <span className="flex items-center gap-1">
            <CalendarCheck className="w-3.5 h-3.5 text-sky-400" />
            Google & Apple Calendar Sync
          </span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & School Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-100">
              <School className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 tracking-tight text-lg">SchoolHub</span>
                <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                  Demo v2.4
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                โรงเรียนสาธิตวิทยานุสรณ์ (Smart Communication Platform)
              </p>
            </div>
          </div>

          {/* Center Mode Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-sm font-medium">
            <button
              id="nav-mode-sandbox"
              onClick={() => setMode('SANDBOX')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all ${
                currentMode === 'SANDBOX'
                  ? 'bg-white text-indigo-700 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Sandbox จำลองระบบจริง</span>
            </button>
            <button
              id="nav-mode-blueprint"
              onClick={() => setMode('BLUEPRINT')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all ${
                currentMode === 'BLUEPRINT'
                  ? 'bg-white text-indigo-700 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>สเปก & สถาปัตยกรรม (PRD & Tech Spec)</span>
            </button>
          </div>

          {/* Right Controls: Persona Switcher */}
          <div className="flex items-center gap-3">
            {currentMode === 'SANDBOX' && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 hidden md:inline font-medium">สวมบทบาท:</span>
                <select
                  id="persona-selector"
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="text-xs font-semibold bg-slate-50 border border-slate-300 text-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  <optgroup label="ฝั่งผู้ส่ง (Teacher)">
                    <option value="u_teacher_1">👩‍🏫 ครูวิภาดา (ครูประจำชั้น ม.1/2)</option>
                  </optgroup>
                  <optgroup label="ฝั่งผู้รับ (Parents)">
                    <option value="u_parent_1">👩 คุณมนิดา (แม่น้องภัทร ม.1/2)</option>
                    <option value="u_parent_2">👨 คุณธนากร (พ่อน้องมิน ม.4/1 วิทย์ & โยธวา)</option>
                    <option value="u_parent_3">👩 คุณพิมพา (แม่น้องฟ้า ม.4/2 ศิลป์)</option>
                  </optgroup>
                </select>
              </div>
            )}

            {/* Device Frame Switcher if in parent mode */}
            {currentMode === 'SANDBOX' && currentUser.role === 'PARENT' && (
              <div className="hidden lg:flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                <button
                  onClick={() => setDeviceView('DESKTOP')}
                  title="โหมดแสดงผลเต็มหน้าจอ"
                  className={`p-1.5 rounded-md ${deviceView === 'DESKTOP' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeviceView('MOBILE_IOS')}
                  title="จำลองหน้าจอ iOS iPhone (Human Interface Guidelines)"
                  className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1 ${deviceView === 'MOBILE_IOS' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>iOS</span>
                </button>
                <button
                  onClick={() => setDeviceView('MOBILE_ANDROID')}
                  title="จำลองหน้าจอ Android (Material 3)"
                  className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1 ${deviceView === 'MOBILE_ANDROID' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Android</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
