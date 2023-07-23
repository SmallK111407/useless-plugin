import plugin from '../../../lib/plugins/plugin.js';
import setting from "../model/setting.js";
import fs from "node:fs";

const _path = process.cwd() + '/plugins/useless-plugin'

let CD = {}
export class extractImage extends plugin {
    constructor() {
        super({
            name: '[无用插件]随机抽取图片',
            dsc: '随机抽取图片',
            event: 'message',
            priority: 10,
            rule: [
                {
                    reg: '^#*(无用)?(随机)?抽取(图片|照片|卡片)$',
                    fnc: 'extractImage'
                }
            ]
        })
    }
    get appconfig() { return setting.getConfig("config") }

    async extractImage(e) {
        let cdtime = this.appconfig['extractCD']
        if (CD[e.user_id] && !e.isMaster) {
            e.reply('每' + cdtime + '分钟只能抽取一次哦！')
            return true
        }
        CD[e.user_id] = true
        CD[e.user_id] = setTimeout(() => {
            if (CD[e.user_id]) delete CD[e.user_id]
        }, cdtime * 60 * 1000)
        let path = `${_path}/goodjob-img/resources/`
        const dirs = fs.readdirSync(path)
        const path1 = `${path}${dirs[Math.floor(Math.random() * dirs.length)]}`
        let character = path1.substring(path.lastIndexOf('/') + 1)
        const files = fs.readdirSync(`${path1}/`)
        path = `${path}${files[Math.floor(Math.random() * files.length)]}`
        let msg = path.substring(path.lastIndexOf('/') + 1);
        let i = msg.replace(/.png/g, '').trim()
        let number = Number(i) + 1
        await this.reply(`您本次抽取到的人物为【${character}】\n本图片位于其文件夹第${number}张`, true)
        await this.reply(segment.image(`${_path}/goodjob-img/resources/${character}/${i}.png`), true)
    }
}