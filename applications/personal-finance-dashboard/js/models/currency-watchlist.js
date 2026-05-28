import { normalizeCode } from '../utils/normalizers.js';
export class CurrencyWatchlist {
  constructor(currencies = []) {
    this.currencies = currencies;
    this.maxCurrencies = 4;
  }

  getCurrencies() {
    return this.currencies;
  }

  hasCurrency(currencyCode) {
    const normalizedCode = this.normalizeCurrencyCode(currencyCode);

    return this.currencies.includes(normalizedCode);
  }

  addCurrency(currencyCode) {
    const normalizedCode = this.normalizeCurrencyCode(currencyCode);

    if (this.hasCurrency(normalizedCode)) {
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

    this.currencies.push(normalizedCode);

    return {
      success: true,
      reason: 'currencyAdded',
    };
  }

  removeCurrency(currencyCode) {
    const originalLength = this.currencies.length;
    const normalizedCode = this.normalizeCurrencyCode(currencyCode);

    this.currencies = this.currencies.filter((code) => code !== normalizedCode);

    if (this.currencies.length === originalLength) {
      return {
        success: false,
        reason: 'currencyNotFound',
      };
    }

    return {
      success: true,
      reason: 'currencyRemoved',
    };
  }

  clearCurrencies() {
    if (this.currencies.length === 0) {
      return {
        success: false,
        reason: 'emptyCurrencyWatchlist',
      };
    }

    this.currencies = [];

    return {
      success: true,
      reason: 'currenciesCleared',
    };
  }

  normalizeCurrencyCode(currencyCode) {
    return normalizeCode(currencyCode);
  }

  replaceCurrencies(currencies) {
    if (!Array.isArray(currencies)) {
      return {
        success: false,
        reason: 'invalidCurrencyData',
      };
    }

    this.currencies = currencies;

    return {
      success: true,
      reason: 'currenciesReplaced',
    };
  }
}
