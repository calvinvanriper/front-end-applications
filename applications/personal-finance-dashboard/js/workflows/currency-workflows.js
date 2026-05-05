import { dom } from '../ui/dom.js';
import { getCurrencyConversion, getCurrencyRates } from '../api/currency-api.js';
import {
  renderConversionResult,
  setAddCurrencyButtonState,
  renderCurrencySection,
} from '../ui/render.js';
import { appState } from '../state/app-state.js';
import { BASE_CURRENCY, BASE_AMOUNT } from '../config/constants.js';
import {
  saveCurrencyWatchlist,
  loadCurrencyRatesCache,
  saveCurrencyRatesCache,
} from '../storage/persistence.js';

export async function processCurrencyConversion() {
  const amount = Number(dom.amountInput.value);
  const fromCurrency = dom.fromCurrency.value;
  const toCurrency = dom.toCurrency.value;

  appState.latestSuccessfulConversion = null;
  setAddCurrencyButtonState(false);

  if (Number.isNaN(amount) || amount <= 0) {
    return {
      success: false,
      reason: 'invalidCurrencyAmount',
    };
  }

  try {
    const conversion = await getCurrencyConversion(amount, fromCurrency, toCurrency);

    appState.latestSuccessfulConversion = conversion;
    setAddCurrencyButtonState(true);
    renderConversionResult(conversion);

    return {
      success: true,
      reason: 'currencyConverted',
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      reason: 'currencyConverterFailed',
    };
  }
}

export async function processCurrencyWatchlistAdd(currencyWatchlist) {
  const conversion = appState.latestSuccessfulConversion;

  if (!conversion) {
    return {
      success: false,
      reason: 'currencyConversionRequired',
    };
  }

  const result = currencyWatchlist.addCurrency(conversion.toCurrency);

  if (result.success) {
    saveCurrencyWatchlist(currencyWatchlist.getCurrencies());

    return processCurrencyWatchlistRefresh(currencyWatchlist);
  }

  return result;
}

export async function processCurrencyWatchlistRefresh(currencyWatchlist) {
  const currencies = currencyWatchlist.getCurrencies();

  if (currencies.length === 0) {
    renderCurrencySection([], null);

    return {
      success: false,
      reason: 'emptyCurrencyWatchlist',
    };
  }

  try {
    const ratesData = await getCurrencyRates(BASE_CURRENCY);
    const cachedRates = loadCurrencyRatesCache();

    const updatedCache = {
      lastFetched: ratesData.date,
      previousRates: cachedRates.currentRates,
      currentRates: ratesData.rates,
    };

    saveCurrencyRatesCache(updatedCache);

    const currencyCards = currencies.map((currencyCode) =>
      buildCurrencyCardData(currencyCode, ratesData, updatedCache)
    );

    renderCurrencySection(currencyCards, ratesData.date);

    return {
      success: true,
      reason: 'currenciesRefreshed',
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      reason: 'currencyRatesFailed',
    };
  }
}

function buildCurrencyCardData(currencyCode, ratesData, ratesCache) {
  const currentRate = ratesData.rates[currencyCode];
  const previousRate = ratesCache.previousRates[currencyCode];

  const convertedAmount = BASE_AMOUNT * currentRate;
  const previousConvertedAmount = previousRate !== undefined ? BASE_AMOUNT * previousRate : null;

  const hasPrevious = previousConvertedAmount !== null;

  const change = hasPrevious ? convertedAmount - previousConvertedAmount : 0;
  const changePercent = hasPrevious ? (change / previousConvertedAmount) * 100 : 0;

  const changeDirection = change > 0 ? 'positive' : change < 0 ? 'negative' : 'neutral';

  return {
    code: currencyCode,
    baseCurrency: BASE_CURRENCY,
    baseAmount: BASE_AMOUNT,
    rate: currentRate,
    convertedAmount,
    previousRate,
    change,
    changePercent,
    changeDirection,
    lastUpdated: ratesData.date,
  };
}

export function processCurrencyWatchlistClear(currencyWatchlist) {
  const result = currencyWatchlist.clearCurrencies();

  if (result.success) {
    const clearedWatchlist = currencyWatchlist.getCurrencies();
    const clearedAt = new Date().toISOString();

    saveCurrencyWatchlist(clearedWatchlist);
    renderCurrencySection(clearedWatchlist, clearedAt);
  }

  return result;
}

export async function processCurrencyWatchlistRemove(currencyWatchlist, currencyCode) {
  const result = currencyWatchlist.removeCurrency(currencyCode);

  if (result.success) {
    const updatedWatchlist = currencyWatchlist.getCurrencies();

    saveCurrencyWatchlist(updatedWatchlist);
    return processCurrencyWatchlistRefresh(currencyWatchlist);
  }

  return result;
}
