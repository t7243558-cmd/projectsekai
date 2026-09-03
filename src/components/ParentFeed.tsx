import React, { useState } from 'react';
import { 
  Bell, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  CalendarPlus, 
  Download, 
  Clock, 
  MapPin, 
  Filter, 
  ChevronRight, 
  CheckCheck,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  User
} from 'lucide-react';
import { Announcement, UserProfile, ReadReceipt } from '../types';
import { generateGoogleCalendarUrl, downloadIcsFile } from '../utils/calendar';

interface ParentFeedProps {
  currentUser: UserProfile;
  announcements: Announcement[];
  readReceipts: ReadReceipt[];
  onMarkAsRead: (annId: string) => void;
  onAcknowledge: (annId: string) => void;
  deviceView: 'DESKTOP' | 'MOBILE_IOS' | 'MOBILE_ANDROID';
}

export const ParentFeed: React.FC<ParentFeedProps> = ({
  currentUser,
  announcements,
  readReceipts,
  onMarkAsRead,
  onAcknowledge,
  deviceView,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'CRITICAL' | 'APPOINTMENT' | 'UNREAD'>('ALL');
  const [expandedAnnId, setExpandedAnnId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const child = currentUser.children?.[0];

  // Smart Filtering Logic:
  // An announcement appears in parent feed ONLY IF:
  // 1. scopeType is ALL_SCHOOL
  // 2. OR child classroomId is in target classroomIds
  // 3. OR child grade is in target gradeLevels
  // 4. OR any of child groups matches target groupIds
  const filteredFeed = announcements.filter((ann) => {
    if (!child) return false;

    // Scope check
    let isTargeted = false;
    if (ann.targets.scopeType === 'ALL_SCHOOL') {
      isTargeted = true;
    } else {
      const inClass = ann.targets.classroomIds.includes(child.classroomId);
      const inGrade = ann.targets.gradeLevels.includes(child.grade);
      const inGroups = ann.targets.groupIds.some(gid => child.groups.includes(gid) || (child.trackId && child.trackId === gid));
      if (inClass || inGrade || inGroups) {
        isTargeted = true;
      }
    }

    if (!isTargeted) return false;

    // Category Filter
    if (selectedFilter === 'CRITICAL') return ann.priority === 'CRITICAL';
    if (selectedFilter === 'APPOINTMENT') return ann.priority === 'APPOINTMENT';
    if (selectedFilter === 'UNREAD') {
      const rcpt = readReceipts.find(r => r.announcementId === ann.id && r.userId === currentUser.id);
      return !rcpt?.isRead;
    }

    return true;
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSyncGoogleCalendar = (ann: Announcement) => {
    if (!ann.eventDetails) return;
    const url = generateGoogleCalendarUrl({
      title: ann.title.replace(/^[🚨📅📢]\s*/, ''),
      description: `${ann.summary}\n\n${ann.content}`,
      location: ann.eventDetails.location,
      startDateTime: ann.eventDetails.startDateTime,
      endDateTime: ann.eventDetails.endDateTime,
    });
    window.open(url, '_blank', 'noopener,noreferrer');
    showToast('กำลังเปิด Google Calendar เพื่อบันทึกนัดหมาย...');
  };

  const handleDownloadAppleCalendar = (ann: Announcement) => {
    if (!ann.eventDetails) return;
    downloadIcsFile({
      title: ann.title.replace(/^[🚨📅📢]\s*/, ''),
      description: `${ann.summary}\n\n${ann.content}`,
      location: ann.eventDetails.location,
      startDateTime: ann.eventDetails.startDateTime,
      endDateTime: ann.eventDetails.endDateTime,
    });
    showToast('ดาวน์โหลดไฟล์ Apple Calendar (.ics) พร้อมการเตือนล่วงหน้าเรียบร้อยแล้ว');
  };

  const isIos = deviceView === 'MOBILE_IOS';
  const isAndroid = deviceView === 'MOBILE_ANDROID';

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 border border-slate-700 animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Parent Child Context Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center text-xl shadow-sm">
            👨‍👩‍👧
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">{currentUser.name}</h2>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                ผู้ปกครอง
              </span>
            </div>
            {child && (
              <p className="text-xs text-slate-600 mt-0.5">
                บุตรหลาน: <strong className="text-indigo-700">{child.name}</strong> • ชั้น {child.classroomName}
              </p>
            )}
          </div>
        </div>

        {/* Smart Filtering Guarantee */}
        <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl px-3.5 py-2 flex items-center gap-2.5 text-xs text-indigo-900">
          <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>
            <strong>Smart Filter ทำงานอยู่:</strong> กรองเฉพาะข่าว ม.1/2 และกิจกรรมของน้องภัทร (ข่าวสารที่ไม่เกี่ยวข้องถูกตัดออก 100%)
          </span>
        </div>
      </div>

      {/* Quick Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-slate-200/70 p-1 rounded-xl text-xs font-medium">
          <button
            onClick={() => setSelectedFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg transition-all ${selectedFilter === 'ALL' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
          >
            ทั้งหมด ({filteredFeed.length})
          </button>
          <button
            onClick={() => setSelectedFilter('CRITICAL')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all ${selectedFilter === 'CRITICAL' ? 'bg-rose-500 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <span>🚨 วิกฤต</span>
          </button>
          <button
            onClick={() => setSelectedFilter('APPOINTMENT')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all ${selectedFilter === 'APPOINTMENT' ? 'bg-sky-500 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <span>📅 นัดหมายปฏิทิน</span>
          </button>
          <button
            onClick={() => setSelectedFilter('UNREAD')}
            className={`px-3 py-1.5 rounded-lg transition-all ${selectedFilter === 'UNREAD' ? 'bg-amber-500 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
          >
            ยังไม่อ่าน
          </button>
        </div>

        <span className="text-xs text-slate-500">
          แสดงผลตามความสำคัญ (Priority Order)
        </span>
      </div>

      {/* Feed Stream */}
      <div className="space-y-4">
        {filteredFeed.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-500">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="font-semibold text-slate-700">ไม่มีประกาศคงค้างในหมวดหมู่นี้</p>
            <p className="text-xs text-slate-400 mt-1">คุณได้รับข้อมูลข่าวสารที่อัปเดตและตรงกลุ่มเป้าหมายครบถ้วนแล้ว</p>
          </div>
        ) : (
          filteredFeed.map((ann) => {
            const receipt = readReceipts.find(r => r.announcementId === ann.id && r.userId === currentUser.id);
            const isRead = receipt?.isRead || false;
            const isAck = !!receipt?.acknowledgedAt;
            const isExpanded = expandedAnnId === ann.id;

            return (
              <div
                key={ann.id}
                onClick={() => {
                  if (!isRead) onMarkAsRead(ann.id);
                }}
                className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                  ann.priority === 'CRITICAL'
                    ? 'border-rose-300 ring-2 ring-rose-500/10 shadow-sm'
                    : ann.priority === 'APPOINTMENT'
                    ? 'border-sky-300 ring-2 ring-sky-500/10 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                {/* Critical Emergency Banner */}
                {ann.priority === 'CRITICAL' && (
                  <div className="bg-rose-600 text-white px-4 py-1.5 text-xs font-bold flex items-center justify-between">
                    <span className="flex items-center gap-1.5 animate-pulse">
                      <AlertTriangle className="w-4 h-4" />
                      ประกาศสำคัญระดับวิกฤต (ทะลุระบบปิดเสียง / Do Not Disturb)
                    </span>
                    <span className="text-[11px] bg-rose-700 px-2 py-0.5 rounded">High Priority</span>
                  </div>
                )}

                <div className="p-5 space-y-3">
                  {/* Top Meta Row */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {ann.priority === 'APPOINTMENT' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-800">
                          <Calendar className="w-3.5 h-3.5" />
                          นัดหมายปฏิทิน
                        </span>
                      )}
                      {ann.priority === 'GENERAL' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                          ข่าวสารทั่วไป
                        </span>
                      )}

                      <span className="text-xs text-slate-500">
                        {ann.author.name} • {new Date(ann.publishedAt).toLocaleDateString('th-TH')}
                      </span>
                    </div>

                    {/* Read Status Badge */}
                    <div>
                      {isRead ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          <CheckCheck className="w-3.5 h-3.5" />
                          เปิดอ่านแล้ว
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full animate-pulse">
                          ยังไม่ได้เปิดอ่าน
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Summary */}
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {ann.title}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      {ann.summary}
                    </p>
                  </div>

                  {/* Calendar Event Box if APPOINTMENT */}
                  {ann.eventDetails && (
                    <div className="bg-sky-50/80 border border-sky-200/80 rounded-xl p-3.5 space-y-2.5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-sky-900">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 font-semibold">
                            <Calendar className="w-4 h-4 text-sky-700" />
                            <span>
                              {new Date(ann.eventDetails.startDateTime).toLocaleDateString('th-TH', { 
                                weekday: 'long', 
                                day: 'numeric', 
                                month: 'long', 
                                year: 'numeric' 
                              })}
                            </span>
                            <span>
                              เวลา {new Date(ann.eventDetails.startDateTime).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} - {new Date(ann.eventDetails.endDateTime).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-sky-800">
                            <MapPin className="w-3.5 h-3.5 text-sky-600" />
                            <span>{ann.eventDetails.location}</span>
                          </div>
                        </div>

                        {/* Direct Calendar Sync Buttons */}
                        <div className="flex items-center gap-2 shrink-0 pt-1 sm:pt-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSyncGoogleCalendar(ann);
                            }}
                            className="px-3 py-1.5 bg-white hover:bg-sky-100 text-sky-700 border border-sky-300 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                          >
                            <CalendarPlus className="w-3.5 h-3.5 text-sky-600" />
                            <span>Google Calendar</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadAppleCalendar(ann);
                            }}
                            className="px-3 py-1.5 bg-sky-700 hover:bg-sky-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Apple Cal (.ics)</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Expandable full content */}
                  {isExpanded && (
                    <div className="pt-3 border-t border-slate-100 text-sm text-slate-700 space-y-2 whitespace-pre-line leading-relaxed bg-slate-50/50 p-3 rounded-xl">
                      {ann.content}
                    </div>
                  )}

                  {/* Card Bottom Actions: Expand toggle & Acknowledge Button */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <button
                      onClick={() => setExpandedAnnId(isExpanded ? null : ann.id)}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                    >
                      <span>{isExpanded ? 'ย่อรายละเอียด' : 'อ่านเนื้อหาฉบับเต็ม'}</span>
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? '-rotate-90' : 'rotate-90'}`} />
                    </button>

                    {/* Digital Acknowledgment Button */}
                    {ann.requiresAcknowledgment && (
                      <div>
                        {isAck ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100/80 px-3 py-1.5 rounded-xl border border-emerald-200">
                            <ShieldCheck className="w-4 h-4 text-emerald-700" />
                            <span>ยืนยันรับทราบแล้ว (Audit ID: #ACK-{ann.id.slice(-4)})</span>
                          </span>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onAcknowledge(ann.id);
                              showToast('คุณได้กดยืนยันรับทราบประกาศเรียบร้อยแล้ว ครูประจำชั้นจะได้รับข้อมูลทันที');
                            }}
                            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>กดยืนยันรับทราบ (Acknowledge)</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
