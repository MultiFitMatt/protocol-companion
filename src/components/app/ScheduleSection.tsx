import { useState } from 'react';
import { ChevronDown, CalendarDays, Bell } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ProtocolState, ScheduleMode } from '@/hooks/useProtocolState';

interface ScheduleSectionProps {
  state: ProtocolState;
  updateState: (updates: Partial<ProtocolState>) => void;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const INTERVALS = ['2', '3', '4', '5', '6', '7', '—'];

export function ScheduleSection({ state, updateState }: ScheduleSectionProps) {
  const [isOpen, setIsOpen] = useState(true);

  const toggleWeekday = (day: string) => {
    const current = state.weeklyDays;
    const updated = current.includes(day)
      ? current.filter(d => d !== day)
      : [...current, day];
    updateState({ weeklyDays: updated });
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <button className="section-header group">
          <div className="flex items-center gap-3">
            <div className="section-icon">
              <CalendarDays className="w-4 h-4" />
            </div>
            <span className="section-title">Dose Frequency</span>
          </div>
          <ChevronDown className={`w-4 h-4 text-white/40 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="animate-accordion-down">
        <div className="section-content">
          {/* Mode Toggle */}
          <div className="flex items-center justify-center gap-1 p-1 elevated-inner rounded-xl" style={{ padding: '4px' }}>
            <button
              onClick={() => updateState({ scheduleMode: 'weekly' })}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg press-effect ${
                state.scheduleMode === 'weekly'
                  ? 'glass-button-primary'
                  : 'text-white/50 hover:text-white/80 transition-colors duration-150'
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => updateState({ scheduleMode: 'interval' })}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg press-effect ${
                state.scheduleMode === 'interval'
                  ? 'glass-button-primary'
                  : 'text-white/50 hover:text-white/80 transition-colors duration-150'
              }`}
            >
              Interval
            </button>
          </div>

          {/* Day/Interval Selector - Scrollable on mobile */}
          <div className="space-y-2">
            <label className="form-field-label">
              {state.scheduleMode === 'weekly' ? 'Select days' : 'Every X days'}
            </label>
            <div className="pill-scroll-container">
              {state.scheduleMode === 'weekly' ? (
                WEEKDAYS.map((day) => {
                  const isSelected = state.weeklyDays.includes(day);
                  return (
                    <button
                      key={day}
                      onClick={() => toggleWeekday(day)}
                      className={`day-pill ${isSelected ? 'active' : ''}`}
                    >
                      {day}
                    </button>
                  );
                })
              ) : (
                INTERVALS.map((interval, idx) => {
                  const value = idx < 6 ? idx + 2 : null;
                  const isCustom = interval === '—';
                  const isSelected = isCustom 
                    ? state.customIntervalDays !== null 
                    : state.intervalDays === value && !state.customIntervalDays;
                  return (
                    <button
                      key={interval}
                      onClick={() => {
                        if (isCustom) {
                          updateState({ customIntervalDays: state.customIntervalDays ? null : 10 });
                        } else if (value) {
                          updateState({ intervalDays: value, customIntervalDays: null });
                        }
                      }}
                      className={`day-pill ${isSelected ? 'active' : ''}`}
                    >
                      {isCustom ? (state.customIntervalDays || '—') : interval}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Reminders */}
          <div className="elevated-inner space-y-4">
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4 text-primary" />
              <span className="text-xs uppercase tracking-wider text-white/60">Reminders</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/90">Dose reminders</p>
                <p className="text-xs text-white/40">Get notified before dose days</p>
              </div>
              <Switch
                checked={state.doseReminderEnabled}
                onCheckedChange={(checked) => updateState({ doseReminderEnabled: checked })}
              />
            </div>

            {state.doseReminderEnabled && (
              <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                <span className="text-xs text-white/50">Remind me</span>
                <Select 
                  value={String(state.doseReminderOffsetDays)} 
                  onValueChange={(v) => updateState({ doseReminderOffsetDays: Number(v) })}
                >
                  <SelectTrigger className="glass-input h-9 w-auto">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-dropdown">
                    <SelectItem value="0" className="glass-dropdown-item">Same day</SelectItem>
                    <SelectItem value="1" className="glass-dropdown-item">1 day before</SelectItem>
                    <SelectItem value="2" className="glass-dropdown-item">2 days before</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <p className="text-[10px] text-white/30 italic">
              You'll get a nudge {state.doseReminderOffsetDays === 0 ? 'on' : `${state.doseReminderOffsetDays} day${state.doseReminderOffsetDays > 1 ? 's' : ''} before`} each dose.
            </p>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

