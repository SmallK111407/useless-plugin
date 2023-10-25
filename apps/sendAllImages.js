import plugin from '../../../lib/plugins/plugin.js'
import common from '../../../lib/common/common.js'
import alias from '../model/alias.js'
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
    async sendAllImages() {
        let cdtime = this.appconfig['allCD']
        if (CD[this.e.user_id] && !this.e.isMaster) {
            this.e.reply('每' + cdtime + '分钟只能看一次全部图片哦！')
            return true
        }
        CD[this.e.user_id] = true
        CD[this.e.user_id] = setTimeout(() => {
            if (CD[this.e.user_id]) delete CD[this.e.user_id]
        }, cdtime * 60 * 1000)
        let reg = this.e.msg.replace(/#|无用|查看|发送|全部|所有/g, '').trim()
        let name = reg
        let role = alias.get(name)
        if (!role) return false
        try {
            let msg = []
            const dirPath = `${_path}/goodjob-img/resources/${role}`
            const files = await fs.readdirSync(dirPath);
            for (let i = 0; i < files.length; i++) {
                let file = files[i];
                let filePath = path.join(dirPath, file);
                let isImage = ['.jpeg', '.jpg', '.gif', '.png'].some(i => filePath.endsWith(i));
                if (isImage) {
                    msg.push([`${i + 1}`, segment.image(filePath)]);
                }
            }
            let reply = await this.e.reply(await common.makeForwardMsg(this.e, msg, `点击查看全部「${role}」，共${files.length}张`))
            if (!reply) this.e.reply(`发送失败了，可能是图片过多...`, true)
        } catch (error) {
            logger.error(error)
        }
        return true
    }
}