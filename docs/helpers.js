import { Recipe } from "@cooklang/cooklang-ts";

export const cooklangToMD = (source, slug) => {
  const recipe = new Recipe(source);

  const title = recipe.metadata?.title
    ? recipe.metadata.title
    : slugToTitle(slug);

  const ingredients = recipe.ingredients
    .map(({ name, units, quantity }) => {
      if (!units) {
        return `- ${quantity} ${name}`;
      }
      return `- ${quantity} ${units} ${getSeparator(name, recipe)}${name}`;
    })
    .join("\n");

  // remove metadata
  const text = source
    .split("\n")
    .filter((line) => !line.trim().startsWith(">>"))
    .join("\n");

  const steps = text
    .replace(/~\{(\d+\/?\d*)%([^}]*)\}/g, "$1 $2")
    .replace(
      /@(.*?)\{(\d+\/?\d*)%?([^}]*)\}/g,
      // this method should be provided by the user?
      (match, item, quantity, unit) => {
        if (!unit) {
          return `${quantity} ${item}`;
        }
        return `${quantity} ${unit} ${getSeparator(item, recipe)}${item}`;
      },
    )
    .replace(/#(.*?)\{\}/g, "$1");

  return `
# ${title}

## Ingredients

${ingredients}

## Steps

${steps}`;
};

export const slugToTitle = (str) => {
  return str.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase()); // Capitalize the first letter of the first word
};

const getSeparator = (name, recipe) => {
  if (recipe.metadata.locale === "fr") {
    let separator = "de ";
    if (/^[aeiouhAEIOUH]/.test(name)) separator = "d'";
    return separator;
  }
  return "of ";
};
