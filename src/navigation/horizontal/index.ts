// ** Type import
import { HorizontalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): HorizontalNavItemsType => {
  return [
    {
      title: 'Dashboard',
      icon: 'tabler:dashboard',
      path: '/dashboard'
    },
    
   
    {
      title: 'CMS',
      icon: 'tabler:folder',
      children: [
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
        },
        {
          title: 'Hamkorlar',
          icon: 'tabler:users-group',
          path: '/cms/partners'
        },
        {
          title: 'Loyihalar',
          icon: 'tabler:building-arch',
          path: '/cms/projects'
        },
        {
          title: 'Hududlar',
          icon: 'tabler:map-pin',
          path: '/cms/locations'
        }
      ]
    }
  ]
}

export default navigation
