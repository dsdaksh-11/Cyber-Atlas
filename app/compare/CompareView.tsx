'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  Scale,
  Plus,
  X,
  Search,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Shield,
  FileText,
  Building2,
  Calendar,
  Sparkles,
  RefreshCw,
  Info,
  ArrowLeft,
} from 'lucide-react'

interface CountryMeta {
  id: string
  name: string
  isoCode: string
  region: string
  flagEmoji: string
  lawCount?: number
}

interface LawDetail {
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
  availabilityStatus: string
}

interface CategoryCellResult {
  status: 'comprehensive' | 'specific' | 'partial' | 'unavailable' | 'unknown'
  statusLabel: string
  hasLaw: boolean
  laws: LawDetail[]
}

interface CategoryComparison {
  categoryKey: string
  categoryName: string
  description: string
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
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Autocomplete state
  const [searchQuery, setSearchQuery] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Modal active law state
  const [activeModalLaw, setActiveModalLaw] = useState<{
    country: CountryMeta
    categoryName: string
    laws: LawDetail[]
  } | null>(null)

  // Fetch comparison matrix from API
  const fetchComparison = async (codes: string[]) => {
    if (codes.length < 2 || codes.length > 4) {
      setError('Please select between 2 and 4 countries to generate a comparison matrix.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/compare?countries=${codes.join(',')}`)
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch comparison data')
      }

      setComparisonData(data)
    } catch (err: any) {
      setError(err.message || 'An error occurred while loading comparison matrix.')
    } finally {
      setLoading(false)
    }
  }

