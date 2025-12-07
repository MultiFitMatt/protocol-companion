import { useState } from 'react';
import { Settings, X, Lock, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme, type ThemeColor, STANDARD_THEMES, PREMIUM_THEMES } from '@/hooks/useTheme';

// For now, hardcode isPro to true for testing - this would come from a subscription check
const IS_PRO_USER = true;

export function ThemeSettings() {
  const { theme, setColor, COLOR_MAP } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectTheme = (id: ThemeColor) => {
    const config = COLOR_MAP[id];
    if (config.isPremium && !IS_PRO_USER) {
      // Could show upgrade modal here
      return;
    }
    setColor(id, IS_PRO_USER);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="nav-icon-btn"
        title="Theme settings"
      >
        <Settings className="h-4 w-4" />
      </Button>
      
      {isOpen && (
        <>
          {/* Backdrop to close on click outside */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown panel */}
          <div className="absolute right-0 top-full mt-2 z-50 glass-overlay rounded-xl p-4 animate-scale-in min-w-[220px]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-[0.15em] text-white/60 font-medium">Accent Color</span>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-white/40 hover:text-white/70 transition-colors p-1 -mr-1"
              >
                <X size={14} />
              </button>
            </div>
            
            {/* Standard Themes */}
            <div className="flex gap-2 justify-center mb-4">
              {STANDARD_THEMES.map((id) => {
                const config = COLOR_MAP[id];
                const { hue, sat, light, label } = config;
                const isSelected = theme.color === id;
                
                return (
                  <button
                    key={id}
                    onClick={() => handleSelectTheme(id)}
                    className={`
                      w-8 h-8 rounded-full transition-all duration-200 press-effect
                      ${isSelected 
                        ? 'ring-2 ring-white ring-offset-2 ring-offset-[#010003] scale-110' 
                        : 'hover:scale-110 opacity-80 hover:opacity-100'
                      }
                    `}
                    style={{ 
                      background: id === 'white' 
                        ? `radial-gradient(circle, hsl(${hue}, ${sat}%, ${light}%) 0%, hsl(${hue}, ${sat}%, ${light - 10}%) 100%)`
                        : `radial-gradient(circle at 30% 30%, hsl(${hue}, ${sat}%, ${light + 15}%) 0%, hsl(${hue}, ${sat}%, ${light}%) 50%, hsl(${hue}, ${sat}%, ${light - 10}%) 100%)`
                    }}
                    title={label}
                  />
                );
              })}
            </div>

            {/* Premium Themes Divider */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[9px] uppercase tracking-[0.2em] text-amber-500/80 font-medium flex items-center gap-1">
                <Crown size={10} />
                Pro Themes
              </span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Premium Themes - Grid layout for more themes */}
            <div className="grid grid-cols-4 gap-2 justify-items-center">
              {PREMIUM_THEMES.map((id) => {
                const config = COLOR_MAP[id];
                const { hue, sat, light, label, specialStyle } = config;
                const isSelected = theme.color === id;
                const isLocked = !IS_PRO_USER;
                
                // Custom gradient styles for premium themes
                let bgStyle = '';
                if (specialStyle === 'felix') {
                  bgStyle = 'linear-gradient(135deg, #8b008b 0%, #ff2d92 50%, #00f0ff 100%)';
                } else if (specialStyle === 'retro') {
                  bgStyle = 'linear-gradient(135deg, #c8d0b8 0%, #a8b098 100%)';
                } else if (specialStyle === 'noir') {
                  bgStyle = 'linear-gradient(135deg, #666 0%, #333 100%)';
                } else if (specialStyle === 'winamp') {
                  bgStyle = 'linear-gradient(135deg, #1a1a1a 0%, #00ff00 50%, #1a1a1a 100%)';
                } else if (specialStyle === 'tetris') {
                  bgStyle = 'linear-gradient(135deg, #ff0000 0%, #00ffff 25%, #ffff00 50%, #00ff00 75%, #ff00ff 100%)';
                } else if (specialStyle === 'donkeykong') {
                  bgStyle = 'linear-gradient(135deg, #8B4513 0%, #FF6B35 50%, #FFD700 100%)';
                } else if (specialStyle === 'ww2') {
                  bgStyle = 'linear-gradient(135deg, #4a4a3a 0%, #8b7355 50%, #d4c4a8 100%)';
                } else if (specialStyle === 'dracula') {
                  bgStyle = 'linear-gradient(135deg, #282a36 0%, #bd93f9 50%, #ff79c6 100%)';
                } else if (specialStyle === 'synthwave') {
                  bgStyle = 'linear-gradient(135deg, #2b1055 0%, #ff6ec7 50%, #f9d423 100%)';
                } else if (specialStyle === 'nord') {
                  bgStyle = 'linear-gradient(135deg, #2e3440 0%, #5e81ac 50%, #88c0d0 100%)';
                } else if (specialStyle === 'checkers') {
                  bgStyle = 'repeating-conic-gradient(#c41e3a 0% 25%, #1a1a1a 0% 50%) 50% / 12px 12px';
                } else if (specialStyle === 'hockey') {
                  bgStyle = 'linear-gradient(135deg, #0066cc 0%, #ffffff 50%, #cc0000 100%)';
                } else if (specialStyle === 'soccer') {
                  bgStyle = 'linear-gradient(135deg, #228b22 0%, #ffffff 50%, #1a1a1a 100%)';
                } else if (specialStyle === 'football') {
                  bgStyle = 'linear-gradient(135deg, #228b22 0%, #8b4513 50%, #ffffff 100%)';
                } else if (specialStyle === 'baseball') {
                  bgStyle = 'linear-gradient(135deg, #228b22 0%, #ffffff 50%, #cc0000 100%)';
                } else if (specialStyle === 'basketball') {
                  bgStyle = 'linear-gradient(135deg, #ff6600 0%, #8b4513 100%)';
                } else if (specialStyle === 'movienight') {
                  bgStyle = 'linear-gradient(135deg, #1a0a0a 0%, #8b0000 50%, #daa520 100%)';
                } else if (specialStyle === 'battleship') {
                  bgStyle = 'linear-gradient(135deg, #1a3a5c 0%, #708090 50%, #cc0000 100%)';
                } else if (specialStyle === 'litebrite') {
                  bgStyle = 'linear-gradient(135deg, #ff0080 0%, #00ff80 33%, #0080ff 66%, #ff8000 100%)';
                } else if (specialStyle === 'magiceye') {
                  bgStyle = 'repeating-conic-gradient(from 0deg, #ff0000 0deg 30deg, #ff8000 30deg 60deg, #ffff00 60deg 90deg, #00ff00 90deg 120deg, #00ffff 120deg 150deg, #0000ff 150deg 180deg, #ff00ff 180deg 210deg, #ff0000 210deg 240deg, #ff8000 240deg 270deg, #ffff00 270deg 300deg, #00ff00 300deg 330deg, #00ffff 330deg 360deg) 50% 50% / 20px 20px';
                } else {
                  bgStyle = `radial-gradient(circle at 30% 30%, hsl(${hue}, ${sat}%, ${light + 15}%) 0%, hsl(${hue}, ${sat}%, ${light}%) 50%, hsl(${hue}, ${sat}%, ${light - 10}%) 100%)`;
                }
                
                return (
                  <button
                    key={id}
                    onClick={() => handleSelectTheme(id)}
                    className={`
                      relative w-7 h-7 rounded-full transition-all duration-200
                      ${isLocked 
                        ? 'opacity-40 cursor-not-allowed grayscale' 
                        : isSelected
                          ? 'ring-2 ring-white ring-offset-2 ring-offset-[#010003] scale-110'
                          : 'hover:scale-110 opacity-80 hover:opacity-100 press-effect'
                      }
                    `}
                    style={{ background: bgStyle }}
                    title={isLocked ? `${label} (Pro)` : label}
                    disabled={isLocked}
                  >
                    {isLocked && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Lock size={10} className="text-white/60" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Upgrade hint for locked themes */}
            {!IS_PRO_USER && (
              <p className="text-[9px] text-center text-white/30 mt-3">
                Upgrade to Pro to unlock premium themes
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
