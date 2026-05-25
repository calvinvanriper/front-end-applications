export const ASSET_CATEGORY_CONFIG = {
  Stocks: {
    label: 'Stocks',
    color: 'var(--accent-asset-stocks)',
  },

  Crypto: {
    label: 'Crypto',
    color: 'var(--accent-asset-crypto)',
  },

  Cash: {
    label: 'Cash',
    color: 'var(--accent-asset-cash)',
  },

  Metals: {
    label: 'Metals',
    color: 'var(--accent-asset-metals)',
  },

  RealEstate: {
    label: 'Real Estate',
    color: 'var(--accent-asset-real-estate)',
  },
};

export function getAssetCategoryColor(category) {
  return ASSET_CATEGORY_CONFIG[category]?.color ?? 'var(--text-muted)';
}

export function getAssetCategoryLabel(category) {
  return ASSET_CATEGORY_CONFIG[category]?.label ?? category;
}
