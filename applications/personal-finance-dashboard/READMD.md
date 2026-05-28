# Personal Finance Dashboard

> A modular vanilla JavaScript financial dashboard for tracking stocks, currencies, precious metals, savings goals, and asset allocation with persistent local data management.

---

## 📝 Overview

The **Personal Finance Dashboard** is a modular, state-driven front-end application built with vanilla JavaScript, HTML, and CSS.

It provides a collection of financial tracking tools in one dashboard-style interface, including real-time market data, currency conversion, savings goal management, asset allocation tracking, persistent local storage, and dashboard-level import/export support.

This project was built as a portfolio-focused application to demonstrate clean JavaScript architecture, API integration, localStorage persistence, validation workflows, reusable UI systems, and scalable feature organization without relying on a front-end framework.

---

## 🚀 Features

### 📈 Stock Watchlist

- Add stocks using manual symbol input or autocomplete search
- Search results include ticker symbols and company names
- Prevent duplicate stock entries
- Remove individual stocks with confirmation modal
- Clear the full stock watchlist with confirmation modal
- Refresh all stock quotes using live API data
- Resilient batch refresh handling with `Promise.allSettled()`
- Preserve existing stock data when individual refresh requests fail
- Display:
  - current price
  - price change
  - percent change
  - movement direction
  - last refreshed timestamp

- Persist stock watchlist data with `localStorage`

---

### 🪙 Precious Metals Tracker

- Track precious metal prices for:
  - Gold (`XAU`)
  - Silver (`XAG`)
  - Platinum (`XPT`)
  - Palladium (`XPD`)

- Fetch live precious metal pricing data
- Calculate:
  - price change
  - percent change
  - movement direction

- Cache current and previous price snapshots
- Use an 8-hour refresh cooldown to reduce unnecessary API calls
- Preserve cached display snapshots during cooldown periods
- Fall back to cached data if a live refresh fails
- Validate and sanitize cached metals data on load
- Display MetalpriceAPI attribution
- Persist metals cache data with `localStorage`

---

### 💱 Currency Converter

- Convert between supported currencies using live exchange rates
- Dynamically populate currency dropdowns from API data
- Display currency codes, symbols, and names
- Swap selected currencies with one click
- Validate conversion amount input
- Display real-time conversion result metadata
- Enable currency watchlist actions only after successful conversion

---

### 💱 Currency Watchlist

- Add converted currencies to a persistent watchlist
- Track up to 4 currencies
- Prevent duplicate currency entries
- Remove individual currencies with confirmation modal
- Clear the full currency watchlist with confirmation modal
- Refresh all tracked currencies using a single rates request
- Standardize watchlist comparison to `$100 USD`
- Calculate:
  - converted amount
  - value change
  - percent change
  - movement direction

- Cache current and previous exchange rates
- Persist currency watchlist and rate cache data with `localStorage`

---

### 🎯 Savings Goals

- Create savings goals with:
  - goal name
  - target amount
  - current saved amount
  - target date

- Edit existing savings goals with reusable modal form workflows
- Remove individual goals with confirmation modal
- Clear all goals with confirmation modal
- Automatically sort goals by nearest target date
- Display visual progress bars
- Validate goal form input before saving
- Keep forms open when validation fails so users can correct input
- Persist savings goals with `localStorage`

---

### 🧩 Asset Portfolio

- Add asset allocation entries by category and amount
- Supported categories:
  - Stocks
  - Crypto
  - Cash
  - Metals
  - Real Estate

- Group assets by category for portfolio-level display
- Display total portfolio value
- Render donut chart allocation visualization
- Show category totals and allocation percentages
- Open category detail views for individual asset entries
- Update individual asset entries
- Remove individual asset entries
- Automatically close details view when the last item in a category is removed
- Clear the full asset portfolio with confirmation modal
- Track created and updated timestamps for asset entries
- Validate asset form data before saving
- Persist asset portfolio data with `localStorage`

---

### 💾 Dashboard Data Management

- Export dashboard user data as a JSON backup file
- Import dashboard backup files
- Validate imported backup file shape
- Sanitize imported records before loading
- Drop corrupted records while preserving valid data
- Replace current dashboard data with imported data
- Clear all dashboard user data with confirmation modal
- Preserve API caches when clearing dashboard user data
- Reset file input after import so the same file can be imported again
- Provide toast feedback for export, import, clear, and error states

Exported dashboard data includes:

- stock watchlist
- currency watchlist
- savings goals
- asset portfolio

API-derived caches are intentionally excluded from dashboard user-data clearing.

---

## 🔔 UI & UX Systems

- Toast notifications for success and error feedback
- Confirmation modals for destructive actions
- Reusable modal form overlays
- Responsive dashboard card layout
- Shared card styles across dashboard modules
- Shared icon action button system
- Section-level metadata and timestamps
- Empty states for unloaded or cleared sections
- Validation workflows that preserve user input context
- Accessible hidden file input label for dashboard imports

---

## 🧠 Architecture

The application uses a modular JavaScript architecture with clear separation of responsibilities.

### Core Layers

#### Models

Model classes own data mutation rules and return standardized result objects.

