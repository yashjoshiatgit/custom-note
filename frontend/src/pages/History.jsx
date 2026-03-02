import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import NoteEditorCanvas from '../components/canvas/NoteEditorCanvas';
import { ArrowLeft, Loader2, Play, History as HistoryIcon, Rewind, FastForward } from 'lucide-react';

const History = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [currentNote, setCurrentNote] = useState(null);
    const [loading, setLoading] = useState(true);

    // Playback state
    const [activeVersionIndex, setActiveVersionIndex] = useState(0);

    useEffect(() => {
        const fetchHistoryAndNote = async () => {
            try {
                const [histRes, noteRes] = await Promise.all([
                    api.get(`/notes/${id}/history`),
                    api.get(`/notes/${id}`)
                ]);

                // History comes back desc (latest first)
                // Let's reverse it so index 0 is V1, index 1 is V2 for playback
                const ascHistory = histRes.data.reverse();
                setHistory(ascHistory);
                setCurrentNote(noteRes.data);

                // Start playback at the latest version
                setActiveVersionIndex(ascHistory.length - 1);
            } catch (error) {
                console.error('Failed to fetch history:', error);
                navigate(`/note/${id}`);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchHistoryAndNote();
        }
    }, [id, navigate]);

    const activeCanvasData = history[activeVersionIndex]?.canvasState
        ? JSON.parse(history[activeVersionIndex].canvasState)
        : null;

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm z-10">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate(`/note/${id}`)}
                        className="p-2 -ml-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <HistoryIcon className="h-5 w-5 text-indigo-600" />
                            Version History: {currentNote?.title}
                        </h1>
                        <p className="text-xs text-slate-500 font-medium tracking-wide">
                            Viewing V{history[activeVersionIndex]?.versionNumber || 0} of {history.length}
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => setActiveVersionIndex(Math.max(0, activeVersionIndex - 1))}
                        disabled={activeVersionIndex === 0}
                        className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Rewind className="h-4 w-4" />
                    </button>
                    <span className="text-sm font-medium w-16 text-center">
                        {activeVersionIndex + 1} / {history.length}
                    </span>
                    <button
                        onClick={() => setActiveVersionIndex(Math.min(history.length - 1, activeVersionIndex + 1))}
                        disabled={activeVersionIndex === history.length - 1}
                        className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FastForward className="h-4 w-4" />
                    </button>
                </div>
            </header>

            {/* Read-only Canvas Area */}
            <main className="flex-1 w-full bg-slate-100 relative pointer-events-none opacity-90">
                {/* Overlay to prevent interactions but keeping it visually clear */}
                <div className="absolute inset-0 z-20 pointer-events-auto cursor-not-allowed" />

                {history.length > 0 ? (
                    <NoteEditorCanvas
                        key={activeVersionIndex} // Re-render completely on version change
                        initialData={activeCanvasData}
                        onSave={() => { }} // Disabled
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-slate-400">
                        No history recorded for this note yet.
                    </div>
                )}
            </main>
        </div>
    );
};

export default History;
