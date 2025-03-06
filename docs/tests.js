// apply method until nothing is found
// method to find and calls an other method that replaces

import { cooklangToMd } from "./helpers/cooklangToMd.js";

const test = (cooklang, markdown) => {
  const result = cooklangToMd(cooklang, "en");
  if (result == markdown) {
    console.log("✅", cooklang);
    return;
  }
  console.log("❌", cooklang);
  throw new Error(`\nexpected "${markdown}"\ngot      "${result}"`);
};

test("@ingredient", "ingredient");
test("@ingredient{1}", "1 ingredient");
test("@ingredient{quantity%units}", "quantity units of ingredient");
test("a #pot", "a pot");
test("a #pot{}", "a pot");
test("# markdown title", "# markdown title");
test("# markdown title and #cookware", "# markdown title and cookware");
test("Bake for ~{25%minutes}", "Bake for 25 minutes");
