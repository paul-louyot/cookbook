<script setup>
import { data } from './recipes.data.js'
const recipes = data.map(({frontmatter, url})=>{
  const title = frontmatter.title || url.split("/").at(-1).split(".")[0]
  return { title, url }
})
</script>

<ul>
  <li v-for="recipe of recipes">
    <a :href="recipe.url">{{ recipe.title }}</a>
  </li>
</ul>
