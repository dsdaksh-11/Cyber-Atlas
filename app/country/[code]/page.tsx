import React from 'react'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import { normalizeCountryCode } from '@/lib/country-utils'
import CountryResultsView from './CountryResultsView'

interface PageProps {
  params: Promise<{ code: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { code } = await params
  const normalizedCode = normalizeCountryCode(code)

  const country = await prisma.country.findFirst({
    where: {
      OR: [
        { isoCode: { equals: normalizedCode } },
        { name: { equals: code.replace(/-/g, ' ') } },
      ],
    },
  })

  if (!country) {
    return {
      title: `Country Not Found | CyberLaw Atlas`,
    }
  }

  return {
    title: `${country.flagEmoji} ${country.name} (${country.isoCode}) Cyber Laws | CyberLaw Atlas`,
    description: `Explore cybercrime, cybersecurity, and data privacy legislation of ${country.name} (${country.isoCode}). View legal summary, key provisions, and governing authorities.`,
  }
}

export default async function CountryPage({ params }: PageProps) {
  const { code } = await params
  if (!code) notFound()

  const normalizedCode = normalizeCountryCode(code)

  // Query database for country and associated cyber laws
  const country = await prisma.country.findFirst({
    where: {
      OR: [
        { isoCode: { equals: normalizedCode } },
        { name: { equals: code.replace(/-/g, ' ') } },
      ],
    },
    include: {
      laws: {
        orderBy: {
          year: 'desc',
        },
      },
    },
  })

  if (!country) {
    notFound()
  }

  return <CountryResultsView country={country} />
}
