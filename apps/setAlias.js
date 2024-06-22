import { Plugin as plugin } from 'yunzai/core'
import * as common from 'yunzai/core'
import fs from 'node:fs'
import alias from '../model/alias.js'
import setting from '../model/setting.js'
import YAML from 'yaml'

export default class abbrSet extends plugin {
  constructor() {
    super()
    this.name = '[无用插件]设置别名'
    this.rule = [
      {
        reg: /^#*无用(设置|配置|添加)(.*)(别名|昵称)$/,
        fnc: this.addAlias.name
      },
      {
        reg: /^#*无用删除(别名|昵称)/,
        fnc: this.delAlias.name
      },
      {
        reg: /^#*无用(.*)(别名|昵称)$/,
        fnc: this.aliasList.name
      }
    ]
    this.file = './plugins/useless-plugin/config/alias.yaml'
  }
  async addAlias() {
    if (!await this.checkAuth()) return
    let keyName = this.e.msg.replace(new RegExp(`#|无用|设置|配置|添加|别名|昵称(.*)`, 'g'), '').trim()
    logger.info('keyName=', keyName)
    const name = alias.get(keyName)
    if (!name) {
      await this.e.reply('未识别到角色')
      return true
    }
    this.e.roleName = name
    this.setContext('setAliasContext', false, 20)
    await this.reply(`请发送${name}别名，多个用空格隔开`)
  }
  async checkAuth() {
    if (!this.e.isGroup && !this.e.isMaster) {
      await this.reply('禁止私聊设置角色别名')
      return false
    }
    let abbrSetAuth = setting.getConfig('config').abbrSetAuth
    logger.info('权限：', abbrSetAuth)
    if (abbrSetAuth === 0) return true
    if (this.e.isMaster) return true
    if (abbrSetAuth == 1) {

      if (!Bot.gml.has(this.e.group_id)) {
        return false
      }
      if (!Bot.gml.get(this.e.group_id).get(this.e.user_id)) {
        return false
      }
      if (this.e.member.is_admin) {
        return true
      }
    }
    this.e.reply('暂无权限，只有管理员才能操作')
    return false
  }
  async setAliasContext() {
    if (!this.e.msg || this.e.at || this.e.img) {
      await this.reply('设置错误：请发送正确内容')
      return
    }
    let { setAliasContext = {} } = this.getContext()
    this.finish('setAliasContext')
    let role = setAliasContext.roleName
    let setName = this.e.msg.split(' ')
    let roles = alias.getAllName()
    let ret = []
    for (let name of setName) {
      logger.info('别名', name)
      if (!name || !roles[role]) continue
      if (roles[role].includes(name)) {
        continue
      }
      roles[role].push(name)
      ret.push(name)
    }
    if (ret.length <= 0) {
      await this.reply('设置失败：别名错误或已存在')
      return
    }
    this.save(roles)
    await this.reply(`设置别名成功：${ret.join('、')}`)

  }
  save(data) {
    data = YAML.stringify(data)
    fs.writeFileSync(this.file, data)
  }
  async delAlias() {
    if (!await this.checkAuth()) return
    let inputName = this.e.msg.replace(new RegExp(`#|无用|删除|别名|昵称`, 'g'), '').trim()
    let roleNameKey = alias.get(inputName)
    let roles = alias.getAllName()
    if (inputName in roles) {
      await this.reply('默认别名设置，不能删除！')
      return true
    }
    roles[roleNameKey] = roles[roleNameKey].filter((v) => {
      if (v == inputName) return false
      return v
    })
    this.save(roles)
    await this.reply(`删除${roleNameKey}别名成功：${inputName}`)
  }
  async aliasList() {
    let role = alias.getAllName()
    let keyName = this.e.msg.replace(new RegExp(`#|无用|别名|昵称`, 'g'), '').trim()
    let result = {}
    Object.entries(role).some(([name, aliases]) => {
      if (aliases.includes(keyName) || name == keyName) {
        result = { name: name, aliases: aliases }
        return true
      }
    })
    if (typeof result.name === "undefined") {
      await this.e.reply('未识别到人物')
      return
    }
    let msg = []
    for (let i in result.aliases) {
      let num = Number(i) + 1
      msg.push(`${num}.${result.aliases[i]}`)
    }
    let title = `${result.name}别名，${msg.length}个`
    await this.e.reply(await common.makeForwardMsg(this.e, msg, title))
  }
}