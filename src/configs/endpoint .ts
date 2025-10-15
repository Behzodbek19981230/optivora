// Helper to normalize Next.js router query params (string | string[] | undefined)
const normalizeId = (id: string | number | string[] | null | undefined) => {
  if (Array.isArray(id)) return id[0]
  if (id === null || id === undefined) return ''
  return String(id)
}



const endpoints = {
  login: '/auth/token',
  logout: '/auth/logout',
  me: '/user-view',
  companyProfile: '/company-profile',
  companyProfileById: (id: string | number | string[] | null | undefined) => `/company-profile/${normalizeId(id)}`,
  companyProfileFields: '/company-profile/fields',
  country: '/country',
  district: '/district',
  districtById: (id: string | number | string[] | null | undefined) => `/district/${normalizeId(id)}`,

  countryById: (id: string | number | string[] | null | undefined) => `/country/${normalizeId(id)}`,
  countryFields: '/country/fields',



  // CMS resources
  industries: '/industry',
  industryById: (id: string | number | string[] | null | undefined) => `/industry/${normalizeId(id)}`,
  industryFields: '/industry/fields',

  equipmentCategories: '/equipment-category',
  equipmentCategoryById: (id: string | number | string[] | null | undefined) => `/equipment-category/${normalizeId(id)}`,

  services: '/service',
  serviceById: (id: string | number | string[] | null | undefined) => `/service/${normalizeId(id)}`,

  partners: '/partner',
  partnerById: (id: string | number | string[] | null | undefined) => `/partner/${normalizeId(id)}`,

  projects: '/project',
  projectById: (id: string | number | string[] | null | undefined) => `/project/${normalizeId(id)}`,
  projectDeliverables: '/project-deliverable',
  projectDeliverableById: (id: string | number | string[] | null | undefined) => `/project-deliverable/${normalizeId(id)}`,
  projectImages: '/project-image',
  projectImageById: (id: string | number | string[] | null | undefined) => `/project-image/${normalizeId(id)}`,

  stats: '/stats',
  statById: (id: string | number | string[] | null | undefined) => `/stats/${normalizeId(id)}`,

  faqs: '/faq',
  faqById: (id: string | number | string[] | null | undefined) => `/faq/${normalizeId(id)}`,

  inquiries: '/inquiry',
  inquiryById: (id: string | number | string[] | null | undefined) => `/inquiry/${normalizeId(id)}`,

  downloads: '/download',
  downloadById: (id: string | number | string[] | null | undefined) => `/download/${normalizeId(id)}`,

  news: '/news',
  newsById: (id: string | number | string[] | null | undefined) => `/news/${normalizeId(id)}`,

  testimonials: '/testimonial',
  testimonialById: (id: string | number | string[] | null | undefined) => `/testimonial/${normalizeId(id)}`,

  // Missing keys referenced in code
  applicationApprovedByID: (id: string | number | string[] | null | undefined) => `/application-approved/${normalizeId(id)}`,
  limitData: '/limit-data'

}

export default endpoints
