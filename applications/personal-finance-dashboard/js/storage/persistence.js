const STOCK_WATCHLIST_KEY = 'personalFinanceDashboard.stockWatchlist';
const METALS_CACHE_KEY = 'personalFinanceDashboard.metalsCache';

export function saveStockWatchlist(stocks) {
  localStorage.setItem(STOCK_WATCHLIST_KEY, JSON.stringify(stocks));
}

export function loadStockWatchlist() {
  const savedStocks = localStorage.getItem(STOCK_WATCHLIST_KEY);

  if (!savedStocks) return [];

  return JSON.parse(savedStocks);
}

export function saveMetalsCache(metalsCache) {
  localStorage.setItem(METALS_CACHE_KEY, JSON.stringify(metalsCache));
}

export function loadMetalsCache() {
  const savedCache = localStorage.getItem(METALS_CACHE_KEY);
  if (!savedCache) return null;

  const parsed = JSON.parse(savedCache);

  if (parsed.prices && !parsed.currentPrices) {
    localStorage.removeItem(METALS_CACHE_KEY);
    return null;
  }

  return parsed;
}
