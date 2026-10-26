import express from 'express'
import cors from 'cors'

const app = express()
const PORT = Number(process.env.PORT) || 5000

app.use(cors())
app.use(express.json({ limit: '32kb' }))

const growthTypes = [
  { id: 'stocks', title: 'Individual stocks', risk: 'Higher', icon: '◈', description: 'A small ownership share in one company. Your result depends on that business.', howItWorks: 'You buy shares through an exchange. Prices move with company results, expectations, and market news.', beginnerTip: 'Start by learning what the company sells and how it earns money. One company is not a diversified portfolio.', steps: [{ title: 'Learn the business', detail: 'Understand what the company sells, who its customers are, and what could affect its income.' }, { title: 'Compare risk', detail: 'Look beyond a past price: consider business health, valuation, volatility, and how one holding affects diversification.' }, { title: 'Learn order basics', detail: 'Before any real trade, learn how orders work and check the broker, exchange, and transaction costs.' }, { title: 'Review your plan', detail: 'Track whether the holding still fits your goal. Do not let one headline replace your plan.' }] },
  { id: 'mf', title: 'Mutual funds', risk: 'Varies by fund', icon: '◉', description: 'A pooled investment managed according to a published fund strategy.', howItWorks: 'Many investors contribute to a pool. A fund manager follows the fund mandate; units are generally priced at a daily NAV.', beginnerTip: 'Check the mandate, costs, risk label, and exit rules. “Professionally managed” does not mean guaranteed.', steps: [{ title: 'Read the fund objective', detail: 'Check the official fund documents to understand the mandate, asset mix, and who manages the fund.' }, { title: 'Compare costs and risk', detail: 'Review the risk label, expense ratio, exit load, and whether the fund fits the type of assets you want to learn about.' }, { title: 'Understand units and NAV', detail: 'Learn when a transaction is priced and how units are allotted or redeemed before making any real decision.' }, { title: 'Review periodically', detail: 'Compare the fund with its stated objective and your own goals, not just a recent return chart.' }] },
  { id: 'index', title: 'Index funds', risk: 'Market-linked', icon: '⌗', description: 'A fund designed to follow a published market index rather than pick winners.', howItWorks: 'The fund holds a basket intended to track an index. Returns can differ slightly because of fees and tracking error.', beginnerTip: 'Broad diversification can reduce single-company risk, but the whole market can still fall.', steps: [{ title: 'Choose an index to learn', detail: 'Understand which companies or bonds the index includes and how its rules decide what is held.' }, { title: 'Compare tracking and fees', detail: 'Check the fund’s costs and tracking difference to see how closely it has followed its index.' }, { title: 'Understand fund pricing', detail: 'Learn how an index fund transaction is placed and how its NAV is calculated.' }, { title: 'Remember market risk', detail: 'An index fund can fall when the market it follows falls; diversification does not guarantee a profit.' }] },
  { id: 'etf', title: 'ETFs', risk: 'Varies by ETF', icon: '▦', description: 'A basket of assets that trades on an exchange during market hours.', howItWorks: 'You buy and sell ETF units through a broker like shares. Market price may differ a little from the underlying value.', beginnerTip: 'Look at the ETF holdings, trading liquidity, bid–ask spread, and ongoing costs.', steps: [{ title: 'Check the holdings', detail: 'Find out whether the ETF tracks shares, bonds, gold, or another asset, and review what is inside the basket.' }, { title: 'Compare price and NAV', detail: 'Learn how an ETF market price can differ from its underlying value and why liquidity matters.' }, { title: 'Learn exchange orders', detail: 'Understand order types, market hours, bid–ask spreads, and all transaction costs before any real order.' }, { title: 'Review the exposure', detail: 'Check the ETF still matches your learning goal. A narrow sector or commodity ETF may not be broadly diversified.' }] }
]

