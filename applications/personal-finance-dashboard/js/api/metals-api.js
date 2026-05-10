import { METALPRICE_API_KEY, METALPRICE_BASE_URL } from '../config/api-config.js';
import { metals } from '../config/constants.js';

export async function getMetalPrices() {
  const url = `${METALPRICE_BASE_URL}?api_key=${METALPRICE_API_KEY}&base=USD&currencies=XAU,XAG,XPT,XPD`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch metal prices');
  }

  const data = await response.json();

  return normalizeMetalData(data);
}

function normalizeMetalData(data) {
  const rates = data.rates;

  return metals.map((metal) => {
    const rate = rates[metal.symbol];
    const price = rate ? 1 / rate : null;

    return {
      symbol: metal.symbol,
      name: metal.name,
      price,
      lastUpdated: new Date().toISOString(),
    };
  });
}
