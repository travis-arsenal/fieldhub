export function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img
        src="/arsenal-logo-white.png"
        alt="Arsenal"
        className="h-9 w-auto object-contain"
      />
      <div className="flex flex-col leading-none">
        <span className="font-semibold tracking-wide text-white text-sm">FIELDHUB</span>
        <span className="text-[10px] text-arsenal-muted tracking-widest uppercase">Always Ready</span>
      </div>
    </div>
  );
}
