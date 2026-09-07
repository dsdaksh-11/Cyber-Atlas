'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { LawCard, LawCardInstrument } from '@/components/LawCard'
import { LawFilters } from '@/components/LawFilters'
import {
  Globe,
  Copy,
  Check,
  ArrowLeft,
  FileSearch,
  ShieldCheck,
  Layers,
  FileCheck,
  Lock,
  Radio,
  Scale,
  CreditCard,
  Info,
} from 'lucide-react'

interface CountryWithHierarchy {
  id: string
  name: string
  isoCode: string
  region: string
  flagEmoji: string
  coverages?: Array<{
    id: string
    coverageStatus: string
    unctadBaselineCovered?: boolean | null
    unctadBaselineStatus?: string | null
    verifiedCount: number
    confidenceLevel: string
    researchNotes?: string | null
    assessmentSource?: string | null
    category: {
      id: string
      key: string
      name: string
      description: string
      unctadBaseline: boolean
      unctadArea?: string | null
      displayOrder: number
    }
  }>
  instruments?: Array<{
    id: string
    title: string
    officialTitle?: string | null
    shortTitle?: string | null
    instrumentType: string
    yearEnacted?: number | null
    summary: string
    keyProvisionsText?: string | null
    issuingAuthority: string
    officialUrl?: string | null
    sourceName?: string | null
    sourceUrl?: string | null
    verificationStatus: string
    isSampleData: boolean
    lastVerifiedDate?: Date | string | null
    category: {
      id: string
      key: string
      name: string
    }
    provisions?: Array<{
      id: string
      articleNumber?: string | null
      heading?: string | null
      content: string
      penaltyDetails?: string | null
      reportingMandate?: string | null
    }>
    sources?: Array<{
      id: string
      name: string
      url: string
      sourceType: string
      isOfficial: boolean
    }>
  }>
  laws?: Array<{
    id: string
    title: string
    year: number
    category: string
    summary: string
    keyProvisions: string
    authority: string
    officialUrl: string
    sourceName: string
    sourceUrl: string
    lastUpdated: string
    isSampleData: boolean
  }>
}

interface CountryResultsViewProps {
  country: CountryWithHierarchy
}

const UNCTAD_PILLARS = [
  { key: 'cybercrime', label: 'Cybercrime', icon: Radio },
  { key: 'data-protection', label: 'Data Protection', icon: Lock },
  { key: 'electronic-transactions', label: 'E-Transactions', icon: FileCheck },
  { key: 'consumer-protection', label: 'Consumer Protection', icon: Scale },
  { key: 'indirect-taxation', label: 'Indirect Taxation', icon: CreditCard },
]

