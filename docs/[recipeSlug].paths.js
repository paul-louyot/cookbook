// https://vitepress.dev/guide/routing#dynamic-routes

import fs from "fs";
import path from "path";
import { createRecipeContent } from "./helpers/createRecipeContent";

export default {
  paths() {
    const scanDir = path.join(__dirname, "recipes");

    return fs.readdirSync(scanDir).map((file) => {
      const filepath = path.join(scanDir, file);
      const parsedPath = path.parse(filepath);
      const recipeSlug = parsedPath.name;
      const source = fs.readFileSync(filepath, "utf-8");
      const content = createRecipeContent(source, recipeSlug);
      // idea: use same approach to expose a ingredients string and a steps string
      return {
        params: {
          recipeSlug,
        },
        content,
      };
    });
  },
};
