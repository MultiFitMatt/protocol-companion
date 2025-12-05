import { useState, useEffect, useCallback } from 'react';

export type MedType = 'Injection' | 'Oral' | 'Patch' | 'Pellet' | 'GLP-1' | 'Other';
export type ScheduleMode = 'weekly' | 'interval';
export type InjectionSite = 'Deltoid' | 'Ventrogluteal' | 'Dorsogluteal' | 'Subq abdomen' | 'Other';

export interface DoseEntry {
  date: Date;
  amount?: string;
  unit?: string;
  site?: string;
  notes?: string;
}

export interface LabResult {
  id: string;
  date: Date;
  biomarker: string;
  value: number;
  unit: string;
  dpd: number | null;
  notes?: string;
}

export interface ProtocolState {
  protocolName: string;
  medType: MedType;
  scheduleMode: ScheduleMode;
  weeklyDays: string[];
  intervalDays: number;
  customIntervalDays: number | null;
  doseTime: string;
  lastDoseDate: Date | null;
  lastDoseAmount: string | null;
  lastDoseUnit: string | null;
  lastDoseSite: string | null;
  labDate: Date | null;
  labTime: string;
  doseReminderEnabled: boolean;
  doseReminderOffsetDays: number;
  labReminderEnabled: boolean;
  labReminderOffsetDays: number;
  dosesHistory: DoseEntry[];
  labResults: LabResult[];
}

// Generate dummy lab results for testing - 2-4 years of data every 3-6 months
const generateDummyLabResults = (): LabResult[] => {
  const now = new Date();
  const results: LabResult[] = [];
  
  // Generate ~3 years of data (about 8-12 lab draws)
  const labDraws = [
    { monthsAgo: 36, value: 285, dpd: 3, notes: 'Pre-TRT baseline - low T symptoms' },
    { monthsAgo: 33, value: 520, dpd: 2, notes: 'First follow-up after starting TRT' },
    { monthsAgo: 28, value: 680, dpd: 4, notes: 'Trough draw - adjusted dose up' },
    { monthsAgo: 24, value: 850, dpd: 2, notes: 'Peak measurement' },
    { monthsAgo: 20, value: 720, dpd: 3, notes: 'Routine follow-up' },
    { monthsAgo: 16, value: 790, dpd: 2, notes: 'Morning fasted draw' },
    { monthsAgo: 12, value: 680, dpd: 4, notes: 'Trough - feeling good' },
    { monthsAgo: 9, value: 920, dpd: 1, notes: 'Peak - 24hr post injection' },
    { monthsAgo: 6, value: 750, dpd: 3, notes: 'Routine labs' },
    { monthsAgo: 4, value: 820, dpd: 2, notes: 'Mid-cycle draw' },
    { monthsAgo: 2, value: 690, dpd: 4, notes: 'Trough measurement' },
    { monthsAgo: 0.5, value: 880, dpd: 2, notes: 'Most recent labs' },
  ];
  
  labDraws.forEach((draw, index) => {
    const date = new Date(now);
    date.setMonth(date.getMonth() - draw.monthsAgo);
    // Add some day variance
    date.setDate(date.getDate() + Math.floor(Math.random() * 10) - 5);
    
    results.push({
      id: `dummy-${index + 1}`,
      date,
      biomarker: 'Total Testosterone',
      value: draw.value,
      unit: 'ng/dL',
      dpd: draw.dpd,
      notes: draw.notes,
    });
  });
  
  return results.sort((a, b) => a.date.getTime() - b.date.getTime());
};

const DEFAULT_STATE: ProtocolState = {
  protocolName: 'Testosterone cypionate IM',
  medType: 'Injection',
  scheduleMode: 'weekly',
  weeklyDays: ['Mon', 'Thu'],
  intervalDays: 3,
  customIntervalDays: null,
  doseTime: '09:00',
  lastDoseDate: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  lastDoseAmount: '0.25',
  lastDoseUnit: 'mL',
  lastDoseSite: 'Ventrogluteal',
  labDate: null,
  labTime: '08:00',
  doseReminderEnabled: true,
  doseReminderOffsetDays: 2,
  labReminderEnabled: true,
  labReminderOffsetDays: 7,
  dosesHistory: [],
  labResults: generateDummyLabResults(),
};

const STORAGE_KEY = 'protocol-tracker-state-v7';

