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

export const getDaysLeft = (endDate: Date): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(endDate);
  target.setHours(0, 0, 0, 0);

  const diffMs = target.getTime() - today.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
};

export const getDaysBetween = (date1: Date, date2: Date) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  // Use UTC to avoid daylight saving time bugs
  const utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
  const utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());

  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.abs(Math.floor((utc2 - utc1) / msPerDay));
};
