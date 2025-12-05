import { ProtocolCard } from '@/components/protocol/ProtocolCard';

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background layers */}
      <div className="fixed inset-0 bg-grid opacity-30" />
      <div className="fixed inset-0 bg-vignette" />
      
      {/* Ambient glow effects */}
      <div 
        className="fixed top-1/4 -left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, hsl(170 70% 42% / 0.3), transparent)' }}
      />
      <div 
        className="fixed bottom-1/4 -right-1/4 w-96 h-96 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, hsl(45 65% 50% / 0.3), transparent)' }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="py-6 px-4 text-center">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground tracking-tight glow-text">
            Protocol Tracker
          </h1>
          <p className="text-sm text-muted-foreground mt-1 font-light">
            One card. One protocol. Full control.
          </p>
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
