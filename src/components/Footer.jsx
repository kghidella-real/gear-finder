import { Link } from "react-router-dom"

const BRAND_GREEN = '#2D6A4F'

function LogoMark({ size = 22 }) {
  return (
    <div style={{ width: size, height: size, background: BRAND_GREEN, borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 16 16" fill="none">
        <path d="M3 13 L7 3 L9 8 L11 5 L13 13" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 py-10">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <LogoMark size={22} />
              <span className="font-medium text-gray-900 text-sm">
                Gear<span style={{ color: BRAND_GREEN }}>Fitted</span>
              </span>
            </div>
            <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
              Honest gear recommendations, matched to your game. Built by an athlete, for every athlete.
            </p>
          </div>
          <div className="flex gap-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Golf</p>
              <div className="flex flex-col gap-2">
                <Link to="/golf/irons" className="text-sm text-gray-500 hover:text-gray-700" style={{ color: BRAND_GREEN }}>Irons</Link>
                <span className="text-sm text-gray-300">Drivers — soon</span>
                <span className="text-sm text-gray-300">Wedges — soon</span>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Company</p>
              <div className="flex flex-col gap-2">
                <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">Home</Link>
                <Link to="/about" className="text-sm text-gray-500 hover:text-gray-700">About</Link>
                <Link to="/about?tab=contact" className="text-sm text-gray-500 hover:text-gray-700">Contact</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-100 pt-6 flex flex-col md:flex-row justify-between gap-2">
          <p className="text-xs text-gray-400">© 2026 GearFitted. Affiliate links help keep this site free. Rankings are never influenced by brand relationships.</p>
          <p className="text-xs text-gray-400">Built by an athlete, for every athlete.</p>
        </div>
      </div>
    </footer>
  )
}
