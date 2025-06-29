---
---

<script setup>
import { data as recipes } from './recipes.data.js'
</script>

<ul>
  <li v-for="post of recipes">
    <a :href="post.url">{{ post.frontmatter.title || post.url.split("/").at(-1).split(".")[0] }}</a>
  </li>
</ul>
