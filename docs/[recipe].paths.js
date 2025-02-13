// TODO: reuse './recipes.data.js'
// https://vitepress.dev/guide/routing#dynamic-routes

// TODO: get absolute paths and reuse logic

import fs from 'fs'

export default {
  paths() {

    const paths = fs.readdirSync('docs/recipes')
    console.log(paths)

    return [
      { params: { recipe: 'foo', path: paths }},

      { params: { recipe: 'bar' }}
    ]
  }
}