const stocks = {
  stocks: [
    { id: 'infy', name: 'Infosys', symbol: 'INFY', price: 1542, change: 1.2, sector: 'Technology', historyScore: 76, financialScore: 82, sentiment: 68, annualReturn: 11.4, risk: 61, pe: 25, volatility: 'Medium', description: 'A global IT services company working with businesses on consulting and digital services.', news: [{ title: 'Quarterly results in line with expectations', sentiment: 'Neutral' }, { title: 'New digital transformation contract announced', sentiment: 'Positive' }], history: [100, 103, 101, 108, 106, 111, 109, 116, 113, 120, 117, 124] },
    { id: 'tcs', name: 'Tata Consultancy Services', symbol: 'TCS', price: 3420, change: 0.6, sector: 'Technology', historyScore: 81, financialScore: 86, sentiment: 73, annualReturn: 12.2, risk: 52, pe: 29, volatility: 'Medium-low', description: 'A large IT services and consulting company with clients across multiple industries.', news: [{ title: 'Large deal wins support the order book', sentiment: 'Positive' }, { title: 'Currency movements remain a watch item', sentiment: 'Neutral' }], history: [100, 102, 105, 104, 108, 110, 109, 114, 113, 118, 120, 125] },
    { id: 'reliance', name: 'Reliance Industries', symbol: 'RELIANCE', price: 2850, change: -0.4, sector: 'Energy & retail', historyScore: 70, financialScore: 78, sentiment: 56, annualReturn: 9.1, risk: 68, pe: 27, volatility: 'Medium-high', description: 'A diversified group spanning energy, retail, telecom, and digital services.', news: [{ title: 'Retail expansion plans draw analyst attention', sentiment: 'Positive' }, { title: 'Energy segment faces changing commodity prices', sentiment: 'Negative' }], history: [100, 105, 102, 109, 107, 114, 112, 117, 115, 121, 119, 123] }
  ],
  mf: [
    { id: 'flexi', name: 'Flexi-cap fund (sample)', symbol: 'FLEXI', price: 82.45, change: 0.5, sector: 'Diversified equity', historyScore: 74, financialScore: 72, sentiment: 66, annualReturn: 10.1, risk: 58, pe: null, volatility: 'Medium-high', description: 'A fictional diversified equity fund that can hold companies across market sizes.', news: [{ title: 'Portfolio remains diversified across sectors', sentiment: 'Neutral' }], history: [100, 104, 102, 107, 110, 108, 113, 112, 118, 116, 121, 126] },
    { id: 'largecap', name: 'Large-cap fund (sample)', symbol: 'LARGECAP', price: 72.1, change: 0.3, sector: 'Large-cap equity', historyScore: 78, financialScore: 75, sentiment: 70, annualReturn: 9.3, risk: 49, pe: null, volatility: 'Medium', description: 'A fictional fund focused mainly on larger, established companies.', news: [{ title: 'Large-company earnings are mixed this quarter', sentiment: 'Neutral' }], history: [100, 102, 105, 104, 108, 111, 109, 114, 117, 116, 120, 124] },
    { id: 'smallcap', name: 'Small-cap fund (sample)', symbol: 'SMALLCAP', price: 145.2, change: 1.1, sector: 'Small-cap equity', historyScore: 62, financialScore: 69, sentiment: 59, annualReturn: 13.2, risk: 82, pe: null, volatility: 'High', description: 'A fictional small-company fund; smaller companies can have larger price swings.', news: [{ title: 'Small-company earnings outlook remains uncertain', sentiment: 'Negative' }], history: [100, 108, 104, 115, 112, 121, 116, 128, 122, 135, 130, 143] }
  ],
  index: [
    { id: 'broad50', name: 'Broad market 50 index fund (sample)', symbol: 'BROAD50', price: 45.2, change: 0.4, sector: 'Broad-market index', historyScore: 80, financialScore: 74, sentiment: 69, annualReturn: 10.4, risk: 45, pe: null, volatility: 'Medium', description: 'A fictional low-cost fund tracking a broad basket of 50 large companies.', news: [{ title: 'Index breadth improves as more sectors participate', sentiment: 'Positive' }], history: [100, 103, 105, 104, 108, 111, 109, 114, 116, 115, 120, 125] },
    { id: 'next50', name: 'Next 50 index fund (sample)', symbol: 'NEXT50', price: 38.4, change: -0.2, sector: 'Next 50 index', historyScore: 68, financialScore: 70, sentiment: 61, annualReturn: 11.8, risk: 65, pe: null, volatility: 'Medium-high', description: 'A fictional fund tracking companies just beyond the largest 50.', news: [{ title: 'Mid-sized companies show uneven earnings', sentiment: 'Neutral' }], history: [100, 105, 102, 110, 108, 117, 113, 121, 118, 127, 123, 132] },
    { id: 'bondindex', name: 'Short-duration bond index fund (sample)', symbol: 'BOND', price: 101.8, change: 0.1, sector: 'Fixed income index', historyScore: 73, financialScore: 77, sentiment: 72, annualReturn: 6.1, risk: 23, pe: null, volatility: 'Lower', description: 'A fictional bond index fund. Interest-rate and credit risks still apply.', news: [{ title: 'Short-term rates remain steady in this sample', sentiment: 'Neutral' }], history: [100, 101, 101, 102, 102, 103, 103, 104, 104, 105, 106, 107] }
  ],
  etf: [
    { id: 'marketetf', name: 'Broad market ETF (sample)', symbol: 'MKTETF', price: 242, change: 0.7, sector: 'Broad-market ETF', historyScore: 79, financialScore: 73, sentiment: 68, annualReturn: 10.2, risk: 46, pe: null, volatility: 'Medium', description: 'A fictional exchange-traded basket designed to follow a broad market index.', news: [{ title: 'ETF trading activity remains steady', sentiment: 'Neutral' }], history: [100, 102, 105, 104, 109, 110, 108, 115, 114, 119, 121, 125] },
    { id: 'goldetf', name: 'Gold ETF (sample)', symbol: 'GOLDETF', price: 52, change: 0.3, sector: 'Commodity ETF', historyScore: 72, financialScore: 70, sentiment: 74, annualReturn: 7.4, risk: 34, pe: null, volatility: 'Medium-low', description: 'A fictional ETF tracking gold. Gold prices can also fall and do not produce business earnings.', news: [{ title: 'Gold demand rises as investors seek diversification', sentiment: 'Positive' }], history: [100, 101, 103, 102, 106, 105, 109, 108, 112, 113, 115, 118] },
    { id: 'banketf', name: 'Bank sector ETF (sample)', symbol: 'BANKETF', price: 485, change: -0.1, sector: 'Financials ETF', historyScore: 71, financialScore: 76, sentiment: 60, annualReturn: 9.6, risk: 62, pe: null, volatility: 'Medium-high', description: 'A fictional ETF holding a basket of financial companies; concentrated in one sector.', news: [{ title: 'Loan growth is positive; credit quality is monitored', sentiment: 'Neutral' }], history: [100, 104, 102, 108, 107, 114, 112, 118, 116, 122, 120, 126] }
  ]
}

