import { pathsLoader } from "vitepress-plugin-cooklang";

const transformPath = (path) => {
  return path.replace(/^docs\//, "").replace(/\.cook$/, "");
};

export default {
  async paths() {
    const data = await pathsLoader("**/*.cook", transformPath);
    return data.map(({ filePath, source, metadata, recipe }) => {
      return {
        params: {
          recipeSlug: filePath,
          source,
          metadata,
          recipe,
        },
      };
    });
  },
};
