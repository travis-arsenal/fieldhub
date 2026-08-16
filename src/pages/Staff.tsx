import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_USERS } from '../data/mock';
import { Search, UserPlus } from 'lucide-react';
import type { User } from '../types';

export function Staff() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const staff = MOCK_USERS.filter((u) => u.role === 'staff');
  const filtered = staff.filter(
    (u) =>
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase()) ||
      (u.region || '').toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Staff Directory</h1>
          <p className="text-arsenal-muted mt-1">{staff.length} field & pro-staff</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-arsenal-teal hover:bg-arsenal-teal-hover text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors">
          <UserPlus size={16} />
          Add Staff
        </button>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-arsenal-muted" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, email, or region…"
          className="w-full bg-arsenal-card border border-arsenal-border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-arsenal-teal"
        />
      </div>

      <div className="bg-arsenal-card border border-arsenal-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-arsenal-border text-left text-arsenal-muted">
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium hidden md:table-cell">Region</th>
              <th className="px-5 py-3 font-medium hidden lg:table-cell">Email</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <StaffRow key={u.id} user={u} onOpen={() => navigate(`/staff/${u.id}`)} />
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-arsenal-muted">
                  No staff match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StaffRow({ user, onOpen }: { user: User; onOpen: () => void }) {
  const statusStyles: Record<string, string> = {
    active: 'bg-arsenal-teal/15 text-arsenal-teal',
    inactive: 'bg-white/10 text-arsenal-muted',
    pending: 'bg-amber-500/15 text-amber-400',
  };

  return (
    <tr
      onClick={onOpen}
      onDoubleClick={onOpen}
      className="border-b border-arsenal-border last:border-0 hover:bg-white/[0.03] cursor-pointer transition-colors"
    >
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-arsenal-teal/20 flex items-center justify-center text-arsenal-teal text-xs font-semibold">
            {user.name.charAt(0)}
          </div>
          <span className="font-medium">{user.name}</span>
        </div>
      </td>
      <td className="px-5 py-4 text-arsenal-muted hidden md:table-cell">{user.region || '—'}</td>
      <td className="px-5 py-4 text-arsenal-muted hidden lg:table-cell">{user.email}</td>
      <td className="px-5 py-4">
        <span className={`text-xs px-2.5 py-1 rounded-full capitalize ${statusStyles[user.status]}`}>
          {user.status}
        </span>
      </td>
      <td className="px-5 py-4 text-right">
        <span className="text-arsenal-teal text-sm">View →</span>
      </td>
    </tr>
  );
}
