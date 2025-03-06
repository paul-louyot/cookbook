// apply method until nothing is found
// method to find and calls an other method that replaces

const toPlainText = (paragraph) => {
  return paragraph
    .split("\n")
    .map((line) => {
      let temp = line;
      while (hasCooklangMarkup(temp)) {
        temp = uncooklangify(temp);
      }
      return temp;
    })
    .join("\n");
};

const hasCooklangMarkup = (str) => {
  return str.includes("@") || /#\S+/.test(str) || str.includes("~");
};

const uncooklangify = (str) => {
  const hasIngredient = str.includes("@");
  const hasCookware = /#\S+/.test(str);
  const hasTimer = str.includes("~");
  if (!hasIngredient && !hasCookware && !hasTimer) {
    return str;
  }

  let result = str;
  let substring = str;
  let searchValue;
  let newValue;
  const lines = str.split("\n");

  if (hasIngredient) {
    substring = lines.find((line) => line.includes("@"));
    substring = substring.split("@")[1];
    if (/\{.*\}/.test(substring)) {
      substring = substring.slice(0, substring.indexOf("}") + 1);
      const [_, ingredient, inner] = substring.match(/(.+)\{([^}]*)\}/);
      searchValue = "@" + substring;
      if (inner.includes("%")) {
        const [quantity, units] = inner.split("%");
        // TODO: use a custom method to format this
        newValue = [quantity, units, ingredient].join(" ");
      } else {
        newValue = inner + " " + ingredient;
      }
    } else {
      substring = substring.split(" ")[0];
      newValue = substring;
      searchValue = "@" + substring;
    }
  } else if (hasCookware) {
    substring = lines.find((line) => /#\S+/.test(line));
    substring = substring.split("#")[1];
    if (/\{.*\}/.test(substring)) {
      substring = substring.slice(0, substring.indexOf("}") + 1);
      const cookware = substring.slice(0, substring.indexOf("{"));
      newValue = cookware;
      searchValue = "#" + substring;
    } else {
      const cookware = substring.split(" ")[0];
      newValue = cookware;
      searchValue = "#" + cookware;
    }
  } else if (hasTimer) {
    substring = lines.find((line) => line.includes("~"));
    substring = substring.split("~")[1];
    if (/\{.*\}/.test(substring)) {
      substring = substring.slice(0, substring.indexOf("}") + 1);
      const [_, name, inner] = substring.match(/(.*)\{([^}]*)\}/);
      searchValue = "~" + substring;
      if (inner.includes("%")) {
        const [duration, units] = inner.split("%");
        newValue = [duration, units].join(" ");
      } else {
        throw new Error("timer definition error");
      }
    } else {
      throw new Error("timer definition error");
    }
  }

  if (searchValue && newValue) {
    result = result.replace(searchValue, newValue);
  }
  return result;
};

const test = (str) => {
  console.log(`"${str} => "${toPlainText(str)}"`);
};

test("@ingrédient1 @ingrédient2 @ingrédient 3{} @ingrédient4");
test("@oignon{1}");
test("@eau{150%mL}");
test("une #casserole");
test("une #casserole{}");
test("Bake for ~{25%minutes}.");
test("# markdown title");
