import { useState, useRef, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"

const BRAND_GREEN = '#2D6A4F'

function LogoMark({ size = 28 }) {
  return (
    <div style={{ width: size, height: size, background: BRAND_GREEN, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 16 16" fill="none">
        <path d="M3 13 L7 3 L9 8 L11 5 L13 13" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

export default function Header() {
  const location = useLocation()
  const [golfOpen, setGolfOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setGolfOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Close dropdown on route change
  useEffect(() => {
    setGolfOpen(false)
  }, [location.pathname])

  const isGolfActive = location.pathname.startsWith('/golf')

  const navLink = (to, label) => {
    const active = location.pathname === to
    return (
      <Link
        to={to}
        className="text-sm transition-colors"
        style={{ color: active ? BRAND_GREEN : '#9ca3af' }}
      >
        {label}
      </Link>
    )
  }

  return (
    <header className="border-b border-gray-100 bg-white sticky top-0 z-10">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <LogoMark size={28} />
          <span className="font-medium text-gray-900 text-sm">
            Gear<span style={{ color: BRAND_GREEN }}>Fitted</span>
          </span>
        </Link>

        <nav className="flex items-center gap-5">
          {navLink('/', 'Home')}

          {/* Golf dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setGolfOpen(o => !o)}
              className="flex items-center gap-1 text-sm transition-colors"
              style={{ color: isGolfActive ? BRAND_GREEN : '#9ca3af' }}
            >
              Golf
              <svg
                width="10" height="10" viewBox="0 0 10 10" fill="none"
                className="transition-transform"
                style={{ transform: golfOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
              >
                <path d="M2 3.5 L5 6.5 L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {golfOpen && (
              <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-xl shadow-lg py-1.5 min-w-40 z-20">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider px-3 py-1.5">
                  Clubs
                </p>
                <Link
                  to="/golf/irons"
                  className="flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-50 transition-colors"
                  style={{ color: location.pathname === '/golf/irons' ? BRAND_GREEN : '#374151' }}
                >
                  <span>Irons</span>
                  <span className="text-xs px-1.5 py-0.5 rounded-full"
                    style={{ background: '#E1F5EE', color: BRAND_GREEN }}>
                    Live
                  </span>
                </Link>
                <Link
                  to="/golf/drivers"
                  className="flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-50 transition-colors"
                  style={{ color: location.pathname === '/golf/drivers' ? BRAND_GREEN : '#374151' }}
                >
                  <span>Drivers</span>
                  <span className="text-xs px-1.5 py-0.5 rounded-full"
                    style={{ background: '#E1F5EE', color: BRAND_GREEN }}>
                    Live
                  </span>
                </Link>
                <div className="border-t border-gray-100 mt-1 pt-1">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider px-3 py-1.5">
                    Coming soon
                  </p>
                  {['Wedges', 'Putters', 'Full sets', 'Shoes'].map(item => (
                    <div key={item}
                      className="flex items-center justify-between px-3 py-2 text-sm text-gray-300 cursor-default">
                      <span>{item}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-400">
                        Soon
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {navLink('/about', 'About')}
          <span className="text-sm text-gray-300">More sports soon</span>
        </nav>
      </div>
    </header>
  )
}
