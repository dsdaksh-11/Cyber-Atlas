'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  Scale,
  X,
  Search,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  Shield,
  FileText,
  Building2,
  Calendar,
  RefreshCw,
  Info,
  ArrowLeft,
  Clock,
  Layers,
} from 'lucide-react'

interface CountryMeta {
  id: string
  name: string
  isoCode: string
  region: string
  flagEmoji: string
  instrumentCount?: number
  lawCount?: number
}

interface ProvisionSummary {
  articleNumber?: string | null
  heading?: string | null
  content: string
  penaltyDetails?: string | null
  reportingMandate?: string | null
}

interface InstrumentDetail {
  id: string
  title: string
  shortTitle?: string | null
  instrumentType: string
  scope?: string | null
  year: number | null
  category: string
  summary: string
  keyProvisions: string
  authority: string
  officialUrl?: string | null
  sourceName?: string | null
  sourceUrl?: string | null
  lastUpdated?: string | null
  verificationStatus: string
  isDirectSource?: boolean | null
  researchStatus?: string | null
  provisions: ProvisionSummary[]
}

interface CategoryCellResult {
  coverageStatus: string
  coverageLabel: string
  unctadBaselineCovered?: boolean | null
  unctadBaselineStatus?: string | null
  verifiedCount: number
  documentedCount?: number
  hasLaw: boolean
  confidenceLevel: string
  researchNotes?: string | null
  instruments: InstrumentDetail[]
}

interface CategoryComparison {
  categoryKey: string
  categoryName: string
  description: string
  unctadBaseline: boolean
  countryResults: Record<string, CategoryCellResult>
}

interface ComparisonData {
  selectedCountries: CountryMeta[]
  categories: CategoryComparison[]
}

interface CompareViewProps {
  initialCountriesList: CountryMeta[]
}

