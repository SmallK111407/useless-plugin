import plugin from '../../../lib/plugins/plugin.js'
import fs from 'node:fs'

const _path = process.cwd()

export class pokeSet extends plugin {
    constructor(e) {
        super({
            name: '[无用插件]戳一戳设置',
            dsc: '无用插件戳一戳设置',
            event: 'message',
            priority: 10,
            rule: [
                {
                    reg: `^#?无用设置戳一戳(开启|关闭)`,
                    fnc: 'ikun',
                    permission: "master"
                }
            ]
        })
    }

    async ikun(e) {
        if (e.msg.includes('开启')) {
            let str = fs.readFileSync(`${_path}/plugins/useless-plugin/config/ikun.yaml`, "utf8")
            var reg = new RegExp(`ikun: "(.*?)"`);
            var ikun = str.replace(reg, `ikun: "ikun"`);
            fs.writeFileSync(`${_path}/plugins/useless-plugin/config/ikun.yaml`, ikun, "utf8");
            e.reply("无用戳一戳已设为开启")
            return true
        } else {
            let str = fs.readFileSync(`${_path}/plugins/useless-plugin/config/ikun.yaml`, "utf8")
            var reg = new RegExp(`ikun: "(.*?)"`);
            var ikun = str.replace(reg, `ikun: "unikun"`);
            fs.writeFileSync(`${_path}/plugins/useless-plugin/config/ikun.yaml`, ikun, "utf8");
            e.reply("无用戳一戳已设为关闭")
            return true
        }
    }
}