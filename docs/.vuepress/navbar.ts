import { defineNavbarConfig } from "vuepress-theme-hope";

export default defineNavbarConfig([
  { text: "首页", icon: "shouye", link: "/" },
  { text: "前端", icon: "Web", prefix: "/",children:[
    { text: "JS", icon: "bxl-javascript", link: "js/" },
    { text: "HTML", icon: "file-html", link: "html/" },
    { text: "CSS", icon: "file-css", link: "css/" },
    { text: "webpack", icon: "webpack", link: "css/" },
    { text: "vite", icon: "webpack", link: "css/" },
    { text: "包管理工具", icon: "npm", link: "css/" },
    { text: "常用包赏析", icon: "github-fill", link: "css/" },
  ] },
  { text: "后端", icon: "javascript",  prefix: "/",children:[
    { text: "NodeJS", icon: "nodejs", link: "nodejs/" },
    { text: "Koa", icon: "koa", link: "koa/" },
    { text: "mysql", icon: "mysql", link: "mysql/" },
    { text: "MongoDB", icon: "ziyuan", link: "mongodb/" },
  ]  },
  {text:'编程思维', icon: "bianchengsiwei", prefix: "/",children:[
    { text: "基础算法", icon: "zu", link: "nodejs/" },
    { text: "设计模式", icon: "sheji", link: "nodejs/" },
  ]},
  { text: "运维", icon: "lvzhou_yunwei", prefix: "/",children:[
    { text: "linux", icon: "linux", link: "nodejs/" },
    { text: "nginx", icon: "Nginx", link: "nodejs/" },
  ]},
  {text:'文学随笔', icon: "wenxue01", prefix: "/",children:[
    { text: "诗句", icon: "weibiaoti-1", link: "nodejs/" },
    { text: "文章", icon: "wodewenzhang", link: "nodejs/" },
  ]},
]);
