import { useState } from "react"

const STEPS = {
  PATH: 'path',
  CATEGORY: 'category',
  HANDICAP: 'handicap',
  MISS: 'miss',
  SHAFT_BUDGET: 'shaft_budget'
}

const CATEGORIES = [
  {
    id: 'max_forgiveness',
    label: 'Max forgiveness',
    handicap: '30+ hcp',
    description: 'Biggest sweet spot, widest sole, maximum offset. Priority is keeping it in play.',
    bars: { forgiveness: 95, distance: 65, workability: 15 }
  },
  {
    id: 'game_improvement',
    label: 'Game improvement',
    handicap: '18–25+ hcp',
    description: 'Forgiving without looking chunky. Good distance, decent feel. Most popular category.',
    bars: { forgiveness: 78, distance: 78, workability: 40 }
  },
  {
    id: 'players_distance',
    label: 'Players distance',
    handicap: '10–20 hcp',
    description: 'Thinner topline, hot face for extra yards. Some forgiveness but demands more consistency.',
    bars: { forgiveness: 55, distance: 92, workability: 60 }
  },
  {
    id: 'players',
    label: 'Players',
    handicap: '5–15 hcp',
    description: 'Compact head, minimal offset, precise feedback. Rewards consistent ball striking.',
    bars: { forgiveness: 35, distance: 62, workability: 88 }
  },
  {
    id: 'muscle_back',
    label: 'Muscle back',
    handicap: '0–10 hcp',
    description: 'Traditional blade. Zero forgiveness, maximum feel and workability. Tour-level demand.',
    bars: { forgiveness: 12, distance: 55, workability: 100 }
  }
]

const MISSES = [
  { id: 'slice', label: 'Slice', description: 'Ball curves right (right-handed)' },
  { id: 'hook', label: 'Hook', description: 'Ball curves left (right-handed)' },
  { id: 'thin_fat', label: 'Thin / fat', description: 'Catching it early or heavy' },
  { id: 'none', label: 'No consistent miss', description: 'Pretty solid ball striking' }
]

const BUDGETS = [
  { id: 500, label: 'Under $500' },
  { id: 900, label: '$500–$900' },
  { id: 1300, label: '$900–$1,300' },
  { id: 9999, label: 'No limit' }
]

function ProgressDots({ total, current }) {
  return (
    <div className="flex gap-1.5 mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full transition-all ${
            i < current
              ? 'bg-blue-500'
              : i === current
              ? 'bg-gray-800'
              : 'bg-gray-300'
          }`}
        />
      ))}
    </div>
  )
}

function PillButton({ selected, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm border transition-all ${
        selected
          ? 'bg-blue-50 border-blue-400 text-blue-700'
          : 'bg-white border-gray-200 text-gray-700 hover:border-gray-400'
      }`}
    >
      {children}
    </button>
  )
}

function CategoryCard({ cat, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border transition-all mb-2.5 flex items-center gap-4 ${
        selected
          ? 'border-blue-400 border-2 bg-blue-50'
          : 'border-gray-200 bg-white hover:border-gray-400'
      }`}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-sm text-gray-900">{cat.label}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
            {cat.handicap}
          </span>
        </div>
        <p className="text-xs text-gray-500">{cat.description}</p>
      </div>
      <div className="flex flex-col gap-1 min-w-[90px]">
        {Object.entries(cat.bars).map(([key, val]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className="text-[11px] text-gray-400 w-16 text-right capitalize">
              {key}
            </span>
            <div className="flex-1 h-1 bg-gray-200 rounded-full">
              <div
                className="h-1 rounded-full bg-blue-400"
                style={{ width: `${val}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </button>
  )
}

