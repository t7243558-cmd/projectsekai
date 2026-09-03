import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { TeacherDashboard } from './components/TeacherDashboard';
import { ParentFeed } from './components/ParentFeed';
import { BlueprintExplorer } from './components/BlueprintExplorer';
import { DeviceFrame } from './components/DeviceFrame';
import { USERS, INITIAL_ANNOUNCEMENTS, MOCK_READ_RECEIPTS_M1_2 } from './data/mockData';
import { Announcement, ReadReceipt } from './types';

export default function App() {
  const [currentMode, setCurrentMode] = useState<'SANDBOX' | 'BLUEPRINT'>('SANDBOX');
  const [selectedUserId, setSelectedUserId] = useState<string>('u_teacher_1');
  const [deviceView, setDeviceView] = useState<'DESKTOP' | 'MOBILE_IOS' | 'MOBILE_ANDROID'>('DESKTOP');
  
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [readReceipts, setReadReceipts] = useState<ReadReceipt[]>(MOCK_READ_RECEIPTS_M1_2);

  const currentUser = USERS.find(u => u.id === selectedUserId) || USERS[0];

  const handleAddAnnouncement = (newAnn: Announcement) => {
    setAnnouncements([newAnn, ...announcements]);

    // Generate simulated read receipts for the new announcement
    const newReceipts: ReadReceipt[] = [
      {
        id: `rcpt_new_${Date.now()}_1`,
        announcementId: newAnn.id,
        userId: 'u_parent_1',
        userName: 'คุณมนิดา รักเรียน',
        userRole: 'PARENT',
        studentName: 'ด.ช. ภัทรพล รักเรียน',
        classroomName: 'ม.1/2',
        readAt: null,
        isRead: false,
        notifiedChannels: ['PUSH'],
        deliveryStatus: 'DELIVERED',
      },
      {
        id: `rcpt_new_${Date.now()}_2`,
        announcementId: newAnn.id,
        userId: 'u_p_102',
        userName: 'คุณกิตติศักดิ์ ชัยมงคล',
        userRole: 'PARENT',
        studentName: 'ด.ช. ธีรภัทร ชัยมงคล',
        classroomName: 'ม.1/2',
        readAt: null,
        isRead: false,
        notifiedChannels: ['PUSH'],
        deliveryStatus: 'DELIVERED',
      }
    ];

    setReadReceipts([...readReceipts, ...newReceipts]);
  };

  const handleMarkAsRead = (annId: string) => {
    setReadReceipts(prev => {
      const exists = prev.some(r => r.announcementId === annId && r.userId === currentUser.id);
      if (exists) {
        return prev.map(r => {
          if (r.announcementId === annId && r.userId === currentUser.id) {
            return {
              ...r,
              isRead: true,
              readAt: r.readAt || new Date().toISOString(),
            };
          }
          return r;
        });
      } else {
        // Create new read receipt record
        const newRecord: ReadReceipt = {
          id: `rcpt_auto_${Date.now()}`,
          announcementId: annId,
          userId: currentUser.id,
          userName: currentUser.name,
          userRole: currentUser.role,
          studentName: currentUser.children?.[0]?.name,
          classroomName: currentUser.children?.[0]?.classroomName,
          readAt: new Date().toISOString(),
          isRead: true,
          notifiedChannels: ['IN_APP'],
          deliveryStatus: 'DELIVERED',
        };
        return [...prev, newRecord];
      }
    });
  };

  const handleAcknowledge = (annId: string) => {
    handleMarkAsRead(annId);
    setReadReceipts(prev => prev.map(r => {
      if (r.announcementId === annId && r.userId === currentUser.id) {
        return {
          ...r,
          isRead: true,
          readAt: r.readAt || new Date().toISOString(),
          acknowledgedAt: new Date().toISOString(),
        };
      }
      return r;
    }));
  };

  const handleRemindUnread = (annId: string) => {
    // In production, this calls POST /api/v1/announcements/{id}/remind-unread
    // For simulation, we verify unread logs exist
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Navbar */}
      <Navbar
        currentMode={currentMode}
        setMode={setCurrentMode}
        users={USERS}
        selectedUserId={selectedUserId}
        setSelectedUserId={setSelectedUserId}
        deviceView={deviceView}
        setDeviceView={setDeviceView}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentMode === 'SANDBOX' ? (
          <div>
            {currentUser.role === 'TEACHER' ? (
              <TeacherDashboard
                announcements={announcements}
                onAddAnnouncement={handleAddAnnouncement}
                readReceipts={readReceipts}
                onRemindUnread={handleRemindUnread}
              />
            ) : (
              <DeviceFrame deviceView={deviceView}>
                <ParentFeed
                  currentUser={currentUser}
                  announcements={announcements}
                  readReceipts={readReceipts}
                  onMarkAsRead={handleMarkAsRead}
                  onAcknowledge={handleAcknowledge}
                  deviceView={deviceView}
                />
              </DeviceFrame>
            )}
          </div>
        ) : (
          <BlueprintExplorer />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-5 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            SchoolHub Platform • สถาปัตยกรรมระบบสื่อสารโรงเรียน ยุค 2026
          </span>
          <div className="flex items-center gap-4 text-slate-400">
            <span>RFC 5545 iCalendar</span>
            <span>•</span>
            <span>PostgreSQL 15+</span>
            <span>•</span>
            <span>FCM & APNs Critical Alerts</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
