import { useState } from "react"
import IntakeForm from "../components/IntakeForm"
import ResultsCard from "../components/ResultsCard"
import { matchClubs } from "../lib/matcher"
import clubs from "../data/irons.json"

const BRAND_GREEN = '#2D6A4F'

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
            <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: BRAND_GREEN }}>
              {cat.label}
            </h3>
            <div className="flex flex-col gap-2">
              {catClubs.map(club => (
                <div key={club.id} className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{club.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{club.brand} · {club.shaft_options.join(' or ')} shaft</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">${club.price_usd.toLocaleString()}</p>
                    <div className="flex gap-1 mt-1 justify-end">
                      {club.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-400">
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

export default function IronsPage() {
  const [phase, setPhase] = useState('intro')
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
    <div>
      {phase === 'intro' && (
        <>
          <div className="max-w-2xl mx-auto px-4 pt-10 pb-6 text-center">
            <div className="flex items-center justify-center gap-2 text-xs mb-4 text-gray-400">
              <span>Golf</span>
              <span>›</span>
              <span style={{ color: BRAND_GREEN }}>Irons</span>
            </div>
            <h1 className="text-2xl font-medium text-gray-900 mb-2">
              Find irons fitted to <span style={{ color: BRAND_GREEN }}>your</span> game.
            </h1>
            <p className="text-sm text-gray-500 max-w-md mx-auto mb-6 leading-relaxed">
              Answer a few quick questions and we'll match you to the right irons based on your
              handicap, miss pattern, and budget. No generic top-10 lists.
            </p>
            <div className="flex items-center justify-center gap-5 mb-2">
              {['No sponsored results', 'Real community data', 'Free'].map(t => (
                <span key={t} className="flex items-center gap-1.5 text-xs text-gray-400">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: BRAND_GREEN }} />
                  {t}
                </span>
              ))}
            </div>
            <button
              onClick={handleBrowse}
              className="mt-4 text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2 transition-all"
            >
              Or browse all irons →
            </button>
          </div>
          <div className="max-w-2xl mx-auto px-4">
            <IntakeForm onComplete={handleFormComplete} />
          </div>
        </>
      )}

      {phase === 'results' && (
        <>
          <div className="max-w-2xl mx-auto px-4 pt-8 pb-2">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg font-medium text-gray-900">Your matches</h2>
              <button onClick={handleReset} className="text-xs text-gray-400 hover:text-gray-600 transition-all">
                ← Start over
              </button>
            </div>
            {profile && (
              <p className="text-xs text-gray-400 mb-4">
                {[
                  profile.handicap && `${profile.handicap} hcp`,
                  profile.miss && profile.miss !== 'none' && profile.miss.replace(/_/g, ' '),
                  profile.category && profile.category.replace(/_/g, ' '),
                  profile.shaft && profile.shaft !== 'not_sure' && `${profile.shaft} shaft`,
                  profile.budget_max && profile.budget_max < 9999 && `under $${profile.budget_max}`
                ].filter(Boolean).join(' · ')}
              </p>
            )}
          </div>
          <div className="max-w-2xl mx-auto px-4">
            {results.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-gray-500 text-sm mb-2">No clubs matched your exact criteria.</p>
                <p className="text-gray-400 text-xs mb-5">Try adjusting your budget or shaft preference.</p>
                <button onClick={handleReset} className="px-5 py-2 rounded-lg text-white text-sm hover:opacity-90 transition-all" style={{ background: BRAND_GREEN }}>
                  Try again
                </button>
              </div>
            ) : (
              results.map((club, i) => (
                <ResultsCard key={club.id} club={club} profile={profile} rank={i} />
              ))
            )}
          </div>
        </>
      )}

      {phase === 'browse' && (
        <>
          <div className="max-w-2xl mx-auto px-4 pt-8 pb-4 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">All irons</h2>
            <button onClick={handleReset} className="text-xs text-gray-400 hover:text-gray-600 transition-all">
              ← Back to finder
            </button>
          </div>
          <BrowseList />
        </>
      )}
    </div>
  )
}
