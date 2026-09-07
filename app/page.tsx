import React from 'react'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import CountrySearch from '@/components/CountrySearch'
import StatsOverview from '@/components/StatsOverview'
import IngestionBanner from '@/components/IngestionBanner'
import {
  Shield,
  Globe,
  ArrowRight,
  Lock,
  FileCheck,
  Building,
  Radio,
  Scale,
  Sparkles,
  Columns,
  CheckCircle2,
  Brain,
  Flame,
} from 'lucide-react'

export const revalidate = 60 // Revalidate every 60 seconds

export async function generateMetadata() {
  return {
    title: 'CyberLaw Atlas | Global Cybercrime Laws & AI Cybersecurity Intelligence',
    description:
      'Explore cybercrime and cybersecurity laws across 48 countries worldwide. Search by country name or ISO country code and access real-time AI security threat intelligence.',
  }
}

export default async function HomePage() {
  // Fetch countries and counts from database
  let countries: Array<{
    id: string
    name: string
    isoCode: string
    region: string
    flagEmoji: string
    _count: { laws: number; instruments: number }
  }> = []

  let totalLawsCount = 0
  let totalInstrumentsCount = 0
  let totalCoverageCount = 0
  let newsCount = 0

  try {
    countries = await prisma.country.findMany({
      include: {
        _count: {
          select: { laws: true, instruments: true },
        },
      },
      orderBy: {
        name: 'asc',
      },
    })

    totalLawsCount = await prisma.cyberLaw.count()
    totalInstrumentsCount = await prisma.legalInstrument.count()
    totalCoverageCount = await prisma.countryCoverage.count()
    newsCount = await prisma.newsArticle.count({ where: { isRelevant: true } })
  } catch (error) {
    console.error('Error loading homepage data:', error)
  }

  const categoryCards = [
    {
      title: 'Cybercrime Legislation',
      icon: Shield,
      desc: 'Criminal codes penalizing unauthorized access, hacking, system impairment, identity theft, and extortion.',
      color: 'text-rose-400 bg-rose-950/60 border-rose-800/40',
    },
    {
      title: 'Data Protection & Privacy',
      icon: Lock,
      desc: 'Statutory rules governing personal data processing, consent mechanisms, individual privacy rights, and breach penalties.',
      color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/40',
    },
    {
      title: 'Cybersecurity Directives',
      icon: Radio,
      desc: 'Mandatory information security standards, CERT incident reporting directives, and threat intelligence frameworks.',
      color: 'text-cyan-400 bg-cyan-950/60 border-cyan-800/40',
    },
    {
      title: 'Critical Infrastructure',
      icon: Building,
      desc: 'Special legal protections for high-risk national sectors like energy, finance, telecommunications, and defense networks.',
      color: 'text-blue-400 bg-blue-950/60 border-blue-800/40',
    },
    {
      title: 'Electronic Transactions',
      icon: FileCheck,
      desc: 'Legal recognition of electronic records, digital signatures, smart contracts, and e-commerce transactions.',
      color: 'text-amber-400 bg-amber-950/60 border-amber-800/40',
    },
    {
      title: 'Online Safety & Scams',
      icon: Scale,
      desc: 'Legal duties of care for platform providers to mitigate online financial fraud, malware distribution, and illegal content.',
      color: 'text-violet-400 bg-violet-950/60 border-violet-800/40',
    },
  ]

  return (
    <div className="relative min-h-screen cyber-grid pb-16">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-cyan-500/10 via-blue-600/5 to-transparent blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto space-y-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-slate-900/90 px-4 py-1.5 text-xs sm:text-sm font-semibold text-cyan-300 shadow-xl backdrop-blur-md">
          <Sparkles className="h-4 w-4 text-cyan-400" />
          <span>International Legal & AI Security Intelligence Platform</span>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white font-sans leading-tight">
            CyberLaw <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">Atlas</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Explore cybercrime laws, data protection frameworks, and AI threat intelligence across 48 global jurisdictions. Search by country name or ISO code.
          </p>
        </div>

        {/* Primary Search Component */}
        <div className="pt-4">
          <CountrySearch />
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Global Statistics Bar */}
        <StatsOverview
          countryCount={countries.length}
          lawCount={totalLawsCount}
          instrumentCount={totalInstrumentsCount}
          coverageCount={totalCoverageCount}
        />

        {/* Featured Jurisdictions Grid */}
        <section id="jurisdictions" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                <Globe className="h-4 w-4" />
                <span>Searchable Database ({countries.length} Jurisdictions)</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                Explore Country Jurisdictions
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md">
              Select a jurisdiction to inspect enacted statutes, privacy frameworks, and governing enforcement authorities.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {countries.map((c) => (
              <Link
                key={c.isoCode}
                href={`/country/${c.isoCode}`}
                className="group relative rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-md hover:border-cyan-500/50 hover:bg-slate-900 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-4xl">{c.flagEmoji}</span>
                    <span className="rounded-lg bg-cyan-950 px-2.5 py-1 text-xs font-mono font-bold text-cyan-400 border border-cyan-800">
                      ISO: {c.isoCode}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {c.name}
                    </h3>
                    <p className="text-xs text-slate-400">{c.region} Region</p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-emerald-300 font-medium flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                    {c._count.instruments || c._count.laws} Instruments
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-cyan-400 group-hover:translate-x-1 transition-transform">
                    View Laws <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* AI Cybersecurity Intelligence Section Promo */}
        <section className="relative overflow-hidden rounded-3xl border border-cyan-500/40 bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/80 p-8 sm:p-12 shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/80 px-3 py-1 text-xs font-semibold text-cyan-300">
                <Brain className="h-3.5 w-3.5 text-cyan-400" />
                <span>New Feature Spotlight</span>
              </div>
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                AI Cybersecurity Intelligence Engine
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Deterministic rule-based threat monitoring at the intersection of Artificial Intelligence and Cybersecurity — tracking AI agent security, prompt injection vulnerabilities, synthetic deepfakes, and foundation model regulation.
              </p>

              <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-300 pt-2">
                <span className="flex items-center gap-1.5 text-emerald-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> AI + Cyber Dual Relevance Filter
                </span>
                <span className="flex items-center gap-1.5 text-cyan-300">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400" /> 11 Threat Categories
                </span>
                <span className="flex items-center gap-1.5 text-rose-300">
                  <Flame className="h-4 w-4 text-rose-400" /> Estimated Threat Level Matrix
                </span>
              </div>
            </div>

            <div className="shrink-0">
              <Link
                href="/ai-security-news"
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 px-7 py-4 text-base font-bold text-white shadow-xl shadow-cyan-500/25 hover:brightness-110 active:scale-95 transition-all"
              >
                <span>Explore AI Security News ({newsCount})</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Dedicated Country Comparison Section Promo */}
        <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950/40 p-8 sm:p-12 shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/80 px-3 py-1 text-xs font-semibold text-cyan-300">
                <Columns className="h-3.5 w-3.5 text-cyan-400" />
                <span>Legal Comparison Engine</span>
              </div>
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                Side-by-Side Legal Comparison Matrix
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Compare cybercrime penalties, data protection mandates, and cybersecurity frameworks across 2 to 4 countries simultaneously with standardized legal indicators.
              </p>
            </div>

            <div className="shrink-0">
              <Link
                href="/compare"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/90 px-6 py-3.5 text-sm font-bold text-white hover:border-cyan-400 hover:text-cyan-300 transition-all shadow-lg"
              >
                <span>Open Comparison Matrix</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Legal Taxonomy Categories */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Structured Legal Taxonomy
            </h2>
            <p className="text-sm text-slate-400">
              Legal information categorized according to standardized international legal frameworks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryCards.map((cat, idx) => {
              const IconComp = cat.icon
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md hover:border-slate-700 transition-colors space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl border ${cat.color}`}>
                      <IconComp className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-bold text-white">{cat.title}</h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{cat.desc}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* Ingestion Pipeline Section */}
        <IngestionBanner />
      </div>
    </div>
  )
}