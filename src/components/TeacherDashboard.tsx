import React, { useState } from 'react';
import { 
  PlusCircle, 
  Send, 
  Users, 
  Eye, 
  BellRing, 
  AlertTriangle, 
  Calendar, 
  CheckCircle, 
  Clock, 
  X, 
  Filter, 
  Sparkles,
  Info,
  ChevronRight,
  UserCheck,
  UserX,
  Phone,
  CalendarDays
} from 'lucide-react';
import { Announcement, AnnouncementPriority, Classroom, ActivityGroup, ReadReceipt } from '../types';
import { CLASSROOMS, ACTIVITY_GROUPS } from '../data/mockData';

interface TeacherDashboardProps {
  announcements: Announcement[];
  onAddAnnouncement: (newAnn: Announcement) => void;
  readReceipts: ReadReceipt[];
  onRemindUnread: (announcementId: string) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  announcements,
  onAddAnnouncement,
  readReceipts,
  onRemindUnread,
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeReceiptModalAnnId, setActiveReceiptModalAnnId] = useState<string | null>(null);
  const [remindToast, setRemindToast] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<AnnouncementPriority>('GENERAL');
  const [scopeType, setScopeType] = useState<'ALL_SCHOOL' | 'SPECIFIC_CLASSES' | 'SPECIFIC_GROUPS'>('SPECIFIC_CLASSES');
  const [selectedClassrooms, setSelectedClassrooms] = useState<string[]>(['c_m1_2']);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [requiresAck, setRequiresAck] = useState(true);

  // Calendar Event state
  const [isCalendarEvent, setIsCalendarEvent] = useState(false);
  const [eventDate, setEventDate] = useState('2026-09-10');
  const [eventStartTime, setEventStartTime] = useState('09:00');
  const [eventEndTime, setEventEndTime] = useState('11:30');
  const [eventLocation, setEventLocation] = useState('ห้อง 312 อาคารเฉลิมพระเกียรติ');

  // Estimate audience size
  const estimateAudience = () => {
    if (scopeType === 'ALL_SCHOOL') return 1140;
    if (scopeType === 'SPECIFIC_CLASSES') {
      return selectedClassrooms.reduce((acc, cid) => {
        const cls = CLASSROOMS.find(c => c.id === cid);
        return acc + (cls ? cls.parentCount : 0);
      }, 0);
    }
    if (scopeType === 'SPECIFIC_GROUPS') {
      return selectedGroups.reduce((acc, gid) => {
        const grp = ACTIVITY_GROUPS.find(g => g.id === gid);
        return acc + (grp ? grp.memberCount : 0);
      }, 0);
    }
    return 0;
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim()) return;

    const estimated = estimateAudience();

    const newAnnouncement: Announcement = {
      id: `ann_${Date.now()}`,
      title: (priority === 'CRITICAL' ? '🚨 ' : priority === 'APPOINTMENT' ? '📅 ' : '📢 ') + title,
      summary,
      content,
      priority,
      author: {
        id: 'u_teacher_1',
        name: 'ครูวิภาดา สมบูรณ์',
        role: 'ครูประจำชั้น ม.1/2',
      },
      targets: {
        scopeType,
        gradeLevels: ['ม.1'],
        classroomIds: scopeType === 'SPECIFIC_CLASSES' ? selectedClassrooms : [],
        groupIds: scopeType === 'SPECIFIC_GROUPS' ? selectedGroups : [],
        roles: ['PARENT'],
      },
      targetCountEstimate: estimated,
      requiresAcknowledgment: requiresAck,
      createdAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
      isPinned: priority === 'CRITICAL',
      eventDetails: isCalendarEvent ? {
        startDateTime: `${eventDate}T${eventStartTime}:00+07:00`,
        endDateTime: `${eventDate}T${eventEndTime}:00+07:00`,
        location: eventLocation,
        requiresRsvp: true,
      } : undefined
    };

    onAddAnnouncement(newAnnouncement);
    setIsCreateModalOpen(false);
    // Reset Form
    setTitle('');
    setSummary('');
    setContent('');
    setPriority('GENERAL');
    setIsCalendarEvent(false);
  };

  const triggerRemind = (annId: string) => {
    onRemindUnread(annId);
    setRemindToast('ส่งแจ้งเตือนสะกิดผ่าน SMS & Push Notification ให้ผู้ปกครองที่ยังไม่ได้อ่านเรียบร้อยแล้ว!');
    setTimeout(() => setRemindToast(null), 4000);
  };

  // Get active announcement for modal
  const activeReceiptAnn = announcements.find(a => a.id === activeReceiptModalAnnId);
  const relevantReceipts = readReceipts.filter(r => r.announcementId === (activeReceiptModalAnnId || 'ann_appointment_m1_2'));
  const readCount = relevantReceipts.filter(r => r.isRead).length;
  const unreadCount = relevantReceipts.filter(r => !r.isRead).length;
  const ackCount = relevantReceipts.filter(r => r.acknowledgedAt).length;
  const readRate = relevantReceipts.length > 0 ? Math.round((readCount / relevantReceipts.length) * 100) : 85;

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {remindToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <BellRing className="w-5 h-5 text-amber-400 shrink-0" />
          <p className="text-sm font-medium">{remindToast}</p>
        </div>
      )}

      {/* Teacher Profile & Action Bar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-2xl shadow-xs">
            👩‍🏫
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">ครูวิภาดา สมบูรณ์</h1>
              <span className="bg-indigo-50 text-indigo-700 border border-indigo-200/60 text-xs font-semibold px-2 py-0.5 rounded-full">
                ครูประจำชั้น ม.1/2
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              กลุ่มสาระวิทยาศาสตร์ • ผู้ดูแลนักเรียน 38 คน • สื่อสารผ่าน Smart Filter
            </p>
            <div className="flex items-center gap-3 mt-2 text-xs text-slate-600">
              <span className="flex items-center gap-1 font-medium text-emerald-600">
                <CheckCircle className="w-3.5 h-3.5" />
                อัตราการอ่านเฉลี่ยภาคเรียนนี้: 92.4%
              </span>
              <span>•</span>
              <span className="text-slate-500">ลดเสียงรบกวนให้ผู้ปกครองอื่นได้ 97%</span>
            </div>
          </div>
        </div>

        <button
          id="btn-create-announcement"
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl font-medium shadow-sm transition-colors cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>สร้างประกาศใหม่ (Targeted)</span>
        </button>
      </div>

      {/* Philosophy Banner: Solving Information Overload */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/70 rounded-2xl p-4.5 flex items-start gap-3">
        <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-amber-900">
            ระบบแก้ปัญหา "ข่าวสารล้น" (Anti-Spam & Zero-Noise Architecture)
          </h2>
          <p className="text-xs text-amber-800/90 mt-1 leading-relaxed">
            ในอดีตผู้ปกครองได้รับข้อความในไลน์กลุ่ม 50+ ข้อความต่อวันโดย 80% ไม่เกี่ยวกับบุตรของตน 
            ระบบนี้บังคับให้ทุกประกาศต้องกำหนด <strong>Target Group (ระดับชั้น/ห้อง/ชมรม)</strong> และ <strong>Priority Tier</strong> เพื่อส่งตรงถึงเป้าหมาย 100% 
            และมี <strong>Read Receipts</strong> ตรวจสอบว่าผู้ปกครองทุกคนได้รับทราบข้อมูลครบถ้วน
          </p>
        </div>
      </div>

      {/* Announcements Stream for Teacher */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>ประกาศที่เผยแพร่แล้ว ({announcements.length})</span>
            <span className="text-xs font-normal text-slate-500">ติดตามสถานะการอ่านรายบุคคล</span>
          </h3>
        </div>

        <div className="grid gap-4">
          {announcements.map((ann) => {
            const isTargetClass = ann.targets.classroomIds.includes('c_m1_2') || ann.targets.scopeType === 'ALL_SCHOOL';
            return (
              <div 
                key={ann.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition-shadow shadow-xs flex flex-col justify-between gap-4"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {ann.priority === 'CRITICAL' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          🚨 วิกฤต / ฉุกเฉิน (High Priority)
                        </span>
                      )}
                      {ann.priority === 'APPOINTMENT' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-200">
                          <Calendar className="w-3.5 h-3.5" />
                          📅 นัดหมาย (Calendar Syncable)
                        </span>
                      )}
                      {ann.priority === 'GENERAL' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                          📢 ประกาศทั่วไป
                        </span>
                      )}

                      {/* Scope Badge */}
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                        <Users className="w-3 h-3" />
                        {ann.targets.scopeType === 'ALL_SCHOOL' && 'ทั้งโรงเรียน'}
                        {ann.targets.scopeType === 'SPECIFIC_CLASSES' && `เฉพาะห้อง: ${ann.targets.classroomIds.join(', ').replace('c_', '').toUpperCase()}`}
                        {ann.targets.scopeType === 'SPECIFIC_GROUPS' && 'กลุ่มกิจกรรมเฉพาะทาง'}
                      </span>

                      <span className="text-xs text-slate-400">
                        เป้าหมาย: ~{ann.targetCountEstimate} ท่าน
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 leading-snug">
                      {ann.title}
                    </h4>
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {ann.summary}
                    </p>

                    {ann.eventDetails && (
                      <div className="inline-flex items-center gap-2 mt-1 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
                        <CalendarDays className="w-3.5 h-3.5 text-indigo-600" />
                        <span>นัดหมาย: {new Date(ann.eventDetails.startDateTime).toLocaleDateString('th-TH', { dateStyle: 'medium' })} เวลา {new Date(ann.eventDetails.startDateTime).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.</span>
                        <span>•</span>
                        <span>{ann.eventDetails.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Read Rate Meter & Actions */}
                  <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 md:min-w-[220px] flex flex-col justify-between">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-indigo-600" />
                        สถานะการอ่าน
                      </span>
                      <span className="text-indigo-700 font-bold">
                        {ann.id === 'ann_appointment_m1_2' ? '84% (32/38)' : '100%'}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mb-3">
                      <div 
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                        style={{ width: ann.id === 'ann_appointment_m1_2' ? '84%' : '98%' }} 
                      />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setActiveReceiptModalAnnId(ann.id)}
                        className="flex-1 text-xs font-medium py-1.5 px-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg flex items-center justify-center gap-1 transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                        <span>ตรวจสอบรายชื่อ</span>
                      </button>

                      {ann.id === 'ann_appointment_m1_2' && (
                        <button
                          onClick={() => triggerRemind(ann.id)}
                          title="ส่ง SMS/Push สะกิดเฉพาะผู้ที่ยังไม่ได้อ่าน"
                          className="text-xs font-medium py-1.5 px-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg flex items-center justify-center gap-1 transition-colors"
                        >
                          <BellRing className="w-3 h-3" />
                          <span>เตือนคนยังไม่อ่าน</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-400">
                  <span>เผยแพร่โดย: {ann.author.name} ({ann.author.role})</span>
                  <span>{new Date(ann.publishedAt).toLocaleDateString('th-TH')}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CREATE ANNOUNCEMENT MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  ✍️
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">สร้างประกาศใหม่แบบเจาะจงเป้าหมาย</h3>
                  <p className="text-xs text-slate-500">ระบบ Smart Filtering & Multi-channel Dispatch</p>
                </div>
              </div>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              {/* Priority Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  1. เลือกระดับความสำคัญ (Smart Notification Tier)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPriority('GENERAL')}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      priority === 'GENERAL'
                        ? 'border-indigo-500 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <span>📢</span> ประกาศทั่วไป
                    </span>
                    <span className="text-[11px] text-slate-500 mt-1">
                      ส่งช่วงเวลากลางวัน รวมเป็นไดเจสต์ได้
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPriority('APPOINTMENT');
                      setIsCalendarEvent(true);
                    }}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      priority === 'APPOINTMENT'
                        ? 'border-sky-500 bg-sky-50/60 ring-2 ring-sky-500/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
                      <span>📅</span> นัดหมาย/ปฏิทิน
                    </span>
                    <span className="text-[11px] text-sky-700 mt-1">
                      ซิงก์ Google / Apple Calendar ได้ทันที
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPriority('CRITICAL')}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      priority === 'CRITICAL'
                        ? 'border-rose-500 bg-rose-50/60 ring-2 ring-rose-500/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                      <span>🚨</span> วิกฤต / เร่งด่วน
                    </span>
                    <span className="text-[11px] text-rose-700 mt-1">
                      ทะลุ DND, High-Push, SMS Fallback
                    </span>
                  </button>
                </div>
              </div>

              {/* Target Filtering & Tagging */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5 text-indigo-600" />
                    <span>2. กรองกลุ่มเป้าหมาย (Zero-Noise Filtering)</span>
                  </label>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    ประมาณ {estimateAudience()} ท่าน
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setScopeType('SPECIFIC_CLASSES')}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                      scopeType === 'SPECIFIC_CLASSES' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    เจาะจงห้องเรียน (Classrooms)
                  </button>
                  <button
                    type="button"
                    onClick={() => setScopeType('SPECIFIC_GROUPS')}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                      scopeType === 'SPECIFIC_GROUPS' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    เจาะจงกลุ่ม/ชมรม (Clubs/Tracks)
                  </button>
                  <button
                    type="button"
                    onClick={() => setScopeType('ALL_SCHOOL')}
                    className={`py-1.5 px-3 text-xs font-medium rounded-lg border transition-colors ${
                      scopeType === 'ALL_SCHOOL' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    ทั้งโรงเรียน
                  </button>
                </div>

                {scopeType === 'SPECIFIC_CLASSES' && (
                  <div>
                    <span className="text-xs text-slate-600 block mb-1.5">เลือกห้องเรียนเป้าหมาย:</span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {CLASSROOMS.map(c => {
                        const isSelected = selectedClassrooms.includes(c.id);
                        return (
                          <button
                            type="button"
                            key={c.id}
                            onClick={() => {
                              if (isSelected) {
                                setSelectedClassrooms(selectedClassrooms.filter(id => id !== c.id));
                              } else {
                                setSelectedClassrooms([...selectedClassrooms, c.id]);
                              }
                            }}
                            className={`p-2 rounded-lg text-xs font-medium border text-left flex items-center justify-between ${
                              isSelected ? 'bg-indigo-100/70 border-indigo-300 text-indigo-900 font-bold' : 'bg-white border-slate-200 text-slate-700'
                            }`}
                          >
                            <span>ห้อง {c.roomNumber}</span>
                            <span className="text-[10px] text-slate-400">({c.parentCount} คน)</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {scopeType === 'SPECIFIC_GROUPS' && (
                  <div>
                    <span className="text-xs text-slate-600 block mb-1.5">เลือกชมรม/สายการเรียนเป้าหมาย:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {ACTIVITY_GROUPS.map(g => {
                        const isSelected = selectedGroups.includes(g.id);
                        return (
                          <button
                            type="button"
                            key={g.id}
                            onClick={() => {
                              if (isSelected) {
                                setSelectedGroups(selectedGroups.filter(id => id !== g.id));
                              } else {
                                setSelectedGroups([...selectedGroups, g.id]);
                              }
                            }}
                            className={`p-2 rounded-lg text-xs font-medium border text-left flex items-center justify-between ${
                              isSelected ? 'bg-indigo-100/70 border-indigo-300 text-indigo-900 font-bold' : 'bg-white border-slate-200 text-slate-700'
                            }`}
                          >
                            <span>{g.name}</span>
                            <span className="text-[10px] text-slate-400">({g.memberCount} คน)</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>ประกาศนี้จะส่งตรงถึงผู้ปกครองตามเงื่อนไขเท่านั้น และจะไม่ส่งแจ้งเตือนไปยังผู้ปกครองห้องอื่น</span>
                </div>
              </div>

              {/* Title & Summary */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    หัวข้อประกาศ *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น นัดหมายการรับผลการเรียนกลางภาค ม.1/2"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    สรุปใจความสำคัญ (Summary สำหรับ Push Notification Preview) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ข้อความสั้น 1-2 บรรทัดที่ผู้ปกครองจะเห็นบนหน้าจอล็อก"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    เนื้อหาฉบับเต็ม (Full Announcement Body)
                  </label>
                  <textarea
                    rows={4}
                    placeholder="รายละเอียด กำหนดการ ข้อปฏิบัติสำหรับผู้ปกครอง..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Calendar Sync Options */}
              <div className="bg-sky-50/70 p-3.5 rounded-xl border border-sky-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-sky-900 flex items-center gap-1.5 cursor-pointer">
                    <Calendar className="w-4 h-4 text-sky-700" />
                    <span>แนบวันนัดหมายปฏิทิน (Auto Google & Apple Calendar Sync)</span>
                  </label>
                  <input
                    type="checkbox"
                    checked={isCalendarEvent}
                    onChange={(e) => setIsCalendarEvent(e.target.checked)}
                    className="w-4 h-4 text-sky-600 rounded cursor-pointer"
                  />
                </div>

                {isCalendarEvent && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-sky-200/60">
                    <div>
                      <span className="text-[11px] text-sky-800 font-semibold block mb-1">วันที่</span>
                      <input
                        type="date"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="w-full text-xs px-2 py-1.5 bg-white border border-sky-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] text-sky-800 font-semibold block mb-1">เวลาเริ่ม - สิ้นสุด</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="time"
                          value={eventStartTime}
                          onChange={(e) => setEventStartTime(e.target.value)}
                          className="w-full text-xs px-2 py-1.5 bg-white border border-sky-300 rounded-lg"
                        />
                        <span className="text-xs">-</span>
                        <input
                          type="time"
                          value={eventEndTime}
                          onChange={(e) => setEventEndTime(e.target.value)}
                          className="w-full text-xs px-2 py-1.5 bg-white border border-sky-300 rounded-lg"
                        />
                      </div>
                    </div>
                    <div>
                      <span className="text-[11px] text-sky-800 font-semibold block mb-1">สถานที่</span>
                      <input
                        type="text"
                        value={eventLocation}
                        onChange={(e) => setEventLocation(e.target.value)}
                        className="w-full text-xs px-2 py-1.5 bg-white border border-sky-300 rounded-lg"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Digital Acknowledgment Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="requiresAck"
                  checked={requiresAck}
                  onChange={(e) => setRequiresAck(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                />
                <label htmlFor="requiresAck" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  ต้องการให้ผู้ปกครองกดยืนยันรับทราบ (Digital Acknowledgment Receipt)
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>เผยแพร่ประกาศทันที</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* READ RECEIPTS AUDIT MODAL */}
      {activeReceiptModalAnnId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    รายงานสถานะการอ่าน (Read Receipts Audit Trail)
                  </h3>
                  <p className="text-xs text-slate-500">
                    ประกาศ: {activeReceiptAnn?.title || 'นัดหมายการประชุมผู้ปกครองห้อง ม.1/2'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setActiveReceiptModalAnnId(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Analytics Summary Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-medium text-slate-500 block">ผู้ปกครองเป้าหมาย</span>
                  <span className="text-xl font-bold text-slate-900">{relevantReceipts.length || 38} ท่าน</span>
                </div>
                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                  <span className="text-[11px] font-medium text-emerald-700 block">เปิดอ่านแล้ว (Read)</span>
                  <span className="text-xl font-bold text-emerald-800">{readCount} ท่าน ({readRate}%)</span>
                </div>
                <div className="bg-sky-50 p-3 rounded-xl border border-sky-200">
                  <span className="text-[11px] font-medium text-sky-700 block">กดยืนยันรับทราบ</span>
                  <span className="text-xl font-bold text-sky-800">{ackCount} ท่าน</span>
                </div>
                <div className="bg-rose-50 p-3 rounded-xl border border-rose-200">
                  <span className="text-[11px] font-medium text-rose-700 block">ยังไม่ได้เปิดอ่าน</span>
                  <span className="text-xl font-bold text-rose-800">{unreadCount} ท่าน</span>
                </div>
              </div>

              {/* 1-Click Reminder Nudge Button */}
              {unreadCount > 0 && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <BellRing className="w-5 h-5 text-amber-600 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-amber-900">
                        มีผู้ปกครอง {unreadCount} ท่าน ยังไม่ได้เปิดอ่านประกาศนี้
                      </p>
                      <p className="text-[11px] text-amber-700">
                        ระบบจะส่งข้อความสะกิดผ่าน SMS และ High Priority Push ซ้ำเฉพาะบุคคลเหล่านี้
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => triggerRemind(activeReceiptModalAnnId)}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shrink-0 shadow-xs cursor-pointer"
                  >
                    🔔 ส่งแจ้งเตือนสะกิดทันที ({unreadCount} คน)
                  </button>
                </div>
              )}

              {/* Detailed Recipient Table */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  รายชื่อผู้ปกครองและสถานะการอ่าน
                </h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">ผู้ปกครอง</th>
                        <th className="py-2.5 px-3">นักเรียน</th>
                        <th className="py-2.5 px-3">สถานะ</th>
                        <th className="py-2.5 px-3">เวลาที่อ่าน</th>
                        <th className="py-2.5 px-3">การยืนยันรับทราบ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {relevantReceipts.map((rcpt) => (
                        <tr key={rcpt.id} className={rcpt.isRead ? 'hover:bg-slate-50/50' : 'bg-rose-50/40'}>
                          <td className="py-2.5 px-3 font-medium text-slate-900">
                            {rcpt.userName}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600">
                            {rcpt.studentName} ({rcpt.classroomName})
                          </td>
                          <td className="py-2.5 px-3">
                            {rcpt.isRead ? (
                              <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                                <CheckCircle className="w-3.5 h-3.5" /> อ่านแล้ว
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-rose-600 font-semibold">
                                <Clock className="w-3.5 h-3.5" /> ยังไม่อ่าน
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-slate-500">
                            {rcpt.readAt ? new Date(rcpt.readAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.' : '-'}
                          </td>
                          <td className="py-2.5 px-3">
                            {rcpt.acknowledgedAt ? (
                              <span className="text-[11px] bg-sky-100 text-sky-800 font-semibold px-2 py-0.5 rounded-full">
                                รับทราบแล้ว ({new Date(rcpt.acknowledgedAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })})
                              </span>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
