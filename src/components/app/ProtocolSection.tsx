import { useState } from 'react';
import { ChevronDown, Pill } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import type { ProtocolState, MedType } from '@/hooks/useProtocolState';

interface ProtocolSectionProps {
  state: ProtocolState;
  updateState: (updates: Partial<ProtocolState>) => void;
}

const MED_TYPES: MedType[] = ['Injection', 'Oral', 'Patch', 'Pellet', 'Other'];

export function ProtocolSection({ state, updateState }: ProtocolSectionProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <button className="section-header group" aria-label="Toggle protocol section" aria-expanded={isOpen}>
          <div className="flex items-center gap-3">
            <div className="section-icon">
              <Pill className="w-4 h-4" />
            </div>
            <span className="section-title">What is your protocol?</span>
          </div>
          <ChevronDown className={`w-4 h-4 text-white/40 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
        </button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="animate-accordion-down">
        <div className="section-content space-y-4">
          {/* Protocol Name */}
          <div className="form-field">
            <label htmlFor="protocol-name" className="sr-only">Protocol name</label>
            <Input
              id="protocol-name"
              value={state.protocolName}
              onChange={(e) => updateState({ protocolName: e.target.value })}
              placeholder="e.g., Testosterone cypionate IM"
              className="glass-input h-12 text-base"
              aria-label="Protocol name"
            />
          </div>

          {/* Med Type */}
          <div className="form-field">
            <label htmlFor="med-type" className="sr-only">Medication type</label>
            <Select 
              value={state.medType} 
              onValueChange={(value: MedType) => updateState({ medType: value })}
            >
              <SelectTrigger className="glass-input h-12" aria-label="Medication type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="glass-dropdown">
                {MED_TYPES.map((type) => (
                  <SelectItem key={type} value={type} className="glass-dropdown-item">
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <p className="text-xs text-white/30 italic">
            Keep it simple. You can still use this for complex protocols.
          </p>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

