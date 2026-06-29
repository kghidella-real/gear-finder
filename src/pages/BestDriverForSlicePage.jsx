import { Link } from "react-router-dom"

const BRAND_GREEN = '#C8965A'
const BRAND_GREEN_LIGHT = '#FAF4EC'

export default function BestDriverForSlicePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">

      <h1 className="text-2xl font-medium text-gray-900 mb-3 leading-tight">
        Best Driver for a Slice (2026)
      </h1>
      <p className="text-sm text-gray-500 leading-relaxed mb-8">
        A slice happens when the clubface is open relative to your swing path at impact,
        putting left-to-right sidespin on the ball. The good news: modern driver technology
        can correct for a large part of this automatically. Here's what actually helps —
        and a quick way to find the right one for your exact swing.
      </p>

      <div className="rounded-xl border p-5 mb-8" style={{ borderColor: '#e5e7eb', background: BRAND_GREEN_LIGHT }}>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          Rather than reading another generic top-10 list, answer 4 quick questions and
          we'll match you to the actual best driver for your swing speed, miss pattern, and budget.
        </p>
        <Link
          to="/golf?type=drivers&miss=slice"
          className="inline-block px-5 py-2.5 rounded-lg text-white text-sm font-medium transition-all hover:opacity-90"
          style={{ background: '#1f2937' }}
        >
          Find my driver →
        </Link>
      </div>

      <h2 className="text-lg font-medium text-gray-900 mb-3">What actually fixes a slice</h2>
      <ul className="space-y-3 mb-8">
        <li className="text-sm text-gray-600 leading-relaxed">
          <span className="font-medium text-gray-900">Draw bias.</span> Weight is shifted toward
          the heel of the clubhead, which helps the face close more naturally through impact.
          This is the single biggest lever for fixing a slice without changing your swing.
        </li>
        <li className="text-sm text-gray-600 leading-relaxed">
          <span className="font-medium text-gray-900">Higher MOI (forgiveness).</span> A more
          stable head resists twisting on off-centre hits, so a typical slicer's toe-side
          miss doesn't lose as much accuracy or distance.
        </li>
        <li className="text-sm text-gray-600 leading-relaxed">
          <span className="font-medium text-gray-900">Lighter, more flexible shafts.</span> Slower
          swing speeds often struggle to square the face in time. A lighter shaft can help
          generate the speed needed to release the club fully.
        </li>
        <li className="text-sm text-gray-600 leading-relaxed">
          <span className="font-medium text-gray-900">Closed or adjustable face angle.</span> Some
          drivers let you dial in extra draw bias through an adjustable hosel or weight track —
          useful if your slice is severe rather than mild.
        </li>
      </ul>

      <h2 className="text-lg font-medium text-gray-900 mb-3">A few models worth knowing</h2>
      <p className="text-sm text-gray-500 leading-relaxed mb-4">
        Specific models change every year as brands release new lines, which is exactly why
        a generic "best of" list goes stale fast. As a general guide, look for drivers explicitly
        marketed with "SFT," "Draw," "HD," or "Max D" in the name — these almost always indicate
        a draw-biased version built for exactly this miss. Pair that with your actual swing speed
        and budget for the best match.
      </p>

      <div className="rounded-xl border p-5 mt-8" style={{ borderColor: '#e5e7eb' }}>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          Still not sure where to start? Tell us your miss, swing speed, and budget and
          we'll do the matching for you.
        </p>
        <Link
          to="/golf?type=drivers&miss=slice"
          className="inline-block px-5 py-2.5 rounded-lg text-white text-sm font-medium transition-all hover:opacity-90"
          style={{ background: '#1f2937' }}
        >
          Find my driver →
        </Link>
      </div>

    </div>
  )
}
