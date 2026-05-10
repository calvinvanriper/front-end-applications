// ------------------------------------------------------------
// -----------------------Refresh Timing-----------------------
// ------------------------------------------------------------

export const METALS_REFRESH_COOLDOWN_MS = 8 * 60 * 60 * 1000;

// ------------------------------------------------------------
// ----------------Currency Watchlist Defaults-----------------
// ------------------------------------------------------------

export const BASE_CURRENCY = 'USD';
export const BASE_AMOUNT = 100;

// ------------------------------------------------------------
// -----------------------Toast Messages-----------------------
// ------------------------------------------------------------

export const toastMessages = {
  error: {
    // Stock Watchlist
    duplicateStock: 'Stock already added to watchlist',
    emptyWatchlist: 'Cannot refresh empty watchlist',
    stocksRefreshFailed: 'Unable to refresh watchlist',
    stocksPartialRefresh: 'Some stocks could not be refreshed',
    emptyStockSymbol: 'Enter a stock symbol first',
    stockLookupFailed: 'Unable to find stock quote',
    stockRemovalFailed: 'Unable to remove stock',
    stockNotFound: 'Stock not found in watchlist',

    // Metals Tracker
    metalsRefreshFailed: 'Unable to refresh metal prices',
    metalsPartialRefresh: 'Some metal prices could not be refreshed',
    emptyMetalsList: 'No metals available to refresh',
    invalidMetalData: 'Metal price data is incomplete',
    metalsLoadedFromCacheAfterError: 'Unable to refresh metals; showing last saved prices',

    // Currency Converter
    invalidCurrencyAmount: 'Enter a valid amount greater than 0',
    currencyConverterFailed: 'Unable to convert currency at this time',

    // Currency Watchlist
    duplicateCurrency: 'Currency already in watchlist',
    currencyWatchlistFull: 'You can only track up to 4 currencies',
    currencyRemovalFailed: 'Unable to remove currency',
    emptyCurrencyWatchlist: 'No currencies to clear',
    currencyConversionRequired: 'Convert a currency before adding it to the watchlist',
    currencyNotFound: 'Currency not found in watchlist',
  },
  success: {
    // Stock Watchlist
    stockAdded: 'Stock added to watchlist',
    stockRemoved: 'Stock removed from watchlist',
    stocksCleared: 'Stock watchlist successfully cleared',
    stocksReplaced: 'Watchlist updated successfully',

    // Metals Tracker
    metalsRefreshed: 'Metal prices updated',
    metalsLoadedFromCache: 'Using recently loaded metal prices',

    // Currency Converter
    currencyConverted: 'Currency conversion successful',

    // Currency Watchlist
    currencyAdded: 'Currency added to watchlist',
    currenciesCleared: 'Currency watchlist cleared',
    currenciesRefreshed: 'Currency rates updated',
    currencyRemoved: 'Currency removed from watchlist',
  },
};

// ------------------------------------------------------------
// --------------------Metals Configuration--------------------
// ------------------------------------------------------------

export const metals = [
  {
    symbol: 'XAU',
    name: 'Gold',
  },
  {
    symbol: 'XAG',
    name: 'Silver',
  },
  {
    symbol: 'XPT',
    name: 'Platinum',
  },
  {
    symbol: 'XPD',
    name: 'Palladium',
  },
];
