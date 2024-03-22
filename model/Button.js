export default class Button {
  constructor(e = {}) {
    this.msg = e.msg
  }

  settingHelp() {
    return segment.button([
      { text: "设置菜单", callback: `#无用配置菜单` },
      { text: "检测配置", callback: `#无用检测配置文件` },
    ], [
      { text: "设置情况", callback: `#无用设置` },
      { text: "别名权限", input: `#无用设置别名权限` },
    ], [
      { text: "抽取冷却", input: `#无用设置抽取冷却` },
      { text: "全部冷却", input: `#无用设置全部人物冷却` },
    ], [
      { text: "茄子冷却", input: `#无用设置茄子冷却` },
      { text: "戳戳开关", input: `#无用设置戳一戳` },
    ])
  }

  getSetting() {
    return segment.button([
      { text: "设置菜单", callback: `#无用配置菜单` },
      { text: "检测配置", callback: `#无用检测配置文件` },
    ], [
      { text: "设置情况", callback: `#无用设置` },
      { text: "别名权限", input: `#无用设置别名权限` },
    ], [
      { text: "抽取冷却", input: `#无用设置抽取冷却` },
      { text: "全部冷却", input: `#无用设置全部人物冷却` },
    ], [
      { text: "茄子冷却", input: `#无用设置茄子冷却` },
      { text: "戳戳开关", input: `#无用设置戳一戳` },
    ])
  }

  sendImage() {
    return segment.button([
      { text: "+1", input: this.msg, send: true },
    ])
  }
}