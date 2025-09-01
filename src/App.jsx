import React from 'react'
import TranslateSalary from './pages/TranslateSalary.jsx'

export default function App() {
  return (
    <div className="page">
      <header className="header">
        <div className="logo">💱</div>
        <div>
          <h1 className="title">Translate Salary</h1>
          <p className="subtitle">Compare salaries across countries and currencies</p>
        </div>
      </header>

      <TranslateSalary />

      <footer className="footer">
        <span className="muted">Tip: Start typing to search the dropdowns</span>
      </footer>
    </div>
  )
}
