import React, { useEffect, useMemo, useRef, useState } from 'react'

import { useOnClickOutside } from '../hooks/useOnClickOutside';

export default function SearchableSelect({
  options,
  value,
  onChange,
  getOptionValue = (o) => o.value ?? o.id ?? o.code ?? o.key,
  getOptionLabel = (o) => o.label ?? o.name ?? String(o.value ?? o.code ?? ''),
  renderOption,
  placeholder = 'Select... ',
  emptyText = 'No results',
  className = '',
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const buttonRef = useRef(null)
  const listRef = useRef(null)

  const selected = useMemo(() => {
    const v = typeof value === 'object' ? getOptionValue(value) : value
    return options.find((o) => getOptionValue(o) === v)
  }, [value, options, getOptionValue])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return options
    return options.filter((o) => getOptionLabel(o).toLowerCase().includes(q))
  }, [query, options, getOptionLabel])

  useOnClickOutside([buttonRef, listRef], () => setOpen(false));

  function handleSelect(o) {
    onChange?.(o)
    setOpen(false)
    setQuery('')
  }

  return (
    <div className={`ss-root ${className}`}>
      <button
        type="button"
        ref={buttonRef}
        className={`ss-button ${open ? 'open' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="ss-button-label">
          {selected ? (
            renderOption ? renderOption(selected) : getOptionLabel(selected)
          ) : (
            <span className="ss-placeholder">{placeholder}</span>
          )}
        </span>
        <span className="ss-caret" aria-hidden>▾</span>
      </button>

      {open && (
        <div className="ss-popover" ref={listRef}>
          <input
            autoFocus
            className="ss-input"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <ul className="ss-list" role="listbox">
            {filtered.length === 0 && (
              <li className="ss-empty">{emptyText}</li>
            )}
            {filtered.map((o) => (
              <li
                key={getOptionValue(o)}
                role="option"
                aria-selected={getOptionValue(o) === getOptionValue(selected || {})}
                className={`ss-option ${getOptionValue(o) === getOptionValue(selected || {}) ? 'selected' : ''}`}
                onClick={() => handleSelect(o)}
              >
                {renderOption ? renderOption(o) : getOptionLabel(o)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

