import { useState } from 'react';
import { MOCK_UPLOADS, MOCK_USERS, MOCK_DELIVERABLES } from '../data/mock';
import { useAuth } from '../context/AuthContext';
import { Upload, FileImage, FileVideo, File } from 'lucide-react';
import { format } from 'date-fns';
import type { ContentUpload } from '../types';

export function Uploads() {
  const { user, isManager } = useAuth();
  const [uploads, setUploads] = useState<ContentUpload[]>(MOCK_UPLOADS);

  const visible = isManager
    ? uploads
    : uploads.filter((u) => u.userId === user?.id);

  const handleMockUpload = () => {
    if (!user) return;
    const mock: ContentUpload = {
      id: `c-${Date.now()}`,
      userId: user.id,
      filename: `field-content-${Date.now()}.jpg`,
      type: 'image/jpeg',
      url: '#',
      uploadedAt: new Date().toISOString(),
    };
    setUploads((prev) => [mock, ...prev]);
  };

  const getUserName = (id: string) => MOCK_USERS.find((u) => u.id === id)?.name || 'Unknown';
  const getDeliverableTitle = (id?: string) =>
    id ? MOCK_DELIVERABLES.find((d) => d.id === id)?.title : null;

  const iconFor = (type: string) => {
    if (type.startsWith('image/')) return FileImage;
    if (type.startsWith('video/')) return FileVideo;
    return File;
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold">
            {isManager ? 'Content Library' : 'My Content'}
          </h1>
          <p className="text-arsenal-muted mt-1">
            {isManager ? 'All uploaded field content' : 'Photos, videos & files you’ve uploaded'}
          </p>
        </div>
        <button
          onClick={handleMockUpload}
          className="inline-flex items-center gap-2 bg-arsenal-teal hover:bg-arsenal-teal-hover text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          <Upload size={16} />
          Upload Content
        </button>
      </div>

      {visible.length === 0 ? (
        <div className="border-2 border-dashed border-arsenal-border rounded-xl py-20 text-center">
          <Upload size={32} className="mx-auto text-arsenal-muted mb-3" />
          <p className="text-arsenal-muted">No content uploaded yet</p>
          <button
            onClick={handleMockUpload}
            className="mt-4 text-sm text-arsenal-teal hover:underline"
          >
            Upload your first file
          </button>
        </div>
      ) : (
        <div className="bg-arsenal-card border border-arsenal-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-arsenal-border text-left text-arsenal-muted">
                <th className="px-5 py-3 font-medium">File</th>
                {isManager && <th className="px-5 py-3 font-medium">Uploaded by</th>}
                <th className="px-5 py-3 font-medium hidden md:table-cell">Linked Deliverable</th>
                <th className="px-5 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((u) => {
                const Icon = iconFor(u.type);
                return (
                  <tr key={u.id} className="border-b border-arsenal-border last:border-0 hover:bg-white/[0.02]">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Icon size={18} className="text-arsenal-teal shrink-0" />
                        <span className="truncate max-w-[200px]">{u.filename}</span>
                      </div>
                    </td>
                    {isManager && (
                      <td className="px-5 py-4 text-arsenal-muted">{getUserName(u.userId)}</td>
                    )}
                    <td className="px-5 py-4 text-arsenal-muted hidden md:table-cell">
                      {getDeliverableTitle(u.deliverableId) || '—'}
                    </td>
                    <td className="px-5 py-4 text-arsenal-muted">
                      {format(new Date(u.uploadedAt), 'MMM d, yyyy')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
