import { Comparison } from 'vanture-website'

// Renders a full table at md+ and stacked cards below md (same component, both
// breakpoints). The card viewport is desktop-width, so the table cell shows.
export function Default() {
  return (
    <Comparison
      block={{
        blockType: 'comparison',
        heading: 'Traditional screening vs DVTA',
        colTraditional: 'Traditional',
        colDvta: 'DVTA',
        rows: [
          { id: '1', dimension: 'Coverage', traditional: 'Sampled, manual', dvta: 'Every operator, automated' },
          { id: '2', dimension: 'Consistency', traditional: 'Reviewer-dependent', dvta: 'One scoring model' },
          { id: '3', dimension: 'Time to verdict', traditional: 'Days', dvta: 'Seconds' },
          { id: '4', dimension: 'Auditability', traditional: 'Sparse notes', dvta: 'Full decision trail' },
        ],
      }}
    />
  )
}
