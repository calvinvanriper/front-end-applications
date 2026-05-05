# Personal Finance Dashboard — Phase 2 MVP (Complete)

> Phase 2 MVP complete — includes Stock Watchlist, Currency Converter, Precious Metals Tracker, and Currency Watchlist

---

## 📝 Overview

The Personal Finance Dashboard is a modular, state-driven front-end application that provides tools for tracking financial data and performing real-time conversions.

The application has evolved into a multi-feature financial dashboard with four core modules:

- **Stock Watchlist** — track real-time stock prices with autocomplete search and resilient refresh handling
- **Currency Converter** — convert between currencies using live exchange rates
- **Currency Watchlist** — track selected currencies with change and percent calculations
- **Precious Metals Tracker** — monitor gold, silver, platinum, and palladium prices with intelligent caching

The application emphasizes clean architecture, resilient API integration, and predictable state management while delivering a cohesive, dashboard-style user experience.

---

## 🚀 Features

### 📈 Stock Watchlist

- Add stocks via:
  - Symbol input
  - Autocomplete search (symbol + company name)
- Remove individual stocks with confirmation modal
- Clear entire watchlist with confirmation modal
- Refresh all stock data using live API calls
- Resilient refresh handling using `Promise.allSettled()`
- Real-time stock data:
  - Current price
  - Price change
  - Percent change
- Visual indicators for price movement
- Section-level **Last refreshed timestamp**
- Persistent storage using `localStorage`

---

### 🪙 Precious Metals Tracker

- Track key metals:
  - Gold (XAU)
  - Silver (XAG)
  - Platinum (XPT)
  - Palladium (XPD)
- Live pricing via API integration
- Calculated:
  - Price change
  - Percent change (based on previous fetch)
- Intelligent caching system:
  - Stores previous and current prices
  - Prevents unnecessary API calls
- **8-hour cooldown** to respect API rate limits
- Automatic fallback to cached data on API failure
- Section-level **Last refreshed timestamp**
- Persistent storage using `localStorage`

---

### 💱 Currency Converter

- Convert between currencies using live exchange rates
- Dynamic population of currency dropdowns from API data
- Display currency names and symbols
- Swap currencies instantly with a dedicated control
- Real-time conversion results
- Input validation and structured feedback

---

### 💱 Currency Watchlist

- Add currencies from successful conversions
- Maximum of 4 tracked currencies
- Prevent duplicate entries
- Remove individual currencies with confirmation modal
- Clear entire watchlist with confirmation modal
- Refresh all tracked currencies using a single API request
- Base conversion standardized to **$100 USD**
- Calculated:
  - Value change
  - Percent change (based on previous refresh)
- Rates caching system:
  - Stores current and previous rates
  - Enables change tracking without redundant API calls
- Section-level **Last refreshed timestamp**
- Persistent storage using `localStorage`

---

### 🔔 UI & UX Systems

- Toast notifications for user feedback
- Confirmation modals for destructive actions
- Inline validation messaging
- Responsive, scan-friendly card layout
- Consistent **asset-card design system** across dashboard modules
- Section-level metadata (Last refreshed timestamps)

---

## 🧠 Architecture

The application follows a modular structure with clear separation of concerns:

### Core Layers

- **Models**
  - `StockWatchlist` — manages stock watchlist state and operations
  - `CurrencyWatchlist` — manages tracked currencies

- **State**
  - Centralized UI state via `appState`
  - Handles transient UI flows (modals, confirmations)

- **Workflows**
  - Encapsulate business logic for:
    - stock operations (add/remove/refresh)
    - metals refresh + caching
    - currency conversion
    - currency watchlist operations (add/remove/clear/refresh + caching)
  - Return standardized result objects:

```js
{ success: boolean, reason: string }
```

- **API Layer**
  - Integrates external services for:
    - stock quotes and symbol search
    - currency exchange rates
    - precious metals pricing
  - Normalizes external data into a consistent internal format

- **Storage Layer**
  - `localStorage` used for:
    - stock watchlist persistence
    - currency watchlist persistence
    - currency rates cache (current + previous rates + timestamps)
    - metals cache (current + previous prices + timestamps)

- **UI Layer**
  - Rendering logic isolated from business logic
  - Shared rendering patterns for asset-based data

- **Handlers**
  - Event listeners call named functions
  - No business logic inside event listeners
  - Responsible for UI-side effects (toasts, UI state updates)

---

## 🔎 Autocomplete Search

- Debounced input handling prevents excessive API calls
- Symbol search returns:
  - ticker symbol
  - company name
- Dropdown results allow selection before adding to watchlist
- Selected result passes both symbol and name into the data model

---

## 🔄 Data Handling & Resilience

### Stocks

- Uses `Promise.allSettled()` for batch refresh
- Ensures:
  - successful updates are applied
  - failed updates do not remove existing data

### Metals

- Uses cached data with cooldown system
- Prevents unnecessary API calls
- Falls back to cached data on failure
- Calculates change based on previous fetch

### Currencies

- Uses a single API call to fetch all rates
- Stores:
  - current rates
  - previous rates
- Enables:
  - change calculations
  - percent change calculations
- Avoids redundant API calls during removal operations

---

## 🧩 Application Structure

```bash
personal-finance-dashboard/
  index.html
  styles/
    styles.css
    tokens.css
  js/
    api/
    config/
    handlers/
    models/
    state/
    storage/
    ui/
    utils/
    workflows/
```

---

## 💾 Persistence & Data Handling

- Stock watchlist stored in `localStorage`
- Currency watchlist stored in `localStorage`
- Currency rates cache stored with:
  - last fetched timestamp
  - previous rates
  - current rates
- Metals cache stored with:
  - last fetched timestamp
  - previous prices
  - current prices
- Data rehydrated on application load
- UI always reflects current data state

---

## 🛠️ Tech Stack

- Vanilla JavaScript (ES Modules)
- HTML5
- CSS3 (design tokens / custom properties)
- LocalStorage API
- External APIs:
  - Finnhub (stock data + symbol search)
  - Currency exchange API
  - MetalpriceAPI (precious metals)

---

## 💡 Development Notes

- Application is fully state-driven for consistent UI behavior
- Workflows return standardized result objects for predictable handling
- Toast notifications managed via `showResultToast()`
- Asset-based UI system allows reuse across financial data types
- Currency and metals modules introduce:
  - caching strategies
  - derived data (change + percent calculations)
- Application structured for scalable feature expansion

---

## 🚧 Roadmap

### Phase 3 — Financial Planning Tools

- Savings goal tracker
- Asset allocation tracker
- Pie or donut chart for allocation breakdown
- LocalStorage persistence for planning data
- JSON import/export support

---

## 🔗 Live Demo

[Application](https://calvinvanriper.dev/front-end-applications/applications/personal-finance-dashboard)
