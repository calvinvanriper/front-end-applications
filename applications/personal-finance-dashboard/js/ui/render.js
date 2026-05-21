import { dom } from './dom.js';
import {
  formatCurrency,
  formatDateTime,
  formatCurrencyOptionLabel,
  formatLastUpdated,
  getLatestStockTimestamp,
  formatDate,
} from '../utils/formatters.js';
import { calculateGoalProgress } from '../utils/calculations.js';

// ------------------------------------------------------------
// ---------------------Currency Converter---------------------
// ------------------------------------------------------------

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

export function setAddCurrencyButtonState(isEnabled) {
  dom.addCurrencyBtn.disabled = !isEnabled;
}

// ------------------------------------------------------------
// ----------------------Stock Watchlist-----------------------
// ------------------------------------------------------------

export function renderStocksSection(stockQuotes) {
  renderStockWatchlist(stockQuotes);
  renderStocksUpdatedMeta(getLatestStockTimestamp(stockQuotes));
  setClearStocksButtonState(stockQuotes.length > 0);
}

function renderStockWatchlist(stockQuotes) {
  if (stockQuotes.length === 0) {
    renderEmptyState(dom.stockWatchlist, 'No stocks added yet.');
    return;
  }

  dom.stockWatchlist.innerHTML = stockQuotes
    .map(
      (stockQuote) => `
        <article class="asset-card stock-card" data-symbol="${stockQuote.symbol}">
          ${createCardActionsMarkup([
            createRemoveButtonMarkup(stockQuote.symbol, stockQuote.symbol),
          ])}

          <div class="asset-card-header">
            <h3>${stockQuote.symbol}</h3>
            <p class="asset-price">$${stockQuote.price.toFixed(2)}</p>
          </div>

          <p class="asset-name">${stockQuote.name}</p>

          ${createAssetChangeMarkup(
            stockQuote.change,
            stockQuote.changePercent,
            stockQuote.changeDirection
          )}
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

function renderStocksUpdatedMeta(timestamp) {
  renderUpdatedMeta(dom.stocksUpdatedMeta, timestamp);
}

function setClearStocksButtonState(isEnabled) {
  dom.clearStocksBtn.disabled = !isEnabled;
}

// ------------------------------------------------------------
// -----------------------Metals Tracker-----------------------
// ------------------------------------------------------------

export function renderMetalsSection(metalsPrices, metalsDate) {
  renderMetalsList(metalsPrices);
  renderMetalsUpdatedMeta(metalsDate);
}

function renderMetalsList(metals) {
  if (!metals || metals.length === 0) {
    renderEmptyState(dom.metalsList, 'Metal prices will appear here.');
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

          ${createAssetChangeMarkup(metal.change, metal.changePercent, metal.changeDirection)}
        </article>
      `
    )
    .join('');
}

function renderMetalsUpdatedMeta(timestamp) {
  renderUpdatedMeta(dom.metalsUpdatedMeta, timestamp);
}

// ------------------------------------------------------------
// ---------------------Currency Watchlist---------------------
// ------------------------------------------------------------

export function renderCurrencySection(currencyCards, currencyDate) {
  renderCurrencyWatchlist(currencyCards);
  renderCurrencyUpdatedMeta(currencyDate);
  setClearCurrenciesButtonState(currencyCards.length > 0);
}

function renderCurrencyWatchlist(currencies) {
  if (!currencies || currencies.length === 0) {
    renderEmptyState(dom.currencyWatchlist, 'No currencies added yet.');
    return;
  }

  const markup = currencies
    .map((currency) => {
      const currencyLabel = formatCurrencyOptionLabel(currency.code);
      const formattedAmount = formatCurrency(currency.convertedAmount, currency.code);
      const priceText = `$${currency.baseAmount} ${currency.baseCurrency} → ${formattedAmount} ${currency.code}`;

      return `
        <article class="asset-card currency-card">
          ${createCardActionsMarkup([createRemoveButtonMarkup(currency.code, currency.code)])}

          <div class="currency-card-header">
            <p class="asset-price currency-price">${priceText}</p>
          </div>

          <p class="asset-name currency-name">${currencyLabel}</p>

          ${createAssetChangeMarkup(
            currency.change,
            currency.changePercent,
            currency.changeDirection,
            'currency-change'
          )}
        </article>
      `;
    })
    .join('');

  dom.currencyWatchlist.innerHTML = markup;
}

