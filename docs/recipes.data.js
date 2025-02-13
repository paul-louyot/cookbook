import fs from 'node:fs'
// import fs from 'fs'
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { Recipe, Parser, getImageURL } from '@cooklang/cooklang-ts';

function humanize(str) {
  return str
    .replace(/-/g, ' ')
    .replace(/^\w/, c => c.toUpperCase()); // Capitalize the first letter of the first word
}

export default {
  watch: ['./recipes/*.cook'],
  load(watchedFiles) {
    // watchedFiles will be an array of absolute paths of the matched files.
    // generate an array of blog post metadata that can be used to render
    // a list in the theme layout
    return watchedFiles.map((file) => {
      const currentDir = path.basename(path.dirname(fileURLToPath(import.meta.url)));
      const url = path.relative(currentDir, file).replace('.cook', '')
      const relativePath = path.relative(currentDir, file); // Get path relative to "docs"
      const parsedPath = path.parse(relativePath); // Parse the file path

      const source = fs.readFileSync(file, 'utf-8')
      const recipe = new Recipe(source)
      if (recipe.metadata?.tags){
        recipe.metadata.tags = recipe.metadata.tags.split(',')
      }
      const title = recipe.metadata.title ? recipe.metadata.title : humanize(parsedPath.name)

      return {
        url,
        title,
        parsedPath,
        recipe,
      }
    })
  }

}

