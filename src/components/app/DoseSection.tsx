import { useState } from 'react';
import { Check, Syringe, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, formatDistanceToNow } from 'date-fns';
import type { ProtocolState, DoseEntry } from '@/hooks/useProtocolState';

interface DoseSectionProps {
  state: ProtocolState;
  logDose: (entry: Omit<DoseEntry, 'date'>) => void;
  getNextDoseDate: () => Date | null;
  isTodayDoseDay: () => boolean;
}

const UNITS = ['mL', 'mg', 'IU', 'mcg'];
const INJECTION_SITES = ['Deltoid', 'Ventrogluteal', 'Dorsogluteal', 'Subq abdomen', 'Other'];

export function DoseSection({ state, logDose, getNextDoseDate, isTodayDoseDay }: DoseSectionProps) {
  const [isLogging, setIsLogging] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [amount, setAmount] = useState(state.lastDoseAmount || '');
  const [unit, setUnit] = useState(state.lastDoseUnit || 'mL');
  const [site, setSite] = useState(state.lastDoseSite || '');

  const nextDose = getNextDoseDate();
  const todayIsDoseDay = isTodayDoseDay();

  const handleLogDose = () => {
    logDose({
      amount: amount || undefined,
      unit: unit || undefined,
      site: site || undefined,
    });
    setIsLogging(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="elevated-section">
      <div className="flex items-center gap-3 mb-4">
        <div className="section-icon">
          <Syringe className="w-4 h-4" />
        </div>
        <span className="section-title">Today's Dose</span>
        {todayIsDoseDay && (
          <span className="ml-auto px-2.5 py-1 text-[10px] font-semibold rounded-full bg-primary/20 text-primary border border-primary/30 animate-pulse">
            Scheduled
          </span>
        )}
      </div>

      {/* Success State */}
      {showSuccess && (
        <div className="glass-success mb-4 animate-scale-in">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Check className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">Dose logged successfully</p>
            <p className="text-xs text-white/50">Nice work staying consistent!</p>
          </div>
        </div>
      )}

      {/* Logging Form */}
      {isLogging && !showSuccess && (
        <div className="elevated-inner mb-4 animate-scale-in space-y-4">
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="dose-amount" className="form-field-label">Amount</label>
              <div className="flex gap-2">
                <Input
                  id="dose-amount"
                  type="number"
                  step="0.05"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.0"
                  className="glass-input h-11 flex-1"
                  aria-label="Dose amount"
                />
                <Select value={unit} onValueChange={setUnit}>
                  <SelectTrigger className="glass-input h-11 w-20" aria-label="Dose unit">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-dropdown">
                    {UNITS.map((u) => (
                      <SelectItem key={u} value={u} className="glass-dropdown-item">{u}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="form-field">
              <label htmlFor="injection-site" className="form-field-label">Site</label>
              <Select value={site} onValueChange={setSite}>
                <SelectTrigger className="glass-input h-11" aria-label="Injection site">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="glass-dropdown">
                  {INJECTION_SITES.map((s) => (
                    <SelectItem key={s} value={s} className="glass-dropdown-item">{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="button-group">
            <Button
              variant="ghost"
              onClick={() => setIsLogging(false)}
              className="h-11 text-white/50 hover:text-white hover:bg-white/5 press-effect"
            >
              Cancel
            </Button>
            <Button
              onClick={handleLogDose}
              className="h-11 glass-button-primary press-effect"
            >
              <Check className="w-4 h-4 mr-2" />
              Save Dose
            </Button>
          </div>
        </div>
      )}

      {/* Main CTA Button */}
      {!isLogging && !showSuccess && (
        <Button
          onClick={() => setIsLogging(true)}
          className="w-full h-14 glass-button-primary text-base font-semibold press-effect"
        >
          <Syringe className="w-5 h-5 mr-2" />
          Confirm Dose Taken
        </Button>
      )}

      {/* Last Dose Info */}
      {state.lastDoseDate && !isLogging && !showSuccess && (
        <p className="text-xs text-white/40 text-center mt-3">
          Last dose: {format(state.lastDoseDate, 'EEE')} • {state.lastDoseAmount || '—'} • {state.lastDoseSite || '—'}
        </p>
      )}

      {/* Upcoming Doses Grid */}
      <div className="form-grid mt-4">
        <div className="stat-card">
          <div className="flex items-center gap-2 text-white/40 mb-3">
            <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="form-field-label text-nowrap">Upcoming Doses</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-responsive-sm text-white/50">Next dose</span>
              <span className="text-responsive-sm font-medium text-white text-right">
                {nextDose ? format(nextDose, 'EEE, MMM d') : '—'}
              </span>
            </div>
            {state.lastDoseDate && (
              <div className="flex items-center justify-between gap-2">
                <span className="text-responsive-sm text-white/50">Previous</span>
                <span className="text-responsive-sm text-white/70 text-right">
                  {format(state.lastDoseDate, 'EEE, MMM d')}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 text-white/40 mb-3">
            <Clock className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
            <label htmlFor="dose-time" className="form-field-label text-nowrap">Dose Time</label>
          </div>
          <Input
            id="dose-time"
            type="time"
            value={state.doseTime}
            onChange={(e) => {}}
            className="glass-input h-11 text-sm"
            aria-label="Scheduled dose time"
          />
        </div>
      </div>
    </div>
  );
}

