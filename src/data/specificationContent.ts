export const SQL_DDL_SCHEMA = `-- ==============================================================================
-- SCHOOL COMMUNICATION HUB - DATABASE SCHEMA (PostgreSQL 15+)
-- Designed for: High-concurrency, zero-noise targeted feeds, read-receipt audits
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- 2. ENUM TYPES
CREATE TYPE user_role_enum AS ENUM ('ADMIN', 'TEACHER', 'PARENT', 'STUDENT');
CREATE TYPE priority_level_enum AS ENUM ('CRITICAL', 'GENERAL', 'APPOINTMENT');
CREATE TYPE target_scope_enum AS ENUM ('ALL_SCHOOL', 'SPECIFIC_GRADES', 'SPECIFIC_CLASSES', 'SPECIFIC_GROUPS');
CREATE TYPE group_category_enum AS ENUM ('ACADEMIC_TRACK', 'CLUB', 'LOGISTICS', 'SPECIAL');
CREATE TYPE delivery_channel_enum AS ENUM ('PUSH', 'SMS', 'IN_APP', 'LINE_OA');
CREATE TYPE delivery_status_enum AS ENUM ('PENDING', 'DELIVERED', 'FAILED', 'BOUNCED');

-- 3. CORE USERS TABLE
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    national_id VARCHAR(13) UNIQUE,
    phone_number VARCHAR(15) NOT NULL UNIQUE,
    email VARCHAR(255) UNIQUE,
    full_name VARCHAR(120) NOT NULL,
    role user_role_enum NOT NULL,
    avatar_url TEXT,
    fcm_token TEXT,
    apns_token TEXT,
    calendar_sync_token UUID DEFAULT uuid_generate_v4() UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_phone ON users(phone_number);

-- 4. ACADEMIC STRUCTURE (Classrooms & Grades)
CREATE TABLE classrooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    academic_year INT NOT NULL, -- e.g. 2026
    grade_level VARCHAR(20) NOT NULL, -- e.g. 'ม.1', 'ม.4'
    room_number VARCHAR(20) NOT NULL, -- e.g. '1/2', '4/1'
    advisor_teacher_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX uq_classroom_year_room ON classrooms(academic_year, grade_level, room_number);

-- 5. STUDENTS & PARENT RELATIONSHIP (Mapping Table)
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_code VARCHAR(20) NOT NULL UNIQUE,
    full_name VARCHAR(120) NOT NULL,
    classroom_id UUID NOT NULL REFERENCES classrooms(id) ON DELETE RESTRICT,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- if student has app account
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE parent_student_relations (
    parent_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    relationship_type VARCHAR(50) DEFAULT 'GUARDIAN', -- FATHER, MOTHER, GUARDIAN
    is_primary_contact BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (parent_id, student_id)
);

-- 6. SPECIAL ACTIVITY & INTEREST GROUPS (Clubs, Bus, Academic Tracks)
CREATE TABLE activity_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    category group_category_enum NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE student_group_memberships (
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    group_id UUID NOT NULL REFERENCES activity_groups(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (student_id, group_id)
);

-- 7. ANNOUNCEMENTS TABLE (The Core Broadcast Object)
CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    title VARCHAR(255) NOT NULL,
    summary VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    priority priority_level_enum NOT NULL DEFAULT 'GENERAL',
    requires_acknowledgment BOOLEAN DEFAULT FALSE,
    target_scope target_scope_enum NOT NULL,
    
    -- Target filters stored as JSONB for high flexibility & fast GIN lookup
    -- e.g. {"grade_levels": ["ม.1"], "classroom_ids": ["uuid..."], "group_ids": ["uuid..."], "roles": ["PARENT"]}
    target_filter JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    -- Event & Calendar Synchronization Fields
    is_calendar_event BOOLEAN DEFAULT FALSE,
    event_start_at TIMESTAMPTZ,
    event_end_at TIMESTAMPTZ,
    event_location VARCHAR(255),
    event_rsvp_deadline TIMESTAMPTZ,
    
    published_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMPTZ,
    is_pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_announcements_priority ON announcements(priority);
CREATE INDEX idx_announcements_published_at ON announcements(published_at DESC);
CREATE INDEX idx_announcements_target_filter ON announcements USING gin (target_filter);

-- 8. READ RECEIPTS & ACKNOWLEDGMENTS (Audit Trail)
CREATE TABLE announcement_read_receipts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    announcement_id UUID NOT NULL REFERENCES announcements(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE, -- context of which child prompted notice
    
    first_read_at TIMESTAMPTZ,
    is_read BOOLEAN GENERATED ALWAYS AS (first_read_at IS NOT NULL) STORED,
    acknowledged_at TIMESTAMPTZ,
    read_channel delivery_channel_enum DEFAULT 'IN_APP',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX uq_read_receipt_user_announcement ON announcement_read_receipts(announcement_id, user_id);
CREATE INDEX idx_read_receipts_unread ON announcement_read_receipts(announcement_id) WHERE first_read_at IS NULL;

-- 9. NOTIFICATION DISPATCH LOGS
CREATE TABLE notification_dispatch_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    announcement_id UUID NOT NULL REFERENCES announcements(id) ON DELETE CASCADE,
    recipient_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    channel delivery_channel_enum NOT NULL,
    status delivery_status_enum NOT NULL DEFAULT 'PENDING',
    retry_count INT DEFAULT 0,
    external_message_id VARCHAR(255),
    error_reason TEXT,
    dispatched_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_dispatch_status ON notification_dispatch_logs(announcement_id, status);
`;

