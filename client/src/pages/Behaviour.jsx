import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'

const TIMER_SECONDS = 12

export default function Behaviour() {
  const [scenarios, setScenarios] = useState([])
  const [started, setStarted] = useState(false)
  const [current, setCurrent] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS)
  const [answers, setAnswers] = useState([])
  const [response, setResponse] = useState(null)
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api('/behavioral/scenarios')
      .then((result) => setScenarios(result.scenarios))
      .catch((reason) => setError(reason.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!started || response || report) return undefined
    const timer = window.setInterval(() => setTimeLeft((previous) => Math.max(0, previous - 1)), 1000)
    return () => window.clearInterval(timer)
  }, [started, response, report, current])

  const finish = useCallback(async (finalAnswers) => {
    setSubmitting(true)
    setError('')
    try {
      const result = await api('/behavioral/analyze', { method: 'POST', body: JSON.stringify({ answers: finalAnswers }) })
      setReport(result)
      window.localStorage.setItem('behavioralProfile', JSON.stringify(result.traits))
    } catch (reason) {
      setError(reason.message)
    } finally {
      setSubmitting(false)
    }
  }, [])

  const respond = useCallback((choiceId) => {
    const scenario = scenarios[current]
    if (!scenario || response) return
    const choice = scenario.choices.find((item) => item.id === choiceId)
    const secondsUsed = TIMER_SECONDS - timeLeft
    const answer = { scenarioId: scenario.id, choice: choiceId, timeTaken: choiceId === 'timeout' ? TIMER_SECONDS : secondsUsed }
    const nextAnswers = [...answers, answer]
    setAnswers(nextAnswers)
    setResponse({
      label: choice?.label || 'Time ran out',
      insight: choice?.feedback || 'The timer expired before you chose. In real life, it is okay to pause rather than trade under pressure.',
      choice: choiceId
    })
  }, [answers, current, response, scenarios, timeLeft])

  useEffect(() => {
    if (started && !response && !report && timeLeft === 0) respond('timeout')
  }, [report, respond, response, started, timeLeft])

  const next = () => {
    if (current + 1 === scenarios.length) {
      finish(answers)
      return
    }
    setCurrent((value) => value + 1)
    setTimeLeft(TIMER_SECONDS)
    setResponse(null)
  }

  const reset = () => {
    setStarted(false)
    setCurrent(0)
    setTimeLeft(TIMER_SECONDS)
    setAnswers([])
    setResponse(null)
    setReport(null)
    setError('')
  }

  if (loading) return <main className="page-shell"><div className="frosted-card loading-card">Loading your scenario lab…</div></main>

  if (report) {
    const traits = Object.entries(report.traits).filter(([name]) => name !== 'impulsivity')
    return (
      <main className="page-shell page-enter">
        <section className="page-intro"><span className="eyebrow">03 / YOUR BEHAVIORAL FINGERPRINT</span><h1>Notice the pattern, <span>not a label.</span></h1><p>Your choices show where a little pause or extra information could help. This is a reflection tool, not a diagnosis or an investment-eligibility decision.</p></section>
        <section className="frosted-card report-hero">
          <div className="readiness-ring" style={{ '--score': `${report.readiness}%` }}><div><strong>{report.readiness}</strong><small>/100</small></div></div>
          <div className="report-intro"><span className="eyebrow">REFLECTION SCORE</span><h2>{report.investorType}</h2><p>{report.note}</p><div className="discipline-pill">Plan-led choices in this run: <b>{report.discipline}%</b></div></div>
        </section>
        <section className="section-block">
          <div className="section-heading"><div><span className="eyebrow">YOUR DECISION SIGNALS</span><h2>What showed up in your choices?</h2><p>Higher bias scores mean this pattern appeared more often in these fictional scenarios — not that you always behave this way.</p></div></div>
          <div className="trait-grid">{traits.map(([trait, score]) => <article className="frosted-card trait-card" key={trait}><div className="trait-top"><b>{trait.replace(/([A-Z])/g, ' $1').replace(/^./, (letter) => letter.toUpperCase())}</b><strong>{score}<small>/100</small></strong></div><div className="meter-track"><i style={{ width: `${score}%` }} /></div><p>{score >= 65 ? 'Worth watching when decisions feel rushed.' : score >= 35 ? 'A moderate signal to keep in mind.' : 'Not prominent in this set of answers.'}</p></article>)}</div>
        </section>
        <section className="section-block">
          <div className="section-heading"><div><span className="eyebrow">SCENARIO-BY-SCENARIO</span><h2>Your learning notes</h2></div></div>
          <div className="feedback-list">{report.feedback.map((item, index) => <article className="frosted-card feedback-row" key={item.scenarioId}><span className="feedback-index">0{index + 1}</span><div><b>{item.title}</b><small>Your choice: {item.choice}</small><p>{item.insight}</p></div></article>)}</div>
        </section>
        {error && <div className="notice error-notice" role="alert">{error} Your answers are still available; use Try again to submit a fresh run.</div>}
        <div className="next-step-row"><Link className="frosted-button primary" to="/pre-decision">See how the pre-decision pause works <span aria-hidden="true">→</span></Link><button className="frosted-button" type="button" onClick={reset}>Try the scenarios again</button></div>
        <footer className="disclaimer-bar">Fictional, timed educational scenarios · Not a psychological diagnosis · Not investment advice.</footer>
      </main>
    )
  }

  if (!started) return (
    <main className="page-shell page-enter">
      <section className="page-intro"><span className="eyebrow">03 / BEHAVIORAL FINGERPRINT LAB</span><h1>How do you decide <span>under pressure?</span></h1><p>Explore ten fictional market moments designed to surface common decision shortcuts — from crash fear and FOMO to anchoring and revenge trading.</p></section>
      <section className="frosted-card test-start-card">
        <div className="test-start-copy"><div className="big-number">10<span>×</span></div><div><span className="eyebrow">SIMULATED SCENARIOS</span><h2>A little pressure. A lot to learn.</h2><p>Each scenario has a 12-second timer, a sample alert, and a quick reflection. You can always pause; there is no right-personality score.</p></div></div>
        <div className="scenario-preview-grid">{scenarios.map((item, index) => <div key={item.id} className="scenario-preview"><span>0{index + 1}</span><b>{item.title}</b></div>)}</div>
        {error && <div className="notice error-notice" role="alert">{error}</div>}
        <div className="start-actions"><span className="small-muted">No real investments · No personal data required</span><button className="frosted-button primary" type="button" disabled={!scenarios.length} onClick={() => { setStarted(true); setTimeLeft(TIMER_SECONDS) }}>Start the 10 scenarios <span aria-hidden="true">→</span></button></div>
      </section>
      <div className="notice info-notice"><b>Why use a timer?</b> The countdown creates gentle simulated pressure so you can notice your first reaction. It is okay to let the timer expire; the simulator treats that as a cue to pause, not as a failure.</div>
    </main>
  )

  const scenario = scenarios[current]
  const timerPercent = Math.max(0, timeLeft / TIMER_SECONDS * 100)
  return (
    <main className="page-shell page-enter">
      <section className="quiz-topline">
        <div><span className="eyebrow">SCENARIO {String(current + 1).padStart(2, '0')} / {scenarios.length}</span><h1>{scenario.title}</h1></div>
        <div className={`timer-badge ${timeLeft <= 4 ? 'timer-warning' : ''}`} aria-label={`${timeLeft} seconds remaining`}><strong>{timeLeft}</strong><small>sec</small></div>
      </section>
      <div className="quiz-progress"><i style={{ width: `${(current + (response ? 1 : 0)) / scenarios.length * 100}%` }} /></div>
      <section className="quiz-layout">
        <article className="frosted-card scenario-card">
          <div className="alert-banner"><span className="alert-blink">●</span>{scenario.alert}</div>
          <p className="scenario-prompt">{scenario.prompt}</p>
          <div className="timer-track"><i className={timeLeft <= 4 ? 'timer-track-danger' : ''} style={{ width: `${timerPercent}%` }} /></div>
          <div className="quiz-options">
            {scenario.choices.map((choice, index) => <button className="quiz-option" disabled={Boolean(response)} type="button" onClick={() => respond(choice.id)} key={choice.id}><span>{String.fromCharCode(65 + index)}</span><b>{choice.label}</b><i aria-hidden="true">→</i></button>)}
          </div>
          <div className="quiz-footer-note"><span>⌁</span> This is a fictional exercise. Take a breath and choose what you would really do.</div>
          {response && <div className="answer-feedback page-enter"><span className="eyebrow">REFLECTION</span><h3>{response.choice === 'timeout' ? 'Time to pause' : `You chose: ${response.label}`}</h3><p>{response.insight}</p><button className="frosted-button primary" type="button" disabled={submitting} onClick={next}>{current + 1 === scenarios.length ? submitting ? 'Building your reflection…' : 'See my reflection' : 'Continue to next scenario'} <span aria-hidden="true">→</span></button></div>}
          {error && <div className="notice error-notice" role="alert">{error}</div>}
        </article>
        <aside className="frosted-card pressure-aside">
          <span className="eyebrow">PRESSURE METER</span>
          <div className="pressure-orb"><span className={timeLeft <= 4 ? 'orb-hot' : ''}>◌</span><b>{timeLeft <= 4 ? 'Time pressure' : timeLeft <= 8 ? 'A little urgency' : 'Take your time'}</b></div>
          <div className="mini-alert"><span className="pulse-dot" /><div><b>Market alert simulation</b><p>Alerts are deliberately dramatic. Verify before reacting in real life.</p></div></div>
          <div className="aside-tip"><b>Quick reset</b><p>Stop · breathe · check your goal · verify the source · then decide.</p></div>
          <button className="text-link pause-link" type="button" onClick={() => setTimeLeft(TIMER_SECONDS)}>Reset the timer ↻</button>
        </aside>
      </section>
      <footer className="disclaimer-bar">All scenarios use made-up assets, prices, news, and outcomes. No real-time market data is used.</footer>
    </main>
  )
}
