export function matchClubs(clubs, profile) {
  return clubs
    .filter(club => {
      if (profile.category) {
        return club.category === profile.category
      }
      return true
    })
    .map(club => {
      let score = 0
      let maxScore = 0

      // ── Handicap fit (30 points) ──────────────────────────
      maxScore += 30
      if (
        profile.handicap >= club.handicap_min &&
        profile.handicap <= club.handicap_max
      ) {
        score += 30
      } else {
        const distance = Math.min(
          Math.abs(profile.handicap - club.handicap_min),
          Math.abs(profile.handicap - club.handicap_max)
        )
        score += Math.max(0, 30 - distance * 7)
      }

      // ── Aspiration bonus (8 points) ────────────────────────
      // Reward clubs in the next better category when handicap
      // is within 3 strokes of that category's range
      maxScore += 8
      if (profile.handicap && !profile.category) {
        const hcp = profile.handicap
        const withinReach = hcp - club.handicap_min <= 3 && hcp > club.handicap_max
        const betterCategory = (
          (club.category === 'players_distance' && hcp >= 15 && hcp <= 22) ||
          (club.category === 'players' && hcp >= 8 && hcp <= 14) ||
          (club.category === 'muscle_back' && hcp >= 3 && hcp <= 8)
        )
        if (withinReach && betterCategory) {
          score += 8
        }
      }

      // ── Miss correction (30 points) ──────────────────────
      maxScore += 30
      if (profile.miss && profile.miss !== 'none') {
        if (club.miss_suits.includes(profile.miss)) {
          score += 30 // perfect miss match
        } else if (club.miss_suits.length === 0) {
          score += 18 // players irons suit any miss
        } else {
          score += 5  // wrong miss but not a disaster
        }
      } else {
        // no consistent miss — reward clubs that suit multiple misses
        score += 15 + Math.min(10, club.miss_suits.length * 3)
        maxScore += 10
      }

      // ── Shaft preference (15 points) ─────────────────────
      maxScore += 15
      if (!profile.shaft || profile.shaft === 'not_sure') {
        score += 10 // no preference — neutral score
      } else if (club.shaft_options.includes(profile.shaft)) {
        score += 15 // exact match
      } else {
        score += 0  // wrong shaft — meaningful penalty
      }

      // ── Budget fit (20 points) ────────────────────────────
      maxScore += 20
      if (!profile.budget_max || profile.budget_max >= 9999) {
        score += 20 // no limit — full points for everyone
      } else if (club.price_usd <= profile.budget_max) {
        score += 20 // within budget — full points
      } else {
        // Decay more aggressively over budget
        const overage = club.price_usd - profile.budget_max
        score += Math.max(0, 20 - Math.floor(overage / 75) * 4)
      }

      // ── Draw bias bonus (12 points) ───────────────────────
      if (profile.miss === 'slice' && club.draw_bias) {
        score += 12
        maxScore += 12
      }

      // ── Wide sole bonus (8 points) ────────────────────────
      if (
        profile.miss === 'thin_fat' &&
        (club.sole_width === 'wide' || club.sole_width === 'extra_wide')
      ) {
        score += 8
        maxScore += 8
      }

      // ── Category fit bonus (10 points) ────────────────────
      // Reward clubs clearly in the right category for the handicap
      if (!profile.category && profile.handicap) {
        const hcp = profile.handicap
        const cat = club.category
        if (
          (hcp >= 30 && cat === 'max_forgiveness') ||
          (hcp >= 18 && hcp < 30 && cat === 'game_improvement') ||
          (hcp >= 12 && hcp < 20 && cat === 'players_distance') ||
          (hcp >= 5 && hcp < 12 && cat === 'players') ||
          (hcp < 8 && cat === 'muscle_back')
        ) {
          score += 10
          maxScore += 10
        }
      }

      // ── Penalties ─────────────────────────────────────────
      // Blade for high handicapper
      if (profile.handicap > 18 && club.category === 'muscle_back') {
        score -= 25
      }
      // Max forgiveness for low handicapper
      if (profile.handicap < 6 && club.category === 'max_forgiveness') {
        score -= 25
      }
      // Muscle back bad for slicer above 10 handicap
      if (
        profile.miss === 'slice' &&
        club.category === 'muscle_back' &&
        profile.handicap > 10
      ) {
        score -= 15
      }

      return {
        ...club,
        match_score: score,
        match_max: maxScore
      }
    })
    .sort((a, b) => b.match_score - a.match_score)
    // Brand diversity — max 2 per brand
    .reduce((acc, club) => {
      const brandCount = acc.filter(c => c.brand === club.brand).length
      if (brandCount < 2) acc.push(club)
      return acc
    }, [])
    .slice(0, 6)
}

export function getMatchLabel(score, maxScore) {
  const pct = maxScore > 0 ? (score / maxScore) * 100 : 0
  if (pct >= 88) return { label: 'Excellent match', color: 'success' }
  if (pct >= 72) return { label: 'Good match', color: 'info' }
  if (pct >= 55) return { label: 'Decent match', color: 'warning' }
  return { label: 'Partial match', color: 'secondary' }
}

export function getMatchPercent(score, maxScore) {
  if (maxScore <= 0) return 0
  return Math.min(100, Math.round((score / maxScore) * 100))
}

export function getCommunityLabel(rating) {
  if (rating >= 4.7) return 'Highly rated'
  if (rating >= 4.4) return 'Well rated'
  if (rating >= 4.0) return 'Positively reviewed'
  return 'Mixed reviews'
}

export function getCommunityContext(count) {
  if (count >= 300) return 'Large sample'
  if (count >= 100) return 'Good sample'
  return 'Early reviews'
}
