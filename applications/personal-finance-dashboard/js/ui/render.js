import { dom } from './dom.js';
import {
  formatCurrency,
  formatDateTime,
  formatCurrencyOptionLabel,
  formatLastUpdated,
  getLatestStockTimestamp,
  formatDate,
} from '../utils/formatters.js';
import {
  calculateGoalProgress,
  calculateAssetPortfolioTotal,
  calculateAssetAllocationPercentage,
  calculateAssetChartSegments,
  groupAssetsByCategory,
} from '../utils/calculations.js';
import {
  ASSET_CATEGORY_CONFIG,
  getAssetCategoryLabel,
  getAssetCategoryColor,
} from '../config/asset-categories.js';

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
  setClearButtonState(dom.clearStocksBtn, stockQuotes.length > 0);
}

function renderStockWatchlist(stockQuotes) {
  if (stockQuotes.length === 0) {
    renderEmptyState(dom.stockWatchlist, 'No stocks added yet.');
    return;
  }

  dom.stockWatchlist.innerHTML = stockQuotes
    .map(
      (stockQuote) => `
        <article class="asset-card stock-card" data-item-id="${stockQuote.symbol}">
          ${createCardActionsMarkup([
            createRemoveButtonMarkup(stockQuote.symbol, stockQuote.symbol),
          ])}

          <div class="asset-card-header">
            <h3>${stockQuote.symbol}</h3>
            <p class="asset-price">${formatCurrency(stockQuote.price)}</p>
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

function renderStocksUpdatedMeta(timestamp) {
  renderUpdatedMeta(dom.stocksUpdatedMeta, timestamp);
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
        <div class="stock-search-item" data-item-id="${result.symbol}" data-name="${result.name}">
          <strong>${result.symbol}</strong>
          <span>${result.name}</span>
        </div>
        `
    )
    .join('');

  dom.stockSearchResults.classList.remove('hidden');
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
            <p class="asset-price">${formatCurrency(metal.price)}</p>
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

export function renderCachedMetalsSection(cachedMetals) {
  renderMetalsSection(cachedMetals.currentPrices, cachedMetals.lastFetched);
}

// ------------------------------------------------------------
// ---------------------Currency Watchlist---------------------
// ------------------------------------------------------------

export function renderCurrencySection(currencyCards, currencyDate) {
  renderCurrencyWatchlist(currencyCards);
  renderCurrencyUpdatedMeta(currencyDate);
  setClearButtonState(dom.clearCurrenciesBtn, currencyCards.length > 0);
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

// ------------------------------------------------------------
// -----------------------Savings Goals------------------------
// ------------------------------------------------------------

export function renderSavingsGoalsSection(goals) {
  renderSavingsGoalsList(goals);
  setClearButtonState(dom.clearGoalsBtn, goals.length > 0);
}

function renderSavingsGoalsList(goals) {
  if (!goals || goals.length === 0) {
    renderEmptyState(dom.savingsGoalsList, 'No savings goals added yet.');
    return;
  }

  const sortedGoals = [...goals].sort((a, b) => {
    return new Date(a.targetDate) - new Date(b.targetDate);
  });

  const markup = sortedGoals
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
              <p>Saved: ${formatCurrency(goal.currentAmount)}</p>
              <p>${formatDate(goal.targetDate)}</p>
              <p>Goal: ${formatCurrency(goal.targetAmount)}</p>
            </div>
          </article>
        `;
    })
    .join('');

  dom.savingsGoalsList.innerHTML = markup;
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

// ------------------------------------------------------------
// ----------------------Asset Portfolio-----------------------
// ------------------------------------------------------------

export function renderAssetPortfolioSection(assets) {
  const groupedAssets = groupAssetsByCategory(assets);

  renderAssetPortfolioMeta(groupedAssets);
  renderAssetAllocationChart(groupedAssets);
  renderAssetPortfolioList(groupedAssets);
  setClearButtonState(dom.clearAssetsBtn, assets.length > 0);
}

function renderAssetPortfolioMeta(assets) {
  if (!assets || assets.length === 0) {
    dom.assetPortfolioMeta.textContent = '';
    return;
  }

  const markup = `
    <div class="asset-portfolio-meta__item">
      <span class="asset-portfolio-meta__label">Categories</span>
      <span class="asset-portfolio-meta__value">${assets.length}</span>
    </div>
  `;

  dom.assetPortfolioMeta.innerHTML = markup;
}

function renderAssetAllocationChart(assets) {
  if (!assets || assets.length === 0) {
    dom.assetAllocationChart.innerHTML = `
      <div class="asset-chart-empty-state">
        <p>Add assets to generate allocation chart</p>
      </div>
    `;
    return;
  }

  const segments = calculateAssetChartSegments(assets);
  const totalPortfolioValue = calculateAssetPortfolioTotal(assets);

  const gradient = segments
    .map((segment) => {
      const color = getAssetCategoryColor(segment.category);

      return `${color} ${segment.startDegree}deg ${segment.endDegree}deg`;
    })
    .join(', ');

  const markup = `
    <div
      class="asset-donut-chart"
      style="background: conic-gradient(${gradient});"
      aria-label="Asset allocation chart"
    >
      <div class="asset-donut-chart__center">
        <span class="asset-donut-chart__total">
          ${formatCurrency(totalPortfolioValue)}
        </span>
      </div>
    </div>
  `;

  dom.assetAllocationChart.innerHTML = markup;
}

function renderAssetPortfolioList(assets) {
  if (!assets || assets.length === 0) {
    renderEmptyState(dom.assetPortfolioList, 'No assets added yet.');
    return;
  }

  const markup = assets
    .map((asset) => {
      const assetCategory = asset.category;
      const assetLabel = getAssetCategoryLabel(assetCategory);

      return `
        <div class="asset-row asset-category-card">
          <div class="asset-row__label">
            <span
              class="asset-row__marker"
              style="background-color: ${getAssetCategoryColor(assetCategory)};"
            ></span>
            <span class="asset-row__category">${assetLabel}</span>
            ${createDetailsButtonMarkup(assetCategory, assetLabel)}
          </div>
          ${createAssetAmountDetailsMarkup(assets, asset.amount)}
        </div>
      `;
    })
    .join('');

  dom.assetPortfolioList.innerHTML = markup;
}

export function populateAssetCategoryOptions() {
  const options = Object.entries(ASSET_CATEGORY_CONFIG)
    .map(([category, config]) => {
      return `<option value="${category}">${config.label}</option>`;
    })
    .join('');

  dom.assetCategoryInput.innerHTML = `
    <option value="">Please select a category</option>
    ${options}
  `;
}

export function renderAssetFormMode(isEditing) {
  dom.assetFormTitle.textContent = isEditing ? 'Update Asset Allocation' : 'Add Asset Allocation';
  dom.saveAssetBtn.textContent = isEditing ? 'Update Asset' : 'Save Asset';
}

export function showAssetForm(isEditing = false) {
  renderAssetFormMode(isEditing);
  toggleElementVisibility(dom.assetPortfolioOverlay, true);
}

export function hideAssetForm() {
  toggleElementVisibility(dom.assetPortfolioOverlay, false);
  dom.assetForm.reset();
}

export function populateAssetForm(asset) {
  dom.assetCategoryInput.value = asset.category;
  dom.assetAmountInput.value = asset.amount;
}

export function showAssetDetailsOverlay(categoryAssets, category) {
  dom.assetDetailsTitle.textContent = `${getAssetCategoryLabel(category)} Details`;
  renderCategoryDetailsList(categoryAssets, category);
  toggleElementVisibility(dom.assetDetailsOverlay, true);
}

export function hideAssetDetailsOverlay() {
  toggleElementVisibility(dom.assetDetailsOverlay, false);
}

function renderCategoryDetailsList(categoryAssets, category) {
  const categoryLabel = getAssetCategoryLabel(category);

  if (!categoryAssets || categoryAssets.length === 0) {
    renderEmptyState(dom.assetDetailsList, `No assets added for ${categoryLabel} yet.`);
    return;
  }

  const markup = categoryAssets
    .map((asset) => {
      return `
      <div class="asset-row">
        <div class="asset-row__label">
          ${createAssetMetadataMarkup(asset)}
          ${createAssetDetailRowActionsMarkup(asset)}
        </div>

        ${createAssetAmountDetailsMarkup(categoryAssets, asset.amount)}
      </div>
    `;
    })
    .join('');

  dom.assetDetailsList.innerHTML = markup;
}

function createAssetMetadataMarkup(asset) {
  return `
    <span class="asset-row__created-date">
      Created: ${asset.createdAt ? formatDateTime(asset.createdAt) : 'Unknown'}
    </span>
    <span class="asset-row__updated-date">
      Updated: ${asset.updatedAt ? formatDateTime(asset.updatedAt) : 'Unknown'}
    </span>
  `;
}

function createAssetDetailRowActionsMarkup(asset) {
  return createAssetDetailActionsMarkup([
    createAssetDetailButtonMarkup({
      assetId: asset.id,
      category: asset.category,
      action: 'update',
      content: '<img src="./assets/icons/refresh.svg" alt="" aria-hidden="true" />',
      modifierClass: 'icon-btn--update',
    }),
    createAssetDetailButtonMarkup({
      assetId: asset.id,
      category: asset.category,
      action: 'remove',
      content: 'x',
      modifierClass: 'icon-btn--danger',
    }),
  ]);
}

function createAssetAmountDetailsMarkup(assets, amount) {
  return `
    <div class="asset-row__details">
      <span class="asset-row__amount">${formatCurrency(amount)}</span>
      <span class="asset-row__percentage">${calculateAssetAllocationPercentage(assets, amount)}%</span>
    </div>
  `;
}

// ------------------------------------------------------------
// ----------------------Internal Helpers----------------------
// ------------------------------------------------------------

function setClearButtonState(element, isEnabled) {
  element.disabled = !isEnabled;
}

function renderUpdatedMeta(element, timestamp) {
  element.textContent = formatLastUpdated(timestamp);
}

function renderEmptyState(container, message) {
  container.innerHTML = `<p class="empty-state">${message}</p>`;
}

function toggleElementVisibility(element, isVisible) {
  element.classList.toggle('hidden', !isVisible);
}

function createCardActionsMarkup(actions) {
  return `
    <div class="asset-card-actions">
      ${actions.join('')}
    </div>
  `;
}

function createAssetDetailActionsMarkup(actions) {
  return `
    <div class="asset-detail-actions">
      ${actions.join('')}
    </div>
  `;
}

function createRemoveButtonMarkup(id, label) {
  return `
    <button
      class="icon-btn icon-btn--danger"
      type="button"
      data-item-id="${id}"
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
      data-item-id="${id}"
      aria-label="Update ${label}"
    >
      <img src="./assets/icons/refresh.svg" alt="" aria-hidden="true" />
    </button>
  `;
}

function createDetailsButtonMarkup(category, label) {
  return `
    <button
      class="icon-btn icon-btn--details"
      type="button"
      data-asset-category="${category}"
      aria-label="Manage ${label} assets"
    >
      <img src="./assets/icons/details.svg" alt="" aria-hidden="true" />
    </button>
  `;
}

function createAssetDetailButtonMarkup({ assetId, category, action, content, modifierClass }) {
  const categoryLabel = getAssetCategoryLabel(category);

  return `
    <button
      class="icon-btn ${modifierClass}"
      type="button"
      data-asset-id="${assetId}"
      data-asset-category="${category}"
      data-asset-action="${action}"
      aria-label="${action} ${categoryLabel} asset"
    >
      ${content}
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
