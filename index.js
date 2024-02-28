import fs from 'node:fs'
import chalk from 'chalk'

if (!global.segment) {
  global.segment = (await import("oicq")).segment
}

let ret = []

logger.info(chalk.rgb(0, 0, 204)(`---------awa---------`))
logger.info(chalk.rgb(0, 0, 204)(`无用插件载入成功~qwq`))
logger.info(chalk.rgb(0, 0, 204)(`Created By 曉K`))
logger.info(chalk.rgb(0, 0, 204)(`我的原神星铁聊天群285258025`))
logger.info(chalk.rgb(0, 0, 204)(`本插件聊天群861663639`))
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
