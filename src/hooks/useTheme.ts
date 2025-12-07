import { useState, useEffect, useCallback } from 'react';

// Standard themes available to all users
export type StandardThemeColor = 'cyan' | 'green' | 'red' | 'white' | 'gold';

// Premium themes (Pro subscription required)
export type PremiumThemeColor = 'felix' | 'retro' | 'noir' | 'winamp' | 'tetris' | 'donkeykong' | 'ww2' | 'dracula' | 'synthwave' | 'nord' | 'checkers' | 'hockey' | 'soccer' | 'football' | 'baseball' | 'basketball' | 'movienight' | 'battleship' | 'litebrite' | 'magiceye';

// All theme colors
export type ThemeColor = StandardThemeColor | PremiumThemeColor;

export interface ThemeState {
  color: ThemeColor;
}

export interface ThemeConfig {
  hue: number;
  sat: number;
  light: number;
  isPremium?: boolean;
  label: string;
  // Premium themes can have custom background and text colors
  customBg?: string;
  customAccent2?: string;
  specialStyle?: 'felix' | 'retro' | 'noir' | 'winamp' | 'tetris' | 'donkeykong' | 'ww2' | 'dracula' | 'synthwave' | 'nord' | 'checkers' | 'hockey' | 'soccer' | 'football' | 'baseball' | 'basketball' | 'movienight' | 'battleship' | 'litebrite' | 'magiceye';
}

const COLOR_MAP: Record<ThemeColor, ThemeConfig> = {
  // Standard themes
  cyan: { hue: 200, sat: 55, light: 42, label: 'Cyan' },
  green: { hue: 155, sat: 35, light: 40, label: 'Green' },
  red: { hue: 0, sat: 45, light: 45, label: 'Red' },
  white: { hue: 220, sat: 5, light: 70, label: 'White' },
  gold: { hue: 40, sat: 50, light: 45, label: 'Gold' },
  // Premium themes
  felix: { 
    hue: 330, sat: 85, light: 55, 
    isPremium: true, 
    label: '2086',
    customAccent2: '180 100% 50%', // Cyan accent
    specialStyle: 'felix'
  },
  retro: { 
    hue: 80, sat: 15, light: 55, 
    isPremium: true, 
    label: '8-BIT',
    customBg: '#d8dcc8',
    specialStyle: 'retro'
  },
  noir: { 
    hue: 0, sat: 0, light: 65, 
    isPremium: true, 
    label: 'Noir',
    specialStyle: 'noir'
  },
  winamp: { 
    hue: 85, sat: 100, light: 45, 
    isPremium: true, 
    label: 'WinAMP',
    specialStyle: 'winamp'
  },
  tetris: { 
    hue: 190, sat: 80, light: 50, 
    isPremium: true, 
    label: 'Tetris',
    specialStyle: 'tetris'
  },
  donkeykong: { 
    hue: 25, sat: 70, light: 45, 
    isPremium: true, 
    label: 'DK',
    specialStyle: 'donkeykong'
  },
  ww2: { 
    hue: 45, sat: 25, light: 40, 
    isPremium: true, 
    label: '1944',
    specialStyle: 'ww2'
  },
  dracula: { 
    hue: 265, sat: 50, light: 60, 
    isPremium: true, 
    label: 'Dracula',
    specialStyle: 'dracula'
  },
  synthwave: { 
    hue: 320, sat: 80, light: 55, 
    isPremium: true, 
    label: 'Synth',
    specialStyle: 'synthwave'
  },
  nord: { 
    hue: 220, sat: 25, light: 55, 
    isPremium: true, 
    label: 'Nord',
    specialStyle: 'nord'
  },
  checkers: { 
    hue: 0, sat: 75, light: 45, 
    isPremium: true, 
    label: 'Checkers',
    specialStyle: 'checkers'
  },
  hockey: { 
    hue: 200, sat: 70, light: 55, 
    isPremium: true, 
    label: '🏒',
    specialStyle: 'hockey'
  },
  soccer: { 
    hue: 120, sat: 50, light: 40, 
    isPremium: true, 
    label: '⚽',
    specialStyle: 'soccer'
  },
  football: { 
    hue: 30, sat: 60, light: 35, 
    isPremium: true, 
    label: '🏈',
    specialStyle: 'football'
  },
  baseball: { 
    hue: 0, sat: 70, light: 50, 
    isPremium: true, 
    label: '⚾',
    specialStyle: 'baseball'
  },
  basketball: { 
    hue: 25, sat: 90, light: 50, 
    isPremium: true, 
    label: '🏀',
    specialStyle: 'basketball'
  },
  movienight: { 
    hue: 0, sat: 70, light: 35, 
    isPremium: true, 
    label: '🎬',
    specialStyle: 'movienight'
  },
  battleship: { 
    hue: 210, sat: 50, light: 35, 
    isPremium: true, 
    label: '🚢',
    specialStyle: 'battleship'
  },
  litebrite: { 
    hue: 300, sat: 100, light: 50, 
    isPremium: true, 
    label: '💡',
    specialStyle: 'litebrite'
  },
  magiceye: { 
    hue: 280, sat: 80, light: 50, 
    isPremium: true, 
    label: '👁️',
    specialStyle: 'magiceye'
  },
};

