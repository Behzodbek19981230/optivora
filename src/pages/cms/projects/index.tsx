import ProjectTable from 'src/views/cms/projects/ProjectTable'

const ProjectsPage = () => <ProjectTable />

ProjectsPage.acl = { action: 'read', subject: 'cms' }
ProjectsPage.authGuard = true

export default ProjectsPage
