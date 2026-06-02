import { useState, useEffect } from "react"
import { getMatchLabel, getMatchPercent } from "../lib/matcher"

function MatchBar({ score }) {
  const percent = getMatchPercent(score)
  const { label, color } = getMatchLabel(score)

  const colors = {
    success: { bar: 'bg-green-500', text: 'text-green-700', bg: 'bg-green-50' },
    info: { bar: 'bg-blue-500', text: 'text-blue-700', bg: 'bg-blue-50' },
    warning: { bar: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50' },
    secondary: { bar: 'bg-gray-400', text: 'text-gray-600', bg: 'bg-gray-50' }
  }

  const c = colors[color]

  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-500">Profile match</span>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${c.bg} ${c.text}`}>
          {label}
        </span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full">
        <div
          className={`h-1.5 rounded-full transition-all duration-700 ${c.bar}`}
          style={{ width: `${percent}%` }}
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
        <div
          className="h-1 rounded-full bg-gray-400"
          style={{ width: `${value * 10}%` }}
        />
      </div>
      <span className="text-xs text-gray-400 w-4">{value}</span>
    </div>
  )
}

function ClubExplanation({ club, profile }) {
  const [explanation, setExplanation] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchExplanation() {
      try {
        const res = await fetch('/api/explain', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ club, profile })
        })
        const data = await res.json()
        setExplanation(data.explanation)
      } catch {
        setExplanation(
          'A strong match for your profile based on handicap range, shaft preference, and typical miss pattern.'
        )
      } finally {
        setLoading(false)
      }
    }
    fetchExplanation()
  }, [club.id, profile])

  if (loading) {
    return (
      <div className="flex gap-1.5 items-center py-1">
        <div className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    )
  }

  return (
    <p className="text-sm text-gray-600 leading-relaxed">{explanation}</p>
  )
}

export default function ResultsCard({ club, profile, rank }) {
  const isTopPick = rank === 0

  return (
    <div
      className={`bg-white rounded-2xl p-5 mb-4 transition-all ${
        isTopPick
          ? 'border-2 border-blue-400'
          : 'border border-gray-200'
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          {isTopPick && (
            <span className="inline-block text-xs font-medium px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 mb-2">
              Top pick
            </span>
          )}
          {rank === 1 && (
            <span className="inline-block text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 mb-2">
              Runner up
            </span>
          )}
          {rank === 2 && (
            <span className="inline-block text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 mb-2">
              Also consider
            </span>
          )}
          <h3 className="text-base font-medium text-gray-900">{club.name}</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {club.category_label} · {club.shaft_options.join(' or ')} shaft
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-medium text-gray-900">
            ${club.price_usd.toLocaleString()}
          </p>
          <p className="text-xs text-gray-400">set price</p>
        </div>
      </div>

      {/* Match bar */}
      <MatchBar score={club.match_score} />

      {/* AI explanation */}
      <div className="mb-4">
        <ClubExplanation club={club} profile={profile} />
      </div>

      {/* Stat bars */}
      <div className="flex flex-col gap-1.5 mb-4 py-3 border-t border-b border-gray-100">
        <StatBar label="Forgiveness" value={club.forgiveness} />
        <StatBar label="Distance" value={club.distance_rating} />
        <StatBar label="Workability" value={club.workability} />
        <StatBar label="Feel" value={club.feel_rating} />
      </div>

      {/* Community rating */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium text-gray-900">
            {club.community_rating}
          </span>
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(star => (
              <svg
                key={star}
                className={`w-3.5 h-3.5 ${
                  star <= Math.round(club.community_rating)
                    ? 'text-amber-400'
                    : 'text-gray-200'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-gray-400">/ 5</span>
        </div>
        <span className="text-xs text-gray-400">
          {club.community_count.toLocaleString()} reviews
        </span>
      </div>

      {/* Community verdict */}
      <p className="text-xs text-gray-500 italic mb-4 leading-relaxed">
        "{club.community_verdict}"
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {club.tags.map(tag => (
          <span
            key={tag}
            className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500"
          >
            {tag.replace(/-/g, ' ')}
          </span>
        ))}
      </div>

      {/* CTA */}
      {club.affiliate_url ? (
    <a
    href={club.affiliate_url}
    target="_blank"
    rel="noopener noreferrer"
    className="block w-full text-center py-2.5 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-all"
  >
    View deal →
  </a>
) : (
        <button
          disabled
          className="w-full py-2.5 rounded-lg bg-gray-100 text-gray-400 text-sm cursor-not-allowed"
        >
          Affiliate link coming soon
        </button>
      )}
    </div>
  )
}
