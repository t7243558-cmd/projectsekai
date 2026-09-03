import { Classroom, ActivityGroup, UserProfile, Announcement, ReadReceipt } from '../types';

export const CLASSROOMS: Classroom[] = [
  { id: 'c_m1_1', grade: 'ม.1', roomNumber: 'ม.1/1', advisorTeacherId: 'u_t2', advisorName: 'ครูสมชาย มีสุข', studentCount: 36, parentCount: 36 },
  { id: 'c_m1_2', grade: 'ม.1', roomNumber: 'ม.1/2', advisorTeacherId: 'u_t1', advisorName: 'ครูวิภาดา สมบูรณ์', studentCount: 38, parentCount: 38 },
  { id: 'c_m1_3', grade: 'ม.1', roomNumber: 'ม.1/3', advisorTeacherId: 'u_t3', advisorName: 'ครูศศิธร สว่างโลก', studentCount: 35, parentCount: 35 },
  { id: 'c_m4_1', grade: 'ม.4', roomNumber: 'ม.4/1', advisorTeacherId: 'u_t4', advisorName: 'ครูณัฐพล วิริยะกุล', studentCount: 40, parentCount: 40 },
  { id: 'c_m4_2', grade: 'ม.4', roomNumber: 'ม.4/2', advisorTeacherId: 'u_t5', advisorName: 'ครูเกษม พันธุ์พงศ์', studentCount: 38, parentCount: 38 },
];

export const ACTIVITY_GROUPS: ActivityGroup[] = [
  { id: 'grp_sci_math', name: 'สายวิทย์-คณิต', category: 'ACADEMIC_TRACK', memberCount: 120 },
  { id: 'grp_art_lang', name: 'สายศิลป์-ภาษา', category: 'ACADEMIC_TRACK', memberCount: 78 },
  { id: 'grp_marching_band', name: 'วงโยธวาทิต', category: 'CLUB', memberCount: 45 },
  { id: 'grp_robotics', name: 'ชมรมหุ่นยนต์ & STEM', category: 'CLUB', memberCount: 28 },
  { id: 'grp_bus_route_3', name: 'รถรับส่งนักเรียน สาย 3 (บางนา-ศรีนครินทร์)', category: 'LOGISTICS', memberCount: 32 },
  { id: 'grp_dorm', name: 'นักเรียนประจำหอพัก', category: 'SPECIAL', memberCount: 65 },
];

