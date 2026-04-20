interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
  icon?: string;
}

export function StatCard({ label, value, sub, accent, icon }: StatCardProps) {
  return (
    <div
      className={`relative rounded-lg p-5 border overflow-hidden transition-all
        ${accent
          ? "bg-[var(--accent)]/10 border-[var(--accent)]/40 hover:border-[var(--accent)]/70"
          : "bg-[var(--surface)] border-[var(--border)] hover:border-[var(--accent)]/30"
        }`}
    >
      {accent && (
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/5 to-transparent pointer-events-none" />
      )}
      <div className="relative">
        <div className="text-xs font-medium text-[var(--muted)] uppercase tracking-widest mb-2 flex items-center gap-1.5">
          {icon && <span>{icon}</span>}
          {label}
        </div>
        <div className={`text-3xl font-black tabular-nums ${accent ? "text-[var(--accent)]" : "text-[var(--text)]"}`}>
          {value}
        </div>
        {sub && (
          <div className="text-xs text-[var(--muted)] mt-1.5">{sub}</div>
        )}
      </div>
    </div>
  );
}

interface MiniBarProps {
  value: number;
  max?: number;
  color?: string;
}

export function MiniBar({ value, max = 100, color = "var(--accent)" }: MiniBarProps) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="w-full bg-[var(--bg)] rounded-full h-1.5 mt-1.5">
      <div
        className="h-1.5 rounded-full transition-all"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  );
}

export function SectionHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-[var(--border)]">
      <div>
        <h2 className="font-bold text-[var(--text)] uppercase tracking-wide text-sm">{title}</h2>
        {subtitle && (
          <p className="text-xs text-[var(--muted)] mt-0.5">{subtitle}</p>
        )}
      </div>
      {right}
    </div>
  );
}
