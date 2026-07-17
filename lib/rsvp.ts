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

export async function submitRsvp(
  data: Omit<Rsvp, 'id' | 'createdAt'>,
): Promise<'created' | 'updated'> {
  const normalized = normalizePhone(data.phone)

  if (normalized) {
    const recordRef = ref(db, `${RSVP_PATH}/${normalized}`)
    const snap = await get(recordRef)
    const existed = snap.exists()

    await set(recordRef, {
      ...data,
      createdAt: existed ? (snap.val().createdAt ?? Date.now()) : Date.now(),
      updatedAt: Date.now(),
    })

    // Remove any old push-keyed duplicates for this phone number
    const allRef = ref(db, RSVP_PATH)
    const allSnap = await get(allRef)
    const all = allSnap.val() as Record<string, Omit<Rsvp, 'id'>> | null
    if (all) {
      const duplicates = Object.entries(all).filter(
        ([key, item]) => key !== normalized && normalizePhone(item.phone) === normalized,
      )
      await Promise.all(
        duplicates.map(([key]) => remove(ref(db, `${RSVP_PATH}/${key}`))),
      )
    }

    return existed ? 'updated' : 'created'
  }

  const rsvpRef = ref(db, RSVP_PATH)
  await push(rsvpRef, { ...data, createdAt: Date.now() })
  return 'created'
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
