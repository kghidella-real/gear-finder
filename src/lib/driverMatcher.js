// Driver profile comes in as:
// {
//   distance: 'under_180' | '180_220' | '220_260' | '260_plus' | 'not_sure'
//   miss: 'slice' | 'hook' | 'both' | 'straight'
//   priority: 'forgiveness' | 'distance' | 'both'
//   budget_max: 400 | 600 | 9999 (no limit)
// }

// Map distance brackets to swing speed ranges for matching
const DISTANCE_TO_SPEED = {
  under_180: { min: 0, max: 75, label: 'slow' },
  '180_220':  { min: 70, max: 90, label: 'moderate' },
  '220_260':  { min: 85, max: 105, label: 'average' },
  '260_plus': { min: 100, max: 999, label: 'fast' },
  not_sure:   { min: 0, max: 999, label: 'unknown' },
}

// Map distance + priority to ideal spin profile
function getIdealSpin(distance, priority) {
  if (distance === 'under_180') return 'high'
  if (distance === '180_220') return priority === 'distance' ? 'mid' : 'mid_high'
  if (distance === '220_260') return priority === 'forgiveness' ? 'mid' : 'mid_low'
  if (distance === '260_plus') return 'low'
  return 'mid' // not_sure
}

// How well does a club's spin profile match the ideal?
function spinMatchScore(clubSpin, idealSpin) {
  const order = ['high', 'mid_high', 'mid', 'mid_low', 'low', 'ultra_low']
  const clubIdx = order.indexOf(clubSpin)
  const idealIdx = order.indexOf(idealSpin)
  if (clubIdx === -1 || idealIdx === -1) return 10 // unknown — neutral
  const diff = Math.abs(clubIdx - idealIdx)
  if (diff === 0) return 20 // perfect
  if (diff === 1) return 14 // one step away
  if (diff === 2) return 7  // two steps away
  return 2                  // too far off
}

