export type UserRole = 'TEACHER' | 'PARENT' | 'STUDENT' | 'ADMIN';

export type AnnouncementPriority = 'CRITICAL' | 'GENERAL' | 'APPOINTMENT';

export interface Classroom {
  id: string;
  grade: string; // e.g., 'ม.1', 'ม.4'
  roomNumber: string; // e.g., 'ม.1/2', 'ม.4/1'
  advisorTeacherId: string;
  advisorName: string;
  studentCount: number;
  parentCount: number;
}

export interface ActivityGroup {
  id: string;
  name: string; // e.g., 'สายวิทย์-คณิต', 'วงโยธวาทิต', 'รถรับส่งสาย 3'
  category: 'ACADEMIC_TRACK' | 'CLUB' | 'LOGISTICS' | 'SPECIAL';
  memberCount: number;
}

export interface Student {
  id: string;
  studentCode: string;
  name: string;
  classroomId: string;
  classroomName: string;
  grade: string;
  trackId?: string;
  groups: string[]; // Group IDs
}

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  phone: string;
  avatarUrl?: string;
  // If Parent, list of children
  children?: Student[];
  // If Teacher, assigned classes and subject
  assignedClasses?: string[];
  department?: string;
}

export interface TargetFilter {
  scopeType: 'ALL_SCHOOL' | 'SPECIFIC_GRADES' | 'SPECIFIC_CLASSES' | 'SPECIFIC_GROUPS';
  gradeLevels: string[]; // e.g., ['ม.1', 'ม.2']
  classroomIds: string[]; // e.g., ['c_m1_2']
  groupIds: string[]; // e.g., ['grp_sci_track', 'grp_marching_band']
  roles: UserRole[]; // Targets: PARENT, STUDENT, or both
}

export interface EventSchedule {
  startDateTime: string; // ISO 8601
  endDateTime: string;
  location: string;
  isAllDay?: boolean;
  requiresRsvp?: boolean;
  googleCalendarUrl?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  summary: string;
  priority: AnnouncementPriority;
  author: {
    id: string;
    name: string;
    role: string;
    avatarUrl?: string;
  };
  targets: TargetFilter;
  targetCountEstimate: number;
  eventDetails?: EventSchedule;
  attachments?: {
    id: string;
    name: string;
    fileType: 'pdf' | 'image' | 'link';
    url: string;
    sizeKb: number;
  }[];
  requiresAcknowledgment?: boolean;
  createdAt: string;
  publishedAt: string;
  expiresAt?: string;
  isPinned?: boolean;
}

export interface ReadReceipt {
  id: string;
  announcementId: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  studentName?: string;
  classroomName?: string;
  readAt: string | null; // null if unread
  isRead: boolean;
  acknowledgedAt?: string | null;
  notifiedChannels: ('PUSH' | 'SMS' | 'IN_APP')[];
  deliveryStatus: 'DELIVERED' | 'FAILED' | 'PENDING';
}

export interface NotificationChannelMetrics {
  totalTargeted: number;
  deliveredPush: number;
  deliveredSms: number;
  readCount: number;
  unreadCount: number;
  acknowledgedCount: number;
  readRatePercentage: number;
}
