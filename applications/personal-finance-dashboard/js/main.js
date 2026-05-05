import { dom } from './ui/dom.js';
import * as handlers from './handlers/event-handlers.js';
import { getSupportedCurrencies } from './api/currency-api.js';
import {
  populateCurrencyOptions,
  renderStockWatchlist,
  renderMetalsSection,
  renderStocksUpdatedMeta,
  setAddCurrencyButtonState,
} from './ui/render.js';
import { StockWatchlist } from './models/stock-watchlist.js';
import { CurrencyWatchlist } from './models/currency-watchlist.js';
import {
  loadStockWatchlist,
  loadMetalsCache,
  loadCurrencyWatchlist,
} from './storage/persistence.js';
import { appState } from './state/app-state.js';
import { getLatestStockTimestamp } from './utils/formatters.js';
import { processCurrencyWatchlistRefresh } from './workflows/currency-workflows.js';

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
  renderStockWatchlist(stockWatchlist.getStocks());
  renderStocksUpdatedMeta(getLatestStockTimestamp(stockWatchlist.getStocks()));
  await processCurrencyWatchlistRefresh(currencyWatchlist);
}

const stockWatchlist = new StockWatchlist();
const currencyWatchlist = new CurrencyWatchlist(loadCurrencyWatchlist());

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
dom.converterForm.addEventListener('submit', handlers.handleConvertSubmit);
dom.stockForm.addEventListener('submit', (event) => {
  handlers.handleStockSubmit(event, stockWatchlist);
});
dom.swapBtn.addEventListener('click', handlers.handleCurrencySwap);
dom.addCurrencyBtn.addEventListener('click', () => {
  handlers.handleAddCurrencyClick(currencyWatchlist);
});
dom.stockWatchlist.addEventListener('click', (event) => {
  handlers.handleStockWatchlistClick(event, stockWatchlist);
});
dom.clearStocksBtn.addEventListener('click', () => {
  handlers.handleClearStockWatchlistClick(stockWatchlist);
});
dom.confirmActionBtn.addEventListener('click', handlers.handleConfirmActionClick);
dom.cancelConfirmationBtn.addEventListener('click', handlers.handleCancelConfirmationClick);
dom.confirmationModal.addEventListener('click', (event) => {
  if (event.target === dom.confirmationModal) {
    handlers.handleCancelConfirmationClick();
  }
});
dom.refreshStocksBtn.addEventListener('click', () => {
  handlers.handleRefreshStockWatchlistClick(stockWatchlist);
});
dom.stockSymbolInput.addEventListener('input', handlers.handleStockSymbolInput);
dom.stockSearchResults.addEventListener('click', handlers.handleStockSearchResultClick);
dom.refreshMetalsBtn.addEventListener('click', handlers.handleRefreshMetalsClick);
dom.refreshCurrenciesBtn.addEventListener('click', () => {
  handlers.handleRefreshCurrenciesClick(currencyWatchlist);
});
dom.clearCurrenciesBtn.addEventListener('click', () => {
  handlers.handleClearCurrenciesClick(currencyWatchlist);
});
dom.currencyWatchlist.addEventListener('click', (event) => {
  handlers.handleCurrencyWatchlistClick(event, currencyWatchlist);
});

initializeApp();
