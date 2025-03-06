export const cooklangToMd = (paragraph, locale) => {
  return paragraph
    .split("\n")
    .map((line) => {
      let temp = line;
      while (hasCooklangMarkup(temp)) {
        temp = uncooklangify(temp, locale);
      }
      return temp;
    })
    .join("\n");
};

const hasCooklangMarkup = (str) => {
  return /@\S+/.test(str) || /#\S+/.test(str) || /~\S+/.test(str);
};

const uncooklangify = (str, locale) => {
  const hasIngredient = /@\S+/.test(str);
  const hasCookware = /#\S+/.test(str);
  const hasTimer = /~\S+/.test(str);
  if (!hasIngredient && !hasCookware && !hasTimer) {
    return str;
  }

  let result;
  let substring;
  let searchValue = null;
  let newValue = null;

  if (hasIngredient) {
    substring = str.match(/@\S.*/g)[0];
    substring = substring.split("@")[1];
    if (/\{.*\}/.test(substring)) {
      substring = substring.slice(0, substring.indexOf("}") + 1);
      const [_, ingredient, inner] = substring.match(/(.+)\{([^}]*)\}/);
      searchValue = "@" + substring;
      if (inner.includes("%")) {
        const [quantity, units] = inner.split("%");
        // TODO: use a custom method to format this
        // load this from a js object stored in a dedicated file
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
    substring = str.match(/#\S.*/g)[0];
    substring = str.split("#")[1];
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
    substring = str.match(/~\S.*/g)[0];
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

  if (searchValue !== null && newValue !== null) {
    result = str.replace(searchValue, newValue);
  }
  if (!result) {
    console.log({ substring, searchValue, newValue });
    throw new Error("empty result");
  }
  return result;
};
