// Sets profile:
// {
//   skill: 'beginner' | 'high' | 'mid'
//   shaft: 'graphite' | 'steel' | 'not_sure'
//   budget_max: 500 | 1500 | 2000 | 9999
//   priority: 'value' | 'performance' | 'brand'
// }

const SKILL_TO_CATEGORY = {
  beginner: ['beginner'],
  high:     ['beginner', 'high_handicap'],
  mid:      ['high_handicap', 'mid_handicap'],
}

export function matchSets(sets, profile) {
  const validCategories = SKILL_TO_CATEGORY[profile.skill] || ['beginner', 'high_handicap']

  return sets
    .map(set => {
      let score = 0
      let maxScore = 0

      // ── Skill / category fit (35 points) ─────────────────
      maxScore += 35
      if (validCategories.includes(set.category)) {
        // Perfect category match
        const isPrimary = validCategories[validCategories.length - 1] === set.category
        score += isPrimary ? 35 : 25
      } else {
        score += 5
      }

      // ── Budget fit (30 points) ────────────────────────────
      maxScore += 30
      if (!profile.budget_max || profile.budget_max >= 9999) {
        score += 30
      } else if (set.price_usd <= profile.budget_max) {
        score += 30
      } else {
        const overage = set.price_usd - profile.budget_max
        score += Math.max(0, 30 - Math.floor(overage / 100) * 4)
      }

      // ── Shaft preference (15 points) ─────────────────────
      maxScore += 15
      if (!profile.shaft || profile.shaft === 'not_sure') {
        score += 12
      } else if (set.shaft === profile.shaft) {
        score += 15
      } else {
        score += 3
      }

      // ── Priority match (20 points) ────────────────────────
      maxScore += 20
      if (!profile.priority || profile.priority === 'no_preference') {
        score += 12
      } else if (profile.priority === 'value') {
        score += Math.round((set.value_rating / 10) * 20)
      } else if (profile.priority === 'performance') {
        const perf = (set.forgiveness + set.distance_rating) / 2
        score += Math.round((perf / 10) * 20)
      } else if (profile.priority === 'brand') {
        // Brand priority — slightly reward higher community rating
        score += Math.round((set.community_rating / 5) * 20)
      }

      // ── Value bonus for tight budgets ─────────────────────
      if (
        profile.budget_max &&
        profile.budget_max < 9999 &&
        set.price_usd <= profile.budget_max * 0.7
      ) {
        score += 5
        maxScore += 5
      }

      // ── Penalties ─────────────────────────────────────────
      // Mid handicapper getting beginner set
      if (profile.skill === 'mid' && set.category === 'beginner') {
        score -= 20
      }
      // Beginner getting mid handicap set — over-buying
      if (profile.skill === 'beginner' && set.category === 'mid_handicap') {
        score -= 15
      }

      return {
        ...set,
        match_score: Math.max(0, score),
        match_max: maxScore
      }
    })
    .sort((a, b) => b.match_score - a.match_score)
    .reduce((acc, set) => {
      const brandCount = acc.filter(s => s.brand === set.brand).length
      if (brandCount < 2) acc.push(set)
      return acc
    }, [])
    .slice(0, 6)
}

export function getSetsMatchLabel(score, maxScore) {
  const pct = maxScore > 0 ? (score / maxScore) * 100 : 0
  if (pct >= 88) return { label: 'Excellent match', color: 'success' }
  if (pct >= 72) return { label: 'Good match', color: 'info' }
  if (pct >= 55) return { label: 'Decent match', color: 'warning' }
  return { label: 'Partial match', color: 'secondary' }
}

export function getSetsMatchPercent(score, maxScore) {
  if (maxScore <= 0) return 0
  return Math.min(100, Math.round((score / maxScore) * 100))
}
