import { useState } from 'react';
import { MOCK_USERS, MOCK_FORUM } from '../data/mock';
import { useAuth } from '../context/AuthContext';
import { MessageCircle, Plus, Send } from 'lucide-react';
import { format } from 'date-fns';
import type { ForumPost, ForumReply } from '../types';

export function Forum() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<ForumPost[]>(MOCK_FORUM);
  const [expandedId, setExpandedId] = useState<string | null>(posts[0]?.id || null);
  const [replyText, setReplyText] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  const getAuthor = (id: string) => MOCK_USERS.find((u) => u.id === id);

  const handleReply = (postId: string) => {
    if (!replyText.trim() || !user) return;
    const reply: ForumReply = {
      id: `r-${Date.now()}`,
      authorId: user.id,
      content: replyText.trim(),
      createdAt: new Date().toISOString(),
    };
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, replies: [...p.replies, reply] } : p))
    );
    setReplyText('');
  };

  const handleNewPost = () => {
    if (!newTitle.trim() || !newContent.trim() || !user) return;
    const post: ForumPost = {
      id: `f-${Date.now()}`,
      authorId: user.id,
      title: newTitle.trim(),
      content: newContent.trim(),
      createdAt: new Date().toISOString(),
      replies: [],
    };
    setPosts((prev) => [post, ...prev]);
    setNewTitle('');
    setNewContent('');
    setShowNew(false);
    setExpandedId(post.id);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Group Forum</h1>
          <p className="text-arsenal-muted mt-1">Open collaboration for all staff</p>
        </div>
        <button
          onClick={() => setShowNew(!showNew)}
          className="inline-flex items-center gap-2 bg-arsenal-teal hover:bg-arsenal-teal-hover text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus size={16} />
          New Post
        </button>
      </div>

      {showNew && (
        <div className="bg-arsenal-card border border-arsenal-border rounded-xl p-6 mb-6 space-y-4">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Post title"
            className="w-full bg-arsenal-dark border border-arsenal-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-arsenal-teal"
          />
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="What's on your mind?"
            rows={4}
            className="w-full bg-arsenal-dark border border-arsenal-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-arsenal-teal resize-none"
          />
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowNew(false)}
              className="px-4 py-2 text-sm text-arsenal-muted hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleNewPost}
              className="bg-arsenal-teal hover:bg-arsenal-teal-hover text-white text-sm font-medium px-4 py-2 rounded-lg"
            >
              Post
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {posts.map((post) => {
          const author = getAuthor(post.authorId);
          const isExpanded = expandedId === post.id;
          return (
            <article
              key={post.id}
              className="bg-arsenal-card border border-arsenal-border rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : post.id)}
                className="w-full text-left p-5 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-arsenal-teal/20 flex items-center justify-center text-arsenal-teal text-sm font-semibold shrink-0">
                    {author?.name?.charAt(0) || '?'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-medium">{post.title}</h2>
                    <p className="text-xs text-arsenal-muted mt-1">
                      {author?.name} · {format(new Date(post.createdAt), 'MMM d, yyyy')} ·{' '}
                      <span className="inline-flex items-center gap-1">
                        <MessageCircle size={12} /> {post.replies.length}
                      </span>
                    </p>
                    {!isExpanded && (
                      <p className="text-sm text-arsenal-muted mt-2 line-clamp-2">{post.content}</p>
                    )}
                  </div>
                </div>
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 border-t border-arsenal-border">
                  <p className="text-sm mt-4 whitespace-pre-wrap">{post.content}</p>

                  <div className="mt-6 space-y-4">
                    {post.replies.map((r) => {
                      const replyAuthor = getAuthor(r.authorId);
                      return (
                        <div key={r.id} className="flex gap-3">
                          <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs font-semibold shrink-0">
                            {replyAuthor?.name?.charAt(0)}
                          </div>
                          <div>
                            <p className="text-xs text-arsenal-muted">
                              <span className="text-white font-medium">{replyAuthor?.name}</span> ·{' '}
                              {format(new Date(r.createdAt), 'MMM d, h:mm a')}
                            </p>
                            <p className="text-sm mt-1">{r.content}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-5 flex gap-3">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleReply(post.id)}
                      placeholder="Write a reply…"
                      className="flex-1 bg-arsenal-dark border border-arsenal-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-arsenal-teal"
                    />
                    <button
                      onClick={() => handleReply(post.id)}
                      disabled={!replyText.trim()}
                      className="bg-arsenal-teal hover:bg-arsenal-teal-hover disabled:opacity-40 text-white p-2 rounded-lg"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
