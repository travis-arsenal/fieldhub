import { useParams, Link } from 'react-router-dom';
import { MOCK_USERS, MOCK_THREADS, MOCK_MESSAGES, MOCK_DELIVERABLES, MOCK_UPLOADS } from '../data/mock';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, MessageSquare, ClipboardList, Upload, Send } from 'lucide-react';
import { format } from 'date-fns';
import { useState, useMemo } from 'react';
import type { Message } from '../types';

export function StaffDetail() {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();
  const staff = MOCK_USERS.find((u) => u.id === id && u.role === 'staff');

  // Find or create thread between current manager and this staff
  const thread = MOCK_THREADS.find(
    (t) => t.participantIds.includes(id || '') && t.participantIds.includes(currentUser?.id || '')
  );

  const [localMessages, setLocalMessages] = useState<Message[]>(
    MOCK_MESSAGES.filter((m) => m.threadId === thread?.id)
  );
  const [newMessage, setNewMessage] = useState('');

  const deliverables = MOCK_DELIVERABLES.filter((d) => d.assignedTo.includes(id || ''));
  const uploads = MOCK_UPLOADS.filter((u) => u.userId === id);

  const handleSend = () => {
    if (!newMessage.trim() || !currentUser || !thread) return;
    const msg: Message = {
      id: `m-${Date.now()}`,
      threadId: thread.id,
      senderId: currentUser.id,
      content: newMessage.trim(),
      createdAt: new Date().toISOString(),
    };
    setLocalMessages((prev) => [...prev, msg]);
    setNewMessage('');
  };

  if (!staff) {
    return (
      <div className="p-8">
        <p className="text-arsenal-muted">Staff member not found.</p>
        <Link to="/staff" className="text-arsenal-teal hover:underline text-sm mt-2 inline-block">
          ← Back to directory
        </Link>
      </div>
    );
  }

  const statusStyles: Record<string, string> = {
    active: 'bg-arsenal-teal/15 text-arsenal-teal',
    inactive: 'bg-white/10 text-arsenal-muted',
    pending: 'bg-amber-500/15 text-amber-400',
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/staff"
          className="inline-flex items-center gap-2 text-sm text-arsenal-muted hover:text-white mb-4"
        >
          <ArrowLeft size={16} />
          Back to Staff Directory
        </Link>

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-arsenal-teal/20 flex items-center justify-center text-arsenal-teal text-xl font-semibold">
            {staff.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-semibold">{staff.name}</h1>
            <div className="flex items-center gap-3 mt-1 text-sm text-arsenal-muted">
              <span>{staff.email}</span>
              {staff.region && <span>· {staff.region}</span>}
              <span className={`text-xs px-2.5 py-0.5 rounded-full capitalize ${statusStyles[staff.status]}`}>
                {staff.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Conversation */}
        <section className="bg-arsenal-card border border-arsenal-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-arsenal-border flex items-center gap-2">
            <MessageSquare size={18} className="text-arsenal-teal" />
            <h2 className="font-medium">Conversation</h2>
          </div>

          <div className="p-5 max-h-80 overflow-y-auto space-y-3">
            {localMessages.length === 0 ? (
              <p className="text-sm text-arsenal-muted text-center py-6">No messages yet.</p>
            ) : (
              localMessages
                .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                .map((m) => {
                  const isMe = m.senderId === currentUser?.id;
                  return (
                    <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={isMe ? 'msg-bubble-me' : 'msg-bubble-them'}>
                        <p className="text-sm whitespace-pre-wrap">{m.content}</p>
                        <p className={`text-[10px] mt-1 ${isMe ? 'text-white/60' : 'text-arsenal-muted'}`}>
                          {format(new Date(m.createdAt), 'MMM d, h:mm a')}
                        </p>
                      </div>
                    </div>
                  );
                })
            )}
          </div>

          <div className="p-4 border-t border-arsenal-border flex gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Type a message…"
              className="flex-1 bg-arsenal-dark border border-arsenal-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-arsenal-teal"
            />
            <button
              onClick={handleSend}
              disabled={!newMessage.trim()}
              className="bg-arsenal-teal hover:bg-arsenal-teal-hover disabled:opacity-40 text-white p-2.5 rounded-lg transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        </section>

        {/* Deliverables */}
        <section className="bg-arsenal-card border border-arsenal-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-arsenal-border flex items-center gap-2">
            <ClipboardList size={18} className="text-arsenal-teal" />
            <h2 className="font-medium">Deliverables</h2>
            <span className="text-xs text-arsenal-muted ml-auto">{deliverables.length} assigned</span>
          </div>

          <div className="divide-y divide-arsenal-border">
            {deliverables.length === 0 ? (
              <p className="text-sm text-arsenal-muted text-center py-8">No deliverables assigned.</p>
            ) : (
              deliverables.map((d) => (
                <div key={d.id} className="px-5 py-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-medium text-sm">{d.title}</p>
                    <p className="text-xs text-arsenal-muted mt-0.5 truncate">{d.description}</p>
                    {d.dueDate && (
                      <p className="text-xs text-arsenal-muted mt-1">
                        Due {format(new Date(d.dueDate), 'MMM d, yyyy')}
                      </p>
                    )}
                  </div>
                  <StatusBadge status={d.status} />
                </div>
              ))
            )}
          </div>
        </section>

        {/* Content Uploads */}
        <section className="bg-arsenal-card border border-arsenal-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-arsenal-border flex items-center gap-2">
            <Upload size={18} className="text-arsenal-teal" />
            <h2 className="font-medium">Content Uploads</h2>
            <span className="text-xs text-arsenal-muted ml-auto">{uploads.length} files</span>
          </div>

          <div className="divide-y divide-arsenal-border">
            {uploads.length === 0 ? (
              <p className="text-sm text-arsenal-muted text-center py-8">No content uploaded yet.</p>
            ) : (
              uploads.map((u) => (
                <div key={u.id} className="px-5 py-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{u.filename}</p>
                    <p className="text-xs text-arsenal-muted mt-0.5">
                      {format(new Date(u.uploadedAt), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <span className="text-xs text-arsenal-muted shrink-0">{u.type}</span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    not_started: 'bg-white/10 text-arsenal-muted',
    in_progress: 'bg-amber-500/15 text-amber-400',
    done: 'bg-arsenal-teal/15 text-arsenal-teal',
  };
  const labels: Record<string, string> = {
    not_started: 'Not started',
    in_progress: 'In progress',
    done: 'Done',
  };
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full whitespace-nowrap ${styles[status] || ''}`}>
      {labels[status] || status}
    </span>
  );
}
