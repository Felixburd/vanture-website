'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function NewsletterForm({ locale }: { locale: string }) {
  const t = useTranslations('newsletter')
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setState('error')
      return
    }
    setState('loading')
    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, locale, source: 'footer-form' }),
      })
      // A duplicate email is still a "subscribed" outcome from the user's POV.
      if (res.ok || res.status === 400) setState('success')
      else setState('error')
    } catch {
      setState('error')
    }
  }

  if (state === 'success') {
    return <p className="text-sm text-status-green">{t('success')}</p>
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-sm flex-col gap-2">
      <div className="flex gap-2">
        <Input
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (state === 'error') setState('idle')
          }}
          placeholder={t('placeholder')}
          aria-label={t('placeholder')}
        />
        <Button type="submit" disabled={state === 'loading'}>
          {t('subscribe')}
        </Button>
      </div>
      {state === 'error' ? (
        <p className="text-xs text-status-critical">{t('invalid')}</p>
      ) : null}
    </form>
  )
}
