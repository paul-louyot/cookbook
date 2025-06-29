import fs from "fs/promises";
import path from "path";
import ejs from "ejs";
import {Recipe} from "@cooklang/cooklang-ts";

const COOK_DIR = "./docs/cook";
const RECIPE_DIR = "./docs/recipes";

const TEMPLATE = `<% if (Object.keys(metadata).length > 0) { %>---
<% for (const key in metadata) { %><%= key %>: <%= metadata[key] %>
<% } %>---
<% } %>
<% if (title) { %># <%- title %><% } %>
<% if (!ingredients.length) { %><%- steps %><% } %>
<% if (ingredients.length) { %>
## Ingredients

<% for (const ingredient of ingredients) { %>- <%- ingredient %>
<% } %>

## Steps
<% for (const step of steps) { %>
<%- step %>
<% } %><% } %>
`;

const toMarkdown = (recipe) => {
  const metadata = recipe.metadata;
  const title = metadata.title;

  const ingredients = recipe.ingredients.map((ing) => {
    if (!ing.units) return `${ing.quantity}&nbsp;${ing.name}`;
    return `${ing.quantity}&nbsp;${ing.units} ${ing.name}`;
  });

  const steps = recipe.steps.map((step) =>
    step
      .map((item) => {
        if (item.type === "text") return item.value;
        if (item.type === "ingredient") {
          if (!item.units) return `${item.quantity}&nbsp;${item.name}`;
          return `${item.quantity}&nbsp;${item.units} ${item.name}`;
        }
        if (item.type === "cookware") return `${item.name}`;
        if (item.type === "timer") return `${item.quantity}&nbsp;${item.units}`;
        return "";
      })
      .join("")
  );

  return ejs.render(TEMPLATE, {
    metadata,
    title,
    ingredients,
    steps,
  });
};

const processFiles = async () => {
  await fs.mkdir(RECIPE_DIR, {recursive: true});

  const files = await fs.readdir(COOK_DIR);
  const cookFiles = files.filter((f) => f.endsWith(".cook"));

  for (const file of cookFiles) {
    const filePath = path.join(COOK_DIR, file);
    const raw = await fs.readFile(filePath, "utf-8");
    const recipe = new Recipe(raw);

    const mdContent = toMarkdown(recipe);
    const mdPath = path.join(RECIPE_DIR, file.replace(/\.cook$/, ".md"));

    await fs.writeFile(mdPath, mdContent, "utf-8");
    console.log(`Converted: ${file} → ${path.relative(".", mdPath)}`);
  }
};

processFiles().catch(console.error);
