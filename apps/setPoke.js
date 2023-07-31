import plugin from '../../../lib/plugins/plugin.js';
import setting from "../model/setting.js";
import fs from 'node:fs'

const _path = process.cwd() + '/plugins/useless-plugin'

export class setPoke extends plugin {
    constructor() {
        super({
            name: '[无用插件]戳一戳设置',
            dsc: '无用插件戳一戳设置',
            event: 'message',
            priority: 10,
            rule: [
                {
                    reg: `^#?无用设置戳一戳(开启|关闭)`,
                    fnc: 'setPoke',
                    permission: "master"
                }
            ]
        })
    }
    get appconfig() { return setting.getConfig("config") }

    async setPoke(e) {
        const configLines = fs.readFileSync(`${_path}/config/config.yaml`, 'utf8').split('\n').length;
        const defLines = fs.readFileSync(`${_path}/def/config.yaml`, 'utf8').split('\n').length;
        if (configLines < defLines) {
            fs.copyFileSync(`${_path}/def/config.yaml`, `${_path}/config/config.yaml`)
            this.e.reply(`[无用插件]检测到config内配置文件非最新，已重新生成最新配置文件\n请重新发送开关命令`)
            console.log(`[无用插件]尚未检测到config内含有【戳一戳】的配置，已自动填入，默认关闭`)
        } else {
            if (e.msg.includes('开启')) {
                let str = fs.readFileSync(`${_path}/config/config.yaml`, "utf8")
                let reg = new RegExp(`poke: .*`);
                let poke = str.replace(reg, `poke: true`);
                fs.writeFileSync(`${_path}/config/config.yaml`, poke, "utf8");
                this.e.reply("无用插件戳一戳已设为开启")
                return true
            } else {
                let str = fs.readFileSync(`${_path}/config/config.yaml`, "utf8")
                let reg = new RegExp(`poke: .*`);
                let poke = str.replace(reg, `poke: false`);
                fs.writeFileSync(`${_path}/config/config.yaml`, poke, "utf8");
                this.e.reply("无用插件戳一戳已设为关闭")
                return true
            }
        }
    }
}