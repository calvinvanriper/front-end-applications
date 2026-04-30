# Personal Finance Dashboard - Phase 1 MVP

> Phase 1 MVP complete - includes Stock Watchlist and Currency Converter modules

## 📝 Overview

The Personal Finance Dashboard is a modular, state-driven front-end application that provides tools for tracking financial data and performing real-time conversions.

Phase 1 includes two core features:

- **Stock Watchlist** — track real-time stock prices with autocomplete search and resilient data refresh
- **Currency Converter** — convert between currencies using live exchange rates with dynamic dropdowns and quick-swap functionality

The application emphasizes clean architecture, resilient API integration, and predictable state management while delivering a smooth and intuitive user experience.

The application is designed to evolve into a multi-tool financial Dashboard, with each phase expanding functionality while maintaining a consistent architecture and user experience.

---

## 🚀 Features

### 📈 Stock Watchlist

- Add stocks via:
  - Symbol input
  - Autocomplete search (symbol + company name)
- Remove individual stocks with confirmation
- Clear entire watchlist with confirmation modal
- Refresh all stock data using live API calls
- Resilient refresh handling using `Promise.allSettled()`
- Real-time stock data:
  - Current price
  - Price change
  - Percent change
- Visual indicators for price movement
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

### 🔔 UI & UX Systems

- Toast notifications for user feedback
- Confirmation modals for destructive actions
- Inline validation messaging
- Responsive, scan-friendly card layout

---

## 🧠 Architecture

The application follows a modular structure with clear separation of concerns:

### Core Layers

- **Models**
  - `StockWatchList` — manages watchlist state and operations

- **State**
  - Centralized UI state via `appState`
  - Handles confirmation flows and pending actions

- **Workflows**
  - Encapsulate business logic for:
    - adding stocks
    - removing stocks
    - clearing watchlist
    - refreshing stock data
    - currency conversion
  - Return standardized result objects:

```js
{ success: boolean, reason: string }
```

- **API Layer**
  - Integrates external services for:
    - stock quotes and symbol search
    - currency exchange rates and supported currencies
  - Normalizes external data into a consistent internal format

- **UI Layer**
  - Rendering logic isolated from business logic
  - DOM updates driven by application state

- **Handlers**
  - Event listeners call named functions
  - No business logic inside event listeners
  - Responsible for UI-side effects, such as toast notifications

- **Multi-Feature Design**
  - Dashboard supports multiple financial tools within a shared architecture
  - Each feature module follows consistent workflow and UI patterns

---

## 🔎 Autocomplete Search

- Debounced input handling prevents excessive API calls
- Symbol search returns:
  - ticker symbol
  - company name
- Dropdown results allow selection before adding to watchlist
- Selected result passes both symbol and name into the data model

---

## 🔄 Resilient Data Refresh

- Uses `Promise.allSettled()` to handle multiple API calls
- Ensures:
  - successful updates are applied
  - failed updates do not remove existing data
- Provides user feedback for:
  - full success
  - partial refresh
  - total failure

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

The structure separates responsibilities into focused modules, improving maintainability and scalability.

---

## 💾 Persistence & Data Handling

- Watchlist is stored in `localStorage`
- Data is rehydrated on application load
- Model ensures consistent data structure across sessions
- UI always reflects current state of the model

---

## 🛠️ Tech Stack

- Vanilla JavaScript (ES Modules)
- HTML5
- CSS3 (custom properties / design tokens)
- LocalStorage API
- External APIs:
  - Finnhub (stock data + symbol search)
  - Currency exchange API (rates + supported currencies)

---

## 💡 Development Notes

- Application is fully state-driven for consistent UI behavior
- Workflows return standardized result objects for predictable handling
- Toast notifications are centrally managed via `showResultToast()`
- Autocomplete separates:
  - identity (symbol + name)
  - live data (price + change)
- Currency converter dynamically loads supported currencies from API at runtime
- Shared UI systems (modals, toasts) are reused across multiple features
- Application structured to support additional financial modules in future phases

---

## 🚧 Roadmap

### Phase 2 (Next)

- Precious metals price tracker
- Optional saved metals preferences
- Manual refresh controls for metal pricing

---

### Phase 3 (Future Development)

- Savings goal tracker
- Asset allocation tracker
- Pie or donut chart showing asset allocation breakdown
- LocalStorage persistence for goals and allocation data
- JSON import/export of Phase 3 data

## 🔗 Live Demo

[Application](https://calvinvanriper.dev/front-end-applications/applications/personal-finance-dashboard)
