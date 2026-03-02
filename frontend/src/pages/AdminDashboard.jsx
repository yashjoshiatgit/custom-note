import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import { ArrowLeft, Users, FileText, Trash2, Ban, ShieldCheck } from 'lucide-react';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [notes, setNotes] = useState([]);
    const [activeTab, setActiveTab] = useState('users');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [usersRes, notesRes] = await Promise.all([
                api.get('/admin/users'),
                api.get('/admin/notes')
            ]);
            setUsers(usersRes.data);
            setNotes(notesRes.data);
        } catch (error) {
            console.error('Admin fetch error:', error);
            alert('Not authorized or API error');
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const toggleBlockUser = async (userId) => {
        try {
            await api.post(`/admin/users/${userId}/toggle-block`);
            // We just re-fetch to see blocked status (in a real app we'd map state)
            fetchData();
        } catch (error) {
            alert('Failed to block/unblock user');
        }
    };

    const deleteNote = async (noteId) => {
        if (!confirm('Are you sure you want to delete this note globally?')) return;
        try {
            await api.delete(`/admin/notes/${noteId}`);
            setNotes(notes.filter(n => n.id !== noteId));
        } catch (error) {
            alert('Failed to delete note');
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-slate-500">Loading admin data...</div>;
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-indigo-900 border-b border-indigo-800 px-6 py-4 flex items-center justify-between shadow-md">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="p-2 -ml-2 text-indigo-200 hover:text-white hover:bg-indigo-800 rounded-full transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-white flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-indigo-400" />
                            Admin Console
                        </h1>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                {/* Tabs */}
                <div className="flex space-x-4 mb-8">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${activeTab === 'users' ? 'bg-indigo-100 text-indigo-700' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
                    >
                        <Users className="h-4 w-4" /> Users ({users.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('notes')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${activeTab === 'notes' ? 'bg-indigo-100 text-indigo-700' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
                    >
                        <FileText className="h-4 w-4" /> Global Notes ({notes.length})
                    </button>
                </div>

                {/* Content */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    {activeTab === 'users' && (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">User</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-200">
                                    {users.map(user => (
                                        <tr key={user.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div>
                                                        <div className="text-sm font-medium text-slate-900">{user.name}</div>
                                                        <div className="text-sm text-slate-500">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {/* In a real app 'isBlocked' would be stored in state, assuming missing field mapping implies not blocked for now, 
                                                    or we need to map isBlocked to AuthResponse */}
                                                <span className="text-sm text-slate-900">Active</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                {user.role !== 'ADMIN' && (
                                                    <button
                                                        onClick={() => toggleBlockUser(user.id)}
                                                        className="text-orange-600 hover:text-orange-900 flex items-center justify-end w-full gap-1"
                                                    >
                                                        <Ban className="h-4 w-4" /> Toggle Block
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'notes' && (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Title / Content</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Created</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-200">
                                    {notes.map(n => (
                                        <tr key={n.id}>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-slate-900 cursor-pointer hover:text-indigo-600" onClick={() => navigate(`/note/${n.id}`)}>
                                                    {n.title}
                                                </div>
                                                <div className="text-sm text-slate-500 line-clamp-1 mt-1">{n.originalContent}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                                {new Date(n.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => deleteNote(n.id)}
                                                    className="text-red-600 hover:text-red-900 flex items-center justify-end w-full gap-1"
                                                >
                                                    <Trash2 className="h-4 w-4" /> Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
