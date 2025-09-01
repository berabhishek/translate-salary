import React, { useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SearchableSelect from '../components/SearchableSelect.jsx'
import ExpensesSection from '../components/ExpensesSection.jsx'
import { countries, flagEmojiFromCountryCode, uniqueCurrencies } from '../countries.js'
import { setField, resetLifestyle, setCurrencyUserSelected, setCurrencyFromSource, resetCurrencySelection } from '../store/formSlice.js'
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
    medicalExpenses,
    medicalInsurance,
    surprisesOther,
  } = useSelector((s) => s.form)

  const source = useMemo(() => countries.find((c) => c.code === sourceCode) || countries[0], [sourceCode])
  const target = useMemo(() => countries.find((c) => c.code === targetCode) || countries[1], [targetCode])
  const currencyOptions = useMemo(() => uniqueCurrencies().map((c) => ({ code: c.code })), [])

  const salaryInputRef = useRef(null)
  const [lifestyleOpen, setLifestyleOpen] = useState(false)
  const [surprisesOpen, setSurprisesOpen] = useState(false)

  function handleSourceChange(next) {
    const prevSource = source
    dispatch(setField({ field: 'sourceCode', value: next.code }))
    dispatch(setCurrencyFromSource(next.currency))
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
        <div class="form-row-split">
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
        </div>

        <div className="form-row">
          <div className="salary-group">
            <div className="salary-subcol currency-select">
              <label className="label">Currency</label>
              <SearchableSelect
                options={currencyOptions}
                value={{ code: salaryCurrency || source.currency }}
                onChange={(o) => dispatch(setCurrencyUserSelected(o.code))}
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
            <div className="salary-subcol flex-1">
              <label className="label">Annual Salary</label>
              <input
                ref={salaryInputRef}
                type="text"
                inputMode="decimal"
                placeholder="e.g., 80,000"
                className="input"
                value={salary}
                onChange={makeMonetaryChangeHandler('salary', salaryInputRef)}
              />
            </div>
          </div>
          <p className="hint">Enter the pre tax annual salary in the source country.</p>
        </div>

        <ExpensesSection
          title="Lifestyle"
          currency={salaryCurrency || source?.currency}
          fields={[
            { key: 'houseRent', label: 'House Rent', placeholder: 'e.g., 1,500', value: houseRent },
            { key: 'food', label: 'Food', placeholder: 'e.g., 400', value: food },
            { key: 'entertainment', label: 'Entertainment', placeholder: 'e.g., 150', value: entertainment },
            { key: 'travel', label: 'Travel', placeholder: 'e.g., 120', value: travel },
            { key: 'shopping', label: 'Shopping', placeholder: 'e.g., 200', value: shopping },
            { key: 'other', label: 'Other', placeholder: 'e.g., 75', value: other },
          ]}
          makeMonetaryChangeHandler={makeMonetaryChangeHandler}
          open={lifestyleOpen}
          setOpen={setLifestyleOpen}
        />

        <ExpensesSection
          title="Surprises"
          currency={salaryCurrency || source?.currency}
          fields={[
            { key: 'medicalExpenses', label: 'Medical Expenses', placeholder: 'e.g., 100', value: medicalExpenses },
            { key: 'medicalInsurance', label: 'Medical Insurance', placeholder: 'e.g., 80', value: medicalInsurance },
            { key: 'surprisesOther', label: 'Other (Surprises)', placeholder: 'e.g., 50', value: surprisesOther },
          ]}
          makeMonetaryChangeHandler={makeMonetaryChangeHandler}
          open={surprisesOpen}
          setOpen={setSurprisesOpen}
        />

        <div className="actions">
          <button type="submit" className="btn primary" disabled={!source || !target || !salary}>
            Continue
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => {
              dispatch(setField({ field: 'salary', value: '' }))
              dispatch(resetCurrencySelection(source?.currency))
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
