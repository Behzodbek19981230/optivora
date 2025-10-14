// Static vertical menu (i18n removed)
import type { VerticalMenuDataType } from '@/types/menuTypes'

const verticalMenuData: VerticalMenuDataType[] = [
	{
		label: 'Dashboards',
		icon: 'tabler-smart-home',
		children: [
			{ label: 'Analytics', icon: 'tabler-circle', href: '/dashboard' }
		]
	}
]

export default verticalMenuData
