import { useState } from 'react';

export default function NoteForm({ onSubmit, onCancel, isSubmitting }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      onSubmit({ title, content });
    }
  };

  return (
    <div className="border border-zinc-800 bg-zinc-900 rounded-md p-4 mb-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent text-lg font-medium text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-0"
            required
            autoFocus
            disabled={isSubmitting}
          />
        </div>
        <div>
          <textarea
            placeholder="Write your note here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-transparent text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:ring-0 min-h-[120px] resize-y"
            required
            disabled={isSubmitting}
          />
        </div>
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-zinc-800/50">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-colors disabled:opacity-50 px-3 py-1.5"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !title.trim() || !content.trim()}
            className="text-sm font-medium bg-zinc-100 text-zinc-900 hover:bg-white rounded-md px-4 py-1.5 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
