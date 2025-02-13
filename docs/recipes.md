<script setup>
import { data as recipes } from './recipes.data.js'
</script>

<pre>
{{recipes}}
</pre>

<ul>
  <li v-for="recipe of recipes">
    <a :href="recipe.url">{{ recipe.title }}</a>
  </li>
</ul>
