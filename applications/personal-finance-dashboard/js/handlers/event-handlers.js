import { dom } from '../ui/dom.js';
import { processCurrencyConversion } from '../workflows/currency-workflows.js';
import {
  processStockLookup,
  processStockRemoval,
  processClearStockWatchlist,
  processRefreshStockWatchlist,
} from '../workflows/stocks-workflows.js';
import { processRefreshMetals } from '../workflows/metals-workflows.js';
import { showConfirmationModal, hideConfirmationModal } from '../ui/modals.js';
import { appState } from '../state/app-state.js';
import { searchStockSymbols } from '../api/stocks-api.js';
import { renderStockSearchResults, renderStocksUpdatedMeta } from '../ui/render.js';
import { showResultToast } from '../ui/notifications.js';
import { getLatestStockTimestamp } from '../utils/formatters.js';

let stockSearchTimeout = null;

export async function handleConvertSubmit() {
  event.preventDefault();
  await processCurrencyConversion();
}

export async function handleCurrencySwap() {
  const currentFromCurrency = dom.fromCurrency.value;
  const currentToCurrency = dom.toCurrency.value;

  if (!currentFromCurrency || !currentToCurrency) return;

  dom.fromCurrency.value = currentToCurrency;
  dom.toCurrency.value = currentFromCurrency;

  await processCurrencyConversion();
}

export function handleStockSubmit(event, stockWatchList) {
  event.preventDefault();

  const result = processStockLookup(stockWatchList);

  showResultToast(result);
}

export function handleStockWatchlistClick(event, stockWatchlist) {
  const clickedButton = event.target.closest('[data-action]');

  if (!clickedButton) return;

  const { action, symbol } = clickedButton.dataset;

  if (action === 'remove') {
    appState.pendingConfirmationAction = () => {
      const result = processStockRemoval(stockWatchlist, symbol);
      showResultToast(result);
    };

    showConfirmationModal({
      title: `Clear ${symbol}`,
      message: `This will remove <strong class="warning">${symbol}</strong> from your watchlist.`,
      confirmText: `Remove`,
    });
  }
}

export function handleClearStockWatchlistClick(stockWatchlist) {
  if (appState.pendingConfirmationAction) return;

  appState.pendingConfirmationAction = () => {
    const result = processClearStockWatchlist(stockWatchlist);
    showResultToast(result);
  };

  showConfirmationModal({
    title: 'Clear Watchlist?',
    message: 'This will remove <strong class="warning">ALL</strong> stocks from your watchlist.',
    confirmText: 'Clear List',
  });
}

export function handleConfirmActionClick() {
  if (!appState.pendingConfirmationAction) return;

  try {
    if (appState.pendingConfirmationAction) {
      appState.pendingConfirmationAction();
    }
  } finally {
    appState.pendingConfirmationAction = null;
    hideConfirmationModal();
  }
}

export function handleCancelConfirmationClick() {
  appState.pendingConfirmationAction = null;
  hideConfirmationModal();
}

export async function handleRefreshStockWatchlistClick(stockWatchlist) {
  let result;
  dom.refreshStocksBtn.disabled = true;

  try {
    result = await processRefreshStockWatchlist(stockWatchlist);
  } catch (error) {
    console.error(error);

    result = {
      success: false,
      reason: 'stocksRefreshFailed',
    };
  } finally {
    dom.refreshStocksBtn.disabled = false;
  }

  renderStocksUpdatedMeta(getLatestStockTimestamp(stockWatchlist.getStocks()));
  showResultToast(result);
}

export function handleStockSymbolInput() {
  const query = dom.stockSymbolInput.value.trim();

  clearTimeout(stockSearchTimeout);

  if (query.length < 2) {
    renderStockSearchResults([]);
    return;
  }

  stockSearchTimeout = setTimeout(async () => {
    try {
      const results = await searchStockSymbols(query);
      renderStockSearchResults(results);
    } catch (error) {
      console.error('Unable to search stock symbols:', error);
      renderStockSearchResults([]);
    }
  }, 300);
}

export function handleStockSearchResultClick(event) {
  const selectedResult = event.target.closest('.stock-search-item');

  if (!selectedResult) return;

  const symbol = selectedResult.dataset.symbol;
  const name = selectedResult.dataset.name;

  dom.stockSymbolInput.value = symbol;
  dom.stockSymbolInput.dataset.selectedName = name;

  renderStockSearchResults([]);
  dom.stockSymbolInput.focus();
}

export async function handleRefreshMetalsClick() {
  let result;

  dom.refreshMetalsBtn.disabled = true;

  try {
    result = await processRefreshMetals();
  } catch (error) {
    console.error(error);

    result = {
      success: false,
      reason: 'metalsRefreshFailed',
    };
  } finally {
    dom.refreshMetalsBtn.disabled = false;
  }

  showResultToast(result);
}
