import { FlaskConical, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

interface LabsSectionProps {
  labDate: Date | null;
  labTime: string;
  dpd: number | null;
  labReminderEnabled: boolean;
  labReminderOffsetDays: number;
  onLabDateChange: (date: Date | null) => void;
  onLabTimeChange: (time: string) => void;
  onLabReminderEnabledChange: (enabled: boolean) => void;
  onLabReminderOffsetChange: (days: number) => void;
}

const LAB_REMINDER_OPTIONS = [
  { value: 3, label: '3 days before' },
  { value: 7, label: '1 week before' },
  { value: 14, label: '2 weeks before' },
];

export function LabsSection({
  labDate,
  labTime,
  dpd,
  labReminderEnabled,
  labReminderOffsetDays,
  onLabDateChange,
  onLabTimeChange,
  onLabReminderEnabledChange,
  onLabReminderOffsetChange,
}: LabsSectionProps) {
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      onLabDateChange(new Date(value));
    } else {
      onLabDateChange(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <FlaskConical className="w-4 h-4 text-labs" />
        <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
          Lab Timing & DPD
        </span>
      </div>

      <div className="space-y-4">
        {/* Lab Date & Time */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Lab Date</label>
            <Input
              type="date"
              value={labDate ? format(labDate, 'yyyy-MM-dd') : ''}
              onChange={handleDateChange}
              className="input-glass rounded-lg h-9 text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Lab Time</label>
            <Input
              type="time"
              value={labTime}
              onChange={(e) => onLabTimeChange(e.target.value)}
              className="input-glass rounded-lg h-9 text-sm"
            />
          </div>
        </div>

        {/* DPD Display */}
        {dpd !== null && (
          <div className="animate-scale-in p-4 rounded-xl bg-labs/10 border border-labs/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-heading font-bold text-labs">{dpd} DPD</span>
              <span className="text-xs text-labs/80">(Days Post Dose)</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {dpd} DPD — this timing often gives a solid snapshot of your levels.
            </p>
          </div>
        )}

        {!labDate && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30 border border-border/50">
            <Info className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              DPD is how many days passed between your last dose and this lab draw. Set a lab date to calculate.
            </p>
          </div>
        )}

        {/* Lab Reminders */}
        <div className="pt-2 border-t border-border/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">Lab reminders</span>
            <Switch
              checked={labReminderEnabled}
              onCheckedChange={onLabReminderEnabledChange}
            />
          </div>

          {labReminderEnabled && (
            <div className="animate-fade-in space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Remind me</span>
                <Select
                  value={String(labReminderOffsetDays)}
                  onValueChange={(v) => onLabReminderOffsetChange(Number(v))}
                >
                  <SelectTrigger className="input-glass w-32 text-xs rounded-lg h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {LAB_REMINDER_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={String(opt.value)}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <p className="text-xs text-muted-foreground/70 italic">
                We'll remind you {labReminderOffsetDays === 7 ? '1 week' : `${labReminderOffsetDays} days`} before labs so you can stay consistent with dosing.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
