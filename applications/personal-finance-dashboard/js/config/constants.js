export const stockMessages = {
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
  },
  success: {
    stockAdded: 'Stock added to watchlist',
    stockRemoved: 'Stock removed from watchlist',
    stocksCleared: 'Stock watchlist successfully cleared',
    stocksReplaced: 'Watchlist updated successfully',
    metalsRefreshed: 'Metal prices updated',
    metalsLoadedFromCache: 'Using recently loaded metal prices',
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
