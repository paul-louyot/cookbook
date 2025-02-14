// https://vitepress.dev/guide/routing#dynamic-routes

import fs from 'fs'
import path from 'path';
import { Recipe } from '@cooklang/cooklang-ts';
import { humanize } from './helpers';

const formatRecipe = (recipe, slug) => {
  const formatIngredients = (ingredients) => {
    return ingredients.map((i) => {
      return `- ${formatElement(i)}`
    }).join("\n")
  }

  const formatSteps = (steps) => {
    return steps.map(step => {
      return step.map(formatElement).join("")
    }).join("\n\n")
  }

  const formatElement = (e) => {
    // how to solve this?
    const separator = recipe.metadata?.locale === 'fr' ? 'de' : 'of'
    if(e.type === "text") return e.value
    if(e.type === "cookware") return e.name
    if(e.type === "ingredient"){
      return e.units
              ? `${e.quantity} ${e.units} ${separator} ${e.name}`
              : `${e.quantity} ${e.name}`
    }
    if(e.type === "timer"){
      return `${e.quantity} ${e.units}`
    }
  }
  return [
    `# ${recipe?.metadata?.title ? recipe.metadata.title : humanize(slug)}`,
    "## Ingredients",
    formatIngredients(recipe.ingredients),
    "## Steps",
    formatSteps(recipe.steps)
  ].join("\n\r")
}



export default {
  paths() {
    const scanDir = path.join(__dirname, 'recipes');

    return fs.readdirSync(scanDir).map(file => {
      const filepath = path.join(scanDir, file)
      const parsedPath = path.parse(filepath);
      const recipeSlug = parsedPath.name;
      const source = fs.readFileSync(filepath, 'utf-8')
      const recipe = new Recipe(source)
      const content = formatRecipe(recipe, recipeSlug)
      return {
        params: {
          recipeSlug,
        },
        content
      }
    });
  }
}