export const ARCHITECTURE_SPECS = {
  notificationTiers: [
    {
      level: '🚨 CRITICAL (วิกฤต / เร่งด่วน)',
      color: 'red',
      criteria: 'ภัยพิบัติ, ฝุ่น PM2.5 วิกฤต, สั่งปิดเรียนฉุกเฉิน, อุบัติเหตุ/ความปลอดภัยในโรงเรียน',
      channels: 'APNs/FCM High Priority Push (ทะลุ Focus/DND mode), SMS Gateway fallback, โทรแจ้งเตือนอัตโนมัติหากยังไม่อ่านใน 30 นาที',
      behavior: 'Pinned Header แดงกระพริบ, มีปุ่ม "กดรับทราบ (Acknowledge)" และบันทึก Digital Audit Trail ทันที'
    },
    {
      level: '📅 APPOINTMENT (นัดหมาย / ปฏิทิน)',
      color: 'blue',
      criteria: 'ประชุมผู้ปกครอง, วันสอบกลางภาค/ปลายภาค, กิจกรรมทัศนศึกษา, วันส่งแฟ้มผลงาน',
      channels: 'Push Notification + In-App Event Card พร้อม 1-Click Sync ไปยัง Google / Apple Calendar',
      behavior: 'แจ้งเตือนซ้ำก่อนเริ่ม 24 ชั่วโมง และ 2 ชั่วโมงล่วงหน้าอัตโนมัติ พร้อมส่งลิงก์ RSVP เข้าร่วม'
    },
    {
      level: '📢 GENERAL (ประกาศทั่วไป)',
      color: 'slate',
      criteria: 'แจ้งข่าวสารกิจกรรมชมรม, ตารางฝึกซ้อม, บทความแนะแนว, การเปลี่ยนจุดจอดรถโรงเรียน',
      channels: 'Standard Push ในช่วงเวลาทำการ (07:30 - 18:30 น.) หรือรวมเป็น Daily Digest เพื่อลด Notification Fatigue',
      behavior: 'ส่งเฉพาะกลุ่มเป้าหมายที่เกี่ยวข้อง 100% ไม่ส่งกระจายข้ามห้องหรือข้ามสายการเรียน'
    }
  ],
  filteringAlgorithm: [
    {
      step: '1. Multi-Dimensional Tagging',
      detail: 'ประกาศแต่ละฉบับจะถูกผูกด้วย JSONB Target Filter: ระดับชั้น (Grades), รหัสห้องเรียน (Classrooms), กลุ่มกิจกรรม/สายการเรียน (Groups), และบทบาทเป้าหมาย (Roles)'
    },
    {
      step: '2. Recipient Resolution Engine (Set Intersection)',
      detail: 'เมื่อประกาศถูกเผยแพร่ Worker Service (เช่น BullMQ / Cloud Tasks) จะดึง User IDs ของผู้ปกครองที่มีบุตรหลานตรงตามเงื่อนไข (Child ∈ Classrooms OR Child ∈ Groups) เพื่อสร้าง Read Receipt Record และ Dispatch Job'
    },
    {
      step: '3. Zero-Noise Feed Query',
      detail: 'หน้า Feed ของผู้ปกครองจะทำ SQL WHERE Clause ผูกกับบุตรหลานของผู้ปกครองคนนั้นแบบ Real-time ทำให้หมดปัญหา "ผู้ปกครอง ม.1 เห็นประกาศซ่อมรถตู้สาย 8 หรือตารางสอบ ม.6"'
    }
  ],
  calendarSyncMethods: [
    {
      type: 'Direct Deep Link (Google Calendar)',
      mechanism: 'สร้าง Web URL เข้ารหัส `calendar.google.com/calendar/render` พร้อมกรอกหัวข้อ วันเวลา สถานที่ และรายละเอียดล่วงหน้า ผู้ปกครองกดปุ่มเดียว ปฏิทินบันทึกทันทีโดยไม่ต้อง Login ซ้ำ'
    },
    {
      type: 'Apple Calendar / Outlook (.ics Download & WebCal Feed)',
      mechanism: 'สร้างไฟล์มาตรฐาน iCalendar (RFC 5545) เมื่อกดดาวน์โหลดบน iOS จะเปิดแอป Calendar เพื่อเพิ่ม Event พร้อมตั้งค่าแจ้งเตือนล่วงหน้า 1 วันโดยอัตโนมัติ'
    },
    {
      type: 'Dynamic Subscription URL (WebCal)',
      mechanism: 'ผู้ปกครองแต่ละคนมี Secret Token เฉพาะตัว เช่น `webcal://school.edu/api/v1/calendar/sync/{token}.ics` สามารถ Subscribe ครั้งเดียว ตารางนัดหมายทั้งหมดของลูกจะซิงก์อัปเดตแบบ Live ตลอดปีการศึกษา'
    }
  ]
};

