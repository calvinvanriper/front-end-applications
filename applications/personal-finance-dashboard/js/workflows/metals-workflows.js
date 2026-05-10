import { getMetalPrices } from '../api/metals-api.js';
import { renderMetalsSection } from '../ui/render.js';
import { METALS_REFRESH_COOLDOWN_MS } from '../config/constants.js';
import { loadMetalsCache, saveMetalsCache } from '../storage/persistence.js';
import { getChangeDirection } from '../utils/formatters.js';

export async function processRefreshMetals() {
  const now = Date.now();
  const cachedMetals = loadMetalsCache();

  const isCooldownActive =
    cachedMetals?.lastFetched && now - cachedMetals.lastFetched < METALS_REFRESH_COOLDOWN_MS;

  if (isCooldownActive && cachedMetals.currentPrices?.length > 0) {
    renderMetalsSection(cachedMetals.currentPrices, cachedMetals.lastFetched);

    return {
      success: true,
      reason: 'metalsLoadedFromCache',
    };
  }

  try {
    const metals = await getMetalPrices();

    if (!metals || metals.length === 0) {
      return {
        success: false,
        reason: 'emptyMetalsList',
      };
    }

    if (metals.some((metal) => !metal.price)) {
      return {
        success: false,
        reason: 'invalidMetalsData',
      };
    }

    const metalsWithChanges = applyMetalPriceChanges(metals, cachedMetals?.currentPrices || []);

    saveMetalsCache({
      lastFetched: now,
      previousPrices: cachedMetals?.currentPrices || [],
      currentPrices: metalsWithChanges,
    });

    renderMetalsSection(metalsWithChanges, now);

    return {
      success: true,
      reason: 'metalsRefreshed',
    };
  } catch (error) {
    console.error(error);

    if (cachedMetals?.currentPrices?.length > 0) {
      renderMetalsSection(cachedMetals.currentPrices, cachedMetals.lastFetched);

      return {
        success: false,
        reason: 'metalsLoadedFromCacheAfterError',
      };
    }

    return {
      success: false,
      reason: 'metalsRefreshFailed',
    };
  }
}

function applyMetalPriceChanges(currentMetals, previousMetals = []) {
  return currentMetals.map((metal) => {
    const previousMetal = previousMetals.find((previous) => previous.symbol === metal.symbol);

    if (!previousMetal) {
      return {
        ...metal,
        change: 0,
        changePercent: 0,
        changeDirection: 'neutral',
      };
    }

    const change = metal.price - previousMetal.price;
    const changePercent = previousMetal.price ? (change / previousMetal.price) * 100 : 0;

    return {
      ...metal,
      change,
      changePercent,
      changeDirection: getChangeDirection(change),
    };
  });
}
