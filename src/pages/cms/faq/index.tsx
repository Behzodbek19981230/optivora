import FaqTable from 'src/views/cms/faq/FaqTable'

const FaqListPage = () => <FaqTable />

FaqListPage.acl = { action: 'read', subject: 'cms' }
FaqListPage.authGuard = true

export default FaqListPage
