export class CurrencyWatchlist {
  constructor(currencies = []) {
    this.currencies = currencies;
    this.maxCurrencies = 4;
  }

  getCurrencies() {
    return this.currencies;
  }

  hasCurrency(currencyCode) {
    return this.currencies.includes(currencyCode);
  }

  addCurrency(currencyCode) {
    if (this.hasCurrency(currencyCode)) {
      return {
        success: false,
        reason: 'duplicateCurrency',
      };
    }

    if (this.currencies.length >= this.maxCurrencies) {
      return {
        success: false,
        reason: 'currencyWatchlistFull',
      };
    }

    this.currencies.push(currencyCode);

    return {
      success: true,
      reason: 'currencyAdded',
    };
  }

  removeCurrency(currencyCode) {
    this.currencies = this.currencies.filter((code) => code !== currencyCode);

    return {
      success: true,
      reason: 'currencyRemoved',
    };
  }

  clearCurrencies() {
    this.currencies = [];

    return {
      success: true,
      reason: 'currenciesCleared',
    };
  }
}
