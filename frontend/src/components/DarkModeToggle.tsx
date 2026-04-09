import { Sun, Moon } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function DarkModeToggle() {
  const { darkMode, toggleDarkMode } = useApp();

  return (
    <button
      onClick={toggleDarkMode}
      className="btn-icon"
      title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)' }}
    >
      {darkMode ? (
        <Sun size={18} style={{ color: '#f59e0b' }} />
      ) : (
        <Moon size={18} style={{ color: 'var(--primary-light)' }} />
      )}
    </button>
  );
}