const scenarios = [
  { id: 'profit-trap', title: 'The early-profit trap', alert: 'PRICE ALERT · +7% in two days', prompt: 'A holding is up quickly. A chat group says “sell before it disappears.” What do you do?', choices: [{ id: 'sell', label: 'Sell everything now', scores: { patience: 25, lossAversion: 65, herd: 55 }, feedback: 'A fast exit can lock in a gain, but the chat message alone is not a plan.' }, { id: 'review', label: 'Check my goal and review the facts', scores: { patience: 85, riskManagement: 85 }, feedback: 'A written goal and evidence-based review help separate a plan from excitement.' }, { id: 'add', label: 'Buy more before it rises further', scores: { greed: 80, overconfidence: 65 }, feedback: 'Adding because of a recent rise can increase concentration and FOMO risk.' }] },
  { id: 'crash-panic', title: 'The sudden market drop', alert: 'BREAKING · MARKET DOWN 20%', prompt: 'Your sample portfolio falls sharply in one day. Headlines predict more losses. What is your first response?', choices: [{ id: 'panic-sell', label: 'Sell immediately to stop the fear', scores: { lossAversion: 90, patience: 20 }, feedback: 'A panic sale makes a temporary drop a realized loss; revisit your time horizon and emergency needs.' }, { id: 'pause-plan', label: 'Pause, check my plan and time horizon', scores: { patience: 85, riskManagement: 80 }, feedback: 'Pausing before acting is a useful way to reduce stress-driven decisions.' }, { id: 'double-down', label: 'Borrow money to buy the dip', scores: { overconfidence: 90, riskManagement: 15, greed: 55 }, feedback: 'Borrowing to buy a falling asset can magnify losses. Avoid leverage in this simulation.' }] },
  { id: 'fomo-rush', title: 'Everyone is buying', alert: 'SOCIAL FEED · “THIS WILL 10×”', prompt: 'A fictional stock jumps 45% in three days and your friends are celebrating. What next?', choices: [{ id: 'chase', label: 'Buy now so I do not miss out', scores: { herd: 90, greed: 70 }, feedback: 'Popularity is not evidence of value; chasing a sharp move can expose you to a reversal.' }, { id: 'research', label: 'Check the business, valuation, and risks', scores: { riskManagement: 80, newsSkepticism: 85 }, feedback: 'Independent research helps counter social proof and headline pressure.' }, { id: 'small', label: 'If suitable, limit it to a planned small amount', scores: { riskManagement: 75, patience: 65 }, feedback: 'Position limits can keep one uncertain idea from dominating a portfolio.' }] },
  { id: 'revenge-trade', title: 'The urge to win it back', alert: 'PORTFOLIO ALERT · LOSS RECORDED', prompt: 'You have just lost a simulated ₹5,000. Another “opportunity” appears. How do you respond?', choices: [{ id: 'revenge', label: 'Make a much larger trade to recover it', scores: { recency: 85, greed: 75, riskManagement: 15 }, feedback: 'A larger trade after a loss is revenge trading; the previous loss does not make a win more likely.' }, { id: 'stop', label: 'Take a break and review my limits', scores: { riskManagement: 90, patience: 85 }, feedback: 'A break and preset limits can prevent one loss from driving another decision.' }, { id: 'same-size', label: 'Only consider my usual planned amount', scores: { riskManagement: 75, patience: 65 }, feedback: 'Keeping to a pre-set size avoids escalating risk to recover a loss.' }] },
  { id: 'anchoring', title: 'The old price anchor', alert: 'PRICE CHECK · BELOW LAST MONTH’S HIGH', prompt: 'A share was ₹2,000 last month and is now ₹1,542. Is it automatically a bargain?', choices: [{ id: 'cheap', label: 'Yes, it must go back to ₹2,000', scores: { anchoring: 90, overconfidence: 60 }, feedback: 'A past price is not a measure of fair value. Business facts may have changed.' }, { id: 'analyze', label: 'Review current fundamentals and risks', scores: { newsSkepticism: 85, riskManagement: 75 }, feedback: 'Current information matters more than a remembered price.' }, { id: 'wait', label: 'Wait until I understand why it fell', scores: { patience: 85, riskManagement: 70 }, feedback: 'Waiting for clarity is a valid choice when you do not understand the move.' }] },
  { id: 'dividend-illusion', title: 'The dividend illusion', alert: 'FUND NOTICE · HIGH DISTRIBUTION', prompt: 'A fund advertises a large distribution, but its unit price fell by a similar amount. What do you check?', choices: [{ id: 'yield', label: 'Buy because the payout looks like free money', scores: { overconfidence: 65, newsSkepticism: 20 }, feedback: 'A distribution is not automatically extra return; the NAV and total return matter.' }, { id: 'total-return', label: 'Compare total return, costs, and fund mandate', scores: { newsSkepticism: 90, riskManagement: 80 }, feedback: 'Looking at total return and costs gives a fuller picture than the payout alone.' }, { id: 'skip', label: 'Skip it until I understand the payout', scores: { patience: 80, riskManagement: 70 }, feedback: 'Taking time to understand an unfamiliar product can reduce avoidable mistakes.' }] },
  { id: 'stop-loss', title: 'The stop-loss dilemma', alert: 'PRICE ALERT · NEAR YOUR PRESET LIMIT', prompt: 'An ETF reaches a price level you set before buying. Your emotions say “move the limit lower.” What do you do?', choices: [{ id: 'move', label: 'Move the limit lower so I can avoid a loss', scores: { lossAversion: 80, riskManagement: 25 }, feedback: 'Changing a rule under pressure can turn a risk limit into a hope-based decision.' }, { id: 'follow', label: 'Review the original reason and follow my plan', scores: { riskManagement: 90, patience: 75 }, feedback: 'A pre-committed plan is most useful when it is uncomfortable to follow.' }, { id: 'reassess', label: 'Pause and reassess only using new facts', scores: { riskManagement: 75, newsSkepticism: 75 }, feedback: 'A reasoned reassessment is different from moving a limit just to avoid discomfort.' }] },
  { id: 'profit-hold', title: 'Profit, target, and patience', alert: 'PORTFOLIO ALERT · TARGET REACHED', prompt: 'A holding has reached the target you chose earlier. Social media says it will double again. What now?', choices: [{ id: 'hold-all', label: 'Ignore my target and hold everything', scores: { herd: 55, greed: 75 }, feedback: 'Changing a target because of a hot tip can make a plan drift.' }, { id: 'review-target', label: 'Review the target and rebalance by my plan', scores: { riskManagement: 85, patience: 75 }, feedback: 'Reviewing against a written plan can preserve discipline without reacting to noise.' }, { id: 'sell-all', label: 'Sell everything immediately', scores: { lossAversion: 60, patience: 30 }, feedback: 'An all-or-nothing decision may not match your goals; consider your original plan.' }] },
  { id: 'news-panic', title: 'Breaking news and uncertainty', alert: 'URGENT · UNVERIFIED CEO RUMOUR', prompt: 'A message claims a company executive resigned and the price drops 8%. The source is unknown. What next?', choices: [{ id: 'forward-sell', label: 'Sell and forward the message quickly', scores: { herd: 75, newsSkepticism: 15, lossAversion: 70 }, feedback: 'Unverified messages can spread quickly; verify before acting or forwarding.' }, { id: 'verify', label: 'Check reliable sources and official disclosures', scores: { newsSkepticism: 95, riskManagement: 80 }, feedback: 'Verifying a source is a strong first step when a headline is urgent and unconfirmed.' }, { id: 'ignore', label: 'Ignore all news and never review the holding', scores: { patience: 60, riskManagement: 35 }, feedback: 'Avoiding panic is helpful, but important verified facts still deserve review.' }] },
  { id: 'long-horizon', title: 'Short-term noise, long-term goal', alert: 'PERFORMANCE ALERT · 1 YEAR BELOW EXPECTATION', prompt: 'A diversified sample index fund is down over one year but your goal is five years away. What do you consider?', choices: [{ id: 'exit', label: 'Exit because one year was disappointing', scores: { lossAversion: 80, patience: 20, recency: 75 }, feedback: 'One period does not define a long-term outcome; check whether your goal or circumstances changed.' }, { id: 'horizon', label: 'Compare the risk with my goal and time horizon', scores: { patience: 90, riskManagement: 85 }, feedback: 'Matching risk to a goal and reviewing a longer period is more useful than reacting to one year.' }, { id: 'all-in', label: 'Put all my savings into it to make up for the loss', scores: { overconfidence: 85, riskManagement: 10, recency: 60 }, feedback: 'Concentrating all savings can create serious liquidity and loss risk.' }] }
]

