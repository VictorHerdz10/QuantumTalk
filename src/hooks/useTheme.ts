import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Obtener el tema guardado en localStorage o usar 'light' por defecto
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    return savedTheme || 'light';
  });

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  useEffect(() => {
    // Aplicar el tema al body y guardar en localStorage
    document.body.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);

    // También aplicar al elemento raíz de Ionic si existe
    const ionApp = document.querySelector('ion-app');
    if (ionApp) {
      ionApp.classList.toggle('dark', theme === 'dark');
    }
  }, [theme]);

  return { theme, toggleTheme };
};

export default useTheme;