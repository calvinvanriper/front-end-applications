export class StockWatchlist {
  constructor() {
    this.stocks = [];
  }

  normalizeSymbol(symbol) {
    return symbol.trim().toUpperCase();
  }

  addStock(stockQuote) {
    const stockAlreadyExists = this.stocks.some(
      (stock) => this.normalizeSymbol(stock.symbol) === this.normalizeSymbol(stockQuote.symbol)
    );

    if (stockAlreadyExists) {
      return {
        success: false,
        reason: 'duplicateStock',
      };
    }

    this.stocks.push(stockQuote);

    return {
      success: true,
      reason: 'stockAdded',
    };
  }

  removeStock(symbol) {
    const originalLength = this.stocks.length;

    this.stocks = this.stocks.filter(
      (stock) => this.normalizeSymbol(stock.symbol) !== this.normalizeSymbol(symbol)
    );

    if (this.stocks.length === originalLength) {
      return {
        success: false,
        reason: 'stockNotFound',
      };
    }

    return {
      success: true,
      reason: 'stockRemoved',
    };
  }

  loadStocks(stocks) {
    this.stocks = stocks;
  }

  clearStocks() {
    this.stocks = [];

    return {
      success: true,
      reason: 'stocksCleared',
    };
  }

  getStocks() {
    return this.stocks;
  }

  replaceStocks(stocks) {
    this.stocks = stocks;

    return {
      success: true,
      reason: 'stocksReplaced',
    };
  }
}
