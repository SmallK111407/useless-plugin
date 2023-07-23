import plugin from '../../../lib/plugins/plugin.js'
import fs from 'node:fs'
import alias from '../model/alias.js'

const _path = process.cwd() + '/plugins/useless-plugin'

export class checkImage extends plugin {
    constructor() {
        super({
            name: '[无用插件]查看对应图片',
            dsc: '查看对应编号图片',
            event: 'message',
            priority: 10,
            rule: [
                {
                    reg: '^#*(无用)?(查看|发送).*(第)?.*(张|号)?(图片|照片|图)?',
                    fnc: 'checkImage'
                }
            ]
        })
    }

    async checkImage(e) {
        let msg = this.e.msg
        let value = msg.replace(/[^0-9]/ig, "");
        let number = Number(value) - 1
        let reg = msg.replace(/#|无用|查看|发送|第|[0-9]|张|号|图片|照片|图/g, '').trim()
        let name = reg
        let role = alias.get(name)
        if (!role) return false
        let result = fs.existsSync(`${_path}/goodjob-img/resources/${role}/${number}.png`)
        if (result === true) {
            await this.reply(segment.image(`${_path}/goodjob-img/resources/${role}/${number}.png`), true)
        } else {
            await this.reply(`当前所查看图片不存在！\n你可以使用【#查询${role}数量】来查看对应人物的图片数量`, true)
            return true
        }
    }
}