export class AllocationPortfolio {
  constructor(assets = []) {
    this.assets = assets;
  }

  // ------------------------------------------------------------
  // --------------------------Getters---------------------------
  // ------------------------------------------------------------

  getAssets() {
    return this.assets;
  }

  // ------------------------------------------------------------
  // ----------------------Asset Management----------------------
  // ------------------------------------------------------------

  addAsset(asset) {
    this.assets.push(asset);

    return {
      success: true,
      reason: 'assetAdded',
    };
  }

  removeAsset(assetId) {
    const initialLength = this.assets.length;

    this.assets = this.assets.filter((asset) => asset.id !== assetId);

    if (this.assets.length === initialLength) {
      return {
        success: false,
        reason: 'assetNotFound',
      };
    }

    return {
      success: true,
      reason: 'assetRemoved',
    };
  }

  clearAssets() {
    if (this.assets.length === 0) {
      return {
        success: false,
        reason: 'emptyAssetList',
      };
    }

    this.assets = [];

    return {
      success: true,
      reason: 'assetsCleared',
    };
  }

  replaceAssets(assets) {
    if (!Array.isArray(assets)) {
      return {
        success: false,
        reason: 'invalidAssetData',
      };
    }

    this.assets = assets;

    return {
      success: true,
      reason: 'assetsReplaced',
    };
  }

  updateAsset(assetId, updatedAssetData) {
    const assetIndex = this.assets.findIndex((asset) => asset.id === assetId);

    if (assetIndex === -1) {
      return {
        success: false,
        reason: 'assetNotFound',
      };
    }

    this.assets[assetIndex] = {
      ...this.assets[assetIndex],
      ...updatedAssetData,
      updatedAt: new Date().toISOString(),
    };

    return {
      success: true,
      reason: 'assetUpdated',
    };
  }
}
