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
    { text: "工程工具", icon: "npm", link: "eng/" },
    { text: "常用包赏析", icon: "github-fill", link: "github/" },
  ] },
  { text: "后端", icon: "javascript",  prefix: "/",children:[
    { text: "NodeJS", icon: "nodejs", link: "nodejs/" },
    { text: "Koa", icon: "koa", link: "koa/" },
    { text: "mysql", icon: "mysql", link: "mysql/" },
    { text: "MongoDB", icon: "ziyuan", link: "mongodb/" },
  ]  },
  { text: "网络", icon: "yaopinwangluoxieyishezhi-",  prefix: "/",children:[
    { text: "HTTP", icon: "HTTP", link: "http/" },
  ]  },
  {text:'编程思维', icon: "bianchengsiwei", prefix: "/",children:[
    { text: "基础算法", icon: "zu", link: "algorithm/" },
    { text: "设计模式", icon: "sheji", link: "patterns/" },
  ]},
  { text: "运维", icon: "lvzhou_yunwei", prefix: "/",children:[
    { text: "linux", icon: "linux", link: "linux/" },
    { text: "nginx", icon: "Nginx", link: "nginx/" },
  ]},
  { text: "其他", icon: "shezhi",  prefix: "/",children:[
    { text: "开发工具", icon: "kaifagongju", link: "tools/" },
    { text: "副业", icon: "ps-f", link: "ps/" },
    { text: "年度目标", icon: "renwujihua", link: "year/" },
    { text: "life", icon: "mubiao", link: "life/" },
  ]  },
  {text:'文学随笔', icon: "wenxue01", prefix: "/",children:[
    { text: "诗句", icon: "weibiaoti-1", link: "verse/" },
    { text: "文章", icon: "wodewenzhang", link: "article/" },
  ]},
]);
