import plugin from '../../../lib/plugins/plugin.js'
import setting from '../model/setting.js'
import fs from 'node:fs'
import fetch from 'node-fetch'

const _path = process.cwd() + '/plugins/useless-plugin'

const CD = {}
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

    async extractImage() {
        let cdtime = this.appconfig['extractCD']
        if (CD[this.e.user_id] && !this.e.isMaster) {
            this.e.reply('每' + cdtime + '分钟只能抽取一次哦！')
            return true
        }
        CD[this.e.user_id] = true
        CD[this.e.user_id] = setTimeout(() => {
            if (CD[this.e.user_id]) delete CD[this.e.user_id]
        }, cdtime * 60 * 1000)
        let result = fs.existsSync(`${_path}/goodjob-img`)
        if (result === true) {
            let path = `${_path}/goodjob-img/resources/`
            const dirs = fs.readdirSync(path)
            const path1 = `${path}${dirs[Math.floor(Math.random() * dirs.length)]}`
            let character = path1.substring(path.lastIndexOf('/') + 1)
            const files = fs.readdirSync(`${path1}/`)
            path = `${path}${files[Math.floor(Math.random() * files.length)]}`
            let msg = path.substring(path.lastIndexOf('/') + 1);
            let i = msg.replace(/.png|gif/g, '').trim()
            let number = Number(i) + 1
            const file = fs.readdirSync(`${_path}/goodjob-img/resources/${character}/`)
            await this.reply(`您本次抽取到的人物为「${character}」\n本图片位于其文件夹第${number}张`, true)
            await this.reply(segment.image(`${_path}/goodjob-img/resources/${character}/${file[i]}`))
        } else {
            logger.debug('[无用插件]未发现安装了本地图库，将尝试使用【云溪院API】返图')
            let url = `https://yunxiyuan.xyz/api/gaffe/index.php?list=all`
            await fetch(url, {
                headers: {
                    'Accept': 'application/json',
                }
            }).catch((err) => logger.error(err))
                .then(response =>
                    response.json())
                .then(data => {
                    const randomIndex = Math.floor(Math.random() * data.length);
                    const randomData = data[randomIndex];
                    let character = randomData
                    const url = `https://yunxiyuan.xyz/api/gaffe/index.php?list=${randomData}&type=all`
                    logger.debug(randomData);
                    fetch(url, {
                        headers: {
                            'Accept': 'application/json',
                        }
                    }).catch((err) => logger.error(err))
                        .then(response =>
                            response.json())
                        .then(data => {
                            const randomIndex = Math.floor(Math.random() * data.length);
                            const randomData = data[randomIndex];
                            let msg = randomData.substring(randomData.lastIndexOf('/') + 1);
                            let i = msg.replace(/.png|gif/g, '').trim()
                            let number = Number(i) + 1
                            this.e.reply(`您本次抽取到的人物为「${character}」\n本图片是TA的第${number}张图哦~`, true)
                            if (`${character}` == `茄子`) {
                                this.e.reply(segment.image(`https://yunxiyuan.xyz/api/gaffe/goodjob-img/resources/${character}/${i}.gif`))
                                return true
                            } else {
                                this.e.reply(segment.image(`https://yunxiyuan.xyz/api/gaffe/goodjob-img/resources/${character}/${i}.png`))
                                return true
                            }
                        })
                })
        }
    }
}