const interventionHistory = []

function scoreStock(stock) {
  const score = Math.round(stock.historyScore * 0.4 + stock.financialScore * 0.35 + stock.sentiment * 0.25)
  return {
    ...stock,
    score,
    confidence: Math.max(35, Math.min(95, Math.round(score * 0.78 + (100 - stock.risk) * 0.22))),
    reasons: [
      { label: 'Historical pattern', value: stock.historyScore, weight: 40, detail: 'A simplified sample of past price behavior, not a prediction.' },
      { label: 'Financial health', value: stock.financialScore, weight: 35, detail: 'A fictional summary score for business and fund fundamentals.' },
      { label: 'News sentiment', value: stock.sentiment, weight: 25, detail: 'A toy positive/neutral/negative headline signal.' }
    ],
    modelNote: 'Illustrative score = 40% historical pattern + 35% financial summary + 25% sample news sentiment.'
  }
}

function error(res, status, message) {
  return res.status(status).json({ error: message })
}

app.get('/api/health', (_req, res) => res.json({ status: 'ok', modules: ['explore', 'allocation', 'behavior', 'intervention'], dataMode: 'fictional educational sample data' }))
app.get('/api/growth-types', (_req, res) => res.json(growthTypes))

app.get('/api/stocks/:type', (req, res) => {
  const { type } = req.params
  if (!Object.hasOwn(stocks, type)) return error(res, 404, 'Unknown investment type.')
  const ranked = stocks[type].map(scoreStock).sort((a, b) => b.score - a.score)
  return res.json({ type, stocks: ranked, dataNotice: 'All prices, scores, headlines, and history on this demo are fictional.' })
})

