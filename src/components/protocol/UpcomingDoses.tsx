import { format } from 'date-fns';
import { Calendar, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface UpcomingDosesProps {
  nextDoseDate: Date | null;
  lastDoseDate: Date | null;
  doseTime: string;
  onDoseTimeChange: (time: string) => void;
  onMarkTaken?: () => void;
  onSkip?: () => void;
}

export function UpcomingDoses({
  nextDoseDate,
  lastDoseDate,
  doseTime,
  onDoseTimeChange,
}: UpcomingDosesProps) {
  const isMissed = nextDoseDate && lastDoseDate && nextDoseDate < new Date() && 
    new Date(nextDoseDate).toDateString() !== new Date().toDateString();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-primary" />
        <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
          Upcoming Doses
        </span>
      </div>

      <div className="space-y-3">
        {/* Next Dose */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Next dose</p>
            {nextDoseDate ? (
              <p className="text-sm font-medium text-foreground">
                {format(nextDoseDate, 'EEEE, MMM d')}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">No schedule set</p>
            )}
          </div>
          <Input
            type="time"
            value={doseTime}
            onChange={(e) => onDoseTimeChange(e.target.value)}
            className="input-glass w-24 text-xs rounded-lg h-8"
          />
        </div>

        {/* Previous Dose */}
        <div>
          <p className="text-xs text-muted-foreground">Previous dose</p>
          {lastDoseDate ? (
            <p className="text-sm text-foreground/80">
              {format(lastDoseDate, 'EEEE, MMM d')}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">None logged</p>
          )}
        </div>

        {/* Missed Dose Warning */}
        {isMissed && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
            <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs text-destructive">You may have missed a dose.</p>
              <div className="flex gap-2">
                <button className="text-xs text-destructive/80 hover:text-destructive underline">
                  Mark taken
                </button>
                <span className="text-destructive/50">·</span>
                <button className="text-xs text-destructive/80 hover:text-destructive underline">
                  Skip
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