export function matchDrivers(drivers, profile) {
  const speedRange = DISTANCE_TO_SPEED[profile.distance] || DISTANCE_TO_SPEED.not_sure
  const idealSpin = getIdealSpin(profile.distance, profile.priority)
  const isUnknownDistance = !profile.distance || profile.distance === 'not_sure'

  return drivers
    .map(driver => {
      let score = 0
      let maxScore = 0

      // ── Swing speed fit (30 points) ─────────────────────
      maxScore += 30
      if (isUnknownDistance) {
        score += 20 // neutral — don't penalise unknown
      } else {
        const speedOverlap =
          driver.swing_speed_min <= speedRange.max &&
          driver.swing_speed_max >= speedRange.min
        if (speedOverlap) {
          // Full points if the sweet spot aligns
          const driverMid = (driver.swing_speed_min + driver.swing_speed_max) / 2
          const playerMid = (speedRange.min + speedRange.max) / 2
          const diff = Math.abs(driverMid - playerMid)
          if (diff <= 10) score += 30
          else if (diff <= 20) score += 22
          else score += 14
        } else {
          // Outside range — decay by distance
          const distance = Math.min(
            Math.abs(speedRange.min - driver.swing_speed_max),
            Math.abs(speedRange.max - driver.swing_speed_min)
          )
          score += Math.max(0, 30 - distance * 2)
        }
      }

      // ── Spin profile match (20 points) ──────────────────
      maxScore += 20
      score += spinMatchScore(driver.spin_profile, idealSpin)

      // ── Miss correction (25 points) ─────────────────────
      maxScore += 25
      if (!profile.miss || profile.miss === 'straight') {
        // Straight hitter — neutral bias is good, draw bias is fine
        if (!driver.draw_bias) {
          score += 22
        } else {
          score += 14 // slight draw bias is ok for straight hitters
        }
      } else if (profile.miss === 'slice') {
        if (driver.draw_bias) {
          score += 25 // perfect — draw bias corrects slice
        } else if (driver.miss_suits && driver.miss_suits.includes('slice')) {
          score += 18 // suits slicers even without draw bias
        } else {
          score += 5
        }
      } else if (profile.miss === 'hook') {
        if (!driver.draw_bias) {
          score += 22 // neutral or fade bias suits hookers
        } else {
          score += 4  // draw bias is bad for hookers
        }
      } else if (profile.miss === 'both') {
        // Both ways — forgiveness and large head matter most
        if (driver.forgiveness >= 8) {
          score += 20
        } else if (driver.forgiveness >= 6) {
          score += 14
        } else {
          score += 7
        }
      }

      // ── Priority match (20 points) ──────────────────────
      maxScore += 20
      if (!profile.priority || profile.priority === 'both') {
        // Balanced — reward all-rounders
        const balanced = (driver.forgiveness + driver.distance_rating) / 2
        score += Math.round((balanced / 10) * 18)
      } else if (profile.priority === 'forgiveness') {
        score += Math.round((driver.forgiveness / 10) * 20)
      } else if (profile.priority === 'distance') {
        score += Math.round((driver.distance_rating / 10) * 20)
      }

      // ── Budget fit (15 points) ───────────────────────────
      maxScore += 15
      if (!profile.budget_max || profile.budget_max >= 9999) {
        score += 15
      } else if (driver.price_usd <= profile.budget_max) {
        score += 15
      } else {
        const overage = driver.price_usd - profile.budget_max
        score += Math.max(0, 15 - Math.floor(overage / 50) * 3)
      }

      // ── Draw bias bonus (10 points) ─────────────────────
      if (profile.miss === 'slice' && driver.draw_bias) {
        score += 10
        maxScore += 10
      }

      // ── Value bonus (5 points) ───────────────────────────
      // Previous gen clubs at a discount are worth surfacing
      if (
        driver.tags &&
        (driver.tags.includes('previous-gen') || driver.tags.includes('value')) &&
        profile.budget_max &&
        profile.budget_max < 9999 &&
        driver.price_usd <= profile.budget_max * 0.75
      ) {
        score += 5
        maxScore += 5
      }

      // ── Penalties ────────────────────────────────────────
      // Slow swinger with low spin driver
      if (
        speedRange.label === 'slow' &&
        (driver.spin_profile === 'low' || driver.spin_profile === 'ultra_low')
      ) {
        score -= 20
      }
      // Fast swinger with high spin driver
      if (
        speedRange.label === 'fast' &&
        (driver.spin_profile === 'high' || driver.spin_profile === 'mid_high')
      ) {
        score -= 15
      }
      // Hooker with draw bias driver
      if (profile.miss === 'hook' && driver.draw_bias) {
        score -= 18
      }
      // Slow swinger with low head size
      if (
        speedRange.label === 'slow' &&
        driver.head_size_cc &&
        driver.head_size_cc < 450
      ) {
        score -= 10
      }

      return {
        ...driver,
        match_score: Math.max(0, score),
        match_max: maxScore
      }
    })
    .sort((a, b) => b.match_score - a.match_score)
    // Brand diversity — max 2 per brand
    .reduce((acc, driver) => {
      const brandCount = acc.filter(d => d.brand === driver.brand).length
      if (brandCount < 2) acc.push(driver)
      return acc
    }, [])
    .slice(0, 6)
}

export function getDriverMatchLabel(score, maxScore) {
  const pct = maxScore > 0 ? (score / maxScore) * 100 : 0
  if (pct >= 88) return { label: 'Excellent match', color: 'success' }
  if (pct >= 72) return { label: 'Good match', color: 'info' }
  if (pct >= 55) return { label: 'Decent match', color: 'warning' }
  return { label: 'Partial match', color: 'secondary' }
}

export function getDriverMatchPercent(score, maxScore) {
  if (maxScore <= 0) return 0
  return Math.min(100, Math.round((score / maxScore) * 100))
}
