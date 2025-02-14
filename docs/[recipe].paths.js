// TODO: reuse './recipes.data.js'
// https://vitepress.dev/guide/routing#dynamic-routes

// TODO: get absolute paths and reuse logic

import fs from 'fs'
import path from 'path';
import { Recipe } from '@cooklang/cooklang-ts';
// __dirname

const formatRecipe = (recipe) => ([
  "# Ingredients",
  formatIngredients(recipe.ingredients),
  "# Steps",
  formatSteps(recipe.steps)
].join("\n\r"))

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
  if(e.type === "text") return e.value
  if(e.type === "cookware") return e.name
  if(e.type === "ingredient"){
    return `${e.quantity} ${e.units} of ${e.name}`
  }
  if(e.type === "timer"){
    return `${e.quantity} ${e.units}`
  }
}


export default {
  paths() {
    const scanDir = path.join(__dirname, 'recipes');

    return fs.readdirSync(scanDir).map(file => {
      const filepath = path.join(scanDir, file)
      const source = fs.readFileSync(filepath, 'utf-8')
      const parsedPath = path.parse(filepath);
      const recipe = parsedPath.name;
      const recipeObject = new Recipe(source)
      const content = formatRecipe(recipeObject)
      return {
        params: {
          recipe, // name is confusing
          data: recipeObject.steps
        },
        content
      }
    });

  }
}
