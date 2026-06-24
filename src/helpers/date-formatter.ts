export const formatDate = (date?: Date | null | string): string => {
  if (!date || date === null) return '';

  let formattedDate: Date = typeof date === 'string' ? new Date(date) : date;

  return Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  }).format(formattedDate);
};
