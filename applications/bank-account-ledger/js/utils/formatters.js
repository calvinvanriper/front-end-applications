import { categoryLookup } from '../config/constants.js';

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export function formatFieldValue(key, value) {
  if (value === null || value === undefined || value === '') return '-';

  switch (key) {
    case 'amount':
      return formatCurrency(Number(value));
    case 'type':
    case 'status':
      return formatForDisplay(value);
    case 'category':
      return categoryLookup[value] || formatForDisplay(value);
    default:
      return value;
  }
}

export function formatForDisplay(value) {
  return String(value)
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
