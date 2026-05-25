// ------------------------------------------------------------
// --------------------------Imports---------------------------
// ------------------------------------------------------------

import { dom } from './ui/dom.js';
import * as handlers from './handlers/event-handlers.js';
import { getSupportedCurrencies } from './api/currency-api.js';
import {
  populateCurrencyOptions,
  renderStocksSection,
  renderCachedMetalsSection,
  setAddCurrencyButtonState,
  renderSavingsGoalsSection,
  renderAssetPortfolioSection,
  populateAssetCategoryOptions,
} from './ui/render.js';
import { StockWatchlist } from './models/stock-watchlist.js';
import { CurrencyWatchlist } from './models/currency-watchlist.js';
import { SavingsGoals } from './models/savings-goals.js';
import { AllocationPortfolio } from './models/allocation-portfolio.js';
import {
  loadStockWatchlist,
  loadMetalsCache,
  loadCurrencyWatchlist,
  loadSavingsGoalsCache,
  loadAssetPortfolioCache,
} from './storage/persistence.js';
import { appState } from './state/app-state.js';
import { processCurrencyWatchlistRefresh } from './workflows/currency-workflows.js';

// ------------------------------------------------------------
// -----------------------App Instances------------------------
// ------------------------------------------------------------

const stockWatchlist = new StockWatchlist();
const currencyWatchlist = new CurrencyWatchlist(loadCurrencyWatchlist());
const savingsGoals = new SavingsGoals(loadSavingsGoalsCache());
const assetPortfolio = new AllocationPortfolio(loadAssetPortfolioCache());

// ------------------------------------------------------------
// -----------------------Initialization-----------------------
// ------------------------------------------------------------

async function initializeApp() {
  const initialData = await loadInitialAppData();

  hydrateAppInstances(initialData);
  initializeStaticUI(initialData);
  await renderInitialUI(initialData);
  initializeEventListeners();
}

async function loadInitialAppData() {
  return {
    currencies: await getSupportedCurrencies(),
    savedStocks: loadStockWatchlist(),
    cachedMetals: loadMetalsCache(),
  };
}

function hydrateAppInstances({ savedStocks }) {
  stockWatchlist.loadStocks(savedStocks);
}

function initializeStaticUI({ currencies }) {
  setAddCurrencyButtonState(false);
  populateCurrencyOptions(currencies);
  populateAssetCategoryOptions();
}

async function renderInitialUI({ cachedMetals }) {
  if (cachedMetals?.currentPrices?.length > 0) {
    renderCachedMetalsSection(cachedMetals);
  }

  renderStocksSection(stockWatchlist.getStocks());
  await processCurrencyWatchlistRefresh(currencyWatchlist);
  renderSavingsGoalsSection(savingsGoals.getGoals());
  renderAssetPortfolioSection(assetPortfolio.getAssets());
}

function initializeEventListeners() {
  initializeGlobalListeners();
  initializeCurrencyConverterListeners();
  initializeStockWatchlistListeners();
  initializeMetalsTrackerListeners();
  initializeCurrencyWatchlistListeners();
  initializeSavingsGoalsListeners();
  initializeAssetPortfolioListeners();
  initializeConfirmationModalListeners();
}

// ------------------------------------------------------------
// -------------------Listener Registration--------------------
// ------------------------------------------------------------

// ----------------------Global Listeners----------------------

function initializeGlobalListeners() {
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
}

// ----------------Currency Converter Listeners----------------

function initializeCurrencyConverterListeners() {
  dom.converterForm.addEventListener('submit', handlers.handleConvertSubmit);

  dom.swapBtn.addEventListener('click', handlers.handleCurrencySwap);

  dom.addCurrencyBtn.addEventListener('click', () => {
    handlers.handleAddCurrencyClick(currencyWatchlist);
  });
}

// -----------------Stock Watchlist Listeners------------------

function initializeStockWatchlistListeners() {
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
}

// ------------------Metals Tracker Listeners------------------

function initializeMetalsTrackerListeners() {
  dom.refreshMetalsBtn.addEventListener('click', handlers.handleRefreshMetalsClick);
}

// ----------------Currency Watchlist Listeners----------------

function initializeCurrencyWatchlistListeners() {
  dom.refreshCurrenciesBtn.addEventListener('click', () => {
    handlers.handleRefreshCurrenciesClick(currencyWatchlist);
  });

  dom.clearCurrenciesBtn.addEventListener('click', () => {
    handlers.handleClearCurrenciesClick(currencyWatchlist);
  });

  dom.currencyWatchlist.addEventListener('click', (event) => {
    handlers.handleCurrencyWatchlistClick(event, currencyWatchlist);
  });
}

// ------------------Savings Goals Listeners-------------------

function initializeSavingsGoalsListeners() {
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
}

// -----------------Asset Portfolio Listeners------------------

function initializeAssetPortfolioListeners() {
  dom.assetForm.addEventListener('submit', (event) => {
    handlers.handleAssetFormSubmit(event, assetPortfolio);
  });

  dom.addAssetBtn.addEventListener('click', () => {
    handlers.handleAddAssetClick(assetPortfolio);
  });

  dom.clearAssetsBtn.addEventListener('click', () => {
    handlers.handleClearAssetsClick(assetPortfolio);
  });

  dom.cancelAssetBtn.addEventListener('click', handlers.handleCancelAssetClick);

  dom.assetPortfolioList.addEventListener('click', (event) => {
    handlers.handleAssetPortfolioListClick(event, assetPortfolio);
  });

  dom.closeAssetDetailsBtn.addEventListener('click', handlers.handleCloseAssetDetailsClick);

  dom.assetDetailsForm.addEventListener('click', (event) => {
    handlers.handleAssetDetailsClick(event, assetPortfolio);
  });
}

// ----------------Confirmation Modal Listeners----------------

function initializeConfirmationModalListeners() {
  dom.confirmActionBtn.addEventListener('click', handlers.handleConfirmActionClick);

  dom.cancelConfirmationBtn.addEventListener('click', handlers.handleCancelConfirmationClick);

  dom.confirmationModal.addEventListener('click', (event) => {
    if (event.target === dom.confirmationModal) {
      handlers.handleCancelConfirmationClick();
    }
  });
}

// ------------------------------------------------------------
// -------------------------Start App--------------------------
// ------------------------------------------------------------

initializeApp();
