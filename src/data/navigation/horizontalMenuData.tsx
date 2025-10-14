// Static horizontal menu (i18n removed)
import type { HorizontalMenuDataType } from '@/types/menuTypes'

const horizontalMenuData: HorizontalMenuDataType[] = [
  {
    label: 'Dashboards',
    icon: 'tabler-smart-home',
    children: [
      { label: 'Analytics', icon: 'tabler-trending-up', href: '/dashboard' }
    ]
  }
]

export default horizontalMenuData
