// Minimal but broad set of countries with ISO codes and primary currency
// Flag emoji is derived from country code in UI to keep this concise.

export const countries = [
  { code: 'US', name: 'United States', currency: 'USD' },
  { code: 'CA', name: 'Canada', currency: 'CAD' },
  { code: 'GB', name: 'United Kingdom', currency: 'GBP' },
  { code: 'EU', name: 'Eurozone', currency: 'EUR' },
  { code: 'DE', name: 'Germany', currency: 'EUR' },
  { code: 'FR', name: 'France', currency: 'EUR' },
  { code: 'ES', name: 'Spain', currency: 'EUR' },
  { code: 'IT', name: 'Italy', currency: 'EUR' },
  { code: 'NL', name: 'Netherlands', currency: 'EUR' },
  { code: 'SE', name: 'Sweden', currency: 'SEK' },
  { code: 'NO', name: 'Norway', currency: 'NOK' },
  { code: 'DK', name: 'Denmark', currency: 'DKK' },
  { code: 'CH', name: 'Switzerland', currency: 'CHF' },
  { code: 'AU', name: 'Australia', currency: 'AUD' },
  { code: 'NZ', name: 'New Zealand', currency: 'NZD' },
  { code: 'JP', name: 'Japan', currency: 'JPY' },
  { code: 'CN', name: 'China', currency: 'CNY' },
  { code: 'IN', name: 'India', currency: 'INR' },
  { code: 'SG', name: 'Singapore', currency: 'SGD' },
  { code: 'HK', name: 'Hong Kong', currency: 'HKD' },
  { code: 'KR', name: 'South Korea', currency: 'KRW' },
  { code: 'AE', name: 'United Arab Emirates', currency: 'AED' },
  { code: 'SA', name: 'Saudi Arabia', currency: 'SAR' },
  { code: 'BR', name: 'Brazil', currency: 'BRL' },
  { code: 'MX', name: 'Mexico', currency: 'MXN' },
  { code: 'AR', name: 'Argentina', currency: 'ARS' },
  { code: 'CL', name: 'Chile', currency: 'CLP' },
  { code: 'CO', name: 'Colombia', currency: 'COP' },
  { code: 'ZA', name: 'South Africa', currency: 'ZAR' },
  { code: 'NG', name: 'Nigeria', currency: 'NGN' },
  { code: 'KE', name: 'Kenya', currency: 'KES' },
  { code: 'EG', name: 'Egypt', currency: 'EGP' },
  { code: 'TR', name: 'Turkey', currency: 'TRY' },
  { code: 'IL', name: 'Israel', currency: 'ILS' },
  { code: 'RU', name: 'Russia', currency: 'RUB' },
]

export const uniqueCurrencies = () => {
  const seen = new Set()
  const list = []
  for (const c of countries) {
    if (!seen.has(c.currency)) {
      seen.add(c.currency)
      list.push({ code: c.currency })
    }
  }
  // Add a few popular extras if not in countries list
  for (const extra of ['THB', 'PLN', 'CZK', 'HUF', 'PHP', 'IDR', 'MYR', 'VND']) {
    if (!seen.has(extra)) list.push({ code: extra })
  }
  return list
}

export function flagEmojiFromCountryCode(code) {
  if (!code || code.length !== 2) return '🏳️'
  // Special case: EU has its own flag
  if (code.toUpperCase() === 'EU') return '🇪🇺'
  const base = 127397
  const chars = [...code.toUpperCase()].map(c => String.fromCodePoint(base + c.charCodeAt(0)))
  return chars.join('')
}

