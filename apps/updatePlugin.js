import { Plugin as plugin } from 'yunzai/core'
import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'

const _path = process.cwd()

export default class updatePlugin extends plugin {
    constructor() {
        super()
        this.name = '[无用插件]插件更新'
        this.rule = [
            {
                reg: /^#*无用(插件)?(强制)?更新$/,
                fnc: this.update.name
            }
        ]
    }

    async update(e = this.e) {
        if (!e.isMaster) return false
        const updatePath = path.join(_path, 'plugins/system/apps/update.ts')
        if (fs.existsSync(updatePath)) {
            const updateUrl = pathToFileURL(updatePath).href
            const { update: Update } = await import(updateUrl)
            e.isMaster = true
            e.msg = `#${e.msg.includes('强制') ? '强制' : '更新'}useless-plugin`
            const up = new Update(e)
            up.e = e
            return up.update()
        } else {
            await this.e.reply('未安装system(https://github.com/yoimiya-kokomi/Miao-Yunzai/tree/system)，无法提供本体更新支持，请安装后重试！')
            return true
        }
    }
}
