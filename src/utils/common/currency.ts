export function currency(
  num: number,
  locale: string,
  currency: string,
  digits: number = 0
) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: digits
  }).format(num);
}

export function currencyTWD(num?: number) {
  if (!num) return currency(0, 'zh-TW', 'TWD');
  return currency(num, 'zh-TW', 'TWD');
}

export function replaceTWDSymbol(currency: string, str: string = '') {
  return currency.replace('$', str);
}
