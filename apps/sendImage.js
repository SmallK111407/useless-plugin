import plugin from '../../../lib/plugins/plugin.js'
import alias from '../model/alias.js'
import Button from '../model/Button.js'
import fs from 'node:fs'

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
                    reg: '^#*(随机|来一张)杂图$',
                    fnc: 'sendUnknown'
                },
                {
                    reg: '^#*(随机|来一张)乐子(图片|照片)?',
                    fnc: 'sendRandom'
                },
                {
                    reg: '^#*(随机|来一张).*',
                    fnc: 'sendImage'
                }
            ]
        })
    }
    async sendUnknown() {
        if (!fs.existsSync(`${_path}/goodjob-img`)) return this.e.reply(`未发现安装了图库\n请主人使用【#无用图库更新】来安装图库！`)
        const files = fs.readdirSync(`${_path}/goodjob-img/resources/UNKNOWN/`)
        let number = Math.floor(Math.random() * files.length)
        await this.e.reply(segment.image(`${_path}/goodjob-img/resources/UNKNOWN/${files[number]}`))
        return true
    }
    async sendRandom() {
        if (!fs.existsSync(`${_path}/goodjob-img`)) return this.e.reply(`未发现安装了图库\n请主人使用【#无用图库更新】来安装图库！`)
        let path = `${_path}/goodjob-img/resources/`
        const dirs = fs.readdirSync(path)
        path = `${path}${dirs[Math.floor(Math.random() * dirs.length)]}/`
        const files = fs.readdirSync(path)
        path = `${path}${files[Math.floor(Math.random() * files.length)]}`
        await this.e.reply(segment.image(path))
        return true
    }
    async sendImage() {
        if (!fs.existsSync(`${_path}/goodjob-img`)) return this.e.reply(`未发现安装了图库\n请主人使用【#无用图库更新】来安装图库！`)
        let msg = this.e.msg
        let reg = msg.replace(/#|随机|来一张/g, '').trim()
        let name = reg
        let role = alias.get(name)
        if (!role) return false
        const files = fs.readdirSync(`${_path}/goodjob-img/resources/${role}/`)
        let number = Math.floor(Math.random() * files.length)
        await this.e.reply([segment.image(`${_path}/goodjob-img/resources/${role}/${files[number]}`), new Button(this.e).sendImage()])
        return true
    }
}