import { useState } from 'react';
import { Calendar, Clock, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import type { ProtocolState, ScheduleMode } from '@/hooks/useProtocolState';

interface ScheduleTabProps {
  state: ProtocolState;
  updateState: (updates: Partial<ProtocolState>) => void;
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const INTERVALS = [
  { label: 'Every 2 days', value: 2 },
  { label: 'Every 3 days', value: 3 },
  { label: 'Every 3.5 days', value: 3.5 },
  { label: 'Every 5 days', value: 5 },
  { label: 'Every 7 days', value: 7 },
  { label: 'Every 10 days', value: 10 },
  { label: 'Every 14 days', value: 14 },
];

export function ScheduleTab({ state, updateState }: ScheduleTabProps) {
  const [showCustomInterval, setShowCustomInterval] = useState(false);

  const toggleWeekday = (day: string) => {
    const current = state.weeklyDays;
    const updated = current.includes(day)
      ? current.filter(d => d !== day)
      : [...current, day];
    updateState({ weeklyDays: updated });
  };

  return (
    <div className="space-y-6 py-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Schedule</h2>
        <p className="text-zinc-500">Configure your dosing schedule</p>
      </div>

      {/* Schedule Mode Toggle */}
      <div className="rounded-2xl bg-zinc-900/80 p-4 border border-zinc-800/50">
        <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4">Schedule Type</h3>
        
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => updateState({ scheduleMode: 'weekly' })}
            className={`p-4 rounded-xl border-2 transition-all ${
              state.scheduleMode === 'weekly'
                ? 'border-primary bg-primary/10'
                : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
            }`}
          >
            <Calendar className={`w-6 h-6 mb-2 ${state.scheduleMode === 'weekly' ? 'text-primary' : 'text-zinc-500'}`} />
            <p className={`font-medium ${state.scheduleMode === 'weekly' ? 'text-white' : 'text-zinc-400'}`}>Weekly</p>
            <p className="text-xs text-zinc-500 mt-1">Fixed days each week</p>
          </button>
          
          <button
            onClick={() => updateState({ scheduleMode: 'interval' })}
            className={`p-4 rounded-xl border-2 transition-all ${
              state.scheduleMode === 'interval'
                ? 'border-primary bg-primary/10'
                : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
            }`}
          >
            <Clock className={`w-6 h-6 mb-2 ${state.scheduleMode === 'interval' ? 'text-primary' : 'text-zinc-500'}`} />
            <p className={`font-medium ${state.scheduleMode === 'interval' ? 'text-white' : 'text-zinc-400'}`}>Interval</p>
            <p className="text-xs text-zinc-500 mt-1">Every X days</p>
          </button>
        </div>
      </div>

      {/* Weekly Days Selector */}
      {state.scheduleMode === 'weekly' && (
        <div className="rounded-2xl bg-zinc-900/80 p-4 border border-zinc-800/50">
          <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4">Dose Days</h3>
          
          <div className="flex flex-wrap gap-2">
            {WEEKDAYS.map(day => {
              const isSelected = state.weeklyDays.includes(day);
              return (
                <button
                  key={day}
                  onClick={() => toggleWeekday(day)}
                  className={`w-12 h-12 rounded-full font-medium text-sm transition-all ${
                    isSelected
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
          
          {state.weeklyDays.length === 0 && (
            <p className="text-xs text-primary mt-3">Select at least one day</p>
          )}
        </div>
      )}

      {/* Interval Selector */}
      {state.scheduleMode === 'interval' && (
        <div className="rounded-2xl bg-zinc-900/80 p-4 border border-zinc-800/50">
          <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4">Interval</h3>
          
          <div className="space-y-2">
            {INTERVALS.map(({ label, value }) => {
              const isSelected = state.intervalDays === value && !state.customIntervalDays;
              return (
                <button
                  key={value}
                  onClick={() => updateState({ intervalDays: value, customIntervalDays: null })}
                  className={`w-full p-3 rounded-xl flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-primary/20 border border-primary/30'
                      : 'bg-zinc-800/50 border border-transparent hover:bg-zinc-800'
                  }`}
                >
                  <span className={isSelected ? 'text-white font-medium' : 'text-zinc-400'}>{label}</span>
                  {isSelected && <Check className="w-5 h-5 text-primary" />}
                </button>
              );
            })}
            
            {/* Custom Interval */}
            <button
              onClick={() => setShowCustomInterval(!showCustomInterval)}
              className={`w-full p-3 rounded-xl flex items-center justify-between transition-all ${
                state.customIntervalDays
                  ? 'bg-primary/20 border border-primary/30'
                  : 'bg-zinc-800/50 border border-transparent hover:bg-zinc-800'
              }`}
            >
              <span className={state.customIntervalDays ? 'text-white font-medium' : 'text-zinc-400'}>
                Custom interval
                {state.customIntervalDays && ` (${state.customIntervalDays} days)`}
              </span>
              {state.customIntervalDays && <Check className="w-5 h-5 text-primary" />}
            </button>
            
            {showCustomInterval && (
              <div className="p-3 bg-zinc-800/50 rounded-xl">
                <label className="text-xs text-zinc-500 block mb-2">Days between doses</label>
                <Input
                  type="number"
                  min="1"
                  max="60"
                  value={state.customIntervalDays || ''}
                  onChange={(e) => updateState({ customIntervalDays: Number(e.target.value) || null })}
                  className="bg-zinc-900 border-zinc-700 text-white"
                  placeholder="Enter days"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dose Time */}
      <div className="rounded-2xl bg-zinc-900/80 p-4 border border-zinc-800/50">
        <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4">Preferred Dose Time</h3>
        
        <Input
          type="time"
          value={state.doseTime}
          onChange={(e) => updateState({ doseTime: e.target.value })}
          className="bg-zinc-900 border-zinc-700 text-white text-lg h-12"
        />
      </div>

      {/* Reminder Settings */}
      <div className="rounded-2xl bg-zinc-900/80 p-4 border border-zinc-800/50">
        <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4">Reminders</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-white">Dose Reminders</p>
              <p className="text-xs text-zinc-500">Get notified before dose days</p>
            </div>
            <Switch
              checked={state.doseReminderEnabled}
              onCheckedChange={(checked) => updateState({ doseReminderEnabled: checked })}
            />
          </div>
          
          {state.doseReminderEnabled && (
            <div className="pl-4 border-l-2 border-primary/30">
              <label className="text-xs text-zinc-500 block mb-2">Remind me</label>
              <div className="flex gap-2">
                {[0, 1, 2].map(days => (
                  <button
                    key={days}
                    onClick={() => updateState({ doseReminderOffsetDays: days })}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                      state.doseReminderOffsetDays === days
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {days === 0 ? 'Same day' : `${days} day${days > 1 ? 's' : ''} before`}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

