const STOCK_WATCHLIST_KEY = 'personalFinanceDashboard.stockWatchlist';
const METALS_CACHE_KEY = 'personalFinanceDashboard.metalsCache';
const CURRENCY_WATCHLIST_STORAGE_KEY = 'personalFinanceDashboard.currencyWatchlist';
const CURRENCY_RATES_CACHE_KEY = 'personalFinanceDashboard.currencyCache';

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

export function saveCurrencyWatchlist(currencies) {
  localStorage.setItem(CURRENCY_WATCHLIST_STORAGE_KEY, JSON.stringify(currencies));
}

export function loadCurrencyWatchlist() {
  const savedCurrencies = localStorage.getItem(CURRENCY_WATCHLIST_STORAGE_KEY);

  if (!savedCurrencies) return [];

  try {
    const parsedCurrencies = JSON.parse(savedCurrencies);

    if (!Array.isArray(parsedCurrencies)) return [];

    return parsedCurrencies;
  } catch (error) {
    console.error(error);

    return [];
  }
}

export function loadCurrencyRatesCache() {
  const savedCache = localStorage.getItem(CURRENCY_RATES_CACHE_KEY);

  if (!savedCache) {
    return {
      lastFetched: null,
      currentRates: {},
      previousRates: {},
    };
  }

  try {
    const parsedCache = JSON.parse(savedCache);

    return {
      lastFetched: parsedCache.lastFetched ?? null,
      currentRates: parsedCache.currentRates ?? {},
      previousRates: parsedCache.previousRates ?? {},
    };
  } catch (error) {
    console.error(error);

    return {
      lastFetched: null,
      currentRates: {},
      previousRates: {},
    };
  }
}

export function saveCurrencyRatesCache(cache) {
  localStorage.setItem(CURRENCY_RATES_CACHE_KEY, JSON.stringify(cache));
}
