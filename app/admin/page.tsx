'use client'

import { useEffect, useState } from 'react'
import { subscribeToRsvps, type Rsvp } from '@/lib/rsvp'

export default function AdminPage() {
  const [rsvps, setRsvps] = useState<Rsvp[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = subscribeToRsvps((list) => {
      setRsvps(list)
      setLoading(false)
    })
    return unsub
  }, [])

  const coming = rsvps.filter((r) => r.attendance === 'yes')
  const notComing = rsvps.filter((r) => r.attendance === 'no')
  const totalGuests = coming.reduce((sum, r) => sum + (r.guests || 0), 0)

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="mb-6 font-serif text-3xl font-bold text-primary">
          ניהול אישורי הגעה
        </h1>

        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="סה״כ תשובות" value={rsvps.length} />
          <StatCard label="משפחות מגיעות" value={coming.length} />
          <StatCard label="סה״כ מגיעים" value={totalGuests} highlight />
          <StatCard label="לא מגיעים" value={notComing.length} />
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground">טוען...</p>
        ) : rsvps.length === 0 ? (
          <p className="text-center text-muted-foreground">
            עדיין אין אישורי הגעה.
          </p>
        ) : (
          <div className="space-y-8">
            <Section
              title={`מגיעים (${totalGuests} אורחים)`}
              rsvps={coming}
              showGuests
            />
            <Section title="לא מגיעים" rsvps={notComing} />
          </div>
        )}
      </div>
    </main>
  )
}

function Section({
  title,
  rsvps,
  showGuests = false,
}: {
  title: string
  rsvps: Rsvp[]
  showGuests?: boolean
}) {
  if (rsvps.length === 0) return null
  return (
    <section>
      <h2 className="mb-3 font-serif text-2xl font-bold text-primary">
        {title}
      </h2>
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="divide-y divide-border">
          {rsvps.map((r) => (
            <div
              key={r.id}
              className="flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-lg font-medium text-card-foreground">
                  {r.name}
                </p>
                {r.phone && (
                  <p className="text-sm text-muted-foreground">{r.phone}</p>
                )}
                {r.message && (
                  <p className="mt-1 text-sm italic text-muted-foreground">
                    “{r.message}”
                  </p>
                )}
              </div>
              {showGuests && (
                <span className="shrink-0 rounded-full bg-primary px-3 py-1 text-sm font-medium text-primary-foreground">
                  {r.guests} מגיעים
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function StatCard({
  label,
  value,
  highlight = false,
}: {
  label: string
  value: number
  highlight?: boolean
}) {
  return (
    <div
      className={`rounded-xl border p-4 text-center ${
        highlight
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-card'
      }`}
    >
      <p
        className={`text-3xl font-bold ${
          highlight ? 'text-primary-foreground' : 'text-primary'
        }`}
      >
        {value}
      </p>
      <p
        className={`mt-1 text-sm ${
          highlight ? 'text-primary-foreground/80' : 'text-muted-foreground'
        }`}
      >
        {label}
      </p>
    </div>
  )
}
