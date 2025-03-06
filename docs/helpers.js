import { Recipe } from "@cooklang/cooklang-ts";
import fs from "fs";
import path from "path";
import yaml from "js-yaml";

export const createRecipeContent = (source, slug) => {
  const recipe = new Recipe(source);
  const locale = recipe.metadata.locale || "en";
  const url = recipe.metadata.url;

  const title = recipe.metadata?.title
    ? recipe.metadata.title
    : slugToTitle(slug);

  const subtitle1 = getLocalizedString(`${locale}.titles.ingredients`);

  const ingredients = recipe.ingredients
    .map(({ name, quantity, units }) => {
      return formatIngredient(name, quantity, units, recipe.metadata.locale);
    })
    .map((string) => `- ${string}`)
    .join("\n");

  const subtitle2 = getLocalizedString(`${locale}.titles.steps`);

  // remove metadata
  const text = source
    .split("\n")
    .filter((line) => !line.trim().startsWith(">>"))
    .join("\n");

  const body = toPlainText(text, recipe.metadata.locale);

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

export const toPlainText = (str, locale = "en") => {
  return str
    .replace(/([@])([^{}]*)\{([^}]*)\}/g, (match, symbol, word, content) => {
      if (!content) return word;
      const [amount, unit] = content.split("%");
      return unit ? `${amount} ${unit} of ${word}` : `${amount} ${word}`;
    })
    .replace(/([~])([^{}]*)\{([^}]*)\}/g, (match, symbol, word, content) => {
      if (symbol === "~") {
        const [amount, unit] = content.split("%");
        return unit ? `${amount} ${unit}` : `${amount} ${word}`;
      }
      return match;
    })
    .replace(/([@#~])([^{}]+)\{\}/g, "$2");

  return str
    .replace(/~\{(\d+\/?\d*)%([^}]*)\}/g, "$1 $2")
    .replace(/@(.*?)\{\}/g, "$1")
    .replace(/#(.*?)\{\}/g, "$1")
    .replace(
      /@(.*?)\{(\d+\/?\d*)%?([^}]*)\}/g,
      (match, item, quantity, unit) => {
        return formatIngredient(item, quantity, unit, locale);
      },
    );
};

const formatIngredient = (name, quantity, unit, locale) => {
  const formattedQuantity = /^\d+(\.\d{3,})$/.test(quantity)
    ? parseFloat(quantity).toFixed(2)
    : quantity;

  if (!unit) {
    return `${formattedQuantity} ${name}`;
  }
  return `${formattedQuantity} ${unit} ${getSeparator(name, locale)}${name}`;
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

/**
 * Retrieves a localized string from the recipes.translations.yaml file
 * based on a dot-separated path.
 *
 * @param {string} pathString - The dot-separated path to the desired key in the YAML.
 * @returns {string|null} The localized string or null if not found.
 */
const getLocalizedString = (pathString) => {
  // TODO: reference translation file from somewhere else
  const translationsFilePath = path.resolve(
    __dirname,
    "recipes.translations.yaml",
  );

  // Check if the translations file exists
  if (!fs.existsSync(translationsFilePath)) {
    console.error("recipes.translations.yaml file not found");
    return null;
  }

  // Read the YAML file
  const fileContents = fs.readFileSync(translationsFilePath, "utf8");

  // Parse the YAML content
  let translations;
  try {
    translations = yaml.load(fileContents);
  } catch (e) {
    console.error("Error parsing recipes.translations.yaml:", e);
    return null;
  }

  // Split the path string into an array of keys
  const keys = pathString.split(".");

  // Traverse the nested translations object
  let result = translations;
  for (let key of keys) {
    if (result && key in result) {
      result = result[key];
    } else {
      console.error(`Key '${pathString}' not found in translations`);
      return null;
    }
  }

  // Return the localized string or null if not found
  return result || null;
};
