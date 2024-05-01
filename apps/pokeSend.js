import plugin from '../../../lib/plugins/plugin.js'
import setting from '../model/setting.js'
import fs from 'node:fs'

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
      if (!fs.existsSync(`${_path}/goodjob-img`)) return this.e.reply(`未发现安装了图库\n请主人使用【#无用图库更新】来安装图库！`)
      if (e.adapter_name == "ICQQ")
        this.reply({ type: "poke", id: Math.floor(Math.random()*7) })
      let path = `${_path}/goodjob-img/resources/`
      const dirs = fs.readdirSync(path)
      path = `${path}${dirs[Math.floor(Math.random() * dirs.length)]}/`
      const files = fs.readdirSync(path)
      path = `${path}${files[Math.floor(Math.random() * files.length)]}`
      await this.reply(segment.image(path))
    }
  }
}
