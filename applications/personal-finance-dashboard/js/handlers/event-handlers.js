import { dom } from '../ui/dom.js';
import { processCurrencyConversion } from '../workflows/currency-workflows.js';
import {
  processStockLookup,
  processStockRemoval,
  processClearStockWatchlist,
  processRefreshStockWatchlist,
} from '../workflows/stocks-workflows.js';
import {
  processCurrencyWatchlistAdd,
  processCurrencyWatchlistRefresh,
  processCurrencyWatchlistClear,
  processCurrencyWatchlistRemove,
} from '../workflows/currency-workflows.js';
import { processRefreshMetals } from '../workflows/metals-workflows.js';
import { showConfirmationModal, hideConfirmationModal } from '../ui/modals.js';
import { appState } from '../state/app-state.js';
import { searchStockSymbols } from '../api/stocks-api.js';
import { renderStockSearchResults } from '../ui/render.js';
import { showResultToast } from '../ui/notifications.js';

let stockSearchTimeout = null;

// ------------------------------------------------------------
// ----------------Currency Converter Handlers-----------------
// ------------------------------------------------------------

export async function handleConvertSubmit(event) {
  event.preventDefault();

  await handleCurrencyConversionResult();
}

export async function handleCurrencySwap() {
  const currentFromCurrency = dom.fromCurrency.value;
  const currentToCurrency = dom.toCurrency.value;

  if (!currentFromCurrency || !currentToCurrency) return;

  dom.fromCurrency.value = currentToCurrency;
  dom.toCurrency.value = currentFromCurrency;

  await handleCurrencyConversionResult();
}

// ------------------------------------------------------------
// ------------------Stock Watchlist Handlers------------------
// ------------------------------------------------------------

export async function handleStockSubmit(event, stockWatchList) {
  event.preventDefault();

  const result = await processStockLookup(stockWatchList);

  showResultToast(result);
}

export function handleStockWatchlistClick(event, stockWatchlist) {
  handleWatchlistRemoveClick(event, stockWatchlist, processStockRemoval);
}

export function handleClearStockWatchlistClick(stockWatchlist) {
  handleClearWatchlistConfirmation(() => {
    const result = processClearStockWatchlist(stockWatchlist);
    showResultToast(result);
  }, 'Stocks');
}

export async function handleRefreshStockWatchlistClick(stockWatchlist) {
  await handleRefreshAction(dom.refreshStocksBtn, async () => {
    const result = await processRefreshStockWatchlist(stockWatchlist);

    return result;
  });
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

// ------------------------------------------------------------
// ------------------Metals Tracker Handlers-------------------
// ------------------------------------------------------------

export async function handleRefreshMetalsClick() {
  await handleRefreshAction(dom.refreshMetalsBtn, processRefreshMetals);
}

// ------------------------------------------------------------
// ----------------Currency Watchlist Handlers-----------------
// ------------------------------------------------------------

export async function handleAddCurrencyClick(currencyWatchlist) {
  const result = await processCurrencyWatchlistAdd(currencyWatchlist);

  showResultToast(result);
}

export async function handleRefreshCurrenciesClick(currencyWatchlist) {
  await handleRefreshAction(dom.refreshCurrenciesBtn, () =>
    processCurrencyWatchlistRefresh(currencyWatchlist)
  );
}

export function handleClearCurrenciesClick(currencyWatchlist) {
  handleClearWatchlistConfirmation(() => {
    const result = processCurrencyWatchlistClear(currencyWatchlist);
    showResultToast(result);
  }, 'Currencies');
}

export function handleCurrencyWatchlistClick(event, currencyWatchlist) {
  handleWatchlistRemoveClick(event, currencyWatchlist, processCurrencyWatchlistRemove);
}

// ------------------------------------------------------------
// ----------------Confirmation Modal Handlers-----------------
// ------------------------------------------------------------

export function handleConfirmActionClick() {
  if (!appState.pendingConfirmationAction) return;

  try {
    appState.pendingConfirmationAction();
  } finally {
    appState.pendingConfirmationAction = null;
    hideConfirmationModal();
  }
}

export function handleCancelConfirmationClick() {
  appState.pendingConfirmationAction = null;
  hideConfirmationModal();
}

// ------------------------------------------------------------
// -----------------Internal Helper Functions------------------
// ------------------------------------------------------------

async function handleCurrencyConversionResult() {
  const result = await processCurrencyConversion();

  showResultToast(result);
}

async function handleRefreshAction(refreshButton, refreshWorkflow) {
  refreshButton.disabled = true;

  try {
    const result = await refreshWorkflow();

    showResultToast(result);
  } finally {
    refreshButton.disabled = false;
  }
}

function handleClearWatchlistConfirmation(onConfirm, itemLabel) {
  if (appState.pendingConfirmationAction) return;

  appState.pendingConfirmationAction = onConfirm;

  showConfirmationModal({
    title: `Clear ${itemLabel}?`,
    message: `This will remove <strong class="warning">ALL</strong> ${itemLabel.toLowerCase()} from your watchlist.`,
    confirmText: 'Clear List',
  });
}

function handleRemoveWatchlistItemConfirmation(onConfirm, symbol) {
  if (appState.pendingConfirmationAction) return;

  appState.pendingConfirmationAction = onConfirm;

  showConfirmationModal({
    title: `Remove ${symbol}?`,
    message: `This will remove <strong class="danger">${symbol}</strong> from your watchlist.`,
    confirmText: 'Remove',
  });
}

function handleWatchlistRemoveClick(event, watchlist, removeWorkflow) {
  const removeButton = event.target.closest('.remove-icon-btn');

  if (!removeButton) return;

  const { symbol } = removeButton.dataset;

  handleRemoveWatchlistItemConfirmation(async () => {
    const result = await removeWorkflow(watchlist, symbol);
    showResultToast(result);
  }, symbol);
}
