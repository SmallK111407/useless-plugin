import plugin from '../../../lib/plugins/plugin.js'
import common from "../../../lib/common/common.js"
import { execSync } from "child_process";

export class updateLog extends plugin {
  constructor (e) {
    super({
      name: '[无用插件]更新日志',
      dsc: '无用插件更新日志',
      event: 'message',
      priority: 10,
      rule: [
        {
          reg: '^#?无用(插件)?更新日志$',
          fnc: 'updateLog'
        }
      ]
    })
  }

  async checkAuth (e) {
    if (!e.isMaster) {
      e.reply(`只有主人才能命令我哦~(*/ω＼*)`)
      return false
    }
    return true
  }

    /**
     * 获取插件更新日志
     * @param {string} plugin 插件名称
     * @returns
     */
    async getLog(plugin = 'useless-plugin') {
      let cm = 'git log  -20 --oneline --pretty=format:"%h||[%cd]  %s" --date=format:"%F %T"'
      if (plugin) {
          cm = `cd ./plugins/${plugin}/ && ${cm}`
      }

      let logAll
      try {
          logAll = await execSync(cm, { encoding: 'utf-8', windowsHide: true })
      } catch (error) {
          logger.error(error.toString())
          this.reply(error.toString())
      }

      if (!logAll) return false

      logAll = logAll.split('\n')

      let log = []
      for (let str of logAll) {
          str = str.split('||')
          if (str[0] == this.oldCommitId) break
          if (str[1].includes('Merge branch')) continue
          log.push(str[1])
      }
      let line = log.length
      log = log.join('\n\n')

      if (log.length <= 0) return ''

      let end = '更多详细信息，请前往gitee查看\nhttps://gitee.com/SmallK111407/useless-plugin'

      log = await common.makeForwardMsg(this.e, [log, end], `${plugin}更新日志，共${line}条`)

      return log
  }

  /*
   *更新日志的方法
   */
  async updateLog() {
      let log = await this.getLog()
      await this.reply(log)
  }
}