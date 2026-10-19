import Image from 'next/image'
import { RsvpForm } from '@/components/rsvp-form'

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:py-16">
        {/* Invitation */}
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <Image
            src="/invitation.jpg?v=3"
            alt="הזמנה לבריתולדת של פלג — משפחת נחימוב ברגר"
            width={572}
            height={1024}
            priority
            className="h-auto w-full"
          />
        </div>

        {/* RSVP heading */}
        <div className="mt-10 mb-6 text-center">
          <div
            className="mx-auto mb-4 h-px w-24 bg-primary/50"
            aria-hidden="true"
          />
          <h1 className="font-serif text-3xl font-bold text-primary text-balance sm:text-4xl">
            אישור הגעה
          </h1>
          <p className="mt-3 text-lg leading-relaxed text-muted-foreground text-pretty">
            נשמח אם תאשרו את הגעתכם עד לתאריך האירוע
          </p>
        </div>

        <RsvpForm />

        {/* Directions */}
        <div className="mt-10 rounded-3xl border border-border bg-card p-6 text-center shadow-sm sm:p-8">
          <div
            className="mx-auto mb-4 h-px w-24 bg-primary/50"
            aria-hidden="true"
          />
          <h2 className="font-serif text-2xl font-bold text-primary text-balance sm:text-3xl">
            הוראות הגעה
          </h2>
          <p className="mt-3 text-lg leading-relaxed text-muted-foreground text-pretty">
            {'נחלים 3 · בצרה'}
          </p>
          <a
            href="https://waze.com/ul?q=%D7%A0%D7%97%D7%9C%D7%99%D7%9D%203%2C%20%D7%91%D7%A6%D7%A8%D7%94&navigate=yes"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-3 rounded-full bg-primary px-6 py-3 text-lg font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
          >
            <Image
              src="/waze.svg"
              alt=""
              width={24}
              height={24}
              className="h-6 w-6"
              aria-hidden="true"
            />
            נסיעה עם Waze אל נחלים 3, בצרה
          </a>
        </div>

        <footer className="mt-10 text-center text-base text-muted-foreground">
          <p>נשמח לראותכם — משפחת נחימוב ברגר</p>
        </footer>
      </div>
    </main>
  )
}
