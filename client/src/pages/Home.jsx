import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'

const money = (value) => `₹${Number(value).toLocaleString('en-IN')}`

function MiniChart({ values, large = false }) {
  const points = values.map((value, index) => {
    const min = Math.min(...values)
    const max = Math.max(...values)
    const x = 4 + index * (92 / Math.max(1, values.length - 1))
    const y = 40 - ((value - min) / Math.max(1, max - min)) * 32
    return `${x},${y}`
  }).join(' ')
  return (
    <svg className={large ? 'mini-chart mini-chart-large' : 'mini-chart'} viewBox="0 0 100 44" role="img" aria-label="Illustrative sample price history">
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Home() {
  const [types, setTypes] = useState([])
  const [type, setType] = useState(null)
  const [market, setMarket] = useState([])
  const [active, setActive] = useState(null)
  const [investStep, setInvestStep] = useState(0)
  const [query, setQuery] = useState('')
  const [loadingTypes, setLoadingTypes] = useState(true)
  const [loadingStocks, setLoadingStocks] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api('/growth-types')
      .then(setTypes)
      .catch((reason) => setError(reason.message))
      .finally(() => setLoadingTypes(false))
  }, [])

  async function chooseType(item) {
    setType(item)
    setActive(null)
    setInvestStep(0)
    setQuery('')
    setError('')
    setLoadingStocks(true)
    try {
      const result = await api(`/stocks/${item.id}`)
      setMarket(result.stocks)
    } catch (reason) {
      setError(reason.message)
      setMarket([])
    } finally {
      setLoadingStocks(false)
    }
  }

  const visible = useMemo(() => market.filter((item) => `${item.name} ${item.symbol} ${item.sector}`.toLowerCase().includes(query.toLowerCase())), [market, query])

  return (
    <main className="page-shell page-enter">
      <section className="hero-panel frosted-card">
        <div className="hero-copy">
          <span className="eyebrow"><span className="pulse-dot" /> YOUR FRIENDLY GUIDE TO INVESTING</span>
          <h1>Understand the investment <span>before the decision.</span></h1>
          <p>Explore how four types of investments work, what can move their value, and how to think through risk — with a transparent, fictional market simulator.</p>
          <div className="hero-actions">
            <a className="frosted-button primary" href="#explore">Explore the four types <span aria-hidden="true">↓</span></a>
            <Link className="frosted-button" to="/budget">Try a sample portfolio <span aria-hidden="true">↗</span></Link>
          </div>
          <p className="hero-footnote">A learning tool, not investing advice. All prices and performance shown here are made-up sample data.</p>
        </div>
        <div className="hero-visual" aria-label="Illustration of a sample investment portfolio">
          <div className="orbit orbit-one" /><div className="orbit orbit-two" />
          <div className="orbit-core"><span>✦</span><b>Learn<br />by exploring</b><small>NO REAL MONEY</small></div>
          <div className="float-chip chip-top">↗ <b>4 ways</b> to invest</div>
          <div className="float-chip chip-bottom"><span className="pulse-dot" /> fictional market data</div>
        </div>
      </section>

      <section className="section-block" id="explore">
        <div className="section-heading">
          <div><span className="eyebrow">START WITH THE BASICS</span><h2>Four ways to invest</h2><p>Choose a card to see how that investment works and explore sample holdings.</p></div>
          <span className="step-mark">01 / 04</span>
        </div>
        {error && <div className="notice error-notice" role="alert">{error}</div>}
        {loadingTypes ? <div className="frosted-card loading-card">Preparing your investment guide…</div> : (
          <div className="type-grid">
            {types.map((item, index) => (
              <button key={item.id} type="button" className={`type-card frosted-card ${type?.id === item.id ? 'selected' : ''}`} onClick={() => chooseType(item)}>
                <span className={`type-icon type-icon-${item.id}`}>{item.icon}</span>
                <span className="type-number">0{index + 1}</span>
                <span className="type-title">{item.title}</span>
                <span className="type-description">{item.description}</span>
                <span className="type-risk">Risk: {item.risk}</span>
                <span className="text-link">{type?.id === item.id ? 'Selected' : 'Explore this type'} <span aria-hidden="true">→</span></span>
              </button>
            ))}
          </div>
        )}
      </section>

      {type && (
        <section className="section-block page-enter">
          <div className="learning-grid">
            <article className="frosted-card explainer-card">
              <span className="eyebrow">HOW IT WORKS</span>
              <h2>{type.title}, made simple</h2>
              <p>{type.howItWorks}</p>
              <div className="beginner-tip"><span className="tip-icon">✦</span><div><b>Beginner tip</b><p>{type.beginnerTip}</p></div></div>
              <div className="invest-steps" aria-label="General educational steps">
                {type.steps.map((step, index) => <button type="button" className={`invest-step ${investStep === index ? 'invest-step-active' : ''}`} aria-current={investStep === index ? 'step' : undefined} onClick={() => setInvestStep(index)} key={step.title}><span>{String(index + 1).padStart(2, '0')}</span><b>{step.title}</b></button>)}
              </div>
              <div className="invest-step-detail" key={investStep}><span>STEP {String(investStep + 1).padStart(2, '0')}</span><p>{type.steps[investStep].detail}</p></div>
              <p className="small-muted">General education only. Account rules vary by market; no account, broker, or real transaction is connected.</p>
            </article>
            <article className="frosted-card score-card">
              <span className="eyebrow">HOW THE SAMPLE RANKING WORKS</span>
              <h3>Three signals. One explainable score.</h3>
              <div className="score-row"><span>Historical pattern</span><b>40%</b><div><i style={{ width: '40%' }} /></div></div>
              <div className="score-row"><span>Financial summary</span><b>35%</b><div><i style={{ width: '35%' }} /></div></div>
              <div className="score-row"><span>News sentiment</span><b>25%</b><div><i style={{ width: '25%' }} /></div></div>
              <p className="small-muted">This transparent toy model ranks fictional sample data. A high score is not a buy recommendation.</p>
            </article>
          </div>

          <div className="section-heading subsection-heading">
            <div><span className="eyebrow">SAMPLE MARKET · RANKED BY EXPLAINABLE SCORE</span><h2>Explore {type.title.toLowerCase()}</h2><p>Open any card to see its score, sample headlines, and what could go wrong.</p></div>
            <label className="search-box"><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search sample holdings" aria-label="Search sample holdings" /></label>
          </div>
          {loadingStocks ? <div className="frosted-card loading-card">Loading sample holdings…</div> : (
            <div className="holding-grid">
              {visible.map((item, index) => (
                <button type="button" key={item.id} className={`holding-card frosted-card ${active?.id === item.id ? 'selected' : ''}`} onClick={() => setActive(active?.id === item.id ? null : item)}>
                  <div className="holding-head"><span className="rank-pill">#{index + 1} sample rank</span><span className={item.change >= 0 ? 'positive' : 'negative'}>{item.change > 0 ? '+' : ''}{item.change}% today</span></div>
                  <div className="holding-name"><div><h3>{item.name}</h3><span>{item.symbol} · {item.sector}</span></div><div className="score-bubble">{item.score}<small>/100</small></div></div>
                  <div className="holding-chart"><MiniChart values={item.history} /><span>{money(item.price)}</span></div>
                  <div className="holding-footer"><span>Sample confidence: {item.confidence}%</span><span className="text-link">Why this score? ↗</span></div>
                </button>
              ))}
              {!visible.length && <div className="frosted-card empty-state">No sample holdings match “{query}”. Try another name or symbol.</div>}
            </div>
          )}

          {active && (
            <article className="frosted-card detail-panel page-enter">
              <div className="detail-top">
                <div><span className="eyebrow">EXPLAINABLE SAMPLE PROFILE</span><h2>{active.name} <span className="symbol-label">{active.symbol}</span></h2><p>{active.description}</p></div>
                <button type="button" className="icon-button" onClick={() => setActive(null)} aria-label="Close holding details">×</button>
              </div>
              <div className="detail-columns">
                <div className="detail-chart-card"><div className="detail-chart-title"><b>Illustrative 12-period history</b><span>Indexed starting value = 100</span></div><MiniChart values={active.history} large /><p className="small-muted">A made-up visual pattern — not actual historical market data or a return forecast.</p></div>
                <div className="reason-list">
                  <h3>Why this score?</h3>
                  {active.reasons.map((reason) => <div className="reason-item" key={reason.label}><div className="reason-head"><b>{reason.label}</b><strong>{reason.value}/100 <small>× {reason.weight}%</small></strong></div><div className="meter-track"><i style={{ width: `${reason.value}%` }} /></div><p>{reason.detail}</p></div>)}
                  <div className="model-formula">{active.modelNote}<br />Sample risk: {active.risk}/100 · Volatility label: {active.volatility} · Sample 1-year return: {active.annualReturn}%</div>
                </div>
              </div>
              <div className="news-strip"><span className="eyebrow">FICTIONAL HEADLINE SIGNALS</span><div>{active.news.map((story) => <span className={`news-chip sentiment-${story.sentiment.toLowerCase()}`} key={story.title}><b>{story.sentiment}</b> · {story.title}</span>)}</div></div>
              <div className="risk-callout"><b>What could go wrong?</b><span>Sample prices can fall, past patterns can reverse, and a financial or news score can miss important facts. Diversification does not remove market risk.</span></div>
            </article>
          )}
        </section>
      )}

      <section className="closing-cta frosted-card">
        <div><span className="eyebrow">YOUR NEXT STEP</span><h2>Build a portfolio, then stress-test your decisions.</h2><p>Choose a sample amount and comfort level, explore risk scenarios, and learn how emotional shortcuts can affect decisions.</p></div>
        <div className="cta-buttons"><Link className="frosted-button primary" to="/budget">Plan a sample portfolio <span aria-hidden="true">→</span></Link><Link className="frosted-button" to="/behaviour">Try the 10 scenarios</Link></div>
      </section>
      <footer className="disclaimer-bar">Educational simulator only · All market data is fictional · Not investment, tax, or legal advice.</footer>
    </main>
  )
}
