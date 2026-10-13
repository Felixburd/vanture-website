import { Container } from 'vanture-website'

// Layout primitive: centers content and caps it at the 6xl content column with
// consistent gutters. The dashed outline here just makes the constraint visible.
export function Default() {
  return (
    <div className="w-full bg-muted py-8">
      <Container>
        <div className="border border-dashed border-border bg-card p-8 text-center">
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            max-w-6xl · centered · px-6 gutters
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Every page section wraps its content in Container so columns line up
            against the blueprint rails.
          </p>
        </div>
      </Container>
    </div>
  )
}
