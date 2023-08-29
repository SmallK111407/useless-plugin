import plugin from '../../../lib/plugins/plugin.js';
import common from '../../../lib/common/common.js'

const _path = process.cwd() + '/plugins/useless-plugin'

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
    async checkEggplant() {
        if (!fs.existsSync(`${_path}/goodjob-img`)) {
            await this.e.reply(`[无用插件]检测到尚未安装无用图库，请发送【#无用图库更新】安装图库！`, true)
            return true
        }
        let eggplantPath = `${_path}/goodjob-img/resources/茄子/`
        let msg = [([segment.image(`${eggplantPath}0.gif`), segment.image(`${eggplantPath}1.gif`), segment.image(`${eggplantPath}2.gif`), segment.image(`${eggplantPath}3.gif`), segment.image(`${eggplantPath}4.gif`), segment.image(`${eggplantPath}5.gif`), segment.image(`${eggplantPath}6.gif`), segment.image(`${eggplantPath}7.gif`), segment.image(`${eggplantPath}8.gif`), segment.image(`${eggplantPath}9.gif`), segment.image(`${eggplantPath}10.gif`), segment.image(`${eggplantPath}11.gif`), segment.image(`${eggplantPath}12.gif`), segment.image(`${eggplantPath}13.gif`)])]
        await this.e.reply(await common.makeForwardMsg(this.e, msg, `点我查看茄子合集`))
        return true
    }
}