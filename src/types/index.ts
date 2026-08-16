export type Role = 'admin' | 'manager' | 'staff';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar?: string;
  region?: string;
  status: 'active' | 'inactive' | 'pending';
  phone?: string;
  joinedAt: string;
}

export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  content: string;
  createdAt: string;
  isBroadcast?: boolean;
}

export interface Thread {
  id: string;
  participantIds: string[]; // usually [managerId, staffId]
  lastMessageAt: string;
  unreadCount: number;
}

export interface ForumPost {
  id: string;
  authorId: string;
  title: string;
  content: string;
  createdAt: string;
  replies: ForumReply[];
}

export interface ForumReply {
  id: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export interface Deliverable {
  id: string;
  title: string;
  description: string;
  assignedTo: string[]; // user ids
  status: 'not_started' | 'in_progress' | 'done';
  dueDate?: string;
  createdBy: string;
  createdAt: string;
  notes?: string;
}

export interface ContentUpload {
  id: string;
  userId: string;
  filename: string;
  type: string;
  url: string; // mock
  uploadedAt: string;
  deliverableId?: string;
  notes?: string;
}
