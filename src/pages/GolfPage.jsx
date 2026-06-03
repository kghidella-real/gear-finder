import { useState } from "react"

// Matchers
import { matchClubs, getMatchLabel, getMatchPercent } from "../lib/matcher"
import { matchDrivers, getDriverMatchLabel, getDriverMatchPercent } from "../lib/driverMatcher"
import { matchWedges, getWedgeMatchLabel, getWedgeMatchPercent } from "../lib/wedgeMatcher"
import { matchPutters, getPutterMatchLabel, getPutterMatchPercent } from "../lib/putterMatcher"
import { matchSets, getSetsMatchLabel, getSetsMatchPercent } from "../lib/setsMatcher"
import { matchFairways, getFairwayMatchLabel, getFairwayMatchPercent } from "../lib/fairwayMatcher"

// Data
import ironsData from "../data/irons.json"
import driversData from "../data/drivers.json"
import wedgesData from "../data/wedges.json"
import puttersData from "../data/putters.json"
import setsData from "../data/sets.json"
import fairwaysData from "../data/fairways.json"

const BRAND_GREEN = '#C8965A'
const BRAND_GREEN_LIGHT = '#FAF4EC'

// ─────────────────────────────────────────────
// Club type definitions
// ─────────────────────────────────────────────

const CLUB_TYPES = [
  { id: 'drivers',  label: 'Drivers',                  emoji: '🎯', live: true, desc: 'Match a driver to your swing speed and miss' },
  { id: 'fairways', label: 'Fairway woods & hybrids',  emoji: '🌲', live: true, desc: 'Find fairway woods and hybrids for any slot in your bag' },
  { id: 'irons',    label: 'Irons',                    emoji: '🏌️', live: true, desc: 'Find irons matched to your handicap and swing' },
  { id: 'wedges',   label: 'Wedges',                   emoji: '🥏', live: true, desc: 'Find wedges for your short game and conditions' },
  { id: 'putters',  label: 'Putters',                  emoji: '🎱', live: true, desc: 'Match a putter to your stroke type and style' },
  { id: 'sets',     label: 'Full sets',                emoji: '🏅', live: true, desc: 'Find a complete set matched to your level and budget' },
]

// ─────────────────────────────────────────────
// Intake options — Irons
// ─────────────────────────────────────────────

const IRON_CATEGORIES = [
  { id: 'max_forgiveness', label: 'Max forgiveness', hcp: '30+ hcp', desc: 'Biggest sweet spot, widest sole, maximum offset.', bars: { Forgiving: 95, Distance: 65, Workable: 15 } },
  { id: 'game_improvement', label: 'Game improvement', hcp: '18–25+ hcp', desc: 'Forgiving without looking chunky. Most popular.', bars: { Forgiving: 78, Distance: 78, Workable: 40 } },
  { id: 'players_distance', label: 'Players distance', hcp: '10–20 hcp', desc: 'Thin topline, hot face, some forgiveness.', bars: { Forgiving: 55, Distance: 92, Workable: 60 } },
  { id: 'players', label: 'Players', hcp: '5–15 hcp', desc: 'Compact head, minimal offset, precise feedback.', bars: { Forgiving: 35, Distance: 62, Workable: 88 } },
  { id: 'muscle_back', label: 'Muscle back', hcp: '0–10 hcp', desc: 'Traditional blade. Zero forgiveness, maximum feel.', bars: { Forgiving: 12, Distance: 55, Workable: 100 } },
]

const IRON_HANDICAP_RANGES = [
  { id: 5, label: '0–5' }, { id: 10, label: '6–10' }, { id: 15, label: '11–15' },
  { id: 20, label: '16–20' }, { id: 25, label: '21–25' }, { id: 36, label: '26–36' }, { id: 54, label: '36+' },
]

const IRON_MISSES = [
  { id: 'slice', label: 'Slice', sub: 'Ball curves right (right-handed)' },
  { id: 'hook', label: 'Hook', sub: 'Ball curves left (right-handed)' },
  { id: 'thin_fat', label: 'Thin / fat', sub: 'Catching it early or heavy' },
  { id: 'none', label: 'No consistent miss', sub: 'Pretty solid ball striking' },
]

const IRON_BUDGETS = [
  { id: 500, label: 'Under $500' }, { id: 900, label: '$500–$900' },
  { id: 1300, label: '$900–$1,300' }, { id: 9999, label: 'No limit' },
]

// ─────────────────────────────────────────────
// Intake options — Drivers
// ─────────────────────────────────────────────

const DRIVER_DISTANCES = [
  { id: 'under_180', label: 'Under 180 yards', sub: 'Slower swing speed' },
  { id: '180_220',   label: '180–220 yards',   sub: 'Moderate swing speed' },
  { id: '220_260',   label: '220–260 yards',   sub: 'Average swing speed' },
  { id: '260_plus',  label: '260+ yards',      sub: 'Fast swing speed' },
  { id: 'not_sure',  label: 'Not sure',        sub: "I don't track distance" },
]

const DRIVER_MISSES = [
  { id: 'slice',    label: 'Slice',           sub: 'Ball curves right (right-handed)' },
  { id: 'hook',     label: 'Hook',            sub: 'Ball curves left (right-handed)' },
  { id: 'both',     label: 'Both ways',       sub: 'Miss in multiple directions' },
  { id: 'straight', label: 'Pretty straight', sub: 'No consistent miss' },
]

const DRIVER_PRIORITIES = [
  { id: 'forgiveness', label: 'Maximum forgiveness', sub: 'Keep the ball in play above all else' },
  { id: 'distance',    label: 'Maximum distance',    sub: 'I want every yard I can get' },
  { id: 'both',        label: 'Both equally',        sub: 'A good balance of the two' },
]

const DRIVER_BUDGETS = [
  { id: 400, label: 'Under $400' }, { id: 600, label: '$400–$600' },
  { id: 9999, label: '$600+' }, { id: 9999, label: 'No limit' },
]

// ─────────────────────────────────────────────
// Intake options — Fairways & Hybrids
// ─────────────────────────────────────────────

const FAIRWAY_CLUB_TYPES = [
  { id: 'fairway_wood', label: 'Fairway wood',   sub: '3-wood, 5-wood, 7-wood — tee and fairway' },
  { id: 'hybrid',       label: 'Hybrid',         sub: 'Long iron replacement — versatile from anywhere' },
  { id: 'either',       label: 'Help me decide', sub: "I'm not sure which I need — show me both" },
]

const FAIRWAY_SLOTS_WOOD = [
  { id: '3wood',    label: '3-wood (15°)',    sub: 'Primary fairway metal off the tee' },
  { id: '5wood',    label: '5-wood (18–19°)', sub: 'Versatile from tee and fairway' },
  { id: '7wood',    label: '7-wood (21°)',    sub: 'High launch, soft landing approach' },
  { id: 'not_sure', label: 'Not sure',        sub: 'I just need something for the long game' },
]

