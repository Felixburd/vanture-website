import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Badge,
} from 'vanture-website'

export function Basic() {
  return (
    <div className="p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Operator briefing</CardTitle>
          <CardDescription>
            A 20-minute walkthrough of the vetting pipeline, tailored to your fleet.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Bring your current screening workflow — we map it against the DVTA model live.
        </CardContent>
        <CardFooter className="gap-3">
          <Button>Book a briefing</Button>
          <Button variant="ghost">Later</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

// Metric card — the instrument-panel composition with a status badge.
export function MetricCard() {
  return (
    <div className="p-6">
      <Card className="w-full max-w-sm">
        <CardHeader className="flex-row items-start justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <CardTitle>Pipeline throughput</CardTitle>
            <CardDescription>Last 24 hours</CardDescription>
          </div>
          <Badge variant="green">Operational</Badge>
        </CardHeader>
        <CardContent>
          <div className="font-display text-4xl font-medium tracking-tight">1,284</div>
          <div className="mt-1 font-mono text-xs uppercase tracking-wider text-muted-foreground">
            assessments cleared
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
