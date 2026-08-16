import type { User, Thread, Message, ForumPost, Deliverable, ContentUpload } from '../types';

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    email: 'admin@huntarsenal.com',
    name: 'Scott Admin',
    role: 'admin',
    status: 'active',
    joinedAt: '2024-01-15',
  },
  {
    id: 'u2',
    email: 'manager@huntarsenal.com',
    name: 'Jordan Manager',
    role: 'manager',
    status: 'active',
    joinedAt: '2024-03-01',
  },
  {
    id: 's1',
    email: 'alex.hunter@email.com',
    name: 'Alex Rivera',
    role: 'staff',
    region: 'Midwest',
    status: 'active',
    phone: '555-0101',
    joinedAt: '2025-02-10',
  },
  {
    id: 's2',
    email: 'sam.pro@email.com',
    name: 'Sam Torres',
    role: 'staff',
    region: 'Southeast',
    status: 'active',
    phone: '555-0102',
    joinedAt: '2025-04-22',
  },
  {
    id: 's3',
    email: 'casey.field@email.com',
    name: 'Casey Brooks',
    role: 'staff',
    region: 'West',
    status: 'active',
    phone: '555-0103',
    joinedAt: '2025-06-05',
  },
  {
    id: 's4',
    email: 'morgan.trail@email.com',
    name: 'Morgan Ellis',
    role: 'staff',
    region: 'Northeast',
    status: 'pending',
    joinedAt: '2026-07-18',
  },
  {
    id: 's5',
    email: 'jamie.ridge@email.com',
    name: 'Jamie Quinn',
    role: 'staff',
    region: 'Midwest',
    status: 'active',
    phone: '555-0105',
    joinedAt: '2025-09-12',
  },
];

export const MOCK_THREADS: Thread[] = [
  { id: 't1', participantIds: ['u2', 's1'], lastMessageAt: '2026-08-14T18:22:00Z', unreadCount: 1 },
  { id: 't2', participantIds: ['u2', 's2'], lastMessageAt: '2026-08-13T14:05:00Z', unreadCount: 0 },
  { id: 't3', participantIds: ['u2', 's3'], lastMessageAt: '2026-08-12T09:41:00Z', unreadCount: 2 },
  { id: 't4', participantIds: ['u2', 's5'], lastMessageAt: '2026-08-10T16:30:00Z', unreadCount: 0 },
];

export const MOCK_MESSAGES: Message[] = [
  {
    id: 'm1',
    threadId: 't1',
    senderId: 'u2',
    content: 'Hey Alex — we need content from the Cloud Freedom setup this weekend if possible.',
    createdAt: '2026-08-14T15:00:00Z',
  },
  {
    id: 'm2',
    threadId: 't1',
    senderId: 's1',
    content: 'Got it. Planning a sit Saturday morning. Will upload photos + short clip by Sunday night.',
    createdAt: '2026-08-14T18:22:00Z',
  },
  {
    id: 'm3',
    threadId: 't2',
    senderId: 'u2',
    content: 'Sam, reminder about the dealer demo next Thursday.',
    createdAt: '2026-08-13T14:05:00Z',
  },
  {
    id: 'm4',
    threadId: 't3',
    senderId: 'u2',
    content: 'Casey — any update on the RZR platform feedback?',
    createdAt: '2026-08-12T09:00:00Z',
  },
  {
    id: 'm5',
    threadId: 't3',
    senderId: 's3',
    content: 'Still gathering notes. Will send a write-up tomorrow.',
    createdAt: '2026-08-12T09:41:00Z',
  },
];

export const MOCK_FORUM: ForumPost[] = [
  {
    id: 'f1',
    authorId: 's1',
    title: 'Best pack setup for all-day mobile?',
    content: 'Looking for recommendations on how you all are packing the Cloud Freedom + sticks for 8+ hour days. Weight distribution tips appreciated.',
    createdAt: '2026-08-13T11:20:00Z',
    replies: [
      {
        id: 'r1',
        authorId: 's5',
        content: 'I run a smaller daypack and keep the platform on the outside. Makes a huge difference on longer hikes.',
        createdAt: '2026-08-13T14:05:00Z',
      },
      {
        id: 'r2',
        authorId: 's2',
        content: 'Same. Also stopped carrying extra layers I never use. Cut almost 3 lbs.',
        createdAt: '2026-08-13T16:40:00Z',
      },
    ],
  },
  {
    id: 'f2',
    authorId: 's3',
    title: 'Content ideas for early season',
    content: 'Anyone shooting tree transitions or entry/exit footage yet? Looking for inspiration before the season really kicks off.',
    createdAt: '2026-08-11T08:15:00Z',
    replies: [],
  },
];

export const MOCK_DELIVERABLES: Deliverable[] = [
  {
    id: 'd1',
    title: 'Cloud Freedom field photos',
    description: 'Upload 8–12 high-quality stills from a real hunt setup.',
    assignedTo: ['s1', 's5'],
    status: 'in_progress',
    dueDate: '2026-08-18',
    createdBy: 'u2',
    createdAt: '2026-08-10T10:00:00Z',
  },
  {
    id: 'd2',
    title: 'Dealer demo video (30–60s)',
    description: 'Short walkthrough of platform features for dealer partners.',
    assignedTo: ['s2'],
    status: 'not_started',
    dueDate: '2026-08-22',
    createdBy: 'u2',
    createdAt: '2026-08-12T14:30:00Z',
  },
  {
    id: 'd3',
    title: 'Season kickoff social assets',
    description: '3–5 vertical clips suitable for Instagram/TikTok.',
    assignedTo: ['s1', 's2', 's3', 's5'],
    status: 'not_started',
    dueDate: '2026-08-25',
    createdBy: 'u2',
    createdAt: '2026-08-14T09:00:00Z',
  },
];

export const MOCK_UPLOADS: ContentUpload[] = [
  {
    id: 'c1',
    userId: 's1',
    filename: 'cloud-freedom-morning-sit.jpg',
    type: 'image/jpeg',
    url: '#',
    uploadedAt: '2026-08-09T20:15:00Z',
    deliverableId: 'd1',
  },
];
