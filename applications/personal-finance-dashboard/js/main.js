// ------------------------------------------------------------
// --------------------------Imports---------------------------
// ------------------------------------------------------------

import { dom } from './ui/dom.js';
import * as handlers from './handlers/event-handlers.js';
import { getSupportedCurrencies } from './api/currency-api.js';
import {
  populateCurrencyOptions,
  renderStocksSection,
  renderMetalsSection,
  setAddCurrencyButtonState,
  renderSavingsGoalsSection,
} from './ui/render.js';
import { StockWatchlist } from './models/stock-watchlist.js';
import { CurrencyWatchlist } from './models/currency-watchlist.js';
import { SavingsGoals } from './models/savings-goals.js';
import {
  loadStockWatchlist,
  loadMetalsCache,
  loadCurrencyWatchlist,
  loadSavingsGoalsCache,
} from './storage/persistence.js';
import { appState } from './state/app-state.js';
import { processCurrencyWatchlistRefresh } from './workflows/currency-workflows.js';

// ------------------------------------------------------------
// -----------------------App Instances------------------------
// ------------------------------------------------------------

const stockWatchlist = new StockWatchlist();
const currencyWatchlist = new CurrencyWatchlist(loadCurrencyWatchlist());
const savingsGoals = new SavingsGoals(loadSavingsGoalsCache());

// ------------------------------------------------------------
// -----------------------Initialization-----------------------
// ------------------------------------------------------------

async function initializeApp() {
  const currencies = await getSupportedCurrencies();
  const savedStocks = loadStockWatchlist();
  const cachedMetals = loadMetalsCache();

  setAddCurrencyButtonState(false);

  if (cachedMetals?.currentPrices?.length > 0) {
    renderMetalsSection(cachedMetals.currentPrices, cachedMetals.lastFetched);
  }

  stockWatchlist.loadStocks(savedStocks);
  populateCurrencyOptions(currencies);
  renderStocksSection(stockWatchlist.getStocks());
  await processCurrencyWatchlistRefresh(currencyWatchlist);
  renderSavingsGoalsSection(savingsGoals.getGoals());
}

// ------------------------------------------------------------
// -------------------Global Event Listeners-------------------
// ------------------------------------------------------------

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && appState.pendingConfirmationAction) {
    handlers.handleCancelConfirmationClick();
  }
});
document.addEventListener('click', (event) => {
  if (!event.target.closest('.stock-search-field')) {
    dom.stockSearchResults.classList.add('hidden');
  }
});

// ------------------------------------------------------------
// ----------------Currency Converter Listeners----------------
// ------------------------------------------------------------

dom.converterForm.addEventListener('submit', handlers.handleConvertSubmit);
dom.swapBtn.addEventListener('click', handlers.handleCurrencySwap);
dom.addCurrencyBtn.addEventListener('click', () => {
  handlers.handleAddCurrencyClick(currencyWatchlist);
});

// ------------------------------------------------------------
// -----------------Stock Watchlist Listeners------------------
// ------------------------------------------------------------

dom.stockForm.addEventListener('submit', (event) => {
  handlers.handleStockSubmit(event, stockWatchlist);
});

dom.stockWatchlist.addEventListener('click', (event) => {
  handlers.handleStockWatchlistClick(event, stockWatchlist);
});
dom.clearStocksBtn.addEventListener('click', () => {
  handlers.handleClearStockWatchlistClick(stockWatchlist);
});
dom.refreshStocksBtn.addEventListener('click', () => {
  handlers.handleRefreshStockWatchlistClick(stockWatchlist);
});
dom.stockSymbolInput.addEventListener('input', handlers.handleStockSymbolInput);
dom.stockSearchResults.addEventListener('click', handlers.handleStockSearchResultClick);

// ------------------------------------------------------------
// ------------------Metals Tracker Listeners------------------
// ------------------------------------------------------------

dom.refreshMetalsBtn.addEventListener('click', handlers.handleRefreshMetalsClick);

// ------------------------------------------------------------
// ----------------Currency Watchlist Listeners----------------
// ------------------------------------------------------------

dom.refreshCurrenciesBtn.addEventListener('click', () => {
  handlers.handleRefreshCurrenciesClick(currencyWatchlist);
});
dom.clearCurrenciesBtn.addEventListener('click', () => {
  handlers.handleClearCurrenciesClick(currencyWatchlist);
});
dom.currencyWatchlist.addEventListener('click', (event) => {
  handlers.handleCurrencyWatchlistClick(event, currencyWatchlist);
});

// ------------------------------------------------------------
// ------------------Savings Goals Listeners-------------------
// ------------------------------------------------------------

dom.goalForm.addEventListener('submit', (event) => {
  handlers.handleGoalFormSubmit(event, savingsGoals);
});
dom.addGoalBtn.addEventListener('click', () => {
  handlers.handleAddGoalClick(savingsGoals);
});
dom.clearGoalsBtn.addEventListener('click', () => {
  handlers.handleClearGoalsClick(savingsGoals);
});
dom.savingsGoalsList.addEventListener('click', (event) => {
  handlers.handleSavingsGoalsClick(event, savingsGoals);
});
dom.cancelGoalBtn.addEventListener('click', handlers.handleCancelGoalClick);
// ------------------------------------------------------------
// ----------------Confirmation Modal Listeners----------------
// ------------------------------------------------------------

dom.confirmActionBtn.addEventListener('click', handlers.handleConfirmActionClick);
dom.cancelConfirmationBtn.addEventListener('click', handlers.handleCancelConfirmationClick);
dom.confirmationModal.addEventListener('click', (event) => {
  if (event.target === dom.confirmationModal) {
    handlers.handleCancelConfirmationClick();
  }
});

// ------------------------------------------------------------
// -------------------------Start App--------------------------
// ------------------------------------------------------------

initializeApp();
