import { format, formatDistanceToNow } from 'date-fns';
import { Calendar, Droplet, Activity, TrendingUp, Clock, Zap } from 'lucide-react';
import type { ProtocolState } from '@/hooks/useProtocolState';

interface HomeTabProps {
  state: ProtocolState;
  getNextDoseDate: () => Date | null;
  isTodayDoseDay: () => boolean;
  calculateDPD: () => number | null;
}

export function HomeTab({ state, getNextDoseDate, isTodayDoseDay }: HomeTabProps) {
  const nextDose = getNextDoseDate();
  const todayIsDoseDay = isTodayDoseDay();
  
  // Get latest lab result
  const latestLab = state.labResults
    .filter(r => r.biomarker === 'Total Testosterone')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  // Calculate streak (consecutive doses)
  const calculateStreak = () => {
    if (state.dosesHistory.length === 0) return 0;
    // Simplified streak calculation
    return Math.min(state.dosesHistory.length, 14);
  };

  const streak = calculateStreak();

  return (
    <div className="space-y-6 py-6">
      {/* Welcome Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-6 border border-primary/20">
        <div className="relative z-10">
          <p className="text-sm text-primary/80 mb-1">Welcome back</p>
          <h2 className="text-2xl font-bold mb-4">{state.protocolName}</h2>
          
          {todayIsDoseDay ? (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/20 border border-primary/30">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <p className="font-semibold text-white">Dose day!</p>
                <p className="text-sm text-primary/80">Don't forget to log your dose</p>
              </div>
            </div>
          ) : nextDose ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-zinc-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-400">Next dose</p>
                <p className="font-semibold text-white">{format(nextDose, 'EEEE, MMM d')}</p>
              </div>
            </div>
          ) : null}
        </div>
        
        {/* Decorative gradient */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/30 to-transparent rounded-full blur-2xl" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Streak */}
        <div className="rounded-2xl bg-zinc-900/80 p-4 border border-zinc-800/50">
          <div className="flex items-center gap-2 text-zinc-500 mb-3">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider">Streak</span>
          </div>
          <p className="text-3xl font-bold text-white">{streak}</p>
          <p className="text-xs text-zinc-500 mt-1">doses logged</p>
        </div>

        {/* Last T Level */}
        <div className="rounded-2xl bg-zinc-900/80 p-4 border border-zinc-800/50">
          <div className="flex items-center gap-2 text-zinc-500 mb-3">
            <Activity className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider">Last T</span>
          </div>
          {latestLab ? (
            <>
              <p className="text-3xl font-bold text-white">{latestLab.value}</p>
              <p className="text-xs text-zinc-500 mt-1">ng/dL • {latestLab.dpd !== null ? `${latestLab.dpd} DPD` : 'N/A'}</p>
            </>
          ) : (
            <>
              <p className="text-2xl font-bold text-zinc-600">—</p>
              <p className="text-xs text-zinc-500 mt-1">No labs yet</p>
            </>
          )}
        </div>

        {/* Last Dose */}
        <div className="rounded-2xl bg-zinc-900/80 p-4 border border-zinc-800/50">
          <div className="flex items-center gap-2 text-zinc-500 mb-3">
            <Droplet className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider">Last Dose</span>
          </div>
          {state.lastDoseDate ? (
            <>
              <p className="text-lg font-bold text-white">
                {formatDistanceToNow(state.lastDoseDate, { addSuffix: true })}
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                {state.lastDoseAmount} {state.lastDoseUnit} • {state.lastDoseSite}
              </p>
            </>
          ) : (
            <>
              <p className="text-2xl font-bold text-zinc-600">—</p>
              <p className="text-xs text-zinc-500 mt-1">No doses logged</p>
            </>
          )}
        </div>

        {/* Schedule */}
        <div className="rounded-2xl bg-zinc-900/80 p-4 border border-zinc-800/50">
          <div className="flex items-center gap-2 text-zinc-500 mb-3">
            <Clock className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider">Schedule</span>
          </div>
          <p className="text-lg font-bold text-white">
            {state.scheduleMode === 'weekly' 
              ? state.weeklyDays.join(', ')
              : `Every ${state.customIntervalDays || state.intervalDays} days`
            }
          </p>
          <p className="text-xs text-zinc-500 mt-1">at {state.doseTime}</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-2xl bg-zinc-900/80 p-4 border border-zinc-800/50">
        <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4">Recent Activity</h3>
        
        {state.dosesHistory.length > 0 ? (
          <div className="space-y-3">
              {state.dosesHistory
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 4)
              .map((dose, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <Droplet className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {dose.amount} {dose.unit} • {dose.site || 'Unknown site'}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {format(new Date(dose.date), 'MMM d, yyyy • h:mm a')}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <Droplet className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
            <p className="text-sm text-zinc-500">No doses logged yet</p>
            <p className="text-xs text-zinc-600">Tap the + button to log your first dose</p>
          </div>
        )}
      </div>
    </div>
  );
}

