export const toastMessages = {
  errors: {
    duplicateStock: 'Stock already added to watchlist',
    emptyWatchlist: 'Cannot refresh empty watchlist',
    stocksRefreshFailed: 'Unable to refresh watchlist',
    stocksPartialRefresh: 'Some stocks could not be refreshed',
    emptyStockSymbol: 'Enter a stock symbol first',
    stockLookupFailed: 'Unable to find stock quote',
    stockRemovalFailed: 'Unable to remove stock',
    metalsRefreshFailed: 'Unable to refresh metal prices',
    metalsPartialRefresh: 'Some metal prices could not be refreshed',
    emptyMetalsList: 'No metals available to refresh',
    metalsLoadedFromCacheAfterError: 'Unable to refresh metals; showing last saved prices',
    invalidCurrencyAmount: 'Enter a valid amount greater than 0',
    currencyConversionFailed: 'Unable to convert currency at this time',
    duplicateCurrency: 'Currency already in watchlist',
    currencyWatchlistFull: 'You can only track up to 4 currencies',
    currencyRemovalFailed: 'Unable to remove currency',
    emptyCurrencyWatchlist: 'No currencies to clear',
    currencyConversionRequired: 'Convert a currency before adding it to the watchlist',
  },
  success: {
    stockAdded: 'Stock added to watchlist',
    stockRemoved: 'Stock removed from watchlist',
    stocksCleared: 'Stock watchlist successfully cleared',
    stocksReplaced: 'Watchlist updated successfully',
    metalsRefreshed: 'Metal prices updated',
    metalsLoadedFromCache: 'Using recently loaded metal prices',
    currencyConverted: 'Currency conversion successful',
    currencyAdded: 'Currency added to watchlist',
    currenciesCleared: 'Currency watchlist cleared',
    currenciesRefreshed: 'Currency rates updated',
    currencyRemoved: 'Currency removed from watchlist',
  },
};

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

export const METALS_REFRESH_COOLDOWN_MS = 8 * 60 * 60 * 1000;
export const BASE_CURRENCY = 'USD';
export const BASE_AMOUNT = 100;
