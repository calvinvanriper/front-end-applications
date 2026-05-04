import { dom } from './ui/dom.js';
import * as handlers from './handlers/event-handlers.js';
import { getSupportedCurrencies } from './api/currency-api.js';
import {
  populateCurrencyOptions,
  renderStockWatchlist,
  renderMetalsSection,
  renderStocksUpdatedMeta,
} from './ui/render.js';
import { StockWatchlist } from './models/stock-watchlist.js';
import { loadStockWatchlist, loadMetalsCache } from './storage/persistence.js';
import { appState } from './state/app-state.js';
import { getLatestStockTimestamp } from './utils/formatters.js';

async function initializeApp() {
  const currencies = await getSupportedCurrencies();
  const savedStocks = loadStockWatchlist();
  const cachedMetals = loadMetalsCache();

  if (cachedMetals?.currentPrices?.length > 0) {
    renderMetalsSection(cachedMetals.currentPrices, cachedMetals.lastFetched);
  }

  stockWatchlist.loadStocks(savedStocks);
  populateCurrencyOptions(currencies);
  renderStockWatchlist(stockWatchlist.getStocks());
  renderStocksUpdatedMeta(getLatestStockTimestamp(stockWatchlist.getStocks()));
}

const stockWatchlist = new StockWatchlist();

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
dom.stockWatchList.addEventListener('click', (event) => {
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
initializeApp();
