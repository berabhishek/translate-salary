import React, { useMemo, useState } from 'react'
import SearchableSelect from './components/SearchableSelect.jsx'
import { countries, flagEmojiFromCountryCode, uniqueCurrencies } from './countries.js'

function currencyLabel(code) {
  // Minimal labels; can be extended or fetched later
  const labels = {
    USD: 'US Dollar', EUR: 'Euro', GBP: 'British Pound', CAD: 'Canadian Dollar', AUD: 'Australian Dollar',
    NZD: 'New Zealand Dollar', JPY: 'Japanese Yen', CNY: 'Chinese Yuan', INR: 'Indian Rupee', SGD: 'Singapore Dollar',
    HKD: 'Hong Kong Dollar', KRW: 'South Korean Won', CHF: 'Swiss Franc', SEK: 'Swedish Krona', NOK: 'Norwegian Krone',
    DKK: 'Danish Krone', AED: 'UAE Dirham', SAR: 'Saudi Riyal', BRL: 'Brazilian Real', MXN: 'Mexican Peso',
    ARS: 'Argentine Peso', CLP: 'Chilean Peso', COP: 'Colombian Peso', ZAR: 'South African Rand', NGN: 'Nigerian Naira',
    KES: 'Kenyan Shilling', EGP: 'Egyptian Pound', TRY: 'Turkish Lira', ILS: 'Israeli Shekel', RUB: 'Russian Ruble',
    THB: 'Thai Baht', PLN: 'Polish Złoty', CZK: 'Czech Koruna', HUF: 'Hungarian Forint', PHP: 'Philippine Peso',
    IDR: 'Indonesian Rupiah', MYR: 'Malaysian Ringgit', VND: 'Vietnamese Dong'
  }
  return `${code}${labels[code] ? ` — ${labels[code]}` : ''}`
}

export default function App() {
  const [source, setSource] = useState(() => countries.find(c => c.code === 'US') || countries[0])
  const [target, setTarget] = useState(() => countries.find(c => c.code === 'IN') || countries[1])
  const [salary, setSalary] = useState('')
  const [salaryCurrency, setSalaryCurrency] = useState(() => source?.currency)

  // When source changes, if currency matches prior source currency (user did not override), update.
  function handleSourceChange(next) {
    const prev = source
    setSource(next)
    if (!salaryCurrency || salaryCurrency === prev?.currency) {
      setSalaryCurrency(next.currency)
    }
  }

  const currencyOptions = useMemo(() => uniqueCurrencies().map(c => ({ code: c.code })), [])

  return (
    <div className="page">
      <header className="header">
        <div className="logo">💱</div>
        <div>
          <h1 className="title">Translate Salary</h1>
          <p className="subtitle">Compare salaries across countries and currencies</p>
        </div>
      </header>

      <main className="card">
        <form className="form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-row">
            <label className="label">Source Country</label>
            <SearchableSelect
              options={countries}
              value={source}
              onChange={handleSourceChange}
              getOptionValue={(o) => o.code}
              getOptionLabel={(o) => `${o.name}`}
              placeholder="Select source country"
              renderOption={(o) => (
                <div className="opt-row">
                  <span className="flag">{flagEmojiFromCountryCode(o.code)}</span>
                  <span>{o.name}</span>
                </div>
              )}
            />
          </div>

          <div className="form-row">
            <label className="label">Salary</label>
            <div className="salary-group">
              <input
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0"
                placeholder="e.g., 80000"
                className="input flex-1"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
              />

              <SearchableSelect
                className="currency-select"
                options={currencyOptions}
                value={{ code: salaryCurrency }}
                onChange={(o) => setSalaryCurrency(o.code)}
                getOptionValue={(o) => o.code}
                getOptionLabel={(o) => currencyLabel(o.code)}
                placeholder="Currency"
                renderOption={(o) => (
                  <div className="opt-row">
                    <span className="mono chip">{o.code}</span>
                    <span className="muted">{currencyLabel(o.code).replace(`${o.code} — `, '')}</span>
                  </div>
                )}
              />
            </div>
            <p className="hint">Defaults to the source country’s currency. You can change it.</p>
          </div>

          <div className="form-row">
            <label className="label">Target Country</label>
            <SearchableSelect
              options={countries}
              value={target}
              onChange={setTarget}
              getOptionValue={(o) => o.code}
              getOptionLabel={(o) => `${o.name}`}
              placeholder="Select target country"
              renderOption={(o) => (
                <div className="opt-row">
                  <span className="flag">{flagEmojiFromCountryCode(o.code)}</span>
                  <span>{o.name}</span>
                </div>
              )}
            />
          </div>

          <div className="actions">
            <button type="submit" className="btn primary" disabled={!source || !target || !salary}>
              Continue
            </button>
            <button type="button" className="btn" onClick={() => { setSalary(''); setSalaryCurrency(source?.currency); }}>
              Reset
            </button>
          </div>
        </form>
      </main>

      <footer className="footer">
        <span className="muted">Tip: Start typing to search the dropdowns</span>
      </footer>
    </div>
  )
}

