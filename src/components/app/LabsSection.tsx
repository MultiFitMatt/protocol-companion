import { useState, useMemo } from 'react';
import { ChevronDown, Activity, Plus, FlaskConical, Target, Droplets, AlertTriangle, Bell, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceArea, ComposedChart, Area } from 'recharts';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, subDays, isAfter, differenceInDays, differenceInHours } from 'date-fns';
import type { ProtocolState, LabResult, LabPrepSettings } from '@/hooks/useProtocolState';

interface LabsSectionProps {
  state: ProtocolState;
  updateState: (updates: Partial<ProtocolState>) => void;
  addLabResult: (result: Omit<LabResult, 'id'>) => void;
  deleteLabResult: (id: string) => void;
}

const TIME_RANGES = [
  { label: '7D', days: 7 },
  { label: '30D', days: 30 },
  { label: '90D', days: 90 },
  { label: '1Y', days: 365 },
  { label: 'All', days: null },
];

const REFERENCE_RANGE = { low: 300, high: 1000 };

const calculateStdDev = (values: number[]): number => {
  if (values.length < 2) return 0;
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const squareDiffs = values.map(v => Math.pow(v - avg, 2));
  return Math.sqrt(squareDiffs.reduce((a, b) => a + b, 0) / values.length);
};

