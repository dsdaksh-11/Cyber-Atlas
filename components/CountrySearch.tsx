'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Globe, ArrowRight, ShieldCheck, X } from 'lucide-react'
import { normalizeCountryCode } from '@/lib/country-utils'

interface SearchItem {
  id: string
  name: string
  isoCode: string
  region: string
  flagEmoji: string
  _count?: { laws: number }
}

const FEATURED_SUGGESTIONS: SearchItem[] = [
  { id: 'in', name: 'India', isoCode: 'IN', region: 'Asia-Pacific', flagEmoji: '🇮🇳' },
  { id: 'us', name: 'United States', isoCode: 'US', region: 'Americas', flagEmoji: '🇺🇸' },
  { id: 'gb', name: 'United Kingdom', isoCode: 'GB', region: 'Europe', flagEmoji: '🇬🇧' },
  { id: 'cn', name: 'China', isoCode: 'CN', region: 'Asia-Pacific', flagEmoji: '🇨🇳' },
]

export function CountrySearch() {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [allCountries, setAllCountries] = useState<SearchItem[]>(FEATURED_SUGGESTIONS)
  const router = useRouter()
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Fetch available countries from API for complete autocomplete
  useEffect(() => {
    async function loadCountries() {
      try {
        const res = await fetch('/api/countries')
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data) && data.length > 0) {
            setAllCountries(data)
          }
        }
      } catch (err) {
        console.error('Error preloading countries:', err)
      }
    }
    loadCountries()
  }, [])

  // Derive autocomplete suggestions dynamically based on query
  const suggestions = React.useMemo(() => {
    if (!query.trim()) {
      return allCountries
    }
    const q = query.trim().toLowerCase()
    return allCountries.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.isoCode.toLowerCase() === q ||
        c.isoCode.toLowerCase().startsWith(q) ||
        c.region.toLowerCase().includes(q)
    )
  }, [query, allCountries])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    if (!query.trim()) return

    const resolvedIso = normalizeCountryCode(query)
    setIsOpen(false)
    router.push(`/country/${resolvedIso}`)
  }

  const handleSelectCountry = (isoCode: string) => {
    setIsOpen(false)
    router.push(`/country/${isoCode}`)
  }

  return (
    <div ref={wrapperRef} className="relative w-full max-w-3xl mx-auto">
      {/* Search Input Box */}
      <form
        onSubmit={handleSearch}
        className="relative flex items-center rounded-2xl border border-cyan-500/30 bg-slate-900/90 p-2 shadow-2xl shadow-cyan-950/40 backdrop-blur-xl focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all duration-300"
      >
        <div className="flex items-center pl-3.5 pr-2 text-cyan-400">
          <Search className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search by country (e.g. India, United States, China) or ISO code (IN, US, CN, GB)..."
          className="w-full bg-transparent px-2 py-3 text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none"
        />

        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="p-1.5 text-slate-400 hover:text-white transition-colors mr-1"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <button
          type="submit"
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 hover:brightness-110 active:scale-95 transition-all"
        >
          <span>Search</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      {/* Quick Search Chips */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
        <span className="flex items-center gap-1 font-medium text-slate-400">
          <Globe className="h-3.5 w-3.5 text-cyan-400" />
          Try ISO codes or names:
        </span>
        {FEATURED_SUGGESTIONS.map((item) => (
          <button
            key={item.isoCode}
            type="button"
            onClick={() => handleSelectCountry(item.isoCode)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/80 px-2.5 py-1 text-slate-300 hover:border-cyan-500/40 hover:bg-slate-800 hover:text-cyan-300 transition-all cursor-pointer"
          >
            <span>{item.flagEmoji}</span>
            <span className="font-semibold">{item.name}</span>
            <span className="rounded bg-slate-800 px-1 py-0.2 text-[10px] font-mono text-cyan-400">
              {item.isoCode}
            </span>
          </button>
        ))}
      </div>

      {/* Autocomplete Dropdown List */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/95 shadow-2xl shadow-black/80 backdrop-blur-2xl">
          <div className="p-2 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400 px-3">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
              Jurisdiction Suggestions ({suggestions.length})
            </span>
            <span>Press Enter to Search</span>
          </div>

          {suggestions.length > 0 ? (
            <div className="max-h-64 overflow-y-auto divide-y divide-slate-800/50">
              {suggestions.map((c) => (
                <button
                  key={c.isoCode}
                  type="button"
                  onClick={() => handleSelectCountry(c.isoCode)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-800/70 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{c.flagEmoji}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white group-hover:text-cyan-300 transition-colors">
                          {c.name}
                        </span>
                        <span className="rounded bg-cyan-950 px-1.5 py-0.5 text-[11px] font-mono font-semibold text-cyan-400 border border-cyan-800/50">
                          {c.isoCode}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400">{c.region} Jurisdiction</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {c._count?.laws !== undefined && (
                      <span className="text-xs text-slate-400 bg-slate-950 px-2 py-1 rounded-md border border-slate-800">
                        {c._count.laws} Cyber Laws
                      </span>
                    )}
                    <ArrowRight className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:text-cyan-400 transition-all transform group-hover:translate-x-1" />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-slate-400">
              No matching country or ISO code found for &quot;{query}&quot;. Try standard codes like IN, US, GB, CN.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
export default CountrySearch
