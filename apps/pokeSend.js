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
      let path = `${_path}/goodjob-img/resources/`
      const dirs = fs.readdirSync(path)
      path = `${path}${dirs[Math.floor(Math.random()*dirs.length)]}/`
      const files = fs.readdirSync(path)
      path = `${path}${files[Math.floor(Math.random()*files.length)]}`
      await this.reply(segment.image(path))
      return false
    } else {
      return false
    }
  }
}
