import { defineNavbarConfig } from "vuepress-theme-hope";

export default defineNavbarConfig([
  { text: "首页", icon: "shouye", link: "/" },
  { text: "前端", icon: "Web", prefix: "/",children:[
    { text: "JS", icon: "bxl-javascript", link: "js/" },
    { text: "HTML", icon: "file-html", link: "html/" },
    { text: "CSS", icon: "file-css", link: "css/" },
    { text: "vue", icon: "vue", link: "vue/" },
    { text: "webpack", icon: "webpack", link: "webpack/" },
    { text: "vite", icon: "shandian", link: "vite/" },
    { text: "包管理工具", icon: "npm", link: "npm/" },
    { text: "常用包赏析", icon: "github-fill", link: "github/" },
  ] },
  { text: "后端", icon: "javascript",  prefix: "/",children:[
    { text: "NodeJS", icon: "nodejs", link: "nodejs/" },
    { text: "Koa", icon: "koa", link: "koa/" },
    { text: "mysql", icon: "mysql", link: "mysql/" },
    { text: "MongoDB", icon: "ziyuan", link: "mongodb/" },
  ]  },
  {text:'编程思维', icon: "bianchengsiwei", prefix: "/",children:[
    { text: "基础算法", icon: "zu", link: "algorithm/" },
    { text: "设计模式", icon: "sheji", link: "patterns/" },
  ]},
  { text: "运维", icon: "lvzhou_yunwei", prefix: "/",children:[
    { text: "linux", icon: "linux", link: "linux/" },
    { text: "nginx", icon: "Nginx", link: "nginx/" },
  ]},
  {text:'文学随笔', icon: "wenxue01", prefix: "/",children:[
    { text: "诗句", icon: "weibiaoti-1", link: "verse/" },
    { text: "文章", icon: "wodewenzhang", link: "article/" },
  ]},
]);
