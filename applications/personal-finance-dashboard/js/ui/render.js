import { dom } from './dom.js';
import {
  formatCurrency,
  formatDateTime,
  formatCurrencyOptionLabel,
  formatLastUpdated,
} from '../utils/formatters.js';

export function renderConversionResult(conversion) {
  dom.resultValue.textContent = formatCurrency(conversion.convertedAmount, conversion.toCurrency);

  dom.resultMeta.textContent = `1 ${conversion.fromCurrency} = ${conversion.rate.toFixed(4)} ${conversion.toCurrency} · Rate last updated ${formatDateTime(conversion.date)}`;
}

export function populateCurrencyOptions(currencies) {
  dom.fromCurrency.innerHTML = '';
  dom.toCurrency.innerHTML = '';

  currencies.forEach((currency) => {
    const optionFrom = document.createElement('option');
    optionFrom.value = currency;
    optionFrom.textContent = formatCurrencyOptionLabel(currency);

    const optionTo = optionFrom.cloneNode(true);

    dom.fromCurrency.appendChild(optionFrom);
    dom.toCurrency.appendChild(optionTo);
  });

  dom.fromCurrency.value = 'USD';
  dom.toCurrency.value = 'EUR';
}

export function renderStockWatchlist(stockQuotes) {
  if (stockQuotes.length === 0) {
    dom.stockWatchList.innerHTML = '<p class="empty-state">No stocks added yet.</p>';
    return;
  }

  dom.stockWatchList.innerHTML = stockQuotes
    .map(
      (stockQuote) => `
        <article class="asset-card stock-card" data-symbol="${stockQuote.symbol}">
          <div class="asset-card-actions">
            <button
              class="stock-icon-btn stock-icon-btn--danger"
              type="button"
              data-action="remove"
              data-symbol="${stockQuote.symbol}"
              aria-label="Remove ${stockQuote.symbol}"
            >
              x
            </button>
          </div>

          <div class="asset-card-header">
            <h3>${stockQuote.symbol}</h3>
            <p class="asset-price">$${stockQuote.price.toFixed(2)}</p>
          </div>

          <p class="asset-name">${stockQuote.name}</p>

          <p class="asset-change asset-change--${stockQuote.changeDirection}">
            <span class="asset-change-value">
              ${stockQuote.change.toFixed(2)}
            </span>
            <span class="asset-change-percent">
              (${stockQuote.changePercent.toFixed(2)}%)
            </span>
          </p>
        </article>
      `
    )
    .join('');
}

export function renderStockSearchResults(results) {
  if (!results || results.length === 0) {
    dom.stockSearchResults.innerHTML = '';
    dom.stockSearchResults.classList.add('hidden');
    return;
  }

  dom.stockSearchResults.innerHTML = results
    .map(
      (result) => `
        <div class="stock-search-item" data-symbol="${result.symbol}" data-name="${result.name}">
          <strong>${result.symbol}</strong>
          <span>${result.name}</span>
        </div>
        `
    )
    .join('');

  dom.stockSearchResults.classList.remove('hidden');
}

export function renderMetalsList(metals) {
  if (!metals || metals.length === 0) {
    dom.metalsList.innerHTML = '<p class="empty-state">Metal prices will appear here.</p>';
    return;
  }

  dom.metalsList.innerHTML = metals
    .map(
      (metal) => `
        <article class="asset-card metal-card">
          <div class="asset-card-header">
            <h3>${metal.symbol}</h3>
            <p class="asset-price">$${metal.price.toFixed(2)}</p>
          </div>

          <p class="asset-name">${metal.name}</p>

          <div class="asset-change asset-change--${metal.changeDirection}">
            <span class="asset-change-value">
              ${metal.change.toFixed(2)}
            </span>
            <span class="asset-change-percent">
              (${metal.changePercent.toFixed(2)}%)
            </span>
          </div>
        </article>
      `
    )
    .join('');
}

export function renderStocksUpdatedMeta(timestamp) {
  dom.stocksUpdatedMeta.textContent = formatLastUpdated(timestamp);
}

export function renderMetalsUpdatedMeta(timestamp) {
  dom.metalsUpdatedMeta.textContent = formatLastUpdated(timestamp);
}

export function renderMetalsSection(metalsPrices, metalsDate) {
  renderMetalsList(metalsPrices);
  renderMetalsUpdatedMeta(metalsDate);
}
