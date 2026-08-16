import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  MessagesSquare,
  ClipboardList,
  Upload,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Logo } from './Logo';
import clsx from 'clsx';

const managerLinks = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/staff', label: 'Staff Directory', icon: Users },
  { to: '/messages', label: 'Messages', icon: MessageSquare },
  { to: '/forum', label: 'Group Forum', icon: MessagesSquare },
  { to: '/deliverables', label: 'Deliverables', icon: ClipboardList },
  { to: '/uploads', label: 'Content', icon: Upload },
];

const staffLinks = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/messages', label: 'Messages', icon: MessageSquare },
  { to: '/forum', label: 'Group Forum', icon: MessagesSquare },
  { to: '/deliverables', label: 'My Deliverables', icon: ClipboardList },
  { to: '/uploads', label: 'My Content', icon: Upload },
];

export function Sidebar() {
  const { user, logout, isManager } = useAuth();
  const links = isManager ? managerLinks : staffLinks;

  return (
    <aside className="w-60 shrink-0 bg-arsenal-dark border-r border-arsenal-border flex flex-col h-screen sticky top-0">
      <div className="p-5 border-b border-arsenal-border">
        <Logo />
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-arsenal-teal/15 text-arsenal-teal'
                  : 'text-arsenal-muted hover:bg-white/5 hover:text-white'
              )
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-arsenal-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-arsenal-teal/20 flex items-center justify-center text-arsenal-teal font-semibold text-sm">
            {user?.name?.charAt(0) || '?'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-arsenal-muted capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-arsenal-muted hover:text-white hover:bg-white/5 rounded-lg transition-colors"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
