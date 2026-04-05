import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wand2 } from 'lucide-react';
import { motion } from 'framer-motion';

const EditorHeader = ({ id, noteTitle, saving, onAiClick, onHistoryClick }) => {
    const navigate = useNavigate();

    return (
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm z-40 w-full sticky top-0 editor-header-step">
            <div className="flex items-center space-x-4">
                <motion.button
                    whileHover={{ x: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/dashboard')}
                    className="p-2 -ml-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-all"
                    title="Back to Dashboard"
                >
                    <ArrowLeft className="h-5 w-5" />
                </motion.button>
                <div>
                    <motion.h1 
                        initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                        className="text-xl font-extrabold text-slate-900 tracking-tight"
                    >
                        {noteTitle || 'Untitled Note'}
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="text-xs text-slate-500 font-semibold tracking-wide flex items-center gap-1.5"
                    >
                        {saving ? (
                            <span className="flex items-center animate-pulse text-indigo-500">
                                <span className="h-1.5 w-1.5 bg-indigo-500 rounded-full mr-1.5"></span> Saving changes...
                            </span>
                        ) : (
                            <span className="flex items-center text-emerald-600">
                                <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full mr-1.5"></span> All changes saved
                            </span>
                        )}
                    </motion.p>
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <button
                    onClick={onHistoryClick}
                    className="text-sm font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-all history-tools-step"
                >
                    View History
                </button>
                <motion.button
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onAiClick}
                    className="ai-generation-step inline-flex items-center px-4 py-2 border border-transparent rounded-xl shadow-lg shadow-purple-200/50 text-sm font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                >
                    <Wand2 className="-ml-1 mr-2 h-4 w-4" />
                    Generate AI Layout
                </motion.button>
            </div>
        </header>
    );
};

export default EditorHeader;
