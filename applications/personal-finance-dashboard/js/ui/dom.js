export const dom = {
  // ------------------------------------------------------------
  // Currency Converter
  // ------------------------------------------------------------

  amountInput: document.getElementById('amount'),
  fromCurrency: document.getElementById('from-currency'),
  toCurrency: document.getElementById('to-currency'),
  resultValue: document.getElementById('result-value'),
  resultMeta: document.getElementById('result-meta'),
  converterForm: document.getElementById('converter-form'),
  convertCurrencyBtn: document.getElementById('convert-currency-btn'),
  swapBtn: document.getElementById('swap-btn'),
  addCurrencyBtn: document.getElementById('add-currency-btn'),

  // ------------------------------------------------------------
  // Stock Watchlist
  // ------------------------------------------------------------

  stockWatchlist: document.getElementById('stock-watchlist'),
  stockSymbolInput: document.getElementById('stock-symbol'),
  stockForm: document.getElementById('stock-form'),
  stockSearchResults: document.getElementById('stock-search-results'),
  refreshStocksBtn: document.getElementById('refresh-stocks-btn'),
  clearStocksBtn: document.getElementById('clear-stocks-btn'),
  stocksUpdatedMeta: document.getElementById('stocks-updated-meta'),

  // ------------------------------------------------------------
  // Metals Tracker
  // ------------------------------------------------------------

  metalsList: document.getElementById('metals-list'),
  refreshMetalsBtn: document.getElementById('refresh-metals-btn'),
  metalsUpdatedMeta: document.getElementById('metals-updated-meta'),

  // ------------------------------------------------------------
  // Currency Watchlist
  // ------------------------------------------------------------

  currencyWatchlist: document.getElementById('currency-watchlist'),
  refreshCurrenciesBtn: document.getElementById('refresh-currencies-btn'),
  clearCurrenciesBtn: document.getElementById('clear-currencies-btn'),
  currencyUpdatedMeta: document.getElementById('currency-updated-meta'),

  // ------------------------------------------------------------
  // Savings Goals
  // ------------------------------------------------------------

  savingsGoalsList: document.getElementById('savings-goals-list'),
  addGoalBtn: document.getElementById('add-goal-btn'),
  clearGoalsBtn: document.getElementById('clear-goals-btn'),

  // ------------------------------------------------------------
  // Savings Goals Form
  // ------------------------------------------------------------

  savingsGoalsOverlay: document.getElementById('savings-goals-overlay'),
  goalForm: document.getElementById('goal-form'),
  goalFormTitle: document.getElementById('goal-form-title'),
  goalNameInput: document.getElementById('goal-name'),
  goalTargetAmountInput: document.getElementById('goal-target-amount'),
  goalCurrentAmountInput: document.getElementById('goal-current-amount'),
  goalTargetDateInput: document.getElementById('goal-target-date'),
  saveGoalBtn: document.getElementById('save-goal-btn'),
  cancelGoalBtn: document.getElementById('cancel-goal-btn'),

  // ------------------------------------------------------------
  // Asset Portfolio
  // ------------------------------------------------------------

  assetPortfolioMeta: document.getElementById('asset-portfolio-meta'),
  assetPortfolioList: document.getElementById('asset-portfolio-list'),
  assetAllocationChart: document.getElementById('asset-allocation-chart'),
  addAssetBtn: document.getElementById('add-asset-btn'),
  clearAssetsBtn: document.getElementById('clear-assets-btn'),

  // ------------------------------------------------------------
  // Asset Portfolio Form
  // ------------------------------------------------------------

  assetPortfolioOverlay: document.getElementById('asset-portfolio-overlay'),
  assetForm: document.getElementById('asset-form'),
  assetFormTitle: document.getElementById('asset-form-title'),
  assetCategoryInput: document.getElementById('asset-category-input'),
  assetAmountInput: document.getElementById('asset-amount-input'),
  saveAssetBtn: document.getElementById('save-asset-btn'),
  cancelAssetBtn: document.getElementById('cancel-asset-btn'),

  // ------------------------------------------------------------
  // Asset Details Form
  // ------------------------------------------------------------

  assetDetailsOverlay: document.getElementById('asset-details-overlay'),
  assetDetailsForm: document.getElementById('asset-details-form'),
  assetDetailsTitle: document.getElementById('asset-details-title'),
  assetDetailsList: document.getElementById('asset-details-list'),
  closeAssetDetailsBtn: document.getElementById('close-asset-details-btn'),

  // ------------------------------------------------------------
  // Dashboard Data Actions
  // ------------------------------------------------------------

  exportDashboardBtn: document.getElementById('export-dashboard-btn'),
  importDashboardBtn: document.getElementById('import-dashboard-btn'),
  importDashboardInput: document.getElementById('import-dashboard-input'),
  clearDashboardDataBtn: document.getElementById('clear-dashboard-data-btn'),
  // ------------------------------------------------------------
  // Confirmation Modal
  // ------------------------------------------------------------

  confirmationModal: document.getElementById('confirmation-modal'),
  confirmationTitle: document.getElementById('confirmation-title'),
  confirmationMessage: document.getElementById('confirmation-message'),
  confirmActionBtn: document.getElementById('confirm-action-btn'),
  cancelConfirmationBtn: document.getElementById('cancel-confirmation-btn'),

  // ------------------------------------------------------------
  // Notifications
  // ------------------------------------------------------------

  toastContainer: document.getElementById('toast-container'),
};
