'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { LawCard } from '@/components/LawCard'
import { LawFilters } from '@/components/LawFilters'
import {
  Globe,
  Copy,
  Check,
  ArrowLeft,
  FileSearch,
  ShieldCheck,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react'

interface CyberLaw {
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
  countryId: string
}

interface CountryResultsViewProps {
  country: {
    id: string
    name: string
    isoCode: string
    region: string
    flagEmoji: string
    laws: CyberLaw[]
  }
}

export function CountryResultsView({ country }: CountryResultsViewProps) {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [copied, setCopied] = useState(false)

  // Unique categories in this country's laws
  const categories = useMemo(() => {
    const cats = new Set<string>()
    country.laws.forEach((l) => cats.add(l.category))
    return ['All', ...Array.from(cats)]
  }, [country.laws])

  // Filtered laws
  const filteredLaws = useMemo(() => {
    return country.laws.filter((law) => {
      // Category filter
      if (selectedCategory !== 'All' && law.category !== selectedCategory) {
        return false
      }
      // Keyword search
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase()
        const matchesTitle = law.title.toLowerCase().includes(q)
        const matchesSummary = law.summary.toLowerCase().includes(q)
        const matchesProvisions = law.keyProvisions.toLowerCase().includes(q)
        const matchesAuthority = law.authority.toLowerCase().includes(q)
        if (!matchesTitle && !matchesSummary && !matchesProvisions && !matchesAuthority) {
          return false
        }
      }
      return true
    })
  }, [country.laws, selectedCategory, searchQuery])

  // Handle Copy Country Link
  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/country/${country.isoCode}`
      navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  const hasNoLawsInDb = country.laws.length === 0

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
          {/* Subtle glowing backdrop */}
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
                    <span className="text-slate-300 font-semibold">
                      {country.laws.length} Enacted Cyber Laws Indexed
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

              <div className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-medium text-slate-400">
                <ShieldCheck className="h-4 w-4 text-cyan-400" />
                <span>UNCTAD Aligned</span>
              </div>
            </div>
          </div>
        </div>

        {/* Data Accuracy Disclaimer Banner for Countries with Limited Ingested Laws */}
        {hasNoLawsInDb ? (
          <div className="rounded-3xl border border-amber-500/40 bg-slate-900/90 p-8 sm:p-10 text-center space-y-6 shadow-2xl backdrop-blur-xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-950/80 border border-amber-500/40 text-amber-400 shadow-lg">
              <AlertCircle className="h-8 w-8" />
            </div>
            <div className="space-y-2 max-w-xl mx-auto">
              <h2 className="text-xl font-bold text-white">
                Detailed cyber law information for this country is currently limited in our database.
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Legal research and statutory ingestion for {country.name} ({country.isoCode}) are actively in progress. Our team is verifying official legislative source records and legal translations before publishing.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800 max-w-lg mx-auto">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <Clock className="h-4 w-4" /> Ingestion Status: Verification Queue
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Sparkles className="h-4 w-4" /> Source Attribution Reserved
              </span>
            </div>
          </div>
        ) : (
          <>
            {/* Filter Controls */}
            <LawFilters
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              totalCount={country.laws.length}
              filteredCount={filteredLaws.length}
              onReset={() => {
                setSelectedCategory('All')
                setSearchQuery('')
              }}
            />

            {/* Cyber Laws List */}
            <div className="space-y-6">
              {filteredLaws.length > 0 ? (
                filteredLaws.map((law) => <LawCard key={law.id} law={law} />)
              ) : (
                <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-12 text-center space-y-4">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 text-slate-400">
                    <FileSearch className="h-8 w-8 text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">No Matching Cyber Laws Found</h3>
                  <p className="text-sm text-slate-400 max-w-md mx-auto">
                    No legal records match your current filter parameters for &quot;{selectedCategory}&quot; or search query &quot;{searchQuery}&quot;.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('All')
                      setSearchQuery('')
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-all cursor-pointer"
                  >
                    Clear Search & View All Laws
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
export default CountryResultsView
