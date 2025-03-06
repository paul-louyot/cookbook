// https://vitepress.dev/guide/data-loading

import fs from "node:fs";
import path from "path";
import { fileURLToPath } from "url";
import { Recipe } from "@cooklang/cooklang-ts";
import { slugToTitle } from "./helpers/slugToTitle";

export default {
  watch: ["./recipes/*.cook"],
  load(watchedFiles) {
    return watchedFiles.map((file) => {
      const currentDir = path.basename(
        path.dirname(fileURLToPath(import.meta.url)),
      );
      const relativePath = path.relative(currentDir, file); // Get path relative to "docs"
      const parsedPath = path.parse(relativePath); // Parse the file path
      const url = parsedPath.name;

      const source = fs.readFileSync(file, "utf-8");
      const recipe = new Recipe(source);
      const title = recipe.metadata.title
        ? recipe.metadata.title
        : slugToTitle(url);

      return {
        url,
        title,
      };
    });
  },
};
