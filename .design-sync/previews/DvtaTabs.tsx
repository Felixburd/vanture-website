import { DvtaTabs } from 'vanture-website'

// Client component; the first tab is active on mount. Mono uppercase pills, the
// active one tinted with the primary token.
export function Default() {
  return (
    <div className="w-full max-w-2xl p-6">
      <DvtaTabs tabs={['Overview', 'Identity', 'History', 'Intent', 'Capability']} />
    </div>
  )
}
