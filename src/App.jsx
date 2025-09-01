import React from 'react'
import TranslateSalary from './pages/TranslateSalary.jsx'
import IdealTargetCard from './components/IdealTargetCard.jsx'

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

      <div className="content-grid">
        <TranslateSalary />
        <IdealTargetCard />
      </div>

      <footer className="footer">
      </footer>
    </div>
  )
}
