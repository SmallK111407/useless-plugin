import plugin from '../../../lib/plugins/plugin.js'
import fs from 'node:fs'
import YAML from 'yaml'

const _path = process.cwd() + '/plugins/useless-plugin'

export class poke extends plugin {
  constructor() {
    super({
      name: '[无用插件]戳一戳',
      dsc: '戳一戳发送图片',
      event: 'notice.group.poke',
      priority: 10,
      rule: [
        {
          fnc: 'poke'
        }
      ]
    })
  }
  async poke(e) {
    const ikun1 = await YAML.parse(fs.readFileSync(`${_path}/config/ikun.yaml`, 'utf8'));
    if (ikun1.ikun === "unikun") {
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
        console.log('[无用插件]未发现安装了本地图库，将尝试使用【云溪院API】返图')
        // API from @云溪院
        let url = `https://yxy-api.yize.site/api/gaffe/?list=sj&type=json`
        await fetch(url).catch((err) => logger.error(err))
          .then(response =>
            response.json())
          .then(data => {
            const imageUrl = data.image_url;
            console.log(data.image_url);
            this.e.reply(segment.image(imageUrl))
            return true
          })
      }
    }
  }
}