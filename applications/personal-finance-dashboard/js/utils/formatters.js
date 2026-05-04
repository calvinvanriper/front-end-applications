export function formatCurrency(amount, denomination) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: denomination }).format(
    amount
  );
}

export function formatDateTime(dateString) {
  const date = new Date(dateString);

  const pad = (value) => String(value).padStart(2, '0');

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());

  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function getCurrencySymbol(currencyCode) {
  const parts = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    currencyDisplay: 'narrowSymbol',
  }).formatToParts(0);

  return parts.find((part) => part.type === 'currency')?.value ?? currencyCode;
}

export function getCurrencyName(currencyCode) {
  try {
    return new Intl.DisplayNames(['en-US'], { type: 'currency' }).of(currencyCode);
  } catch {
    return currencyCode;
  }
}

export function formatCurrencyOptionLabel(currencyCode) {
  const symbol = getCurrencySymbol(currencyCode);
  const name = getCurrencyName(currencyCode);

  return `${currencyCode} - ${symbol} ${name}`;
}

export function formatLastUpdated(timestamp) {
  if (!timestamp) return 'Not updated yet';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
    .format(new Date(timestamp))
    .replace(',', ' •');
}

export function getLatestStockTimestamp(stocks) {
  if (!stocks || stocks.length === 0) return null;

  return stocks.reduce((latest, stock) => {
    if (!latest) return stock.lastUpdated;

    const latestTime = new Date(latest).getTime();
    const currentTime = new Date(stock.lastUpdated).getTime();

    return currentTime > latestTime ? stock.lastUpdated : latest;
  }, null);
}
