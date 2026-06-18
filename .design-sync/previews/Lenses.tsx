import { Lenses } from 'vanture-website'

// The four-lens model (L1–L4) is core to the DVTA story: each operator is scored
// across four independent lenses, and any single failure escalates the file.
export function Default() {
  return (
    <Lenses
      block={{
        blockType: 'lenses',
        heading: 'Four lenses, one verdict',
        body: 'Each operator is scored across four independent lenses. A pass on three means nothing if the fourth fails — any single failure escalates the file.',
        lenses: [
          {
            id: '1',
            code: 'L1',
            title: 'Identity',
            description: 'Who is operating the aircraft, and can it be proven against authoritative records?',
            failurePercent: '2.1%',
            failureLabel: 'fail rate',
          },
          {
            id: '2',
            code: 'L2',
            title: 'History',
            description: 'Prior incidents, violations, and operating record across jurisdictions.',
            failurePercent: '5.8%',
            failureLabel: 'fail rate',
          },
          {
            id: '3',
            code: 'L3',
            title: 'Intent',
            description: 'Declared purpose measured against observed flight patterns and airspace.',
            failurePercent: '3.4%',
            failureLabel: 'fail rate',
          },
          {
            id: '4',
            code: 'L4',
            title: 'Capability',
            description: 'Whether the platform and payload match the stated mission profile.',
            failurePercent: '1.2%',
            failureLabel: 'fail rate',
          },
        ],
      }}
    />
  )
}
