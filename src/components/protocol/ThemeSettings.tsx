import { useState } from 'react';
import { Settings, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme, type ColorMode } from '@/hooks/useTheme';

interface ColorChipProps {
  mode: ColorMode;
  selected: boolean;
  onClick: () => void;
  colorHue?: number;
  colorSat?: number;
  colorLight?: number;
  onColorClick?: () => void;
}

function ColorChip({ mode, selected, onClick, colorHue, colorSat, colorLight, onColorClick }: ColorChipProps) {
  const getChipStyle = () => {
    if (mode === 'white') {
      return { background: 'hsl(0, 0%, 95%)' };
    }
    if (mode === 'black') {
      return { background: 'hsl(220, 10%, 12%)' };
    }
    return {
      background: `linear-gradient(135deg, hsl(${colorHue}, ${colorSat}%, ${colorLight}%), hsl(${(colorHue || 0) + 30}, ${colorSat}%, ${(colorLight || 50) - 10}%))`,
    };
  };

  return (
    <button
      onClick={mode === 'color' && onColorClick ? onColorClick : onClick}
      className={`
        w-10 h-10 rounded-full border-2 transition-all duration-200
        ${selected ? 'border-foreground scale-110 shadow-lg' : 'border-border/50 hover:border-border'}
        ${mode === 'black' ? 'border-border' : ''}
      `}
      style={getChipStyle()}
      title={mode.charAt(0).toUpperCase() + mode.slice(1)}
    />
  );
}

interface ColorPickerProps {
  hue: number;
  saturation: number;
  lightness: number;
  onHueChange: (h: number) => void;
  onSaturationChange: (s: number) => void;
  onLightnessChange: (l: number) => void;
  onClose: () => void;
}

function ColorPicker({ hue, saturation, lightness, onHueChange, onSaturationChange, onLightnessChange, onClose }: ColorPickerProps) {
  return (
    <div className="animate-scale-in glass-overlay rounded-xl p-4 space-y-4 mt-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">Pick a Color</span>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X size={18} />
        </button>
      </div>
      
      {/* Preview */}
      <div 
        className="w-full h-12 rounded-lg"
        style={{ background: `hsl(${hue}, ${saturation}%, ${lightness}%)` }}
      />
      
      {/* Hue */}
      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">Hue</label>
        <input
          type="range"
          min="0"
          max="360"
          value={hue}
          onChange={(e) => onHueChange(parseInt(e.target.value))}
          className="w-full h-3 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, 
              hsl(0, ${saturation}%, ${lightness}%), 
              hsl(60, ${saturation}%, ${lightness}%), 
              hsl(120, ${saturation}%, ${lightness}%), 
              hsl(180, ${saturation}%, ${lightness}%), 
              hsl(240, ${saturation}%, ${lightness}%), 
              hsl(300, ${saturation}%, ${lightness}%), 
              hsl(360, ${saturation}%, ${lightness}%))`,
          }}
        />
      </div>
      
      {/* Saturation */}
      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">Saturation</label>
        <input
          type="range"
          min="20"
          max="100"
          value={saturation}
          onChange={(e) => onSaturationChange(parseInt(e.target.value))}
          className="w-full h-3 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, 
              hsl(${hue}, 20%, ${lightness}%), 
              hsl(${hue}, 100%, ${lightness}%))`,
          }}
        />
      </div>
      
      {/* Lightness */}
      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">Brightness</label>
        <input
          type="range"
          min="30"
          max="70"
          value={lightness}
          onChange={(e) => onLightnessChange(parseInt(e.target.value))}
          className="w-full h-3 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, 
              hsl(${hue}, ${saturation}%, 30%), 
              hsl(${hue}, ${saturation}%, 70%))`,
          }}
        />
      </div>
    </div>
  );
}

export function ThemeSettings() {
  const { theme, updateTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [editingColor, setEditingColor] = useState<'aura1' | 'aura2' | null>(null);

  const handlePrimarySelect = (mode: ColorMode) => {
    if (mode === theme.secondaryMode) {
      // Swap if selecting same as secondary
      updateTheme({ primaryMode: mode, secondaryMode: theme.primaryMode });
    } else {
      updateTheme({ primaryMode: mode });
    }
    if (mode !== 'color') setEditingColor(null);
  };

  const handleSecondarySelect = (mode: ColorMode) => {
    if (mode === theme.primaryMode) {
      // Swap if selecting same as primary
      updateTheme({ secondaryMode: mode, primaryMode: theme.secondaryMode });
    } else {
      updateTheme({ secondaryMode: mode });
    }
    if (mode !== 'color') setEditingColor(null);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="h-9 w-9 rounded-full"
      >
        <Settings className="h-4 w-4" />
      </Button>
      
      {isOpen && (
        <div className="absolute right-0 top-12 z-50 w-72 glass-overlay rounded-xl p-4 space-y-4 animate-scale-in">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Theme Settings</span>
            <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
              <X size={18} />
            </button>
          </div>
          
          {/* Primary Color */}
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground uppercase tracking-wider">Primary</label>
            <div className="flex items-center gap-3">
              <ColorChip
                mode="white"
                selected={theme.primaryMode === 'white'}
                onClick={() => handlePrimarySelect('white')}
              />
              <ColorChip
                mode="black"
                selected={theme.primaryMode === 'black'}
                onClick={() => handlePrimarySelect('black')}
              />
              <ColorChip
                mode="color"
                selected={theme.primaryMode === 'color'}
                onClick={() => handlePrimarySelect('color')}
                onColorClick={() => {
                  handlePrimarySelect('color');
                  setEditingColor('aura1');
                }}
                colorHue={theme.aura1Hue}
                colorSat={theme.aura1Saturation}
                colorLight={theme.aura1Lightness}
              />
            </div>
          </div>
          
          {/* Secondary Color */}
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground uppercase tracking-wider">Secondary</label>
            <div className="flex items-center gap-3">
              <ColorChip
                mode="white"
                selected={theme.secondaryMode === 'white'}
                onClick={() => handleSecondarySelect('white')}
              />
              <ColorChip
                mode="black"
                selected={theme.secondaryMode === 'black'}
                onClick={() => handleSecondarySelect('black')}
              />
              <ColorChip
                mode="color"
                selected={theme.secondaryMode === 'color'}
                onClick={() => handleSecondarySelect('color')}
                onColorClick={() => {
                  handleSecondarySelect('color');
                  setEditingColor('aura2');
                }}
                colorHue={theme.aura2Hue}
                colorSat={theme.aura2Saturation}
                colorLight={theme.aura2Lightness}
              />
            </div>
          </div>
          
          {/* Color Pickers */}
          {editingColor === 'aura1' && (
            <ColorPicker
              hue={theme.aura1Hue}
              saturation={theme.aura1Saturation}
              lightness={theme.aura1Lightness}
              onHueChange={(h) => updateTheme({ aura1Hue: h })}
              onSaturationChange={(s) => updateTheme({ aura1Saturation: s })}
              onLightnessChange={(l) => updateTheme({ aura1Lightness: l })}
              onClose={() => setEditingColor(null)}
            />
          )}
          
          {editingColor === 'aura2' && (
            <ColorPicker
              hue={theme.aura2Hue}
              saturation={theme.aura2Saturation}
              lightness={theme.aura2Lightness}
              onHueChange={(h) => updateTheme({ aura2Hue: h })}
              onSaturationChange={(s) => updateTheme({ aura2Saturation: s })}
              onLightnessChange={(l) => updateTheme({ aura2Lightness: l })}
              onClose={() => setEditingColor(null)}
            />
          )}
        </div>
      )}
    </div>
  );
}
