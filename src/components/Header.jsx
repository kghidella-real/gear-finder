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

  const navLink = (to, label) => {
    const active = location.pathname === to || location.pathname.startsWith(to + '/')
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
          {navLink('/golf', 'Golf')}
          {navLink('/about', 'About')}
          <span className="text-sm text-gray-300">More sports soon</span>
        </nav>
      </div>
    </header>
  )
}
