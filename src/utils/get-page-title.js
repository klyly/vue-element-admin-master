import defaultSettings from '@/settings'

const title = defaultSettings.title || '开威智能门禁通道管理与统计软件'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
