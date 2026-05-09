import { colorNivell, labelNivell } from '@/lib/utils'
import type { NivellAdmin } from '@/lib/types'

interface Props {
  nivell: NivellAdmin
  size?: 'sm' | 'md'
}

export default function NivellBadge({ nivell, size = 'sm' }: Props) {
  const cls = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm'
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${cls} ${colorNivell(nivell)}`}>
      {labelNivell(nivell)}
    </span>
  )
}
