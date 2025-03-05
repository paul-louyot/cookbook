import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Paul's recipes",
  // description: "blah",

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    // search: {
    //   provider: 'local'
    // },
    nav: [
      { text: "Home", link: "/" },
      { text: "Recipes", link: "/recipes" },
    ],
    // sidebar: [
    //   {
    //     text: 'Examples',
    //     items: [
    //       { text: 'Markdown Examples', link: '/markdown-examples' },
    //       { text: 'Runtime API Examples', link: '/api-examples' }
    //     ]
    //   }
    // ],
  },
});
