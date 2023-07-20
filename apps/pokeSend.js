import plugin from '../../../lib/plugins/plugin.js'
import cfg from '../../../lib/config/config.js'
import setting from '../model/setting.js'
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
    const ikun1 = await YAML.parse(fs.readFileSync(`./plugins/useless-plugin/config/ikun.yaml`, 'utf8'));
    if (ikun1.ikun === "unikun") {
      return false
    }
    if (e.target_id == cfg.qq) {
      const files = fs.readdirSync(`${_path}/goodjob-img/resources/UNKNOWN/`)
      let number = Math.floor(Math.random() * files.length)
      await this.reply(segment.image(`${_path}/goodjob-img/resources/UNKNOWN/${files[number]}`))
      return false
    } else {
      return false
    }
  }
}
