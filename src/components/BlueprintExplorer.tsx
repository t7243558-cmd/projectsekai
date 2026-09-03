import React, { useState } from 'react';
import { 
  Database, 
  Layers, 
  Workflow, 
  Code2, 
  Copy, 
  Check, 
  ShieldAlert, 
  Calendar, 
  Bell, 
  Filter, 
  Users, 
  Smartphone, 
  Radio, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  Play,
  Terminal
} from 'lucide-react';
import { SQL_DDL_SCHEMA, ARCHITECTURE_SPECS, API_ENDPOINTS_DOC } from '../data/specificationContent';

export const BlueprintExplorer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ARCHITECTURE' | 'DATABASE' | 'USER_FLOW' | 'API_SPECS'>('ARCHITECTURE');
  const [copiedSql, setCopiedSql] = useState(false);
  const [selectedApiIndex, setSelectedApiIndex] = useState(0);
  const [apiSimulatedResponse, setApiSimulatedResponse] = useState<string | null>(null);

  const handleCopySql = () => {
    navigator.clipboard.writeText(SQL_DDL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleSimulateApi = () => {
    const ep = API_ENDPOINTS_DOC[selectedApiIndex];
    setApiSimulatedResponse(ep.responseBody);
  };

  return (
    <div className="space-y-6">
      {/* Blueprint Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-950/80 px-2.5 py-1 rounded-md border border-indigo-800">
                Technical Blueprint & PRD Spec
              </span>
              <span className="text-xs text-slate-400">Version 2.4 (Production-Ready)</span>
            </div>
            <h1 className="text-2xl font-black mt-2 tracking-tight">
              สถาปัตยกรรมระบบสื่อสารโรงเรียน (School Communication Hub)
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              เอกสารสเปกเชิงลึกและโครงสร้างทางเทคนิคสำหรับแก้ปัญหาข่าวสารล้น (Anti-Spam), ระบบ Smart Notification 3 ระดับ, Database Schema แบบสัมพันธ์สมบูรณ์, User Journey และ RESTful API
            </p>
          </div>
          
          <button
            onClick={handleCopySql}
            className="self-start md:self-auto px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            {copiedSql ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copiedSql ? 'คัดลอก SQL DDL แล้ว!' : 'คัดลอก PostgreSQL DDL'}</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mt-6 pt-5 border-t border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab('ARCHITECTURE')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'ARCHITECTURE'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>1. System Architecture & Features</span>
          </button>
          <button
            onClick={() => setActiveTab('DATABASE')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'DATABASE'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>2. Database Schema & Relationships</span>
          </button>
          <button
            onClick={() => setActiveTab('USER_FLOW')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'USER_FLOW'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Workflow className="w-4 h-4" />
            <span>3. User Flow & UX/UI Wireframes</span>
          </button>
          <button
            onClick={() => setActiveTab('API_SPECS')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'API_SPECS'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>4. RESTful API Endpoint Specifications</span>
          </button>
        </div>
      </div>

      {/* TAB 1: SYSTEM ARCHITECTURE & FEATURES */}
      {activeTab === 'ARCHITECTURE' && (
        <div className="space-y-6">
          {/* 1.1 Smart Notification Hierarchy Matrix */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  1. ระบบ Smart Notification: แบ่ง 3 ระดับความสำคัญ (Priority Matrix)
                </h3>
                <p className="text-xs text-slate-500">
                  ออกแบบเพื่อป้องกัน Notification Fatigue โดยแยกช่องทางส่งและพฤติกรรมแจ้งเตือนตามความเร่งด่วน
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {ARCHITECTURE_SPECS.notificationTiers.map((tier, idx) => (
                <div 
                  key={idx} 
                  className={`rounded-2xl p-4.5 border flex flex-col justify-between gap-3 ${
                    tier.color === 'red' 
                      ? 'bg-rose-50/50 border-rose-200 ring-1 ring-rose-300/50' 
                      : tier.color === 'blue'
                      ? 'bg-sky-50/50 border-sky-200 ring-1 ring-sky-300/50'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="space-y-2">
                    <h4 className="font-bold text-sm text-slate-900">{tier.level}</h4>
                    <div className="space-y-1.5 text-xs">
                      <div>
                        <strong className="text-slate-700 block">เกณฑ์การใช้งาน (Criteria):</strong>
                        <span className="text-slate-600 leading-relaxed">{tier.criteria}</span>
                      </div>
                      <div>
                        <strong className="text-slate-700 block">ช่องทางการส่ง (Channels):</strong>
                        <span className="text-slate-600 leading-relaxed">{tier.channels}</span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-200/60 text-[11px] text-slate-700 font-medium">
                    <strong>พฤติกรรมบนเครื่อง:</strong> {tier.behavior}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 1.2 Filtering & Tagging Logic */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                <Filter className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  2. ระบบ Filtering & Tagging: กรองระดับชั้น ห้องเรียน และกลุ่มกิจกรรม
                </h3>
                <p className="text-xs text-slate-500">
                  กลไกตัดเสียงรบกวน (Zero-Noise Filtering) ด้วย Set Intersection Resolution
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {ARCHITECTURE_SPECS.filteringAlgorithm.map((item, idx) => (
                <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 text-indigo-700">{item.step}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 1.3 Read Receipts Audit Architecture */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  3. ระบบ Read Receipts & Digital Acknowledgment Audit Trail
                </h3>
                <p className="text-xs text-slate-500">
                  ตรวจสอบสถานะการเปิดอ่านแบบ 4 ขั้นตอน: SENT ➔ DELIVERED ➔ READ ➔ ACKNOWLEDGED
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800 block mb-1">1. SENT (ส่งออกจากเซิร์ฟเวอร์)</span>
                <p className="text-slate-500">บันทึก Message ID จาก FCM / APNs / SMS Gateway ลงใน Notification Dispatch Log</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800 block mb-1">2. DELIVERED (ถึงเครื่องผู้ใช้)</span>
                <p className="text-slate-500">Background Service ใน iOS/Android ตอบกลับ Ack ยืนยันว่าแจ้งเตือนปรากฏบนจอล็อกแล้ว</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="font-bold text-emerald-800 block mb-1">3. READ (เปิดอ่านประกาศ)</span>
                <p className="text-emerald-700">เมื่อผู้ปกครองเปิดแอปและกดดูประกาศ บันทึก `first_read_at` ทันที พร้อม IP และ Client Info</p>
              </div>
              <div className="p-3 rounded-xl bg-sky-50 border border-sky-200">
                <span className="font-bold text-sky-800 block mb-1">4. ACKNOWLEDGED (รับทราบ)</span>
                <p className="text-sky-700">สำหรับประกาศสำคัญ ผู้ปกครองกดปุ่มยืนยันรับทราบ สร้าง Digital Signature ป้องกันข้ออ้างไม่ได้รับข่าว</p>
              </div>
            </div>
          </div>

          {/* 1.4 Parent Calendar Auto-Sync Architecture */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-sky-50 text-sky-700">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  4. ระบบ Parent Calendar Auto-Sync: ซิงก์ลง Google & Apple Calendar
                </h3>
                <p className="text-xs text-slate-500">
                  รองรับทั้ง 1-Click Instant Add และ Live WebCal Calendar Feed Subscription
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {ARCHITECTURE_SPECS.calendarSyncMethods.map((m, idx) => (
                <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="text-xs font-bold text-sky-900">{m.type}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{m.mechanism}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DATABASE SCHEMA & RELATIONSHIPS */}
      {activeTab === 'DATABASE' && (
        <div className="space-y-6">
          {/* Entity Relationship Overview */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Entity Relationships & Cardinality (ERD Overview)
                </h3>
                <p className="text-xs text-slate-500">
                  โครงสร้างความสัมพันธ์ระหว่าง ผู้ใช้, ห้องเรียน, นักเรียน, กิจกรรม, ประกาศ และสถานะการอ่าน
                </p>
              </div>
            </div>

            {/* Visual Relationship Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                <div className="font-bold text-indigo-700 flex items-center justify-between">
                  <span>Classrooms ➔ Students</span>
                  <span className="text-[10px] bg-indigo-100 px-1.5 py-0.5 rounded">1 : N</span>
                </div>
                <p className="text-slate-600">1 ห้องเรียน มีนักเรียนได้หลายคน นักเรียนสังกัด 1 ห้องหลัก</p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                <div className="font-bold text-indigo-700 flex items-center justify-between">
                  <span>Parents ➔ Students</span>
                  <span className="text-[10px] bg-indigo-100 px-1.5 py-0.5 rounded">M : N</span>
                </div>
                <p className="text-slate-600">ผู้ปกครอง 1 ท่าน มีลูกได้หลายคน และนักเรียน 1 คน มีผู้ปกครองได้หลายคน</p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                <div className="font-bold text-indigo-700 flex items-center justify-between">
                  <span>Students ➔ Activity Groups</span>
                  <span className="text-[10px] bg-indigo-100 px-1.5 py-0.5 rounded">M : N</span>
                </div>
                <p className="text-slate-600">นักเรียนสามารถเข้าร่วมได้หลายชมรม/สายการเรียน/สายรถรับส่ง</p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                <div className="font-bold text-indigo-700 flex items-center justify-between">
                  <span>Announcements ➔ Read Receipts</span>
                  <span className="text-[10px] bg-indigo-100 px-1.5 py-0.5 rounded">1 : N</span>
                </div>
                <p className="text-slate-600">1 ประกาศสร้างรายการ Read Receipt ให้ผู้ปกครองเป้าหมายทุกคนแบบ 1-on-1 Audit</p>
              </div>
            </div>
          </div>

          {/* SQL DDL Code Viewer */}
          <div className="bg-slate-950 text-slate-200 rounded-2xl p-6 border border-slate-800 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono font-bold text-slate-300">schema.sql (PostgreSQL 15+ Production DDL)</span>
              </div>
              <button
                onClick={handleCopySql}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? 'Copied' : 'Copy SQL'}</span>
              </button>
            </div>

            <div className="max-h-[500px] overflow-y-auto rounded-xl bg-slate-900/90 p-4 font-mono text-xs text-slate-300 border border-slate-800 leading-relaxed select-text">
              <pre>{SQL_DDL_SCHEMA}</pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: USER FLOW & WIREFRAMES */}
      {activeTab === 'USER_FLOW' && (
        <div className="space-y-6">
          {/* User Journeys */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Teacher Journey */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">👩‍🏫</span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">User Journey: ครูผู้ส่งประกาศ (Sender)</h3>
                  <p className="text-xs text-slate-500">ขั้นตอนการสร้างข่าวสารแบบเจาะจงและติดตามผล</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">1</span>
                  <div className="text-xs">
                    <strong className="text-slate-900 block font-semibold">สร้างประกาศ & เลือกระดับความสำคัญ</strong>
                    <span className="text-slate-600">เลือกประเภทประกาศ (🚨 วิกฤต / 📅 นัดหมาย / 📢 ทั่วไป) ระบบจะปรับช่องทางการส่งอัตโนมัติ</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">2</span>
                  <div className="text-xs">
                    <strong className="text-slate-900 block font-semibold">ระบุ Target Group & คำนวณผู้รับทันที</strong>
                    <span className="text-slate-600">เลือกห้องเรียน (เช่น ม.1/2) หรือกลุ่มกิจกรรม ระบบแสดงยอดผู้ปกครองเป้าหมาย (38 คน) ยืนยันไม่ส่งเกินจำเป็น</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">3</span>
                  <div className="text-xs">
                    <strong className="text-slate-900 block font-semibold">เผยแพร่ & ตรวจสอบ Read Receipts</strong>
                    <span className="text-slate-600">ดู Dashboard แบบเรียลไทม์ว่ามีผู้ปกครองอ่านไปแล้วกี่คน (เช่น 84%) และเหลือกี่คนที่ยังไม่อ่าน</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">4</span>
                  <div className="text-xs">
                    <strong className="text-slate-900 block font-semibold">1-Click Nudge (เตือนเฉพาะคนที่ยังไม่อ่าน)</strong>
                    <span className="text-slate-600">ไม่ต้องพิมพ์ทวงในกลุ่มรวม ครูสามารถกดปุ่ม "เตือนคนยังไม่อ่าน" เพื่อส่ง Push/SMS ซ้ำเฉพาะ 6 ท่านที่เหลือ</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Parent Journey */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">👨‍👩‍👧</span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">User Journey: ผู้ปกครองผู้รับประกาศ (Recipient)</h3>
                  <p className="text-xs text-slate-500">ประสบการณ์รับข่าวสารตรงเป้าหมาย ไร้สแปม</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-xs shrink-0">1</span>
                  <div className="text-xs">
                    <strong className="text-slate-900 block font-semibold">รับ Smart Push Notification</strong>
                    <span className="text-slate-600">เห็นชื่อลูกและห้องเรียนกำกับชัดเจน (เช่น [น้องภัทร ม.1/2] นัดหมายประชุมผู้ปกครอง) หากเป็นเหตุด่วนจะทะลุ Focus Mode</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-xs shrink-0">2</span>
                  <div className="text-xs">
                    <strong className="text-slate-900 block font-semibold">เปิด Feed ข่าวสารเฉพาะตัว (Zero-Noise)</strong>
                    <span className="text-slate-600">เห็นเฉพาะข่าวของลูกตนเอง ไม่ต้องเลื่อนผ่านข่าวของ ม.6 หรือข่าวรถสายอื่นที่ไม่ได้ใช้</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-xs shrink-0">3</span>
                  <div className="text-xs">
                    <strong className="text-slate-900 block font-semibold">ซิงก์ปฏิทินใน 1 วินาที</strong>
                    <span className="text-slate-600">แตะปุ่ม "Google Calendar" หรือ "Apple Cal (.ics)" วันนัดหมายและสถานที่ถูกบันทึกลงในปฏิทินส่วนตัวทันที</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-xs shrink-0">4</span>
                  <div className="text-xs">
                    <strong className="text-slate-900 block font-semibold">กดยืนยันรับทราบ (Digital Acknowledgment)</strong>
                    <span className="text-slate-600">ระบบบันทึกสถานะให้ครูทราบทันที ลดการต้องโทรตามหรือพิมพ์ "+1 รับทราบค่ะ" รบกวนคนอื่น</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Wireframe Outline & Layout Specs (iOS HIG vs Android M3) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              รายละเอียดส่วนประกอบหน้าจอ (Wireframe Outline & Native UI Guidelines)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* iOS Specifications */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/60 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🍎</span>
                  <h4 className="font-bold text-sm text-slate-900">iOS Platform (Human Interface Guidelines)</h4>
                </div>
                <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside">
                  <li><strong>Navigation Bar:</strong> Large Title "ประกาศโรงเรียน" ที่ยุบตัวเมื่อ Scroll พร้อม Segmented Control [ทั้งหมด | สำคัญ | ปฏิทิน]</li>
                  <li><strong>Critical Alert:</strong> ใช้ iOS Critical Alerts API (Bypass Do Not Disturb / Focus Filter) และ Live Activities บน Dynamic Island สำหรับสถานการณ์ฉุกเฉิน</li>
                  <li><strong>Calendar Sync:</strong> รองรับ EventKit framework เพื่อบันทึกลง iOS Calendar Native ทันที หรือเปิดผ่าน `.ics` mime-type</li>
                  <li><strong>Haptic Feedback:</strong> UIImpactFeedbackGenerator (Light สำหรับอ่าน, Medium สำหรับกดยืนยันรับทราบ)</li>
                </ul>
              </div>

              {/* Android Specifications */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/60 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🤖</span>
                  <h4 className="font-bold text-sm text-slate-900">Android Platform (Material Design 3)</h4>
                </div>
                <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside">
                  <li><strong>TopAppBar & AssistChips:</strong> Filter Chips แถวแนวนอนที่แตะเพื่อกรองหมวดหมู่ได้อย่างรวดเร็วตามหลัก Material 3</li>
                  <li><strong>Notification Channels:</strong> แยก 3 Channels ชัดเจน: `channel_critical` (High importance, sound, vibration), `channel_appointment` (Default), `channel_general` (Low)</li>
                  <li><strong>Calendar Intent:</strong> Intent(Intent.ACTION_INSERT) with `Events.CONTENT_URI` ส่งตรงเข้า Google Calendar แบบ Native</li>
                  <li><strong>Floating Action Button (FAB):</strong> สำหรับครูผู้สอนเพื่อแตะสร้างประกาศใหม่จากหน้าจอใดก็ได้</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: API ENDPOINT SPECIFICATIONS */}
      {activeTab === 'API_SPECS' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Endpoint Selector List */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2 mb-2">
                RESTful API Endpoints (v1)
              </h3>
              {API_ENDPOINTS_DOC.map((ep, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedApiIndex(idx);
                    setApiSimulatedResponse(null);
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition-all text-xs cursor-pointer ${
                    selectedApiIndex === idx
                      ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-500/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                      ep.method === 'POST' ? 'bg-emerald-100 text-emerald-800' :
                      ep.method === 'GET' ? 'bg-sky-100 text-sky-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {ep.method}
                    </span>
                    <span className="font-mono text-slate-600 truncate">{ep.path}</span>
                  </div>
                  <p className="font-semibold text-slate-900 truncate">{ep.title}</p>
                </button>
              ))}
            </div>

            {/* Selected Endpoint Documentation & Simulator */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
              {(() => {
                const ep = API_ENDPOINTS_DOC[selectedApiIndex];
                return (
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded font-mono font-bold text-xs ${
                            ep.method === 'POST' ? 'bg-emerald-100 text-emerald-800' :
                            ep.method === 'GET' ? 'bg-sky-100 text-sky-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {ep.method}
                          </span>
                          <h3 className="text-base font-bold text-slate-900 font-mono">{ep.path}</h3>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">{ep.title}</p>
                      </div>

                      <button
                        onClick={handleSimulateApi}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>จำลองยิง API (Simulate)</span>
                      </button>
                    </div>

                    <div className="space-y-1 text-xs">
                      <span className="font-bold text-slate-700">คำอธิบาย:</span>
                      <p className="text-slate-600">{ep.description}</p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center gap-2">
                      <span className="font-bold text-slate-700">Authentication:</span>
                      <span className="font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        {ep.auth}
                      </span>
                    </div>

                    {ep.requestBody && (
                      <div className="space-y-1.5">
                        <span className="text-xs font-bold text-slate-700 font-mono">Request Payload (JSON):</span>
                        <pre className="p-3.5 bg-slate-900 text-emerald-300 rounded-xl text-xs font-mono overflow-x-auto">
                          {ep.requestBody}
                        </pre>
                      </div>
                    )}

                    {ep.queryParams && (
                      <div className="space-y-1 text-xs">
                        <span className="font-bold text-slate-700 font-mono">Query Parameters:</span>
                        <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 font-mono text-slate-700">
                          {ep.queryParams}
                        </div>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700 font-mono">Response Payload (200 OK):</span>
                        {apiSimulatedResponse && (
                          <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Simulation Status: 200 OK (Latency: 45ms)
                          </span>
                        )}
                      </div>
                      <pre className="p-3.5 bg-slate-900 text-sky-300 rounded-xl text-xs font-mono overflow-x-auto">
                        {apiSimulatedResponse || ep.responseBody}
                      </pre>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
