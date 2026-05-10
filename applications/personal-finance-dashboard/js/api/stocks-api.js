import { FINNHUB_API_KEY, FINNHUB_BASE_URL } from '../config/api-config.js';
import { getChangeDirection } from '../utils/formatters.js';

export async function getStockQuote(symbol, name = null) {
  const normalizedSymbol = symbol.trim().toUpperCase();

  const endpoint = `${FINNHUB_BASE_URL}/quote?symbol=${normalizedSymbol}&token=${FINNHUB_API_KEY}`;

  const response = await fetch(endpoint);

  if (!response.ok) {
    throw new Error(`Unable to fetch stock quote for ${normalizedSymbol}`);
  }

  const data = await response.json();

  if (data.c === null || data.d === null || data.dp === null || data.c === 0) {
    throw new Error(`No quote data found for ${normalizedSymbol}`);
  }

  return {
    symbol: normalizedSymbol,
    name: name || normalizedSymbol,
    price: data.c,
    change: data.d,
    changePercent: data.dp,
    changeDirection: getChangeDirection(data.d),
    lastUpdated: new Date().toISOString(),
  };
}

export async function searchStockSymbols(query) {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) return [];

  const endpoint = `${FINNHUB_BASE_URL}/search?q=${encodeURIComponent(normalizedQuery)}&token=${FINNHUB_API_KEY}`;

  const response = await fetch(endpoint);

  if (!response.ok) {
    throw new Error(`Unable to search symbols for ${normalizedQuery}`);
  }

  const data = await response.json();

  return data.result.slice(0, 6).map((result) => ({
    symbol: result.symbol,
    name: result.description,
    type: result.type,
  }));
}
