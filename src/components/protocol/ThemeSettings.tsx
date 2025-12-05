import { useState } from 'react';
import { Settings, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme, type ThemeColor } from '@/hooks/useTheme';

const COLORS: { id: ThemeColor; label: string }[] = [
  { id: 'cyan', label: 'Cyan' },
  { id: 'green', label: 'Green' },
  { id: 'red', label: 'Red' },
  { id: 'white', label: 'White' },
  { id: 'gold', label: 'Gold' },
];

export function ThemeSettings() {
  const { theme, setColor, COLOR_MAP } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="h-8 w-8 rounded-full opacity-60 hover:opacity-100"
      >
        <Settings className="h-3.5 w-3.5" />
      </Button>
      
      {isOpen && (
        <div className="absolute right-0 top-10 z-50 glass-overlay rounded-lg p-3 animate-scale-in">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">Color</span>
            <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
              <X size={14} />
            </button>
          </div>
          
          <div className="flex gap-2">
            {COLORS.map(({ id, label }) => {
              const { hue, sat, light } = COLOR_MAP[id];
              const isSelected = theme.color === id;
              
              return (
                <button
                  key={id}
                  onClick={() => setColor(id)}
                  className={`
                    w-7 h-7 rounded-full transition-all duration-200
                    ${isSelected 
                      ? 'ring-2 ring-foreground ring-offset-2 ring-offset-background scale-110' 
                      : 'hover:scale-105 opacity-70 hover:opacity-100'
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
        </div>
      )}
    </div>
  );
}
