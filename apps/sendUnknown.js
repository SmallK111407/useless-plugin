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

    async sendUnknown() {
        let result = fs.existsSync(`${_path}/goodjob-img`)
        if (result === true) {
            const files = fs.readdirSync(`${_path}/goodjob-img/resources/UNKNOWN/`)
            let number = Math.floor(Math.random() * files.length)
            await this.reply(segment.image(`${_path}/goodjob-img/resources/UNKNOWN/${files[number]}`))
        } else {
            console.log('[无用插件]未发现安装了本地图库，将尝试使用【云溪院API】返图')
            // API from @云溪院
            let url = `https://yxy-api.yize.site/api/gaffe/index.php?list=UNKNOWN&type=json`
            await fetch(url).catch((err) => logger.error(err))
                .then(response =>
                    response.json())
                .then(data => {
                    const imageUrl = data.image_url;
                    console.log(data.image_url);
                    this.e.reply(segment.image(imageUrl))
                })
            return true
        }
    }
}