export const slugToTitle = (str) => {
  return str.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase()); // Capitalize the first letter of the first word
};
