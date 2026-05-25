import {
  isValidStoredAsset,
  isValidStoredGoal,
  isValidStoredMetalDisplayData,
  isValidStoredMetalPrice,
} from '../utils/validators.js';

// ------------------------------------------------------------
// ------------------------Storage Keys------------------------
// ------------------------------------------------------------

const STOCK_WATCHLIST_KEY = 'personalFinanceDashboard.stockWatchlist';
const METALS_CACHE_KEY = 'personalFinanceDashboard.metalsCache';
const CURRENCY_WATCHLIST_KEY = 'personalFinanceDashboard.currencyWatchlist';
const CURRENCY_CACHE_KEY = 'personalFinanceDashboard.currencyCache';
const SAVINGS_GOALS_KEY = 'personalFinanceDashboard.savingsGoals';
const ASSET_PORTFOLIO_KEY = 'personalFinanceDashboard.assetPortfolio';

// ------------------------------------------------------------
// ----------------Stock Watchlist Persistence-----------------
// ------------------------------------------------------------

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

export function saveStockWatchlist(stocks) {
  savePersistenceCache(STOCK_WATCHLIST_KEY, stocks);
}

// ------------------------------------------------------------
// ------------------Metals Cache Persistence------------------
// ------------------------------------------------------------

export function loadMetalsCache() {
  const savedCache = localStorage.getItem(METALS_CACHE_KEY);

  if (!savedCache) return null;

  try {
    const parsedCache = JSON.parse(savedCache);

    if (parsedCache.prices && !parsedCache.currentPrices) {
      localStorage.removeItem(METALS_CACHE_KEY);
      return null;
    }

    const currentPrices = Array.isArray(parsedCache.currentPrices)
      ? parsedCache.currentPrices.filter(isValidStoredMetalDisplayData)
      : [];

    const previousPrices = Array.isArray(parsedCache.previousPrices)
      ? parsedCache.previousPrices.filter(isValidStoredMetalPrice)
      : [];

    return {
      lastFetched: typeof parsedCache.lastFetched === 'number' ? parsedCache.lastFetched : null,
      currentPrices,
      previousPrices,
    };
  } catch (error) {
    console.error(error);

    return null;
  }
}

export function saveMetalsCache(metalsCache) {
  savePersistenceCache(METALS_CACHE_KEY, metalsCache);
}

// ------------------------------------------------------------
// ---------------Currency Watchlist Persistence---------------
// ------------------------------------------------------------

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

export function saveCurrencyWatchlist(currencies) {
  savePersistenceCache(CURRENCY_WATCHLIST_KEY, currencies);
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
  savePersistenceCache(CURRENCY_CACHE_KEY, cache);
}

// ------------------------------------------------------------
// --------------Savings Goals Cache Persistence---------------
// ------------------------------------------------------------

export function loadSavingsGoalsCache() {
  const savedGoals = localStorage.getItem(SAVINGS_GOALS_KEY);

  if (!savedGoals) {
    return [];
  }

  try {
    const parsedGoals = JSON.parse(savedGoals);

    if (!Array.isArray(parsedGoals)) return [];

    return parsedGoals.filter(isValidStoredGoal);
  } catch (error) {
    console.error(error);

    return [];
  }
}

export function saveSavingsGoalsCache(goals) {
  savePersistenceCache(SAVINGS_GOALS_KEY, goals);
}

// ------------------------------------------------------------
// -----------Allocation Portfolio Cache Persistence-----------
// ------------------------------------------------------------

export function loadAssetPortfolioCache() {
  const savedAssets = localStorage.getItem(ASSET_PORTFOLIO_KEY);

  if (!savedAssets) return [];

  try {
    const parsedAssets = JSON.parse(savedAssets);

    if (!Array.isArray(parsedAssets)) return [];

    return parsedAssets.filter(isValidStoredAsset);
  } catch (error) {
    console.error(error);

    return [];
  }
}

export function saveAssetPortfolioCache(assets) {
  savePersistenceCache(ASSET_PORTFOLIO_KEY, assets);
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

function savePersistenceCache(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
