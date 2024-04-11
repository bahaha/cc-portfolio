type TelepromoterProps = {
  children: React.ReactNode;
};

export default function Telepromoter({ children }: TelepromoterProps) {
  return (
    <div
      className="relative h-40 overflow-hidden text-3xl font-bold leading-relaxed tracking-widest"
      style={{ fontVariant: "no-common-ligatures" }}
    >
      {children}
    </div>
  );
}
