export function parseFormattedString(input: string): string {
  const formater = new Intl.NumberFormat(navigator.language);
  const thousandSeparator = formater.format(1111).replace(/1/g, '');
  const unformattedString = input.replace(new RegExp('\\' + thousandSeparator, 'g'), '');
  const decimalSeparator = formater.format(1.1).replace(/1/g, '');
  return unformattedString.replace(new RegExp('\\' + decimalSeparator, 'g'), '.');
}

export function formatNumber(input: number): string {
  if ((!input && input !== 0) || isNaN(input)) {
    return '';
  }
  return new Intl.NumberFormat(navigator.language).format(input);
}
