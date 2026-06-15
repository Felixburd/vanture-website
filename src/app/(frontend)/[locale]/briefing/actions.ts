'use server'

/*
  Forwards a completed briefing to the intake webhook server-side, so the
  browser never makes a cross-origin POST (no CORS, key stays off the client).
  Defaults to the production portal; override with BRIEFING_WEBHOOK_URL.
*/
const WEBHOOK_URL =
  process.env.BRIEFING_WEBHOOK_URL || 'https://portal.vanture.capital/webhook/vanture-briefing'

export async function submitBriefing(
  data: Record<string, string>,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const payload = {
    ...data,
    source: 'vanture-website',
    submitted_at: new Date().toISOString(),
  }

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      // Intake is fire-and-confirm; never cache.
      cache: 'no-store',
    })
    if (!res.ok) return { ok: false, error: `Server returned ${res.status}` }
    return { ok: true }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Network error' }
  }
}