app.get('/api/behavioral/scenarios', (_req, res) => {
  res.json({ timeLimitSeconds: 12, scenarios: scenarios.map(({ id, title, alert, prompt, choices }) => ({ id, title, alert, prompt, choices: choices.map(({ id: choiceId, label }) => ({ id: choiceId, label })) })) })
})

app.post('/api/allocate', (req, res) => {
  const amount = Number(req.body?.amount)
  const { growthType, riskTolerance } = req.body || {}
  if (!Number.isFinite(amount) || amount < 1000 || amount > 100000000) return error(res, 400, 'Enter an amount from ₹1,000 to ₹10,00,00,000.')
  if (!Object.hasOwn(stocks, growthType)) return error(res, 400, 'Choose one of the four investment types.')
  if (!['conservative', 'balanced', 'growth'].includes(riskTolerance)) return error(res, 400, 'Choose a risk comfort level.')

  const riskTarget = { conservative: 35, balanced: 55, growth: 75 }[riskTolerance]
  const source = stocks[growthType].map(scoreStock)
  const sorted = [...source].sort((a, b) => Math.abs(a.risk - riskTarget) - Math.abs(b.risk - riskTarget))
  const selected = sorted.slice(0, Math.min(sorted.length, 3))
  const rawWeights = selected.map((stock) => Math.max(10, 100 - Math.abs(stock.risk - riskTarget)))
  const weightSum = rawWeights.reduce((sum, weight) => sum + weight, 0)
  const allocations = selected.map((stock, index) => ({
    id: stock.id, name: stock.name, symbol: stock.symbol, risk: stock.risk,
    pct: Math.round(rawWeights[index] / weightSum * 100),
    annualReturn: stock.annualReturn,
    score: stock.score,
    reason: `Sample risk score ${stock.risk}/100 is ${Math.abs(stock.risk - riskTarget)} points from your selected ${riskTolerance} comfort level.`
  }))
  const pctDifference = 100 - allocations.reduce((sum, item) => sum + item.pct, 0)
  allocations[0].pct += pctDifference
  let allocated = 0
  allocations.forEach((item, index) => {
    item.amount = index === allocations.length - 1 ? amount - allocated : Math.round(amount * item.pct / 100)
    allocated += item.amount
  })
  const expectedReturn = allocations.reduce((sum, item) => sum + item.pct * item.annualReturn, 0) / 100
  const weightedRisk = allocations.reduce((sum, item) => sum + item.pct * item.risk, 0) / 100
  const worstReturn = Math.min(...source.map((item) => item.annualReturn))
  const project = (rate, years) => Math.round(amount * Math.pow(1 + rate / 100, years))
  const projections = [1, 2, 3].map((years) => ({
    years,
    expected: project(expectedReturn, years),
    lower: project(expectedReturn - 12, years),
    upper: project(expectedReturn + 8, years),
    concentratedWrongPick: project(worstReturn - 12, years)
  }))
  res.json({
    total: amount, growthType, riskTolerance, riskTarget,
    allocations,
    expectedAnnualReturn: Number(expectedReturn.toFixed(1)),
    weightedRisk: Number(weightedRisk.toFixed(1)),
    riskFit: weightedRisk <= riskTarget + 10 ? 'close' : 'limited',
    riskFitNote: weightedRisk <= riskTarget + 10
      ? `The sample weighted risk score (${weightedRisk.toFixed(0)}/100) is near your selected comfort target (${riskTarget}/100).`
      : `This investment type has no sample choices close to your comfort target (${riskTarget}/100). Its weighted sample risk is ${weightedRisk.toFixed(0)}/100; consider learning about a broader or lower-risk mix.`,
    projections,
    comparison: { concentratedReturn: worstReturn, note: 'The concentrated comparison uses the weakest sample annual return in this category and applies an illustrative downside adjustment. It is a teaching example, not a forecast.' },
    methodology: 'The sample portfolio weights favor holdings whose fictional risk score is closer to the selected comfort level. Projections compound fictional sample annual returns with wide illustrative ranges.',
    dataNotice: 'Past performance and these fictional scenarios do not guarantee future results. This demo is for education, not personal financial advice.'
  })
})

