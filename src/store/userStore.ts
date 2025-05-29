import { create } from 'zustand';

interface UserStore {
    user: string;
    setUser: (user: string) => void;
  }
  
  export const useUserStore = create<UserStore>((set) => ({
    user: 'Guest',
    setUser: (user) => set({ user }),
  }));