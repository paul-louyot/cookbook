import { dataLoader } from "vitepress-plugin-cooklang";

const transformPath = (path) => {
  return path.replace(/^docs\//, "").replace(/\.cook$/, "");
};

export default {
  watch: ["./**/*.cook"],
  load(watchedFiles) {
    return dataLoader(watchedFiles, transformPath);
  },
};
