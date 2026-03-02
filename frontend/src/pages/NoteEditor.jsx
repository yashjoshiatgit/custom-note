import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import NoteEditorCanvas from '../components/canvas/NoteEditorCanvas';
import { ArrowLeft, Loader2, Wand2, X } from 'lucide-react';

const NoteEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [note, setNote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // AI Generation State
    const [showAiModal, setShowAiModal] = useState(false);
    const [rawText, setRawText] = useState('');
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const response = await api.get(`/notes/${id}`);
                setNote(response.data);
                setRawText(response.data.originalContent || '');
            } catch (error) {
                console.error('Failed to fetch note:', error);
                navigate('/dashboard');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchNote();
        }
    }, [id, navigate]);

    const handleSaveCanvas = async (canvasData) => {
        setSaving(true);
        try {
            await api.put(`/notes/${id}`, {
                title: note.title,
                originalContent: rawText,
                generatedContent: JSON.stringify(canvasData)
            });
        } catch (error) {
            console.error('Failed to save canvas:', error);
        } finally {
            setSaving(false);
            // Refresh note state to get updated version info if needed (optional)
        }
    };

    const handleGenerate = async () => {
        if (!rawText.trim()) return;
        setGenerating(true);
        try {
            const response = await api.post(`/notes/${id}/generate`, { rawText });
            setNote(response.data);
            setShowAiModal(false);
        } catch (error) {
            console.error('Failed to generate with AI:', error);
            alert('Failed to generate layout. Check backend logs or API keys.');
        } finally {
            setGenerating(false);
        }
    };

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    const initialCanvasData = note?.generatedContent ? JSON.parse(note.generatedContent) : null;

    return (
        <div className="h-screen flex flex-col bg-slate-50 relative">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm z-10 w-full">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="p-2 -ml-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">{note?.title}</h1>
                        <p className="text-xs text-slate-500 font-medium tracking-wide">
                            {saving ? 'Saving...' : 'All changes saved locally'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate(`/note/${id}/history`)}
                        className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors mr-2"
                    >
                        View History
                    </button>
                    <button
                        onClick={() => setShowAiModal(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all hover:shadow-md"
                    >
                        <Wand2 className="-ml-1 mr-2 h-4 w-4" />
                        Generate AI Layout
                    </button>
                </div>
            </header>

            {/* Canvas Area */}
            <main className="flex-1 w-full bg-slate-100 relative overflow-hidden">
                <NoteEditorCanvas
                    key={note?.generatedContent} // Force re-mount if AI generated new content
                    initialData={initialCanvasData}
                    onSave={handleSaveCanvas}
                />
            </main>

            {/* AI Generation Modal */}
            {showAiModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                                <Wand2 className="h-5 w-5 text-indigo-600" />
                                Convert Text to Visual Mind-Map
                            </h2>
                            <button
                                onClick={() => setShowAiModal(false)}
                                className="text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6 flex-1 overflow-y-auto w-full">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Paste your unstructured notes or topics below
                            </label>
                            <textarea
                                className="w-full h-64 p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm resize-none shadow-sm"
                                placeholder="E.g., The circulatory system relies on the heart to pump blood. Veins bring blood back, and arteries take it away. Red blood cells carry oxygen from the lungs."
                                value={rawText}
                                onChange={(e) => setRawText(e.target.value)}
                            />
                        </div>

                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                            <button
                                onClick={() => setShowAiModal(false)}
                                className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleGenerate}
                                disabled={generating || !rawText.trim()}
                                className="inline-flex items-center px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {generating ? (
                                    <>
                                        <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                        Analyzing & Generating...
                                    </>
                                ) : (
                                    <>
                                        <Wand2 className="-ml-1 mr-2 h-4 w-4" />
                                        Generate
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NoteEditor;
