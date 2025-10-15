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
      title: 'Employees',
      icon: 'tabler:user',
      path: '/employee/list'
    },
    {
      title: 'Buyers',
      icon: 'tabler:shopping-cart',
      path: '/buyer/list'
    },
    {
      title: 'Merchants',
      icon: 'tabler:building-store',
      path: '/merchants'
    },
    {
      title: 'Agreement',
      icon: 'tabler:files',
      path: '/agreement'
    },
    {
      title: 'billing',
      icon: 'tabler:receipt',
      path: '/billing'
    }
  ]
}

export default navigation
