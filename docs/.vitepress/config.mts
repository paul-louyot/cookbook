import {defineConfig} from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Paul's recipes",
  // description: "blah",
  head: [["link", {rel: "icon", href: "/favicon.svg", type: "image/svg+xml"}]],

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    aside: false,
    // search: {
    //   provider: 'local'
    // },
    nav: [
      {text: "About", link: "/about"},
      // { text: "Recipes", link: "/recipes" },
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
