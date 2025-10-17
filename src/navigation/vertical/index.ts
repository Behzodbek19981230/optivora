
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
      title: 'Biz haqimizda',
      icon: 'tabler:info-circle',
      path: '/cms/company-profile'
    },
    {
      title: 'Services',
      icon: 'tabler:tools',
      path: '/cms/services'
    },
        {
      title: 'Sanoat tarmoqlari',
      icon: 'tabler:building-factory',
      path: '/cms/industries'
    },
    {
      title: 'Loyihalar',
      icon: 'tabler:building-arch',
      path: '/cms/projects'
    },
     {
      title: 'Hamkorlar',
      icon: 'tabler:users-group',
      path: '/cms/partners'
    },
    

   
    
   
    
    // {
    //   title: 'Yangiliklar',
    //   icon: 'tabler:news',
    //   path: '/cms/news'
    // },
    {
      title: 'FAQ',
      icon: 'tabler:help-circle',
      path: '/cms/faq'
    },
    
    {
      title: 'Murojaatlar',
      icon: 'tabler:mail',
      path: '/cms/inquiry'
    },
    {
      title: 'Our Work',
      icon: 'tabler:star',
      path: '/cms/our-work'
    },
     {
      title: 'Jihoz kategoriyalari',
      icon: 'tabler:category',
      path: '/cms/equipment-category'
    },

    {
      title: 'Hududlar',
      icon: 'tabler:map-pin',
      path: '/cms/locations'
    },
    {
      title: 'Foydalanuvchilar',
      icon: 'tabler:user',
      path: '/cms/users'
    },
    
  ]
}

export default navigation
