// Wedge profile comes in as:
// {
//   weakness: 'bunkers' | 'tight_lies' | 'inconsistency' | 'all'
//   swing_type: 'steep' | 'neutral' | 'shallow'
//   conditions: 'firm' | 'normal' | 'soft' | 'varies'
//   skill: 'low' (0-10) | 'mid' (11-20) | 'high' (21+)
//   budget_max: 130 | 170 | 9999 (no limit)
// }

// Map skill level to handicap range for matching
const SKILL_TO_HANDICAP = {
  low:  { min: 0,  max: 10 },
  mid:  { min: 8,  max: 20 },
  high: { min: 15, max: 54 },
}

// Does this wedge's conditions suit match the player's conditions?
function conditionsScore(wedgeConditions, playerConditions) {
  if (!wedgeConditions || !playerConditions) return 10
  if (playerConditions === 'varies') {
    // Varies — reward versatile wedges that suit multiple conditions
    return wedgeConditions.length >= 2 ? 15 : 8
  }
  if (wedgeConditions.includes(playerConditions)) return 15
  // Partial match — adjacent conditions
  const adjacent = {
    firm:   ['normal'],
    normal: ['firm', 'soft'],
    soft:   ['normal'],
  }
  const adjacentMatch = adjacent[playerConditions]?.some(c =>
    wedgeConditions.includes(c)
  )
  return adjacentMatch ? 8 : 3
}

// Does this wedge's swing type suit match the player's swing?
function swingTypeScore(wedgeSwingTypes, playerSwingType) {
  if (!wedgeSwingTypes || !playerSwingType) return 10
  if (wedgeSwingTypes.includes(playerSwingType)) return 15
  // Neutral swing type is adjacent to both steep and shallow
  if (playerSwingType === 'neutral') return 10
  if (wedgeSwingTypes.includes('neutral')) return 8
  return 3
}

