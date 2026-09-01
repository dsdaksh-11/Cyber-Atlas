'use client'

import React from 'react'
import Link from 'next/link'
import { Shield, ExternalLink, Lock, CheckCircle, Scale, Brain } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800/60">
          {/* Col 1: Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 p-2 shadow-md">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">
                CyberLaw<span className="text-cyan-400">Atlas</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              CyberLaw Atlas is an international cybercrime and cybersecurity legal intelligence platform.
              Access structured, verified legislation, data protection frameworks, and AI threat monitoring across 48 global jurisdictions.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-400 pt-2">
              <span className="flex items-center gap-1 text-cyan-400">
                <Lock className="h-3.5 w-3.5" /> ISO 3166-1 Code Standard
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle className="h-3.5 w-3.5" /> Source Attributed
              </span>
            </div>
          </div>

          {/* Col 2: Featured Jurisdictions & Tools */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Platform Tools
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/country/IN" className="hover:text-cyan-400 transition-colors flex items-center gap-2">
                  <span>🇮🇳</span> India (IN)
                </Link>
              </li>
              <li>
                <Link href="/country/US" className="hover:text-cyan-400 transition-colors flex items-center gap-2">
                  <span>🇺🇸</span> United States (US)
                </Link>
              </li>
              <li>
                <Link href="/country/DE" className="hover:text-cyan-400 transition-colors flex items-center gap-2">
                  <span>🇩🇪</span> Germany (DE)
                </Link>
              </li>
              <li>
                <Link href="/country/JP" className="hover:text-cyan-400 transition-colors flex items-center gap-2">
                  <span>🇯🇵</span> Japan (JP)
                </Link>
              </li>
              <li className="pt-1">
                <Link href="/compare" className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                  <Scale className="h-3.5 w-3.5" />
                  <span>Compare Countries Matrix →</span>
                </Link>
              </li>
              <li>
                <Link href="/ai-security-news" className="text-cyan-400 font-bold hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                  <Brain className="h-3.5 w-3.5 text-cyan-400" />
                  <span>AI Security Intelligence →</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Reference & Sources */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Trusted Sources
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://unctad.org/topic/ecommerce-and-digital-economy/cyberlaw-tracker"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
                >
                  <Scale className="h-3.5 w-3.5 text-cyan-400" />
                  <span>UNCTAD Cyberlaw</span>
                  <ExternalLink className="h-3 w-3 text-slate-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.meity.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
                >
                  <span>MeitY Gazette India</span>
                  <ExternalLink className="h-3 w-3 text-slate-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.cisa.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
                >
                  <span>US CISA Cyber Directives</span>
                  <ExternalLink className="h-3 w-3 text-slate-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.ncsc.gov.uk/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
                >
                  <span>UK NCSC Guidance</span>
                  <ExternalLink className="h-3 w-3 text-slate-400" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright notice */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} CyberLaw Atlas. All legal rights and statutory attributions reserved.</p>
          <p className="text-slate-400">
            Designed for cybersecurity research, legal compliance, and international policy analysis.
          </p>
        </div>
      </div>
    </footer>
  )
}
export default Footer
