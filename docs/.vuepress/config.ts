import { defineHopeConfig } from "vuepress-theme-hope";
import themeConfig from "./themeConfig";

export default defineHopeConfig({
  lang: "zh-CN",
  title: "橙皮书",
  description: "橙子成长路上的点点滴滴！",
  base: "/",
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    [
      "link",
      {
        rel: "stylesheet",
        href: "//at.alicdn.com/t/font_2410206_mfj6e1vbwo.css",
      },
    ],
    [
      "link",
      {
        rel: "stylesheet",
        href: "//at.alicdn.com/t/font_3327774_6ktv5z62sa6.css",
      },
    ],
    [
      "script",
      {
        src: "/index.js",
      },
    ],
  ],
  themeConfig,
});
