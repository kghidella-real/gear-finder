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

      // Handicap fit — most important factor (40 points)
      if (
        profile.handicap >= club.handicap_min &&
        profile.handicap <= club.handicap_max
      ) {
        score += 40
      } else {
        const distance = Math.min(
          Math.abs(profile.handicap - club.handicap_min),
          Math.abs(profile.handicap - club.handicap_max)
        )
        score += Math.max(0, 40 - distance * 6)
      }

      // Miss correction (25 points)
      if (profile.miss && club.miss_suits.includes(profile.miss)) {
        score += 25
      }

      // Shaft preference (15 points)
      if (profile.shaft && club.shaft_options.includes(profile.shaft)) {
        score += 15
      }

      // Budget fit (20 points)
      if (profile.budget_max && club.price_usd <= profile.budget_max) {
        score += 20
      } else if (profile.budget_max) {
        const overage = club.price_usd - profile.budget_max
        score += Math.max(0, 20 - Math.floor(overage / 100) * 4)
      }

      // Bonus: draw bias helps slicers
      if (profile.miss === 'slice' && club.draw_bias) {
        score += 10
      }

      return { ...club, match_score: score }
    })
    .sort((a, b) => b.match_score - a.match_score)
    .slice(0, 3)
}

export function getMatchLabel(score) {
  if (score >= 85) return { label: 'Excellent match', color: 'success' }
  if (score >= 65) return { label: 'Good match', color: 'info' }
  if (score >= 45) return { label: 'Decent match', color: 'warning' }
  return { label: 'Partial match', color: 'secondary' }
}

export function getMatchPercent(score) {
  return Math.min(100, Math.round((score / 110) * 100))
}
