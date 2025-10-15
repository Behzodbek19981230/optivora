// Types for CMS data models based on provided Django models
// Assumptions:
// - BaseModel provides id, created_at, updated_at (ISO8601 strings)
// - File/Image fields are served as URL strings in responses and accept File|string on write
// - ManyToMany/ForeignKey relations are represented by numeric IDs in write payloads

export type ISODateString = string

export interface BaseEntity {
  id: number
  created_at?: ISODateString
  updated_at?: ISODateString
}

// Shared helpers
export type FileLike = File | string | null
export type ID = number

// CompanyProfile
export interface CompanyProfile extends BaseEntity {
  name: string
  logo: string | null
  email: string | null
  phone: string | null
  address: string | null
  business_hours: string | null
}

export type CompanyProfileCreate = Omit<CompanyProfile, 'id' | 'created_at' | 'updated_at' | 'logo'> & {
  logo?: FileLike
}
export type CompanyProfileUpdate = Partial<CompanyProfileCreate>

// Industry
export interface Industry extends BaseEntity {
  name: string
  name_en: string
  name_uz: string
  name_ru: string
  slug: string
  short_description?: string | null
  description?: string | null
  icon?: string | null
  order_index: number
}

export type IndustryCreate = Omit<Industry, 'id' | 'created_at' | 'updated_at'>
export type IndustryUpdate = Partial<IndustryCreate>

// EquipmentCategory
export interface EquipmentCategory extends BaseEntity {
  name_en: string
  name_uz: string
  name_ru: string
  slug: string
  description: string
  description_en: string
  description_uz: string
  description_ru: string
  order_index: number
}
export type EquipmentCategoryCreate = Omit<EquipmentCategory, 'id' | 'created_at' | 'updated_at'>
export type EquipmentCategoryUpdate = Partial<EquipmentCategoryCreate>

// Service
export interface Service extends BaseEntity {
  name: string
  name_en: string
  name_uz: string
  name_ru: string
  slug: string
  short_description: string
  short_description_en: string
  short_description_uz: string
  short_description_ru: string
  description: string
  description_en: string
  description_uz: string
  description_ru: string
  icon?: string | null
  industries: ID[]
  equipment_categories: ID[]
  order_index: number
}
export type ServiceCreate = Omit<Service, 'id' | 'created_at' | 'updated_at' | 'icon'> & {
  icon?: FileLike
}
export type ServiceUpdate = Partial<ServiceCreate>

// Partner
export const PartnerCategory = {
  POWER_CONTROL: 'power_control',
  ROTATING: 'rotating',
  SPECIALIZED: 'specialized',
  SAFETY_MONITORING: 'safety_monitoring',
  ELECTRICAL_POWER: 'electrical_power'
} as const
export type PartnerCategory = typeof PartnerCategory[keyof typeof PartnerCategory]

export interface Partner extends BaseEntity {
  name: string
  name_en: string
  name_uz: string
  name_ru: string
  logo: string
  website: string
  description: string
  description_en: string
  description_uz: string
  description_ru: string
  industries: ID[]
  equipment_categories: ID[]
  order_index: number
}
export type PartnerCreate = Omit<Partner, 'id' | 'created_at' | 'updated_at' | 'logo'> & {
  logo?: FileLike
}
export type PartnerUpdate = Partial<PartnerCreate>

// Project
export interface Partner extends BaseEntity {
  name: string
  name_en: string
  name_uz: string
  name_ru: string
  category: PartnerCategory
  logo: string
  website: string
  description: string
  description_en: string
  description_uz: string
  description_ru: string
  industries: ID[]
  equipment_categories: ID[]
  order_index: number

  is_featured: boolean

  partners: ID[]
  country: number
  region: number
  district: number
}

export interface Project extends BaseEntity {
  title: string
  title_en: string
  title_uz: string
  title_ru: string
  year: number
  slug: string
  sector: string
  client?: string | null
  location?: string | null
  start_date?: ISODateString | null
  end_date?: ISODateString | null
  description: string
  description_en: string
  description_uz: string
  description_ru: string
  featured_image?: string | null
  industries: ID[]
  equipment_categories: ID[]
  services: ID[]
  partners: ID[]
  order_index: number
  is_featured: boolean
}

export type ProjectCreate = Omit<Project, 'id' | 'created_at' | 'updated_at' | 'featured_image'> & {
  featured_image?: FileLike
}
export type ProjectUpdate = Partial<ProjectCreate>

// ProjectDeliverable
export interface ProjectDeliverable extends BaseEntity {
  project: ID
  name: string
}
export type ProjectDeliverableCreate = Omit<ProjectDeliverable, 'id' | 'created_at' | 'updated_at'>
export type ProjectDeliverableUpdate = Partial<ProjectDeliverableCreate>

