import type { ElementType } from 'react';
import { useAuth } from '../context/AuthContext';
import { MOCK_USERS, MOCK_DELIVERABLES, MOCK_THREADS, MOCK_FORUM } from '../data/mock';
import { Users, ClipboardList, MessageSquare, MessagesSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const { user, isManager } = useAuth();
  const staffCount = MOCK_USERS.filter((u) => u.role === 'staff' && u.status === 'active').length;
  const openDeliverables = MOCK_DELIVERABLES.filter((d) => d.status !== 'done').length;
  const unread = MOCK_THREADS.reduce((sum, t) => sum + t.unreadCount, 0);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Welcome back, {user?.name?.split(' ')[0]}</h1>
        <p className="text-arsenal-muted mt-1">
          {isManager ? 'Field staff overview & activity' : 'Your FieldHub dashboard'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {isManager && (
          <StatCard icon={Users} label="Active Staff" value={staffCount} to="/staff" />
        )}
        <StatCard icon={ClipboardList} label="Open Deliverables" value={openDeliverables} to="/deliverables" />
        <StatCard icon={MessageSquare} label="Unread Messages" value={unread} to="/messages" />
        <StatCard icon={MessagesSquare} label="Forum Posts" value={MOCK_FORUM.length} to="/forum" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-arsenal-card border border-arsenal-border rounded-xl p-6">
          <h2 className="font-medium mb-4">Recent Deliverables</h2>
          <ul className="space-y-3">
            {MOCK_DELIVERABLES.slice(0, 4).map((d) => (
              <li key={d.id} className="flex items-center justify-between text-sm">
                <span className="truncate pr-4">{d.title}</span>
                <StatusBadge status={d.status} />
              </li>
            ))}
          </ul>
          <Link to="/deliverables" className="inline-block mt-4 text-sm text-arsenal-teal hover:underline">
            View all →
          </Link>
        </section>

        <section className="bg-arsenal-card border border-arsenal-border rounded-xl p-6">
          <h2 className="font-medium mb-4">Latest Forum Activity</h2>
          <ul className="space-y-3">
            {MOCK_FORUM.map((p) => (
              <li key={p.id} className="text-sm">
                <p className="font-medium truncate">{p.title}</p>
                <p className="text-arsenal-muted text-xs mt-0.5">
                  {p.replies.length} {p.replies.length === 1 ? 'reply' : 'replies'}
                </p>
              </li>
            ))}
          </ul>
          <Link to="/forum" className="inline-block mt-4 text-sm text-arsenal-teal hover:underline">
            Go to forum →
          </Link>
        </section>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  to,
}: {
  icon: ElementType;
  label: string;
  value: number;
  to: string;
}) {
  return (
    <Link
      to={to}
      className="bg-arsenal-card border border-arsenal-border rounded-xl p-5 hover:border-arsenal-teal/40 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-arsenal-teal/15 flex items-center justify-center text-arsenal-teal">
          <Icon size={20} />
        </div>
        <div>
          <p className="text-2xl font-semibold">{value}</p>
          <p className="text-xs text-arsenal-muted">{label}</p>
        </div>
      </div>
    </Link>
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
