import { ProtocolCard } from '@/components/protocol/ProtocolCard';
import { useTheme } from '@/hooks/useTheme';

const Index = () => {
  const { aura1Color, aura2Color } = useTheme();
  
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background layers */}
      <div className="fixed inset-0 bg-vignette" />
      
      {/* Dual Aura Effects - Modern distinct glows */}
      <div 
        className="fixed top-[10%] left-[5%] w-80 h-80 rounded-full opacity-30 blur-[100px] pointer-events-none animate-pulse"
        style={{ 
          background: `radial-gradient(circle, ${aura1Color}, transparent 70%)`,
          animationDuration: '8s'
        }}
      />
      <div 
        className="fixed bottom-[15%] right-[10%] w-72 h-72 rounded-full opacity-25 blur-[80px] pointer-events-none animate-pulse"
        style={{ 
          background: `radial-gradient(circle, ${aura2Color}, transparent 70%)`,
          animationDuration: '10s',
          animationDelay: '2s'
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="py-6 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground tracking-tight glow-text">
              Protocol Tracker
            </h1>
            <p className="text-sm text-muted-foreground mt-1 font-light">
              One card. One protocol. Full control.
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-start md:items-center justify-center px-4 pb-8 pt-2">
          <ProtocolCard />
        </main>

        {/* Footer - subtle */}
        <footer className="py-4 text-center">
          <p className="text-xs text-muted-foreground/50">
            Stay consistent. Track progress. Optimize health.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
