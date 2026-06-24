export const capitalizeFirstLetter = (str: string) => {
  if (!str) return ''; // Handles empty strings safely
  return str.charAt(0).toUpperCase() + str.slice(1);
};
