import { useState } from 'react';
import { Input } from '@/components/ui/input';
import type { ScheduleMode } from '@/hooks/useProtocolState';

interface ScheduleSelectorProps {
  scheduleMode: ScheduleMode;
  weeklyDays: string[];
  intervalDays: number;
  customIntervalDays: number | null;
  onModeChange: (mode: ScheduleMode) => void;
  onWeeklyDaysChange: (days: string[]) => void;
  onIntervalDaysChange: (days: number) => void;
  onCustomIntervalChange: (days: number | null) => void;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const PRESET_INTERVALS = [1, 2, 3, 4, 5, 6, 7];

export function ScheduleSelector({
  scheduleMode,
  weeklyDays,
  intervalDays,
  customIntervalDays,
  onModeChange,
  onWeeklyDaysChange,
  onIntervalDaysChange,
  onCustomIntervalChange,
}: ScheduleSelectorProps) {
  const [showCustomInput, setShowCustomInput] = useState(customIntervalDays !== null);

  const toggleDay = (day: string) => {
    if (weeklyDays.includes(day)) {
      onWeeklyDaysChange(weeklyDays.filter((d) => d !== day));
    } else {
      onWeeklyDaysChange([...weeklyDays, day]);
    }
  };

  const selectInterval = (days: number | 'custom') => {
    if (days === 'custom') {
      setShowCustomInput(true);
      onCustomIntervalChange(90);
    } else {
      setShowCustomInput(false);
      onCustomIntervalChange(null);
      onIntervalDaysChange(days);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
          Dose Frequency
        </span>
      </div>

      {/* Mode Toggle */}
      <div className="inline-flex gap-1 p-1 rounded-full bg-muted/30 border border-border/50">
        <button
          onClick={() => onModeChange('weekly')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 min-w-[90px] ${
            scheduleMode === 'weekly'
              ? 'bg-primary text-primary-foreground shadow-lg'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Weekly
        </button>
        <button
          onClick={() => onModeChange('interval')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 min-w-[90px] ${
            scheduleMode === 'interval'
              ? 'bg-primary text-primary-foreground shadow-lg'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Interval
        </button>
      </div>

      {/* Button Grid - consistent layout for both modes */}
      <div className="space-y-3">
        <span className="text-sm text-muted-foreground block h-5">
          {scheduleMode === 'weekly' ? 'Select days' : 'Every X days'}
        </span>
        
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {scheduleMode === 'weekly' ? (
            <>
              {DAYS.map((day) => {
                const isActive = weeklyDays.includes(day);
                return (
                  <button
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={`pill-button text-center justify-center ${isActive ? 'active' : ''}`}
                  >
                    {day}
                  </button>
                );
              })}
            </>
          ) : (
            <>
              {PRESET_INTERVALS.map((days) => {
                const isActive = !showCustomInput && intervalDays === days;
                return (
                  <button
                    key={days}
                    onClick={() => selectInterval(days)}
                    className={`pill-button text-center justify-center ${isActive ? 'active' : ''}`}
                  >
                    {days}
                  </button>
                );
              })}
            </>
          )}
        </div>

        {/* Custom interval row - fixed height to prevent shift */}
        <div className="h-9 flex items-center">
          {scheduleMode === 'interval' && (
            showCustomInput ? (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={1}
                  max={365}
                  value={customIntervalDays || ''}
                  onChange={(e) => onCustomIntervalChange(parseInt(e.target.value) || null)}
                  className="input-glass w-20 text-center rounded-full h-9"
                />
                <span className="text-sm text-muted-foreground">days</span>
              </div>
            ) : (
              <button
                onClick={() => selectInterval('custom')}
                className="pill-button text-center justify-center px-4"
              >
                + Custom
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
