import PartnerTable from 'src/views/cms/partners/PartnerTable'

const PartnersPage = () => <PartnerTable />

PartnersPage.acl = { action: 'read', subject: 'cms' }
PartnersPage.authGuard = true

export default PartnersPage
