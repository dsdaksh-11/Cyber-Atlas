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
    title: `${country.flagEmoji} ${country.name} (${country.isoCode}) Cyber Laws & Legal Coverage | CyberLaw Atlas`,
    description: `Explore cybercrime, cybersecurity, and data privacy legal instruments of ${country.name} (${country.isoCode}). View UNCTAD baseline indicators, verified statutes, and governing authorities.`,
  }
}

export default async function CountryPage({ params }: PageProps) {
  const { code } = await params
  if (!code) notFound()

  const normalizedCode = normalizeCountryCode(code)

  // Query database for country, category coverages, hierarchical instruments, and legacy laws
  const country = await prisma.country.findFirst({
    where: {
      OR: [
        { isoCode: { equals: normalizedCode } },
        { name: { equals: code.replace(/-/g, ' ') } },
      ],
    },
    include: {
      coverages: {
        include: {
          category: true,
        },
        orderBy: {
          category: {
            displayOrder: 'asc',
          },
        },
      },
      instruments: {
        include: {
          category: true,
          provisions: {
            orderBy: {
              displayOrder: 'asc',
            },
          },
          sources: true,
        },
        orderBy: {
          yearEnacted: 'desc',
        },
      },
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
