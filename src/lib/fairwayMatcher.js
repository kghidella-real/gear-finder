// Fairway/Hybrid profile:
// {
//   club_type: 'fairway_wood' | 'hybrid' | 'either'
//   slot: '3wood' | '5wood' | '7wood' | '3hybrid' | '4hybrid' | '5hybrid' | 'not_sure'
//   distance: 'under_180' | '180_220' | '220_260' | '260_plus' | 'not_sure'
//   miss: 'slice' | 'hook' | 'straight' | 'both'
//   priority: 'forgiveness' | 'distance' | 'workability'
//   budget_max: 250 | 350 | 9999
// }

// Map distance to swing speed range
const DISTANCE_TO_SPEED = {
  under_180: { min: 0,   max: 75,  label: 'slow' },
  '180_220': { min: 70,  max: 90,  label: 'moderate' },
  '220_260': { min: 85,  max: 105, label: 'average' },
  '260_plus':{ min: 100, max: 999, label: 'fast' },
  not_sure:  { min: 0,   max: 999, label: 'unknown' },
}

// Map slot to ideal loft range
const SLOT_TO_LOFT = {
  '3wood':   { min: 13, max: 17 },
  '5wood':   { min: 17, max: 21 },
  '7wood':   { min: 20, max: 23 },
  '3hybrid': { min: 17, max: 22 },
  '4hybrid': { min: 21, max: 25 },
  '5hybrid': { min: 24, max: 28 },
  not_sure:  { min: 13, max: 34 },
}

function swingSpeedFit(club, speedRange) {
  if (!speedRange || speedRange.label === 'unknown') return 20
  const overlap =
    club.swing_speed_min <= speedRange.max &&
    club.swing_speed_max >= speedRange.min
  if (!overlap) {
    const distance = Math.min(
      Math.abs(speedRange.min - club.swing_speed_max),
      Math.abs(speedRange.max - club.swing_speed_min)
    )
    return Math.max(0, 25 - distance * 2)
  }
  const clubMid = (club.swing_speed_min + club.swing_speed_max) / 2
  const playerMid = (speedRange.min + speedRange.max) / 2
  const diff = Math.abs(clubMid - playerMid)
  if (diff <= 10) return 25
  if (diff <= 20) return 18
  return 12
}

function loftFit(club, slot) {
  if (!slot || slot === 'not_sure') return 10
  const ideal = SLOT_TO_LOFT[slot]
  if (!ideal) return 10
  const lofts = club.lofts_available || []
  const hasLoft = lofts.some(l => l >= ideal.min && l <= ideal.max)
  if (hasLoft) return 15
  // Adjacent loft available
  const closest = lofts.reduce((prev, curr) =>
    Math.abs(curr - (ideal.min + ideal.max) / 2) < Math.abs(prev - (ideal.min + ideal.max) / 2) ? curr : prev
  , lofts[0])
  const gap = Math.min(
    Math.abs(closest - ideal.min),
    Math.abs(closest - ideal.max)
  )
  return Math.max(0, 15 - gap * 2)
}

function missFit(club, miss) {
  if (!miss || miss === 'straight') {
    return club.draw_bias ? 10 : 15
  }
  if (miss === 'slice') {
    return club.draw_bias ? 20 : 8
  }
  if (miss === 'hook') {
    return club.draw_bias ? 3 : 18
  }
  if (miss === 'both') {
    return club.forgiveness >= 8 ? 16 : 10
  }
  return 12
}

export function matchFairways(clubs, profile) {
  const speedRange = DISTANCE_TO_SPEED[profile.distance] || DISTANCE_TO_SPEED.not_sure

  return clubs
    .filter(club => {
      // Filter by club type if specified
      if (profile.club_type && profile.club_type !== 'either') {
        return club.club_type === profile.club_type
      }
      return true
    })
    .map(club => {
      let score = 0
      let maxScore = 0

      // ── Swing speed fit (25 points) ───────────────────────
      maxScore += 25
      score += swingSpeedFit(club, speedRange)

      // ── Loft / slot fit (15 points) ───────────────────────
      maxScore += 15
      score += loftFit(club, profile.slot)

      // ── Miss fit (20 points) ──────────────────────────────
      maxScore += 20
      score += missFit(club, profile.miss)

      // ── Priority match (20 points) ────────────────────────
      maxScore += 20
      if (!profile.priority || profile.priority === 'both') {
        const balanced = (club.forgiveness + club.distance_rating) / 2
        score += Math.round((balanced / 10) * 18)
      } else if (profile.priority === 'forgiveness') {
        score += Math.round((club.forgiveness / 10) * 20)
      } else if (profile.priority === 'distance') {
        score += Math.round((club.distance_rating / 10) * 20)
      } else if (profile.priority === 'workability') {
        score += Math.round((club.workability / 10) * 20)
      }

      // ── Budget fit (15 points) ────────────────────────────
      maxScore += 15
      if (!profile.budget_max || profile.budget_max >= 9999) {
        score += 15
      } else if (club.price_usd <= profile.budget_max) {
        score += 15
      } else {
        const overage = club.price_usd - profile.budget_max
        score += Math.max(0, 15 - Math.floor(overage / 50) * 3)
      }

      // ── Draw bias bonus for slicers (10 points) ───────────
      if (profile.miss === 'slice' && club.draw_bias) {
        score += 10
        maxScore += 10
      }

      // ── Value bonus for previous gen (5 points) ───────────
      if (
        club.tags?.includes('previous-gen') &&
        profile.budget_max &&
        profile.budget_max < 9999 &&
        club.price_usd <= profile.budget_max * 0.75
      ) {
        score += 5
        maxScore += 5
      }

      // ── Penalties ────────────────────────────────────────
      // Slow swinger with low spin fairway/hybrid
      if (
        speedRange.label === 'slow' &&
        (club.spin_profile === 'low' || club.spin_profile === 'low_mid')
      ) {
        score -= 15
      }

      // Fast swinger with high spin club
      if (
        speedRange.label === 'fast' &&
        club.spin_profile === 'high'
      ) {
        score -= 10
      }

      // Hooker with draw bias
      if (profile.miss === 'hook' && club.draw_bias) {
        score -= 18
      }

      return {
        ...club,
        match_score: Math.max(0, score),
        match_max: maxScore
      }
    })
    .sort((a, b) => b.match_score - a.match_score)
    .reduce((acc, club) => {
      const brandCount = acc.filter(c => c.brand === club.brand).length
      if (brandCount < 2) acc.push(club)
      return acc
    }, [])
    .slice(0, 6)
}

export function getFairwayMatchLabel(score, maxScore) {
  const pct = maxScore > 0 ? (score / maxScore) * 100 : 0
  if (pct >= 88) return { label: 'Excellent match', color: 'success' }
  if (pct >= 72) return { label: 'Good match', color: 'info' }
  if (pct >= 55) return { label: 'Decent match', color: 'warning' }
  return { label: 'Partial match', color: 'secondary' }
}

export function getFairwayMatchPercent(score, maxScore) {
  if (maxScore <= 0) return 0
  return Math.min(100, Math.round((score / maxScore) * 100))
}
