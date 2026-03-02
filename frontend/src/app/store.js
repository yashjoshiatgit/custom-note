import { create } from 'zustand';

const useStore = create((set) => ({
    user: null,
    isAuthenticated: false,

    setUser: (userData) => set({ user: userData, isAuthenticated: true }),
    logoutUser: () => set({ user: null, isAuthenticated: false }),

    // Notes state
    notes: [],
    setNotes: (notes) => set({ notes }),
    activeNote: null,
    setActiveNote: (note) => set({ activeNote: note }),
}));

export default useStore;
