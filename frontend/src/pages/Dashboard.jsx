import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../app/store';
import api from '../api/axiosInstance';
import Navbar from '../components/layout/Navbar';
import NoteGrid from '../components/notes/NoteGrid';
import SetupGuide from '../components/onboarding/SetupGuide';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const { user, notes, setNotes } = useStore();
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
        if (!window.confirm('Are you sure you want to delete this note?')) return;

        try {
            await api.delete(`/notes/${id}`);
            setNotes(notes.filter(n => n.id !== id));
        } catch (error) {
            console.error('Failed to delete note', error);
        }
    };

    const dashboardTourSteps = [
        {
            target: '.navbar-tour-step',
            content: 'Welcome to NoteFlow! Your centralized hub for visual map note-taking. You can access settings and account details here.',
            disableBeacon: true,
            placement: 'bottom',
        },
        {
            target: '.create-note-step',
            content: 'Click here to create your first visual map or traditional note.',
            placement: 'bottom-end',
        },
        {
            target: '.note-card-step',
            content: 'Once you create notes, they will appear here as cards. You can click on them to edit or view their contents.',
            placement: 'top',
        },
        {
            target: '.history-btn-step',
            content: 'Every change is saved. You can always view the history of your note and revert to older versions.',
            placement: 'top',
        }
    ];

    if (loading) return (
        <div className="h-screen w-full flex items-center justify-center bg-slate-50">
            <div className="relative">
                <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-indigo-600 animate-spin"></div>
                <div className="mt-4 text-center text-indigo-600 font-semibold tracking-widest animate-pulse">LOADING</div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
            <SetupGuide steps={dashboardTourSteps} tourKey="dashboard" />
            <Navbar />

            {/* Main Content */}
            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full relative">
                {/* Background decorative blob */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-40 left-0 -ml-20 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Your Workspace</h1>
                        <p className="text-slate-500 mt-1 font-medium">Manage and organize your interactive visual notes.</p>
                    </motion.div>
                    
                    <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleCreateNote}
                        disabled={isCreating}
                        className="create-note-step flex-shrink-0 inline-flex items-center px-5 py-2.5 border border-transparent rounded-xl shadow-lg shadow-indigo-200 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <Plus className="-ml-1 mr-2 h-5 w-5" />
                        {isCreating ? 'Creating...' : 'New Visual Map'}
                    </motion.button>
                </div>

                <div className="relative z-10">
                    <NoteGrid 
                        notes={notes} 
                        navigate={navigate} 
                        handleDeleteNote={handleDeleteNote} 
                        handleCreateNote={handleCreateNote} 
                    />
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
