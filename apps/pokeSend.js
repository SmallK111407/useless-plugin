import plugin from '../../../lib/plugins/plugin.js'
import setting from '../model/setting.js'
import fs from 'node:fs'
import fetch from 'node-fetch'

const _path = process.cwd() + '/plugins/useless-plugin'

export class pokeSend extends plugin {
  constructor() {
    super({
      name: '[无用插件]戳一戳',
      dsc: '戳一戳发送图片',
      event: 'notice.group.poke',
      priority: 10,
      rule: [
        {
          fnc: 'pokeSend'
        }
      ]
    })
  }
  get appconfig() { return setting.getConfig("config") }

  async pokeSend(e) {
    let result = this.appconfig['poke']
    if (result === false) {
      return false
    }
    if (e.target_id == e.self_id) {
      let result = fs.existsSync(`${_path}/goodjob-img`)
      if (result === true) {
        let path = `${_path}/goodjob-img/resources/`
        const dirs = fs.readdirSync(path)
        path = `${path}${dirs[Math.floor(Math.random() * dirs.length)]}/`
        const files = fs.readdirSync(path)
        path = `${path}${files[Math.floor(Math.random() * files.length)]}`
        await this.reply(segment.image(path))
      } else {
        logger.debug('[无用插件]未发现安装了本地图库，将尝试使用【云溪院API】返图')
        let url = `https://api.yunxiyuanyxy.xyz/gaffe/gitee/?list=sj&type=json`
        await fetch(url, {
          headers: {
            'Accept': 'application/json',
          }
        }).catch((err) => logger.error(err))
          .then(response =>
            response.json())
          .then(data => {
            const imageUrl = data.image_url;
            logger.debug(data.image_url);
            this.e.reply(segment.image(imageUrl))
            return true
          })
      }
    }
  }
}