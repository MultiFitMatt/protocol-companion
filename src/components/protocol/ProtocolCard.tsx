import { useProtocolState } from '@/hooks/useProtocolState';
import { useAuth } from '@/hooks/useAuth';
import { ProtocolHeader } from './ProtocolHeader';
import { ScheduleSelector } from './ScheduleSelector';
import { DoseLogger } from './DoseLogger';
import { UpcomingDoses } from './UpcomingDoses';
import { Reminders } from './Reminders';
import { LabsSection } from './LabsSection';
import { ThemeSettings } from './ThemeSettings';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ProtocolCard() {
  const {
    state,
    updateState,
    logDose,
    getNextDoseDate,
    isTodayDoseDay,
    calculateDPD,
  } = useProtocolState();
  const { signOut } = useAuth();

  const nextDoseDate = getNextDoseDate();
  const todayIsDoseDay = isTodayDoseDay();
  const dpd = calculateDPD();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6 md:p-8 w-full max-w-2xl mx-auto animate-fade-in">
      {/* Settings & Sign Out */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSignOut}
          className="h-8 w-8 text-muted-foreground/50 hover:text-muted-foreground"
          title="Sign out"
        >
          <LogOut className="h-4 w-4" />
        </Button>
        <ThemeSettings />
      </div>
      
      <div className="space-y-3 sm:space-y-4">
        {/* Header */}
        <div className="section-panel">
          <ProtocolHeader
            protocolName={state.protocolName}
            medType={state.medType}
            onNameChange={(name) => updateState({ protocolName: name })}
            onMedTypeChange={(type) => updateState({ medType: type })}
          />
        </div>

        {/* Schedule Selector */}
        <div className="section-panel">
          <ScheduleSelector
            scheduleMode={state.scheduleMode}
            weeklyDays={state.weeklyDays}
            intervalDays={state.intervalDays}
            customIntervalDays={state.customIntervalDays}
            onModeChange={(mode) => updateState({ scheduleMode: mode })}
            onWeeklyDaysChange={(days) => updateState({ weeklyDays: days })}
            onIntervalDaysChange={(days) => updateState({ intervalDays: days })}
            onCustomIntervalChange={(days) => updateState({ customIntervalDays: days })}
          />
        </div>

        {/* Dose Logger */}
        <div className="section-panel">
          <DoseLogger
            isTodayDoseDay={todayIsDoseDay}
            lastDoseDate={state.lastDoseDate}
            lastDoseAmount={state.lastDoseAmount}
            lastDoseSite={state.lastDoseSite}
            onLogDose={logDose}
          />
        </div>

        {/* Upcoming Doses & Reminders */}
        <div className="grid md:grid-cols-2 gap-3 sm:gap-4">
          <div className="section-panel">
            <UpcomingDoses
              nextDoseDate={nextDoseDate}
              lastDoseDate={state.lastDoseDate}
              doseTime={state.doseTime}
              onDoseTimeChange={(time) => updateState({ doseTime: time })}
            />
          </div>
          <div className="section-panel">
            <Reminders
              doseReminderEnabled={state.doseReminderEnabled}
              doseReminderOffsetDays={state.doseReminderOffsetDays}
              onDoseReminderEnabledChange={(enabled) => updateState({ doseReminderEnabled: enabled })}
              onDoseReminderOffsetChange={(days) => updateState({ doseReminderOffsetDays: days })}
            />
          </div>
        </div>

        {/* Labs & DPD */}
        <div className="section-panel">
          <LabsSection
            labDate={state.labDate}
            labTime={state.labTime}
            dpd={dpd}
            labReminderEnabled={state.labReminderEnabled}
            labReminderOffsetDays={state.labReminderOffsetDays}
            onLabDateChange={(date) => updateState({ labDate: date })}
            onLabTimeChange={(time) => updateState({ labTime: time })}
            onLabReminderEnabledChange={(enabled) => updateState({ labReminderEnabled: enabled })}
            onLabReminderOffsetChange={(days) => updateState({ labReminderOffsetDays: days })}
          />
        </div>
      </div>
    </div>
  );
}