export const USERS: UserProfile[] = [
  {
    id: 'u_teacher_1',
    name: 'ครูวิภาดา สมบูรณ์',
    role: 'TEACHER',
    email: 'wiphada.s@school.ac.th',
    phone: '081-234-5678',
    department: 'กลุ่มสาระการเรียนรู้วิทยาศาสตร์ & ครูประจำชั้น ม.1/2',
    assignedClasses: ['c_m1_2'],
  },
  {
    id: 'u_parent_1',
    name: 'คุณมนิดา รักเรียน',
    role: 'PARENT',
    email: 'manida.parent@gmail.com',
    phone: '089-987-6543',
    children: [
      {
        id: 's_101',
        studentCode: '58421',
        name: 'ด.ช. ภัทรพล รักเรียน (น้องภัทร)',
        classroomId: 'c_m1_2',
        classroomName: 'ม.1/2',
        grade: 'ม.1',
        groups: ['grp_robotics'],
      }
    ]
  },
  {
    id: 'u_parent_2',
    name: 'คุณธนากร กิจเจริญ',
    role: 'PARENT',
    email: 'thanakorn.k@outlook.com',
    phone: '084-555-1234',
    children: [
      {
        id: 's_401',
        studentCode: '56102',
        name: 'นาย มินทร์ กิจเจริญ (น้องมิน)',
        classroomId: 'c_m4_1',
        classroomName: 'ม.4/1',
        grade: 'ม.4',
        trackId: 'grp_sci_math',
        groups: ['grp_sci_math', 'grp_marching_band', 'grp_bus_route_3'],
      }
    ]
  },
  {
    id: 'u_parent_3',
    name: 'คุณพิมพา สุวรรณฉัตร',
    role: 'PARENT',
    email: 'pimpa.suwan@yahoo.com',
    phone: '082-333-8899',
    children: [
      {
        id: 's_402',
        studentCode: '56108',
        name: 'น.ส. ฟ้าใส สุวรรณฉัตร (น้องฟ้า)',
        classroomId: 'c_m4_2',
        classroomName: 'ม.4/2',
        grade: 'ม.4',
        trackId: 'grp_art_lang',
        groups: ['grp_art_lang'],
      }
    ]
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann_critical_pm25',
    title: '🚨 ประกาศปิดเรียนกรณีพิเศษ: วิกฤตฝุ่นละออง PM 2.5 เกินค่ามาตรฐานระดับสีแดงเข้ม',
    summary: 'แจ้งหยุดการเรียนการสอน On-site ในวันศุกร์นี้ และปรับเป็นระบบ Online 100% ผ่าน Google Classroom',
    content: 'สืบเนื่องจากสถานการณ์ค่ามลพิษทางอากาศ (PM 2.5) ในพื้นที่โรงเรียนและบริเวณโดยรอบมีค่าเกิน 165 µg/m³ ซึ่งอยู่ในเกณฑ์อันตรายต่อสุขภาพของนักเรียน ทางโรงเรียนจึงขอประกาศหยุดเรียนกรณีฉุกเฉินในวันศุกร์นี้ เพื่อความปลอดภัยสูงสุด และให้นักเรียนเข้าเรียนผ่านระบบออนไลน์ตามตารางเรียนปกติ',
    priority: 'CRITICAL',
    author: {
      id: 'u_admin_1',
      name: 'ฝ่ายบริหารงานวิชาการและกิจการนักเรียน',
      role: 'ผู้อำนวยการโรงเรียน',
    },
    targets: {
      scopeType: 'ALL_SCHOOL',
      gradeLevels: [],
      classroomIds: [],
      groupIds: [],
      roles: ['PARENT', 'STUDENT'],
    },
    targetCountEstimate: 1140,
    requiresAcknowledgment: true,
    images: [
      'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1000&q=80',
    ],
    createdAt: '2026-09-02T07:15:00Z',
    publishedAt: '2026-09-02T07:15:00Z',
    isPinned: true,
  },
  {
    id: 'ann_appointment_m1_2',
    title: '📅 นัดหมายการประชุมผู้ปกครองและสานสัมพันธ์ชั้นเรียน ประจำห้อง ม.1/2',
    summary: 'ประชุมติดตามผลการเรียนกลางภาคและแนวทางการดูแลนักเรียน ณ อาคารเฉลิมพระเกียรติ ห้อง 312',
    content: 'เรียนท่านผู้ปกครองห้อง ม.1/2 ทุกท่าน ขอเรียนเชิญเข้าร่วมประชุมผู้ปกครองประจำภาคเรียน เพื่อปรึกษาหารือเกี่ยวกับพัฒนาการทางอารมณ์และผลการเรียนรายวิชาหลัก พร้อมร่วมสร้างเครือข่ายผู้ปกครองในห้องเรียน\n\nกำหนดการ:\n08:30 - 09:00 ลงทะเบียนและรับแฟ้มผลงานนักเรียน\n09:00 - 10:30 ชี้แจงภาพรวมและพบครูที่ปรึกษา\n10:30 - 11:30 ปรึกษารายบุคคล',
    priority: 'APPOINTMENT',
    author: {
      id: 'u_teacher_1',
      name: 'ครูวิภาดา สมบูรณ์',
      role: 'ครูประจำชั้น ม.1/2',
    },
    targets: {
      scopeType: 'SPECIFIC_CLASSES',
      gradeLevels: ['ม.1'],
      classroomIds: ['c_m1_2'],
      groupIds: [],
      roles: ['PARENT'],
    },
    targetCountEstimate: 38,
    eventDetails: {
      startDateTime: '2026-09-08T08:30:00+07:00',
      endDateTime: '2026-09-08T11:30:00+07:00',
      location: 'อาคารเฉลิมพระเกียรติ ห้อง 312 โรงเรียนสาธิตฯ',
      isAllDay: false,
      requiresRsvp: true,
    },
    requiresAcknowledgment: true,
    images: [
      'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1000&q=80',
    ],
    createdAt: '2026-09-01T10:00:00Z',
    publishedAt: '2026-09-01T10:00:00Z',
  },
  {
    id: 'ann_marching_band',
    title: '🎺 กำหนดการเข้าค่ายเก็บตัวฝึกซ้อมดนตรี วงโยธวาทิต ชิงถ้วยพระราชทาน',
    summary: 'แจ้งตารางเวลาซ้อมพิเศษช่วงเสาร์-อาทิตย์ พร้อมรายการเครื่องแต่งกายและอาหารที่จัดเตรียม',
    content: 'เรียนผู้ปกครองสมาชิกวงโยธวาทิตทุกท่าน ทางวงขอแจ้งตารางการฝึกซ้อมภาคสนามเข้มข้น เพื่อเตรียมความพร้อมสำหรับการประกวดระดับประเทศในเดือนหน้า โดยขอให้นักเรียนนำเครื่องดนตรีส่วนตัวและชุดซ้อมมาให้พร้อม รถโรงเรียนจะออกเดินทางเวลา 07:00 น. จากหน้าอาคารดนตรี',
    priority: 'GENERAL',
    author: {
      id: 'u_teacher_music',
      name: 'อ.เอกชัย เสียงสวรรค์',
      role: 'ผู้ดูแลชมรมดนตรีสากล',
    },
    targets: {
      scopeType: 'SPECIFIC_GROUPS',
      gradeLevels: [],
      classroomIds: [],
      groupIds: ['grp_marching_band'],
      roles: ['PARENT'],
    },
    targetCountEstimate: 45,
    eventDetails: {
      startDateTime: '2026-09-12T07:00:00+07:00',
      endDateTime: '2026-09-13T17:00:00+07:00',
      location: 'ศูนย์กีฬาและค่ายลูกเสือจังหวัดนครนายก',
      isAllDay: false,
    },
    requiresAcknowledgment: false,
    images: [
      'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80',
    ],
    createdAt: '2026-08-30T14:20:00Z',
    publishedAt: '2026-08-30T14:20:00Z',
  },
  {
    id: 'ann_sci_track_camp',
    title: '🔬 การลงทะเบียนค่ายโครงงานนวัตกรรมวิทยาศาสตร์และ AI สำหรับ ม.4 สายวิทย์-คณิต',
    summary: 'เปิดรับลงทะเบียนค่ายสัญจรศึกษาดูงาน ณ สวทช. และสถาบันวิจัยวิทยาศาสตร์ (โควต้าจำกัด)',
    content: 'กลุ่มสาระวิทยาศาสตร์ขอเชิญชวนนักเรียนชั้น ม.4 สายวิทย์-คณิต และผู้ปกครองที่สนใจ เข้าร่วมค่ายเปิดโลกทัศน์วิจัยและเทคโนโลยีปัญญาประดิษฐ์ เป็นระยะเวลา 2 วัน 1 คืน ค่าใช้จ่ายได้รับการสนับสนุน 70% จากทุนพัฒนาวิชาการ',
    priority: 'GENERAL',
    author: {
      id: 'u_teacher_sci',
      name: 'ครูณัฐพล วิริยะกุล',
      role: 'หัวหน้ากลุ่มสาระวิทย์',
    },
    targets: {
      scopeType: 'SPECIFIC_GROUPS',
      gradeLevels: ['ม.4'],
      classroomIds: [],
      groupIds: ['grp_sci_math'],
      roles: ['PARENT', 'STUDENT'],
    },
    targetCountEstimate: 120,
    requiresAcknowledgment: false,
    createdAt: '2026-08-28T09:00:00Z',
    publishedAt: '2026-08-28T09:00:00Z',
  },
  {
    id: 'ann_bus_route_3',
    title: '🚌 แจ้งการปรับเปลี่ยนจุดจอดรับส่งนักเรียนชั่วคราว: รถตู้สาย 3 (บางนา-ศรีนครินทร์)',
    summary: 'เนื่องจากมีการซ่อมแซมผิวจราจรบริเวณซอยอุดมสุข ปรับจุดนัดพบเป็นปั๊ม ปตท. เวลา 06:40 น.',
    content: 'เรียนผู้ปกครองที่ใช้บริการรถโรงเรียนสาย 3 สืบเนื่องจากงานก่อสร้างท่อระบายน้ำบริเวณถนนอุดมสุข ทำให้รถตู้ไม่สามารถเลี้ยวเข้าจุดรับเดิมได้ ทางทีมบริหารการเดินรถจึงขอปรับจุดรับขึ้นรถชั่วคราวเป็นเวลา 3 วัน ตั้งแต่วันจันทร์ถึงวันพุธหน้า',
    priority: 'GENERAL',
    author: {
      id: 'u_admin_logistics',
      name: 'ฝ่ายบริการการขนส่งและยานพาหนะ',
      role: 'ผู้จัดการงานบริการ',
    },
    targets: {
      scopeType: 'SPECIFIC_GROUPS',
      gradeLevels: [],
      classroomIds: [],
      groupIds: ['grp_bus_route_3'],
      roles: ['PARENT'],
    },
    targetCountEstimate: 32,
    requiresAcknowledgment: true,
    createdAt: '2026-09-02T06:30:00Z',
    publishedAt: '2026-09-02T06:30:00Z',
  }
];

