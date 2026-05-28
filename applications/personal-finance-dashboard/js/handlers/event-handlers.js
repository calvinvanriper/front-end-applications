import { dom } from '../ui/dom.js';
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
  processCurrencyConversion,
} from '../workflows/currency-workflows.js';
import { processRefreshMetals } from '../workflows/metals-workflows.js';
import {
  processGoalFormSubmit,
  processGoalsClear,
  processGoalRemove,
  processGoalUpdate,
} from '../workflows/savings-workflows.js';
import {
  processAssetFormSubmit,
  processAssetsClear,
  processAssetRemove,
} from '../workflows/assets-workflows.js';
import {
  processDashboardExport,
  processDashboardImport,
  processDashboardDataClear,
} from '../workflows/dashboard-backup-workflows.js';
import { showConfirmationModal, hideConfirmationModal } from '../ui/modals.js';
import { appState } from '../state/app-state.js';
import { searchStockSymbols } from '../api/stocks-api.js';
import {
  setAddCurrencyButtonState,
  renderStockSearchResults,
  showGoalForm,
  hideGoalForm,
  populateGoalForm,
  resetGoalForm,
  showAssetForm,
  hideAssetForm,
  showAssetDetailsOverlay,
  hideAssetDetailsOverlay,
  populateAssetForm,
} from '../ui/render.js';
import { showResultToast } from '../ui/notifications.js';
import { formatCurrency } from '../utils/formatters.js';
import { getAssetCategoryLabel } from '../config/asset-categories.js';

let stockSearchTimeout = null;

// ------------------------------------------------------------
// ------------------Dashboard Data Handlers-------------------
// ------------------------------------------------------------

export function handleExportDashboardClick(dashboardModels) {
  const result = processDashboardExport(dashboardModels);

  if (result.success) {
    downloadJsonFile(result.data.fileName, result.data.backupJson);
  }

  showResultToast(result);
}

export function handleImportDashboardClick() {
  dom.importDashboardInput.click();
}

export async function handleDashboardImportFileChange(
  event,
  { stockWatchlist, currencyWatchlist, savingsGoals, assetPortfolio }
) {
  const selectedFile = event.target.files[0];

  if (!selectedFile) return;

  try {
    const backupJson = await selectedFile.text();

    const result = await processDashboardImport(backupJson, {
      stockWatchlist,
      currencyWatchlist,
      savingsGoals,
      assetPortfolio,
    });

    showResultToast(result);
  } catch (error) {
    console.error(error);

    showResultToast({
      success: false,
      reason: 'dashboardImportFailed',
    });
  } finally {
    event.target.value = '';
  }
}

export function handleClearDashboardDataClick({
  stockWatchlist,
  currencyWatchlist,
  savingsGoals,
  assetPortfolio,
}) {
  requestConfirmation({
    onConfirm: () => {
      const result = processDashboardDataClear({
        stockWatchlist,
        currencyWatchlist,
        savingsGoals,
        assetPortfolio,
      });

      showResultToast(result);
    },
    title: 'Clear dashboard data?',
    message:
      'This will remove <strong class="warning">ALL</strong> saved stocks, currencies, savings goals, and asset allocations. API caches will be kept.',
    confirmText: 'Clear Data',
  });
}

function downloadJsonFile(fileName, jsonContent) {
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = fileName;
  downloadLink.click();

  URL.revokeObjectURL(url);
}
// ------------------------------------------------------------
// ----------------Currency Converter Handlers-----------------
// ------------------------------------------------------------

export async function handleConvertSubmit(event) {
  event.preventDefault();

  appState.latestSuccessfulConversion = null;
  setAddCurrencyButtonState(false);

  const conversionData = {
    amount: Number(dom.amountInput.value),
    fromCurrency: dom.fromCurrency.value,
    toCurrency: dom.toCurrency.value,
  };

  const result = await handleCurrencyConversionResult(conversionData);

  if (result.success) {
    appState.latestSuccessfulConversion = result.data;
    setAddCurrencyButtonState(true);
  }

  showResultToast(result);
}

export async function handleCurrencySwap() {
  const currentFromCurrency = dom.fromCurrency.value;
  const currentToCurrency = dom.toCurrency.value;

  if (!currentFromCurrency || !currentToCurrency) return;

  dom.fromCurrency.value = currentToCurrency;
  dom.toCurrency.value = currentFromCurrency;

  const conversionData = {
    amount: Number(dom.amountInput.value),
    fromCurrency: dom.fromCurrency.value,
    toCurrency: dom.toCurrency.value,
  };

  const result = await handleCurrencyConversionResult(conversionData);

  showResultToast(result);
}

// ------------------------------------------------------------
// ------------------Stock Watchlist Handlers------------------
// ------------------------------------------------------------

