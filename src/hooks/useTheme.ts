import { useState, useEffect, useCallback } from 'react';

export type ThemeColor = 'cyan' | 'green' | 'red' | 'white' | 'gold';

export interface ThemeState {
  color: ThemeColor;
}

const COLOR_MAP: Record<ThemeColor, { hue: number; sat: number; light: number }> = {
  cyan: { hue: 185, sat: 85, light: 55 },
  green: { hue: 145, sat: 70, light: 50 },
  red: { hue: 0, sat: 75, light: 55 },
  white: { hue: 0, sat: 0, light: 90 },
  gold: { hue: 45, sat: 85, light: 55 },
};

const DEFAULT_THEME: ThemeState = {
  color: 'cyan',
};

const THEME_STORAGE_KEY = 'protocol-tracker-theme';

export function useTheme() {
  const [theme, setTheme] = useState<ThemeState>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Migrate old theme format
        if (parsed.primaryMode || parsed.aura1Hue) {
          return DEFAULT_THEME;
        }
        return { ...DEFAULT_THEME, ...parsed };
      }
    } catch (e) {
      console.error('Failed to load theme', e);
    }
    return DEFAULT_THEME;
  });

  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(theme));
    } catch (e) {
      console.error('Failed to save theme', e);
    }
  }, [theme]);

  // Apply CSS variables based on theme
  useEffect(() => {
    const root = document.documentElement;
    const { hue, sat, light } = COLOR_MAP[theme.color];
    
    // Set accent/aura color
    root.style.setProperty('--aura-1', `${hue} ${sat}% ${light}%`);
    root.style.setProperty('--aura-2', `${hue} ${sat}% ${Math.max(light - 15, 30)}%`);
    
    // Set primary to the selected color
    root.style.setProperty('--primary', `${hue} ${sat}% ${light}%`);
    root.style.setProperty('--primary-foreground', theme.color === 'white' ? '220 10% 10%' : '220 10% 98%');
    
    // Secondary stays dark for contrast
    root.style.setProperty('--secondary', '220 10% 15%');
    root.style.setProperty('--secondary-foreground', '0 0% 95%');
    
    // Update glass glow and ring to match
    root.style.setProperty('--glass-glow', `${hue} ${sat}% ${light}% / 0.15`);
    root.style.setProperty('--ring', `${hue} ${sat}% ${light}%`);
  }, [theme]);

  const setColor = useCallback((color: ThemeColor) => {
    setTheme({ color });
  }, []);

  const { hue, sat, light } = COLOR_MAP[theme.color];
  const accentColor = `hsl(${hue}, ${sat}%, ${light}%)`;

  return {
    theme,
    setColor,
    accentColor,
    COLOR_MAP,
  };
}
