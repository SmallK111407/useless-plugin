import plugin from '../../../lib/plugins/plugin.js'
import common from '../../../lib/common/common.js'
import setting from '../model/setting.js'
import fs from 'node:fs'

const _path = process.cwd() + '/plugins/useless-plugin'

const CD = {}
export class checkEggplant extends plugin {
    constructor() {
        super({
            name: '[无用插件]查看全部茄子',
            dsc: '查看所有的茄子',
            event: 'message',
            priority: 10,
            rule: [
                {
                    reg: '^#*(无用)?(全部|所有)茄子$',
                    fnc: 'checkEggplant'
                }
            ]
        })
    }
    get appconfig() { return setting.getConfig("config") }

    async checkEggplant() {
        let cdtime = this.appconfig['eggplantCD']
        if (CD[this.e.user_id] && !this.e.isMaster) {
            this.e.reply('每' + cdtime + '分钟只能看一次全部茄子哦！')
            return true
        }
        CD[this.e.user_id] = true
        CD[this.e.user_id] = setTimeout(() => {
            if (CD[this.e.user_id]) delete CD[this.e.user_id]
        }, cdtime * 60 * 1000)
        if (!fs.existsSync(`${_path}/goodjob-img`)) {
            await this.e.reply(`[无用插件]检测到尚未安装无用图库，请发送【#无用图库更新】安装图库！`, true)
            return true
        }
        let eggplantPath = `${_path}/goodjob-img/resources/茄子/`
        let msg = [([segment.image(`${eggplantPath}0.gif`), segment.image(`${eggplantPath}1.gif`), segment.image(`${eggplantPath}2.gif`), segment.image(`${eggplantPath}3.gif`), segment.image(`${eggplantPath}4.gif`), segment.image(`${eggplantPath}5.gif`), segment.image(`${eggplantPath}6.gif`), segment.image(`${eggplantPath}7.gif`), segment.image(`${eggplantPath}8.gif`), segment.image(`${eggplantPath}9.gif`), segment.image(`${eggplantPath}10.gif`), segment.image(`${eggplantPath}11.gif`), segment.image(`${eggplantPath}12.gif`), segment.image(`${eggplantPath}13.gif`), segment.image(`${eggplantPath}14.gif`)])]
        await this.e.reply(await common.makeForwardMsg(this.e, msg, `超长的茄子来啦！`))
        return true
    }
}