// Mock read receipts data for the classroom announcement (c_m1_2)
export const MOCK_READ_RECEIPTS_M1_2: ReadReceipt[] = [
  {
    id: 'rcpt_1',
    announcementId: 'ann_appointment_m1_2',
    userId: 'u_parent_1',
    userName: 'คุณมนิดา รักเรียน',
    userRole: 'PARENT',
    studentName: 'ด.ช. ภัทรพล รักเรียน',
    classroomName: 'ม.1/2',
    readAt: '2026-09-01T10:45:00Z',
    isRead: true,
    acknowledgedAt: '2026-09-01T10:46:20Z',
    notifiedChannels: ['PUSH', 'IN_APP'],
    deliveryStatus: 'DELIVERED',
  },
  {
    id: 'rcpt_2',
    announcementId: 'ann_appointment_m1_2',
    userId: 'u_p_102',
    userName: 'คุณกิตติศักดิ์ ชัยมงคล',
    userRole: 'PARENT',
    studentName: 'ด.ช. ธีรภัทร ชัยมงคล',
    classroomName: 'ม.1/2',
    readAt: '2026-09-01T11:12:00Z',
    isRead: true,
    acknowledgedAt: '2026-09-01T11:15:00Z',
    notifiedChannels: ['PUSH'],
    deliveryStatus: 'DELIVERED',
  },
  {
    id: 'rcpt_3',
    announcementId: 'ann_appointment_m1_2',
    userId: 'u_p_103',
    userName: 'คุณวรรณา เจริญศิลป์',
    userRole: 'PARENT',
    studentName: 'ด.ญ. กานต์พิชชา เจริญศิลป์',
    classroomName: 'ม.1/2',
    readAt: '2026-09-01T13:30:00Z',
    isRead: true,
    acknowledgedAt: null,
    notifiedChannels: ['PUSH'],
    deliveryStatus: 'DELIVERED',
  },
  {
    id: 'rcpt_4',
    announcementId: 'ann_appointment_m1_2',
    userId: 'u_p_104',
    userName: 'คุณอนุรักษ์ ปรีชาชาญ',
    userRole: 'PARENT',
    studentName: 'ด.ช. ชนน ปรีชาชาญ',
    classroomName: 'ม.1/2',
    readAt: null,
    isRead: false,
    acknowledgedAt: null,
    notifiedChannels: ['PUSH', 'SMS'],
    deliveryStatus: 'DELIVERED',
  },
  {
    id: 'rcpt_5',
    announcementId: 'ann_appointment_m1_2',
    userId: 'u_p_105',
    userName: 'คุณกรรณิการ์ ทองสุข',
    userRole: 'PARENT',
    studentName: 'ด.ญ. ณัฐมน ทองสุข',
    classroomName: 'ม.1/2',
    readAt: null,
    isRead: false,
    acknowledgedAt: null,
    notifiedChannels: ['PUSH'],
    deliveryStatus: 'DELIVERED',
  },
  {
    id: 'rcpt_6',
    announcementId: 'ann_appointment_m1_2',
    userId: 'u_p_106',
    userName: 'คุณสุรชัย วงศ์สว่าง',
    userRole: 'PARENT',
    studentName: 'ด.ช. พงศกร วงศ์สว่าง',
    classroomName: 'ม.1/2',
    readAt: '2026-09-01T15:05:00Z',
    isRead: true,
    acknowledgedAt: '2026-09-01T15:08:00Z',
    notifiedChannels: ['PUSH'],
    deliveryStatus: 'DELIVERED',
  },
];

export interface PresetImage {
  id: string;
  title: string;
  category: string;
  url: string;
}

export const PRESET_SCHOOL_IMAGES: PresetImage[] = [
  {
    id: 'img_meeting',
    title: 'ห้องประชุม/สัมมนา',
    category: 'นัดหมาย',
    url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'img_pm25',
    title: 'ประกาศมลพิษ PM 2.5',
    category: 'วิกฤต/ฉุกเฉิน',
    url: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'img_activities',
    title: 'กิจกรรมดนตรี/วงโยธวาทิต',
    category: 'กิจกรรม',
    url: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'img_stem',
    title: 'ห้องทดลองวิทยาศาสตร์/หุ่นยนต์',
    category: 'วิชาการ',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'img_sports',
    title: 'สนามกีฬาและการแข่งขัน',
    category: 'กีฬา',
    url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'img_bus',
    title: 'รถรับส่งและเส้นทางเดินรถ',
    category: 'การเดินทาง',
    url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1000&q=80',
  },
];

