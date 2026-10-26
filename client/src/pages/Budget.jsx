import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'

const kinds = [
  { id: 'stocks', title: 'Individual stocks', note: 'Higher company-specific risk' },
  { id: 'mf', title: 'Mutual funds', note: 'Risk varies by fund mandate' },
  { id: 'index', title: 'Index funds', note: 'Broad or sector index exposure' },
  { id: 'etf', title: 'ETFs', note: 'Exchange-traded baskets or assets' }
]
const comfortLevels = [
  { id: 'conservative', title: 'Steady learner', description: 'I prefer smaller swings and understand that returns may be lower.' },
  { id: 'balanced', title: 'Balanced explorer', description: 'I can tolerate some ups and downs for a mix of growth and stability.' },
  { id: 'growth', title: 'Growth focused', description: 'I can tolerate larger swings and potentially larger losses.' }
]
const currency = (value) => `₹${Number(value).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`

export default function Budget() {
  const [amount, setAmount] = useState('50000')
  const [growthType, setGrowthType] = useState('index')
  const [riskTolerance, setRiskTolerance] = useState('balanced')
  const [plan, setPlan] = useState(null)
  const [year, setYear] = useState(1)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [generated, setGenerated] = useState(false)

  const selectedProjection = useMemo(() => plan?.projections.find((item) => item.years === year), [plan, year])

  async function generate(event) {
    event.preventDefault()
    setError('')
    setGenerated(false)
    setBusy(true)
    try {
      const result = await api('/allocate', {
        method: 'POST',
        body: JSON.stringify({ amount: Number(amount), growthType, riskTolerance })
      })
      setPlan(result)
      setYear(1)
      setGenerated(true)
      window.setTimeout(() => document.getElementById('allocation-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
    } catch (reason) {
      setError(reason.message)
      setPlan(null)
    } finally {
      setBusy(false)
    }
  }

  const maxBar = Math.max(selectedProjection?.upper || 1, Number(amount) || 1)

  return (
    <main className="page-shell page-enter">
      <section className="page-intro">
        <span className="eyebrow">02 / SAMPLE PORTFOLIO LAB</span>
        <h1>A plan that starts with <span>your comfort level.</span></h1>
        <p>Choose a pretend budget, investment type, and risk comfort. The demo explains how it splits the amount and how fictional past-performance scenarios compound.</p>
      </section>

      <form className="frosted-card planner-form" onSubmit={generate}>
        <div className="form-section">
          <div className="form-heading"><span className="form-step">01</span><div><h2>Set a sample amount</h2><p>Enter ₹1,000 to ₹10 crore. No money is invested.</p></div></div>
          <div className="amount-choices">
            {[10000, 50000, 100000, 500000].map((value) => <button className={`amount-chip ${Number(amount) === value ? 'active' : ''}`} type="button" key={value} onClick={() => setAmount(String(value))}>{currency(value)}</button>)}
          </div>
          <label className="amount-input-label">Sample starting amount <div className="amount-input"><span>₹</span><input min="1000" max="100000000" step="1000" type="number" value={amount} onChange={(event) => setAmount(event.target.value)} required /><span className="input-suffix">INR</span></div></label>
        </div>

        <div className="form-section">
          <div className="form-heading"><span className="form-step">02</span><div><h2>Pick an investment type</h2><p>Allocation only uses sample choices from this category.</p></div></div>
          <div className="choice-grid">
            {kinds.map((item) => <button type="button" className={`choice-card ${growthType === item.id ? 'active' : ''}`} key={item.id} onClick={() => setGrowthType(item.id)}><span className="choice-check">{growthType === item.id ? '✓' : '○'}</span><b>{item.title}</b><small>{item.note}</small></button>)}
          </div>
        </div>

        <div className="form-section">
          <div className="form-heading"><span className="form-step">03</span><div><h2>Choose your risk comfort</h2><p>There is no “best” answer. Be honest about how a fall might feel.</p></div></div>
          <div className="choice-grid risk-choice-grid">
            {comfortLevels.map((item) => <button type="button" className={`choice-card risk-choice ${riskTolerance === item.id ? 'active' : ''}`} key={item.id} onClick={() => setRiskTolerance(item.id)}><span className="choice-check">{riskTolerance === item.id ? '✓' : '○'}</span><b>{item.title}</b><small>{item.description}</small></button>)}
          </div>
        </div>

        {error && <div className="notice error-notice" role="alert">{error}</div>}
        <div className="submit-row"><p>Sample math only · No guaranteed growth · Not personal financial advice</p><button className="frosted-button primary" type="submit" disabled={busy}>{busy ? <><span className="button-spinner" /> Building your sample…</> : <>Build my sample allocation <span aria-hidden="true">→</span></>}</button></div>
      </form>

      {plan && (
        <section className="section-block page-enter" id="allocation-result">
          <div className="section-heading">
            <div><span className="eyebrow">YOUR EDUCATIONAL SAMPLE</span><h2>Here's one way to split {currency(plan.total)}</h2><p>Each sample choice is weighted by how closely its fictional risk score matches your selected comfort level.</p></div>
            {generated && <span className="saved-pill"><span className="pulse-dot" /> Generated</span>}
          </div>
          <div className="allocation-layout">
            <article className="frosted-card allocation-card">
              <div className="allocation-donut" style={{ '--allocation': `${plan.allocations[0]?.pct || 0}%` }}><div><strong>{currency(plan.total)}</strong><span>sample total</span></div></div>
              <div className="allocation-legend">{plan.allocations.map((item, index) => <div className="legend-row" key={item.id}><span className={`legend-dot legend-${index}`} /><span>{item.name}</span><b>{item.pct}%</b></div>)}</div>
              <p className="small-muted">This is an example allocation, not a recommendation to buy these assets.</p>
            </article>
            <div className="allocation-list">
              {plan.allocations.map((item, index) => <article className="frosted-card allocation-item" key={item.id} style={{ animationDelay: `${index * 90}ms` }}>
                <div className="allocation-item-top"><span className={`legend-dot legend-${index}`} /><div className="allocation-item-name"><b>{item.name}</b><small>{item.symbol} · sample risk {item.risk}/100</small></div><strong>{item.pct}%</strong></div>
                <div className="allocation-bar"><i className={`legend-fill-${index}`} style={{ width: `${item.pct}%` }} /></div>
                <div className="allocation-item-bottom"><b>{currency(item.amount)}</b><span>Sample score {item.score}/100</span></div>
                <p>{item.reason}</p>
              </article>)}
            </div>
          </div>
          <div className={`notice ${plan.riskFit === 'limited' ? 'warning-notice' : 'info-notice'}`}><b>Risk fit: {plan.riskFit === 'limited' ? 'limited for this investment type' : 'close to your selected comfort'}.</b> {plan.riskFitNote}</div>

          <div className="section-heading subsection-heading">
            <div><span className="eyebrow">COMPOUNDING SIMULATOR</span><h2>What if the sample return changes?</h2><p>Move the year selector to compare a lower, middle, and higher illustrative path.</p></div>
          </div>
          <article className="frosted-card projection-panel">
            <div className="year-tabs" role="tablist" aria-label="Choose projection horizon">{plan.projections.map((item) => <button role="tab" aria-selected={year === item.years} type="button" className={`year-tab ${year === item.years ? 'active' : ''}`} key={item.years} onClick={() => setYear(item.years)}>{item.years} {item.years === 1 ? 'year' : 'years'}</button>)}</div>
            {selectedProjection && <div className="projection-content">
              <div className="projection-summary"><span className="eyebrow">{year}-YEAR ILLUSTRATIVE SCENARIOS</span><h3>Starting at {currency(plan.total)}</h3><p>Middle sample path: <b>{currency(selectedProjection.expected)}</b></p><span className="projection-rate">Weighted sample annual return: {plan.expectedAnnualReturn}%</span></div>
              <div className="projection-graph" aria-label="Illustrative range comparison">
                {[{ label: 'Lower path', value: selectedProjection.lower, color: 'bar-lower' }, { label: 'Middle path', value: selectedProjection.expected, color: 'bar-middle' }, { label: 'Higher path', value: selectedProjection.upper, color: 'bar-upper' }].map((bar) => <div className="projection-bar-col" key={bar.label}><b>{currency(bar.value)}</b><div className={`projection-bar ${bar.color}`} style={{ height: `${Math.max(12, bar.value / maxBar * 150)}px` }} /><span>{bar.label}</span></div>)}
              </div>
            </div>}
            <div className="comparison-box">
              <div><span className="comparison-icon">↘</span><div><b>Why a wrong or concentrated pick can hurt</b><p>{plan.comparison.note}</p></div></div>
              <div className="comparison-numbers"><span>Broad sample allocation<strong>{currency(selectedProjection?.expected || 0)}</strong></span><span>Weakest sample pick + downside<strong className="negative">{currency(selectedProjection?.concentratedWrongPick || 0)}</strong></span></div>
            </div>
            <p className="small-muted">{plan.methodology} Scenario ranges do not include taxes, fees, inflation, or changes in circumstances. These are not forecasts.</p>
          </article>
          <div className="next-step-row"><Link className="frosted-button" to="/behaviour">Try the 10 decision scenarios <span aria-hidden="true">→</span></Link><Link className="text-link" to="/pre-decision">See the pre-decision guardrail ↗</Link></div>
          <div className="notice info-notice">{plan.dataNotice}</div>
        </section>
      )}
      <footer className="disclaimer-bar">Educational simulator only · The past does not guarantee future performance · Not investment advice.</footer>
    </main>
  )
}
