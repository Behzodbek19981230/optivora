
import ServiceTable from 'src/views/cms/services/ServiceTable'

const ServicesPage = () => <ServiceTable />

ServicesPage.acl = { action: 'read', subject: 'cms' }
ServicesPage.authGuard = true

export default ServicesPage
