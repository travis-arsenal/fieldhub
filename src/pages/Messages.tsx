import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { MOCK_USERS, MOCK_THREADS, MOCK_MESSAGES } from '../data/mock';
import { Send, Megaphone } from 'lucide-react';
import { format } from 'date-fns';
import type { Message, Thread } from '../types';

export function Messages() {
  const { user, isManager } = useAuth();
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(MOCK_THREADS[0]?.id || null);
  const [newMessage, setNewMessage] = useState('');
  const [broadcastMode, setBroadcastMode] = useState(false);
  const [localMessages, setLocalMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [localThreads, setLocalThreads] = useState<Thread[]>(MOCK_THREADS);

  const staffUsers = MOCK_USERS.filter((u) => u.role === 'staff');

  const threadsForUser = useMemo(() => {
    if (!user) return [];
    if (isManager) return localThreads;
    return localThreads.filter((t) => t.participantIds.includes(user.id));
  }, [user, isManager, localThreads]);

  const selectedThread = localThreads.find((t) => t.id === selectedThreadId);
  const threadMessages = localMessages
    .filter((m) => m.threadId === selectedThreadId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const otherParticipant = selectedThread
    ? MOCK_USERS.find((u) => selectedThread.participantIds.includes(u.id) && u.id !== user?.id)
    : null;

  const handleSend = () => {
    if (!newMessage.trim() || !user) return;

    if (broadcastMode && isManager) {
      // Create the same message in every staff private thread
      const now = new Date().toISOString();
      const newMsgs: Message[] = [];
      const updatedThreads = [...localThreads];

      staffUsers.forEach((staff) => {
        const idx = updatedThreads.findIndex(
          (t) => t.participantIds.includes(staff.id) && t.participantIds.includes(user.id)
        );
        let threadId: string;
        if (idx === -1) {
          const thread = {
            id: `t-new-${staff.id}`,
            participantIds: [user.id, staff.id],
            lastMessageAt: now,
            unreadCount: 1,
          };
          updatedThreads.push(thread);
          threadId = thread.id;
        } else {
          const existing = updatedThreads[idx];
          updatedThreads[idx] = {
            ...existing,
            lastMessageAt: now,
            unreadCount: existing.unreadCount + 1,
          };
          threadId = existing.id;
        }
        newMsgs.push({
          id: `m-${Date.now()}-${staff.id}`,
          threadId,
          senderId: user.id,
          content: newMessage.trim(),
          createdAt: now,
          isBroadcast: true,
        });
      });

      setLocalMessages((prev) => [...prev, ...newMsgs]);
      setLocalThreads(updatedThreads);
      setNewMessage('');
      setBroadcastMode(false);
      return;
    }

    // Normal 1:1 send
    if (!selectedThreadId) return;
    const msg: Message = {
      id: `m-${Date.now()}`,
      threadId: selectedThreadId,
      senderId: user.id,
      content: newMessage.trim(),
      createdAt: new Date().toISOString(),
    };
    setLocalMessages((prev) => [...prev, msg]);
    setLocalThreads((prev) =>
      prev.map((t) =>
        t.id === selectedThreadId ? { ...t, lastMessageAt: msg.createdAt } : t
      )
    );
    setNewMessage('');
  };

  return (
    <div className="flex h-[calc(100vh)]">
      {/* Thread list */}
      <div className="w-80 border-r border-arsenal-border flex flex-col bg-arsenal-dark">
        <div className="p-4 border-b border-arsenal-border flex items-center justify-between">
          <h1 className="font-semibold">Messages</h1>
          {isManager && (
            <button
              onClick={() => {
                setBroadcastMode(true);
                setSelectedThreadId(null);
              }}
              className={`p-2 rounded-lg transition-colors ${
                broadcastMode ? 'bg-arsenal-teal text-white' : 'text-arsenal-muted hover:bg-white/5'
              }`}
              title="Broadcast to all staff"
            >
              <Megaphone size={18} />
            </button>
          )}
        </div>
        <div className="flex-1 overflow-y-auto">
          {threadsForUser.map((t) => {
            const other = MOCK_USERS.find(
              (u) => t.participantIds.includes(u.id) && u.id !== user?.id
            );
            const lastMsg = localMessages
              .filter((m) => m.threadId === t.id)
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
            return (
              <button
                key={t.id}
                onClick={() => {
                  setSelectedThreadId(t.id);
                  setBroadcastMode(false);
                }}
                className={`w-full text-left px-4 py-3 border-b border-arsenal-border hover:bg-white/[0.03] transition-colors ${
                  selectedThreadId === t.id && !broadcastMode ? 'bg-arsenal-teal/10' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{other?.name || 'Unknown'}</span>
                  {t.unreadCount > 0 && (
                    <span className="bg-arsenal-teal text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                      {t.unreadCount}
                    </span>
                  )}
                </div>
                <p className="text-xs text-arsenal-muted truncate mt-0.5">
                  {lastMsg?.content || 'No messages yet'}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Conversation */}
      <div className="flex-1 flex flex-col">
        {broadcastMode ? (
          <>
            <div className="px-6 py-4 border-b border-arsenal-border bg-arsenal-dark">
              <h2 className="font-medium flex items-center gap-2">
                <Megaphone size={18} className="text-arsenal-teal" />
                Broadcast to all staff
              </h2>
              <p className="text-xs text-arsenal-muted mt-1">
                This message will appear in each staff member’s private thread.
              </p>
            </div>
            <div className="flex-1 p-6 flex items-center justify-center text-arsenal-muted text-sm">
              Type your broadcast message below and hit send.
            </div>
          </>
        ) : selectedThread ? (
          <>
            <div className="px-6 py-4 border-b border-arsenal-border bg-arsenal-dark flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-arsenal-teal/20 flex items-center justify-center text-arsenal-teal font-semibold text-sm">
                {otherParticipant?.name?.charAt(0)}
              </div>
              <div>
                <h2 className="font-medium">{otherParticipant?.name}</h2>
                <p className="text-xs text-arsenal-muted">{otherParticipant?.region || otherParticipant?.role}</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {threadMessages.map((m) => {
                const isMe = m.senderId === user?.id;
                return (
                  <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={isMe ? 'msg-bubble-me' : 'msg-bubble-them'}>
                      {m.isBroadcast && (
                        <span className="text-[10px] uppercase tracking-wide opacity-70 block mb-1">
                          Broadcast
                        </span>
                      )}
                      <p className="text-sm whitespace-pre-wrap">{m.content}</p>
                      <p className={`text-[10px] mt-1 ${isMe ? 'text-white/60' : 'text-arsenal-muted'}`}>
                        {format(new Date(m.createdAt), 'MMM d, h:mm a')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-arsenal-muted">
            Select a conversation
          </div>
        )}

        {/* Composer */}
        {(selectedThread || broadcastMode) && (
          <div className="p-4 border-t border-arsenal-border bg-arsenal-dark">
            <div className="flex gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder={broadcastMode ? 'Write a broadcast message…' : 'Type a message…'}
                className="flex-1 bg-arsenal-card border border-arsenal-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-arsenal-teal"
              />
              <button
                onClick={handleSend}
                disabled={!newMessage.trim()}
                className="bg-arsenal-teal hover:bg-arsenal-teal-hover disabled:opacity-40 text-white p-2.5 rounded-lg transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
