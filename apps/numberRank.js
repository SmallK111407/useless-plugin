import plugin from '../../../lib/plugins/plugin.js'
import common from '../../../lib/common/common.js'
import fs from 'node:fs'
import path from 'path'

const _path = process.cwd() + '/plugins/useless-plugin'

export class numberRank extends plugin {
    constructor() {
        super({
            name: '[无用插件]图片数量排行',
            dsc: '查询全部人物图片数量排行榜',
            event: 'message',
            priority: 10,
            rule: [
                {
                    reg: '^#*(无用)?(全部|所有)?(人物|角色)(数量|张数)?(排行|排名|榜单|排行榜)$',
                    fnc: 'numberRank'
                }
            ]
        })
    }

    async numberRank() {
        if (!fs.existsSync(`${_path}/goodjob-img`)) return this.e.reply(`未发现安装了图库\n请主人使用【#无用图库更新】来安装图库！`)
        const parentDir = `${_path}/goodjob-img/resources/`
        const subDirs = fs.readdirSync(parentDir).filter(file =>
            fs.statSync(path.join(parentDir, file)).isDirectory() && file !== 'UNKNOWN'
        );
        const dirCounts = subDirs.map(dir => ({
            dir,
            count: fs.readdirSync(path.join(parentDir, dir)).filter(file =>
                fs.statSync(path.join(parentDir, dir, file)).isFile() &&
                path.extname(file).toLowerCase() === `.png` || `.gif`
            ).length
        }));
        dirCounts.sort((a, b) => b.count - a.count);
        let msg = '';
        for (let index = 0; index < dirCounts.length; index++) {
            const dirCount = dirCounts[index];
            msg += `${index + 1}.${dirCount.dir} 共${dirCount.count}张\n`;
        }
        msg = msg.trim()
        await this.e.reply(await common.makeForwardMsg(this.e, [msg], '点击查看全部人物图片数量排行'))
    }
}