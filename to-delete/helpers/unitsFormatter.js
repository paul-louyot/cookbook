export default {
  fr(ingredient, quantity, units) {
    const formattedQuantity = /^\d+(\.\d{3,})$/.test(quantity)
      ? parseFloat(quantity).toFixed(2)
      : quantity;

    if (!units) {
      return `${formattedQuantity} ${ingredient}`;
    }

    let separator = "de ";
    if (/^[aeiouhAEIOUH]/.test(ingredient)) separator = "d'";
    return `${formattedQuantity}&nbsp;${units} ${separator}${ingredient}`;
  },
  en(ingredient, quantity, units) {
    const formattedQuantity = /^\d+(\.\d{3,})$/.test(quantity)
      ? parseFloat(quantity).toFixed(2)
      : quantity;

    if (!units) {
      return `${formattedQuantity} ${ingredient}`;
    }

    return `${formattedQuantity}&nbsp;${units} of ${ingredient}`;
  },
};