export function matchWedges(wedges, profile) {
  const skillRange = SKILL_TO_HANDICAP[profile.skill] || SKILL_TO_HANDICAP.mid

  return wedges
    .map(wedge => {
      let score = 0
      let maxScore = 0

      // ── Skill / handicap fit (25 points) ─────────────────
      maxScore += 25
      const hcpMin = wedge.handicap_min ?? 0
      const hcpMax = wedge.handicap_max ?? 54
      const skillOverlap =
        skillRange.min <= hcpMax && skillRange.max >= hcpMin
      if (skillOverlap) {
        // How well centred is the overlap?
        const overlapMin = Math.max(skillRange.min, hcpMin)
        const overlapMax = Math.min(skillRange.max, hcpMax)
        const overlapSize = overlapMax - overlapMin
        const playerRangeSize = skillRange.max - skillRange.min
        const overlapPct = overlapSize / playerRangeSize
        score += Math.round(overlapPct * 25)
      } else {
        const distance = Math.min(
          Math.abs(skillRange.min - hcpMax),
          Math.abs(skillRange.max - hcpMin)
        )
        score += Math.max(0, 25 - distance * 5)
      }

      // ── Swing type match (15 points) ────────────────────
      maxScore += 15
      score += swingTypeScore(wedge.swing_type_suits, profile.swing_type)

      // ── Conditions match (15 points) ────────────────────
      maxScore += 15
      score += conditionsScore(wedge.conditions_suits, profile.conditions)

      // ── Weakness match (25 points) ──────────────────────
      // This is the most important differentiator
      maxScore += 25
      if (!profile.weakness || profile.weakness === 'all') {
        // All equally — reward versatile wedges
        score += Math.round((wedge.versatility / 10) * 20)
      } else if (profile.weakness === 'bunkers') {
        // Bunkers — high bounce, forgiving sole, K/Full grind style
        const highBounce = wedge.bounce_options?.includes('high')
        const wideSole = wedge.grinds_available?.some(g =>
          ['Full', 'K', 'W', 'WideL ow', 'HB', 'BunkR', 'D'].includes(g)
        )
        const isSpecialist = wedge.category === 'specialist'
        if (isSpecialist) {
          score += 25 // BunkR type — built for this
        } else if (highBounce && wideSole) {
          score += 22
        } else if (highBounce || wideSole) {
          score += 14
        } else {
          score += 5
        }
      } else if (profile.weakness === 'tight_lies') {
        // Tight lies — low bounce, heel/toe relief, T/C/Z/LB grind
        const lowBounce = wedge.bounce_options?.includes('low')
        const versatileGrind = wedge.grinds_available?.some(g =>
          ['T', 'C', 'Z', 'LB', 'X', 'SC', 'SX', 'Tour_Grind'].includes(g)
        )
        if (lowBounce && versatileGrind) {
          score += 22
        } else if (lowBounce || versatileGrind) {
          score += 14
        } else {
          score += 5
        }
        // Penalise specialist bunker clubs for tight lies
        if (wedge.category === 'specialist') score -= 15
      } else if (profile.weakness === 'inconsistency') {
        // Inconsistency — game improvement, forgiveness, wide sole
        const isGI = wedge.category === 'game_improvement'
        const highForgiveness = wedge.forgiveness >= 8
        if (isGI && highForgiveness) {
          score += 25
        } else if (isGI || highForgiveness) {
          score += 16
        } else {
          score += 8
        }
      }

      // ── Spin rating (10 points) ──────────────────────────
      // Better players want more spin control
      maxScore += 10
      if (profile.skill === 'low') {
        // Low handicappers want maximum spin
        score += Math.round((wedge.spin_rating / 10) * 10)
      } else if (profile.skill === 'mid') {
        // Mid handicappers want good spin but not at expense of forgiveness
        score += Math.round(((wedge.spin_rating + wedge.forgiveness) / 20) * 10)
      } else {
        // High handicappers prioritise forgiveness and consistency over spin
        score += Math.round((wedge.forgiveness / 10) * 10)
      }

      // ── Budget fit (15 points) ───────────────────────────
      maxScore += 15
      if (!profile.budget_max || profile.budget_max >= 9999) {
        score += 15
      } else if (wedge.price_usd <= profile.budget_max) {
        score += 15
      } else {
        const overage = wedge.price_usd - profile.budget_max
        score += Math.max(0, 15 - Math.floor(overage / 20) * 3)
      }

      // ── Feel bonus (5 points) ────────────────────────────
      // Low handicappers care more about feel
      maxScore += 5
      if (profile.skill === 'low') {
        score += Math.round((wedge.feel_rating / 10) * 5)
      } else {
        score += 3 // neutral for mid/high
      }

      // ── Versatility bonus for 'varies' conditions (5 pts)
      if (profile.conditions === 'varies') {
        maxScore += 5
        score += Math.round((wedge.versatility / 10) * 5)
      }

      // ── Penalties ────────────────────────────────────────

      // Tour wedge for high handicapper who struggles with inconsistency
      if (
        profile.skill === 'high' &&
        profile.weakness === 'inconsistency' &&
        wedge.category === 'tour_performance' &&
        wedge.forgiveness < 6
      ) {
        score -= 15
      }

      // Game improvement wedge for low handicapper
      // (they've outgrown it, won't trust the feel)
      if (
        profile.skill === 'low' &&
        wedge.category === 'game_improvement'
      ) {
        score -= 10
      }

      // Steep swinger with low bounce wedge
      // (low bounce + steep swing = chunked shots)
      if (
        profile.swing_type === 'steep' &&
        wedge.bounce_options &&
        !wedge.bounce_options.includes('high') &&
        !wedge.bounce_options.includes('mid') &&
        wedge.bounce_options.includes('low')
      ) {
        score -= 12
      }

      // Shallow swinger with high bounce only wedge
      // (high bounce + shallow swing = thin shots)
      if (
        profile.swing_type === 'shallow' &&
        wedge.bounce_options &&
        !wedge.bounce_options.includes('low') &&
        !wedge.bounce_options.includes('mid')
      ) {
        score -= 12
      }

      // Bunker specialist is useless for non-bunker weaknesses
      if (
        wedge.category === 'specialist' &&
        profile.weakness !== 'bunkers' &&
        profile.weakness !== 'all'
      ) {
        score -= 20
      }

      return {
        ...wedge,
        match_score: Math.max(0, score),
        match_max: maxScore
      }
    })
    .sort((a, b) => b.match_score - a.match_score)
    // Brand diversity — max 2 per brand
    .reduce((acc, wedge) => {
      const brandCount = acc.filter(w => w.brand === wedge.brand).length
      if (brandCount < 2) acc.push(wedge)
      return acc
    }, [])
    .slice(0, 6)
}

export function getWedgeMatchLabel(score, maxScore) {
  const pct = maxScore > 0 ? (score / maxScore) * 100 : 0
  if (pct >= 88) return { label: 'Excellent match', color: 'success' }
  if (pct >= 72) return { label: 'Good match', color: 'info' }
  if (pct >= 55) return { label: 'Decent match', color: 'warning' }
  return { label: 'Partial match', color: 'secondary' }
}

export function getWedgeMatchPercent(score, maxScore) {
  if (maxScore <= 0) return 0
  return Math.min(100, Math.round((score / maxScore) * 100))
}
