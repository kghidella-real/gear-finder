import { useState } from "react"
import IntakeForm from "./components/IntakeForm"
import ResultsCard from "./components/ResultsCard"
import { matchClubs } from "./lib/matcher"
import clubs from "./data/irons.json"

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

function Hero() {
  return (
    <div className="max-w-2xl mx-auto px-4 pt-10 pb-6 text-center">
      <h1 className="text-2xl font-medium text-gray-900 mb-2">
        Find the right irons for your game
      </h1>
      <p className="text-sm text-gray-500 max-w-md mx-auto">
        Answer a few quick questions and we'll match you to the best irons for
        your handicap, miss pattern, and budget — no generic top-10 lists.
      </p>
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
  const [phase, setPhase] = useState('intro') // intro | results
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {phase === 'intro' && (
        <>
          <Hero />
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

      <Footer />
    </div>
  )
}
