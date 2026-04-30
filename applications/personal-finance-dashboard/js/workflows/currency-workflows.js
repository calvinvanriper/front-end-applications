import { dom } from '../ui/dom.js';
import { getCurrencyConversion } from '../api/currency-api.js';
import { renderConversionResult } from '../ui/render.js';

export async function processCurrencyConversion() {
  const amount = Number(dom.amountInput.value);
  const fromCurrency = dom.fromCurrency.value;
  const toCurrency = dom.toCurrency.value;

  if (Number.isNaN(amount) || amount <= 0) return;

  const conversion = await getCurrencyConversion(amount, fromCurrency, toCurrency);

  renderConversionResult(conversion);
}