const FAIRWAY_SLOTS_HYBRID = [
  { id: '3hybrid',  label: '3-hybrid (19–22°)', sub: 'Long iron replacement, lower loft' },
  { id: '4hybrid',  label: '4-hybrid (22–25°)', sub: 'Most popular hybrid loft' },
  { id: '5hybrid',  label: '5-hybrid (25–28°)', sub: 'Mid-iron replacement, high launch' },
  { id: 'not_sure', label: 'Not sure',           sub: 'I just need something for the long game' },
]

const FAIRWAY_SLOTS_ALL = [
  { id: '3wood',    label: '3-wood (15°)',      sub: 'Primary fairway metal off the tee' },
  { id: '5wood',    label: '5-wood (18–19°)',   sub: 'Versatile from tee and fairway' },
  { id: '7wood',    label: '7-wood (21°)',       sub: 'High launch, soft landing approach' },
  { id: '3hybrid',  label: '3-hybrid (19–22°)', sub: 'Long iron replacement, lower loft' },
  { id: '4hybrid',  label: '4-hybrid (22–25°)', sub: 'Most popular hybrid loft' },
  { id: '5hybrid',  label: '5-hybrid (25–28°)', sub: 'Mid-iron replacement, high launch' },
  { id: 'not_sure', label: 'Not sure',          sub: 'I just need something for the long game' },
]

const FAIRWAY_DISTANCES = [
  { id: 'under_180', label: 'Under 180 yards', sub: 'Slower swing speed' },
  { id: '180_220',   label: '180–220 yards',   sub: 'Moderate swing speed' },
  { id: '220_260',   label: '220–260 yards',   sub: 'Average swing speed' },
  { id: '260_plus',  label: '260+ yards',      sub: 'Fast swing speed' },
  { id: 'not_sure',  label: 'Not sure',        sub: "I don't track distance" },
]

const FAIRWAY_MISSES = [
  { id: 'slice',    label: 'Slice / fade',    sub: 'Ball curves right (right-handed)' },
  { id: 'hook',     label: 'Hook / draw',     sub: 'Ball curves left (right-handed)' },
  { id: 'both',     label: 'Both ways',       sub: 'Miss in multiple directions' },
  { id: 'straight', label: 'Pretty straight', sub: 'No consistent miss' },
]

const FAIRWAY_PRIORITIES = [
  { id: 'forgiveness', label: 'Maximum forgiveness', sub: 'Easy to hit from any lie' },
  { id: 'distance',    label: 'Maximum distance',    sub: 'Every yard I can get' },
  { id: 'workability', label: 'Shot shaping',        sub: 'Control and workability' },
  { id: 'both',        label: 'Balanced',            sub: 'A good mix of distance and forgiveness' },
]

const FAIRWAY_BUDGETS = [
  { id: 250,  label: 'Under $250' },
  { id: 350,  label: '$250–$350' },
  { id: 9999, label: '$350+' },
  { id: 9999, label: 'No limit' },
]

// ─────────────────────────────────────────────
// Intake options — Wedges
// ─────────────────────────────────────────────

const WEDGE_WEAKNESSES = [
  { id: 'bunkers',       label: 'Bunkers',               sub: 'I struggle to escape sand consistently' },
  { id: 'tight_lies',    label: 'Tight lies',            sub: 'Hard ground, firm fairways, open face shots' },
  { id: 'inconsistency', label: 'General inconsistency', sub: 'I need more forgiveness and reliability' },
  { id: 'all',           label: 'All equally',           sub: 'I want maximum versatility' },
]

const WEDGE_SWINGS = [
  { id: 'steep',   label: 'Steep',   sub: 'I take big divots after the ball' },
  { id: 'neutral', label: 'Neutral', sub: 'Moderate divot, fairly consistent contact' },
  { id: 'shallow', label: 'Shallow', sub: 'I sweep the turf, minimal divot' },
]

const WEDGE_CONDITIONS = [
  { id: 'firm',   label: 'Firm / links',  sub: 'Hard ground, tight lies, dry conditions' },
  { id: 'normal', label: 'Normal mix',    sub: 'Typical parkland conditions' },
  { id: 'soft',   label: 'Soft / wet',    sub: 'Lush fairways, fluffy rough, wet sand' },
  { id: 'varies', label: 'Varies a lot',  sub: 'I play in all kinds of conditions' },
]

const WEDGE_SKILLS = [
  { id: 'low',  label: '0–10 handicap',  sub: 'Consistent ball striker, shot-maker' },
  { id: 'mid',  label: '11–20 handicap', sub: 'Improving player, reasonable contact' },
  { id: 'high', label: '21+ handicap',   sub: 'Newer or casual golfer' },
]

const WEDGE_BUDGETS = [
  { id: 130, label: 'Under $130' }, { id: 170, label: '$130–$170' },
  { id: 9999, label: '$170+' }, { id: 9999, label: 'No limit' },
]

// ─────────────────────────────────────────────
// Intake options — Putters
// ─────────────────────────────────────────────

const PUTTER_STROKES = [
  { id: 'straight',   label: 'Straight back, straight through', sub: 'Face stays square throughout the stroke' },
  { id: 'slight_arc', label: 'Slight arc',                      sub: 'Small amount of face rotation — most common' },
  { id: 'strong_arc', label: 'Strong arc',                      sub: 'Significant face rotation, gate-style stroke' },
  { id: 'not_sure',   label: 'Not sure',                        sub: "I haven't analysed my stroke" },
]

const PUTTER_HEAD_STYLES = [
  { id: 'blade',         label: 'Blade',         sub: 'Traditional thin look, feedback-focused' },
  { id: 'mid_mallet',    label: 'Mid mallet',    sub: 'Between blade and full mallet' },
  { id: 'mallet',        label: 'Mallet',        sub: 'Larger head, more alignment help' },
  { id: 'no_preference', label: 'No preference', sub: 'Show me the best option for my stroke' },
]

const PUTTER_ALIGNMENTS = [
  { id: 'minimal',       label: 'Minimal',       sub: 'Clean look, single sightline or none' },
  { id: 'moderate',      label: 'Moderate',      sub: 'One or two clear alignment aids' },
  { id: 'heavy',         label: 'Heavy',         sub: 'Maximum alignment help — lines, dots, shapes' },
  { id: 'no_preference', label: 'No preference', sub: "I don't have strong feelings either way" },
]

const PUTTER_ZERO_TORQUE = [
  { id: true,  label: 'Yes — zero torque',        sub: 'Centre-shafted, stays square automatically' },
  { id: false, label: 'No — conventional',        sub: 'Traditional hosel, natural face rotation' },
  { id: null,  label: 'Not sure / no preference', sub: "I don't know what zero torque is" },
]