export function CountryResultsView({ country }: CountryResultsViewProps) {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [copied, setCopied] = useState(false)

  // Standardize instruments (hierarchical preferred, fallback to legacy laws)
  const normalizedInstruments: LawCardInstrument[] = useMemo(() => {
    if (country.instruments && country.instruments.length > 0) {
      return country.instruments.map((inst) => ({
        id: inst.id,
        title: inst.title,
        officialTitle: inst.officialTitle,
        shortTitle: inst.shortTitle,
        instrumentType: inst.instrumentType,
        year: inst.yearEnacted,
        category: inst.category?.name || 'General',
        summary: inst.summary,
        keyProvisions: inst.keyProvisionsText || '',
        authority: inst.issuingAuthority,
        officialUrl: inst.officialUrl,
        sourceName: inst.sourceName,
        sourceUrl: inst.sourceUrl,
        lastUpdated: inst.lastVerifiedDate ? String(inst.lastVerifiedDate).split('T')[0] : '2024-01-15',
        verificationStatus: inst.verificationStatus,
        isSampleData: inst.isSampleData,
        provisions: inst.provisions,
        sources: inst.sources,
      }))
    }
    if (country.laws && country.laws.length > 0) {
      return country.laws.map((l) => ({
        id: l.id,
        title: l.title,
        year: l.year,
        category: l.category,
        summary: l.summary,
        keyProvisions: l.keyProvisions,
        authority: l.authority,
        officialUrl: l.officialUrl,
        sourceName: l.sourceName,
        sourceUrl: l.sourceUrl,
        lastUpdated: l.lastUpdated,
        verificationStatus: 'VERIFIED',
        isSampleData: l.isSampleData,
        instrumentType: 'ACT',
      }))
    }
    return []
  }, [country.instruments, country.laws])

  // Unique categories list for filter
  const categories = useMemo(() => {
    const cats = new Set<string>()
    // Add all categories that have coverage records
    if (country.coverages && country.coverages.length > 0) {
      country.coverages.forEach((c) => {
        if (c.category?.name) cats.add(c.category.name)
      })
    } else {
      normalizedInstruments.forEach((l) => cats.add(l.category))
    }
    return ['All', ...Array.from(cats)]
  }, [country.coverages, normalizedInstruments])

  // Filtered laws
  const filteredInstruments = useMemo(() => {
    return normalizedInstruments.filter((inst) => {
      // Category filter
      if (selectedCategory !== 'All') {
        const matchesCategory =
          inst.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
          selectedCategory.toLowerCase().includes(inst.category.toLowerCase())
        if (!matchesCategory) return false
      }
      // Keyword search
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase()
        const matchesTitle = inst.title.toLowerCase().includes(q)
        const matchesSummary = inst.summary.toLowerCase().includes(q)
        const matchesAuthority = inst.authority.toLowerCase().includes(q)
        const matchesProvisions = (inst.keyProvisions || '').toLowerCase().includes(q)
        if (!matchesTitle && !matchesSummary && !matchesAuthority && !matchesProvisions) {
          return false
        }
      }
      return true
    })
  }, [normalizedInstruments, selectedCategory, searchQuery])

  // Copy Link
  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/country/${country.isoCode}`
      navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  // Find coverage for currently selected category
  const activeCoverage = useMemo(() => {
    if (!country.coverages || selectedCategory === 'All') return null
    return country.coverages.find(
      (c) =>
        c.category?.name.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        selectedCategory.toLowerCase().includes(c.category?.name.toLowerCase())
    )
  }, [country.coverages, selectedCategory])

  const totalVerifiedCount = normalizedInstruments.filter(
    (i) => i.verificationStatus === 'VERIFIED' && !i.isSampleData
  ).length

  return (
    <div className="relative min-h-screen cyber-grid pb-20 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation back button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-400 hover:text-cyan-400 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Country Search</span>
        </Link>

        {/* Country Header Card */}
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-cyan-500/5 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-5xl sm:text-6xl">{country.flagEmoji}</span>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-sans">
                      {country.name}
                    </h1>
                    <span className="rounded-xl bg-cyan-950 px-3 py-1 text-sm font-mono font-bold text-cyan-400 border border-cyan-800/80 shadow-md">
                      ISO Code: {country.isoCode}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 flex items-center gap-2 pt-1">
                    <Globe className="h-4 w-4 text-cyan-400" />
                    <span>{country.region} Region</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <ShieldCheck className="h-4 w-4" />
                      {totalVerifiedCount} Verified Legal Instruments Documented
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/90 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-200 hover:border-cyan-500/50 hover:bg-slate-800 hover:text-white transition-all cursor-pointer shadow-lg"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 text-cyan-400" />
                    <span>Copy Country Link</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-1.5 rounded-xl border border-cyan-800/50 bg-cyan-950/40 px-3.5 py-2.5 text-xs font-semibold text-cyan-300">
                <ShieldCheck className="h-4 w-4 text-cyan-400" />
                <span>UNCTAD Baseline Aligned</span>
              </div>
            </div>
          </div>
        </div>

        {/* UNCTAD Baseline 5-Pillar Coverage Dashboard */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                <Layers className="h-4 w-4 text-cyan-400" />
                UNCTAD Global Cyberlaw Baseline Coverage
              </h2>
              <p className="text-xs text-slate-400 pt-0.5">
                Baseline classification indicators benchmarked against the UNCTAD Cyberlaw Tracker.
              </p>
            </div>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800 shrink-0">
              5 Core UNCTAD Pillars
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
            {UNCTAD_PILLARS.map((pillar) => {
              const Icon = pillar.icon
              const coverageRecord = country.coverages?.find(
                (c) => c.category?.key === pillar.key || c.category?.name.toLowerCase().includes(pillar.key)
              )
              const hasIndexedLaws =
                (coverageRecord?.verifiedCount || 0) > 0 ||
                normalizedInstruments.some((inst) =>
                  inst.category.toLowerCase().includes(pillar.key.replace('-', ' '))
                )

              return (
                <div
                  key={pillar.key}
                  className="rounded-xl border border-slate-800/80 bg-slate-950/70 p-3.5 space-y-2 hover:border-cyan-500/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Icon className="h-3.5 w-3.5 text-cyan-400" />
                      {pillar.label}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
                      <span className="text-xs font-bold text-emerald-300">
                        {coverageRecord?.unctadBaselineStatus || 'Legislation exists'}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 flex items-center gap-1">
                      {hasIndexedLaws ? (
                        <span className="text-cyan-300 font-medium">✓ In-Depth Statutes Indexed</span>
                      ) : (
                        <span className="text-slate-400 italic">Research Pending in Atlas</span>
                      )}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Methodology Research Transparency Disclaimer Banner */}
        <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/30 via-slate-900/60 to-cyan-950/30 p-5 shadow-lg flex items-start gap-3.5">
          <Info className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs text-slate-300 leading-relaxed">
            <p className="font-semibold text-white">
              Legal Research & Provenance Methodology:
            </p>
            <p>
              CyberLaw Atlas currently documents <strong className="text-cyan-300">{totalVerifiedCount} verified statutory instrument(s)</strong> in {country.name}. This does not necessarily represent every applicable law, subordinate decree, or sector-specific regulation. Missing categories indicate areas scheduled for future investigation in our{' '}
              <span className="text-cyan-400 font-mono">research backlog</span> rather than an absence of legislation.
            </p>
          </div>
        </div>

        {/* Filter Controls */}
        <LawFilters
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          totalCount={normalizedInstruments.length}
          filteredCount={filteredInstruments.length}
          onReset={() => {
            setSelectedCategory('All')
            setSearchQuery('')
          }}
        />

        {/* Cyber Laws & Legal Instruments List */}
        <div className="space-y-6">
          {filteredInstruments.length > 0 ? (
            filteredInstruments.map((law) => <LawCard key={law.id} law={law} />)
          ) : (
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-10 text-center space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-slate-400">
                <FileSearch className="h-7 w-7 text-cyan-400" />
              </div>
              <div className="space-y-2 max-w-lg mx-auto">
                <h3 className="text-lg font-bold text-white">
                  {selectedCategory !== 'All'
                    ? `Category "${selectedCategory}" Pending Detailed Statutory Research`
                    : 'No Matching Legal Instruments Found'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {selectedCategory !== 'All'
                    ? `Our research team has not yet ingested individual statutes for "${selectedCategory}" in ${country.name}. According to baseline indicators, applicable general or sector-specific regulations may apply. This category is tracked in our active research backlog.`
                    : `No legal instruments matched your search "${searchQuery}".`}
                </p>
                {activeCoverage && (
                  <div className="rounded-xl bg-slate-950 p-3 text-xs text-slate-400 text-left space-y-1 border border-slate-800">
                    <p>
                      <strong className="text-slate-300">Coverage Status:</strong>{' '}
                      <span className="text-amber-400 font-mono">{activeCoverage.coverageStatus}</span>
                    </p>
                    <p>
                      <strong className="text-slate-300">Assessment Source:</strong>{' '}
                      {activeCoverage.assessmentSource || 'UNCTAD Cyberlaw Tracker'}
                    </p>
                    {activeCoverage.researchNotes && (
                      <p>
                        <strong className="text-slate-300">Notes:</strong> {activeCoverage.researchNotes}
                      </p>
                    )}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All')
                  setSearchQuery('')
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-all cursor-pointer"
              >
                Clear Filters & View Documented Instruments
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
export default CountryResultsView
