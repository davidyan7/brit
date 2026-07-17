'use client'

import { useState } from 'react'
import { submitRsvp, type Attendance } from '@/lib/rsvp'

const options: { value: Attendance; label: string }[] = [
  { value: 'yes', label: 'אגיע בשמחה' },
  { value: 'no', label: 'לא אוכל להגיע' },
]

export function RsvpForm() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [attendance, setAttendance] = useState<Attendance | null>(null)
  const [guests, setGuests] = useState(1)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'saving' | 'done' | 'error'>(
    'idle',
  )
  const [outcome, setOutcome] = useState<'created' | 'updated'>('created')

  const isComing = attendance === 'yes'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !phone.trim() || !attendance) return
    setStatus('saving')
    try {
      const result = await submitRsvp({
        name: name.trim(),
        phone: phone.trim(),
        attendance,
        guests: isComing ? guests : 0,
        message: message.trim(),
      })
      setOutcome(result)
      setStatus('done')
    } catch (err) {
      console.log('[v0] rsvp submit error:', err)
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <h3 className="mb-3 font-serif text-2xl font-bold text-primary">
          תודה רבה!
        </h3>
        <p className="text-lg leading-relaxed text-card-foreground">
          {attendance === 'no'
            ? 'קיבלנו את תשובתכם. נשמח לראותכם בשמחות הבאות.'
            : outcome === 'updated'
              ? 'עדכנו את אישור ההגעה שלכם. נשמח לחגוג יחד!'
              : 'אישור ההגעה שלכם נקלט. נשמח לחגוג יחד!'}
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-card p-6 sm:p-8"
    >
      <div className="mb-5">
        <label
          htmlFor="name"
          className="mb-2 block text-lg font-medium text-card-foreground"
        >
          שם מלא
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="השם שלכם"
          className="w-full rounded-lg border border-input bg-background px-4 py-3 text-lg text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
        />
      </div>

      <div className="mb-5">
        <label
          htmlFor="phone"
          className="mb-2 block text-lg font-medium text-card-foreground"
        >
          טלפון
        </label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          placeholder="050-0000000"
          className="w-full rounded-lg border border-input bg-background px-4 py-3 text-lg text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
        />
      </div>

      <div className="mb-5">
        <span className="mb-2 block text-lg font-medium text-card-foreground">
          האם תגיעו?
        </span>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setAttendance(opt.value)}
              className={`rounded-lg border px-4 py-3 text-base font-medium transition ${
                attendance === opt.value
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-input bg-background text-foreground hover:border-ring'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {isComing && (
        <div className="mb-5">
          <label
            htmlFor="guests"
            className="mb-2 block text-lg font-medium text-card-foreground"
          >
            כמה אתם מגיעים? (כולל אתכם)
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setGuests((g) => Math.max(1, g - 1))}
              className="h-11 w-11 rounded-lg border border-input bg-background text-2xl text-foreground transition hover:border-ring"
              aria-label="הפחת"
            >
              −
            </button>
            <span className="min-w-12 text-center text-2xl font-bold text-primary">
              {guests}
            </span>
            <button
              type="button"
              onClick={() => setGuests((g) => Math.min(30, g + 1))}
              className="h-11 w-11 rounded-lg border border-input bg-background text-2xl text-foreground transition hover:border-ring"
              aria-label="הוסף"
            >
              +
            </button>
          </div>
        </div>
      )}

      <div className="mb-6">
        <label
          htmlFor="message"
          className="mb-2 block text-lg font-medium text-card-foreground"
        >
          ברכה או הערה (לא חובה)
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          placeholder="מזל טוב למשפחה..."
          className="w-full resize-none rounded-lg border border-input bg-background px-4 py-3 text-lg text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
        />
      </div>

      {status === 'error' && (
        <p className="mb-4 text-center text-destructive">
          אירעה שגיאה בשליחה. אנא נסו שוב.
        </p>
      )}

      <button
        type="submit"
        disabled={
          !name.trim() || !phone.trim() || !attendance || status === 'saving'
        }
        className="w-full rounded-lg bg-primary px-6 py-4 text-xl font-bold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === 'saving' ? 'שולח...' : 'שליחת אישור הגעה'}
      </button>
    </form>
  )
}
