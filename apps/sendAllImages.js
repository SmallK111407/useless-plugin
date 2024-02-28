import plugin from '../../../lib/plugins/plugin.js'
import common from '../../../lib/common/common.js'
import alias from '../model/alias.js'
import setting from '../model/setting.js'
import fs from 'node:fs'
import path from 'path'

const _path = process.cwd() + '/plugins/useless-plugin'

const CD = {}
export class sendAllImages extends plugin {
    constructor() {
        super({
            name: '[无用插件]查看人物全部图片',
            dsc: '查看单独一个人物的所有的图片',
            event: 'message',
            priority: 11,
            rule: [
                {
                    reg: '^#*(无用)?(查看|发送)?(全部|所有).*',
                    fnc: 'sendAllImages'
                }
            ]
        })
    }
    get appconfig() { return setting.getConfig("config") }

    async sendAllImages() {
        if (!fs.existsSync(`${_path}/goodjob-img`)) return this.e.reply(`未发现安装了图库\n请主人使用【#无用图库更新】来安装图库！`)
        let cdtime = this.appconfig['allCD']
        if (CD[this.e.user_id] && !this.e.isMaster && !this.e.user_id == 1509293009) {
            this.e.reply('每' + cdtime + '分钟只能看一次全部图片哦！')
            return true
        }
        CD[this.e.user_id] = true
        CD[this.e.user_id] = setTimeout(() => {
            if (CD[this.e.user_id]) delete CD[this.e.user_id]
        }, cdtime * 60 * 1000)
        let reg = this.e.msg.replace(/#|无用|查看|发送|全部|所有/g, '').trim()
        let name = reg
        if (name == "杂图" || name == "UNKNOWN") return this.e.reply(`不支持查看全部杂图！`, true)
        let role = alias.get(name)
        if (!role) return false
        try {
            let msg = []
            const dirPath = `${_path}/goodjob-img/resources/${role}`
            let files = await fs.readdirSync(dirPath);
            files = files.sort((a, b) => parseInt(a) - parseInt(b));
            for (let i = 0; i < files.length; i++) {
                let file = files[i];
                let filePath = path.join(dirPath, file);
                let isImage = ['.jpeg', '.jpg', '.gif', '.png'].some(i => filePath.endsWith(i));
                if (isImage) {
                    msg.push([`${i + 1}`, segment.image(filePath)]);
                }
            }
            let reply = await this.e.reply(await common.makeForwardMsg(this.e, msg, `点击查看全部「${role}」，共${files.length}张`))
            if (!reply) this.e.reply(`发送失败了，可能是图片过多...\n当前所查看人物图片数量共${files.length}张`, true)
        } catch (error) {
            logger.error(error)
        }
        return true
    }
}