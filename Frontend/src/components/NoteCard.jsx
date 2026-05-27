import { useState } from 'react';
import { Trash2 } from 'lucide-react';

export default function NoteCard({ note, onDelete, isDeleting }) {
  const [showConfirm, setShowConfirm] = useState(false);

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(dateString));
  };

  return (
    <div className="group flex flex-col border border-zinc-800 bg-zinc-900 rounded-md p-4 transition-colors hover:border-zinc-700">
      <div className="flex items-start justify-between mb-2 gap-4">
        <h3 className="font-semibold text-zinc-100 truncate">{note.title}</h3>
        <span className="text-xs text-zinc-500 whitespace-nowrap shrink-0 mt-1">
          {formatDate(note.createdAt)}
        </span>
      </div>
      
      <p className="text-sm text-zinc-400 line-clamp-2 mb-4 flex-1">
        {note.content}
      </p>

      <div className="flex justify-end items-center h-8 mt-auto">
        {showConfirm ? (
          <div className="flex items-center gap-2 text-sm bg-zinc-950 px-2 py-1 rounded-md border border-zinc-800 fade-in">
            <span className="text-zinc-300">Delete this note?</span>
            <button
              onClick={() => onDelete(note.id)}
              disabled={isDeleting}
              className="text-red-400 hover:text-red-300 font-medium px-1 disabled:opacity-50"
            >
              Yes
            </button>
            <span className="text-zinc-600">/</span>
            <button
              onClick={() => setShowConfirm(false)}
              disabled={isDeleting}
              className="text-zinc-400 hover:text-zinc-300 px-1 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowConfirm(true)}
            className="text-zinc-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 p-1"
            aria-label="Delete note"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
