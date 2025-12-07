import { useState } from 'react';
import { User, LogOut, Palette, Bell, Shield, Download, CreditCard, ChevronRight, Check, Moon, HelpCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useTheme, type ThemeColor } from '@/hooks/useTheme';

interface SettingsTabProps {
  user: { email: string } | null;
  signOut: () => Promise<{ error: any }>;
}

const THEME_COLORS: { id: ThemeColor; name: string; color: string }[] = [
  { id: 'gold', name: 'Amber', color: '#f59e0b' },
  { id: 'cyan', name: 'Cyan', color: '#06b6d4' },
  { id: 'green', name: 'Emerald', color: '#10b981' },
  { id: 'red', name: 'Rose', color: '#f43f5e' },
  { id: 'white', name: 'Silver', color: '#a1a1aa' },
];

export function SettingsTab({ user, signOut }: SettingsTabProps) {
  const { theme, setColor } = useTheme();
  const [showThemePicker, setShowThemePicker] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="space-y-6 py-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Settings</h2>
        <p className="text-zinc-500">Manage your account and preferences</p>
      </div>

      {/* Profile Section */}
      <div className="rounded-2xl bg-zinc-900/80 p-4 border border-zinc-800/50">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-white truncate">{user?.email || 'User'}</p>
            <p className="text-sm text-primary">Pro Plan</p>
          </div>
          <ChevronRight className="w-5 h-5 text-zinc-600" />
        </div>
      </div>

      {/* Subscription Card */}
      <div className="rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-4 border border-primary/20">
        <div className="flex items-center gap-3 mb-3">
          <CreditCard className="w-5 h-5 text-primary" />
          <span className="font-medium text-white">Subscription</span>
        </div>
        <p className="text-sm text-zinc-400 mb-4">You're on the Pro plan. Enjoy unlimited protocols and full lab tracking.</p>
        <Button variant="outline" className="w-full border-primary/30 text-primary hover:bg-primary/10">
          Manage Subscription
        </Button>
      </div>

      {/* Appearance */}
      <div className="rounded-2xl bg-zinc-900/80 border border-zinc-800/50 overflow-hidden">
        <button
          onClick={() => setShowThemePicker(!showThemePicker)}
          className="w-full p-4 flex items-center justify-between hover:bg-zinc-800/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center">
              <Palette className="w-5 h-5 text-zinc-400" />
            </div>
            <div className="text-left">
              <p className="font-medium text-white">Accent Color</p>
              <p className="text-sm text-zinc-500">Customize your theme</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div 
              className="w-6 h-6 rounded-full border-2 border-white/20"
              style={{ backgroundColor: THEME_COLORS.find(c => c.id === theme.color)?.color }}
            />
            <ChevronRight className={`w-5 h-5 text-zinc-600 transition-transform ${showThemePicker ? 'rotate-90' : ''}`} />
          </div>
        </button>
        
        {showThemePicker && (
          <div className="px-4 pb-4 animate-fade-in">
            <div className="flex gap-3 justify-center pt-2">
              {THEME_COLORS.map(({ id, name, color }) => (
                <button
                  key={id}
                  onClick={() => setColor(id)}
                  className="flex flex-col items-center gap-2"
                >
                  <div 
                    className={`w-12 h-12 rounded-full transition-all ${
                      theme.color === id 
                        ? 'ring-2 ring-white ring-offset-2 ring-offset-zinc-900 scale-110' 
                        : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: color }}
                  >
                    {theme.color === id && (
                      <div className="w-full h-full flex items-center justify-center">
                        <Check className="w-5 h-5 text-white drop-shadow" />
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-zinc-500">{name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Preferences */}
      <div className="rounded-2xl bg-zinc-900/80 border border-zinc-800/50 divide-y divide-zinc-800/50">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center">
              <Bell className="w-5 h-5 text-zinc-400" />
            </div>
            <div>
              <p className="font-medium text-white">Push Notifications</p>
              <p className="text-sm text-zinc-500">Get dose reminders</p>
            </div>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center">
              <Moon className="w-5 h-5 text-zinc-400" />
            </div>
            <div>
              <p className="font-medium text-white">Dark Mode</p>
              <p className="text-sm text-zinc-500">Always on</p>
            </div>
          </div>
          <Switch checked disabled />
        </div>
      </div>

      {/* Data & Privacy */}
      <div className="rounded-2xl bg-zinc-900/80 border border-zinc-800/50 divide-y divide-zinc-800/50">
        <button className="w-full p-4 flex items-center justify-between hover:bg-zinc-800/50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center">
              <Download className="w-5 h-5 text-zinc-400" />
            </div>
            <div className="text-left">
              <p className="font-medium text-white">Export Data</p>
              <p className="text-sm text-zinc-500">Download your history</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-zinc-600" />
        </button>

        <button className="w-full p-4 flex items-center justify-between hover:bg-zinc-800/50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center">
              <Shield className="w-5 h-5 text-zinc-400" />
            </div>
            <div className="text-left">
              <p className="font-medium text-white">Privacy Policy</p>
              <p className="text-sm text-zinc-500">How we protect your data</p>
            </div>
          </div>
          <ExternalLink className="w-5 h-5 text-zinc-600" />
        </button>

        <button className="w-full p-4 flex items-center justify-between hover:bg-zinc-800/50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-zinc-400" />
            </div>
            <div className="text-left">
              <p className="font-medium text-white">Help & Support</p>
              <p className="text-sm text-zinc-500">Get assistance</p>
            </div>
          </div>
          <ExternalLink className="w-5 h-5 text-zinc-600" />
        </button>
      </div>

      {/* Sign Out */}
      <Button
        onClick={handleSignOut}
        variant="outline"
        className="w-full h-14 border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-xl"
      >
        <LogOut className="w-5 h-5 mr-2" />
        Sign Out
      </Button>

      {/* App Info */}
      <div className="text-center pt-4">
        <p className="text-[10px] text-zinc-600 tracking-wider uppercase">
          Protocol v1.0.0 • Made with ❤️
        </p>
      </div>
    </div>
  );
}

