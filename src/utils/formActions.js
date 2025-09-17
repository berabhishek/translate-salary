import { parseCurrency } from './numberFormat.js';
// Handler for form continue action (can be extended for more logic/calculations)
// Handler for form continue action (calls API to calculate tax and computes final savings)
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

    // Calculate total monthly expenses
    const totalMonthlyExpenses =
      Object.values(lifestyle).reduce((sum, value) => sum + parseCurrency(value), 0) +
      Object.values(surprises).reduce((sum, value) => sum + parseCurrency(value), 0);

    // Convert to annual expenses
    const totalAnnualExpenses = totalMonthlyExpenses * 12;

    // Parse salary and calculate final savings
    const numericSalary = parseCurrency(salary);
    const finalSavings = numericSalary - data.tax - totalAnnualExpenses;

    // Log the final savings to the console
    console.log(`
      --------------------
      Salary Calculation
      --------------------
      Gross Annual Salary: ${numericSalary.toLocaleString()}
      Annual Tax:          - ${data.tax.toLocaleString()}
      Annual Expenses:     - ${totalAnnualExpenses.toLocaleString()}
      --------------------
      Final Annual Savings:  ${finalSavings.toLocaleString()}
      --------------------
    `);

    // Optionally return the tax value
    return data.tax
  } catch (err) {
    console.error('Tax calculation error:', err)
  }
}