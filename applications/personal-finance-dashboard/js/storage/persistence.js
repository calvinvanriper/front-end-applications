// ------------------------------------------------------------
// ------------------------Storage Keys------------------------
// ------------------------------------------------------------

const STOCK_WATCHLIST_KEY = 'personalFinanceDashboard.stockWatchlist';
const METALS_CACHE_KEY = 'personalFinanceDashboard.metalsCache';
const CURRENCY_WATCHLIST_KEY = 'personalFinanceDashboard.currencyWatchlist';
const CURRENCY_CACHE_KEY = 'personalFinanceDashboard.currencyCache';

// ------------------------------------------------------------
// ----------------Stock Watchlist Persistence-----------------
// ------------------------------------------------------------

export function saveStockWatchlist(stocks) {
  localStorage.setItem(STOCK_WATCHLIST_KEY, JSON.stringify(stocks));
}

export function loadStockWatchlist() {
  const savedStocks = localStorage.getItem(STOCK_WATCHLIST_KEY);

  if (!savedStocks) return [];

  try {
    const parsedStocks = JSON.parse(savedStocks);

    if (!Array.isArray(parsedStocks)) return [];

    return parsedStocks;
  } catch (error) {
    console.error(error);

    return [];
  }
}

// ------------------------------------------------------------
// ------------------Metals Cache Persistence------------------
// ------------------------------------------------------------

export function saveMetalsCache(metalsCache) {
  localStorage.setItem(METALS_CACHE_KEY, JSON.stringify(metalsCache));
}

export function loadMetalsCache() {
  const savedCache = localStorage.getItem(METALS_CACHE_KEY);

  if (!savedCache) return null;

  try {
    const parsedCache = JSON.parse(savedCache);

    if (parsedCache.prices && !parsedCache.currentPrices) {
      localStorage.removeItem(METALS_CACHE_KEY);
      return null;
    }

    return {
      lastFetched: parsedCache.lastFetched ?? null,
      currentPrices: parsedCache.currentPrices ?? [],
      previousPrices: parsedCache.previousPrices ?? [],
    };
  } catch (error) {
    console.error(error);

    return null;
  }
}

// ------------------------------------------------------------
// ---------------Currency Watchlist Persistence---------------
// ------------------------------------------------------------

export function saveCurrencyWatchlist(currencies) {
  localStorage.setItem(CURRENCY_WATCHLIST_KEY, JSON.stringify(currencies));
}

export function loadCurrencyWatchlist() {
  const savedCurrencies = localStorage.getItem(CURRENCY_WATCHLIST_KEY);

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

// ------------------------------------------------------------
// --------------Currency Rates Cache Persistence--------------
// ------------------------------------------------------------

export function loadCurrencyRatesCache() {
  const savedCache = localStorage.getItem(CURRENCY_CACHE_KEY);

  if (!savedCache) {
    return getDefaultCurrencyRatesCache();
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

    return getDefaultCurrencyRatesCache();
  }
}

export function saveCurrencyRatesCache(cache) {
  localStorage.setItem(CURRENCY_CACHE_KEY, JSON.stringify(cache));
}

// ------------------------------------------------------------
// ----------------------Internal Helpers----------------------
// ------------------------------------------------------------

function getDefaultCurrencyRatesCache() {
  return {
    lastFetched: null,
    currentRates: {},
    previousRates: {},
  };
}