const PUTTER_BUDGETS = [
  { id: 200, label: 'Under $200' }, { id: 350, label: '$200–$350' },
  { id: 500, label: '$350–$500' }, { id: 9999, label: 'No limit' },
]

// ─────────────────────────────────────────────
// Intake options — Sets
// ─────────────────────────────────────────────

const SETS_SKILLS = [
  { id: 'beginner', label: 'Complete beginner', sub: "I'm new to golf or have played fewer than 10 rounds" },
  { id: 'high',     label: 'High handicap',     sub: '20+ handicap, established player looking for a full set' },
  { id: 'mid',      label: 'Mid handicap',      sub: '8–20 handicap, want matched premium clubs' },
]

const SETS_SHAFTS = [
  { id: 'graphite', label: 'Graphite', sub: 'Lighter, recommended for most golfers' },
  { id: 'steel',    label: 'Steel',    sub: 'Heavier, more consistent — stronger swingers' },
  { id: 'not_sure', label: 'Not sure', sub: 'Show me the best option for my level' },
]

const SETS_PRIORITIES = [
  { id: 'value',       label: 'Best value for money', sub: 'I want the most for my budget' },
  { id: 'performance', label: 'Best performance',     sub: 'I want the most forgiving and longest set available' },
  { id: 'brand',       label: 'Trusted brand name',   sub: 'I want clubs from a brand I recognise' },
]

const SETS_BUDGETS = [
  { id: 500,  label: 'Under $500' },
  { id: 1500, label: '$500–$1,500' },
  { id: 2000, label: '$1,500–$2,000' },
  { id: 9999, label: '$2,000+' },
]

// ─────────────────────────────────────────────
// Shared UI components
// ─────────────────────────────────────────────

function ProgressBar({ steps, current }) {
  return (
    <div className="flex gap-1.5 mb-6">
      {Array.from({ length: steps }).map((_, i) => (
        <div key={i} className="h-1 flex-1 rounded-full transition-all"
          style={{ background: i <= current ? BRAND_GREEN : '#e5e7eb' }} />
      ))}
    </div>
  )
}

function OptionCard({ selected, onClick, label, sub, disabled }) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className="w-full text-left px-4 py-3 rounded-xl border transition-all mb-2 disabled:opacity-40 disabled:cursor-not-allowed"
      style={{
        borderColor: selected ? BRAND_GREEN : '#e5e7eb',
        borderWidth: selected ? 2 : 1,
        background: selected ? BRAND_GREEN_LIGHT : '#fff',
      }}
    >
      <span className="text-sm font-medium text-gray-900">{label}</span>
      {sub && <span className="text-xs text-gray-400 ml-2">{sub}</span>}
    </button>
  )
}

function PillButton({ selected, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-full text-sm border transition-all"
      style={{
        borderColor: selected ? BRAND_GREEN : '#e5e7eb',
        background: selected ? BRAND_GREEN_LIGHT : '#fff',
        color: selected ? BRAND_GREEN : '#374151',
      }}
    >
      {children}
    </button>
  )
}

function NavButtons({ onBack, onNext, canContinue, isLast }) {
  return (
    <div className="flex gap-3 mt-5">
      {onBack && (
        <button onClick={onBack} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">
          ← Back
        </button>
      )}
      <button
        onClick={onNext}
        disabled={!canContinue}
        className="flex-1 py-2.5 rounded-lg text-white text-sm font-medium disabled:opacity-40 hover:opacity-90 transition-all"
        style={{ background: '#1f2937' }}
      >
        {isLast ? 'Show my matches' : 'Continue →'}
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────
// Match bar
// ─────────────────────────────────────────────

function MatchBar({ score, maxScore, getLabelFn, getPercentFn }) {
  const percent = getPercentFn(score, maxScore)
  const { label, color } = getLabelFn(score, maxScore)
  const colors = {
    success:   { bar: '#22c55e', text: '#15803d', bg: '#f0fdf4' },
    info:      { bar: '#3b82f6', text: '#1d4ed8', bg: '#eff6ff' },
    warning:   { bar: '#f59e0b', text: '#b45309', bg: '#fffbeb' },
    secondary: { bar: '#9ca3af', text: '#4b5563', bg: '#f9fafb' },
  }
  const c = colors[color]
  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-500">Profile match</span>
        <span className="text-xs font-medium px-2 py-0.5 rounded-full"
          style={{ background: c.bg, color: c.text }}>{label}</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full">
        <div className="h-1.5 rounded-full transition-all duration-700"
          style={{ width: `${percent}%`, background: c.bar }} />
      </div>
    </div>
  )
}

function StatBar({ label, value }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-400 w-20 text-right">{label}</span>
      <div className="flex-1 h-1 bg-gray-100 rounded-full">
        <div className="h-1 rounded-full bg-gray-400" style={{ width: `${value * 10}%` }} />
      </div>
      <span className="text-xs text-gray-400 w-4">{value}</span>
    </div>
  )
}

// ─────────────────────────────────────────────
// Result card — handles all club types
// ─────────────────────────────────────────────

