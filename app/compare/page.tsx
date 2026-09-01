import React, { Suspense } from 'react'
import type { Metadata } from 'next'
import prisma from '@/lib/prisma'
import CompareView from './CompareView'

export const metadata: Metadata = {
  title: 'Compare Cyber Laws Globally | CyberLaw Atlas',
  description:
    'Side-by-side comparative matrix of international cybercrime, data protection, privacy, and cybersecurity legislation across global jurisdictions.',
}

export const dynamic = 'force-dynamic'

export default async function ComparePage() {
  const countries = await prisma.country.findMany({
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      isoCode: true,
      region: true,
      flagEmoji: true,
    },
  })

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-6">
      <Suspense
        fallback={
          <div className="mx-auto max-w-7xl px-4 py-16 text-center text-slate-400">
            Loading comparative legal matrix engine...
          </div>
        }
      >
        <CompareView initialCountriesList={countries} />
      </Suspense>
    </main>
  )
}
