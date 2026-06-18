import { Stats } from 'vanture-website'

// `block` is a CMS StatsBlock (typed against @/payload-types; types erased at
// runtime). Realistic stub content stands in for the CMS payload.
export function Default() {
  return (
    <Stats
      block={{
        blockType: 'stats',
        heading: 'The case for structured vetting',
        body: 'Manual screening misses the patterns that matter. DVTA scores every operator against the same model — every time.',
        stats: [
          { id: '1', value: '1,284', label: 'Assessments cleared in the last 24 hours', source: 'Live pipeline' },
          { id: '2', value: '37%', label: 'Reduction in manual review time', source: 'Pilot cohort, 2025' },
          { id: '3', value: '4.2s', label: 'Median time to first risk flag', source: null },
        ],
      }}
    />
  )
}
