import { db } from './firebase'
import { ref, push, set, get, remove, onValue, off } from 'firebase/database'

export type Attendance = 'yes' | 'no'

export type Rsvp = {
  id?: string
  name: string
  attendance: Attendance
  guests: number
  phone?: string
  message?: string
  createdAt: number
  updatedAt?: number
}

const RSVP_PATH = 'brit-rsvps'

// Normalize a phone number for comparison: keep digits only
function normalizePhone(phone?: string) {
  return (phone ?? '').replace(/\D/g, '')
}

export async function submitRsvp(data: Omit<Rsvp, 'id' | 'createdAt'>) {
  const rsvpRef = ref(db, RSVP_PATH)
  const normalized = normalizePhone(data.phone)

  // If a phone number was provided, check for an existing RSVP with the same
  // phone and update it in place instead of creating a duplicate entry.
  if (normalized) {
    const snapshot = await get(rsvpRef)
    const value = snapshot.val() as Record<string, Omit<Rsvp, 'id'>> | null
    if (value) {
      const existing = Object.entries(value).find(
        ([, item]) => normalizePhone(item.phone) === normalized,
      )
      if (existing) {
        const [existingId, existingItem] = existing
        await set(ref(db, `${RSVP_PATH}/${existingId}`), {
          ...data,
          createdAt: existingItem.createdAt ?? Date.now(),
          updatedAt: Date.now(),
        })
        return
      }
    }
  }

  await push(rsvpRef, { ...data, createdAt: Date.now() })
}

export function subscribeToRsvps(callback: (rsvps: Rsvp[]) => void) {
  const rsvpRef = ref(db, RSVP_PATH)
  const handler = onValue(rsvpRef, (snapshot) => {
    const value = snapshot.val() as Record<string, Omit<Rsvp, 'id'>> | null
    const list: Rsvp[] = value
      ? Object.entries(value).map(([id, item]) => ({ id, ...item }))
      : []
    list.sort((a, b) => b.createdAt - a.createdAt)
    callback(list)
  })
  return () => off(rsvpRef, 'value', handler)
}
