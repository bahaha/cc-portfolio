type TelepromoterProps = {
  children: React.ReactNode;
};

export default function Telepromoter({ children }: TelepromoterProps) {
  return (
    <div
      className="flex h-40 flex-wrap overflow-hidden text-3xl font-bold leading-relaxed"
      style={{ fontVariant: "no-common-ligatures" }}
    >
      {children}
    </div>
  );
}
