import { BASE_URL } from '../config/api-config.js';
import { BASE_CURRENCY } from '../config/constants.js';

export async function getCurrencyConversion(amount, fromCurrency, toCurrency) {
  const response = await fetch(`${BASE_URL}/${fromCurrency}`);

  if (!response.ok) {
    throw new Error('Unable to fetch currency conversion.');
  }

  const data = await response.json();
  const rate = data.rates[toCurrency];

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

  return Object.keys(data.rates);
}

export async function getCurrencyRates(base = BASE_CURRENCY) {
  const data = await fetchCurrencyData(base);

  return {
    base,
    rates: data.rates,
    date: data.time_last_update_utc,
  };
}

async function fetchCurrencyData(base) {
  const response = await fetch(`${BASE_URL}/${base}`);

  if (!response.ok) throw new Error('Unable to fetch currency data.');

  return response.json();
}
