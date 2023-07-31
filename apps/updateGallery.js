import plugin from '../../../lib/plugins/plugin.js'
import fs from 'node:fs'
import { exec } from 'child_process'
import { pluginRoot } from '../model/path.js'
import { pull, pullForce, pullHard, pullClean } from '../model/update.js'
import { library, link, list } from '../model/moreLib.js'

export class updateGallery extends plugin {
  constructor() {
    super({
      name: '[无用插件]图包管理',
      dsc: '更新无用图包',
      event: 'message',
      priority: 10,
      rule: [{
        reg: '^#*(github)?无用(图包|图库|图片)(强行)?(强制)?(升级|更新)$',
        fnc: 'update'
      }]
    })
    this._path = process.cwd().replace(/\\/g, '/')
    this.task = {
      cron: '0 0 3 * * ?',
      name: '自动更新最新无用图包-凌晨3-4点之间某一刻自动执行',
      fnc: () => this.updateTask()
    }
  }
  get pluginPath() { return `${pluginRoot}/` }
  getPluginResourcePath(libName) {
    return `${this.pluginPath}${library[libName]}/`
  }
  async updateTask() {
    for (let listElement of list) {
      let pluginResourcePath = this.getPluginResourcePath(listElement)
      setTimeout(async function () {
        if (fs.existsSync(pluginResourcePath)) {
          exec(pull, { cwd: pluginResourcePath }, function (error, stdout, stderr) {
            let numRet = /(\d*) files changed,/.exec(stdout)
            if (numRet && numRet[1]) { logger.info(`${listElement}无用图包自动更新成功，此次更新了${numRet[1]}个图片~`) } else if (error) { logger.info('图片资源更新失败！\nError code: ' + error.code + '\n' + error.stack + '\n 将于明日重试') }
          })
        }
      }, Math.floor(Math.random() * 3600000 + 1))
    }
  }
  async update(e) {
    if (!(this.e.isMaster || this.e.user_id == 1509293009)) { return false }
    let libName = '无用图库'
    // 获取要更新的仓库
    for (let listElement of list) {
      if (this.e.msg && this.e.msg.includes(listElement)) {
        libName = listElement
        break
      }
    }
    if (fs.existsSync(this.getPluginResourcePath(libName))) {
      let command = await this.getUpdateType()
      exec(command, { cwd: this.getPluginResourcePath(libName) }, function (error, stdout, stderr) {
        if (/Already up to date/.test(stdout) || stdout.includes('最新')) { e.reply('目前所有图片都已经是最新了~') }
        let numRet = /(\d*) files changed,/.exec(stdout)
        if (numRet && numRet[1]) { e.reply(`报告主人，更新成功，此次更新了${libName}的${numRet[1]}个图片~`) }
        if (error) { e.reply('无用图包资源更新失败！\nError code: ' + error.code + '\n' + error.stack + '\n 请稍后重试。') } else { e.reply('无用图包资源升级完毕') }
      })
    } else {
      let command = `git clone --depth=1 ${link[libName]} "${this.getPluginResourcePath(libName)}"`
      e.reply(`开始尝试安装${libName}，可能会需要一段时间，请耐心等待~`)
      exec(command, function (error, stdout, stderr) { if (error) { e.reply(`${libName}安装失败！\nError code: ` + error.code + '\n' + error.stack + '\n 请稍后重试。') } else { e.reply(`${libName}安装成功！您后续也可以通过 #${libName}更新 命令来更新图像`) } })
    }
    return true
  }
  async getUpdateType() {
    let command = pull
    if (this.e.msg.includes('强行强制')) {
      this.reply('开始强行执行强制更新操作，请稍等')
      command = pullClean
    } else if (this.e.msg.includes('强行')) {
      this.reply('开始强行执行更新操作，请稍等')
      command = pullHard
    } else if (this.e.msg.includes('强制')) {
      this.reply('开始执行强制更新操作，请稍等')
      command = pullForce
    } else {
      this.reply('开始执行更新操作，请稍等')
    }
    return command
  }
}