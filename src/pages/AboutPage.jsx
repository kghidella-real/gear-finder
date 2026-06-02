import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"

const BRAND_GREEN = '#2D6A4F'
const BRAND_GREEN_LIGHT = '#E1F5EE'

export default function AboutPage() {
  const [searchParams] = useSearchParams()
  const [tab, setTab] = useState('about')

  useEffect(() => {
    if (searchParams.get('tab') === 'contact') {
      setTab('contact')
    }
  }, [searchParams])

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-8">
        {['about', 'contact'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-6 py-3 text-sm capitalize transition-colors border-b-2 -mb-px"
            style={{
              color: tab === t ? BRAND_GREEN : '#9ca3af',
              borderBottomColor: tab === t ? BRAND_GREEN : 'transparent',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'about' && (
        <div>
          <h1 className="text-2xl font-medium text-gray-900 mb-3 leading-tight">
            Built by an athlete,<br />
            for <span style={{ color: BRAND_GREEN }}>every</span> athlete.
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed mb-4">
            GearFitted started from a simple frustration. Every time it came to buying new gear,
            review sites felt like they were written for someone else — generic top-10 lists, vague advice,
            and recommendations that clearly favoured whoever was paying for the ad slot.
          </p>
          <p className="text-sm text-gray-500 leading-relaxed mb-10">
            The reality is that the right gear is deeply personal. What works for an elite competitor
            is completely wrong for a weekend warrior, and a one-size-fits-all recommendation helps neither
            of them. So we built something better — a tool that asks about you before it tells you what to buy.
          </p>

          <div className="border-t border-gray-100 pt-8 mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-6">What we believe</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { icon: '🛡️', title: 'Honesty first', desc: 'No brand pays to appear in our results. Rankings are based purely on how well a product fits your profile.' },
                { icon: '🎯', title: 'Personal by default', desc: 'We ask about you before we recommend anything. That\'s not a feature — it\'s the whole point.' },
                { icon: '👥', title: 'Community driven', desc: 'Our data comes from real athletes and independent testers — not manufacturer spec sheets.' },
                { icon: '🔄', title: 'Always improving', desc: 'We update our database regularly as new products launch and community feedback comes in.' },
              ].map(c => (
                <div key={c.title} className="rounded-xl p-4" style={{ background: '#F9FAFB' }}>
                  <div className="text-lg mb-2">{c.icon}</div>
                  <h3 className="text-sm font-medium text-gray-900 mb-1">{c.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Where we're headed</h2>
            <p className="text-sm text-gray-500 mb-5 leading-relaxed">
              Starting focused and expanding deliberately. Each sport gets the same treatment — deep data, honest matching, no shortcuts.
            </p>
            <div className="flex flex-col gap-2">
              {[
                { label: 'Golf — Irons', status: 'live' },
                { label: 'Golf — Drivers, wedges, putters, full sets', status: 'soon' },
                { label: 'Golf — Shoes and accessories', status: 'soon' },
                { label: 'More sports — details TBC', status: 'soon' },
              ].map(item => (
                <div
                  key={item.label}
                  className="flex items-center justify-between px-4 py-3 rounded-xl border"
                  style={{ borderColor: item.status === 'live' ? BRAND_GREEN : '#e5e7eb', borderWidth: item.status === 'live' ? 1.5 : 1 }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ background: item.status === 'live' ? BRAND_GREEN : '#d1d5db' }}
                    />
                    <span className="text-sm text-gray-900">{item.label}</span>
                  </div>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={item.status === 'live'
                      ? { background: BRAND_GREEN_LIGHT, color: BRAND_GREEN }
                      : { background: '#f3f4f6', color: '#9ca3af' }
                    }
                  >
                    {item.status === 'live' ? 'Live now' : 'Coming soon'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'contact' && (
        <div>
          <h1 className="text-2xl font-medium text-gray-900 mb-2">Get in touch</h1>
          <p className="text-sm text-gray-500 mb-8 leading-relaxed">
            Questions, feedback, or spotted something wrong in our database? We want to hear it — we read every message.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <form className="flex flex-col gap-4" onSubmit={e => e.preventDefault()}>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-500">Your name</label>
                <input type="text" placeholder="Your name" className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-green-400" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-500">Email address</label>
                <input type="email" placeholder="you@example.com" className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-green-400" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-500">Subject</label>
                <select className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-green-400">
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
                <textarea rows={4} placeholder="Tell us what's on your mind..." className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-green-400 resize-none" />
              </div>
              <button
                type="submit"
                className="py-2.5 rounded-lg text-white text-sm font-medium hover:opacity-90 transition-all"
                style={{ background: BRAND_GREEN }}
              >
                Send message ↗
              </button>
            </form>

            <div className="flex flex-col gap-4">
              {[
                { icon: '✉️', title: 'Email us directly', desc: 'Prefer email? We\'ll get back to you within 48 hours.', extra: 'hello@gearfitted.com' },
                { icon: '🗄️', title: 'Spotted a data error?', desc: 'Wrong price, incorrect specs, or a product missing from our database? Let us know and we\'ll fix it fast.' },
                { icon: '🏆', title: 'Suggest a sport', desc: 'Got a sport you\'d like to see covered? We\'re genuinely interested in what athletes want next.' },
                { icon: '🤝', title: 'Partnerships', desc: 'Retailer or brand interested in working with us? Use the subject line above and we\'ll be in touch.' },
              ].map(c => (
                <div key={c.title} className="rounded-xl p-4" style={{ background: '#F9FAFB' }}>
                  <div className="text-lg mb-1">{c.icon}</div>
                  <h3 className="text-sm font-medium text-gray-900 mb-1">{c.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{c.desc}</p>
                  {c.extra && <p className="text-xs mt-1 font-medium" style={{ color: BRAND_GREEN }}>{c.extra}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
