export function flagEmojiFromCountryCode(code) {
  if (!code || code.length !== 2) return '🏳️'
  // Special case: EU has its own flag
  if (code.toUpperCase() === 'EU') return '🇪🇺'
  const base = 127397
  const chars = [...code.toUpperCase()].map(c => String.fromCodePoint(base + c.charCodeAt(0)))
  return chars.join('')
}