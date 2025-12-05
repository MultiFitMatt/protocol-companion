import { useState, useEffect, useCallback } from 'react';

export type ColorMode = 'white' | 'black' | 'color';

export interface ThemeState {
  primaryMode: ColorMode;
  secondaryMode: ColorMode;
  aura1Hue: number;
  aura1Saturation: number;
  aura1Lightness: number;
  aura2Hue: number;
  aura2Saturation: number;
  aura2Lightness: number;
}

const DEFAULT_THEME: ThemeState = {
  primaryMode: 'color',
  secondaryMode: 'black',
  aura1Hue: 210,
  aura1Saturation: 80,
  aura1Lightness: 55,
  aura2Hue: 280,
  aura2Saturation: 70,
  aura2Lightness: 50,
};

const THEME_STORAGE_KEY = 'protocol-tracker-theme';

export function useTheme() {
  const [theme, setTheme] = useState<ThemeState>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_THEME, ...JSON.parse(saved) };
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
    
    // Set aura colors
    root.style.setProperty('--aura-1', `${theme.aura1Hue} ${theme.aura1Saturation}% ${theme.aura1Lightness}%`);
    root.style.setProperty('--aura-2', `${theme.aura2Hue} ${theme.aura2Saturation}% ${theme.aura2Lightness}%`);
    
    // Set primary based on mode
    if (theme.primaryMode === 'white') {
      root.style.setProperty('--primary', '0 0% 95%');
      root.style.setProperty('--primary-foreground', '220 10% 10%');
    } else if (theme.primaryMode === 'black') {
      root.style.setProperty('--primary', '220 10% 15%');
      root.style.setProperty('--primary-foreground', '0 0% 95%');
    } else {
      root.style.setProperty('--primary', `${theme.aura1Hue} ${theme.aura1Saturation}% ${theme.aura1Lightness}%`);
      root.style.setProperty('--primary-foreground', '220 10% 98%');
    }
    
    // Set secondary based on mode
    if (theme.secondaryMode === 'white') {
      root.style.setProperty('--secondary', '0 0% 95%');
      root.style.setProperty('--secondary-foreground', '220 10% 10%');
    } else if (theme.secondaryMode === 'black') {
      root.style.setProperty('--secondary', '220 10% 15%');
      root.style.setProperty('--secondary-foreground', '0 0% 95%');
    } else {
      root.style.setProperty('--secondary', `${theme.aura2Hue} ${theme.aura2Saturation}% ${theme.aura2Lightness}%`);
      root.style.setProperty('--secondary-foreground', '220 10% 98%');
    }
    
    // Update glass glow and ring to match primary
    if (theme.primaryMode === 'color') {
      root.style.setProperty('--glass-glow', `${theme.aura1Hue} ${theme.aura1Saturation}% ${theme.aura1Lightness}% / 0.15`);
      root.style.setProperty('--ring', `${theme.aura1Hue} ${theme.aura1Saturation}% ${theme.aura1Lightness}%`);
    }
  }, [theme]);

  const updateTheme = useCallback((updates: Partial<ThemeState>) => {
    setTheme((prev) => ({ ...prev, ...updates }));
  }, []);

  const aura1Color = `hsl(${theme.aura1Hue}, ${theme.aura1Saturation}%, ${theme.aura1Lightness}%)`;
  const aura2Color = `hsl(${theme.aura2Hue}, ${theme.aura2Saturation}%, ${theme.aura2Lightness}%)`;

  return {
    theme,
    updateTheme,
    aura1Color,
    aura2Color,
  };
}
