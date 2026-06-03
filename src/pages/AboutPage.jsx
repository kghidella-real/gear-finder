import { useState, useEffect } from "react"
import { Link, useSearchParams } from "react-router-dom"

const AMBER = '#C8965A'
const AMBER_LIGHT = '#FAF4EC'
const AMBER_TEXT = '#9B6B2E'
const DARK = '#1C1C1E'

export default function AboutPage() {
  const [searchParams] = useSearchParams()
  const [tab, setTab] = useState('about')
  const [formSent, setFormSent] = useState(false)
  const [formError, setFormError] = useState(false)

  useEffect(() => {
    if (searchParams.get('tab') === 'contact') {
      setTab('contact')
    }
  }, [searchParams])

  async function handleSubmit(e) {
    e.preventDefault()
    setFormError(false)
    try {
      const data = new FormData(e.target)
      const res = await fetch('https://formspree.io/f/xojzadqj', {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      })
      if (res.ok) {
        setFormSent(true)
        e.target.reset()
      } else {
        setFormError(true)
      }
    } catch {
      setFormError(true)
    }
  }

  return (
    <div>
      {/* Page header — dark */}
      <div style={{ background: DARK }} className="px-4 pt-12 pb-10">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-medium text-white mb-2 leading-tight">
            Built by an athlete,<br />
            for <span style={{ color: AMBER }}>every</span> athlete.
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
            GearFitted started from a simple frustration. Gear sites built for brands, not players.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white sticky top-14 z-10">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex">
            {['about', 'contact'].map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="px-6 py-3 text-sm capitalize transition-colors border-b-2 -mb-px"
                style={{
                  color: tab === t ? AMBER : '#9ca3af',
                  borderBottomColor: tab === t ? AMBER : 'transparent',
                  fontWeight: tab === t ? 500 : 400,
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">

        {tab === 'about' && (
          <div>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              Every time it came to buying new gear, review sites felt like they were written for someone
              else. Generic top-10 lists, vague advice, and recommendations that clearly favoured whoever
              was paying for the ad slot.
            </p>
            <p className="text-sm text-gray-500 leading-relaxed mb-10">
              The right gear is deeply personal. What works for an elite competitor is completely wrong
              for a weekend warrior. So we built something better, a tool that asks about you before
              it tells you what to buy.
            </p>

            {/* What we believe */}
            <div className="border-t border-gray-100 pt-8 mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-6">What we believe</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { icon: '🛡️', title: 'Honesty first', desc: 'No brand pays to appear in our results. Rankings are based purely on how well a product fits your profile.' },
                  { icon: '🎯', title: 'Personal by default', desc: "We ask about you before we recommend anything. That's not a feature, it's the whole point." },
                  { icon: '👥', title: 'Community driven', desc: 'Our data comes from real athletes and independent testers, not manufacturer spec sheets.' },
                  { icon: '🔄', title: 'Always improving', desc: 'We update our database regularly as new products launch and community feedback comes in.' },
                ].map(c => (
                  <div key={c.title} className="rounded-xl p-4" style={{ background: '#F7F6F3' }}>
                    <div className="text-lg mb-2">{c.icon}</div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">{c.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{c.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Roadmap */}
            <div className="border-t border-gray-100 pt-8 mb-10">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Where we're headed</h2>
              <p className="text-sm text-gray-500 mb-5 leading-relaxed">
                Starting focused and expanding deliberately. Each sport gets the same treatment: deep data, honest matching, no shortcuts.
              </p>
              <div className="flex flex-col gap-2">
                {[
                  { label: 'Golf — Drivers, Fairway woods / Hybrids, Irons, Wedges, Putters, Full sets', status: 'live' },
                  { label: 'More sports — details TBC', status: 'soon' },
                ].map(item => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between px-4 py-3 rounded-xl border"
                    style={{
                      borderColor: item.status === 'live' ? AMBER : '#e5e7eb',
                      borderWidth: item.status === 'live' ? 1.5 : 1
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full"
                        style={{ background: item.status === 'live' ? AMBER : '#d1d5db' }} />
                      <span className="text-sm text-gray-900">{item.label}</span>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full"
                      style={item.status === 'live'
                        ? { background: AMBER_LIGHT, color: AMBER_TEXT }
                        : { background: '#f3f4f6', color: '#9ca3af' }
                      }>
                      {item.status === 'live' ? 'Live now' : 'Coming soon'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="rounded-2xl p-8 text-center" style={{ background: DARK }}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: AMBER }}>
                Ready to try it?
              </p>
              <h2 className="text-lg font-medium text-white mb-2">
                Find your perfect gear in under a minute.
              </h2>
              <p className="text-sm mb-6 max-w-xs mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Answer a few quick questions across irons, drivers, wedges, putters, or full sets.
              </p>
              <Link
                to="/golf"
                className="inline-block px-6 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-all"
                style={{ background: AMBER, color: '#fff' }}
              >
                Find my gear ↗
              </Link>
            </div>
          </div>
        )}

        {tab === 'contact' && (
          <div>
            <h2 className="text-xl font-medium text-gray-900 mb-2">Get in touch</h2>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
              Questions, feedback, or spotted something wrong in our database? We want to hear it, we read every message.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {formSent ? (
                <div className="rounded-xl p-6 text-center border border-gray-100" style={{ background: '#F7F6F3' }}>
                  <div className="text-2xl mb-3">✅</div>
                  <p className="text-sm font-medium text-gray-900 mb-1">Message sent!</p>
                  <p className="text-xs text-gray-500">We'll get back to you within 48 hours.</p>
                  <button
                    onClick={() => setFormSent(false)}
                    className="mt-4 text-xs underline underline-offset-2"
                    style={{ color: AMBER }}
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gray-500">Your name</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Your name"
                      required
                      className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none"
                      style={{ transition: 'border-color 0.15s' }}
                      onFocus={e => e.target.style.borderColor = AMBER}
                      onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gray-500">Email address</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      required
                      className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none"
                      onFocus={e => e.target.style.borderColor = AMBER}
                      onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gray-500">Subject</label>
                    <select
                      name="subject"
                      className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 bg-white"
                    >
                      <option>General question</option>
                      <option>Data correction</option>
                      <option>Missing product</option>
                      <option>Suggest a sport</option>
                      <option>Partnership or affiliate</option>
                      <option>Something else</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gray-500">Message</label>
                    <textarea
                      rows={4}
                      name="message"
                      placeholder="Tell us what's on your mind..."
                      required
                      className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none resize-none"
                      onFocus={e => e.target.style.borderColor = AMBER}
                      onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                    />
                  </div>
                  {formError && (
                    <p className="text-xs text-red-500">Something went wrong. Please try again or email us directly.</p>
                  )}
                  <button
                    type="submit"
                    className="py-2.5 rounded-lg text-white text-sm font-medium hover:opacity-90 transition-all"
                    style={{ background: AMBER }}
                  >
                    Send message ↗
                  </button>
                </form>
              )}

              <div className="flex flex-col gap-4">
                {[
                  { icon: '✉️', title: 'Email us directly', desc: "Prefer email? We'll get back to you within 48 hours.", extra: 'hello@gearfitted.com' },
                  { icon: '🗄️', title: 'Spotted a data error?', desc: "Wrong price, incorrect specs, or a missing product? Let us know and we'll fix it fast." },
                  { icon: '🏆', title: 'Suggest a sport', desc: "Got a sport you'd like to see covered? We're genuinely interested in what athletes want next." },
                  { icon: '🤝', title: 'Partnerships', desc: "Retailer or brand interested in working with us? Use the subject line above and we'll be in touch." },
                ].map(c => (
                  <div key={c.title} className="rounded-xl p-4" style={{ background: '#F7F6F3' }}>
                    <div className="text-lg mb-1">{c.icon}</div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">{c.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{c.desc}</p>
                    {c.extra && <p className="text-xs mt-1 font-medium" style={{ color: AMBER }}>{c.extra}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
