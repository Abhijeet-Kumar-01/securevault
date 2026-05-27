import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { encryptNote, decryptNote } from '../utils/encryption';
import { api } from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import NoteCard from '../components/NoteCard';
import NoteForm from '../components/NoteForm';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';

export default function Dashboard() {
  const [isAdding, setIsAdding] = useState(false);
  const { logout, userEmail } = useAuth();
  const queryClient = useQueryClient();

  const { data: notes = [], isLoading, isError, error } = useQuery({
    queryKey: ['notes'],
    queryFn: async () => {
      const data = await api.getNotes();
      const decryptedNotes = await Promise.all(data.map(async (note) => {
        try {
          const decrypted = await decryptNote(note.encryptedContent, note.iv, note.authTag);
          return { ...note, content: decrypted };
        } catch (e) {
          return { ...note, content: "⚠️ Decryption failed" };
        }
      }));
      // Sort notes by createdAt descending
      return decryptedNotes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  });

  const createMutation = useMutation({
    mutationFn: async ({ title, content }) => {
      const { encryptedContent, iv, authTag } = await encryptNote(content);
      return api.createNote(title, encryptedContent, iv, authTag);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setIsAdding(false);
      toast.success('Note securely saved');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to save note');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Note deleted');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to delete note');
    }
  });

  const handleCreate = ({ title, content }) => {
    createMutation.mutate({ title, content });
  };

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-100 flex flex-col">
      {/* Navbar */}
      <header className="border-b border-zinc-800 bg-zinc-950">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-medium tracking-tight text-zinc-100">SecureVault</span>
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-400 hidden sm:inline-block">{userEmail}</span>
            <button 
              onClick={logout} 
              className="text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-medium text-zinc-100">Notes</h1>
          {!isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="text-sm font-medium bg-zinc-100 text-zinc-900 hover:bg-white rounded-md px-3 py-1.5 transition-colors"
            >
              New Note
            </button>
          )}
        </div>

        {isAdding && (
          <NoteForm
            onSubmit={handleCreate}
            onCancel={() => setIsAdding(false)}
            isSubmitting={createMutation.isPending}
          />
        )}

        <div className="space-y-4">
          {isError ? (
            <div className="p-4 border border-red-900/50 bg-red-950/20 rounded-md text-sm text-red-400 text-center">
              {error?.message || 'Failed to load notes. Please check your connection.'}
            </div>
          ) : isLoading ? (
            <LoadingState />
          ) : notes.length === 0 ? (
            !isAdding && <EmptyState />
          ) : (
            <div className="space-y-3">
              {notes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onDelete={handleDelete}
                  isDeleting={deleteMutation.isPending && deleteMutation.variables === note.id}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
