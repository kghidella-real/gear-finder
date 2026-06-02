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

      // Handicap fit (35 points — slightly reduced to let other factors influence more)
      if (
        profile.handicap >= club.handicap_min &&
        profile.handicap <= club.handicap_max
      ) {
        score += 35
      } else {
        const distance = Math.min(
          Math.abs(profile.handicap - club.handicap_min),
          Math.abs(profile.handicap - club.handicap_max)
        )
        score += Math.max(0, 35 - distance * 8)
      }

      // Miss correction (30 points — increased so miss drives more variation)
      if (profile.miss && profile.miss !== 'none') {
        if (club.miss_suits.includes(profile.miss)) {
          score += 30
        } else if (club.miss_suits.length === 0) {
          score += 10
        }
      } else {
        score += 15
      }

      // Shaft preference (15 points)
      if (profile.shaft && profile.shaft !== 'not_sure') {
        if (club.shaft_options.includes(profile.shaft)) {
          score += 15
        }
      } else {
        score += 10
      }

      // Budget fit (25 points — increased so price drives more variation)
      if (profile.budget_max && profile.budget_max < 9999) {
        if (club.price_usd <= profile.budget_max) {
          score += 25
        } else {
          const overage = club.price_usd - profile.budget_max
          score += Math.max(0, 25 - Math.floor(overage / 50) * 3)
        }
      } else {
        score += 15
      }

      // Bonus: draw bias strongly helps slicers
      if (profile.miss === 'slice' && club.draw_bias) {
        score += 12
      }

      // Bonus: wide sole helps thin/fat hitters
      if (profile.miss === 'thin_fat' && club.sole_width === 'wide') {
        score += 8
      }

      // Penalty: muscle backs for high handicappers
      if (profile.handicap > 15 && club.category === 'muscle_back') {
        score -= 20
      }

      // Penalty: max forgiveness for low handicappers
      if (profile.handicap < 8 && club.category === 'max_forgiveness') {
        score -= 20
      }

      return { ...club, match_score: score }
    })
    .sort((a, b) => b.match_score - a.match_score)
    .reduce((acc, club) => {
      const brandCount = acc.filter(c => c.brand === club.brand).length
      if (brandCount < 2) acc.push(club)
      return acc
    }, [])
    .slice(0, 6)
}

export function getMatchLabel(score) {
  if (score >= 90) return { label: 'Excellent match', color: 'success' }
  if (score >= 70) return { label: 'Good match', color: 'info' }
  if (score >= 50) return { label: 'Decent match', color: 'warning' }
  return { label: 'Partial match', color: 'secondary' }
}

export function getMatchPercent(score) {
  return Math.min(100, Math.round((score / 115) * 100))
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
