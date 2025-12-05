import { ProtocolCard } from '@/components/protocol/ProtocolCard';
import { useTheme } from '@/hooks/useTheme';

const Index = () => {
  const { theme, aura1Color, aura2Color } = useTheme();
  
  // Determine aura colors based on theme modes
  const getAura1Display = () => {
    if (theme.primaryMode === 'color') return aura1Color;
    if (theme.secondaryMode === 'color') return aura1Color;
    return 'transparent';
  };
  
  const getAura2Display = () => {
    if (theme.secondaryMode === 'color') return aura2Color;
    if (theme.primaryMode === 'color') return aura2Color;
    return 'transparent';
  };

  const showAuras = theme.primaryMode === 'color' || theme.secondaryMode === 'color';
  
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background layers */}
      <div className="fixed inset-0 bg-vignette" />
      
      {/* Dual Aura Effects - Only show when color mode is active */}
      {showAuras && (
        <>
          <div 
            className="fixed top-[10%] left-[5%] w-96 h-96 rounded-full opacity-40 blur-[120px] pointer-events-none"
            style={{ 
              background: `radial-gradient(circle, ${getAura1Display()}, transparent 70%)`,
              animation: 'pulse 8s ease-in-out infinite'
            }}
          />
          <div 
            className="fixed bottom-[15%] right-[10%] w-80 h-80 rounded-full opacity-35 blur-[100px] pointer-events-none"
            style={{ 
              background: `radial-gradient(circle, ${getAura2Display()}, transparent 70%)`,
              animation: 'pulse 10s ease-in-out infinite 2s'
            }}
          />
        </>
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="py-3 sm:py-6 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight glow-text">
              Protocol Tracker
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 font-light">
              One card. One protocol. Full control.
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-start justify-center px-2 sm:px-4 pb-4 sm:pb-8 pt-1 sm:pt-2">
          <ProtocolCard />
        </main>

        {/* Footer - subtle */}
        <footer className="py-2 sm:py-4 text-center">
          <p className="text-xs text-muted-foreground/50">
            Stay consistent. Track progress. Optimize health.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
