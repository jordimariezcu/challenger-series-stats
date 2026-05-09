interface Props {
  label: string
  value: string
  sublabel?: string
  icon: string
  color?: 'blue' | 'sky' | 'emerald' | 'violet'
}

const colorMap = {
  blue: 'bg-blue-50 text-blue-700 border-blue-100',
  sky: 'bg-sky-50 text-sky-700 border-sky-100',
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  violet: 'bg-violet-50 text-violet-700 border-violet-100',
}

export default function StatsCard({ label, value, sublabel, icon, color = 'blue' }: Props) {
  return (
    <div className={`card flex items-start gap-4 p-5 border ${colorMap[color]}`}>
      <div className="text-3xl">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium opacity-75">{label}</p>
        <p className="mt-0.5 text-2xl font-bold truncate">{value}</p>
        {sublabel && <p className="mt-0.5 text-xs opacity-60">{sublabel}</p>}
      </div>
    </div>
  )
}