function renderCurrencyUpdatedMeta(timestamp) {
  renderUpdatedMeta(dom.currencyUpdatedMeta, timestamp);
}

function setClearCurrenciesButtonState(isEnabled) {
  dom.clearCurrenciesBtn.disabled = !isEnabled;
}

// ------------------------------------------------------------
// -----------------------Savings Goals------------------------
// ------------------------------------------------------------

export function renderSavingsGoalsSection(goals) {
  if (!goals || goals.length === 0) {
    renderEmptyState(dom.savingsGoalsList, 'No savings goals added yet.');
    setClearGoalsButtonState(false);
    return;
  }

  const sortedGoals = [...goals].sort((a, b) => {
    return new Date(a.targetDate) - new Date(b.targetDate);
  });

  dom.savingsGoalsList.innerHTML = sortedGoals
    .map((goal) => {
      const progressPercent = calculateGoalProgress(goal.currentAmount, goal.targetAmount);

      return `
          <article class="asset-card savings-goal-card">
            ${createCardActionsMarkup([
              createUpdateButtonMarkup(goal.id, goal.name),
              createRemoveButtonMarkup(goal.id, goal.name),
            ])}
            <h3 class="savings-goal-name">${goal.name}</h3>

            <div class="goal-progress">
              <div class="goal-progress-bar">
                <div class="goal-progress-fill" style="--progress-width: ${progressPercent}%">
                  ${progressPercent.toFixed(0)}%
                </div>
              </div>
            </div>

            <div class="goal-meta">
              <p>Saved: ${formatCurrency(goal.currentAmount, 'USD')}</p>
              <p>${formatDate(goal.targetDate)}</p>
              <p>Goal: ${formatCurrency(goal.targetAmount, 'USD')}</p>
            </div>
          </article>
        `;
    })
    .join('');

  setClearGoalsButtonState(true);
}

export function renderGoalFormMode(isEditing) {
  dom.goalFormTitle.textContent = isEditing ? 'Update Savings Goal' : 'Add Savings Goal';
  dom.saveGoalBtn.textContent = isEditing ? 'Update Goal' : 'Save Goal';
}

export function showGoalForm(isEditing = false) {
  renderGoalFormMode(isEditing);
  toggleElementVisibility(dom.savingsGoalsOverlay, true);
}

export function hideGoalForm() {
  toggleElementVisibility(dom.savingsGoalsOverlay, false);
}

export function populateGoalForm(goal) {
  dom.goalNameInput.value = goal.name;
  dom.goalTargetAmountInput.value = goal.targetAmount;
  dom.goalCurrentAmountInput.value = goal.currentAmount;
  dom.goalTargetDateInput.value = goal.targetDate;
}

export function resetGoalForm() {
  dom.goalForm.reset();
}

function setClearGoalsButtonState(isEnabled) {
  dom.clearGoalsBtn.disabled = !isEnabled;
}

// ------------------------------------------------------------
// ----------------------Internal Helpers----------------------
// ------------------------------------------------------------

function renderUpdatedMeta(element, timestamp) {
  element.textContent = formatLastUpdated(timestamp);
}

function renderEmptyState(container, message) {
  container.innerHTML = `<p class="empty-state">${message}</p>`;
}

function createCardActionsMarkup(actions) {
  return `
    <div class="asset-card-actions">
      ${actions.join('')}
    </div>
  `;
}

function createRemoveButtonMarkup(id, label) {
  return `
    <button
      class="icon-btn icon-btn--danger"
      type="button"
      data-symbol="${id}"
      aria-label="Remove ${label}"
    >
      x
    </button>
  `;
}

function createUpdateButtonMarkup(id, label) {
  return `
    <button
      class="icon-btn icon-btn--update"
      type="button"
      data-symbol="${id}"
      aria-label="Update ${label}"
    >
      <img src="./assets/icons/refresh.svg" alt="" aria-hidden="true" />
    </button>
  `;
}

function createAssetChangeMarkup(change, changePercent, changeDirection, extraClass = '') {
  return `
    <div class="asset-change asset-change--${changeDirection} ${extraClass}">
      <span class="asset-change-value">
        ${change.toFixed(2)}
      </span>
      <span class="asset-change-percent">
        (${changePercent.toFixed(2)}%)
      </span>
    </div>
  `;
}

function toggleElementVisibility(element, isVisible) {
  element.classList.toggle('hidden', !isVisible);
}