app.post('/api/behavioral/analyze', (req, res) => {
  const answers = req.body?.answers
  if (!Array.isArray(answers) || answers.length !== scenarios.length) return error(res, 400, 'Submit one response for each of the 10 scenarios.')
  const seen = new Set()
  const scoresByTrait = {}
  const feedback = []
  let disciplined = 0
  for (const answer of answers) {
    const scenario = scenarios.find((item) => item.id === answer?.scenarioId)
    if (!scenario || seen.has(scenario.id)) return error(res, 400, 'Responses must contain each valid scenario exactly once.')
    const seconds = Number(answer.timeTaken)
    if (!Number.isFinite(seconds) || seconds < 0 || seconds > 12) return error(res, 400, 'Scenario response times must be between 0 and 12 seconds.')
    const choice = answer?.choice === 'timeout'
      ? { label: 'Time ran out', scores: { lossAversion: 50, riskManagement: 20 }, feedback: 'The timer expired before you chose. In real life, it is okay to pause rather than trade under pressure.' }
      : scenario.choices.find((item) => item.id === answer?.choice)
    if (!choice) return error(res, 400, `Choose a valid response for “${scenario.title}”.`)
    seen.add(scenario.id)
    for (const trait of ['lossAversion', 'herd', 'overconfidence', 'greed', 'anchoring', 'recency', 'patience', 'riskManagement', 'newsSkepticism']) {
      if (choice.scores[trait] !== undefined) {
        scoresByTrait[trait] ||= []
        scoresByTrait[trait].push(choice.scores[trait])
      }
    }
    if (seconds <= 3) {
      scoresByTrait.impulsivity ||= []
      scoresByTrait.impulsivity.push(80)
    } else {
      scoresByTrait.impulsivity ||= []
      scoresByTrait.impulsivity.push(25)
    }
    if (choice.scores.riskManagement >= 70 || choice.scores.patience >= 80 || choice.scores.newsSkepticism >= 80) disciplined += 1
    feedback.push({ scenarioId: scenario.id, title: scenario.title, choice: choice.label, insight: choice.feedback })
  }
  const traits = Object.fromEntries(Object.entries(scoresByTrait).map(([trait, values]) => [trait, Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)]))
  const discipline = Math.round(disciplined / scenarios.length * 100)
  const biasAverage = ['lossAversion', 'herd', 'overconfidence', 'greed', 'anchoring', 'recency', 'impulsivity'].reduce((sum, trait) => sum + (traits[trait] || 0), 0) / 7
  const readiness = Math.max(0, Math.min(100, Math.round(100 - biasAverage * 0.55 + discipline * 0.35)))
  const investorType = readiness >= 72 ? 'Plan-led learner' : readiness >= 48 ? 'Developing decision-maker' : 'Pause-and-practice learner'
  res.json({ traits, discipline, readiness, investorType, feedback, note: 'This is an educational reflection on your choices in fictional timed scenarios, not a psychological diagnosis or a determination of investment eligibility.' })
})