// ProjectImage
export interface ProjectImage extends BaseEntity {
  project: ID
  image: string
  caption?: string | null
  order_index: number
}
export type ProjectImageCreate = Omit<ProjectImage, 'id' | 'created_at' | 'updated_at' | 'image'> & {
  image: FileLike
}
export type ProjectImageUpdate = Partial<ProjectImageCreate>

// StatItem
export interface StatItem extends BaseEntity {
  label: string
  value: string
  order_index: number
}
export type StatItemCreate = Omit<StatItem, 'id' | 'created_at' | 'updated_at'>
export type StatItemUpdate = Partial<StatItemCreate>

// FAQ
export interface FAQ extends BaseEntity {
  question: string
  answer: string
  order_index: number
}
export type FAQCreate = Omit<FAQ, 'id' | 'created_at' | 'updated_at'>
export type FAQUpdate = Partial<FAQCreate>

// Inquiry
export const InquiryType = {
  EQUIPMENT: 'equipment',
  TECHNICAL: 'technical',
  QUOTE: 'quotation',
  PARTNERSHIP: 'partnership',
  GENERAL: 'general'
} as const
export type InquiryType = typeof InquiryType[keyof typeof InquiryType]

export const ProjectSector = {
  POWER: 'power_generation',
  WATER: 'water_wastewater',
  OILGAS: 'oil_gas',
  INDUSTRIAL: 'industrial_manufacturing',
  RENEWABLE: 'renewable_energy',
  OTHER: 'other'
} as const
export type ProjectSector = typeof ProjectSector[keyof typeof ProjectSector]

export const InquiryStatus = {
  NEW: 'new',
  IN_PROGRESS: 'in_progress',
  CLOSED: 'closed'
} as const
export type InquiryStatus = typeof InquiryStatus[keyof typeof InquiryStatus]

export interface Inquiry extends BaseEntity {
  full_name: string
  company: string
  email: string
  phone?: string | null
  inquiry_type: InquiryType
  project_sector?: ProjectSector | null
  message: string
  attachment?: string | null
  consent_updates: boolean
  status: InquiryStatus
  ip_address?: string | null
  user_agent?: string | null
}
export type InquiryCreate = Omit<Inquiry, 'id' | 'created_at' | 'updated_at' | 'attachment' | 'status' | 'ip_address' | 'user_agent'> & {
  attachment?: FileLike
}
export type InquiryUpdate = Partial<Omit<InquiryCreate, 'status'>> & { status?: InquiryStatus }

// DownloadableFile
export const FileCategory = {
  BROCHURE: 'brochure',
  CATALOG: 'catalog',
  DATASHEET: 'datasheet',
  CASE_STUDY: 'case_study',
  OTHER: 'other'
} as const
export type FileCategory = typeof FileCategory[keyof typeof FileCategory]

export interface DownloadableFile extends BaseEntity {
  title: string
  category: FileCategory
  description?: string | null
  file: string
  is_public: boolean
}
export type DownloadableFileCreate = Omit<DownloadableFile, 'id' | 'created_at' | 'updated_at' | 'file'> & {
  file: FileLike
}
export type DownloadableFileUpdate = Partial<DownloadableFileCreate>

// NewsPost
export const NewsStatus = {
  DRAFT: 'draft',
  PUBLISHED: 'published'
} as const
export type NewsStatus = typeof NewsStatus[keyof typeof NewsStatus]

export const NewsCategory = {
  PROJECT_UPDATES: 'project_updates',
  INDUSTRY_NEWS: 'industry_news',
  COMPANY: 'company_announcements'
} as const
export type NewsCategory = typeof NewsCategory[keyof typeof NewsCategory]

export interface NewsPost extends BaseEntity {
  title: string
  slug: string
  category: NewsCategory
  excerpt?: string | null
  body: string
  cover_image?: string | null
  status: NewsStatus
  published_at?: ISODateString | null
}
export type NewsPostCreate = Omit<NewsPost, 'id' | 'created_at' | 'updated_at' | 'cover_image' | 'published_at'> & {
  cover_image?: FileLike
  published_at?: ISODateString | null
}
export type NewsPostUpdate = Partial<NewsPostCreate>

// Testimonial
export interface Testimonial extends BaseEntity {
  author_name: string
  author_role?: string | null
  company?: string | null
  quote: string
  photo?: string | null
  is_featured: boolean
}
export type TestimonialCreate = Omit<Testimonial, 'id' | 'created_at' | 'updated_at' | 'photo'> & {
  photo?: FileLike
}
export type TestimonialUpdate = Partial<TestimonialCreate>

// Generic list response (paginate or plain array)
export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}
export type ListResponse<T> = T[] | PaginatedResponse<T>
