---
home: true
icon: home
title: 主页
# heroImage: /logo.png
heroText: 橙皮书
tagline: 橙子成长路上的点点滴滴
actions:
  - text: 个人简历 🍀
    link: /guide/
    type: secondary

  - text: 个人项目 🍊
    link: /home

features:
  - title:  前端小工具集合
    icon: gongjuxiang
    details: 时间戳转换、url转换，MD5转换等等
    link: /js

  - title: 免费api接口文档
    icon: APIguanli
    details: 免费有效的常用api接口，免费的登陆登出，天气，ip转换地址等等
    link: /api

  - title: 留言板
    icon: liuyanban
    details: 意见建议功能请求
    link: /msgbord
  

---

<!-- ## 友情链接 -->

<!-- [阮一峰的个人网站](https://www.ruanyifeng.com/) -->

## 联系我

<div style='display: flex;align-items: center;justify-content: space-around;'>
<img width='380px' src='/qrcode.jpg'/>
<img width='400px' src='/wechat.png'/>
</div>

##  捐赠鼓励

<div style='display: flex;align-items: center;justify-content: space-around;'>
<img width='400px' src='/wxcode.png'/>
<img width='400px' src='/zfb.png'/>
</div>

<script>
function ajax(url) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.setRequestHeader(
      "Content-Type",
      "application/x-www-form-urlencoded"
    );
    xhr.onreadystatechange = () => {
      // 当异步请求状态为4时，请求已完成，并且准备就绪
      if (xhr.readyState == '4') {
        //如果200，代表请求成功
        if (xhr.status == '200')
          resolve(xhr.responseText)
      }else if(xhr.status == '404') {
        reject(new Error('404 NOT FOUND'))
      }
    }
    // 5.发送请求
    xhr.send(null);
  })
}

async function lunar (){
    let res =  await ajax('https://xldou.cn/api/util/lunar')
    res = JSON.parse(res)
    return res.data || {}
}
const getWeek = (lunar)=>{
  let res = ''
  let arr = []
  for(let i = 0; i < lunar.length; i++){
      arr.push(lunar[i])
  }
   arr.forEach(item=>{
      res += `<div class='card ${item.isToday ? 'active' : ''}'>
      <p class='lDay'>${item.isLeap ? '闰': '' }${item.lMonth}月 ${item.lDay}日</p>
      <p class='sDay'>${item.sDay === 1 ? item.sMonth+ '月' : item.sDay}</p>
      <p class='days'>${item.lunarFestival} ${item.solarTerms} ${item.solarFestival}</p>
      </div>`
  })
  return res
}
function getEmpty (firstWeek){
    let res = ''
    let arr = Array(firstWeek -1 ).fill(1)
    arr.forEach(()=>{
        return res += `<div class='card' ></div>`
    })
    return res
}

let div

function onReady(fn){
  var readyState = document.readyState;
  if(readyState === 'interactive' || readyState === 'complete') {
  fn()
 }else{
   window.addEventListener("DOMContentLoaded",fn);
  }
 
}
 
onReady(function(){
  setTimeout(()=>{
    div = document.createElement('div')
    div.classList = 'hero-info calendar'
    let hero = document.getElementsByClassName('hero')
    console.log(hero[0])
    hero[0].appendChild(div)
    getCalendar()
  },300)
})
    
async function getCalendar(){
  let data = await lunar()
  let html =  `<div class='title'>公历${data.sYear}年${data.sMonth + 1}月 农历${data.cYear}（${data.zodiac}）年</div>
    <div class='flex'>
    ${getEmpty(data.firstWeek)}
    ${getWeek(data)}
    </div>`
    div.innerHTML = html
}

</script>