import { useState } from "react"
import { Link } from "react-router-dom"

const AMBER = '#C8965A'
const AMBER_LIGHT = '#FAF4EC'
const AMBER_TEXT = '#9B6B2E'
const DARK = '#1C1C1E'

export default function HomePage() {
  const [email, setEmail] = useState('')
  const [sport, setSport] = useState('')
  const [submitted, setSubmitted] = useState(false)

  async function handleSuggest(e) {
    e.preventDefault()
    if (!email) return
    try {
      await fetch('https://formspree.io/f/xojzadqj', {
        method: 'POST',
        body: JSON.stringify({ email, sport, _subject: 'Sport suggestion from GearFitted' }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      setSubmitted(true)
    } catch {
      setSubmitted(true)
    }
  }

  const golfSubcats = [
    { label: 'Irons', live: true },
    { label: 'Drivers', live: true },
    { label: 'Wedges', live: true },
    { label: 'Putters', live: true },
    { label: 'Full sets', live: true },
    { label: 'Fairway woods', live: true },
  ]

  return (
    <div>
      {/* Hero — dark */}
      <div style={{ background: DARK }} className="px-4 pt-20 pb-16 text-center">
        <div
          className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full mb-6 border"
          style={{ background: 'rgba(200,150,90,0.12)', color: AMBER, borderColor: 'rgba(200,150,90,0.25)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: AMBER }} />
          Personalised gear recommendations
        </div>
        <h1 className="text-4xl font-medium mb-4 leading-tight" style={{ color: '#fff' }}>
          The right gear for{' '}
          <span style={{ color: AMBER }}>your</span> game.<br />
          Not a generic top 10.
        </h1>
        <p className="text-base max-w-lg mx-auto mb-8 leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
          GearFitted matches you to the best equipment based on how you actually play:
          your skill level, tendencies, and budget. Honest recommendations, zero brand bias.
        </p>
        <div className="flex items-center justify-center gap-3 mb-10 flex-wrap">
          <Link
            to="/golf"
            className="px-6 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-all"
            style={{ background: AMBER, color: '#fff' }}
          >
            Find my gear ↗
          </Link>
          <Link
            to="/about"
            className="px-6 py-2.5 rounded-lg text-sm transition-all"
            style={{ color: 'rgba(255,255,255,0.6)', border: '0.5px solid rgba(255,255,255,0.15)' }}
          >
            How it works
          </Link>
        </div>
        <div className="flex items-center justify-center gap-6 flex-wrap">
          {['Real community data', 'Free to use', '0 sponsored rankings'].map(t => (
            <span key={t} className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: AMBER }} />
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Sports */}
      <div className="border-t" style={{ borderColor: 'rgba(255,255,255,0.06)', background: '#F7F6F3' }}>
        <div className="max-w-3xl mx-auto px-4 py-12">
          <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: AMBER }}>Sports</p>
          <h2 className="text-xl font-medium text-gray-900 mb-2">What we cover</h2>
          <p className="text-sm text-gray-500 mb-7">Starting focused, expanding deliberately. Every sport gets the same treatment: deep data, honest matching, no shortcuts.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-5 border-2" style={{ borderColor: AMBER }}>
              <div className="text-2xl mb-3">⛳</div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">Golf</h3>
              <p className="text-xs text-gray-500 mb-3 leading-relaxed">Find clubs matched to your handicap, swing tendencies, and budget.</p>
              <span
                className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full mb-3"
                style={{ background: AMBER_LIGHT, color: AMBER_TEXT }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: AMBER }} />
                Live now
              </span>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {golfSubcats.map(s => (
                  <span
                    key={s.label}
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={s.live
                      ? { background: AMBER_LIGHT, color: AMBER_TEXT }
                      : { background: '#f3f4f6', color: '#9ca3af' }
                    }
                  >
                    {s.live ? `${s.label} ✓` : s.label}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-white border border-dashed border-gray-200 rounded-xl p-5 flex flex-col items-center justify-center text-center">
              <div className="text-2xl mb-3 text-gray-300">···</div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">More sports coming</h3>
              <p className="text-xs text-gray-400 mb-3">We're working on it. Tell us what you'd like to see next.</p>
              <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-400">Coming soon</span>
            </div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="border-t border-gray-100 bg-white">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: AMBER }}>How it works</p>
          <h2 className="text-xl font-medium text-gray-900 mb-2">Fitted in three steps</h2>
          <p className="text-sm text-gray-500 mb-7">No long questionnaires. No booking an appointment. Honest, personalised recommendations in under a minute.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { n: '1', title: 'Tell us about your game', desc: 'Skill level, tendencies, preferences, budget. About 30 seconds.' },
              { n: '2', title: 'We match you', desc: 'Every product scored against your profile using real specs and community data.' },
              { n: '3', title: 'See your top matches', desc: 'Ranked results with honest trade-offs, real reviews, and links to the best prices.' },
            ].map(s => (
              <div key={s.n} className="rounded-xl p-4" style={{ background: '#F7F6F3' }}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium text-white mb-3"
                  style={{ background: DARK }}>{s.n}</div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">{s.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              to="/golf"
              className="inline-block px-6 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-all"
              style={{ background: AMBER, color: '#fff' }}
            >
              Try it now ↗
            </Link>
          </div>
        </div>
      </div>

      {/* Why us */}
      <div className="border-t border-gray-100" style={{ background: '#F7F6F3' }}>
        <div className="max-w-3xl mx-auto px-4 py-12">
          <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: AMBER }}>Why us</p>
          <h2 className="text-xl font-medium text-gray-900 mb-2">Built on honesty</h2>
          <p className="text-sm text-gray-500 mb-7">Most gear sites are funded by the brands they review. We built GearFitted because we got tired of that.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: '🛡️', title: 'No sponsored rankings', desc: 'Results ranked purely on fit. No brand pays to appear higher.' },
              { icon: '👥', title: 'Community data', desc: 'Sourced from real athletes and independent testers, not manufacturer spec sheets.' },
              { icon: '🎯', title: 'Matched to you', desc: 'Your skill level, tendencies, and budget. Not a list built for the average athlete.' },
            ].map(c => (
              <div key={c.title} className="bg-white border border-gray-100 rounded-xl p-4">
                <div className="text-xl mb-3">{c.icon}</div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">{c.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA band — dark */}
      <div className="py-16 px-4 text-center" style={{ background: DARK }}>
        <h2 className="text-xl font-medium text-white mb-2">Ready to find your gear?</h2>
        <p className="text-sm mb-7 max-w-sm mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Answer a few quick questions and get personalised matches across irons, drivers, wedges, putters, and full sets.
        </p>
        <Link
          to="/golf"
          className="inline-block px-6 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-all"
          style={{ background: AMBER, color: '#fff' }}
        >
          Find my gear ↗
        </Link>
      </div>

      {/* Suggest a sport */}
      <div className="border-t border-gray-100 bg-white">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: AMBER }}>Coming soon</p>
              <h2 className="text-xl font-medium text-gray-900 mb-3">What sport should we cover next?</h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                We're expanding beyond golf and want to hear from athletes directly.
                Drop your email and tell us what you'd like to see and we'll let you know when your sport goes live.
              </p>
            </div>
            {submitted ? (
              <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
                <div className="text-2xl mb-2">✅</div>
                <p className="text-sm font-medium text-gray-900 mb-1">You're on the list</p>
                <p className="text-xs text-gray-400">We'll email you when your sport launches.</p>
              </div>
            ) : (
              <form onSubmit={handleSuggest} className="flex flex-col gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none"
                />
                <select
                  value={sport}
                  onChange={e => setSport(e.target.value)}
                  className="px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900"
                >
                  <option value="" disabled>What sport do you want next?</option>
                  <option>Running</option>
                  <option>Skiing / snowboarding</option>
                  <option>Cycling</option>
                  <option>Tennis</option>
                  <option>Swimming</option>
                  <option>Hiking / outdoors</option>
                  <option>Football / soccer</option>
                  <option>Other</option>
                </select>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-lg text-white text-sm font-medium hover:opacity-90 transition-all"
                  style={{ background: AMBER }}
                >
                  Notify me when it's live ↗
                </button>
                <p className="text-xs text-gray-400 text-center">No spam. Just one email when your sport launches.</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
