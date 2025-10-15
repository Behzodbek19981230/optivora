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
          title: 'Services',
          icon: 'tabler:tools',
          path: '/cms/services'
        }
      ]
    }
  ]
}

export default navigation
