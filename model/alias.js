import setting from './setting.js'
import _ from 'lodash'
import fs from 'node:fs/promises'

let defAlias = null
async function loadAliasData() {
  try {
    const jsonContent = await fs.readFile('./aliasData/alias.json', 'utf-8')
    defAlias = JSON.parse(jsonContent)
  } catch (error) {
    console.error('加载原配置文件错误:', error)
  }
}

loadAliasData()

export default new class {
  /**
   * @description: 获取别名
   * @param {string} name 要匹配的名称
   * @return {string|false} 未匹配到别名则返回false
   */
  get(name) {
    const aliasList = { ...defAlias, ...setting.getConfig('alias') }
    // 读取角色文件
    if (name in aliasList) return name
    const roleName = _.findKey(aliasList, alias => alias.includes(name))
    if (roleName) {
      return roleName
    } else {
      logger.error('[无用别名]未找到该人')
      return false
    }
  }

  getAllName() {
    // 读取角色文件
    return { ...defAlias, ...setting.getConfig('alias') }
  }
}()