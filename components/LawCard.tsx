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
  Scale,
  Clock,
  Bookmark,
} from 'lucide-react'

export interface LawCardInstrument {
  id: string
  title: string
  officialTitle?: string | null
  shortTitle?: string | null
  instrumentType?: string
  year?: number | null
  category: string
  summary: string
  keyProvisions?: string
  authority: string
  officialUrl?: string | null
  sourceName?: string | null
  sourceUrl?: string | null
  lastUpdated?: string | null
  verificationStatus?: string
  isSampleData?: boolean
  provisions?: Array<{
    id?: string
    articleNumber?: string | null
    heading?: string | null
    content: string
    penaltyDetails?: string | null
    reportingMandate?: string | null
  }>
  sources?: Array<{
    id?: string
    name: string
    url: string
    sourceType?: string
    isOfficial?: boolean
  }>
}

interface LawCardProps {
  law: LawCardInstrument
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
  'Data Protection & Privacy': {
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
  'Cybersecurity Framework': {
    bg: 'bg-cyan-950/80',
    text: 'text-cyan-400',
    border: 'border-cyan-800/50',
  },
  'Electronic Transactions': {
    bg: 'bg-amber-950/80',
    text: 'text-amber-400',
    border: 'border-amber-800/50',
  },
  'Electronic Transactions & E-Commerce': {
    bg: 'bg-amber-950/80',
    text: 'text-amber-400',
    border: 'border-amber-800/50',
  },
  'Online Fraud': {
    bg: 'bg-orange-950/80',
    text: 'text-orange-400',
    border: 'border-orange-800/50',
  },
  'Online Fraud & Financial Cybercrime': {
    bg: 'bg-orange-950/80',
    text: 'text-orange-400',
    border: 'border-orange-800/50',
  },
  'Critical Infrastructure': {
    bg: 'bg-blue-950/80',
    text: 'text-blue-400',
    border: 'border-blue-800/50',
  },
  'Critical Infrastructure Protection': {
    bg: 'bg-blue-950/80',
    text: 'text-blue-400',
    border: 'border-blue-800/50',
  },
  'Digital Evidence': {
    bg: 'bg-teal-950/80',
    text: 'text-teal-400',
    border: 'border-teal-800/50',
  },
  'Digital Evidence & Forensics': {
    bg: 'bg-teal-950/80',
    text: 'text-teal-400',
    border: 'border-teal-800/50',
  },
}

function formatInstrumentType(type?: string): string {
  if (!type) return 'Statutory Act'
  switch (type.toUpperCase()) {
    case 'ACT':
      return 'Statutory Act'
    case 'CODE_PROVISION':
      return 'Penal Code Provision'
    case 'REGULATION':
      return 'Subordinate Regulation'
    case 'DIRECTIVE':
      return 'Regulatory Directive'
    case 'DECREE':
      return 'Executive Decree'
    case 'AMENDMENT':
      return 'Legislative Amendment'
    case 'SECTOR_REGULATION':
      return 'Sector-Specific Rule'
    case 'TREATY':
      return 'International Treaty'
    case 'STRATEGY':
      return 'National Strategy'
    default:
      return type
  }
}

export interface LawProvisionItem {
  id?: string
  articleNumber?: string | null
  heading?: string | null
  content: string
  penaltyDetails?: string | null
  reportingMandate?: string | null
}

export function LawCard({ law }: LawCardProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  // Use structured provisions if available, fallback to pipe-split
  const structuredProvisions: LawProvisionItem[] = law.provisions && law.provisions.length > 0
    ? law.provisions
    : (law.keyProvisions
        ? law.keyProvisions.split('|').map((p, idx) => ({
            id: `p-${idx}`,
            articleNumber: null,
            content: p.trim(),
            heading: p.includes(':') ? p.split(':')[0].trim() : null,
            penaltyDetails: null,
            reportingMandate: null,
          }))
        : [])

  const categoryStyle = CATEGORY_STYLES[law.category] || {
    bg: 'bg-slate-800',
    text: 'text-slate-300',
    border: 'border-slate-700',
  }

  const isVerified = law.verificationStatus === 'VERIFIED' && !law.isSampleData

  return (
    <div className="group rounded-2xl border border-slate-800/90 bg-slate-900/80 p-6 shadow-xl shadow-black/40 backdrop-blur-md hover:border-cyan-500/40 transition-all duration-300">
      {/* Header Row */}
      <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-800/60">
        <div className="space-y-2 flex-1 min-w-[280px]">
          <div className="flex flex-wrap items-center gap-2">
            {/* Category badge */}
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border}`}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              {law.category}
            </span>

            {/* Instrument Typology badge */}
            {law.instrumentType && (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-950 px-2.5 py-1 text-xs font-mono font-medium text-cyan-300 border border-slate-800">
                <Bookmark className="h-3 w-3 text-cyan-400" />
                {formatInstrumentType(law.instrumentType)}
              </span>
            )}

            {/* Enactment Year badge */}
            {law.year && (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-950 px-2.5 py-1 text-xs font-medium text-slate-300 border border-slate-800">
                <Calendar className="h-3.5 w-3.5 text-cyan-400" />
                Enacted {law.year}
              </span>
            )}

            {/* Verification tag */}
            {isVerified ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-950/60 px-2.5 py-0.5 text-[11px] font-medium text-emerald-400 border border-emerald-800/40">
                <CheckCircle2 className="h-3 w-3" /> Verified Official Source
              </span>
            ) : law.isSampleData ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-950/60 px-2 py-0.5 text-[10px] font-medium text-amber-400 border border-amber-800/40">
                <Info className="h-3 w-3" /> Sample Legal Data
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-400 border border-slate-700">
                Pending Verification
              </span>
            )}
          </div>

          {/* Title */}
          <div>
            <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
              {law.title}
            </h3>
            {law.officialTitle && law.officialTitle !== law.title && (
              <p className="text-xs text-slate-400 italic pt-0.5">
                Official Title: {law.officialTitle}
              </p>
            )}
          </div>
        </div>

        {/* Action Button: Official Source Link */}
        {law.officialUrl && (
          <a
            href={law.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-950/40 px-3.5 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-900/60 hover:border-cyan-400 transition-all shrink-0 shadow-sm"
          >
            <span>Official Gazette / Portal</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>

      {/* Summary / Description */}
      <div className="py-4 space-y-2">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Executive Legal Summary
        </h4>
        <p className="text-sm text-slate-300 leading-relaxed">{law.summary}</p>
      </div>

      {/* Key Provisions */}
      {structuredProvisions.length > 0 && (
        <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4 space-y-3">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between text-xs font-semibold text-slate-300 hover:text-cyan-300 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-cyan-400" />
              Structured Provisions & Statutory Mandates ({structuredProvisions.length})
            </span>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-slate-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-slate-400" />
            )}
          </button>

          {isExpanded && (
            <ul className="space-y-3 pt-2 border-t border-slate-800/60">
              {structuredProvisions.map((provision, idx) => (
                <li key={provision.id || idx} className="space-y-1">
                  <div className="flex items-start gap-2 text-xs text-slate-200">
                    <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <div className="space-y-1 flex-1">
                      {provision.articleNumber && (
                        <span className="font-mono font-bold text-cyan-400 mr-2">
                          [{provision.articleNumber}]
                        </span>
                      )}
                      <span className="leading-relaxed">{provision.content}</span>
                      
                      {/* Specific penalty or reporting badges if present */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {provision.penaltyDetails && (
                          <span className="inline-flex items-center gap-1 rounded bg-rose-950/50 px-2 py-0.5 text-[10px] font-medium text-rose-300 border border-rose-800/40">
                            <Scale className="h-3 w-3 text-rose-400" /> Statutory Sanction Cited
                          </span>
                        )}
                        {provision.reportingMandate && (
                          <span className="inline-flex items-center gap-1 rounded bg-blue-950/50 px-2 py-0.5 text-[10px] font-medium text-blue-300 border border-blue-800/40">
                            <Clock className="h-3 w-3 text-blue-400" /> Incident Notification Rule
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
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
              Verified: {law.lastUpdated}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
export default LawCard