export const API_ENDPOINTS_DOC = [
  {
    method: 'POST',
    path: '/api/v1/announcements',
    title: 'สร้างประกาศใหม่พร้อมกำหนดกลุ่มเป้าหมาย (Create Targeted Announcement)',
    auth: 'Bearer Token (Role: TEACHER, ADMIN)',
    description: 'ครูหรือฝ่ายบริหารสร้างประกาศ ระบุระดับความสำคัญ กลุ่มเป้าหมาย ข้อมูลนัดหมายปฏิทิน และไฟล์แนบ',
    requestBody: `{
  "title": "นัดหมายการประชุมผู้ปกครองภาคเรียนที่ 1 ประจำห้อง ม.1/2",
  "summary": "ประชุมติดตามผลการเรียนและพัฒนาการนักเรียน ณ อาคาร 3",
  "content": "เรียนท่านผู้ปกครองห้อง ม.1/2 ทุกท่าน ขอเรียนเชิญเข้าร่วมประชุม...",
  "priority": "APPOINTMENT",
  "requires_acknowledgment": true,
  "targets": {
    "scope_type": "SPECIFIC_CLASSES",
    "grade_levels": ["ม.1"],
    "classroom_ids": ["9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"],
    "group_ids": [],
    "roles": ["PARENT"]
  },
  "is_calendar_event": true,
  "event_details": {
    "start_datetime": "2026-09-08T08:30:00+07:00",
    "end_datetime": "2026-09-08T11:30:00+07:00",
    "location": "ห้อง 312 อาคารเฉลิมพระเกียรติ",
    "requires_rsvp": true
  }
}`,
    responseBody: `{
  "status": "success",
  "data": {
    "announcement_id": "e4a781b2-1111-4444-8888-c0a801234567",
    "target_recipient_count": 38,
    "dispatched_notifications": {
      "push_queued": 38,
      "sms_queued": 0
    },
    "created_at": "2026-09-02T08:00:00Z"
  }
}`
  },
  {
    method: 'GET',
    path: '/api/v1/feed',
    title: 'ดึง Feed ข่าวสารตามสิทธิ์ของผู้ใช้ (Get Filtered User Feed)',
    auth: 'Bearer Token (Role: PARENT, STUDENT, TEACHER)',
    description: 'ดึงรายการประกาศที่คัดกรองเฉพาะห้องเรียน กิจกรรม และระดับชั้นที่บุตรหลานของผู้ปกครองสังกัดอยู่เท่านั้น',
    queryParams: `?priority=ALL&page=1&limit=20&unread_only=false`,
    responseBody: `{
  "status": "success",
  "meta": {
    "total_items": 4,
    "current_page": 1,
    "unread_count": 1
  },
  "data": [
    {
      "id": "ann_critical_pm25",
      "priority": "CRITICAL",
      "title": "🚨 ประกาศปิดเรียนกรณีพิเศษ: วิกฤตฝุ่นละออง PM 2.5",
      "summary": "หยุดเรียน On-site ปรับเป็น Online 100%",
      "published_at": "2026-09-02T07:15:00Z",
      "is_read": true,
      "requires_acknowledgment": true,
      "acknowledged_at": "2026-09-02T07:30:12Z",
      "author_name": "ผู้อำนวยการโรงเรียน"
    },
    {
      "id": "ann_appointment_m1_2",
      "priority": "APPOINTMENT",
      "title": "📅 นัดหมายการประชุมผู้ปกครองห้อง ม.1/2",
      "summary": "ประชุมติดตามผลการเรียน ณ อาคารเฉลิมพระเกียรติ",
      "published_at": "2026-09-01T10:00:00Z",
      "is_read": false,
      "requires_acknowledgment": true,
      "acknowledged_at": null,
      "event_details": {
        "start_datetime": "2026-09-08T08:30:00+07:00",
        "end_datetime": "2026-09-08T11:30:00+07:00",
        "location": "ห้อง 312"
      }
    }
  ]
}`
  },
  {
    method: 'PATCH',
    path: '/api/v1/announcements/{id}/read-status',
    title: 'อัปเดตสถานะการอ่านและรับทราบ (Update Read & Acknowledge Status)',
    auth: 'Bearer Token (Role: PARENT, STUDENT)',
    description: 'บันทึกเวลาที่เปิดอ่าน (Read) และการกดยืนยันรับทราบ (Acknowledge) พร้อม User-Agent และ IP สำหรับ Audit Trail',
    requestBody: `{
  "action": "ACKNOWLEDGE", // หรือ "MARK_AS_READ"
  "student_id": "s_101",
  "client_timestamp": "2026-09-02T08:15:22Z"
}`,
    responseBody: `{
  "status": "success",
  "data": {
    "announcement_id": "ann_appointment_m1_2",
    "user_id": "u_parent_1",
    "first_read_at": "2026-09-02T08:15:00Z",
    "acknowledged_at": "2026-09-02T08:15:22Z",
    "is_read": true
  }
}`
  },
  {
    method: 'GET',
    path: '/api/v1/announcements/{id}/read-receipts',
    title: 'เรียกดูสถิติและรายชื่อการอ่าน (Get Read Receipts & Analytics)',
    auth: 'Bearer Token (Role: TEACHER, ADMIN)',
    description: 'สำหรับครูผู้ส่งประกาศ ตรวจสอบอัตราการอ่าน (Read Rate %) รายชื่อผู้ปกครองที่อ่านแล้ว และรายชื่อที่ยังไม่ได้อ่าน',
    queryParams: `?status=ALL&classroom_id=c_m1_2`,
    responseBody: `{
  "status": "success",
  "analytics": {
    "total_targeted": 38,
    "read_count": 32,
    "unread_count": 6,
    "acknowledged_count": 28,
    "read_rate_percentage": 84.21
  },
  "unread_recipients": [
    {
      "user_id": "u_p_104",
      "parent_name": "คุณอนุรักษ์ ปรีชาชาญ",
      "student_name": "ด.ช. ชนน ปรีชาชาญ",
      "phone": "089-xxx-4455",
      "last_delivery_channel": "SMS"
    },
    {
      "user_id": "u_p_105",
      "parent_name": "คุณกรรณิการ์ ทองสุข",
      "student_name": "ด.ญ. ณัฐมน ทองสุข",
      "phone": "081-xxx-9922",
      "last_delivery_channel": "PUSH"
    }
  ]
}`
  },
  {
    method: 'POST',
    path: '/api/v1/announcements/{id}/remind-unread',
    title: 'ส่งการแจ้งเตือนสะกิดผู้ที่ยังไม่อ่าน (Nudge / Remind Unread Parents)',
    auth: 'Bearer Token (Role: TEACHER, ADMIN)',
    description: 'ครูกดปุ่มเดียวเพื่อส่ง Push หรือ SMS ซ้ำเฉพาะผู้ปกครองที่ยังไม่ได้อ่านประกาศสำคัญ',
    requestBody: `{
  "channel": "PUSH_AND_SMS",
  "custom_note": "กรุณาตรวจสอบนัดหมายเพื่อจัดเตรียมเอกสารล่วงหน้าค่ะ"
}`,
    responseBody: `{
  "status": "success",
  "message": "Dispatched reminders to 6 unread parents successfully",
  "dispatched_count": 6
}`
  }
];
