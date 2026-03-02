import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../app/store';
import api from '../api/axiosInstance';
import { Plus, FileText, Clock, LogOut, Settings, Trash2 } from 'lucide-react';

const Dashboard = () => {
    const { user, logoutUser, notes, setNotes } = useStore();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        fetchNotes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchNotes = async () => {
        try {
            const response = await api.get('/notes');
            setNotes(response.data);
        } catch (error) {
            console.error('Failed to fetch notes', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNote = async () => {
        const title = prompt('Enter a title for your note:');
        if (!title) return;

        setIsCreating(true);
        try {
            const response = await api.post('/notes', { title, originalContent: '' });
            setNotes([...notes, response.data]);
            navigate(`/note/${response.data.id}`);
        } catch (error) {
            console.error('Failed to create note', error);
            alert('Error creating note.');
        } finally {
            setIsCreating(false);
        }
    };

    const handleDeleteNote = async (e, id) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this note?')) return;

        try {
            await api.delete(`/notes/${id}`);
            setNotes(notes.filter(n => n.id !== id));
        } catch (error) {
            console.error('Failed to delete note', error);
        }
    };

    const handleLogout = async () => {
        try {
            await api.post('/auth/logout');
            logoutUser();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading your workspace...</div>;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex-shrink-0 flex items-center">
                            <div className="bg-indigo-600 p-2 rounded-lg mr-3">
                                <FileText className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                                NoteFlow
                            </span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-sm font-medium text-slate-700 hidden sm:block">
                                Hey, {user?.name}
                            </div>
                            {user?.role === 'ADMIN' && (
                                <button
                                    onClick={() => navigate('/admin')}
                                    className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-full transition-colors"
                                    title="Admin Panel"
                                >
                                    <Settings className="h-5 w-5" />
                                </button>
                            )}
                            <button
                                onClick={handleLogout}
                                className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors flex items-center gap-2"
                                title="Sign out"
                            >
                                <LogOut className="h-5 w-5" />
                                <span className="text-sm font-medium hidden sm:block">Sign out</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Your Notes</h1>
                    <button
                        onClick={handleCreateNote}
                        disabled={isCreating}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                        <Plus className="-ml-1 mr-2 h-5 w-5" />
                        {isCreating ? 'Creating...' : 'New Note'}
                    </button>
                </div>

                {notes.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300 shadow-sm">
                        <FileText className="mx-auto h-12 w-12 text-slate-300" />
                        <h3 className="mt-4 text-sm font-medium text-slate-900">No notes yet</h3>
                        <p className="mt-1 text-sm text-slate-500">Get started by creating a new visual note.</p>
                        <div className="mt-6">
                            <button onClick={handleCreateNote} className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
                                <Plus className="-ml-1 mr-2 h-5 w-5" />
                                New Note
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {notes.map((note) => (
                            <div
                                key={note.id}
                                onClick={() => navigate(`/note/${note.id}`)}
                                className="group relative bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer overflow-hidden flex flex-col h-48"
                            >
                                <div className="p-5 flex-1 relative">
                                    <h3 className="text-lg font-semibold text-slate-900 truncate pr-8 group-hover:text-indigo-600 transition-colors">
                                        {note.title}
                                    </h3>

                                    {/* Action buttons (appear on hover) */}
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => handleDeleteNote(e, note.id)}
                                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                            title="Delete note"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>

                                    <div className="mt-4">
                                        <p className="text-sm text-slate-500 line-clamp-3">
                                            {note.originalContent || "Blank visual note. Click to start editing on the canvas."}
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center text-xs text-slate-500">
                                        <Clock className="mr-1.5 h-3.5 w-3.5" />
                                        {new Date(note.updatedAt || note.createdAt).toLocaleDateString()}
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/note/${note.id}/history`);
                                        }}
                                        className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                                    >
                                        History
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
