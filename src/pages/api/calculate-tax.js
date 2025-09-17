
import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

// --- Utility Functions ---

function parseRequestBody(req) {
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      throw new Error('Invalid JSON');
    }
  } else if (typeof req.body === 'object' && req.body !== null) {
    return req.body;
  } else {
    throw new Error('Invalid request body');
  }
}

function validateParams({ sourceCode, salary }) {
  if (!sourceCode || typeof sourceCode !== 'string') {
    throw new Error('Missing or invalid sourceCode');
  }
  if (salary === undefined || salary === null || isNaN(Number(salary))) {
    throw new Error('Missing or invalid salary');
  }
}

async function getTaxBrackets(countryCode) {
  const res = await client.execute({
    sql: 'SELECT min_income, max_income, rate_percent FROM tax_brackets WHERE country_code = ? ORDER BY min_income ASC',
    args: [countryCode]
  });
  return res.rows;
}

function calculateProgressiveTax(income, brackets) {
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
      debug.push({ min, max, rate: Number(bracket.rate_percent), upper, taxable, bracketTax, runningTax: tax });
    } else {
      debug.push({ min, max, rate: Number(bracket.rate_percent), upper: null, taxable: 0, bracketTax: 0, runningTax: tax, skipped: true });
    }
  }
  return { tax, debug };
}

// --- Main Handler ---

export default async function handler(req, res) {
  console.log('API called: /api/calculate-tax')
  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method)
    return res.status(405).json({ error: 'Method not allowed' });
  }
  let body;
  try {
    body = parseRequestBody(req);
    const { sourceCode, salary } = body;
    validateParams({ sourceCode, salary });
    const brackets = await getTaxBrackets(sourceCode);
    if (!Array.isArray(brackets) || brackets.length === 0) {
      return res.status(404).json({ error: 'No tax brackets found for country' });
    }
    const income = Number(salary);
    const { tax, debug } = calculateProgressiveTax(income, brackets);
    return res.status(200).json({ tax, debug });
  } catch (err) {
    console.log('API error:', err.message);
    if (err.message.startsWith('Missing') || err.message.startsWith('Invalid')) {
      return res.status(400).json({ error: err.message });
    }
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
}

export {
    parseRequestBody,
    validateParams,
    getTaxBrackets,
    calculateProgressiveTax
};