- `StockWatchlist`
- `CurrencyWatchlist`
- `SavingsGoals`
- `AllocationPortfolio`

Model methods handle operations such as:

- add
- remove
- update
- replace
- clear
- duplicate prevention
- basic defensive guards

---

#### Event Handlers

Handlers respond to user interactions and own browser/UI-side behavior.

Responsibilities include:

- reading DOM input values
- calling workflow functions
- opening confirmation modals
- showing toast notifications
- triggering hidden file inputs
- managing transient UI state

Event listeners remain thin and call named handler functions.

---

#### Workflows

Workflow files coordinate application logic.

Responsibilities include:

- validating submitted data
- calling APIs
- calling model methods
- syncing persistence
- triggering render updates
- returning standardized result objects

Example result object:

```js
{
  success: true,
  reason: 'dashboardImported'
}
```

Workflow modules include:

- stock workflows
- metals workflows
- currency workflows
- savings goal workflows
- asset portfolio workflows
- dashboard backup workflows

---

#### Render Layer

Rendering functions own DOM updates and markup generation.

Responsibilities include:

- rendering dashboard sections
- rendering empty states
- rendering forms and overlays
- rendering chart markup
- rendering metadata
- updating button states

Business logic is kept out of render helpers.

---

#### Persistence Layer

Persistence helpers own `localStorage` loading and saving.

Stored data includes:

- stock watchlist
- currency watchlist
- currency rates cache
- metals price cache
- savings goals
- asset portfolio

Persistence loading includes defensive parsing and stored-data validation where appropriate.

---

#### Validators

Validation utilities protect form input, imported backup data, and stored localStorage records.

Validation and sanitization includes:

- savings goal form data
- asset form data
- stored savings goals
- stored assets
- stored metals price data
- imported stocks
- imported currencies
- imported savings goals
- imported assets
- dashboard backup file shape

---

#### Config

Configuration files store shared constants and domain-specific config, including:

- toast message keys
- refresh cooldown values
- base currency settings
- metals metadata
- asset category labels and colors
- API endpoint/key configuration template

---

## 🔄 Data Handling & Resilience

### Stock Refresh

Stock refreshes use `Promise.allSettled()` so partial API failures do not remove existing valid data.

Successful quote updates are applied, while failed quote requests preserve their previous values.

---

### Metals Cache

The metals tracker uses a cache-first strategy with an 8-hour cooldown.

During cooldown periods, the app renders the last saved display snapshot instead of recalculating change values from unchanged prices.

This prevents change and percent-change values from incorrectly resetting to zero.

---

### Currency Rates

Currency watchlist refreshes use a single rates request from the base currency.

The app stores current and previous rates to calculate watchlist movement over time.

---

### Import Safety

Dashboard imports validate the backup wrapper and sanitize imported records before replacing current data.

If an imported backup contains partially corrupted section data, valid records can still be imported while invalid records are dropped.

---

## 🧩 Application Structure

```bash
personal-finance-dashboard/
  index.html
  assets/
    icons/
  styles/
    styles.css
    tokens.css
    base.css
    layout.css
    components/
    features/
    utilities.css
    responsive.css
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

## 🛠️ Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- ES Modules
- LocalStorage API
- Fetch API
- External APIs:
  - Finnhub
  - Exchange rate API
  - MetalpriceAPI

---

## 🔐 API Configuration

API keys are not committed to source control.

To run the project locally:

1. Copy the example API config file:

   ```bash
   cp js/config/api-config.example.js js/config/api-config.js
   ```

2. Add your API keys to `api-config.js`.

3. Run the project with a local development server such as VS Code Live Server.

Example config file:

```js
export const FINNHUB_API_KEY = 'your-finnhub-api-key';
export const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';

export const METALPRICE_API_KEY = 'your-metalpriceapi-key';
export const METALPRICE_BASE_URL = 'https://api.metalpriceapi.com/v1/latest';

export const CURRENCY_BASE_URL = 'https://open.er-api.com/v6/latest';
```

> Note: API keys used directly in browser-based applications are still visible to users through browser developer tools and network requests. This project keeps keys out of the public repository for safer local development. A production-grade version would use a backend or proxy service to protect private API secrets.

---

## 💡 What I Learned

This project reinforced several important front-end development concepts:

- keeping DOM access out of workflow logic
- separating event handling, rendering, workflows, persistence, and models
- designing predictable result-object workflows
- validating data before mutation
- sanitizing imported and persisted data
- using `localStorage` safely
- handling partial API failures
- caching API-derived data responsibly
- avoiding unnecessary API calls with cooldown logic
- building reusable modal, toast, card, and form patterns
- managing feature growth without allowing responsibility drift

---

## 🚧 Future Improvements

Possible future enhancements:

- Add backend/proxy support for secure API key handling
- Add user authentication and cloud persistence
- Add richer financial insights and historical charts
- Add portfolio allocation targets
- Add downloadable CSV reports
- Improve mobile dashboard layout further
- Rebuild the dashboard in React as a component-based version

---

## 🔗 Live Demo

[Application](https://calvinvanriper.dev/front-end-applications/applications/personal-finance-dashboard)
