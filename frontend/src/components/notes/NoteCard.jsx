import React from 'react';
import { Clock, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const NoteCard = ({ note, onClick, onDelete, onHistoryClick }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ y: -4, shadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
            transition={{ duration: 0.2 }}
            onClick={onClick}
            className="group relative bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-sm hover:border-indigo-300 transition-all cursor-pointer overflow-hidden flex flex-col h-48 note-card-step"
        >
            <div className="p-5 flex-1 relative">
                <h3 className="text-lg font-bold text-slate-900 truncate pr-8 group-hover:text-indigo-600 transition-colors">
                    {note.title}
                </h3>

                {/* Action buttons (appear on hover) */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={onDelete}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all scale-95 hover:scale-105"
                        title="Delete note"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>

                <div className="mt-4">
                    <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed">
                        {note.originalContent || "Blank visual note. Click to start editing on the canvas."}
                    </p>
                </div>
            </div>
            <div className="bg-slate-50/80 px-5 py-3 border-t border-slate-100/50 flex items-center justify-between">
                <div className="flex items-center text-xs text-slate-500 font-medium">
                    <Clock className="mr-1.5 h-3.5 w-3.5" />
                    {new Date(note.updatedAt || note.createdAt).toLocaleDateString()}
                </div>
                <button
                    onClick={onHistoryClick}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors history-btn-step"
                >
                    History
                </button>
            </div>
        </motion.div>
    );
};

export default NoteCard;