app.post('/api/intervention/check', (req, res) => {
  const { action, stock: suppliedStock, userProfile = {} } = req.body || {}
  if (!['BUY', 'SELL', 'HOLD'].includes(action)) return error(res, 400, 'Choose BUY, SELL, or HOLD.')
  const stock = Object.values(stocks).flat().find((item) => item.id === suppliedStock?.id)
  if (!stock) return error(res, 400, 'Select a valid sample holding from the demo catalog.')
  const clamp = (value) => Math.max(0, Math.min(100, Number.isFinite(Number(value)) ? Number(value) : 50))
  const lossAversion = clamp(userProfile.lossAversion)
  const herd = clamp(userProfile.herd)
  const impulsivity = clamp(userProfile.impulsivity)
  const stockRisk = clamp(stock.risk ?? 50)
  const actionPressure = action === 'BUY' ? clamp(Math.max(0, Number(stock.change) || 0) * 12) : action === 'SELL' ? clamp(Math.max(0, -(Number(stock.change) || 0)) * 14) : 10
  const sampleHistory = Array.isArray(stock.history) ? stock.history.map(Number).filter(Number.isFinite) : []
  let peak = sampleHistory[0] || 1
  let maxDrawdown = 0
  for (const value of sampleHistory) {
    peak = Math.max(peak, value)
    maxDrawdown = Math.max(maxDrawdown, (peak - value) / peak * 100)
  }
  const components = {
    behaviorPattern: Math.round((lossAversion * 0.4 + herd * 0.35 + impulsivity * 0.25) * 0.45),
    marketPressure: Math.round(actionPressure * 0.2),
    sampleAssetRisk: Math.round(stockRisk * 0.2),
    historicalPattern: Math.round(Math.min(maxDrawdown / 20, 1) * 15)
  }
  const signal = Math.min(95, Math.round(components.behaviorPattern + components.marketPressure + components.sampleAssetRisk))
  const level = signal >= 65 ? 'High' : signal >= 38 ? 'Moderate' : 'Low'
  const reasons = [
    `Your recent scenario profile includes ${lossAversion >= 60 ? 'elevated loss sensitivity' : 'moderate loss sensitivity'} (${lossAversion}/100).`,
    `${action} decision pressure contributes ${components.marketPressure} points in this teaching model.`,
    `${stock.name} has a fictional sample risk score of ${stockRisk}/100; its sample history's largest drop was ${maxDrawdown.toFixed(1)}%.`
  ]
  const warning = signal >= 65 ? 'This choice combines a strong behavior pattern with market pressure. Pause and compare it with your original plan.' : signal >= 38 ? 'Some pressure signals are present. Review the facts and your time horizon before deciding.' : 'No strong pressure signal in this simple model. Still check the risks and your plan.'
  const nudge = { signal, level, action, stockName: stock.name, reasons, warning, components, options: ['Review the facts', 'Reduce the amount', 'Continue in this simulation'] }
  res.json({ nudge, note: 'This score is a transparent educational signal, not a calibrated probability of loss or regret.' })
})