export async function handleStockSubmit(event, stockWatchList) {
  event.preventDefault();

  const symbolInput = dom.stockSymbolInput.value.trim();
  const stockName = dom.stockSymbolInput.dataset.selectedName || null;

  const result = await processStockLookup(stockWatchList, symbolInput, stockName);

  showResultToast(result);

  dom.stockSymbolInput.value = '';
  delete dom.stockSymbolInput.dataset.selectedName;
  renderStockSearchResults([]);
}

export function handleStockWatchlistClick(event, stockWatchlist) {
  handleCollectionItemRemoveClick(event, stockWatchlist, processStockRemoval);
}

export async function handleRefreshStockWatchlistClick(stockWatchlist) {
  await handleRefreshAction(dom.refreshStocksBtn, async () => {
    const result = await processRefreshStockWatchlist(stockWatchlist);

    return result;
  });
}

export function handleClearStockWatchlistClick(stockWatchlist) {
  handleClearCollectionConfirmation({
    onConfirm: () => {
      const result = processClearStockWatchlist(stockWatchlist);
      showResultToast(result);
    },
    titleLabel: 'Stocks',
    messageLabel: 'stocks from your watchlist',
    confirmText: 'Clear List',
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

  const symbol = selectedResult.dataset.itemId;
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

export function handleCurrencyWatchlistClick(event, currencyWatchlist) {
  handleCollectionItemRemoveClick(event, currencyWatchlist, processCurrencyWatchlistRemove);
}

export async function handleRefreshCurrenciesClick(currencyWatchlist) {
  await handleRefreshAction(dom.refreshCurrenciesBtn, () =>
    processCurrencyWatchlistRefresh(currencyWatchlist)
  );
}

export function handleClearCurrenciesClick(currencyWatchlist) {
  handleClearCollectionConfirmation({
    onConfirm: () => {
      const result = processCurrencyWatchlistClear(currencyWatchlist);
      showResultToast(result);
    },
    titleLabel: 'Currencies',
    messageLabel: 'currencies from your watchlist',
    confirmText: 'Clear List',
  });
}

// ------------------------------------------------------------
// -------------------Savings Goals Handlers-------------------
// ------------------------------------------------------------

export function handleAddGoalClick() {
  appState.editingGoalId = null;
  showGoalForm(false);
}

export function handleGoalFormSubmit(event, savingsGoals) {
  event.preventDefault();

  const goalFormData = {
    name: dom.goalNameInput.value.trim(),
    targetAmount: Number(dom.goalTargetAmountInput.value),
    currentAmount: Number(dom.goalCurrentAmountInput.value),
    targetDate: dom.goalTargetDateInput.value,
  };

  const result = appState.editingGoalId
    ? processGoalUpdate(savingsGoals, appState.editingGoalId, goalFormData)
    : processGoalFormSubmit(savingsGoals, goalFormData);

  showResultToast(result);

  if (result.success) {
    appState.editingGoalId = null;

    resetGoalForm();
    hideGoalForm();
  }
}

export function handleSavingsGoalsClick(event, savingsGoals) {
  const updateBtn = event.target.closest('.icon-btn--update');

  if (updateBtn) {
    const { itemId } = updateBtn.dataset;

    const goal = savingsGoals.getGoals().find((goal) => goal.id === itemId);

    appState.editingGoalId = itemId;

    populateGoalForm(goal);
    showGoalForm(true);

    return;
  }

  handleCollectionItemRemoveClick(event, savingsGoals, processGoalRemove, (goalId) => {
    const goal = savingsGoals.getGoals().find((goal) => goal.id === goalId);
    return goal?.name ?? 'Savings Goal';
  });
}

export function handleClearGoalsClick(savingsGoals) {
  handleClearCollectionConfirmation({
    onConfirm: () => {
      const result = processGoalsClear(savingsGoals);
      showResultToast(result);
    },
    titleLabel: 'Savings Goals',
    messageLabel: 'savings goals',
    confirmText: 'Clear Goals',
  });
}

export function handleCancelGoalClick() {
  appState.editingGoalId = null;

  resetGoalForm();
  hideGoalForm();
}

// ------------------------------------------------------------
// ------------------Asset Portfolio Handlers------------------
// ------------------------------------------------------------

export function handleAddAssetClick() {
  appState.editingAssetId = null;
  dom.assetForm.reset();
  showAssetForm(false);
}

export function handleAssetFormSubmit(event, assetPortfolio) {
  event.preventDefault();

  const editingAssetId = appState.editingAssetId;

  const assetFormData = {
    category: dom.assetCategoryInput.value,
    amount: Number(dom.assetAmountInput.value),
  };

  const result = processAssetFormSubmit(assetPortfolio, assetFormData, editingAssetId);

  if (!result.success) return;

  const updatedCategory = assetFormData.category;

  appState.editingAssetId = null;
  hideAssetForm();
  showResultToast(result);

  if (editingAssetId) {
    const updatedCategoryAssets = assetPortfolio
      .getAssets()
      .filter((asset) => asset.category === updatedCategory);

    showAssetDetailsOverlay(updatedCategoryAssets, updatedCategory);
  }
}

export function handleAssetPortfolioListClick(event, assetPortfolio) {
  const detailsButton = event.target.closest('.icon-btn--details');

  if (!detailsButton) return;

  const { assetCategory } = detailsButton.dataset;

  const categoryAssets = assetPortfolio
    .getAssets()
    .filter((asset) => asset.category === assetCategory);

  showAssetDetailsOverlay(categoryAssets, assetCategory);
}

export function handleAssetDetailsClick(event, assetPortfolio) {
  const actionButton = event.target.closest('[data-asset-action]');

  if (!actionButton) return;

  const { assetId, assetCategory, assetAction } = actionButton.dataset;

  const asset = assetPortfolio.getAssets().find((asset) => asset.id === assetId);

  if (!asset) return;

  if (assetAction === 'remove') {
    const assetLabel = getAssetCategoryLabel(assetCategory);

    handleRemoveAssetConfirmation(
      () => {
        const result = processAssetRemove(assetPortfolio, assetId);

        if (!result.success) return;

        showResultToast(result);

        const updatedCategoryAssets = assetPortfolio
          .getAssets()
          .filter((asset) => asset.category === assetCategory);

        if (updatedCategoryAssets.length === 0) {
          hideAssetDetailsOverlay();
          return;
        }

        showAssetDetailsOverlay(updatedCategoryAssets, assetCategory);
      },
      assetLabel,
      asset.amount
    );
  }

  if (assetAction === 'update') {
    appState.editingAssetId = assetId;

    hideAssetDetailsOverlay();
    populateAssetForm(asset);
    showAssetForm(true);
  }
}

export function handleClearAssetsClick(assetPortfolio) {
  handleClearCollectionConfirmation({
    onConfirm: () => {
      const result = processAssetsClear(assetPortfolio);
      showResultToast(result);
    },
    titleLabel: 'Assets',
    messageLabel: 'asset portfolio',
    confirmText: 'Clear Assets',
  });
}

export function handleCancelAssetClick() {
  hideAssetForm();
}

export function handleCloseAssetDetailsClick() {
  hideAssetDetailsOverlay();
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
  appState.latestSuccessfulConversion = null;
  setAddCurrencyButtonState(false);

  const conversionData = {
    amount: Number(dom.amountInput.value),
    fromCurrency: dom.fromCurrency.value,
    toCurrency: dom.toCurrency.value,
  };

  const result = await processCurrencyConversion(conversionData);

  if (result.success) {
    appState.latestSuccessfulConversion = result.data;
    setAddCurrencyButtonState(true);
  }

  return result;
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

function handleCollectionItemRemoveClick(
  event,
  collection,
  removeWorkflow,
  getDisplayLabel = (value) => value
) {
  const removeButton = event.target.closest('.icon-btn--danger');

  if (!removeButton) return;

  const { itemId } = removeButton.dataset;

  const displayLabel = getDisplayLabel(itemId);

  handleRemoveCollectionItemConfirmation(async () => {
    const result = await removeWorkflow(collection, itemId);
    showResultToast(result);
  }, displayLabel);
}

function requestConfirmation({ onConfirm, title, message, confirmText }) {
  if (appState.pendingConfirmationAction) return;

  appState.pendingConfirmationAction = onConfirm;

  showConfirmationModal({
    title,
    message,
    confirmText,
  });
}

function handleClearCollectionConfirmation({
  onConfirm,
  titleLabel,
  messageLabel,
  confirmText = 'Clear',
}) {
  requestConfirmation({
    onConfirm,
    title: `Clear ${titleLabel}?`,
    message: `This will remove <strong class="warning">ALL</strong> ${messageLabel}.`,
    confirmText,
  });
}

function handleRemoveCollectionItemConfirmation(onConfirm, itemLabel) {
  requestConfirmation({
    onConfirm,
    title: `Remove ${itemLabel}?`,
    message: `This will remove <strong class="danger">${itemLabel}</strong>.`,
    confirmText: 'Remove',
  });
}

function handleRemoveAssetConfirmation(onConfirm, assetLabel, amount) {
  requestConfirmation({
    onConfirm,
    title: `Remove ${assetLabel} asset?`,
    message: `This will remove the <strong class="danger">${assetLabel}</strong> asset allocation of <strong>${formatCurrency(amount, 'USD')}</strong>.`,
    confirmText: 'Remove',
  });
}
