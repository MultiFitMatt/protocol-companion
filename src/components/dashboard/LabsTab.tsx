import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceArea, ErrorBar, Area, ComposedChart } from 'recharts';
import { Activity, Plus, TrendingUp, TrendingDown, Minus, X, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { format, subDays, isAfter } from 'date-fns';
import type { ProtocolState, LabResult } from '@/hooks/useProtocolState';

interface LabsTabProps {
  state: ProtocolState;
  addLabResult: (result: Omit<LabResult, 'id'>) => void;
  deleteLabResult: (id: string) => void;
}

const TIME_RANGES = [
  { label: '3M', days: 90 },
  { label: '6M', days: 180 },
  { label: '1Y', days: 365 },
  { label: 'All', days: null },
] as const;

const REFERENCE_RANGE = { low: 300, high: 1000 };

// Calculate standard deviation
const calculateStdDev = (values: number[]): number => {
  if (values.length < 2) return 0;
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const squareDiffs = values.map(v => Math.pow(v - avg, 2));
  const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / values.length;
  return Math.sqrt(avgSquareDiff);
};

export function LabsTab({ state, addLabResult, deleteLabResult }: LabsTabProps) {
  const [selectedRange, setSelectedRange] = useState<number | null>(365);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'date' | 'dpd'>('date');
  
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
          const range = max - min;
          
          return {
            dpd: Number(dpd),
            value: avg,
            min,
            max,
            low: avg - stdDev,
            high: avg + stdDev,
            stdDev: Math.round(stdDev),
            range,
            count: values.length,
            // For error bars: [lower error, upper error]
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

  // Calculate overall DPD stats for the summary card
  const dpdStats = useMemo(() => {
    if (viewMode !== 'dpd' || chartData.length === 0) return null;
    
    const avgRange = chartData.reduce((acc, d) => acc + (d.range || 0), 0) / chartData.length;
    const avgStdDev = chartData.reduce((acc, d) => acc + (d.stdDev || 0), 0) / chartData.length;
    const totalSamples = chartData.reduce((acc, d) => acc + (d.count || 0), 0);
    
    // Determine "tightness" rating
    let tightness: 'tight' | 'moderate' | 'wide' = 'tight';
    if (avgStdDev > 100) tightness = 'wide';
    else if (avgStdDev > 50) tightness = 'moderate';
    
    return { avgRange: Math.round(avgRange), avgStdDev: Math.round(avgStdDev), totalSamples, tightness };
  }, [chartData, viewMode]);

  const latestResult = filteredResults.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )[0];

  const previousResult = filteredResults.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )[1];

  const trend = latestResult && previousResult 
    ? latestResult.value - previousResult.value 
    : null;

  const calculateDPD = (labDate: Date): number | null => {
    if (!state.lastDoseDate) return null;
    const lab = new Date(labDate);
    lab.setHours(0, 0, 0, 0);
    const dose = new Date(state.lastDoseDate);
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
    
    addLabResult({
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
    
    return (
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-3 shadow-xl">
        {viewMode === 'dpd' ? (
          <>
            <p className="font-bold text-primary">{data.dpd} DPD</p>
            <p className="text-white text-lg font-semibold">{data.value} ng/dL</p>
            {data.count > 1 && (
              <div className="mt-2 pt-2 border-t border-zinc-700 space-y-1">
                <p className="text-xs text-zinc-400">
                  Range: <span className="text-white">{data.min}–{data.max}</span> ng/dL
                </p>
                <p className="text-xs text-zinc-400">
                  Spread: <span className={`font-medium ${data.stdDev < 50 ? 'text-green-400' : data.stdDev < 100 ? 'text-yellow-400' : 'text-red-400'}`}>
                    ±{data.stdDev}
                  </span> ng/dL
                </p>
                <p className="text-xs text-zinc-500">{data.count} samples</p>
              </div>
            )}
            {data.count === 1 && (
              <p className="text-xs text-zinc-500 mt-1">1 sample (need more for variance)</p>
            )}
          </>
        ) : (
          <>
            <p className="text-zinc-400 text-sm">{data.fullDate}</p>
            <p className="font-bold text-white">{data.value} ng/dL</p>
            {data.dpd !== null && (
              <p className="text-xs text-primary">{data.dpd} DPD</p>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Labs</h2>
          <p className="text-zinc-500">Track your biomarkers</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl">
              <Plus className="w-5 h-5 mr-1" />
              Add
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-zinc-800 sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-white">Log Lab Result</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div>
                <label className="text-xs text-zinc-500 block mb-2">Lab Date</label>
                <Input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-zinc-500 block mb-2">Total Testosterone (ng/dL)</label>
                <Input
                  type="number"
                  value={formValue}
                  onChange={(e) => setFormValue(e.target.value)}
                  placeholder="e.g. 650"
                  className="bg-zinc-800 border-zinc-700 text-white"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-zinc-500 block mb-2">Notes (optional)</label>
                <Input
                  type="text"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="e.g. Fasted, morning draw"
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              {formDate && state.lastDoseDate && (
                <div className="text-xs p-3 bg-primary/10 border border-primary/20 rounded-lg text-primary">
                  DPD: {calculateDPD(new Date(formDate)) ?? 'N/A'} days post dose
                </div>
              )}
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                Save Result
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl bg-zinc-900/80 p-4 border border-zinc-800/50">
          <div className="flex items-center gap-2 text-zinc-500 mb-2">
            <Activity className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider">Latest</span>
          </div>
          {latestResult ? (
            <>
              <p className="text-3xl font-bold text-white">{latestResult.value}</p>
              <p className="text-xs text-zinc-500">ng/dL • {format(new Date(latestResult.date), 'MMM d')}</p>
            </>
          ) : (
            <p className="text-2xl font-bold text-zinc-600">—</p>
          )}
        </div>

        {viewMode === 'dpd' && dpdStats ? (
          // Show variance stats when in DPD mode
          <div className="rounded-2xl bg-zinc-900/80 p-4 border border-zinc-800/50">
            <div className="flex items-center gap-2 text-zinc-500 mb-2">
              <Target className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider">Consistency</span>
            </div>
            <p className={`text-2xl font-bold ${
              dpdStats.tightness === 'tight' ? 'text-green-400' : 
              dpdStats.tightness === 'moderate' ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {dpdStats.tightness === 'tight' ? '🎯 Tight' : 
               dpdStats.tightness === 'moderate' ? '📊 Moderate' : '📈 Variable'}
            </p>
            <p className="text-xs text-zinc-500">±{dpdStats.avgStdDev} ng/dL avg spread</p>
          </div>
        ) : (
          <div className="rounded-2xl bg-zinc-900/80 p-4 border border-zinc-800/50">
            <div className="flex items-center gap-2 text-zinc-500 mb-2">
              {trend !== null && trend > 0 ? (
                <TrendingUp className="w-4 h-4 text-green-400" />
              ) : trend !== null && trend < 0 ? (
                <TrendingDown className="w-4 h-4 text-red-400" />
              ) : (
                <Minus className="w-4 h-4" />
              )}
              <span className="text-xs uppercase tracking-wider">Change</span>
            </div>
            {trend !== null ? (
              <>
                <p className={`text-3xl font-bold ${trend > 0 ? 'text-green-400' : trend < 0 ? 'text-red-400' : 'text-white'}`}>
                  {trend > 0 ? '+' : ''}{trend}
                </p>
                <p className="text-xs text-zinc-500">ng/dL vs previous</p>
              </>
            ) : (
              <p className="text-2xl font-bold text-zinc-600">—</p>
            )}
          </div>
        )}
      </div>

      {/* View Toggle */}
      <div className="flex items-center justify-center gap-1 p-1 bg-zinc-900/80 rounded-xl border border-zinc-800/50">
        <button
          onClick={() => setViewMode('date')}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            viewMode === 'date'
              ? 'bg-primary text-primary-foreground'
              : 'text-zinc-500 hover:text-white'
          }`}
        >
          By Date
        </button>
        <button
          onClick={() => setViewMode('dpd')}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            viewMode === 'dpd'
              ? 'bg-primary text-primary-foreground'
              : 'text-zinc-500 hover:text-white'
          }`}
        >
          By DPD ✨
        </button>
      </div>

      {/* DPD Explanation when in DPD mode */}
      {viewMode === 'dpd' && (
        <div className="text-xs text-center text-zinc-400 bg-primary/5 border border-primary/20 rounded-lg p-3">
          <span className="text-primary font-medium">DPD Normalization</span> — Values grouped by days post dose. 
          {chartData.some((d: any) => d.count > 1) && (
            <span className="block mt-1">Shaded area shows variance (min–max range) at each DPD.</span>
          )}
        </div>
      )}

      {/* Time Range */}
      <div className="flex gap-2">
        {TIME_RANGES.map((range) => (
          <button
            key={range.label}
            onClick={() => setSelectedRange(range.days)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedRange === range.days
                ? 'bg-primary/20 text-primary border border-primary/30'
                : 'bg-zinc-900/50 text-zinc-500 border border-zinc-800/50'
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="rounded-2xl bg-zinc-900/80 p-4 border border-zinc-800/50">
        {chartData.length > 0 ? (
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              {viewMode === 'dpd' ? (
                <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="varianceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <ReferenceArea 
                    y1={REFERENCE_RANGE.low} 
                    y2={REFERENCE_RANGE.high} 
                    fill="hsl(var(--primary))" 
                    fillOpacity={0.08}
                  />
                  <ReferenceLine y={REFERENCE_RANGE.low} stroke="#52525b" strokeDasharray="3 3" />
                  <ReferenceLine y={REFERENCE_RANGE.high} stroke="#52525b" strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="dpd"
                    tick={{ fontSize: 10, fill: '#71717a' }}
                    axisLine={{ stroke: '#27272a' }}
                    tickLine={false}
                    tickFormatter={(value) => `${value}d`}
                  />
                  <YAxis 
                    tick={{ fontSize: 10, fill: '#71717a' }}
                    axisLine={{ stroke: '#27272a' }}
                    tickLine={false}
                    domain={['auto', 'auto']}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  {/* Variance area (min to max) */}
                  <Area
                    type="monotone"
                    dataKey="max"
                    stroke="none"
                    fill="url(#varianceGradient)"
                    fillOpacity={1}
                    isAnimationActive={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="min"
                    stroke="none"
                    fill="#18181b"
                    fillOpacity={1}
                    isAnimationActive={false}
                  />
                  {/* Average line */}
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={(props: any) => {
                      const { cx, cy, payload } = props;
                      const hasVariance = payload.count > 1;
                      return (
                        <g>
                          {/* Variance indicator ring */}
                          {hasVariance && (
                            <circle
                              cx={cx}
                              cy={cy}
                              r={Math.min(12, 6 + payload.stdDev / 30)}
                              fill="hsl(var(--primary))"
                              fillOpacity={0.2}
                            />
                          )}
                          {/* Center dot */}
                          <circle
                            cx={cx}
                            cy={cy}
                            r={hasVariance ? 6 : 5}
                            fill="hsl(var(--primary))"
                            stroke={hasVariance ? '#18181b' : 'none'}
                            strokeWidth={2}
                          />
                          {/* Sample count badge for multi-sample points */}
                          {hasVariance && (
                            <text
                              x={cx}
                              y={cy - 16}
                              textAnchor="middle"
                              fill="#a1a1aa"
                              fontSize={9}
                            >
                              n={payload.count}
                            </text>
                          )}
                        </g>
                      );
                    }}
                    activeDot={{ r: 8, fill: 'hsl(var(--primary))' }}
                  />
                </ComposedChart>
              ) : (
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <ReferenceArea 
                    y1={REFERENCE_RANGE.low} 
                    y2={REFERENCE_RANGE.high} 
                    fill="hsl(var(--primary))" 
                    fillOpacity={0.08}
                  />
                  <ReferenceLine y={REFERENCE_RANGE.low} stroke="#52525b" strokeDasharray="3 3" />
                  <ReferenceLine y={REFERENCE_RANGE.high} stroke="#52525b" strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date"
                    tick={{ fontSize: 10, fill: '#71717a' }}
                    axisLine={{ stroke: '#27272a' }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 10, fill: '#71717a' }}
                    axisLine={{ stroke: '#27272a' }}
                    tickLine={false}
                    domain={['auto', 'auto']}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 5 }}
                    activeDot={{ r: 7, fill: 'hsl(var(--primary))' }}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-40 flex flex-col items-center justify-center text-center">
            <Activity className="w-10 h-10 text-zinc-700 mb-3" />
            <p className="text-zinc-500">No lab results yet</p>
            <p className="text-xs text-zinc-600">Add your first result to start tracking</p>
          </div>
        )}

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-4 text-xs text-zinc-500 flex-wrap">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-primary/20 border border-primary/40" />
            <span>Normal: {REFERENCE_RANGE.low}–{REFERENCE_RANGE.high}</span>
          </div>
          {viewMode === 'dpd' && chartData.some((d: any) => d.count > 1) && (
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-primary/30 border-2 border-primary" />
              <span>Larger dot = more variance</span>
            </div>
          )}
        </div>
      </div>

      {/* Recent Results */}
      {filteredResults.length > 0 && (
        <div className="rounded-2xl bg-zinc-900/80 p-4 border border-zinc-800/50">
          <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4">History</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {filteredResults
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 10)
              .map((result) => (
                <div 
                  key={result.id} 
                  className="flex items-center justify-between p-3 rounded-xl bg-zinc-800/50 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{result.value} ng/dL</p>
                      <p className="text-xs text-zinc-500">
                        {format(new Date(result.date), 'MMM d, yyyy')}
                        {result.dpd !== null && ` • ${result.dpd} DPD`}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteLabResult(result.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/20 rounded-lg transition-all"
                  >
                    <X className="w-4 h-4 text-zinc-500 hover:text-red-400" />
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
