import { getStockQuote } from '../api/stocks-api.js';
import { renderStocksSection } from '../ui/render.js';
import { saveStockWatchlist } from '../storage/persistence.js';

export async function processStockLookup(stockWatchlist, symbolInput, stockName = null) {
  if (!symbolInput) {
    return { success: false, reason: 'emptyStockSymbol' };
  }

  try {
    const stockQuote = await getStockQuote(symbolInput, stockName);
    const addResult = stockWatchlist.addStock(stockQuote);

    if (!addResult.success) {
      return addResult;
    }

    syncStocksUI(stockWatchlist);

    return {
      success: true,
      reason: 'stockAdded',
    };
  } catch (error) {
    console.error(error.message);

    return {
      success: false,
      reason: 'stockLookupFailed',
    };
  }
}

export async function processStockRemoval(stockWatchlist, symbol) {
  if (!symbol) {
    console.error('Missing symbol in remove workflow');
    return { success: false, reason: 'stockRemovalFailed' };
  }

  const removeResult = stockWatchlist.removeStock(symbol);

  if (!removeResult.success) {
    return removeResult;
  }

  syncStocksUI(stockWatchlist);

  return removeResult;
}

export function processClearStockWatchlist(stockWatchlist) {
  const clearResult = stockWatchlist.clearStocks();

  if (!clearResult.success) {
    return clearResult;
  }

  syncStocksUI(stockWatchlist);

  return clearResult;
}

export async function processRefreshStockWatchlist(stockWatchlist) {
  const currentStocks = stockWatchlist.getStocks();

  if (currentStocks.length === 0) {
    return { success: false, reason: 'emptyWatchlist' };
  }

  const refreshedResults = await Promise.allSettled(
    currentStocks.map((stock) => getStockQuote(stock.symbol, stock.name))
  );

  const failedResults = refreshedResults.filter((result) => result.status === 'rejected');

  const refreshedStocks = refreshedResults.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    }

    return currentStocks[index];
  });

  stockWatchlist.replaceStocks(refreshedStocks);

  syncStocksUI(stockWatchlist);

  if (failedResults.length > 0) {
    return { success: false, reason: 'stocksPartialRefresh' };
  }

  return { success: true, reason: 'stocksReplaced' };
}

function syncStocksUI(stockWatchlist) {
  const stocks = stockWatchlist.getStocks();

  renderStocksSection(stocks);
  saveStockWatchlist(stocks);
}
