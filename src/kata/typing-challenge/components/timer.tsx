type TimerProps = {
  seconds: number;
};

function showTime(digits: number) {
  return digits.toString().padStart(2, "0");
}

function secondsToTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${showTime(minutes)}:${showTime(remainingSeconds)}`;
}

export function Timer({ seconds }: TimerProps) {
  const time = secondsToTime(seconds);

  return (
    <div className="self-start text-2xl font-bold tracking-wider text-primary">
      {time}
    </div>
  );
}

export default Timer;
