/**
 *  Set Home URL based on User Roles
 */
const getHomeRoute = (role: string) => {
  switch (role) {
    case 'manager':
      return '/buyer/list'
    case 'superuser':
      return '/employee/list/activated'
    case 'accountant':
      return '/reports'
    case 'call':
      return '/buyer/list'
    case 'merchant':
      return '/application'
    case 'branch':
      return '/application'
    case 'client':
      return '/my-application'
    default:
      return '/employee/list/activated'
  }
  // if (role === 'client') return '/acl'
  // else return '/dashboards/analytics'
}

export default getHomeRoute
