'use client'

import { useFormFields } from '@payloadcms/ui'
import type { FieldDescriptionClientProps } from 'payload'

type Props = FieldDescriptionClientProps & { recommended: number; noun: string }

/**
 * Description slot for the SEO title/description inputs: shows the recommended
 * length and a live character count. Guidance only; it never blocks saving.
 */
export function SeoLengthHint({ path, recommended, noun }: Props) {
  const value = useFormFields(([fields]) => fields[path]?.value)
  const count = typeof value === 'string' ? value.length : 0
  const over = count > recommended

  return (
    // Reuses Payload's own description styling so it sits like a native hint.
    <div
      className="field-description"
      style={over ? { color: 'var(--theme-error-500)' } : undefined}
      aria-live="polite"
    >
      {count} / ~{recommended} characters.{' '}
      {over
        ? `Longer than recommended; search engines will likely truncate this ${noun}.`
        : `Keep it around ${recommended} so the ${noun} isn't truncated in search results.`}
    </div>
  )
}
