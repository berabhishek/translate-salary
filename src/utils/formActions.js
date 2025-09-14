// Handler for form continue action (can be extended for more logic/calculations)
// Handler for form continue action (calls API to calculate tax)
export async function handleFormContinue({ sourceCode, targetCode, salary, salaryCurrency, lifestyle, surprises }) {
  try {
    const res = await fetch('/api/calculate-tax', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sourceCode, salary: parseFloat(String(salary).replace(/,/g, '')) })
    })
    if (!res.ok) {
      throw new Error('Failed to calculate tax')
    }
    const data = await res.json()
    // You can handle the result here (e.g., update state, show UI, etc.)
    console.log({
      sourceCode,
      targetCode,
      salary,
      salaryCurrency,
      lifestyle,
      surprises,
      tax: data.tax
    })
    // Optionally return the tax value
    return data.tax
  } catch (err) {
    console.error('Tax calculation error:', err)
  }
}