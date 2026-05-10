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