export function CompareView({ initialCountriesList }: CompareViewProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Parse initial selected ISO codes from URL (default to IN, US, GB if none)
  const initialParam = searchParams.get('countries')
  const defaultCodes = initialParam
    ? initialParam.split(',').map((s) => s.trim().toUpperCase()).filter(Boolean)
    : ['IN', 'US', 'GB']

  const [selectedCodes, setSelectedCodes] = useState<string[]>(defaultCodes)
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Autocomplete state
  const [searchQuery, setSearchQuery] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Modal active law state
  const [activeModalData, setActiveModalData] = useState<{
    country: CountryMeta
    categoryName: string
    instruments: InstrumentDetail[]
    coverageStatus: string
    researchNotes?: string | null
  } | null>(null)

  // Load comparison on mount and code updates without synchronous cascading setState
  useEffect(() => {
    let isCancelled = false

    const loadComparison = async () => {
      if (selectedCodes.length < 2 || selectedCodes.length > 4) {
        setError('Please select between 2 and 4 countries to generate a comparison matrix.')
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const res = await fetch(`/api/compare?countries=${selectedCodes.join(',')}`)
        const data = await res.json()

        if (!isCancelled) {
          if (!res.ok) {
            setError(data.error || 'Failed to fetch comparison data')
          } else {
            setComparisonData(data)
          }
        }
      } catch (err: unknown) {
        if (!isCancelled) {
          setError(err instanceof Error ? err.message : 'An error occurred while loading comparison matrix.')
        }
      } finally {
        if (!isCancelled) {
          setLoading(false)
        }
      }
    }

    loadComparison()

    return () => {
      isCancelled = true
    }
  }, [selectedCodes])

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Filter available countries for selector
  const availableCountries = initialCountriesList.filter(
    (c) => !selectedCodes.includes(c.isoCode)
  )

  const filteredSuggestions = availableCountries.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.isoCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.region.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddCountry = (isoCode: string) => {
    if (selectedCodes.length >= 4) return
    const updated = [...selectedCodes, isoCode]
    setSelectedCodes(updated)
    setSearchQuery('')
    setIsDropdownOpen(false)
    router.push(`/compare?countries=${updated.join(',')}`, { scroll: false })
  }

  const handleRemoveCountry = (isoCode: string) => {
    if (selectedCodes.length <= 2) {
      setError('A minimum of 2 countries is required for side-by-side comparison.')
      return
    }
    const updated = selectedCodes.filter((c) => c !== isoCode)
    setSelectedCodes(updated)
    router.push(`/compare?countries=${updated.join(',')}`, { scroll: false })
  }

  // Quick preset selector
  const loadPreset = (presetCodes: string[]) => {
    setSelectedCodes(presetCodes)
    router.push(`/compare?countries=${presetCodes.join(',')}`, { scroll: false })
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header & Title Section */}
      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to CyberLaw Atlas Search</span>
        </Link>
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/60 px-3.5 py-1 text-xs font-semibold text-cyan-300">
          <Scale className="h-3.5 w-3.5" />
          <span>Multi-Jurisdictional Comparative Legal Intelligence</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl font-sans">
          Compare Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">Cyber Laws</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-300">
          Analyze legal frameworks, data privacy regimes, statutory penalties, and UNCTAD baseline indicators side-by-side across sovereign jurisdictions.
        </p>
      </div>

      {/* Country Selection Toolbar */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-xl space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Shield className="h-5 w-5 text-cyan-400" />
              <span>Select Jurisdictions for Comparison (2 to 4)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Currently comparing {selectedCodes.length} of 4 max selected jurisdictions.
            </p>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium hidden sm:inline">Presets:</span>
            <button
              onClick={() => loadPreset(['IN', 'US', 'GB'])}
              className="rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-300 transition-colors"
            >
              🇮🇳 IN vs 🇺🇸 US vs 🇬🇧 GB
            </button>
            <button
              onClick={() => loadPreset(['DE', 'FR', 'GB'])}
              className="rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-300 transition-colors"
            >
              🇪🇺 EU / UK Trio (DE, FR, GB)
            </button>
            <button
              onClick={() => loadPreset(['JP', 'KR', 'SG'])}
              className="rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-300 transition-colors"
            >
              🌏 APAC Hubs (JP, KR, SG)
            </button>
          </div>
        </div>

        {/* Selected Chips & Add Country Dropdown */}
        <div className="flex flex-wrap items-center gap-3">
          {selectedCodes.map((code) => {
            const meta = initialCountriesList.find((c) => c.isoCode === code)
            return (
              <div
                key={code}
                className="flex items-center gap-2 rounded-xl border border-cyan-500/40 bg-slate-950 px-3 py-2 text-sm font-semibold text-white shadow-md shadow-cyan-950/50"
              >
                <span className="text-xl">{meta?.flagEmoji || '🌐'}</span>
                <span>{meta?.name || code}</span>
                <span className="rounded bg-cyan-950 px-1.5 py-0.5 text-[11px] font-mono font-bold text-cyan-400 border border-cyan-800/60">
                  {code}
                </span>
                <button
                  onClick={() => handleRemoveCountry(code)}
                  className="p-1 text-slate-400 hover:text-red-400 transition-colors ml-1 cursor-pointer"
                  title="Remove from comparison"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )
          })}

          {/* Autocomplete Add Selector */}
          {selectedCodes.length < 4 && (
            <div ref={dropdownRef} className="relative flex-1 min-w-[240px]">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setIsDropdownOpen(true)
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  placeholder="+ Add another jurisdiction..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/80 pl-9 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition-all"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              </div>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-y-auto rounded-xl border border-slate-800 bg-slate-900 shadow-2xl divide-y divide-slate-800/60">
                  {filteredSuggestions.length > 0 ? (
                    filteredSuggestions.map((c) => (
                      <button
                        key={c.isoCode}
                        onClick={() => handleAddCountry(c.isoCode)}
                        className="w-full flex items-center justify-between px-3 py-2.5 text-left text-xs hover:bg-slate-800/80 transition-colors group cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{c.flagEmoji}</span>
                          <span className="font-medium text-white group-hover:text-cyan-300">
                            {c.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">({c.isoCode})</span>
                        </div>
                        <span className="text-[11px] text-slate-400">{c.region}</span>
                      </button>
                    ))
                  ) : (
                    <div className="p-3 text-center text-xs text-slate-400">
                      No additional matching jurisdictions found.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Error Alert Banner */}
      {error && (
        <div className="rounded-2xl border border-red-500/40 bg-red-950/30 p-4 text-sm text-red-300 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Status Key & Methodology Legend */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-cyan-400 shrink-0" />
          <span className="font-semibold text-white">Coverage Methodology Status:</span>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-medium">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            Verified Statutory Instruments Documented
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-medium">
            <Layers className="h-3.5 w-3.5 text-cyan-400" />
            UNCTAD Baseline: Legislation Exists
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-950/60 border border-amber-500/30 text-amber-300 font-medium">
            <Clock className="h-3.5 w-3.5 text-amber-400" />
            Pending Detailed Statutory Research
          </span>
        </div>
      </div>

      {/* Comparison Matrix Table */}
      {loading ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-16 text-center space-y-4">
          <RefreshCw className="h-10 w-10 text-cyan-400 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-300">Generating comparative legal matrix...</p>
        </div>
      ) : comparisonData ? (
        <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              {/* Sticky Header */}
              <thead className="bg-slate-950/90 border-b border-slate-800 sticky top-0 z-20 backdrop-blur-md">
                <tr>
                  <th className="p-4 sm:p-6 text-xs font-bold uppercase tracking-wider text-slate-400 w-1/4 min-w-[220px]">
                    Legal Category & UNCTAD Area
                  </th>
                  {comparisonData.selectedCountries.map((country) => (
                    <th key={country.isoCode} className="p-4 sm:p-6 text-center border-l border-slate-800 min-w-[240px]">
                      <div className="flex flex-col items-center gap-1.5">
                        <span className="text-3xl sm:text-4xl">{country.flagEmoji}</span>
                        <span className="text-base font-bold text-white">{country.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-cyan-950 px-2 py-0.5 text-xs font-mono font-bold text-cyan-400 border border-cyan-800/50">
                            {country.isoCode}
                          </span>
                          <span className="text-xs text-slate-400">
                            {country.instrumentCount || country.lawCount || 0} Instruments
                          </span>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Rows for 9 Categories */}
              <tbody className="divide-y divide-slate-800/80">
                {comparisonData.categories.map((cat, idx) => (
                  <tr
                    key={cat.categoryKey}
                    className={idx % 2 === 0 ? 'bg-slate-900/40 hover:bg-slate-800/40 transition-colors' : 'bg-slate-950/40 hover:bg-slate-800/40 transition-colors'}
                  >
                    {/* Category Title & Description */}
                    <td className="p-4 sm:p-6 align-top">
                      <div className="space-y-1.5">
                        <div className="font-bold text-white text-base flex items-center gap-2">
                          <FileText className="h-4 w-4 text-cyan-400 shrink-0" />
                          <span>{cat.categoryName}</span>
                        </div>
                        {cat.unctadBaseline && (
                          <span className="inline-flex items-center gap-1 rounded bg-cyan-950/80 px-2 py-0.5 text-[10px] font-mono text-cyan-400 border border-cyan-800/50">
                            UNCTAD Core Pillar
                          </span>
                        )}
                        <p className="text-xs text-slate-400 leading-relaxed pt-1">
                          {cat.description}
                        </p>
                      </div>
                    </td>

                    {/* Country Results Cells */}
                    {comparisonData.selectedCountries.map((country) => {
                      const res = cat.countryResults[country.isoCode]
                      if (!res) return null

                      return (
                        <td
                          key={country.isoCode}
                          className="p-4 sm:p-6 align-top border-l border-slate-800/80 text-center"
                        >
                          {res.hasLaw && res.instruments.length > 0 ? (
                            <div className="space-y-3">
                              {/* Status Badge */}
                              <div className="flex justify-center">
                                {res.verifiedCount > 0 ? (
                                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-950/80 px-3 py-1.5 text-xs font-semibold text-emerald-300 border border-emerald-500/40 shadow-md">
                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                                    <span>{res.verifiedCount} Verified Instrument(s)</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-amber-950/60 px-3 py-1.5 text-xs font-semibold text-amber-300 border border-amber-500/40 shadow-md">
                                    <Clock className="h-3.5 w-3.5 text-amber-400" />
                                    <span>{res.instruments.length} Baseline (Under Review)</span>
                                  </span>
                                )}
                              </div>

                              {/* Instrument Previews */}
                              <div className="space-y-2 text-left">
                                {res.instruments.slice(0, 2).map((inst) => (
                                  <div
                                    key={inst.id}
                                    className="rounded-xl border border-slate-800 bg-slate-950/70 p-2.5 text-xs space-y-1"
                                  >
                                    <div className="font-semibold text-slate-200 line-clamp-1">
                                      {inst.title}
                                    </div>
                                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                                      <span>Enacted: {inst.year || 'N/A'}</span>
                                      <span className="text-cyan-400 font-mono text-[10px]">
                                        {inst.instrumentType}
                                      </span>
                                    </div>
                                    {inst.authority && (
                                      <div className="text-[10px] text-slate-400 line-clamp-1">
                                        Auth: {inst.authority}
                                      </div>
                                    )}
                                  </div>
                                ))}

                                {res.instruments.length > 2 && (
                                  <div className="text-[11px] text-cyan-400 text-center font-medium">
                                    + {res.instruments.length - 2} more instrument(s)
                                  </div>
                                )}
                              </div>

                              {/* Inspect Button */}
                              <button
                                onClick={() =>
                                  setActiveModalData({
                                    country,
                                    categoryName: cat.categoryName,
                                    instruments: res.instruments,
                                    coverageStatus: res.coverageStatus,
                                    researchNotes: res.researchNotes,
                                  })
                                }
                                className="w-full inline-flex items-center justify-center gap-1 rounded-lg border border-slate-700 bg-slate-800/90 py-1.5 px-3 text-xs font-semibold text-slate-200 hover:border-cyan-500/50 hover:bg-slate-800 hover:text-white transition-all cursor-pointer"
                              >
                                <span>View Provisions & Sanctions</span>
                                <ChevronRight className="h-3.5 w-3.5 text-cyan-400" />
                              </button>
                            </div>
                          ) : (
                            /* Unresearched or Baseline Only Cell */
                            <div className="space-y-2 py-2">
                              <div className="flex justify-center">
                                <span className="inline-flex items-center gap-1 rounded-xl bg-slate-950 px-2.5 py-1 text-xs font-medium text-slate-400 border border-slate-800">
                                  <Clock className="h-3 w-3 text-amber-400" />
                                  <span>Pending Research</span>
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400 leading-snug max-w-[200px] mx-auto">
                                {cat.unctadBaseline
                                  ? `UNCTAD Baseline: ${res.unctadBaselineStatus || 'Legislation exists'}. Individual statutes pending research in Atlas.`
                                  : 'Not yet documented in this database.'}
                              </p>
                            </div>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {/* Law & Provision Details Modal */}
      {activeModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-6">
            <button
              onClick={() => setActiveModalData(null)}
              className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-1.5 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-3xl">{activeModalData.country.flagEmoji}</span>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {activeModalData.country.name} — {activeModalData.categoryName}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {activeModalData.instruments.length} Documented Statutory Instrument(s)
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Instruments List */}
            <div className="space-y-6">
              {activeModalData.instruments.map((inst) => (
                <div
                  key={inst.id}
                  className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 space-y-3"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-800/80 pb-3">
                    <div>
                      <h4 className="text-base font-bold text-white">{inst.title}</h4>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 pt-1.5">
                        <span className="rounded bg-slate-900 px-2 py-0.5 border border-slate-800 text-cyan-300 font-mono">
                          {inst.instrumentType}
                        </span>
                        {inst.scope && (
                          <span className="rounded bg-slate-900 px-2 py-0.5 border border-slate-800 text-slate-300 font-sans text-[11px]">
                            {inst.scope}
                          </span>
                        )}
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-cyan-400" />
                          Enacted {inst.year || 'N/A'}
                        </span>
                        <span>•</span>
                        {inst.verificationStatus === 'VERIFIED' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                            <CheckCircle2 className="h-3 w-3" />
                            Independently Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-300">
                            <Clock className="h-3 w-3" />
                            Official Source Cited (Under Review)
                          </span>
                        )}
                      </div>
                    </div>

                    {inst.officialUrl && (
                      <a
                        href={inst.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg border border-cyan-500/30 bg-cyan-950/60 px-2.5 py-1 text-xs font-medium text-cyan-300 hover:bg-cyan-900/60 transition-colors shrink-0"
                      >
                        <span>{inst.isDirectSource ? 'Direct Gazette / Text' : 'Official Portal'}</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>

                  {/* Summary */}
                  <div className="space-y-1 text-xs text-slate-300">
                    <p className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                      Summary
                    </p>
                    <p className="leading-relaxed">{inst.summary}</p>
                  </div>

                  {/* Structured Provisions */}
                  {inst.provisions && inst.provisions.length > 0 ? (
                    <div className="space-y-2 pt-2 border-t border-slate-800/60">
                      <p className="font-semibold text-slate-400 uppercase tracking-wider text-[10px] flex items-center gap-1">
                        <FileText className="h-3 w-3 text-cyan-400" />
                        Key Provisions & Legal Sanctions
                      </p>
                      <ul className="space-y-2 text-xs text-slate-300">
                        {inst.provisions.map((p, pIdx) => (
                          <li key={pIdx} className="rounded-lg bg-slate-900/90 p-2.5 border border-slate-800/80 space-y-1">
                            <div className="flex items-start gap-2">
                              <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                              <div className="flex-1">
                                {p.articleNumber && (
                                  <span className="font-mono font-bold text-cyan-400 mr-2">
                                    [{p.articleNumber}]
                                  </span>
                                )}
                                <span>{p.content}</span>
                              </div>
                            </div>
                            {p.penaltyDetails && (
                              <div className="text-[11px] text-rose-300 pl-5">
                                <strong>Sanction:</strong> {p.penaltyDetails}
                              </div>
                            )}
                            {p.reportingMandate && (
                              <div className="text-[11px] text-blue-300 pl-5">
                                <strong>Notification Rule:</strong> {p.reportingMandate}
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : inst.keyProvisions ? (
                    <div className="space-y-1 text-xs text-slate-300 pt-2 border-t border-slate-800/60">
                      <p className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                        Provisions
                      </p>
                      <p className="leading-relaxed">{inst.keyProvisions}</p>
                    </div>
                  ) : null}

                  {/* Authority */}
                  <div className="flex items-center gap-2 text-xs text-slate-400 pt-2 border-t border-slate-800/60">
                    <Building2 className="h-3.5 w-3.5 text-slate-400" />
                    <span>Enforcing Authority:</span>
                    <span className="text-slate-300 font-medium">{inst.authority}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => setActiveModalData(null)}
                className="rounded-xl bg-cyan-500 px-6 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-colors cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default CompareView
