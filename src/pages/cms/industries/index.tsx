import IndustriesTable from 'src/views/cms/industries/IndustriesTable'

const IndustriesPage = () => {
  return <IndustriesTable />
}

IndustriesPage.acl = { action: 'read', subject: 'cms' }
IndustriesPage.authGuard = true

export default IndustriesPage