export function LabsSection({ state, updateState, addLabResult, deleteLabResult }: LabsSectionProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedRange, setSelectedRange] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'date' | 'dpd'>('date');
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Form state
  const [formDate, setFormDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [formValue, setFormValue] = useState('');
  const [formNotes, setFormNotes] = useState('');

  const filteredResults = useMemo(() => {
    const ttResults = state.labResults.filter(r => r.biomarker === 'Total Testosterone');
    if (selectedRange === null) return ttResults;
    const cutoff = subDays(new Date(), selectedRange);
    return ttResults.filter(r => isAfter(new Date(r.date), cutoff));
  }, [state.labResults, selectedRange]);

  const chartData = useMemo(() => {
    if (viewMode === 'dpd') {
      const resultsWithDPD = filteredResults.filter(r => r.dpd !== null);
      const dpdGroups = resultsWithDPD.reduce((acc, r) => {
        const dpd = r.dpd!;
        if (!acc[dpd]) acc[dpd] = [];
        acc[dpd].push(r.value);
        return acc;
      }, {} as Record<number, number[]>);

      return Object.entries(dpdGroups)
        .map(([dpd, values]) => {
          const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
          const min = Math.min(...values);
          const max = Math.max(...values);
          const stdDev = calculateStdDev(values);
          return {
            dpd: Number(dpd),
            value: avg,
            min,
            max,
            stdDev: Math.round(stdDev),
            count: values.length,
            errorY: values.length > 1 ? [avg - min, max - avg] : [0, 0],
          };
        })
        .sort((a, b) => a.dpd - b.dpd);
    }

    return filteredResults
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(r => ({
        date: format(new Date(r.date), 'MMM d'),
        value: r.value,
        dpd: r.dpd,
        fullDate: format(new Date(r.date), 'MMM d, yyyy'),
      }));
  }, [filteredResults, viewMode]);

  const dpdStats = useMemo(() => {
    if (viewMode !== 'dpd' || chartData.length === 0) return null;
    const avgStdDev = chartData.reduce((acc, d) => acc + (d.stdDev || 0), 0) / chartData.length;
    let tightness: 'tight' | 'moderate' | 'wide' = 'tight';
    if (avgStdDev > 100) tightness = 'wide';
    else if (avgStdDev > 50) tightness = 'moderate';
    return { avgStdDev: Math.round(avgStdDev), tightness };
  }, [chartData, viewMode]);

  const calculateDPD = (labDate: Date): number | null => {
    if (!state.lastDoseDate) return null;
    const lab = new Date(labDate);
    lab.setHours(0, 0, 0, 0);
    const dose = new Date(state.lastDoseDate);
    dose.setHours(0, 0, 0, 0);
    if (dose > lab) return null;
    return Math.floor((lab.getTime() - dose.getTime()) / (1000 * 60 * 60 * 24));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValue) return;
    const labDate = new Date(formDate);
    addLabResult({
      date: labDate,
      biomarker: 'Total Testosterone',
      value: Number(formValue),
      unit: 'ng/dL',
      dpd: calculateDPD(labDate),
      notes: formNotes || undefined,
    });
    setFormValue('');
    setFormNotes('');
    setDialogOpen(false);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const data = payload[0].payload;
    
    return (
      <div className="glass-tooltip">
        {viewMode === 'dpd' ? (
          <>
            <p className="font-bold text-primary">{data.dpd} DPD</p>
            <p className="text-white text-lg font-semibold">{data.value} ng/dL</p>
            {data.count > 1 && (
              <div className="mt-2 pt-2 border-t border-white/10 space-y-1 text-xs">
                <p className="text-white/50">Range: <span className="text-white">{data.min}–{data.max}</span></p>
                <p className="text-white/50">Spread: <span className={data.stdDev < 50 ? 'text-green-400' : data.stdDev < 100 ? 'text-yellow-400' : 'text-red-400'}>±{data.stdDev}</span></p>
                <p className="text-white/40">{data.count} samples</p>
              </div>
            )}
          </>
        ) : (
          <>
            <p className="text-white/50 text-sm">{data.fullDate}</p>
            <p className="font-bold text-white">{data.value} ng/dL</p>
            {data.dpd !== null && <p className="text-xs text-primary">{data.dpd} DPD</p>}
          </>
        )}
      </div>
    );
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <button className="section-header group" aria-label="Toggle biomarker tracking section" aria-expanded={isOpen}>
          <div className="flex items-center gap-3">
            <div className="section-icon">
              <Activity className="w-4 h-4" />
            </div>
            <span className="section-title">Biomarker Tracking</span>
          </div>
          <ChevronDown className={`w-4 h-4 text-white/40 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
        </button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="animate-accordion-down">
        <div className="section-content">
          {/* Lab Timing */}
          <div className="elevated-inner space-y-4">
            <div className="flex items-center gap-3">
              <FlaskConical className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="form-field-label text-white/60">Lab Timing & DPD</span>
            </div>
            
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="lab-date" className="form-field-label">Lab Date</label>
                <Input
                  id="lab-date"
                  type="date"
                  value={state.labDate ? format(state.labDate, 'yyyy-MM-dd') : ''}
                  onChange={(e) => updateState({ labDate: e.target.value ? new Date(e.target.value) : null })}
                  className="glass-input h-11"
                  aria-label="Lab draw date"
                />
              </div>
              <div className="form-field">
                <label htmlFor="lab-time" className="form-field-label">Lab Time</label>
                <Input
                  id="lab-time"
                  type="time"
                  value={state.labTime}
                  onChange={(e) => updateState({ labTime: e.target.value })}
                  className="glass-input h-11"
                  aria-label="Lab draw time"
                />
              </div>
            </div>

            <p className="text-responsive-xs text-white/30 flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-white/5 flex items-center justify-center text-[8px] flex-shrink-0 mt-0.5">?</span>
              <span>DPD is how many days passed between your last dose and this lab draw. Set a lab date to calculate.</span>
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <div>
                <p className="text-sm text-white/90">Lab Prep Assistant</p>
                <p className="text-xs text-white/40">Reminders to prepare for accurate labs</p>
              </div>
              <Switch
                checked={state.labReminderEnabled}
                onCheckedChange={(checked) => updateState({ labReminderEnabled: checked })}
                aria-label="Toggle lab prep assistant"
              />
            </div>

            {state.labReminderEnabled && (
              <div className="space-y-4 pt-2 pl-3 border-l-2 border-primary/20">
                {/* Lab Date Reminders */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-primary font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Lab Date Reminders</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/60">Reminder 2 weeks before</span>
                    <Switch
                      checked={state.labReminder2WeeksEnabled ?? true}
                      onCheckedChange={(checked) => updateState({ labReminder2WeeksEnabled: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/60">Reminder 1 week before</span>
                    <Switch
                      checked={state.labReminder1WeekEnabled ?? true}
                      onCheckedChange={(checked) => updateState({ labReminder1WeekEnabled: checked })}
                    />
                  </div>
                </div>

                {/* Hydration Reminders */}
                <div className="space-y-3 pt-3 border-t border-white/5">
                  <div className="flex items-center gap-2 text-xs text-cyan-400 font-medium">
                    <Droplets className="w-3.5 h-3.5" />
                    <span>Hydration Reminders</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-white/60">Daily hydration prompts</span>
                      <p className="text-[10px] text-white/30">Late morning & early evening</p>
                    </div>
                    <Switch
                      checked={state.labPrepSettings?.hydrationRemindersEnabled ?? true}
                      onCheckedChange={(checked) => updateState({ 
                        labPrepSettings: { 
                          ...state.labPrepSettings, 
                          hydrationRemindersEnabled: checked 
                        } 
                      })}
                    />
                  </div>
                  
                  {state.labPrepSettings?.hydrationRemindersEnabled && (
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-white/50">Start</span>
                      <Select 
                        value={String(state.labPrepSettings?.hydrationDaysBefore ?? 7)} 
                        onValueChange={(v) => updateState({ 
                          labPrepSettings: { 
                            ...state.labPrepSettings, 
                            hydrationDaysBefore: Number(v) 
                          } 
                        })}
                      >
                        <SelectTrigger className="glass-input h-8 w-auto text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="glass-dropdown">
                          <SelectItem value="3" className="glass-dropdown-item">3 days before</SelectItem>
                          <SelectItem value="5" className="glass-dropdown-item">5 days before</SelectItem>
                          <SelectItem value="7" className="glass-dropdown-item">7 days before</SelectItem>
                          <SelectItem value="10" className="glass-dropdown-item">10 days before</SelectItem>
                        </SelectContent>
                      </Select>
                      <span className="text-xs text-white/50">lab draw</span>
                    </div>
                  )}
                </div>

                {/* 48-Hour Dose Warning */}
                <div className="space-y-3 pt-3 border-t border-white/5">
                  <div className="flex items-center gap-2 text-xs text-amber-400 font-medium">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Dose Timing Alert</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-white/60">48-hour dosing warning</span>
                      <p className="text-[10px] text-white/30">Avoid dosing within 48h of lab draw</p>
                    </div>
                    <Switch
                      checked={state.labPrepSettings?.doseWarning48hrEnabled ?? true}
                      onCheckedChange={(checked) => updateState({ 
                        labPrepSettings: { 
                          ...state.labPrepSettings, 
                          doseWarning48hrEnabled: checked 
                        } 
                      })}
                    />
                  </div>
                  
                  <p className="text-[10px] text-white/25 italic leading-relaxed">
                    Some patients are still metabolizing the medication 48 hours after injection, which may affect lab accuracy. Consider timing your dose accordingly.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* View Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 p-1 elevated-inner rounded-lg" style={{ padding: '4px' }}>
              <button
                onClick={() => setViewMode('date')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md press-effect ${
                  viewMode === 'date' ? 'glass-button-primary' : 'text-white/50 hover:text-white/80 transition-colors duration-150'
                }`}
                aria-label="View labs by date"
                aria-pressed={viewMode === 'date'}
              >
                By Date
              </button>
              <button
                onClick={() => setViewMode('dpd')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md press-effect ${
                  viewMode === 'dpd' ? 'glass-button-primary' : 'text-white/50 hover:text-white/80 transition-colors duration-150'
                }`}
                aria-label="View labs by days post dose"
                aria-pressed={viewMode === 'dpd'}
              >
                By DPD ✨
              </button>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="glass-button-outline h-8 text-xs press-effect">
                  <Plus className="w-3 h-3 mr-1" />
                  Add Result
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-modal">
                <DialogHeader>
                  <DialogTitle className="text-white">Log Lab Result</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                  <div>
                    <label htmlFor="form-lab-date" className="text-xs text-white/50 block mb-2">Lab Date</label>
                    <Input id="form-lab-date" type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} className="glass-input" required aria-label="Lab result date" />
                  </div>
                  <div>
                    <label htmlFor="form-testosterone" className="text-xs text-white/50 block mb-2">Total Testosterone (ng/dL)</label>
                    <Input id="form-testosterone" type="number" value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="e.g. 650" className="glass-input" required aria-label="Testosterone value in ng/dL" />
                  </div>
                  <div>
                    <label htmlFor="form-notes" className="text-xs text-white/50 block mb-2">Notes (optional)</label>
                    <Input id="form-notes" value={formNotes} onChange={(e) => setFormNotes(e.target.value)} placeholder="e.g. Fasted, morning draw" className="glass-input" aria-label="Lab result notes" />
                  </div>
                  {formDate && state.lastDoseDate && (
                    <div className="text-xs p-3 stat-card text-primary">
                      DPD: {calculateDPD(new Date(formDate)) ?? 'N/A'} days post dose
                    </div>
                  )}
                  <Button type="submit" className="w-full glass-button-primary press-effect">Save Result</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* DPD Explanation */}
          {viewMode === 'dpd' && (
            <div className="text-xs text-center text-white/40 elevated-inner rounded-lg" style={{ padding: '8px 12px' }}>
              <span className="text-primary font-medium">DPD Normalization</span> — Values grouped by days post dose for accurate protocol comparison
            </div>
          )}

          {/* Time Range Pills */}
          <div className="flex gap-2">
            {TIME_RANGES.map((range) => (
              <button
                key={range.label}
                onClick={() => setSelectedRange(range.days)}
                className={`time-range-pill ${selectedRange === range.days ? 'active' : ''}`}
                aria-label={`Show ${range.days ? `last ${range.days} days` : 'all time'}`}
                aria-pressed={selectedRange === range.days}
              >
                {range.label}
              </button>
            ))}
          </div>

          {/* Chart */}
          <div className="chart-wrapper animate-chart-in">
            {chartData.length > 0 ? (
              <>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height="100%">
                    {viewMode === 'dpd' ? (
                      <ComposedChart data={chartData} margin={{ top: 16, right: 16, left: -8, bottom: 8 }}>
                        <defs>
                          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.12}/>
                            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        
                        {/* Reference band - barely visible */}
                        <ReferenceArea 
                          y1={REFERENCE_RANGE.low} 
                          y2={REFERENCE_RANGE.high} 
                          fill="hsl(var(--primary))" 
                          fillOpacity={0.04}
                          stroke="none"
                        />
                        
                        <XAxis 
                          dataKey="dpd" 
                          tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }} 
                          axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                          tickLine={false} 
                          tickFormatter={(v) => `${v}d`}
                          dy={4}
                        />
                        <YAxis 
                          tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }} 
                          axisLine={false}
                          tickLine={false} 
                          domain={['dataMin - 50', 'dataMax + 50']}
                          width={40}
                        />
                        
                        <Tooltip 
                          content={<CustomTooltip />} 
                          cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} 
                        />
                        
                        {/* Subtle area fill */}
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke="none" 
                          fill="url(#areaFill)"
                          isAnimationActive={true}
                          animationDuration={800}
                        />
                        
                        {/* Clean line */}
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={2}
                          dot={({ cx, cy, index }) => (
                            <circle key={index} cx={cx} cy={cy} r={4} fill="hsl(var(--primary))" />
                          )}
                          activeDot={({ cx, cy, payload }) => {
                            const hasVariance = payload && payload.count > 1;
                            const yDomain = chartData.length > 0 ? [
                              Math.min(...chartData.map(d => d.min || d.value)) - 50,
                              Math.max(...chartData.map(d => d.max || d.value)) + 50
                            ] : [0, 1000];
                            const chartHeight = 140;
                            const yRange = yDomain[1] - yDomain[0];
                            const minY = hasVariance ? cy + ((payload.value - payload.min) / yRange) * chartHeight : cy;
                            const maxY = hasVariance ? cy - ((payload.max - payload.value) / yRange) * chartHeight : cy;
                            
                            return (
                              <g>
                                {/* Variance range - only on hover */}
                                {hasVariance && (
                                  <>
                                    <line x1={cx} y1={minY} x2={cx} y2={maxY} stroke="rgba(255,255,255,0.2)" strokeWidth={1} strokeDasharray="2 2" />
                                    <circle cx={cx} cy={maxY} r={2} fill="rgba(255,255,255,0.4)" />
                                    <circle cx={cx} cy={minY} r={2} fill="rgba(255,255,255,0.4)" />
                                    <text x={cx + 6} y={maxY + 3} fontSize={9} fill="rgba(255,255,255,0.45)">{payload.max}</text>
                                    <text x={cx + 6} y={minY + 3} fontSize={9} fill="rgba(255,255,255,0.45)">{payload.min}</text>
                                  </>
                                )}
                                <circle cx={cx} cy={cy} r={6} fill="hsl(var(--primary))" fillOpacity={0.25} />
                                <circle cx={cx} cy={cy} r={4} fill="hsl(var(--primary))" />
                              </g>
                            );
                          }}
                          isAnimationActive={true}
                          animationDuration={1000}
                        />
                      </ComposedChart>
                    ) : (
                      <ComposedChart data={chartData} margin={{ top: 16, right: 16, left: -8, bottom: 8 }}>
                        <defs>
                          <linearGradient id="areaFillDate" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.12}/>
                            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        
                        <ReferenceArea 
                          y1={REFERENCE_RANGE.low} 
                          y2={REFERENCE_RANGE.high} 
                          fill="hsl(var(--primary))" 
                          fillOpacity={0.04}
                          stroke="none"
                        />
                        
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }} 
                          axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                          tickLine={false}
                          dy={4}
                        />
                        <YAxis 
                          tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }} 
                          axisLine={false}
                          tickLine={false} 
                          domain={['dataMin - 50', 'dataMax + 50']}
                          width={40}
                        />
                        
                        <Tooltip 
                          content={<CustomTooltip />} 
                          cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} 
                        />
                        
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke="none" 
                          fill="url(#areaFillDate)"
                          isAnimationActive={true}
                          animationDuration={800}
                        />
                        
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={2}
                          dot={({ cx, cy, index }) => (
                            <g key={index}>
                              <circle cx={cx} cy={cy} r={4} fill="hsl(var(--primary))" />
                            </g>
                          )}
                          activeDot={({ cx, cy }) => (
                            <g>
                              <circle cx={cx} cy={cy} r={6} fill="hsl(var(--primary))" fillOpacity={0.3} />
                              <circle cx={cx} cy={cy} r={4} fill="hsl(var(--primary))" />
                            </g>
                          )}
                          isAnimationActive={true}
                          animationDuration={1000}
                        />
                      </ComposedChart>
                    )}
                  </ResponsiveContainer>
                </div>

                {/* Modern Legend */}
                <div className="chart-legend">
                  <div className="chart-legend-item">
                    <div className="chart-legend-dot" style={{ background: 'hsl(var(--primary))', opacity: 0.15 }} />
                    <span>Optimal: {REFERENCE_RANGE.low}–{REFERENCE_RANGE.high}</span>
                  </div>
                  {viewMode === 'dpd' && dpdStats && (
                    <div className="chart-legend-item">
                      <div className={`chart-legend-indicator ${dpdStats.tightness}`} />
                      <span>Variance: {dpdStats.tightness}</span>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="chart-empty">
                <div className="chart-empty-icon">
                  <Activity className="w-6 h-6" />
                </div>
                <p className="chart-empty-title">No lab results yet</p>
                <p className="chart-empty-subtitle">Add your first result to start tracking</p>
              </div>
            )}
          </div>

          {/* Recent Results */}
          {filteredResults.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs text-white/40">Recent Results</span>
              <div className="space-y-1.5 max-h-28 overflow-y-auto scrollbar-thin">
                {filteredResults
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 4)
                  .map((result) => (
                    <div key={result.id} className="flex items-center justify-between p-2.5 stat-card group">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-white/40">{format(new Date(result.date), 'MMM d, yyyy')}</span>
                        <span className="text-sm font-medium text-white">{result.value} ng/dL</span>
                        {result.dpd !== null && (
                          <span className="text-xs text-primary">{result.dpd} DPD</span>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

