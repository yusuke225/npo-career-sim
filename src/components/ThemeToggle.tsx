import { Moon, Sun } from 'lucide-react';
import type { ThemeMode } from '../types/game';

interface ThemeToggleProps {
  theme: ThemeMode;
  onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button
      type="button"
      className="btn btn-sm"
      onClick={onToggle}
      aria-label="切換閱讀模式"
      title={theme === 'light' ? '切換為深夜閱讀模式' : '切換為紙本檔案模式'}
    >
      {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
      <span>{theme === 'light' ? '深夜閱讀' : '紙本模式'}</span>
    </button>
  );
}