  // Load comparison on mount and code updates
  useEffect(() => {
    fetchComparison(selectedCodes)
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
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/60 px-3 py-1 text-xs font-semibold text-cyan-300">
          <Scale className="h-3.5 w-3.5" />
          <span>Multi-Jurisdictional Comparative Matrix</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl font-sans">
          Compare Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">Cyber Laws</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-300">
          Analyze legal frameworks, data protection mandates, and cybercrime penalties side-by-side across 2 to 4 countries aligned with UNCTAD taxonomy.
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
                  className="p-1 text-slate-400 hover:text-red-400 transition-colors ml-1"
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
                  placeholder="+ Add another country (e.g. Germany, Japan, Brazil)..."
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

      {/* Legend & Tooltip Explanation */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-cyan-400 shrink-0" />
          <span className="font-semibold text-white">Status Key & Taxonomy:</span>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-medium">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            Comprehensive Legislation
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-medium">
            <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />
            Specific Statute Exists
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-950/60 border border-amber-500/30 text-amber-300 font-medium">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
            Partial / Sector-Specific
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-950/60 border border-slate-700 text-slate-400 font-medium">
            <X className="h-3.5 w-3.5 text-slate-500" />
            Information Not Available
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
                  <th className="p-4 sm:p-6 text-xs font-bold uppercase tracking-wider text-slate-400 w-1/4 min-w-[200px]">
                    Legal Subject Area
                  </th>
                  {comparisonData.selectedCountries.map((country) => (
                    <th key={country.isoCode} className="p-4 sm:p-6 text-center border-l border-slate-800 min-w-[220px]">
                      <div className="flex flex-col items-center gap-1.5">
                        <span className="text-3xl sm:text-4xl">{country.flagEmoji}</span>
                        <span className="text-base font-bold text-white">{country.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-cyan-950 px-2 py-0.5 text-xs font-mono font-bold text-cyan-400 border border-cyan-800/50">
                            {country.isoCode}
                          </span>
                          <span className="text-xs text-slate-400">
                            {country.lawCount} Laws
                          </span>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Rows for 9 Standard Categories */}
              <tbody className="divide-y divide-slate-800/80">
                {comparisonData.categories.map((cat, idx) => (
                  <tr
                    key={cat.categoryKey}
                    className={idx % 2 === 0 ? 'bg-slate-900/40 hover:bg-slate-800/40 transition-colors' : 'bg-slate-950/40 hover:bg-slate-800/40 transition-colors'}
                  >
                    {/* Category Title & Description */}
                    <td className="p-4 sm:p-6 align-top">
                      <div className="space-y-1">
                        <div className="font-bold text-white text-base flex items-center gap-2">
                          <FileText className="h-4 w-4 text-cyan-400 shrink-0" />
                          <span>{cat.categoryName}</span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
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
                          {res.hasLaw ? (
                            <div className="space-y-3">
                              {/* Status Badge */}
                              {res.status === 'comprehensive' && (
                                <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-950/80 px-3 py-1.5 text-xs font-semibold text-emerald-300 border border-emerald-500/40 shadow-md">
                                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                  <span>Comprehensive</span>
                                </span>
                              )}

                              {res.status === 'specific' && (
                                <span className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-950/80 px-3 py-1.5 text-xs font-semibold text-cyan-300 border border-cyan-500/40 shadow-md">
                                  <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                                  <span>Specific Law</span>
                                </span>
                              )}

                              {res.status === 'partial' && (
                                <span className="inline-flex items-center gap-1.5 rounded-xl bg-amber-950/80 px-3 py-1.5 text-xs font-semibold text-amber-300 border border-amber-500/40 shadow-md">
                                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                                  <span>Sector Specific</span>
                                </span>
                              )}

                              {/* Law Previews & Inspect Button */}
                              <div className="space-y-2 text-left">
                                {res.laws.slice(0, 2).map((law) => (
                                  <div
                                    key={law.id}
                                    className="rounded-xl border border-slate-800 bg-slate-950/70 p-2.5 text-xs space-y-1"
                                  >
                                    <div className="font-semibold text-slate-200 line-clamp-1">
                                      {law.title}
                                    </div>
                                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                                      <span>Enacted: {law.year}</span>
                                      <span className="text-cyan-400 font-mono">{law.category}</span>
                                    </div>
                                  </div>
                                ))}

                                <button
                                  onClick={() =>
                                    setActiveModalLaw({
                                      country,
                                      categoryName: cat.categoryName,
                                      laws: res.laws,
                                    })
                                  }
                                  className="w-full flex items-center justify-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 hover:underline py-1 transition-colors cursor-pointer"
                                >
                                  <span>View Detailed Statute ({res.laws.length})</span>
                                  <ChevronRight className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="py-4 space-y-2">
                              <span className="inline-flex items-center gap-1 rounded-xl bg-slate-950 px-3 py-1.5 text-xs font-semibold text-slate-300 border border-slate-800">
                                <X className="h-3.5 w-3.5 text-slate-400" />
                                <span>Information Not Available</span>
                              </span>
                              <p className="text-[11px] text-slate-300 max-w-[180px] mx-auto">
                                No specific statutory record currently ingested in our database.
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

      {/* Detailed Modal Drawer */}
      {activeModalLaw && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-cyan-500/40 bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{activeModalLaw.country.flagEmoji}</span>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {activeModalLaw.country.name} ({activeModalLaw.country.isoCode})
                  </h3>
                  <p className="text-xs text-cyan-400 font-semibold">
                    Category: {activeModalLaw.categoryName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveModalLaw(null)}
                className="rounded-xl border border-slate-800 p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body: Law Details */}
            <div className="space-y-6">
              {activeModalLaw.laws.map((law) => (
                <div
                  key={law.id}
                  className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4 shadow-inner"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                    <h4 className="text-base font-bold text-white">{law.title}</h4>
                    <span className="rounded-md bg-cyan-950 px-2.5 py-1 text-xs font-semibold text-cyan-300 border border-cyan-800/60">
                      Enacted {law.year}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 text-cyan-400" />
                      Statutory Summary
                    </h5>
                    <p className="text-xs text-slate-300 leading-relaxed">{law.summary}</p>
                  </div>

                  {law.keyProvisions && (
                    <div className="space-y-2">
                      <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                        Key Legal Provisions
                      </h5>
                      <div className="rounded-xl bg-slate-900/90 p-3 text-xs text-slate-300 border border-slate-800/80 leading-relaxed font-mono">
                        {law.keyProvisions}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800/80 text-xs">
                    <div>
                      <span className="text-slate-400 flex items-center gap-1">
                        <Building2 className="h-3.5 w-3.5 text-cyan-400" />
                        Enforcing Authority:
                      </span>
                      <span className="font-semibold text-slate-200 mt-0.5 block">
                        {law.authority}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-cyan-400" />
                        Last Source Update:
                      </span>
                      <span className="font-semibold text-slate-200 mt-0.5 block">
                        {law.lastUpdated}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    {law.officialUrl && (
                      <a
                        href={law.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 hover:underline"
                      >
                        <span>Official Legislation Source</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                    {law.sourceName && (
                      <span className="text-[11px] text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                        Source: {law.sourceName}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-right">
              <button
                onClick={() => setActiveModalLaw(null)}
                className="rounded-xl bg-slate-800 px-5 py-2.5 text-xs font-semibold text-white hover:bg-slate-700 transition-colors"
              >
                Close Statute Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default CompareView
