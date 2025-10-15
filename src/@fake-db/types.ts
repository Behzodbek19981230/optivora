// Minimal type stubs to satisfy TS for demo/example pages that import from 'src/@fake-db/*'.
// These can be expanded or removed once real data replaces the demos.

export type CardStatsType = {
  title: string
  stats: string | number
  trendNumber?: string
  trend?: 'positive' | 'negative'
}

export type ProjectsTabType = {
  id: number
  title: string
  tasks: number
  hours: number
  progressValue: number
}

export type TeamsTabType = {
  id: number
  name: string
  avatar?: string
  members: number
}

export type ProfileHeaderType = {
  fullName: string
  location?: string
  designation?: string
  avatar?: string
}

export type ProfileTabType = 'about' | 'connections' | 'teams' | 'projects'

export type ProfileTeamsType = { name: string; members: number }
export type ProfileTabCommonType = { title: string; subtitle?: string }
export type ProjectTableRowType = { id: number; name: string; leader: string; team: string; status: string }
export type DataGridRowType = { id: number; name: string; age?: number; status?: string }
export type FaqType = { id: number; question: string; answer: string; category?: string }
export type HelpCenterCategoriesType = { title: string; icon?: string; subtitle?: string }
export type HelpCenterArticlesOverviewType = { title: string; img?: string; subtitle?: string }
export type HelpCenterSubcategoriesType = { title: string; icon?: string; articles: number }
export type HelpCenterSubcategoryArticlesType = { title: string; subtitle?: string; img?: string }

export type UserProfileActiveTab = 'profile' | 'teams' | 'projects' | 'connections'
