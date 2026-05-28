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

export const TOAST_MESSAGES = {
  error: {
    // Dashboard Data
    dashboardImportFailed: 'Unable to import dashboard data',
    invalidDashboardBackup: 'Invalid dashboard backup file',
    dashboardClearFailed: 'Unable to clear dashboard data',

    // Stock Watchlist
    duplicateStock: 'Stock already added to watchlist',
    emptyWatchlist: 'Cannot refresh empty watchlist',
    emptyStockWatchlist: 'Cannot clear empty stock watchlist',
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
    currencyRatesFailed: 'Unable to refresh currency rates',

    // Currency Watchlist
    duplicateCurrency: 'Currency already in watchlist',
    currencyWatchlistFull: 'You can only track up to 4 currencies',
    currencyRemovalFailed: 'Unable to remove currency',
    emptyCurrencyWatchlist: 'No currencies to clear',
    emptyCurrencyWatchlistRefresh: 'No currencies to refresh',
    currencyConversionRequired: 'Convert a currency before adding it to the watchlist',
    currencyNotFound: 'Currency not found in watchlist',
    invalidCurrencyData: 'Failed to replace currency data',

    // Goals
    goalNotFound: 'Savings goal not found',
    emptyGoalsList: 'No savings goals to clear',
    invalidGoalName: 'Enter a valid goal name',
    invalidGoalTargetAmount: 'Enter a valid target amount',
    invalidGoalCurrentAmount: 'Enter a valid current amount',
    invalidGoalTargetDate: 'Enter a valid target date',
    invalidGoalData: 'Failed to replace savings goal data',

    // Assets
    assetNotFound: 'Asset not found',
    emptyAssetList: 'No asset allocations to clear',
    invalidAssetData: 'Failed to replace asset data',
    invalidAssetCategory: 'Select a valid asset category',
    invalidAssetAmount: 'Enter a valid asset amount',
  },
  success: {
    // Dashboard Data
    dashboardExported: 'Dashboard data exported',
    dashboardImported: 'Dashboard data imported',
    dashboardDataCleared: 'Dashboard data cleared',

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
    currenciesReplaced: 'Currencies synchronized',

    // Goals
    goalAdded: 'Savings goal added',
    goalRemoved: 'Savings goal removed',
    goalsCleared: 'Savings goals cleared',
    goalsReplaced: 'Savings goals synchronized',
    goalUpdated: 'Savings goal updated',

    // Assets
    assetAdded: 'Asset added',
    assetRemoved: 'Asset removed',
    assetsCleared: 'Assets portfolio cleared',
    assetsReplaced: 'Assets portfolio synchronized',
    assetUpdated: 'Asset updated',
  },
};

// ------------------------------------------------------------
// --------------------Metals Configuration--------------------
// ------------------------------------------------------------

export const METALS = [
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
