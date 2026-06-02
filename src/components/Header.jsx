import { Link, useLocation } from "react-router-dom"

const AMBER = '#C8965A'
const DARK = '#1C1C1E'

function LogoMark({ size = 28 }) {
  return (
    <div style={{ width: size, height: size, background: AMBER, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 16 16" fill="none">
        <path d="M3 13 L7 3 L9 8 L11 5 L13 13" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

export default function Header() {
  const location = useLocation()

  const isActive = (path) =>
    path === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(path)

  return (
    <header style={{ background: DARK, borderBottom: '0.5px solid rgba(255,255,255,0.08)' }} className="sticky top-0 z-10">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <LogoMark size={28} />
          <span className="font-medium text-sm" style={{ color: '#fff' }}>
            Gear<span style={{ color: AMBER }}>Fitted</span>
          </span>
        </Link>

        <nav className="flex items-center gap-5">
          {[
            { to: '/', label: 'Home' },
            { to: '/golf', label: 'Golf' },
            { to: '/about', label: 'About' },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="text-sm transition-colors"
              style={{ color: isActive(to) ? AMBER : 'rgba(255,255,255,0.45)' }}
            >
              {label}
            </Link>
          ))}
          <span className="text-sm" style={{ color: 'rgba(255,255,255,0.2)' }}>More sports soon</span>
        </nav>
      </div>
    </header>
  )
}
