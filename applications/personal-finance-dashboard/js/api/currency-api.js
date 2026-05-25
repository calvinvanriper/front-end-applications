import { CURRENCY_BASE_URL } from '../config/api-config.js';
import { BASE_CURRENCY } from '../config/constants.js';

export async function getCurrencyConversion(amount, fromCurrency, toCurrency) {
  const data = await fetchCurrencyData(fromCurrency);
  const rates = data.rates ?? {};
  const rate = rates[toCurrency];

  if (!rate) {
    throw new Error(`Currency not supported: ${toCurrency}`);
  }

  return {
    convertedAmount: amount * rate,
    fromCurrency,
    toCurrency,
    amount,
    rate,
    date: data.time_last_update_utc,
  };
}

export async function getSupportedCurrencies(base = BASE_CURRENCY) {
  const data = await fetchCurrencyData(base);
  const rates = data.rates ?? {};

  return Object.keys(rates);
}

export async function getCurrencyRates(base = BASE_CURRENCY) {
  const data = await fetchCurrencyData(base);
  const rates = data.rates ?? {};

  return {
    baseCurrency: base,
    rates,
    date: data.time_last_update_utc,
  };
}

async function fetchCurrencyData(base) {
  const response = await fetch(`${CURRENCY_BASE_URL}/${base}`);

  if (!response.ok) throw new Error('Unable to fetch currency data.');

  return response.json();
}
