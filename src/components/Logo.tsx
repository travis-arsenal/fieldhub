export function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Stylized V mark matching Hunt Arsenal */}
      <div className="w-9 h-9 bg-black border border-white/20 flex items-center justify-center rounded-sm">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 6 L12 18 L20 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-semibold tracking-wide text-white text-sm">FIELDHUB</span>
        <span className="text-[10px] text-arsenal-muted tracking-widest uppercase">Hunt Arsenal</span>
      </div>
    </div>
  );
}
