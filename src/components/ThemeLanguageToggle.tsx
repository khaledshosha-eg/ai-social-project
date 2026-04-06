import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon, Languages } from 'lucide-react';

export const ThemeLanguageToggle = () => {
  const { theme, lang, toggleTheme, toggleLanguage } = useTheme();

  return (
    <div className="flex items-center gap-2 p-1 bg-white/5 backdrop-blur-md rounded-full border border-white/10 ml-4">
      {/* زر اللغة */}
      <button 
        onClick={toggleLanguage} 
        className="flex items-center gap-1 px-2 py-1 hover:bg-white/10 rounded-full transition-all text-[10px] font-bold text-white/80"
      >
        <Languages className="w-3 h-3 text-blue-400" />
        {lang === 'en' ? 'AR' : 'EN'}
      </button>

      {/* فاصل صغير */}
      <div className="w-[1px] h-3 bg-white/10"></div>

      {/* زر الثيم */}
      <button 
        onClick={toggleTheme} 
        className="p-1.5 hover:scale-110 transition-transform"
      >
        {theme === 'dark' ? (
          <Sun className="w-4 h-4 text-yellow-400" />
        ) : (
          <Moon className="w-4 h-4 text-slate-400" />
        )}
      </button>
    </div>
  );
};