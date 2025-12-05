import { Bell } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface RemindersProps {
  doseReminderEnabled: boolean;
  doseReminderOffsetDays: number;
  onDoseReminderEnabledChange: (enabled: boolean) => void;
  onDoseReminderOffsetChange: (days: number) => void;
}

const REMINDER_OPTIONS = [
  { value: 0, label: 'Same day' },
  { value: 1, label: '1 day before' },
  { value: 2, label: '2 days before' },
];

export function Reminders({
  doseReminderEnabled,
  doseReminderOffsetDays,
  onDoseReminderEnabledChange,
  onDoseReminderOffsetChange,
}: RemindersProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Bell className="w-4 h-4" style={{ color: 'hsl(45, 65%, 50%)' }} />
        <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
          Reminders
        </span>
      </div>

      <div className="space-y-4">
        {/* Dose Reminders Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-foreground">Dose reminders</span>
          <Switch
            checked={doseReminderEnabled}
            onCheckedChange={onDoseReminderEnabledChange}
          />
        </div>

        {/* Reminder Timing */}
        {doseReminderEnabled && (
          <div className="animate-fade-in space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Remind me</span>
              <Select
                value={String(doseReminderOffsetDays)}
                onValueChange={(v) => onDoseReminderOffsetChange(Number(v))}
              >
                <SelectTrigger className="input-glass w-32 text-xs rounded-lg h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {REMINDER_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={String(opt.value)}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground/70 italic">
              You'll get a nudge {doseReminderOffsetDays === 0 ? 'on the day of' : `${doseReminderOffsetDays} day${doseReminderOffsetDays > 1 ? 's' : ''} before`} each dose.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
