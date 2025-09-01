import React, { useRef } from 'react'

export default function ExpensesSection({
  title,
  currency,
  fields,
  makeMonetaryChangeHandler,
  open,
  setOpen,
  gridClass = 'lifestyle-grid',
}) {
  const refs = useRef({})
  const getRef = (key) => {
    if (!refs.current[key]) refs.current[key] = React.createRef()
    return refs.current[key]
  }

  return (
    <div className="form-row">
      <button
        type="button"
        className="collapse-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span>{title}</span>
        <span className={`chevron ${open ? 'open' : ''}`}>▾</span>
      </button>
      {open && (
        <div className={gridClass}>
          {fields.map(({ key, label, placeholder, value }) => (
            <div className="form-row" key={key}>
              <label className="label">
                {label} <span className="mono chip">{currency}</span>
              </label>
              <input
                ref={getRef(key)}
                type="text"
                inputMode="decimal"
                placeholder={placeholder}
                className="input"
                value={value}
                onChange={makeMonetaryChangeHandler(key, getRef(key))}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

