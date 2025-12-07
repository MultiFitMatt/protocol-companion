import { useState } from 'react';
import { useProtocolState } from '@/hooks/useProtocolState';
import { useAuth } from '@/Context/AuthContext';
import { useTheme } from '@/hooks/useTheme';
import { ProtocolSection } from '@/components/app/ProtocolSection';
import { DoseSection } from '@/components/app/DoseSection';
import { ScheduleSection } from '@/components/app/ScheduleSection';
import { LabsSection } from '@/components/app/LabsSection';
import { LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeSettings } from '@/components/protocol/ThemeSettings';

const Dashboard = () => {
  const { accentColor } = useTheme();
  const protocolState = useProtocolState();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-black relative overflow-x-hidden">
      {/* Floating Gradient Orbs - ClinRef Style */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Primary orb - top right */}
        <div 
          className="absolute w-[600px] h-[600px] rounded-full opacity-[0.12]"
          style={{ 
            background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`,
            filter: 'blur(100px)',
            top: '-200px',
            right: '-200px',
            animation: 'float-orb 20s ease-in-out infinite'
          }}
        />
        {/* Secondary orb - bottom left (cyan) */}
        <div 
          className="absolute w-[500px] h-[500px] rounded-full opacity-[0.12]"
          style={{ 
            background: 'radial-gradient(circle, #5de4ff 0%, transparent 70%)',
            filter: 'blur(100px)',
            bottom: '-150px',
            left: '-150px',
            animation: 'float-orb 20s ease-in-out infinite',
            animationDelay: '5s'
          }}
        />
        {/* Tertiary orb - center */}
        <div 
          className="absolute w-[400px] h-[400px] rounded-full opacity-[0.10]"
          style={{ 
            background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`,
            filter: 'blur(100px)',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            animation: 'float-orb-center 20s ease-in-out infinite',
            animationDelay: '10s'
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Minimal Top Navigation Header */}
        <header className="nav-header">
          <div className="nav-header-inner">
            {/* Branded Title */}
            <h1 className="nav-brand">
              <span className="nav-brand-accent">PRO</span>
              <span className="nav-brand-text">TOCOL</span>
            </h1>

            {/* Right-aligned actions */}
            <div className="flex items-center gap-1">
              <ThemeSettings />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => logout()}
                className="nav-icon-btn"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Gradient underline glow */}
          <div className="nav-glow" style={{ background: `linear-gradient(90deg, transparent 0%, ${accentColor}40 50%, transparent 100%)` }} />
        </header>

        {/* Main Glass Card */}
        <main className="flex-1 px-3 sm:px-4 lg:px-8 pb-8">
          <div className="max-w-2xl lg:max-w-3xl 2xl:max-w-4xl mx-auto">
            {/* The Elevated Panel Container */}
            <div className="elevated-panel animate-fade-in">
              {/* Protocol Setup */}
              <ProtocolSection {...protocolState} />

              {/* Dose Logging & Schedule */}
              <DoseSection {...protocolState} />

              {/* Schedule & Reminders */}
              <ScheduleSection {...protocolState} />

              {/* Labs & Biomarkers */}
              <LabsSection {...protocolState} />
            </div>

            {/* Footer */}
            <footer className="mt-6 text-center">
              <p className="text-[10px] text-white/20 tracking-[0.3em] uppercase">
                Stay consistent
              </p>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
