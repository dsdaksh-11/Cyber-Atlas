'use client'

import React from 'react'
import { Database, ShieldAlert, CheckCircle2, Scale, ExternalLink } from 'lucide-react'

export function IngestionBanner() {
  return (
    <section id="architecture" className="my-16 rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950/40 p-8 sm:p-10 shadow-2xl relative overflow-hidden">
      {/* Decorative cyber grid accent */}
      <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
            <Database className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-white">Data Sources & Ingestion Architecture</h2>
              <span className="rounded-full bg-cyan-950 px-3 py-1 text-xs font-semibold text-cyan-300 border border-cyan-800">
                UNCTAD Aligned
              </span>
            </div>
            <p className="text-sm text-slate-400">
              Future-ready, verified legal data pipeline ensuring zero hallucination and 100% source attribution.
            </p>
          </div>
        </div>

        {/* 6 Step Pipeline Process */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 pt-2">
          {[
            { step: '01', title: 'Trusted Sources', desc: 'UNCTAD & National Gazettes' },
            { step: '02', title: 'Data Review', desc: 'Legal expert validation' },
            { step: '03', title: 'Normalization', desc: 'ISO 3166-1 standard mapping' },
            { step: '04', title: 'Categorization', desc: 'Cybercrime & Privacy taxonomy' },
            { step: '05', title: 'DB Storage', desc: 'Prisma ORM schema index' },
            { step: '06', title: 'Attribution', desc: 'Preserves official URL & date' },
          ].map((item) => (
            <div
              key={item.step}
              className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 space-y-2 hover:border-cyan-500/30 transition-colors"
            >
              <div className="text-xs font-mono font-bold text-cyan-400">STEP {item.step}</div>
              <h3 className="text-sm font-semibold text-white">{item.title}</h3>
              <p className="text-xs text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Ingestion Rules & Guidelines */}
        <div className="rounded-2xl border border-cyan-500/20 bg-cyan-950/20 p-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-white text-sm mb-1">Source Attribution Guaranteed</h4>
              <p className="text-slate-300">
                Every cyber law record stored in the database preserves its official government source URL, enacting ministry authority, and last verified timestamp.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <ShieldAlert className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-white text-sm mb-1">Controlled Data Pipeline</h4>
              <p className="text-slate-300">
                Data is ingested via authorized ingestion modules rather than fragile dynamic web scrapers, ensuring database stability and high fidelity legal insights.
              </p>
            </div>
          </div>
        </div>

        {/* Reference Links */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-slate-400 border-t border-slate-800/60">
          <div className="flex items-center gap-2">
            <Scale className="h-4 w-4 text-cyan-400" />
            <span>Research Partner Reference: UNCTAD Global Cyberlaw Tracker</span>
          </div>

          <a
            href="https://unctad.org/topic/ecommerce-and-digital-economy/cyberlaw-tracker"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-cyan-400 hover:underline font-medium"
          >
            <span>Explore UNCTAD Cyberlaw Portal</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </section>
  )
}
export default IngestionBanner
