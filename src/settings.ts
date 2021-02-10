interface ISettings {
  title: string
  vconsole: boolean
  needPageTrans: boolean
  layoutNeedPageTrans: boolean
}

const settings: ISettings = {
  title: '报销系统',
  vconsole: true,
  needPageTrans: true,
  layoutNeedPageTrans: true,
}

export default settings
