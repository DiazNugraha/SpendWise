export const capitalizeFirstLetter = (str: string) => {
  if (!str) return ''; // Handles empty strings safely
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getCurrencySymbol = (currencyCode: string, locale: string = 'en-US') => {
  const result = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
  })
    .formatToParts(0)
    .find(part => part.type === 'currency')?.value;

  return result;
};
