import React from 'react'
import { useSelector } from 'react-redux'
import { countries } from '../countries'

export default function IdealTargetCard() {
  const { targetCode } = useSelector((s) => s.form)
  const target = countries.find((c) => c.code === targetCode)

  // Placeholder value for now until calculation logic exists
  const value = '—'

  return (
    <aside className="card kpi-card" aria-live="polite">
      <div className="kpi-title">Ideal Target Salary</div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-meta muted">in {target?.currency || 'target currency'}</div>
    </aside>
  )
}

