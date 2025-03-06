import yaml from "js-yaml";
import fs from "fs";
import path from "path";

/**
 * Retrieves a localized string from the recipes.translations.yaml file
 * based on a dot-separated path.
 *
 * @param {string} pathString - The dot-separated path to the desired key in the YAML.
 * @returns {string|null} The localized string or null if not found.
 */
export const getLocalizedString = (pathString) => {
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
