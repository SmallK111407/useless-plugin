import { Segment } from 'yunzai/core'
import { Plugin as plugin } from 'yunzai/core'
import setting from '../model/setting.js'
import fs from 'node:fs'

const _path = process.cwd() + '/plugins/useless-plugin'

export default class pokeSend extends plugin {
  constructor() {
    super()
    this.rule = [
      {
        fnc: this.pokeSend.name
      }
    ]
  }
  get appconfig() { return setting.getConfig("config") }

  async pokeSend() {
    if (!this.appconfig['poke']) {
      return false
    }
    if (this.e.target_id == this.e.self_id) {
      if (!fs.existsSync(`${_path}/goodjob-img`)) return this.e.reply(`未发现安装了图库\n请主人使用【#无用图库更新】来安装图库！`)
      if (this.e.adapter_name == "ICQQ")
        this.e.reply({ type: "poke", id: Math.floor(Math.random() * 7) })
      let path = `${_path}/goodjob-img/resources/`
      const dirs = fs.readdirSync(path)
      path = `${path}${dirs[Math.floor(Math.random() * dirs.length)]}/`
      const files = fs.readdirSync(path)
      path = `${path}${files[Math.floor(Math.random() * files.length)]}`
      await this.e.reply(Segment.image(path))
    }
  }
}
