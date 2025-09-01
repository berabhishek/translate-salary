import React, { useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CountrySelect from '../components/CountrySelect.jsx';
import ExpensesSection from '../components/ExpensesSection.jsx';
import { countries, uniqueCurrencies } from '../countries.js';
import { setField, resetExpenses, setCurrencyUserSelected, setCurrencyFromSource, resetCurrencySelection } from '../store/formSlice.js';
import { reformatWithCommasPreserveCaret } from '../utils/numberFormat.js';
import { useMonetaryInput } from '../hooks/useMonetaryInput.js';
import SearchableSelect from '../components/SearchableSelect.jsx';

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
    lifestyle,
    surprises,
  } = useSelector((s) => s.form)

  const source = countries.find((c) => c.code === sourceCode) || countries[0]
  const target = countries.find((c) => c.code === targetCode) || countries[1]
  const currencyOptions = useMemo(() => uniqueCurrencies().map((c) => ({ code: c.code })), [])

  const salaryInputRef = useRef(null)
  const [lifestyleOpen, setLifestyleOpen] = useState(false)
  const [surprisesOpen, setSurprisesOpen] = useState(false)

  const makeMonetaryChangeHandler = useMonetaryInput()

  function handleSourceChange(next) {
    dispatch(setField({ field: 'sourceCode', value: next.code }))
    dispatch(setCurrencyFromSource(next.currency))
  }

  return (
    <main className="card">
      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <div class="form-row-split">
          <div className="form-row">
            <label className="label">Source Country</label>
            <CountrySelect
              value={source}
              onChange={handleSourceChange}
              placeholder="Select source country"
            />
          </div>

          <div className="form-row">
            <label className="label">Target Country</label>
            <CountrySelect
              value={target}
              onChange={(o) => dispatch(setField({ field: 'targetCode', value: o.code }))}
              placeholder="Select target country"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="salary-group">
            <div className="salary-subcol currency-select">
              <label className="label">Currency</label>
              <SearchableSelect
                options={currencyOptions}
                value={{ code: salaryCurrency || source?.currency }}
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
            { key: 'lifestyle.houseRent', label: 'House Rent', placeholder: 'e.g., 1,500', value: lifestyle.houseRent },
            { key: 'lifestyle.food', label: 'Food', placeholder: 'e.g., 400', value: lifestyle.food },
            { key: 'lifestyle.entertainment', label: 'Entertainment', placeholder: 'e.g., 150', value: lifestyle.entertainment },
            { key: 'lifestyle.travel', label: 'Travel', placeholder: 'e.g., 120', value: lifestyle.travel },
            { key: 'lifestyle.shopping', label: 'Shopping', placeholder: 'e.g., 200', value: lifestyle.shopping },
            { key: 'lifestyle.other', label: 'Other', placeholder: 'e.g., 75', value: lifestyle.other },
          ]}
          makeMonetaryChangeHandler={makeMonetaryChangeHandler}
          open={lifestyleOpen}
          setOpen={setLifestyleOpen}
        />

        <ExpensesSection
          title="Surprises"
          currency={salaryCurrency || source?.currency}
          fields={[
            { key: 'surprises.medicalExpenses', label: 'Medical Expenses', placeholder: 'e.g., 100', value: surprises.medicalExpenses },
            { key: 'surprises.medicalInsurance', label: 'Medical Insurance', placeholder: 'e.g., 80', value: surprises.medicalInsurance },
            { key: 'surprises.surprisesOther', label: 'Other (Surprises)', placeholder: 'e.g., 50', value: surprises.surprisesOther },
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
              dispatch(resetExpenses())
            }}
          >
            Reset
          </button>
        </div>
      </form>
    </main>
  )
}
