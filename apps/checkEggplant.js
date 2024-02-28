import plugin from '../../../lib/plugins/plugin.js'
import common from '../../../lib/common/common.js'
import setting from '../model/setting.js'

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
                    reg: '^#*(无用)?(查看)?(全部|所有)茄子$',
                    fnc: 'checkEggplant'
                }
            ]
        })
    }
    get appconfig() { return setting.getConfig("config") }

    async checkEggplant() {
        if (!fs.existsSync(`${_path}/goodjob-img`)) return this.e.reply(`未发现安装了图库\n请主人使用【#无用图库更新】来安装图库！`)
        let cdtime = this.appconfig['eggplantCD']
        if (CD[this.e.user_id] && !this.e.isMaster && !this.e.user_id == 1509293009) {
            this.e.reply('每' + cdtime + '分钟只能看一次全部茄子哦！')
            return true
        }
        CD[this.e.user_id] = true
        CD[this.e.user_id] = setTimeout(() => {
            if (CD[this.e.user_id]) delete CD[this.e.user_id]
        }, cdtime * 60 * 1000)
        let eggplantPath = _path + '/goodjob-img/resources/茄子/';
        let numbers = Array.from({length: 15}, (v, i) => i);
        let images = numbers.map(n => eggplantPath + n + '.gif');
        let msg = images.map(segment.image);
        await this.e.reply(await common.makeForwardMsg(this.e, [msg], '超长的茄子来啦！'))
        return true
    }
}