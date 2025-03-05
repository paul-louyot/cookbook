import { Recipe } from "@cooklang/cooklang-ts";

export const cooklangToMD = (source, slug) => {
  const recipe = new Recipe(source);

  const title = recipe.metadata?.title
    ? recipe.metadata.title
    : slugToTitle(slug);

  const ingredients = recipe.ingredients
    .map(({ name, quantity, units }) => {
      return formatIngredient(name, quantity, units, recipe.metadata.locale);
    })
    .map((string) => `- ${string}`)
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
      (match, item, quantity, unit) => {
        return formatIngredient(item, quantity, unit, recipe.metadata.locale);
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

const formatIngredient = (name, quantity, unit, locale) => {
  if (!unit) {
    return `${quantity} ${name}`;
  }
  return `${quantity} ${unit} ${getSeparator(name, locale)}${name}`;
};

const getSeparator = (name, locale) => {
  // TODO: store this logic in a locale file
  if (locale === "fr") {
    let separator = "de ";
    if (/^[aeiouhAEIOUH]/.test(name)) separator = "d'";
    return separator;
  }
  return "of ";
};
