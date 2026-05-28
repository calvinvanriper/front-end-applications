import { getBackupDateStamp } from '../utils/formatters.js';
import {
  isValidDashboardBackup,
  sanitizeImportedStocks,
  sanitizeImportedCurrencies,
  sanitizeImportedSavingsGoals,
  sanitizeImportedAssets,
} from '../utils/validators.js';
import {
  saveStockWatchlist,
  saveCurrencyWatchlist,
  saveSavingsGoalsCache,
  saveAssetPortfolioCache,
} from '../storage/persistence.js';
import {
  renderStocksSection,
  renderCurrencySection,
  renderSavingsGoalsSection,
  renderAssetPortfolioSection,
} from '../ui/render.js';
import { processCurrencyWatchlistRefresh } from './currency-workflows.js';

export function processDashboardExport({
  stockWatchlist,
  currencyWatchlist,
  savingsGoals,
  assetPortfolio,
}) {
  const dashboardBackup = {
    app: 'personal-finance-dashboard',
    version: 1,
    exportedAt: new Date().toISOString(),
    data: {
      stocks: stockWatchlist.getStocks(),
      currencies: currencyWatchlist.getCurrencies(),
      savingsGoals: savingsGoals.getGoals(),
      assets: assetPortfolio.getAssets(),
    },
  };

  const backupJson = JSON.stringify(dashboardBackup, null, 2);
  const fileName = `personal-finance-dashboard-backup-${getBackupDateStamp()}.json`;

  return {
    success: true,
    reason: 'dashboardExported',
    data: {
      fileName,
      backupJson,
    },
  };
}

export async function processDashboardImport(
  backupJson,
  { stockWatchlist, currencyWatchlist, savingsGoals, assetPortfolio }
) {
  let backup;

  try {
    backup = JSON.parse(backupJson);
  } catch {
    return {
      success: false,
      reason: 'invalidDashboardBackup',
    };
  }

  if (!isValidDashboardBackup(backup)) {
    return {
      success: false,
      reason: 'invalidDashboardBackup',
    };
  }

  const sanitizedBackupData = {
    stocks: sanitizeImportedStocks(backup.data.stocks),
    currencies: sanitizeImportedCurrencies(backup.data.currencies),
    goals: sanitizeImportedSavingsGoals(backup.data.savingsGoals),
    assets: sanitizeImportedAssets(backup.data.assets),
  };

  return applyDashboardUserData(
    { stockWatchlist, currencyWatchlist, savingsGoals, assetPortfolio },
    {
      successReason: 'dashboardImported',
      failureReason: 'dashboardImportFailed',
      refreshCurrencies: true,
    },
    sanitizedBackupData
  );
}

export async function processDashboardDataClear({
  stockWatchlist,
  currencyWatchlist,
  savingsGoals,
  assetPortfolio,
}) {
  return applyDashboardUserData(
    { stockWatchlist, currencyWatchlist, savingsGoals, assetPortfolio },
    {
      successReason: 'dashboardDataCleared',
      failureReason: 'dashboardClearFailed',
      refreshCurrencies: false,
    }
  );
}

async function applyDashboardUserData(dashboardModels, workflowOptions, dashboardData = {}) {
  const { stockWatchlist, currencyWatchlist, savingsGoals, assetPortfolio } = dashboardModels;
  const { successReason, failureReason, refreshCurrencies = false } = workflowOptions;
  const { stocks = [], currencies = [], goals = [], assets = [] } = dashboardData;

  const stockResult = stockWatchlist.replaceStocks(stocks);
  const currencyResult = currencyWatchlist.replaceCurrencies(currencies);
  const goalsResult = savingsGoals.replaceGoals(goals);
  const assetResult = assetPortfolio.replaceAssets(assets);

  if (
    !stockResult.success ||
    !currencyResult.success ||
    !goalsResult.success ||
    !assetResult.success
  ) {
    return {
      success: false,
      reason: failureReason,
    };
  }

  const updatedStocks = stockWatchlist.getStocks();
  const updatedCurrencies = currencyWatchlist.getCurrencies();
  const updatedGoals = savingsGoals.getGoals();
  const updatedAssets = assetPortfolio.getAssets();

  saveStockWatchlist(updatedStocks);
  saveCurrencyWatchlist(updatedCurrencies);
  saveSavingsGoalsCache(updatedGoals);
  saveAssetPortfolioCache(updatedAssets);

  renderStocksSection(updatedStocks);

  if (refreshCurrencies && updatedCurrencies.length > 0) {
    await processCurrencyWatchlistRefresh(currencyWatchlist);
  } else {
    renderCurrencySection([], null);
  }

  renderSavingsGoalsSection(updatedGoals);
  renderAssetPortfolioSection(updatedAssets);

  return {
    success: true,
    reason: successReason,
  };
}
