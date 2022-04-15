
function ajax(url) {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.open('get', url, true);
      xhr.setRequestHeader(
        "Content-Type",
        "application/x-www-form-urlencoded"
      );
      xhr.onreadystatechange = () => {
        if (xhr.readyState == '4') {
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
  function getWeek(lunar){
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
  
  var div
  
  function onReady(fn){
    var readyState = document.readyState;
    if(readyState === 'interactive' || readyState === 'complete') {
    fn()
   }else{
     window.addEventListener("DOMContentLoaded",fn);
    }
   
  }
  
   if(location.pathname === '/'){
    onReady(function(){
      setTimeout(()=>{
        div = document.createElement('div')
        div.classList = 'hero-info calendar'
        let hero = document.getElementsByClassName('hero')
        hero[0].appendChild(div)
        getCalendar()
      },300)
    })
  }

  
      
  async function getCalendar(){
    let data = await lunar()
    let html =  `<div class='title'>公历${data.sYear}年${data.sMonth + 1}月 农历${data.cYear}（${data.zodiac}）年</div>
      <div class='flex'>
      ${getEmpty(data.firstWeek)}
      ${getWeek(data)}
      </div>`
      div.innerHTML = html
  }