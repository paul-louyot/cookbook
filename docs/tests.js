// apply method until nothing is found
// method to find and calls an other method that replaces

import { cooklangToMd } from "./helpers/cooklangToMd.js";

const test = (str) => {
  console.log(`"${str} => "${cooklangToMd(str)}"`);
};

test("@ingrédient1 @ingrédient2 @ingrédient 3{} @ingrédient4");
test("@oignon{1}");
test("@eau{150%mL}");
test("une #casserole");
test("une #casserole{}");
test("# markdown title");
test("# markdown title and #cookware");
test("Bake for ~{25%minutes}.");
