
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
      title: 'Yangiliklar',
      icon: 'tabler:news',
      path: '/cms/news'
    },
    {
      title: 'FAQ',
      icon: 'tabler:help-circle',
      path: '/cms/faq'
    },
    {
      title: 'Biz haqimizda',
      icon: 'tabler:info-circle',
      path: '/cms/company-profile'
    },
    {
      title: 'Murojaatlar',
      icon: 'tabler:mail',
      path: '/cms/inquiry'
    },
    {
      title: 'Hududlar',
      icon: 'tabler:map-pin',
      path: '/cms/locations'
    }
  ]
}

export default navigation
