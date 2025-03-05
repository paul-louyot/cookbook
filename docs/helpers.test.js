import { cooklangToMD, toPlainText } from "./helpers.js";

const assertStringEqual = (str1, str2) => {
  if (str1 !== str2) {
    throw "error";
  }
};

assertStringEqual(toPlainText("@water{159%mL}"), "159 mL of water");
console.log(
  toPlainText(
    "Pour water{159%mL} into a #small saucepan. Heat over medium-low heat and whisk in 200 g of semisweet chocolate.",
  ),
);
