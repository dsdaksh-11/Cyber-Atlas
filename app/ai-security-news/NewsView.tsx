'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Brain,
  ShieldAlert,
  Shield,
  RefreshCw,
  ExternalLink,
  Info,
  Calendar,
  User,
  Filter,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Flame,
  Radio,
  FileText,
} from 'lucide-react'

interface NewsArticle {
  id: string
  title: string
  description: string
  sourceName: string
  sourceUrl: string
  articleUrl: string
  imageUrl?: string
  author?: string
  publishedAt: string
  category: string
  threatLevel: 'Low' | 'Medium' | 'High' | 'Critical'
  relevanceScore: number
  aiSummary?: string
  whyItMatters?: string
}

const CATEGORIES = [
  'All Categories',
  'AI-Powered Attacks',
  'AI Agent Security',
  'LLM Security',
  'Prompt Injection',
  'AI Malware',
  'Deepfake Threats',
  'AI Vulnerabilities',
  'AI Security Research',
  'AI Cybersecurity Regulation',
  'AI Security Tools',
]

const THREAT_LEVELS = ['All', 'Critical', 'High', 'Medium', 'Low']

export function NewsView() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [refreshMessage, setRefreshMessage] = useState<string | null>(null)

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories')
  const [selectedThreatLevel, setSelectedThreatLevel] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Fetch articles from API
  const fetchArticles = async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (selectedCategory !== 'All Categories') params.append('category', selectedCategory)
      if (selectedThreatLevel !== 'All') params.append('threatLevel', selectedThreatLevel)
      if (searchQuery.trim()) params.append('search', searchQuery.trim())

      const res = await fetch(`/api/news?${params.toString()}`)
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to load AI security news')
      }

      setArticles(data.articles || [])
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching news articles.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchArticles()
  }, [selectedCategory, selectedThreatLevel, searchQuery])

  // Trigger manual news refresh
  const handleManualRefresh = async () => {
    setRefreshing(true)
    setRefreshMessage(null)

    try {
      const res = await fetch('/api/news/refresh', { method: 'POST' })
      const data = await res.json()

      if (res.ok && data.success) {
        setRefreshMessage(
          `Refreshed feeds: ${data.articlesFetched} checked, ${data.articlesSaved} relevant articles available.`
        )
        if (data.articles && data.articles.length > 0) {
          setArticles(data.articles)
        } else {
          fetchArticles()
        }
      } else {
        setRefreshMessage(data.error || 'Feed refresh complete.')
      }
    } catch (err: any) {
      setRefreshMessage('Could not connect to news feed sources.')
    } finally {
      setRefreshing(false)
      setTimeout(() => setRefreshMessage(null), 6000)
    }
  }

  // Get Threat Level Badge Styling
  const getThreatBadge = (level: string) => {
    switch (level) {
      case 'Critical':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-950/80 border border-rose-500/50 text-rose-300 font-bold text-xs shadow-md">
            <Flame className="h-3.5 w-3.5 text-rose-400 animate-pulse" />
            Critical Threat
          </span>
        )
      case 'High':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-950/80 border border-orange-500/50 text-orange-300 font-bold text-xs shadow-md">
            <ShieldAlert className="h-3.5 w-3.5 text-orange-400" />
            High Threat
          </span>
        )
      case 'Medium':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-950/80 border border-amber-500/50 text-amber-300 font-semibold text-xs">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
            Medium Threat
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 font-medium text-xs">
            <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />
            Low / Advisory
          </span>
        )
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Navigation back button */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to CyberLaw Atlas</span>
        </Link>

        {/* Manual News Refresh Button */}
        <button
          type="button"
          onClick={handleManualRefresh}
          disabled={refreshing}
          className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/40 bg-slate-900/90 px-4 py-2 text-xs font-semibold text-cyan-300 hover:border-cyan-400 hover:bg-slate-800 hover:text-white transition-all shadow-lg cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 text-cyan-400 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? 'Fetching Feeds...' : 'Refresh Latest Intelligence'}</span>
        </button>
      </div>

      {/* Header & Title Section */}
      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/60 px-4 py-1.5 text-xs font-semibold text-cyan-300 shadow-xl backdrop-blur-md">
          <Brain className="h-4 w-4 text-cyan-400" />
          <span>AI + Cybersecurity Dual-Domain Intelligence</span>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl font-sans">
          AI Cybersecurity <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">Intelligence</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Stay updated with the latest developments at the intersection of artificial intelligence and cybersecurity — tracking AI agent security, LLM vulnerabilities, prompt injection, and synthetic media threats.
        </p>
      </div>

      {/* Toast Notification Banner for Refresh */}
      {refreshMessage && (
        <div className="rounded-2xl border border-cyan-500/40 bg-cyan-950/40 p-4 text-xs sm:text-sm text-cyan-200 flex items-center gap-3 shadow-xl animate-in fade-in duration-200">
          <Radio className="h-5 w-5 text-cyan-400 shrink-0 animate-pulse" />
          <span>{refreshMessage}</span>
        </div>
      )}

      {/* Threat Level Explanation Disclaimer Tooltip */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-cyan-400 shrink-0" />
          <span className="font-semibold text-white">Heuristic Classification Disclaimer:</span>
        </div>
        <p className="text-slate-400 text-xs flex-1">
          Threat levels are automatically estimated using rule-based keyword analysis and are intended for informational purposes only.
        </p>
      </div>

      {/* Filters Toolbar */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-xl space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Filter className="h-4 w-4 text-cyan-400" />
            <span>Filter Threat Intelligence Articles</span>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search AI threats (e.g. LLM, Prompt Injection, Jailbreak)..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition-all"
            />
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          </div>
        </div>

        {/* Category Pills */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Category Filter:
          </span>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                    : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Threat Level Pills */}
        <div className="space-y-2 pt-2 border-t border-slate-800/80">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Estimated Threat Level:
          </span>
          <div className="flex flex-wrap gap-2">
            {THREAT_LEVELS.map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setSelectedThreatLevel(lvl)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  selectedThreatLevel === lvl
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-md'
                    : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                }`}
              >
                {lvl === 'All' ? 'All Threat Levels' : lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-16 text-center space-y-4">
          <RefreshCw className="h-10 w-10 text-cyan-400 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-300">Loading AI Cybersecurity Intelligence feeds...</p>
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-rose-500/40 bg-rose-950/30 p-8 text-center space-y-3">
          <AlertTriangle className="h-8 w-8 text-rose-400 mx-auto" />
          <h3 className="text-base font-bold text-white">Failed to Load Intelligence Articles</h3>
          <p className="text-xs text-rose-300">{error}</p>
        </div>
      ) : articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <div
              key={article.id}
              className="group relative rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-md hover:border-cyan-500/50 hover:bg-slate-900 transition-all duration-300 flex flex-col justify-between space-y-4"
            >
              {/* Optional Thumbnail */}
              {article.imageUrl && (
                <div className="relative h-44 w-full overflow-hidden rounded-2xl border border-slate-800/80">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      // Hide image if broken link
                      ;(e.target as HTMLElement).style.display = 'none'
                    }}
                  />
                </div>
              )}

              <div className="space-y-3">
                {/* Badges Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="rounded-lg bg-cyan-950 px-2.5 py-1 text-xs font-semibold text-cyan-300 border border-cyan-800/60">
                    {article.category}
                  </span>
                  {getThreatBadge(article.threatLevel)}
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2 leading-snug">
                  {article.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                  {article.description}
                </p>
              </div>

              {/* Footer Attribution & Action Button */}
              <div className="pt-4 border-t border-slate-800/80 space-y-3 text-xs">
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span className="font-semibold text-slate-300 flex items-center gap-1">
                    <FileText className="h-3 w-3 text-cyan-400" />
                    Source: {article.sourceName}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-slate-500" />
                    {new Date(article.publishedAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <a
                  href={article.articleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-xs font-bold text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 transition-all cursor-pointer shadow-md"
                >
                  <span>Read Original Article</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-12 text-center space-y-4">
          <Brain className="h-10 w-10 text-cyan-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Matching AI Security Articles Found</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            No intelligence articles match your current filter selection for &quot;{selectedCategory}&quot; or search query &quot;{searchQuery}&quot;.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('All Categories')
              setSelectedThreatLevel('All')
              setSearchQuery('')
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-all cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  )
}
export default NewsView
