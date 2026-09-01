'use client'

import React, { useState } from 'react'
import {
  FileText,
  Building2,
  Calendar,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Info,
  CheckCircle2,
} from 'lucide-react'

interface LawCardProps {
  law: {
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
    isSampleData?: boolean
  }
}

const CATEGORY_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  Cybercrime: {
    bg: 'bg-rose-950/80',
    text: 'text-rose-400',
    border: 'border-rose-800/50',
  },
  'Data Protection': {
    bg: 'bg-emerald-950/80',
    text: 'text-emerald-400',
    border: 'border-emerald-800/50',
  },
  Privacy: {
    bg: 'bg-violet-950/80',
    text: 'text-violet-400',
    border: 'border-violet-800/50',
  },
  Cybersecurity: {
    bg: 'bg-cyan-950/80',
    text: 'text-cyan-400',
    border: 'border-cyan-800/50',
  },
  'Electronic Transactions': {
    bg: 'bg-amber-950/80',
    text: 'text-amber-400',
    border: 'border-amber-800/50',
  },
  'Online Fraud': {
    bg: 'bg-orange-950/80',
    text: 'text-orange-400',
    border: 'border-orange-800/50',
  },
  'Critical Infrastructure': {
    bg: 'bg-blue-950/80',
    text: 'text-blue-400',
    border: 'border-blue-800/50',
  },
}

export function LawCard({ law }: LawCardProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const provisionsList = law.keyProvisions
    ? law.keyProvisions.split('|').map((p) => p.trim())
    : []

  const categoryStyle = CATEGORY_STYLES[law.category] || {
    bg: 'bg-slate-800',
    text: 'text-slate-300',
    border: 'border-slate-700',
  }

  return (
    <div className="group rounded-2xl border border-slate-800/90 bg-slate-900/80 p-6 shadow-xl shadow-black/40 backdrop-blur-md hover:border-cyan-500/40 transition-all duration-300">
      {/* Header Row */}
      <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-800/60">
        <div className="space-y-1.5 flex-1 min-w-[280px]">
          <div className="flex flex-wrap items-center gap-2">
            {/* Category badge */}
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border}`}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              {law.category}
            </span>

            {/* Enactment Year badge */}
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-950 px-2.5 py-1 text-xs font-medium text-slate-300 border border-slate-800">
              <Calendar className="h-3.5 w-3.5 text-cyan-400" />
              Enacted {law.year}
            </span>

            {/* Verification tag */}
            {law.isSampleData && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-950/60 px-2 py-0.5 text-[10px] font-medium text-amber-400 border border-amber-800/40">
                <Info className="h-3 w-3" /> Sample Legal Data
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug pt-1">
            {law.title}
          </h3>
        </div>

        {/* Action Button: Official Source Link */}
        {law.officialUrl && (
          <a
            href={law.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-950/40 px-3.5 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-900/60 hover:border-cyan-400 transition-all shrink-0"
          >
            <span>Official Portal</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>

      {/* Summary / Description */}
      <div className="py-4 space-y-2">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Executive Summary
        </h4>
        <p className="text-sm text-slate-300 leading-relaxed">{law.summary}</p>
      </div>

      {/* Key Provisions */}
      {provisionsList.length > 0 && (
        <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4 space-y-3">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between text-xs font-semibold text-slate-300 hover:text-cyan-300 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-cyan-400" />
              Key Provisions & Legal Clauses ({provisionsList.length})
            </span>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-slate-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-slate-400" />
            )}
          </button>

          {isExpanded && (
            <ul className="space-y-2 pt-1 border-t border-slate-800/60">
              {provisionsList.map((provision, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span className="leading-normal">{provision}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Footer Info: Authority, Source Attribution & Last Updated */}
      <div className="mt-4 pt-4 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-slate-400" />
          <span className="font-medium text-slate-300">Enforcing Authority:</span>
          <span className="text-slate-400">{law.authority}</span>
        </div>

        <div className="flex items-center gap-4">
          {law.sourceName && (
            <span className="text-slate-400">
              Source: <span className="text-slate-300 font-medium">{law.sourceName}</span>
            </span>
          )}

          {law.lastUpdated && (
            <span className="rounded bg-slate-950 px-2 py-0.5 text-[11px] text-slate-400 border border-slate-800">
              Updated: {law.lastUpdated}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
export default LawCard
