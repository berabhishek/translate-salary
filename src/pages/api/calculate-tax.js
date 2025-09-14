
import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

export default async function handler(req, res) {
  console.log('API called: /api/calculate-tax')
  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method)
    res.status(405).json({ error: 'Method not allowed' })
    return
  }
  let body = {};
  if (typeof req.body === 'string') {
    try {
      body = JSON.parse(req.body);
    } catch (e) {
      res.status(400).json({ error: 'Invalid JSON' });
      return;
    }
  } else if (typeof req.body === 'object' && req.body !== null) {
    body = req.body;
  } else {
    res.status(400).json({ error: 'Invalid request body' });
    return;
  }
  const { sourceCode, salary } = body;
  console.log('Received params:', { sourceCode, salary })
  if (!sourceCode || !salary) {
    console.log('Missing parameters')
    res.status(400).json({ error: 'Missing parameters' })
    return
  }
  try {
    const bracketsRes = await client.execute({
      sql: 'SELECT min_income, max_income, rate_percent FROM tax_brackets WHERE country_code = ? ORDER BY min_income ASC',
      args: [sourceCode]
    });
    const brackets = bracketsRes.rows;
    const income = Number(salary);
    let tax = 0;
    const debug = [];
    for (const bracket of brackets) {
      const min = Number(bracket.min_income);
      const max = bracket.max_income === null ? Infinity : Number(bracket.max_income);
      if (income > min) {
        const upper = Math.min(income, max);
        const taxable = upper - min;
        let bracketTax = 0;
        if (taxable > 0) {
          bracketTax = taxable * (Number(bracket.rate_percent) / 100);
          tax += bracketTax;
        }
        debug.push({
          min,
          max,
          rate: Number(bracket.rate_percent),
          upper,
          taxable,
          bracketTax,
          runningTax: tax
        });
      } else {
        debug.push({
          min,
          max,
          rate: Number(bracket.rate_percent),
          upper: null,
          taxable: 0,
          bracketTax: 0,
          runningTax: tax,
          skipped: true
        });
      }
    }
    res.status(200).json({ tax, debug });
  } catch (err) {
    console.log('Database or query error:', err)
    res.status(500).json({ error: 'Database or query error', details: err.message })
  }
}