export default function IntakeForm({ onComplete }) {
  const [step, setStep] = useState(STEPS.PATH)
  const [profile, setProfile] = useState({
    path: null,
    category: null,
    handicap: null,
    miss: null,
    shaft: null,
    budget_max: null
  })

  function update(key, value) {
    setProfile(prev => ({ ...prev, [key]: value }))
  }

  function goNext(nextStep) {
    setStep(nextStep)
  }

  function handleSubmit() {
    onComplete(profile)
  }

  // Step: choose path
  if (step === STEPS.PATH) {
    return (
      <div className="max-w-lg mx-auto py-6">
        <h2 className="text-lg font-medium text-gray-900 mb-1">
          Find your irons
        </h2>
        <p className="text-sm text-gray-500 mb-5">
          How do you want to search?
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => { update('path', 'category'); goNext(STEPS.CATEGORY) }}
            className="flex-1 p-4 rounded-xl border border-gray-200 bg-white hover:border-gray-400 transition-all text-left"
          >
            <div className="text-sm font-medium text-gray-900 mb-1">
              I know what type I want
            </div>
            <div className="text-xs text-gray-500">
              Pick a category directly and filter from there
            </div>
          </button>
          <button
            onClick={() => { update('path', 'guided'); goNext(STEPS.HANDICAP) }}
            className="flex-1 p-4 rounded-xl border border-gray-200 bg-white hover:border-gray-400 transition-all text-left"
          >
            <div className="text-sm font-medium text-gray-900 mb-1">
              Help me figure it out
            </div>
            <div className="text-xs text-gray-500">
              Answer a few questions and we'll match you
            </div>
          </button>
        </div>
      </div>
    )
  }

  // Step: category picker
  if (step === STEPS.CATEGORY) {
    return (
      <div className="max-w-lg mx-auto py-6">
        <ProgressDots total={3} current={0} />
        <h2 className="text-lg font-medium text-gray-900 mb-1">
          What type of iron suits your game?
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Select the category that matches where you are as a golfer.
        </p>
        {CATEGORIES.map(cat => (
          <CategoryCard
            key={cat.id}
            cat={cat}
            selected={profile.category === cat.id}
            onClick={() => update('category', cat.id)}
          />
        ))}
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => goNext(STEPS.PATH)}
            className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700"
          >
            Back
          </button>
          <button
            onClick={() => goNext(STEPS.SHAFT_BUDGET)}
            disabled={!profile.category}
            className="flex-1 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-medium disabled:opacity-40 hover:bg-gray-700 transition-all"
          >
            Continue
          </button>
        </div>
      </div>
    )
  }

  // Step: handicap (guided path)
  if (step === STEPS.HANDICAP) {
    const ranges = [
      { id: 5, label: '0–5' },
      { id: 10, label: '6–10' },
      { id: 15, label: '11–15' },
      { id: 20, label: '16–20' },
      { id: 25, label: '21–25' },
      { id: 36, label: '26–36' },
      { id: 54, label: '36+' }
    ]
    return (
      <div className="max-w-lg mx-auto py-6">
        <ProgressDots total={3} current={0} />
        <h2 className="text-lg font-medium text-gray-900 mb-1">
          What's your handicap?
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          The single biggest factor in which irons suit you.
        </p>
        <div className="flex flex-wrap gap-2 mb-6">
          {ranges.map(r => (
            <PillButton
              key={r.id}
              selected={profile.handicap === r.id}
              onClick={() => update('handicap', r.id)}
            >
              {r.label}
            </PillButton>
          ))}
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => goNext(STEPS.PATH)}
            className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700"
          >
            Back
          </button>
          <button
            onClick={() => goNext(STEPS.MISS)}
            disabled={!profile.handicap}
            className="flex-1 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-medium disabled:opacity-40 hover:bg-gray-700 transition-all"
          >
            Continue
          </button>
        </div>
      </div>
    )
  }

  // Step: miss
  if (step === STEPS.MISS) {
    return (
      <div className="max-w-lg mx-auto py-6">
        <ProgressDots total={3} current={1} />
        <h2 className="text-lg font-medium text-gray-900 mb-1">
          What's your most common miss?
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Helps us find irons that work with your natural tendencies.
        </p>
        <div className="flex flex-col gap-2 mb-6">
          {MISSES.map(m => (
            <button
              key={m.id}
              onClick={() => update('miss', m.id)}
              className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                profile.miss === m.id
                  ? 'border-blue-400 border-2 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-400'
              }`}
            >
              <span className="font-medium text-gray-900">{m.label}</span>
              <span className="text-gray-500 ml-2">{m.description}</span>
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => goNext(STEPS.HANDICAP)}
            className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700"
          >
            Back
          </button>
          <button
            onClick={() => goNext(STEPS.SHAFT_BUDGET)}
            disabled={!profile.miss}
            className="flex-1 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-medium disabled:opacity-40 hover:bg-gray-700 transition-all"
          >
            Continue
          </button>
        </div>
      </div>
    )
  }

  // Step: shaft + budget (shared by both paths)
  if (step === STEPS.SHAFT_BUDGET) {
    const dotStep = profile.path === 'category' ? 1 : 2
    return (
      <div className="max-w-lg mx-auto py-6">
        <ProgressDots total={3} current={dotStep} />
        <h2 className="text-lg font-medium text-gray-900 mb-1">
          Almost there
        </h2>
        <p className="text-sm text-gray-500 mb-5">
          Two quick ones to narrow it down.
        </p>
        <p className="text-sm font-medium text-gray-700 mb-2">
          Shaft preference
        </p>
        <div className="flex flex-wrap gap-2 mb-5">
          {['steel', 'graphite', 'not_sure'].map(s => (
            <PillButton
              key={s}
              selected={profile.shaft === s}
              onClick={() => update('shaft', s)}
            >
              {s === 'not_sure' ? 'Not sure' : s.charAt(0).toUpperCase() + s.slice(1)}
            </PillButton>
          ))}
        </div>
        <p className="text-sm font-medium text-gray-700 mb-2">Budget</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {BUDGETS.map(b => (
            <PillButton
              key={b.id}
              selected={profile.budget_max === b.id}
              onClick={() => update('budget_max', b.id)}
            >
              {b.label}
            </PillButton>
          ))}
        </div>
        <div className="flex gap-3">
          <button
            onClick={() =>
              goNext(profile.path === 'category' ? STEPS.CATEGORY : STEPS.MISS)
            }
            className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700"
          >
            Back
          </button>
          <button
            onClick={handleSubmit}
            disabled={!profile.shaft || !profile.budget_max}
            className="flex-1 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-medium disabled:opacity-40 hover:bg-gray-700 transition-all"
          >
            Show my matches
          </button>
        </div>
      </div>
    )
  }

  return null
}
