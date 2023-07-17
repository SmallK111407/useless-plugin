import plugin from '../../../lib/plugins/plugin.js'
import fs from 'node:fs'
import alias from '../model/alias.js'

const _path = process.cwd() + '/plugins/useless-plugin'

export class sendImage extends plugin {
    constructor() {
        super({
            name: '[无用插件]发送图片',
            dsc: '发送随机图片',
            event: 'message',
            priority: 10,
            rule: [
                {
                    reg: '^#*(随机|来一张).*',
                    fnc: 'sendImage'
                }
            ]
        })
    }

    async sendImage(e) {
        let msg = this.e.msg
        let reg = msg.replace(/#|随机|来一张/g, '').trim()
        let name = reg
        let role = alias.get(name)
        if (!role) return false
        const files = fs.readdirSync(`${_path}/goodjob-img/resources/${role}/`)
        let number = Math.floor(Math.random() * files.length)
        await this.reply(segment.image(`${_path}/goodjob-img/resources/${role}/${files[number]}`))
        return true
    }
}