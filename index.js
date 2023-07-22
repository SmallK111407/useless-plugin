import fs from 'node:fs'
import chalk from 'chalk'

await initConfig()

if (!global.segment) {
  global.segment = (await import("oicq")).segment
}

async function initConfig() {
  //检测有没有配置文件
  const configPath = process.cwd().replace(/\\/g, "/") + '/plugins/useless-plugin/'
  let path = configPath + 'config/'
  let pathDef = configPath + 'def/'
  const files = fs.readdirSync(pathDef).filter(file => file.endsWith('.yaml') + file.endsWith('.js'))
  for (let file of files) {
    if (!fs.existsSync(`${path}${file}`)) {
      fs.copyFileSync(`${pathDef}${file}`, `${path}${file}`)
      logger.error(`检测到路径为${path + file}的配置文件不存在, 已重新生成`)
    }
  }
}
let ret = []

logger.info(chalk.rgb(0, 0, 204)(`---------awa---------`))
logger.info(chalk.rgb(0, 0, 204)(`无用插件载入成功~qwq`))
logger.info(chalk.rgb(0, 0, 204)(`Created By 曉K`))
logger.info(chalk.rgb(0, 0, 204)(`聊天群861663639`))
logger.info(chalk.rgb(0, 0, 204)(`---------------------`));

const files = fs
  .readdirSync('./plugins/useless-plugin/apps')
  .filter((file) => file.endsWith('.js'))

  files.forEach((file) => {
    ret.push(import(`./apps/${file}`))
})

ret = await Promise.allSettled(ret)

let apps = {}
for (let i in files) {
  let name = files[i].replace('.js', '')
  
  if (ret[i].status != 'fulfilled') {
    logger.error(`载入插件错误：${logger.red(name)}`)
    logger.error(ret[i].reason)
    continue
    }
    apps[name] = ret[i].value[Object.keys(ret[i].value)[0]]
}
export { apps }
