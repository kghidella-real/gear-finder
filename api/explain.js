export default async function handler(req, res) {
  const { club, profile } = req.body

  const handicapText = profile.handicap
    ? `a ${profile.handicap} handicap`
    : `a ${profile.category?.replace(/_/g, ' ')} player`

  const missText = profile.miss && profile.miss !== 'none'
    ? `, who typically ${profile.miss === 'thin_fat' ? 'catches it thin or fat' : profile.miss + 's'}`
    : ''

  const shaftText = profile.shaft && profile.shaft !== 'not_sure'
    ? ` preferring ${profile.shaft} shafts`
    : ''

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: `In 2-3 sentences, explain why the ${club.name} suits ${handicapText}${missText}${shaftText}. Be specific about the club's features that match this player's needs. Be practical and honest, not salesy. Do not start with "The ${club.name}".`
      }]
    })
  })

  const data = await response.json()
  res.json({ explanation: data.content[0].text })
}
