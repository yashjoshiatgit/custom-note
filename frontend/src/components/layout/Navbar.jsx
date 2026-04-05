import React from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../app/store';
import api from '../../api/axiosInstance';
import { FileText, LogOut, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
    const { user, logoutUser } = useStore();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await api.post('/auth/logout');
            logoutUser();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (
        <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200 shadow-sm sticky top-0 z-40 navbar-tour-step">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex-shrink-0 flex items-center cursor-pointer"
                        onClick={() => navigate('/dashboard')}
                    >
                        <div className="bg-indigo-600 p-2 rounded-xl mr-3 shadow-indigo-200 shadow-lg">
                            <FileText className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 tracking-tight">
                            NoteFlow
                        </span>
                    </motion.div>
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center space-x-4"
                    >
                        <div className="text-sm font-medium text-slate-700 hidden sm:block">
                            Hey, <span className="font-bold text-slate-900">{user?.name}</span>
                        </div>
                        {user?.role === 'ADMIN' && (
                            <button
                                onClick={() => navigate('/admin')}
                                className="p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all"
                                title="Admin Panel"
                            >
                                <Settings className="h-5 w-5" />
                            </button>
                        )}
                        <button
                            onClick={handleLogout}
                            className="p-2.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-all flex items-center gap-2"
                            title="Sign out"
                        >
                            <LogOut className="h-5 w-5" />
                            <span className="text-sm font-medium hidden sm:block">Sign out</span>
                        </button>
                    </motion.div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
