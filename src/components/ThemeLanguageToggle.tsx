import { Moon, Sun, Languages } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

const ThemeLanguageToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  return (
    <div className="fixed top-4 end-4 z-50 flex gap-2">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleTheme}
        className="glass-card p-2.5 rounded-full glow-hover cursor-pointer"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <Sun className="w-5 h-5 text-foreground" /> : <Moon className="w-5 h-5 text-foreground" />}
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
        className="glass-card p-2.5 rounded-full glow-hover cursor-pointer flex items-center gap-1.5"
        aria-label="Toggle language"
      >
        <Languages className="w-5 h-5 text-foreground" />
        <span className="text-xs font-semibold text-foreground">{language === 'en' ? 'عربي' : 'EN'}</span>
      </motion.button>
    </div>
  );
};

export default ThemeLanguageToggle;
