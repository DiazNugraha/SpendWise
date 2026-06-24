export const formatDate = (
  date?: Date | null | string,
  options: {
    locales?: Intl.LocalesArgument;
    dateTimeOption?: Intl.DateTimeFormatOptions;
  } = {
    locales: 'en-GB',
    dateTimeOption: {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    },
  },
): string => {
  if (!date || date === null) return '';

  let formattedDate: Date = typeof date === 'string' ? new Date(date) : date;

  const {locales, dateTimeOption} = options;

  return new Intl.DateTimeFormat(locales, dateTimeOption).format(formattedDate);
};
