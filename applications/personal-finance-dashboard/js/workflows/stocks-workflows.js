import { dom } from '../ui/dom.js';
import { getStockQuote } from '../api/stocks-api.js';
import { renderStockWatchlist, renderStockSearchResults } from '../ui/render.js';
import { saveStockWatchlist } from '../storage/persistence.js';

export async function processStockLookup(stockWatchlist) {
  const symbolInput = dom.stockSymbolInput.value.trim();

  if (!symbolInput) {
    return { success: false, reason: 'emptyStockSymbol' };
  }

  const stockName = dom.stockSymbolInput.dataset.selectedName || null;

  try {
    const stockQuote = await getStockQuote(symbolInput, stockName);
    const addResult = stockWatchlist.addStock(stockQuote);

    if (!addResult.success) {
      dom.stockSymbolInput.value = '';
      return addResult;
    }

    renderStockWatchlist(stockWatchlist.getStocks());
    saveStockWatchlist(stockWatchlist.getStocks());
    renderStockSearchResults([]);
  } catch (error) {
    console.error(error.message);

    return {
      success: false,
      reason: 'stockLookupFailed',
    };
  } finally {
    dom.stockSymbolInput.value = '';
    delete dom.stockSymbolInput.dataset.selectedName;
    renderStockSearchResults([]);
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

  renderStockWatchlist(stockWatchlist.getStocks());
  saveStockWatchlist(stockWatchlist.getStocks());

  return removeResult;
}

export function processClearStockWatchlist(stockWatchlist) {
  const clearResult = stockWatchlist.clearStocks();

  if (!clearResult.success) {
    return clearResult;
  }

  renderStockWatchlist(stockWatchlist.getStocks());
  saveStockWatchlist(stockWatchlist.getStocks());

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

  renderStockWatchlist(stockWatchlist.getStocks());
  saveStockWatchlist(stockWatchlist.getStocks());

  if (failedResults.length > 0) {
    return { success: false, reason: 'stocksPartialRefresh' };
  }

  return { success: true, reason: 'stocksReplaced' };
}
