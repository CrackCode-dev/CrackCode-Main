import React from "react";
import { useTheme } from "../../context/theme/ThemeContext";

export default function ThemeSwitcher() {
  const { theme, setTheme, themes } = useTheme();

  return (
    <div className="flex items-center gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1 shadow-sm">
      {themes.map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => setTheme(t)}
          className={[
            "px-3 py-1.5 text-xs font-semibold rounded-lg transition",
            t === theme
              ? "bg-[var(--brand)] text-white shadow"
              : "text-[var(--muted)] hover:bg-[var(--brandSoft)] hover:text-[var(--brandInk)]",
          ].join(" ")}
        >
          {t[0].toUpperCase() + t.slice(1)}
        </button>
      ))}
    </div>
  );
}