export default {
  fr(ingredient, quantity, units) {
    let separator = "de ";
    if (/^[aeiouhAEIOUH]/.test(ingredient)) separator = "d'";
    return `${quantity} ${units} ${separator}${ingredient}`;
  },
  en(ingredient, quantity, units) {
    return `${quantity} ${units} of ${ingredient}`;
  },
};