export function useProtocolState() {
  const [state, setState] = useState<ProtocolState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const parsedLabResults = (parsed.labResults || []).map((r: any) => ({
          ...r,
          date: new Date(r.date),
        }));
        
        // If no lab results saved, use dummy data
        const labResults = parsedLabResults.length > 0 
          ? parsedLabResults 
          : generateDummyLabResults();
        
        return {
          ...DEFAULT_STATE,
          ...parsed,
          lastDoseDate: parsed.lastDoseDate ? new Date(parsed.lastDoseDate) : null,
          labDate: parsed.labDate ? new Date(parsed.labDate) : null,
          dosesHistory: (parsed.dosesHistory || []).map((d: any) => ({
            ...d,
            date: new Date(d.date),
          })),
          labResults,
        };
      }
    } catch (e) {
      console.error('Failed to load state from localStorage', e);
    }
    return DEFAULT_STATE;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save state to localStorage', e);
    }
  }, [state]);

  const updateState = useCallback((updates: Partial<ProtocolState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const logDose = useCallback((entry: Omit<DoseEntry, 'date'>) => {
    const now = new Date();
    const newEntry: DoseEntry = {
      date: now,
      ...entry,
    };
    setState((prev) => ({
      ...prev,
      lastDoseDate: now,
      lastDoseAmount: entry.amount || null,
      lastDoseUnit: entry.unit || prev.lastDoseUnit,
      lastDoseSite: entry.site || null,
      dosesHistory: [...prev.dosesHistory, newEntry],
    }));
  }, []);

  const getNextDoseDate = useCallback((): Date | null => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (state.scheduleMode === 'weekly') {
      const dayMap: Record<string, number> = {
        Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
      };
      const todayDay = today.getDay();
      const sortedDays = [...state.weeklyDays].sort(
        (a, b) => dayMap[a] - dayMap[b]
      );

      for (const day of sortedDays) {
        const dayNum = dayMap[day];
        if (dayNum >= todayDay) {
          const nextDate = new Date(today);
          nextDate.setDate(today.getDate() + (dayNum - todayDay));
          return nextDate;
        }
      }

      if (sortedDays.length > 0) {
        const firstDayNum = dayMap[sortedDays[0]];
        const daysUntil = 7 - todayDay + firstDayNum;
        const nextDate = new Date(today);
        nextDate.setDate(today.getDate() + daysUntil);
        return nextDate;
      }
    } else {
      const interval = state.customIntervalDays || state.intervalDays;
      if (state.lastDoseDate) {
        const lastDose = new Date(state.lastDoseDate);
        lastDose.setHours(0, 0, 0, 0);
        const nextDate = new Date(lastDose);
        nextDate.setDate(lastDose.getDate() + interval);
        if (nextDate <= today) {
          return today;
        }
        return nextDate;
      }
      return today;
    }

    return null;
  }, [state.scheduleMode, state.weeklyDays, state.intervalDays, state.customIntervalDays, state.lastDoseDate]);

  const isTodayDoseDay = useCallback((): boolean => {
    const nextDose = getNextDoseDate();
    if (!nextDose) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    nextDose.setHours(0, 0, 0, 0);
    return nextDose.getTime() === today.getTime();
  }, [getNextDoseDate]);

  const calculateDPD = useCallback((): number | null => {
    if (!state.labDate || !state.lastDoseDate) return null;
    const labDate = new Date(state.labDate);
    labDate.setHours(0, 0, 0, 0);
    const lastDose = new Date(state.lastDoseDate);
    lastDose.setHours(0, 0, 0, 0);
    
    if (lastDose > labDate) return null;
    
    const diffTime = labDate.getTime() - lastDose.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }, [state.labDate, state.lastDoseDate]);

  const addLabResult = useCallback((result: Omit<LabResult, 'id'>) => {
    const newResult: LabResult = {
      ...result,
      id: crypto.randomUUID(),
    };
    setState((prev) => ({
      ...prev,
      labResults: [...prev.labResults, newResult],
    }));
  }, []);

  const deleteLabResult = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      labResults: prev.labResults.filter((r) => r.id !== id),
    }));
  }, []);

  return {
    state,
    updateState,
    logDose,
    getNextDoseDate,
    isTodayDoseDay,
    calculateDPD,
    addLabResult,
    deleteLabResult,
  };
}
