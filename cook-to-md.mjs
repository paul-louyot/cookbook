import fs from "fs/promises";
import path from "path";
import {Recipe} from "@cooklang/cooklang-ts";

const COOK_DIR = "./docs/cook";
const RECIPE_DIR = "./docs/recipes";

const toMarkdown = (recipe) => {
  const metadata = recipe.metadata;
  const title = metadata.title;
  const frontmatter = Object.entries(metadata)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");

  const ingredients = recipe.ingredients.map((ing) => {
    if (!ing.units) return `- ${ing.quantity}&nbsp;${ing.name}`;
    return `- ${ing.quantity}&nbsp;${ing.units} ${ing.name}`;
  });

  const content = recipe.steps
    .map((step) =>
      step
        .map((item) => {
          if (item.type === "text") return item.value;
          if (item.type === "ingredient") {
            if (!item.units) return `${item.quantity}&nbsp;${item.name}`;
            return `${item.quantity}&nbsp;${item.units} ${item.name}`;
          }
          if (item.type === "cookware") return `${item.name}`;
          if (item.type === "timer")
            return `${item.quantity}&nbsp;${item.units}`;
          return "";
        })
        .join("")
    )
    .join("\n\n");

  return (
    `---\n${frontmatter}\n---\n\n` +
    (title ? `# ${title}\n\n` : "") +
    (!ingredients.length
      ? content + "\n"
      : "## Ingredients\n\n" +
        ingredients.join("\n") +
        "\n\n## Steps\n\n" +
        content +
        "\n")
  );
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
