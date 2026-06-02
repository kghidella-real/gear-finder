import { useState } from "react"
import { matchDrivers, getDriverMatchLabel, getDriverMatchPercent } from "../lib/driverMatcher"
import drivers from "../data/drivers.json"

const BRAND_GREEN = '#2D6A4F'

const CATEGORY_ORDER = [
  { key: 'max_forgiveness', label: 'Max forgiveness' },
  { key: 'game_improvement', label: 'Game improvement' },
  { key: 'players_distance', label: 'Players distance' },
  { key: 'players', label: 'Players' },
]

// ─────────────────────────────────────────────
// Intake form steps
// ─────────────────────────────────────────────

const STEPS = ['distance', 'miss', 'priority', 'budget']

const DISTANCE_OPTIONS = [
  { id: 'under_180', label: 'Under 180 yards', sub: 'Slower swing speed' },
  { id: '180_220',   label: '180–220 yards',   sub: 'Moderate swing speed' },
  { id: '220_260',   label: '220–260 yards',   sub: 'Average swing speed' },
  { id: '260_plus',  label: '260+ yards',      sub: 'Fast swing speed' },
  { id: 'not_sure',  label: 'Not sure',        sub: "I don't track distance" },
]

const MISS_OPTIONS = [
  { id: 'slice',    label: 'Slice',         sub: 'Ball curves right (right-handed)' },
  { id: 'hook',     label: 'Hook',          sub: 'Ball curves left (right-handed)' },
  { id: 'both',     label: 'Both ways',     sub: 'Miss in multiple directions' },
  { id: 'straight', label: 'Pretty straight', sub: 'No consistent miss' },
]

const PRIORITY_OPTIONS = [
  { id: 'forgiveness', label: 'Maximum forgiveness', sub: 'Keep the ball in play above all else' },
  { id: 'distance',    label: 'Maximum distance',    sub: 'I want every yard I can get' },
  { id: 'both',        label: 'Both equally',        sub: 'A good balance of the two' },
]

const BUDGET_OPTIONS = [
  { id: 400,  label: 'Under $400' },
  { id: 600,  label: '$400–$600' },
  { id: 9999, label: '$600+' },
  { id: 9999, label: 'No limit' },
]

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

function ProgressDots({ total, current }) {
  return (
    <div className="flex gap-1.5 mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="w-2 h-2 rounded-full transition-all"
          style={{
            background: i < current
              ? BRAND_GREEN
              : i === current
              ? '#1f2937'
              : '#d1d5db'
          }}
        />
      ))}
    </div>
  )
}

function OptionCard({ selected, onClick, label, sub }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-4 py-3 rounded-xl border transition-all mb-2"
      style={{
        borderColor: selected ? BRAND_GREEN : '#e5e7eb',
        borderWidth: selected ? 2 : 1,
        background: selected ? '#E1F5EE' : '#fff',
      }}
    >
      <span className="text-sm font-medium text-gray-900">{label}</span>
      {sub && <span className="text-xs text-gray-400 ml-2">{sub}</span>}
    </button>
  )
}

function DriverMatchBar({ score, maxScore }) {
  const percent = getDriverMatchPercent(score, maxScore)
  const { label, color } = getDriverMatchLabel(score, maxScore)
  const colors = {
    success:   { bar: '#22c55e', text: '#15803d', bg: '#f0fdf4' },
    info:      { bar: '#3b82f6', text: '#1d4ed8', bg: '#eff6ff' },
    warning:   { bar: '#f59e0b', text: '#b45309', bg: '#fffbeb' },
    secondary: { bar: '#9ca3af', text: '#4b5563', bg: '#f9fafb' },
  }
  const c = colors[color]
  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-500">Profile match</span>
        <span className="text-xs font-medium px-2 py-0.5 rounded-full"
          style={{ background: c.bg, color: c.text }}>
          {label}
        </span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full">
        <div
          className="h-1.5 rounded-full transition-all duration-700"
          style={{ width: `${percent}%`, background: c.bar }}
        />
      </div>
    </div>
  )
}

