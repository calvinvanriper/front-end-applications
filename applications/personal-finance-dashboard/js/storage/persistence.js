const STOCK_WATCHLIST_KEY = 'personalFinanceDashboard.stockWatchlist';

export function saveStockWatchlist(stocks) {
  localStorage.setItem(STOCK_WATCHLIST_KEY, JSON.stringify(stocks));
}

export function loadStockWatchlist() {
  const savedStocks = localStorage.getItem(STOCK_WATCHLIST_KEY);

  if (!savedStocks) return [];

  return JSON.parse(savedStocks);
}
