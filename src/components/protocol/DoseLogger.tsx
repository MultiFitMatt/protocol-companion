import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, Syringe, X } from 'lucide-react';
import { format } from 'date-fns';
import type { DoseEntry } from '@/hooks/useProtocolState';

interface DoseLoggerProps {
  isTodayDoseDay: boolean;
  lastDoseDate: Date | null;
  lastDoseAmount: string | null;
  lastDoseSite: string | null;
  onLogDose: (entry: Omit<DoseEntry, 'date'>) => void;
}

const INJECTION_SITES = ['Deltoid', 'Ventrogluteal', 'Dorsogluteal', 'Subq abdomen', 'Other'];
const UNITS = ['mL', 'mg', 'IU', 'mcg'];

export function DoseLogger({
  isTodayDoseDay,
  lastDoseDate,
  lastDoseAmount,
  lastDoseSite,
  onLogDose,
}: DoseLoggerProps) {
  const [isLogging, setIsLogging] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [amount, setAmount] = useState('');
  const [unit, setUnit] = useState('mL');
  const [site, setSite] = useState('');
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    onLogDose({
      amount: amount || undefined,
      unit: unit || undefined,
      site: site || undefined,
      notes: notes || undefined,
    });
    setIsLogging(false);
    setShowSuccess(true);
    setAmount('');
    setNotes('');
    
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleCancel = () => {
    setIsLogging(false);
    setAmount('');
    setNotes('');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
          Today's Dose
        </span>
        {isTodayDoseDay && (
          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary/20 text-primary border border-primary/30">
            Dose scheduled today
          </span>
        )}
      </div>

      {/* Success State */}
      {showSuccess && (
        <div className="animate-scale-in flex items-center gap-3 p-4 rounded-lg bg-primary/10 border border-primary/30">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <Check className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Dose logged. Nice work staying consistent.</p>
          </div>
        </div>
      )}

      {/* Logging Form */}
      {isLogging && (
        <div className="animate-scale-in glass-overlay rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Log this dose</span>
            <button onClick={handleCancel} className="text-muted-foreground hover:text-foreground">
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">Amount</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input-glass rounded-lg h-9 flex-1"
                />
                <Select value={unit} onValueChange={setUnit}>
                  <SelectTrigger className="input-glass rounded-lg h-9 w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {UNITS.map((u) => (
                      <SelectItem key={u} value={u}>{u}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">Site</label>
              <Select value={site} onValueChange={setSite}>
                <SelectTrigger className="input-glass rounded-lg h-9">
                  <SelectValue placeholder="Select site" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {INJECTION_SITES.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Notes (optional)</label>
            <Input
              placeholder="e.g., took late, felt off"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input-glass rounded-lg h-9"
            />
          </div>

          <Button
            onClick={handleSave}
            className="w-full h-12 md:h-10 rounded-lg font-medium text-base md:text-sm"
          >
            <Check className="w-5 h-5 md:w-4 md:h-4 mr-2" />
            Save Dose
          </Button>
        </div>
      )}

      {/* Main Button & Last Dose */}
      {!isLogging && !showSuccess && (
        <div className="space-y-2">
          <Button
            onClick={() => setIsLogging(true)}
            size="lg"
            className="w-full h-11 sm:h-12 rounded-xl font-heading text-base font-semibold animate-glow-pulse"
          >
            <Syringe className="w-5 h-5 mr-2" />
            Confirm Dose Taken
          </Button>

          {lastDoseDate && (
            <p className="text-xs text-muted-foreground text-center">
              Last dose: {format(lastDoseDate, 'EEE')} • {lastDoseAmount || '—'} • {lastDoseSite || '—'}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