function StatBar({ label, value }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-400 w-20 text-right">{label}</span>
      <div className="flex-1 h-1 bg-gray-100 rounded-full">
        <div className="h-1 rounded-full bg-gray-400"
          style={{ width: `${value * 10}%` }} />
      </div>
      <span className="text-xs text-gray-400 w-4">{value}</span>
    </div>
  )
}

function DriverResultCard({ driver, rank }) {
  const isTopPick = rank === 0
  return (
    <div
      className="bg-white rounded-2xl p-5 mb-4"
      style={{
        border: isTopPick
          ? `2px solid ${BRAND_GREEN}`
          : '1px solid #e5e7eb'
      }}
    >
      {/* Badge */}
      <div className="mb-2">
        {isTopPick && (
          <span className="inline-block text-xs font-medium px-2.5 py-0.5 rounded-full"
            style={{ background: '#E1F5EE', color: BRAND_GREEN }}>
            Top pick
          </span>
        )}
        {rank === 1 && (
          <span className="inline-block text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600">
            Runner up
          </span>
        )}
        {rank === 2 && (
          <span className="inline-block text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600">
            Also consider
          </span>
        )}
      </div>

      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-base font-medium text-gray-900">{driver.name}</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {driver.category_label} · {driver.head_size_cc}cc
            {driver.lofts_available && ` · ${driver.lofts_available.join('°, ')}°`}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-medium text-gray-900">
            ${driver.price_usd.toLocaleString()}
          </p>
          <p className="text-xs text-gray-400">per club</p>
        </div>
      </div>

      {/* Match bar */}
      <DriverMatchBar score={driver.match_score} maxScore={driver.match_max} />

      {/* Community verdict */}
      <p className="text-sm text-gray-600 leading-relaxed mb-4">
        {driver.community_verdict}
      </p>

      {/* Stats */}
      <div className="flex flex-col gap-1.5 mb-4 py-3 border-t border-b border-gray-100">
        <StatBar label="Forgiveness" value={driver.forgiveness} />
        <StatBar label="Distance"    value={driver.distance_rating} />
        <StatBar label="Workability" value={driver.workability} />
        <StatBar label="Feel"        value={driver.feel_rating} />
      </div>

      {/* Draw bias / adjustable pills */}
      <div className="flex gap-2 flex-wrap mb-4">
        {driver.draw_bias && (
          <span className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: '#E1F5EE', color: BRAND_GREEN }}>
            Draw bias
          </span>
        )}
        {driver.adjustable && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
            Adjustable
          </span>
        )}
        {driver.tags?.slice(0, 3).map(tag => (
          <span key={tag}
            className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">
            {tag.replace(/-/g, ' ')}
          </span>
        ))}
      </div>

      {/* Community rating */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium text-gray-900">{driver.community_rating}</span>
          <div className="flex gap-0.5">
            {[1,2,3,4,5].map(star => (
              <svg key={star}
                className={`w-3.5 h-3.5 ${star <= Math.round(driver.community_rating) ? 'text-amber-400' : 'text-gray-200'}`}
                fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-gray-400">/ 5</span>
        </div>
        <span className="text-xs text-gray-400">
          {driver.community_count?.toLocaleString()} reviews
        </span>
      </div>

      {/* CTA */}
      {driver.affiliate_url ? (
        <a href={driver.affiliate_url} target="_blank" rel="noopener noreferrer"
          className="block w-full text-center py-2.5 rounded-lg text-white text-sm font-medium hover:opacity-90 transition-all"
          style={{ background: '#1f2937' }}>
          View deal →
        </a>
      ) : (
        <button disabled
          className="w-full py-2.5 rounded-lg bg-gray-100 text-gray-400 text-sm cursor-not-allowed">
          Affiliate link coming soon
        </button>
      )}
    </div>
  )
}

function BrowseList() {
  return (
    <div className="max-w-2xl mx-auto px-4 pb-12">
      {CATEGORY_ORDER.map(cat => {
        const catDrivers = drivers.filter(d => d.category === cat.key)
        if (catDrivers.length === 0) return null
        return (
          <div key={cat.key} className="mb-8">
            <h3 className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: BRAND_GREEN }}>
              {cat.label}
            </h3>
            <div className="flex flex-col gap-2">
              {catDrivers.map(driver => (
                <div key={driver.id}
                  className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{driver.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {driver.brand} · {driver.head_size_cc}cc
                      {driver.draw_bias && ' · Draw bias'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      ${driver.price_usd.toLocaleString()}
                    </p>
                    <div className="flex gap-1 mt-1 justify-end">
                      {driver.tags?.slice(0, 2).map(tag => (
                        <span key={tag}
                          className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-400">
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

// ─────────────────────────────────────────────
// Main intake form
// ─────────────────────────────────────────────

function DriverIntakeForm({ onComplete }) {
  const [step, setStep] = useState(0)
  const [profile, setProfile] = useState({
    distance: null,
    miss: null,
    priority: null,
    budget_max: null,
  })

  function update(key, value) {
    setProfile(prev => ({ ...prev, [key]: value }))
  }

  function next() {
    if (step < STEPS.length - 1) setStep(s => s + 1)
    else onComplete(profile)
  }

  function back() {
    setStep(s => Math.max(0, s - 1))
  }

  const canContinue = profile[STEPS[step]] !== null

  return (
    <div className="max-w-lg mx-auto py-6">
      <ProgressDots total={STEPS.length} current={step} />

      {step === 0 && (
        <>
          <h2 className="text-lg font-medium text-gray-900 mb-1">
            How far do you hit your driver?
          </h2>
          <p className="text-sm text-gray-500 mb-5">
            This helps us match clubs to your swing speed.
          </p>
          {DISTANCE_OPTIONS.map(opt => (
            <OptionCard
              key={opt.id}
              selected={profile.distance === opt.id}
              onClick={() => update('distance', opt.id)}
              label={opt.label}
              sub={opt.sub}
            />
          ))}
        </>
      )}

      {step === 1 && (
        <>
          <h2 className="text-lg font-medium text-gray-900 mb-1">
            What's your typical miss off the tee?
          </h2>
          <p className="text-sm text-gray-500 mb-5">
            The most important question for finding the right driver.
          </p>
          {MISS_OPTIONS.map(opt => (
            <OptionCard
              key={opt.id}
              selected={profile.miss === opt.id}
              onClick={() => update('miss', opt.id)}
              label={opt.label}
              sub={opt.sub}
            />
          ))}
        </>
      )}

      {step === 2 && (
        <>
          <h2 className="text-lg font-medium text-gray-900 mb-1">
            What matters most to you?
          </h2>
          <p className="text-sm text-gray-500 mb-5">
            Helps us balance forgiveness vs distance in your results.
          </p>
          {PRIORITY_OPTIONS.map(opt => (
            <OptionCard
              key={opt.id}
              selected={profile.priority === opt.id}
              onClick={() => update('priority', opt.id)}
              label={opt.label}
              sub={opt.sub}
            />
          ))}
        </>
      )}

      {step === 3 && (
        <>
          <h2 className="text-lg font-medium text-gray-900 mb-1">
            What's your budget per driver?
          </h2>
          <p className="text-sm text-gray-500 mb-5">
            We'll include previous-gen options at a discount where they fit.
          </p>
          {BUDGET_OPTIONS.map((opt, i) => (
            <OptionCard
              key={i}
              selected={profile.budget_max === opt.id}
              onClick={() => update('budget_max', opt.id)}
              label={opt.label}
              sub={null}
            />
          ))}
        </>
      )}

      <div className="flex gap-3 mt-5">
        {step > 0 && (
          <button
            onClick={back}
            className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700"
          >
            Back
          </button>
        )}
        <button
          onClick={next}
          disabled={!canContinue}
          className="flex-1 py-2.5 rounded-lg text-white text-sm font-medium disabled:opacity-40 hover:opacity-90 transition-all"
          style={{ background: '#1f2937' }}
        >
          {step === STEPS.length - 1 ? 'Show my matches' : 'Continue'}
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────

export default function DriversPage() {
  const [phase, setPhase] = useState('intro')
  const [results, setResults] = useState([])
  const [profile, setProfile] = useState(null)

  function handleFormComplete(userProfile) {
    const matches = matchDrivers(drivers, userProfile)
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

  // Build profile summary string
  const summary = profile ? [
    profile.distance && profile.distance !== 'not_sure' &&
      DISTANCE_OPTIONS.find(o => o.id === profile.distance)?.label,
    profile.miss &&
      MISS_OPTIONS.find(o => o.id === profile.miss)?.label,
    profile.priority &&
      PRIORITY_OPTIONS.find(o => o.id === profile.priority)?.label,
    profile.budget_max && profile.budget_max < 9999 &&
      `under $${profile.budget_max}`,
  ].filter(Boolean).join(' · ') : ''

  return (
    <div>
      {phase === 'intro' && (
        <>
          <div className="max-w-2xl mx-auto px-4 pt-10 pb-6 text-center">
            <div className="flex items-center justify-center gap-2 text-xs mb-4 text-gray-400">
              <span>Golf</span>
              <span>›</span>
              <span style={{ color: BRAND_GREEN }}>Drivers</span>
            </div>
            <h1 className="text-2xl font-medium text-gray-900 mb-2">
              Find a driver fitted to{' '}
              <span style={{ color: BRAND_GREEN }}>your</span> game.
            </h1>
            <p className="text-sm text-gray-500 max-w-md mx-auto mb-6 leading-relaxed">
              Four quick questions — your distance, miss, priority, and budget.
              We'll match you to the right driver from every major brand.
            </p>
            <div className="flex items-center justify-center gap-5 mb-2">
              {['No sponsored results', 'All major brands', 'Free'].map(t => (
                <span key={t} className="flex items-center gap-1.5 text-xs text-gray-400">
                  <span className="w-1.5 h-1.5 rounded-full"
                    style={{ background: BRAND_GREEN }} />
                  {t}
                </span>
              ))}
            </div>
            <button
              onClick={handleBrowse}
              className="mt-4 text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2 transition-all"
            >
              Or browse all drivers →
            </button>
          </div>
          <div className="max-w-lg mx-auto px-4">
            <DriverIntakeForm onComplete={handleFormComplete} />
          </div>
        </>
      )}

      {phase === 'results' && (
        <>
          <div className="max-w-2xl mx-auto px-4 pt-8 pb-2">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg font-medium text-gray-900">Your matches</h2>
              <button
                onClick={handleReset}
                className="text-xs text-gray-400 hover:text-gray-600 transition-all"
              >
                ← Start over
              </button>
            </div>
            {summary && (
              <p className="text-xs text-gray-400 mb-4">{summary}</p>
            )}
          </div>
          <div className="max-w-2xl mx-auto px-4">
            {results.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-gray-500 text-sm mb-2">
                  No drivers matched your criteria.
                </p>
                <p className="text-gray-400 text-xs mb-5">
                  Try adjusting your budget or priority.
                </p>
                <button
                  onClick={handleReset}
                  className="px-5 py-2 rounded-lg text-white text-sm hover:opacity-90 transition-all"
                  style={{ background: BRAND_GREEN }}
                >
                  Try again
                </button>
              </div>
            ) : (
              results.map((driver, i) => (
                <DriverResultCard key={driver.id} driver={driver} rank={i} />
              ))
            )}
          </div>
        </>
      )}

      {phase === 'browse' && (
        <>
          <div className="max-w-2xl mx-auto px-4 pt-8 pb-4 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">All drivers</h2>
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
    </div>
  )
}
