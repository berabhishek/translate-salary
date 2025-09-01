// Utilities for comma-separated monetary formatting with caret preservation

/**
 * Format a numeric string with thousand separators, preserving a single decimal point.
 * - Strips non-digit and non-dot characters
 * - Deduplicates extra dots beyond the first
 * - Preserves a trailing dot while typing
 */
export function formatWithCommas(raw) {
  if (!raw) return ''
  let clean = String(raw).replace(/[^0-9.]/g, '')
  const firstDot = clean.indexOf('.')
  if (firstDot !== -1) {
    clean = clean.slice(0, firstDot + 1) + clean.slice(firstDot + 1).replace(/\./g, '')
  }
  let [intPart = '', decPart] = clean.split('.')
  if (intPart) intPart = intPart.replace(/^0+(?=\d)/, '')
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  if (decPart !== undefined) {
    const keepDot = clean.endsWith('.') && (decPart?.length ?? 0) === 0
    return `${formattedInt}${keepDot ? '.' : decPart.length ? '.' : ''}${decPart ?? ''}`
  }
  return formattedInt
}

/**
 * Reformat an input string with commas and return the new string and caret position
 * to keep the cursor in the expected place relative to digits.
 */
export function reformatWithCommasPreserveCaret(raw, selectionStart) {
  const caretIndex = selectionStart ?? String(raw).length
  // Count allowed characters (digits or dot) before caret, ignoring commas/invalids
  const caretAllowedCount = String(raw).slice(0, caretIndex).replace(/[^0-9.]/g, '').length

  const formatted = formatWithCommas(raw)

  // Map caret to new position in formatted string by counting allowed chars
  let newCaret = 0
  let seen = 0
  for (let i = 0; i < formatted.length; i++) {
    if (/[0-9.]/.test(formatted[i])) seen++
    if (seen >= caretAllowedCount) { newCaret = i + 1; break }
  }
  if (caretAllowedCount === 0) newCaret = 0
  else if (seen < caretAllowedCount) newCaret = formatted.length

  return { formatted, caret: newCaret }
}

