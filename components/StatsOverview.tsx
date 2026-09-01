'use client'

import React from 'react'
import { Globe, BookOpen, ShieldCheck, Scale } from 'lucide-react'

interface StatsProps {
  countryCount?: number
  lawCount?: number
}

export function StatsOverview({ countryCount = 4, lawCount = 16 }: StatsProps) {
  const stats = [
    {
      icon: Globe,
      label: 'Tracked Jurisdictions',
      value: countryCount,
      subtext: 'Searchable by ISO code & country name',
      color: 'text-cyan-400',
    },
    {
      icon: BookOpen,
      label: 'Indexed Cyber Laws',
      value: lawCount,
      subtext: 'Structured acts, policies & decrees',
      color: 'text-blue-400',
    },
    {
      icon: ShieldCheck,
      label: 'Taxonomy Categories',
      value: '9+',
      subtext: 'Cybercrime, Data Privacy, Infrastructure',
      color: 'text-emerald-400',
    },
    {
      icon: Scale,
      label: 'Attribution Compliance',
      value: '100%',
      subtext: 'Verified against official legal gazettes',
      color: 'text-violet-400',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-10">
      {stats.map((stat, i) => {
        const IconComponent = stat.icon
        return (
          <div
            key={i}
            className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl backdrop-blur-md hover:border-cyan-500/30 transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {stat.label}
              </span>
              <IconComponent className={`h-5 w-5 ${stat.color} group-hover:scale-110 transition-transform`} />
            </div>

            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-white">{stat.value}</span>
            </div>

            <p className="mt-1 text-xs text-slate-400">{stat.subtext}</p>
          </div>
        )
      })}
    </div>
  )
}
export default StatsOverview
