import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceArea } from 'recharts';
import { Activity, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { format, subDays, isAfter } from 'date-fns';

export interface LabResult {
  id: string;
  date: Date;
  biomarker: string;
  value: number;
  unit: string;
  dpd: number | null;
  notes?: string;
}

interface BiomarkerTrackerProps {
  labResults: LabResult[];
  lastDoseDate: Date | null;
  onAddResult: (result: Omit<LabResult, 'id'>) => void;
  onDeleteResult: (id: string) => void;
}

const TIME_RANGES = [
  { label: '7D', days: 7 },
  { label: '30D', days: 30 },
  { label: '90D', days: 90 },
  { label: '1Y', days: 365 },
  { label: 'All', days: null },
] as const;

const REFERENCE_RANGE = { low: 300, high: 1000 };

type ViewMode = 'date' | 'dpd';

export function BiomarkerTracker({ labResults, lastDoseDate, onAddResult, onDeleteResult }: BiomarkerTrackerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<number | null>(90);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('date');
  
  // Form state
  const [formDate, setFormDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [formValue, setFormValue] = useState('');
  const [formNotes, setFormNotes] = useState('');

  const filteredResults = useMemo(() => {
    const ttResults = labResults.filter(r => r.biomarker === 'Total Testosterone');
    if (selectedRange === null) return ttResults;
    
    const cutoff = subDays(new Date(), selectedRange);
    return ttResults.filter(r => isAfter(new Date(r.date), cutoff));
  }, [labResults, selectedRange]);

  // Date-based chart data (chronological)
  const dateChartData = useMemo(() => {
    return filteredResults
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(r => ({
        date: format(new Date(r.date), 'MMM d'),
        value: r.value,
        dpd: r.dpd,
        fullDate: format(new Date(r.date), 'MMM d, yyyy'),
      }));
  }, [filteredResults]);

  // DPD-based chart data (grouped by DPD for normalization)
  const dpdChartData = useMemo(() => {
    const resultsWithDPD = filteredResults.filter(r => r.dpd !== null && r.dpd !== undefined);
    
    // Group by DPD and calculate average for each DPD value
    const dpdGroups = resultsWithDPD.reduce((acc, r) => {
      const dpd = r.dpd!;
      if (!acc[dpd]) {
        acc[dpd] = { values: [], dates: [] };
      }
      acc[dpd].values.push(r.value);
      acc[dpd].dates.push(format(new Date(r.date), 'MMM d, yyyy'));
      return acc;
    }, {} as Record<number, { values: number[], dates: string[] }>);

    return Object.entries(dpdGroups)
      .map(([dpd, data]) => ({
        dpd: Number(dpd),
        value: Math.round(data.values.reduce((a, b) => a + b, 0) / data.values.length),
        count: data.values.length,
        dates: data.dates,
        min: Math.min(...data.values),
        max: Math.max(...data.values),
      }))
      .sort((a, b) => a.dpd - b.dpd);
  }, [filteredResults]);

  const chartData = viewMode === 'date' ? dateChartData : dpdChartData;
  const hasValidDPDData = dpdChartData.length > 0;

  const calculateDPD = (labDate: Date): number | null => {
    if (!lastDoseDate) return null;
    const lab = new Date(labDate);
    lab.setHours(0, 0, 0, 0);
    const dose = new Date(lastDoseDate);
    dose.setHours(0, 0, 0, 0);
    if (dose > lab) return null;
    const diffTime = lab.getTime() - dose.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValue) return;
    
    const labDate = new Date(formDate);
    const dpd = calculateDPD(labDate);
    
    onAddResult({
      date: labDate,
      biomarker: 'Total Testosterone',
      value: Number(formValue),
      unit: 'ng/dL',
      dpd,
      notes: formNotes || undefined,
    });
    
    setFormValue('');
    setFormNotes('');
    setDialogOpen(false);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const data = payload[0].payload;
    
    if (viewMode === 'dpd') {
      return (
        <div className="glass-overlay rounded-lg p-3 text-sm">
          <p className="font-bold text-primary text-lg">{data.dpd} DPD</p>
          <p className="text-foreground font-medium">{data.value} ng/dL avg</p>
          {data.count > 1 && (
            <>
              <p className="text-muted-foreground text-xs">Range: {data.min}–{data.max}</p>
              <p className="text-muted-foreground text-xs">{data.count} samples</p>
            </>
          )}
        </div>
      );
    }
    
    return (
      <div className="glass-overlay rounded-lg p-3 text-sm">
        <p className="font-medium text-foreground">{data.fullDate}</p>
        <p className="text-primary font-bold">{data.value} ng/dL</p>
        {data.dpd !== null && (
          <p className="text-muted-foreground text-xs">{data.dpd} DPD</p>
        )}
      </div>
    );
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <button className="w-full flex items-center justify-between py-2 group">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
              Biomarker Tracking
            </span>
          </div>
          <ChevronDown 
            className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          />
        </button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="space-y-4 pt-2">
        {/* View Mode Toggle */}
        <div className="flex items-center justify-center gap-1 p-1 bg-muted/30 rounded-lg">
          <button
            onClick={() => setViewMode('date')}
            className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              viewMode === 'date'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            By Date
          </button>
          <button
            onClick={() => setViewMode('dpd')}
            disabled={!hasValidDPDData}
            className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              viewMode === 'dpd'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed'
            }`}
          >
            By DPD ✨
          </button>
        </div>

        {/* DPD View Explanation */}
        {viewMode === 'dpd' && (
          <div className="text-xs text-center text-muted-foreground bg-primary/5 border border-primary/20 rounded-lg p-2">
            <span className="text-primary font-medium">DPD Normalization</span> — Values grouped by days post dose for accurate protocol comparison
          </div>
        )}

        {/* Time Range Selector */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {TIME_RANGES.map((range) => (
              <button
                key={range.label}
                onClick={() => setSelectedRange(range.days)}
                className={`px-2 py-1 text-xs rounded-md transition-all ${
                  selectedRange === range.days
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                <Plus className="w-3 h-3" />
                Add Result
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-overlay sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="font-heading">Log Lab Result</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground">Lab Date</label>
                  <Input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="input-glass"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground">Total Testosterone (ng/dL)</label>
                  <Input
                    type="number"
                    value={formValue}
                    onChange={(e) => setFormValue(e.target.value)}
                    placeholder="e.g. 650"
                    className="input-glass"
                    required
                    min="0"
                    max="3000"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground">Notes (optional)</label>
                  <Input
                    type="text"
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    placeholder="e.g. Fasted, morning draw"
                    className="input-glass"
                  />
                </div>
                {formDate && lastDoseDate && (
                  <div className="text-xs text-muted-foreground p-2 bg-muted/30 rounded-lg">
                    DPD will be calculated: <span className="text-primary font-medium">
                      {calculateDPD(new Date(formDate)) ?? 'N/A'} days post dose
                    </span>
                  </div>
                )}
                <Button type="submit" className="w-full">
                  Save Result
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Chart */}
        {chartData.length > 0 ? (
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                {/* Reference Range */}
                <ReferenceArea 
                  y1={REFERENCE_RANGE.low} 
                  y2={REFERENCE_RANGE.high} 
                  fill="hsl(var(--primary))" 
                  fillOpacity={0.1}
                />
                <ReferenceLine 
                  y={REFERENCE_RANGE.low} 
                  stroke="hsl(var(--muted-foreground))" 
                  strokeDasharray="3 3" 
                  strokeOpacity={0.5}
                />
                <ReferenceLine 
                  y={REFERENCE_RANGE.high} 
                  stroke="hsl(var(--muted-foreground))" 
                  strokeDasharray="3 3" 
                  strokeOpacity={0.5}
                />
                
                <XAxis 
                  dataKey={viewMode === 'dpd' ? 'dpd' : 'date'} 
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  tickLine={false}
                  tickFormatter={viewMode === 'dpd' ? (value) => `${value}d` : undefined}
                  label={viewMode === 'dpd' ? { value: 'Days Post Dose', position: 'insideBottom', offset: -5, fontSize: 9, fill: 'hsl(var(--muted-foreground))' } : undefined}
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  tickLine={false}
                  domain={['auto', 'auto']}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-32 flex items-center justify-center text-sm text-muted-foreground border border-dashed border-border rounded-lg">
            No lab results yet. Add your first result to start tracking.
          </div>
        )}

        {/* Reference Range Legend */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-primary/20 border border-primary/30" />
            <span>Reference: {REFERENCE_RANGE.low}–{REFERENCE_RANGE.high} ng/dL</span>
          </div>
        </div>

        {/* Recent Results List */}
        {filteredResults.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-border/30">
            <span className="text-xs text-muted-foreground">Recent Results</span>
            <div className="space-y-1.5 max-h-32 overflow-y-auto">
              {filteredResults
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 5)
                .map((result) => (
                  <div 
                    key={result.id} 
                    className="flex items-center justify-between p-2 rounded-lg bg-muted/30 text-sm group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground text-xs">
                        {format(new Date(result.date), 'MMM d, yyyy')}
                      </span>
                      <span className="font-medium text-foreground">{result.value} ng/dL</span>
                      {result.dpd !== null && (
                        <span className="text-xs text-primary">{result.dpd} DPD</span>
                      )}
                    </div>
                    <button
                      onClick={() => onDeleteResult(result.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-destructive/20 rounded"
                    >
                      <X className="w-3 h-3 text-muted-foreground" />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}