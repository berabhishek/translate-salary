import React, { useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SearchableSelect from '../components/SearchableSelect.jsx'
import { countries, flagEmojiFromCountryCode, uniqueCurrencies } from '../countries.js'
import { setField, resetLifestyle } from '../store/formSlice.js'
import { reformatWithCommasPreserveCaret } from '../utils/numberFormat.js'

function currencyLabel(code) {
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

export default function TranslateSalary() {
  const dispatch = useDispatch()
  const {
    sourceCode,
    targetCode,
    salary,
    salaryCurrency,
    houseRent,
    food,
    entertainment,
    travel,
    shopping,
    other,
  } = useSelector((s) => s.form)

  const source = useMemo(() => countries.find((c) => c.code === sourceCode) || countries[0], [sourceCode])
  const target = useMemo(() => countries.find((c) => c.code === targetCode) || countries[1], [targetCode])
  const currencyOptions = useMemo(() => uniqueCurrencies().map((c) => ({ code: c.code })), [])

  const salaryInputRef = useRef(null)
  const [lifestyleOpen, setLifestyleOpen] = useState(false)
  const houseRentRef = useRef(null)
  const foodRef = useRef(null)
  const entertainmentRef = useRef(null)
  const travelRef = useRef(null)
  const shoppingRef = useRef(null)
  const otherRef = useRef(null)

  function handleSourceChange(next) {
    const prevSource = source
    dispatch(setField({ field: 'sourceCode', value: next.code }))
    const prevCurrency = prevSource?.currency
    if (!salaryCurrency || salaryCurrency === prevCurrency) {
      dispatch(setField({ field: 'salaryCurrency', value: next.currency }))
    }
  }

  function makeMonetaryChangeHandler(field, ref) {
    return (e) => {
      const input = e.target
      const raw = input.value
      const { formatted, caret } = reformatWithCommasPreserveCaret(raw, input.selectionStart)
      dispatch(setField({ field, value: formatted }))
      requestAnimationFrame(() => {
        try { ref.current?.setSelectionRange(caret, caret) } catch {}
      })
    }
  }

  return (
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
          <label className="label">Annual Salary</label>
          <div className="salary-group">
            <input
              ref={salaryInputRef}
              type="text"
              inputMode="decimal"
              placeholder="e.g., 80,000"
              className="input flex-1"
              value={salary}
              onChange={makeMonetaryChangeHandler('salary', salaryInputRef)}
            />

            <SearchableSelect
              className="currency-select"
              options={currencyOptions}
              value={{ code: salaryCurrency || source.currency }}
              onChange={(o) => dispatch(setField({ field: 'salaryCurrency', value: o.code }))}
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
          <p className="hint">Enter the pre tax annual salary in the source country.</p>
        </div>

        <div className="form-row">
          <label className="label">Target Country</label>
          <SearchableSelect
            options={countries}
            value={target}
            onChange={(o) => dispatch(setField({ field: 'targetCode', value: o.code }))}
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

        <div className="form-row">
          <button
            type="button"
            className="collapse-toggle"
            onClick={() => setLifestyleOpen((v) => !v)}
            aria-expanded={lifestyleOpen}
          >
            <span>Lifestyle</span>
            <span className={`chevron ${lifestyleOpen ? 'open' : ''}`}>▾</span>
          </button>
          {lifestyleOpen && (
            <div className="lifestyle-grid">
              <div className="form-row">
                <label className="label">House Rent <span className="mono chip">{source?.currency}</span></label>
                <input
                  ref={houseRentRef}
                  type="text"
                  inputMode="decimal"
                  placeholder="e.g., 1,500"
                  className="input"
                  value={houseRent}
                  onChange={makeMonetaryChangeHandler('houseRent', houseRentRef)}
                />
              </div>
              <div className="form-row">
                <label className="label">Food <span className="mono chip">{source?.currency}</span></label>
                <input
                  ref={foodRef}
                  type="text"
                  inputMode="decimal"
                  placeholder="e.g., 400"
                  className="input"
                  value={food}
                  onChange={makeMonetaryChangeHandler('food', foodRef)}
                />
              </div>
              <div className="form-row">
                <label className="label">Entertainment <span className="mono chip">{source?.currency}</span></label>
                <input
                  ref={entertainmentRef}
                  type="text"
                  inputMode="decimal"
                  placeholder="e.g., 150"
                  className="input"
                  value={entertainment}
                  onChange={makeMonetaryChangeHandler('entertainment', entertainmentRef)}
                />
              </div>
              <div className="form-row">
                <label className="label">Travel <span className="mono chip">{source?.currency}</span></label>
                <input
                  ref={travelRef}
                  type="text"
                  inputMode="decimal"
                  placeholder="e.g., 120"
                  className="input"
                  value={travel}
                  onChange={makeMonetaryChangeHandler('travel', travelRef)}
                />
              </div>
              <div className="form-row">
                <label className="label">Shopping <span className="mono chip">{source?.currency}</span></label>
                <input
                  ref={shoppingRef}
                  type="text"
                  inputMode="decimal"
                  placeholder="e.g., 200"
                  className="input"
                  value={shopping}
                  onChange={makeMonetaryChangeHandler('shopping', shoppingRef)}
                />
              </div>
              <div className="form-row">
                <label className="label">Other <span className="mono chip">{source?.currency}</span></label>
                <input
                  ref={otherRef}
                  type="text"
                  inputMode="decimal"
                  placeholder="e.g., 75"
                  className="input"
                  value={other}
                  onChange={makeMonetaryChangeHandler('other', otherRef)}
                />
              </div>
            </div>
          )}
        </div>

        <div className="actions">
          <button type="submit" className="btn primary" disabled={!source || !target || !salary}>
            Continue
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => {
              dispatch(setField({ field: 'salary', value: '' }))
              dispatch(setField({ field: 'salaryCurrency', value: source?.currency }))
              dispatch(resetLifestyle())
            }}
          >
            Reset
          </button>
        </div>
      </form>
    </main>
  )
}

