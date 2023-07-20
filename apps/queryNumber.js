import plugin from '../../../lib/plugins/plugin.js'
import fs from 'node:fs'
import alias from '../model/alias.js'

const _path = process.cwd() + '/plugins/useless-plugin'

export class queryNumber extends plugin {
    constructor() {
        super({
            name: '[无用插件]查询人物图片数量',
            dsc: '查询人物图片数量',
            event: 'message',
            priority: 10,
            rule: [
                {
                    reg: '^#*(无用)?(查询|查看|检查).*(图片|图)?(数量|张数|数)',
                    fnc: 'queryNumber'
                }
            ]
        })
    }

    async queryNumber() {
        let msg = this.e.msg
        let reg = msg.replace(/#|无用|查询|查看|图片|图|数量|张数|数/g, '').trim()
        let name = reg
        let role = alias.get(name)
        if (!role) return false
        const files = fs.readdirSync(`${_path}/goodjob-img/resources/${role}/`)
        let number = Math.floor(files.length)
        await this.reply(`当前所查询人物【${role}】\n目前总共已收录${number}张图片`)
        return true
    }
}