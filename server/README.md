# Behavioral Finance Simulator

An educational React + Express project. All prices, financial scores, headlines, and past-performance paths are fictional sample data. The app does not connect to a broker or execute trades; it is not investment advice.

## Run locally

Open two terminals from the project folder:

```powershell
cd server
npm install
npm run dev
```

```powershell
cd client
npm install
npm run dev
```

Open the Vite URL printed by the client (normally `http://localhost:5173`). The Vite development server forwards `/api` requests to the Express server at `http://localhost:5000`.

## Demo modules

- **Explore:** Four investment types, fictional holdings, a transparent historical/financial/news score, sample headlines, and plain-language explanations.
- **Budget lab:** Validates a sample investment amount, investment type, and risk comfort; returns a sample allocation and lower/middle/higher one-, two-, and three-year compounding scenarios, including a concentrated-pick downside comparison.
- **Behavior lab:** Ten timed fictional decision scenarios; validates and analyzes all ten answers into a reflection profile.
- **Pre-decision pause:** Combines profile traits with sample price pressure, asset risk, and a fictional historical drawdown. The signal is not a calibrated probability. The user's choices and scenario outcomes are logged in server memory.

## API

- `GET /api/health`
- `GET /api/growth-types`
- `GET /api/stocks/:type` (`stocks`, `mf`, `index`, or `etf`)
- `POST /api/allocate` — `{ "amount": 50000, "growthType": "index", "riskTolerance": "balanced" }`
- `GET /api/behavioral/scenarios`
- `POST /api/behavioral/analyze` — ten unique `{ "scenarioId", "choice", "timeTaken" }` answers
- `POST /api/intervention/check` — `{ "action", "stock", "userProfile" }`
- `POST /api/intervention/outcome` — records a simulated review/reduce/proceed choice
- `GET /api/intervention/history`

The Express API validates inputs and returns readable JSON errors for invalid requests. Intervention history is intentionally in-memory for this classroom demo and is cleared when the server restarts. No database or real market-data provider is configured.
