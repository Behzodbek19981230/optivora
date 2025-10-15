// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Dashboard',
      icon: 'tabler:dashboard',
      path: '/dashboard'
    },
  
    {
      sectionTitle: 'CMS'
    },
    {
      title: 'Industries',
      icon: 'tabler:category',
      path: '/cms/industries'
    },
    {
      title: 'Jihoz kategoriyalari',
      icon: 'tabler:category',
      path: '/cms/equipment-category'
    },
    {
      title: 'Services',
      icon: 'tabler:tools',
      path: '/cms/services'
    }
  ]
}

export default navigation
