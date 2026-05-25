import { renderAssetPortfolioSection } from '../ui/render.js';
import { saveAssetPortfolioCache } from '../storage/persistence.js';
import { validateAssetData } from '../utils/validators.js';

export function processAssetFormSubmit(assetPortfolio, assetData, editingAssetId = null) {
  const validationResult = validateAssetData(assetData);

  if (!validationResult.success) {
    return validationResult;
  }

  if (editingAssetId) {
    return processAssetUpdate(assetPortfolio, editingAssetId, assetData);
  }

  const asset = buildAssetData(assetData.category, assetData.amount);

  return processAssetAdd(assetPortfolio, asset);
}

export function processAssetAdd(assetPortfolio, assetData) {
  const result = assetPortfolio.addAsset(assetData);

  if (result.success) {
    syncAssetsUI(assetPortfolio);
  }

  return result;
}

export function processAssetUpdate(assetPortfolio, assetId, updatedAssetData) {
  const result = assetPortfolio.updateAsset(assetId, updatedAssetData);

  if (result.success) {
    syncAssetsUI(assetPortfolio);
  }

  return result;
}

export function processAssetRemove(assetPortfolio, assetId) {
  const result = assetPortfolio.removeAsset(assetId);

  if (result.success) {
    syncAssetsUI(assetPortfolio);
  }

  return result;
}

export function processAssetsClear(assetPortfolio) {
  const result = assetPortfolio.clearAssets();

  if (result.success) {
    syncAssetsUI(assetPortfolio);
  }

  return result;
}

function syncAssetsUI(assetPortfolio) {
  const assets = assetPortfolio.getAssets();

  saveAssetPortfolioCache(assets);
  renderAssetPortfolioSection(assets);
}

function buildAssetData(category, amount) {
  return {
    id: crypto.randomUUID(),
    category,
    amount: Number(amount),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
