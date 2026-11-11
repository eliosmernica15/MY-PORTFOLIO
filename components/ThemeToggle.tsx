import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeProvider";
import { useT } from "@/i18n/LocaleProvider";

const ThemeToggle: React.FC = () => {
  const { mode, toggleTheme } = useTheme();
  const t = useT();

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="interactive-btn w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300 nav-link hover:border-[var(--border-hover)]"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border)",
        color: "var(--text-secondary)",
      }}
      aria-label={t("accessibility.toggleTheme")}
    >
      <AnimatePresence mode="wait" initial={false}>
        {mode === "dark" ? (
          <motion.div
            key="sun"
            initial={{ rotate: -60, opacity: 0, scale: 0.6 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 60, opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.22 }}
          >
            <Sun size={18} />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ rotate: 60, opacity: 0, scale: 0.6 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -60, opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.22 }}
          >
            <Moon size={18} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default ThemeToggle;
