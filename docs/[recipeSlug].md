<script setup>
import { useData } from 'vitepress'
import { ref } from "vue"
const { params } = useData()
const metadata = params.value.metadata;
const locale = metadata.locale || "en"
const title = metadata.title || params.value.recipeSlug
const newServings = ref(metadata.servings || 1)

const ingredientsFormatters = {
  fr(ingredient, quantity, units) {
    if(quantity === "some"){
      return ingredient
    }
    let formattedQuantity = quantity;
    if(/^\d+(\.\d{3,})$/.test(quantity)){
      formattedQuantity = parseFloat(quantity).toFixed(2);
    }
    if (!units) {
      return `${formattedQuantity} ${ingredient}`;
    }
    let separator = "de ";
    if (/^[aeiouhAEIOUH]/.test(ingredient)) separator = "d'";
    return `${formattedQuantity}&nbsp;${units} ${separator}${ingredient}`;
  },
  en(ingredient, quantity, units) {
    const formattedQuantity = /^\d+(\.\d{3,})$/.test(quantity)
      ? parseFloat(quantity).toFixed(2)
      : quantity;

    if (!units) {
      return `${formattedQuantity} ${ingredient}`;
    }

    return `${formattedQuantity}&nbsp;${units} of ${ingredient}`;
  },
}
const formatIngredient = ingredientsFormatters[locale]

const formatStepItem = (item) => {
  if (item.type === "text") {
    return item.value;
  }
  if (item.type === "cookware") {
    return item.name;
  }
  if (item.type === "ingredient") {
    return formatIngredient(item.name, item.quantity, item.units)
  }
  if (item.type === "timer"){
    return `${item.quantity}&nbsp;${item.units}`
  }
};
const onDecrement = () => {
  if(newServings.value === 1) return;
  newServings.value--;
}
const onIncrement = () => {
  newServings.value++;
}

</script>

# {{ title }}

<p v-if="metadata.servings">
  Servings:
  <button :class="$style.button" @click="onDecrement">-</button>
  {{newServings}}
  <button :class="$style.button" @click="onIncrement">+</button>
</p>

## Ingredients

<ul>
  <li v-for="{ name, quantity, units } of params.recipe.ingredients"
      v-html="formatIngredient(name, quantity, units)">
  </li>
</ul>

## Steps

<p v-for="step of params.recipe.steps">
  <template v-for="stepItem of step">
    <span v-html="formatStepItem(stepItem)"></span>
  </template>
</p>

<style module>
.button {
  border: 1px dashed;
  border-radius: 50px;
  padding: 0.5rem;
  border: 1px dashed;
  border-radius: 50px;
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
</style>
