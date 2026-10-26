import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'

const sources = [
  { type: 'stocks', label: 'Company shares' },
  { type: 'mf', label: 'Mutual funds' },
  { type: 'index', label: 'Index funds' },
  { type: 'etf', label: 'ETFs' }
]
const currency = (value) => `₹${Number(value).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
const defaultProfile = { lossAversion: 50, herd: 50, impulsivity: 50 }

export default function PreDecision() {
  const [holdings, setHoldings] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [profile, setProfile] = useState(defaultProfile)
  const [amount, setAmount] = useState('5000')
  const [intervention, setIntervention] = useState(null)
  const [outcome, setOutcome] = useState(null)
  const [history, setHistory] = useState([])
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const selected = useMemo(() => holdings.find((item) => item.id === selectedId), [holdings, selectedId])

  useEffect(() => {
    let savedProfile = defaultProfile
    try {
      const parsed = JSON.parse(window.localStorage.getItem('behavioralProfile') || '{}')
      if (parsed && typeof parsed === 'object') savedProfile = { ...defaultProfile, ...parsed }
    } catch {
      setError('Your saved behavior profile could not be read. Using the neutral sample profile instead.')
    }
    setProfile(savedProfile)
    Promise.all([
      Promise.all(sources.map(async ({ type, label }) => {
        const result = await api(`/stocks/${type}`)
        return result.stocks.map((item) => ({ ...item, type, typeLabel: label }))
      })),
      api('/intervention/history')
    ]).then(([results, historyResult]) => {
      const list = results.flat()
      setHoldings(list)
      setSelectedId(list[0]?.id || '')
      setHistory(historyResult.events)
    }).catch((reason) => setError(reason.message)).finally(() => setLoading(false))
  }, [])

  async function checkDecision(action) {
    if (!selected) return
    setError('')
    setOutcome(null)
    setBusy(true)
    try {
      const result = await api('/intervention/check', {
        method: 'POST',
        body: JSON.stringify({
          action,
          stock: { ...selected, amount: Number(amount) },
          userProfile: profile
        })
      })
      setIntervention(result.nudge)
    } catch (reason) {
      setError(reason.message)
    } finally {
      setBusy(false)
    }
  }

  async function recordDecision(decision) {
    if (!intervention) return
    setBusy(true)
    setError('')
    try {
      const result = await api('/intervention/outcome', {
        method: 'POST',
        body: JSON.stringify({ decision, action: intervention.action, stockName: intervention.stockName, signal: intervention.signal })
      })
      setOutcome({ ...result, action: intervention.action, stockName: intervention.stockName, signal: intervention.signal })
      setIntervention(null)
      const updated = await api('/intervention/history')
      setHistory(updated.events)
    } catch (reason) {
      setError(reason.message)
    } finally {
      setBusy(false)
    }
  }

  const profileLevel = (value) => value >= 65 ? 'Higher' : value >= 35 ? 'Moderate' : 'Lower'

  if (loading) return <main className="page-shell"><div className="frosted-card loading-card">Loading sample holdings and your decision profile…</div></main>

  return (
    <main className="page-shell page-enter">
      <section className="page-intro">
        <span className="eyebrow">04 / PRE-DECISION PAUSE</span>
        <h1>Before you act, <span>make the risk visible.</span></h1>
        <p>Choose a sample asset and action. A transparent teaching model combines your scenario patterns, fictional asset risk, recent movement, and the sample historical path to prompt a pause.</p>
      </section>

      <section className="frosted-card profile-banner">
        <div className="profile-avatar">✦</div><div className="profile-copy"><span className="eyebrow">YOUR BEHAVIORAL FINGERPRINT</span><h2>{window.localStorage.getItem('behavioralProfile') ? 'Profile from your last scenario run' : 'Neutral starter profile'}</h2><p>{window.localStorage.getItem('behavioralProfile') ? 'Your last completed 10-scenario reflection is used to personalize the pause.' : 'Take the 10 scenarios to personalize this module. You can explore now with neutral sample values.'}</p></div>
        <div className="profile-traits">{[['Loss sensitivity', profile.lossAversion], ['Herd signal', profile.herd], ['Fast decisions', profile.impulsivity]].map(([name, value]) => <span className="trait-chip" key={name}><i className={profileLevel(value).toLowerCase()} />{name} <b>{profileLevel(value)}</b></span>)}</div>
        <Link className="text-link profile-link" to="/behaviour">Review scenarios ↗</Link>
      </section>

      {error && <div className="notice error-notice" role="alert">{error}</div>}

      <section className="section-block">
        <div className="section-heading"><div><span className="eyebrow">SET UP A SAMPLE DECISION</span><h2>What are you thinking of doing?</h2><p>Every listed holding, price, and market history here is fictional.</p></div><span className="step-mark">NO REAL TRADES</span></div>
        <label className="holding-select-label">Choose a sample holding<select value={selectedId} onChange={(event) => { setSelectedId(event.target.value); setOutcome(null) }}>{sources.map((source) => <optgroup label={source.label} key={source.type}>{holdings.filter((item) => item.type === source.type).map((item) => <option value={item.id} key={item.id}>{item.name} · sample score {item.score}/100</option>)}</optgroup>)}</select></label>
        {selected && <div className="decision-asset frosted-card">
          <div className="asset-emblem">{selected.symbol.slice(0, 1)}</div>
          <div className="decision-asset-main"><span className="eyebrow">{selected.typeLabel.toUpperCase()} · {selected.symbol}</span><h3>{selected.name}</h3><p>{selected.description}</p></div>
          <div className="decision-asset-price"><span>Sample price</span><b>{currency(selected.price)}</b><small className={selected.change >= 0 ? 'positive' : 'negative'}>{selected.change > 0 ? '+' : ''}{selected.change}% today</small></div>
        </div>}
        <div className="decision-controls frosted-card">
          <label>Amount to simulate<div className="amount-input"><span>₹</span><input type="number" min="100" max="10000000" step="100" value={amount} onChange={(event) => setAmount(event.target.value)} /><span className="input-suffix">SAMPLE</span></div></label>
          <div className="action-choice"><span className="eyebrow">CHOOSE A SIMULATED ACTION</span><div className="action-buttons"><button className="action-button action-buy" type="button" disabled={busy || !selected} onClick={() => checkDecision('BUY')}>↗ Buy</button><button className="action-button action-sell" type="button" disabled={busy || !selected} onClick={() => checkDecision('SELL')}>↘ Sell</button><button className="action-button action-hold" type="button" disabled={busy || !selected} onClick={() => checkDecision('HOLD')}>Ⅱ Hold</button></div></div>
          {busy && <span className="small-muted">Checking the sample signals…</span>}
        </div>
      </section>

      {outcome && <section className="frosted-card outcome-panel page-enter"><div className={`outcome-symbol ${outcome.scenario.change < 0 ? 'negative' : outcome.scenario.change > 0 ? 'positive' : ''}`}>{outcome.scenario.change < 0 ? '↘' : outcome.scenario.change > 0 ? '↗' : 'Ⅱ'}</div><div><span className="eyebrow">SIMULATION COMPLETE</span><h2>{outcome.scenario.label}</h2><p>{outcome.action} {outcome.stockName}: illustrative path {outcome.scenario.change > 0 ? '+' : ''}{outcome.scenario.change}% · Behavior signal {outcome.signal}/100</p><p className="small-muted">{outcome.note}</p></div><button type="button" className="icon-button" onClick={() => setOutcome(null)} aria-label="Dismiss simulation result">×</button></section>}

      <section className="section-block">
        <div className="section-heading"><div><span className="eyebrow">THE SIGNAL, EXPLAINED</span><h2>How this pause is calculated</h2><p>The score guides reflection. It is not a probability of regret or a prediction of loss.</p></div></div>
        <div className="model-grid">
          {[['Behavior pattern', '45%', 'Loss sensitivity, herd signal, and quick decisions from your saved 10-scenario profile.'], ['Market pressure', '20%', 'A small, bounded signal from the fictional daily price movement and selected action.'], ['Sample asset risk', '20%', 'The demo risk score assigned to this fictional asset.'], ['Historical path', '15%', 'The largest peak-to-trough drop in this fictional sample chart.']].map(([title, percent, description], index) => <article className="frosted-card model-card" key={title}><span className="model-index">0{index + 1}</span><b>{title}<em>{percent}</em></b><p>{description}</p></article>)}
        </div>
      </section>

      {intervention && (
        <div className="modal-backdrop" role="presentation">
          <section className="frosted-card nudge-modal page-enter" role="dialog" aria-modal="true" aria-labelledby="nudge-title">
            <button className="icon-button modal-close" type="button" onClick={() => setIntervention(null)} aria-label="Close decision pause">×</button>
            <div className="nudge-heading"><div className={`nudge-meter nudge-${intervention.level.toLowerCase()}`} style={{ '--score': `${intervention.signal}%` }}><span>{intervention.signal}</span><small>/100</small></div><div><span className="eyebrow">BEFORE YOU DECIDE · {intervention.action}</span><h2 id="nudge-title">{intervention.level} pause signal</h2><p>{intervention.warning}</p></div></div>
            <div className="signal-label">Behavioral and market-pressure signal <b>{intervention.signal}/100</b></div>
            <div className="signal-track"><i className={`signal-fill-${intervention.level.toLowerCase()}`} style={{ width: `${intervention.signal}%` }} /></div>
            <div className="signal-breakdown">{Object.entries(intervention.components).map(([name, value]) => <div className="signal-row" key={name}><span>{name.replace(/([A-Z])/g, ' $1').replace(/^./, (letter) => letter.toUpperCase())}</span><b>{value} pts</b></div>)}</div>
            <div className="nudge-reasons"><b>Why did this appear?</b>{intervention.reasons.map((reason) => <p key={reason}>• {reason}</p>)}</div>
            <div className="nudge-reminder"><b>Try a 10-second reset</b><p>What was my original goal? Is this information verified? Could I choose a smaller amount or wait?</p></div>
            <div className="nudge-actions"><button className="frosted-button" type="button" disabled={busy} onClick={() => recordDecision('Review')}>Pause and review</button><button className="frosted-button" type="button" disabled={busy} onClick={() => recordDecision('Reduce')}>Reduce sample amount</button><button className="frosted-button primary" type="button" disabled={busy} onClick={() => recordDecision('Proceed')}>Continue the simulation</button></div>
            <p className="small-muted">{intervention.note}</p>
          </section>
        </div>
      )}

      <section className="section-block">
        <div className="section-heading"><div><span className="eyebrow">YOUR SIMULATION LOG</span><h2>Recent decisions in this session</h2><p>Actions are kept in server memory for this demo and clear when the backend restarts.</p></div></div>
        {history.length ? <div className="history-table frosted-card"><div className="history-header"><span>Holding / action</span><span>Signal</span><span>Choice</span><span>Simulation</span></div>{history.map((event) => <div className="history-row" key={event.id}><span><b>{event.action} · {event.stockName}</b><small>{new Date(event.time).toLocaleString()}</small></span><strong>{event.signal}/100</strong><span>{event.decision}</span><span>{event.outcome}</span></div>)}</div> : <div className="frosted-card empty-state">No decisions yet. Choose a sample holding above to start a reflection.</div>}
      </section>
      <div className="next-step-row"><Link className="frosted-button" to="/budget">Back to the portfolio lab ↗</Link><Link className="text-link" to="/">Explore investment types ↗</Link></div>
      <footer className="disclaimer-bar">This intervention is a transparent classroom model, not personalized financial advice or an actual probability of loss.</footer>
    </main>
  )
}
