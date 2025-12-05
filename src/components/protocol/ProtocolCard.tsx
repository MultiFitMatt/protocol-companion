import { useProtocolState } from '@/hooks/useProtocolState';
import { ProtocolHeader } from './ProtocolHeader';
import { ScheduleSelector } from './ScheduleSelector';
import { DoseLogger } from './DoseLogger';
import { UpcomingDoses } from './UpcomingDoses';
import { Reminders } from './Reminders';
import { LabsSection } from './LabsSection';
import { ThemeSettings } from './ThemeSettings';
import { Separator } from '@/components/ui/separator';

export function ProtocolCard() {
  const {
    state,
    updateState,
    logDose,
    getNextDoseDate,
    isTodayDoseDay,
    calculateDPD,
  } = useProtocolState();

  const nextDoseDate = getNextDoseDate();
  const todayIsDoseDay = isTodayDoseDay();
  const dpd = calculateDPD();

  return (
    <div className="glass-card rounded-2xl p-6 md:p-8 w-full max-w-2xl mx-auto animate-fade-in">
      {/* Settings Button */}
      <div className="absolute top-4 right-4">
        <ThemeSettings />
      </div>
      
      {/* Header */}
      <ProtocolHeader
        protocolName={state.protocolName}
        medType={state.medType}
        onNameChange={(name) => updateState({ protocolName: name })}
        onMedTypeChange={(type) => updateState({ medType: type })}
      />

      <Separator className="my-6 bg-border/30" />

      {/* Schedule Selector */}
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

      <Separator className="my-6 bg-border/30" />

      {/* Dose Logger */}
      <DoseLogger
        isTodayDoseDay={todayIsDoseDay}
        lastDoseDate={state.lastDoseDate}
        lastDoseAmount={state.lastDoseAmount}
        lastDoseSite={state.lastDoseSite}
        onLogDose={logDose}
      />

      <Separator className="my-6 bg-border/30" />

      {/* Upcoming Doses & Reminders - Two columns on desktop */}
      <div className="grid md:grid-cols-2 gap-6">
        <UpcomingDoses
          nextDoseDate={nextDoseDate}
          lastDoseDate={state.lastDoseDate}
          doseTime={state.doseTime}
          onDoseTimeChange={(time) => updateState({ doseTime: time })}
        />
        <Reminders
          doseReminderEnabled={state.doseReminderEnabled}
          doseReminderOffsetDays={state.doseReminderOffsetDays}
          onDoseReminderEnabledChange={(enabled) => updateState({ doseReminderEnabled: enabled })}
          onDoseReminderOffsetChange={(days) => updateState({ doseReminderOffsetDays: days })}
        />
      </div>

      <Separator className="my-6 bg-border/30" />

      {/* Labs & DPD */}
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
  );
}
