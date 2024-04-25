import { cn } from "@/utils/ui-helpers";

type ChallengeConfigProps = {
  currentDuration: number;
  onDurationChange: (duration: number) => void;
};

export function ChallengeConfig({
  currentDuration,
  onDurationChange,
}: ChallengeConfigProps) {
  const timeSlots = [15, 30, 60, 120];

  return (
    <div className="flex items-center justify-center gap-1 self-stretch rounded bg-background/50">
      <span className="">Time</span>
      <span className="w-1 self-stretch bg-background/70"></span>
      <div className="flex items-baseline gap-1.5">
        {timeSlots.map((slot) => (
          <button
            key={slot}
            onClick={() => onDurationChange(slot)}
            className={cn("", currentDuration === slot && "text-primary")}
          >
            {slot}
          </button>
        ))}
      </div>
    </div>
  );
}
