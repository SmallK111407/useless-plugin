import plugin from '../../../lib/plugins/plugin.js'
import alias from '../model/alias.js'
import fs from 'node:fs'

const _path = process.cwd() + '/plugins/useless-plugin'

export class queryNumber extends plugin {
    constructor() {
        super({
            name: '[无用插件]查询图片数量',
            dsc: '查询图片数量',
            event: 'message',
            priority: 10,
            rule: [
                {
                    reg: '^#*(无用)?(查询|查看|检查)杂图(图片|图)?(数量|张数|数)',
                    fnc: 'queryMessyNumber'
                },
                {
                    reg: '^#*(无用)?(查询|查看|检查)(全部|所有|乐子)(图片|图)?(数量|张数|数)',
                    fnc: 'queryAll'
                },
                {
                    reg: '^#*(无用)?(查询|查看|检查).*(图片|图)?(数量|张数|数)',
                    fnc: 'queryNumber'
                }
            ]
        })
    }

    async queryMessyNumber() {
        if (!fs.existsSync(`${_path}/goodjob-img`)) return this.e.reply(`未发现安装了图库\n请主人使用【#无用图库更新】来安装图库！`)
        const files = fs.readdirSync(`${_path}/goodjob-img/resources/UNKNOWN/`)
        let number = Math.floor(files.length)
        await this.reply(`当前所查询「杂图」\n目前总共已收录${number}张图片`, true)
        return true
    }
    async queryAll() {
        if (!fs.existsSync(`${_path}/goodjob-img`)) return this.e.reply(`未发现安装了图库\n请主人使用【#无用图库更新】来安装图库！`)
        let count = 0;
        function countImages(folder) {
            const files = fs.readdirSync(folder);
            for (const file of files) {
                const path = folder + '/' + file;
                if (fs.statSync(path).isDirectory()) {
                    countImages(path);
                } else if (/\.(jpe?g|png|gif)$/i.test(file)) {
                    count++;
                }
            }
        }
        countImages(`${_path}/goodjob-img`)
        this.e.reply(`目前本图库总共已收录${count}张图片`, true)
        return true
    }
    async queryNumber() {
        if (!fs.existsSync(`${_path}/goodjob-img`)) return this.e.reply(`未发现安装了图库\n请主人使用【#无用图库更新】来安装图库！`)
        let msg = this.e.msg
        let reg = msg.replace(/#|无用|查询|查看|图片|图|数量|张数|数/g, '').trim()
        let name = reg
        let role = alias.get(name)
        if (!role) return false
        const files = fs.readdirSync(`${_path}/goodjob-img/resources/${role}/`)
        let number = Math.floor(files.length)
        await this.reply(`当前所查询人物「${role}」\n目前总共已收录${number}张图片`, true)
        return true
    }
}