import { Home, Activity, Calendar, Settings, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

type Tab = 'home' | 'schedule' | 'log' | 'labs' | 'settings';

interface MobileNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function MobileNav({ activeTab, onTabChange }: MobileNavProps) {
  const tabs: { id: Tab; icon: typeof Home; label: string; highlight?: boolean }[] = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'schedule', icon: Calendar, label: 'Schedule' },
    { id: 'log', icon: Plus, label: 'Log', highlight: true },
    { id: 'labs', icon: Activity, label: 'Labs' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#010003]/95 backdrop-blur-xl border-t border-white/5 pb-safe">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {tabs.map(({ id, icon: Icon, label, highlight }) => {
          const isActive = activeTab === id;
          
          if (highlight) {
            return (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                className="relative -top-4 flex flex-col items-center justify-center touch-manipulation"
                aria-label={label}
              >
                <div className={cn(
                  "w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300",
                  "bg-primary shadow-lg shadow-primary/30",
                  isActive && "scale-110 shadow-primary/50"
                )}>
                  <Icon className="w-6 h-6 text-primary-foreground" strokeWidth={2.5} />
                </div>
              </button>
            );
          }

          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-2 px-3 min-w-[60px] transition-all duration-200 touch-manipulation",
                isActive ? "text-primary" : "text-zinc-500"
              )}
              aria-label={label}
            >
              <Icon 
                className={cn(
                  "w-5 h-5 transition-transform duration-200",
                  isActive && "scale-110"
                )} 
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className={cn(
                "text-[10px] font-medium transition-all",
                isActive && "text-primary"
              )}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

