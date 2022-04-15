
const SSHClient = require('ssh2').Client
const client = require('scp2')
const ora = require('ora')
const conn = new SSHClient()
const spinner = ora('正在发布到服务器...').start()
// const fs = require('fs')
// const data = fs.readFileSync('./dist/index.html', 'utf-8')
// const cDate = new Date()

// const execSync = require('child_process').execSync
// const username = execSync('git config user.name', {
//   encoding: 'utf-8'
// })

// 写入打包发布时间
// fs.writeFileSync('./dist/index.html', data.replace('DEPLOY_INFO', `${username} 发布于 ${cDate.getFullYear()} -${cDate.getMonth() + 1}-${cDate.getDate()} ${cDate.getHours()}:${cDate.getMinutes()}`))

let config = require('./config')

conn
  .on('ready', function () {
    conn.exec(`rm -rf ${config.path}*`, function (err, stream) {
      if (err) throw err
      spinner.text = '删除文件成功！'
      stream.on('close', function (code, signal) {
        spinner.text = '开始上传'
        client.scp('./docs/.vuepress/dist/', config, err => {
          if (err) {
            spinner.stop()
            console.log(err)
            throw err
          } else {
            spinner.succeed('上传成功')
          }
        })
        conn.end()
      })
    })
  })
  .connect(config)
