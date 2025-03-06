import { Recipe } from "@cooklang/cooklang-ts";
import { getLocalizedString } from "./getLocalizedString";
import { cooklangToMd } from "./cooklangToMd";
import unitsFormatter from "./unitsFormatter";

export const createRecipeContent = (source, slug) => {
  const recipe = new Recipe(source);
  const locale = recipe.metadata.locale || "en";
  const url = recipe.metadata.url;
  const formatter = unitsFormatter[locale];
  if (!formatter) {
    throw new Error(`Please specify a formatter for locale ${locale}`);
  }

  const title = recipe.metadata?.title
    ? recipe.metadata.title
    : slugToTitle(slug);

  const subtitle1 = getLocalizedString(`${locale}.titles.ingredients`);

  const ingredients = recipe.ingredients
    .map(({ name, quantity, units }) => {
      return formatter(name, quantity, units);
    })
    .map((string) => `- ${string}`)
    .join("\n");

  const subtitle2 = getLocalizedString(`${locale}.titles.steps`);

  // remove metadata
  const text = source
    .split("\n")
    .filter((line) => !line.trim().startsWith(">>"))
    .join("\n");

  const body = cooklangToMd(text, locale);

  let additionalInfos = "";
  if (url) {
    additionalInfos += "---\n\n";
    additionalInfos += getLocalizedString(`${locale}.metadata.source`);
    additionalInfos += ` [${url}](${url})`;
  }

  return `
# ${title}

## ${subtitle1}

${ingredients}

## ${subtitle2}

${body}
${additionalInfos}
`;
};

export const slugToTitle = (str) => {
  return str.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase()); // Capitalize the first letter of the first word
};
