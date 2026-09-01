'use client'

import React from 'react'
import { Filter, Search, RotateCcw } from 'lucide-react'

interface LawFiltersProps {
  categories: string[]
  selectedCategory: string
  onCategoryChange: (cat: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  totalCount: number
  filteredCount: number
  onReset: () => void
}

export function LawFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  totalCount,
  filteredCount,
  onReset,
}: LawFiltersProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl backdrop-blur-md space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Keyword Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search provisions, act titles, or authorities..."
            className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>

        {/* Counter & Reset */}
        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-slate-400">
          <span>
            Showing <strong className="text-cyan-400 font-semibold">{filteredCount}</strong> of{' '}
            {totalCount} Cyber Laws
          </span>

          {(selectedCategory !== 'All' || searchQuery !== '') && (
            <button
              type="button"
              onClick={onReset}
              className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-slate-300 hover:text-white hover:border-slate-600 transition-all cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Pills */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <Filter className="h-3.5 w-3.5 text-cyan-400" />
          <span>Filter by Legal Taxonomy</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const isSelected = selectedCategory === category
            return (
              <button
                key={category}
                type="button"
                onClick={() => onCategoryChange(category)}
                className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 font-semibold shadow-md shadow-cyan-500/20'
                    : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                }`}
              >
                {category}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
export default LawFilters
