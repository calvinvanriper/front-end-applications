// ------------------------------------------------------------
// ------------------Shared Direction Helpers------------------
// ------------------------------------------------------------

export function getChangeDirection(change) {
  if (change > 0) return 'positive';
  if (change < 0) return 'negative';
  return 'neutral';
}

// ------------------------------------------------------------
// -----------------Savings Goals Calculations-----------------
// ------------------------------------------------------------

export function calculateGoalProgress(currentAmount, targetAmount) {
  if (!targetAmount || targetAmount <= 0) return 0;

  return Math.min((currentAmount / targetAmount) * 100, 100);
}

// ------------------------------------------------------------
// ----------------Asset Portfolio Calculations----------------
// ------------------------------------------------------------

export function calculateAssetPortfolioTotal(assets = []) {
  return assets.reduce((total, asset) => total + Number(asset.amount || 0), 0);
}

export function calculateAssetAllocationPercentage(assets = [], amount) {
  const total = calculateAssetPortfolioTotal(assets);

  if (total <= 0) return 0;

  return Number(((amount / total) * 100).toFixed(2));
}

export function calculateAssetChartSegments(assets = []) {
  let startDegree = 0;

  return assets.map((asset) => {
    const percentage = calculateAssetAllocationPercentage(assets, asset.amount);
    const degrees = (percentage / 100) * 360;
    const endDegree = startDegree + degrees;

    const segment = {
      category: asset.category,
      percentage,
      startDegree,
      endDegree,
    };

    startDegree = endDegree;

    return segment;
  });
}

export function groupAssetsByCategory(assets = []) {
  return assets.reduce((groupedAssets, asset) => {
    const existingAsset = groupedAssets.find(
      (groupedAsset) => groupedAsset.category === asset.category
    );

    if (existingAsset) {
      existingAsset.amount += asset.amount;
      return groupedAssets;
    }

    groupedAssets.push({
      category: asset.category,
      amount: asset.amount,
    });

    return groupedAssets;
  }, []);
}
