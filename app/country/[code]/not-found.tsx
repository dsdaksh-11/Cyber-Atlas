import React from 'react'
import Link from 'next/link'
import { AlertCircle, ArrowLeft, Search, Globe, ShieldQuestion } from 'lucide-react'

export default function CountryNotFound() {
  const suggestedCountries = [
    { name: 'India', isoCode: 'IN', flag: '🇮🇳' },
    { name: 'United States', isoCode: 'US', flag: '🇺🇸' },
    { name: 'United Kingdom', isoCode: 'GB', flag: '🇬🇧' },
    { name: 'China', isoCode: 'CN', flag: '🇨🇳' },
  ]

  return (
    <div className="relative min-h-[80vh] cyber-grid flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full rounded-3xl border border-slate-800 bg-slate-900/90 p-8 sm:p-12 shadow-2xl backdrop-blur-xl text-center space-y-8">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 shadow-xl">
          <ShieldQuestion className="h-10 w-10" />
        </div>

        <div className="space-y-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-950/80 px-3 py-1 text-xs font-semibold text-rose-400 border border-rose-800/60">
            <AlertCircle className="h-3.5 w-3.5" />
            Jurisdiction Not Found
          </span>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            We currently do not have cyber law information available for this country.
          </h1>

          <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            The requested country or ISO code was not located in our current legal intelligence database. Please check your search parameters:
          </p>
        </div>

        {/* Helpful Tips */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 text-left text-xs text-slate-300 space-y-2">
          <h3 className="font-semibold text-white text-sm flex items-center gap-2">
            <Globe className="h-4 w-4 text-cyan-400" /> Suggestions for your search:
          </h3>
          <ul className="list-disc list-inside space-y-1 text-slate-400">
            <li>Verify the 2-letter ISO 3166-1 alpha-2 country code (e.g. <strong>IN</strong> for India, <strong>CN</strong> for China, <strong>US</strong> for United States, <strong>GB</strong> for United Kingdom).</li>
            <li>Try searching using the full official country name.</li>
            <li>Note: Avoid non-standard codes (e.g. use <strong>CN</strong> for China, not CH which is Switzerland).</li>
          </ul>
        </div>

        {/* Suggested Jurisdictions */}
        <div className="space-y-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Available Index Jurisdictions
          </span>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {suggestedCountries.map((c) => (
              <Link
                key={c.isoCode}
                href={`/country/${c.isoCode}`}
                className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs font-medium text-slate-200 hover:border-cyan-500 hover:text-cyan-300 transition-all"
              >
                <span>{c.flag}</span>
                <span>{c.name}</span>
                <span className="rounded bg-cyan-950 px-1.5 py-0.5 text-[10px] font-mono font-bold text-cyan-400">
                  {c.isoCode}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Home search button */}
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 hover:brightness-110 transition-all"
          >
            <Search className="h-4 w-4" />
            <span>Return to Global Search</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
