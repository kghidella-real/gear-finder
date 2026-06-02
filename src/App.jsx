import { useState } from "react"
import IntakeForm from "./components/IntakeForm"
import ResultsCard from "./components/ResultsCard"
import { matchClubs } from "./lib/matcher"
import clubs from "./data/irons.json"

const CATEGORY_ORDER = [
  { key: 'max_forgiveness', label: 'Max forgiveness' },
  { key: 'game_improvement', label: 'Game improvement' },
  { key: 'players_distance', label: 'Players distance' },
  { key: 'players', label: 'Players' },
  { key: 'muscle_back', label: 'Muscle back' },
]

function BrowseList() {
  return (
    <div className="max-w-2xl mx-auto px-4 pb-12">
      {CATEGORY_ORDER.map(cat => {
        const catClubs = clubs.filter(c => c.category === cat.key)
        if (catClubs.length === 0) return null
        return (
          <div key={cat.key} className="mb-8">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
              {cat.label}
            </h3>
            <div className="flex flex-col gap-2">
              {catClubs.map(club => (
                <div
                  key={club.id}
                  className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{club.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {club.brand} · {club.shaft_options.join(' or ')} shaft
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      ${club.price_usd.toLocaleString()}
                    </p>
                    <div className="flex gap-1 mt-1 justify-end">
                      {club.tags.slice(0, 2).map(tag => (
                        <span
                          key={tag}
                          className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-400"
                        >
                          {tag.replace(/-/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function Header() {
  return (
    <header className="border-b border-gray-100 bg-white sticky top-0 z-10">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">⛳</span>
          <span className="font-medium text-gray-900 text-sm">IronFinder</span>
        </div>
        <span className="text-xs text-gray-400">Find your perfect irons</span>
      </div>
    </header>
  )
}

function Hero({ onBrowse }) {
  return (
    <div className="max-w-2xl mx-auto px-4 pt-10 pb-6 text-center">
      <h1 className="text-2xl font-medium text-gray-900 mb-2">
        Find the right irons for your game
      </h1>
      <p className="text-sm text-gray-500 max-w-md mx-auto mb-8">
        Answer a few quick questions and we'll match you to the best irons for
        your handicap, miss pattern, and budget — no generic top-10 lists.
      </p>
      <button
        onClick={onBrowse}
        className="text-sm text-gray-400 hover:text-gray-600 underline underline-offset-2 transition-all"
      >
        Or browse all irons →
      </button>
    </div>
  )
}

function ResultsHeader({ profile, onReset }) {
  const categoryLabel = profile.category
    ? profile.category.replace(/_/g, ' ')
    : null

  const summary = [
    profile.handicap && `${profile.handicap} hcp`,
    profile.miss && profile.miss !== 'none' && profile.miss.replace(/_/g, ' '),
    categoryLabel,
    profile.shaft && profile.shaft !== 'not_sure' && `${profile.shaft} shaft`,
    profile.budget_max && profile.budget_max < 9999 && `under $${profile.budget_max}`
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <div className="max-w-2xl mx-auto px-4 pt-8 pb-2">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-lg font-medium text-gray-900">Your matches</h2>
        <button
          onClick={onReset}
          className="text-xs text-gray-400 hover:text-gray-600 transition-all"
        >
          ← Start over
        </button>
      </div>
      {summary && (
        <p className="text-xs text-gray-400 mb-4">{summary}</p>
      )}
    </div>
  )
}

function EmptyState({ onReset }) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 text-center">
      <p className="text-gray-500 text-sm mb-2">
        No clubs matched your exact criteria.
      </p>
      <p className="text-gray-400 text-xs mb-5">
        Try adjusting your budget or shaft preference.
      </p>
      <button
        onClick={onReset}
        className="px-5 py-2 rounded-lg bg-gray-900 text-white text-sm hover:bg-gray-700 transition-all"
      >
        Try again
      </button>
    </div>
  )
}

function Footer() {
  return (
    <footer className="border-t border-gray-100 mt-12 py-6">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <p className="text-xs text-gray-400">
          IronFinder uses community data and real specifications to match you to
          the right clubs. Affiliate links help keep the site free.
        </p>
      </div>
    </footer>
  )
}

export default function App() {
  const [phase, setPhase] = useState('intro') // intro | results | browse
  const [results, setResults] = useState([])
  const [profile, setProfile] = useState(null)

  function handleFormComplete(userProfile) {
    const matches = matchClubs(clubs, userProfile)
    setResults(matches)
    setProfile(userProfile)
    setPhase('results')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleReset() {
    setPhase('intro')
    setResults([])
    setProfile(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleBrowse() {
    setPhase('browse')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {phase === 'intro' && (
        <>
          <Hero onBrowse={handleBrowse} />
          <div className="max-w-2xl mx-auto px-4">
            <IntakeForm onComplete={handleFormComplete} />
          </div>
        </>
      )}

      {phase === 'results' && (
        <>
          <ResultsHeader profile={profile} onReset={handleReset} />
          <div className="max-w-2xl mx-auto px-4">
            {results.length === 0 ? (
              <EmptyState onReset={handleReset} />
            ) : (
              results.map((club, i) => (
                <ResultsCard
                  key={club.id}
                  club={club}
                  profile={profile}
                  rank={i}
                />
              ))
            )}
          </div>
        </>
      )}

      {phase === 'browse' && (
        <>
          <div className="max-w-2xl mx-auto px-4 pt-8 pb-4 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">All irons</h2>
            <button
              onClick={handleReset}
              className="text-xs text-gray-400 hover:text-gray-600 transition-all"
            >
              ← Back to finder
            </button>
          </div>
          <BrowseList />
        </>
      )}

      <Footer />
    </div>
  )
}