export const PREMIUM_THEMES: PremiumThemeColor[] = ['felix', 'retro', 'noir', 'winamp', 'tetris', 'donkeykong', 'ww2', 'dracula', 'synthwave', 'nord', 'checkers', 'hockey', 'soccer', 'football', 'baseball', 'basketball', 'movienight', 'battleship', 'litebrite', 'magiceye'];
export const STANDARD_THEMES: StandardThemeColor[] = ['cyan', 'green', 'red', 'white', 'gold'];

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
        // If saved theme is premium, check if user has access (for now, allow it)
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
    const config = COLOR_MAP[theme.color];
    const { hue, sat, light, specialStyle } = config;
    
    // Remove any previous special style classes
    root.classList.remove('theme-felix', 'theme-retro', 'theme-noir', 'theme-winamp', 'theme-tetris', 'theme-donkeykong', 'theme-ww2', 'theme-dracula', 'theme-synthwave', 'theme-nord', 'theme-checkers', 'theme-hockey', 'theme-soccer', 'theme-football', 'theme-baseball', 'theme-basketball', 'theme-movienight', 'theme-battleship', 'theme-litebrite', 'theme-magiceye');
    
    // Add special style class if applicable
    if (specialStyle) {
      root.classList.add(`theme-${specialStyle}`);
    }
    
    // Set accent/aura color
    root.style.setProperty('--aura-1', `${hue} ${sat}% ${light}%`);
    root.style.setProperty('--aura-2', config.customAccent2 || `${hue} ${sat}% ${Math.max(light - 15, 30)}%`);
    
    // Set primary to the selected color
    root.style.setProperty('--primary', `${hue} ${sat}% ${light}%`);
    
    // Foreground colors based on theme
    if (theme.color === 'white') {
      root.style.setProperty('--primary-foreground', '220 10% 10%');
    } else if (theme.color === 'retro') {
      root.style.setProperty('--primary-foreground', '80 20% 20%');
    } else {
      root.style.setProperty('--primary-foreground', '220 10% 98%');
    }
    
    // Secondary stays dark for contrast (unless retro)
    if (theme.color === 'retro') {
      root.style.setProperty('--secondary', '80 10% 75%');
      root.style.setProperty('--secondary-foreground', '80 15% 25%');
    } else {
      root.style.setProperty('--secondary', '220 10% 15%');
      root.style.setProperty('--secondary-foreground', '0 0% 95%');
    }
    
    // Update glass glow and ring to match
    root.style.setProperty('--glass-glow', `${hue} ${sat}% ${light}% / 0.15`);
    root.style.setProperty('--ring', `${hue} ${sat}% ${light}%`);
  }, [theme]);

  const setColor = useCallback((color: ThemeColor, isPro: boolean = false) => {
    const config = COLOR_MAP[color];
    // Only allow premium themes for pro users
    if (config.isPremium && !isPro) {
      return false;
    }
    setTheme({ color });
    return true;
  }, []);

  const config = COLOR_MAP[theme.color];
  const { hue, sat, light } = config;
  const accentColor = `hsl(${hue}, ${sat}%, ${light}%)`;
  const isPremiumTheme = config.isPremium || false;

  return {
    theme,
    setColor,
    accentColor,
    COLOR_MAP,
    isPremiumTheme,
    PREMIUM_THEMES,
    STANDARD_THEMES,
  };
}
