// https://vitepress.dev/guide/routing#dynamic-routes

import fs from "fs";
import path from "path";
import { cooklangToMD } from "./helpers";

export default {
  paths() {
    const scanDir = path.join(__dirname, "recipes");

    return fs.readdirSync(scanDir).map((file) => {
      const filepath = path.join(scanDir, file);
      const parsedPath = path.parse(filepath);
      const recipeSlug = parsedPath.name;
      const source = fs.readFileSync(filepath, "utf-8");
      const content = cooklangToMD(source, recipeSlug);
      return {
        params: {
          recipeSlug,
        },
        content,
      };
    });
  },
};
