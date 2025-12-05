import { ProtocolCard } from '@/components/protocol/ProtocolCard';
import { useTheme } from '@/hooks/useTheme';

const Index = () => {
  const { accentColor } = useTheme();

  return (
    <div className="min-h-screen bg-background relative">
      {/* Single accent aura glow */}
      <div 
        className="fixed top-[40%] left-1/2 -translate-x-1/2 w-[400px] sm:w-[500px] h-[300px] sm:h-[350px] rounded-full opacity-15 blur-[120px] pointer-events-none"
        style={{ background: accentColor }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="py-3 sm:py-5 px-4">
          <div className="max-w-md mx-auto text-center">
            <h1 className="font-heading text-xl sm:text-2xl font-bold text-foreground tracking-[0.2em] uppercase">
              Protocol
            </h1>
            <p className="text-[10px] text-muted-foreground/60 mt-0.5 tracking-[0.3em] uppercase">
              Track · Log · Optimize
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-start justify-center px-2 sm:px-4 pb-4">
          <ProtocolCard />
        </main>

        {/* Footer */}
        <footer className="py-2 text-center">
          <p className="text-[9px] text-muted-foreground/30 tracking-[0.25em] uppercase">
            Stay consistent
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
