import plugin from '../../../lib/plugins/plugin.js'
import fs from 'node:fs'

const _path = process.cwd() + '/plugins/useless-plugin'

export class sendUnknown extends plugin {
    constructor() {
        super({
            name: '[无用插件]发送乐子图片',
            dsc: '发送随机图片',
            event: 'message',
            priority: 9,
            rule: [
                {
                    reg: '^#*(随机|来一张)乐子(图片|照片)?',
                    fnc: 'sendUnknown'
                }
            ]
        })
    }

    async randomHappy(e) {
        const files = fs.readdirSync(`${_path}/goodjob-img/resources/UNKNOWN/`)
        let number = Math.floor(Math.random() * files.length)
        await this.reply(segment.image(`${_path}/goodjob-img/resources/UNKNOWN/${files[number]}`))
        return true
    }
}