import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { MedType } from '@/hooks/useProtocolState';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ProtocolHeaderProps {
  protocolName: string;
  medType: MedType;
  onNameChange: (name: string) => void;
  onMedTypeChange: (type: MedType) => void;
}

const MED_TYPES: MedType[] = ['Injection', 'Oral', 'Patch', 'Pellet', 'GLP-1', 'Other'];

export function ProtocolHeader({
  protocolName,
  medType,
  onNameChange,
  onMedTypeChange,
}: ProtocolHeaderProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
          What is your protocol?
        </span>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-muted-foreground hover:text-foreground transition-colors p-1"
        >
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      <div 
        className={`transition-all duration-300 overflow-hidden ${
          isExpanded ? 'max-h-40 opacity-100' : 'max-h-12 opacity-100'
        }`}
      >
        {isExpanded ? (
          <div className="space-y-3 animate-fade-in">
            <Input
              value={protocolName}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Protocol name"
              className="input-glass rounded-full px-4 h-10 text-sm"
            />
            <Select value={medType} onValueChange={(v) => onMedTypeChange(v as MedType)}>
              <SelectTrigger className="input-glass rounded-full px-4 h-10 text-sm">
                <SelectValue placeholder="Medication type" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {MED_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <button
            onClick={() => setIsExpanded(true)}
            className="w-full text-left px-4 py-2.5 rounded-full bg-muted/30 border border-border/50 hover:border-primary/30 transition-all"
          >
            <span className="font-heading text-lg font-semibold text-foreground">
              {protocolName}
            </span>
            <span className="ml-2 text-xs text-muted-foreground">
              ({medType})
            </span>
          </button>
        )}
      </div>

      <p className="text-xs text-muted-foreground/70 italic">
        Keep it simple. You can still use this for complex protocols.
      </p>
    </div>
  );
}
