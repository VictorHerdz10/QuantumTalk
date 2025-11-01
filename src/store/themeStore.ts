import { useEffect } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ThemeState = {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light',
      toggleTheme: () => set((state) => ({
        theme: state.theme === 'light' ? 'dark' : 'light'
      })),
    }),
    {
      name: 'theme-storage', // nombre para el localStorage
    }
  )
);

// Hook para aplicar el tema al body cuando cambie
export const useApplyTheme = () => {
  const { theme } = useThemeStore();
  
  useEffect(() => {
    document.body.classList.toggle('dark', theme === 'dark');
  }, [theme]);
};