import React from 'react';
import { Wand2, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AiGenerationModal = ({ isOpen, onClose, rawText, setRawText, onGenerate, generating }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] ring-1 ring-slate-200"
                >
                    <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <div className="bg-indigo-100 p-2 rounded-lg">
                                <Wand2 className="h-5 w-5 text-indigo-600" />
                            </div>
                            Convert Text to Visual Map
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="p-6 flex-1 overflow-y-auto w-full">
                        <label className="block text-sm font-semibold text-slate-700 mb-3">
                            Paste your unstructured notes, transcripts, or ideas below
                        </label>
                        <textarea
                            className="w-full h-64 p-5 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm resize-none shadow-inner bg-slate-50/50 transition-all text-slate-800 leading-relaxed"
                            placeholder="E.g., The circulatory system relies on the heart to pump blood. Veins bring blood back, and arteries take it away. Red blood cells carry oxygen from the lungs."
                            value={rawText}
                            onChange={(e) => setRawText(e.target.value)}
                        />
                    </div>

                    <div className="px-6 py-5 bg-slate-50/80 border-t border-slate-100 flex justify-end gap-3 backdrop-blur-sm">
                        <button
                            onClick={onClose}
                            className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onGenerate}
                            disabled={generating || !rawText.trim()}
                            className="inline-flex items-center px-6 py-2.5 border border-transparent rounded-xl shadow-lg shadow-indigo-200 text-sm font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5 active:translate-y-0"
                        >
                            {generating ? (
                                <>
                                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                                    Analyzing & Generating...
                                </>
                            ) : (
                                <>
                                    <Wand2 className="-ml-1 mr-2 h-5 w-5" />
                                    Generate Visuals
                                </>
                            )}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default AiGenerationModal;
