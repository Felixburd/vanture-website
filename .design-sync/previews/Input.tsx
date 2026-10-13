import { Input, Button } from 'vanture-website'

export function Default() {
  return (
    <div className="w-full max-w-sm p-6">
      <Input placeholder="operator@fleet.example" type="email" />
    </div>
  )
}

export function WithLabel() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2 p-6">
      <label
        htmlFor="vtr-input-email"
        className="font-mono text-xs uppercase tracking-wider text-muted-foreground"
      >
        Work email
      </label>
      <Input id="vtr-input-email" placeholder="operator@fleet.example" type="email" />
    </div>
  )
}

export function Disabled() {
  return (
    <div className="w-full max-w-sm p-6">
      <Input placeholder="Locked during review" disabled />
    </div>
  )
}

// Inline form row — input paired with a submit, newsletter/briefing style.
export function InlineForm() {
  return (
    <div className="flex w-full max-w-md items-center gap-3 p-6">
      <Input placeholder="operator@fleet.example" type="email" />
      <Button>Request access</Button>
    </div>
  )
}
