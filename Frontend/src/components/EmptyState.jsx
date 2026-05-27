import { FileText } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-zinc-800 rounded-md bg-zinc-900/30 fade-in">
      <FileText className="w-6 h-6 text-zinc-600 mb-3" />
      <h3 className="text-sm font-medium text-zinc-300">No notes yet</h3>
      <p className="text-sm text-zinc-500 mt-1">Create your first one to get started.</p>
    </div>
  );
}