app.post('/api/intervention/outcome', (req, res) => {
  const { decision, action, stockName, signal } = req.body || {}
  if (!['Review', 'Reduce', 'Proceed'].includes(decision)) return error(res, 400, 'Choose Review, Reduce, or Proceed.')
  if (!['BUY', 'SELL', 'HOLD'].includes(action)) return error(res, 400, 'Choose BUY, SELL, or HOLD.')
  if (!Object.values(stocks).flat().some((item) => item.name === stockName)) return error(res, 400, 'Select a valid sample holding.')
  if (!Number.isFinite(Number(signal)) || Number(signal) < 0 || Number(signal) > 100) return error(res, 400, 'The sample signal must be between 0 and 100.')
  const score = Number(signal)
  const event = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, time: new Date().toISOString(), stockName, action: action || 'BUY', signal: score, decision, outcome: decision === 'Proceed' ? 'Simulated scenario shown' : decision === 'Reduce' ? 'Exposure reduced in simulation' : 'Decision paused in simulation' }
  interventionHistory.unshift(event)
  interventionHistory.splice(50)
  res.json({ event, scenario: decision === 'Proceed' && score >= 65 ? { change: -9, label: 'Illustrative downside path' } : decision === 'Proceed' ? { change: 3, label: 'Illustrative upside path' } : { change: 0, label: 'No trade simulated' }, note: 'This is a made-up scenario outcome for the project demo, not a prediction of actual returns.' })
})

app.get('/api/intervention/history', (_req, res) => res.json({ events: interventionHistory }))

app.use((err, _req, res, _next) => {
  if (err instanceof SyntaxError && 'body' in err) return error(res, 400, 'Request body must be valid JSON.')
  console.error(err)
  return error(res, 500, 'An unexpected server error occurred.')
})

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
