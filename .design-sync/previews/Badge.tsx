import { Badge } from 'vanture-website'

// The traffic-light variants (green / amber / critical) are the brand's signature
// status system — mono, uppercase, each carrying a leading status dot.
export function StatusLights() {
  return (
    <div className="flex flex-wrap items-center gap-3 p-6">
      <Badge variant="green">Operational</Badge>
      <Badge variant="amber">Degraded</Badge>
      <Badge variant="critical">Critical</Badge>
    </div>
  )
}

export function Variants() {
  return (
    <div className="flex flex-wrap items-center gap-3 p-6">
      <Badge>Default</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="muted">Muted</Badge>
    </div>
  )
}

// Realistic usage: status labels paired with their metric, instrument-panel style.
export function InContext() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3 p-6">
      <div className="flex items-center justify-between gap-6">
        <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          Vetting status
        </span>
        <Badge variant="green">Cleared</Badge>
      </div>
      <div className="flex items-center justify-between gap-6">
        <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          Document review
        </span>
        <Badge variant="amber">Pending</Badge>
      </div>
      <div className="flex items-center justify-between gap-6">
        <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          Threat flag
        </span>
        <Badge variant="critical">Escalated</Badge>
      </div>
    </div>
  )
}
