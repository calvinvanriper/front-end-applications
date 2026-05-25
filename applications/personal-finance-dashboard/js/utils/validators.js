import { ASSET_CATEGORY_CONFIG } from '../config/asset-categories.js';

// ------------------------------------------------------------
// ------------------Savings Goals Validators------------------
// ------------------------------------------------------------

export function validateGoalData(goalData) {
  if (!hasText(goalData.name)) {
    return {
      success: false,
      reason: 'invalidGoalName',
    };
  }

  if (!isPositiveNumber(goalData.targetAmount)) {
    return {
      success: false,
      reason: 'invalidGoalTargetAmount',
    };
  }

  if (!isNonNegativeNumber(goalData.currentAmount)) {
    return {
      success: false,
      reason: 'invalidGoalCurrentAmount',
    };
  }

  if (!isValidDateString(goalData.targetDate)) {
    return {
      success: false,
      reason: 'invalidGoalTargetDate',
    };
  }

  return {
    success: true,
    reason: 'validGoalData',
  };
}

export function isValidStoredGoal(savingsGoal) {
  return (
    savingsGoal &&
    hasText(savingsGoal.name) &&
    isPositiveNumber(savingsGoal.targetAmount) &&
    isNonNegativeNumber(savingsGoal.currentAmount) &&
    isValidDateString(savingsGoal.targetDate)
  );
}
// ------------------------------------------------------------
// -----------------Asset Portfolio Validators-----------------
// ------------------------------------------------------------

export function isValidAssetCategory(category) {
  return Object.hasOwn(ASSET_CATEGORY_CONFIG, category);
}

export function validateAssetData(assetData) {
  if (!isValidAssetCategory(assetData.category)) {
    return {
      success: false,
      reason: 'invalidAssetCategory',
    };
  }

  if (!isPositiveNumber(assetData.amount)) {
    return {
      success: false,
      reason: 'invalidAssetAmount',
    };
  }

  return {
    success: true,
    reason: 'validAssetData',
  };
}

export function isValidStoredAsset(asset) {
  return (
    asset &&
    hasText(asset.id) &&
    isValidAssetCategory(asset.category) &&
    isPositiveNumber(asset.amount) &&
    isValidDateString(asset.createdAt) &&
    isValidDateString(asset.updatedAt)
  );
}

// ------------------------------------------------------------
// ----------------Metals Dashboard Validation-----------------
// ------------------------------------------------------------

export function isValidStoredMetalPrice(metal) {
  return (
    metal &&
    hasText(metal.symbol) &&
    hasText(metal.name) &&
    isPositiveNumber(metal.price) &&
    isValidDateString(metal.lastUpdated)
  );
}

export function isValidStoredMetalDisplayData(metal) {
  return (
    isValidStoredMetalPrice(metal) &&
    isNumber(metal.change) &&
    isNumber(metal.changePercentage) &&
    hasText(metal.changeDirection)
  );
}

// ------------------------------------------------------------
// ----------------------Internal Helpers----------------------
// ------------------------------------------------------------

function hasText(value) {
  return typeof value === 'string' && value?.trim() !== '';
}

function isPositiveNumber(value) {
  return isNumber(value) && value > 0;
}

function isNonNegativeNumber(value) {
  return isNumber(value) && value >= 0;
}

function isNumber(value) {
  return typeof value === 'number' && !Number.isNaN(value);
}

function isValidDateString(value) {
  if (!value) return false;

  const date = new Date(value);

  return !Number.isNaN(date.getTime());
}
