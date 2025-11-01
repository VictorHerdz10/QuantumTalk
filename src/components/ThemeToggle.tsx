import { IonIcon } from "@ionic/react";
import { moon, sunny } from "ionicons/icons";
import { useThemeStore } from "../store/themeStore";
import './ThemeToggle.css'

const ThemeToggle = () => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button 
      onClick={toggleTheme}
      className="theme-toggle-button"
    >
      <IonIcon
        icon={theme === "dark" ? sunny : moon}
        className="theme-toggle-icon"
      />
    </button>
  );
};

export default ThemeToggle;