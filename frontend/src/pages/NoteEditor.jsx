import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import NoteEditorCanvas from '../components/canvas/NoteEditorCanvas';
import EditorHeader from '../components/layout/EditorHeader';
import AiGenerationModal from '../components/editor/AiGenerationModal';
import SetupGuide from '../components/onboarding/SetupGuide';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

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

    const editorTourSteps = [
        {
            target: '.editor-header-step',
            content: 'This is the editor for your visual map.',
            disableBeacon: true,
            placement: 'bottom',
        },
        {
            target: '.ai-generation-step',
            content: 'Click here to use AI! Paste unstructured text, and we will automatically convert it into an interactive diagram.',
            placement: 'bottom-end',
        },
        {
            target: '.canvas-area-step',
            content: 'This is your infinite canvas. You can drag nodes around, scroll to zoom, and drag the background to pan.',
            placement: 'center',
        },
        {
            target: '.save-canvas-step',
            content: 'Don\'t forget to save your canvas layout. Layout positions are saved manually when you are happy with the arrangement.',
            placement: 'bottom-end',
        }
    ];

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-slate-50">
                <div className="relative">
                    <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mb-4 mx-auto" />
                    <div className="text-center text-indigo-600 font-semibold tracking-widest animate-pulse">LOADING CANVAS</div>
                </div>
            </div>
        );
    }

    const initialCanvasData = note?.generatedContent ? JSON.parse(note.generatedContent) : null;

    return (
        <div className="h-screen flex flex-col bg-slate-50/50 relative overflow-hidden font-sans">
            <SetupGuide steps={editorTourSteps} tourKey="editor" />
            
            <EditorHeader 
                id={id}
                noteTitle={note?.title}
                saving={saving}
                onAiClick={() => setShowAiModal(true)}
                onHistoryClick={() => navigate(`/note/${id}/history`)}
            />

            {/* Canvas Area */}
            <motion.main 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex-1 w-full bg-slate-50 relative overflow-hidden"
            >
                <NoteEditorCanvas
                    key={note?.generatedContent} // Force re-mount if AI generated new content
                    initialData={initialCanvasData}
                    onSave={handleSaveCanvas}
                />
            </motion.main>

            <AiGenerationModal 
                isOpen={showAiModal}
                onClose={() => setShowAiModal(false)}
                rawText={rawText}
                setRawText={setRawText}
                onGenerate={handleGenerate}
                generating={generating}
            />
        </div>
    );
};

export default NoteEditor;
