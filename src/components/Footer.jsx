import { Link } from "react-router-dom"

const AMBER = '#C8965A'
const DARK = '#1C1C1E'

function LogoMark({ size = 22 }) {
  return (
    <div style={{ width: size, height: size, background: AMBER, borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 16 16" fill="none">
        <path d="M3 13 L7 3 L9 8 L11 5 L13 13" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

export default function Footer() {
  return (
    <footer style={{ background: DARK, borderTop: '0.5px solid rgba(255,255,255,0.08)' }}>
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <LogoMark size={22} />
              <span className="font-medium text-sm" style={{ color: '#fff' }}>
                Gear<span style={{ color: AMBER }}>Fitted</span>
              </span>
            </div>
            <p className="text-xs max-w-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Honest gear recommendations, matched to your game. Built by an athlete, for every athlete.
            </p>
          </div>

          <div className="flex gap-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>Golf</p>
              <div className="flex flex-col gap-2">
                <Link to="/golf" className="text-sm hover:opacity-80 transition-opacity" style={{ color: AMBER }}>
                  Find my gear
                </Link>
                {['Irons', 'Drivers', 'Wedges', 'Putters', 'Full sets'].map(item => (
                  <Link key={item} to="/golf" className="text-sm transition-colors" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    {item}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>Company</p>
              <div className="flex flex-col gap-2">
                <Link to="/" className="text-sm transition-colors" style={{ color: 'rgba(255,255,255,0.45)' }}>Home</Link>
                <Link to="/about" className="text-sm transition-colors" style={{ color: 'rgba(255,255,255,0.45)' }}>About</Link>
                <Link to="/about?tab=contact" className="text-sm transition-colors" style={{ color: 'rgba(255,255,255,0.45)' }}>Contact</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col md:flex-row justify-between gap-2"
          style={{ borderTop: '0.5px solid rgba(255,255,255,0.08)' }}>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
            © 2026 GearFitted. Affiliate links help keep this site free. Rankings are never influenced by brand relationships.
          </p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
            Built by an athlete, for every athlete.
          </p>
        </div>
      </div>
    </footer>
  )
}
