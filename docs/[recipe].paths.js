// TODO: reuse './recipes.data.js'
// https://vitepress.dev/guide/routing#dynamic-routes

// TODO: get absolute paths and reuse logic
import { fileURLToPath } from 'url';

import fs from 'fs'
import path from 'path';
// __dirname

export default {
  paths() {
    const scanDir = path.join(__dirname, 'recipes');

    return fs.readdirSync(scanDir).map(file => {
      const filepath = path.join(scanDir, file)
      const content = fs.readFileSync(filepath, 'utf-8')
      const parsedPath = path.parse(filepath);
      const recipe = parsedPath.name;
      return {
        params: {
          recipe,
          content
        }
      }
    });

  }
}
