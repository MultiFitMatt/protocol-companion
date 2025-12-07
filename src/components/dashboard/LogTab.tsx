import { useState } from 'react';
import { Check, Syringe, MapPin, FileText, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { ProtocolState, DoseEntry } from '@/hooks/useProtocolState';

interface LogTabProps {
  state: ProtocolState;
  logDose: (entry: Omit<DoseEntry, 'date'>) => void;
  onComplete: () => void;
}

const UNITS = ['mL', 'mg', 'IU', 'mcg'];
const INJECTION_SITES = [
  { name: 'Deltoid', emoji: '💪' },
  { name: 'Ventrogluteal', emoji: '🦵' },
  { name: 'Dorsogluteal', emoji: '🍑' },
  { name: 'Subq abdomen', emoji: '🎯' },
  { name: 'Other', emoji: '📍' },
];

type Step = 'amount' | 'site' | 'notes' | 'confirm';

export function LogTab({ state, logDose, onComplete }: LogTabProps) {
  const [step, setStep] = useState<Step>('amount');
  const [amount, setAmount] = useState(state.lastDoseAmount || '');
  const [unit, setUnit] = useState(state.lastDoseUnit || 'mL');
  const [site, setSite] = useState(state.lastDoseSite || '');
  const [notes, setNotes] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = () => {
    logDose({
      amount: amount || undefined,
      unit: unit || undefined,
      site: site || undefined,
      notes: notes || undefined,
    });
    
    setShowSuccess(true);
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  if (showSuccess) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center py-6">
        <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mb-6 animate-scale-in">
          <Check className="w-10 h-10 text-primary-foreground" strokeWidth={3} />
        </div>
        <h2 className="text-2xl font-bold mb-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Dose Logged!
        </h2>
        <p className="text-zinc-500 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          Nice work staying consistent 💪
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {['amount', 'site', 'notes', 'confirm'].map((s, i) => (
          <div
            key={s}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              step === s 
                ? 'w-8 bg-amber-500' 
                : i < ['amount', 'site', 'notes', 'confirm'].indexOf(step)
                  ? 'w-4 bg-amber-500/50'
                  : 'w-4 bg-zinc-800'
            }`}
          />
        ))}
      </div>

      {/* Amount Step */}
      {step === 'amount' && (
        <div className="animate-fade-in">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Syringe className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Log Dose</h2>
            <p className="text-zinc-500">How much did you take?</p>
          </div>

          <div className="space-y-4">
            <div>
              <Input
                type="number"
                step="0.05"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="bg-zinc-900 border-zinc-700 text-white text-center text-4xl h-20 font-bold"
                autoFocus
              />
            </div>

            <div className="flex gap-2">
              {UNITS.map(u => (
                <button
                  key={u}
                  onClick={() => setUnit(u)}
                  className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                    unit === u
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>

            <Button
              onClick={() => setStep('site')}
              className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg rounded-xl mt-6"
            >
              Continue
              <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Site Step */}
      {step === 'site' && (
        <div className="animate-fade-in">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Injection Site</h2>
            <p className="text-zinc-500">Where did you inject?</p>
          </div>

          <div className="space-y-3">
            {INJECTION_SITES.map(({ name, emoji }) => (
              <button
                key={name}
                onClick={() => setSite(name)}
                className={`w-full p-4 rounded-xl flex items-center gap-4 transition-all ${
                  site === name
                    ? 'bg-primary/20 border-2 border-primary'
                    : 'bg-zinc-900 border-2 border-transparent hover:bg-zinc-800'
                }`}
              >
                <span className="text-2xl">{emoji}</span>
                <span className={`font-medium ${site === name ? 'text-white' : 'text-zinc-400'}`}>
                  {name}
                </span>
                {site === name && (
                  <Check className="w-5 h-5 text-primary ml-auto" />
                )}
              </button>
            ))}
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setStep('amount')}
              className="flex-1 h-14 border-zinc-700 text-zinc-400 hover:bg-zinc-800 rounded-xl"
            >
              Back
            </Button>
            <Button
              onClick={() => setStep('notes')}
              className="flex-1 h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl"
            >
              Continue
            </Button>
          </div>
        </div>
      )}

      {/* Notes Step */}
      {step === 'notes' && (
        <div className="animate-fade-in">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Any Notes?</h2>
            <p className="text-zinc-500">Optional: Add details about this dose</p>
          </div>

          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g., Took later than usual, slight bruising..."
            className="bg-zinc-900 border-zinc-700 text-white min-h-[120px] resize-none rounded-xl"
          />

          <div className="flex gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setStep('site')}
              className="flex-1 h-14 border-zinc-700 text-zinc-400 hover:bg-zinc-800 rounded-xl"
            >
              Back
            </Button>
            <Button
              onClick={() => setStep('confirm')}
              className="flex-1 h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl"
            >
              Review
            </Button>
          </div>
        </div>
      )}

      {/* Confirm Step */}
      {step === 'confirm' && (
        <div className="animate-fade-in">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Confirm Dose</h2>
            <p className="text-zinc-500">Review and submit</p>
          </div>

          <div className="rounded-2xl bg-zinc-900/80 p-6 border border-zinc-800/50 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-zinc-500">Amount</span>
              <span className="text-white font-medium">{amount || '—'} {unit}</span>
            </div>
            <div className="h-px bg-zinc-800" />
            <div className="flex justify-between items-center">
              <span className="text-zinc-500">Site</span>
              <span className="text-white font-medium">{site || '—'}</span>
            </div>
            {notes && (
              <>
                <div className="h-px bg-zinc-800" />
                <div>
                  <span className="text-zinc-500 text-sm">Notes</span>
                  <p className="text-white mt-1">{notes}</p>
                </div>
              </>
            )}
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setStep('notes')}
              className="flex-1 h-14 border-zinc-700 text-zinc-400 hover:bg-zinc-800 rounded-xl"
            >
              Back
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg rounded-xl"
            >
              <Check className="w-5 h-5 mr-2" />
              Log Dose
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