function ResultCard({ club, rank, clubType }) {
  const getLabelFn = clubType === 'drivers'  ? getDriverMatchLabel
    : clubType === 'wedges'   ? getWedgeMatchLabel
    : clubType === 'putters'  ? getPutterMatchLabel
    : clubType === 'sets'     ? getSetsMatchLabel
    : clubType === 'fairways' ? getFairwayMatchLabel
    : getMatchLabel

  const getPercentFn = clubType === 'drivers'  ? getDriverMatchPercent
    : clubType === 'wedges'   ? getWedgeMatchPercent
    : clubType === 'putters'  ? getPutterMatchPercent
    : clubType === 'sets'     ? getSetsMatchPercent
    : clubType === 'fairways' ? getFairwayMatchPercent
    : getMatchPercent

  const isTopPick = rank === 0
  const rankLabel = rank === 0 ? 'Top pick' : rank === 1 ? 'Runner up' : rank === 2 ? 'Also consider' : null

  const subtitle = {
    irons:    `${club.category_label} · ${club.shaft_options?.join(' or ')} shaft`,
    drivers:  `${club.category_label} · ${club.head_size_cc}cc · ${club.lofts_available?.join('°, ')}°`,
    wedges:   `${club.category_label} · ${club.lofts_available?.join('°, ')}°`,
    putters:  `${club.category_label} · ${club.head_style?.replace(/_/g, ' ')}`,
    sets:     `${club.category_label} · ${club.pieces} clubs · ${club.shaft} shafts`,
    fairways: `${club.category_label} · ${club.club_type?.replace(/_/g, ' ')} · ${club.lofts_available?.join('°, ')}°`,
  }[clubType] || club.category_label

  const priceLabel = {
    irons: 'set price', drivers: 'per club', wedges: 'per wedge',
    putters: 'per putter', sets: 'complete set', fairways: 'per club',
  }[clubType] || 'price'

  const stats = {
    irons:    [['Forgiveness', club.forgiveness], ['Distance', club.distance_rating], ['Workability', club.workability], ['Feel', club.feel_rating]],
    drivers:  [['Forgiveness', club.forgiveness], ['Distance', club.distance_rating], ['Workability', club.workability], ['Feel', club.feel_rating]],
    wedges:   [['Spin', club.spin_rating], ['Forgiveness', club.forgiveness], ['Feel', club.feel_rating], ['Versatility', club.versatility]],
    putters:  [['Forgiveness', club.forgiveness], ['Feel', club.feel_rating], ['Alignment', club.alignment_rating], ['Distance ctrl', club.distance_control]],
    sets:     [['Forgiveness', club.forgiveness], ['Distance', club.distance_rating], ['Value', club.value_rating]],
    fairways: [['Forgiveness', club.forgiveness], ['Distance', club.distance_rating], ['Workability', club.workability], ['Feel', club.feel_rating]],
  }[clubType] || []

  return (
    <div className="bg-white rounded-2xl p-5 mb-4"
      style={{ border: isTopPick ? `2px solid ${BRAND_GREEN}` : '1px solid #e5e7eb' }}>

      {rankLabel && (
        <span className="inline-block text-xs font-medium px-2.5 py-0.5 rounded-full mb-2"
          style={isTopPick
            ? { background: BRAND_GREEN_LIGHT, color: BRAND_GREEN }
            : { background: '#f3f4f6', color: '#4b5563' }}>
          {rankLabel}
        </span>
      )}

      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-base font-medium text-gray-900">{club.name}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-medium text-gray-900">${club.price_usd?.toLocaleString()}</p>
          <p className="text-xs text-gray-400">{priceLabel}</p>
        </div>
      </div>

      <MatchBar score={club.match_score} maxScore={club.match_max} getLabelFn={getLabelFn} getPercentFn={getPercentFn} />

      <p className="text-sm text-gray-600 leading-relaxed mb-4">{club.community_verdict}</p>

      {stats.length > 0 && (
        <div className="flex flex-col gap-1.5 mb-4 py-3 border-t border-b border-gray-100">
          {stats.map(([label, value]) => (
            <StatBar key={label} label={label} value={value} />
          ))}
        </div>
      )}

      {/* Fairways — draw bias badge */}
      {clubType === 'fairways' && club.draw_bias && (
        <div className="mb-4">
          <span className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: BRAND_GREEN_LIGHT, color: BRAND_GREEN }}>
            Draw bias
          </span>
          {club.adjustable && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 ml-1.5">Adjustable</span>
          )}
        </div>
      )}

      {/* Wedges */}
      {clubType === 'wedges' && (
        <div className="mb-4">
          {club.grinds_available && (
            <div className="mb-1.5">
              <span className="text-xs text-gray-400 mr-2">Grinds:</span>
              {club.grinds_available.map(g => (
                <span key={g} className="inline-block text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 mr-1 mb-1">{g}</span>
              ))}
            </div>
          )}
          {club.bounce_options && (
            <div>
              <span className="text-xs text-gray-400 mr-2">Bounce:</span>
              {club.bounce_options.map(b => (
                <span key={b} className="inline-block text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 mr-1">{b}</span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Drivers */}
      {clubType === 'drivers' && club.draw_bias && (
        <div className="mb-4 flex gap-2 flex-wrap">
          <span className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: BRAND_GREEN_LIGHT, color: BRAND_GREEN }}>
            Draw bias
          </span>
          {club.adjustable && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Adjustable</span>
          )}
        </div>
      )}

      {/* Putters */}
      {clubType === 'putters' && (
        <div className="mb-4 flex gap-2 flex-wrap">
          {club.stroke_type?.map(s => (
            <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
              {s.replace(/_/g, ' ')} stroke
            </span>
          ))}
          {club.hosel_options?.slice(0, 2).map(h => (
            <span key={h} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">
              {h.replace(/_/g, ' ')}
            </span>
          ))}
        </div>
      )}

      {/* Sets */}
      {clubType === 'sets' && (
        <div className="mb-4">
          <span className="text-xs text-gray-400 mr-2">Includes:</span>
          {club.includes?.map(item => (
            <span key={item} className="inline-block text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 mr-1 mb-1">
              {item.replace(/_/g, ' ')}
            </span>
          ))}
        </div>
      )}

      {/* Community rating */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium text-gray-900">{club.community_rating}</span>
          <div className="flex gap-0.5">
            {[1,2,3,4,5].map(star => (
              <svg key={star}
                className={`w-3.5 h-3.5 ${star <= Math.round(club.community_rating) ? 'text-amber-400' : 'text-gray-200'}`}
                fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-gray-400">/ 5</span>
        </div>
        <span className="text-xs text-gray-400">{club.community_count?.toLocaleString()} reviews</span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {club.tags?.slice(0, 3).map(tag => (
          <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">
            {tag.replace(/-/g, ' ')}
          </span>
        ))}
      </div>

      {/* CTA */}
      {club.affiliate_url ? (
        <a href={club.affiliate_url} target="_blank" rel="noopener noreferrer"
          className="block w-full text-center py-2.5 rounded-lg text-white text-sm font-medium hover:opacity-90 transition-all"
          style={{ background: '#1f2937' }}>
          View deal →
        </a>
      ) : (
        <button disabled
          className="w-full py-2.5 rounded-lg bg-gray-100 text-gray-400 text-sm cursor-not-allowed">
          Affiliate link coming soon
        </button>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// Browse lists
// ─────────────────────────────────────────────

const CATEGORIES_BY_TYPE = {
  irons:    [{ key: 'max_forgiveness', label: 'Max forgiveness' }, { key: 'game_improvement', label: 'Game improvement' }, { key: 'players_distance', label: 'Players distance' }, { key: 'players', label: 'Players' }, { key: 'muscle_back', label: 'Muscle back' }],
  drivers:  [{ key: 'max_forgiveness', label: 'Max forgiveness' }, { key: 'game_improvement', label: 'Game improvement' }, { key: 'players_distance', label: 'Players distance' }, { key: 'players', label: 'Players' }],
  wedges:   [{ key: 'tour_performance', label: 'Tour performance' }, { key: 'versatile', label: 'Versatile' }, { key: 'game_improvement', label: 'Game improvement' }, { key: 'specialist', label: 'Specialist' }],
  putters:  [{ key: 'blade', label: 'Blade' }, { key: 'mid_mallet', label: 'Mid mallet' }, { key: 'mallet', label: 'Mallet' }, { key: 'zero_torque', label: 'Zero torque' }],
  sets:     [{ key: 'beginner', label: 'Beginner' }, { key: 'high_handicap', label: 'High handicap' }, { key: 'mid_handicap', label: 'Mid handicap' }],
  fairways: [{ key: 'max_forgiveness', label: 'Max forgiveness' }, { key: 'game_improvement', label: 'Game improvement' }, { key: 'players', label: 'Players' }],
}

const DATA_BY_TYPE = {
  irons: ironsData, drivers: driversData, wedges: wedgesData,
  putters: puttersData, sets: setsData, fairways: fairwaysData,
}

function browseSubtitle(item, clubType) {
  if (clubType === 'irons')    return `${item.brand} · ${item.shaft_options?.join(' or ')} shaft`
  if (clubType === 'drivers')  return `${item.brand} · ${item.head_size_cc}cc${item.draw_bias ? ' · Draw bias' : ''}`
  if (clubType === 'wedges')   return `${item.brand} · ${item.lofts_available?.length} lofts`
  if (clubType === 'putters')  return `${item.brand} · ${item.head_style?.replace(/_/g, ' ')}`
  if (clubType === 'sets')     return `${item.brand} · ${item.pieces} clubs · ${item.shaft} shafts`
  if (clubType === 'fairways') return `${item.brand} · ${item.club_type?.replace(/_/g, ' ')}${item.draw_bias ? ' · Draw bias' : ''}`
  return item.brand
}

function BrowseCard({ item, clubType }) {
  const [expanded, setExpanded] = useState(false)
  const subtitle = browseSubtitle(item, clubType)
  const stats = {
    irons:    [['Forgiveness', item.forgiveness], ['Distance', item.distance_rating], ['Workability', item.workability], ['Feel', item.feel_rating]],
    drivers:  [['Forgiveness', item.forgiveness], ['Distance', item.distance_rating], ['Workability', item.workability], ['Feel', item.feel_rating]],
    wedges:   [['Spin', item.spin_rating], ['Forgiveness', item.forgiveness], ['Feel', item.feel_rating], ['Versatility', item.versatility]],
    putters:  [['Forgiveness', item.forgiveness], ['Feel', item.feel_rating], ['Alignment', item.alignment_rating], ['Distance ctrl', item.distance_control]],
    sets:     [['Forgiveness', item.forgiveness], ['Distance', item.distance_rating], ['Value', item.value_rating]],
    fairways: [['Forgiveness', item.forgiveness], ['Distance', item.distance_rating], ['Workability', item.workability], ['Feel', item.feel_rating]],
  }[clubType] || []

  return (
    <div
      className="bg-white rounded-xl overflow-hidden transition-all"
      style={{ border: expanded ? `1.5px solid ${BRAND_GREEN}` : '1px solid #e5e7eb' }}
    >
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">{item.name}</p>
          <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
        </div>
        <div className="flex items-center gap-3 ml-3 shrink-0">
          <p className="text-sm font-medium text-gray-900">${item.price_usd?.toLocaleString()}</p>
          <svg
            width="16" height="16" viewBox="0 0 16 16" fill="none"
            className="transition-transform duration-200"
            style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', color: BRAND_GREEN }}
          >
            <path d="M4 6 L8 10 L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-100">
          <p className="text-sm text-gray-600 leading-relaxed mt-4 mb-4">{item.community_verdict}</p>

          {stats.length > 0 && (
            <div className="flex flex-col gap-1.5 mb-4 py-3 border-t border-b border-gray-100">
              {stats.map(([label, value]) => (
                <StatBar key={label} label={label} value={value} />
              ))}
            </div>
          )}

          {clubType === 'wedges' && (
            <div className="mb-4">
              {item.grinds_available && (
                <div className="mb-1.5">
                  <span className="text-xs text-gray-400 mr-2">Grinds:</span>
                  {item.grinds_available.map(g => (
                    <span key={g} className="inline-block text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 mr-1 mb-1">{g}</span>
                  ))}
                </div>
              )}
              {item.bounce_options && (
                <div>
                  <span className="text-xs text-gray-400 mr-2">Bounce:</span>
                  {item.bounce_options.map(b => (
                    <span key={b} className="inline-block text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 mr-1">{b}</span>
                  ))}
                </div>
              )}
            </div>
          )}

          {(clubType === 'drivers' || clubType === 'fairways') && item.draw_bias && (
            <div className="mb-4 flex gap-2 flex-wrap">
              <span className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: BRAND_GREEN_LIGHT, color: BRAND_GREEN }}>Draw bias</span>
              {item.adjustable && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Adjustable</span>
              )}
            </div>
          )}

          {clubType === 'putters' && (
            <div className="mb-4 flex gap-2 flex-wrap">
              {item.stroke_type?.map(s => (
                <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                  {s.replace(/_/g, ' ')} stroke
                </span>
              ))}
              {item.hosel_options?.slice(0, 2).map(h => (
                <span key={h} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">
                  {h.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          )}

          {clubType === 'sets' && (
            <div className="mb-4">
              <span className="text-xs text-gray-400 mr-2">Includes:</span>
              {item.includes?.map(inc => (
                <span key={inc} className="inline-block text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 mr-1 mb-1">
                  {inc.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-1.5 mb-4">
            {item.tags?.slice(0, 3).map(tag => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">
                {tag.replace(/-/g, ' ')}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium text-gray-900">{item.community_rating}</span>
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(star => (
                  <svg key={star}
                    className={`w-3.5 h-3.5 ${star <= Math.round(item.community_rating) ? 'text-amber-400' : 'text-gray-200'}`}
                    fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-gray-400">/ 5</span>
            </div>
            <span className="text-xs text-gray-400">{item.community_count?.toLocaleString()} reviews</span>
          </div>

          {item.affiliate_url ? (
            <a href={item.affiliate_url} target="_blank" rel="noopener noreferrer"
              className="block w-full text-center py-2.5 rounded-lg text-white text-sm font-medium hover:opacity-90 transition-all"
              style={{ background: '#1f2937' }}>
              View deal →
            </a>
          ) : (
            <button disabled
              className="w-full py-2.5 rounded-lg bg-gray-100 text-gray-400 text-sm cursor-not-allowed">
              Affiliate link coming soon
            </button>
          )}
        </div>
      )}
    </div>
  )
}

function BrowseList({ clubType }) {
  const data = DATA_BY_TYPE[clubType] || []
  const categories = CATEGORIES_BY_TYPE[clubType] || []
  return (
    <div className="pb-12">
      {categories.map(cat => {
        const items = data.filter(d => d.category === cat.key)
        if (items.length === 0) return null
        return (
          <div key={cat.key} className="mb-8">
            <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: BRAND_GREEN }}>
              {cat.label}
            </h3>
            <div className="flex flex-col gap-2">
              {items.map(item => (
                <BrowseCard key={item.id} item={item} clubType={clubType} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─────────────────────────────────────────────
// Intake forms
// ─────────────────────────────────────────────

function IronsForm({ onComplete }) {
  const [step, setStep] = useState(0)
  const [profile, setProfile] = useState({ path: null, category: null, handicap: null, miss: null, shaft: null, budget_max: null })
  function update(key, val) { setProfile(p => ({ ...p, [key]: val })) }
  const totalSteps = profile.path === 'category' ? 3 : 4

  if (step === 0) return (
    <div>
      <ProgressBar steps={totalSteps} current={0} />
      <h2 className="text-lg font-medium text-gray-900 mb-1">How do you want to find your irons?</h2>
      <p className="text-sm text-gray-500 mb-5">Pick a path that suits you.</p>
      <div className="flex gap-3">
        <button onClick={() => { update('path', 'category'); setStep(1) }}
          className="flex-1 p-4 rounded-xl border border-gray-200 bg-white hover:border-gray-400 transition-all text-left">
          <div className="text-sm font-medium text-gray-900 mb-1">I know the type I want</div>
          <div className="text-xs text-gray-500">Pick a category directly</div>
        </button>
        <button onClick={() => { update('path', 'guided'); setStep(1) }}
          className="flex-1 p-4 rounded-xl border border-gray-200 bg-white hover:border-gray-400 transition-all text-left">
          <div className="text-sm font-medium text-gray-900 mb-1">Help me figure it out</div>
          <div className="text-xs text-gray-500">Answer a few questions</div>
        </button>
      </div>
    </div>
  )

  if (step === 1 && profile.path === 'category') return (
    <div>
      <ProgressBar steps={totalSteps} current={1} />
      <h2 className="text-lg font-medium text-gray-900 mb-1">What type of iron suits your game?</h2>
      <p className="text-sm text-gray-500 mb-4">Select the category that matches where you are as a golfer.</p>
      {IRON_CATEGORIES.map(cat => (
        <button key={cat.id} onClick={() => update('category', cat.id)}
          className="w-full text-left p-4 rounded-xl border transition-all mb-2.5 flex items-center gap-4"
          style={{ borderColor: profile.category === cat.id ? BRAND_GREEN : '#e5e7eb', borderWidth: profile.category === cat.id ? 2 : 1, background: profile.category === cat.id ? BRAND_GREEN_LIGHT : '#fff' }}>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-sm text-gray-900">{cat.label}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{cat.hcp}</span>
            </div>
            <p className="text-xs text-gray-500">{cat.desc}</p>
          </div>
          <div className="flex flex-col gap-1 min-w-24">
            {Object.entries(cat.bars).map(([k, v]) => (
              <div key={k} className="flex items-center gap-1.5">
                <span className="text-xs text-gray-400 w-16 text-right">{k}</span>
                <div className="flex-1 h-1 bg-gray-200 rounded-full">
                  <div className="h-1 rounded-full" style={{ width: `${v}%`, background: BRAND_GREEN }} />
                </div>
              </div>
            ))}
          </div>
        </button>
      ))}
      <NavButtons onBack={() => setStep(0)} onNext={() => setStep(2)} canContinue={!!profile.category} isLast={false} />
    </div>
  )

  if (step === 1 && profile.path === 'guided') return (
    <div>
      <ProgressBar steps={totalSteps} current={1} />
      <h2 className="text-lg font-medium text-gray-900 mb-1">What's your handicap?</h2>
      <p className="text-sm text-gray-500 mb-4">The most important factor in matching irons to your game.</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {IRON_HANDICAP_RANGES.map(r => (
          <PillButton key={r.id} selected={profile.handicap === r.id} onClick={() => update('handicap', r.id)}>{r.label}</PillButton>
        ))}
      </div>
      <NavButtons onBack={() => setStep(0)} onNext={() => setStep(2)} canContinue={!!profile.handicap} isLast={false} />
    </div>
  )

  if (step === 2) return (
    <div>
      <ProgressBar steps={totalSteps} current={2} />
      <h2 className="text-lg font-medium text-gray-900 mb-1">What's your most common miss?</h2>
      <p className="text-sm text-gray-500 mb-5">Helps find irons that work with your natural tendencies.</p>
      {IRON_MISSES.map(m => (
        <OptionCard key={m.id} selected={profile.miss === m.id} onClick={() => update('miss', m.id)} label={m.label} sub={m.sub} />
      ))}
      <NavButtons onBack={() => setStep(1)} onNext={() => setStep(3)} canContinue={!!profile.miss} isLast={false} />
    </div>
  )

  if (step === 3 && profile.path === 'category') return (
    <div>
      <ProgressBar steps={totalSteps} current={3} />
      <h2 className="text-lg font-medium text-gray-900 mb-1">What's your budget?</h2>
      <p className="text-sm text-gray-500 mb-5">For a full 7-piece set.</p>
      <div className="flex flex-wrap gap-2">
        {IRON_BUDGETS.map(b => (
          <PillButton key={b.id} selected={profile.budget_max === b.id} onClick={() => update('budget_max', b.id)}>{b.label}</PillButton>
        ))}
      </div>
      <NavButtons onBack={() => setStep(2)} onNext={() => onComplete(profile)} canContinue={!!profile.budget_max} isLast={true} />
    </div>
  )

  if (step === 3 && profile.path === 'guided') return (
    <div>
      <ProgressBar steps={totalSteps} current={3} />
      <h2 className="text-lg font-medium text-gray-900 mb-1">Shaft and budget</h2>
      <p className="text-sm text-gray-500 mb-5">Two quick ones to narrow it down.</p>
      <p className="text-sm font-medium text-gray-700 mb-2">Shaft preference</p>
      <div className="flex flex-wrap gap-2 mb-5">
        {['steel', 'graphite', 'not_sure'].map(s => (
          <PillButton key={s} selected={profile.shaft === s} onClick={() => update('shaft', s)}>
            {s === 'not_sure' ? 'Not sure' : s.charAt(0).toUpperCase() + s.slice(1)}
          </PillButton>
        ))}
      </div>
      <p className="text-sm font-medium text-gray-700 mb-2">Budget (7-piece set)</p>
      <div className="flex flex-wrap gap-2">
        {IRON_BUDGETS.map(b => (
          <PillButton key={b.id} selected={profile.budget_max === b.id} onClick={() => update('budget_max', b.id)}>{b.label}</PillButton>
        ))}
      </div>
      <NavButtons onBack={() => setStep(2)} onNext={() => onComplete(profile)} canContinue={!!profile.shaft && !!profile.budget_max} isLast={true} />
    </div>
  )

  return null
}

function FairwaysForm({ onComplete }) {
  const [step, setStep] = useState(0)
  const [profile, setProfile] = useState({
    club_type: null, slot: null, distance: null,
    miss: null, priority: null, budget_max: null
  })
  function update(key, val) { setProfile(p => ({ ...p, [key]: val })) }

  // Dynamic slot options based on club_type selection
  const slotOptions = profile.club_type === 'fairway_wood'
    ? FAIRWAY_SLOTS_WOOD
    : profile.club_type === 'hybrid'
    ? FAIRWAY_SLOTS_HYBRID
    : FAIRWAY_SLOTS_ALL

  // Reset slot when club_type changes
  function updateClubType(val) {
    setProfile(p => ({ ...p, club_type: val, slot: null }))
  }

  const steps = [
    { key: 'club_type',  title: 'Fairway wood or hybrid?',         sub: 'Both replace long irons — the right choice depends on your game.',  options: FAIRWAY_CLUB_TYPES },
    { key: 'slot',       title: 'What slot are you filling?',      sub: 'Helps match the right loft to the gap in your bag.',                options: slotOptions },
    { key: 'distance',   title: 'How far do you hit your driver?', sub: 'Helps match clubs to your swing speed.',                           options: FAIRWAY_DISTANCES },
    { key: 'miss',       title: "What's your typical miss?",       sub: 'Shapes which designs suit your ball flight.',                      options: FAIRWAY_MISSES },
    { key: 'priority',   title: 'What matters most to you?',       sub: 'Helps balance your results.',                                      options: FAIRWAY_PRIORITIES },
    { key: 'budget_max', title: "What's your budget per club?",    sub: 'Previous gen options often available at a significant discount.',   options: FAIRWAY_BUDGETS },
  ]

  const current = steps[step]

  return (
    <div>
      <ProgressBar steps={steps.length} current={step} />
      <h2 className="text-lg font-medium text-gray-900 mb-1">{current.title}</h2>
      <p className="text-sm text-gray-500 mb-5">{current.sub}</p>
      {current.options.map((opt, i) => (
        <OptionCard
          key={i}
          selected={profile[current.key] === opt.id}
          onClick={() => current.key === 'club_type'
            ? updateClubType(opt.id)
            : update(current.key, opt.id)
          }
          label={opt.label}
          sub={opt.sub}
        />
      ))}
      <NavButtons
        onBack={step > 0 ? () => setStep(s => s - 1) : null}
        onNext={() => step < steps.length - 1 ? setStep(s => s + 1) : onComplete(profile)}
        canContinue={profile[current.key] !== null && profile[current.key] !== undefined}
        isLast={step === steps.length - 1}
      />
    </div>
  )
}

function SimpleStepForm({ steps, onComplete }) {
  const [step, setStep] = useState(0)
  const [profile, setProfile] = useState(() =>
    Object.fromEntries(steps.map(s => [s.key, null]))
  )
  function update(key, val) { setProfile(p => ({ ...p, [key]: val })) }
  const current = steps[step]
  return (
    <div>
      <ProgressBar steps={steps.length} current={step} />
      <h2 className="text-lg font-medium text-gray-900 mb-1">{current.title}</h2>
      <p className="text-sm text-gray-500 mb-5">{current.sub}</p>
      {current.options.map((opt, i) => (
        <OptionCard
          key={i}
          selected={profile[current.key] === opt.id}
          onClick={() => update(current.key, opt.id)}
          label={opt.label}
          sub={opt.sub}
        />
      ))}
      <NavButtons
        onBack={step > 0 ? () => setStep(s => s - 1) : null}
        onNext={() => step < steps.length - 1 ? setStep(s => s + 1) : onComplete(profile)}
        canContinue={profile[current.key] !== null && profile[current.key] !== undefined}
        isLast={step === steps.length - 1}
      />
    </div>
  )
}

// ─────────────────────────────────────────────
// Form step definitions
// ─────────────────────────────────────────────

const DRIVER_STEPS = [
  { key: 'distance',   title: 'How far do you hit your driver?',  sub: 'Helps match clubs to your swing speed.',      options: DRIVER_DISTANCES },
  { key: 'miss',       title: "What's your typical miss?",        sub: 'The most important question for drivers.',     options: DRIVER_MISSES },
  { key: 'priority',   title: 'What matters most to you?',        sub: 'Balances forgiveness vs distance in results.', options: DRIVER_PRIORITIES },
  { key: 'budget_max', title: "What's your budget?",              sub: 'We include discounted previous-gen options.',  options: DRIVER_BUDGETS },
]

const WEDGE_STEPS = [
  { key: 'weakness',   title: "What's your biggest short game weakness?", sub: 'Shapes every recommendation.',             options: WEDGE_WEAKNESSES },
  { key: 'swing_type', title: 'How would you describe your swing?',       sub: 'Determines how much bounce you need.',      options: WEDGE_SWINGS },
  { key: 'conditions', title: 'What conditions do you mainly play in?',   sub: 'Affects which grinds and bounce suit you.', options: WEDGE_CONDITIONS },
  { key: 'skill',      title: "What's your handicap range?",              sub: 'Balances spin vs forgiveness.',             options: WEDGE_SKILLS },
  { key: 'budget_max', title: "What's your budget per wedge?",            sub: 'Most golfers carry 3–4 wedges.',            options: WEDGE_BUDGETS },
]

const PUTTER_STEPS = [
  { key: 'stroke_type', title: "What's your putting stroke?",          sub: 'The most important fitting variable for putters.', options: PUTTER_STROKES },
  { key: 'head_style',  title: 'Do you have a head style preference?', sub: 'Blade, mallet, or somewhere in between.',         options: PUTTER_HEAD_STYLES },
  { key: 'alignment',   title: 'How much alignment help do you want?', sub: 'Minimal sightline to maximum alignment aids.',     options: PUTTER_ALIGNMENTS },
  { key: 'zero_torque', title: 'Conventional or zero torque?',         sub: 'Zero torque putters stay square automatically.',   options: PUTTER_ZERO_TORQUE },
  { key: 'budget_max',  title: "What's your budget?",                  sub: 'From great value to tour premium.',               options: PUTTER_BUDGETS },
]

const SETS_STEPS = [
  { key: 'skill',      title: "Where are you as a golfer?",      sub: 'Shapes the entire recommendation.',           options: SETS_SKILLS },
  { key: 'shaft',      title: 'Shaft preference?',               sub: 'Graphite is lighter and suits most players.', options: SETS_SHAFTS },
  { key: 'priority',   title: "What's most important to you?",   sub: 'Helps prioritise between options.',           options: SETS_PRIORITIES },
  { key: 'budget_max', title: "What's your budget for the set?", sub: 'Complete set including bag.',                 options: SETS_BUDGETS },
]

// ─────────────────────────────────────────────
// Hero text per club type
// ─────────────────────────────────────────────

const HERO_CONTENT = {
  irons:    { title: 'Find irons fitted to your game.',               sub: 'Handicap, miss pattern, and budget. No generic top-10 lists.' },
  drivers:  { title: 'Find a driver fitted to your game.',            sub: 'Four quick questions. All major brands. No sponsored results.' },
  fairways: { title: 'Find fairway woods and hybrids for your game.', sub: 'Swing speed, slot, miss pattern, and budget. All major brands.' },
  wedges:   { title: 'Find wedges for your short game.',              sub: 'Swing type, conditions, and weaknesses. Honest recommendations.' },
  putters:  { title: 'Find a putter fitted to your stroke.',          sub: 'Stroke type, head style, and alignment preference matched perfectly.' },
  sets:     { title: 'Find a complete set for your level.',           sub: 'Skill level, budget, and shaft preference. Everything in one go.' },
}

// ─────────────────────────────────────────────
// Main GolfPage
// ─────────────────────────────────────────────

export default function GolfPage() {
  const [phase, setPhase] = useState('pick')
  const [clubType, setClubType] = useState(null)
  const [results, setResults] = useState([])
  const [profile, setProfile] = useState(null)
  const [showAll, setShowAll] = useState(false)

  function handleClubPick(type) {
    setClubType(type)
    setPhase('form')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleFormComplete(userProfile) {
    let matches = []
    if (clubType === 'irons')    matches = matchClubs(ironsData, userProfile)
    if (clubType === 'drivers')  matches = matchDrivers(driversData, userProfile)
    if (clubType === 'fairways') matches = matchFairways(fairwaysData, userProfile)
    if (clubType === 'wedges')   matches = matchWedges(wedgesData, userProfile)
    if (clubType === 'putters')  matches = matchPutters(puttersData, userProfile)
    if (clubType === 'sets')     matches = matchSets(setsData, userProfile)
    setResults(matches)
    setProfile(userProfile)
    setShowAll(false)
    setPhase('results')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleReset() {
    setPhase('pick')
    setClubType(null)
    setResults([])
    setProfile(null)
    setShowAll(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleBrowse() {
    setPhase('browse')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleBackToForm() {
    setPhase('form')
    setResults([])
    setProfile(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const visibleResults = showAll ? results : results.slice(0, 3)
  const hero = HERO_CONTENT[clubType] || { title: 'Find your gear.', sub: '' }
  const formSteps = {
    drivers:  DRIVER_STEPS,
    wedges:   WEDGE_STEPS,
    putters:  PUTTER_STEPS,
    sets:     SETS_STEPS,
  }[clubType]

  // ── Club picker ──
  if (phase === 'pick') return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-2xl font-medium text-gray-900 mb-2">What are you looking for?</h1>
        <p className="text-sm text-gray-500 max-w-sm mx-auto">
          Pick a club type and we'll ask a few quick questions to find your perfect match.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {CLUB_TYPES.map(ct => (
          <button
            key={ct.id}
            onClick={() => ct.live && handleClubPick(ct.id)}
            disabled={!ct.live}
            className="flex items-center gap-4 p-4 rounded-xl border text-left transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:border-gray-400"
            style={{ borderColor: '#e5e7eb', background: '#fff' }}
          >
            <span className="text-2xl">{ct.emoji}</span>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">{ct.label}</span>
                {!ct.live && (
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-400">Coming soon</span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{ct.desc}</p>
            </div>
            {ct.live && <span className="text-gray-400 text-sm">→</span>}
          </button>
        ))}
      </div>
    </div>
  )

  // ── Form ──
  if (phase === 'form') return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <div className="flex items-center gap-2 text-xs mb-4 text-gray-400">
        <button onClick={handleReset} className="hover:text-gray-600">Golf</button>
        <span>›</span>
        <span style={{ color: BRAND_GREEN }} className="capitalize">{clubType}</span>
      </div>
      <div className="text-center mb-8">
        <h1 className="text-xl font-medium text-gray-900 mb-1" style={{ color: BRAND_GREEN }}>{hero.title}</h1>
        <p className="text-sm text-gray-500">{hero.sub}</p>
      </div>
      {clubType === 'irons'    && <IronsForm    onComplete={handleFormComplete} />}
      {clubType === 'fairways' && <FairwaysForm onComplete={handleFormComplete} />}
      {formSteps && clubType !== 'fairways' && <SimpleStepForm steps={formSteps} onComplete={handleFormComplete} />}
    </div>
  )

  // ── Results ──
  if (phase === 'results') return (
    <div>
      <div className="max-w-2xl mx-auto px-4 pt-8 pb-2">
        <div className="flex items-center gap-2 text-xs mb-4 text-gray-400">
          <button onClick={handleReset} className="hover:text-gray-600">Golf</button>
          <span>›</span>
          <button onClick={handleBackToForm} className="hover:text-gray-600 capitalize">{clubType}</button>
          <span>›</span>
          <span style={{ color: BRAND_GREEN }}>Results</span>
        </div>
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-medium text-gray-900">Your matches</h2>
          <button onClick={handleReset} className="text-xs text-gray-400 hover:text-gray-600">← Start over</button>
        </div>
        <div className="flex gap-3 mt-3">
          <button onClick={handleBackToForm} className="text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2">
            Adjust answers
          </button>
          <span className="text-xs text-gray-200">·</span>
          <button onClick={handleBrowse} className="text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2">
            Browse all {clubType}
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 mt-4">
        {results.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-gray-500 text-sm mb-2">No matches found for your criteria.</p>
            <p className="text-gray-400 text-xs mb-5">Try adjusting your budget.</p>
            <button onClick={handleReset} className="px-5 py-2 rounded-lg text-white text-sm hover:opacity-90" style={{ background: BRAND_GREEN }}>
              Start over
            </button>
          </div>
        ) : (
          <>
            {visibleResults.map((club, i) => (
              <ResultCard key={club.id} club={club} rank={i} clubType={clubType} />
            ))}
            {!showAll && results.length > 3 && (
              <button
                onClick={() => setShowAll(true)}
                className="w-full py-3 rounded-xl border border-gray-200 text-sm text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-all mb-4"
              >
                Show {results.length - 3} more matches ↓
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )

  // ── Browse ──
  if (phase === 'browse') return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs mb-1 text-gray-400">
            <button onClick={handleReset} className="hover:text-gray-600">Golf</button>
            <span>›</span>
            <span style={{ color: BRAND_GREEN }} className="capitalize">{clubType}</span>
          </div>
          <h2 className="text-lg font-medium text-gray-900 capitalize">All {clubType}</h2>
        </div>
        <button onClick={() => results.length > 0 ? setPhase('results') : handleReset()}
          className="text-xs text-gray-400 hover:text-gray-600 transition-all">
          ← {results.length > 0 ? 'Back to results' : 'Back to finder'}
        </button>
      </div>
      <BrowseList clubType={clubType} />
    </div>
  )

  return null
}
