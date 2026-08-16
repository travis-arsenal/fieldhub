import { useState } from 'react';
import { MOCK_DELIVERABLES, MOCK_USERS } from '../data/mock';
import { useAuth } from '../context/AuthContext';
import { Plus, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import type { Deliverable } from '../types';

export function Deliverables() {
  const { user, isManager } = useAuth();
  const [items, setItems] = useState<Deliverable[]>(MOCK_DELIVERABLES);

  const visible = isManager
    ? items
    : items.filter((d) => d.assignedTo.includes(user?.id || ''));

  const updateStatus = (id: string, status: Deliverable['status']) => {
    setItems((prev) => prev.map((d) => (d.id === id ? { ...d, status } : d)));
  };

  const getAssignees = (ids: string[]) =>
    ids
      .map((id) => MOCK_USERS.find((u) => u.id === id)?.name)
      .filter(Boolean)
      .join(', ');

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold">
            {isManager ? 'Deliverables' : 'My Deliverables'}
          </h1>
          <p className="text-arsenal-muted mt-1">
            {isManager ? 'Assign and track field content tasks' : 'Tasks assigned to you'}
          </p>
        </div>
        {isManager && (
          <button className="inline-flex items-center gap-2 bg-arsenal-teal hover:bg-arsenal-teal-hover text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors">
            <Plus size={16} />
            New Deliverable
          </button>
        )}
      </div>

      <div className="space-y-4">
        {visible.map((d) => (
          <div
            key={d.id}
            className="bg-arsenal-card border border-arsenal-border rounded-xl p-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h2 className="font-medium">{d.title}</h2>
                <p className="text-sm text-arsenal-muted mt-1">{d.description}</p>
                <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-arsenal-muted">
                  {isManager && (
                    <span>Assigned: {getAssignees(d.assignedTo) || '—'}</span>
                  )}
                  {d.dueDate && (
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={12} />
                      Due {format(new Date(d.dueDate), 'MMM d, yyyy')}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {(['not_started', 'in_progress', 'done'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(d.id, s)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      d.status === s
                        ? s === 'done'
                          ? 'bg-arsenal-teal/20 border-arsenal-teal text-arsenal-teal'
                          : s === 'in_progress'
                          ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                          : 'bg-white/10 border-white/20 text-white'
                        : 'border-arsenal-border text-arsenal-muted hover:border-white/30'
                    }`}
                  >
                    {s === 'not_started' ? 'Not started' : s === 'in_progress' ? 'In progress' : 'Done'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}

        {visible.length === 0 && (
          <div className="text-center py-16 text-arsenal-muted">
            No deliverables assigned yet.
          </div>
        )}
      </div>
    </div>
  );
}
