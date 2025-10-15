// Helper to normalize Next.js router query params (string | string[] | undefined)
const normalizeId = (id: string | number | string[] | null | undefined) => {
  if (Array.isArray(id)) return id[0]
  if (id === null || id === undefined) return ''
  return String(id)
}

const idPath = (base: string, id: string | number | string[] | null | undefined) => {
  const v = normalizeId(id)
  return v ? `${base}/${v}` : base
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

  // Legacy/business endpoints used across the app (placeholders; verify with backend)
  applicationApprovedFilter: '/application-approved/filter',
  merchant: '/merchant',
  branches: '/branches',
  branch: '/branch',
  branchesMerchant: '/merchant/branches',
  merchantClients: (id?: string | number | string[] | null) => idPath('/merchant-clients', id),
  merchantClientsFilter: '/merchant-clients/filter',
  merchantUsers: (id?: string | number | string[] | null) => idPath('/merchant', id) + '/users',
  merchantUsersId: (id?: string | number | string[] | null) => idPath('/merchant-users', id),
  resetPasswordMerchant: '/merchant/reset-password',

  usersStaff: '/users/staff',
  resetPasswordStaff: '/users/staff/reset-password',

  banks: '/banks',
  bankBraches: '/bank-branches',
  bankBrachById: (id?: string | number | string[] | null) => idPath('/bank-branches', id),
  categories: '/categories',
  region: '/region',
  rate: '/rate',
  period: '/period',
  periodRate: '/period-rate',
  getBrokerKey: (id?: string | number | string[] | null) => idPath('/get-broker-key', id),

  // Applications and workflow
  applicationMerchant: '/application/merchant',
  applicationVerify: '/application/verify',
  applicationOtp: '/application/otp',
  resendOtp: (id?: string | number | string[] | null) => idPath('/resend-otp', id),
  resendOtpApplication: (id?: string | number | string[] | null) => `${idPath('/application', id)}/resend-otp`,
  applicationDecide: '/application/decide',
  resendContract: (id?: string | number | string[] | null) => `${idPath('/application', id)}/resend-contract`,
  applicationRejectByID: (id?: string | number | string[] | null) => idPath('/application/reject', id),
  applicationById: (id?: string | number | string[] | null) => idPath('/applications', id),
  applicationGetById: (id?: string | number | string[] | null) => idPath('/application', id),
  applicationInfoByID: (id?: string | number | string[] | null) => idPath('/application/info', id),
  applicationByersByID: (id?: string | number | string[] | null) => idPath('/application/buyers', id),
  userApplicationList: (id?: string | number | string[] | null) => idPath('/user-application-list', id),

  // Products and schedules
  productPost: '/product',
  productDelete: (id?: string | number | string[] | null) => idPath('/product', id),
  productGetByID: (id?: string | number | string[] | null) => idPath('/product', id),
  schedule: (id?: string | number | string[] | null) => idPath('/schedule', id),

  // Directory resources
  bincodes: '/bincodes',
  bincodeById: (id?: string | number | string[] | null) => idPath('/bincodes', id),

  // Reports
  reportBilling: '/report/billing',
  reportsExpense: '/reports/expense',
  reportByRegions: '/report/by-regions',
  reportByMerchants: '/report/by-merchants',
  reportByStatus: '/report/by-status',
  reportBnpl: '/report/bnpl',
  reportBriefcase: '/report/briefcase',
  reportByExitensionBnpl: '/report/extension-to-bnpl',

  // Dashboard/statistics
  getStatisticMerchant: '/merchant/statistics',

  // CMS resources
  industries: '/industries',
  industryById: (id: string | number | string[] | null | undefined) => `/industries/${normalizeId(id)}`,
  industryFields: '/industries/fields',

  equipmentCategories: '/equipment-categories',
  equipmentCategoryById: (id: string | number | string[] | null | undefined) => `/equipment-categories/${normalizeId(id)}`,

  services: '/services',
  serviceById: (id: string | number | string[] | null | undefined) => `/services/${normalizeId(id)}`,

  partners: '/partners',
  partnerById: (id: string | number | string[] | null | undefined) => `/partners/${normalizeId(id)}`,

  projects: '/projects',
  projectById: (id: string | number | string[] | null | undefined) => `/projects/${normalizeId(id)}`,
  projectDeliverables: '/project-deliverables',
  projectDeliverableById: (id: string | number | string[] | null | undefined) => `/project-deliverables/${normalizeId(id)}`,
  projectImages: '/project-images',
  projectImageById: (id: string | number | string[] | null | undefined) => `/project-images/${normalizeId(id)}`,

  stats: '/stats',
  statById: (id: string | number | string[] | null | undefined) => `/stats/${normalizeId(id)}`,

  faqs: '/faqs',
  faqById: (id: string | number | string[] | null | undefined) => `/faqs/${normalizeId(id)}`,

  inquiries: '/inquiries',
  inquiryById: (id: string | number | string[] | null | undefined) => `/inquiries/${normalizeId(id)}`,

  downloads: '/downloads',
  downloadById: (id: string | number | string[] | null | undefined) => `/downloads/${normalizeId(id)}`,

  news: '/news',
  newsById: (id: string | number | string[] | null | undefined) => `/news/${normalizeId(id)}`,

  testimonials: '/testimonials',
  testimonialById: (id: string | number | string[] | null | undefined) => `/testimonials/${normalizeId(id)}`,

  // Missing keys referenced in code
  applicationApprovedByID: (id: string | number | string[] | null | undefined) => `/application-approved/${normalizeId(id)}`,
  limitData: '/limit-data'

}

export default endpoints
