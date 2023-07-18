import plugin from '../../../lib/plugins/plugin.js'
import fs from 'node:fs'
import alias from '../model/alias.js'
import setting from '../model/setting.js'
import YAML from 'yaml'

export class abbrSet extends plugin {
  constructor(e) {
    super({
      name: '[无用插件]别名设置',
      dsc: '无用插件别名设置',
      event: 'message',
      priority: 10,
      rule: [
        {
          reg: `^#*无用(设置|配置|添加)(.*)(别名|昵称)$`,
          fnc: 'addAlias'
        },
        {
          reg: `^#*无用删除(别名|昵称)(.*)$`,
          fnc: 'delAlias'
        },
        {
          reg: `^#*无用(.*)(别名|昵称)$`,
          fnc: 'aliasList'
        }
      ]
    })

    this.file = './plugins/useless-plugin/config/alias.yaml'
  }

  async addAlias() {
    if (!await this.checkAuth()) return
    let keyName = this.e.msg.replace(new RegExp(`#|无用|设置|配置|添加|别名|昵称(.*)`, 'g'), '').trim()

    logger.info('keyName=',keyName)
    //检查别名|昵称是否有对应角色
    const name = alias.get(keyName)
    if(!name) {
      await this.e.reply('未识别到角色')
      return true
    }
    this.e.roleName = name
    this.setContext('setAliasContext',false,20)


    await this.reply(`请发送${name}别名，多个用空格隔开`)
  }

  async checkAuth() {
    if (!this.e.isGroup && !this.e.isMaster) {
      await this.reply('禁止私聊设置角色别名')
      return false
    }

    let abbrSetAuth = setting.getConfig('config').abbrSetAuth
    logger.info('权限：',abbrSetAuth)
    /** 所有人都允许 */
    if (abbrSetAuth === 0) return true
    /** 主人默认允许 */
    if (this.e.isMaster) return true
    /** 管理员 */
    if (abbrSetAuth == 1) {

      if (!Bot.gml.has(this.e.group_id)) {
        return false
      }
      if (!Bot.gml.get(this.e.group_id).get(this.e.user_id)) {
        return false
      }
      //只有此群管理员才能修改
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

    //设置别名的 角色名
    let role = setAliasContext.roleName

    let setName = this.e.msg.split(' ')

    //获取完整 角色别名列表
    let roles = alias.getAllName()
    // logger.info(roles)
    let ret = []
    for (let name of setName) {
      logger.info('别名',name)
      if (!name || !roles[role]) continue
      /** 重复添加 */
      if (roles[role].includes(name) ) {
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
    //鉴权
    if (!await this.checkAuth()) return

    let inputName = this.e.msg.replace(new RegExp(`#|无用|删除|别名|昵称`, 'g'), '').trim()
    // logger.info(inputName)
    let roleNameKey = alias.get(inputName)
    // logger.info('roleNameKey',roleNameKey)
    let roles = alias.getAllName()

    // logger.info('roles',roles)
    //是否为默认名 如果是不允许删除
    if (inputName in roles) {
        await this.reply('默认别名设置，不能删除！')
        return true
    }

    //过滤掉要删除的别名
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
    let result = {};
    Object.entries(role).some(([name, aliases]) => {
      if (aliases.includes(keyName) || name==keyName) {
        result = { name: name, aliases:aliases };
        return true; // 找到目标对象后立即退出循环
      }
    });

    if (typeof result.name === 'undefined') {
       await this.e.reply('未识别到人物')
       //未识别 直接中断
       return
    }

    let msg = []
    for (let i in result.aliases) {
      let num = Number(i) + 1
      msg.push(`${num}.${result.aliases[i]}\n`)
    }

    let title = `${result.name}别名，${msg.length}个`

    msg = await this.makeForwardMsg(Bot.uin, title, msg)

    await this.e.reply(msg)
  }

  async makeForwardMsg(qq, title, msg) {
    let nickname = Bot.nickname
    if (this.e.isGroup) {
      let info = await Bot.getGroupMemberInfo(this.e.group_id, qq)
      nickname = info.card ?? info.nickname
    }
    let userInfo = {
      user_id: Bot.uin,
      nickname
    }

    let forwardMsg = [
      {
        ...userInfo,
        message: title
      },
      {
        ...userInfo,
        message: msg
      }
    ]

    /** 制作转发内容 */
    if (this.e.isGroup) {
      forwardMsg = await this.e.group.makeForwardMsg(forwardMsg)
    } else {
      forwardMsg = await this.e.friend.makeForwardMsg(forwardMsg)
    }

    /** 处理描述 */
    forwardMsg.data = forwardMsg.data
      .replace(/\n/g, '')
      .replace(/<title color="#777777" size="26">(.+?)<\/title>/g, '___')
      .replace(/___+/, `<title color="#777777" size="26">${title}</title>`)

    return forwardMsg
  }
}