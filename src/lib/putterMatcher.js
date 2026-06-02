// Putter profile:
// {
//   stroke_type: 'straight' | 'slight_arc' | 'strong_arc'
//   head_style: 'blade' | 'mid_mallet' | 'mallet' | 'no_preference'
//   alignment: 'minimal' | 'moderate' | 'heavy' | 'no_preference'
//   zero_torque: true | false
//   budget_max: 200 | 350 | 500 | 9999
// }

function strokeMatch(putterStrokes, playerStroke) {
  if (!playerStroke || !putterStrokes) return 10
  if (putterStrokes.includes(playerStroke)) return 30
  // Adjacent strokes are partial matches
  const adjacent = {
    straight:    ['slight_arc'],
    slight_arc:  ['straight', 'strong_arc'],
    strong_arc:  ['slight_arc'],
  }
  const isAdjacent = adjacent[playerStroke]?.some(s => putterStrokes.includes(s))
  return isAdjacent ? 15 : 3
}

function headStyleMatch(putterStyle, playerStyle) {
  if (!playerStyle || playerStyle === 'no_preference') return 15
  if (putterStyle === playerStyle) return 20
  // Mid mallet is adjacent to both blade and mallet
  if (putterStyle === 'mid_mallet') return 10
  return 3
}

function alignmentMatch(putterAlignment, playerAlignment) {
  if (!playerAlignment || playerAlignment === 'no_preference') return 10
  if (putterAlignment === playerAlignment) return 15
  const adjacent = {
    minimal:  ['moderate'],
    moderate: ['minimal', 'heavy'],
    heavy:    ['moderate'],
  }
  const isAdjacent = adjacent[playerAlignment]?.includes(putterAlignment)
  return isAdjacent ? 8 : 2
}

export function matchPutters(putters, profile) {
  return putters
    .map(putter => {
      let score = 0
      let maxScore = 0

      // ── Stroke type (30 points) ───────────────────────────
      maxScore += 30
      score += strokeMatch(putter.stroke_type, profile.stroke_type)

      // ── Head style preference (20 points) ────────────────
      maxScore += 20
      score += headStyleMatch(putter.head_style, profile.head_style)

      // ── Alignment preference (15 points) ─────────────────
      maxScore += 15
      score += alignmentMatch(putter.alignment, profile.alignment)

      // ── Zero torque preference (15 points) ───────────────
      maxScore += 15
      const isZeroTorque = putter.category === 'zero_torque'
      if (profile.zero_torque === true) {
        score += isZeroTorque ? 15 : 0
      } else if (profile.zero_torque === false) {
        score += isZeroTorque ? 0 : 15
      } else {
        // No preference — slight bonus for conventional
        score += isZeroTorque ? 8 : 12
      }

      // ── Budget (20 points) ────────────────────────────────
      maxScore += 20
      if (!profile.budget_max || profile.budget_max >= 9999) {
        score += 20
      } else if (putter.price_usd <= profile.budget_max) {
        score += 20
      } else {
        const overage = putter.price_usd - profile.budget_max
        score += Math.max(0, 20 - Math.floor(overage / 30) * 4)
      }

      // ── Feel bonus for experienced players (5 points) ────
      maxScore += 5
      if (profile.stroke_type === 'strong_arc') {
        // Strong arc players usually prefer firmer milled feel
        score += putter.feel_rating >= 9 ? 5 : 2
      } else {
        score += 3 // neutral
      }

      // ── Penalties ─────────────────────────────────────────
      // Zero torque for strong arc player is wrong
      if (profile.stroke_type === 'strong_arc' && isZeroTorque) {
        score -= 20
      }
      // Heavy alignment for minimal preference player
      if (profile.alignment === 'minimal' && putter.alignment === 'heavy') {
        score -= 10
      }
      // Blade for straight stroke player — needs face-balanced
      if (
        profile.stroke_type === 'straight' &&
        putter.head_style === 'blade' &&
        !putter.hosel_options?.includes('double_bend')
      ) {
        score -= 8
      }

      return {
        ...putter,
        match_score: Math.max(0, score),
        match_max: maxScore
      }
    })
    .sort((a, b) => b.match_score - a.match_score)
    .reduce((acc, putter) => {
      const brandCount = acc.filter(p => p.brand === putter.brand).length
      if (brandCount < 2) acc.push(putter)
      return acc
    }, [])
    .slice(0, 6)
}

export function getPutterMatchLabel(score, maxScore) {
  const pct = maxScore > 0 ? (score / maxScore) * 100 : 0
  if (pct >= 88) return { label: 'Excellent match', color: 'success' }
  if (pct >= 72) return { label: 'Good match', color: 'info' }
  if (pct >= 55) return { label: 'Decent match', color: 'warning' }
  return { label: 'Partial match', color: 'secondary' }
}

export function getPutterMatchPercent(score, maxScore) {
  if (maxScore <= 0) return 0
  return Math.min(100, Math.round((score / maxScore) * 100))
}
