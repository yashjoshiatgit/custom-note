import React from 'react';
import NoteCard from './NoteCard';
import { FileText, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NoteGrid = ({ notes, navigate, handleDeleteNote, handleCreateNote }) => {
    if (notes.length === 0) {
        return (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-24 bg-white/80 backdrop-blur-md rounded-3xl border border-dashed border-slate-300 shadow-sm"
            >
                <div className="bg-indigo-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FileText className="h-10 w-10 text-indigo-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">No notes yet</h3>
                <p className="text-slate-500 max-w-sm mx-auto mb-8">Get started by creating a new visual note. Your ideas will be transformed into beautiful interactive maps.</p>
                <button 
                    onClick={handleCreateNote} 
                    className="inline-flex items-center px-6 py-3 border border-transparent rounded-xl shadow-lg shadow-indigo-200 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all"
                >
                    <Plus className="-ml-1 mr-2 h-5 w-5" />
                    Create First Note
                </button>
            </motion.div>
        );
    }

    return (
        <motion.div 
            layout 
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
            <AnimatePresence>
                {notes.map((note) => (
                    <NoteCard
                        key={note.id}
                        note={note}
                        onClick={() => navigate(`/note/${note.id}`)}
                        onDelete={(e) => {
                            e.stopPropagation();
                            handleDeleteNote(e, note.id);
                        }}
                        onHistoryClick={(e) => {
                            e.stopPropagation();
                            navigate(`/note/${note.id}/history`);
                        }}
                    />
                ))}
            </AnimatePresence>
        </motion.div>
    );
};

export default NoteGrid;
