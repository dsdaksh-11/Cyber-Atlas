'use client'

import React from 'react'
import Link from 'next/link'
import { Shield, Globe, Scale, Search, Brain } from 'lucide-react'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-2 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-200">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-white font-sans">
                CyberLaw<span className="text-cyan-400">Atlas</span>
              </span>
              <span className="rounded-full bg-cyan-950/80 px-2 py-0.5 text-[10px] font-semibold text-cyan-400 border border-cyan-500/30">
                v2.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Global Cybercrime & Cybersecurity Legal Intelligence
            </p>
          </div>
        </Link>

        {/* Navigation Links & UNCTAD Tag */}
        <nav className="flex items-center gap-3 sm:gap-6">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors"
          >
            <Search className="h-4 w-4" />
            <span>Search</span>
          </Link>

          <Link
            href="/compare"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <Scale className="h-4 w-4" />
            <span>Compare</span>
          </Link>

          <Link
            href="/ai-security-news"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 hover:brightness-125 transition-all"
          >
            <Brain className="h-4 w-4 text-cyan-400" />
            <span>AI News</span>
          </Link>

          <Link
            href="/#jurisdictions"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors hidden md:flex"
          >
            <Globe className="h-4 w-4" />
            <span>Jurisdictions</span>
          </Link>

          {/* UNCTAD Standard Tag */}
          <div className="flex items-center gap-1.5 rounded-lg border border-slate-700/60 bg-slate-900/90 px-2.5 py-1 text-xs text-slate-300">
            <Scale className="h-3.5 w-3.5 text-cyan-400" />
            <span className="hidden sm:inline text-[11px] text-slate-400">Taxonomy:</span>
            <span className="font-semibold text-cyan-300 text-[11px]">UNCTAD Aligned</span>
          </div>
        </nav>
      </div>
    </header>
  )
}
export default Header
